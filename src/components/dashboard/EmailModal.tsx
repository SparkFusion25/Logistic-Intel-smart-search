import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Send, Paperclip } from 'lucide-react'

interface Contact {
  id: number
  name: string
  email: string
  company: string
}

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
}

export function EmailModal({ isOpen, onClose, contact }: EmailModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [emailData, setEmailData] = useState({
    to: contact?.email || '',
    subject: '',
    body: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // For now, we'll simulate sending an email
      // In a real app, you'd call your email sending API here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Email Sent",
        description: `Email sent successfully to ${contact?.name}`,
      })
      
      onClose()
      setEmailData({ to: '', subject: '', body: '' })
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const emailTemplates = [
    {
      name: "Introduction",
      subject: "Introduction - LogisticIntel Solutions",
      body: `Hi ${contact?.name},\n\nI hope this email finds you well. I'm reaching out to introduce LogisticIntel and discuss how we can help ${contact?.company} optimize your supply chain operations.\n\nWe specialize in providing trade intelligence and logistics insights that can help you:\n- Identify new suppliers and optimize existing relationships\n- Benchmark shipping costs and negotiate better rates\n- Monitor supply chain risks and disruptions\n\nWould you be available for a brief 15-minute call this week to discuss your current logistics challenges?\n\nBest regards,\nYour LogisticIntel Team`
    },
    {
      name: "Follow-up",
      subject: "Following up on our conversation",
      body: `Hi ${contact?.name},\n\nI wanted to follow up on our previous conversation about ${contact?.company}'s logistics needs.\n\nAs discussed, I've prepared some initial insights that might be valuable for your operations. I'd love to share these with you and discuss how we can support your supply chain optimization goals.\n\nWhen would be a good time for a quick call?\n\nBest regards,\nYour LogisticIntel Team`
    },
    {
      name: "Proposal",
      subject: "Proposal for ${contact?.company} - LogisticIntel Partnership",
      body: `Dear ${contact?.name},\n\nThank you for your time yesterday. As promised, I'm sending over our proposal for ${contact?.company}.\n\nBased on our discussion, I believe our trade intelligence platform can deliver significant value by:\n- Reducing logistics costs by 15-20%\n- Improving supplier visibility and risk management\n- Providing real-time market insights\n\nI've attached a detailed proposal with pricing and implementation timeline. I'd be happy to discuss any questions you might have.\n\nLooking forward to partnering with ${contact?.company}.\n\nBest regards,\nYour LogisticIntel Team`
    }
  ]

  const useTemplate = (template: typeof emailTemplates[0]) => {
    setEmailData(prev => ({
      ...prev,
      subject: template.subject.replace('${contact?.company}', contact?.company || ''),
      body: template.body
        .replace(/\${contact\.name}/g, contact?.name || '')
        .replace(/\${contact\.company}/g, contact?.company || '')
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Email to {contact?.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Email Templates */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Email Templates</h3>
            <div className="space-y-2">
              {emailTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => useTemplate(template)}
                  className="w-full justify-start"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Email Composer */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={emailData.subject}
                  onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  value={emailData.body}
                  onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
                  rows={15}
                  required
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button type="button" variant="outline" size="sm">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach File
                </Button>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}