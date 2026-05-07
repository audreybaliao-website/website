/**
 * Pricing constants for Audrey Baliao's editing services.
 *
 * Audrey is an early-career video editor in the Philippines, so the rates
 * below are deliberately accessible and round. They map onto the same
 * structural model the sister site (Jasmine Villar Portfolio) uses, which
 * makes the manual + intake form + service contract all consistent.
 *
 * To change a rate: edit the numeric value here. Rates.tsx, the generated
 * intake form, the manual PDF, and the discount/retainer tables all read
 * the same constants.
 *
 * NOTE: These are starting points. Audrey can negotiate per-project.
 */

export const PRICING = {
  /** Base "clean cuts" rate per minute of raw footage. */
  baseRatePerMin: 20,
  /** Per-element flat fees added on top of the base rate. */
  introFee: 250,
  outroFee: 250,
  thumbnailFee: 250,
  coverFrameFee: 250,
  youtubeKitFee: 100,
  /** Each additional export aspect (9:16 vertical, 1:1 square, etc.). */
  extraExportFee: 100,
  /** Rush surcharge as a fraction of the running subtotal. */
  rushFeePct: 0.25,
  /** Cliffhanger opener — multiplier × baseRate × rawMinutes. */
  cliffhangerMultiplier: 0.5,
} as const;

/** Complexity tiers for music, video effects, and captions. */
export const COMPLEXITY_LABELS = {
  none: "None",
  light: "Light",
  standard: "Standard",
  detailed: "Detailed",
  heavy: "Heavy",
} as const;

export const COMPLEXITY_MULTIPLIERS = {
  none: 0,
  light: 0.3,
  standard: 0.5,
  detailed: 0.7,
  heavy: 1.0,
} as const;

/** Monthly retainer plans — per-video price stays flat. */
export const RETAINER_PER_VIDEO = 2_500;

export const RETAINER_PLANS = [
  { videos: 4, total: 10_000, half: 5_000 },
  { videos: 5, total: 12_500, half: 6_250 },
  { videos: 6, total: 15_000, half: 7_500 },
  { videos: 7, total: 17_500, half: 8_750 },
] as const;

/** Discount ladder — same structure as the sister site. */
export type Discount = {
  pct: string;
  reason: string;
  isMax?: boolean;
};

export const DISCOUNTS: readonly Discount[] = [
  {
    pct: "5%",
    reason: "Pay the full month upfront instead of the 50/50 split.",
  },
  {
    pct: "10%",
    reason: "Lock in a 3-month commitment.",
  },
  {
    pct: "15%",
    reason: "Lock in a 6-month commitment, or refer a paying creator.",
  },
  {
    pct: "20%",
    reason:
      "Lock in a 12-month commitment, or bundle a multi-creator package. (Cap.)",
    isMax: true,
  },
];

/** Format a number as Philippine pesos. */
export const peso = (n: number): string =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
