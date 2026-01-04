export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          priority: string;
          start_time: string | null;
          end_time: string | null;
          estimated_duration: number;
          status: string;
          notes: string;
          tags: string[];
          attachment_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          category?: string;
          priority?: string;
          start_time?: string | null;
          end_time?: string | null;
          estimated_duration?: number;
          status?: string;
          notes?: string;
          tags?: string[];
          attachment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          priority?: string;
          start_time?: string | null;
          end_time?: string | null;
          estimated_duration?: number;
          status?: string;
          notes?: string;
          tags?: string[];
          attachment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      time_sessions: {
        Row: {
          id: string;
          task_id: string | null;
          start_time: string;
          end_time: string | null;
          duration: number;
          break_duration: number;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id?: string | null;
          start_time?: string;
          end_time?: string | null;
          duration?: number;
          break_duration?: number;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string | null;
          start_time?: string;
          end_time?: string | null;
          duration?: number;
          break_duration?: number;
          notes?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type TimeSession = Database['public']['Tables']['time_sessions']['Row'];
export type TimeSessionInsert = Database['public']['Tables']['time_sessions']['Insert'];
export type TimeSessionUpdate = Database['public']['Tables']['time_sessions']['Update'];
