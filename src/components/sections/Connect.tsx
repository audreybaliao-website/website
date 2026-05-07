import { ArrowUpRight, Facebook, Instagram, Mail } from "lucide-react";

type Social = {
  platform: string;
  handle: string;
  url: string;
  icon: React.ReactNode;
};

// Inline TikTok glyph. Lucide doesn't ship one, so we draw a tiny SVG that
// matches the stroke weight of Instagram/Facebook icons.
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const EMAIL = "audreybaliao022@gmail.com";
const MAILTO = `mailto:${EMAIL}?subject=Project%20inquiry`;
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  EMAIL,
)}&su=${encodeURIComponent("Project inquiry")}`;

const SOCIALS: readonly Social[] = [
  {
    platform: "Instagram",
    handle: "@ur.dhey",
    url: "https://www.instagram.com/ur.dhey",
    icon: <Instagram className="h-5 w-5" aria-hidden="true" />,
  },
  {
    platform: "Facebook",
    handle: "audrey.baliao.2024",
    url: "https://www.facebook.com/audrey.baliao.2024",
    icon: <Facebook className="h-5 w-5" aria-hidden="true" />,
  },
  {
    platform: "TikTok",
    handle: "@.dtb8",
    url: "https://www.tiktok.com/@.dtb8",
    icon: <TikTokIcon className="h-5 w-5" />,
  },
  {
    platform: "TikTok · edits",
    handle: "@adryrzbl",
    url: "https://www.tiktok.com/@adryrzbl",
    icon: <TikTokIcon className="h-5 w-5" />,
  },
] as const;

export default function Connect() {
  const year = new Date().getFullYear();

  return (
    <section id="connect" className="scroll-mt-24 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="eyebrow">
          <span className="eyebrow__numeral" aria-hidden="true">
            IV
          </span>
          <span className="eyebrow__label">Connect</span>
          <span className="eyebrow__meta">Replies fastest on Instagram</span>
        </div>

        <div className="mt-10 max-w-4xl">
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.98] tracking-[-0.02em] text-emerald-950">
            Let&rsquo;s tell a story{" "}
            <span className="italic text-gold-500">together.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-emerald-950/75 md:text-lg">
            Collabs, hellos, &ldquo;I think you&rsquo;d love this place&rdquo;
            notes. All welcome. The DMs are open and the camera is charged.
          </p>
        </div>

        {/* EMAIL: primary CTA for hiring inquiries */}
        <div className="mt-14 border border-emerald-950/15 bg-emerald-50/40 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-ivory">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <span className="label-caps text-emerald-950/65">
                  For projects &amp; bookings
                </span>
                <a
                  href={MAILTO}
                  className="mt-1 block font-display text-2xl text-emerald-950 transition hover:text-gold-600 md:text-3xl"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={MAILTO}
                className="group inline-flex items-center gap-2 bg-emerald-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-emerald-800"
              >
                Email Audrey
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition group-hover:rotate-12"
                  aria-hidden="true"
                />
              </a>
              <a
                href={GMAIL_COMPOSE}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 border border-emerald-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-950 transition hover:border-gold-500 hover:text-gold-600"
              >
                Open in Gmail
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition group-hover:rotate-12"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>

        {/* SOCIALS: for casual hellos */}
        <div className="mt-12">
          <div className="flex items-baseline gap-x-5 border-b border-emerald-950/15 pb-3">
            <span className="font-display text-2xl italic leading-none text-gold-500">
              ✦
            </span>
            <span className="label-caps text-emerald-950/70">Or come say hi</span>
            <span className="ml-auto label-caps text-emerald-950/55">
              {String(SOCIALS.length).padStart(2, "0")} channels
            </span>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOCIALS.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex h-full flex-col gap-6 border border-emerald-950/15 bg-ivory p-6 transition hover:border-emerald-950"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-950">{social.icon}</span>
                    <span className="label-caps text-emerald-950/55">
                      {social.platform}
                    </span>
                  </div>
                  <div>
                    <div className="font-display text-xl leading-tight text-emerald-950 md:text-2xl">
                      {social.handle}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-emerald-950/15 pt-3">
                    <span className="label-caps text-emerald-950/65">Open</span>
                    <ArrowUpRight
                      className="h-4 w-4 text-emerald-950/70 transition group-hover:rotate-12 group-hover:text-gold-500"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="mt-24 border-t border-emerald-950/15 pt-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-serif text-sm text-emerald-950/80">
              © {year} ·{" "}
              <span className="font-semibold">Dhey Creates</span>
              {" · "}
              Audrey Baliao
            </p>
            <p className="label-caps text-emerald-950/55">
              Site by{" "}
              <a
                href="https://erickcabal.com"
                target="_blank"
                rel="noreferrer noopener"
                className="text-emerald-950/80 underline-offset-4 transition hover:text-gold-600 hover:underline"
              >
                Erick Cabal
              </a>
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
