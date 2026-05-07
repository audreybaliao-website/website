/**
 * Pricing constants and calculator engine for Audrey Baliao's editing
 * services.
 *
 * Audrey is an early-career video editor in the Philippines, so the rates
 * below are deliberately accessible and round. Same structural model the
 * reference build uses, which keeps the manual + intake form + service
 * contract all consistent.
 *
 * Single source of truth: the rate sheet section, the calculator, the
 * intake form, the service contract, and the manual all read these
 * constants.
 *
 * NOTE: starting points; Audrey can negotiate per-project.
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
  /** Cliffhanger opener: cliffhangerPct × baseRate × rawMinutes. */
  cliffhangerPct: 0.5,
} as const;

/** Complexity tiers for music, video effects, and captions. */
export type ComplexityLevel = 0.3 | 0.5 | 0.7 | 1;

export const COMPLEXITY_LABELS: Record<string, string> = {
  "0.3": "Light",
  "0.5": "Standard",
  "0.7": "Detailed",
  "1": "Heavy",
};

export type CalculatorInputs = {
  rawMinutes: number;
  music: { enabled: boolean; complexity: ComplexityLevel };
  effects: { enabled: boolean; complexity: ComplexityLevel };
  captions: { enabled: boolean; complexity: ComplexityLevel };
  cliffhanger: boolean;
  intro: boolean;
  outro: boolean;
  thumbnail: boolean;
  coverFrame: boolean;
  youtubeKit: boolean;
  extraExports: number;
  rush: boolean;
  scriptPass: number;
  stockAssets: number;
};

export const DEFAULT_INPUTS: CalculatorInputs = {
  rawMinutes: 10,
  music: { enabled: false, complexity: 0.5 },
  effects: { enabled: false, complexity: 0.5 },
  captions: { enabled: false, complexity: 0.5 },
  cliffhanger: false,
  intro: false,
  outro: false,
  thumbnail: false,
  coverFrame: false,
  youtubeKit: false,
  extraExports: 0,
  rush: false,
  scriptPass: 0,
  stockAssets: 0,
};

export type LineItem = { label: string; amount: number; note?: string };

export type Quote = {
  lineItems: LineItem[];
  subtotal: number;
  rush: number;
  scriptPass: number;
  stockAssets: number;
  total: number;
};

export function calculateQuote(input: CalculatorInputs): Quote {
  const r = PRICING;
  const minutes = Math.max(0, input.rawMinutes || 0);

  const lineItems: LineItem[] = [];

  const cleanCuts = minutes * r.baseRatePerMin;
  lineItems.push({
    label: "Clean cuts",
    amount: cleanCuts,
    note: `${minutes} min × ₱${r.baseRatePerMin}/min`,
  });

  if (input.music.enabled) {
    const amt = minutes * input.music.complexity * r.baseRatePerMin;
    lineItems.push({
      label: "Music & sound design",
      amount: amt,
      note: `${minutes} min × ${input.music.complexity} × ₱${r.baseRatePerMin}/min`,
    });
  }
  if (input.effects.enabled) {
    const amt = minutes * input.effects.complexity * r.baseRatePerMin;
    lineItems.push({
      label: "Video effects",
      amount: amt,
      note: `${minutes} min × ${input.effects.complexity} × ₱${r.baseRatePerMin}/min`,
    });
  }
  if (input.captions.enabled) {
    const amt = minutes * input.captions.complexity * r.baseRatePerMin;
    lineItems.push({
      label: "Subtitles / captions",
      amount: amt,
      note: `${minutes} min × ${input.captions.complexity} × ₱${r.baseRatePerMin}/min`,
    });
  }
  if (input.cliffhanger) {
    const amt = minutes * r.cliffhangerPct * r.baseRatePerMin;
    lineItems.push({
      label: "Cliffhanger opener",
      amount: amt,
      note: `${minutes} min × ${r.cliffhangerPct} × ₱${r.baseRatePerMin}/min`,
    });
  }
  if (input.intro) lineItems.push({ label: "Custom intro", amount: r.introFee });
  if (input.outro) lineItems.push({ label: "Custom outro", amount: r.outroFee });
  if (input.thumbnail) lineItems.push({ label: "Thumbnail", amount: r.thumbnailFee });
  if (input.coverFrame) lineItems.push({ label: "Cover frame", amount: r.coverFrameFee });
  if (input.youtubeKit)
    lineItems.push({
      label: "YouTube kit (timestamps, title, description)",
      amount: r.youtubeKitFee,
    });

  const exports = Math.max(0, Math.floor(input.extraExports || 0));
  if (exports > 0) {
    lineItems.push({
      label: "Extra export versions",
      amount: exports * r.extraExportFee,
      note: `${exports} × ₱${r.extraExportFee}`,
    });
  }

  const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
  const rush = input.rush ? subtotal * r.rushFeePct : 0;
  const scriptPass = Math.max(0, input.scriptPass || 0);
  const stockAssets = Math.max(0, input.stockAssets || 0);
  const total = subtotal + rush + scriptPass + stockAssets;

  return { lineItems, subtotal, rush, scriptPass, stockAssets, total };
}

/** Format a number as Philippine pesos (rounded). */
export function formatPHP(n: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/** Backwards-compatible alias used by older code. */
export const peso = formatPHP;

/** Monthly retainer plans: per-video price stays flat. */
export const RETAINER_PER_VIDEO = 2_500;

export const RETAINER_PLANS = [
  { videos: 4, total: 10_000, half: 5_000 },
  { videos: 5, total: 12_500, half: 6_250 },
  { videos: 6, total: 15_000, half: 7_500 },
  { videos: 7, total: 17_500, half: 8_750 },
] as const;

/** Discount ladder. */
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
