/**
 * Feature flags and gating
 */
export const FEATURES = {
  // Calculators (all available in free tier)
  MORTGAGE_CALCULATOR: { free: true, pro: true },
  ROI_CALCULATOR: { free: true, pro: true },
  CAP_RATE_CALCULATOR: { free: true, pro: true },
  RENT_VS_BUY_CALCULATOR: { free: true, pro: true },
  FIX_FLIP_CALCULATOR: { free: true, pro: true },
  PROPERTY_COMPARISON: { free: true, pro: true },

  // Pro-only features
  PROPERTY_LOOKUP: { free: false, pro: true },
  CLOUD_SYNC: { free: false, pro: true },
  PDF_EXPORT: { free: false, pro: true },
  SHARE_CALCULATION: { free: false, pro: true },
  UNLIMITED_SAVED: { free: false, pro: true },
  MULTI_PROPERTY_COMPARE: { free: false, pro: true }, // 3+ properties

  // Ads
  SHOW_ADS: { free: true, pro: false },
} as const;

export type FeatureName = keyof typeof FEATURES;

/**
 * Check if a feature is available for a given tier
 */
export function isFeatureAvailable(feature: FeatureName, isPro: boolean): boolean {
  return isPro ? FEATURES[feature].pro : FEATURES[feature].free;
}
