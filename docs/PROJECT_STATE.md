# PROJECT_STATE.md — PropCalc

## Current Status

| Field | Value |
|-------|-------|
| **Phase** | 1 — Core Development (MVP Nearly Complete) |
| **Last Updated** | 2025-04-22 |
| **Active Feature** | All 3 MVP calculators complete, save/share integrated |
| **Open PRs** | 0 |
| **Ready for Testing** | ✅ Yes — all core features implemented |
| **GitHub Repo** | https://github.com/Mirasashk/propcalc |
| **Project Board** | https://github.com/users/Mirasashk/projects/3 |

---

## Architecture

| Layer | Technology | Status |
|-------|-----------|--------|
| Mobile | React Native (Expo) | ✅ SDK 52, TypeScript, 3 calculator screens |
| Backend | Firebase | ⬜ Deferred to v1.1 (local storage sufficient for MVP) |
| Local DB | AsyncStorage | ✅ saveCalculation, getCalculations, delete, clear |
| Calc Engine | TypeScript | ✅ 3 engines, 64 tests, all passing |
| CI/CD | GitHub Actions + EAS | ⬜ Not configured |

---

## Completed Work

| Date | Item | Notes |
|------|------|-------|
| 2025-04-21 | Project definition written | PROJECT_DEFINITION.md |
| 2025-04-21 | Tech spec written | TECH_SPEC.md |
| 2025-04-21 | Code registry template created | CODE_REGISTRY.md (empty) |
| 2025-04-21 | Agent definitions written | AGENTS.md |
| 2025-04-21 | GitHub repo created | https://github.com/Mirasashk/propcalc |
| 2025-04-21 | GitHub Project board created | "PropCalc Development" |
| 2025-04-21 | Expo project scaffolded | SDK 52, TypeScript, all deps |
| 2025-04-21 | Mortgage calculator engine | 21 tests, all passing |
| 2025-04-21 | UI components created | Input, Button, Card, ResultCard, AmortizationChart |
| 2025-04-21 | Mortgage calculator screen | Full UI with form, results, chart toggle |
| 2025-04-22 | ROI calculator engine | 18 tests, all passing |
| 2025-04-22 | Cap Rate calculator engine | 11 tests, all passing |
| 2025-04-22 | AsyncStorage persistence | saveCalculation, getCalculations, delete, clear |
| 2025-04-22 | Storage tests | 14 tests, all passing |
| 2025-04-22 | Share utility | Share API integration |
| 2025-04-22 | Saved calculations hook | useSavedCalculations with limit enforcement |
| 2025-04-22 | ROI calculator screen | Full UI with 9 inputs, 4 results |
| 2025-04-22 | Cap Rate calculator screen | Full UI with 4 inputs, 2 results |
| 2025-04-22 | Saved calculations screen | Swipe-to-delete, share, date display |
| 2025-04-22 | Save integrated | Mortgage screen can save calculations |

---

## Test Results

```
PASS __tests__/engine/mortgage.test.ts      21 tests
PASS __tests__/engine/roi.test.ts           18 tests
PASS __tests__/engine/cap-rate.test.ts      11 tests
PASS __tests__/services/storage.test.ts     14 tests

Total: 64 tests, all passing
```

---

## What's Testable Now

### ✅ Mortgage Calculator
- Input: Loan Amount, Interest Rate, Term, Down Payment
- Results: Monthly Payment, Total Interest, Total Cost
- Features: Amortization chart toggle, save calculation

### ✅ ROI Calculator
- Input: Purchase Price, Down Payment, Closing Costs, Rehab, Monthly Rent, Expenses, Vacancy Rate, Appreciation, Holding Period
- Results: Cash-on-Cash Return, Annual Cash Flow, Cap Rate, Total Return

### ✅ Cap Rate Calculator
- Input: Purchase Price, Gross Annual Rent, Operating Expenses, Vacancy Rate
- Results: Cap Rate (%), NOI

### ✅ Saved Calculations
- View all saved calculations
- Swipe to delete
- Share via native share sheet
- Free tier limit: 5 calculations

---

## What's NOT in MVP (v1.1+)

| Feature | Status |
|---------|--------|
| Firebase Auth | ⬜ Anonymous + email login |
| Cloud sync | ⬜ Pro tier feature |
| Property lookup (Zillow/MLS) | ⬜ Requires scraping infrastructure |
| Rent vs Buy calculator | ⬜ Next feature after MVP |
| Fix & Flip calculator | ⬜ Next feature after MVP |
| Property Comparison | ⬜ Next feature after MVP |
| AdMob ads | ⬜ Free tier monetization |
| RevenueCat Pro subscription | ⬜ $4.99/year upgrade |
| PDF export | ⬜ Pro feature |
| Push notifications | ⬜ Rate alerts |

---

## Next Actions (Priority Order)

1. ✅ **USER TESTING** — Build and test on device/simulator
2. ⬜ Fix any bugs from user feedback
3. ⬜ Add remaining calculator screens (Rent vs Buy, Fix & Flip, Compare)
4. ⬜ Firebase integration (auth, cloud sync)
5. ⬜ Monetization (AdMob, RevenueCat)
6. ⬜ App Store / Play Store submission

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Expo/RN breaking changes | Medium | High | Pin versions, test before upgrade |
| Calculation errors (legal) | Low | Critical | 64 tests, "estimate only" disclaimer |
| Agent spawning timeouts | Medium | Medium | Shorter tasks, state checkpointing |
| npm install issues (TypeScript) | Medium | Medium | Use global tsc or fix lock file |
| User testing reveals major UX issues | Medium | High | Iterate fast, user feedback loop |

---

## Notes

- App name: PropCalc (tentative)
- All calculations use Decimal.js for precision
- Dark mode supported throughout
- Tablet layouts supported
- Accessibility labels on all interactive elements
- Development workflow: see AGENTS.md
