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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 50;

  const { request } = useAPI();
  const { toast } = useToast();

  const loadPipelines = async () => {
    try {
      const response = await request("crm-pipelines");
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
      const response = await request("crm-deals", {
        method: "GET",
        params: { 
          pipeline_id: pipeline,
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          stage_id: selectedStage !== "all" ? selectedStage : undefined
        }
      });
      
      if (response?.success && response?.data) {
        setDeals(response.data);
        setTotalCount(response.total_count || response.data.length);
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
      setCurrentPage(1); // Reset to first page when pipeline changes
      loadDeals(selectedPipeline);
    }
  }, [selectedPipeline, currentPage, searchQuery, selectedStage]);

  // Apply filters locally (since we're using server-side pagination)
  useEffect(() => {
    setFilteredDeals(deals);
  }, [deals]);

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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Header with Pipeline Styling */}
      <div className="border-b bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            {/* Title and Summary Cards */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              <div className="mb-3 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Deals List View
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage and filter your sales deals</p>
              </div>
            {/* Summary Cards - Mobile Optimized */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200 min-w-[140px] flex-1 sm:flex-none">
                <span className="text-slate-500 font-medium text-xs sm:text-sm">Deals</span>
                <div className="text-xl sm:text-2xl font-bold text-slate-800">{filteredDeals.length}</div>
              </div>
              <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200 min-w-[140px] flex-1 sm:flex-none">
                <span className="text-slate-500 font-medium text-xs sm:text-sm">Value</span>
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {formatCurrency(filteredDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0))}
                </div>
              </div>
              <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200 min-w-[140px] flex-1 sm:flex-none">
                <div className="flex items-center gap-1 mb-1">
                  <Building2 className="w-3 h-3 text-blue-500" />
                  <span className="text-slate-500 font-medium text-xs sm:text-sm">Companies</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {new Set(filteredDeals.map(d => d.company_name).filter(Boolean)).size}
                </div>
              </div>
              <div className="bg-white rounded-xl px-3 py-2 sm:px-4 shadow-sm border border-slate-200 min-w-[140px] flex-1 sm:flex-none">
                <div className="flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-purple-500" />
                  <span className="text-slate-500 font-medium text-xs sm:text-sm">Contacts</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {new Set(filteredDeals.map(d => d.contact_name).filter(Boolean)).size}
                </div>
              </div>
            </div>
            </div>
            
            {/* Export Button */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white hover:bg-slate-50 border-slate-200 rounded-xl shadow-sm"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters with Pipeline Styling */}
      <div className="px-4 sm:px-6 pb-4">
        <Card className="border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <Filter className="h-5 w-5 text-blue-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Pipeline Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Pipeline</label>
                <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
                  <SelectTrigger className="bg-white border-slate-200 rounded-xl shadow-sm">
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
                <label className="text-sm font-medium text-slate-700">Stage</label>
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="bg-white border-slate-200 rounded-xl shadow-sm">
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
                <label className="text-sm font-medium text-slate-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search deals, companies, contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Results Summary with Pagination Info */}
            <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} deals
                </span>
                <span>•</span>
                <span>
                  Total Value: {formatCurrency(filteredDeals.reduce((sum, deal) => sum + (deal.value_usd || 0), 0))}
                </span>
              </div>
              
              {/* Pagination Controls */}
              {Math.ceil(totalCount / itemsPerPage) > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(Math.min(5, Math.ceil(totalCount / itemsPerPage)))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink 
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / itemsPerPage), prev + 1))}
                        className={currentPage >= Math.ceil(totalCount / itemsPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals Table with Pipeline Styling */}
      <div className="px-4 sm:px-6 flex-1 overflow-hidden">
        <Card className="h-full border-slate-200 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardContent className="p-0 h-full">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="text-slate-700 font-semibold">Deal</TableHead>
                      <TableHead className="text-slate-700 font-semibold hidden sm:table-cell">Company</TableHead>
                      <TableHead className="text-slate-700 font-semibold">Stage</TableHead>
                      <TableHead className="text-right text-slate-700 font-semibold hidden md:table-cell">Value</TableHead>
                      <TableHead className="text-slate-700 font-semibold hidden lg:table-cell">Close Date</TableHead>
                      <TableHead className="text-slate-700 font-semibold hidden lg:table-cell">Contact</TableHead>
                      <TableHead className="text-right text-slate-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                          {searchQuery || selectedStage !== "all" 
                            ? "No deals match your filters" 
                            : "No deals found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDeals.map((deal) => {
                        const stageInfo = getStageInfo(deal.stage_id);
                        return (
                          <TableRow 
                            key={deal.id} 
                            className="hover:bg-blue-50/50 transition-colors border-slate-200 cursor-pointer group"
                            onClick={() => {
                              setSelectedDeal(deal);
                              setDrawerOpen(true);
                            }}
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors">
                                  {deal.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  Created {formatDate(deal.created_at)}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-slate-700 font-medium">{deal.company_name || '-'}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              {stageInfo && (
                                <Badge className={getStageColor(stageInfo.name)} variant="secondary">
                                  {stageInfo.name}
                                </Badge>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-md p-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                  <DollarSign className="h-2 w-2 text-white" />
                                </div>
                                <span className="text-green-700 font-bold text-sm">
                                  {formatCurrency(deal.value_usd)}
                                </span>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-orange-500" />
                                <span className="text-slate-600 font-medium">{formatDate(deal.expected_close_date)}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                  <User className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-slate-700">{deal.contact_name || '-'}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDeal(deal);
                                      setDrawerOpen(true);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Deal
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem 
                                        className="cursor-pointer text-red-600 hover:text-red-700"
                                        onSelect={(e) => e.preventDefault()}
                                        onClick={(e) => e.stopPropagation()}
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
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            deleteDeal(deal.id);
                                          }}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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