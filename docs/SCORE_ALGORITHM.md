# Score Algorithm

Daily wellness score (0-100) computed from sleep, nutrition, activity, stress, and observations.

---

## Weights

| Category     | Weight |
| ------------ | ------ |
| Sleep        | 30%    |
| Nutrition    | 20%    |
| Activity     | 20%    |
| Stress       | 15%    |
| Observations | 15%    |

```
totalScore = sleepScore * 0.30
           + nutritionScore * 0.20
           + activityScore * 0.20
           + stressScore * 0.15
           + observationScore * 0.15
```

Result is rounded to the nearest integer.

---

## Sleep Score (0-100)

Based on `SleepEntry.hours` and `SleepEntry.quality`.

### Hours Component (60%)

| Hours | Score                      |
| ----- | -------------------------- |
| 7-9h  | 100                        |
| < 7h  | `(hours / 7) * 100`        |
| > 9h  | `100 - ((hours - 9) * 20)` |

Clamped to `>= 0`.

### Quality Component (40%)

`qualityScore = quality * 20` (quality in 1-5).

| Quality | Score |
| ------- | ----- |
| 1       | 20    |
| 2       | 40    |
| 3       | 60    |
| 4       | 80    |
| 5       | 100   |

**Formula:** `hoursScore * 0.6 + qualityScore * 0.4`

---

## Nutrition Score (0-100)

Based on `MealEntry.meal_type`, `photo_url`, and `food_name`.

### Meal Type Points

25 points per unique meal type logged:

| Unique Meal Types | Score |
| ----------------- | ----- |
| 1                 | 25    |
| 2                 | 50    |
| 3                 | 75    |
| 4                 | 100   |

### Detail Bonus

+5 points per meal with `photo_url` OR `food_name` (max 20 bonus).

**Formula:** `min(100, typeScore + detailBonus)`

---

## Activity Score (0-100)

Based on `SportEntry.duration` (minutes) and `SportEntry.intensity` (1-5).

### Duration Component

Target: 30 minutes/day = 100 points (capped).

```
durationScore = min(100, (totalMinutes / 30) * 100)
```

### Intensity Multiplier

For average intensity > 3, apply bonus:

```
intensityMultiplier = 1 + max(0, avgIntensity - 3) * 0.1
```

**Formula:** `min(100, durationScore * intensityMultiplier)`

---

## Stress Score (0-100)

Based on `StressEntry.level` (1-5). Inverse relationship: lower stress = higher score.

```
scorePerLevel = (100 - 20) / 4 = 20
stressScore   = 100 - (level - 1) * 20
```

| Level | Score |
| ----- | ----- |
| 1     | 100   |
| 2     | 80    |
| 3     | 60    |
| 4     | 40    |
| 5     | 20    |

---

## Observations Score (0-100)

Based on `ObservationEntry.positives` and `ObservationEntry.negatives` arrays.

```
raw = 50 (base)
    + positives.length * 12
    - negatives.length * 8
    + 10 (tracking bonus)

observationScore = clamp(raw, 0, 100)
```

Simply logging an observation grants the base + tracking bonus (60). Each positive adds 12, each negative subtracts 8.

---

## Missing Data

No entry for a category = **0** for that category. Its weight is still applied, so the total score is reduced accordingly (weights are not renormalized).

---

## Files

| File                                                   | Purpose                    |
| ------------------------------------------------------ | -------------------------- |
| `src/shared/config/scoreConfig.ts`                     | Weights & tunable values   |
| `src/features/dashboard/utils/score.ts`                | Scoring functions          |
| `src/features/dashboard/hooks/useWeekScores.ts`        | 7-day scores (batch query) |
| `src/features/dashboard/utils/__tests__/score.test.ts` | Unit tests                 |

---

## API

Week scores use a batch endpoint (1 call for 7 days instead of 35):

```
GET /api/v1/journal/entries?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD

Response:
{
  "data": {
    "sleeps":       [...],
    "meals":        [...],
    "sports":       [...],
    "stresses":     [...],
    "observations": [...]
  }
}
```

Constraints:

- Max 14 days range
- Date format: `YYYY-MM-DD`
- `startDate <= endDate`

Entries are filtered per day client-side via `isSameDay` on `entry.date`. Sleep/stress/observations use the first entry of the day; meals and sports are aggregated.

---

## Examples

### Perfect Day

- Sleep: 8h, quality 5 → `100*0.6 + 100*0.4` = **100**
- Nutrition: 4 meal types + 4 detailed → `100 + 20 → min 100` = **100**
- Activity: 30min, intensity 4 → `100 * 1.1 → min 100` = **100**
- Stress: level 1 → **100**
- Observations: logged with 2 positives, 0 negatives → `50 + 24 + 10` = **84**
- **Total:** `100*0.30 + 100*0.20 + 100*0.20 + 100*0.15 + 84*0.15` = `30 + 20 + 20 + 15 + 12.6` = **98** (rounded)

### Partial Day

- Sleep: 6h, quality 3 → `(6/7)*100*0.6 + 60*0.4` ≈ **75.4**
- Nutrition: breakfast only, no details → **25**
- Activity: none → **0**
- Stress: level 3 → **60**
- Observations: none → **0**
- **Total:** `75.4*0.30 + 25*0.20 + 0*0.20 + 60*0.15 + 0*0.15` = `22.6 + 5 + 0 + 9 + 0` = **37** (rounded)

---

## Note pour la cliente

Chaque jour, l'application calcule un **score de bien-être sur 100** à partir de ce que tu notes dans ton journal. Plus tu remplis ton journal, plus ton score reflète fidèlement ta journée.

Le score prend en compte **cinq aspects** de ta journée, chacun avec une importance différente :

- **Ton sommeil (30%)** — l'élément le plus important. On regarde combien d'heures tu as dormi (l'idéal se situe entre 7h et 9h) et la qualité de ton sommeil.
- **Ton alimentation (20%)** — on compte les différents repas de la journée (petit-déjeuner, déjeuner, dîner, collation). Ajouter une photo ou le nom de ce que tu as mangé te donne un petit bonus.
- **Ton activité physique (20%)** — l'objectif est d'atteindre 30 minutes de sport par jour. Une activité plus intense te donne un petit bonus.
- **Ton stress (15%)** — plus tu te sens détendue, plus le score est élevé.
- **Tes observations de peau (15%)** — le simple fait de noter l'état de ta peau te donne déjà des points. Les observations positives font monter le score, les négatives le font baisser légèrement.

**À retenir :**

- Un score de **100**, c'est une journée idéale. Un score autour de **70-80** reste très bon.
- Si tu oublies de noter quelque chose (par exemple ton sport), cette partie compte comme zéro — ton score baissera donc un peu même si ta journée était bonne.
- Le score n'est pas une note à atteindre à tout prix : c'est un **repère** pour suivre ton évolution jour après jour et repérer ce qui influence ta peau.

L'objectif n'est pas la perfection, mais la **régularité** : noter ton journal tous les jours est ce qui t'apportera le plus de valeur sur le long terme.

---

## Paramètres ajustables du calcul

Voici tous les éléments qui composent le score. Chacun peut être modifié indépendamment — indique-moi simplement la valeur que tu souhaites pour chaque point.

### 1. Importance de chaque catégorie (total = 100%)

| Catégorie         | Valeur actuelle |
| ----------------- | --------------- |
| Sommeil           | 30%             |
| Alimentation      | 20%             |
| Activité physique | 20%             |
| Stress            | 15%             |
| Observations peau | 15%             |

> La somme doit toujours faire 100%.

### 2. Sommeil

| Élément                                       | Valeur actuelle |
| --------------------------------------------- | --------------- |
| Part des heures dormies dans le score sommeil | 60%             |
| Part de la qualité dans le score sommeil      | 40%             |
| Nombre d'heures idéal (minimum)               | 7h              |
| Nombre d'heures idéal (maximum)               | 9h              |
| Pénalité par heure au-delà de 9h              | -20 points      |

> Exemple : en dessous de 7h, le score baisse proportionnellement. Au-dessus de 9h, chaque heure en trop retire 20 points.

### 3. Alimentation

| Élément                                            | Valeur actuelle |
| -------------------------------------------------- | --------------- |
| Points par type de repas différent logué           | 25 points       |
| Bonus par repas avec photo ou nom d'aliment        | +5 points       |
| Bonus maximum cumulable (photos / noms d'aliments) | 20 points       |

> Exemple actuel : 4 repas différents = 100 points. Avec 4 repas détaillés, le bonus est plafonné à 20.

### 4. Activité physique

| Élément                                               | Valeur actuelle |
| ----------------------------------------------------- | --------------- |
| Objectif de minutes de sport par jour                 | 30 min          |
| Seuil d'intensité à partir duquel un bonus s'applique | 3 (sur 5)       |
| Bonus par niveau d'intensité au-dessus du seuil       | +10%            |

> Exemple : intensité moyenne de 4 → bonus de +10%. Intensité de 5 → bonus de +20%.

### 5. Stress

| Élément                                  | Valeur actuelle |
| ---------------------------------------- | --------------- |
| Score maximum (stress minimum, niveau 1) | 100             |
| Score minimum (stress maximum, niveau 5) | 20              |

> Le score décroît de façon régulière entre ces deux valeurs (niveau 1 → 100, niveau 2 → 80, niveau 3 → 60, niveau 4 → 40, niveau 5 → 20).

### 6. Observations peau

| Élément                                 | Valeur actuelle |
| --------------------------------------- | --------------- |
| Score de base (dès qu'on note une obs)  | 50              |
| Bonus simple pour avoir noté (tracking) | +10             |
| Points par observation positive         | +12             |
| Points par observation négative         | -8              |

> Le score ne peut jamais descendre en dessous de 0 ni dépasser 100.

### 7. Règle sur les données manquantes

**Actuellement :** si tu n'as rien noté dans une catégorie, elle compte comme 0 et pèse quand même dans ton score total.

**Alternative possible :** ignorer la catégorie manquante et recalculer le score uniquement sur ce qui a été rempli (ton score refléterait alors uniquement ce que tu as effectivement suivi).

> Dis-moi laquelle des deux options tu préfères.
