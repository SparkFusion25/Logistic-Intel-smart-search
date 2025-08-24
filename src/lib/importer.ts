import { supabase } from './supabaseClient';

export interface ImportJob {
  id: string;
  org_id?: string;
  user_id?: string;
  source_bucket: string;
  object_path: string;
  status: 'queued' | 'running' | 'success' | 'error';
  total_rows: number;
  success_rows: number;
  error_rows: number;
  started_at?: string;
  finished_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ImportJobError {
  id: string;
  job_id: string;
  row_number?: number;
  raw_data: any;
  error_code?: string;
  error_detail: string;
  created_at: string;
}

export class ImporterService {
  private static instance: ImporterService;
  
  static getInstance(): ImporterService {
    if (!ImporterService.instance) {
      ImporterService.instance = new ImporterService();
    }
    return ImporterService.instance;
  }

  /**
   * Get current organization ID for the authenticated user
   */
  async getCurrentOrgId(): Promise<string> {
    try {
      // Try RPC function first
      const { data: rpcData } = await supabase.rpc('get_current_org_id').single();
      if (rpcData) return rpcData;
    } catch (error) {
      console.warn('Could not get org_id from RPC, using user ID:', error);
    }
    
    // Fallback: use authenticated user's ID as org_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
  }

  /**
   * Upload file to Supabase Storage with correct path convention
   */
  async uploadFile(file: File): Promise<{ path: string; url: string }> {
    const orgId = await this.getCurrentOrgId();
    
    // Create storage path: org/{org_id}/{YYYY}/{MM}/{DD}/{timestamp}-{filename}
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = Date.now();
    
    const path = `org/${orgId}/${year}/${month}/${day}/${timestamp}-${file.name}`;

    console.log(`Uploading file to: imports/${path}`);

    const { data, error } = await supabase.storage
      .from('imports')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL (optional)
    const { data: urlData } = supabase.storage
      .from('imports')
      .getPublicUrl(path);

    console.log(`File uploaded successfully to: ${data.path}`);
    return {
      path: data.path,
      url: urlData.publicUrl
    };
  }

  /**
   * Create import job record in import_jobs table
   */
  async createImportJob(filename: string, filePath: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const orgId = await this.getCurrentOrgId();

    console.log('Creating import job:', { orgId, userId: user.id, filePath });

    const { data, error } = await supabase
      .from('import_jobs')
      .insert({
        org_id: orgId,
        user_id: user.id,
        source_bucket: 'imports',
        object_path: filePath,
        status: 'queued',
        total_rows: 0,
        success_rows: 0,
        error_rows: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create import job:', error);
      throw new Error(`Failed to create import job: ${error.message}`);
    }

    console.log('Import job created:', data.id);
    return data.id;
  }

  /**
   * Start processing job by calling Edge Function
   */
  async startProcessing(jobId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');

    console.log(`Starting processing for job: ${jobId}`);

    // Call the import-shipments edge function
    const response = await fetch('/functions/v1/import-shipments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: jobId,
        bucket: 'imports',
        object_path: '' // Will be fetched from job record
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Processing failed:', errorText);
      throw new Error(`Failed to start processing: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Processing failed');
    }

    console.log('Processing started successfully:', result);
  }

  /**
   * Get job status and details
   */
  async getJobStatus(jobId: string): Promise<ImportJob | null> {
    const { data, error } = await supabase
      .from('import_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Failed to get job status:', error);
      return null;
    }
    return data;
  }

  /**
   * Get job errors from import_job_errors table
   */
  async getJobErrors(jobId: string, limit = 100): Promise<ImportJobError[]> {
    const { data, error } = await supabase
      .from('import_job_errors')
      .select('*')
      .eq('job_id', jobId)
      .order('row_number', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Failed to get job errors:', error);
      return [];
    }
    return data || [];
  }

  /**
   * List import jobs for current user/org
   */
  async listJobs(limit = 50): Promise<ImportJob[]> {
    const { data, error } = await supabase
      .from('import_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to list jobs:', error);
      return [];
    }
    return data || [];
  }

  /**
   * Poll job status until completion
   */
  async pollJobStatus(
    jobId: string, 
    onUpdate?: (job: ImportJob) => void,
    intervalMs = 3000,
    maxAttempts = 100
  ): Promise<ImportJob> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const poll = async () => {
        try {
          attempts++;
          
          const job = await this.getJobStatus(jobId);
          if (!job) {
            reject(new Error('Job not found'));
            return;
          }

          onUpdate?.(job);

          // Check if job is complete
          if (job.status === 'success' || job.status === 'error') {
            resolve(job);
            return;
          }

          // Check for timeout
          if (attempts >= maxAttempts) {
            reject(new Error('Polling timeout'));
            return;
          }

          // Continue polling
          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Complete file import workflow
   */
  async importFile(
    file: File,
    onProgress?: (stage: string, job?: ImportJob) => void
  ): Promise<ImportJob> {
    try {
      onProgress?.('Validating file...');
      
      // 1. Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      onProgress?.('Uploading file...');
      
      // 2. Upload file to storage
      const { path } = await this.uploadFile(file);
      
      onProgress?.('Creating import job...');
      
      // 3. Create import job record
      const jobId = await this.createImportJob(file.name, path);
      
      onProgress?.('Starting processing...');
      
      // 4. Start processing
      await this.startProcessing(jobId);
      
      onProgress?.('Processing...', await this.getJobStatus(jobId));
      
      // 5. Poll until completion
      const finalJob = await this.pollJobStatus(jobId, (job) => {
        const progress = job.total_rows > 0 
          ? `(${job.success_rows}/${job.total_rows})` 
          : '';
        onProgress?.(`Processing ${progress}...`, job);
      });
      
      onProgress?.('Complete!', finalJob);
      return finalJob;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 100MB' };
    }

    // Check file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip'
    ];
    
    const allowedExtensions = ['.csv', '.xlsx', '.xls', '.zip'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      return { 
        valid: false, 
        error: 'File must be CSV, Excel (.xlsx, .xls), or ZIP format' 
      };
    }

    return { valid: true };
  }
}

export const importer = ImporterService.getInstance();