# CODE_REGISTRY.md

# CODE_REGISTRY.md — PropCalc

> Living document. Updated after every PR that adds shared code.
> **RULE**: Check this file before creating new utilities or components.

---

## Shared Utilities (src/engine/utils/)

| Function | File | Used By | Purpose |
|----------|------|---------|---------|
| `formatCurrency(n: number, currency?: string)` | `utils/currency.ts` | mortgage, roi, cap-rate | `$1,234.56` display |
| `parseCurrency(s: string): number` | `utils/currency.ts` | all forms | Parse user currency input |
| `validateNumberRange(n: number, min: number, max: number, field: string)` | `utils/validation.ts` | all forms | Throws ValidationError |
| `calculateCompoundInterest(principal, rate, years, compoundsPerYear)` | `utils/math.ts` | mortgage, rent-vs-buy | Core financial math |
| `calculateAmortizationSchedule(...)` | `utils/math.ts` | mortgage | Monthly breakdown array |

## UI Components (src/components/ui/)

| Component | File | Props | Used By |
|-----------|------|-------|---------|
| `Button` | `ui/Button.tsx` | `variant`, `onPress`, `loading`, `disabled` | all screens |
| `Input` | `ui/Input.tsx` | `label`, `value`, `onChangeText`, `keyboardType`, `error` | all forms |
| `CurrencyInput` | `ui/CurrencyInput.tsx` | `value`, `onChange`, `currency` | all calculators |
| `Card` | `ui/Card.tsx` | `title`, `children`, `onPress` | results, property list |
| `Chart` | `ui/Chart.tsx` | `data`, `type`, `config` | amortization, comparison |

## Calculator Components (src/components/calculators/)

| Component | File | Props | Used By |
|-----------|------|-------|---------|
| `CalculatorForm` | `calculators/CalculatorForm.tsx` | `fields`, `onSubmit`, `validationSchema`, `defaultValues` | all calculators |
| `ResultCard` | `calculators/ResultCard.tsx` | `title`, `value`, `unit`, `highlight` | all calculators |
| `AmortizationChart` | `calculators/AmortizationChart.tsx` | `data: AmortizationEntry[]` | mortgage |
| `ComparisonTable` | `calculators/ComparisonTable.tsx` | `properties: Property[]` | compare |

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
| | | |
