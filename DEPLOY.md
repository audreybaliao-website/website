# Deploy your changes (Dhey Creates)

You only need **one** thing to push your latest changes live.

## The one button

**Double-click `Deploy.command`** at the root of this folder.

That's it. A Terminal window opens, runs through the steps, and tells you
when the live site is updating.

## What that one click actually does

```
You double-click Deploy.command
        │
        ▼
1. Runs the QA + security audit
   → If it finds a leaked password, a vulnerable
     library, or a script-injection risk: it BLOCKS
     the deploy and tells you what's wrong.
   → If it only finds small warnings (e.g. an em-dash
     in copy): it lets the deploy through.
        │
        ▼
2. Regenerates the User & Technical Manual PDF
   → The fresh audit results are baked into both
     parts of the manual automatically.
        │
        ▼
3. Commits everything to git
   → Uses a timestamped message like
     "Update on May 7, 2026 at 8:30 AM"
        │
        ▼
4. Pushes to GitHub
   → github.com/audreybaliao-website/website
        │
        ▼
5. Vercel notices the push and rebuilds the live site
   → Takes about 90 seconds. No action needed from you.
```

So one click → GitHub updated, manual refreshed, audit re-run, live site
rebuilt. All in about two minutes.

## What you should see

A Terminal window opens with output that looks like this:

```
========================================
   Audrey Baliao Portfolio: Deploy
========================================

🔎 Running pre-deploy audit...
... lots of OK lines ...
STATUS: passed

📄 Refreshing manuals...
   Done.

📦 Looking for changes since your last deploy...
✏️  Committed as: "Update on May 7, 2026 at 8:30 AM"

🚀 Pushing to GitHub...
✅ Push succeeded.
   Vercel will rebuild your live site in about 90 seconds.

Press any key to close...
```

When you see "Push succeeded," you're done. The window stays open until
you press a key, in case you want to read what happened.

## When something goes wrong

### "Audit blocked the deploy"

The audit found something serious (usually a password committed by
mistake, or a vulnerable library). The window will tell you what.

Open `docs/audit-latest.txt` in any text editor, look for the lines
starting with `FAIL`, fix what they describe, then double-click
`Deploy.command` again.

### "Push failed"

Almost always a GitHub access-token problem. Either:

- The token expired. Go to
  https://github.com/settings/personal-access-tokens (signed in as
  `audreybaliao-website`), generate a new one, and follow the steps in
  the manual's Section 2.8.
- Your computer just lost the network. Reconnect and re-run.

## Testing locally before deploying

Optional. If you want to see your changes in a browser before pushing
them live, open Terminal in this folder and run:

```
npm run dev
```

Then visit `http://localhost:3013`. Press Ctrl+C in Terminal when done.
Nothing on the live site changes until you double-click `Deploy.command`.

## What every deploy guarantees

Every time `Deploy.command` runs successfully:

1. The site has been audited for leaks and security issues.
2. The Manual PDF in `docs/` reflects the version of the site that's
   about to go live.
3. The audit log lives in `docs/audit-latest.txt` and is embedded into
   the manual itself, so anyone reading the PDF can see the QA result
   for that exact deploy.

You always get the same flow: audit → manual → commit → push → live.
