import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Image, Upload } from 'lucide-react'

interface Asset {
  type: 'image'
  url: string
  alt?: string
  width?: number
  height?: number
  position?: 'header' | 'inline' | 'footer'
}

interface AssetEditorProps {
  assets: Asset[]
  onChange: (assets: Asset[]) => void
}

export function AssetEditor({ assets, onChange }: AssetEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const addAsset = () => {
    const newAsset: Asset = {
      type: 'image',
      url: '',
      alt: '',
      position: 'inline'
    }
    onChange([...assets, newAsset])
  }

  const updateAsset = (index: number, updates: Partial<Asset>) => {
    const newAssets = assets.map((asset, i) => 
      i === index ? { ...asset, ...updates } : asset
    )
    onChange(newAssets)
  }

  const removeAsset = (index: number) => {
    onChange(assets.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index)
    try {
      // In a real implementation, upload to Supabase storage
      // For now, we'll use a placeholder
      const mockUrl = `https://assets.logistic-intel.com/uploads/${file.name}`
      updateAsset(index, { 
        url: mockUrl,
        alt: file.name.replace(/\.[^/.]+$/, "")
      })
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          Email Assets
          <Button size="sm" variant="outline" onClick={addAsset}>
            <Plus className="w-3 h-3 mr-1" />
            Add Image
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No assets added. Click "Add Image" to include images in your email.
          </p>
        ) : (
          assets.map((asset, index) => (
            <div key={index} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Image {index + 1}</span>
                <Button size="sm" variant="ghost" onClick={() => removeAsset(index)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Image URL</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={asset.url}
                    onChange={(e) => updateAsset(index, { url: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Alt Text</label>
                  <Input
                    placeholder="Describe the image"
                    value={asset.alt || ''}
                    onChange={(e) => updateAsset(index, { alt: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Position</label>
                  <Select 
                    value={asset.position} 
                    onValueChange={(value: any) => updateAsset(index, { position: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Width (px)</label>
                  <Input
                    type="number"
                    placeholder="560"
                    value={asset.width || ''}
                    onChange={(e) => updateAsset(index, { width: Number(e.target.value) || undefined })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Height (px)</label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={asset.height || ''}
                    onChange={(e) => updateAsset(index, { height: Number(e.target.value) || undefined })}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Upload button */}
              <div className="pt-2">
                <input
                  type="file"
                  accept="image/*"
                  id={`upload-${index}`}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(index, file)
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById(`upload-${index}`)?.click()}
                  disabled={uploadingIndex === index}
                  className="text-xs"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  {uploadingIndex === index ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>

              {/* Preview */}
              {asset.url && (
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
                    <Image className="w-4 h-4" />
                    <span>{asset.alt || 'Image'}</span>
                    <span className="text-muted-foreground">({asset.position})</span>
                    {asset.width && <span className="text-muted-foreground">{asset.width}px</span>}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}