import React, { useState } from 'react'
import { ImportJobError } from '@/lib/importer'

interface ErrorTableProps {
  rows: ImportJobError[]
}

export function ErrorTable({ rows }: ErrorTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleExpanded = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const formatRawData = (rawData: any): string => {
    if (!rawData) return 'N/A'

    if (typeof rawData === 'string') {
      return rawData
    }

    try {
      return JSON.stringify(rawData, null, 2)
    } catch {
      return String(rawData)
    }
  }

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '…'
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🎉</div>
        <div className="text-lg font-medium">No errors found</div>
        <div className="text-sm">All rows were processed successfully</div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Row
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error Detail
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Raw Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((error) => {
              const rawDataString = formatRawData(error.raw_data)
              const isExpanded = expandedRow === error.id
              const shouldTruncate = rawDataString.length > 100

              return (
                <tr key={error.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {error.row_number || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {error.error_code ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {error.error_code}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="break-words">
                      {error.error_detail}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-md">
                    <div className="break-words">
                      {shouldTruncate && !isExpanded ? (
                        <>
                          <pre className="whitespace-pre-wrap font-mono text-xs">
                            {truncateText(rawDataString)}
                          </pre>
                          <button
                            onClick={() => toggleExpanded(error.id)}
                            className="mt-1 text-blue-600 hover:text-blue-800 text-xs underline"
                          >
                            Show more
                          </button>
                        </>
                      ) : (
                        <>
                          <pre className="whitespace-pre-wrap font-mono text-xs">
                            {rawDataString}
                          </pre>
                          {shouldTruncate && (
                            <button
                              onClick={() => toggleExpanded(error.id)}
                              className="mt-1 text-blue-600 hover:text-blue-800 text-xs underline"
                            >
                              Show less
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(error.created_at).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {rows.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {rows.length} error{rows.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}