"""
modules/report_builder.py

Assembles Yoda's daily briefing report in Yoda's signature format.
Saves to /logs/YYYY-MM-DD.md
"""

import logging
from datetime import datetime
from pathlib import Path
from random import choice

from modules.job_finder import JobListing
from modules.news_digest import NewsItem

logger = logging.getLogger("yoda.report_builder")

YODA_CLOSERS = [
    "Patience you must have, my young Padawan.",
    "Do or do not. There is no try.",
    "When you look at the dark side, careful you must be.",
    "Difficult to see, always in motion is the future.",
    "Size matters not. Look at me. Judge me by my size, do you?",
    "Named must your fear be, before banish it you can.",
    "Much to learn, you still have.",
    "In a dark place we find ourselves — but opportunities, these listings are.",
    "Luminous beings are we, not this crude matter. Now go apply.",
]


def build_report(results: dict, dry_run: bool = False) -> Path:
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H:%M IST")

    jobs: list[JobListing] = results.get("jobs", [])
    news: list[NewsItem] = results.get("news", [])
    errors: list[dict] = results.get("errors", [])

    lines = []

    # Header
    lines += [
        "═" * 63,
        f"  YODA DAILY BRIEFING — {date_str}  {time_str}",
        "═" * 63,
        "",
    ]

    # Jobs Section
    lines += [
        f"🟢 JOBS FOUND TODAY — {len(jobs)} listings",
        "",
    ]

    if jobs:
        for i, job in enumerate(jobs, 1):
            lines.append(f"  {i}. **{job.title}** @ {job.company}")
            lines.append(f"     📍 {job.location}  |  💼 {job.job_type or 'Full-time'}")
            if job.salary:
                lines.append(f"     💰 {job.salary}")
            lines.append(f"     🔗 {job.url}")
            lines.append(f"     ★ Match: {job.match_score:.0f}% — {job.match_reason}")
            lines.append("")
    else:
        lines += [
            "  Quiet, the market is today.",
            "  Worth checking again tomorrow, it is.",
            "",
        ]

    # News Section
    lines += [
        "═" * 63,
        f"📰 PM & AI NEWS — {len(news)} items",
        "",
    ]

    if news:
        for item in news:
            lines.append(f"  {item.tag} **{item.title}**")
            if item.summary:
                lines.append(f"  → {item.summary}")
            lines.append(f"  🔗 [{item.source}]({item.url})")
            if item.published:
                lines.append(f"  📅 {item.published[:16]}")
            lines.append("")
    else:
        lines += [
            "  Silent, the feeds are today.",
            "  Unusual, this is.",
            "",
        ]

    # Notices / Errors
    if errors:
        lines += [
            "═" * 63,
            "⚠️  NOTICES",
            "",
        ]
        for err in errors:
            lines.append(f"  ⚠ Module `{err['module']}` encountered an issue: {err['error']}")
        lines.append("")

    # Footer
    closer = choice(YODA_CLOSERS)
    run_history_path = Path("logs/run_history.jsonl")
    run_count = 0
    if run_history_path.exists():
        with open(run_history_path) as f:
            run_count = sum(1 for _ in f)

    lines += [
        "═" * 63,
        f'  "{closer}"',
        f"  — Yoda  |  Run #{run_count + 1}  |  {date_str} {time_str}",
        "═" * 63,
    ]

    report_text = "\n".join(lines)

    if dry_run:
        logger.info("DRY RUN — report NOT saved to disk")
        print("\n" + report_text + "\n")
        return Path("(dry-run — not saved)")

    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    report_path = log_dir / f"{date_str}.md"

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_text)

    logger.info(f"Report saved: {report_path}")
    return report_path
