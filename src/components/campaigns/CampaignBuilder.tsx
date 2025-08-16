import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, MessageCircle, Clock, Users, ChevronUp, ChevronDown, Trash2, FileText, AlertTriangle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useLocation } from 'react-router-dom'
import { CampaignTemplate, Step as TemplateStep, ValidationError } from '@/types/campaign'
import { validateCampaignSequence, addComplianceFooter } from '@/utils/campaign-validation'

type StepType = 'delay' | 'email' | 'linkedin_connect' | 'linkedin_message'

interface CampaignStep {
  id: string
  type: StepType
  hours?: number
  subject?: string
  body_html?: string
  text?: string
  note?: string
  condition?: 'no_reply' | 'any' | 'connected'
  ctas?: Array<{
    label: string
    href: string
    variant?: 'primary' | 'secondary' | 'ghost' | 'card'
    icon?: string
  }>
  assets?: Array<{
    type: 'image'
    url: string
    alt?: string
    position?: 'header' | 'inline' | 'footer'
  }>
}

interface CampaignBuilderProps {
  onSave?: (campaign: any) => void
}

export default function CampaignBuilder({ onSave }: CampaignBuilderProps) {
  const location = useLocation()
  const template = location.state?.template as CampaignTemplate
  
  const [channel, setChannel] = useState<'email' | 'linkedin' | 'hybrid'>(template?.channel || 'email')
  const [name, setName] = useState(template?.name || 'New Campaign')
  const [audience, setAudience] = useState<any>({ 
    tags: template?.recommendedAudience?.tags || [] 
  })
  const [sequence, setSequence] = useState<CampaignStep[]>(() => {
    if (template?.sequence) {
      return template.sequence.map((step, index) => ({
        id: `${Date.now()}-${index}`,
        ...step
      }))
    }
    return [
      { 
        id: '1',
        type: 'email', 
        subject: 'Introduction', 
        body_html: 'Hi {{first_name}},\n\nI hope this email finds you well...' 
      },
      { 
        id: '2',
        type: 'delay', 
        hours: 48 
      }
    ]
  })
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const { toast } = useToast()

  // Load template if provided
  useEffect(() => {
    if (template) {
      setChannel(template.channel)
      setName(template.name)
      setAudience({ 
        tags: template.recommendedAudience?.tags || [],
        title_includes: template.recommendedAudience?.title_includes || []
      })
      const mappedSequence = template.sequence.map((step, index) => ({
        id: `${Date.now()}-${index}`,
        ...step
      }))
      setSequence(mappedSequence)
    }
  }, [template])

  // Validate sequence on changes
  useEffect(() => {
    const audienceFields = ['first_name', 'company', 'lane'] // Mock audience fields
    // Convert CampaignStep to Step for validation
    const convertedSequence = sequence.map(({ id, ...step }) => step)
    const errors = validateCampaignSequence(convertedSequence as any, channel, audienceFields)
    setValidationErrors(errors)
  }, [sequence, channel])

  const stepTemplates: Record<StepType, Partial<CampaignStep>> = {
    email: { type: 'email', subject: '', body_html: '', ctas: [] },
    delay: { type: 'delay', hours: 24 },
    linkedin_connect: { type: 'linkedin_connect', note: '' },
    linkedin_message: { type: 'linkedin_message', text: '' }
  }

  const addStep = (type: StepType) => {
    const newStep: CampaignStep = {
      id: Date.now().toString(),
      type,
      ...stepTemplates[type]
    }
    setSequence([...sequence, newStep])
  }

  const updateStep = (id: string, updates: Partial<CampaignStep>) => {
    setSequence(sequence.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ))
  }

  const removeStep = (id: string) => {
    setSequence(sequence.filter(step => step.id !== id))
  }

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = sequence.findIndex(step => step.id === id)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sequence.length) return
    
    const newSequence = [...sequence]
    const temp = newSequence[index]
    newSequence[index] = newSequence[newIndex]
    newSequence[newIndex] = temp
    setSequence(newSequence)
  }

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />
      case 'linkedin_connect': return <Users className="w-4 h-4" />
      case 'linkedin_message': return <MessageCircle className="w-4 h-4" />
      case 'delay': return <Clock className="w-4 h-4" />
    }
  }

  const getStepColor = (type: StepType) => {
    switch (type) {
      case 'email': return 'bg-blue-500'
      case 'linkedin_connect': return 'bg-purple-500'
      case 'linkedin_message': return 'bg-indigo-500'
      case 'delay': return 'bg-gray-500'
    }
  }

  const saveCampaign = async () => {
    if (!name.trim()) {
      toast({
        title: "Campaign Name Required",
        description: "Please enter a campaign name",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('campaigns-manager', {
        body: {
          org_id: 'default-org', // This should come from user context
          name,
          channel,
          audience,
          sequence: sequence.map(({ id, ...step }) => step), // Remove temp IDs
          created_by: 'user'
        }
      })

      if (error) throw error

      toast({
        title: "Campaign Saved",
        description: `Campaign "${name}" has been saved successfully`
      })

      if (onSave) {
        onSave({ id: data.id, name, channel, audience, sequence })
      }

    } catch (error) {
      console.error('Save campaign error:', error)
      toast({
        title: "Save Failed",
        description: "Unable to save campaign. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const availableSteps = () => {
    if (channel === 'email') return ['email', 'delay']
    if (channel === 'linkedin') return ['linkedin_connect', 'linkedin_message', 'delay']
    return ['email', 'linkedin_connect', 'linkedin_message', 'delay']
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="lg:col-span-3">
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Validation Issues</h4>
                  <ul className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm text-destructive">
                        {error.step ? `Step ${error.step}: ` : ''}{error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Template Selection */}
      <div className="lg:col-span-3 mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowTemplateModal(true)}
          className="border-primary/30 hover:bg-primary/5"
        >
          <FileText className="w-4 h-4 mr-2" />
          Load from Template
        </Button>
      </div>
      {/* Audience & Settings */}
      <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        <CardHeader className="relative">
          <CardTitle className="text-lg">Campaign Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Campaign Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter campaign name"
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Channel Strategy</label>
            <Select value={channel} onValueChange={(value: any) => setChannel(value)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Only</SelectItem>
                <SelectItem value="linkedin">LinkedIn Only</SelectItem>
                <SelectItem value="hybrid">LinkedIn + Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Target Tags</label>
            <Input
              placeholder="Enter tags (comma separated)"
              onChange={(e) => setAudience({
                ...audience, 
                tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              className="h-12"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {audience.tags?.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Add Steps</label>
            <div className="grid grid-cols-2 gap-2">
              {availableSteps().map((stepType) => (
                <Button
                  key={stepType}
                  variant="outline"
                  size="sm"
                  onClick={() => addStep(stepType as StepType)}
                  className="justify-start"
                >
                  {getStepIcon(stepType as StepType)}
                  <span className="ml-2 capitalize">{stepType.replace('_', ' ')}</span>
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={saveCampaign} 
            disabled={loading || validationErrors.length > 0}
            className="w-full bg-gradient-to-r from-primary to-primary-variant"
          >
            {loading ? 'Saving...' : 'Save Campaign'}
          </Button>
        </CardContent>
      </Card>

      {/* Sequence Builder */}
      <Card className="lg:col-span-2 group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-secondary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center justify-between">
            <span>Campaign Sequence</span>
            <Badge variant="outline">{sequence.length} steps</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          {sequence.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No steps added yet. Use the buttons on the left to add steps to your campaign.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sequence.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Step connector line */}
                  {index < sequence.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-border"></div>
                  )}
                  
                  <div className="flex items-start space-x-4 p-4 bg-canvas rounded-xl border border-border/50 hover:shadow-md transition-all duration-200">
                    {/* Step indicator */}
                    <div className={`w-12 h-12 rounded-full ${getStepColor(step.type)} flex items-center justify-center text-white`}>
                      {getStepIcon(step.type)}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold capitalize">
                          Step {index + 1}: {step.type.replace('_', ' ')}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStep(step.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStep(step.id, 'down')}
                            disabled={index === sequence.length - 1}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(step.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Step-specific fields */}
                      {step.type === 'email' && (
                        <div className="space-y-3">
                          <Input
                            placeholder="Email subject"
                            value={step.subject || ''}
                            onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                          />
                          <Textarea
                            placeholder="Email body (supports {{first_name}}, {{company}} variables)"
                            value={step.body_html || ''}
                            onChange={(e) => {
                              const newValue = addComplianceFooter(e.target.value)
                              updateStep(step.id, { body_html: newValue })
                            }}
                            rows={4}
                          />
                        </div>
                      )}

                      {step.type === 'linkedin_connect' && (
                        <Textarea
                          placeholder="Connection note (optional)"
                          value={step.note || ''}
                          onChange={(e) => updateStep(step.id, { note: e.target.value })}
                          rows={2}
                        />
                      )}

                      {step.type === 'linkedin_message' && (
                        <Textarea
                          placeholder="LinkedIn message text"
                          value={step.text || ''}
                          onChange={(e) => updateStep(step.id, { text: e.target.value })}
                          rows={3}
                        />
                      )}

                      {step.type === 'delay' && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Hours"
                            value={step.hours || 24}
                            onChange={(e) => updateStep(step.id, { hours: Number(e.target.value) })}
                            className="w-32"
                            min="1"
                            max="168"
                          />
                          <span className="text-sm text-muted-foreground">hours delay (1-168 max)</span>
                        </div>
                      )}

                      {step.type === 'linkedin_connect' && !step.note && (
                        <div className="text-sm text-muted-foreground">
                          Send LinkedIn connection request with automated note
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}