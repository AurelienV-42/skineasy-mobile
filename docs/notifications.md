# Local Notifications

SkinEasy utilise uniquement des **notifications locales** (`expo-notifications`) programmées côté client. Aucun push serveur n'est envoyé (la table `push_tokens` reste en place pour un usage futur : marketing, alertes backoffice).

## Les 3 notifications

| Clé            | Quand                                      | Condition                                    | Texte (FR)                                                                             |
| -------------- | ------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `dailyJournal` | Tous les jours à **20h** (répétitif)       | Toggle activé (défaut **on**)                | ✍🏽 N'oublie pas de remplir ton journal du jour / Prends un moment pour faire le point… |
| `bedtime`      | **Aujourd'hui 22h** (one-off)              | Entry sommeil d'hier marquée « mauvaise »    | 🌙 C'est l'heure d'aller se coucher / Accorde-toi du repos…                            |
| `mealPlanning` | **Prochain dimanche 14h** (one-off répété) | Par défaut on ; cancel si samedi = bon repas | 🍽️ On planifie tes repas de la semaine ? / Anticiper t'aidera à mieux manger…          |

Textes et seuils sont localisés (`src/i18n/locales/{fr,en}.json` sous `notifications.*`).

## Seuils

Définis en dur dans `src/shared/config/appConfig.ts` sous `notifications.thresholds` :

```ts
badSleepQualityLt: 3,
badSleepHoursLt: 6,
badMealAvgQualityLt: 3,
```

- **Mauvais sommeil** : `quality < 3` OU `hours < 6`.
- **Mauvais repas** : moyenne `meal.quality` du jour `< 3`. Si aucun repas loggé, considéré « mauvais » (la notif part par défaut).

Modifier les valeurs requiert une release app.

## Mécanique event-driven

Les notifs conditionnelles ne sont (re)planifiées qu'à deux moments :

1. **Au login / retour sur l'app** (`resyncAll()` dans `src/app/_layout.tsx`)
2. **À la mutation d'un journal entry** concerné (`onSleepEntrySaved`, `onSleepEntryDeleted`, `onMealEntryChanged`)

La règle clé : **on ne recalcule que si la mutation porte sur `date === hier`**. Au-delà d'hier, la notif ciblée n'est plus pertinente (elle a déjà dû être émise ou annulée).

### Sleep → bedtime

- Au save d'un `sleep_entry` dont `date === hier` :
  - Si `isBadSleep` → schedule `bedtime` aujourd'hui 22h
  - Sinon → cancel `bedtime`
- Au delete d'un entry dont `date === hier` → cancel `bedtime`

### Meal → mealPlanning

- Au create/update/delete d'un `meal_entry` dont `date === hier` ET `hier` est un samedi :
  - Si moyenne quality < seuil OU zéro repas → schedule `mealPlanning` dimanche 14h
  - Sinon → cancel `mealPlanning`

### resyncAll

Au login (y compris session restaurée au boot), on :

1. (Re)planifie `dailyJournal` si prefs on et permission accordée
2. Recalcule `bedtime` à partir du sommeil d'hier
3. Recalcule `mealPlanning` — si hier n'est pas samedi, on schedule par défaut (logique « tout le monde reçoit ») ; si hier est samedi, on évalue la moyenne

## Persistance locale (MMKV)

Toutes les données persistées sont locales au device (pas de synchro cross-device volontairement).

Clés dans `storage` (`src/lib/storage.ts` → instance MMKV encryptée) :

| Clé                                | Type    | Rôle                                         |
| ---------------------------------- | ------- | -------------------------------------------- |
| `notifications.prefs.dailyJournal` | boolean | Toggle utilisateur (default `true`)          |
| `notifications.prefs.bedtime`      | boolean | Toggle utilisateur (default `true`)          |
| `notifications.prefs.mealPlanning` | boolean | Toggle utilisateur (default `true`)          |
| `notifications.scheduledIds`       | JSON    | `{ [kind]: expoNotificationId }` pour cancel |

## UI — Settings

- Modale via `@lodev09/react-native-true-sheet` (composant `BottomSheet` partagé), ouverte depuis le **Profile screen** (ligne « Notifications » avec icône `Bell`).
- 3 toggles (Switch RN), persistés instantanément.
- Changer un toggle → `setNotificationPref()` qui update MMKV + schedule/cancel la notif correspondante.

## Permissions

Demandées dans `usePushTokenRegistration` (au login / retour foreground). Si refusées, tous les `schedule*` no-op silencieusement (le toggle reste dans MMKV).

## Comportement offline

- Pas d'API serveur à appeler pour scheduler — ça marche offline.
- Seule exception : `resyncAll` lit le journal (hier) depuis Supabase. En échec, log warning + conserve l'état existant.

## Fichiers clés

- `src/shared/services/notifications.service.ts` — API publique (schedule / cancel / hooks / resyncAll)
- `src/shared/services/notifications.storage.ts` — prefs MMKV + IDs planifiés
- `src/shared/config/appConfig.ts` — seuils (sous `notifications.thresholds`)
- `src/features/profile/components/notifications-settings-sheet.tsx` — modale toggles
- `src/features/profile/screens/ProfileScreen.tsx` — ligne d'entrée
- `src/features/journal/data/sleep.queries.ts` / `meal.queries.ts` — hooks event-driven
- `src/app/_layout.tsx` — `setNotificationHandler` + appel `resyncAll` au login

## Test manuel

1. **Journal 20h** : activer le toggle → `Notifications.getAllScheduledNotificationsAsync()` doit contenir un trigger DAILY 20h.
2. **Bedtime** : logger un sommeil (date=hier, quality=2) → un DATE trigger pour aujourd'hui 22h apparaît. Re-save avec quality=5 → il disparaît.
3. **Meal planning** : un samedi (ou simuler via système), logger 3 repas quality=2 pour hier → DATE trigger dimanche 14h. Update en quality=5 → il disparaît.
4. **Resync** : déconnexion / reconnexion → l'état se reconstruit depuis la DB.
5. **Permission refusée** : rien ne crash, tous les schedule sont no-op.

## Extensions futures possibles

- Tracker eau / hydratation → notif 12h en cas de manque la veille.
- Flags issus du questionnaire routine (`lack_of_hydration`, `lack_of_sleep`, `inflammatory_diet`) → nouvelles conditions.
- Notif stress quand `stress_entries.level >= 4` plusieurs jours de suite.
- Re-scheduling automatique via `addNotificationReceivedListener` pour couvrir les cas où l'utilisateur n'ouvre pas l'app pendant plusieurs jours.
- Synchro cross-device des prefs via `clients.notification_prefs jsonb`.
