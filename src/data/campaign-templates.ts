import { CampaignTemplate } from '@/types/campaign'

const IMG_REPORT = 'https://assets.logistic-intel.com/email/report-card.png'
const IMG_BENCH = 'https://assets.logistic-intel.com/email/benchmark-card.png'
const IMG_PRICING = 'https://assets.logistic-intel.com/email/pricing-card.png'
const IMG_EVENT = 'https://assets.logistic-intel.com/email/event-card.png'

const TEMPLATES: CampaignTemplate[] = [
  {
    id: 'cold-intro-email',
    name: 'Cold Intro — Trade Intelligence',
    description: 'Polite cold start for import/export leaders; introduces value with a soft CTA.',
    channel: 'email',
    tags: ['cold', 'general', 'intro'],
    recommendedAudience: { title_includes: ['Logistics', 'Procurement', 'Supply Chain'] },
    sequence: [
      {
        type: 'email',
        subject: 'Quick intro, {{first_name}} — visibility on {{lane}}',
        body_html: `
<p>Hi {{first_name}},</p>
<p>I'm with Logistic Intel — we help teams monitor real <b>{{mode}}</b> flows on lanes like <b>{{lane}}</b> and spot opportunities faster.</p>
<p>If useful, I can share a 60-sec view on volumes, top shippers, and duty impact for your category.</p>
<p>Worth a look?</p>
<p>—</p>
<p>Best,<br/>{{company}} team</p>`,
        ctas: [
          { label: 'See live lane snapshot', href: "{{tracking_link('lane-snapshot')}}", variant: 'primary', icon: 'chart' },
          { label: 'Book 15-min', href: "{{tracking_link('book')}}", variant: 'secondary', icon: 'calendar' }
        ],
        assets: [{ type: 'image', url: IMG_BENCH, alt: 'Lane snapshot', position: 'footer', width: 560 }],
        analytics: { template_id: 'cold-intro-email', step_name: 'intro', intent: 'intro' }
      },
      { type: 'delay', hours: 48, analytics: { intent: 'followup' } },
      {
        type: 'email',
        subject: 'Re: visibility on {{lane}}',
        body_html: `
<p>Hi {{first_name}}, looping this back.</p>
<p>We're seeing movement on {{lane}} — happy to send a quick chart and relevant HS mix.</p>
<p>Open to a quick review?</p>
<p>—</p>`,
        ctas: [{ label: 'Send me the chart', href: "{{tracking_link('send-chart')}}", variant: 'primary', icon: 'arrow' }],
        analytics: { template_id: 'cold-intro-email', step_name: 'followup', intent: 'followup' }
      }
    ],
    suggestedSchedule: { send_window: 'business_hours', days_between_steps: [2] },
    previewSample: { first_name: 'Alex', company: 'Logistic Intel', lane: 'CN→US', mode: 'ocean' }
  },

  {
    id: 'ocean-freight-inquiry',
    name: 'Ocean Freight Inquiry — Pricing Check',
    description: 'Short ocean pricing check with optional benchmark CTA.',
    channel: 'email',
    tags: ['ocean', 'pricing', 'benchmark'],
    sequence: [
      {
        type: 'email',
        subject: '{{first_name}}, quick ocean check on {{lane}}',
        body_html: `
<p>Hi {{first_name}},</p>
<p>Are you reviewing {{lane}} ocean moves this quarter? We can share a quick benchmark and typical fee drivers (BAS, BAF, GRI).</p>
<p>Happy to price a sample lane or audit a recent invoice.</p>
<p>—</p>`,
        ctas: [
          { label: 'Get benchmark', href: "{{tracking_link('ocean-benchmark')}}", variant: 'primary', icon: 'chart' },
          { label: 'Upload recent invoice', href: "{{tracking_link('upload-invoice')}}", variant: 'secondary', icon: 'download' }
        ],
        assets: [{ type: 'image', url: IMG_PRICING, alt: 'Ocean pricing card', position: 'inline', width: 560 }],
        analytics: { template_id: 'ocean-freight-inquiry', step_name: 'pricing_inquiry', intent: 'intro', mode: 'ocean' }
      },
      { type: 'delay', hours: 72 },
      {
        type: 'email',
        subject: 'Re: ocean check on {{lane}}',
        body_html: `<p>Quick nudge in case a benchmark would help your team, {{first_name}}.</p>`,
        analytics: { template_id: 'ocean-freight-inquiry', step_name: 'followup', intent: 'followup', mode: 'ocean' }
      }
    ],
    previewSample: { first_name: 'Taylor', lane: 'VN→US', mode: 'ocean' }
  },

  {
    id: 'air-freight-seasonal',
    name: 'Air Freight — Seasonal Capacity',
    description: 'Seasonal push highlighting air capacity and lead-time wins.',
    channel: 'email',
    tags: ['air', 'seasonal'],
    sequence: [
      {
        type: 'email',
        subject: '{{first_name}}, air capacity on {{lane}} ahead of peak',
        body_html: `
<p>Hi {{first_name}},</p>
<p>We're tracking uplift on {{lane}} with lead times improving vs last month. If you've got urgent SKUs, air may pencil out this cycle.</p>
<p>Can share a rate window & ETDs from top carriers.</p>`,
        ctas: [{ label: 'See ETD window', href: "{{tracking_link('air-etd')}}", variant: 'primary', icon: 'calendar' }],
        analytics: { template_id: 'air-freight-seasonal', step_name: 'seasonal_intro', intent: 'intro', mode: 'air' }
      },
      { type: 'delay', hours: 48 },
      { 
        type: 'email', 
        subject: 'Re: air on {{lane}}', 
        body_html: `<p>Want me to send the current ETD window?</p>`,
        analytics: { template_id: 'air-freight-seasonal', step_name: 'followup', intent: 'followup', mode: 'air' }
      }
    ]
  },

  {
    id: 'tariff-impact-update',
    name: 'Tariff Impact Update — Duty Calculator',
    description: 'Duty impact with MPF/HMF explanation and live calculator CTA.',
    channel: 'email',
    tags: ['tariff', 'hs', 'compliance'],
    sequence: [
      {
        type: 'email',
        subject: 'Duty check for {{company}} — HS update',
        body_html: `
<p>Hi {{first_name}},</p>
<p>We're seeing duty exposure change on relevant HS categories. Quick calc shows estimated {{benchmark_value}} impact per shipment (incl. MPF/HMF).</p>
<p>Want the breakdown for your SKUs?</p>`,
        ctas: [
          { label: 'Run tariff calculator', href: "{{tracking_link('tariff')}}", variant: 'primary', icon: 'book' },
          { label: 'Send HS list', href: "{{tracking_link('upload-hs')}}", variant: 'secondary', icon: 'download' }
        ],
        analytics: { template_id: 'tariff-impact-update', step_name: 'duty_update', intent: 'intro', mode: 'any' }
      },
      { type: 'delay', hours: 72 },
      { 
        type: 'email', 
        subject: 'Re: duty check for {{company}}', 
        body_html: `<p>Happy to run a 3-HS sample if helpful.</p>`,
        analytics: { template_id: 'tariff-impact-update', step_name: 'followup', intent: 'followup', mode: 'any' }
      }
    ]
  },

  {
    id: 'market-benchmark-insight',
    name: 'Market Benchmark Insight — Value Chart',
    description: 'Shares a lane benchmark insight with a chart CTA.',
    channel: 'email',
    tags: ['benchmark', 'analytics'],
    sequence: [
      {
        type: 'email',
        subject: 'Lane insight on {{lane}}',
        body_html: `
<p>Hi {{first_name}},</p>
<p>Our benchmark shows a trend on {{lane}} worth a look (value & weight mix shifted vs prior 90 days).</p>
<p>Want the chart and top ports?</p>`,
        ctas: [{ label: 'View lane benchmark', href: "{{tracking_link('lane-benchmark')}}", variant: 'primary', icon: 'chart' }],
        assets: [{ type: 'image', url: IMG_BENCH, alt: 'Benchmark card', position: 'footer', width: 560 }],
        analytics: { template_id: 'market-benchmark-insight', step_name: 'benchmark_share', intent: 'intro', mode: 'any' }
      }
    ]
  },

  {
    id: 'post-trade-show-followup',
    name: 'Post-Trade Show Follow-Up',
    description: 'Warm follow-up after an event with recap CTA.',
    channel: 'email',
    tags: ['event', 'warm'],
    sequence: [
      {
        type: 'email',
        subject: 'Great meeting at the show, {{first_name}}',
        body_html: `
<p>Hi {{first_name}},</p>
<p>Good connecting this week. Per our chat, here's a quick recap and the report I mentioned.</p>
<ul><li>Focus lanes: {{lane}}</li><li>Mode: {{mode}}</li></ul>
<p>Open to a 15-min to prioritize next steps?</p>`,
        ctas: [{ label: 'Open recap & sample report', href: "{{tracking_link('event-recap')}}", variant: 'primary', icon: 'download' }],
        assets: [{ type: 'image', url: IMG_EVENT, alt: 'Event recap', position: 'inline', width: 560 }],
        analytics: { template_id: 'post-trade-show-followup', step_name: 'event_followup', intent: 'event', mode: 'any' }
      }
    ],
    previewSample: { first_name: 'Sam', lane: 'TR→DE', mode: 'ocean' }
  },

  // LinkedIn-only
  {
    id: 'li-connect-soft',
    name: 'LinkedIn — Soft Connect',
    description: 'Gentle connect request referencing shared interest.',
    channel: 'linkedin',
    tags: ['linkedin', 'connect'],
    sequence: [
      { 
        type: 'linkedin_connect', 
        note: 'Enjoyed your post on supply chain visibility — would be great to connect.',
        analytics: { template_id: 'li-connect-soft', step_name: 'connect_request', intent: 'intro' }
      },
      { type: 'delay', hours: 48 },
      { 
        type: 'linkedin_message', 
        text: 'Thanks for connecting, {{first_name}}. If {{company}} is reviewing {{lane}} this quarter, happy to share a 60-sec benchmark.',
        analytics: { template_id: 'li-connect-soft', step_name: 'value_message', intent: 'followup' }
      }
    ]
  },

  {
    id: 'li-message-value',
    name: 'LinkedIn — Value Message',
    description: 'Short value-forward message after connection.',
    channel: 'linkedin',
    tags: ['linkedin', 'message', 'value'],
    sequence: [
      { 
        type: 'linkedin_message', 
        text: 'Hi {{first_name}}, quick lane insight on {{lane}}—seeing a shift worth a look. Want the chart?',
        analytics: { template_id: 'li-message-value', step_name: 'value_intro', intent: 'intro' }
      },
      { type: 'delay', hours: 72 },
      { 
        type: 'linkedin_message', 
        text: 'No rush at all; can send the chart + top ports whenever helpful.',
        analytics: { template_id: 'li-message-value', step_name: 'soft_followup', intent: 'followup' }
      }
    ]
  },

  // Hybrid
  {
    id: 'hybrid-connect-then-email',
    name: 'Hybrid — Connect then Email',
    description: 'LI connect first, then email with assets.',
    channel: 'hybrid',
    tags: ['hybrid', 'intro'],
    sequence: [
      { 
        type: 'linkedin_connect', 
        note: 'We help teams benchmark lanes like {{lane}} — open to connect?',
        analytics: { template_id: 'hybrid-connect-then-email', step_name: 'li_connect', intent: 'intro' }
      },
      { type: 'delay', hours: 24 },
      {
        type: 'email',
        subject: 'Thanks for connecting, {{first_name}}',
        body_html: `
<p>Appreciate the connection, {{first_name}}.</p>
<p>Here's that quick snapshot for {{lane}}. If useful, we can tailor to your category.</p>`,
        ctas: [{ label: 'Open snapshot', href: "{{tracking_link('snap')}}", variant: 'primary' }],
        analytics: { template_id: 'hybrid-connect-then-email', step_name: 'email_followup', intent: 'followup' }
      }
    ]
  },

  {
    id: 'hybrid-email-li-followup',
    name: 'Hybrid — Email then LI Follow-Up',
    description: 'Email intro, LinkedIn nudge if no reply.',
    channel: 'hybrid',
    tags: ['hybrid', 'followup'],
    sequence: [
      {
        type: 'email',
        subject: '{{first_name}}, quick question on {{lane}}',
        body_html: `<p>Would a short benchmark on {{lane}} be useful this week?</p>`,
        ctas: [{ label: 'Send the benchmark', href: "{{tracking_link('send-benchmark')}}", variant: 'primary' }],
        analytics: { template_id: 'hybrid-email-li-followup', step_name: 'email_intro', intent: 'intro' }
      },
      { type: 'delay', hours: 48 },
      { 
        type: 'linkedin_message', 
        text: 'Sent a quick note by email in case helpful — happy to share the {{lane}} chart anytime.',
        analytics: { template_id: 'hybrid-email-li-followup', step_name: 'li_followup', intent: 'followup' }
      }
    ]
  },

  {
    id: 'content-offer-report',
    name: 'Content Offer — Industry Report',
    description: 'Drive downloads to a gated report.',
    channel: 'email',
    tags: ['content', 'report', 'download'],
    sequence: [
      {
        type: 'email',
        subject: '{{first_name}}, new industry report',
        body_html: `
<p>We just published a short report on trade shifts worth scanning.</p>
<p>It covers {{lane}} movements, carriers, and duty exposure.</p>`,
        ctas: [{ label: 'Download report (PDF)', href: "{{tracking_link('report-download')}}", variant: 'primary', icon: 'download' }],
        assets: [{ type: 'image', url: IMG_REPORT, alt: 'Report cover', position: 'header', width: 560 }],
        analytics: { template_id: 'content-offer-report', step_name: 'report_offer', intent: 'offer', mode: 'any' }
      },
      { type: 'delay', hours: 72 },
      { 
        type: 'email', 
        subject: 'Re: industry report', 
        body_html: `<p>Want me to send the TL;DR if you're short on time?</p>`,
        analytics: { template_id: 'content-offer-report', step_name: 'soft_followup', intent: 'followup', mode: 'any' }
      }
    ]
  },

  {
    id: 'pricing-offer-followup',
    name: 'Pricing Offer — Limited Window',
    description: 'Time-boxed pricing review for qualified accounts.',
    channel: 'email',
    tags: ['pricing', 'offer', 'qualified'],
    sequence: [
      {
        type: 'email',
        subject: 'Window for {{lane}} pricing review',
        body_html: `
<p>We're reviewing {{lane}} pricing with select teams this week (limited slots).</p>
<p>If you'd like a quick benchmark or lane audit, happy to include {{company}}.</p>`,
        ctas: [{ label: 'Grab a slot', href: "{{tracking_link('book-pricing')}}", variant: 'primary', icon: 'calendar' }],
        analytics: { template_id: 'pricing-offer-followup', step_name: 'pricing_offer', intent: 'offer', mode: 'any' }
      },
      { type: 'delay', hours: 24 },
      { 
        type: 'email', 
        subject: 'Last call — {{lane}} pricing window', 
        body_html: `<p>Final nudge in case timing works.</p>`,
        analytics: { template_id: 'pricing-offer-followup', step_name: 'urgent_followup', intent: 'followup', mode: 'any' }
      }
    ]
  }
]

export default TEMPLATES