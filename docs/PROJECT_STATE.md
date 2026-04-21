# PROJECT_STATE.md — PropCalc

## Current Status

| Field | Value |
|-------|-------|
| **Phase** | 1 — Core Development |
| **Last Updated** | 2025-04-21 |
| **Active Feature** | Mortgage Calculator (engine complete, UI in progress) |
| **Open PRs** | 0 |
| **Ready for Development** | ✅ (Expo + engine ready) |
| **GitHub Repo** | https://github.com/Mirasashk/propcalc |
| **Project Board** | https://github.com/users/Mirasashk/projects/3 |

---

## Architecture

| Layer | Technology | Status |
|-------|-----------|--------|
| Mobile | React Native (Expo) | ✅ SDK 52, TypeScript scaffolded |
| Backend | Firebase | ⬜ Not initialized |
| Local DB | WatermelonDB | ⬜ Not initialized |
| Calc Engine | TypeScript | ✅ Mortgage engine complete (21 tests) |
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
| 2025-04-21 | Mortgage calculator engine | 21 tests, all passing, Decimal.js |
| 2025-04-21 | UI components created | Input, Button, Card, ResultCard, AmortizationChart |
| 2025-04-21 | Mortgage calculator screen | Full UI with form, results, chart toggle |

---

## In Progress

| Item | Owner | Blocked By | ETA |
|------|-------|-----------|-----|
| Mortgage Calculator UI | Frontend Agent | — | Now |
| Firebase project setup | — | — | Next |
| Local DB persistence | — | Firebase | Next |

---

## Blocked

| Item | Blocker | Resolution |
|------|---------|-----------|
| Agent spawning timeouts | Gateway reloads mid-task | Shorter tasks, better error handling |

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-04-21 | React Native (Expo) | Faster iteration, cross-platform |
| 2025-04-21 | Firebase backend | Auth + DB + Functions in one platform |
| 2025-04-21 | Freemium model | Ad-supported free + $4.99/year Pro |
| 2025-04-21 | 6 MVP calculators | Core investor toolkit, expandable |
| 2025-04-21 | Zillow/MLS lookup | Differentiator, but MVP stretch goal |
| 2025-04-21 | Decimal.js for currency | Avoid floating point errors in financial calcs |

---

## Next Actions (Priority Order)

1. ✅ GitHub auth → create repo
2. ✅ GitHub Project board created
3. ✅ Initial issues created (#1-5)
4. ✅ Initialize Expo project
5. ✅ Mortgage calculator engine (pure TypeScript)
6. ⬜ Build mortgage calculator UI screen
7. ⬜ Setup Firebase project
8. ⬜ Configure CI/CD (GitHub Actions)
9. ⬜ Add save/share functionality
10. ⬜ Implement auth (Firebase Anonymous)
11. ⬜ Add property lookup (Zillow)
12. ⬜ Setup monetization (RevenueCat + AdMob)

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Expo/RN breaking changes | Medium | High | Pin versions, test before upgrade |
| Firebase pricing surprises | Low | High | Monitor billing, set alerts |
| Zillow API changes/blocks | High | Medium | Cache aggressively, manual fallback |
| App store rejection | Medium | High | Follow guidelines, clear privacy policy |
| Pro conversion < 3% | Medium | High | A/B test pricing, feature gating |
| Calculation errors (legal) | Low | Critical | Thorough testing, "estimate only" disclaimer |
| Agent spawning timeouts | Medium | Medium | Shorter tasks, state checkpointing |

---

## Notes

- App name: PropCalc (tentative, can change before submission)
- Development workflow: see AGENTS.md
- All agents must read this file before starting work
- Update this file after every merged PR
- Reference values verified:
  - $300k@6.5%/30yr = $1,896.20/month ✅
  - $500k@7.0%/30yr = $3,326.51/month ✅
