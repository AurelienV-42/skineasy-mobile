# Routine Feature - Implementation Documentation

## Overview

The Routine Results Screen is the **core value proposition** of SkinEasy. It displays personalized skincare routines with product recommendations based on the user's skin analysis.

---

## Table of Contents

1. [Current State](#1-current-state)
2. [MVP Implementation](#2-mvp-implementation)
3. [Future Roadmap](#3-future-roadmap)
4. [Technical Architecture](#4-technical-architecture)
5. [API Reference](#5-api-reference)

---

## 1. Current State

### Existing Files

```
src/features/routine/
├── components/
│   ├── ProcessingBanner.tsx        # Dashboard banner (processing state)
│   ├── ViewRoutineBanner.tsx       # Dashboard banner (ready state)
│   └── RoutineBannerContainer.tsx  # Banner state manager
├── hooks/
│   └── useRoutineByRspid.ts        # Fetch routine by response ID
├── screens/
│   └── RoutineResultsScreen.tsx    # Results display (needs refactor)
└── services/
    └── routine.service.ts          # API service
```

### Current Limitations

| Issue              | Description                                  |
| ------------------ | -------------------------------------------- |
| Single file        | All components in `RoutineResultsScreen.tsx` |
| Limited types      | Only basic `RoutineProduct` type             |
| No `/routine/last` | Only uses `/routine/{rspid}` endpoint        |

---

## 2. MVP Implementation

### 2.1 Target Layout

```
┌─────────────────────────────────────┐
│ ← Ma Routine                        │
├─────────────────────────────────────┤
│ [☀️ Matin (4)]    [🌙 Soir (2)]    │  ← Toggle with step count
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 1. Nettoyant                    │ │
│ │ ┌────┐ Gel Moussant Doux       │ │
│ │ │ 🖼️ │ La Roche-Posay · 18.50€ │ │
│ │ └────┘                         │ │
│ │                                 │ │
│ │ 💡 Appliquez sur peau humide,  │ │
│ │    massez délicatement puis    │ │
│ │    rincez.                     │ │
│ │                                 │ │
│ │ [🛒 Acheter]                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 2. Sérum                        │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2.2 MVP Features

| Feature                | Description                       | Status  |
| ---------------------- | --------------------------------- | ------- |
| Morning/Evening Toggle | Switch between AM/PM routines     | 🔲 Todo |
| Step Cards             | Display products in routine order | 🔲 Todo |
| Shop Button            | Link to purchase each product     | 🔲 Todo |
| Staggered Animations   | Smooth entrance animations        | 🔲 Todo |

### 2.3 Excluded from MVP (Future)

- Skin profile summary header
- Total price / "Shop All" CTA
- Weekly schedule navigation
- "Why this product?" explanations
- Product usage frequency badges

### 2.4 Implementation Steps

#### Phase 1: Types & Data Layer

| Step | File                                               | Description                            |
| ---- | -------------------------------------------------- | -------------------------------------- |
| 1    | `src/features/routine/types/routine.types.ts`      | Create full API types from backend doc |
| 2    | `src/features/routine/services/routine.service.ts` | Add `getLastRoutine()` function        |
| 3    | `src/features/routine/hooks/useRoutine.ts`         | Hook for `/routine/last` endpoint      |
| 4    | `src/features/routine/hooks/useTodayRoutine.ts`    | Helper to get today's schedule         |

#### Phase 2: Extract Components (DRY Refactor)

| Step | File                                                      | Description               |
| ---- | --------------------------------------------------------- | ------------------------- |
| 5    | `src/features/routine/components/RoutineLoadingState.tsx` | Loading spinner component |
| 6    | `src/features/routine/components/RoutineErrorState.tsx`   | Error display component   |
| 7    | `src/features/routine/components/RoutineEmptyState.tsx`   | No routine state          |

#### Phase 3: New Components

| Step | File                                                    | Description              |
| ---- | ------------------------------------------------------- | ------------------------ |
| 8    | `src/features/routine/components/RoutineToggle.tsx`     | Morning/Evening toggle   |
| 9    | `src/features/routine/components/RoutineStepCard.tsx`   | Step card with product   |
| 10   | `src/features/routine/screens/RoutineResultsScreen.tsx` | Refactor as orchestrator |

#### Phase 4: Polish

| Step | Task       | Description                   |
| ---- | ---------- | ----------------------------- |
| 11   | i18n       | Add EN/FR translations        |
| 12   | Animations | Staggered FadeInDown entrance |
| 13   | Haptics    | Light haptic on toggle        |
| 14   | Testing    | Test iOS/Android/Web          |

### 2.5 New File Structure (After MVP)

```
src/features/routine/
├── components/
│   ├── RoutineToggle.tsx           # Morning/Evening toggle
│   ├── RoutineStepCard.tsx         # Step with product
│   ├── RoutineSummaryCard.tsx      # Skin profile summary (Phase 5)
│   ├── RoutineLoadingState.tsx     # Loading spinner
│   ├── RoutineErrorState.tsx       # Error display
│   ├── RoutineEmptyState.tsx       # No routine state
│   ├── ProcessingBanner.tsx        # Existing
│   ├── ViewRoutineBanner.tsx       # Existing
│   └── RoutineBannerContainer.tsx  # Existing
├── hooks/
│   ├── useRoutine.ts               # NEW: Full routine from /routine/last
│   ├── useRoutineByRspid.ts        # Existing (for web embed)
│   └── useTodayRoutine.ts          # NEW: Get today's schedule
├── screens/
│   └── RoutineResultsScreen.tsx    # Refactored as orchestrator
├── services/
│   └── routine.service.ts          # Updated with getLastRoutine()
└── types/
    └── routine.types.ts            # NEW: Full API types
```

---

## 3. Future Roadmap

Based on the PHP implementation (`old_files/`), here are features to implement after MVP:

### 3.1 Phase 5: Skin Profile Summary ✅ COMPLETED

**Priority: High** | **Status: Done**

Display user's skin analysis at the top of the routine screen.

```
┌─────────────────────────────────────┐
│ 💧 Peau Mixte Normale-Grasse        │
│    Sensible · Déshydratée           │
│                                     │
│ 📦 4 produits · ⏱️ ~6 min/jour      │
│ [👶 Grossesse OK]                   │
└─────────────────────────────────────┘
```

| Task                            | Description                  | Status  |
| ------------------------------- | ---------------------------- | ------- |
| Create `RoutineSummaryCard.tsx` | Skin type + concerns + stats | ✅ Done |
| Add skin type icons             | Droplets icon for skin type  | ✅ Done |
| Display health restrictions     | Pregnancy-safe badge         | ✅ Done |

### 3.2 Phase 6: Weekly Schedule View

**Priority: Medium**

Allow users to see their routine for any day of the week.

```
┌─────────────────────────────────────┐
│  L   M   M   J   V   S   D          │
│ [●] [○] [○] [○] [○] [○] [○]        │
└─────────────────────────────────────┘
```

| Task                         | Description                          |
| ---------------------------- | ------------------------------------ |
| Create `WeekDaySelector.tsx` | Day picker component                 |
| Update `useTodayRoutine.ts`  | Accept day parameter                 |
| Show day-specific products   | Some products only used certain days |

### 3.3 Phase 7: Product Details & "Why This Product?"

**Priority: Medium**

Explain why each product was selected for the user.

| Task                            | Description                    |
| ------------------------------- | ------------------------------ |
| Create `ProductDetailModal.tsx` | Bottom sheet with full details |
| Add "Why this?" section         | Explain selection criteria     |
| Show ingredients                | Display key active ingredients |
| Add alternatives                | Suggest similar products       |

### 3.4 Phase 8: Shopping Experience

**Priority: High**

Improve the shopping flow and conversion.

| Task                       | Description                     |
| -------------------------- | ------------------------------- |
| Create `ShopAllButton.tsx` | "Buy entire routine" CTA        |
| Add cart functionality     | Select multiple products        |
| Show total price           | Sum of selected products        |
| Multiple retailers         | Amazon, Sephora, pharmacy links |
| Stock awareness            | Show availability status        |

### 3.5 Phase 9: Advanced Personalization (from PHP)

**Priority: Low**

Features from the original PHP implementation:

#### 9.1 Lifestyle Factors

The PHP system tracked:

- Sleep quality
- Stress levels
- Smoking status
- Exercise frequency
- Alcohol consumption

| Task                            | Description                           |
| ------------------------------- | ------------------------------------- |
| Add lifestyle questions to quiz | Capture lifestyle data                |
| Adjust product selection        | Factor lifestyle into recommendations |
| Show lifestyle tips             | Personalized advice based on habits   |

#### 9.2 Budget Tiers

The PHP system had 4 budget tiers:

- Budget: < 20€ per product
- Mid-range: 15-30€
- Standard: up to 40€
- Luxury: > 40€

| Task                          | Description               |
| ----------------------------- | ------------------------- |
| Add budget preference to quiz | Capture budget preference |
| Filter products by budget     | Respect price limits      |
| Show budget alternatives      | "Save money" suggestions  |

#### 9.3 Ethical Preferences

The PHP system filtered by:

- Bio (Organic)
- Cruelty-free
- Vegan

| Task                            | Description                     |
| ------------------------------- | ------------------------------- |
| Add ethical preferences to quiz | Capture values                  |
| Filter products by ethics       | Only show matching products     |
| Display ethics badges           | Show certifications on products |

#### 9.4 Allergy Management

The PHP system tracked:

- Brand allergies
- Ingredient allergies

| Task                         | Description                  |
| ---------------------------- | ---------------------------- |
| Add allergy input to profile | Let users specify allergies  |
| Filter products by allergies | Exclude problematic products |
| Show allergy warnings        | Alert on potential issues    |

### 3.6 Phase 10: Supplementary Content (from PHP)

**Priority: Low**

The PHP implementation included educational content:

#### 10.1 FAQ Cards ("Fiches Complémentaires")

| Content Type          | Description                                |
| --------------------- | ------------------------------------------ |
| Hormone guides        | Impact of hormonal fluctuations            |
| Body care guides      | Acne, keratosis pilaris, hyperpigmentation |
| Lifestyle guides      | Effects of stress, sleep, smoking          |
| Contraception impacts | How birth control affects skin             |

| Task                           | Description                          |
| ------------------------------ | ------------------------------------ |
| Create `RoutineFAQSection.tsx` | Collapsible FAQ cards                |
| Add content CMS                | Manage educational content           |
| Personalize FAQ                | Show relevant cards based on profile |

#### 10.2 Body Care Routines

The PHP system also recommended:

- Body lotions
- Hand creams
- Lip care
- Hair care

| Task                          | Description                |
| ----------------------------- | -------------------------- |
| Extend quiz for body concerns | Capture body skin issues   |
| Create body routine section   | Separate from face routine |
| Add body product database     | Lotions, scrubs, etc.      |

### 3.7 Phase 11: Advanced Features

**Priority: Low**

#### 11.1 Routine Tracking

| Task                      | Description               |
| ------------------------- | ------------------------- |
| Morning/evening check-off | Mark steps as done        |
| Streak tracking           | Gamification              |
| Progress photos           | Before/after comparison   |
| Skin diary integration    | Link with journal feature |

#### 11.2 Product Lifecycle

| Task                    | Description                 |
| ----------------------- | --------------------------- |
| Product expiry tracking | Alert when products expire  |
| Repurchase reminders    | Notify when running low     |
| Usage analytics         | Track application frequency |

#### 11.3 Social Features

| Task            | Description               |
| --------------- | ------------------------- |
| Share routine   | Generate shareable image  |
| Routine reviews | User feedback on products |
| Community tips  | User-submitted advice     |

---

## 4. Technical Architecture

### 4.1 Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Typeform      │────▶│   Backend API   │────▶│   Mobile App    │
│   Quiz          │     │   /routine/last │     │   Display       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Product DB    │
                        │   500+ items    │
                        └─────────────────┘
```

### 4.2 Endpoints

| Endpoint               | Auth | Usage                         |
| ---------------------- | ---- | ----------------------------- |
| `GET /routine/last`    | Yes  | Main app (authenticated user) |
| `GET /routine/{rspid}` | No   | Web embed (iframe on website) |

### 4.3 State Management

| Store          | Data                     |
| -------------- | ------------------------ |
| `useUserStore` | `rspid`, `routineStatus` |
| TanStack Query | Routine data cache       |

### 4.4 Component Hierarchy

```
RoutineResultsScreen
├── ScreenHeader
├── RoutineSummaryCard (future)
├── RoutineToggle
│   ├── MorningButton
│   └── EveningButton
└── ScrollView
    └── RoutineStepCard (×N)
        ├── StepHeader
        ├── ProductImage
        ├── ProductInfo
        └── ShopButton
```

---

## 5. API Reference

See `docs/ROUTINE_BACKEND_DOC.md` for full API documentation.

### 5.1 Key Types

```typescript
// Skin Types (6 types from PHP)
type SkinType =
  | 'tres_seche' // Très Sèche
  | 'seche' // Sèche
  | 'normale' // Normale
  | 'mixte_normale_grasse' // Mixte Normale-Grasse
  | 'mixte_seche_grasse' // Mixte Sèche-Grasse
  | 'grasse' // Grasse
  | 'tres_grasse' // Très Grasse
  | 'generique' // Générique

// Skin States (7 states from PHP)
type SkinStateType =
  | 'sensible' // Sensitive
  | 'tres_sensible' // Very Sensitive
  | 'mature' // Mature/Aging
  | 'atopique' // Atopic/Eczema
  | 'deshydratee' // Dehydrated
  | 'acneique' // Acne-prone
  | 'acne_hormonale' // Hormonal Acne

// Product Categories (15 categories)
type ProductCategory =
  | 'demaquillant' // Makeup Remover
  | 'nettoyant' // Cleanser
  | 'tonique' // Toner
  | 'exfoliant' // Exfoliant
  | 'serum' // Serum
  | 'contour_yeux' // Eye Contour
  | 'creme_jour' // Day Cream
  | 'creme_nuit' // Night Cream
  | 'creme_solaire' // Sunscreen
  | 'masque' // Mask
  | 'huile' // Face Oil
  | 'brume' // Mist
  | 'baume' // Balm
  | 'gadgets' // Beauty Tech
  | 'complements' // Supplements
```

### 5.2 Routine Response Structure

```typescript
interface RoutineResponseDto {
  id: string
  email: string
  customerId?: number
  createdAt: string
  analysis: {
    skinType: { primaryType, label, confidence }
    skinStates: { states[], labels[] }
    healthConditions: { conditions[], hasRestrictions, isPregnancySafe }
  }
  productSelection: {
    products: Record<ProductCategory, Product | null>
    totalPrice: number
    productCount: number
    brandCohesionApplied: boolean
  }
  routinePlan: {
    weeklySchedule: DailyRoutine[]  // 7 days
    productUsage: ProductUsage[]
  }
  summary: {
    skinTypeLabel: string
    primaryConcerns: string[]
    hasRestrictions: boolean
    totalProducts: number
    totalPrice: number
    averageDailyMinutes: number
  }
}
```

---

## Changelog

| Date       | Version | Changes                                 |
| ---------- | ------- | --------------------------------------- |
| 2025-12-29 | 0.2.0   | Phase 5 completed: Skin Profile Summary |
| 2025-12-29 | 0.1.0   | Initial documentation created           |

---

## References

- [Backend API Documentation](./ROUTINE_BACKEND_DOC.md)
- [Old PHP Implementation](../old_files/)
- [Implementation Plan](../.claude/plans/hidden-foraging-cat.md)
