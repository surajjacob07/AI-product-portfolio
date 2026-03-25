"""
yoda.py — Main orchestrator for the Yoda Personal AI Assistant

"Do or do not. There is no try." — Yoda

Usage:
    python yoda.py                   # Standard daily run
    python yoda.py --run-now         # Force immediate run
    python yoda.py --module jobs     # Run only job finder
    python yoda.py --module news     # Run only news digest
    python yoda.py --dry-run         # Run without saving or syncing
    python yoda.py --no-notion       # Skip Notion sync
"""

import argparse
import logging
import sys
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv("config/.env")

# Configure logging
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler(log_dir / "yoda.log"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger("yoda")


def greet():
    hour = datetime.now().hour
    if hour < 12:
        return "Good morning. Much to process, there is. Begin, we shall."
    elif hour < 17:
        return "Afternoon, it is. Late run detected. Proceed, we shall."
    else:
        return "Evening run, this is. Unusual, but acceptable."


def run_yoda(
    run_jobs: bool = True,
    run_news: bool = True,
    dry_run: bool = False,
    skip_notion: bool = False,
):
    """Main orchestration function."""
    run_start = datetime.now()
    logger.info("=" * 60)
    logger.info(f"YODA DAILY RUN — {run_start.strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f'"{greet()}"')
    logger.info("=" * 60)

    results = {
        "jobs": [],
        "news": [],
        "errors": [],
        "run_start": run_start.isoformat(),
    }

    # --- Job Finder ---
    if run_jobs:
        try:
            logger.info("MODULE: job_finder — starting")
            from modules.job_finder import find_jobs

            jobs = find_jobs()
            results["jobs"] = jobs
            logger.info(f"MODULE: job_finder — found {len(jobs)} listings")
        except Exception as e:
            logger.error(f"MODULE: job_finder — FAILED: {e}")
            results["errors"].append({"module": "job_finder", "error": str(e)})

    # --- News Digest ---
    if run_news:
        try:
            logger.info("MODULE: news_digest — starting")
            from modules.news_digest import get_news_digest

            news = get_news_digest()
            results["news"] = news
            logger.info(f"MODULE: news_digest — found {len(news)} items")
        except Exception as e:
            logger.error(f"MODULE: news_digest — FAILED: {e}")
            results["errors"].append({"module": "news_digest", "error": str(e)})

    # --- Build Report ---
    try:
        logger.info("MODULE: report_builder — compiling report")
        from modules.report_builder import build_report

        report_path = build_report(results, dry_run=dry_run)
        logger.info(f"MODULE: report_builder — saved to {report_path}")
    except Exception as e:
        logger.error(f"MODULE: report_builder — FAILED: {e}")
        results["errors"].append({"module": "report_builder", "error": str(e)})

    # --- Notion Sync ---
    if not skip_notion and not dry_run:
        try:
            logger.info("MODULE: notion_sync — syncing to Notion")
            from modules.notion_sync import sync_to_notion

            sync_to_notion(results)
            logger.info("MODULE: notion_sync — complete")
        except Exception as e:
            logger.error(f"MODULE: notion_sync — FAILED (non-fatal): {e}")
            results["errors"].append({"module": "notion_sync", "error": str(e)})

    # --- Run Summary ---
    run_end = datetime.now()
    duration = (run_end - run_start).total_seconds()
    logger.info("=" * 60)
    logger.info(f"RUN COMPLETE in {duration:.1f}s")
    logger.info(f"  Jobs found:   {len(results['jobs'])}")
    logger.info(f"  News items:   {len(results['news'])}")
    logger.info(f"  Errors:       {len(results['errors'])}")
    logger.info('"Done, it is. Your briefing awaits." — Yoda')
    logger.info("=" * 60)

    # Log run metadata
    import json
    with open(log_dir / "run_history.jsonl", "a") as f:
        f.write(json.dumps({
            "run_start": run_start.isoformat(),
            "run_end": run_end.isoformat(),
            "duration_seconds": duration,
            "jobs_found": len(results["jobs"]),
            "news_found": len(results["news"]),
            "errors": results["errors"],
            "dry_run": dry_run,
        }) + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Yoda — Your Operational Daily Assistant"
    )
    parser.add_argument(
        "--run-now", action="store_true", help="Force immediate run"
    )
    parser.add_argument(
        "--module",
        choices=["jobs", "news"],
        help="Run only a specific module",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without saving files or syncing to Notion",
    )
    parser.add_argument(
        "--no-notion",
        action="store_true",
        help="Skip Notion sync",
    )

    args = parser.parse_args()

    run_jobs = True
    run_news = True

    if args.module == "jobs":
        run_news = False
    elif args.module == "news":
        run_jobs = False

    run_yoda(
        run_jobs=run_jobs,
        run_news=run_news,
        dry_run=args.dry_run,
        skip_notion=args.no_notion,
    )


if __name__ == "__main__":
    main()
