# PROJECT_STATE.md — PropCalc

## Current Status

| Field | Value |
|-------|-------|
| **Phase** | 0 — Project Initialization |
| **Last Updated** | 2025-04-21 |
| **Active Feature** | None (project setup in progress) |
| **Open PRs** | 0 |
| **Ready for Development** | ❌ (waiting for repo + Firebase setup) |

---

## Architecture

| Layer | Technology | Status |
|-------|-----------|--------|
| Mobile | React Native (Expo) | ⬜ Not initialized |
| Backend | Firebase | ⬜ Not initialized |
| Local DB | WatermelonDB | ⬜ Not initialized |
| Calc Engine | TypeScript | ⬜ Not implemented |
| CI/CD | GitHub Actions + EAS | ⬜ Not configured |

---

## Completed Work

| Date | Item | Notes |
|------|------|-------|
| 2025-04-21 | Project definition written | PROJECT_DEFINITION.md |
| 2025-04-21 | Tech spec written | TECH_SPEC.md |
| 2025-04-21 | Code registry template created | CODE_REGISTRY.md (empty) |
| 2025-04-21 | Agent definitions written | AGENTS.md |

---

## In Progress

| Item | Owner | Blocked By | ETA |
|------|-------|-----------|-----|
| GitHub repo creation | Kai | GitHub auth | Now |
| Expo app scaffold | — | Repo | Next |
| Firebase project setup | — | Repo | Next |

---

## Blocked

| Item | Blocker | Resolution |
|------|---------|-----------|
| Agent spawning | Gateway pairing issue | Fix: `openclaw gateway status` |
| GitHub repo | GH auth needed | User: run `/tmp/bin/gh auth login` |

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-04-21 | React Native (Expo) | Faster iteration, cross-platform |
| 2025-04-21 | Firebase backend | Auth + DB + Functions in one platform |
| 2025-04-21 | Freemium model | Ad-supported free + $4.99/year Pro |
| 2025-04-21 | 6 MVP calculators | Core investor toolkit, expandable |
| 2025-04-21 | Zillow/MLS lookup | Differentiator, but MVP stretch goal |

---

## Next Actions (Priority Order)

1. ✅ GitHub auth → create repo
2. ⬜ Initialize Expo project (`npx create-expo-app`)
3. ⬜ Setup Firebase project
4. ⬜ Configure CI/CD (GitHub Actions)
5. ⬜ Implement calculator engine (pure TypeScript)
6. ⬜ Build first calculator UI (Mortgage)
7. ⬜ Add save/share functionality
8. ⬜ Implement auth (Firebase Anonymous)
9. ⬜ Add property lookup (Zillow)
10. ⬜ Setup monetization (RevenueCat + AdMob)

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

---

## Notes

- App name: PropCalc (tentative, can change before submission)
- Development workflow: see AGENTS.md
- All agents must read this file before starting work
- Update this file after every merged PR
