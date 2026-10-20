#!/usr/bin/env python3
"""REPORT.md -> REPORT.html -> REPORT.pdf (Chrome headless)."""
import os, re, subprocess, sys

sys.path.insert(0, "/home/mushigarou/AI_Lab/Nabta/docs/sdd/tools")
from md2html import render, reset_figures  # noqa: E402

ROOT = "/home/mushigarou/AI_Lab/chatsystem-audit"
MD = os.path.join(ROOT, "REPORT.md")
HTML = os.path.join(ROOT, "build", "REPORT.html")
PDF = os.path.join(ROOT, "REPORT.pdf")

CSS = """
@page { size: A4; margin: 16mm 15mm 18mm 15mm; }
body { font-family: 'Noto Sans','Liberation Sans',sans-serif; font-size: 10pt; color:#222830; line-height:1.45; }
h1 { color:#1F365D; font-size:18pt; border-bottom:3px solid #2E6FB5; padding-bottom:4px; margin-top:0; }
h2 { color:#1F365D; font-size:14pt; border-bottom:1px solid #C9D3E0; padding-bottom:3px; page-break-before:always; }
h2:first-of-type { page-break-before:auto; }
h3 { color:#2E6FB5; font-size:11.5pt; margin-bottom:4px; }
table { border-collapse:collapse; width:100%; margin:8px 0; font-size:8.6pt; page-break-inside:auto; }
th { background:#1F365D; color:#fff; text-align:left; padding:4px 6px; }
td { border-bottom:1px solid #E1E6EE; padding:3px 6px; vertical-align:top; }
tr { page-break-inside:avoid; }
tr:nth-child(even) td { background:#F4F6F9; }
code { font-family:'Liberation Mono',monospace; font-size:8.6pt; background:#EEF1F5; padding:0 3px; border-radius:2px; }
pre { background:#F4F6F9; border:1px solid #DDE3EB; padding:8px; font-size:8pt; white-space:pre-wrap; page-break-inside:avoid; }
pre code { background:none; padding:0; }
blockquote { border-left:4px solid #C96A12; background:#FBF3EA; margin:8px 0; padding:6px 10px; }
figure { margin:10px 0; text-align:center; page-break-inside:avoid; }
figure svg { max-width:100%; height:auto; max-height:200mm; }
figcaption { font-size:8.5pt; color:#555F6B; margin-top:4px; }
.fig-n { font-weight:bold; color:#1F365D; }
li { margin:2px 0; }
.cover { height:250mm; display:flex; flex-direction:column; justify-content:center; page-break-after:always; }
.cover h1 { font-size:30pt; border:none; }
.cover .sub { font-size:13pt; color:#555F6B; margin-top:6px; }
.cover .meta { margin-top:30px; font-size:10pt; color:#222830; line-height:1.8; }
.cover .bar { height:6px; width:120px; background:#2E6FB5; margin-bottom:18px; }
"""

COVER = """<div class='cover'><div class='bar'></div>
<h1>Chat System — Audit &amp; TODO</h1>
<div class='sub'>Bugs, security gaps, missing pieces and over-engineering</div>
<div class='meta'>Repository: https://github.com/HJB-2000/chatsystem<br>
Commit audited: <code>e62e910e</code> (“connect the front and back”)<br>
Date: 17/10/2026<br>
Method: full static read · build · unit tests · live boot (Postgres, Redis, Kafka) · smoke + impersonation probes</div></div>"""


def main():
    md = open(MD, encoding="utf-8").read()
    md = re.sub(r"\A# [^\n]*\n", "", md)
    # GitHub-style checkboxes -> glyphs (md2html does not know them).
    md = re.sub(r"^(\s*)[-*] \[ \] ", r"\1- ☐ ", md, flags=re.M)
    md = re.sub(r"^(\s*)[-*] \[x\] ", r"\1- ☑ ", md, flags=re.M)
    reset_figures()
    body = render(md, base=ROOT)
    html = (f"<!doctype html><html><head><meta charset='utf-8'><title>Chat System Audit</title>"
            f"<style>{CSS}</style></head><body>{COVER}{body}</body></html>")
    open(HTML, "w", encoding="utf-8").write(html)
    subprocess.run(["google-chrome", "--headless", "--disable-gpu", "--no-sandbox",
                    "--no-pdf-header-footer", f"--print-to-pdf={PDF}", f"file://{HTML}"],
                   check=True, capture_output=True, timeout=120)
    print("ok", PDF, os.path.getsize(PDF))


if __name__ == "__main__":
    main()
