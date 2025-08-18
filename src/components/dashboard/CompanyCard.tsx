import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Mail, Phone, MapPin, ExternalLink, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAPI } from "@/hooks/useAPI"

interface CompanyCardProps {
  company: {
    name: string
    logo?: string
    contact?: {
      name?: string
      title?: string
      email?: string
      phone?: string
    }
    location?: string
    status?: 'Hot Lead' | 'Prospect' | 'Customer' | 'Cold'
    industry?: string
    revenue?: string
    shipments?: number
    trade_volume_usd?: number
    company_id?: string
  }
  source?: string
  onAddedToCRM?: () => void
}

export function CompanyCard({ company, source = "manual", onAddedToCRM }: CompanyCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const { makeRequest } = useAPI()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Hot Lead': return 'bg-red-100 text-red-800 border-red-200'
      case 'Customer': return 'bg-green-100 text-green-800 border-green-200'
      case 'Prospect': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleAddToCRM = async () => {
    try {
      setIsAdding(true)
      
      console.log('🔧 CompanyCard: Starting Add to CRM process')
      console.log('🔧 CompanyCard: Company data:', company)
      console.log('🔧 CompanyCard: Source:', source)
      
      const requestPayload = {
        company: company,
        pipeline_name: 'Search Intelligence',
        stage_name: 'Prospect Identified',
        source: source
      }
      
      console.log('🔧 CompanyCard: Request payload:', requestPayload)
      
      const response = await makeRequest('/crm-add-from-search', {
        method: 'POST',
        body: requestPayload
      })

      console.log('🔧 CompanyCard: API Response:', response)

      if (response?.success) {
        console.log('🔧 CompanyCard: Success - adding to pipeline')
        toast({
          title: "Success",
          description: response.message || `${company.name} added to CRM pipeline`
        })
        onAddedToCRM?.()
      } else {
        console.log('🔧 CompanyCard: Error response:', response)
        throw new Error(response?.error || 'Failed to add to CRM')
      }
    } catch (error) {
      console.error('🔧 CompanyCard: Exception caught:', error)
      toast({
        title: "Error",
        description: "Failed to add company to CRM",
        variant: "destructive"
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={company.logo} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <Building2 className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground">{company.name}</h3>
                <p className="text-sm text-muted-foreground">{company.industry || 'Unknown Industry'}</p>
              </div>
              {company.status && (
                <Badge className={getStatusColor(company.status)}>
                  {company.status}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              {company.contact && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-card-foreground">{company.contact.name || 'Contact Available'}</span>
                    {company.contact.title && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{company.contact.title}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {company.contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {company.contact.email}
                      </div>
                    )}
                    {company.contact.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {company.contact.phone}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {company.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {company.location}
                </div>
              )}
              
              {company.revenue && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Revenue: </span>
                  <span className="font-medium text-card-foreground">{company.revenue}</span>
                </div>
              )}

              {company.trade_volume_usd && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Trade Volume: </span>
                  <span className="font-medium text-card-foreground">
                    ${(company.trade_volume_usd / 1000000).toFixed(1)}M
                  </span>
                </div>
              )}
              
              {company.shipments && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Shipments: </span>
                  <span className="font-medium text-card-foreground">{company.shipments.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="default" 
                onClick={handleAddToCRM}
                disabled={isAdding}
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Pipeline
                  </>
                )}
              </Button>
              {company.contact?.email && (
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
              )}
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}