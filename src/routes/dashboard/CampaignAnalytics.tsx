import { BarChart3, TrendingUp, Mail, Users } from 'lucide-react';

export default function CampaignAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Campaign Analytics</h1>
        <p className="text-muted-foreground">Track performance and optimize your campaigns</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Rate</p>
              <p className="text-2xl font-bold text-foreground">24.5%</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Click Rate</p>
              <p className="text-2xl font-bold text-foreground">8.2%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Responses</p>
              <p className="text-2xl font-bold text-foreground">156</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion</p>
              <p className="text-2xl font-bold text-foreground">12.3%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
        <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
      </div>
    </div>
  );
}