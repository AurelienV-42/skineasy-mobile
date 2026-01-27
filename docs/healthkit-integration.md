# Apple Health Integration

## Compatibility

| Requirement | Minimum                              |
| ----------- | ------------------------------------ |
| iOS         | 15.1+ (Expo SDK 54)                  |
| Device      | Physical iPhone only (not simulator) |
| Android     | Not supported                        |

HealthKit was introduced in iOS 8, but Expo SDK 54 requires iOS 15.1+.

## What We Sync

| HealthKit Data                            | App Entry    | Mapping                                                      |
| ----------------------------------------- | ------------ | ------------------------------------------------------------ |
| Sleep Analysis                            | `SleepEntry` | Hours = asleep duration, Quality = efficiency (asleep/inBed) |
| Workouts                                  | `SportEntry` | Duration, type mapped to `SportType`, intensity = 3          |
| Nutrition (calories, protein, carbs, fat) | `MealEntry`  | One "HealthKit" meal/day with macros in note                 |

### Sleep Quality Formula

```
efficiency = asleep_hours / in_bed_hours
Quality 5: efficiency > 90%
Quality 4: efficiency > 80%
Quality 3: efficiency > 70%
Quality 2: efficiency > 60%
Quality 1: efficiency <= 60%
```

### Workout Type Mapping

| HealthKit Activity ID | App Sport Type |
| --------------------- | -------------- |
| 13                    | cycling        |
| 37                    | running        |
| 46                    | swimming       |
| 52                    | hiking         |
| 20                    | dancing        |
| 50                    | yoga           |
| 63                    | pilates        |
| 25                    | cardio         |
| Other                 | other          |

## What We Don't Sync (and Why)

| Data             | Reason                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| Stress           | HealthKit has no direct stress data. HRV requires Apple Watch.                                   |
| Steps            | Not relevant to skin health tracking.                                                            |
| Heart rate       | Requires Apple Watch; not in MVP scope.                                                          |
| Water intake     | Rarely logged in HealthKit.                                                                      |
| Individual meals | HealthKit only stores daily totals, not meals. We create one synthetic "HealthKit" meal per day. |
| Source tracking  | Backend needs `source` field update. Deferred.                                                   |

## Sync Behavior

- **Auto-sync**: On app open if >1 hour since last sync
- **Manual sync**: Dev button in Profile (DEV only)
- **Range**: Last 7 days
- **Merge**: HealthKit data merged with manual entries (no deduplication yet)

## Permissions Requested

- `SleepAnalysis` (read)
- `Workout` (read)
- `EnergyConsumed` (read)
- `Protein` (read)
- `Carbohydrates` (read)
- `FatTotal` (read)

No write permissions requested (read-only integration).
