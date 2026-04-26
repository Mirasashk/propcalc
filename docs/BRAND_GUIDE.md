# PropCalc Brand Guide & Design System

## Brand Identity

**PropCalc** is a professional real estate calculator for investors, agents, and homebuyers. The brand conveys:
- **Trust & Precision** — Financial decisions require accuracy
- **Speed & Clarity** — Users need answers fast, not decoration
- **Modern Professional** — Clean, contemporary, not stuffy

---

## Color Palette

### Primary Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `primary` | `#0D7377` (Teal) | `#14A3A8` | CTAs, highlights, active states |
| `onPrimary` | `#FFFFFF` | `#FFFFFF` | Text on primary buttons |
| `primaryContainer` | `#E0F2F1` | `#1E3A3C` | Highlighted result cards |

### Secondary Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `secondary` | `#D4A017` (Gold) | `#E8C547` | Accent icons, upgrade badges, positive indicators |
| `onSecondary` | `#1A1A1A` | `#1A1A1A` | Text on secondary elements |
| `secondaryContainer` | `#FFF8E1` | `#3D3220` | Secondary info backgrounds |

### Semantic Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `success` | `#2E7D32` (Green) | `#4CAF50` | Positive returns, profit |
| `warning` | `#F57C00` (Orange) | `#FF9800` | Caution, limits reached |
| `error` | `#C62828` (Red) | `#EF5350` | Errors, negative values |
| `info` | `#1565C0` (Blue) | `#42A5F5` | Tips, helper text |

### Neutral Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `#FAFAFA` | `#0F1419` | Screen background |
| `surface` | `#FFFFFF` | `#1A1F2E` | Cards, inputs |
| `surfaceVariant` | `#F5F5F5` | `#252B3B` | Elevated cards, sections |
| `outline` | `#E0E0E0` | `#3A4458` | Borders, dividers |
| `outlineVariant` | `#EEEEEE` | `#2A3448` | Subtle separators |

### Text Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `onBackground` | `#1A1A2E` | `#E8E8E8` | Headlines, primary text |
| `onSurface` | `#2D2D3A` | `#D0D0D0` | Body text |
| `onSurfaceVariant` | `#6B7280` | `#9CA3AF` | Helper text, placeholders |

---

## Typography

### Type Scale
| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `displayLarge` | 32px | 700 | 40px | Splash, empty states |
| `displayMedium` | 28px | 700 | 36px | Calculator titles |
| `headlineLarge` | 24px | 700 | 32px | Section headers |
| `headlineMedium` | 20px | 600 | 28px | Card titles |
| `headlineSmall` | 18px | 600 | 26px | Result values |
| `titleLarge` | 16px | 600 | 24px | Input labels |
| `titleMedium` | 14px | 500 | 22px | Button text, tabs |
| `bodyLarge` | 16px | 400 | 24px | Body text |
| `bodyMedium` | 14px | 400 | 20px | Helper text |
| `bodySmall` | 12px | 400 | 16px | Captions, metadata |
| `labelLarge` | 14px | 500 | 20px | Form labels |
| `labelMedium` | 12px | 500 | 16px | Badges, chips |

### Font Family
- **Primary**: System font stack (San Francisco on iOS, Roboto on Android)
- **Monospace**: System mono (for numeric displays, if needed)
- No custom fonts in MVP — keep bundle size down

---

## Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight padding, icon gaps |
| `space-2` | 8px | Small gaps, inline spacing |
| `space-3` | 12px | Button padding, card internal |
| `space-4` | 16px | Standard padding, section gaps |
| `space-5` | 20px | Large gaps, form sections |
| `space-6` | 24px | Card padding, modal padding |
| `space-8` | 32px | Screen horizontal padding |
| `space-10` | 40px | Major section breaks |
| `space-12` | 48px | Bottom safe area padding |

### Layout Principles
- **16px** horizontal screen padding on mobile
- **64px** horizontal screen padding on tablet (max-width 900px centered)
- **16px** gap between cards
- **12px** gap between form inputs
- **8px** gap between result cards (phone: stacked, tablet: row)

---

## Component Standards

### Buttons
| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | `primary` | `onPrimary` | none | Main CTAs (Calculate, Save) |
| Secondary | `secondary` | `onSecondary` | none | Sub-actions (Toggle chart) |
| Outline | transparent | `primary` | `primary` 1px | Tertiary actions (Share) |
| Danger | `error` | `#FFFFFF` | none | Destructive (Delete) |
| Ghost | transparent | `onSurface` | none | Text-only actions |

**Dimensions:**
- Min height: 48px
- Border radius: 12px
- Padding horizontal: 16px
- Icon + text gap: 8px

### Cards
- Border radius: 16px
- Background: `surface`
- Border: 1px `outline`
- Padding: 16px
- Shadow (light): `0 1px 3px rgba(0,0,0,0.08)`
- Shadow (dark): `0 1px 3px rgba(0,0,0,0.3)`
- Title: `headlineMedium` with 8px bottom margin

### Inputs
- Height: 56px
- Border radius: 12px
- Background: `surface`
- Border: 1px `outline`
- Active border: 2px `primary`
- Label: `labelLarge` above input
- Helper text: `bodySmall` `onSurfaceVariant`
- Error state: border `error`, text `error`
- Currency formatting on blur

### Result Cards
- Background: `surfaceVariant`
- Highlight variant: `primaryContainer` with 2px `primary` border
- Border radius: 12px
- Padding: 16px
- Title: `bodySmall` `onSurfaceVariant`
- Value: `headlineSmall` bold

---

## Layout Patterns

### Calculator Screen Structure
```
[Screen ScrollView]
  ├─ Header (16px top, 16px horizontal)
  │   ├─ Title: displayMedium
  │   └─ Subtitle (optional): bodyMedium onSurfaceVariant
  │
  ├─ Input Card (16px horizontal, 16px top)
  │   ├─ Card Title: headlineMedium
  │   ├─ Form Inputs (12px gap)
  │   └─ Calculate Button (16px top)
  │
  ├─ Error Banner (if any)
  │
  ├─ Results Card (16px top)
  │   ├─ Card Title: headlineMedium
  │   ├─ Result Row 1 (phone: col, tablet: row)
  │   │   ├─ ResultCard (highlighted primary)
  │   └─ Result Row 2 (phone: col, tablet: row)
  │       └─ ResultCard
  │
  ├─ Action Row (16px vertical, centered)
  │   ├─ Secondary Button (flex: 1)
  │   └─ Outline Button (flex: 1)
  │
  ├─ Chart Card (if applicable)
  │   └─ Chart (horizontal scroll if needed)
  │
  └─ Bottom Safe Area (48px)
```

### Home Screen Structure
```
[Screen View]
  ├─ Header Section (centered, 48px top)
  │   ├─ App Logo / Icon (64px)
  │   ├─ App Name: displayLarge
  │   └─ Tagline: bodyLarge onSurfaceVariant
  │
  ├─ Quick Actions Grid (16px horizontal, 24px top)
  │   ├─ Row 1: [Mortgage] [ROI]
  │   └─ Row 2: [Cap Rate] [Saved]
  │
  └─ Bottom Section (pro badge, recent calculations)
```

---

## Chart Standards

### Amortization Chart
- **Type**: Stacked bar (Principal vs Interest by year)
- **Colors**: Primary (Principal), Tertiary/Gold (Interest)
- **Height**: 220px fixed
- **Labels**: `bodySmall`, rotated if needed
- **Y-axis**: Currency format with `$` prefix
- **Overflow handling**: Horizontal scroll for >15 bars
- **Alternative**: Show every 5 years for >20 year loans

### Data Visualization Rules
- Always show axis labels
- Use consistent color mapping across screens
- Highlight the user's value (e.g., their rate vs market average)
- Provide a legend for multi-series charts
- Ensure minimum 44px touch targets for any interactive chart elements

---

## Animation & Motion

### Timing
| Animation | Duration | Easing |
|-----------|----------|--------|
| Card appear | 200ms | ease-out |
| Button press | 100ms | ease-in-out |
| Screen transition | 300ms | ease-in-out |
| Chart render | 400ms | ease-out (staggered bars) |
| Input focus | 150ms | ease-out |

### Patterns
- **Slide up**: New cards/results appear from bottom (translateY: 20 → 0, opacity: 0 → 1)
- **Scale press**: Buttons scale to 0.97 on press
- **Skeleton loading**: Pulse animation for async data
- **Number count-up**: Results animate from 0 to final value (300ms)

---

## Accessibility

### Contrast Ratios
- All text must meet WCAG AA (4.5:1 for normal, 3:1 for large)
- Interactive elements must meet WCAG AA (3:1 for UI components)

### Touch Targets
- Minimum 44×44px for all interactive elements
- Buttons: 48px height minimum
- Input fields: 56px height

### Screen Reader
- All inputs have `accessibilityLabel`
- All buttons have descriptive labels
- Results announce value with context ("Monthly payment is $1,896")
- Charts have `accessibilityLabel` describing the data summary

---

## Responsive Behavior

### Breakpoints
| Name | Width | Behavior |
|------|-------|----------|
| Mobile | < 768px | Single column, full-width cards |
| Tablet | ≥ 768px | Centered content (max 900px), result cards in rows |

### Tablet Adaptations
- Results cards: 2 per row
- Input forms: Can be 2-column for related fields (e.g., Price + Down Payment)
- Charts: Wider, more detailed labels
- Side padding: 64px instead of 16px

---

## File Organization

```
src/styles/
├── theme.ts           # React Native Paper custom theme
├── colors.ts          # Color tokens
├── spacing.ts         # Spacing tokens
├── typography.ts      # Typography helpers
└── shadows.ts         # Shadow definitions
```

---

## Implementation Notes

### React Native Paper Theme
Define a custom theme object that overrides the default Paper theme with brand colors. Pass it to `PaperProvider` in the root layout.

### NativeWind Integration
Use Tailwind classes for rapid layout prototyping, but use the theme tokens for colors to ensure consistency.

### No Custom Fonts (MVP)
Use system fonts to keep the app lightweight. Consider adding a custom font in v1.1 for brand differentiation.
