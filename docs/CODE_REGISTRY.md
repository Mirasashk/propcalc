# CODE_REGISTRY.md

# CODE_REGISTRY.md — PropCalc

> Living document. Updated after every PR that adds shared code.
> **RULE**: Check this file before creating new utilities or components.

---

## Shared Utilities (src/engine/utils/)

| Function | File | Used By | Purpose |
|----------|------|---------|---------|
| `formatCurrency(n, opts?)` | `utils/currency.ts` | mortgage UI, all results | `$1,234.56` display |
| `parseCurrency(s)` | `utils/currency.ts` | all forms | Parse user currency input |
| `formatPercent(n, decimals?)` | `utils/currency.ts` | all results | `5.50%` display |
| `parsePercent(s)` | `utils/currency.ts` | all forms | Parse percentage input |
| `validateNumberRange(n, min, max, field)` | `utils/validation.ts` | all forms | Throws on invalid |

## UI Components (src/components/ui/)

| Component | File | Props | Used By |
|-----------|------|-------|---------|
| `Input` | `ui/Input.tsx` | `label, value, onChangeText, keyboardType, placeholder, error, helperText, currency?` | all forms |
| `Button` | `ui/Button.tsx` | `title, onPress, variant, loading, disabled` | all screens |
| `Card` | `ui/Card.tsx` | `title, children, style` | results, lists |

## Calculator Components (src/components/calculators/)

| Component | File | Props | Used By |
|-----------|------|-------|---------|
| `CalculatorForm` | `calculators/CalculatorForm.tsx` | `onSubmit, children, validation, defaultValues` | all calculators |
| `ResultCard` | `calculators/ResultCard.tsx` | `title, value, unit?, highlight?` | all calculators |
| `AmortizationChart` | `calculators/AmortizationChart.tsx` | `data: AmortizationEntry[]` | mortgage |

## Engine Functions (src/engine/)

| Function | File | Input | Output | Tests |
|----------|------|-------|--------|-------|
| `calculateMortgage(input)` | `mortgage.ts` | `MortgageInput` | `MortgageResult` | ✅ 21 tests |

## Property Components (src/components/property/)

| Component | File | Props | Used By |
|-----------|------|-------|---------|
| `PropertyCard` | `property/PropertyCard.tsx` | `property: Property`, `onPress` | saved, lookup |
| `PropertyForm` | `property/PropertyForm.tsx` | `property?`, `onSave` | manual entry, edit |
| `PropertyLookup` | `property/PropertyLookup.tsx` | `onPropertyFound`, `mode: 'zillow' \| 'mls'` | lookup screen |

## Engine Functions (src/engine/)

| Function | File | Input | Output |
|----------|------|-------|--------|
| `calculateMortgage(input: MortgageInput)` | `mortgage.ts` | `MortgageInput` | `MortgageResult` |
| `calculateROI(input: ROIInput)` | `roi.ts` | `ROIInput` | `ROIResult` |
| `calculateCapRate(input: CapRateInput)` | `cap-rate.ts` | `CapRateInput` | `CapRateResult` |
| `calculateRentVsBuy(input: RentVsBuyInput)` | `rent-vs-buy.ts` | `RentVsBuyInput` | `RentVsBuyResult` |
| `calculateFixFlip(input: FixFlipInput)` | `fix-flip.ts` | `FixFlipInput` | `FixFlipResult` |
| `compareProperties(properties: Property[])` | `compare.ts` | `Property[]` | `ComparisonResult` |

## Hooks (src/hooks/)

| Hook | File | Returns | Used By |
|------|------|---------|---------|
| `useAuth()` | `hooks/useAuth.ts` | `{ user, isAnonymous, signIn, signOut }` | all screens |
| `useSavedProperties()` | `hooks/useSavedProperties.ts` | `{ properties, save, delete, isLoading }` | saved screen |
| `useCalculator<T, R>(engine: CalcEngine<T, R>)` | `hooks/useCalculator.ts` | `{ result, calculate, isCalculating }` | all calculators |
| `useProStatus()` | `hooks/useProStatus.ts` | `{ isPro, subscription, purchase }` | all screens |

## Constants (src/constants/)

| Constant | File | Value | Purpose |
|----------|------|-------|---------|
| `FREE_TIER.MAX_SAVED_PROPERTIES` | `limits.ts` | `5` | Free tier limit |
| `FREE_TIER.MAX_COMPARISON_PROPERTIES` | `limits.ts` | `2` | Free comparison limit |
| `FREE_TIER.HAS_ADS` | `limits.ts` | `true` | Show ads on free |
| `PRO_TIER.PRICE` | `limits.ts` | `4.99` | Annual subscription |

## Database Models (src/database/models/)

| Model | File | Fields |
|-------|------|--------|
| `Property` | `models/Property.ts` | `id`, `address`, `price`, `beds`, `baths`, `sqft`, `tax`, `rentEstimate`, `notes`, `createdAt` |
| `Calculation` | `models/Calculation.ts` | `id`, `type`, `inputs`, `result`, `propertyId?`, `createdAt` |

---

## RULES

1. **ALWAYS** check this file before creating new shared utilities
2. If similar function exists, **EXTEND** it — don't duplicate
3. New UI components must be added to this registry
4. New engine functions must have corresponding tests
5. Breaking changes to registered APIs must update all consumers
6. This file is updated **in the same PR** that adds/modifies shared code

---

## CHANGE LOG

| Date | Change | PR |
|------|--------|-----|
| 2025-04-21 | Added mortgage calculator engine + 21 tests | #3 |
| 2025-04-21 | Added UI components: Input, Button, Card | #3 |
| 2025-04-21 | Added calculator components: CalculatorForm, ResultCard, AmortizationChart | #3 |
| 2025-04-21 | Added mortgage calculator screen | #3 |
