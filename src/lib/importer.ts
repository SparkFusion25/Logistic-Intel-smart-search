// src/lib/importer.ts
import { supabase } from './supabaseClient';

export type ImportStatus = 'queued' | 'running' | 'success' | 'error';

export interface ImportJob {
  id: string;
  org_id: string | null;
  user_id: string | null;
  source_bucket: string;
  object_path: string;
  status: ImportStatus;
  total_rows: number | null;
  success_rows: number | null;
  error_rows: number | null;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

function orgPrefix(orgId: string) {
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  return `org/${orgId}/${yyyy}/${mm}/${dd}`;
}

async function getSessionOrgId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not authenticated');
  // if you store org_id on user metadata, prefer that; else fallback to RPC
  const metaOrg = (user.user_metadata as any)?.org_id as string | undefined;
  if (metaOrg) return metaOrg;

  const { data, error: rpcErr } = await supabase.rpc('get_current_org_id');
  if (rpcErr || !data) throw new Error('Cannot resolve org_id');
  return data as string;
}

export const importer = {
  /**
   * Uploads a file to Storage, creates an import job, triggers the edge function.
   * Returns the created job.
   */
  async importFile(
    file: File,
    onProgress?: (stage: 'uploading' | 'queued' | 'triggered', job?: ImportJob) => void
  ): Promise<ImportJob> {
    const orgId = await getSessionOrgId();
    const bucket = 'imports';
    const path = `${orgPrefix(orgId)}/${Date.now()}-${file.name}`;

    onProgress?.('uploading');

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });
    if (upErr) throw upErr;

    // Create job row
    const insertPayload = {
      org_id: orgId,
      user_id: null, // filled by RLS default via auth.uid() if your policy sets it; otherwise populate here
      source_bucket: bucket,
      object_path: path,
      status: 'queued' as ImportStatus,
    };

    const { data: jobRows, error: insErr } = await supabase
      .from('import_jobs')
      .insert(insertPayload)
      .select()
      .limit(1);

    if (insErr) throw insErr;
    const job = jobRows![0] as ImportJob;

    onProgress?.('queued', job);

    // Trigger edge function
    const { data: triggerRes, error: fnErr } = await supabase.functions.invoke('import-shipments', {
      body: { job_id: job.id, bucket, object_path: path },
    });
    if (fnErr) throw fnErr;

    onProgress?.('triggered', job);
    return job;
  },

  /** Poll a job by id */
  async getJobStatus(jobId: string): Promise<ImportJob | null> {
    const { data, error } = await supabase
      .from('import_jobs')
      .select('*')
      .eq('id', jobId)
      .maybeSingle();

    if (error) throw error;
    return data as ImportJob | null;
  },

  /** List recent jobs for current org (most recent first) */
  async listJobs(limit = 25): Promise<ImportJob[]> {
    const { data, error } = await supabase
      .from('import_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as ImportJob[];
  },

  /** Fetch recent errors for a job */
  async getJobErrors(jobId: string, limit = 100) {
    const { data, error } = await supabase
      .from('import_job_errors')
      .select('id, row_number, error_code, error_detail, raw_data, created_at')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },
};