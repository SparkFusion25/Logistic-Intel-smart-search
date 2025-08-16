export type Channel = 'email' | 'linkedin' | 'hybrid'

export type Step =
  | { type: 'delay'; hours: number; analytics?: Record<string, string> }
  | { type: 'email'; subject: string; body_html: string; ctas?: CTA[]; assets?: Asset[]; analytics?: Record<string, string> }
  | { type: 'linkedin_connect'; note?: string; analytics?: Record<string, string> }
  | { type: 'linkedin_message'; text: string; analytics?: Record<string, string> }

export type CTA = {
  label: string
  href: string // can be absolute or {{tracking_link('slug')}} for link tracking
  variant?: 'primary' | 'secondary' | 'ghost' | 'card'
  icon?: 'arrow' | 'book' | 'chart' | 'download' | 'calendar'
}

export type Asset = {
  type: 'image'
  url: string
  alt?: string
  width?: number
  height?: number
  position?: 'header' | 'inline' | 'footer'
}

export type CampaignTemplate = {
  id: string
  name: string
  description: string
  channel: Channel
  tags: string[] // e.g., ['cold', 'ocean', 'roi']
  recommendedAudience?: { tags?: string[]; title_includes?: string[]; countries?: string[] }
  sequence: Step[]
  suggestedSchedule?: { send_window?: 'business_hours' | 'anytime'; days_between_steps?: number[] }
  previewSample?: { first_name?: string; company?: string; lane?: string; mode?: string }
}

export type PlanType = 'free' | 'pro' | 'enterprise'

export interface ValidationError {
  field: string
  message: string
  step?: number
}