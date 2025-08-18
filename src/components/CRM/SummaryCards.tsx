import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Target, TrendingUp, Users, Send, MessageSquare, Calendar, Plus } from "lucide-react";

export function SummaryCards() {
  const emailData = {
    sent: 47,
    opened: 38,
    replied: 12,
    scheduled: 8,
    recent: [
      { contact: "John Smith", subject: "Logistics Partnership Proposal", status: "opened", time: "2h ago" },
      { contact: "Sarah Johnson", subject: "Follow-up: Ocean Freight Quote", status: "replied", time: "4h ago" },
      { contact: "Mike Chen", subject: "Container Shipping Rates", status: "sent", time: "1d ago" }
    ]
  };

  const campaignData = {
    active: 12,
    completed: 28,
    leads: 234,
    conversion: "15.8%",
    recent: [
      { name: "Q1 Asia-Pacific Expansion", status: "active", leads: 45, conversion: "18%" },
      { name: "Ocean Freight Promotion", status: "active", leads: 67, conversion: "12%" },
      { name: "Container Optimization", status: "completed", leads: 89, conversion: "22%" }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Email Summary Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            Email Activity
            <Badge variant="secondary" className="ml-auto">
              {emailData.sent} sent
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{emailData.opened}</div>
              <div className="text-xs text-slate-500">Opened</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{emailData.replied}</div>
              <div className="text-xs text-slate-500">Replied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{emailData.scheduled}</div>
              <div className="text-xs text-slate-500">Scheduled</div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-sm font-medium text-slate-700">Recent Activity</div>
            {emailData.recent.map((email, index) => (
              <div key={index} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded">
                <div className="flex-1">
                  <div className="font-medium truncate">{email.contact}</div>
                  <div className="text-slate-500 truncate">{email.subject}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={email.status === 'replied' ? 'default' : email.status === 'opened' ? 'secondary' : 'outline'} 
                    className="text-xs"
                  >
                    {email.status}
                  </Badge>
                  <span className="text-slate-400">{email.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Send className="w-4 h-4 mr-1" />
              Compose
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Summary Card */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Campaign Performance
            <Badge variant="secondary" className="ml-auto">
              {campaignData.active} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{campaignData.leads}</div>
              <div className="text-xs text-slate-500">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{campaignData.conversion}</div>
              <div className="text-xs text-slate-500">Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{campaignData.completed}</div>
              <div className="text-xs text-slate-500">Completed</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="text-sm font-medium text-slate-700">Active Campaigns</div>
            {campaignData.recent.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded">
                <div className="flex-1">
                  <div className="font-medium truncate">{campaign.name}</div>
                  <div className="text-slate-500">{campaign.leads} leads</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={campaign.status === 'active' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {campaign.status}
                  </Badge>
                  <span className="text-green-600 font-medium">{campaign.conversion}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Plus className="w-4 h-4 mr-1" />
              New Campaign
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Target className="w-4 h-4 mr-1" />
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}