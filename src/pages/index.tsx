import { AppShell } from "@/components/ui/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Mail, FileText, Calculator, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <AppShell>
      <PageHeader 
        title="Welcome to Logistic Intel" 
        description="Your comprehensive logistics intelligence platform"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              View your logistics overview and key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access your main dashboard with real-time data and insights.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>
              Search and analyze shipping data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Powerful search capabilities for logistics intelligence.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>CRM</CardTitle>
            <CardDescription>
              Manage customer relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Comprehensive CRM tools for your logistics business.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Index;