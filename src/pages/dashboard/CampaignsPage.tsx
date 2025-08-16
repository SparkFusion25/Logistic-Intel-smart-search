import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Play, Pause, BarChart3, Users, Mail, MessageCircle, Calendar } from 'lucide-react'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Link } from 'react-router-dom'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Mock data for now
    setCampaigns([])
    setLoading(false)
  }, [])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-3">Campaigns</h1>
                  <p className="text-lg text-muted-foreground">Manage your email and LinkedIn outreach campaigns</p>
                </div>
                <div className="mt-6 lg:mt-0">
                  <Link to="/dashboard/campaigns/builder">
                    <Button className="bg-gradient-to-r from-primary to-primary-variant">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-muted/50 to-muted/20 border-border/50">
                <CardContent className="p-12 text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-6 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Campaign System Ready</h3>
                  <p className="text-muted-foreground mb-6">Create email and LinkedIn campaigns with automated sequences</p>
                  <Link to="/dashboard/campaigns/builder">
                    <Button className="bg-gradient-to-r from-primary to-primary-variant">
                      <Plus className="w-5 h-5 mr-2" />
                      Create First Campaign
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}