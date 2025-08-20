import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { TopBar } from "@/components/ui/TopBar"
import CampaignBuilder from "@/components/campaigns/CampaignBuilder"
import { useNavigate } from "react-router-dom"

export default function CampaignBuilderPage() {
  const navigate = useNavigate()

  const handleSave = (campaign: any) => {
    // Navigate back to campaigns list or show success
    navigate('/dashboard/campaigns')
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-3">Campaign Builder</h1>
                <p className="text-lg text-muted-foreground">Create multi-step email and LinkedIn outreach campaigns</p>
              </div>
              
              <CampaignBuilder onSave={handleSave} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}