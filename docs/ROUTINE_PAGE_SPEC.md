# Routine Page Specification

## Overview

A public routine results page accessible via `rspid` (response ID from Typeform), displayed on both web (Vercel) and mobile (in-app screen).

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              TYPEFORM QUIZ                              │
│                   (Mobile App or PHP Website)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         TYPEFORM WEBHOOK                                │
│              Sends quiz answers + rspid to Backend                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            BACKEND API                                  │
│         Processes answers → Generates personalized routine              │
│         Stores routine with rspid as key                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ROUTINE PAGE                                    │
│                                                                         │
│   Web (PHP site):  skineasy.com/my-custom-page?rspid=xxx               │
│                    └── iframe → Vercel page                            │
│                                                                         │
│   Web (Direct):    routine.skineasy.com?rspid=xxx                      │
│                    └── Vercel-hosted React Native Web page             │
│                                                                         │
│   Mobile App:      In-app screen (native navigation)                   │
│                    └── Fetches from same API                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### 1. Backend API

**Endpoint:** `GET /routine/:rspid`

**Response (V1 - Products only):**

```json
{
  "rspid": "abc123",
  "createdAt": "2025-01-15T00:00:00.000Z",
  "skinProfile": {
    "carnation": "Très claire",
    "skinType": "Peau normale à mixte",
    "skinStates": [],
    "concerns": ["Teint terne"]
  },
  "products": [
    {
      "id": 1,
      "step": "Démaquillant",
      "name": "Huile pré-nettoyante démaquillante",
      "brand": "Dermalogica",
      "price": 54.0,
      "currency": "EUR",
      "imageUrl": "https://...",
      "description": "Elle démaquille et pré-nettoie la peau...",
      "howToUse": "Dépose une petite quantité d'huile...",
      "frequency": "Tous les soirs où tu rentres maquillé.e",
      "application": "Sur peau sèche",
      "purchaseUrl": "https://..."
    }
  ]
}
```

**Error Response (404):**

```json
{
  "error": "Routine not found",
  "message": "No routine exists for this response ID"
}
```

### 2. Vercel Web Page

**Stack:** React + react-native-web (separate Vercel project)

**URL:** `https://routine.skineasy.com?rspid=xxx` (or similar subdomain)

**Features:**

- Reads `rspid` from URL query params
- Fetches routine data from `GET /routine/:rspid`
- Displays product list with SkinEasy branding
- Responsive design (works in iframe and standalone)
- No authentication required

**Page Structure (V1):**

```
┌─────────────────────────────────────────┐
│           SKINEASY LOGO                 │
├─────────────────────────────────────────┤
│                                         │
│   "Ta Routine Sur-Mesure"               │
│                                         │
├─────────────────────────────────────────┤
│   ┌─────────────────────────────────┐   │
│   │  Step 1: Démaquillant           │   │
│   │  [Image] Product Name           │   │
│   │  Brand - €54.00                 │   │
│   │  Description...                 │   │
│   │  [Shop Button]                  │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  Step 2: Nettoyant              │   │
│   │  ...                            │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ... more products ...                 │
│                                         │
└─────────────────────────────────────────┘
```

### 3. PHP Website Integration

**Page:** `skineasy.com/my-custom-page`

**Implementation:**

```html
<!-- PHP page embeds Vercel page in iframe -->
<iframe
  src="https://routine.skineasy.com?rspid=<?php echo $_GET['rspid']; ?>"
  width="100%"
  height="100%"
  frameborder="0"
></iframe>
```

### 4. Mobile App Integration

**Location:** New screen in `app/routine/results.tsx` or similar

**Navigation:** After Typeform quiz completion, navigate to this screen with `rspid`

**Implementation:**

- Native React Native screen (not WebView)
- Fetches from same `GET /routine/:rspid` API
- Uses existing app styling and components
- Shares product card components with Vercel page (via react-native-web)

---

## Implementation Plan

### Phase 1: Backend API

1. Create Typeform webhook endpoint to receive submissions
2. Implement routine generation logic
3. Store routine data with `rspid` as key
4. Create `GET /routine/:rspid` endpoint

### Phase 2: Vercel Web Page

1. Create new Vercel project with React + react-native-web
2. Implement routine page component
3. Add SkinEasy branding/styling
4. Deploy to Vercel
5. Configure custom domain (routine.skineasy.com)

### Phase 3: PHP Integration

1. Create `/my-custom-page` on PHP site
2. Embed Vercel page in iframe
3. Pass `rspid` query param to iframe

### Phase 4: Mobile App Integration

1. Create `RoutineResultsScreen` component
2. Add navigation from QuizScreen after completion
3. Implement product list UI
4. Wire up to API

---

## Shared Code Strategy

To avoid code duplication between Vercel page and mobile app:

```
src/
├── features/
│   └── routine/
│       ├── components/
│       │   ├── ProductCard.tsx      # Shared component
│       │   ├── RoutineHeader.tsx    # Shared component
│       │   └── ProductList.tsx      # Shared component
│       ├── hooks/
│       │   └── useRoutineByRspid.ts # Shared hook (TanStack Query)
│       └── types/
│           └── routine.types.ts     # Shared types
```

The Vercel project can import these shared components, or we can create a shared package.

---

## Authentication

- **Public access:** Anyone with the `rspid` URL can view the routine
- **No login required**
- **Security note:** `rspid` is effectively a secret URL token

---

## Future Enhancements (V2+)

- Skin identity card display
- Weekly application schedule
- FAQ section
- Active ingredients compatibility chart
- PDF download
- Save to account (if logged in)
- Email the routine

---

## Resolved Decisions

1. **Vercel subdomain:** Use Vercel default domain (e.g., `skineasy-routine.vercel.app`)

2. **Typeform redirect URLs (configured in Typeform settings):**
   - **Mobile app:** `skineasy.com/app/quiz-complete?rspid={{response_id}}`
     - This URL is intercepted by the app's WebView before it loads
     - App extracts `rspid`, stores it, shows processing alert, closes WebView
   - **Web (PHP site):** `skineasy.com/my-custom-page?rspid={{response_id}}`
     - PHP page embeds the Vercel routine page in iframe

3. **Routine Results Page URLs:**
   - **Mobile app:** In-app `RoutineResultsScreen` (native navigation with `rspid` param)
   - **Web (iframe):** Vercel page embedded at `skineasy.com/fr/my-custom-page-mobile?rspid=xxx`

4. **Mobile app flow:**
   1. User opens Typeform quiz in WebView modal
   2. User completes quiz → Typeform redirects to `skineasy.com/app/quiz-complete?rspid=xxx`
   3. App detects this URL in WebView, extracts `rspid`
   4. App stores `rspid` in user store, sets `routineStatus` to "processing"
   5. App shows popup: "We're analyzing your answers..."
   6. App closes WebView, returns to dashboard
   7. Dashboard shows ProcessingBanner instead of QuizBanner
   8. Meanwhile, Typeform sends webhook to backend → backend processes routine
   9. User taps ProcessingBanner → navigates to RoutineResultsScreen
   10. Screen fetches `GET /routine/:rspid` → shows "processing" state or products

5. **Processing state:** Routine is NOT displayed immediately
   - Show popup explaining processing is in progress
   - Dashboard banner changes from "Quiz" to "Processing..."
   - User can tap banner anytime to check status
