# SkinEasy Mobile App - Development Specification

## Project Overview

**App Name:** SkinEasy
**Tech Stack:** React Native (Expo Managed Workflow), TypeScript
**Target OS:** iOS & Android
**Approach:** Test-Driven Development (TDD)

---

## Tech Stack & Dependencies

### Core Framework
- **Expo SDK** (Managed Workflow)
- **TypeScript** (strict mode)
- **Expo Router** - File-based routing

### State Management
- **Zustand** - Multiple stores pattern:
  - `useAuthStore` - Authentication state, tokens
  - `useUserStore` - User profile, diagnosis status
  - `useJournalStore` - Daily entries cache
- **TanStack Query** - Server state, caching, background refetch
  - Use `queryClient.invalidateQueries` pattern
  - Global error boundary for API errors

### Styling
- **NativeWind** - Tailwind CSS for React Native
- **Custom components** - No UI library, build from scratch

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation (shared between forms and API responses)

### Internationalization
- **i18next** + **react-i18next** + **expo-localization**
- Languages: FR (French), EN (English)
- Default: Device locale

### Testing
- **Vitest** - Test runner
- **React Native Testing Library** - Component testing
- Unit tests only for V1

### Build & Tooling
- **Vite** - Build tool (for tests)
- **ESLint** - Standard config
- **Prettier** - Code formatting
- **EAS Build** - Production builds

### Additional Libraries
- `expo-secure-store` - JWT storage
- `expo-constants` - Environment config
- `expo-image-picker` - Meal photos
- `expo-localization` - Device locale
- `react-native-webview` - Typeform integration
- `react-native-web` - Web platform support
- `react-native-svg` + `lucide-react-native` - Icons
- `react-native-toast-message` - User feedback
- `@expo-google-fonts/roboto` - Typography
- `date-fns` - Date manipulation

---

## Project Structure

```
app/                          # Expo Router - File-based routing
├── _layout.tsx               # Root layout (providers, fonts)
├── index.tsx                 # Entry redirect based on auth
├── (auth)/                   # Auth group (unauthenticated)
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
└── (tabs)/                   # Main tabs (authenticated)
    ├── _layout.tsx           # Tab navigator
    ├── index.tsx             # Dashboard tab
    ├── routine.tsx           # Routine tab
    └── profile.tsx           # Profile tab

src/
├── features/                 # Feature-specific code
│   ├── auth/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── schemas/
│   ├── journal/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── schemas/
│   ├── routine/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── schemas/
│   ├── diagnosis/
│   │   ├── hooks/
│   │   └── schemas/
│   └── profile/
│       ├── hooks/
│       └── components/
│
├── shared/
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Shared hooks
│   ├── services/             # API services
│   ├── stores/               # Zustand stores
│   ├── utils/                # Utilities
│   ├── config/               # App configuration
│   └── types/                # TypeScript types
│
├── i18n/
│   ├── locales/
│   │   ├── en.json
│   │   └── fr.json
│   └── index.ts
│
└── theme/
    ├── colors.ts
    ├── spacing.ts
    ├── typography.ts
    └── index.ts
```

---

## Design System

### Colors

```typescript
// theme/colors.ts
export const colors = {
  // Primary
  primary: '#55C4B8',        // Soft teal/aqua - buttons, key accents
  primaryDark: '#2C8F84',    // Darker teal - links, pressed states

  // Secondary
  secondary: '#F7B6A8',      // Warm peach-pink - highlights, badges

  // Background
  background: '#FFF9F5',     // Off-white/cream - main background
  surface: '#FFFFFF',        // Pure white - cards, sections

  // Text
  text: '#333333',           // Dark grey - primary body text
  textMuted: '#6B7280',      // Medium grey - captions, meta
  textLight: '#9CA3AF',      // Light grey - placeholders

  // Semantic
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',

  // Border
  border: '#E5E7EB',
  borderFocus: '#55C4B8',
}
```

### Spacing (4px base grid)

```typescript
// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
}
```

### Border Radius

```typescript
// theme/spacing.ts
export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
}
```

### Typography

```typescript
// theme/typography.ts
// Using @expo-google-fonts/roboto

export const typography = {
  h1: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 28,
    lineHeight: 36,
  },
  h2: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },
}
```

---

## Navigation Structure

```
RootNavigator
├── AuthStack (when no token)
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen (WebBrowser to PrestaShop)
│
└── MainTabs (when token exists)
    ├── DashboardStack
    │   └── DashboardScreen ("Today")
    │
    ├── RoutineStack
    │   └── RoutineScreen
    │
    └── ProfileStack
        ├── ProfileScreen
        └── DiagnosisWebViewScreen (fullscreen in stack)
```

---

## API Layer

### Environment Configuration

```typescript
// app.config.ts
export default {
  expo: {
    // ... other config
    extra: {
      apiUrl: process.env.API_URL ?? 'https://api-dev.skineasy.com',
      typeformId: process.env.TYPEFORM_ID ?? 'YOUR_TYPEFORM_ID',
      prestashopUrl: process.env.PRESTASHOP_URL ?? 'https://skineasy.com',
    },
  },
}

// shared/config/env.ts
import Constants from 'expo-constants'

export const ENV = {
  API_URL: Constants.expoConfig?.extra?.apiUrl as string,
  TYPEFORM_ID: Constants.expoConfig?.extra?.typeformId as string,
  PRESTASHOP_URL: Constants.expoConfig?.extra?.prestashopUrl as string,
}
```

### API Client (Fetch-based)

```typescript
// shared/services/api.ts
import { getToken, removeToken } from '../utils/storage'
import { ENV } from '../config/env'

interface ApiOptions extends RequestInit {
  skipAuth?: boolean
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (!skipAuth) {
    const token = await getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${ENV.API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (response.status === 401) {
    await removeToken()
    // Trigger auth state reset
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'API Error')
  }

  return response.json()
}
```

### Token Refresh Logic

```typescript
// In api.ts - add interceptor for 401 handling
// When 401 received:
// 1. Try refresh token if available
// 2. If refresh fails, clear storage and redirect to login
```

### API Endpoints

```typescript
// Auth
POST /auth/login          { email, password } -> { access_token, refresh_token, user }
POST /auth/register       { firstname, lastname, email, password } -> { access_token, user }
POST /auth/refresh        { refresh_token } -> { access_token }

// User
GET  /user/profile        -> { id, email, firstname, lastname, skinType? }

// Diagnosis
GET  /diagnosis/latest    -> { id, skinType, concerns, createdAt, routine }
                          -> 404 if no diagnosis

// Journal
GET  /journal/entries?date=YYYY-MM-DD  -> JournalEntry[]
POST /journal/entry       FormData | JSON -> JournalEntry

// Routine (from diagnosis)
GET  /diagnosis/latest    -> includes routine: { morning: Step[], evening: Step[] }
```

### Zod Schemas

```typescript
// features/auth/schemas/auth.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  firstname: z.string().min(2, 'First name is required'),
  lastname: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
```

---

## TanStack Query Configuration

```typescript
// shared/config/queryClient.ts
import { QueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
    },
    mutations: {
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong',
        })
      },
    },
  },
})
```

### Query Keys Convention

```typescript
// shared/config/queryKeys.ts
export const queryKeys = {
  user: ['user'] as const,
  diagnosis: ['diagnosis'] as const,
  journalEntries: (date: string) => ['journal', 'entries', date] as const,
  routine: ['routine'] as const,
}
```

---

## Zustand Stores

### Auth Store

```typescript
// shared/stores/auth.store.ts
import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setToken: (token: string) => Promise<void>
  clearToken: () => Promise<void>
  loadToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setToken: async (token) => {
    await SecureStore.setItemAsync('access_token', token)
    set({ token, isAuthenticated: true })
  },

  clearToken: async () => {
    await SecureStore.deleteItemAsync('access_token')
    set({ token: null, isAuthenticated: false })
  },

  loadToken: async () => {
    const token = await SecureStore.getItemAsync('access_token')
    set({
      token,
      isAuthenticated: !!token,
      isLoading: false
    })
  },
}))
```

### User Store

```typescript
// shared/stores/user.store.ts
import { create } from 'zustand'

interface User {
  id: string
  email: string
  firstname: string
  lastname: string
  skinType?: string
}

interface UserState {
  user: User | null
  hasDiagnosis: boolean
  setUser: (user: User) => void
  setHasDiagnosis: (value: boolean) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  hasDiagnosis: false,

  setUser: (user) => set({ user }),
  setHasDiagnosis: (value) => set({ hasDiagnosis: value }),
  clearUser: () => set({ user: null, hasDiagnosis: false }),
}))
```

---

## Typeform WebView Integration

### Detection Method: Injected JavaScript + postMessage

```typescript
// features/diagnosis/screens/DiagnosisWebViewScreen.tsx
const INJECTED_JAVASCRIPT = `
  (function() {
    // Listen for Typeform submission
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'form-submit') {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'TYPEFORM_SUBMIT',
          responseId: event.data.responseId
        }));
      }
    });

    // Also check URL changes for fallback
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      if (window.location.href.includes('thank') || window.location.href.includes('success')) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'TYPEFORM_COMPLETE'
        }));
      }
    };
  })();
  true;
`

// WebView URL with hidden fields
const typeformUrl = `https://form.typeform.com/to/${ENV.TYPEFORM_ID}?user_email=${encodeURIComponent(user.email)}`
```

---

## i18n Configuration

```typescript
// shared/config/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import en from '../../i18n/locales/en.json'
import fr from '../../i18n/locales/fr.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: Localization.locale.split('-')[0], // 'en' from 'en-US'
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
```

### Translation Structure

```json
// i18n/locales/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "login": "Login",
    "register": "Create Account",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot Password?",
    "invalidCredentials": "Invalid credentials"
  },
  "dashboard": {
    "greeting": "Hello {{name}}",
    "today": "Today",
    "yesterday": "Yesterday",
    "tomorrow": "Tomorrow"
  },
  "journal": {
    "sleep": {
      "title": "Sleep",
      "question": "How did you sleep?",
      "hours": "Hours of sleep"
    },
    "nutrition": {
      "title": "Nutrition",
      "addMeal": "Add Meal",
      "addNote": "Add a note to your meal"
    },
    "sport": {
      "title": "Sport",
      "addActivity": "Add Activity",
      "duration": "Duration (min)"
    }
  },
  "routine": {
    "title": "My Routine",
    "morning": "Morning",
    "evening": "Evening",
    "shopRoutine": "Shop my Routine",
    "whyThisProduct": "Why this product?"
  },
  "profile": {
    "title": "Profile",
    "retakeDiagnosis": "Retake Diagnosis",
    "termsConditions": "Terms & Conditions",
    "logout": "Log Out"
  }
}
```

---

## Image Handling

### Compression Before Upload

```typescript
// shared/utils/image.ts
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

export async function pickAndCompressImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  })

  if (result.canceled) return null

  // Compress image
  const manipulated = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  )

  return manipulated.uri
}
```

### Local Caching for Product Images

TanStack Query handles caching automatically with the configured `gcTime`. For persistent image caching, use `expo-image` or `react-native-fast-image`.

---

## Error Handling

### Global Error Boundary

```typescript
// App.tsx - wrap with QueryClientProvider
// TanStack Query handles API errors globally via queryClient config

// For component-level errors:
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-error text-center mb-4">
        Something went wrong
      </Text>
      <Button onPress={resetErrorBoundary} title="Try Again" />
    </View>
  )
}
```

### Toast Configuration

```typescript
// App.tsx
import Toast from 'react-native-toast-message'

// At the end of App component, after NavigationContainer:
<Toast />
```

---

## Testing Strategy

### File Naming Convention
- Test files: `ComponentName.test.tsx` or `hookName.test.ts`
- Located in `__tests__/` folders within each feature

### Test Structure

```typescript
// Example: features/auth/hooks/__tests__/useLogin.test.ts
import { renderHook, waitFor } from '@testing-library/react-native'
import { useLogin } from '../useLogin'

describe('useLogin', () => {
  it('should return success on valid credentials', async () => {
    // Arrange
    const { result } = renderHook(() => useLogin())

    // Act
    result.current.mutate({ email: 'test@test.com', password: 'password123' })

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })

  it('should return error on invalid credentials', async () => {
    // ...
  })
})
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

---

## Implementation Phases

### Phase 1: Project Setup & Foundation
1. Initialize Expo project with TypeScript
2. Configure ESLint + Prettier
3. Setup Vitest
4. Configure NativeWind
5. Setup theme (colors, spacing, typography)
6. Setup i18n with FR/EN
7. **TEST CHECKPOINT**

### Phase 2: Core Infrastructure
1. Setup environment config (expo-constants)
2. Create API client with fetch
3. Setup Zustand stores (auth, user)
4. Setup TanStack Query
5. Setup Toast notifications
6. **TEST CHECKPOINT**

### Phase 3: Navigation Shell
1. Create RootNavigator
2. Create AuthStack (empty screens)
3. Create MainTabs (empty screens)
4. Implement auth flow logic (token check)
5. **TEST CHECKPOINT**

### Phase 4: Authentication Feature
1. Create shared Input component
2. Create shared Button component
3. Implement LoginScreen with form
4. Implement RegisterScreen with form
5. Implement auth API services
6. Connect to Zustand + TanStack Query
7. **TEST CHECKPOINT**

### Phase 5: Diagnosis Feature
1. Implement DiagnosisWebViewScreen
2. Implement useDiagnosis hook
3. Add diagnosis check on MainTabs mount
4. Force redirect to diagnosis if 404
5. **TEST CHECKPOINT**

### Phase 6: Dashboard Feature (Journal)
1. Create DatePicker component
2. Create Card component
3. Implement SleepCard
4. Implement NutritionCard (with image picker)
5. Implement SportCard
6. Implement journal API services
7. **TEST CHECKPOINT**

### Phase 7: Routine Feature
1. Create RoutineToggle (Morning/Evening)
2. Create ProductCard component
3. Implement RoutineScreen
4. Implement "Shop my Routine" CTA
5. **TEST CHECKPOINT**

### Phase 8: Profile Feature
1. Create Avatar component
2. Implement ProfileScreen
3. Add logout functionality
4. Add "Retake Diagnosis" flow
5. Add Terms & Conditions WebView
6. **TEST CHECKPOINT**

### Phase 9: Polish & Production
1. Add loading states
2. Add empty states
3. Review error handling
4. Test on iOS & Android
5. Configure EAS Build
6. **FINAL TEST**

---

## Commands Reference

```bash
# Development
npx expo start

# Testing
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report

# Linting
npm run lint              # ESLint check
npm run lint:fix          # ESLint fix
npm run format            # Prettier format

# Build
eas build --platform ios
eas build --platform android
```

---

## Important Notes

1. **TDD Approach:** Write tests FIRST, then implementation
2. **Commit after each phase:** Keep commits atomic and meaningful
3. **Ask to test:** After each phase, pause for manual testing
4. **No over-engineering:** Only build what's specified in V1
5. **Accessibility:** Add accessibilityLabel to interactive elements
6. **Performance:** Use `React.memo` and `useCallback` where appropriate
7. **Absolute Imports:** ALWAYS use absolute imports, never relative ones
8. **Ask before committing:** Always confirm with user before creating git commits

---

## Import Convention

**ALWAYS use absolute imports.** Configure TypeScript paths in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@navigation/*": ["src/navigation/*"],
      "@theme/*": ["src/theme/*"],
      "@i18n/*": ["src/i18n/*"]
    }
  }
}
```

### Examples

```typescript
// CORRECT - Absolute imports
import { Button } from '@shared/components/Button'
import { useAuthStore } from '@shared/stores/auth.store'
import { LoginScreen } from '@features/auth/screens/LoginScreen'
import { colors } from '@theme/colors'
import { api } from '@shared/services/api'

// WRONG - Relative imports (NEVER use these)
import { Button } from '../../../shared/components/Button'
import { useAuthStore } from '../../stores/auth.store'
```

---

## MCP Tools Available

### Context7 - Documentation Lookup

Use the **context7** MCP server to retrieve up-to-date documentation and code examples for any library.

**Available tools:**
- `mcp__context-7__resolve-library-id` - Find the library ID for a package
- `mcp__context-7__get-library-docs` - Get documentation for a library

**Usage:** When implementing features, use Context7 to fetch the latest documentation for:
- Expo packages (expo-image-picker, expo-secure-store, etc.)
- TanStack Query
- Zustand
- React Navigation
- NativeWind
- React Hook Form
- Zod
- i18next
- Any other dependency

This ensures we use the correct, up-to-date APIs rather than outdated patterns.
