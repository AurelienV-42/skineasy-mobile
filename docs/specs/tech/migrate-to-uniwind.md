# Migrate to Uniwind — Tech Spec

**Product spec**: _none — engineering-driven migration_

## Context

Replace NativeWind v4.2.3 + Tailwind v3 with Uniwind v1.6 + Tailwind v4 as a drop-in `className` styling solution. NativeWind 4.x crashes on Metro 0.85 (`addedFiles` undefined in `DependencyGraph._onHasteChange`, triggered by NativeWind's Tailwind v3 child-process watcher). NativeWind 5 is preview-only with no stable date. Uniwind is stable (v1.6.3, April 2026), built by the Unistyles team, drop-in for `className`, supports Tailwind v4, runs as a Metro plugin (no Babel transform), and is reported 2-3× faster at render time.

This migration is performed on the `chore/expo-sdk-55` branch. SDK 55 is already partially applied (RN 0.85, Reanimated 4.2, worklets 0.7). NativeWind is the last blocker.

## Architecture

```
Before (NativeWind 4):
  *.tsx (className)
        │
        ▼
  ┌──────────────────────────────────────┐
  │ Babel: babel-preset-expo (jsxImportSource: nativewind) │
  │        + nativewind/babel preset           │
  │   ─ rewrites JSX createElement                │
  └──────────────────────────────────────┘
        │
  ┌─────────────────────────┐
  │ Metro: withNativeWind() │
  │   spawns Tailwind v3 CLI │  ← crashes on Metro 0.85
  │   watches CSS for HMR    │
  └─────────────────────────┘
        │
        ▼
  Compiled styles + RN style props


After (Uniwind 1.6):
  *.tsx (className — same API)
        │
        ▼
  ┌──────────────────────────────────────┐
  │ Babel: babel-preset-expo only            │
  │   (NativeWind babel preset REMOVED)         │
  │   (jsxImportSource REMOVED)                 │
  └──────────────────────────────────────┘
        │
  ┌─────────────────────────────┐
  │ Metro: withUniwindConfig()  │
  │   ─ reads global.css            │
  │   ─ resolves Tailwind v4 @theme │
  │   ─ generates dts file          │
  │   ─ build-time style atlas      │
  └─────────────────────────────┘
        │
        ▼
  Compiled styles + RN style props


Third-party components (SafeAreaView, KeyboardAwareScrollView, GlassView, TrueSheet):
  Component → withUniwind(Component) → accepts className
  (NativeWind 4 used jsxImportSource to silently inject; Uniwind requires explicit wrap)
```

## Data Model

No data-model changes. This is a build-time / styling layer migration.

Two files contain visible state:

- `tailwind.config.js` (Tailwind v3 JS config) → **deleted**
- `src/global.css` (Tailwind v3 directives + CSS vars) → **rewritten** to Tailwind v4 CSS-first config with `@theme` block

Token bridge is preserved: `src/theme/colors.ts` stays the source of truth for runtime native code (e.g. `colors.primary` passed to icon components). The CSS-side mirror moves from `:root { --color-primary: 125 96 78 }` (rgb triplet for `<alpha-value>` syntax) to `@theme { --color-primary: rgb(125 96 78) }` (full color value, Tailwind v4 reads it directly).

## API / Contracts

| Surface                              | Before                                                                  | After                                                            |
| ------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| User-facing className API            | `className="flex-1 bg-primary"`                                         | `className="flex-1 bg-primary"` (unchanged)                      |
| Theme token references               | `bg-primary`, `text-text-muted`, `bg-cream`                             | same names — kept in `@theme` block                              |
| Custom font families                 | `font-normal`, `font-medium`, `font-semibold`, `font-bold` (Chocolates) | same names — declared via `--font-*` in `@theme`                 |
| Custom spacing                       | `p-xs`, `gap-md`, `mt-2xl`, `pl-3xl`                                    | same names — declared via `--spacing-*` in `@theme`              |
| Custom radius                        | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full`  | same names — declared via `--radius-*` in `@theme`               |
| Custom font sizes (with line height) | `text-xs` … `text-6xl` overridden                                       | same names — declared via `--text-*` and `--text-*--line-height` |
| Third-party wrappers                 | implicit via `jsxImportSource: 'nativewind'`                            | explicit: `const StyledX = withUniwind(X)`                       |
| `cssInterop` / `remapProps`          | not used in this codebase                                               | n/a                                                              |
| Dark mode                            | not used                                                                | n/a                                                              |
| `vars()`                             | not used                                                                | n/a                                                              |

## Dependencies

| Lib                                  | Why                                                                 | Bundle / setup impact                                                                           |
| ------------------------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `uniwind` (latest, ~1.6.3)           | Replaces `nativewind` — Tailwind className support via Metro plugin | Adds ~? to JS bundle (similar order to NativeWind, no Babel transform). Adds Metro plugin pass. |
| `tailwindcss@^4`                     | Required by Uniwind (Tailwind v4 only)                              | Build-time only. Replaces `tailwindcss@3.4.19`.                                                 |
| `react-native-css` (peer of uniwind) | Native styling primitives Uniwind builds on                         | Native lib — requires dev-client rebuild. Already aligned with new arch.                        |
| `react-native-nitro-modules`         | Already installed (`^0.35.5`). Confirm Uniwind's required version.  | No change unless version conflict.                                                              |
| `react-native-reanimated`            | Already installed (`~4.2.1` post-SDK 55). Peer of Uniwind.          | No change.                                                                                      |
| `react-native-worklets`              | Already installed (`0.7.4`). Peer of Uniwind.                       | No change.                                                                                      |
| **Removed:** `nativewind@^4.2.3`     | Replaced by Uniwind                                                 | Frees Babel transform overhead.                                                                 |
| **Removed:** `tailwindcss@^3.4.19`   | Replaced by `tailwindcss@^4`                                        | n/a                                                                                             |

**Bundle note:** No major delta expected. Both libs compile classes at build time; Uniwind has a smaller runtime (no JSX transform, no `cssInterop` registry).

**Native rebuild required:** yes — `react-native-css` is a native module, so the dev client must be rebuilt (`npx expo prebuild --clean && npx expo run:ios`).

## Edge Cases & Failure Modes

- **Tailwind v3 → v4 syntax differences in class strings**
  - `bg-opacity-50` → `bg-black/50` (already uses `/<alpha-value>` token style; needs audit). _Action: grep for `-opacity-` usage._
  - `space-x-*` / `space-y-*` deprecated in Tailwind v4 — use `gap-*` flex/grid. _Audit in step 0._
  - `divide-*` reworked — _audit usage._
  - Arbitrary values syntax stays the same (`gap-[3px]` still works).
- **Removed `rgb(... / <alpha-value>)` token format**
  - Tailwind v4 doesn't use the v3 alpha-value pattern. Migration: change `--color-primary: 125 96 78` (rgb triplet) → `--color-primary: rgb(125 96 78)` (full color). Class `bg-primary/50` continues to work.
- **Third-party components that previously worked via NativeWind's JSX transform**
  - Concrete list found in this codebase:
    - `SafeAreaView` from `react-native-safe-area-context` (used in 8+ screens)
    - `KeyboardAwareScrollView` (wrapped as `KeyboardScrollView` already — internal wrapper, no `className` passthrough needed)
    - `GlassView` (from `expo-glass-effect`) — already uses `style` prop per project rule (CLAUDE.md)
    - `TrueSheet` (from `@lodev09/react-native-true-sheet`) — uses `style` prop, no className
    - `Animated.View` — already uses `style` per project rule
    - `LinearGradient` (from `expo-linear-gradient`) — used with `style` typically
  - **Action**: create one shared `Styled*` wrapper file (`src/shared/components/styled-rn.tsx`) exposing `StyledSafeAreaView` (only one with broad className usage); leave others unchanged since they're already on `style`.
- **`presets: [require('nativewind/preset')]` in `tailwind.config.js`**
  - Tailwind v4 has no JS config — config moves to `@theme` in CSS. The NativeWind preset (which mapped Tailwind tokens to RN-supported subset) is replaced by Uniwind's built-in handling.
- **`fontFamily` tokens (Chocolates)**
  - NativeWind exposed `font-normal`/`font-medium`/etc. via `theme.extend.fontFamily`. In Tailwind v4 we declare `--font-normal: 'ChocolatesRegular'` etc. inside `@theme`. Verify Uniwind picks up these as utility class generators (per docs it does).
- **`fontSize` overrides with line-height**
  - Each size needs both `--text-xs: 0.75rem` and `--text-xs--line-height: 0.9rem` in v4 `@theme`. Verify all 10 sizes carry over.
- **Dev client rebuild**
  - Old simulator install has the NativeWind/RN-CSS-interop native bindings (or none). New Uniwind install requires `react-native-css` native module → mandatory `expo prebuild --clean && expo run:ios`. No JS-only fix.
- **Metro caches**
  - Old caches reference NativeWind's babel transform output. Run `npx expo start --clear` after the swap.
- **`src/uniwind-types.d.ts` already exists** in the repo (leftover scaffold)
  - Will be overwritten by Uniwind's generator on first build. Safe.
- **Tests**
  - Vitest config doesn't process Tailwind/NativeWind classes (className is a string at unit-test level). No expected breakage. Verify by running `npm test`.
- **Hot reload / Fast Refresh**
  - NativeWind issue #1182 (open) was a known HMR pain point. Uniwind's Metro plugin handles HMR differently — expect parity or improvement, but verify by editing a className live.
- **EAS builds**
  - First EAS build after merge will have a cold native cache → longer build. No code change needed; profiles unaffected.
- **Lint config**
  - `eslint-plugin-tailwindcss` (if present) reads `tailwind.config.js`. Currently not in this project. No action.
- **Backward compat with main**
  - This branch already diverges from main with SDK 55 changes. Migration commits are isolated; revert path = `git revert` of the migration commits (Uniwind work) leaves SDK 55 commits intact.

## Implementation Plan

Each step is independently revertable. Order respects dep graph: package swap → config → CSS → wrappers → verify → cleanup.

### Step 0 — Pre-flight audit (no code changes)

- `grep -rE "(\\b(?:bg|text|border|ring|divide|placeholder|from|to|via)-opacity-|space-x-|space-y-|divide-)" src/` — list any Tailwind v3 deprecated patterns.
- `grep -rE "cssInterop|remapProps|vars\\(|useColorScheme|nativewind/" src/ app.config.* metro.config.js babel.config.js` — confirm no NativeWind API usage beyond config.
- Confirm exit conditions:
  - Zero deprecated patterns OR a small list of 1-line fixes scoped into Step 6.

### Step 1 — Install Uniwind, remove NativeWind

```bash
npm uninstall nativewind tailwindcss
npm install uniwind tailwindcss@^4 react-native-css
```

Verify peer deps already satisfied: `react-native-nitro-modules`, `react-native-reanimated`, `react-native-worklets`.

### Step 2 — Update `babel.config.js`

```diff
 module.exports = function (api) {
   api.cache(true);
   return {
-    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
+    presets: ['babel-preset-expo'],
     plugins: ['react-native-worklets/plugin'],
   };
 };
```

### Step 3 — Update `metro.config.js`

```diff
-const { withNativeWind } = require('nativewind/metro');
+const { withUniwindConfig } = require('uniwind/metro');
 const { getSentryExpoConfig } = require('@sentry/react-native/metro');
 const path = require('path');

 const config = getSentryExpoConfig(__dirname);

 config.resolver = {
   ...config.resolver,
   extraNodeModules: {
     '@assets': path.resolve(__dirname, 'assets'),
   },
 };

-module.exports = withNativeWind(config, {
-  input: './src/global.css',
+module.exports = withUniwindConfig(config, {
+  cssEntryFile: './src/global.css',
+  dtsFile: './src/uniwind-types.d.ts',
 });
```

### Step 4 — Rewrite `src/global.css` (Tailwind v3 → v4 + Uniwind)

```css
@import 'tailwindcss';
@import 'uniwind';

@theme {
  /* Colors — keep names identical to NativeWind config so className strings don't change */
  --color-primary: rgb(125 96 78);
  --color-primary-dark: rgb(46 35 25);
  --color-secondary: rgb(232 76 63);
  --color-background: rgb(244 233 224);
  --color-surface: rgb(255 249 245);
  --color-text: rgb(107 85 68);
  --color-text-muted: rgb(154 138 122);
  --color-text-light: rgb(196 181 168);
  --color-error: rgb(232 76 63);
  --color-success: rgb(23 178 106);
  --color-warning: rgb(255 151 126);
  --color-border: rgb(224 201 184);
  --color-border-focus: rgb(23 178 106);
  --color-cream: rgb(244 233 224);
  --color-cream-muted: rgb(224 201 184);
  --color-brown-dark: rgb(46 35 25);
  --color-brown-light: rgb(125 96 78);

  /* Fonts (Chocolates) */
  --font-normal: 'ChocolatesRegular';
  --font-medium: 'ChocolatesMedium';
  --font-semibold: 'ChocolatesSemibold';
  --font-bold: 'ChocolatesBold';

  /* Spacing — 4px-grid named tokens */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 48px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Font sizes with line height (1.2x for Chocolates) */
  --text-xs: 0.75rem;
  --text-xs--line-height: 0.9rem;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.05rem;
  --text-base: 1rem;
  --text-base--line-height: 1.2rem;
  --text-lg: 1.125rem;
  --text-lg--line-height: 1.35rem;
  --text-xl: 1.25rem;
  --text-xl--line-height: 1.5rem;
  --text-2xl: 1.5rem;
  --text-2xl--line-height: 1.8rem;
  --text-3xl: 1.875rem;
  --text-3xl--line-height: 2.25rem;
  --text-4xl: 2.25rem;
  --text-4xl--line-height: 2.7rem;
  --text-5xl: 3rem;
  --text-5xl--line-height: 3.6rem;
  --text-6xl: 3.75rem;
  --text-6xl--line-height: 4.5rem;
}
```

### Step 5 — Delete `tailwind.config.js`

Tailwind v4 reads config from CSS `@theme` blocks. The JS config file is unused.

### Step 6 — Add `withUniwind` wrapper for third-party components

Create `src/shared/components/styled-rn.tsx`:

```tsx
import { withUniwind } from 'uniwind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

export const SafeAreaView = withUniwind(RNSafeAreaView);
```

Update imports in the 8+ screens that use `SafeAreaView` from `react-native-safe-area-context` to import from `@shared/components/styled-rn` instead. (Verified list: `app/(tabs)/index.tsx`, `app/(tabs)/journal.tsx`, `app/(tabs)/routine.tsx`, `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/(auth)/welcome.tsx`, `app/(auth)/password-reset.tsx`, `app/(auth)/password-recovery.tsx`, `features/auth/components/onboarding/Step3HealthSync.tsx`, `features/auth/components/onboarding/Step5EmailVerification.tsx` — verify with grep at execution time.)

If pre-flight (Step 0) found any deprecated v3 patterns, fix them here.

### Step 7 — Native rebuild

```bash
rm -rf node_modules/.cache .expo ios android
npx expo prebuild --clean
npx expo run:ios
```

(Project is currently managed Expo with no `ios/` checked in. Prebuild generates fresh native projects with `react-native-css` linked.)

### Step 8 — Smoke test on simulator

Critical flows to verify (manual + Argent MCP):

- Boot — splash, fonts load, dashboard renders
- Auth flow — login, register, password-reset (all use `SafeAreaView`)
- Tabs — dashboard, routine, journal, profile
- Journal — sleep, sport, meal, stress entries (forms with className)
- Routine — product detail sheet, all-products sheet
- Profile — diagnosis WebView
- Onboarding — all 5 steps (use `SafeAreaView` and forms)
- Theme tokens — verify `bg-primary`, `text-text-muted`, `bg-cream` render correctly
- Spacing tokens — `p-xs`, `gap-md`, `mt-2xl` render correctly
- Font tokens — `font-normal`/`medium`/`semibold`/`bold` apply Chocolates
- Font sizes — `text-base`, `text-2xl` etc. with correct line-height

### Step 9 — Run checks

```bash
npm run typecheck
npm test
npm run lint
```

Expected baseline: same lint/test failure count as before (1 pre-existing each). New errors must be zero.

### Step 10 — Cleanup

- Remove old NativeWind types/leftovers if any (`@types/nativewind`, etc.)
- Verify `src/uniwind-types.d.ts` was regenerated by the Uniwind Metro plugin (should be auto-overwritten on first run)
- Update `CLAUDE.md` line about NativeWind: `5. **NativeWind only** - …` → `5. **Uniwind only** - …`
- Add CHANGELOG entry: `Changed: migrated from NativeWind v4 + Tailwind v3 to Uniwind + Tailwind v4`

## Testing Strategy

- **Unit (Vitest)**: existing tests should pass unchanged. className is just a string at this layer.
- **Integration**: none specific — app behavior is end-to-end visual.
- **Manual / device check**: full smoke test (Step 8). Use Argent MCP `screenshot` + `describe` for each major screen, compare visually against pre-migration screenshots.
- **Regression watch**: re-run Step 8 once on iOS simulator, once on a physical iOS device (Chocolates fonts can render slightly differently).
- **Performance baseline**: optional — use `argent-react-native-profiler` to capture render time on dashboard before and after to confirm Uniwind's perf claim.

## Rollout

- **Feature flag**: no. This is a build-time migration; toggling at runtime is impossible.
- **Branch strategy**:
  1. Land on `chore/expo-sdk-55` (current branch). Together with the SDK 55 upgrade, ship as one PR titled `chore: upgrade to Expo SDK 55 + migrate to Uniwind`.
  2. Alternative split: cherry-pick Uniwind migration onto `main` (SDK 54) first, ship, then re-do SDK 55 upgrade on top — gives a clean per-change rollback. _Recommended if the migration is risky._
- **Migration steps**: documented in Implementation Plan above. No DB / env / EAS profile changes.
- **Rollback plan**:
  - `git revert <merge-commit>` reverts package + config + global.css + wrapper file in one go.
  - If post-merge a prod release crashes: re-deploy previous EAS update (OTA) or build (binary) from the pre-Uniwind tag.
  - All Uniwind changes are commit-isolated; no schema / persisted state to undo.

## Open Questions

- **TODO**: Confirm exact `react-native-css` peer version Uniwind 1.6 requires; if it conflicts with `react-native-nitro-modules@^0.35.5` or another native lib, may need version pin.
- **TODO**: Verify `font-normal` / `font-medium` / etc. utilities still generate from `--font-*` tokens in Tailwind v4 + Uniwind (Tailwind v4 changed the fontFamily-from-CSS-variable behavior — some setups need `--font-family-normal` instead of `--font-normal`).
- **TODO**: Confirm Uniwind's handling of arbitrary values like `gap-[3px]` — used in `IndicatorCard.tsx`. If unsupported, refactor to a token.
- **TODO**: Decide: ship SDK 55 + Uniwind together (one PR) vs Uniwind-only on SDK 54 first (two PRs). Lower-risk = split.
- **TODO**: Are there any `.tsx` files that still import `nativewind` directly (e.g. `import { useColorScheme } from 'nativewind'`)? Pre-flight grep should be 0; confirm at execution.
- **TODO**: Should `@shared/components/styled-rn.tsx` also export wrappers for `LinearGradient`, `BlurView`, `GlassView`? Audit if any of those receive `className` today (project rule says they use `style`, but verify).
