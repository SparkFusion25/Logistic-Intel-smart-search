import * as XLSX from 'xlsx';

export interface ParseOptions {
  sheetName?: string;
  headerRow?: number;
  skipRows?: number;
  maxRows?: number;
}

export function parseXLSXFile(file: File, options: ParseOptions = {}): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the sheet name (first sheet if not specified)
        const sheetName = options.sheetName || workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error('No sheets found in the file');
        }
        
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        // Convert to JSON with headers from first row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // Return array of arrays first
          defval: '', // Default value for empty cells
          blankrows: false, // Skip blank rows
          range: options.skipRows ? options.skipRows : undefined
        }) as any[][];
        
        if (jsonData.length === 0) {
          throw new Error('No data found in the sheet');
        }
        
        // Extract headers from the specified row (default: first row)
        const headerRowIndex = (options.headerRow || 1) - 1;
        const headers = jsonData[headerRowIndex] as string[];
        
        if (!headers || headers.length === 0) {
          throw new Error('No headers found in the specified row');
        }
        
        // Convert data rows to objects
        const dataRows = jsonData.slice(headerRowIndex + 1);
        const result = dataRows
          .filter(row => row && row.some(cell => cell !== '')) // Filter empty rows
          .slice(0, options.maxRows) // Limit rows if specified
          .map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              if (header && header.trim()) {
                obj[header.trim()] = (row[index] || '').toString().trim();
              }
            });
            return obj;
          });
        
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse XLSX file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length === 0) {
          throw new Error('No data found in CSV file');
        }
        
        // Parse CSV with basic quote handling
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          
          result.push(current.trim());
          return result;
        };
        
        const headers = parseCSVLine(lines[0]);
        const rows = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        });
        
        resolve(rows);
      } catch (error) {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}