const MIN_COVERAGE = 2000;
const MAX_COVERAGE = 35000;

// Base premiums at min/max coverage (Level Preferred rate)
const NON_TOBACCO_MIN_PREMIUM = 8.22;
const NON_TOBACCO_MAX_PREMIUM = 128.57;

// Tobacco base premiums (Level Tobacco rate) — linear range
// Derived from reference: $220.04 at $35,000 coverage
// Ratio: 220.04 / 128.57 = 1.7115
const TOBACCO_MIN_PREMIUM = 14.07;  // 8.22 * 1.7115
const TOBACCO_MAX_PREMIUM = 220.04;

// Input field constraints
const MIN_PREMIUM_INPUT = 8.22;
const MAX_PREMIUM_INPUT = 129.35;

// Multipliers on the base rate for each rate class
// Non-tobacco base = Level Preferred
// Level Non-Tobacco: $155.66 / $128.57 = 1.2107
const NON_TOBACCO_RATE_CLASSES: Record<string, number | null> = {
  'Level Preferred': 1.0,
  'Level Non-Tobacco': 1.2107,
  'Modified Non-Tobacco': 1.9444,
};

// Tobacco base = Level Tobacco (already the tobacco rate)
// Modified Tobacco: from reference at $120 premium → Level=$19k, Modified=$13k → 19/13=1.4615
const TOBACCO_RATE_CLASSES: Record<string, number | null> = {
  'Level Tobacco': 1.0,
  'Modified Tobacco': 1.4615,
};

export function getRateClasses(isTobacco: boolean): Record<string, number | null> {
  return isTobacco ? TOBACCO_RATE_CLASSES : NON_TOBACCO_RATE_CLASSES;
}

export function getBasePremiumRange(isTobacco: boolean) {
  return isTobacco
    ? { min: TOBACCO_MIN_PREMIUM, max: TOBACCO_MAX_PREMIUM }
    : { min: NON_TOBACCO_MIN_PREMIUM, max: NON_TOBACCO_MAX_PREMIUM };
}

export function calculateBasePremium(coverage: number, isTobacco: boolean): number {
  const { min, max } = getBasePremiumRange(isTobacco);
  const clampedCoverage = Math.max(MIN_COVERAGE, Math.min(MAX_COVERAGE, coverage));
  const ratio = (clampedCoverage - MIN_COVERAGE) / (MAX_COVERAGE - MIN_COVERAGE);
  const premium = min + ratio * (max - min);
  return Math.round(premium * 100) / 100;
}

export const calculatePremium = calculateBasePremium;

export function calculateCoverageFromPremium(premium: number, isTobacco: boolean): number {
  const { min, max } = getBasePremiumRange(isTobacco);
  const clampedPremium = Math.max(min, Math.min(max, premium));
  const ratio = (clampedPremium - min) / (max - min);
  const coverage = MIN_COVERAGE + ratio * (MAX_COVERAGE - MIN_COVERAGE);
  return Math.round(coverage / 100) * 100;
}

export function getPremiumForRateClass(basePremium: number, rateClass: string, isTobacco: boolean): number | null {
  const classes = getRateClasses(isTobacco);
  const multiplier = classes[rateClass];
  if (multiplier === null || multiplier === undefined) return null;
  return Math.round(basePremium * multiplier * 100) / 100;
}

export function getCoverageForRateClass(baseCoverage: number, rateClass: string, isTobacco: boolean): number | null {
  const classes = getRateClasses(isTobacco);
  const multiplier = classes[rateClass];
  if (multiplier === null || multiplier === undefined) return null;
  return Math.round(baseCoverage / multiplier / 1000) * 1000;
}

export function getAnnualPremium(monthlyPremium: number): number {
  return Math.round(monthlyPremium * 12 * 100) / 100;
}

// Accidental Death Benefit Rider cost — linear with coverage, same for tobacco/non-tobacco
// $2,000 → $0.45/mo, $35,000 → $7.88/mo
const RIDER_MIN_COST = 0.45;
const RIDER_MAX_COST = 7.88;

export function calculateRiderCost(coverage: number): number {
  const clamped = Math.max(MIN_COVERAGE, Math.min(MAX_COVERAGE, coverage));
  const ratio = (clamped - MIN_COVERAGE) / (MAX_COVERAGE - MIN_COVERAGE);
  return Math.round((RIDER_MIN_COST + ratio * (RIDER_MAX_COST - RIDER_MIN_COST)) * 100) / 100;
}

export { MIN_COVERAGE, MAX_COVERAGE, MIN_PREMIUM_INPUT, MAX_PREMIUM_INPUT };
