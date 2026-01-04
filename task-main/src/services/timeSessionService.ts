import { supabase } from '../lib/supabase';
import type { TimeSession, TimeSessionInsert, TimeSessionUpdate } from '../lib/database.types';

export const timeSessionService = {
  async getSessionsByTaskId(taskId: string): Promise<TimeSession[]> {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .eq('task_id', taskId)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getActiveSession(): Promise<TimeSession | null> {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .is('end_time', null)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createSession(session: TimeSessionInsert): Promise<TimeSession> {
    const { data, error } = await supabase
      .from('time_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSession(id: string, updates: TimeSessionUpdate): Promise<TimeSession> {
    const { data, error } = await supabase
      .from('time_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async endSession(id: string, duration: number): Promise<TimeSession> {
    const { data, error } = await supabase
      .from('time_sessions')
      .update({
        end_time: new Date().toISOString(),
        duration,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSessionsByDateRange(startDate: Date, endDate: Date): Promise<TimeSession[]> {
    const { data, error } = await supabase
      .from('time_sessions')
      .select('*')
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTotalTimeByTask(taskId: string): Promise<number> {
    const sessions = await this.getSessionsByTaskId(taskId);
    return sessions.reduce((total, session) => total + (session.duration || 0), 0);
  },
};
