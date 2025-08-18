"use client";

import { useState, useEffect } from "react";
import { useAPI } from "@/hooks/useAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit2, Trash2, Search, Filter, MoreHorizontal, DollarSign, Calendar, User, Building2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ComprehensiveDealDrawer } from "./ComprehensiveDealDrawer";
import { supabase } from "@/integrations/supabase/client";

interface Deal {
  id: string;
  title: string;
  company_name: string | null;
  value_usd: number | null;
  currency: string | null;
  expected_close_date: string | null;
  status: string;
  stage_id: string;
  contact_id: string | null;
  created_at: string;
  updated_at: string;
  contact_name?: string | null;
  probability?: number | null;
}

interface Stage {
  id: string;
  name: string;
  stage_order: number;
}

interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
}

interface DealsListViewProps {
  pipelineId?: string;
}

export function DealsListView({ pipelineId }: DealsListViewProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState(pipelineId || "");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { makeRequest } = useAPI();
  const { toast } = useToast();

  const loadPipelines = async () => {
    try {
      const response = await makeRequest("crm-pipelines");
      if (response?.success && response?.data) {
        setPipelines(response.data);
        if (!selectedPipeline && response.data.length > 0) {
          setSelectedPipeline(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load pipelines:", error);
    }
  };

  const loadDeals = async (pipeline: string) => {
    if (!pipeline) return;
    
    setLoading(true);
    try {
      const response = await makeRequest("crm-deals", {
        method: "GET",
        params: { pipeline_id: pipeline }
      });
      
      if (response?.success && response?.data) {
        setDeals(response.data);
      }
    } catch (error) {
      console.error("Failed to load deals:", error);
      toast({
        title: "Error",
        description: "Failed to load deals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDeal = async (dealId: string) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;

      toast({
        title: "Deal Deleted",
        description: "Deal has been successfully deleted"
      });

      // Refresh deals list
      loadDeals(selectedPipeline);
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast({
        title: "Error",
        description: "Failed to delete deal. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadPipelines();
  }, []);

  useEffect(() => {
    if (selectedPipeline) {
      loadDeals(selectedPipeline);
    }
  }, [selectedPipeline]);

  useEffect(() => {
    let filtered = deals;

    // Filter by stage
    if (selectedStage !== "all") {
      filtered = filtered.filter(deal => deal.stage_id === selectedStage);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.title?.toLowerCase().includes(query) ||
        deal.company_name?.toLowerCase().includes(query) ||
        deal.contact_name?.toLowerCase().includes(query)
      );
    }

    setFilteredDeals(filtered);
  }, [deals, selectedStage, searchQuery]);

  const currentPipeline = pipelines.find(p => p.id === selectedPipeline);
  const stages = currentPipeline?.stages || [];

  const getStageInfo = (stageId: string) => {
    return stages.find(s => s.id === stageId);
  };

  const getStageColor = (stageName: string) => {
    const colorMap: Record<string, string> = {
      'Prospect Identified': 'bg-blue-100 text-blue-800',
      'Initial Contact': 'bg-yellow-100 text-yellow-800',
      'Qualified Lead': 'bg-purple-100 text-purple-800',
      'Proposal Sent': 'bg-orange-100 text-orange-800',
      'Negotiation': 'bg-red-100 text-red-800',
      'Won': 'bg-green-100 text-green-800',
      'Lost': 'bg-gray-100 text-gray-800',
    };
    return colorMap[stageName] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals List View</h1>
          <p className="text-gray-600">Manage and filter your sales deals</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Pipeline Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pipeline</label>
              <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map((pipeline) => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stage Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Stage</label>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger>
                  <SelectValue placeholder="All stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search deals, companies, contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
            <span>
              Showing {filteredDeals.length} of {deals.length} deals
            </span>
            <span>•</span>
            <span>
              Total Value: {formatCurrency(filteredDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0))}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Close Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchQuery || selectedStage !== "all" 
                        ? "No deals match your filters" 
                        : "No deals found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((deal) => {
                    const stageInfo = getStageInfo(deal.stage_id);
                    return (
                      <TableRow key={deal.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{deal.title}</div>
                            <div className="text-xs text-gray-500">
                              Created {formatDate(deal.created_at)}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>{deal.company_name || '-'}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {stageInfo && (
                            <Badge className={getStageColor(stageInfo.name)}>
                              {stageInfo.name}
                            </Badge>
                          )}
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            {formatCurrency(deal.value_usd)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(deal.expected_close_date)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{deal.contact_name || '-'}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDeal(deal);
                                  setDrawerOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Deal
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="cursor-pointer text-red-600"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Deal
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Deal</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{deal.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteDeal(deal.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Deal Details Drawer */}
      {selectedDeal && (
        <ComprehensiveDealDrawer
          open={drawerOpen}
          onOpenChange={(open) => {
            setDrawerOpen(open);
            if (!open) {
              setSelectedDeal(null);
            }
          }}
          dealId={selectedDeal.id}
        />
      )}
    </div>
  );
}