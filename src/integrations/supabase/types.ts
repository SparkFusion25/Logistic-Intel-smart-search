export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      affiliate_links: {
        Row: {
          affiliate_id: string | null
          created_at: string | null
          id: string
          slug: string | null
          target_url: string | null
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
          slug?: string | null
          target_url?: string | null
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
          slug?: string | null
          target_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      airfreight_insights: {
        Row: {
          arrival_city: string | null
          arrival_port: string | null
          carrier_name: string | null
          country_destination: string
          country_origin: string
          created_at: string | null
          data_source: string | null
          departure_port: string | null
          destination_state: string | null
          destination_zip: string | null
          hs_code: string
          hs_description: string | null
          id: string
          processing_date: string | null
          quantity: number | null
          source_url: string | null
          trade_month: string
          value_usd: number | null
          weight_kg: number | null
        }
        Insert: {
          arrival_city?: string | null
          arrival_port?: string | null
          carrier_name?: string | null
          country_destination: string
          country_origin: string
          created_at?: string | null
          data_source?: string | null
          departure_port?: string | null
          destination_state?: string | null
          destination_zip?: string | null
          hs_code: string
          hs_description?: string | null
          id?: string
          processing_date?: string | null
          quantity?: number | null
          source_url?: string | null
          trade_month: string
          value_usd?: number | null
          weight_kg?: number | null
        }
        Update: {
          arrival_city?: string | null
          arrival_port?: string | null
          carrier_name?: string | null
          country_destination?: string
          country_origin?: string
          created_at?: string | null
          data_source?: string | null
          departure_port?: string | null
          destination_state?: string | null
          destination_zip?: string | null
          hs_code?: string
          hs_description?: string | null
          id?: string
          processing_date?: string | null
          quantity?: number | null
          source_url?: string | null
          trade_month?: string
          value_usd?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      airfreight_shipments: {
        Row: {
          arrival_date: string | null
          bol_number: string | null
          commodity_description: string | null
          consignee_city: string | null
          consignee_country: string | null
          consignee_name: string | null
          consignee_state: string | null
          consignee_zip: string | null
          container_count: number | null
          created_at: string | null
          departure_date: string | null
          description: string | null
          destination_port: string | null
          freight_amount: number | null
          goods_description: string | null
          hs_code: string
          id: string
          port_of_lading: string | null
          port_of_unlading: string | null
          quantity: number | null
          raw_xml_filename: string | null
          shipment_date: string | null
          shipment_id: string | null
          shipment_type: string | null
          shipper_country: string | null
          shipper_name: string | null
          transport_method: string | null
          unit_of_measure: string | null
          value_usd: number | null
          vessel_name: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          bol_number?: string | null
          commodity_description?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_name?: string | null
          consignee_state?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          destination_port?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          hs_code: string
          id?: string
          port_of_lading?: string | null
          port_of_unlading?: string | null
          quantity?: number | null
          raw_xml_filename?: string | null
          shipment_date?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          shipper_country?: string | null
          shipper_name?: string | null
          transport_method?: string | null
          unit_of_measure?: string | null
          value_usd?: number | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          bol_number?: string | null
          commodity_description?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_name?: string | null
          consignee_state?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          destination_port?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          hs_code?: string
          id?: string
          port_of_lading?: string | null
          port_of_unlading?: string | null
          quantity?: number | null
          raw_xml_filename?: string | null
          shipment_date?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          shipper_country?: string | null
          shipper_name?: string | null
          transport_method?: string | null
          unit_of_measure?: string | null
          value_usd?: number | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      airport_city_mapping: {
        Row: {
          airport_code: string
          city: string
          country: string
          created_at: string | null
          id: number
          region: string | null
          state: string | null
          timezone: string | null
        }
        Insert: {
          airport_code: string
          city: string
          country: string
          created_at?: string | null
          id?: number
          region?: string | null
          state?: string | null
          timezone?: string | null
        }
        Update: {
          airport_code?: string
          city?: string
          country?: string
          created_at?: string | null
          id?: number
          region?: string | null
          state?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity: string
          entity_id: string | null
          id: string
          meta: Json | null
          org_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          entity: string
          entity_id?: string | null
          id?: string
          meta?: Json | null
          org_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
          meta?: Json | null
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bts_route_matches: {
        Row: {
          carrier: string | null
          company_name: string
          created_at: string | null
          dest_airport: string | null
          dest_city: string | null
          freight_kg: number | null
          id: string
          last_analysis: string | null
          origin_airport: string | null
        }
        Insert: {
          carrier?: string | null
          company_name: string
          created_at?: string | null
          dest_airport?: string | null
          dest_city?: string | null
          freight_kg?: number | null
          id?: string
          last_analysis?: string | null
          origin_airport?: string | null
        }
        Update: {
          carrier?: string | null
          company_name?: string
          created_at?: string | null
          dest_airport?: string | null
          dest_city?: string | null
          freight_kg?: number | null
          id?: string
          last_analysis?: string | null
          origin_airport?: string | null
        }
        Relationships: []
      }
      campaign_contacts: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string | null
          id: string
          last_sent_at: string | null
          next_followup_at: string | null
          sequence_step: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string | null
          id?: string
          last_sent_at?: string | null
          next_followup_at?: string | null
          sequence_step?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string | null
          id?: string
          last_sent_at?: string | null
          next_followup_at?: string | null
          sequence_step?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_follow_ups: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          rule_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_follow_ups_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_follow_ups_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_contact_funnel"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_follow_ups_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_metrics"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_follow_ups_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "follow_up_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_steps: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          payload: Json | null
          step_order: number
          step_type: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          payload?: Json | null
          step_order: number
          step_type: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          payload?: Json | null
          step_order?: number
          step_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_steps_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_steps_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_contact_funnel"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_steps_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_metrics"
            referencedColumns: ["campaign_id"]
          },
        ]
      }
      campaign_targets: {
        Row: {
          campaign_id: string
          contact_id: string | null
          created_at: string
          id: string
          last_step: number | null
          status: string
        }
        Insert: {
          campaign_id: string
          contact_id?: string | null
          created_at?: string
          id?: string
          last_step?: number | null
          status?: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string | null
          created_at?: string
          id?: string
          last_step?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_targets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_targets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_contact_funnel"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_targets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_metrics"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "campaign_targets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          industry: string | null
          name: string | null
          org_id: string | null
          status: string | null
          tradelane: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          industry?: string | null
          name?: string | null
          org_id?: string | null
          status?: string | null
          tradelane?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          industry?: string | null
          name?: string | null
          org_id?: string | null
          status?: string | null
          tradelane?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_user_fk"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      census_trade_data: {
        Row: {
          commodity: string
          commodity_name: string | null
          country: string
          created_at: string | null
          customs_district: string | null
          id: number
          month: number
          state: string
          transport_mode: string
          updated_at: string | null
          value_usd: number | null
          weight_kg: number | null
          year: number
        }
        Insert: {
          commodity: string
          commodity_name?: string | null
          country: string
          created_at?: string | null
          customs_district?: string | null
          id?: number
          month: number
          state: string
          transport_mode: string
          updated_at?: string | null
          value_usd?: number | null
          weight_kg?: number | null
          year: number
        }
        Update: {
          commodity?: string
          commodity_name?: string | null
          country?: string
          created_at?: string | null
          customs_district?: string | null
          id?: number
          month?: number
          state?: string
          transport_mode?: string
          updated_at?: string | null
          value_usd?: number | null
          weight_kg?: number | null
          year?: number
        }
        Relationships: []
      }
      companies: {
        Row: {
          added_by_user: string | null
          air_match: boolean | null
          air_match_score: number | null
          bts_confidence_score: number | null
          company_name: string
          confidence_score: number | null
          country: string | null
          created_at: string | null
          id: string
          industry: string | null
          last_activity: string | null
          last_refreshed: string | null
          ocean_match: boolean | null
          ocean_match_score: number | null
          owner_user_id: string | null
          primary_industry: string | null
          total_shipments: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          added_by_user?: string | null
          air_match?: boolean | null
          air_match_score?: number | null
          bts_confidence_score?: number | null
          company_name: string
          confidence_score?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          last_activity?: string | null
          last_refreshed?: string | null
          ocean_match?: boolean | null
          ocean_match_score?: number | null
          owner_user_id?: string | null
          primary_industry?: string | null
          total_shipments?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          added_by_user?: string | null
          air_match?: boolean | null
          air_match_score?: number | null
          bts_confidence_score?: number | null
          company_name?: string
          confidence_score?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          last_activity?: string | null
          last_refreshed?: string | null
          ocean_match?: boolean | null
          ocean_match_score?: number | null
          owner_user_id?: string | null
          primary_industry?: string | null
          total_shipments?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_alias_resolver: {
        Row: {
          alias: string
          company_id: string
          created_at: string | null
          reason: string | null
        }
        Insert: {
          alias: string
          company_id: string
          created_at?: string | null
          reason?: string | null
        }
        Update: {
          alias?: string
          company_id?: string
          created_at?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_alias_resolver_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          air_confidence_score: number | null
          air_match: boolean | null
          air_match_score: number | null
          bts_route_matches: Json | null
          company_name: string
          created_at: string | null
          headquarters_city: string | null
          headquarters_country: string | null
          id: string
          last_air_analysis: string | null
          likely_air_shipper: boolean | null
          normalized_name: string | null
          ocean_match: boolean | null
          ocean_match_score: number | null
          primary_industry: string | null
        }
        Insert: {
          air_confidence_score?: number | null
          air_match?: boolean | null
          air_match_score?: number | null
          bts_route_matches?: Json | null
          company_name: string
          created_at?: string | null
          headquarters_city?: string | null
          headquarters_country?: string | null
          id?: string
          last_air_analysis?: string | null
          likely_air_shipper?: boolean | null
          normalized_name?: string | null
          ocean_match?: boolean | null
          ocean_match_score?: number | null
          primary_industry?: string | null
        }
        Update: {
          air_confidence_score?: number | null
          air_match?: boolean | null
          air_match_score?: number | null
          bts_route_matches?: Json | null
          company_name?: string
          created_at?: string | null
          headquarters_city?: string | null
          headquarters_country?: string | null
          id?: string
          last_air_analysis?: string | null
          likely_air_shipper?: boolean | null
          normalized_name?: string | null
          ocean_match?: boolean | null
          ocean_match_score?: number | null
          primary_industry?: string | null
        }
        Relationships: []
      }
      contact_enrichment_cache: {
        Row: {
          company_name: string
          created_at: string | null
          enrichment_data: Json | null
          expires_at: string | null
          id: string
          source: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          enrichment_data?: Json | null
          expires_at?: string | null
          id?: string
          source: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          enrichment_data?: Json | null
          expires_at?: string | null
          id?: string
          source?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          campaign_id: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          linkedin: string | null
          persona: Json | null
          phone: string | null
          title: string | null
        }
        Insert: {
          campaign_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          linkedin?: string | null
          persona?: Json | null
          phone?: string | null
          title?: string | null
        }
        Update: {
          campaign_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          linkedin?: string | null
          persona?: Json | null
          phone?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_contact_funnel"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "v_campaign_metrics"
            referencedColumns: ["campaign_id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          added_by_user: string | null
          city: string | null
          company_id: string | null
          company_name: string | null
          company_website: string | null
          contact_name: string | null
          country: string | null
          created_at: string | null
          email: string | null
          email_raw: string | null
          employee_count_range: string | null
          enrichment_source: string | null
          full_name: string | null
          headquarters_location: string | null
          id: string
          industry: string | null
          last_enriched: string | null
          linkedin: string | null
          linkedin_url: string | null
          notes: string | null
          org_id: string | null
          owner_user_id: string | null
          panjiva_id: string | null
          phone: string | null
          revenue_range: string | null
          source: string | null
          status: string | null
          tags: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          added_by_user?: string | null
          city?: string | null
          company_id?: string | null
          company_name?: string | null
          company_website?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          email_raw?: string | null
          employee_count_range?: string | null
          enrichment_source?: string | null
          full_name?: string | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          last_enriched?: string | null
          linkedin?: string | null
          linkedin_url?: string | null
          notes?: string | null
          org_id?: string | null
          owner_user_id?: string | null
          panjiva_id?: string | null
          phone?: string | null
          revenue_range?: string | null
          source?: string | null
          status?: string | null
          tags?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          added_by_user?: string | null
          city?: string | null
          company_id?: string | null
          company_name?: string | null
          company_website?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          email_raw?: string | null
          employee_count_range?: string | null
          enrichment_source?: string | null
          full_name?: string | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          last_enriched?: string | null
          linkedin?: string | null
          linkedin_url?: string | null
          notes?: string | null
          org_id?: string | null
          owner_user_id?: string | null
          panjiva_id?: string | null
          phone?: string | null
          revenue_range?: string | null
          source?: string | null
          status?: string | null
          tags?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts_staging: {
        Row: {
          city: string | null
          company_name: string | null
          country: string | null
          email: string | null
          full_name: string | null
          linkedin: string | null
          loaded_at: string | null
          panjiva_id: string | null
          phone: string | null
          source: string | null
          title: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          linkedin?: string | null
          loaded_at?: string | null
          panjiva_id?: string | null
          phone?: string | null
          source?: string | null
          title?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          linkedin?: string | null
          loaded_at?: string | null
          panjiva_id?: string | null
          phone?: string | null
          source?: string | null
          title?: string | null
        }
        Relationships: []
      }
      email_activity: {
        Row: {
          body: string | null
          contact_id: string | null
          created_at: string | null
          id: string
          opens: number | null
          replies: number | null
          status: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          opens?: number | null
          replies?: number | null
          status?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          opens?: number | null
          replies?: number | null
          status?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_activity_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          total_contacts: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          total_contacts?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          total_contacts?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_integrations: {
        Row: {
          access_token: string
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_sends: {
        Row: {
          body_html: string | null
          contact_id: string | null
          created_at: string
          id: string
          message_id: string | null
          org_id: string
          provider: string | null
          send_status: string
          subject: string | null
        }
        Insert: {
          body_html?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          org_id: string
          provider?: string | null
          send_status?: string
          subject?: string | null
        }
        Update: {
          body_html?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          message_id?: string | null
          org_id?: string
          provider?: string | null
          send_status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          name: string
          subject: string | null
          updated_at: string | null
          user_id: string
          variables: string[] | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          name: string
          subject?: string | null
          updated_at?: string | null
          user_id: string
          variables?: string[] | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          name?: string
          subject?: string | null
          updated_at?: string | null
          user_id?: string
          variables?: string[] | null
        }
        Relationships: []
      }
      enrichment_events: {
        Row: {
          contact_id: string | null
          created_at: string
          id: string
          org_id: string
          payload: Json | null
          provider: string | null
          success: boolean
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          id?: string
          org_id: string
          payload?: Json | null
          provider?: string | null
          success?: boolean
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          id?: string
          org_id?: string
          payload?: Json | null
          provider?: string | null
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "enrichment_events_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      enrichment_queue: {
        Row: {
          contact_id: string
          created_at: string | null
          enriched_data: Json | null
          enrichment_status: string | null
          id: string
          provider: string | null
          updated_at: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          enriched_data?: Json | null
          enrichment_status?: string | null
          id?: string
          provider?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          enriched_data?: Json | null
          enrichment_status?: string | null
          id?: string
          provider?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrichment_queue_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_executions: {
        Row: {
          contact_id: string | null
          created_at: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          response_received: boolean | null
          rule_id: string | null
          scheduled_at: string | null
          status: string | null
          step_id: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          response_received?: boolean | null
          rule_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          step_id?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          response_received?: boolean | null
          rule_id?: string | null
          scheduled_at?: string | null
          status?: string | null
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_executions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_executions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "follow_up_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_executions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "follow_up_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_rules: {
        Row: {
          created_at: string | null
          delay_hours: number | null
          id: string
          is_active: boolean | null
          max_attempts: number | null
          rule_name: string
          trigger_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          max_attempts?: number | null
          rule_name: string
          trigger_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          max_attempts?: number | null
          rule_name?: string
          trigger_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_rules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_steps: {
        Row: {
          channel: string
          created_at: string | null
          delay_from_previous: number | null
          id: string
          message_template: string | null
          rule_id: string | null
          step_order: number
          subject_template: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          delay_from_previous?: number | null
          id?: string
          message_template?: string | null
          rule_id?: string | null
          step_order: number
          subject_template?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          delay_from_previous?: number | null
          id?: string
          message_template?: string | null
          rule_id?: string | null
          step_order?: number
          subject_template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_steps_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "follow_up_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      import_companies: {
        Row: {
          added_by_user: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          industry: string | null
        }
        Insert: {
          added_by_user?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          industry?: string | null
        }
        Update: {
          added_by_user?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          industry?: string | null
        }
        Relationships: []
      }
      import_contacts: {
        Row: {
          added_by_user: string | null
          company_name: string | null
          email: string | null
          full_name: string | null
          phone: string | null
          title: string | null
        }
        Insert: {
          added_by_user?: string | null
          company_name?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          title?: string | null
        }
        Update: {
          added_by_user?: string | null
          company_name?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          title?: string | null
        }
        Relationships: []
      }
      import_crm_contacts: {
        Row: {
          added_by_user: string | null
          company_id: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          title: string | null
        }
        Insert: {
          added_by_user?: string | null
          company_id: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          title?: string | null
        }
        Update: {
          added_by_user?: string | null
          company_id?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          title?: string | null
        }
        Relationships: []
      }
      import_job_errors: {
        Row: {
          created_at: string
          id: string
          job_id: string | null
          payload: Json | null
          reason: string | null
          row_number: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_id?: string | null
          payload?: Json | null
          reason?: string | null
          row_number?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string | null
          payload?: Json | null
          reason?: string | null
          row_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "import_job_errors_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          created_at: string | null
          error_message: string | null
          error_rows: number | null
          finished_at: string | null
          id: string
          object_path: string
          ok_rows: number | null
          org_id: string | null
          source_bucket: string
          started_at: string | null
          status: string
          total_rows: number | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          error_rows?: number | null
          finished_at?: string | null
          id?: string
          object_path: string
          ok_rows?: number | null
          org_id?: string | null
          source_bucket: string
          started_at?: string | null
          status: string
          total_rows?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          error_rows?: number | null
          finished_at?: string | null
          id?: string
          object_path?: string
          ok_rows?: number | null
          org_id?: string | null
          source_bucket?: string
          started_at?: string | null
          status?: string
          total_rows?: number | null
        }
        Relationships: []
      }
      import_shipments: {
        Row: {
          arrival_date: string | null
          company_id: string
          destination_country: string | null
          hs_code: string | null
          id: string
          origin_country: string | null
          product_description: string | null
          shipment_id: string | null
          shipment_type: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          company_id: string
          destination_country?: string | null
          hs_code?: string | null
          id: string
          origin_country?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          company_id?: string
          destination_country?: string | null
          hs_code?: string | null
          id?: string
          origin_country?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      import_shipments_by_name: {
        Row: {
          arrival_date: string | null
          company_name: string
          destination_country: string | null
          hs_code: string | null
          id: string
          origin_country: string | null
          product_description: string | null
          shipment_id: string | null
          shipment_type: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          company_name: string
          destination_country?: string | null
          hs_code?: string | null
          id: string
          origin_country?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          company_name?: string
          destination_country?: string | null
          hs_code?: string | null
          id?: string
          origin_country?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      imported_contacts: {
        Row: {
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string | null
          error_message: string | null
          full_name: string | null
          id: string
          job_id: string | null
          linkedin: string | null
          org_id: string
          phone: string | null
          raw: Json | null
          status: string
          title: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          error_message?: string | null
          full_name?: string | null
          id?: string
          job_id?: string | null
          linkedin?: string | null
          org_id: string
          phone?: string | null
          raw?: Json | null
          status?: string
          title?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          error_message?: string | null
          full_name?: string | null
          id?: string
          job_id?: string | null
          linkedin?: string | null
          org_id?: string
          phone?: string | null
          raw?: Json | null
          status?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "imported_contacts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imported_contacts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      market_benchmark_cache: {
        Row: {
          destination: string
          hs_code: string | null
          id: string
          lane_hash: string
          last_computed_at: string
          mode: string
          origin: string
          p25: number | null
          p50: number | null
          p75: number | null
          sample_size: number | null
          source_breakdown: Json | null
          unit: string
        }
        Insert: {
          destination: string
          hs_code?: string | null
          id?: string
          lane_hash: string
          last_computed_at?: string
          mode: string
          origin: string
          p25?: number | null
          p50?: number | null
          p75?: number | null
          sample_size?: number | null
          source_breakdown?: Json | null
          unit: string
        }
        Update: {
          destination?: string
          hs_code?: string | null
          id?: string
          lane_hash?: string
          last_computed_at?: string
          mode?: string
          origin?: string
          p25?: number | null
          p50?: number | null
          p75?: number | null
          sample_size?: number | null
          source_breakdown?: Json | null
          unit?: string
        }
        Relationships: []
      }
      oauth_tokens: {
        Row: {
          account_email: string | null
          created_at: string
          id: string
          org_id: string
          provider: string
          refreshed_at: string | null
          token: Json
        }
        Insert: {
          account_email?: string | null
          created_at?: string
          id?: string
          org_id: string
          provider: string
          refreshed_at?: string | null
          token: Json
        }
        Update: {
          account_email?: string | null
          created_at?: string
          id?: string
          org_id?: string
          provider?: string
          refreshed_at?: string | null
          token?: Json
        }
        Relationships: []
      }
      ocean_shipments: {
        Row: {
          arrival_date: string | null
          bol_number: string | null
          commodity_description: string | null
          company_name: string | null
          consignee_city: string | null
          consignee_country: string | null
          consignee_name: string | null
          consignee_state: string | null
          consignee_zip: string | null
          container_count: number | null
          created_at: string | null
          departure_date: string | null
          destination_city: string | null
          destination_country: string | null
          destination_port: string | null
          freight_amount: number | null
          goods_description: string | null
          hs_code: string | null
          id: string
          origin_country: string | null
          port_of_lading: string | null
          port_of_unlading: string | null
          quantity: number | null
          raw_xml_filename: string | null
          shipment_date: string | null
          shipment_id: string | null
          shipment_type: string | null
          shipper_country: string | null
          shipper_name: string | null
          transport_method: string | null
          unit_of_measure: string | null
          value_usd: number | null
          vessel_name: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          bol_number?: string | null
          commodity_description?: string | null
          company_name?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_name?: string | null
          consignee_state?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          created_at?: string | null
          departure_date?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_port?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          hs_code?: string | null
          id?: string
          origin_country?: string | null
          port_of_lading?: string | null
          port_of_unlading?: string | null
          quantity?: number | null
          raw_xml_filename?: string | null
          shipment_date?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          shipper_country?: string | null
          shipper_name?: string | null
          transport_method?: string | null
          unit_of_measure?: string | null
          value_usd?: number | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          bol_number?: string | null
          commodity_description?: string | null
          company_name?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_name?: string | null
          consignee_state?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          created_at?: string | null
          departure_date?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_port?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          hs_code?: string | null
          id?: string
          origin_country?: string | null
          port_of_lading?: string | null
          port_of_unlading?: string | null
          quantity?: number | null
          raw_xml_filename?: string | null
          shipment_date?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          shipper_country?: string | null
          shipper_name?: string | null
          transport_method?: string | null
          unit_of_measure?: string | null
          value_usd?: number | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      org_feature_flags: {
        Row: {
          enabled: boolean
          id: string
          key: string
          org_id: string | null
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          id?: string
          key: string
          org_id?: string | null
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          id?: string
          key?: string
          org_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_feature_flags_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      orgs: {
        Row: {
          billing_customer_id: string | null
          created_at: string
          id: string
          name: string
          plan: string
          seats: number | null
        }
        Insert: {
          billing_customer_id?: string | null
          created_at?: string
          id?: string
          name: string
          plan?: string
          seats?: number | null
        }
        Update: {
          billing_customer_id?: string | null
          created_at?: string
          id?: string
          name?: string
          plan?: string
          seats?: number | null
        }
        Relationships: []
      }
      outreach_history: {
        Row: {
          campaign_id: string | null
          contact_id: string | null
          created_at: string | null
          id: string
          next_followup_at: string | null
          opens: number | null
          replies: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          next_followup_at?: string | null
          opens?: number | null
          replies?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          next_followup_at?: string | null
          opens?: number | null
          replies?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_history_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_logs: {
        Row: {
          action: string | null
          channel: string | null
          contact_id: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          action?: string | null
          channel?: string | null
          contact_id?: string | null
          id?: string
          timestamp?: string | null
        }
        Update: {
          action?: string | null
          channel?: string | null
          contact_id?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      panjiva_contacts_raw: {
        Row: {
          city: string | null
          company_name: string | null
          country: string | null
          email: string | null
          full_name: string | null
          imported_at: string | null
          linkedin: string | null
          panjiva_id: string | null
          phone: string | null
          source_file: string | null
          title: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          imported_at?: string | null
          linkedin?: string | null
          panjiva_id?: string | null
          phone?: string | null
          source_file?: string | null
          title?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          imported_at?: string | null
          linkedin?: string | null
          panjiva_id?: string | null
          phone?: string | null
          source_file?: string | null
          title?: string | null
        }
        Relationships: []
      }
      personas: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          key_challenges: string | null
          preferred_channels: string | null
          segment: string | null
          tone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          key_challenges?: string | null
          preferred_channels?: string | null
          segment?: string | null
          tone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          key_challenges?: string | null
          preferred_channels?: string | null
          segment?: string | null
          tone?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      "public.crm_contacts": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      quotes: {
        Row: {
          commodity: string | null
          company_name: string
          created_at: string | null
          destination: string
          hs_code: string | null
          id: string
          mode: string
          org_id: string
          origin: string
          output_url: string | null
          price_usd: number | null
        }
        Insert: {
          commodity?: string | null
          company_name: string
          created_at?: string | null
          destination: string
          hs_code?: string | null
          id?: string
          mode: string
          org_id: string
          origin: string
          output_url?: string | null
          price_usd?: number | null
        }
        Update: {
          commodity?: string | null
          company_name?: string
          created_at?: string | null
          destination?: string
          hs_code?: string | null
          id?: string
          mode?: string
          org_id?: string
          origin?: string
          output_url?: string | null
          price_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          affiliate_id: string | null
          created_at: string | null
          email: string | null
          id: string
          status: string | null
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      search_logs: {
        Row: {
          avg_confidence: number | null
          created_at: string | null
          id: string
          org_id: string
          query: Json
          results_count: number | null
          user_id: string
        }
        Insert: {
          avg_confidence?: number | null
          created_at?: string | null
          id?: string
          org_id: string
          query: Json
          results_count?: number | null
          user_id: string
        }
        Update: {
          avg_confidence?: number | null
          created_at?: string | null
          id?: string
          org_id?: string
          query?: Json
          results_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          arrival_date: string | null
          bol_number: string | null
          carrier: string | null
          commodity: string | null
          company_id: string | null
          container_count: number | null
          created_at: string | null
          date: string | null
          destination: string | null
          destination_country: string | null
          gross_weight: string | null
          gross_weight_kg: number | null
          hs_code: string | null
          id: string
          mode: string | null
          origin: string | null
          origin_country: string | null
          owner_user_id: string | null
          port_of_discharge: string | null
          port_of_loading: string | null
          product_description: string | null
          shipment_id: string | null
          shipment_type: string | null
          transport_mode: string | null
          value: number | null
          vessel: string | null
          vessel_name: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          bol_number?: string | null
          carrier?: string | null
          commodity?: string | null
          company_id?: string | null
          container_count?: number | null
          created_at?: string | null
          date?: string | null
          destination?: string | null
          destination_country?: string | null
          gross_weight?: string | null
          gross_weight_kg?: number | null
          hs_code?: string | null
          id?: string
          mode?: string | null
          origin?: string | null
          origin_country?: string | null
          owner_user_id?: string | null
          port_of_discharge?: string | null
          port_of_loading?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          transport_mode?: string | null
          value?: number | null
          vessel?: string | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          bol_number?: string | null
          carrier?: string | null
          commodity?: string | null
          company_id?: string | null
          container_count?: number | null
          created_at?: string | null
          date?: string | null
          destination?: string | null
          destination_country?: string | null
          gross_weight?: string | null
          gross_weight_kg?: number | null
          hs_code?: string | null
          id?: string
          mode?: string | null
          origin?: string | null
          origin_country?: string | null
          owner_user_id?: string | null
          port_of_discharge?: string | null
          port_of_loading?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          transport_mode?: string | null
          value?: number | null
          vessel?: string | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      staging_companies: {
        Row: {
          company_name: string | null
          country: string | null
          source: string | null
          source_uid: string | null
          website: string | null
        }
        Insert: {
          company_name?: string | null
          country?: string | null
          source?: string | null
          source_uid?: string | null
          website?: string | null
        }
        Update: {
          company_name?: string | null
          country?: string | null
          source?: string | null
          source_uid?: string | null
          website?: string | null
        }
        Relationships: []
      }
      staging_contacts: {
        Row: {
          company_name: string | null
          country: string | null
          email: string | null
          full_name: string | null
          phone: string | null
          role: string | null
          source: string | null
          source_uid: string | null
          title: string | null
        }
        Insert: {
          company_name?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          source_uid?: string | null
          title?: string | null
        }
        Update: {
          company_name?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          source_uid?: string | null
          title?: string | null
        }
        Relationships: []
      }
      staging_shipments: {
        Row: {
          arrival_date: string | null
          carrier: string | null
          company_name: string | null
          destination_country: string | null
          hs_code: string | null
          origin_country: string | null
          product_description: string | null
          shipment_id: string | null
          shipment_type: string | null
          vessel_name: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          carrier?: string | null
          company_name?: string | null
          destination_country?: string | null
          hs_code?: string | null
          origin_country?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          carrier?: string | null
          company_name?: string | null
          destination_country?: string | null
          hs_code?: string | null
          origin_country?: string | null
          product_description?: string | null
          shipment_id?: string | null
          shipment_type?: string | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          price_id: string | null
          stripe_customer_id: string
          subscription_id: string
          subscription_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          price_id?: string | null
          stripe_customer_id: string
          subscription_id: string
          subscription_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          price_id?: string | null
          stripe_customer_id?: string
          subscription_id?: string
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      t100_air_segments: {
        Row: {
          carrier: string
          created_at: string | null
          dest_airport: string
          freight_kg: number | null
          id: number
          mail_kg: number | null
          month: number
          origin_airport: string
          updated_at: string | null
          year: number
        }
        Insert: {
          carrier: string
          created_at?: string | null
          dest_airport: string
          freight_kg?: number | null
          id?: number
          mail_kg?: number | null
          month: number
          origin_airport: string
          updated_at?: string | null
          year: number
        }
        Update: {
          carrier?: string
          created_at?: string | null
          dest_airport?: string
          freight_kg?: number | null
          id?: number
          mail_kg?: number | null
          month?: number
          origin_airport?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      tariff_cache: {
        Row: {
          country: string
          created_at: string | null
          hs_code: string
          id: string
          payload: Json | null
          provider: string
          rate: number | null
          refreshed_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          hs_code: string
          id?: string
          payload?: Json | null
          provider: string
          rate?: number | null
          refreshed_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          hs_code?: string
          id?: string
          payload?: Json | null
          provider?: string
          rate?: number | null
          refreshed_at?: string | null
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          created_at: string
          email_send_id: string | null
          event: string | null
          event_payload: Json | null
          id: string
        }
        Insert: {
          created_at?: string
          email_send_id?: string | null
          event?: string | null
          event_payload?: Json | null
          id?: string
        }
        Update: {
          created_at?: string
          email_send_id?: string | null
          event?: string | null
          event_payload?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_email_send_id_fkey"
            columns: ["email_send_id"]
            isOneToOne: false
            referencedRelation: "email_sends"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_shipments: {
        Row: {
          air_confidence_score: number | null
          bol_number: string | null
          commodity_description: string | null
          container_count: number | null
          created_at: string | null
          description: string | null
          destination_city: string | null
          destination_country: string | null
          gross_weight_kg: number | null
          hs_code: string | null
          hs_description: string | null
          id: string
          is_likely_air_shipper: boolean | null
          mode: string
          origin_country: string | null
          port_of_discharge: string | null
          port_of_loading: string | null
          shipment_mode: string | null
          shipment_type: string | null
          shipper_name: string | null
          transport_mode: string | null
          unified_carrier: string | null
          unified_company_name: string | null
          unified_date: string | null
          unified_destination: string | null
          unified_id: string | null
          unified_value: number | null
          unified_weight: number | null
          vessel_name: string | null
        }
        Insert: {
          air_confidence_score?: number | null
          bol_number?: string | null
          commodity_description?: string | null
          container_count?: number | null
          created_at?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          gross_weight_kg?: number | null
          hs_code?: string | null
          hs_description?: string | null
          id?: string
          is_likely_air_shipper?: boolean | null
          mode: string
          origin_country?: string | null
          port_of_discharge?: string | null
          port_of_loading?: string | null
          shipment_mode?: string | null
          shipment_type?: string | null
          shipper_name?: string | null
          transport_mode?: string | null
          unified_carrier?: string | null
          unified_company_name?: string | null
          unified_date?: string | null
          unified_destination?: string | null
          unified_id?: string | null
          unified_value?: number | null
          unified_weight?: number | null
          vessel_name?: string | null
        }
        Update: {
          air_confidence_score?: number | null
          bol_number?: string | null
          commodity_description?: string | null
          container_count?: number | null
          created_at?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          gross_weight_kg?: number | null
          hs_code?: string | null
          hs_description?: string | null
          id?: string
          is_likely_air_shipper?: boolean | null
          mode?: string
          origin_country?: string | null
          port_of_discharge?: string | null
          port_of_loading?: string | null
          shipment_mode?: string | null
          shipment_type?: string | null
          shipper_name?: string | null
          transport_mode?: string | null
          unified_carrier?: string | null
          unified_company_name?: string | null
          unified_date?: string | null
          unified_destination?: string | null
          unified_id?: string | null
          unified_value?: number | null
          unified_weight?: number | null
          vessel_name?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          admin_permissions: Json | null
          api_usage_count: number | null
          api_usage_limit: number | null
          company: string | null
          created_at: string | null
          email: string
          features_enabled: Json | null
          full_name: string | null
          id: string
          last_login_at: string | null
          owner_user_id: string | null
          plan: string | null
          role: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_permissions?: Json | null
          api_usage_count?: number | null
          api_usage_limit?: number | null
          company?: string | null
          created_at?: string | null
          email: string
          features_enabled?: Json | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
          owner_user_id?: string | null
          plan?: string | null
          role?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_permissions?: Json | null
          api_usage_count?: number | null
          api_usage_limit?: number | null
          company?: string | null
          created_at?: string | null
          email?: string
          features_enabled?: Json | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          owner_user_id?: string | null
          plan?: string | null
          role?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_tokens: {
        Row: {
          access_token: string
          email: string | null
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string | null
          scopes: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          email?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token?: string | null
          scopes?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string | null
          scopes?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          name: string | null
          org_id: string | null
          plan: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
          org_id?: string | null
          plan?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
          org_id?: string | null
          plan?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      trade_data_view: {
        Row: {
          arrival_date: string | null
          bol_number: string | null
          company_name: string | null
          consignee_name: string | null
          container_count: number | null
          created_at: string | null
          departure_date: string | null
          destination_city: string | null
          goods_description: string | null
          gross_weight_kg: number | null
          hs_code: string | null
          origin_country: string | null
          port_of_discharge: string | null
          port_of_loading: string | null
          shipment_type: string | null
          shipper_name: string | null
          unified_id: string | null
          updated_at: string | null
          value_usd: number | null
          vessel_name: string | null
        }
        Relationships: []
      }
      v_campaign_contact_funnel: {
        Row: {
          bounced: number | null
          campaign_id: string | null
          clicked: number | null
          contact_id: string | null
          last_event_at: string | null
          opened: number | null
          replied: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_targets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      v_campaign_metrics: {
        Row: {
          bounces: number | null
          campaign_id: string | null
          click_rate_pct: number | null
          clicks: number | null
          emails_sent: number | null
          name: string | null
          open_rate_pct: number | null
          opens: number | null
          replies: number | null
          reply_rate_pct: number | null
        }
        Relationships: []
      }
      v_email_send_latest_event: {
        Row: {
          email_send_id: string | null
          event: string | null
          event_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_email_send_id_fkey"
            columns: ["email_send_id"]
            isOneToOne: false
            referencedRelation: "email_sends"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      enforced_trade_search: {
        Args: { p_limit_shipments_per_company?: number; p_mode: string }
        Returns: {
          arrival_date: string | null
          bol_number: string | null
          company_name: string | null
          consignee_name: string | null
          container_count: number | null
          created_at: string | null
          departure_date: string | null
          destination_city: string | null
          goods_description: string | null
          gross_weight_kg: number | null
          hs_code: string | null
          origin_country: string | null
          port_of_discharge: string | null
          port_of_loading: string | null
          shipment_type: string | null
          shipper_name: string | null
          unified_id: string | null
          updated_at: string | null
          value_usd: number | null
          vessel_name: string | null
        }[]
      }
      get_user_plan: {
        Args: Record<PropertyKey, never> | { p_uid: string }
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_uid: {
        Args: { p_uid: string }
        Returns: boolean
      }
      is_trial_expired: {
        Args: { p_uid: string }
        Returns: boolean
      }
      li_norm: {
        Args: { t: string }
        Returns: string
      }
      log_email_click: {
        Args: {
          p_ip?: unknown
          p_message_id: string
          p_url: string
          p_user_agent?: string
        }
        Returns: boolean
      }
      log_email_open: {
        Args: { p_ip?: unknown; p_message_id: string; p_user_agent?: string }
        Returns: boolean
      }
      merge_contacts_from_staging: {
        Args: { _added_by_user?: string }
        Returns: undefined
      }
      merge_text_arrays: {
        Args: { a: string[]; b: string[] }
        Returns: string[]
      }
      norm_name: {
        Args: { s: string }
        Returns: string
      }
      norm_text: {
        Args: { t: string }
        Returns: string
      }
      plan_campaign_limit: {
        Args:
          | { p_plan: string; p_pro: number; p_starter: number }
          | {
              p_plan: string
              p_pro: number
              p_starter: number
              p_trial: number
            }
        Returns: number
      }
      plan_crm_limit: {
        Args:
          | { p_plan: string; p_pro: number; p_starter: number }
          | {
              p_plan: string
              p_pro: number
              p_starter: number
              p_trial: number
            }
        Returns: number
      }
      plan_freight_company_limit: {
        Args:
          | {
              p_mode: string
              p_plan: string
              p_pro_air: number
              p_pro_ocean: number
              p_starter_air: number
              p_starter_ocean: number
            }
          | {
              p_mode: string
              p_plan: string
              p_pro_air: number
              p_pro_ocean: number
              p_starter_air: number
              p_starter_ocean: number
              p_trial_air: number
              p_trial_ocean: number
            }
        Returns: number
      }
      refresh_company_profile: {
        Args: { p_company_name: string }
        Returns: undefined
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      upsert_crm_contact: {
        Args: {
          p_city?: string
          p_company_name: string
          p_country?: string
          p_email?: string
          p_full_name?: string
          p_linkedin?: string
          p_notes?: string
          p_org_id: string
          p_panjiva_id?: string
          p_phone?: string
          p_source?: string
          p_tags?: string[]
          p_title?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
