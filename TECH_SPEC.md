# TECH_SPEC.md

## Stack Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Mobile Framework | React Native (Expo) | SDK 52+ |
| Language | TypeScript | 5.5+ |
| Navigation | Expo Router | v3 |
| UI Library | React Native Paper | v5 |
| Forms | React Hook Form + Zod | latest |
| Charts | React Native Gifted Charts | latest |
| State | Zustand | v4 |
| Local DB | WatermelonDB | v0.27+ |
| Backend | Firebase | v11+ |
| Auth | Firebase Auth | latest |
| Cloud DB | Firestore | latest |
| Functions | Firebase Cloud Functions | v2 |
| Storage | Firebase Storage | latest |
| Analytics | Firebase Analytics | latest |
| Crashlytics | Firebase Crashlytics | latest |
| Ads | Google Mobile Ads (AdMob) | latest |
| Payments | RevenueCat | v7+ |
| Push | Firebase Cloud Messaging | latest |
| Testing | Jest + RNTL | latest |
| E2E | Maestro | latest |
| CI/CD | EAS Build + GitHub Actions | latest |

---

## Project Structure

```
propcalc/
├── .github/
│   └── workflows/
│       ├── pr-check.yml       # Lint, test, type-check on PR
│       └── eas-build.yml      # Build on merge to main
├── .maestro/
│   └── flows/
│       └── mortgage-calc.yaml  # E2E test flows
├── app/
│   ├── (tabs)/                # Main tab navigation
│   │   ├── index.tsx          # Dashboard/home
│   │   ├── calculators/
│   │   │   ├── mortgage.tsx
│   │   │   ├── roi.tsx
│   │   │   ├── cap-rate.tsx
│   │   │   ├── rent-vs-buy.tsx
│   │   │   ├── fix-flip.tsx
│   │   │   └── compare.tsx
│   │   ├── saved/
│   │   │   └── index.tsx      # Saved calculations
│   │   └── profile/
│   │       └── index.tsx      # Settings, upgrade
│   ├── lookup/
│   │   └── index.tsx          # Zillow/MLS lookup
│   ├── result/
│   │   └── [id].tsx           # Calculation result detail
│   └── _layout.tsx            # Root layout
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Chart.tsx
│   │   │   └── CurrencyInput.tsx
│   │   ├── calculators/
│   │   │   ├── CalculatorForm.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── AmortizationChart.tsx
│   │   │   └── ComparisonTable.tsx
│   │   └── property/
│   │       ├── PropertyCard.tsx
│   │       ├── PropertyForm.tsx
│   │       └── PropertyLookup.tsx
│   ├── engine/
│   │   ├── types.ts           # Shared calculation types
│   │   ├── mortgage.ts        # Mortgage calculator
│   │   ├── roi.ts             # ROI / cash-on-cash
│   │   ├── cap-rate.ts        # Cap rate
│   │   ├── rent-vs-buy.ts     # Rent vs buy
│   │   ├── fix-flip.ts        # Fix and flip
│   │   ├── compare.ts         # Property comparison
│   │   └── utils/
│   │       ├── currency.ts    # formatCurrency, parseCurrency
│   │       ├── validation.ts  # validateNumberRange, etc
│   │       └── math.ts        # compound interest, etc
│   ├── hooks/
│   │   ├── useAuth.ts         # Firebase auth state
│   │   ├── useSavedProperties.ts
│   │   ├── useCalculator.ts   # Generic calc hook
│   │   └── useProStatus.ts    # Subscription status
│   ├── stores/
│   │   ├── authStore.ts       # Zustand auth store
│   │   ├── calcStore.ts       # Current calculation state
│   │   └── propertyStore.ts   # Saved properties
│   ├── services/
│   │   ├── firebase.ts        # Firebase init
│   │   ├── firestore.ts       # Firestore CRUD
│   │   ├── functions.ts       # Cloud Functions calls
│   │   ├── admob.ts           # Ad initialization
│   │   └── revenuecat.ts      # Purchases init
│   ├── database/
│   │   ├── schema.ts          # WatermelonDB schema
│   │   ├── models/
│   │   │   ├── Property.ts
│   │   │   └── Calculation.ts
│   │   └── sync.ts            # Sync with Firestore
│   └── constants/
│       ├── limits.ts          # Free tier limits
│       ├── features.ts        # Feature flags
│       └── calculator-config.ts # Calc field definitions
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts
│   │   ├── zillow.ts          # Zillow scraping
│   │   └── mls.ts             # MLS lookup
│   └── package.json
├── __tests__/
│   ├── engine/                # Calc engine tests
│   ├── components/            # Component tests
│   └── integration/           # Integration tests
├── app.json                   # Expo config
├── eas.json                   # EAS Build config
├── firebase.json              # Firebase config
├── package.json
└── tsconfig.json
```

---

## Architecture Patterns

### Calculation Engine
- **Pure functions only** — no side effects
- **Input**: typed config object
- **Output**: typed result object + optional amortization array
- **All engine functions unit tested** — this is the core value

```typescript
// Example interface
interface MortgageInput {
  loanAmount: number;
  interestRate: number; // annual, e.g. 6.5
  loanTermYears: number; // 1-30
  downPayment?: number;
}

interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule: AmortizationEntry[];
}
```

### Data Flow
```
User Input → Zod Validation → Calc Engine → Display Result
     ↓                                          ↓
  [Save] → Local DB (WatermelonDB) → Sync → Firestore (if Pro)
```

### Auth Flow
```
Open App → Anonymous Auth → Can calculate freely
           ↓
      [Save / Cloud Sync / Pro Feature]
           ↓
     Prompt: Create Account (Email/Google)
           ↓
     Link Anonymous → Permanent Account
```

### Free vs Pro Feature Gating
```typescript
// Feature gate pattern
const { isPro } = useProStatus();

if (!isPro && savedCount >= FREE_TIER.MAX_SAVED_PROPERTIES) {
  showUpgradeModal();
  return;
}
```

---

## Coding Conventions

### Naming
- Components: PascalCase (`CalculatorForm.tsx`)
- Hooks: camelCase starting with `use` (`useCalculator.ts`)
- Stores: camelCase ending with `Store` (`calcStore.ts`)
- Engine functions: camelCase, descriptive (`calculateMortgagePayment`)
- Types/Interfaces: PascalCase, descriptive (`MortgageResult`)

### File Organization
- One component per file (unless trivial sub-components)
- Co-locate tests: `Component.test.tsx` next to `Component.tsx`
- Index exports: `components/ui/index.ts` for clean imports

### State Management Rules
- **Zustand**: Global state (auth, pro status, current calc)
- **React State**: Local UI state (form inputs, modals)
- **WatermelonDB**: Persistent data (saved properties, history)

### TypeScript Strictness
- `strict: true` in tsconfig
- No `any` without explicit eslint-disable + comment
- All functions must have return types
- All API calls typed with Zod validation

---

## Performance Guidelines

- Use `React.memo` for expensive components (charts, lists)
- Virtualize saved properties list if > 50 items
- Debounce property lookup inputs (300ms)
- Lazy load calculator screens
- Preload AdMob ads before showing
- Compress Firestore reads with caching

---

## Security

- Never store API keys in client code (use Firebase Functions)
- Input validation on all user data (Zod)
- Firestore security rules: user can only read own data
- RevenueCat webhook validation
- No PII in logs or crash reports

---

## Environment Variables

```
# .env (gitignored)
FIREBASE_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_APP_ID=
REVENUECAT_API_KEY=
ADMOB_APP_ID_IOS=
ADMOB_APP_ID_ANDROID=
```

---

## Build & Deploy

### Development
```bash
npx expo start
# Press 'i' for iOS simulator, 'a' for Android emulator
```

### Testing
```bash
npm test              # Jest unit tests
npx maestro test .maestro/flows/  # E2E tests
```

### Staging Build
```bash
eas build --profile preview
# Creates internal distribution build
```

### Production
```bash
eas build --profile production
# Submit to App Store / Play Store
```
