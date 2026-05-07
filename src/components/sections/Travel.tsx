import { ArrowUpRight, FileText } from "lucide-react";

type Stamp = {
  city: string;
  country: string;
  month: string;
  rotate: string;
};

const STAMPS: readonly Stamp[] = [
  { city: "Tokyo", country: "Japan", month: "Apr", rotate: "-rotate-3" },
  { city: "Paris", country: "France", month: "Jun", rotate: "rotate-2" },
  { city: "Santorini", country: "Greece", month: "Jul", rotate: "-rotate-2" },
  { city: "Maldives", country: "Indian Ocean", month: "Sep", rotate: "rotate-3" },
  { city: "Iceland", country: "North Atlantic", month: "Oct", rotate: "-rotate-1" },
  { city: "Bali", country: "Indonesia", month: "Dec", rotate: "rotate-1" },
] as const;

const PICKS = [
  { label: "If I had to pick one…", value: "Santorini" },
  { label: "Most likely first", value: "Tokyo" },
  { label: "Dream layover", value: "Singapore" },
] as const;

export default function Travel() {
  return (
    <section id="travel" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="eyebrow">
          <span className="eyebrow__numeral" aria-hidden="true">
            IV
          </span>
          <span className="eyebrow__label">Travel Map</span>
          <span className="eyebrow__meta">Wishlist · 2026 →</span>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-12">
          {/* Stamp stack */}
          <div className="lg:col-span-5">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8">
              {STAMPS.map((stamp, i) => (
                <li
                  key={stamp.city}
                  className={`group relative aspect-[4/3] border border-emerald-950/30 bg-ivory transition hover:border-gold-500 ${stamp.rotate} hover:rotate-0`}
                >
                  <div className="absolute inset-2 border border-dashed border-emerald-950/25" />
                  <div className="relative flex h-full flex-col justify-between p-3 sm:p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="label-caps text-emerald-950/60">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="label-caps text-gold-600">
                        {stamp.month}
                      </span>
                    </div>
                    <div>
                      <div className="font-display text-lg leading-tight text-emerald-950 sm:text-xl md:text-2xl">
                        {stamp.city}
                      </div>
                      <div className="mt-0.5 font-serif text-[10px] italic text-emerald-950/55 sm:text-xs">
                        {stamp.country}
                      </div>
                    </div>
                  </div>
                  {/* Gold seal */}
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-gold-500 bg-gold-300/30 font-display text-sm italic text-gold-600 sm:h-8 sm:w-8"
                  >
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial side */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em] text-emerald-950">
              Six stamps I want{" "}
              <span className="italic text-gold-500">first.</span>
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-emerald-950/80">
              <p>
                Travel is the thread that ties everything else together. The
                content I want to make, the job I want to land, the small
                in-between moments I keep filming — they all bend in the same
                direction. Outward.
              </p>
              <p>
                These six are just the start of the list. Some I'd land in for
                a week, some I'd live in for a month, and some — if the cards
                fall right — I'd see from a cabin window on the way to the
                next port.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-emerald-950/15 pt-6 sm:grid-cols-3">
              {PICKS.map((pick) => (
                <div key={pick.label}>
                  <dt className="label-caps text-emerald-950/55">
                    {pick.label}
                  </dt>
                  <dd className="mt-2 font-serif text-base text-emerald-950 tabular-nums md:text-lg">
                    {pick.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 border-t border-emerald-950/15 pt-6">
              <span className="label-caps text-emerald-950/65">Press kit</span>
              <a
                href="/Audrey-Bio.docx"
                className="group mt-3 flex items-center gap-3 border-b border-emerald-950/15 pb-3 transition hover:border-gold-500"
                download
              >
                <FileText
                  className="h-4 w-4 text-emerald-950/70"
                  aria-hidden="true"
                />
                <span className="font-serif text-sm text-emerald-950">
                  Audrey-Bio.docx
                </span>
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-gold-600">
                  Download
                  <ArrowUpRight className="h-3 w-3 transition group-hover:rotate-12" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
