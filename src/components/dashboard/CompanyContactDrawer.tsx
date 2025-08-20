import { useState, useEffect } from "react";
import { 
  X, Building2, MapPin, Globe, Calendar, Ship, TrendingUp, TrendingDown, 
  Plus, Star, Eye, ExternalLink, Phone, Mail, Linkedin, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CompanyContactDrawerProps {
  company: any;
  isOpen: boolean;
  onClose: () => void;
  userPlan?: 'free' | 'pro' | 'enterprise';
}

interface BenchmarkData {
  volume: number;
  unit: string;
  percentChange: number;
  industryAverage: number;
  industryRank: number;
}

export function CompanyContactDrawer({ 
  company, 
  isOpen, 
  onClose, 
  userPlan = 'free' 
}: CompanyContactDrawerProps) {
  const [timeRange, setTimeRange] = useState("quarterly");
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isContactInfoLocked = userPlan === 'free';

  useEffect(() => {
    if (isOpen && company) {
      fetchBenchmarkData();
    }
  }, [isOpen, company, timeRange]);

  const fetchBenchmarkData = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBenchmarkData({
        volume: 12450,
        unit: "TEU",
        percentChange: 12.5,
        industryAverage: 9850,
        industryRank: 8
      });
    } catch (error) {
      console.error('Failed to fetch benchmark data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCRM = async () => {
    try {
      // Mock CRM addition - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: `${company.name} has been added to your CRM`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add company to CRM",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(0)}M`;
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-2xl h-full card-glass shadow-2xl overflow-y-auto transform transition-transform duration-300 animate-in slide-in-from-right">
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-card via-card/95 to-card/90 backdrop-blur-sm border-b border-border/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-primary/20">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{company.name}</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge variant="secondary" className="bg-secondary/50">
                      {company.industry}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company.location}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={handleAddToCRM} size="sm" className="shadow-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to CRM
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Section */}
        <div className="p-6 space-y-6">
          <Card className="bg-gradient-to-br from-card to-card/80 shadow-lg ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary" />
                Key Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Trade Volume</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(company.trade_volume_usd)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Shipment Count</p>
                <p className="text-2xl font-bold text-foreground">
                  {company.shipment_count?.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Shipment</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(company.last_shipment_at)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <p className="text-lg font-semibold text-foreground">{company.confidence}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trends & Benchmarks Section */}
          <Card className="bg-gradient-to-br from-card to-card/80 shadow-lg ring-1 ring-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Trends & Benchmarks
                </CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : benchmarkData ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Current Volume</p>
                      <p className="text-2xl font-bold text-foreground">
                        {benchmarkData.volume.toLocaleString()} {benchmarkData.unit}
                      </p>
                      <div className="flex items-center space-x-1">
                        {benchmarkData.percentChange > 0 ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          benchmarkData.percentChange > 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {Math.abs(benchmarkData.percentChange)}%
                        </span>
                        <span className="text-sm text-muted-foreground">vs previous period</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Industry Average</p>
                      <p className="text-2xl font-bold text-foreground">
                        {benchmarkData.industryAverage.toLocaleString()} {benchmarkData.unit}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Industry Rank: #{benchmarkData.industryRank}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No benchmark data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information Section */}
          <Card className="bg-gradient-to-br from-card to-card/80 shadow-lg ring-1 ring-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Contact Information
                {isContactInfoLocked && (
                  <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">
                    Upgrade Required
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isContactInfoLocked ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Unlock Contact Details</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upgrade to Pro or Enterprise to access verified contact information
                    </p>
                    <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mock contact data - replace with actual contacts */}
                  <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">Sarah Chen</h4>
                        <p className="text-sm text-muted-foreground">VP of Procurement</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">95% confidence</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-foreground">sarah.chen@{company.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-foreground">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Linkedin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-primary">LinkedIn Profile</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Add to Watchlist
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Company Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}