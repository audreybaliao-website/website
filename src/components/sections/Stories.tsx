import { ArrowUpRight, Play } from "lucide-react";

/**
 * STORIES SECTION (II)
 * --------------------------------------------------------------------------
 * A vlog-edit gallery. YouTube thumbnails resolve automatically from the
 * videoId, no need to upload anything to /public/stories.
 *
 * To update a card: edit the matching object below.
 * To add a new vlog: append to VLOGS. The grid auto-flows.
 * --------------------------------------------------------------------------
 */

type Vlog = {
  id: string;
  videoId: string;
  url: string;
  title: string;
  blurb: string;
};

const ytThumb = (videoId: string): string =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

const VLOGS: readonly Vlog[] = [
  {
    id: "v01",
    videoId: "HWc3wp7V0pI",
    url: "https://youtu.be/HWc3wp7V0pI",
    title: "Vlog · 01",
    blurb: "Daily-life cut.",
  },
  {
    id: "v02",
    videoId: "q3neWvXH3KA",
    url: "https://youtu.be/q3neWvXH3KA",
    title: "Vlog · 02",
    blurb: "Daily-life cut.",
  },
  {
    id: "v03",
    videoId: "vWZsN-FEa0U",
    url: "https://youtu.be/vWZsN-FEa0U",
    title: "Vlog · 03",
    blurb: "Daily-life cut.",
  },
  {
    id: "v04",
    videoId: "tkazmeKla3c",
    url: "https://youtu.be/tkazmeKla3c",
    title: "Vlog · 04",
    blurb: "Daily-life cut.",
  },
  {
    id: "v05",
    videoId: "wdeqDV_BxYM",
    url: "https://youtu.be/wdeqDV_BxYM",
    title: "Vlog · 05",
    blurb: "Daily-life cut.",
  },
  {
    id: "v06",
    videoId: "Fj7DknyXEKw",
    url: "https://youtu.be/Fj7DknyXEKw",
    title: "Vlog · 06",
    blurb: "Daily-life cut.",
  },
  {
    id: "v07",
    videoId: "RPyFMsgOfBY",
    url: "https://youtu.be/RPyFMsgOfBY",
    title: "Vlog · 07",
    blurb: "Daily-life cut.",
  },
] as const;

function VlogCard({ vlog }: { vlog: Vlog }) {
  return (
    <a
      href={vlog.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block"
    >
      <figure>
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-emerald-100 via-ivory to-gold-300/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ytThumb(vlog.videoId)}
            alt={vlog.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-emerald-950/10" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-emerald-950 shadow-sm transition group-hover:scale-110 group-hover:bg-gold-300">
              <Play className="h-4 w-4 translate-x-0.5" />
            </span>
          </div>

          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-emerald-950/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-ivory">
              Vlog
            </span>
          </div>
        </div>

        <figcaption className="mt-4">
          <h3 className="font-display text-base leading-snug text-emerald-950 md:text-lg">
            {vlog.title}
          </h3>
          <dl className="mt-3 grid grid-cols-3 gap-x-4 border-t border-emerald-950/15 pt-3">
            <div>
              <dt className="label-caps text-emerald-950/55">Format</dt>
              <dd className="mt-1 text-[11px] text-emerald-950">
                Vlog · 16:9
              </dd>
            </div>
            <div>
              <dt className="label-caps text-emerald-950/55">Channel</dt>
              <dd className="mt-1 text-[11px] text-emerald-950">YouTube</dd>
            </div>
            <div className="text-right">
              <dt className="label-caps text-emerald-950/55">Watch</dt>
              <dd className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-gold-600">
                Open
                <ArrowUpRight className="h-3 w-3" />
              </dd>
            </div>
          </dl>
        </figcaption>
      </figure>
    </a>
  );
}

export default function Stories() {
  return (
    <section id="stories" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="eyebrow">
          <span className="eyebrow__numeral" aria-hidden="true">
            II
          </span>
          <span className="eyebrow__label">Stories</span>
          <span className="eyebrow__meta">
            {VLOGS.length} vlog edits · still rolling
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1] tracking-[-0.02em] text-emerald-950 lg:col-span-8">
            Frames worth a second{" "}
            <span className="italic text-gold-500">scroll.</span>
          </h2>
          <p className="text-sm leading-relaxed text-emerald-950/70 lg:col-span-4">
            A rolling reel of vlog edits. The cuts I&rsquo;d want to find
            again on a long bus ride.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {VLOGS.map((vlog) => (
            <li key={vlog.id}>
              <VlogCard vlog={vlog} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
