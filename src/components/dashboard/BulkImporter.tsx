import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ImportResult {
  total: number;
  success: number;
  errors: string[];
}

export function BulkImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a CSV file');
    }
  };

  const parseCsvFile = (csvContent: string): any[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1);

    return rows.map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};

      headers.forEach((header, index) => {
        switch (header) {
          case 'company_name':
          case 'company':
            row.company_name = values[index] || null;
            break;
          case 'full_name':
          case 'name':
          case 'contact_name':
            row.full_name = values[index] || null;
            break;
          case 'title':
          case 'position':
            row.title = values[index] || null;
            break;
          case 'email':
            row.email = values[index] || null;
            break;
          case 'phone':
            row.phone = values[index] || null;
            break;
          case 'city':
            row.city = values[index] || null;
            break;
          case 'country':
            row.country = values[index] || null;
            break;
          case 'linkedin':
            row.linkedin = values[index] || null;
            break;
        }
      });

      row.source = 'bulk_import';
      return row;
    }).filter(row => row.company_name || row.full_name || row.email);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      // Read file content
      const fileContent = await file.text();
      const contacts = parseCsvFile(fileContent);

      if (contacts.length === 0) {
        throw new Error('No valid contacts found in CSV file');
      }

      setProgress(25);

      // Process in batches
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < contacts.length; i += batchSize) {
        batches.push(contacts.slice(i, i + batchSize));
      }

      let successCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < batches.length; i++) {
        try {
          const { data, error } = await supabase
            .from('crm_contacts')
            .upsert(batches[i], { 
              onConflict: 'email',
              ignoreDuplicates: false 
            });

          if (error) {
            errors.push(`Batch ${i + 1}: ${error.message}`);
          } else {
            successCount += batches[i].length;
          }
        } catch (batchError: any) {
          errors.push(`Batch ${i + 1}: ${batchError.message}`);
        }

        setProgress(25 + (75 * (i + 1)) / batches.length);
      }

      setResult({
        total: contacts.length,
        success: successCount,
        errors
      });

    } catch (error: any) {
      setResult({
        total: 0,
        success: 0,
        errors: [error.message]
      });
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  const resetImporter = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card-surface rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Bulk Import Contacts</h3>
      </div>

      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <FileText className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to select CSV file or drag and drop
              </span>
            </label>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button
              onClick={resetImporter}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-3 font-medium transition
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Processing...' : 'Import Contacts'}
        </button>

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {result.errors.length === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <h4 className="font-semibold">Import Results</h4>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Total contacts:</span> {result.total}
              </div>
              <div className="text-sm">
                <span className="font-medium">Successfully imported:</span>{' '}
                <span className="text-green-600">{result.success}</span>
              </div>
              {result.errors.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Errors:</span>{' '}
                  <span className="text-red-600">{result.errors.length}</span>
                </div>
              )}
            </div>

            {result.errors.length > 0 && (
              <details className="bg-red-50 rounded-lg p-4">
                <summary className="text-sm font-medium text-red-800 cursor-pointer">
                  View Error Details
                </summary>
                <div className="mt-2 space-y-1">
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-xs text-red-700">
                      {error}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* CSV Format Help */}
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">CSV Format Requirements:</p>
          <p>Headers: company_name, full_name, title, email, phone, city, country, linkedin</p>
          <p>At least one of: company_name, full_name, or email is required per row</p>
        </div>
      </div>
    </div>
  );
}