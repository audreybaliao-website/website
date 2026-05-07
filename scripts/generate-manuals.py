#!/usr/bin/env python3
"""
Regenerate the combined User & Technical manual PDF for Audrey Baliao's
portfolio site.

Output: docs/Audrey Baliao Portfolio - Manual.pdf

Run:    python3 scripts/generate-manuals.py
Hook:   wired into Deploy.command so every push refreshes the PDF.

The script auto-installs reportlab on first run if it's not present, so it
works on a fresh machine with just stock Python.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Bootstrap: install reportlab if missing, then import.
# ---------------------------------------------------------------------------
try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import (
        PageBreak,
        Paragraph,
        Preformatted,
        SimpleDocTemplate,
        Spacer,
        Table,
        TableStyle,
    )
except ImportError:
    print("Installing reportlab (one-time)...", flush=True)
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "--quiet", "reportlab"]
    )
    from reportlab.lib import colors  # noqa: E402
    from reportlab.lib.enums import TA_CENTER, TA_LEFT  # noqa: E402
    from reportlab.lib.pagesizes import letter  # noqa: E402
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet  # noqa: E402
    from reportlab.lib.units import inch  # noqa: E402
    from reportlab.platypus import (  # noqa: E402
        PageBreak,
        Paragraph,
        Preformatted,
        SimpleDocTemplate,
        Spacer,
        Table,
        TableStyle,
    )

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
DOCS.mkdir(exist_ok=True)
OUTPUT = DOCS / "Audrey Baliao Portfolio - Manual.pdf"


# ---------------------------------------------------------------------------
# Project introspection: pull live values from the repo so the manual stays
# accurate without manual editing.
# ---------------------------------------------------------------------------
def read_package_json() -> dict:
    return json.loads((ROOT / "package.json").read_text())


def git_last_commit() -> dict:
    def _run(args: list[str]) -> str:
        return (
            subprocess.check_output(["git", "-C", str(ROOT), *args])
            .decode()
            .strip()
        )

    try:
        return {
            "hash": _run(["rev-parse", "--short", "HEAD"]),
            "subject": _run(["log", "-1", "--pretty=%s"]),
            "date": _run(["log", "-1", "--pretty=%cd", "--date=format:%b %-d, %Y at %-I:%M %p"]),
        }
    except subprocess.CalledProcessError:
        return {"hash": "(no git history)", "subject": "", "date": ""}


def parse_audit_log() -> dict:
    """Read docs/audit-latest.txt and return a structured summary that the
    manual builder can render. Falls back gracefully when the log is
    missing (first run before any deploy)."""
    log_path = DOCS / "audit-latest.txt"
    if not log_path.exists():
        return {
            "exists": False,
            "timestamp": "",
            "status": "missing",
            "fail_count": 0,
            "warn_count": 0,
            "findings": [],
            "text": "",
        }

    text = log_path.read_text(errors="replace")
    lines = text.splitlines()

    timestamp = ""
    if lines and re.match(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}", lines[0]):
        timestamp = lines[0].strip()

    status = "missing"
    fail_count = 0
    warn_count = 0
    status_re = re.compile(
        r"^STATUS:\s*(passed|warnings|failed)"
        r"(?:\s*\((\d+)\s*failing(?:,\s*(\d+)\s*warning)?\))?",
        re.IGNORECASE,
    )
    for ln in lines:
        m = status_re.match(ln)
        if m:
            status = m.group(1).lower()
            fail_count = int(m.group(2) or 0)
            warn_count = int(m.group(3) or 0)
            break

    finding_re = re.compile(r"^(WARN|FAIL)\s+(\S+):\s*(.*)$")
    findings = []
    for ln in lines:
        m = finding_re.match(ln)
        if m:
            findings.append(
                {
                    "level": m.group(1).lower(),
                    "code": m.group(2),
                    "message": m.group(3),
                    "raw": ln,
                }
            )

    return {
        "exists": True,
        "timestamp": timestamp,
        "status": status,
        "fail_count": fail_count,
        "warn_count": warn_count,
        "findings": findings,
        "text": text,
    }


# Plain-English translations for warning codes: used in the User Manual so
# a non-technical reader understands what each finding means. Codes that
# aren't in this map fall back to the raw audit message.
WARNING_TRANSLATIONS: dict[str, str] = {
    "em-dash": "Some copy uses long dashes that can read like AI-generated writing.",
    "missing-alt": "An image is missing its text label (alt text), which screen readers and search engines need.",
    "console-leftover": "Debug logging (console messages) was left in the site code.",
    "todo-marker": "A 'to-do' or 'fix-me' note was left in the code.",
    "npm-audit": "One of the libraries the site uses has a known weak spot: usually fixable by running an update.",
    "pat-leak": "A secret access token is committed to the repository: it must be rotated immediately.",
    "env-committed": "A configuration file (.env) was committed; it may contain sensitive values.",
    "dangerous-api": "Code uses a function that's a known security risk if used carelessly.",
}


def git_remote_credentials() -> dict:
    """Extract username and repo path from .git/config remote URL: but
    never the embedded PAT. The PAT lives only in .git/config (which is
    not tracked) and must never be written into the manual PDF, since the
    PDF is committed and would expose it to anyone with repo access."""
    config = ROOT / ".git" / "config"
    if not config.exists():
        return {"url": "", "user": "", "repo": ""}
    text = config.read_text()
    m = re.search(
        r"url\s*=\s*https://([^:\s]+):[^@\s]+@github\.com/([^\s.]+/[^\s.]+)\.git",
        text,
    )
    if not m:
        m2 = re.search(r"url\s*=\s*(https://github\.com/[^\s]+\.git)", text)
        return {
            "url": m2.group(1) if m2 else "",
            "user": "",
            "repo": "",
        }
    user, repo = m.groups()
    return {
        "url": f"https://github.com/{repo}",
        "user": user,
        "repo": repo,
    }


# ---------------------------------------------------------------------------
# PDF styling: emerald + gold palette to match the website.
# ---------------------------------------------------------------------------
EMERALD_950 = colors.HexColor("#0a2418")
EMERALD_800 = colors.HexColor("#174d33")
EMERALD_700 = colors.HexColor("#1a613e")
EMERALD_500 = colors.HexColor("#2c945f")
EMERALD_200 = colors.HexColor("#b9e4cc")
EMERALD_100 = colors.HexColor("#dcf2e5")
EMERALD_50 = colors.HexColor("#f1faf5")
GOLD_500 = colors.HexColor("#d8a83a")
GOLD_300 = colors.HexColor("#f3d77a")
INK = colors.HexColor("#143f2b")
MUTED = colors.HexColor("#606b60")


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    s: dict[str, ParagraphStyle] = {}
    s["Title"] = ParagraphStyle(
        "Title",
        parent=base["Title"],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=34,
        textColor=EMERALD_950,
        spaceAfter=8,
        alignment=TA_LEFT,
    )
    s["Subtitle"] = ParagraphStyle(
        "Subtitle",
        fontName="Helvetica",
        fontSize=14,
        leading=18,
        textColor=EMERALD_700,
        spaceAfter=4,
    )
    s["PartTitle"] = ParagraphStyle(
        "PartTitle",
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=EMERALD_950,
        spaceBefore=12,
        spaceAfter=14,
    )
    s["H2"] = ParagraphStyle(
        "H2",
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=20,
        textColor=EMERALD_950,
        spaceBefore=18,
        spaceAfter=8,
    )
    s["H3"] = ParagraphStyle(
        "H3",
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=EMERALD_700,
        spaceBefore=12,
        spaceAfter=4,
    )
    s["Body"] = ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=INK,
        spaceAfter=6,
        alignment=TA_LEFT,
    )
    s["Bullet"] = ParagraphStyle(
        "Bullet",
        parent=s["Body"],
        leftIndent=18,
        bulletIndent=6,
        spaceAfter=3,
    )
    s["Note"] = ParagraphStyle(
        "Note",
        fontName="Helvetica-Oblique",
        fontSize=9.5,
        leading=13,
        textColor=MUTED,
        spaceAfter=8,
    )
    s["Caption"] = ParagraphStyle(
        "Caption",
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
    s["Code"] = ParagraphStyle(
        "Code",
        fontName="Courier",
        fontSize=8.5,
        leading=11,
        textColor=EMERALD_950,
        backColor=EMERALD_50,
        borderColor=EMERALD_200,
        borderWidth=0.5,
        borderPadding=6,
        leftIndent=0,
        rightIndent=0,
        spaceAfter=10,
    )
    s["Confidential"] = ParagraphStyle(
        "Confidential",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#7a4f00"),
        backColor=colors.HexColor("#fff7e0"),
        borderColor=GOLD_500,
        borderWidth=0.8,
        borderPadding=8,
        spaceBefore=6,
        spaceAfter=14,
    )
    return s


# ---------------------------------------------------------------------------
# Page chrome: header + footer with page numbers.
# ---------------------------------------------------------------------------
def page_chrome(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    # Footer
    canvas.drawString(
        0.75 * inch, 0.5 * inch, "Audrey Baliao: Personal Portfolio"
    )
    canvas.drawRightString(
        letter[0] - 0.75 * inch, 0.5 * inch, f"Page {doc.page}"
    )
    # Header rule (gold hairline echoing the site)
    canvas.setStrokeColor(GOLD_500)
    canvas.setLineWidth(0.5)
    canvas.line(
        0.75 * inch,
        letter[1] - 0.55 * inch,
        letter[0] - 0.75 * inch,
        letter[1] - 0.55 * inch,
    )
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Helpers for content.
# ---------------------------------------------------------------------------
def p(text: str, style) -> Paragraph:
    return Paragraph(text, style)


def bullets(items: list[str], style) -> list:
    out = []
    for item in items:
        out.append(Paragraph(f"•&nbsp; {item}", style))
    return out


def code_block(text: str, style) -> Preformatted:
    return Preformatted(text.rstrip(), style)


def kv_table(rows: list[tuple[str, str]]) -> Table:
    """Two-column key/value table for credential boxes etc."""
    table = Table(
        [
            [
                Paragraph(
                    f"<b>{k}</b>",
                    ParagraphStyle("k", fontSize=9.5, textColor=EMERALD_700),
                ),
                Paragraph(
                    v,
                    ParagraphStyle(
                        "v",
                        fontSize=9.5,
                        textColor=INK,
                        fontName="Courier",
                    ),
                ),
            ]
            for k, v in rows
        ],
        colWidths=[1.7 * inch, 4.6 * inch],
    )
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.5, EMERALD_200),
                ("LINEBELOW", (0, 0), (-1, -2), 0.25, EMERALD_200),
                ("BACKGROUND", (0, 0), (0, -1), EMERALD_50),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


# ---------------------------------------------------------------------------
# Build the document.
# ---------------------------------------------------------------------------
def build():
    pkg = read_package_json()
    commit = git_last_commit()
    creds = git_remote_credentials()
    audit = parse_audit_log()
    s = make_styles()

    deps = pkg.get("dependencies", {})
    devdeps = pkg.get("devDependencies", {})

    story: list = []

    # ---- Cover ----------------------------------------------------------
    story.append(Spacer(1, 0.6 * inch))
    story.append(p("Audrey Baliao", s["Title"]))
    story.append(p("Personal Portfolio Website", s["Subtitle"]))
    story.append(Spacer(1, 0.4 * inch))
    story.append(p("User &amp; Technical Manual", s["H2"]))
    story.append(Spacer(1, 0.15 * inch))
    story.append(
        p(
            f"Generated on {datetime.now().strftime('%B %d, %Y at %-I:%M %p')}",
            s["Note"],
        )
    )
    if commit["hash"] != "(no git history)":
        story.append(
            p(
                f"Reflecting commit <b>{commit['hash']}</b> , "
                f"&ldquo;{commit['subject']}&rdquo; ({commit['date']}).",
                s["Note"],
            )
        )

    story.append(Spacer(1, 0.5 * inch))
    story.append(
        p(
            "<b>Confidential.</b> This document contains deployment "
            "credentials in Part 2, Section 8. If this PDF leaves the "
            "owner&rsquo;s and developer&rsquo;s hands, rotate the GitHub "
            "Personal Access Token immediately at "
            "https://github.com/settings/personal-access-tokens.",
            s["Confidential"],
        )
    )

    story.append(Spacer(1, 0.4 * inch))
    story.append(p("Contents", s["H2"]))
    toc_items = [
        "Part 1: User Manual",
        "  1.1  What this website is",
        "  1.2  Where to find it",
        "  1.3  The four sections, page by page",
        "  1.4  How a client builds a quote",
        "  1.5  Receiving an inquiry email",
        "  1.6  Asking for changes",
        "  1.7  Common questions",
        "  1.8  Latest QA results",
        "",
        "Part 2: Technical Manual",
        "  2.1  Stack overview",
        "  2.2  Project file structure",
        "  2.3  Running locally",
        "  2.4  Where each piece of content lives",
        "  2.5  The pricing engine",
        "  2.6  The brief builder",
        "  2.7  Deployment pipeline",
        "  2.8  Credentials",
        "  2.9  Asset and image handling",
        "  2.10  Maintenance recipes",
        "  2.11  Mobile responsiveness",
        "  2.12  Security posture & latest audit",
        "  2.13  Future enhancements",
    ]
    for line in toc_items:
        story.append(p(line.replace(" ", "&nbsp;"), s["Body"]))
    story.append(PageBreak())

    # =====================================================================
    # PART 1: USER MANUAL
    # =====================================================================
    story.append(p("Part 1 , User Manual", s["PartTitle"]))
    story.append(
        p(
            "This part is written for Audrey and anyone helping her run the "
            "site day-to-day. No coding required. It explains what each "
            "part of the site does, what visitors and clients see, and what "
            "to do when an inquiry arrives.",
            s["Body"],
        )
    )

    # 1.1
    story.append(p("1.1  What this website is", s["H2"]))
    story.append(
        p(
            "A one-page editorial portfolio for Audrey &ldquo;Dhey&rdquo; "
            "Baliao , working student, daily-life storyteller, and "
            "video editor based in the Philippines. It does three things:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<b>Tells her story.</b> A bio that folds in her dreams "
                "(travel everywhere; flight attendant or cruise ship; "
                "turn it all into content) without separate &lsquo;dreams&rsquo; "
                "or &lsquo;travel&rsquo; sections.",
                "<b>Showcases her work.</b> A 7-card vlog gallery, all on "
                "YouTube. Thumbnails come from i.ytimg.com automatically.",
                "<b>Lets clients self-quote.</b> A live rate calculator "
                "that builds a complete project brief and emails it to "
                "Audrey with one click. Plus a per-minute breakdown, "
                "monthly retainer plans, a discount ladder, and "
                "downloadable intake form + service contract.",
            ],
            s["Bullet"],
        )
    )

    # 1.2
    story.append(p("1.2  Where to find it", s["H2"]))
    story.append(
        p(
            "<b>Live URL:</b> filled in after the first Vercel deploy "
            "(typically <i>audrey-baliao-portfolio.vercel.app</i>, or a "
            "custom domain once configured).",
            s["Body"],
        )
    )
    story.append(
        p(
            "<b>Source code:</b> "
            f"{creds['url'] or 'github.com/audrey-baliao-portfolio (set after first push)'}",
            s["Body"],
        )
    )
    story.append(
        p(
            "<b>Local preview during development:</b> http://localhost:3013",
            s["Body"],
        )
    )

    # 1.3
    story.append(p("1.3  The four sections, page by page", s["H2"]))

    story.append(p("I. Hello (the hero)", s["H3"]))
    story.append(
        p(
            "The first thing visitors see. Includes a "
            "&ldquo;Currently creating&rdquo; pulsing dot, the headline "
            "&ldquo;Everyday moments, turned into stories,&rdquo; a portrait "
            "frame, a role / based / on-platform meta strip, and three "
            "paragraphs of bio. The bio absorbs what used to be separate "
            "&lsquo;Dreams&rsquo; and &lsquo;Travel&rsquo; sections: who "
            "Audrey is, what formats she edits (vlogs, travel wishlist "
            "edits, GRWMs, music videos, news pieces), and the bigger "
            "dream of travelling everywhere as a flight attendant or aboard "
            "a cruise ship.",
            s["Body"],
        )
    )

    story.append(p("II. Stories", s["H3"]))
    story.append(
        p(
            "A 3-column gallery of 7 vlog edits, all on YouTube. "
            "Thumbnails come from <i>i.ytimg.com</i> automatically. Each "
            "card opens the actual video in a new tab.",
            s["Body"],
        )
    )

    story.append(p("III. Rate sheet", s["H3"]))
    story.append(
        p(
            "Four blocks. <i>Live rate calculator</i>: clients toggle what "
            "they need and see a running PHP total, then send the brief by "
            "email, Gmail, or copy-paste. <i>Per-minute build</i>: clean "
            "cuts, intro / outro, thumbnail, cover frame, YouTube kit, "
            "extra exports, and the rush surcharge. <i>Monthly retainer</i>: "
            "4 to 7 videos per month with a 50/50 payment table. "
            "<i>Discounts</i>: 5 / 10 / 15 / 20% ladder. Plus two document "
            "downloads (intake form, service contract).",
            s["Body"],
        )
    )

    story.append(p("IV. Connect", s["H3"]))
    story.append(
        p(
            "Headline (&ldquo;Let&rsquo;s tell a story together&rdquo;), a "
            "short collaboration invitation, then a prominent <b>email "
            "block</b> for projects and bookings (Email Audrey + Open in "
            "Gmail buttons pointing at <i>audreybaliao022@gmail.com</i>), "
            "followed by four social cards for casual hellos: "
            "<b>Instagram</b> @ur.dhey, <b>Facebook</b> "
            "audrey.baliao.2024, <b>TikTok</b> @.dtb8, and <b>TikTok &middot; "
            "edits</b> @adryrzbl. Closes with the footer crediting the "
            "developer.",
            s["Body"],
        )
    )

    # 1.4
    story.append(p("1.4  How a client builds a quote", s["H2"]))
    story.append(
        p(
            "Inside Section <b>III (Rate sheet)</b> the client sees a live "
            "calculator at the top of the section. They see:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "A &ldquo;Tell me about you and your project&rdquo; card with "
                "their name, email, a project description (multi-line), and "
                "a Google Drive link to their footage.",
                "<b>Start from a preset.</b> Quick reel, 10-min vlog, Music "
                "video, or News / project edit. One click pre-fills "
                "everything.",
                "<b>Footage.</b> Raw video length in minutes.",
                "<b>Edit complexity.</b> Toggle music, video effects, and "
                "captions. Each has four levels: Light, Standard, Detailed, "
                "Heavy.",
                "<b>Hooks &amp; branding.</b> Cliffhanger, custom "
                "intro/outro, thumbnail, cover frame, and the YouTube kit "
                "(timestamps + title + description, &#8369;100 all-in).",
                "<b>Delivery.</b> Extra exports count and rush toggle.",
                "<b>Add-ons.</b> Optional flat fees for script/structure "
                "pass and stock asset budget.",
                "<b>Discount request</b> (optional). A 0/5/10/15/20% "
                "starting tier the client can propose with their reason.",
            ],
            s["Bullet"],
        )
    )
    story.append(
        p(
            "On the right side (or below on mobile), a sticky <b>Your "
            "estimate</b> card shows the running PHP total, included items, "
            "the timeline, and three send buttons:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<b>Send this brief to Audrey.</b> Opens the client&rsquo;s "
                "default mail app with the full brief prefilled.",
                "<b>Open in Gmail.</b> Works for clients who use Gmail in "
                "a browser without a default mail handler set up.",
                "<b>Copy brief.</b> Clipboard copy with a green &ldquo;"
                "Copied&rdquo; flash; client can paste into any mail "
                "client.",
            ],
            s["Bullet"],
        )
    )
    story.append(
        p(
            "If the client prefers, the same intake form is downloadable "
            "as a Word document at the bottom of Section III.",
            s["Body"],
        )
    )

    # 1.5
    story.append(p("1.5  Receiving an inquiry email", s["H2"]))
    story.append(
        p(
            "When a client clicks any of the three send buttons in the "
            "calculator, <b>audreybaliao022@gmail.com</b> receives a message "
            "that looks like this:",
            s["Body"],
        )
    )
    sample_brief = """\
Subject: Project inquiry from Maria Santos

Hi Audrey, I'm Maria.

I'd love to book a project with you. Here are the choices I made on
your site:

  * Raw footage length: 30 minutes
  * Music & sound design: Yes (Standard)
  * Video effects: Yes (Detailed)
  * Subtitles / captions: Yes (Heavy)
  * Cliffhanger opener: No
  * Custom intro: Yes
  * Custom outro: Yes
  * Thumbnail: Yes
  * Cover frame: No
  * Extra export versions: 2
  * Delivery: Standard (7-day)

Estimated total: PHP 4,025

A little about the project:
A wedding highlight reel for my parents' anniversary, posting on YouTube.
I'd like a warm cinematic feel.

Footage on Google Drive: https://drive.google.com/...
(I have set the link to "Anyone with the link can view" so you can
open it without delays.)

Thank you, and I look forward to your reply.

Maria Santos
maria@example.com"""
    story.append(code_block(sample_brief, s["Code"]))
    story.append(
        p(
            "The brief always includes whatever the client typed into the "
            "calculator. Reply directly to that email; the client&rsquo;s "
            "address is on the &ldquo;From&rdquo; line, with their typed "
            "address as a backup at the bottom.",
            s["Body"],
        )
    )
    story.append(
        p(
            "The site also links four casual channels under "
            "&ldquo;Or come say hi&rdquo; in Section IV: Instagram "
            "(@ur.dhey, fastest replies), Facebook (audrey.baliao.2024), "
            "and the two TikTok handles (@.dtb8 personal, @adryrzbl edits).",
            s["Body"],
        )
    )

    # 1.6
    story.append(p("1.6  Asking for changes", s["H2"]))
    story.append(
        p(
            "The site is hosted on Vercel and rebuilds automatically every "
            "time the developer pushes a change to GitHub. To request an "
            "update (new vlog edit, blurb tweak, rate change, etc.), send "
            "the request to the developer (Erick Cabal). They&rsquo;ll "
            "edit, push, and the live site updates within ~90&nbsp;seconds.",
            s["Body"],
        )
    )
    story.append(
        p(
            "Common requests that take under a minute to ship:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "Adding a new vlog edit (needs: YouTube video ID, title, "
                "blurb).",
                "Updating a price constant in <i>src/lib/pricing.ts</i> "
                "(base rate per minute, intro/outro fees, rush %, etc.).",
                "Toggling the &ldquo;Currently creating&rdquo; pulse on or "
                "off.",
                "Updating the bio, mission, vision, or social handles.",
            ],
            s["Bullet"],
        )
    )

    # 1.7
    story.append(p("1.7  Common questions", s["H2"]))
    qa = [
        (
            "Can I change my rates without touching code?",
            "Almost. Edit one file: <i>src/lib/pricing.ts</i>. The rate "
            "sheet section, intake form (after a generate-forms.py run), "
            "and contract (same) all read the same constants.",
        ),
        (
            "What if a client&rsquo;s Drive link returns &ldquo;request "
            "access&rdquo;?",
            "They forgot to set sharing to <i>Anyone with the link can "
            "view</i>. Reply asking them to fix the share setting; the "
            "intake form has a hint reminding them but it&rsquo;s easy to "
            "miss.",
        ),
        (
            "Can I temporarily hide a vlog from the gallery?",
            "Yes. Tell the developer; they comment out the corresponding "
            "entry in <i>src/components/sections/Stories.tsx</i> "
            "(<i>VLOGS</i> array). Bringing it back is just uncommenting.",
        ),
        (
            "Can I take the site offline?",
            "Yes. In the Vercel dashboard, pause the project. The URL "
            "starts returning 503 until you unpause. The repo and code "
            "remain intact.",
        ),
        (
            "Where does the YouTube thumbnail come from?",
            "It&rsquo;s pulled from <i>i.ytimg.com</i> at runtime , "
            "the videoId is the only thing stored in the codebase. No "
            "thumbnail files are uploaded to the repo for YouTube videos.",
        ),
    ]
    for q, a in qa:
        story.append(p(f"<b>{q}</b>", s["H3"]))
        story.append(p(a, s["Body"]))

    # 1.8 ----------------------------------------------------------------
    story.append(p("1.8  Latest QA results", s["H2"]))
    if not audit["exists"]:
        story.append(
            p(
                "<i>No audit log captured yet.</i> The next deploy will run "
                "the automated checks and record the results here.",
                s["Note"],
            )
        )
    else:
        when = audit["timestamp"] or "unknown"
        story.append(p(f"<b>Last checked:</b> {when}", s["Body"]))

        if audit["status"] == "passed":
            verdict = (
                "&#9989;  <b>All clear.</b> The most recent automated check "
                "found nothing to worry about."
            )
        elif audit["status"] == "warnings":
            verdict = (
                "&#9989;  <b>Safe to ship, with a few small warnings.</b> "
                "The most recent automated check found some non-blocking "
                "items worth reviewing , listed below."
            )
        elif audit["status"] == "failed":
            verdict = (
                "&#10060;  <b>The last automated check blocked a "
                "deploy.</b> The previous version of the site is still "
                "live; see the Technical Manual (Section 2.12) for the "
                "full log."
            )
        else:
            verdict = (
                "&#9888;  <b>Audit status unknown.</b> The log file exists "
                "but couldn&rsquo;t be parsed. See Technical Manual "
                "Section 2.12 for the raw output."
            )
        story.append(p(verdict, s["Body"]))

        # Collect translated, deduplicated warnings: capped at 10.
        seen: set[str] = set()
        translated: list[str] = []
        for f in audit["findings"]:
            key = f["code"]
            if key in seen:
                continue
            translation = WARNING_TRANSLATIONS.get(key, f["message"])
            translated.append(translation)
            seen.add(key)
            if len(translated) >= 10:
                break

        if translated:
            story.append(p("<b>What was flagged:</b>", s["Body"]))
            story.extend(bullets(translated, s["Bullet"]))
            extras = max(
                0,
                len({f["code"] for f in audit["findings"]}) - len(translated),
            )
            if extras > 0:
                story.append(
                    p(
                        f"<i>Plus {extras} more category(ies) , see "
                        f"the full log in the Technical Manual.</i>",
                        s["Note"],
                    )
                )

    story.append(PageBreak())

    # =====================================================================
    # PART 2: TECHNICAL MANUAL
    # =====================================================================
    story.append(p("Part 2 , Technical Manual", s["PartTitle"]))
    story.append(
        p(
            "Written for the developer maintaining this codebase. Includes "
            "credentials. <b>Treat this part as confidential.</b>",
            s["Body"],
        )
    )

    # 2.1
    story.append(p("2.1  Stack overview", s["H2"]))
    deps_table_data = [
        ("Framework", f"Next.js {deps.get('next', '')}"),
        ("UI runtime", f"React {deps.get('react', '')}"),
        ("Styling", f"Tailwind CSS {devdeps.get('tailwindcss', '')}"),
        ("Icons", f"lucide-react {deps.get('lucide-react', '')}"),
        ("Language", f"TypeScript {devdeps.get('typescript', '')}"),
        ("Hosting", "Vercel (auto-deploys from GitHub main)"),
        ("Source", "GitHub (push to main = redeploy)"),
        ("Node target", "Node 20+ (Vercel default)"),
        ("Dev port", "3013"),
    ]
    story.append(kv_table(deps_table_data))
    story.append(
        p(
            "All app routes live under the App Router (<i>src/app/</i>). "
            "Pages are React Server Components by default; the client-side "
            "components are the navigation (<i>Nav.tsx</i>) for scrollspy "
            "and the rate calculator (<i>RateCalculator.tsx</i>). No "
            "backend, no database, no API routes. The calculator builds a "
            "<i>mailto:</i> URL that the client&rsquo;s mail app handles.",
            s["Body"],
        )
    )

    # 2.2
    story.append(p("2.2  Project file structure", s["H2"]))
    structure = """\
audrey-baliao-portfolio/
├── docs/                                      ← this PDF lives here
│   ├── Audrey Baliao Portfolio - Manual.pdf
│   └── audit-latest.txt
├── public/                                    ← static assets (served at /)
│   ├── audrey-portrait.png                    ← drop in real photo
│   ├── stories/                               ← optional override thumbs
│   ├── audrey-baliao-intake-form.docx         ← downloadable form
│   └── audrey-baliao-service-contract.docx    ← downloadable contract
├── scripts/
│   ├── audit                                  ← pre-deploy audit gate (bash)
│   ├── _check_pat.py                          ← PAT scanner used by audit
│   ├── generate-forms.py                      ← regenerates the .docx forms
│   └── generate-manuals.py                    ← regenerates this PDF
├── src/
│   ├── app/
│   │   ├── globals.css                        ← Tailwind + section-rise
│   │   ├── icon.svg                           ← favicon (emerald + gold)
│   │   ├── layout.tsx                         ← root layout, fonts, metadata
│   │   ├── not-found.tsx                      ← 404 page
│   │   ├── opengraph-image.tsx                ← dynamic OG image
│   │   ├── page.tsx                           ← home (mounts all sections)
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── Nav.tsx                            ← sticky header, scrollspy
│   │   ├── RateCalculator.tsx                 ← live quote builder (client)
│   │   └── sections/
│   │       ├── About.tsx                      ← I.   Hello
│   │       ├── Stories.tsx                    ← II.  Stories
│   │       ├── Rates.tsx                      ← III. Rate sheet
│   │       └── Connect.tsx                    ← IV.  Connect
│   └── lib/
│       └── pricing.ts                         ← rates + calculateQuote
├── Deploy.command                             ← double-click → deploy
├── eslint.config.mjs
├── next.config.ts                             ← strict CSP + security headers
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts                         ← emerald + gold palette
└── tsconfig.json"""
    story.append(code_block(structure, s["Code"]))

    # 2.3
    story.append(p("2.3  Running locally", s["H2"]))
    story.append(p("First-time setup:", s["Body"]))
    story.append(code_block("npm install", s["Code"]))
    story.append(p("Day-to-day:", s["Body"]))
    story.append(
        code_block(
            "npm run dev          # http://localhost:3013 with HMR\n"
            "npm run build        # production build\n"
            "npm run start        # serve the built output on 3013\n"
            "npm run lint         # eslint (next/core-web-vitals + typescript)\n"
            "npx tsc --noEmit     # standalone type check\n"
            "\n"
            "# Regenerate the contracts and the manual any time:\n"
            "python3 scripts/generate-forms.py\n"
            "python3 scripts/generate-manuals.py\n"
            "\n"
            "# Run the audit alone (Deploy.command runs it automatically):\n"
            "bash scripts/audit",
            s["Code"],
        )
    )

    # 2.4
    story.append(p("2.4  Where each piece of content lives", s["H2"]))
    content_table = [
        ("Headline / hero", "src/components/sections/About.tsx"),
        ("Bio paragraphs (3)", "src/components/sections/About.tsx"),
        (
            "Stories: vlog gallery",
            "src/components/sections/Stories.tsx (VLOGS array)",
        ),
        ("Rate calculator UI", "src/components/RateCalculator.tsx"),
        ("Calculator presets", "src/components/RateCalculator.tsx (PRESETS)"),
        ("Email body / brief", "src/components/RateCalculator.tsx (buildBrief)"),
        (
            "Pricing constants",
            "src/lib/pricing.ts (PRICING, RETAINER_PLANS, DISCOUNTS)",
        ),
        ("Social cards", "src/components/sections/Connect.tsx (SOCIALS)"),
        ("Form templates (.docx source)", "scripts/generate-forms.py"),
        ("Page metadata / OG", "src/app/layout.tsx (metadata export)"),
        ("Color palette", "tailwind.config.ts (emerald, gold, ivory)"),
        ("Fonts", "src/app/layout.tsx (Italianno + Merriweather + Sofia Sans)"),
        ("Favicon", "src/app/icon.svg"),
        ("OG image", "src/app/opengraph-image.tsx"),
    ]
    story.append(kv_table(content_table))

    # 2.5
    story.append(p("2.5  The pricing engine", s["H2"]))
    story.append(
        p(
            "All rate logic is in <i>src/lib/pricing.ts</i>. The constants "
            "are typed and centralized so the live calculator, the rate "
            "sheet display, the intake form, and the service contract all "
            "stay in lockstep:",
            s["Body"],
        )
    )
    pricing_path = ROOT / "src" / "lib" / "pricing.ts"
    if pricing_path.exists():
        pricing_text = pricing_path.read_text()
        m = re.search(r"export const PRICING = \{[\s\S]+?\} as const;", pricing_text)
        if m:
            story.append(code_block(m.group(0), s["Code"]))
    story.append(
        p(
            "<b>How a quote is computed</b> (function "
            "<i>calculateQuote</i>):",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<b>Clean cuts.</b> rawMinutes &times; baseRatePerMin "
                "(&#8369;20/min). Always charged.",
                "<b>Music / Effects / Captions.</b> Each: rawMinutes "
                "&times; complexity &times; baseRatePerMin. Complexity is "
                "0.3 (Light), 0.5 (Standard), 0.7 (Detailed), or 1.0 "
                "(Heavy).",
                "<b>Cliffhanger opener.</b> rawMinutes &times; 0.5 "
                "&times; baseRatePerMin.",
                "<b>Flat fees.</b> Intro &#8369;250, outro "
                "&#8369;250, thumbnail &#8369;250, cover frame "
                "&#8369;250, YouTube kit &#8369;100 (timestamps + title + "
                "description, all-in).",
                "<b>Extra exports.</b> &#8369;100 each.",
                "<b>Rush.</b> Subtotal &times; 0.25 surcharge added to the "
                "running total.",
                "<b>Add-ons.</b> Script / structure pass and stock-asset "
                "budget are added at face value (client-entered amounts).",
                "<b>Retainer.</b> &#8369;2,500 per video, 4 to 7 videos / "
                "month, 50/50 split.",
            ],
            s["Bullet"],
        )
    )

    # 2.6
    story.append(p("2.6  The brief builder", s["H2"]))
    story.append(
        p(
            "<i>buildBrief()</i> at the bottom of "
            "<i>RateCalculator.tsx</i> turns the calculator state into "
            "plain text. State threaded through:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<i>clientName</i>, <i>clientEmail</i>: greeting + sign-off.",
                "<i>projectDescription</i>: the &ldquo;A little about the "
                "project&rdquo; block.",
                "<i>driveLink</i>: the <i>Footage on Google Drive</i> line "
                "(with a built-in note about share settings).",
                "Every calculator toggle/level: rendered as Yes/No with "
                "the complexity label.",
                "<i>quote.total</i>: <i>Estimated total</i> in PHP.",
                "<i>discountTier</i> + <i>discountReason</i>: only emitted "
                "when the client picked a tier.",
            ],
            s["Bullet"],
        )
    )
    story.append(
        p(
            "All three send buttons (mailto, Gmail compose URL, Copy "
            "brief) consume the same <i>briefBody</i> string. The Gmail "
            "URL uses the <i>view=cm&amp;fs=1</i> compose endpoint with "
            "URL-encoded subject + body so the client&rsquo;s Gmail tab "
            "opens with everything filled in.",
            s["Body"],
        )
    )
    story.append(
        p(
            "The Stories feed is a single typed array (<i>VLOGS</i> in "
            "<i>Stories.tsx</i>) of 7 YouTube vlog cards. Thumbnails "
            "resolve to <i>https://i.ytimg.com/vi/&lt;ID&gt;/hqdefault.jpg</i> "
            "from the videoId; no manual upload required.",
            s["Body"],
        )
    )

    # 2.7
    story.append(p("2.7  Deployment pipeline", s["H2"]))
    story.append(
        p(
            "<b>Push to main = live in ~90 seconds.</b> Flow:",
            s["Body"],
        )
    )
    story.append(
        code_block(
            "Local edit\n"
            "    │\n"
            "    ▼\n"
            "Double-click Deploy.command\n"
            "    │  (1) runs scripts/audit (security + grammar/quality)\n"
            "    │       FAIL  → deploy is blocked\n"
            "    │       WARN  → deploy proceeds, items logged\n"
            "    │  (2) regenerates docs/Audrey Baliao Portfolio - Manual.pdf\n"
            "    │  (3) git add -A\n"
            "    │  (4) git commit -m 'Update on <date>'\n"
            "    │  (5) git push origin HEAD:main\n"
            "    ▼\n"
            "GitHub receives the push\n"
            "    │\n"
            "    ▼\n"
            "Vercel webhook fires → next build → deploys → live URL updates",
            s["Code"],
        )
    )

    # 2.8: credentials
    story.append(p("2.8  Credentials", s["H2"]))
    story.append(
        p(
            "These are required to push deploys. <b>Treat as secrets.</b> "
            "Anyone with the GitHub PAT can push code, which triggers a "
            "Vercel rebuild. Rotation steps are at the end of this section.",
            s["Confidential"],
        )
    )

    cred_rows = [
        ("GitHub username", creds["user"] or "(set after first push)"),
        ("Owner contact", "Audrey Baliao"),
        ("Repository", creds["repo"] or "(set after first push)"),
        (
            "Repository URL",
            creds["url"] or "(filled in after first push)",
        ),
        ("Default branch", "main"),
        (
            "Personal Access Token",
            "(stored locally in .git/config: never committed; rotate at "
            "github.com/settings/personal-access-tokens)",
        ),
        ("Token scope", "Contents: Read and write (single-repo)"),
        ("Storage on disk", ".git/config (embedded in remote URL)"),
        (
            "Vercel project",
            "(set in Vercel dashboard after first deploy)",
        ),
        ("Owner email", "audreybaliao022@gmail.com"),
        (
            "Inquiry channels",
            "Email audreybaliao022@gmail.com · Instagram @ur.dhey · "
            "Facebook audrey.baliao.2024 · TikTok @.dtb8 + @adryrzbl",
        ),
    ]
    story.append(kv_table(cred_rows))

    story.append(p("Rotating the GitHub Personal Access Token", s["H3"]))
    story.extend(
        bullets(
            [
                "Sign in to GitHub as the repo owner.",
                "Visit https://github.com/settings/personal-access-tokens, "
                "delete the current token.",
                "Generate a new fine-grained PAT scoped to this repo with "
                "<b>Contents: Read and write</b>.",
                "Update the URL in <i>.git/config</i>: replace the old "
                "token in the <i>https://USER:TOKEN@github.com/...</i> "
                "remote URL with the new one.",
                "Test with <i>git push</i>. Done.",
            ],
            s["Bullet"],
        )
    )

    # 2.9
    story.append(p("2.9  Asset and image handling", s["H2"]))
    story.append(
        p(
            "<b>Hero portrait</b> , <i>public/audrey-portrait.png</i>. "
            "Until the file exists, the frame in About.tsx renders a "
            "&ldquo;Dhey&rdquo; script placeholder. Drop the JPG in and "
            "uncomment the <i>&lt;img&gt;</i> block in About.tsx.",
            s["Body"],
        )
    )
    story.append(
        p(
            "<b>Vlog &amp; featured-edit thumbnails</b> , resolve "
            "automatically:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<b>YouTube videos</b> , <i>https://i.ytimg.com/vi/"
                "&lt;ID&gt;/hqdefault.jpg</i>, allowed by the CSP "
                "<i>img-src</i> in <i>next.config.ts</i>. No upload needed.",
                "<b>Facebook share/v/</b> , no public thumbnail "
                "exists; the card uses an emerald-gradient placeholder "
                "with a <i>News &middot; project</i> badge.",
                "<b>Optional override</b> , drop a JPG into "
                "<i>public/stories/</i> and add a <i>thumb</i> field to "
                "the matching entry in Stories.tsx.",
            ],
            s["Bullet"],
        )
    )

    # 2.10
    story.append(p("2.10  Maintenance recipes", s["H2"]))
    story.append(p("Add a new vlog edit", s["H3"]))
    story.append(
        code_block(
            "// in src/components/sections/Stories.tsx, VLOGS array:\n"
            "{\n"
            '  id: "v08",\n'
            '  source: "youtube",\n'
            '  category: "vlog",\n'
            '  videoId: "<11-char-youtube-id>",\n'
            '  url: "https://youtu.be/<id>",\n'
            '  title: "Vlog · 08",\n'
            '  blurb: "Daily-life cut.",\n'
            "},",
            s["Code"],
        )
    )
    story.append(p("Change a price", s["H3"]))
    story.append(
        p(
            "Edit the corresponding constant in <i>src/lib/pricing.ts</i> "
            "(<i>baseRatePerMin</i>, <i>introFee</i>, <i>rushFeePct</i>, "
            "<i>RETAINER_PER_VIDEO</i>, etc.). The Rate sheet section "
            "re-renders the new total on the next page load. Re-run "
            "<i>python3 scripts/generate-forms.py</i> if you want the "
            "intake form to reflect new helper text.",
            s["Body"],
        )
    )
    story.append(p("Toggle the &ldquo;Currently creating&rdquo; pulse", s["H3"]))
    story.append(
        p(
            "In <i>About.tsx</i>, find the eyebrow with the green pinging "
            "dot and either remove or comment out that block. To add it "
            "back, uncomment.",
            s["Body"],
        )
    )
    story.append(p("Update the bio", s["H3"]))
    story.append(
        p(
            "The headline and three bio paragraphs are all in "
            "<i>About.tsx</i>. The third paragraph is where the dreams "
            "(travel everywhere; flight attendant or cruise ship) live. "
            "Use <i>&amp;rsquo;</i> for apostrophes inside JSX text to "
            "avoid React entity warnings, e.g. <i>I&amp;rsquo;m</i>.",
            s["Body"],
        )
    )

    story.append(p("Edit the intake form or service contract", s["H3"]))
    story.append(
        p(
            "Open <i>scripts/generate-forms.py</i> and edit the relevant "
            "<i>build_intake_form()</i> or <i>build_service_contract()</i> "
            "function. Re-run <i>python3 scripts/generate-forms.py</i> to "
            "regenerate the .docx files in <i>public/</i>. Commit and "
            "push as usual , the new versions are served at "
            "<i>/audrey-baliao-intake-form.docx</i> and "
            "<i>/audrey-baliao-service-contract.docx</i>. The download "
            "links in <i>Rates.tsx</i> point at those paths.",
            s["Body"],
        )
    )

    # 2.11
    story.append(p("2.11  Mobile responsiveness", s["H2"]))
    story.append(
        p(
            "All breakpoints use Tailwind defaults: <i>sm</i>=640px, "
            "<i>md</i>=768px, <i>lg</i>=1024px. Key responsive decisions:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<b>Nav.</b> On &lt;sm only the Roman numerals show; the "
                "labels appear from sm up. The wordmark (&ldquo;Audrey "
                "<i>Dhey</i>&rdquo;) is always visible.",
                "<b>About hero.</b> H1 scales <i>clamp(3.25rem, 9vw, "
                "7.5rem)</i>. Portrait + meta stack on mobile, 5/7 split "
                "on lg.",
                "<b>Stories.</b> Vlog gallery: 1 / 2 / 3 cols at sm / md / "
                "lg.",
                "<b>Rate calculator.</b> 1 col on mobile (form then "
                "estimate-card stacked); 2 cols on lg with the estimate "
                "panel sticky at <i>top-24</i>. Hooks &amp; branding and "
                "Add-ons collapse from 2-col to 1-col below sm.",
                "<b>Rate sheet body.</b> Per-minute build + retainer split "
                "on lg, stack on mobile. Discount cards 1 / 2 / 4 cols.",
                "<b>Connect.</b> Email block fluidly stacks; social cards "
                "1 / 2 / 4 cols.",
            ],
            s["Bullet"],
        )
    )

    # 2.12: Security posture + verbatim latest audit log
    story.append(p("2.12  Security posture & latest audit", s["H2"]))
    story.append(
        p(
            "Every push runs <i>scripts/audit</i> before "
            "<i>Deploy.command</i> regenerates this PDF. The audit covers "
            "two tracks:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<b>Security</b> , committed PATs, committed .env "
                "files, <i>npm audit</i> (critical/high blocks the "
                "deploy; moderate/low warns), and use of "
                "<i>dangerouslySetInnerHTML</i> / <i>eval</i> / "
                "<i>new&nbsp;Function</i>.",
                "<b>Quality (grammar / a11y / leftovers)</b> , "
                "em-dashes in JSX (the AI-tell), images missing alt "
                "text, leftover <i>console.*</i> calls, and TODO/FIXME "
                "markers.",
            ],
            s["Bullet"],
        )
    )
    story.append(
        p(
            "Findings emit one line each in the form "
            "<i>LEVEL&nbsp;&nbsp;code:&nbsp;message</i>. Any <b>FAIL</b> "
            "blocks the deploy with a non-zero exit; <b>WARN</b> does not.",
            s["Body"],
        )
    )
    story.append(
        p(
            "Beyond the audit, the runtime is hardened in "
            "<i>next.config.ts</i> with: HSTS, X-Frame-Options DENY, "
            "X-Content-Type-Options nosniff, a strict Content Security "
            "Policy, a restrictive Permissions-Policy "
            "(camera/microphone/geolocation/interest-cohort all denied), "
            "and a strict Referrer-Policy.",
            s["Body"],
        )
    )

    story.append(p("Latest QA run (verbatim)", s["H3"]))
    if not audit["exists"]:
        story.append(
            p(
                "<i>No audit captured yet , the next "
                "Deploy.command run will create "
                "docs/audit-latest.txt.</i>",
                s["Note"],
            )
        )
    else:
        story.append(
            p(
                f"<b>Date:</b> {audit['timestamp'] or 'unknown'}<br/>"
                f"<b>Status:</b> {audit['status']}<br/>"
                f"<b>Findings:</b> {audit['fail_count']} failing, "
                f"{audit['warn_count']} warning",
                s["Body"],
            )
        )

        # Embed the verbatim log, truncated to 80 lines so a copy-heavy file
        # doesn't balloon the PDF.
        raw = audit["text"].rstrip()
        log_lines = raw.splitlines()
        if len(log_lines) > 80:
            log_lines = log_lines[:80] + [
                "",
                f"... (truncated , {len(raw.splitlines()) - 80} more "
                f"lines in docs/audit-latest.txt)",
            ]
        story.append(code_block("\n".join(log_lines), s["Code"]))

    # 2.13: Future enhancements
    story.append(p("2.13  Future enhancements", s["H2"]))
    story.append(
        p(
            "Ideas the codebase is structured to absorb without major "
            "rework:",
            s["Body"],
        )
    )
    story.extend(
        bullets(
            [
                "<b>Custom domain.</b> Add via Vercel dashboard "
                "(Project &rarr; Settings &rarr; Domains).",
                "<b>Analytics.</b> Vercel Web Analytics is a one-click "
                "toggle in the dashboard.",
                "<b>Real Sofia Pro.</b> Replace the Sofia Sans Google "
                "Fonts loader in <i>layout.tsx</i> with "
                "<i>next/font/local</i>. Keep <i>variable: --font-sans</i>; "
                "nothing else needs to change.",
                "<b>Server-side inquiry capture.</b> If Audrey wants "
                "inquiries to skip the client&rsquo;s mail app, add an API "
                "route at <i>src/app/api/inquiry/route.ts</i> and POST to "
                "it from the calculator. Resend or Nodemailer + Gmail SMTP "
                "both work.",
                "<b>Admin page.</b> Protected route with a list of "
                "received inquiries. Would require a database (Vercel "
                "Postgres or Supabase).",
                "<b>i18n (Tagalog/English toggle).</b> "
                "<i>next-intl</i> drops in cleanly with the App Router.",
                "<b>Project case studies.</b> Per-vlog detail pages at "
                "<i>/stories/[slug]</i> with embedded video, client "
                "testimonial, and BTS notes.",
            ],
            s["Bullet"],
        )
    )

    story.append(Spacer(1, 0.3 * inch))
    story.append(
        p(
            f"<i>End of manual. Regenerate by running</i> "
            f"<i>python3 scripts/generate-manuals.py</i>. "
            f"<i>Auto-runs on every Deploy.command push.</i>",
            s["Caption"],
        )
    )

    # ---- Build the PDF --------------------------------------------------
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.7 * inch,
        title="Audrey Baliao Portfolio - Manual",
        author="Erick Cabal",
    )
    doc.build(story, onFirstPage=page_chrome, onLaterPages=page_chrome)
    print(f"✓ Wrote {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    build()
