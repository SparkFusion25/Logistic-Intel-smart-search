// src/components/search/SearchPanel.tsx
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useUnifiedSearch } from '@/hooks/useUnifiedSearch';
import type { Mode, Filters, UnifiedRow } from '@/types/search';
import AdvancedFilters from './AdvancedFilters';
import ConfidenceIndicator from './ConfidenceIndicator';
import { Highlight } from '@/lib/highlight';
import { upper } from '@/lib/strings';
import AIAssistBar from '@/components/search/AIAssistBar';
import { PaginationControls } from './PaginationControls';
import { CompanyCard } from './CompanyCard';
import { CompanyDetailsModal } from './CompanyDetailsModal';
import { searchCompaniesAggregated } from '@/repositories/search.repo';
import { toast } from 'sonner';

function ModeToggle({ mode, setMode }:{ mode:Mode; setMode:(m:Mode)=>void }){
  const Btn=(m:Mode,label:string)=>(
    <button
      onClick={()=>setMode(m)}
      className={`pill-glossy font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${
        mode===m ? 'active' : ''
      }`}
    >{label}</button>
  );
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {Btn('all','All')}
      {Btn('air','Air ✈')}
      {Btn('ocean','Ocean 🚢')}
    </div>
  );
}

type ViewType = 'shipments' | 'companies';

function ViewToggle({ view, setView }:{ view:ViewType; setView:(v:ViewType)=>void }){
  const Btn=(v:ViewType,label:string)=>(
    <button
      onClick={()=>setView(v)}
      className={`pill-glossy font-medium text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${
        view===v ? 'active' : ''
      }`}
    >{label}</button>
  );
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {Btn('shipments','Shipments')}
      {Btn('companies','Companies')}
    </div>
  );
}

function ResultRow({ r, q, onAddToCrm }:{ r:UnifiedRow; q:string; onAddToCrm:(row:UnifiedRow)=>void }){
  const companyInitial = r.unified_company_name?.charAt(0).toUpperCase() || '?';
  
  return (
    <div className="bg-card border-2 border-border hover:border-primary/30 rounded-xl p-4 sm:p-6 flex flex-col gap-4 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
            {companyInitial}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              {r.mode?upper(r.mode):'—'}
            </div>
            <div className="font-bold text-sm sm:text-base text-foreground truncate">
              <Highlight text={r.unified_company_name} query={q}/>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ConfidenceIndicator score={r?.score!=null?Number(r.score)*100:null}/>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">HS Code</span>
          <span className="font-bold text-foreground truncate">{r.hs_code||'—'}</span>
        </div>
        <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Origin</span>
          <span className="font-bold text-foreground truncate">{r.origin_country||'—'}</span>
        </div>
        <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Destination</span>
          <span className="font-bold text-foreground truncate">{r.destination_city||r.destination_country||'—'}</span>
        </div>
        <div className="flex flex-col p-3 bg-muted/30 rounded-lg border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Date</span>
          <span className="font-bold text-foreground truncate">{r.unified_date||'—'}</span>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground bg-muted/40 p-4 rounded-lg border border-border/30">
        <div className="font-medium text-foreground mb-1">Description</div>
        <div className="line-clamp-2">{r.description||'No description available'}</div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border/30">
        <button 
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex-1 sm:flex-none" 
          onClick={()=>onAddToCrm(r)}
        >
          + Add to CRM
        </button>
        <button 
          onClick={() => window.open(`https://panjiva.com/search?query=${encodeURIComponent(r.unified_company_name || '')}`, '_blank')}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors border border-border/50 flex-1 sm:flex-none"
        >
          View Trade
        </button>
      </div>
    </div>
  );
}

export default function SearchPanel(){
  const { q,setQ,mode,setMode,filters,setFilters,items,total,loading,error,currentPage,totalPages,run,goToPage }=useUnifiedSearch({ initialMode:'all', initialLimit:50 });
  const [view, setView] = useState<ViewType>('shipments');
  const [companyItems, setCompanyItems] = useState<any[]>([]);
  const [companyTotal, setCompanyTotal] = useState(0);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // Add-to-CRM using Supabase for shipments
  const onAddToCrm=async(row:UnifiedRow)=>{
    try{
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('Please log in to add contacts to CRM');
        return;
      }
      
      const { error } = await supabase.from('crm_contacts').insert({
        org_id: user.user.id,
        company_name: row.unified_company_name || 'Unknown Company',
        source: 'search_unified',
        notes: `Added from search - ${row.mode?.toUpperCase()} shipment on ${row.unified_date || 'unknown date'}`,
        tags: ['search', row.mode || 'unknown', 'prospect'].filter(Boolean)
      });
      if (error) throw error;
      
      toast.success(`Added ${row.unified_company_name} to CRM successfully!`);
    }catch(e){
      console.error('Failed to add to CRM:', e);
      toast.error('Failed to add to CRM. Please try again.');
    }
  };

  // Add-to-CRM for companies
  const onAddCompanyToCrm = async(company: any) => {
    try{
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('Please log in to add contacts to CRM');
        return;
      }
      
      const { error } = await supabase.from('crm_contacts').insert({
        org_id: user.user.id,
        company_name: company.company_name || 'Unknown Company',
        source: 'search_company',
        notes: `Added from company search - ${company.shipments_count} shipments, ${company.contacts_count} contacts`,
        tags: ['company', 'search', 'prospect'],
        country: company.country,
        industry: company.industry
      });
      if (error) throw error;
      
      toast.success(`Added ${company.company_name} to CRM successfully!`);
    }catch(e){
      console.error('Failed to add company to CRM:', e);
      toast.error('Failed to add to CRM. Please try again.');
    }
  };

  // Search companies function
  const runCompanySearch = async () => {
    setCompanyLoading(true);
    try {
      // Filter out null values from filters for company search
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value != null)
      );
      
      const result = await searchCompaniesAggregated({
        q,
        mode,
        ...cleanFilters,
        limit: 50,
        offset: (currentPage - 1) * 50
      });
      
      if (result.success) {
        setCompanyItems(result.data);
        setCompanyTotal(result.total);
      }
    } catch (e) {
      console.error('Company search failed:', e);
    } finally {
      setCompanyLoading(false);
    }
  };

  const handleSearch = () => {
    if (view === 'companies') {
      runCompanySearch();
    } else {
      run();
    }
  };

  const onApplyFilters = () => handleSearch();
  const onClearFilters = () => handleSearch();

  return (
    <div className="flex flex-col space-y-4 sm:space-y-6">
      {/* Unified Search Card */}
      <div className="card-glass p-4 sm:p-6 lg:p-8">
        {/* Search Bar with Mobile-Optimized Layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              onKeyDown={(e)=>{if(e.key==='Enter') run();}}
              placeholder="Search companies, HS codes, carriers, products..."
              className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-background border-2 border-border px-4 sm:px-6 pr-4 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
            />
          </div>
          
          {/* Mobile: Stack toggles and search button */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <ViewToggle view={view} setView={setView}/>
            </div>
            <div className="flex-shrink-0">
              <ModeToggle mode={mode} setMode={setMode}/>
            </div>
            <button 
              onClick={handleSearch} 
              className="btn-primary px-4 sm:px-6 py-2.5 h-12 sm:h-14 disabled:opacity-60 text-sm font-medium rounded-xl sm:rounded-2xl flex-shrink-0" 
              disabled={loading || companyLoading}
            >
              {(loading || companyLoading) ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Card - Mobile Optimized */}
      <div className="card-glass p-4 sm:p-6">
        <AdvancedFilters value={filters as Filters} onChange={setFilters as any} onApply={onApplyFilters} onClear={onClearFilters}/>
      </div>

      {/* AI Assist */}
      <AIAssistBar
        q={q}
        filters={filters}
        lastResults={items}
        onPickSuggestion={(s)=>{ setQ(s); run(); }}
        onApplyStructured={(f)=>{ setFilters((x)=>({ ...(x as Filters), ...(f||{}) })); run(); }}
      />

      {/* Results Summary and Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 rounded-xl border border-border gap-3 sm:gap-0">
        <div className="text-sm text-muted-foreground font-medium">
          {view === 'companies' ? (
            companyLoading ? 'Loading companies…' : `${companyTotal.toLocaleString()} companies found`
          ) : (
            loading ? 'Loading shipments…' : error ? `Error: ${error}` : `${total.toLocaleString()} shipments found`
          )}
          {totalPages > 0 && (
            <span className="ml-2 text-xs">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          loading={loading || companyLoading}
        />
      </div>

      {/* Results Grid - Conditional Rendering */}
      {view === 'companies' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {companyItems.map((company) => (
            <CompanyCard 
              key={company.company_id || company.company_name} 
              company={company}
              onAddToCRM={onAddCompanyToCrm}
              onViewDetails={() => {
                setSelectedCompany(company);
                setShowCompanyModal(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {items.map((r)=>(<ResultRow key={r.id} r={r} q={q} onAddToCrm={onAddToCrm}/>))}
        </div>
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <CompanyDetailsModal
          isOpen={showCompanyModal}
          onClose={() => setShowCompanyModal(false)}
          company={selectedCompany}
        />
      )}
    </div>
  );
}