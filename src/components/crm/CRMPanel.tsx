import * as React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, List, Mail, ExternalLink, Plus } from 'lucide-react';
import { CRMCardView } from './CRMCardView';
import { CRMListView } from './CRMListView';
import { CRMFeaturedCards } from './CRMFeaturedCards';
import ContactDrawer from './ContactDrawer';
import { toast } from 'sonner';

export default function CRMPanel(){
  const [rows,setRows]=React.useState<any[]>([]);
  const [loading,setLoading]=React.useState(false);
  const [open,setOpen]=React.useState(false);
  const [company,setCompany]=React.useState<string>('');
  const [shipments,setShipments]=React.useState<any[]>([]);
  const [viewMode, setViewMode] = React.useState<'cards' | 'list'>('cards');

  const load=async()=>{
    setLoading(true);
    try{ 
      const { data, error } = await supabase.from('crm_contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setRows(data||[]);
    }
    finally{ setLoading(false); }
  };
  React.useEffect(()=>{load()},[]);

  const onRowClick=(r:any)=>{ setCompany(r.company_name||''); setShipments([]); setOpen(true); };

  const handleEmailContact = (contact: any) => {
    if (contact.email) {
      window.location.href = `mailto:${contact.email}`;
    } else {
      toast.error('No email address available for this contact');
    }
  };

  const handleLinkedInContact = (contact: any) => {
    if (contact.linkedin_url) {
      window.open(contact.linkedin_url, '_blank');
    } else {
      toast.error('No LinkedIn profile available for this contact');
    }
  };

  const handleAddToCampaign = (contact: any) => {
    toast.success(`${contact.company_name} added to campaign!`);
    // TODO: Implement campaign addition
  };

  const enrichViaApollo=async()=>{
    if(!company) return;
    try {
      const { error } = await supabase.functions.invoke('enrich-apollo', { 
        body: { company } 
      });
      if (error) throw error;
      await load();
    } catch(e) { console.error('Apollo enrichment failed:', e); }
  };
  const enrichFallback=async()=>{
    if(!company) return;
    try {
      const { error } = await supabase.functions.invoke('enrich-phantombuster', { 
        body: { company, titles: ["Head of Supply Chain","Director of Logistics","Procurement Manager"] } 
      });
      if (error) throw error;
    } catch(e) { console.error('PhantomBuster enrichment failed:', e); }
  };

  return (
    <div className="space-y-6">
      {/* CRM Featured Cards */}
      <CRMFeaturedCards />

      {/* Header with View Toggle */}
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              {loading ? 'Loading…' : `${rows.length} contacts`}
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="flex items-center gap-2 h-8"
              >
                <LayoutGrid className="h-4 w-4" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 h-8"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Button 
              onClick={enrichViaApollo} 
              variant="default"
              size="sm"
              className="shadow-sm"
            >
              Enrich via Apollo
            </Button>
            <Button 
              onClick={enrichFallback} 
              variant="outline"
              size="sm"
            >
              LinkedIn Fallback
            </Button>
          </div>
        </div>
      </div>

      {/* Contacts View */}
      {viewMode === 'cards' ? (
        <CRMCardView
          contacts={rows}
          onContactClick={onRowClick}
          onEmailContact={handleEmailContact}
          onLinkedInContact={handleLinkedInContact}
          onAddToCampaign={handleAddToCampaign}
        />
      ) : (
        <CRMListView
          contacts={rows}
          onContactClick={onRowClick}
          onEmailContact={handleEmailContact}
          onLinkedInContact={handleLinkedInContact}
          onAddToCampaign={handleAddToCampaign}
        />
      )}

      <ContactDrawer open={open} onClose={()=>setOpen(false)} company={company} shipments={shipments}/>
    </div>
  );
}