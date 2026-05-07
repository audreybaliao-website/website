#!/usr/bin/env python3
"""Helper for scripts/audit — scans every tracked file for a GitHub
Personal Access Token. Reads file paths from stdin (one per line), prints
matching paths to stdout. PDF files are decoded via pypdf because their
text streams are zlib-compressed and invisible to plain grep/strings."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

TOKEN_RE = re.compile(r"github_pat_[A-Za-z0-9_]{20,}")


def scan(path: Path) -> bool:
    suffix = path.suffix.lower()

    # PDFs: decompress and extract text first.
    if suffix == ".pdf":
        try:
            from pypdf import PdfReader

            reader = PdfReader(str(path))
            text = "".join(page.extract_text() or "" for page in reader.pages)
            if TOKEN_RE.search(text):
                return True
        except Exception:
            pass  # Fall through to binary scan

    # Generic: read raw bytes, decode loosely, search.
    try:
        blob = path.read_bytes()
        if TOKEN_RE.search(blob.decode("latin-1", errors="ignore")):
            return True
    except Exception:
        pass

    # Last resort: strings(1) for compiled binaries with weird encodings.
    try:
        out = subprocess.run(
            ["strings", str(path)],
            capture_output=True,
            text=True,
            timeout=10,
        ).stdout
        if TOKEN_RE.search(out):
            return True
    except Exception:
        pass

    return False


def main() -> int:
    for line in sys.stdin:
        f = line.rstrip()
        if not f:
            continue
        p = Path(f)
        if not p.is_file():
            continue
        if scan(p):
            print(f)
    return 0


if __name__ == "__main__":
    sys.exit(main())
