import type { MealEntry, SleepEntry, SportEntry } from '@shared/types/journal.types'

const SLEEP_WEIGHT = 0.4
const NUTRITION_WEIGHT = 0.3
const ACTIVITY_WEIGHT = 0.3

const OPTIMAL_SLEEP_MIN = 7
const OPTIMAL_SLEEP_MAX = 9
const SLEEP_HOURS_WEIGHT = 0.6
const SLEEP_QUALITY_WEIGHT = 0.4

const TARGET_ACTIVITY_MINUTES = 30
const INTENSITY_BONUS_THRESHOLD = 3
const INTENSITY_BONUS_PER_LEVEL = 0.1

const POINTS_PER_MEAL_TYPE = 25
const DETAIL_BONUS_PER_MEAL = 5
const MAX_DETAIL_BONUS = 20

export function calculateSleepScore(entry: SleepEntry | undefined): number {
  if (!entry) return 0

  let hoursScore: number
  if (entry.hours >= OPTIMAL_SLEEP_MIN && entry.hours <= OPTIMAL_SLEEP_MAX) {
    hoursScore = 100
  } else if (entry.hours < OPTIMAL_SLEEP_MIN) {
    hoursScore = Math.max(0, (entry.hours / OPTIMAL_SLEEP_MIN) * 100)
  } else {
    hoursScore = Math.max(0, 100 - (entry.hours - OPTIMAL_SLEEP_MAX) * 20)
  }

  const qualityScore = entry.quality * 20

  return hoursScore * SLEEP_HOURS_WEIGHT + qualityScore * SLEEP_QUALITY_WEIGHT
}

export function calculateActivityScore(entries: SportEntry[]): number {
  if (entries.length === 0) return 0

  const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0)
  const avgIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length

  const durationScore = Math.min(100, (totalMinutes / TARGET_ACTIVITY_MINUTES) * 100)

  const intensityBonus = Math.max(0, avgIntensity - INTENSITY_BONUS_THRESHOLD)
  const intensityMultiplier = 1 + intensityBonus * INTENSITY_BONUS_PER_LEVEL

  return Math.min(100, durationScore * intensityMultiplier)
}

export function calculateNutritionScore(entries: MealEntry[]): number {
  if (entries.length === 0) return 0

  const mealTypes = new Set(entries.map((e) => e.meal_type).filter(Boolean))
  const typeScore = mealTypes.size * POINTS_PER_MEAL_TYPE

  const detailedMeals = entries.filter((e) => e.photo_url || e.food_name).length
  const detailBonus = Math.min(MAX_DETAIL_BONUS, detailedMeals * DETAIL_BONUS_PER_MEAL)

  return Math.min(100, typeScore + detailBonus)
}

export function calculateDayScore(
  sleepEntry: SleepEntry | undefined,
  mealEntries: MealEntry[],
  sportEntries: SportEntry[]
): number {
  const sleepScore = calculateSleepScore(sleepEntry)
  const nutritionScore = calculateNutritionScore(mealEntries)
  const activityScore = calculateActivityScore(sportEntries)

  return Math.round(
    sleepScore * SLEEP_WEIGHT + nutritionScore * NUTRITION_WEIGHT + activityScore * ACTIVITY_WEIGHT
  )
}
