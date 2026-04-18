import { mapSupabaseError } from '@lib/error-mapper';
import { supabase } from '@lib/supabase';
import type {
  JournalWeekResponse,
  MealEntry,
  ObservationEntry,
  SleepEntry,
  SportEntry,
  StressEntry,
} from '@shared/types/journal.types';

import { getUserId } from '@features/journal/data/utils';

export async function getEntriesByDateRange(
  startDate: string,
  endDate: string,
): Promise<JournalWeekResponse> {
  const userId = await getUserId();

  const [sleeps, sports, meals, stresses, observations] = await Promise.all([
    supabase
      .from('sleep_entries')
      .select()
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate),
    supabase
      .from('sport_entries')
      .select()
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate),
    supabase
      .from('meal_entries')
      .select()
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate),
    supabase
      .from('stress_entries')
      .select()
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate),
    supabase
      .from('observation_entries')
      .select()
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate),
  ]);

  if (sleeps.error) throw mapSupabaseError(sleeps.error);
  if (sports.error) throw mapSupabaseError(sports.error);
  if (meals.error) throw mapSupabaseError(meals.error);
  if (stresses.error) throw mapSupabaseError(stresses.error);
  if (observations.error) throw mapSupabaseError(observations.error);

  return {
    sleeps: (sleeps.data ?? []) as SleepEntry[],
    sports: (sports.data ?? []) as SportEntry[],
    meals: (meals.data ?? []) as MealEntry[],
    stresses: (stresses.data ?? []) as StressEntry[],
    observations: (observations.data ?? []) as ObservationEntry[],
  };
}
