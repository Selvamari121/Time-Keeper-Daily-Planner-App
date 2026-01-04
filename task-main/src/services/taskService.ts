import { supabase } from '../lib/supabase';
import type { Task, TaskInsert, TaskUpdate } from '../lib/database.types';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('start_time', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return data || [];
  },

  async getTasksByDate(date: Date): Promise<Task[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getTaskById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createTask(task: TaskInsert): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getOverdueTasks(): Promise<Task[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .lt('end_time', now)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('end_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
