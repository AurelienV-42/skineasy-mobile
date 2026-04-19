# Task: implement `typeform_unavailable` status end-to-end

> Self-contained brief for a fresh Claude Code session. Touches both `skineasy-supabase` (Edge Function) and `skineasy-mobile` (UI + data layer).

---

## Context (read this before anything)

The `resolve-routine` Edge Function in Supabase decides what the mobile Routine tab should show when a user logs in. It cascades through:

1. Existing active routine in DB
2. Existing questionnaire response in DB
3. Lookup via Typeform API for a response matching the user's email
4. Fallback gate: `needs_form` (user has access but no response) or `needs_purchase`

**Problem**: if step 3's Typeform API call fails for any reason (network issue, Typeform downtime, rate limit, API key revoked), the function currently returns `null` from `importFromTypeform` and silently falls through to step 4. A historical user who actually HAS a response ends up being told "fill the form" — which is wrong, they already did, we just couldn't reach Typeform to verify.

**Fix**: Return a new `typeform_unavailable` status that the mobile app can handle with a retry UX, so we never show the wrong CTA because of an infrastructure hiccup on our side.

**References**:

- `docs/routine-resolution-flow.md` — full resolution design (already documents the new status in the UI mapping table and the status union)
- `skineasy-supabase/supabase/functions/resolve-routine/` — the Edge Function source (mirrors what's deployed)
- `skineasy-supabase/supabase/functions/resolve-routine/typeform-client.ts` — the Typeform API call

---

## Scope of this task

### Part 1 — Edge Function (`skineasy-supabase`)

File: `skineasy-supabase/supabase/functions/resolve-routine/`

1. **`typeform-client.ts`**
   - Change `findResponseByEmail` to distinguish between three outcomes:
     - `{ kind: 'found', response: TypeformFormResponse }` — a response matched
     - `{ kind: 'not_found' }` — API succeeded but no match
     - `{ kind: 'unavailable', reason: string }` — fetch threw, non-2xx status, or missing/invalid API token
   - Prefer a discriminated union over `null` for the return shape
   - Attempt 2 retries with a small backoff (e.g. 250ms then 500ms) on `fetch` throw or 5xx before declaring unavailable. Do NOT retry on 4xx (those mean our config is wrong, retrying won't help).
   - Log each failure with context but never throw out of this function

2. **`index.ts`**
   - When Typeform env vars are missing (`TYPEFORM_API_TOKEN` or `TYPEFORM_FORM_ID`), treat that as `typeform_unavailable` — not silent fall-through
   - When `findResponseByEmail` returns `unavailable`, the Edge Function returns `{ status: 'typeform_unavailable' }` with HTTP 200 (the mobile handles it as a user-level state, not an error)
   - When it returns `not_found`, continue to the access gate as today
   - Preserve existing behaviour for `found` and all other steps

3. **`types.ts`**
   - Add `'typeform_unavailable'` to the `ResolveStatus` union
   - Keep the rest of the shape unchanged

4. **Deploy the updated function to Supabase**
   - Use the Supabase MCP `deploy_edge_function` tool (project id `lyhhipvipgbqsytfqwdw`, function name `resolve-routine`, `verify_jwt: true`)
   - Include all four files in the payload: `index.ts`, `typeform-client.ts`, `types.ts`, `deno.json`
   - Verify by checking `list_edge_functions` shows the new version

### Part 2 — Mobile app (`skineasy-mobile`)

File-level work in the Data layer + Routine screen. The repo follows the `data/*.api.ts + *.queries.ts` convention documented in `.ralph/fix_plan.md`.

1. **`src/features/routine/data/resolve-routine.api.ts`**
   - Extend the typed union result with `{ status: 'typeform_unavailable' }`
   - No other change in the API layer — the Edge Function returns it as a normal JSON response, no exception

2. **`src/features/routine/data/resolve-routine.queries.ts`**
   - The `useRoutineResolution` query must treat `typeform_unavailable` as **data**, not as an error. Do NOT convert it into a thrown error — if we throw, the global `QueryCache.onError` auto-toasts and that's redundant with the screen-level UX we want.
   - Expose a way for the screen to manually trigger a refetch (probably already exists via the query's `refetch` function or by invalidating `routineResolutionKeys.current`)

3. **`src/features/routine/screens/routine.screen.tsx`**
   - Add a new branch for `status === 'typeform_unavailable'`:
     - Render the existing `<ErrorState>` primitive with a translated message
     - Include a "Réessayer" / "Retry" action that calls the query's `refetch()`
     - Show a subtle lighter tone than a full error — this is recoverable
   - Do NOT fall through to the `needs_form` branch

4. **`src/shared/stores/user.store.ts`** (or wherever the resolution is stashed on login)
   - When `onAuthStateChange('SIGNED_IN')` fires and the resolve result is `typeform_unavailable`, store it as-is (don't drop it, don't treat it as an error)
   - Subsequent screens that read `routineResolution` should know to not block the user — dashboard banners should NOT be rendered when status is `typeform_unavailable`

5. **i18n**
   - Add keys in `src/i18n/locales/fr.json` and `src/i18n/locales/en.json` under `routine.resolution`:
     - `typeformUnavailable.title` — e.g. "On n'arrive pas à vérifier ta routine" / "We couldn't verify your routine"
     - `typeformUnavailable.description` — short explanation ("le service est indisponible, réessaie dans un instant")
     - `typeformUnavailable.retry` — "Réessayer" / "Retry"
   - Do NOT hardcode any string in the screen

6. **Error mapping**
   - No changes to `src/lib/error-mapper.ts` — this is not a Supabase error, it's a business state

7. **Tests**
   - Add a unit test for `resolve-routine.queries.ts` that mocks `supabase.functions.invoke` returning `{ status: 'typeform_unavailable' }` and asserts the hook returns it as data, not as an error
   - Add a rendering test for the Routine screen asserting the retry button is present when status is `typeform_unavailable`

### Part 3 — Docs

- **`skineasy-mobile/docs/routine-resolution-flow.md`** — already mentions `typeform_unavailable` in the UI table + status union, verify it still matches reality after the implementation. Add a short paragraph under "Why this design" if useful.
- **`skineasy-supabase/README.md`** — add a bullet under `resolve-routine` noting the retry + unavailable semantics.
- **`skineasy-mobile/.ralph/fix_plan.md`** — mark the task done in whichever phase makes sense, or note it as a standalone line if it doesn't fit cleanly.

---

## Acceptance criteria

Manually verify in this order:

1. **Edge Function unit sanity** — trigger with a fake JWT and mock the Typeform client to throw. Function returns `{ status: 'typeform_unavailable' }`, HTTP 200.
2. **Edge Function env missing** — unset `TYPEFORM_API_TOKEN` locally, call the function. Returns `typeform_unavailable`, not `needs_form`.
3. **Edge Function happy path preserved** — with valid env, a user with a Typeform response gets `response_found_generation_pending` (or `ready` once `generate-routine` exists). A user with no response gets `needs_form` or `needs_purchase`.
4. **Mobile** — force the Edge Function into unavailable state (e.g. by pointing `TYPEFORM_API_TOKEN` to an invalid value on the dev project). Log in → Routine tab shows the retry UX with translated strings. Tap retry → refetches. Once env is fixed, the retry succeeds and the user lands on the correct branch.
5. **Mobile tests pass** — `npm run check` green in `skineasy-mobile`.
6. **No regression in global error toast** — the auto-toast from `MutationCache.onError` / `QueryCache.onError` does NOT fire for `typeform_unavailable` (it's not an error, it's data).

---

## Out of scope (do not touch)

- The `generate-routine` Edge Function (not built yet)
- Webhook revival — `typeform-webhook` stays deprecated as a 410 stub
- Backfill of historical responses — explicitly rejected in the design
- Product catalog / routine rendering — blocked on `generate-routine`
- Database schema changes — the schema is live and frozen for this task

---

## Commit guidance

Two commits, one per repo:

- `skineasy-supabase`: `feat(resolve-routine): return typeform_unavailable on API failure with retry`
- `skineasy-mobile`: `feat(routine): handle typeform_unavailable with retry UX`

Do not amend, do not squash across repos.
