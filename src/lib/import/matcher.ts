import { resolveAlias } from './aliases'
import { CanonicalRow, CanonicalKeys, getFieldType } from './schema'

/**
 * Maps incoming file headers to canonical keys using the alias resolver
 */
export function mapHeadersToCanonical(headers: string[]): (CanonicalKeys | null)[] {
  return headers.map(header => {
    if (!header || typeof header !== 'string') {
      return null
    }
    
    return resolveAlias(header.trim())
  })
}

/**
 * Converts a raw row object to canonical format using header mapping
 */
export function toCanonicalRow(
  raw: Record<string, string | number | null | undefined>,
  headerMapping?: (CanonicalKeys | null)[]
): Partial<CanonicalRow> {
  const canonical: Partial<CanonicalRow> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    // Try to resolve the key directly first
    let canonicalKey = resolveAlias(key)

    // If we have a header mapping and this is a numeric index, use the mapping
    if (!canonicalKey && headerMapping) {
      const numericIndex = parseInt(key, 10)
      if (!isNaN(numericIndex) && numericIndex < headerMapping.length) {
        canonicalKey = headerMapping[numericIndex]
      }
    }

    if (canonicalKey) {
      const fieldType = getFieldType(canonicalKey)
      
      if (fieldType === 'number') {
        // Parse numeric fields
        const numericValue = parseNumericValue(value)
        if (numericValue !== null) {
          ;(canonical as any)[canonicalKey] = numericValue
        }
      } else {
        // String fields - ensure we have a string
        const stringValue = String(value).trim()
        if (stringValue) {
          ;(canonical as any)[canonicalKey] = stringValue
        }
      }
    }
  }

  return canonical
}

/**
 * Parse a value into a number, handling various formats
 */
function parseNumericValue(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') {
    return isNaN(value) ? null : value
  }

  if (typeof value !== 'string') {
    return null
  }

  // Remove common formatting characters
  const cleaned = value
    .trim()
    .replace(/[$,\s]/g, '') // Remove dollar signs, commas, spaces
    .replace(/[()]/g, '') // Remove parentheses

  if (cleaned === '' || cleaned === '-') {
    return null
  }

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

/**
 * Create a preview of how headers would map
 */
export function previewHeaderMapping(headers: string[]): Array<{
  original: string
  canonical: CanonicalKeys | null
  recognized: boolean
}> {
  return headers.map(header => ({
    original: header,
    canonical: resolveAlias(header),
    recognized: resolveAlias(header) !== null
  }))
}