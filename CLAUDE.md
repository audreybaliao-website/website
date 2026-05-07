# Claude handoff: Audrey Baliao Portfolio

> **Read this first** when you (Claude) open this project in a fresh session.
> Everything you need to keep working without re-asking the user is below.

## What this is

A static, single-page editorial portfolio for **Audrey "Dhey" Baliao**.

Audrey is a **video editor** based in the Philippines (working student).
The site has two jobs:

1. Tell her story (one-paragraph hero + 3-paragraph bio).
2. Show her editing portfolio (vlog edits cut for the YouTube channel
   **Mhar Travels**) and let prospects self-quote with a live calculator
   that emails her at `audreybaliao022@gmail.com`.

She is **not** a vlogger of her own life. The videos in Stories are videos
**she edited for a client**. Don't reframe her as a daily-life creator.

## Owner + dev

- **Owner:** Audrey Baliao
- **Email (inquiries):** `audreybaliao022@gmail.com`
- **GitHub account email:** `audreybaliao.website@gmail.com`
- **Developer (the human you talk to):** Erick Jhon Cabal — https://erickcabal.com
- **GitHub repo:** https://github.com/audreybaliao-website/website
- **Live URL:** Vercel project (typically `website-audreybaliao-website.vercel.app`
  or the configured custom domain)
- **Local dev:** `http://localhost:3013`

## Stack (don't second-guess)

- Next.js 16 (App Router) · React 19 · TypeScript 5
- Tailwind CSS 3.4 (classic JS config — **NOT v4**)
- `lucide-react` for icons
- Google Fonts via `next/font`: Italianno (script), Merriweather (serif),
  Sofia Sans (sans, placeholder for paid Sofia Pro)
- No CMS, no database, no API routes. The calculator builds a `mailto:`
  + Gmail compose URL.

## Site structure (4 sections)

| § | Eyebrow | Nav label | Component |
|---|---|---|---|
| I  | Hello         | Hello | `src/components/sections/About.tsx` |
| II | Selected work | Work  | `src/components/sections/Stories.tsx` |
| III | Rate sheet   | Rates | `src/components/sections/Rates.tsx` (mounts `RateCalculator.tsx`) |
| IV | Connect       | Connect | `src/components/sections/Connect.tsx` |

There used to be Dreams (III) and Travel (IV) sections — those were folded
into the About bio. **Don't add them back unless explicitly asked.**

## Brand

- **Emerald** primary (text `#0a2418`, accents through the scale)
- **Gold** accent `#d8a83a` (used sparingly: italic spans, eyebrow numerals)
- **Ivory** `#fbfaf5` background (white only used inside form fields/cards)
- **Italianno** = ONLY in the nav wordmark "Dhey" + the OG image
- **Merriweather** = display headlines, eyebrow numerals
- **Sofia Sans** = body, UI, tracked-caps labels

## Single sources of truth

| What | Where | Notes |
|---|---|---|
| Rates / pricing | `src/lib/pricing.ts` | Calculator + rate sheet + intake form + contract all read here |
| Vlog gallery | `src/components/sections/Stories.tsx` (`VLOGS` array) | Real YouTube titles + descriptions, all "Edited for Mhar Travels" |
| Bio copy | `src/components/sections/About.tsx` | 3 paragraphs; ends with "thanks to my friend Erick" credit |
| Inquiry email | `src/components/RateCalculator.tsx` (`AUDREY_EMAIL` const) | `audreybaliao022@gmail.com` |
| Social handles | `src/components/sections/Connect.tsx` (`SOCIALS` array) | IG `@ur.dhey`, FB `audrey.baliao.2024`, TikTok `@.dtb8` + `@adryrzbl` |

## Hard rules

1. **No em-dashes.** Anywhere — JSX, comments, scripts, generated docs.
   The audit catches them and Audrey explicitly rejected them. Use `:`,
   `,`, `.`, or restructure the sentence.
2. **No fluff/cute editorial copy.** "Frames worth a second scroll", "the
   cuts I'd want to find on a long bus ride", etc. — Audrey shut these
   down. Be factual and direct. Real titles, real descriptions, real
   client names.
3. **No "creator" or "vlogger" framing.** She's a **video editor**.
4. **No stash of secrets.** Never write `github_pat_*`, API keys, or
   `.env*` content into a tracked file. The audit blocks the deploy if
   it finds one.
5. **Never use `dangerouslySetInnerHTML`, `eval`, or `new Function`.**
   The audit blocks the deploy.
6. **Don't downgrade Next or React.** We're on Next 16 / React 19.
   `next.config.ts` carries strict security headers (CSP, HSTS, etc.) —
   leave them alone unless asked.

## Operational toolkit (the same artifacts as the reference build)

| File | Purpose |
|---|---|
| `Deploy.command` | Double-click on macOS. Runs audit → regenerates manual → commits → pushes. Vercel rebuilds within ~90 seconds of the push. |
| `scripts/audit` | Pre-deploy bash audit. Blocks deploy on FAILs (PAT leak, .env, npm critical/high, dangerous APIs); warns (doesn't block) on em-dashes, missing `alt=`, `console.*`, TODO/FIXME. |
| `scripts/_check_pat.py` | PAT scanner used by audit (handles PDF zlib decoding via `pypdf`). |
| `scripts/generate-forms.py` | Regenerates `public/audrey-baliao-intake-form.docx` + `public/audrey-baliao-service-contract.docx`. |
| `scripts/generate-manuals.py` | Regenerates `docs/Audrey Baliao Portfolio - Manual.pdf`. Embeds the latest audit log into both Part 1 and Part 2. |
| `docs/audit-latest.txt` | Plain-text output of the most recent audit run. |
| `docs/Audrey Baliao Portfolio - Manual.pdf` | Two-part manual: Part 1 = User Manual (non-technical, for Audrey), Part 2 = Technical Manual (for any future developer). |
| `public/audrey-baliao-intake-form.docx` | Word-doc intake form on letterhead. Linked from Section III. |
| `public/audrey-baliao-service-contract.docx` | Service contract on letterhead. Linked from Section III. |

## Common commands

```bash
npm install                         # one-time setup
npm run dev                         # http://localhost:3013 (HMR)
npm run build                       # production build
npm run lint                        # eslint
bash scripts/audit                  # standalone audit (Deploy.command runs it auto)
python3 scripts/generate-forms.py   # regen the .docx contracts
python3 scripts/generate-manuals.py # regen the PDF manual
```

To deploy: **double-click `Deploy.command`** (or `bash Deploy.command`
from a terminal). One button. It pushes to GitHub, which triggers
Vercel auto-rebuild.

## Recent decisions log (so future Claude doesn't undo them)

- 6 sections → 4 sections. Dreams + Travel removed; their content folded
  into the About bio. Stories is now the editing portfolio (Mhar Travels)
  not personal vlogs.
- Calculator was originally skipped per the brief, then later added to
  match the reference build's operational parity. Lives at the top of
  Section III.
- Email moved from "DM-first" to "email-first for paid bookings"
  (`audreybaliao022@gmail.com`); DMs are casual fallback in Section IV.
- Padding tightened from `py-24 lg:py-32` to `py-16 lg:py-24` per
  Audrey's note about whitespace.
- Erick credit appears inside the About bio (small italic line at the
  bottom of the bio block) AND in the Connect footer.

## What to do when something needs to change

1. Make the edit.
2. Run `bash scripts/audit` to confirm zero warnings (em-dashes especially).
3. Run `python3 scripts/generate-manuals.py` if any structural change
   that the manual describes was made (sections, file layout, prices, etc.).
4. Run `python3 scripts/generate-forms.py` only if pricing or letterhead
   text changed.
5. Run `npm run build` to confirm clean.
6. Tell the user; if they say "deploy," they double-click `Deploy.command`.
   You can also commit + `git push origin main` directly — Deploy.command's
   value is the audit/manual auto-regen wrapping the push.

## What NOT to do without asking

- Add new top-level sections (we deliberately have only 4).
- Bring back Dreams or Travel as standalone sections.
- Change the rate constants in `pricing.ts`.
- Reword the bio without showing the user the diff first.
- Add tracking/analytics scripts (CSP would need updating; Audrey hasn't
  asked).
- Touch security headers in `next.config.ts`.
