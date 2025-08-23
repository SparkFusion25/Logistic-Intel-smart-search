// src/lib/importer.ts
import { supabase } from '@/lib/supabaseClient'

export interface ImportJob {
  id: string
  org_id: string
  user_id: string
  source_bucket: string
  object_path: string
  status: 'queued' | 'running' | 'success' | 'error'
  total_rows: number
  success_rows: number
  error_rows: number
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export interface ImportJobError {
  id: string
  job_id: string
  row_number: number | null
  raw_data: any
  error_code: string | null
  error_detail: string
  created_at: string
}

/**
 * Upload a file and create an import job
 */
export async function importFile(file: File): Promise<{ jobId: string }> {
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Generate object path
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const timestamp = now.getTime()

  const objectPath = `org/${user.id}/${year}/${month}/${day}/${timestamp}-${file.name}`

  try {
    // 1. Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('imports')
      .upload(objectPath, file, { upsert: true })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // 2. Create import job record
    const { data: job, error: jobError } = await supabase
      .from('import_jobs')
      .insert({
        org_id: user.id, // Using user ID as org ID for now
        user_id: user.id,
        source_bucket: 'imports',
        object_path: objectPath,
        status: 'queued',
        total_rows: 0,
        success_rows: 0,
        error_rows: 0
      })
      .select()
      .single()

    if (jobError || !job) {
      throw new Error(`Failed to create job: ${jobError?.message || 'Unknown error'}`)
    }

    // 3. Trigger edge function
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('No access token available')
    }

    const edgeResponse = await fetch(`${supabase.supabaseUrl}/functions/v1/import-shipments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_id: job.id,
        bucket: 'imports',
        object_path: objectPath
      })
    })

    if (!edgeResponse.ok) {
      const errorText = await edgeResponse.text()
      console.error('Edge function error:', errorText)
      
      // Update job status to error
      await supabase
        .from('import_jobs')
        .update({ status: 'error' })
        .eq('id', job.id)
      
      throw new Error(`Processing failed: ${errorText}`)
    }

    return { jobId: job.id }
  } catch (error) {
    // Clean up uploaded file if job creation failed
    try {
      await supabase.storage.from('imports').remove([objectPath])
    } catch (cleanupError) {
      console.warn('Failed to clean up uploaded file:', cleanupError)
    }

    throw error
  }
}

/**
 * Get the status of an import job
 */
export async function getJobStatus(jobId: string): Promise<ImportJob> {
  const { data: job, error } = await supabase
    .from('import_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) {
    throw new Error(`Failed to get job status: ${error.message}`)
  }

  if (!job) {
    throw new Error('Job not found')
  }

  return job as ImportJob
}

/**
 * Get errors for a specific job
 */
export async function getJobErrors(
  jobId: string,
  limit = 50,
  offset = 0
): Promise<ImportJobError[]> {
  const { data: errors, error } = await supabase
    .from('import_job_errors')
    .select('*')
    .eq('job_id', jobId)
    .order('row_number', { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to get job errors: ${error.message}`)
  }

  return (errors || []) as ImportJobError[]
}

/**
 * List recent import jobs for current user
 */
export async function listJobs(limit = 20): Promise<ImportJob[]> {
  const { data: jobs, error } = await supabase
    .from('import_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to list jobs: ${error.message}`)
  }

  return (jobs || []) as ImportJob[]
}

/**
 * Subscribe to job status changes
 */
export function subscribeToJob(
  jobId: string,
  callback: (job: ImportJob) => void
): { unsubscribe: () => void } {
  const subscription = supabase
    .channel(`job-${jobId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'import_jobs',
        filter: `id=eq.${jobId}`
      },
      (payload) => {
        callback(payload.new as ImportJob)
      }
    )
    .subscribe()

  return {
    unsubscribe: () => {
      subscription.unsubscribe()
    }
  }
}

/**
 * Delete an import job and its associated data
 */
export async function deleteJob(jobId: string): Promise<void> {
  // First get the job to find the file path
  const job = await getJobStatus(jobId)

  // Delete errors first (foreign key constraint)
  await supabase
    .from('import_job_errors')
    .delete()
    .eq('job_id', jobId)

  // Delete the job record
  const { error: jobError } = await supabase
    .from('import_jobs')
    .delete()
    .eq('id', jobId)

  if (jobError) {
    throw new Error(`Failed to delete job: ${jobError.message}`)
  }

  // Clean up the file
  try {
    await supabase.storage
      .from('imports')
      .remove([job.object_path])
  } catch (storageError) {
    console.warn('Failed to delete file from storage:', storageError)
  }
}