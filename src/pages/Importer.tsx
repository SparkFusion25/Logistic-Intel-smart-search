import React, { useState, useEffect, useRef } from 'react'
import { importFile, listJobs, getJobErrors, subscribeToJob, ImportJob, ImportJobError } from '@/lib/importer'
import { ImporterJobCard } from '@/components/ui/ImporterJobCard'
import { ErrorTable } from '@/components/ui/ErrorTable'
import { readWorkbookHeaders, isExcelFile, parseCSV } from '@/lib/import/xlsxParser'
import { previewHeaderMapping } from '@/lib/import/matcher'

export default function ImporterPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [jobs, setJobs] = useState<ImportJob[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [jobErrors, setJobErrors] = useState<ImportJobError[]>([])
  const [headerPreview, setHeaderPreview] = useState<Array<{
    original: string
    canonical: string | null
    recognized: boolean
  }>>([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(true)
  const [isLoadingErrors, setIsLoadingErrors] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const subscriptions = useRef<Map<string, { unsubscribe: () => void }>>(new Map())

  // Load jobs on mount
  useEffect(() => {
    loadJobs()
  }, [])

  // Clean up subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptions.current.forEach(sub => sub.unsubscribe())
      subscriptions.current.clear()
    }
  }, [])

  const loadJobs = async () => {
    try {
      setIsLoadingJobs(true)
      const jobList = await listJobs()
      setJobs(jobList)

      // Subscribe to active jobs
      jobList
        .filter(job => job.status === 'queued' || job.status === 'running')
        .forEach(job => {
          if (!subscriptions.current.has(job.id)) {
            const sub = subscribeToJob(job.id, (updatedJob) => {
              setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j))
            })
            subscriptions.current.set(job.id, sub)
          }
        })
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setIsLoadingJobs(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setHeaderPreview([])

    try {
      let headers: string[] = []

      if (isExcelFile(file)) {
        headers = await readWorkbookHeaders(file)
      } else {
        const { headers: csvHeaders } = await parseCSV(file)
        headers = csvHeaders
      }

      if (headers.length > 0) {
        const preview = previewHeaderMapping(headers)
        setHeaderPreview(preview)
      }
    } catch (error) {
      console.error('Error reading file headers:', error)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      const { jobId } = await importFile(selectedFile)
      
      // Refresh jobs list
      await loadJobs()
      
      // Subscribe to the new job
      const sub = subscribeToJob(jobId, (updatedJob) => {
        setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j))
      })
      subscriptions.current.set(jobId, sub)
      
      // Reset form
      setSelectedFile(null)
      setHeaderPreview([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewErrors = async (jobId: string) => {
    try {
      setIsLoadingErrors(true)
      setSelectedJobId(jobId)
      const errors = await getJobErrors(jobId)
      setJobErrors(errors)
    } catch (error) {
      console.error('Failed to load errors:', error)
      alert(`Failed to load errors: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoadingErrors(false)
    }
  }

  const handleCloseErrors = () => {
    setSelectedJobId(null)
    setJobErrors([])
  }

  const recognizedHeaders = headerPreview.filter(h => h.recognized).length
  const totalHeaders = headerPreview.length

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bulk Import</h1>

        {/* File Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>

          {/* Header Preview */}
          {headerPreview.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900 mb-3">
                Header Mapping Preview
                <span className="ml-2 text-sm text-gray-500">
                  ({recognizedHeaders}/{totalHeaders} headers recognized)
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {headerPreview.map((header, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded text-sm ${
                      header.recognized
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <span className="truncate mr-2" title={header.original}>
                      {header.original}
                    </span>
                    <span className="text-xs font-mono">
                      {header.canonical || '?'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Start Import'}
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Import History</h2>
          <button
            onClick={loadJobs}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        {isLoadingJobs ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-r-transparent rounded-full mb-2"></div>
            <div>Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-lg font-medium">No imports yet</div>
            <div className="text-sm">Upload a file to get started</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <ImporterJobCard
                key={job.id}
                job={job}
                onViewErrors={handleViewErrors}
              />
            ))}
          </div>
        )}
      </div>

      {/* Error Details Modal/Panel */}
      {selectedJobId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Import Errors
              </h3>
              <button
                onClick={handleCloseErrors}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {isLoadingErrors ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-r-transparent rounded-full mb-2"></div>
                  <div>Loading errors...</div>
                </div>
              ) : (
                <ErrorTable rows={jobErrors} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}