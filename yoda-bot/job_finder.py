"""
modules/job_finder.py

Finds and ranks Product Management job listings for Yoda's daily briefing.
Sources: SerpAPI job search (Google Jobs), with deduplication and scoring.
"""

import os
import hashlib
import logging
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

from modules.model_router import route, TaskType

logger = logging.getLogger("yoda.job_finder")


@dataclass
class JobListing:
    title: str
    company: str
    location: str
    url: str
    source: str
    posted_date: Optional[str] = None
    salary: Optional[str] = None
    job_type: Optional[str] = None
    match_score: float = 0.0
    match_reason: str = ""
    uid: str = field(default="")

    def __post_init__(self):
        if not self.uid:
            self.uid = hashlib.md5(self.url.encode()).hexdigest()[:8]


def _get_preferences() -> dict:
    keywords_raw = os.getenv("JOB_SEARCH_KEYWORDS", "Product Manager, AI Product Manager")
    location_raw = os.getenv("JOB_LOCATION", "Remote")
    keywords = [k.strip() for k in keywords_raw.split(",")]
    locations = [l.strip() for l in location_raw.split(",")]
    return {"keywords": keywords, "locations": locations}


def _search_jobs_serpapi(query: str, location: str) -> list[dict]:
    """Search Google Jobs via SerpAPI."""
    try:
        from serpapi import GoogleSearch  # pip install google-search-results

        params = {
            "engine": "google_jobs",
            "q": query,
            "location": location,
            "api_key": os.environ.get("SERPAPI_KEY", ""),
            "chips": "date_posted:today",
        }
        search = GoogleSearch(params)
        results = search.get_dict()
        return results.get("jobs_results", [])
    except ImportError:
        logger.warning("serpapi not installed — skipping SerpAPI source")
        return []
    except Exception as e:
        logger.warning(f"SerpAPI search failed for '{query}' in '{location}': {e}")
        return []


def _parse_serpapi_job(raw: dict) -> JobListing:
    return JobListing(
        title=raw.get("title", "Unknown Title"),
        company=raw.get("company_name", "Unknown Company"),
        location=raw.get("location", "Unknown"),
        url=raw.get("share_link") or raw.get("related_links", [{}])[0].get("link", "#"),
        source="Google Jobs / SerpAPI",
        posted_date=raw.get("detected_extensions", {}).get("posted_at"),
        salary=raw.get("detected_extensions", {}).get("salary"),
        job_type=raw.get("detected_extensions", {}).get("schedule_type"),
    )


def _score_job(job: JobListing, preferences: dict) -> tuple[float, str]:
    """Score a job listing against user preferences. Returns (score, reason)."""
    score = 0.0
    reasons = []

    keywords_lower = [k.lower() for k in preferences["keywords"]]
    title_lower = job.title.lower()

    # Title match
    for kw in keywords_lower:
        if kw in title_lower:
            score += 40
            reasons.append(f"title matches '{kw}'")
            break

    # AI-specific bonus
    ai_terms = ["ai", "artificial intelligence", "machine learning", "llm", "generative"]
    if any(term in title_lower for term in ai_terms):
        score += 20
        reasons.append("AI-focused role")

    # Recency bonus
    if job.posted_date:
        posted_lower = job.posted_date.lower()
        if "hour" in posted_lower or "today" in posted_lower:
            score += 20
            reasons.append("posted today")
        elif "day" in posted_lower and any(d in posted_lower for d in ["1 day", "2 day"]):
            score += 10
            reasons.append("posted recently")

    # Remote bonus
    if "remote" in job.location.lower():
        score += 10
        reasons.append("remote")

    reason_str = ", ".join(reasons) if reasons else "general match"
    return min(score, 100.0), reason_str


def _deduplicate(jobs: list[JobListing]) -> list[JobListing]:
    seen = set()
    unique = []
    for job in jobs:
        if job.uid not in seen:
            seen.add(job.uid)
            unique.append(job)
    return unique


def find_jobs(max_results: int = 10) -> list[JobListing]:
    """Main entry point: find, deduplicate, score, and rank job listings."""
    preferences = _get_preferences()
    raw_jobs = []

    for keyword in preferences["keywords"]:
        for location in preferences["locations"]:
            logger.info(f"Searching: '{keyword}' in '{location}'")
            raw = _search_jobs_serpapi(keyword, location)
            for r in raw:
                raw_jobs.append(_parse_serpapi_job(r))

    logger.info(f"Raw listings before dedup: {len(raw_jobs)}")
    jobs = _deduplicate(raw_jobs)
    logger.info(f"After deduplication: {len(jobs)}")

    # Score and sort
    for job in jobs:
        job.match_score, job.match_reason = _score_job(job, preferences)

    jobs.sort(key=lambda j: j.match_score, reverse=True)

    top_jobs = jobs[:max_results]

    # Use Claude to add brief summaries/context if we have results
    if top_jobs:
        try:
            job_titles = "\n".join([f"- {j.title} at {j.company}" for j in top_jobs])
            prompt = (
                f"You are helping a product manager evaluate job opportunities. "
                f"For each job below, write one short sentence (max 15 words) on why "
                f"it might be a strong opportunity for an AI product manager:\n\n{job_titles}"
            )
            _ = route(prompt, task_type=TaskType.REASONING)
            # Note: in production, parse the response and attach to jobs
        except Exception as e:
            logger.warning(f"Claude context enrichment skipped: {e}")

    logger.info(f"Returning {len(top_jobs)} ranked jobs")
    return top_jobs
