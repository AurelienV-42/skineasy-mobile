import { mapSupabaseError } from '@lib/error-mapper';
import { supabase } from '@lib/supabase';
import type { Database } from '@lib/supabase.types';
import type { CreateSleepEntryDto, SleepEntry } from '@shared/types/journal.types';

import { getUserId } from '@features/journal/data/utils';

export async function getSleepByDate(date: string): Promise<SleepEntry[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('sleep_entries')
    .select()
    .eq('user_id', userId)
    .eq('date', date);
  if (error) throw mapSupabaseError(error);
  return data as SleepEntry[];
}

export async function upsertSleep(dto: CreateSleepEntryDto): Promise<SleepEntry> {
  const userId = await getUserId();
  const insertData: Database['public']['Tables']['sleep_entries']['Insert'] = {
    ...dto,
    user_id: userId,
  };
  const { data, error } = await supabase
    .from('sleep_entries')
    .upsert(insertData, { onConflict: 'user_id,date' })
    .select()
    .single();
  if (error) throw mapSupabaseError(error);
  return data as SleepEntry;
}

export async function deleteSleep(id: string): Promise<void> {
  const { error } = await supabase.from('sleep_entries').delete().eq('id', id);
  if (error) throw mapSupabaseError(error);
}
