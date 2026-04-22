# PROJECT_STATE.md — PropCalc

## Current Status

| Field | Value |
|-------|-------|
| **Phase** | 1 — Core Development (MVP Testable) |
| **Last Updated** | 2025-04-22 |
| **Active Feature** | All 3 MVP calculators complete with save/share |
| **Open PRs** | 0 |
| **Ready for Testing** | ✅ Yes |
| **GitHub Repo** | https://github.com/Mirasashk/propcalc |
| **Project Board** | https://github.com/users/Mirasashk/projects/3 |

---

## Architecture

| Layer | Technology | Status |
|-------|-----------|--------|
| Mobile | React Native (Expo) | ✅ SDK 52, 3 calculator screens |
| Backend | Firebase | ⬜ Deferred to v1.1 |
| Local DB | AsyncStorage | ✅ save, get, delete, clear + tests |
| Calc Engine | TypeScript | ✅ 3 engines, 64 tests, all passing |
| CI/CD | GitHub Actions + EAS | ⬜ Not configured |

---

## Completed Work

| Date | Item | Notes |
|------|------|-------|
| 2025-04-21 | Project definition written | PROJECT_DEFINITION.md |
| 2025-04-21 | Tech spec written | TECH_SPEC.md |
| 2025-04-21 | Code registry template created | CODE_REGISTRY.md |
| 2025-04-21 | Agent definitions written | AGENTS.md |
| 2025-04-21 | GitHub repo created | https://github.com/Mirasashk/propcalc |
| 2025-04-21 | GitHub Project board created | "PropCalc Development" |
| 2025-04-21 | Expo project scaffolded | SDK 52, TypeScript, all deps |
| 2025-04-21 | Mortgage calculator engine | 21 tests |
| 2025-04-21 | UI components created | Input, Button, Card, ResultCard, AmortizationChart |
| 2025-04-21 | Mortgage calculator screen | Full UI with form, results, chart toggle |
| 2025-04-22 | ROI calculator engine | 18 tests |
| 2025-04-22 | Cap Rate calculator engine | 11 tests |
| 2025-04-22 | AsyncStorage persistence | saveCalculation, getCalculations, delete, clear |
| 2025-04-22 | Storage tests | 14 tests |
| 2025-04-22 | Share utility | Share API integration |
| 2025-04-22 | ROI calculator screen | Full UI with 9 inputs, 4 results |
| 2025-04-22 | Cap Rate calculator screen | Full UI with 4 inputs, 2 results |
| 2025-04-22 | Saved calculations screen | Swipe-to-delete, share, date display |
| 2025-04-22 | Save integrated on all screens | Mortgage, ROI, Cap Rate |
| 2025-04-22 | Disabled unimplemented calculators | Rent vs Buy, Fix & Flip, Compare marked "Coming soon" |

---

## Test Results (64 passing)

```
PASS __tests__/engine/mortgage.test.ts      21 tests
PASS __tests__/engine/roi.test.ts           18 tests
PASS __tests__/engine/cap-rate.test.ts      11 tests
PASS __tests__/services/storage.test.ts     14 tests
```

---

## What's Testable Now

### ✅ Mortgage Calculator
- Input: Loan Amount, Interest Rate, Term, Down Payment
- Results: Monthly Payment, Total Interest, Total Cost
- Features: Amortization chart toggle, save calculation, share

### ✅ ROI Calculator
- Input: Purchase Price, Down Payment, Closing Costs, Rehab, Monthly Rent, Expenses, Vacancy Rate, Appreciation, Holding Period
- Results: Cash-on-Cash Return, Annual Cash Flow, Cap Rate, Total Return
- Features: Save, share

### ✅ Cap Rate Calculator
- Input: Purchase Price, Gross Annual Rent, Operating Expenses, Vacancy Rate
- Results: Cap Rate (%), NOI
- Features: Save, share

### ✅ Saved Calculations
- View all saved calculations
- Swipe to delete
- Share via native share sheet
- Free tier limit: 5 calculations (enforced)

---

## Known Issues / Next Priority

| Issue | Priority | Action |
|-------|----------|--------|
| TypeScript compiler missing | Medium | Fix npm install for tsc binary |
| Zillow/MLS property lookup | Low | v1.1 feature |
| Firebase auth + cloud sync | Low | v1.1 feature |
| AdMob + RevenueCat | Low | v1.1 monetization |
| Rent vs Buy, Fix & Flip, Compare | Low | v1.1 calculators |

---

## How to Test

```bash
git clone https://github.com/Mirasashk/propcalc.git
cd propcalc
npm install
npx expo start
# Press 'i' for iOS simulator, 'a' for Android
```

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-04-21 | React Native (Expo) | Faster iteration, cross-platform |
| 2025-04-21 | Firebase backend deferred | Local storage sufficient for MVP test |
| 2025-04-21 | Freemium model | Ad-supported free + $4.99/year Pro |
| 2025-04-22 | AsyncStorage over WatermelonDB | Simpler, no sync complexity for MVP |
| 2025-04-22 | Decimal.js for currency | Avoid floating point errors |
| 2025-04-22 | Disable unimplemented calc links | Prevents crashes, clean UX |

---

## Next Actions (Post-User Testing)

1. Await user feedback from testing
2. Fix bugs/issues reported
3. Add Firebase auth + cloud sync
4. Add remaining calculators
5. Add monetization (AdMob, RevenueCat)
6. App Store / Play Store submission

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| User testing reveals UX issues | Medium | High | Iterate fast, short feedback loops |
| npm install issues on fresh clone | Medium | Medium | Document exact node version |
| Calculation errors (legal) | Low | Critical | 64 tests, "estimate only" disclaimer |
| Agent spawning timeouts | Medium | Medium | Doing direct edits for quick fixes |

---

## Notes

- App name: PropCalc (tentative)
- All calculations use Decimal.js for precision
- Dark mode supported throughout
- Tablet layouts supported
- Accessibility labels on all interactive elements
- Free tier limit: 5 saved calculations
- No external API dependencies for MVP (no Firebase, no Zillow)
