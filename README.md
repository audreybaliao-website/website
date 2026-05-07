# Dhey Creates · Audrey Baliao

Editing portfolio of **Audrey Baliao** ("Dhey" to friends), a video
editor and working student in the Philippines. The site shows her
client edits, lets prospects self-quote with a live calculator, and
hands them a downloadable intake form + service contract.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 3.4** (classic JS config, not v4)
- **lucide-react** for icons
- **Google Fonts** via `next/font`: Italianno, Merriweather, Sofia Sans
- No CMS, no database. The calculator builds a `mailto:` URL.

## Develop

```bash
npm install
npm run dev      # http://localhost:3013
npm run build    # production build
npm run start    # serve the build (port 3013)
npm run lint
```

## Site map (4 sections)

| § | Eyebrow | Nav | What's there |
|---|---|---|---|
| I  | Hello         | Hello | Headline, portrait, 3-paragraph bio (introduces "Audrey Baliao"), Erick Cabal credit |
| II | Selected work | Work | 7 vlog edits cut for **Mhar Travels**, real YouTube titles + descriptions |
| III | Rate sheet   | Rates | Live calculator, per-minute breakdown, monthly retainer table, discounts, contract downloads |
| IV | Connect       | Connect | Email block + 4 social cards (IG, FB, two TikToks) + footer |

## Brand

| Token | Value |
| --- | --- |
| Brand name | **Dhey Creates** |
| Owner | Audrey Baliao |
| Inquiry email | `audreybaliao022@gmail.com` |
| Main color | `emerald-950 #0a2418` (text), emerald scale for accents |
| Background | `ivory #fbfaf5` |
| Accent | `gold-500 #d8a83a` |
| Display font | Merriweather (headlines) |
| Sans font | Sofia Sans (UI, body) |
| Script font | Italianno (only in nav wordmark + OG image) |

## Operational toolkit

Every push is gated by an audit and refreshes the User & Technical
Manual PDF. Single button:

| Artifact | What it does | Path |
| --- | --- | --- |
| **One-button deploy** | Double-click → audit → regenerate manual → git push → Vercel rebuild | [Deploy.command](Deploy.command) |
| **Plain-language deploy guide** | One-page explainer of the above | [DEPLOY.md](DEPLOY.md) |
| **QA + grammar + security audit** | Pre-deploy bash audit; blocks on critical, warns on rest | [scripts/audit](scripts/audit) |
| **PAT scanner** | Walks every tracked file (incl. PDFs) for committed GitHub tokens | [scripts/_check_pat.py](scripts/_check_pat.py) |
| **Contract generator** | Regenerates intake form + service contract `.docx` | [scripts/generate-forms.py](scripts/generate-forms.py) |
| **Manual generator** | Regenerates the User & Technical Manual PDF | [scripts/generate-manuals.py](scripts/generate-manuals.py) |
| **Latest QA log** | Plain-text audit output, embedded into both manual parts | [docs/audit-latest.txt](docs/audit-latest.txt) |
| **User & Technical Manual** | Two-part PDF (user-friendly + technical) | [docs/Dhey Creates - Manual.pdf](docs/Dhey%20Creates%20-%20Manual.pdf) |
| **Project intake form** | Word doc clients fill out before quoting | [public/dhey-creates-intake-form.docx](public/dhey-creates-intake-form.docx) |
| **Service contract** | Word doc signed once a project is booked | [public/dhey-creates-service-contract.docx](public/dhey-creates-service-contract.docx) |
| **Cross-session handoff** | Self-contained brief for any future Claude session | [CLAUDE.md](CLAUDE.md) |

### Pre-deploy audit checks

The audit script runs two tracks:

**Security** (blocks deploy on any failure):
- Committed GitHub Personal Access Tokens (PDF-aware, via `_check_pat.py`)
- Committed `.env` files
- `npm audit` critical/high vulnerabilities (moderate/low → warning)
- `dangerouslySetInnerHTML`, `eval()`, or `new Function()` in source

**Quality / grammar / a11y / leftovers** (warnings only):
- Em-dashes in JSX (the AI-writing tell; Audrey rejected these)
- `<img>` / `<Image>` tags missing `alt=`
- Stray `console.log` / `console.warn` / `console.error`
- `TODO` / `FIXME` / `XXX` / `HACK` markers

## Where to drop real assets

| What | Where | Note |
| --- | --- | --- |
| Portrait photo | `/public/audrey-portrait.png` | Then uncomment the `<img>` in [src/components/sections/About.tsx](src/components/sections/About.tsx) |
| Story thumbnails (override) | `/public/stories/*.jpg` | Optional. YouTube cards auto-resolve via `i.ytimg.com`. |

## Adjusting rates

Every consumer (the live calculator, the in-site rate-sheet card, the
intake form, the service contract, the manual PDF) reads from one
file:

```
src/lib/pricing.ts
```

Edit the constant, save. For the form/contract/manual to reflect the
new rate, re-run:

```bash
python3 scripts/generate-forms.py
python3 scripts/generate-manuals.py
```

(`Deploy.command` runs both automatically on every push.)

## Adding a new vlog edit

[src/components/sections/Stories.tsx](src/components/sections/Stories.tsx):
append to the `VLOGS` array. YouTube thumbnails resolve automatically
from the `videoId`.

## Swapping Sofia Sans → real Sofia Pro

In [src/app/layout.tsx](src/app/layout.tsx), replace the `Sofia_Sans`
import with a `next/font/local` loader pointing at your hosted Sofia
Pro `.woff2` files. Keep `variable: "--font-sans"`. Nothing else
needs to change.

## Credits

Site by [Erick Cabal](https://erickcabal.com).
