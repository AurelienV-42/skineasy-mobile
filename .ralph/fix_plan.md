# Ralph Fix Plan

> Finishing the Supabase migration. Schema is live (`lyhhipvipgbqsytfqwdw`), do NOT run SQL.
>
> Docs: `docs/supabase-migration.md`, `docs/routine-migration.md`, `docs/routine-resolution-flow.md`

---

## Conventions (non-negotiable)

**Data layer structure**

```
src/features/<feature>/data/
├── <entity>.api.ts       # pure Supabase calls, no React. Throws mapSupabaseError(err).
└── <entity>.queries.ts   # TanStack Query hooks + <entity>Keys. Exports useX hooks.
```

- Components import ONLY from `.queries.ts`
- `.api.ts` returns typed data from `@lib/supabase.types`, catches error → throws via `mapSupabaseError`
- Mutations auto-toast errors (global `MutationCache.onError`). Opt out with `meta: { suppressGlobalError: true }`
- Error codes: extend `src/lib/error-mapper.ts` + i18n keys in `fr.json` + `en.json`
- Respect CLAUDE.md: i18n all text, no relative imports, kebab-case files, NativeWind only, zero `any`, no barrel files

---

## Phase A — Data layer refactor (`services/*.service.ts` → `data/*.api.ts + *.queries.ts`)

One feature per commit. Delete the old `.service.ts` when done.

- [x] **Auth** — `src/features/auth/data/auth.{api,queries}.ts`
- [x] **Journal sleep** — `src/features/journal/data/sleep.{api,queries}.ts`
- [x] **Journal sport** — `src/features/journal/data/sport.{api,queries}.ts` (includes sport-types)
- [x] **Journal meal** — `src/features/journal/data/meal.{api,queries}.ts`
- [x] **Journal stress** — `src/features/journal/data/stress.{api,queries}.ts`
- [x] **Journal observation** — `src/features/journal/data/observation.{api,queries}.ts`
- [x] **Journal entries** — `src/features/journal/data/entries.{api,queries}.ts` (includes useVisibleMonthsScores)
- [x] **Journal cleanup** — update screen imports from hooks/ to data/, delete old service + hook files
- [x] **Profile** — `src/features/profile/data/profile.{api,queries}.ts`
- [x] **App config** — `src/shared/data/app-config.{api,queries}.ts`
- [x] **Push tokens** — `src/shared/data/push-tokens.{api,queries}.ts`

---

## Phase B — Routine resolution (fires on login)

Design: `docs/routine-resolution-flow.md`. `resolve-routine` Edge Function is deployed and waiting.

- [x] `src/features/routine/data/resolve-routine.{api,queries}.ts` — calls `supabase.functions.invoke('resolve-routine')`, typed union result (`ready` | `response_found_generation_pending` | `needs_form` | `needs_purchase`)
- [x] Fire on `supabase.auth.onAuthStateChange('SIGNED_IN')` in `src/app/_layout.tsx` or auth store — NOT on routine tab open. Stash result in user store.
- [x] Clear on `SIGNED_OUT`
- [x] Routine screen reads result from store, renders 4 branches (i18n under `routine.resolution.*`)
- [x] Header refresh action invalidates the resolution query
- [x] Delete `src/features/routine/services/routine.service.ts` (currently throws stubs)
- [ ] Tests: mock each of the 4 statuses, assert store state + rendered UI

---

## Phase C — Final cleanup

- [ ] `rg "services/\w+\.service" src/` — should be empty after Phase A
- [ ] `rg "API_URL|NestJS|/api/v1" src/` — should be empty
- [ ] `npm run check` passes
- [ ] `CLAUDE.md` Supabase section matches reality
- [ ] README: short Supabase setup section pointing at the docs

---

## Phase D — BLOCKED: full routine rendering

Blocked on `generate-routine` Edge Function + backoffice seeding `skincare_products` and `product_type_content`. Do NOT start. See `docs/routine-migration.md` §3 when unblocked.

---

## Notes

- DO NOT run SQL migrations
- `resolve-routine` URL: `https://lyhhipvipgbqsytfqwdw.supabase.co/functions/v1/resolve-routine` (JWT attached automatically by `supabase.functions.invoke`)
- Human-only setup: set `TYPEFORM_API_TOKEN` and `TYPEFORM_FORM_ID` as Supabase secrets
- Protected files: `.ralph/` (except this file), `.ralphrc`
