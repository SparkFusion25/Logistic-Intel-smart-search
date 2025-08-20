export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string;
          org_id: string | null;
          deal_id: string | null;
          contact_id: string | null;
          type: 'meeting' | 'call' | 'task' | 'email';
          title: string | null;
          body: string | null;
          scheduled_at: string | null; // ISO string from timestamptz
          completed_at: string | null;
          created_by: string | null;
          created_at: string; // ISO
        };
        Insert: {
          org_id?: string | null;
          deal_id?: string | null;
          contact_id?: string | null;
          type: 'meeting' | 'call' | 'task' | 'email';
          title?: string | null;
          body?: string | null;
          scheduled_at?: string | null;
          completed_at?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['activities']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}