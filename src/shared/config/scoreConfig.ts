export const scoreConfig = {
  weights: {
    sleep: 0.35,
    nutrition: 0.25,
    activity: 0.25,
    stress: 0.15,
  },
  sleep: {
    hoursWeight: 0.6,
    qualityWeight: 0.4,
    optimalHoursMin: 7,
    optimalHoursMax: 9,
    oversleepPenaltyPerHour: 20,
  },
  activity: {
    targetMinutes: 30,
    intensityBonusThreshold: 3,
    intensityBonusPerLevel: 0.1,
  },
  nutrition: {
    pointsPerMealType: 25,
    detailBonusPerMeal: 5,
    maxDetailBonus: 20,
  },
  stress: {
    // Lower stress = better score (inverse relationship)
    // Level 1 (minimal) = 100, Level 5 (intense) = 20
    maxScore: 100,
    minScore: 20,
  },
}
