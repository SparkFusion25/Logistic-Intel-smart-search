import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { TopBar } from "@/components/ui/TopBar"
import { 
  Mail, MessageCircle, Users, Filter, Search, ArrowRight, 
  Book, ChartLine, Download, Calendar, FileText, Zap 
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TEMPLATES from '@/data/campaign-templates'
import { CampaignTemplate, Channel, PlanType } from '@/types/campaign'

// Mock user plan - in real app this would come from user context
const USER_PLAN: PlanType = 'pro' // can be 'free', 'pro', 'enterprise'

const CHANNEL_CONFIG = {
  email: { icon: Mail, color: 'bg-blue-500', label: 'Email' },
  linkedin: { icon: MessageCircle, color: 'bg-purple-500', label: 'LinkedIn' },
  hybrid: { icon: Users, color: 'bg-indigo-500', label: 'Hybrid' }
}

const ICON_MAP = {
  arrow: ArrowRight,
  book: Book,
  chart: ChartLine,
  download: Download,
  calendar: Calendar
}

export default function CampaignTemplatesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChannel, setSelectedChannel] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter(template => {
      // Search filter
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Channel filter
      const matchesChannel = selectedChannel === 'all' || template.channel === selectedChannel
      
      // Tag filter
      const matchesTag = selectedTag === 'all' || template.tags.includes(selectedTag)
      
      return matchesSearch && matchesChannel && matchesTag
    })
  }, [searchQuery, selectedChannel, selectedTag])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    TEMPLATES.forEach(template => {
      template.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  const canUseTemplate = (template: CampaignTemplate): boolean => {
    if (USER_PLAN === 'enterprise') return true
    if (USER_PLAN === 'pro') return template.channel === 'email'
    return false // free plan can view but not use
  }

  const getChannelIcon = (channel: Channel) => {
    const Icon = CHANNEL_CONFIG[channel].icon
    return <Icon className="w-4 h-4" />
  }

  const handleUseTemplate = (template: CampaignTemplate) => {
    if (!canUseTemplate(template)) {
      // Show upgrade modal/toast
      return
    }
    
    // Navigate to builder with template pre-loaded
    navigate('/dashboard/campaigns/builder', { 
      state: { template } 
    })
  }

  const handlePreviewTemplate = (template: CampaignTemplate) => {
    // Open preview modal
    console.log('Preview template:', template)
  }

  const getStepCount = (template: CampaignTemplate) => {
    return template.sequence.filter(step => step.type !== 'delay').length
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-3">Campaign Templates</h1>
                <p className="text-lg text-muted-foreground">Ready-to-run sequences for email, LinkedIn, and hybrid outreach</p>
              </div>

              {/* Filters */}
              <Card className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                <CardContent className="p-6 relative">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search templates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                        <SelectTrigger className="w-full sm:w-48 h-12">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="All Channels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Channels</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedTag} onValueChange={setSelectedTag}>
                        <SelectTrigger className="w-full sm:w-48 h-12">
                          <SelectValue placeholder="All Tags" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tags</SelectItem>
                          {allTags.map(tag => (
                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Notice */}
              {USER_PLAN === 'free' && (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">Free Plan - View Only</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">Upgrade to Pro to run Email campaigns, or Enterprise for LinkedIn + Hybrid access.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="group relative bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-md hover:shadow-secondary/10 transition-all duration-300 hover:-translate-y-0.5 transform-gpu">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-lg ${CHANNEL_CONFIG[template.channel].color} flex items-center justify-center text-white`}>
                              {getChannelIcon(template.channel)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {CHANNEL_CONFIG[template.channel].label}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-snug">{template.name}</CardTitle>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 relative">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{template.tags.length - 3}</Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{getStepCount(template)} steps</span>
                        <span>{template.sequence.length} total</span>
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => handleUseTemplate(template)}
                          disabled={!canUseTemplate(template)}
                          className="flex-1 bg-gradient-to-r from-primary to-primary-variant"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {canUseTemplate(template) ? 'Use Template' : 'Upgrade to Use'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handlePreviewTemplate(template)}
                          className="border-muted-foreground/30"
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-border/50">
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No templates found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('')
                      setSelectedChannel('all')
                      setSelectedTag('all')
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}