import {
  ArrowUpRight,
  CalendarRange,
  Check,
  FileText,
  Music,
  Tag,
  Video,
  X,
} from "lucide-react";
import {
  DISCOUNTS,
  PRICING,
  RETAINER_PLANS,
  RETAINER_PER_VIDEO,
  peso,
} from "@/lib/pricing";

/**
 * RATES SECTION (V)
 * --------------------------------------------------------------------------
 * Static rate sheet — no calculator. Three blocks:
 *   1. Per-project pricing card  (base rate + add-ons + complexity tiers)
 *   2. Retainer plans table       (monthly bundles with 50/50 schedule)
 *   3. Discounts ladder           (5/10/15/20% with reasons)
 *
 * Plus contract + intake form download links at the bottom.
 *
 * To change a number: edit src/lib/pricing.ts. Every consumer (this section,
 * the intake form, the manual PDF) reads from there.
 * --------------------------------------------------------------------------
 */

type ServiceTier = {
  name: string;
  blurb: string;
  starting: number;
  bullets: readonly string[];
  icon: React.ReactNode;
};

const TIERS: readonly ServiceTier[] = [
  {
    name: "Vlog edit",
    blurb:
      "Daily-life vlogs and short-form social cuts. Up to 30 min of raw footage.",
    starting: 1_200,
    bullets: [
      "Music · Light",
      "Captions · Standard",
      "Cliffhanger opener",
      "One revision round",
    ],
    icon: <Video className="h-5 w-5" aria-hidden="true" />,
  },
  {
    name: "Music video edit",
    blurb:
      "Beat-matched cuts, color grading, and rhythm built around the track.",
    starting: 2_500,
    bullets: [
      "Music · Heavy (synced)",
      "Effects · Detailed",
      "Color grade pass",
      "One revision round",
    ],
    icon: <Music className="h-5 w-5" aria-hidden="true" />,
  },
  {
    name: "News / project edit",
    blurb:
      "Tight, on-brief story-first cuts produced as project pieces or briefs.",
    starting: 1_800,
    bullets: [
      "Captions · Standard",
      "Branded intro / outro",
      "Thumbnail",
      "One revision round",
    ],
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
  },
] as const;

export default function Rates() {
  return (
    <section id="rates" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="eyebrow">
          <span className="eyebrow__numeral" aria-hidden="true">
            V
          </span>
          <span className="eyebrow__label">Rate sheet</span>
          <span className="eyebrow__meta">PHP · negotiable per project</span>
        </div>

        <div className="mt-10 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1] tracking-[-0.02em] text-emerald-950 lg:col-span-8">
            Plain-paper{" "}
            <span className="italic text-gold-500">pricing.</span>
          </h2>
          <p className="text-sm leading-relaxed text-emerald-950/70 lg:col-span-4">
            Starting points for the three things I edit most. Final quote always
            confirmed in writing once I&rsquo;ve seen the footage and brief.
          </p>
        </div>

        {/* PER-PROJECT TIERS */}
        <ul className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
            <li
              key={tier.name}
              className="flex h-full flex-col border border-emerald-950/15 bg-ivory p-6 md:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="text-emerald-950">{tier.icon}</span>
                <span className="label-caps text-emerald-950/55">
                  {tier.name}
                </span>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline gap-2">
                  <span className="label-caps text-emerald-950/55">From</span>
                  <span className="font-display text-3xl text-emerald-950 tabular-nums md:text-4xl">
                    {peso(tier.starting)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-emerald-950/75">
                  {tier.blurb}
                </p>
              </div>

              <ul className="mt-6 space-y-2 border-t border-emerald-950/15 pt-5">
                {tier.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-emerald-950/85"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                      aria-hidden="true"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* PER-MINUTE BREAKDOWN */}
        <div className="mt-20 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
              <span className="font-display text-2xl italic leading-none text-gold-500">
                ✦
              </span>
              <span className="label-caps text-emerald-950/70">
                Per-minute build
              </span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-emerald-950/75">
              For projects that don&rsquo;t fit a tier, I quote per-minute of
              raw footage with element-by-element complexity tiers — same model
              the intake form uses.
            </p>
            <dl className="mt-6 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-8">
              <div className="flex items-baseline justify-between border-b border-emerald-950/10 py-2">
                <dt className="label-caps text-emerald-950/65">Clean cuts</dt>
                <dd className="font-serif text-sm tabular-nums text-emerald-950">
                  {peso(PRICING.baseRatePerMin)}/min
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-emerald-950/10 py-2">
                <dt className="label-caps text-emerald-950/65">Intro / outro</dt>
                <dd className="font-serif text-sm tabular-nums text-emerald-950">
                  {peso(PRICING.introFee)} ea
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-emerald-950/10 py-2">
                <dt className="label-caps text-emerald-950/65">Thumbnail</dt>
                <dd className="font-serif text-sm tabular-nums text-emerald-950">
                  {peso(PRICING.thumbnailFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-emerald-950/10 py-2">
                <dt className="label-caps text-emerald-950/65">Cover frame</dt>
                <dd className="font-serif text-sm tabular-nums text-emerald-950">
                  {peso(PRICING.coverFrameFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-emerald-950/10 py-2">
                <dt className="label-caps text-emerald-950/65">YouTube kit</dt>
                <dd className="font-serif text-sm tabular-nums text-emerald-950">
                  {peso(PRICING.youtubeKitFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-emerald-950/10 py-2">
                <dt className="label-caps text-emerald-950/65">Extra export</dt>
                <dd className="font-serif text-sm tabular-nums text-emerald-950">
                  {peso(PRICING.extraExportFee)} ea
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-emerald-950/10 py-2 sm:col-span-2">
                <dt className="label-caps text-emerald-950/65">
                  Rush (5-day)
                </dt>
                <dd className="font-serif text-sm tabular-nums text-emerald-950">
                  +{Math.round(PRICING.rushFeePct * 100)}% on subtotal
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-emerald-950/65">
              Music, video effects, and captions each scale with complexity:
              Light · Standard · Detailed · Heavy.
            </p>
          </div>

          {/* RETAINER */}
          <div className="lg:col-span-7">
            <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
              <CalendarRange
                className="h-4 w-4 text-gold-600"
                aria-hidden="true"
              />
              <span className="label-caps text-emerald-950/70">
                Monthly retainer
              </span>
              <span className="ml-auto label-caps text-emerald-950/55">
                Project plans
              </span>
            </div>
            <h3 className="mt-6 font-display text-2xl text-emerald-950 md:text-3xl">
              Steady, with a 50/50 split.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-950/75">
              Prefer a recurring arrangement? The standard frame:
            </p>
            <ul className="mt-5 space-y-2 text-sm text-emerald-950/85">
              <li className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-semibold">{peso(RETAINER_PER_VIDEO)}</span>{" "}
                  per video
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                  aria-hidden="true"
                />
                <span>4–7 videos per month</span>
              </li>
              <li className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                  aria-hidden="true"
                />
                <span>Up to 45 minutes of raw footage per video</span>
              </li>
            </ul>

            <div className="mt-6 border border-emerald-950/15 bg-emerald-50/40 p-4">
              <div className="label-caps text-emerald-950/70">
                Each video includes
              </div>
              <ul className="mt-3 grid grid-cols-1 gap-1 text-xs text-emerald-950/85 sm:grid-cols-2">
                <li className="flex items-start gap-1.5">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <span>
                    Music, effects, captions ·{" "}
                    <span className="italic">Light</span>
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <span>Cliffhanger opener</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <span>Custom intro &amp; outro</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <span>Thumbnail</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <span>One revision round</span>
                </li>
                <li className="flex items-start gap-1.5 text-emerald-950/55">
                  <X
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-950/35"
                    aria-hidden="true"
                  />
                  <span>Cover frame · not included</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 overflow-hidden border border-emerald-950/20">
              <table className="w-full text-left text-xs tabular-nums">
                <thead className="bg-emerald-950 text-ivory">
                  <tr>
                    <th className="px-3 py-2 font-semibold uppercase tracking-[0.2em]">
                      Videos
                    </th>
                    <th className="px-3 py-2 font-semibold uppercase tracking-[0.2em]">
                      Monthly
                    </th>
                    <th className="px-3 py-2 font-semibold uppercase tracking-[0.2em]">
                      Down (50%)
                    </th>
                    <th className="px-3 py-2 font-semibold uppercase tracking-[0.2em]">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/15 bg-ivory text-emerald-950">
                  {RETAINER_PLANS.map((plan) => (
                    <tr key={plan.videos}>
                      <td className="px-3 py-2 font-medium">{plan.videos}</td>
                      <td className="px-3 py-2">{peso(plan.total)}</td>
                      <td className="px-3 py-2">{peso(plan.half)}</td>
                      <td className="px-3 py-2">{peso(plan.half)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-emerald-950/70">
              <span className="font-semibold text-emerald-950">
                Always 50% prepayment.
              </span>{" "}
              The remaining 50% is due before the midpoint video begins (e.g.
              for 4 videos: {peso(RETAINER_PLANS[0].half)} upfront, then{" "}
              {peso(RETAINER_PLANS[0].half)} before video 3). Prepayment locks
              your slot.
            </p>
          </div>
        </div>

        {/* DISCOUNTS */}
        <div className="mt-20">
          <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
            <Tag className="h-4 w-4 text-gold-600" aria-hidden="true" />
            <span className="label-caps text-emerald-950/70">Discounts</span>
            <span className="ml-auto label-caps text-emerald-950/55">
              {String(DISCOUNTS.length).padStart(2, "0")} tiers · let&rsquo;s
              talk
            </span>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DISCOUNTS.map((d) => (
              <li
                key={d.pct}
                className={`flex flex-col gap-3 border p-5 ${
                  d.isMax
                    ? "border-gold-500/60 bg-gold-300/15"
                    : "border-emerald-950/15 bg-ivory"
                }`}
              >
                <span
                  className={`font-display text-3xl italic leading-none ${
                    d.isMax ? "text-gold-600" : "text-emerald-950"
                  }`}
                >
                  {d.pct}
                </span>
                <span className="text-sm leading-snug text-emerald-950/85">
                  {d.reason}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-emerald-950/70">
            These four are starting points — counter-offers are welcome. Send
            your brief from the intake form below and we&rsquo;ll work out the
            right tier together.
          </p>
        </div>

        {/* DOCUMENTS */}
        <div className="mt-20">
          <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
            <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
            <span className="label-caps text-emerald-950/70">Documents</span>
            <span className="ml-auto label-caps text-emerald-950/55">
              On letterhead
            </span>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <li>
              <a
                href="/audrey-baliao-intake-form.docx"
                download
                className="group flex h-full flex-col gap-3 border border-emerald-950/15 bg-ivory p-6 transition hover:border-emerald-950"
              >
                <div className="flex items-center justify-between">
                  <span className="label-caps text-emerald-950/65">
                    Project intake form
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-emerald-950/70 transition group-hover:rotate-12 group-hover:text-gold-500"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-display text-xl text-emerald-950 md:text-2xl">
                  Tell me about the project
                </h3>
                <p className="text-sm leading-relaxed text-emerald-950/75">
                  Fill in what you know — the rest we cover on a discovery
                  call. This is the brief I quote against.
                </p>
                <span className="mt-auto inline-flex items-center gap-2 border-t border-emerald-950/15 pt-3 font-serif text-xs text-emerald-950/70">
                  <FileText
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  audrey-baliao-intake-form.docx
                </span>
              </a>
            </li>
            <li>
              <a
                href="/audrey-baliao-service-contract.docx"
                download
                className="group flex h-full flex-col gap-3 border border-emerald-950/15 bg-ivory p-6 transition hover:border-emerald-950"
              >
                <div className="flex items-center justify-between">
                  <span className="label-caps text-emerald-950/65">
                    Service contract
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-emerald-950/70 transition group-hover:rotate-12 group-hover:text-gold-500"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-display text-xl text-emerald-950 md:text-2xl">
                  Once we&rsquo;re a go
                </h3>
                <p className="text-sm leading-relaxed text-emerald-950/75">
                  Editor / client, scope, timeline, fees, revisions, and
                  ownership — everything in one signable Word doc.
                </p>
                <span className="mt-auto inline-flex items-center gap-2 border-t border-emerald-950/15 pt-3 font-serif text-xs text-emerald-950/70">
                  <FileText
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  audrey-baliao-service-contract.docx
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
