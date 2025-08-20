import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, ArrowRight, Book, TrendingUp, Download, Calendar } from 'lucide-react'

const ICON_OPTIONS = [
  { value: 'arrow', label: 'Arrow', icon: ArrowRight },
  { value: 'book', label: 'Book', icon: Book },
  { value: 'chart', label: 'Chart', icon: TrendingUp },
  { value: 'download', label: 'Download', icon: Download },
  { value: 'calendar', label: 'Calendar', icon: Calendar }
]

interface CTA {
  label: string
  href: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'card'
  icon?: string
}

interface CTAEditorProps {
  ctas: CTA[]
  onChange: (ctas: CTA[]) => void
}

export function CTAEditor({ ctas, onChange }: CTAEditorProps) {
  const addCTA = () => {
    const newCTA: CTA = {
      label: '',
      href: '',
      variant: 'primary'
    }
    onChange([...ctas, newCTA])
  }

  const updateCTA = (index: number, updates: Partial<CTA>) => {
    const newCTAs = ctas.map((cta, i) => 
      i === index ? { ...cta, ...updates } : cta
    )
    onChange(newCTAs)
  }

  const removeCTA = (index: number) => {
    onChange(ctas.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          Call-to-Actions
          <Button size="sm" variant="outline" onClick={addCTA}>
            <Plus className="w-3 h-3 mr-1" />
            Add CTA
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ctas.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No CTAs added. Click "Add CTA" to create one.
          </p>
        ) : (
          ctas.map((cta, index) => (
            <div key={index} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">CTA {index + 1}</span>
                <Button size="sm" variant="ghost" onClick={() => removeCTA(index)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Button text"
                  value={cta.label}
                  onChange={(e) => updateCTA(index, { label: e.target.value })}
                  className="text-sm"
                />
                <Select 
                  value={cta.variant} 
                  onValueChange={(value: any) => updateCTA(index, { variant: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="{{tracking_link('slug')}} or URL"
                  value={cta.href}
                  onChange={(e) => updateCTA(index, { href: e.target.value })}
                  className="text-sm"
                />
                <Select 
                  value={cta.icon || ''} 
                  onValueChange={(value) => updateCTA(index, { icon: value || undefined })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="No icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No icon</SelectItem>
                    {ICON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-3 h-3" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">Preview:</div>
                <Badge 
                  variant={cta.variant === 'primary' ? 'default' : 'secondary'} 
                  className="text-xs"
                >
                  {cta.icon && React.createElement(
                    ICON_OPTIONS.find(opt => opt.value === cta.icon)?.icon || ArrowRight,
                    { className: "w-3 h-3 mr-1" }
                  )}
                  {cta.label || 'Button text'}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}