import { ArrowUpRight } from "lucide-react";

const META = [
  { label: "Role", value: "Video editor · working student" },
  { label: "Based", value: "Philippines" },
  { label: "Edits", value: "Vlogs · music · news" },
] as const;

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="eyebrow">
          <span className="eyebrow__numeral" aria-hidden="true">
            I
          </span>
          <span className="eyebrow__label">Hello</span>
          <span className="eyebrow__meta inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="relative flex h-1.5 w-1.5"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Currently creating
          </span>
        </div>

        <h1 className="mt-10 font-display text-[clamp(3.25rem,9vw,7.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-emerald-950">
          Raw footage,
          <br />
          cut into{" "}
          <span className="italic text-gold-500">stories.</span>
        </h1>

        <p className="mt-10 max-w-2xl text-base leading-relaxed text-emerald-950/75 md:text-lg">
          Video editor. Working student. Travel-dreamer. I take the raw
          clips clients send over and shape them into something worth a
          second scroll.
        </p>

        {/* 12-col grid: portrait left (5), prose + meta right (7). */}
        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
          <figure className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-emerald-100 via-ivory to-gold-300/40">
              {/* Placeholder portrait. Drop a real photo at
                  /public/audrey-portrait.png and uncomment the <img>. */}
              {/* <img
                src="/audrey-portrait.png"
                alt="Audrey Baliao"
                className="absolute inset-0 h-full w-full object-cover"
              /> */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="font-script text-7xl text-emerald-950/35 lg:text-8xl"
                >
                  Dhey
                </span>
              </div>
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-emerald-950/10" />
            </div>
            <figcaption className="mt-3 flex items-baseline gap-3 border-t border-gold-500/40 pt-3">
              <span className="label-caps text-emerald-950/70">Frame 001</span>
              <span className="ml-auto font-serif text-xs italic text-emerald-950/60">
                Audrey · 2026
              </span>
            </figcaption>
          </figure>

          <div className="lg:col-span-7">
            <dl className="grid grid-cols-1 gap-y-3 border-b border-emerald-950/15 pb-6 sm:grid-cols-3 sm:gap-x-8">
              {META.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <dt className="label-caps text-emerald-950/55">
                    {item.label}
                  </dt>
                  <dd className="font-serif text-sm text-emerald-950">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-emerald-950/80">
              <p>
                I&rsquo;m Audrey, and friends call me Dhey. I&rsquo;m a working
                student in the Philippines, juggling shifts and study and the
                small magical bits in between. By trade, I&rsquo;m a video
                editor.
              </p>
              <p>
                Editing is my favorite way to make a moment land. Hand me the
                raw clips and I&rsquo;ll cut them into something worth
                scrolling through: daily-life vlogs, music videos, news
                pieces, travel wishlist edits, the occasional GRWM. Whatever
                can be paced to rhythm.
              </p>
              <p>
                The bigger dream is to travel everywhere, then keep editing
                from wherever I land. Wings or waves: flight attendant cabin
                crew, or months at sea on a cruise ship. Either way, passport
                stamps and stories.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#stories"
            className="group inline-flex items-center gap-2 border-b border-emerald-950 pb-1 font-serif text-base text-emerald-950 transition hover:gap-3 hover:text-gold-600 hover:border-gold-500"
          >
            See my edits
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-12" />
          </a>
          <a
            href="#connect"
            className="label-caps text-emerald-950/70 transition hover:text-emerald-950"
          >
            Or just say hi →
          </a>
        </div>
      </div>
    </section>
  );
}
