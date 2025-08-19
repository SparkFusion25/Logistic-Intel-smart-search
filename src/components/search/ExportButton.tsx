import { Download, FileText, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ExportButtonProps {
  data: any[]
  searchQuery: string
  filters: any
}

export function ExportButton({ data, searchQuery, filters }: ExportButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    // Get all unique keys from the data
    const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item))))
    
    // Create CSV header
    const header = allKeys.join(',')
    
    // Create CSV rows
    const rows = data.map(item => 
      allKeys.map(key => {
        const value = item[key]
        if (value === null || value === undefined) return ''
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return String(value)
      }).join(',')
    )
    
    const csvContent = [header, ...rows].join('\n')
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `revenue-vessel-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      searchQuery,
      filters,
      totalRecords: data.length,
      data
    }

    const jsonContent = JSON.stringify(exportData, null, 2)
    
    // Download JSON
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `revenue-vessel-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <Table className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}