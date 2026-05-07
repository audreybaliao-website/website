import { ArrowUpRight, Play } from "lucide-react";

/**
 * STORIES SECTION
 * --------------------------------------------------------------------------
 * Real edits embedded:
 *   - 1 music video edit  (YouTube)
 *   - 1 news / project edit (Facebook)
 *   - 7 vlog edits        (YouTube)
 *
 * YouTube thumbnails resolve automatically from the videoId — no need to
 * download or upload anything to /public/stories.
 *
 * To update a card title or blurb: edit the matching object below.
 * To add a new edit: append to FEATURED or VLOGS. The grid auto-flows.
 * Facebook share/v/ links don't expose a public thumbnail; those cards
 * use a branded gradient placeholder instead.
 * --------------------------------------------------------------------------
 */

type Source = "youtube" | "facebook";
type Category = "music" | "news" | "vlog";

type Edit = {
  id: string;
  source: Source;
  category: Category;
  videoId?: string;
  url: string;
  title: string;
  blurb: string;
};

const ytThumb = (videoId: string): string =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

const FEATURED: readonly Edit[] = [
  {
    id: "music-001",
    source: "youtube",
    category: "music",
    videoId: "5yi2AfC0atc",
    url: "https://youtu.be/5yi2AfC0atc",
    title: "Music video · cut to the rhythm",
    blurb:
      "A full music-video edit — pacing, color, and beat-matched cuts built around the track.",
  },
  {
    id: "news-001",
    source: "facebook",
    category: "news",
    url: "https://www.facebook.com/share/v/1KRi5b2h5p/",
    title: "News edit · project work",
    blurb:
      "A short news-style cut produced as a project piece — tight, on-brief, story-first.",
  },
] as const;

const VLOGS: readonly Edit[] = [
  {
    id: "v01",
    source: "youtube",
    category: "vlog",
    videoId: "HWc3wp7V0pI",
    url: "https://youtu.be/HWc3wp7V0pI",
    title: "Vlog · 01",
    blurb: "Daily-life cut.",
  },
  {
    id: "v02",
    source: "youtube",
    category: "vlog",
    videoId: "q3neWvXH3KA",
    url: "https://youtu.be/q3neWvXH3KA",
    title: "Vlog · 02",
    blurb: "Daily-life cut.",
  },
  {
    id: "v03",
    source: "youtube",
    category: "vlog",
    videoId: "vWZsN-FEa0U",
    url: "https://youtu.be/vWZsN-FEa0U",
    title: "Vlog · 03",
    blurb: "Daily-life cut.",
  },
  {
    id: "v04",
    source: "youtube",
    category: "vlog",
    videoId: "tkazmeKla3c",
    url: "https://youtu.be/tkazmeKla3c",
    title: "Vlog · 04",
    blurb: "Daily-life cut.",
  },
  {
    id: "v05",
    source: "youtube",
    category: "vlog",
    videoId: "wdeqDV_BxYM",
    url: "https://youtu.be/wdeqDV_BxYM",
    title: "Vlog · 05",
    blurb: "Daily-life cut.",
  },
  {
    id: "v06",
    source: "youtube",
    category: "vlog",
    videoId: "Fj7DknyXEKw",
    url: "https://youtu.be/Fj7DknyXEKw",
    title: "Vlog · 06",
    blurb: "Daily-life cut.",
  },
  {
    id: "v07",
    source: "youtube",
    category: "vlog",
    videoId: "RPyFMsgOfBY",
    url: "https://youtu.be/RPyFMsgOfBY",
    title: "Vlog · 07",
    blurb: "Daily-life cut.",
  },
] as const;

const FORMATS: readonly string[] = [
  "Daily-life vlogs",
  "News & project edits",
  "Music video edits",
  "Cinematic short-form",
  "Travel & wishlist edits",
  "Photo-dump carousels",
] as const;

const sourceLabel = (source: Source): string => {
  if (source === "youtube") return "YouTube";
  return "Facebook";
};

const categoryLabel = (category: Category): string => {
  if (category === "music") return "Music video";
  if (category === "news") return "News · project";
  return "Vlog";
};

const formatLabel = (category: Category): string => {
  if (category === "music") return "Music video · 16:9";
  if (category === "news") return "News edit · 16:9";
  return "Vlog · 16:9";
};

type CardProps = {
  edit: Edit;
  variant: "featured" | "compact";
};

function EditCard({ edit, variant }: CardProps) {
  const thumb =
    edit.source === "youtube" && edit.videoId ? ytThumb(edit.videoId) : null;

  const isFeatured = variant === "featured";

  return (
    <a
      href={edit.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block"
    >
      <figure>
        <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-emerald-100 via-ivory to-gold-300/40">
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={edit.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="label-caps text-emerald-950/55">
                {categoryLabel(edit.category)}
              </span>
              <span
                aria-hidden="true"
                className="font-script text-5xl text-emerald-950/30"
              >
                {sourceLabel(edit.source)}
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-emerald-950/10" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`flex items-center justify-center rounded-full bg-ivory/90 text-emerald-950 shadow-sm transition group-hover:scale-110 group-hover:bg-gold-300 ${isFeatured ? "h-14 w-14" : "h-11 w-11"}`}
            >
              <Play
                className={`translate-x-0.5 ${isFeatured ? "h-5 w-5" : "h-4 w-4"}`}
              />
            </span>
          </div>

          {/* Top-left corner badge for category */}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-emerald-950/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-ivory">
              {categoryLabel(edit.category)}
            </span>
          </div>
        </div>

        <figcaption className={isFeatured ? "mt-5" : "mt-4"}>
          <h3
            className={`font-display leading-snug text-emerald-950 ${isFeatured ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}
          >
            {edit.title}
          </h3>
          {isFeatured && (
            <p className="mt-2 text-sm leading-relaxed text-emerald-950/70">
              {edit.blurb}
            </p>
          )}
          <dl
            className={`grid grid-cols-3 gap-x-4 border-t border-emerald-950/15 ${isFeatured ? "mt-5 pt-4" : "mt-3 pt-3"}`}
          >
            <div>
              <dt className="label-caps text-emerald-950/55">Format</dt>
              <dd className="mt-1 text-[11px] text-emerald-950">
                {formatLabel(edit.category)}
              </dd>
            </div>
            <div>
              <dt className="label-caps text-emerald-950/55">Channel</dt>
              <dd className="mt-1 text-[11px] text-emerald-950">
                {sourceLabel(edit.source)}
              </dd>
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
            {FEATURED.length + VLOGS.length} edits · still rolling
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1] tracking-[-0.02em] text-emerald-950 lg:col-span-8">
            Frames worth a second{" "}
            <span className="italic text-gold-500">scroll.</span>
          </h2>
          <p className="text-sm leading-relaxed text-emerald-950/70 lg:col-span-4">
            A rolling reel of music-video, news, and vlog edits — the cuts I'd
            want to find again on a long bus ride.
          </p>
        </div>

        {/* FEATURED EDITS */}
        <div className="mt-16">
          <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
            <span className="font-display text-2xl italic leading-none text-gold-500">
              ✦
            </span>
            <span className="label-caps text-emerald-950/70">
              Featured edits
            </span>
            <span className="ml-auto label-caps text-emerald-950/55">
              {String(FEATURED.length).padStart(2, "0")} pieces
            </span>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
            {FEATURED.map((edit) => (
              <li key={edit.id}>
                <EditCard edit={edit} variant="featured" />
              </li>
            ))}
          </ul>
        </div>

        {/* VLOG GALLERY */}
        <div className="mt-24">
          <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
            <span className="font-display text-2xl italic leading-none text-gold-500">
              ✦
            </span>
            <span className="label-caps text-emerald-950/70">Vlog edits</span>
            <span className="ml-auto label-caps text-emerald-950/55">
              {String(VLOGS.length).padStart(2, "0")} selected
            </span>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {VLOGS.map((edit) => (
              <li key={edit.id}>
                <EditCard edit={edit} variant="compact" />
              </li>
            ))}
          </ul>
        </div>

        {/* FORMATS LIST */}
        <div className="mt-24">
          <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
            <span className="label-caps text-emerald-950/70">I also edit</span>
            <span className="ml-auto label-caps text-emerald-950/55">
              {String(FORMATS.length).padStart(2, "0")} formats
            </span>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
            {FORMATS.map((format, i) => (
              <li
                key={format}
                className="flex items-baseline gap-3 border-b border-emerald-950/10 py-3"
              >
                <span className="font-serif text-xs tabular-nums text-gold-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-base text-emerald-950">
                  {format}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
