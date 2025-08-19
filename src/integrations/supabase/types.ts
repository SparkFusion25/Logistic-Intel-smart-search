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
      activities: {
        Row: {
          body: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          due_at: string | null
          id: string
          org_id: string
          subject: string | null
          type: string
        }
        Insert: {
          body?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          due_at?: string | null
          id?: string
          org_id: string
          subject?: string | null
          type: string
        }
        Update: {
          body?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          due_at?: string | null
          id?: string
          org_id?: string
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
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
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          payment_method: string | null
          period_end: string
          period_start: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          stripe_transfer_id: string | null
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          period_end: string
          period_start: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          stripe_transfer_id?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          period_end?: string
          period_start?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          stripe_transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bio: string | null
          commission_rate: number
          created_at: string | null
          id: string
          payment_email: string | null
          social_links: Json | null
          status: string
          stripe_account_id: string | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bio?: string | null
          commission_rate?: number
          created_at?: string | null
          id?: string
          payment_email?: string | null
          social_links?: Json | null
          status?: string
          stripe_account_id?: string | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bio?: string | null
          commission_rate?: number
          created_at?: string | null
          id?: string
          payment_email?: string | null
          social_links?: Json | null
          status?: string
          stripe_account_id?: string | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      affiliate_promo_codes: {
        Row: {
          affiliate_id: string
          code: string
          created_at: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
        }
        Insert: {
          affiliate_id: string
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
        }
        Update: {
          affiliate_id?: string
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_promo_codes_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_earned: number | null
          conversion_value: number | null
          created_at: string | null
          id: string
          promo_code: string | null
          referred_user_id: string
          status: string | null
          tracking_code: string | null
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          commission_earned?: number | null
          conversion_value?: number | null
          created_at?: string | null
          id?: string
          promo_code?: string | null
          referred_user_id: string
          status?: string | null
          tracking_code?: string | null
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_earned?: number | null
          conversion_value?: number | null
          created_at?: string | null
          id?: string
          promo_code?: string | null
          referred_user_id?: string
          status?: string | null
          tracking_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_requests: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
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
      ai_suggestions: {
        Row: {
          confidence: string
          created_at: string
          id: string
          org_id: string
          rationale: string
          score: number
          source_signals: Json | null
          status: string
          subject_id: string | null
          subject_type: string
          suggestion_type: string
          updated_at: string
        }
        Insert: {
          confidence: string
          created_at?: string
          id?: string
          org_id: string
          rationale: string
          score?: number
          source_signals?: Json | null
          status?: string
          subject_id?: string | null
          subject_type: string
          suggestion_type: string
          updated_at?: string
        }
        Update: {
          confidence?: string
          created_at?: string
          id?: string
          org_id?: string
          rationale?: string
          score?: number
          source_signals?: Json | null
          status?: string
          subject_id?: string | null
          subject_type?: string
          suggestion_type?: string
          updated_at?: string
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
          bill_of_lading_number: string | null
          bol_number: string | null
          carrier_code: string | null
          carrier_name: string | null
          commodity_description: string | null
          consignee: string | null
          consignee_address: string | null
          consignee_city: string | null
          consignee_country: string | null
          consignee_email_1: string | null
          consignee_employees: string | null
          consignee_full_address: string | null
          consignee_industry: string | null
          consignee_name: string | null
          consignee_phone_1: string | null
          consignee_postal_code: string | null
          consignee_revenue: string | null
          consignee_state: string | null
          consignee_state_region: string | null
          consignee_trade_roles: string | null
          consignee_website_1: string | null
          consignee_zip: string | null
          container_count: number | null
          container_marks: string | null
          container_number: string | null
          container_type_descriptions: string | null
          container_types: string | null
          created_at: string | null
          departure_date: string | null
          description: string | null
          destination_port: string | null
          forwarder_name: string | null
          forwarder_scac_code: string | null
          freight_amount: number | null
          goods_description: string | null
          goods_shipped: string | null
          house_bol_number: string | null
          hs_code: string
          id: string
          importer_id: string | null
          importer_name: string | null
          is_lcl: boolean | null
          master_bol_number: string | null
          matching_fields: string | null
          notify_party: string | null
          number_of_containers: number | null
          port_of_lading: string | null
          port_of_lading_country: string | null
          port_of_lading_id: string | null
          port_of_lading_name: string | null
          port_of_lading_region: string | null
          port_of_unlading: string | null
          port_of_unlading_id: string | null
          port_of_unlading_name: string | null
          port_of_unlading_region: string | null
          quantity: number | null
          raw_xml_filename: string | null
          shipment_date: string | null
          shipment_destination: string | null
          shipment_destination_region: string | null
          shipment_id: string | null
          shipment_origin: string | null
          shipment_type: string | null
          shipper: string | null
          shipper_address: string | null
          shipper_city: string | null
          shipper_country: string | null
          shipper_email_1: string | null
          shipper_employees: string | null
          shipper_full_address: string | null
          shipper_industry: string | null
          shipper_name: string | null
          shipper_phone_1: string | null
          shipper_postal_code: string | null
          shipper_revenue: string | null
          shipper_state_region: string | null
          shipper_trade_roles: string | null
          transport_method: string | null
          unit_of_measure: string | null
          value_usd: number | null
          vessel: string | null
          vessel_imo: string | null
          vessel_name: string | null
          vessel_voyage_id: string | null
          voyage_number: string | null
          weight_kg: number | null
          weight_original_format: string | null
          weight_t: number | null
        }
        Insert: {
          arrival_date?: string | null
          bill_of_lading_number?: string | null
          bol_number?: string | null
          carrier_code?: string | null
          carrier_name?: string | null
          commodity_description?: string | null
          consignee?: string | null
          consignee_address?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_email_1?: string | null
          consignee_employees?: string | null
          consignee_full_address?: string | null
          consignee_industry?: string | null
          consignee_name?: string | null
          consignee_phone_1?: string | null
          consignee_postal_code?: string | null
          consignee_revenue?: string | null
          consignee_state?: string | null
          consignee_state_region?: string | null
          consignee_trade_roles?: string | null
          consignee_website_1?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          container_marks?: string | null
          container_number?: string | null
          container_type_descriptions?: string | null
          container_types?: string | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          destination_port?: string | null
          forwarder_name?: string | null
          forwarder_scac_code?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          goods_shipped?: string | null
          house_bol_number?: string | null
          hs_code: string
          id?: string
          importer_id?: string | null
          importer_name?: string | null
          is_lcl?: boolean | null
          master_bol_number?: string | null
          matching_fields?: string | null
          notify_party?: string | null
          number_of_containers?: number | null
          port_of_lading?: string | null
          port_of_lading_country?: string | null
          port_of_lading_id?: string | null
          port_of_lading_name?: string | null
          port_of_lading_region?: string | null
          port_of_unlading?: string | null
          port_of_unlading_id?: string | null
          port_of_unlading_name?: string | null
          port_of_unlading_region?: string | null
          quantity?: number | null
          raw_xml_filename?: string | null
          shipment_date?: string | null
          shipment_destination?: string | null
          shipment_destination_region?: string | null
          shipment_id?: string | null
          shipment_origin?: string | null
          shipment_type?: string | null
          shipper?: string | null
          shipper_address?: string | null
          shipper_city?: string | null
          shipper_country?: string | null
          shipper_email_1?: string | null
          shipper_employees?: string | null
          shipper_full_address?: string | null
          shipper_industry?: string | null
          shipper_name?: string | null
          shipper_phone_1?: string | null
          shipper_postal_code?: string | null
          shipper_revenue?: string | null
          shipper_state_region?: string | null
          shipper_trade_roles?: string | null
          transport_method?: string | null
          unit_of_measure?: string | null
          value_usd?: number | null
          vessel?: string | null
          vessel_imo?: string | null
          vessel_name?: string | null
          vessel_voyage_id?: string | null
          voyage_number?: string | null
          weight_kg?: number | null
          weight_original_format?: string | null
          weight_t?: number | null
        }
        Update: {
          arrival_date?: string | null
          bill_of_lading_number?: string | null
          bol_number?: string | null
          carrier_code?: string | null
          carrier_name?: string | null
          commodity_description?: string | null
          consignee?: string | null
          consignee_address?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_email_1?: string | null
          consignee_employees?: string | null
          consignee_full_address?: string | null
          consignee_industry?: string | null
          consignee_name?: string | null
          consignee_phone_1?: string | null
          consignee_postal_code?: string | null
          consignee_revenue?: string | null
          consignee_state?: string | null
          consignee_state_region?: string | null
          consignee_trade_roles?: string | null
          consignee_website_1?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          container_marks?: string | null
          container_number?: string | null
          container_type_descriptions?: string | null
          container_types?: string | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          destination_port?: string | null
          forwarder_name?: string | null
          forwarder_scac_code?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          goods_shipped?: string | null
          house_bol_number?: string | null
          hs_code?: string
          id?: string
          importer_id?: string | null
          importer_name?: string | null
          is_lcl?: boolean | null
          master_bol_number?: string | null
          matching_fields?: string | null
          notify_party?: string | null
          number_of_containers?: number | null
          port_of_lading?: string | null
          port_of_lading_country?: string | null
          port_of_lading_id?: string | null
          port_of_lading_name?: string | null
          port_of_lading_region?: string | null
          port_of_unlading?: string | null
          port_of_unlading_id?: string | null
          port_of_unlading_name?: string | null
          port_of_unlading_region?: string | null
          quantity?: number | null
          raw_xml_filename?: string | null
          shipment_date?: string | null
          shipment_destination?: string | null
          shipment_destination_region?: string | null
          shipment_id?: string | null
          shipment_origin?: string | null
          shipment_type?: string | null
          shipper?: string | null
          shipper_address?: string | null
          shipper_city?: string | null
          shipper_country?: string | null
          shipper_email_1?: string | null
          shipper_employees?: string | null
          shipper_full_address?: string | null
          shipper_industry?: string | null
          shipper_name?: string | null
          shipper_phone_1?: string | null
          shipper_postal_code?: string | null
          shipper_revenue?: string | null
          shipper_state_region?: string | null
          shipper_trade_roles?: string | null
          transport_method?: string | null
          unit_of_measure?: string | null
          value_usd?: number | null
          vessel?: string | null
          vessel_imo?: string | null
          vessel_name?: string | null
          vessel_voyage_id?: string | null
          voyage_number?: string | null
          weight_kg?: number | null
          weight_original_format?: string | null
          weight_t?: number | null
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
      bulk_imports: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duplicate_records: number | null
          error_details: Json | null
          error_records: number | null
          file_path: string | null
          file_size: number | null
          file_type: string
          filename: string
          id: string
          org_id: string
          processed_records: number | null
          processing_metadata: Json | null
          status: string
          total_records: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duplicate_records?: number | null
          error_details?: Json | null
          error_records?: number | null
          file_path?: string | null
          file_size?: number | null
          file_type: string
          filename: string
          id?: string
          org_id: string
          processed_records?: number | null
          processing_metadata?: Json | null
          status?: string
          total_records?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duplicate_records?: number | null
          error_details?: Json | null
          error_records?: number | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string
          filename?: string
          id?: string
          org_id?: string
          processed_records?: number | null
          processing_metadata?: Json | null
          status?: string
          total_records?: number | null
          updated_at?: string | null
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
            foreignKeyName: "campaign_follow_ups_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "follow_up_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_queue: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string
          id: string
          last_error: string | null
          scheduled_at: string
          sent_at: string | null
          state: string
          step_index: number
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string
          id?: string
          last_error?: string | null
          scheduled_at?: string
          sent_at?: string | null
          state?: string
          step_index?: number
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string
          id?: string
          last_error?: string | null
          scheduled_at?: string
          sent_at?: string | null
          state?: string
          step_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_queue_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
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
        Relationships: []
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
          created_at: string
          creator_id: string
          description: string | null
          id: string
          name: string
          org_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          name: string
          org_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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
          company_name: string | null
          created_at: string
          domain: string
          employees: number | null
          enriched_data: Json | null
          id: string
          industry: string | null
          location: string | null
          org_id: string
          revenue: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          domain: string
          employees?: number | null
          enriched_data?: Json | null
          id?: string
          industry?: string | null
          location?: string | null
          org_id: string
          revenue?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          domain?: string
          employees?: number | null
          enriched_data?: Json | null
          id?: string
          industry?: string | null
          location?: string | null
          org_id?: string
          revenue?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_trade_profiles: {
        Row: {
          activity_frequency: string | null
          avg_shipment_value_usd: number | null
          commodity_categories: string[] | null
          company_name: string
          contact_enrichment_status: string | null
          created_at: string | null
          enriched_company_data: Json | null
          first_shipment_date: string | null
          id: string
          last_shipment_date: string | null
          org_id: string
          top_commodities: string[] | null
          top_destination_countries: string[] | null
          top_origin_countries: string[] | null
          top_ports: string[] | null
          total_air_shipments: number | null
          total_ground_shipments: number | null
          total_ocean_shipments: number | null
          total_shipments: number | null
          total_trade_value_usd: number | null
          updated_at: string | null
        }
        Insert: {
          activity_frequency?: string | null
          avg_shipment_value_usd?: number | null
          commodity_categories?: string[] | null
          company_name: string
          contact_enrichment_status?: string | null
          created_at?: string | null
          enriched_company_data?: Json | null
          first_shipment_date?: string | null
          id?: string
          last_shipment_date?: string | null
          org_id: string
          top_commodities?: string[] | null
          top_destination_countries?: string[] | null
          top_origin_countries?: string[] | null
          top_ports?: string[] | null
          total_air_shipments?: number | null
          total_ground_shipments?: number | null
          total_ocean_shipments?: number | null
          total_shipments?: number | null
          total_trade_value_usd?: number | null
          updated_at?: string | null
        }
        Update: {
          activity_frequency?: string | null
          avg_shipment_value_usd?: number | null
          commodity_categories?: string[] | null
          company_name?: string
          contact_enrichment_status?: string | null
          created_at?: string | null
          enriched_company_data?: Json | null
          first_shipment_date?: string | null
          id?: string
          last_shipment_date?: string | null
          org_id?: string
          top_commodities?: string[] | null
          top_destination_countries?: string[] | null
          top_origin_countries?: string[] | null
          top_ports?: string[] | null
          total_air_shipments?: number | null
          total_ground_shipments?: number | null
          total_ocean_shipments?: number | null
          total_shipments?: number | null
          total_trade_value_usd?: number | null
          updated_at?: string | null
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
          enriched_data: Json | null
          full_name: string | null
          id: string
          linkedin: string | null
          org_id: string | null
          persona: Json | null
          phone: string | null
          search_vector: unknown | null
          source_file: string | null
          summary: string | null
          title: string | null
        }
        Insert: {
          campaign_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          enriched_data?: Json | null
          full_name?: string | null
          id?: string
          linkedin?: string | null
          org_id?: string | null
          persona?: Json | null
          phone?: string | null
          search_vector?: unknown | null
          source_file?: string | null
          summary?: string | null
          title?: string | null
        }
        Update: {
          campaign_id?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          enriched_data?: Json | null
          full_name?: string | null
          id?: string
          linkedin?: string | null
          org_id?: string | null
          persona?: Json | null
          phone?: string | null
          search_vector?: unknown | null
          source_file?: string | null
          summary?: string | null
          title?: string | null
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          added_by_user: string | null
          city: string | null
          company_id: string | null
          company_name: string | null
          company_website: string | null
          consignee_email_1: string | null
          consignee_employees: string | null
          consignee_industry: string | null
          consignee_phone_1: string | null
          consignee_revenue: string | null
          consignee_website_1: string | null
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
          shipper_email_1: string | null
          shipper_employees: string | null
          shipper_industry: string | null
          shipper_phone_1: string | null
          shipper_revenue: string | null
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
          consignee_email_1?: string | null
          consignee_employees?: string | null
          consignee_industry?: string | null
          consignee_phone_1?: string | null
          consignee_revenue?: string | null
          consignee_website_1?: string | null
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
          shipper_email_1?: string | null
          shipper_employees?: string | null
          shipper_industry?: string | null
          shipper_phone_1?: string | null
          shipper_revenue?: string | null
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
          consignee_email_1?: string | null
          consignee_employees?: string | null
          consignee_industry?: string | null
          consignee_phone_1?: string | null
          consignee_revenue?: string | null
          consignee_website_1?: string | null
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
          shipper_email_1?: string | null
          shipper_employees?: string | null
          shipper_industry?: string | null
          shipper_phone_1?: string | null
          shipper_revenue?: string | null
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
      deal_attachments: {
        Row: {
          created_at: string | null
          deal_id: string
          id: string
          meta: Json | null
          org_id: string
          title: string | null
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id: string
          id?: string
          meta?: Json | null
          org_id: string
          title?: string | null
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string
          id?: string
          meta?: Json | null
          org_id?: string
          title?: string | null
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_attachments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_scores: {
        Row: {
          created_at: string
          deal_id: string
          id: string
          last_updated: string
          org_id: string
          score: number
          signals: Json | null
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: string
          last_updated?: string
          org_id: string
          score?: number
          signals?: Json | null
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: string
          last_updated?: string
          org_id?: string
          score?: number
          signals?: Json | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          company_name: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          expected_close_date: string | null
          id: string
          lost_reason: string | null
          org_id: string
          pipeline_id: string
          stage_id: string
          status: string
          title: string | null
          updated_at: string | null
          value_usd: number | null
        }
        Insert: {
          company_name?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          org_id: string
          pipeline_id: string
          stage_id: string
          status?: string
          title?: string | null
          updated_at?: string | null
          value_usd?: number | null
        }
        Update: {
          company_name?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expected_close_date?: string | null
          id?: string
          lost_reason?: string | null
          org_id?: string
          pipeline_id?: string
          stage_id?: string
          status?: string
          title?: string | null
          updated_at?: string | null
          value_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_stage_fk"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
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
          body: string | null
          campaign_id: string
          campaign_step_id: string | null
          contact_id: string
          created_at: string
          id: string
          org_id: string
          sender_id: string | null
          sent_at: string
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          campaign_id: string
          campaign_step_id?: string | null
          contact_id: string
          created_at?: string
          id?: string
          org_id: string
          sender_id?: string | null
          sent_at?: string
          status: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          campaign_id?: string
          campaign_step_id?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          org_id?: string
          sender_id?: string | null
          sent_at?: string
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
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
      file_processing_queue: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          import_id: string | null
          max_retries: number | null
          org_id: string
          processing_step: string
          retry_count: number | null
          scheduled_at: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          import_id?: string | null
          max_retries?: number | null
          org_id: string
          processing_step: string
          retry_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          import_id?: string | null
          max_retries?: number | null
          org_id?: string
          processing_step?: string
          retry_count?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_processing_queue_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "bulk_imports"
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
        Relationships: []
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
      gmail_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          refresh_token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string | null
          user_id?: string
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
          error_message: string
          id: string
          import_job_id: string
          org_id: string
          record: Json | null
          row_number: number
        }
        Insert: {
          created_at?: string
          error_message: string
          id?: string
          import_job_id: string
          org_id: string
          record?: Json | null
          row_number: number
        }
        Update: {
          created_at?: string
          error_message?: string
          id?: string
          import_job_id?: string
          org_id?: string
          record?: Json | null
          row_number?: number
        }
        Relationships: []
      }
      import_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_records: number
          id: string
          org_id: string
          processed_records: number
          source_file_name: string
          status: string
          total_records: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_records?: number
          id?: string
          org_id: string
          processed_records?: number
          source_file_name: string
          status?: string
          total_records: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_records?: number
          id?: string
          org_id?: string
          processed_records?: number
          source_file_name?: string
          status?: string
          total_records?: number
          updated_at?: string
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
          created_at: string
          id: string
          import_job_id: string
          org_id: string
          raw_data: Json | null
          source_file_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          import_job_id: string
          org_id: string
          raw_data?: Json | null
          source_file_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          import_job_id?: string
          org_id?: string
          raw_data?: Json | null
          source_file_name?: string | null
        }
        Relationships: []
      }
      lead_scores: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          last_updated: string
          org_id: string
          score: number
          signals: Json | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          last_updated?: string
          org_id: string
          score?: number
          signals?: Json | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          last_updated?: string
          org_id?: string
          score?: number
          signals?: Json | null
        }
        Relationships: []
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
      market_benchmarks: {
        Row: {
          benchmark_data: Json | null
          created_at: string
          id: string
          org_id: string
          origin_country: string
          transport_mode: string
          updated_at: string
        }
        Insert: {
          benchmark_data?: Json | null
          created_at?: string
          id?: string
          org_id: string
          origin_country: string
          transport_mode: string
          updated_at?: string
        }
        Update: {
          benchmark_data?: Json | null
          created_at?: string
          id?: string
          org_id?: string
          origin_country?: string
          transport_mode?: string
          updated_at?: string
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
          carrier_code: string | null
          carrier_name: string | null
          commodity_description: string | null
          company_name: string | null
          consignee_city: string | null
          consignee_country: string | null
          consignee_name: string | null
          consignee_state: string | null
          consignee_zip: string | null
          container_count: number | null
          container_number: string | null
          container_type_descriptions: string | null
          container_types: string | null
          created_at: string | null
          departure_date: string | null
          destination_city: string | null
          destination_country: string | null
          destination_port: string | null
          forwarder_name: string | null
          forwarder_scac_code: string | null
          freight_amount: number | null
          goods_description: string | null
          house_bol_number: string | null
          hs_code: string | null
          id: string
          importer_id: string | null
          importer_name: string | null
          is_lcl: boolean | null
          master_bol_number: string | null
          notify_party: string | null
          origin_country: string | null
          port_of_lading: string | null
          port_of_lading_id: string | null
          port_of_lading_name: string | null
          port_of_unlading: string | null
          port_of_unlading_id: string | null
          port_of_unlading_name: string | null
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
          voyage_number: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          bol_number?: string | null
          carrier_code?: string | null
          carrier_name?: string | null
          commodity_description?: string | null
          company_name?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_name?: string | null
          consignee_state?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          container_number?: string | null
          container_type_descriptions?: string | null
          container_types?: string | null
          created_at?: string | null
          departure_date?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_port?: string | null
          forwarder_name?: string | null
          forwarder_scac_code?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          house_bol_number?: string | null
          hs_code?: string | null
          id?: string
          importer_id?: string | null
          importer_name?: string | null
          is_lcl?: boolean | null
          master_bol_number?: string | null
          notify_party?: string | null
          origin_country?: string | null
          port_of_lading?: string | null
          port_of_lading_id?: string | null
          port_of_lading_name?: string | null
          port_of_unlading?: string | null
          port_of_unlading_id?: string | null
          port_of_unlading_name?: string | null
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
          voyage_number?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          bol_number?: string | null
          carrier_code?: string | null
          carrier_name?: string | null
          commodity_description?: string | null
          company_name?: string | null
          consignee_city?: string | null
          consignee_country?: string | null
          consignee_name?: string | null
          consignee_state?: string | null
          consignee_zip?: string | null
          container_count?: number | null
          container_number?: string | null
          container_type_descriptions?: string | null
          container_types?: string | null
          created_at?: string | null
          departure_date?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_port?: string | null
          forwarder_name?: string | null
          forwarder_scac_code?: string | null
          freight_amount?: number | null
          goods_description?: string | null
          house_bol_number?: string | null
          hs_code?: string | null
          id?: string
          importer_id?: string | null
          importer_name?: string | null
          is_lcl?: boolean | null
          master_bol_number?: string | null
          notify_party?: string | null
          origin_country?: string | null
          port_of_lading?: string | null
          port_of_lading_id?: string | null
          port_of_lading_name?: string | null
          port_of_unlading?: string | null
          port_of_unlading_id?: string | null
          port_of_unlading_name?: string | null
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
          voyage_number?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      org_feature_flags: {
        Row: {
          created_at: string
          enabled: boolean
          feature_name: string
          id: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feature_name: string
          id?: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feature_name?: string
          id?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          plan: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          plan?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          plan?: string
          updated_at?: string
        }
        Relationships: []
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
      pending_enrichment_records: {
        Row: {
          attempt_count: number | null
          attempts: number
          company_name: string
          created_at: string
          error_message: string | null
          id: string
          invalid_company_name: string | null
          last_attempt_at: string | null
          org_id: string
          original_data: Json
          original_record_id: string | null
          resolved_at: string | null
          resolved_company_name: string | null
          source_table: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number | null
          attempts?: number
          company_name: string
          created_at?: string
          error_message?: string | null
          id?: string
          invalid_company_name?: string | null
          last_attempt_at?: string | null
          org_id: string
          original_data?: Json
          original_record_id?: string | null
          resolved_at?: string | null
          resolved_company_name?: string | null
          source_table?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number | null
          attempts?: number
          company_name?: string
          created_at?: string
          error_message?: string | null
          id?: string
          invalid_company_name?: string | null
          last_attempt_at?: string | null
          org_id?: string
          original_data?: Json
          original_record_id?: string | null
          resolved_at?: string | null
          resolved_company_name?: string | null
          source_table?: string | null
          status?: string
          updated_at?: string
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
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          created_at: string | null
          id: string
          name: string
          org_id: string
          pipeline_id: string
          stage_order: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          org_id: string
          pipeline_id: string
          stage_order: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          org_id?: string
          pipeline_id?: string
          stage_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          created_at: string | null
          id: string
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string
          org_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          org_id?: string
        }
        Relationships: []
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
      push_subscriptions: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          keys: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          keys: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          keys?: Json
          user_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          created_at: string
          creator_id: string
          id: string
          line_items: Json | null
          org_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          creator_id: string
          id?: string
          line_items?: Json | null
          org_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          creator_id?: string
          id?: string
          line_items?: Json | null
          org_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      site_content: {
        Row: {
          content_type: string
          content_value: string
          created_at: string | null
          id: string
          meta_data: Json | null
          page_slug: string
          section_key: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content_type: string
          content_value: string
          created_at?: string | null
          id?: string
          meta_data?: Json | null
          page_slug: string
          section_key: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content_type?: string
          content_value?: string
          created_at?: string | null
          id?: string
          meta_data?: Json | null
          page_slug?: string
          section_key?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
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
          email_send_id: string
          event_data: Json | null
          event_timestamp: string
          event_type: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_send_id: string
          event_data?: Json | null
          event_timestamp?: string
          event_type: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_send_id?: string
          event_data?: Json | null
          event_timestamp?: string
          event_type?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trade_shipments: {
        Row: {
          arrival_date: string | null
          commodity_code: string | null
          commodity_description: string | null
          confidence_score: number | null
          consignee_name: string | null
          created_at: string | null
          destination_city: string | null
          destination_country: string | null
          destination_port: string | null
          destination_state: string | null
          enriched_data: Json | null
          enrichment_status: string | null
          freight_charges: number | null
          id: string
          import_id: string | null
          inferred_company_name: string | null
          org_id: string
          origin_city: string | null
          origin_country: string | null
          origin_port: string | null
          origin_state: string | null
          shipment_date: string | null
          shipment_reference: string | null
          shipper_name: string | null
          transportation_mode: string | null
          updated_at: string | null
          value_usd: number | null
          vessel_name: string | null
          weight_kg: number | null
        }
        Insert: {
          arrival_date?: string | null
          commodity_code?: string | null
          commodity_description?: string | null
          confidence_score?: number | null
          consignee_name?: string | null
          created_at?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_port?: string | null
          destination_state?: string | null
          enriched_data?: Json | null
          enrichment_status?: string | null
          freight_charges?: number | null
          id?: string
          import_id?: string | null
          inferred_company_name?: string | null
          org_id: string
          origin_city?: string | null
          origin_country?: string | null
          origin_port?: string | null
          origin_state?: string | null
          shipment_date?: string | null
          shipment_reference?: string | null
          shipper_name?: string | null
          transportation_mode?: string | null
          updated_at?: string | null
          value_usd?: number | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Update: {
          arrival_date?: string | null
          commodity_code?: string | null
          commodity_description?: string | null
          confidence_score?: number | null
          consignee_name?: string | null
          created_at?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_port?: string | null
          destination_state?: string | null
          enriched_data?: Json | null
          enrichment_status?: string | null
          freight_charges?: number | null
          id?: string
          import_id?: string | null
          inferred_company_name?: string | null
          org_id?: string
          origin_city?: string | null
          origin_country?: string | null
          origin_port?: string | null
          origin_state?: string | null
          shipment_date?: string | null
          shipment_reference?: string | null
          shipper_name?: string | null
          transportation_mode?: string | null
          updated_at?: string | null
          value_usd?: number | null
          vessel_name?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_shipments_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "bulk_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_shipments: {
        Row: {
          air_confidence_score: number | null
          arrival_date: string | null
          bill_of_lading_number: string | null
          bol_number: string | null
          carrier_code: string | null
          carrier_name: string | null
          commodity_description: string | null
          consignee: string | null
          consignee_address: string | null
          consignee_city: string | null
          consignee_email_1: string | null
          consignee_employees: string | null
          consignee_full_address: string | null
          consignee_industry: string | null
          consignee_name: string | null
          consignee_phone_1: string | null
          consignee_postal_code: string | null
          consignee_revenue: string | null
          consignee_state_region: string | null
          consignee_trade_roles: string | null
          consignee_website_1: string | null
          container_count: number | null
          container_marks: string | null
          container_number: string | null
          container_type_descriptions: string | null
          container_types: string | null
          created_at: string | null
          departure_date: string | null
          description: string | null
          destination_city: string | null
          destination_country: string | null
          destination_state: string | null
          forwarder_name: string | null
          forwarder_scac_code: string | null
          goods_shipped: string | null
          gross_weight_kg: number | null
          house_bol_number: string | null
          hs_code: string | null
          hs_description: string | null
          id: string
          importer_id: string | null
          importer_name: string | null
          is_lcl: boolean | null
          is_likely_air_shipper: boolean | null
          master_bol_number: string | null
          matching_fields: string | null
          mode: string | null
          notify_party: string | null
          number_of_containers: number | null
          org_id: string | null
          origin_country: string | null
          port_of_discharge: string | null
          port_of_lading: string | null
          port_of_lading_country: string | null
          port_of_lading_id: string | null
          port_of_lading_name: string | null
          port_of_lading_region: string | null
          port_of_loading: string | null
          port_of_unlading: string | null
          port_of_unlading_id: string | null
          port_of_unlading_name: string | null
          port_of_unlading_region: string | null
          quantity: number | null
          shipment_date: string | null
          shipment_destination: string | null
          shipment_destination_region: string | null
          shipment_mode: string | null
          shipment_origin: string | null
          shipment_type: string | null
          shipper: string | null
          shipper_address: string | null
          shipper_city: string | null
          shipper_email_1: string | null
          shipper_employees: string | null
          shipper_full_address: string | null
          shipper_industry: string | null
          shipper_name: string | null
          shipper_phone_1: string | null
          shipper_postal_code: string | null
          shipper_revenue: string | null
          shipper_state_region: string | null
          shipper_trade_roles: string | null
          transport_method: string | null
          transport_mode: string | null
          unified_carrier: string | null
          unified_company_name: string | null
          unified_date: string | null
          unified_destination: string | null
          unified_id: string | null
          unified_value: number | null
          unified_weight: number | null
          updated_at: string | null
          value_usd: number | null
          vessel: string | null
          vessel_imo: string | null
          vessel_name: string | null
          vessel_voyage_id: string | null
          voyage_number: string | null
          w: string | null
          weight_kg: number | null
          weight_original_format: string | null
          weight_t: number | null
        }
        Insert: {
          air_confidence_score?: number | null
          arrival_date?: string | null
          bill_of_lading_number?: string | null
          bol_number?: string | null
          carrier_code?: string | null
          carrier_name?: string | null
          commodity_description?: string | null
          consignee?: string | null
          consignee_address?: string | null
          consignee_city?: string | null
          consignee_email_1?: string | null
          consignee_employees?: string | null
          consignee_full_address?: string | null
          consignee_industry?: string | null
          consignee_name?: string | null
          consignee_phone_1?: string | null
          consignee_postal_code?: string | null
          consignee_revenue?: string | null
          consignee_state_region?: string | null
          consignee_trade_roles?: string | null
          consignee_website_1?: string | null
          container_count?: number | null
          container_marks?: string | null
          container_number?: string | null
          container_type_descriptions?: string | null
          container_types?: string | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_state?: string | null
          forwarder_name?: string | null
          forwarder_scac_code?: string | null
          goods_shipped?: string | null
          gross_weight_kg?: number | null
          house_bol_number?: string | null
          hs_code?: string | null
          hs_description?: string | null
          id?: string
          importer_id?: string | null
          importer_name?: string | null
          is_lcl?: boolean | null
          is_likely_air_shipper?: boolean | null
          master_bol_number?: string | null
          matching_fields?: string | null
          mode?: string | null
          notify_party?: string | null
          number_of_containers?: number | null
          org_id?: string | null
          origin_country?: string | null
          port_of_discharge?: string | null
          port_of_lading?: string | null
          port_of_lading_country?: string | null
          port_of_lading_id?: string | null
          port_of_lading_name?: string | null
          port_of_lading_region?: string | null
          port_of_loading?: string | null
          port_of_unlading?: string | null
          port_of_unlading_id?: string | null
          port_of_unlading_name?: string | null
          port_of_unlading_region?: string | null
          quantity?: number | null
          shipment_date?: string | null
          shipment_destination?: string | null
          shipment_destination_region?: string | null
          shipment_mode?: string | null
          shipment_origin?: string | null
          shipment_type?: string | null
          shipper?: string | null
          shipper_address?: string | null
          shipper_city?: string | null
          shipper_email_1?: string | null
          shipper_employees?: string | null
          shipper_full_address?: string | null
          shipper_industry?: string | null
          shipper_name?: string | null
          shipper_phone_1?: string | null
          shipper_postal_code?: string | null
          shipper_revenue?: string | null
          shipper_state_region?: string | null
          shipper_trade_roles?: string | null
          transport_method?: string | null
          transport_mode?: string | null
          unified_carrier?: string | null
          unified_company_name?: string | null
          unified_date?: string | null
          unified_destination?: string | null
          unified_id?: string | null
          unified_value?: number | null
          unified_weight?: number | null
          updated_at?: string | null
          value_usd?: number | null
          vessel?: string | null
          vessel_imo?: string | null
          vessel_name?: string | null
          vessel_voyage_id?: string | null
          voyage_number?: string | null
          w?: string | null
          weight_kg?: number | null
          weight_original_format?: string | null
          weight_t?: number | null
        }
        Update: {
          air_confidence_score?: number | null
          arrival_date?: string | null
          bill_of_lading_number?: string | null
          bol_number?: string | null
          carrier_code?: string | null
          carrier_name?: string | null
          commodity_description?: string | null
          consignee?: string | null
          consignee_address?: string | null
          consignee_city?: string | null
          consignee_email_1?: string | null
          consignee_employees?: string | null
          consignee_full_address?: string | null
          consignee_industry?: string | null
          consignee_name?: string | null
          consignee_phone_1?: string | null
          consignee_postal_code?: string | null
          consignee_revenue?: string | null
          consignee_state_region?: string | null
          consignee_trade_roles?: string | null
          consignee_website_1?: string | null
          container_count?: number | null
          container_marks?: string | null
          container_number?: string | null
          container_type_descriptions?: string | null
          container_types?: string | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          destination_city?: string | null
          destination_country?: string | null
          destination_state?: string | null
          forwarder_name?: string | null
          forwarder_scac_code?: string | null
          goods_shipped?: string | null
          gross_weight_kg?: number | null
          house_bol_number?: string | null
          hs_code?: string | null
          hs_description?: string | null
          id?: string
          importer_id?: string | null
          importer_name?: string | null
          is_lcl?: boolean | null
          is_likely_air_shipper?: boolean | null
          master_bol_number?: string | null
          matching_fields?: string | null
          mode?: string | null
          notify_party?: string | null
          number_of_containers?: number | null
          org_id?: string | null
          origin_country?: string | null
          port_of_discharge?: string | null
          port_of_lading?: string | null
          port_of_lading_country?: string | null
          port_of_lading_id?: string | null
          port_of_lading_name?: string | null
          port_of_lading_region?: string | null
          port_of_loading?: string | null
          port_of_unlading?: string | null
          port_of_unlading_id?: string | null
          port_of_unlading_name?: string | null
          port_of_unlading_region?: string | null
          quantity?: number | null
          shipment_date?: string | null
          shipment_destination?: string | null
          shipment_destination_region?: string | null
          shipment_mode?: string | null
          shipment_origin?: string | null
          shipment_type?: string | null
          shipper?: string | null
          shipper_address?: string | null
          shipper_city?: string | null
          shipper_email_1?: string | null
          shipper_employees?: string | null
          shipper_full_address?: string | null
          shipper_industry?: string | null
          shipper_name?: string | null
          shipper_phone_1?: string | null
          shipper_postal_code?: string | null
          shipper_revenue?: string | null
          shipper_state_region?: string | null
          shipper_trade_roles?: string | null
          transport_method?: string | null
          transport_mode?: string | null
          unified_carrier?: string | null
          unified_company_name?: string | null
          unified_date?: string | null
          unified_destination?: string | null
          unified_id?: string | null
          unified_value?: number | null
          unified_weight?: number | null
          updated_at?: string | null
          value_usd?: number | null
          vessel?: string | null
          vessel_imo?: string | null
          vessel_name?: string | null
          vessel_voyage_id?: string | null
          voyage_number?: string | null
          w?: string | null
          weight_kg?: number | null
          weight_original_format?: string | null
          weight_t?: number | null
        }
        Relationships: []
      }
      user_notification_prefs: {
        Row: {
          browser: boolean | null
          email: boolean | null
          mobile: boolean | null
          updated_at: string | null
          user_id: string
          weekly: boolean | null
        }
        Insert: {
          browser?: boolean | null
          email?: boolean | null
          mobile?: boolean | null
          updated_at?: string | null
          user_id: string
          weekly?: boolean | null
        }
        Update: {
          browser?: boolean | null
          email?: boolean | null
          mobile?: boolean | null
          updated_at?: string | null
          user_id?: string
          weekly?: boolean | null
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
          created_at: string
          email: string
          full_name: string | null
          id: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          org_id?: string
          updated_at?: string
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
      is_valid_company_name: {
        Args: { company_name: string }
        Returns: boolean
      }
      is_valid_company_name_excel: {
        Args: { company_name: string }
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
      standardize_company_name: {
        Args: { company_name: string }
        Returns: string
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
