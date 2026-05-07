"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Copy, ExternalLink } from "lucide-react";
import {
  CalculatorInputs,
  COMPLEXITY_LABELS,
  ComplexityLevel,
  DEFAULT_INPUTS,
  calculateQuote,
  formatPHP,
} from "@/lib/pricing";

const AUDREY_EMAIL = "audreybaliao022@gmail.com";

const DISCOUNT_TIERS = [0, 5, 10, 15, 20] as const;
type DiscountTier = (typeof DISCOUNT_TIERS)[number];

// Suggested rationale for each tier. Pre-fills the reason textarea when a
// tier is picked, but the client can rewrite it.
const DISCOUNT_PRESETS: Record<Exclude<DiscountTier, 0>, string> = {
  5: "Paying the full month upfront instead of the 50/50 split.",
  10: "Committing to a 3-month contract.",
  15: "Committing to 6 months, or referring another paying creator.",
  20: "Committing to 12 months, or a multi-creator package.",
};
const PRESET_REASONS = new Set(Object.values(DISCOUNT_PRESETS));

const COMPLEXITY_OPTIONS: ComplexityLevel[] = [0.3, 0.5, 0.7, 1];

const PRESETS: { label: string; hint: string; build: () => CalculatorInputs }[] = [
  {
    label: "Quick reel",
    hint: "5 min · social",
    build: () => ({
      ...DEFAULT_INPUTS,
      rawMinutes: 5,
      music: { enabled: true, complexity: 0.5 },
      captions: { enabled: true, complexity: 0.7 },
      cliffhanger: true,
      thumbnail: true,
    }),
  },
  {
    label: "10-min vlog",
    hint: "intro · outro · captions",
    build: () => ({
      ...DEFAULT_INPUTS,
      rawMinutes: 10,
      music: { enabled: true, complexity: 0.5 },
      effects: { enabled: true, complexity: 0.5 },
      captions: { enabled: true, complexity: 0.7 },
      intro: true,
      outro: true,
      thumbnail: true,
      youtubeKit: true,
    }),
  },
  {
    label: "Music video",
    hint: "beat-matched · cinematic",
    build: () => ({
      ...DEFAULT_INPUTS,
      rawMinutes: 15,
      music: { enabled: true, complexity: 1 },
      effects: { enabled: true, complexity: 0.7 },
      captions: { enabled: false, complexity: 0.5 },
      thumbnail: true,
      coverFrame: true,
    }),
  },
  {
    label: "News / project edit",
    hint: "20 min · story-first",
    build: () => ({
      ...DEFAULT_INPUTS,
      rawMinutes: 20,
      music: { enabled: true, complexity: 0.5 },
      effects: { enabled: true, complexity: 0.5 },
      captions: { enabled: true, complexity: 1 },
      intro: true,
      outro: true,
      thumbnail: true,
    }),
  },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-600" : "bg-emerald-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function ComplexityPicker({
  value,
  onChange,
  disabled,
}: {
  value: ComplexityLevel;
  onChange: (v: ComplexityLevel) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`mt-2 inline-flex flex-wrap rounded-full border border-emerald-200 bg-white p-1 text-xs ${
        disabled ? "opacity-40" : ""
      }`}
    >
      {COMPLEXITY_OPTIONS.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt)}
            className={`rounded-full px-3 py-1 transition-colors ${
              active
                ? "bg-emerald-700 text-ivory"
                : "text-emerald-800 hover:bg-emerald-50"
            }`}
          >
            {COMPLEXITY_LABELS[String(opt)]}
          </button>
        );
      })}
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  hint?: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
};

function ToggleRow({ label, hint, enabled, onToggle, children }: ToggleRowProps) {
  return (
    <div className="rounded-2xl border border-emerald-950/15 bg-ivory p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium text-emerald-950">{label}</div>
          {hint && (
            <div className="mt-0.5 text-xs text-emerald-950/65">{hint}</div>
          )}
        </div>
        <Toggle checked={enabled} onChange={onToggle} label={label} />
      </div>
      {enabled && children}
    </div>
  );
}

export default function RateCalculator() {
  const [input, setInput] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [discountTier, setDiscountTier] = useState<DiscountTier>(0);
  const [discountReason, setDiscountReason] = useState("");
  const [copied, setCopied] = useState(false);

  // Pick a tier. If the reason field is empty or still holds another preset,
  // swap in the new preset so the client sees a sensible starting sentence.
  // A custom-typed reason is preserved.
  const pickTier = (tier: DiscountTier) => {
    setDiscountTier(tier);
    if (tier === 0) return;
    if (!discountReason.trim() || PRESET_REASONS.has(discountReason)) {
      setDiscountReason(DISCOUNT_PRESETS[tier]);
    }
  };

  const quote = useMemo(() => calculateQuote(input), [input]);

  const update = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) => setInput((s) => ({ ...s, [key]: value }));

  // Pre-filled email contents derived from the current calculator state.
  // Includes the client's name, email, and project context when provided.
  const trimmedName = clientName.trim();
  const trimmedEmail = clientEmail.trim();
  const trimmedDescription = projectDescription.trim();
  const trimmedDriveLink = driveLink.trim();

  const trimmedDiscountReason = discountReason.trim();
  const briefBody = useMemo(
    () =>
      buildBrief(
        input,
        quote.total,
        trimmedName,
        trimmedEmail,
        trimmedDescription,
        trimmedDriveLink,
        discountTier,
        trimmedDiscountReason,
      ),
    [
      input,
      quote.total,
      trimmedName,
      trimmedEmail,
      trimmedDescription,
      trimmedDriveLink,
      discountTier,
      trimmedDiscountReason,
    ],
  );
  const subject = trimmedName
    ? `Project inquiry from ${trimmedName}`
    : "Project inquiry from your website";
  const mailtoHref = `mailto:${AUDREY_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(briefBody)}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    AUDREY_EMAIL,
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefBody)}`;

  const handleCopy = async () => {
    const text = `To: ${AUDREY_EMAIL}\nSubject: ${subject}\n\n${briefBody}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / non-secure contexts.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Inputs */}
      <div className="space-y-6">
        {/* Tell me about you and your project. All optional, but every
            field the client fills in becomes part of the brief Audrey
            receives. */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Tell me about you and your project
          </legend>
          <p className="text-xs text-emerald-950/65">
            All fields are optional, but the more you share, the faster I can
            prepare for your edit.
          </p>

          <div className="space-y-2 rounded-2xl border border-emerald-950/15 bg-ivory p-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none placeholder:text-emerald-950/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="Your email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none placeholder:text-emerald-950/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="A short description of the video you want me to edit, where you plan to post it, and the feel you'd like."
              rows={4}
              className="w-full resize-y rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-emerald-950 outline-none placeholder:text-emerald-950/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />

            <input
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="Google Drive link to your footage"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-emerald-950 outline-none placeholder:text-emerald-950/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <p className="text-[11px] leading-snug text-emerald-950/65">
              Please share your footage through Google Drive and set the
              link to{" "}
              <span className="font-medium text-emerald-950">
                Anyone with the link can view
              </span>{" "}
              so I can access it without delays.
            </p>
          </div>
        </fieldset>

        {/* Presets */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Start from a preset
          </legend>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setInput(p.build())}
                className="group rounded-2xl border border-emerald-950/15 bg-ivory px-4 py-2 text-left transition-colors hover:border-emerald-700 hover:bg-emerald-50"
              >
                <div className="text-sm font-medium text-emerald-950">
                  {p.label}
                </div>
                <div className="text-[11px] text-emerald-950/65">{p.hint}</div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setInput(DEFAULT_INPUTS)}
              className="rounded-2xl border border-transparent bg-transparent px-3 py-2 text-xs text-emerald-950/65 underline-offset-2 hover:text-emerald-950 hover:underline"
            >
              Reset
            </button>
          </div>
        </fieldset>

        {/* Group: Footage */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Footage
          </legend>
          <label className="block rounded-2xl border border-emerald-950/15 bg-ivory p-4">
            <span className="font-medium text-emerald-950">
              Raw video length (minutes)
            </span>
            <span className="mt-0.5 block text-xs text-emerald-950/65">
              Total minutes of raw footage you&rsquo;re sending over.
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={input.rawMinutes}
              onChange={(e) =>
                update("rawMinutes", Number(e.target.value) || 0)
              }
              className="mt-3 w-32 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>
        </fieldset>

        {/* Group: Edit complexity */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Edit complexity
          </legend>

          <ToggleRow
            label="Music & sound design"
            hint="Background music, sound effects, audio polish."
            enabled={input.music.enabled}
            onToggle={(v) => update("music", { ...input.music, enabled: v })}
          >
            <ComplexityPicker
              value={input.music.complexity}
              onChange={(c) =>
                update("music", { ...input.music, complexity: c })
              }
              disabled={!input.music.enabled}
            />
          </ToggleRow>

          <ToggleRow
            label="Video effects"
            hint="Text animations, transitions, zooms, on-screen graphics."
            enabled={input.effects.enabled}
            onToggle={(v) =>
              update("effects", { ...input.effects, enabled: v })
            }
          >
            <ComplexityPicker
              value={input.effects.complexity}
              onChange={(c) =>
                update("effects", { ...input.effects, complexity: c })
              }
              disabled={!input.effects.enabled}
            />
          </ToggleRow>

          <ToggleRow
            label="Subtitles / captions"
            hint="On-screen text for accessibility and social."
            enabled={input.captions.enabled}
            onToggle={(v) =>
              update("captions", { ...input.captions, enabled: v })
            }
          >
            <ComplexityPicker
              value={input.captions.complexity}
              onChange={(c) =>
                update("captions", { ...input.captions, complexity: c })
              }
              disabled={!input.captions.enabled}
            />
          </ToggleRow>
        </fieldset>

        {/* Group: Hooks & branding. 2-col on small screens and up so the six
            toggles don't stack into a tall column. */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Hooks &amp; branding
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ToggleRow
              label="Cliffhanger opener"
              hint="A high-energy hook at the very start, so people stick around."
              enabled={input.cliffhanger}
              onToggle={(v) => update("cliffhanger", v)}
            />
            <ToggleRow
              label="Custom intro"
              hint="Branded opening segment."
              enabled={input.intro}
              onToggle={(v) => update("intro", v)}
            />
            <ToggleRow
              label="Custom outro"
              hint="Branded closing segment."
              enabled={input.outro}
              onToggle={(v) => update("outro", v)}
            />
            <ToggleRow
              label="Thumbnail"
              hint="Custom thumbnail image (YouTube, FB, etc.)."
              enabled={input.thumbnail}
              onToggle={(v) => update("thumbnail", v)}
            />
            <ToggleRow
              label="Cover frame"
              hint="Designed still frame for platforms without thumbnails."
              enabled={input.coverFrame}
              onToggle={(v) => update("coverFrame", v)}
            />
            <ToggleRow
              label="YouTube kit (₱100 all-in)"
              hint="Timestamps, optimized title, and description, ready to paste into YouTube Studio."
              enabled={input.youtubeKit}
              onToggle={(v) => update("youtubeKit", v)}
            />
          </div>
        </fieldset>

        {/* Group: Delivery */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Delivery
          </legend>

          <label className="block rounded-2xl border border-emerald-950/15 bg-ivory p-4">
            <span className="font-medium text-emerald-950">
              Extra export versions
            </span>
            <span className="mt-0.5 block text-xs text-emerald-950/65">
              Vertical (9:16), square (1:1), cutdowns. Anything beyond the
              main deliverable.
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={input.extraExports}
              onChange={(e) =>
                update("extraExports", Math.max(0, Number(e.target.value) || 0))
              }
              className="mt-3 w-32 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </label>

          <ToggleRow
            label="Rush delivery"
            hint="Adds 25% to your quote and jumps you to the front of the queue."
            enabled={input.rush}
            onToggle={(v) => update("rush", v)}
          />
        </fieldset>

        {/* Group: Add-ons. 2-col on small screens and up. */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Add-ons
          </legend>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block rounded-2xl border border-emerald-950/15 bg-ivory p-4">
              <span className="font-medium text-emerald-950">
                Script / structure pass
              </span>
              <span className="mt-0.5 block text-xs text-emerald-950/65">
                Optional flat fee for storytelling and pacing direction
                beyond basic editing.
              </span>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-emerald-700">₱</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={input.scriptPass}
                  onChange={(e) =>
                    update(
                      "scriptPass",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </label>

            <label className="block rounded-2xl border border-emerald-950/15 bg-ivory p-4">
              <span className="font-medium text-emerald-950">
                Stock assets / licensing
              </span>
              <span className="mt-0.5 block text-xs text-emerald-950/65">
                Pass-through cost for any stock footage or music licenses,
                billed at actual cost.
              </span>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-emerald-700">₱</span>
                <input
                  type="number"
                  min={0}
                  step={25}
                  value={input.stockAssets}
                  onChange={(e) =>
                    update(
                      "stockAssets",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </label>
          </div>
        </fieldset>

        {/* Optional discount request. Clients pick a starting tier and write
            their own reason. The tier presets seed the textarea with a
            suggested sentence the client can rewrite. The selection rides
            along in the brief Audrey receives; the displayed estimate is
            unchanged so her quote stays a firm number. */}
        <fieldset className="space-y-3">
          <legend className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Discount request <span className="text-emerald-950/40">(optional)</span>
          </legend>
          <p className="text-xs text-emerald-950/65">
            Propose a starting tier and tell Audrey why. She&rsquo;ll reply
            with what she can do.
          </p>

          <div className="space-y-3 rounded-2xl border border-emerald-950/15 bg-ivory p-4">
            <div className="flex flex-wrap gap-2">
              {DISCOUNT_TIERS.map((t) => {
                const active = discountTier === t;
                const isMax = t === 20;
                const label = t === 0 ? "None" : isMax ? "20% (max)" : `${t}%`;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => pickTier(t)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? isMax
                          ? "bg-gold-300 text-emerald-950"
                          : "bg-emerald-700 text-ivory"
                        : "border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {discountTier > 0 && (
              <label className="block">
                <span className="text-xs font-medium text-emerald-950/80">
                  Why I&rsquo;m proposing {discountTier}%
                </span>
                <textarea
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  placeholder={DISCOUNT_PRESETS[discountTier as Exclude<DiscountTier, 0>]}
                  rows={3}
                  className="mt-1 w-full resize-y rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-emerald-950 outline-none placeholder:text-emerald-950/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
                <span className="mt-1 block text-[11px] leading-snug text-emerald-950/65">
                  The four standard reasons live in the{" "}
                  <a
                    href="#rates"
                    className="font-medium text-emerald-800 underline-offset-2 hover:underline"
                  >
                    Discounts
                  </a>{" "}
                  card below. Feel free to write your own instead.
                </span>
              </label>
            )}
          </div>
        </fieldset>
      </div>

      {/* Estimate */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-emerald-950/20 bg-ivory p-6 shadow-sm backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Your estimate
          </div>
          <div className="mt-2 font-display text-5xl text-emerald-950">
            {formatPHP(quote.total)}
          </div>
          <div className="mt-1 text-xs text-emerald-950/65">
            An estimate. Final quote confirmed once Audrey reviews your
            footage.
          </div>
          <a
            href="#rates"
            className="mt-2 block text-xs font-medium text-emerald-700 underline-offset-2 hover:text-emerald-950 hover:underline"
          >
            Discounts available. See project plans below.
          </a>

          {(quote.lineItems.length > 0 ||
            input.rush ||
            input.scriptPass > 0 ||
            input.stockAssets > 0) && (
            <>
              <div className="mt-6 border-t border-emerald-200 pt-4 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                What&rsquo;s included
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {quote.lineItems.map((li, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-emerald-950"
                  >
                    <Check className="h-4 w-4 shrink-0 text-gold-600" />
                    {li.label}
                  </li>
                ))}
                {input.rush && (
                  <li className="flex items-center gap-2 text-emerald-950">
                    <Check className="h-4 w-4 shrink-0 text-gold-600" />
                    Rush delivery
                  </li>
                )}
                {input.scriptPass > 0 && (
                  <li className="flex items-center gap-2 text-emerald-950">
                    <Check className="h-4 w-4 shrink-0 text-gold-600" />
                    Script / structure pass
                  </li>
                )}
                {input.stockAssets > 0 && (
                  <li className="flex items-center gap-2 text-emerald-950">
                    <Check className="h-4 w-4 shrink-0 text-gold-600" />
                    Stock / licensing
                  </li>
                )}
              </ul>
            </>
          )}

          {/* Timeline switches when rush is enabled. */}
          <div className="mt-6 flex items-baseline justify-between border-t border-emerald-200 pt-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Timeline
            </span>
            {input.rush && (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-600">
                Rush
              </span>
            )}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {(input.rush
              ? [
                  { range: "Days 1–3", label: "Initial output" },
                  { range: "Day 4", label: "Revision" },
                  { range: "Day 5", label: "Final output" },
                ]
              : [
                  { range: "Days 1–4", label: "Edit" },
                  { range: "Days 5–6", label: "Revise" },
                  { range: "Day 7", label: "Final output" },
                ]
            ).map((s, i, arr) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-0.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      i === arr.length - 1
                        ? "bg-gold-500 ring-2 ring-gold-300"
                        : "bg-emerald-500"
                    }`}
                  />
                  {i < arr.length - 1 && (
                    <span className="mt-1 h-4 w-px bg-emerald-300" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                    {s.range}
                  </div>
                  <div className="text-emerald-950">{s.label}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* Send block: a primary mailto with the whole brief prefilled,
              plus secondary Gmail / Copy fallbacks for clients whose default
              mail handler isn't set up. */}
          <a
            href={mailtoHref}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-4 py-3 text-center text-sm font-medium text-ivory shadow-sm transition-colors hover:bg-emerald-800"
          >
            Send this brief to Audrey
            <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={gmailHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 px-3 py-2 text-xs text-emerald-800 transition-colors hover:bg-emerald-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Gmail
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 px-3 py-2 text-xs text-emerald-800 transition-colors hover:bg-emerald-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy brief
                </>
              )}
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-emerald-950/65">
            The first button opens your email app already filled in. If
            nothing happens, tap{" "}
            <span className="text-emerald-800">Open in Gmail</span> or{" "}
            <span className="text-emerald-800">Copy brief</span> instead.
            Either way, Audrey will get your details.
          </p>
        </div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Brief builder. Turns the calculator state into a plain-text email body so
// the client can send everything in one go.
// ---------------------------------------------------------------------------

function buildBrief(
  input: CalculatorInputs,
  total: number,
  clientName: string,
  clientEmail: string,
  projectDescription: string,
  driveLink: string,
  discountTier: DiscountTier,
  discountReason: string,
): string {
  const yn = (b: boolean) => (b ? "Yes" : "No");
  const adjust = (a: { enabled: boolean; complexity: ComplexityLevel }) =>
    a.enabled ? `Yes (${COMPLEXITY_LABELS[String(a.complexity)]})` : "No";

  // Pull the first name out of whatever the client typed.
  const firstName = clientName.split(/\s+/)[0];
  const greeting = firstName
    ? `Hi Audrey, I'm ${firstName}.`
    : "Hi Audrey,";

  const description = projectDescription
    ? projectDescription
    : "(please add a short description of the video you want me to edit, where you plan to post it, and the feel you'd like)";

  const driveLine = driveLink
    ? `Footage on Google Drive: ${driveLink}\n(I have set the link to "Anyone with the link can view" so you can open it without delays.)`
    : '(please share your footage through Google Drive and set the link to "Anyone with the link can view")';

  const lines: string[] = [
    greeting,
    "",
    "I'd love to book a project with you. Here are the choices I made on your site:",
    "",
    `• Raw footage length: ${input.rawMinutes} minutes`,
    `• Music & sound design: ${adjust(input.music)}`,
    `• Video effects: ${adjust(input.effects)}`,
    `• Subtitles / captions: ${adjust(input.captions)}`,
    `• Cliffhanger opener: ${yn(input.cliffhanger)}`,
    `• Custom intro: ${yn(input.intro)}`,
    `• Custom outro: ${yn(input.outro)}`,
    `• Thumbnail: ${yn(input.thumbnail)}`,
    `• Cover frame: ${yn(input.coverFrame)}`,
    `• YouTube kit (timestamps, title, description): ${yn(input.youtubeKit)}`,
    `• Extra export versions: ${input.extraExports}`,
    `• Delivery: ${input.rush ? "Rush (5-day, +25%)" : "Standard (7-day)"}`,
  ];

  if (input.scriptPass > 0) {
    lines.push(`• Script / structure pass: ${formatPHP(input.scriptPass)}`);
  }
  if (input.stockAssets > 0) {
    lines.push(`• Stock / licensing budget: ${formatPHP(input.stockAssets)}`);
  }

  lines.push(
    "",
    `Estimated total: ${formatPHP(total)}`,
  );

  // Discount request: only included when the client picked a tier. The
  // total above stays as the firm estimate.
  if (discountTier > 0) {
    lines.push(
      "",
      `Discount requested: ${discountTier}%${discountTier === 20 ? " (cap)" : ""}`,
    );
    if (discountReason) {
      lines.push(`Reason: ${discountReason}`);
    }
  }

  lines.push(
    "",
    "A little about the project:",
    description,
    "",
    driveLine,
    "",
    "Thank you, and I look forward to your reply.",
  );

  // Sign-off: only when the client supplied their name and/or email.
  if (clientName || clientEmail) {
    lines.push("");
    if (clientName) lines.push(clientName);
    if (clientEmail) lines.push(clientEmail);
  }

  return lines.join("\n");
}
