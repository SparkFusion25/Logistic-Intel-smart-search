import { Step, Channel, ValidationError } from '@/types/campaign'

// Required merge fields for validation
const REQUIRED_MERGE_FIELDS = ['first_name', 'company', 'lane']
const OPTIONAL_MERGE_FIELDS = ['last_name', 'title', 'mode', 'benchmark_value']
const SYSTEM_FIELDS = ['unsubscribe_link', 'tracking_link']

export function validateCampaignSequence(
  sequence: Step[], 
  channel: Channel,
  audienceFields: string[] = []
): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Validate sequence length
  if (sequence.length > 12) {
    errors.push({
      field: 'sequence',
      message: 'Maximum 12 steps allowed per campaign'
    })
  }

  // Validate channel compatibility
  sequence.forEach((step, index) => {
    if (channel === 'email' && !['email', 'delay'].includes(step.type)) {
      errors.push({
        field: 'sequence',
        message: `Step ${index + 1}: Email-only campaigns cannot use ${step.type} steps`,
        step: index + 1
      })
    }
    
    if (channel === 'linkedin' && !['linkedin_connect', 'linkedin_message', 'delay'].includes(step.type)) {
      errors.push({
        field: 'sequence',
        message: `Step ${index + 1}: LinkedIn-only campaigns cannot use ${step.type} steps`,
        step: index + 1
      })
    }
  })

  // Validate delays between same channel
  const emailSteps = sequence.filter((step, index) => step.type === 'email' && index > 0)
  const linkedinSteps = sequence.filter((step, index) => step.type.startsWith('linkedin') && index > 0)
  
  // Check minimum 8h between sends
  let lastEmailTime = 0
  let lastLinkedInTime = 0
  
  sequence.forEach((step, index) => {
    if (step.type === 'delay') {
      lastEmailTime += step.hours
      lastLinkedInTime += step.hours
    } else if (step.type === 'email') {
      if (index > 0 && lastEmailTime < 8) {
        errors.push({
          field: 'sequence',
          message: `Step ${index + 1}: Minimum 8 hours required between email sends`,
          step: index + 1
        })
      }
      lastEmailTime = 0
    } else if (step.type.startsWith('linkedin')) {
      if (index > 0 && lastLinkedInTime < 8) {
        errors.push({
          field: 'sequence',
          message: `Step ${index + 1}: Minimum 8 hours required between LinkedIn actions`,
          step: index + 1
        })
      }
      lastLinkedInTime = 0
    }
  })

  // Validate merge fields
  sequence.forEach((step, index) => {
    const mergeFields = extractMergeFields(step)
    mergeFields.forEach(field => {
      if (REQUIRED_MERGE_FIELDS.includes(field) && !audienceFields.includes(field)) {
        errors.push({
          field: 'audience',
          message: `Step ${index + 1}: Missing required field "${field}" in audience data`,
          step: index + 1
        })
      }
    })
  })

  // Validate email compliance
  sequence.forEach((step, index) => {
    if (step.type === 'email') {
      if (!step.body_html?.includes('{{unsubscribe_link}}')) {
        errors.push({
          field: 'compliance',
          message: `Step ${index + 1}: Email must include {{unsubscribe_link}} for compliance`,
          step: index + 1
        })
      }
    }
  })

  return errors
}

export function extractMergeFields(step: Step): string[] {
  const fields = new Set<string>()
  
  if (step.type === 'email') {
    const text = `${step.subject} ${step.body_html}`
    const matches = text.match(/\{\{([^}]+)\}\}/g) || []
    matches.forEach((match: string) => {
      const field = match.slice(2, -2).trim()
      if (!field.startsWith('tracking_link') && field !== 'unsubscribe_link') {
        fields.add(field)
      }
    })
  } else if (step.type === 'linkedin_message') {
    const matches = step.text.match(/\{\{([^}]+)\}\}/g) || []
    matches.forEach((match: string) => {
      const field = match.slice(2, -2).trim()
      fields.add(field)
    })
  } else if (step.type === 'linkedin_connect' && step.note) {
    const matches = step.note.match(/\{\{([^}]+)\}\}/g) || []
    matches.forEach((match: string) => {
      const field = match.slice(2, -2).trim()
      fields.add(field)
    })
  }
  
  return Array.from(fields)
}

export function addComplianceFooter(bodyHtml: string): string {
  const footer = `
<hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
<p style="color:#6b7280;font-size:12px;margin:0;">You're receiving this because your business email is public or you interacted with Logistic Intel. <a href="{{unsubscribe_link}}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>.</p>`

  if (!bodyHtml.includes('{{unsubscribe_link}}')) {
    return bodyHtml + footer
  }
  
  return bodyHtml
}

export function validatePlanAccess(channel: Channel, plan: string): boolean {
  if (plan === 'enterprise') return true
  if (plan === 'pro') return channel === 'email'
  return false // free plan cannot run campaigns
}