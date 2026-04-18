import { mapSupabaseError } from '@lib/error-mapper';
import { supabase } from '@lib/supabase';
import type { Database } from '@lib/supabase.types';
import type { CreateStressEntryDto, StressEntry } from '@shared/types/journal.types';

import { getUserId } from '@features/journal/data/utils';

export async function getStressByDate(date: string): Promise<StressEntry[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('stress_entries')
    .select()
    .eq('user_id', userId)
    .eq('date', date);
  if (error) throw mapSupabaseError(error);
  return data as StressEntry[];
}

export async function upsertStress(dto: CreateStressEntryDto): Promise<StressEntry> {
  const userId = await getUserId();
  const insertData: Database['public']['Tables']['stress_entries']['Insert'] = {
    ...dto,
    user_id: userId,
  };
  const { data, error } = await supabase
    .from('stress_entries')
    .upsert(insertData, { onConflict: 'user_id,date' })
    .select()
    .single();
  if (error) throw mapSupabaseError(error);
  return data as StressEntry;
}

export async function deleteStress(id: string): Promise<void> {
  const { error } = await supabase.from('stress_entries').delete().eq('id', id);
  if (error) throw mapSupabaseError(error);
}
