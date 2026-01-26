export const scoreConfig = {
  weights: {
    sleep: 0.4,
    nutrition: 0.3,
    activity: 0.3,
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
}
