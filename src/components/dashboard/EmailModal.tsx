import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmailComposer } from '@/components/CRM/EmailComposer'

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
  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Send Email to {contact.name}</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <EmailComposer 
            contact={{
              name: contact.name,
              email: contact.email,
              company: contact.company
            }}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}