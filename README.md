# Audrey Baliao: Personal Portfolio

A static, single-page editorial portfolio for Audrey "Dhey" Baliao.
Working student. Daily-life storyteller. Travel-dreamer. Video editor for hire.

## Stack

- **Next.js 15+** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 3.4** (classic JS config: not v4)
- **lucide-react** for icons
- **Google Fonts** via `next/font`: Italianno, Merriweather, Sofia Sans
- No CMS, no database. All site content lives in TSX.

## Develop

```bash
npm install
npm run dev      # http://localhost:3013
npm run build    # production build
npm run start    # serve the build (port 3013)
npm run lint
```

## Site map

| § | Section | What's in it |
|---|---|---|
| I  | Hello       | Headline, portrait, bio, mission, vision |
| II | Stories     | Featured edits (music video, news), 7 vlog gallery, formats list |
| III | Dreams     | Travel everywhere · Wings or waves · Turn it into content |
| IV | Travel Map  | Six passport stamps · wishlist · press kit |
| V  | **Rate sheet** | Per-project tiers · per-minute build · retainer · discounts · downloads |
| VI | Connect     | Instagram · Facebook · TikTok |

## Brand quick-reference

| Token        | Value |
| ------------ | ----- |
| Main         | `emerald-950 #0a2418` (text) · `emerald-500 #2c945f` |
| Background   | `ivory #fbfaf5` |
| Accent       | `gold-500 #d8a83a` |
| Display font | Merriweather (serif headlines, captions, numerals) |
| Sans font    | Sofia Sans (UI, body, tracked caps) |
| Script font  | Italianno (used **only** in nav wordmark + OG image) |

## Operational toolkit

This site ships with the same operational artifacts as the sister site
(Jasmine Villar Portfolio):

| Artifact | What it does | Path |
| --- | --- | --- |
| **Auto-deploy** | Double-click → audit → regenerate manual → git push → Vercel rebuild | [Deploy.command](Deploy.command) |
| **QA + grammar + security check** | Pre-deploy bash audit. Blocks deploy on critical findings, warns on the rest. | [scripts/audit](scripts/audit) |
| **PAT scanner** | Walks every tracked file (incl. PDFs) for committed GitHub tokens | [scripts/_check_pat.py](scripts/_check_pat.py) |
| **Contract generator** | Regenerates intake form + service contract `.docx` | [scripts/generate-forms.py](scripts/generate-forms.py) |
| **Manual generator** | Regenerates the User & Technical Manual PDF | [scripts/generate-manuals.py](scripts/generate-manuals.py) |
| **Latest QA log** | Plain-text audit output, embedded into the manual | [docs/audit-latest.txt](docs/audit-latest.txt) |
| **User & Technical Manual** | Confidential PDF with everything Audrey + the dev need | [docs/Audrey Baliao Portfolio - Manual.pdf](docs/Audrey%20Baliao%20Portfolio%20-%20Manual.pdf) |
| **Project intake form** | Word doc clients fill out before quoting | [public/audrey-baliao-intake-form.docx](public/audrey-baliao-intake-form.docx) |
| **Service contract** | Word doc signed once a project is booked | [public/audrey-baliao-service-contract.docx](public/audrey-baliao-service-contract.docx) |

### Pre-deploy audit checks

The audit script runs two tracks:

**Security**: blocks deploy on any failure:
- Committed GitHub Personal Access Tokens (PDF-aware, via `_check_pat.py`)
- Committed `.env` files
- `npm audit` critical/high vulnerabilities (moderate/low → warning)
- `dangerouslySetInnerHTML`, `eval()`, or `new Function()` in source

**Quality** (grammar / a11y / leftovers: warnings only):
- Em-dashes in JSX (the AI-writing tell)
- `<img>` / `<Image>` tags missing `alt=`
- Stray `console.log` / `console.warn` / `console.error`
- `TODO` / `FIXME` / `XXX` / `HACK` markers

## Where to drop real assets

| What | Where | Note |
| --- | --- | --- |
| Portrait photo | `/public/audrey-portrait.png` | Then uncomment the `<img>` in [src/components/sections/About.tsx](src/components/sections/About.tsx) |
| Story thumbnails (override) | `/public/stories/*.jpg` | Optional: YouTube cards auto-resolve via `i.ytimg.com`. See [public/stories/README.md](public/stories/README.md) |

## Adjusting rates

Every consumer (the in-site Rate sheet, the intake form, the service
contract, the manual PDF) reads from one file:

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

## Adding a new Story

[src/components/sections/Stories.tsx](src/components/sections/Stories.tsx): append to `FEATURED` for hero treatment or `VLOGS` for the gallery. YouTube thumbnails resolve automatically from the `videoId`.

## Swapping Sofia Sans → real Sofia Pro

In [src/app/layout.tsx](src/app/layout.tsx), replace the `Sofia_Sans`
import with a `next/font/local` loader pointing at your hosted Sofia
Pro `.woff2` files. Keep `variable: "--font-sans"`: nothing else
needs to change anywhere in the codebase.

## Credits

Site by [Erick Jhon Cabal](https://erickcabal.com).
