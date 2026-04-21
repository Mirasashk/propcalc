# PROJECT_DEFINITION.md

## App Overview

| Field | Value |
|-------|-------|
| **Name** | PropCalc (working title — suggest alternatives) |
| **Platforms** | iOS, Android |
| **Framework** | React Native (Expo) |
| **Target Users** | Home buyers, real estate investors (SFR, commercial), agents, brokers |
| **Monetization** | Freemium: Free with ads + limited features / Pro $4.99/year |

---

## MVP Feature Set (v1.0)

### Core Calculators
1. **Mortgage Calculator** — Monthly payment, total interest, amortization schedule
2. **ROI / Cash-on-Cash Return** — Annual return on cash invested
3. **Cap Rate** — Net operating income ÷ property value
4. **Rent vs. Buy Comparison** — Break-even analysis, long-term cost comparison
5. **Fix-and-Flip** — ARV, rehab costs, holding costs, profit margin
6. **Property Comparison** — Side-by-side comparison of up to 3 properties

### Data & Persistence
- Save calculations to device (SQLite/AsyncStorage)
- Firebase Auth (anonymous + email)
- Firebase Firestore (saved properties, user preferences)
- Firebase Cloud Functions (backend logic if needed)

### Property Lookup (MVP stretch)
- Zillow URL paste → auto-populate property details
- MLS number lookup → fetch property data
- Manual entry fallback

### UI/UX
- Clean, calculator-first interface
- Results export (PDF, share sheet)
- Dark mode support
- Tablet-responsive layouts

---

## Post-MVP (v1.1+)

- **Advanced calculators**: 1031 exchange, BRRRR, house hacking, commercial NNN
- **Portfolio tracking**: Dashboard of all owned/analyzed properties
- **Market data**: Rent estimates, appreciation trends via API
- **Document scanner**: Upload inspection reports, receipts to property folder
- **Team sharing**: Share analysis with agents/partners
- **Push notifications**: Rate alerts, market updates
- **Offline mode**: Full functionality without signal

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Mobile Framework | React Native (Expo) | Managed workflow for faster builds |
| State Management | Zustand | Lightweight, no boilerplate |
| Navigation | Expo Router | File-based routing |
| UI Components | React Native Paper + custom | Material Design base |
| Forms | React Hook Form + Zod | Type-safe validation |
| Charts | React Native Gifted Charts | Amortization, comparison visuals |
| Local DB | WatermelonDB | SQLite wrapper, sync-ready |
| Cloud Backend | Firebase | Auth, Firestore, Analytics, Crashlytics |
| Auth | Firebase Auth | Anonymous auth → upgrade to permanent |
| Cloud DB | Firestore | Saved properties, user data |
| Functions | Firebase Cloud Functions | Zillow scraping, MLS APIs (rate-limited) |
| Storage | Firebase Storage | Property photos, exported PDFs |
| Analytics | Firebase Analytics + GA4 | Feature usage, conversion tracking |
| Ads | Google Mobile Ads (AdMob) | Banner + interstitial on free tier |
| Payments | RevenueCat | In-app purchases, subscription management |
| Push Notifications | Firebase Cloud Messaging | Market alerts, rate changes |
| Deep Linking | Expo Linking | Share calculations via URL |
| Testing | Jest + React Native Testing Library | Unit tests |
| E2E Testing | Maestro | Flow tests (critical paths) |
| CI/CD | EAS Build + GitHub Actions | OTA updates via EAS |

---

## Architecture Overview

```
┌──────────────────────────────────────┐
│           REACT NATIVE APP           │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │  Calc   │ │ Property│ │ Profile│ │
│  │Screens  │ │Screens  │ │Screen  │ │
│  └────┬────┘ └────┬────┘ └───┬────┘ │
│       │           │          │      │
│  ┌────▼───────────▼──────────▼────┐ │
│  │      CALC ENGINE (pure TS)    │ │
│  │  Mortgage | ROI | CapRate | ... │ │
│  └─────────────────────────────────┘ │
│       │           │                │
│  ┌────▼─────┐ ┌───▼────┐          │
│  │  Local   │ │  Sync   │          │
│  │   DB     │ │ Engine  │          │
│  │(Watermelon│ │(Firestore│         │
│  │   DB)    │ │  sync)  │          │
│  └──────────┘ └─────────┘          │
└──────────┬─────────────────────────┘
           │
    ┌──────▼──────┐
    │   FIREBASE  │
    │ Auth | Firestore | Functions |
    └─────────────┘
```

---

## Monetization Tiers

### Free Tier
- All 6 core calculators
- Save up to 5 properties
- Basic property comparison (2 properties)
- Ads (banner + occasional interstitial)
- No cloud sync
- No property lookup (Zillow/MLS)

### Pro Tier ($4.99/year)
- Unlimited saved properties
- Comparison up to 5 properties
- Property lookup via Zillow URL / MLS number
- Cloud sync across devices
- PDF export + share
- No ads
- Priority support

---

## User Flows

### First-Time User
1. Open app → anonymous auth created
2. See mortgage calculator (default)
3. Can calculate immediately, no signup
4. Try to save → prompted to create account
5. Account created → Firebase Auth (email or Google Sign-In)

### Property Lookup Flow
1. User taps "Lookup Property"
2. Pastes Zillow URL or enters MLS number
3. Firebase Function scrapes/parses data
4. Returns: address, price, beds, baths, sqft, tax, estimated rent
5. User selects which calculator to pre-fill

### Save & Share Flow
1. User completes calculation
2. Taps "Save" → stored in local DB + Firestore (if Pro)
3. Taps "Share" → native share sheet with formatted text + deep link
4. Recipient opens link → app opens with pre-filled calculation

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Day-1 retention | >40% |
| Day-7 retention | >20% |
| Free→Pro conversion | >3% |
| Average calculations/user/day | >2 |
| App store rating | >4.5 |
| Crash-free rate | >99.9% |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Zillow blocks scraping | Cache aggressively, rotate user agents, fallback to manual entry |
| MLS API access denied | Partner with data providers (Retsly, SimplyRETS) |
| Ad revenue low | Focus on Pro conversion, ads are backup |
| Calculation errors (legal risk) | Disclaimer: "For estimation only, not financial advice" + thorough testing |
| Firebase costs | Monitor usage, set billing alerts, optimize reads |
| App store rejection | Follow guidelines, no misleading claims, clear privacy policy |

---

## Naming Options

1. **PropCalc** — Short, descriptive
2. **DealCheckr** — Investor-focused
3. **HouseMath** — Friendly, accessible
4. **REI Calc** — Real Estate Investor Calc
5. **PropertyLens** — Suggests insight + lookup

**Vote or suggest your own.**

---

## Next Steps

1. ✅ Define project (this document)
2. ⬜ Create GitHub repo + Projects board
3. ⬜ Scaffold Expo app
4. ⬜ Setup Firebase project
5. ⬜ Implement calculator engine (pure TypeScript)
6. ⬜ Build first calculator UI (Mortgage)
7. ⬜ Add save/share functionality
8. ⬜ Implement auth (Firebase Anonymous)
9. ⬜ Add property lookup (Zillow)
10. ⬜ Setup monetization (RevenueCat + AdMob)
11. ⬜ TestFlight / Internal Testing
12. ⬜ App Store / Play Store submission
