import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useCRMAPI } from '@/hooks/useCRMAPI'
import { X, Plus } from 'lucide-react'

interface Contact {
  id: number
  name: string
  title: string
  company: string
  email: string
  phone: string
  location: string
  industry: string
  dealValue: string
  stage: string
  lastContact: string
  tags: string[]
  avatar: string
  status: string
}

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contact?: Contact | null
  mode: 'view' | 'edit' | 'create'
  onSave: (contact: Contact) => void
}

export function ContactModal({ isOpen, onClose, contact, mode, onSave }: ContactModalProps) {
  const { toast } = useToast()
  const { addContact, loading } = useCRMAPI()
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    industry: '',
    dealValue: '',
    stage: 'Discovery',
    tags: [] as string[],
    notes: ''
  })
  
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (contact && (mode === 'view' || mode === 'edit')) {
      setFormData({
        name: contact.name,
        title: contact.title,
        company: contact.company,
        email: contact.email,
        phone: contact.phone,
        location: contact.location,
        industry: contact.industry,
        dealValue: contact.dealValue,
        stage: contact.stage,
        tags: contact.tags,
        notes: ''
      })
    } else if (mode === 'create') {
      setFormData({
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        location: '',
        industry: '',
        dealValue: '',
        stage: 'Discovery',
        tags: [],
        notes: ''
      })
    }
  }, [contact, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'view') return

    try {
      if (mode === 'create') {
        await addContact({
          company_name: formData.company,
          full_name: formData.name,
          title: formData.title,
          email: formData.email,
          phone: formData.phone,
          country: formData.location.split(',')[1]?.trim() || '',
          city: formData.location.split(',')[0]?.trim() || '',
          tags: formData.tags,
          notes: formData.notes
        })
        toast({
          title: "Contact Created",
          description: `${formData.name} has been added to your CRM`,
        })
      } else {
        // For edit mode, we'll simulate success for now
        toast({
          title: "Contact Updated",
          description: `${formData.name} has been updated`,
        })
      }

      // Create updated contact object for parent component
      const updatedContact: Contact = {
        id: contact?.id || Date.now(),
        name: formData.name,
        title: formData.title,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        industry: formData.industry,
        dealValue: formData.dealValue,
        stage: formData.stage,
        lastContact: contact?.lastContact || 'Just now',
        tags: formData.tags,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        status: 'active'
      }

      onSave(updatedContact)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save contact",
        variant: "destructive"
      })
    }
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Contact' : 
             mode === 'edit' ? 'Edit Contact' : 
             'Contact Details'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isReadOnly}
                required
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                disabled={isReadOnly}
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                disabled={isReadOnly}
                placeholder="City, Country"
              />
            </div>
            <div>
              <Label htmlFor="dealValue">Deal Value</Label>
              <Input
                id="dealValue"
                value={formData.dealValue}
                onChange={(e) => setFormData(prev => ({ ...prev, dealValue: e.target.value }))}
                disabled={isReadOnly}
                placeholder="$100K"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stage">Stage</Label>
            <select
              id="stage"
              value={formData.stage}
              onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Discovery">Discovery</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  {!isReadOnly && (
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  )}
                </Badge>
              ))}
            </div>
            {!isReadOnly && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              disabled={isReadOnly}
              rows={4}
              placeholder="Add notes about this contact..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : mode === 'create' ? 'Create Contact' : 'Save Changes'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}