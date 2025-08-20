export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type Database = {
  public: {
    Tables: {
      import_jobs: {
        Row: {
          id: string;
          org_id: string | null;
          source_bucket: string | null;
          object_path: string | null;
          status: 'queued'|'running'|'success'|'error';
          total_rows: number | null;
          ok_rows: number | null;
          error_rows: number | null;
          processing_metadata: Json | null;
          created_at: string | null;
          finished_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['import_jobs']['Row']>;
        Update: Partial<Database['public']['Tables']['import_jobs']['Row']>;
      };
      activities: {
        Row: {
          id: string;
          org_id: string | null;
          contact_id: string | null;
          type: string;
          status: string | null;
          due_at: string | null;
          notes: string | null;
          created_at: string | null;
          created_by: string | null;
          completed_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['activities']['Row']>;
        Update: Partial<Database['public']['Tables']['activities']['Row']>;
      };
    };
  };
};
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];