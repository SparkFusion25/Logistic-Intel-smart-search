import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Mail, Phone, MapPin, ExternalLink, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useAPI } from "@/hooks/useAPI"
import { ComprehensiveDealDrawer } from "@/components/CRM/ComprehensiveDealDrawer"

interface CompanyCardProps {
  company: {
    name: string
    logo?: string
    contact?: {
      name?: string
      title?: string
      email?: string
      phone?: string
      linkedin?: string
      company_website?: string
    }
    location?: string
    status?: 'Hot Lead' | 'Prospect' | 'Customer' | 'Cold'
    industry?: string
    revenue?: string
    employees?: string
    shipments?: number
    trade_volume_usd?: number
    company_id?: string
    // Additional fields from Excel mapping
    consignee_industry?: string
    shipper_industry?: string
    consignee_revenue?: string
    shipper_revenue?: string
    consignee_employees?: string
    shipper_employees?: string
    consignee_email_1?: string
    consignee_phone_1?: string
    shipper_email_1?: string
    shipper_phone_1?: string
    consignee_website_1?: string
    last_shipment_at?: string
    confidence?: number
    trend?: string
  }
  source?: string
  onAddedToCRM?: () => void
}

export function CompanyCard({ company, source = "manual", onAddedToCRM }: CompanyCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const { toast } = useToast()
  const { request } = useAPI()

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
      
      const response = await request('/crm-add-from-search', {
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
    <Card 
      className={cn(
        "card card-gloss cursor-pointer p-2 sm:p-2.5 transition-all duration-200 hover:shadow-glossy",
        "hover:-translate-y-0.5 group touch-manipulation",
        "min-h-20 sm:min-h-24 w-72 xl:w-80"
      )}
      onClick={() => setShowDetailsDrawer(true)}
    >
      <CardContent className="p-4">
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
              {(company.contact || company.consignee_email_1 || company.shipper_email_1) && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-card-foreground">
                      {company.contact?.name || 'Contact Available'}
                    </span>
                    {company.contact?.title && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{company.contact.title}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {(company.contact?.email || company.consignee_email_1 || company.shipper_email_1) && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {company.contact?.email || company.consignee_email_1 || company.shipper_email_1}
                      </div>
                    )}
                    {(company.contact?.phone || company.consignee_phone_1 || company.shipper_phone_1) && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {company.contact?.phone || company.consignee_phone_1 || company.shipper_phone_1}
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
              
              {(company.revenue || company.consignee_revenue || company.shipper_revenue) && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Revenue: </span>
                  <span className="font-medium text-card-foreground">
                    {company.revenue || company.consignee_revenue || company.shipper_revenue}
                  </span>
                </div>
              )}

              {(company.employees || company.consignee_employees || company.shipper_employees) && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Employees: </span>
                  <span className="font-medium text-card-foreground">
                    {company.employees || company.consignee_employees || company.shipper_employees}
                  </span>
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
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleAddToCRM();
                }}
                disabled={isAdding}
                className="btn btn-primary text-xs"
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
                <Button 
                  size="sm" 
                  className="btn btn-ghost text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
              )}
              <Button 
                size="sm" 
                className="btn btn-ghost text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      <ComprehensiveDealDrawer 
        open={showDetailsDrawer}
        onOpenChange={setShowDetailsDrawer}
        dealId={company.company_id || `temp-${company.name}`}
        companyData={company}
      />
    </Card>
  )
}