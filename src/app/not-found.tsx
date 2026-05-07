import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-6 py-32 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow">
          <span className="eyebrow__numeral" aria-hidden="true">
            ✦
          </span>
          <span className="eyebrow__label">404 · Lost en route</span>
          <span className="eyebrow__meta">Detour ahead</span>
        </div>

        <h1 className="mt-10 font-display text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.98] tracking-[-0.02em] text-emerald-950">
          This page isn't part of the{" "}
          <span className="italic text-gold-500">journey</span> yet.
        </h1>

        <p className="mt-8 max-w-xl text-base leading-relaxed text-emerald-950/75">
          Maybe a future stamp, maybe a typo. Either way, let&rsquo;s get you back
          on the map.
        </p>

        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-2 border-b border-emerald-950 pb-1 font-serif text-base text-emerald-950 transition hover:gap-3 hover:text-gold-600 hover:border-gold-500"
        >
          ← Back to the start
        </Link>
      </div>
    </section>
  );
}
