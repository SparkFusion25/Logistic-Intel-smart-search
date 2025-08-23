import React from 'react'
import { ImportJob } from '@/lib/importer'

interface ImporterJobCardProps {
  job: ImportJob
  onViewErrors?: (jobId: string) => void
}

export function ImporterJobCard({ job, onViewErrors }: ImporterJobCardProps) {
  const getStatusColor = (status: ImportJob['status']) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: ImportJob['status']) => {
    switch (status) {
      case 'queued':
        return '⏳'
      case 'running':
        return '🔄'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '❓'
    }
  }

  const progressPercentage = job.total_rows > 0
    ? Math.round((job.success_rows / job.total_rows) * 100)
    : 0

  const fileName = job.object_path.split('/').pop() || 'Unknown file'
  const formattedDate = new Date(job.created_at).toLocaleString()

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate" title={fileName}>
            {fileName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {formattedDate}
          </p>
        </div>

        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
          <span className="mr-1">{getStatusIcon(job.status)}</span>
          {job.status.toUpperCase()}
        </div>
      </div>

      {/* Progress bar - only show if we have total rows */}
      {job.total_rows > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{job.total_rows.toLocaleString()}</div>
          <div className="text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">{job.success_rows.toLocaleString()}</div>
          <div className="text-gray-500">Success</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-red-600">{job.error_rows.toLocaleString()}</div>
          <div className="text-gray-500">Errors</div>
        </div>
      </div>

      {/* Actions */}
      {job.error_rows > 0 && onViewErrors && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewErrors(job.id)}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View {job.error_rows} Error{job.error_rows !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      {/* Timing info */}
      {(job.started_at || job.finished_at) && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {job.started_at && (
            <div>Started: {new Date(job.started_at).toLocaleString()}</div>
          )}
          {job.finished_at && (
            <div>Finished: {new Date(job.finished_at).toLocaleString()}</div>
          )}
          {job.started_at && job.finished_at && (
            <div className="mt-1">
              Duration: {Math.round((new Date(job.finished_at).getTime() - new Date(job.started_at).getTime()) / 1000)}s
            </div>
          )}
        </div>
      )}
    </div>
  )
}