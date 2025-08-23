/**
 * Browser-side XLSX parsing utilities
 * Used for preview and validation before upload
 */

let XLSX: any = null

// Dynamically import xlsx if available
async function getXLSX() {
  if (XLSX) return XLSX

  try {
    XLSX = await import('xlsx')
    return XLSX
  } catch (error) {
    console.warn('XLSX library not available, falling back to CSV handling')
    return null
  }
}

/**
 * Read headers from the first sheet of an Excel file
 */
export async function readWorkbookHeaders(file: File): Promise<string[]> {
  const xlsx = await getXLSX()
  if (!xlsx) {
    throw new Error('XLSX parsing not available - please use CSV format')
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = xlsx.read(arrayBuffer, { type: 'array' })

    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      throw new Error('No sheets found in workbook')
    }

    const worksheet = workbook.Sheets[firstSheetName]
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

    if (jsonData.length === 0) {
      return []
    }

    // First row should contain headers
    const headers = jsonData[0] as string[]
    return headers.filter(header => header && typeof header === 'string')
  } catch (error) {
    console.error('Error reading Excel headers:', error)
    throw new Error(`Failed to read Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Read a limited number of rows for preview
 */
export async function readRows(file: File, limit = 10): Promise<Record<string, any>[]> {
  const xlsx = await getXLSX()
  if (!xlsx) {
    throw new Error('XLSX parsing not available - please use CSV format')
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = xlsx.read(arrayBuffer, { type: 'array' })

    const firstSheetName = workbook.SheetNames[0]
    if (!firstSheetName) {
      throw new Error('No sheets found in workbook')
    }

    const worksheet = workbook.Sheets[firstSheetName]
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { 
      header: 1,
      raw: false, // Convert numbers to strings for consistency
      defval: '' // Default value for empty cells
    })

    if (jsonData.length < 2) {
      return []
    }

    const headers = jsonData[0] as string[]
    const rows = jsonData.slice(1, Math.min(limit + 1, jsonData.length))

    return rows.map((row: any[]) => {
      const rowObject: Record<string, any> = {}
      headers.forEach((header, index) => {
        if (header && index < row.length) {
          rowObject[header] = row[index] || ''
        }
      })
      return rowObject
    })
  } catch (error) {
    console.error('Error reading Excel rows:', error)
    throw new Error(`Failed to read Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Check if a file appears to be an Excel file
 */
export function isExcelFile(file: File): boolean {
  const excelMimeTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  const excelExtensions = ['.xls', '.xlsx']

  return (
    excelMimeTypes.includes(file.type) ||
    excelExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  )
}

/**
 * Parse CSV content from a file
 */
export async function parseCSV(file: File): Promise<{
  headers: string[]
  rows: Record<string, any>[]
}> {
  const text = await file.text()
  const lines = text.split('\n').filter(line => line.trim())

  if (lines.length === 0) {
    return { headers: [], rows: [] }
  }

  // Simple CSV parsing - for production, consider using a proper CSV parser
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const row: Record<string, any> = {}

    headers.forEach((header, index) => {
      row[header] = index < values.length ? values[index] : ''
    })

    return row
  })

  return { headers, rows }
}