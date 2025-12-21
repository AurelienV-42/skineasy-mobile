import { z } from 'zod'

export const sleepQualityEnum = z.enum(['bad', 'neutral', 'good'])

export const sleepSchema = z.object({
  hours: z.number().min(0).max(24),
  quality: sleepQualityEnum,
  date: z.string().optional(), // ISO date string
})

export const nutritionSchema = z.object({
  imageUri: z.string(),
  note: z.string().optional(),
  date: z.string().optional(), // ISO date string
})

export const sportActivityEnum = z.enum([
  'yoga',
  'cardio',
  'hiit',
  'pilates',
  'running',
  'walking',
  'strength',
  'swimming',
  'cycling',
  'other',
])

export const sportSchema = z.object({
  activity: sportActivityEnum,
  duration: z.number().min(1),
  note: z.string().optional(),
  date: z.string().optional(), // ISO date string
})

export const journalEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  sleep: sleepSchema.optional(),
  nutrition: z.array(nutritionSchema).optional(),
  sport: z.array(sportSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type SleepQuality = z.infer<typeof sleepQualityEnum>
export type SleepEntry = z.infer<typeof sleepSchema>
export type NutritionEntry = z.infer<typeof nutritionSchema>
export type SportActivity = z.infer<typeof sportActivityEnum>
export type SportEntry = z.infer<typeof sportSchema>
export type JournalEntry = z.infer<typeof journalEntrySchema>
