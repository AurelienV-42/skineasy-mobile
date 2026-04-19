// Sport Types (predefined enum from backend)
export type SportType =
  | 'yoga'
  | 'cardio'
  | 'swimming'
  | 'running'
  | 'cycling'
  | 'strength'
  | 'pilates'
  | 'hiking'
  | 'dancing'
  | 'other';

// Sport Type Info
export interface SportTypeInfo {
  id: string;
  name: SportType;
  created_at: string;
}

// Meal Types
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Sleep Quality (1-5 scale)
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

// Sport Intensity (1-5 scale)
export type SportIntensity = 1 | 2 | 3 | 4 | 5;

// Stress Level (1-5 scale)
export type StressLevel = 1 | 2 | 3 | 4 | 5;

// Meal Quality (1-5 scale, user-rated nutritional quality)
export type MealQuality = 1 | 2 | 3 | 4 | 5;

/**
 * Sleep Entry
 * One entry per user per day (unique constraint on user_id, date)
 */
export interface SleepEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  hours: number; // 0-24
  quality: SleepQuality; // 1-5
  created_at: string;
}

/**
 * Sport Entry
 * Multiple entries per day allowed
 */
export interface SportEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  sport_type_id: string;
  sportType?: SportTypeInfo;
  duration: number; // minutes
  intensity: SportIntensity; // 1-5
  note: string | null;
  created_at: string;
}

/**
 * Meal Entry
 * Multiple entries per day allowed
 */
export interface MealEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  photo_url: string | null;
  food_name: string | null;
  note: string | null;
  meal_type: MealType | null;
  quality: MealQuality | null; // 1-5 user-rated nutritional quality
  created_at: string;
}

/**
 * Stress Entry
 * One entry per user per day (unique constraint)
 */
export interface StressEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  level: StressLevel; // 1-5
  note: string | null;
  created_at: string;
}

/**
 * Observation Entry
 * One entry per user per day (unique constraint)
 */
export interface ObservationEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  positives: string[];
  negatives: string[];
  created_at: string;
}

/**
 * DTOs for creating/updating entries
 */

export interface CreateSleepEntryDto {
  date: string; // YYYY-MM-DD
  hours: number;
  quality: SleepQuality;
}

export interface CreateSportEntryDto {
  date: string; // YYYY-MM-DD
  sport_type_id: string;
  duration: number; // minutes
  intensity: SportIntensity;
  note?: string | null;
}

export interface CreateMealEntryDto {
  date: string; // YYYY-MM-DD
  photo_url?: string | null;
  food_name?: string | null;
  note?: string | null;
  meal_type?: MealType | null;
  quality: MealQuality; // 1-5 required on new entries
}

export interface CreateStressEntryDto {
  date: string; // YYYY-MM-DD
  level: StressLevel;
  note?: string | null;
}

export interface CreateObservationEntryDto {
  date: string; // YYYY-MM-DD
  positives: string[];
  negatives: string[];
}

/**
 * Journal Week Response (5 parallel queries assembled client-side)
 */
export interface JournalWeekResponse {
  sleeps: SleepEntry[];
  sports: SportEntry[];
  meals: MealEntry[];
  stresses: StressEntry[];
  observations: ObservationEntry[];
}
