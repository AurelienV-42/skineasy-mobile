// Auth types
export interface LoginResponse {
  access_token: string
}

export interface RegisterResponse {
  access_token: string
}

export interface MeResponse {
  id: string
  email: string
  firstname: string
  lastname: string
  skinType?: string
}

export interface RefreshTokenResponse {
  access_token: string
}

// User types
export interface User {
  id: string
  email: string
  firstname: string
  lastname: string
  skinType?: string
}

// Diagnosis types
export interface Diagnosis {
  id: string
  skinType: string
  concerns: string[]
  createdAt: string
  routine: Routine
}

export interface Routine {
  morning: RoutineStep[]
  evening: RoutineStep[]
}

export interface RoutineStep {
  order: number
  name: string
  product: Product
}

export interface Product {
  id: string
  name: string
  brand: string
  image: string
  description: string
  whyRecommended: string
  prestashopId: number
}

// Journal types
export type JournalEntryType = 'sleep' | 'nutrition' | 'sport'

export interface JournalEntry {
  id: string
  type: JournalEntryType
  date: string
  createdAt: string
  data: SleepData | NutritionData | SportData
}

export interface SleepData {
  quality: 1 | 2 | 3
  hours: number
}

export interface NutritionData {
  imageUrl: string
  note?: string
}

export interface SportData {
  activity: string
  duration: number
  note?: string
}

// API Error
export interface ApiError {
  message: string
  statusCode: number
}
