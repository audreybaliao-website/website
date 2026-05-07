import type { Metadata } from "next";
import { Italianno, Merriweather, Sofia_Sans } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

// --font-display → Italianno. Used in EXACTLY two places: the nav wordmark
// and the OG image. Never body text.
const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// --font-serif → Merriweather. The editorial display+headline font.
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// --font-sans → Sofia Sans (placeholder for paid Sofia Pro).
// To swap to real Sofia Pro: replace this import with your hosted Sofia Pro
// loader (e.g. localFont) and keep `variable: "--font-sans"`. Nothing else
// in the codebase needs to change.
const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://audreybaliao.com"),
  title: {
    default: "Dhey Creates · Audrey Baliao, video editor",
    template: "%s · Dhey Creates",
  },
  description:
    "Dhey Creates is the editing portfolio of Audrey Baliao, a video editor and working student in the Philippines. Vlog edits cut for Mhar Travels, music videos, and news pieces.",
  applicationName: "Dhey Creates",
  authors: [{ name: "Audrey Baliao" }],
  creator: "Audrey Baliao",
  keywords: [
    "Dhey Creates",
    "Audrey Baliao",
    "video editor",
    "video editing portfolio",
    "Philippines video editor",
    "vlog editor",
    "Mhar Travels editor",
    "music video editor",
    "news editor",
  ],
  openGraph: {
    type: "website",
    title: "Dhey Creates · Audrey Baliao, video editor",
    description:
      "Editing portfolio of Audrey Baliao. Vlog edits for Mhar Travels, music videos, and news pieces.",
    siteName: "Dhey Creates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhey Creates · Audrey Baliao, video editor",
    description:
      "Editing portfolio of Audrey Baliao. Based in the Philippines.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${italianno.variable} ${merriweather.variable} ${sofiaSans.variable}`}
    >
      <body className="bg-ivory font-sans text-emerald-950 antialiased">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-emerald-950 focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:text-ivory"
        >
          Skip to content
        </a>
        <Nav />
        <main className="pt-24 lg:pt-28">{children}</main>
      </body>
    </html>
  );
}
