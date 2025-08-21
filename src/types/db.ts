export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      unified_shipments_view: {
        Row: {
          id: string;
          org_id: string | null;
          mode: 'air' | 'ocean';
          unified_company_name: string | null;
          hs_code: string | null;
          origin_country: string | null;
          destination_country: string | null;
          destination_city: string | null;
          unified_carrier: string | null;
          unified_date: string | null;
          description: string | null;
          bol_number: string | null;
          vessel_name: string | null;
          gross_weight_kg: number | null;
          value_usd: number | null;
          container_count: number | null;
          created_at: string;
          ts_all: any;
        };
        Insert: never;
        Update: never;
      };
      search_companies_view: {
        Row: {
          company_name: string;
          company_id: string | null;
          contacts_count: number;
          shipments_count: number;
          last_shipment_date: string | null;
          modes: string[];
          dest_countries: string[];
          top_commodities: string[];
          website: string | null;
          country: string | null;
          industry: string | null;
        };
        Insert: never;
        Update: never;
      };
      crm_contacts: {
        Row: {
          id: string;
          org_id: string | null;
          company_name: string;
          full_name: string | null;
          title: string | null;
          email: string | null;
          phone: string | null;
          linkedin: string | null;
          country: string | null;
          city: string | null;
          panjiva_id: string | null;
          source: string | null;
          tags: Json | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          company_name: string;
          full_name?: string | null;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin?: string | null;
          country?: string | null;
          city?: string | null;
          panjiva_id?: string | null;
          source?: string | null;
          tags?: Json | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['crm_contacts']['Insert']>;
      };
      unified_shipments: {
        Row: {
          id: string;
          org_id: string | null;
          mode: string | null;
          unified_company_name: string | null;
          hs_code: string | null;
          origin_country: string | null;
          destination_country: string | null;
          destination_city: string | null;
          unified_carrier: string | null;
          unified_date: string | null;
          commodity_description: string | null;
          bol_number: string | null;
          vessel_name: string | null;
          gross_weight_kg: number | null;
          value_usd: number | null;
          container_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          mode?: string | null;
          unified_company_name?: string | null;
          hs_code?: string | null;
          origin_country?: string | null;
          destination_country?: string | null;
          destination_city?: string | null;
          unified_carrier?: string | null;
          unified_date?: string | null;
          commodity_description?: string | null;
          bol_number?: string | null;
          vessel_name?: string | null;
          gross_weight_kg?: number | null;
          value_usd?: number | null;
          container_count?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['unified_shipments']['Insert']>;
      };
      companies: {
        Row: {
          id: string;
          company_name: string;
          website: string | null;
          country: string | null;
          industry: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          company_name: string;
          website?: string | null;
          country?: string | null;
          industry?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      import_jobs: {
        Row: {
          id: string;
          org_id: string | null;
          source_bucket: string | null;
          object_path: string | null;
          status: 'queued' | 'running' | 'success' | 'error';
          total_rows: number | null;
          ok_rows: number | null;
          error_rows: number | null;
          processing_metadata: Json | null;
          created_at: string | null;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          source_bucket?: string | null;
          object_path?: string | null;
          status?: 'queued' | 'running' | 'success' | 'error';
          total_rows?: number | null;
          ok_rows?: number | null;
          error_rows?: number | null;
          processing_metadata?: Json | null;
          created_at?: string | null;
          finished_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['import_jobs']['Insert']>;
      };
      import_mappings: {
        Row: {
          id: string;
          org_id: string | null;
          table_name: string;
          source_label: string;
          mapping: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id?: string | null;
          table_name: string;
          source_label: string;
          mapping: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['import_mappings']['Insert']>;
      };
    };
    Views: {
      unified_shipments_view: Database['public']['Tables']['unified_shipments_view'];
      search_companies_view: Database['public']['Tables']['search_companies_view'];
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];