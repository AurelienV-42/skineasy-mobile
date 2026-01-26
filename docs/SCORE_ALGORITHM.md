# Score Algorithm

Daily wellness score (0-100) computed from sleep, nutrition, and activity data.

---

## Weights

| Category  | Weight |
| --------- | ------ |
| Sleep     | 40%    |
| Nutrition | 30%    |
| Activity  | 30%    |

```
totalScore = (sleepScore * 0.4) + (nutritionScore * 0.3) + (activityScore * 0.3)
```

---

## Sleep Score (0-100)

Based on `SleepEntry.hours` and `SleepEntry.quality`.

### Hours Component (60%)

| Hours | Score                      |
| ----- | -------------------------- |
| 7-9h  | 100                        |
| < 7h  | `(hours / 7) * 100`        |
| > 9h  | `100 - ((hours - 9) * 20)` |

### Quality Component (40%)

| Quality (1-5) | Score |
| ------------- | ----- |
| 1             | 20    |
| 2             | 40    |
| 3             | 60    |
| 4             | 80    |
| 5             | 100   |

**Formula:** `hoursScore * 0.6 + qualityScore * 0.4`

---

## Activity Score (0-100)

Based on `SportEntry.duration` (minutes) and `SportEntry.intensity` (1-5).

### Duration Component

Target: 30 minutes/day = 100 points (capped)

```
durationScore = min(100, (totalMinutes / 30) * 100)
```

### Intensity Bonus

For average intensity > 3, apply multiplier:

```
intensityMultiplier = 1 + ((avgIntensity - 3) * 0.1)
```

**Formula:** `min(100, durationScore * intensityMultiplier)`

---

## Nutrition Score (0-100)

Based on `MealEntry.meal_type`, `photo_url`, and `food_name`.

### Meal Type Points

25 points per unique meal type logged:

| Meal Types Logged | Score |
| ----------------- | ----- |
| 1                 | 25    |
| 2                 | 50    |
| 3                 | 75    |
| 4                 | 100   |

### Detail Bonus

+5 points per meal with `photo_url` OR `food_name` (max 20 bonus).

**Formula:** `min(100, typeScore + detailBonus)`

---

## Missing Data

No data logged = 0 score for that category.

---

## Files

| File                                                   | Purpose               |
| ------------------------------------------------------ | --------------------- |
| `src/features/dashboard/utils/score.ts`                | Scoring functions     |
| `src/features/dashboard/hooks/useWeekScores.ts`        | Hook for 7-day scores |
| `src/features/dashboard/utils/__tests__/score.test.ts` | Unit tests            |

---

## Examples

### Perfect Day

- Sleep: 8h, quality 5 → 100
- Meals: breakfast, lunch, dinner, snack with photos → 100
- Activity: 30min, intensity 4 → 100
- **Total: 100**

### Partial Day

- Sleep: 6h, quality 3 → `(6/7)*100*0.6 + 60*0.4` = 51.4 + 24 = 75.4
- Meals: breakfast only → 25
- Activity: none → 0
- **Total: `75.4*0.4 + 25*0.3 + 0*0.3` = 30 + 8 = 38**
