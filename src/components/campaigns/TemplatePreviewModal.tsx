import React, { useState } from 'react'
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Mail, MessageCircle, Users, Clock, ArrowRight, Book, 
  TrendingUp, Download, Calendar, Eye, FileText 
} from 'lucide-react'
import { CampaignTemplate, Step } from '@/types/campaign'

const CHANNEL_CONFIG = {
  email: { icon: Mail, color: 'bg-blue-500', label: 'Email' },
  linkedin: { icon: MessageCircle, color: 'bg-purple-500', label: 'LinkedIn' },
  hybrid: { icon: Users, color: 'bg-indigo-500', label: 'Hybrid' }
}

const ICON_MAP = {
  arrow: ArrowRight,
  book: Book,
  chart: TrendingUp,
  download: Download,
  calendar: Calendar
}

interface TemplatePreviewModalProps {
  template: CampaignTemplate
  trigger: React.ReactNode
  onUseTemplate?: () => void
  canUse?: boolean
}

export function TemplatePreviewModal({ 
  template, 
  trigger, 
  onUseTemplate, 
  canUse = true 
}: TemplatePreviewModalProps) {
  const [open, setOpen] = useState(false)

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'linkedin_connect': return <Users className="w-4 h-4" />
      case 'linkedin_message': return <MessageCircle className="w-4 h-4" />
      case 'delay': return <Clock className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStepColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-500'
      case 'linkedin_connect': return 'bg-purple-500'
      case 'linkedin_message': return 'bg-indigo-500'
      case 'delay': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const renderStepContent = (step: Step, index: number) => {
    if (step.type === 'email') {
      return (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Subject</label>
            <div className="p-2 bg-muted rounded text-sm font-medium">
              {step.subject}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Body</label>
            <div className="p-3 bg-muted rounded text-sm leading-relaxed">
              <div dangerouslySetInnerHTML={{ 
                __html: step.body_html
                  .replace(/\n/g, '<br/>')
                  .replace(/\{\{([^}]+)\}\}/g, '<span class="px-1 py-0.5 bg-primary/20 text-primary rounded text-xs">{{$1}}</span>')
              }} />
            </div>
          </div>
          {step.ctas && step.ctas.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Call-to-Actions</label>
              <div className="flex flex-wrap gap-2">
                {step.ctas.map((cta, ctaIndex) => {
                  const IconComponent = cta.icon ? ICON_MAP[cta.icon as keyof typeof ICON_MAP] : null
                  return (
                    <div key={ctaIndex} className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded text-xs">
                      {IconComponent && <IconComponent className="w-3 h-3" />}
                      <span>{cta.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {step.assets && step.assets.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Assets</label>
              <div className="space-y-1">
                {step.assets.map((asset, assetIndex) => (
                  <div key={assetIndex} className="text-xs text-muted-foreground">
                    📸 {asset.alt || 'Image'} ({asset.position || 'inline'})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    if (step.type === 'linkedin_message') {
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Message</label>
          <div className="p-3 bg-muted rounded text-sm leading-relaxed">
            {step.text.replace(/\{\{([^}]+)\}\}/g, (match, field) => 
              `{{${field}}}`
            )}
          </div>
        </div>
      )
    }

    if (step.type === 'linkedin_connect') {
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Connection Note</label>
          <div className="p-3 bg-muted rounded text-sm leading-relaxed">
            {step.note || 'Send connection request without note'}
          </div>
        </div>
      )
    }

    if (step.type === 'delay') {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Wait {step.hours} hours before next step</span>
        </div>
      )
    }

    return null
  }

  const previewData = template.previewSample || {
    first_name: 'Alex',
    company: 'Example Corp',
    lane: 'CN→US',
    mode: 'ocean'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${CHANNEL_CONFIG[template.channel].color} flex items-center justify-center text-white`}>
              {React.createElement(CHANNEL_CONFIG[template.channel].icon, { className: "w-4 h-4" })}
            </div>
            <div>
              <div>{template.name}</div>
              <div className="text-sm font-normal text-muted-foreground">{template.description}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Channel & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {CHANNEL_CONFIG[template.channel].label}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview Sample</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="font-medium">Name:</span> {previewData.first_name}</div>
                <div><span className="font-medium">Company:</span> {previewData.company}</div>
                <div><span className="font-medium">Lane:</span> {previewData.lane}</div>
                {previewData.mode && <div><span className="font-medium">Mode:</span> {previewData.mode}</div>}
              </CardContent>
            </Card>
          </div>

          {/* Sequence Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Campaign Sequence ({template.sequence.length} steps)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {template.sequence.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Step connector line */}
                    {index < template.sequence.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-border"></div>
                    )}
                    
                    <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-xl border border-border/50">
                      {/* Step indicator */}
                      <div className={`w-12 h-12 rounded-full ${getStepColor(step.type)} flex items-center justify-center text-white flex-shrink-0`}>
                        {getStepIcon(step.type)}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold capitalize">
                            Step {index + 1}: {step.type.replace('_', ' ')}
                          </h4>
                          {step.analytics?.intent && (
                            <Badge variant="outline" className="text-xs">
                              {step.analytics.intent}
                            </Badge>
                          )}
                        </div>

                        {renderStepContent(step, index)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                onUseTemplate?.()
                setOpen(false)
              }}
              disabled={!canUse}
              className="bg-gradient-to-r from-primary to-primary-variant"
            >
              <FileText className="w-4 h-4 mr-2" />
              {canUse ? 'Use Template' : 'Upgrade to Use'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}