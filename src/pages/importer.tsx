import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  X,
  Eye,
  Database
} from 'lucide-react';
import { importer, ImportJob, ImportJobError } from '@/lib/importer';
import { formatDate, formatNumber } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
  uploading: boolean;
  error?: string;
}

function FileUpload({ onFileSelect, uploading, error }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}
          ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-primary/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {uploading ? (
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {uploading ? 'Processing...' : 'Upload Data Files'}
            </h3>
            <p className="text-muted-foreground max-w-md">
              Drag and drop your CSV, Excel, or ZIP files here, or click to browse.
              Files will be automatically processed into unified shipments.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="bg-muted px-2 py-1 rounded">.csv</span>
            <span className="bg-muted px-2 py-1 rounded">.xlsx</span>
            <span className="bg-muted px-2 py-1 rounded">.xls</span>
            <span className="bg-muted px-2 py-1 rounded">.zip</span>
          </div>

          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {uploading ? 'Processing...' : 'Choose Files'}
          </Button>

          <input
            id="file-input"
            type="file"
            multiple
            accept=".csv,.xlsx,.xls,.zip"
            className="hidden"
            onChange={handleFileInput}
            disabled={uploading}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
        <p><strong>How it works:</strong></p>
        <ul className="mt-1 space-y-1">
          <li>• Files are uploaded to secure cloud storage</li>
          <li>• Data is automatically parsed and validated</li>
          <li>• Column headers are intelligently mapped to our schema</li>
          <li>• Results are inserted into the unified shipments database</li>
          <li>• Detailed error reports are provided for any issues</li>
        </ul>
      </div>
    </div>
  );
}

interface JobStatusProps {
  job: ImportJob;
  onRefresh: () => void;
  onViewErrors: (jobId: string) => void;
}

function JobStatus({ job, onRefresh, onViewErrors }: JobStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'queued': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'queued': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const progress = job.total_rows > 0 
    ? (job.success_rows / job.total_rows) * 100 
    : 0;

  const filename = job.object_path ? job.object_path.split('/').pop() : 'Unknown file';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">{filename}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${getStatusColor(job.status)} border-0`}>
              {getStatusIcon(job.status)}
              <span className="ml-1 capitalize">{job.status}</span>
            </Badge>
          </div>
        </div>
        <CardDescription>
          Created {formatDate(job.created_at)} • Path: {job.object_path}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {job.status === 'running' && job.total_rows > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing progress</span>
              <span>{formatNumber(job.success_rows)} / {formatNumber(job.total_rows)}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-lg text-foreground">
              {formatNumber(job.total_rows)}
            </div>
            <div className="text-muted-foreground">Total Rows</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-green-600">
              {formatNumber(job.success_rows)}
            </div>
            <div className="text-muted-foreground">Success</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-red-600">
              {formatNumber(job.error_rows)}
            </div>
            <div className="text-muted-foreground">Errors</div>
          </div>
        </div>

        {job.error_rows > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {job.error_rows} row(s) failed to process. 
              <Button 
                variant="link" 
                className="p-0 ml-1 h-auto text-red-700"
                onClick={() => onViewErrors(job.id)}
              >
                View error details
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {job.status === 'success' && job.success_rows > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully imported {job.success_rows} records into unified shipments table.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {job.finished_at && `Completed ${formatDate(job.finished_at)}`}
            {job.started_at && !job.finished_at && `Started ${formatDate(job.started_at)}`}
            {!job.started_at && 'Queued for processing'}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={job.status === 'running'}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            {job.error_rows > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewErrors(job.id)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Errors
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ErrorsModalProps {
  jobId: string;
  jobName: string;
  isOpen: boolean;
  onClose: () => void;
}

function ErrorsModal({ jobId, jobName, isOpen, onClose }: ErrorsModalProps) {
  const [errors, setErrors] = useState<ImportJobError[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      setLoading(true);
      importer.getJobErrors(jobId)
        .then(setErrors)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, jobId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Import Errors</h2>
              <p className="text-muted-foreground mt-1">{jobName}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading errors...</span>
            </div>
          ) : errors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>No errors found for this import!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium">{errors.length} error(s) found</span>
              </div>
              
              {errors.map((error, index) => (
                <div key={error.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      {error.row_number ? `Row ${error.row_number}` : `System Error ${index + 1}`}
                      {error.error_code && (
                        <Badge variant="outline" className="ml-2">
                          {error.error_code}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(error.created_at)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-red-600 mb-2">
                    {error.error_detail}
                  </div>
                  
                  {error.raw_data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View raw data that failed to import
                      </summary>
                      <pre className="mt-2 bg-muted p-2 rounded overflow-x-auto text-xs">
                        {JSON.stringify(error.raw_data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Importer() {
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [selectedErrorJob, setSelectedErrorJob] = useState<{ id: string; name: string } | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      const jobsList = await importer.listJobs();
      setJobs(jobsList);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setUploadError('Failed to load import history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    
    // Poll for job updates every 5 seconds if there are running jobs
    const interval = setInterval(() => {
      if (jobs.some(job => job.status === 'running' || job.status === 'queued')) {
        loadJobs();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loadJobs, jobs]);

  const handleFileSelect = async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadError('');
    setUploadProgress('');

    try {
      // Process files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        setUploadProgress(`Processing file ${i + 1} of ${files.length}: ${file.name}`);
        
        // Validate file
        const validation = importer.validateFile(file);
        if (!validation.valid) {
          throw new Error(`${file.name}: ${validation.error}`);
        }

        // Import file with progress tracking
        await importer.importFile(file, (stage, job) => {
          setUploadProgress(`${file.name}: ${stage}`);
          console.log(`${file.name}: ${stage}`, job);
        });
      }

      // Reload jobs list
      await loadJobs();
      setUploadProgress(`Successfully processed ${files.length} file(s)`);
      
      // Clear progress after a few seconds
      setTimeout(() => setUploadProgress(''), 3000);
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRefreshJob = async (jobId: string) => {
    try {
      const updatedJob = await importer.getJobStatus(jobId);
      if (updatedJob) {
        setJobs(prev => prev.map(job => 
          job.id === jobId ? updatedJob : job
        ));
      }
    } catch (error) {
      console.error('Failed to refresh job:', error);
    }
  };

  const handleViewErrors = (jobId: string, jobName: string) => {
    setSelectedErrorJob({ id: jobId, name: jobName });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading importer...</span>
        </div>
      </div>
    );
  }

  const runningJobs = jobs.filter(job => job.status === 'running' || job.status === 'queued');
  const completedJobs = jobs.filter(job => job.status === 'success' || job.status === 'error');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bulk Data Importer</h1>
        <p className="text-muted-foreground mt-2">
          Import CSV, Excel, or ZIP files containing shipment data. Files are automatically parsed and inserted into the unified shipments database.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Upload your data files to automatically process them into unified shipments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            onFileSelect={handleFileSelect}
            uploading={uploading}
            error={uploadError}
          />
          
          {uploadProgress && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-800">{uploadProgress}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active/Running Jobs */}
      {runningJobs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Processing ({runningJobs.length})
          </h2>
          <div className="space-y-4">
            {runningJobs.map((job) => (
              <JobStatus 
                key={job.id}
                job={job}
                onRefresh={() => handleRefreshJob(job.id)}
                onViewErrors={(jobId) => handleViewErrors(jobId, job.object_path)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5" />
            Import History ({completedJobs.length})
          </h2>
          <Button variant="outline" onClick={loadJobs} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No imports yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Upload your first data file to get started with bulk importing.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedJobs.map((job) => (
              <JobStatus 
                key={job.id}
                job={job}
                onRefresh={() => handleRefreshJob(job.id)}
                onViewErrors={(jobId) => handleViewErrors(jobId, job.object_path)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Errors Modal */}
      {selectedErrorJob && (
        <ErrorsModal
          jobId={selectedErrorJob.id}
          jobName={selectedErrorJob.name}
          isOpen={!!selectedErrorJob}
          onClose={() => setSelectedErrorJob(null)}
        />
      )}
    </div>
  );
}