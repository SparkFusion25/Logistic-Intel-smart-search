import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, 
  Mail, 
  Linkedin, 
  ExternalLink, 
  Ship, 
  Plane, 
  Calendar, 
  Plus, 
  Rocket,
  StickyNote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ContactDrawer from '@/components/crm/ContactDrawer';

interface CompanyData {
  id: string;
  company_name: string;
  contact_count: number;
  shipment_count: number;
  last_activity: string | null;
  air_shipments: number;
  ocean_shipments: number;
  primary_contact?: {
    name: string | null;
    email: string | null;
    title: string | null;
    linkedin_url: string | null;
  };
  created_at: string;
}

export function RecentCompaniesCard() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const itemsPerPage = 6;
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const displayedCompanies = companies.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    loadRecentCompanies();
  }, []);

  const loadRecentCompanies = async () => {
    try {
      // Get companies with contact counts and shipment data
      const { data: companyData, error } = await supabase
        .from('crm_contacts')
        .select(`
          company_name,
          created_at,
          full_name,
          email,
          title,
          linkedin_url
        `)
        .not('company_name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(25);

      if (error) throw error;

      // Group by company and get primary contact + counts
      const companyMap = new Map<string, any>();
      
      companyData?.forEach(contact => {
        const companyName = contact.company_name!;
        if (!companyMap.has(companyName)) {
          companyMap.set(companyName, {
            id: companyName.replace(/[^a-zA-Z0-9]/g, '_'),
            company_name: companyName,
            contact_count: 0,
            created_at: contact.created_at,
            contacts: []
          });
        }
        
        const company = companyMap.get(companyName);
        company.contact_count++;
        company.contacts.push(contact);
        
        // Set primary contact (first one with most data)
        if (!company.primary_contact || 
           (contact.email && !company.primary_contact.email) ||
           (contact.full_name && !company.primary_contact.name)) {
          company.primary_contact = {
            name: contact.full_name,
            email: contact.email,
            title: contact.title,
            linkedin_url: contact.linkedin_url
          };
        }
      });

      // Get shipment counts for each company
      const companiesList: CompanyData[] = [];
      for (const company of Array.from(companyMap.values())) {
        try {
          const { data: shipmentData } = await supabase
            .from('unified_shipments')
            .select('mode, unified_date')
            .ilike('unified_company_name', `%${company.company_name}%`)
            .order('unified_date', { ascending: false })
            .limit(100);

          const airShipments = shipmentData?.filter(s => s.mode === 'air').length || 0;
          const oceanShipments = shipmentData?.filter(s => s.mode === 'ocean').length || 0;
          const lastActivity = shipmentData?.[0]?.unified_date || null;

          companiesList.push({
            ...company,
            shipment_count: airShipments + oceanShipments,
            air_shipments: airShipments,
            ocean_shipments: oceanShipments,
            last_activity: lastActivity
          });
        } catch (err) {
          console.warn(`Failed to get shipments for ${company.company_name}:`, err);
          companiesList.push({
            ...company,
            shipment_count: 0,
            air_shipments: 0,
            ocean_shipments: 0,
            last_activity: null
          });
        }
      }

      setCompanies(companiesList.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Failed to load companies:', error);
      toast({
        title: "Failed to load companies",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailContact = (company: CompanyData) => {
    if (company.primary_contact?.email) {
      navigate(`/dashboard/email?to=${encodeURIComponent(company.primary_contact.email)}&company=${encodeURIComponent(company.company_name)}`);
    } else {
      toast({
        title: "No email available",
        description: "This company doesn't have a primary email contact",
        variant: "destructive"
      });
    }
  };

  const handleLinkedInConnect = (company: CompanyData) => {
    if (company.primary_contact?.linkedin_url) {
      window.open(company.primary_contact.linkedin_url, '_blank');
    } else {
      // Generate LinkedIn company search
      const searchQuery = company.company_name;
      window.open(`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  };

  const handleViewCompany = (company: CompanyData) => {
    setSelectedCompany(company.company_name);
    setDrawerOpen(true);
  };

  const handleAddToCampaign = (company: CompanyData) => {
    navigate(`/dashboard/campaigns?company=${encodeURIComponent(company.company_name)}`);
  };

  const handleScheduleMeeting = (company: CompanyData) => {
    // For now, open external calendar
    const subject = `Meeting with ${company.company_name}`;
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(subject)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleAddNotes = (company: CompanyData) => {
    toast({
      title: "Add Notes",
      description: `Notes feature for ${company.company_name} would open here`,
    });
  };

  if (loading) {
    return (
      <div className="card-surface p-6 animate-fade-in-up">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card-surface p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Recent Companies Added</h3>
              <p className="text-sm text-muted-foreground">Companies recently added to CRM</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-muted-foreground px-2">
                  {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            <button
              onClick={() => navigate('/dashboard/crm')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary font-medium text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Company
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No companies yet</h4>
              <p className="text-muted-foreground mb-6">Start building your CRM by adding companies</p>
              <button 
                onClick={() => navigate('/dashboard/crm')} 
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Company
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedCompanies.map((company) => (
                <div
                  key={company.id}
                  className="p-4 rounded-xl card-surface hover:border-primary/20 transition-all duration-200 cursor-pointer"
                  onClick={() => handleViewCompany(company)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate mb-1">
                        {company.company_name}
                      </h4>
                      {company.primary_contact?.name && (
                        <p className="text-sm text-muted-foreground truncate">
                          {company.primary_contact.name}
                        </p>
                      )}
                      {company.primary_contact?.title && (
                        <p className="text-xs text-muted-foreground truncate">
                          {company.primary_contact.title}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{company.contact_count} contact{company.contact_count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ship className="h-3 w-3" />
                      <span>{company.shipment_count} shipments</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {company.air_shipments > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                        <Plane className="h-3 w-3" />
                        <span>{company.air_shipments}</span>
                      </div>
                    )}
                    {company.ocean_shipments > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs">
                        <Ship className="h-3 w-3" />
                        <span>{company.ocean_shipments}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmailContact(company);
                      }}
                      className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
                      title="Email Contact"
                    >
                      <Mail className="h-3 w-3 text-green-600" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLinkedInConnect(company);
                      }}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-3 w-3 text-blue-600" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCampaign(company);
                      }}
                      className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group"
                      title="Add to Campaign"
                    >
                      <Rocket className="h-3 w-3 text-purple-600" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScheduleMeeting(company);
                      }}
                      className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors group"
                      title="Schedule Meeting"
                    >
                      <Calendar className="h-3 w-3 text-orange-600" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNotes(company);
                      }}
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                      title="Add Notes"
                    >
                      <StickyNote className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {companies.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/dashboard/crm')}
                className="btn-secondary"
              >
                View Full CRM Directory
              </button>
              <div className="text-xs text-muted-foreground">
                Showing {displayedCompanies.length} of {companies.length} companies
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedCompany && (
        <ContactDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany}
          shipments={[]}
        />
      )}
    </>
  );
}