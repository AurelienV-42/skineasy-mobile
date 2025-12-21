/**
 * Journal Entry Types
 * Based on BACKEND_API.md specification
 */

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
  | 'other'

// Sport Type Info (from backend /api/v1/sport-types)
export interface SportTypeInfo {
  id: number
  name: SportType
  created_at: string
}

// Meal Types (predefined enum from backend)
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

// Sleep Quality (1-5 scale)
export type SleepQuality = 1 | 2 | 3 | 4 | 5

// Sport Intensity (1-5 scale)
export type SportIntensity = 1 | 2 | 3 | 4 | 5

/**
 * Sleep Entry
 * One entry per customer per day (unique constraint)
 */
export interface SleepEntry {
  id: number
  customer_id: number
  date: string // ISO 8601 UTC format: "2025-01-15T00:00:00.000Z"
  hours: number // 0-24
  quality: SleepQuality // 1-5
  created_at: string // ISO 8601
}

/**
 * Sport Entry
 * Multiple entries per day allowed
 */
export interface SportEntry {
  id: number
  customer_id: number
  date: string // ISO 8601 UTC format: "2025-01-15T00:00:00.000Z"
  sport_type_id: number // Foreign key to sport_types table
  sportType: SportTypeInfo // Populated sport type object from backend
  duration: number // minutes (min: 1)
  intensity: SportIntensity // 1-5
  note: string | null // Optional text note
  created_at: string // ISO 8601
}

/**
 * Meal Entry
 * Multiple entries per day allowed
 */
export interface MealEntry {
  id: number
  customer_id: number
  date: string // ISO 8601 UTC format: "2025-01-15T00:00:00.000Z"
  photo_url: string | null
  note: string | null
  meal_type: MealType | null
  created_at: string // ISO 8601
}

/**
 * DTOs for creating/updating entries
 */

export interface CreateSleepEntryDto {
  date: string // ISO 8601 UTC format: "2025-01-15T00:00:00.000Z"
  hours: number // 0-24
  quality: SleepQuality // 1-5
}

export interface CreateSportEntryDto {
  date: string // ISO 8601 UTC format: "2025-01-15T00:00:00.000Z"
  sport_type_id: number // Sport type ID from backend
  duration: number // minutes (min: 1)
  intensity: SportIntensity // 1-5
  note?: string | null // Optional text note (max 500 chars)
}

export interface CreateMealEntryDto {
  date: string // ISO 8601 UTC format: "2025-01-15T00:00:00.000Z"
  photo_url?: string | null
  note?: string | null
  meal_type?: MealType | null
}

/**
 * Sleep Upsert Response
 * Indicates whether a new entry was created or an existing one was updated
 */
export interface SleepUpsertResponse {
  data: SleepEntry
  created: boolean // true if new entry, false if updated existing
}

/**
 * Image Upload Response
 */
export interface ImageUploadResponse {
  url: string
}

/**
 * Journal Entries Response (for GET requests)
 */
export interface JournalEntriesResponse {
  sleep: SleepEntry[]
  sport: SportEntry[]
  meals: MealEntry[]
}
