"""
modules/news_digest.py

Aggregates and summarises daily Product Management and AI news for Yoda.

Sources:
  - Hacker News (Algolia API) — top PM/AI stories
  - Product Hunt — new AI products
  - RSS feeds — Lenny's Newsletter, Reforge, Ben Evans, etc.
"""

import os
import logging
import hashlib
import feedparser
import requests
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Optional

from modules.model_router import route, TaskType

logger = logging.getLogger("yoda.news_digest")

RSS_FEEDS = {
    "Lenny's Newsletter": "https://www.lennysnewsletter.com/feed",
    "Reforge": "https://www.reforge.com/blog/rss.xml",
    "Product Hunt Daily": "https://www.producthunt.com/feed",
    "Benedict Evans": "https://www.ben-evans.com/benedictevans?format=rss",
    "The Verge (AI)": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    "TechCrunch (AI)": "https://techcrunch.com/category/artificial-intelligence/feed/",
}

TAG_KEYWORDS = {
    "[strategy]": ["strategy", "roadmap", "prioritis", "framework", "vision"],
    "[tools]": ["tool", "launch", "product hunt", "release", "api", "sdk"],
    "[research]": ["paper", "research", "study", "benchmark", "model", "llm"],
    "[jobs]": ["hiring", "layoff", "headcount", "talent", "role", "team"],
    "[interview-prep]": ["pm interview", "product sense", "metrics", "case study"],
}


@dataclass
class NewsItem:
    title: str
    url: str
    source: str
    published: Optional[str] = None
    summary: Optional[str] = None
    tag: str = "[general]"
    uid: str = field(default="")

    def __post_init__(self):
        if not self.uid:
            self.uid = hashlib.md5(self.url.encode()).hexdigest()[:8]


def _tag_item(title: str, summary: str = "") -> str:
    text = (title + " " + (summary or "")).lower()
    for tag, keywords in TAG_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return tag
    return "[general]"


def _is_recent(published_str: Optional[str], hours: int = 36) -> bool:
    if not published_str:
        return True  # Include if we can't determine age
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(published_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
        return dt >= cutoff
    except Exception:
        return True


def _fetch_rss(name: str, url: str) -> list[NewsItem]:
    items = []
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:10]:
            if not _is_recent(entry.get("published")):
                continue
            item = NewsItem(
                title=entry.get("title", "No title"),
                url=entry.get("link", "#"),
                source=name,
                published=entry.get("published"),
                summary=entry.get("summary", "")[:300] if entry.get("summary") else None,
                tag=_tag_item(entry.get("title", ""), entry.get("summary", "")),
            )
            items.append(item)
        logger.info(f"RSS '{name}': fetched {len(items)} recent items")
    except Exception as e:
        logger.warning(f"RSS fetch failed for '{name}': {e}")
    return items


def _fetch_hackernews() -> list[NewsItem]:
    items = []
    try:
        url = "https://hn.algolia.com/api/v1/search"
        params = {
            "query": "product manager OR AI product OR LLM product",
            "tags": "story",
            "numericFilters": "created_at_i>{}".format(
                int((datetime.now(timezone.utc) - timedelta(hours=36)).timestamp())
            ),
            "hitsPerPage": 10,
        }
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        hits = resp.json().get("hits", [])
        for hit in hits:
            item = NewsItem(
                title=hit.get("title", "No title"),
                url=hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID')}",
                source="Hacker News",
                published=hit.get("created_at"),
                tag=_tag_item(hit.get("title", "")),
            )
            items.append(item)
        logger.info(f"Hacker News: fetched {len(items)} items")
    except Exception as e:
        logger.warning(f"HN fetch failed: {e}")
    return items


def _summarise_batch(items: list[NewsItem]) -> list[NewsItem]:
    """Use Claude to summarise news items in batch."""
    if not items:
        return items

    titles_and_snippets = "\n\n".join(
        [
            f"ITEM {i+1}:\nTitle: {item.title}\nSnippet: {item.summary or 'N/A'}"
            for i, item in enumerate(items[:15])
        ]
    )

    system = (
        "You are Yoda's news analyst. For each item, write exactly one sentence (max 20 words) "
        "explaining why this matters to an AI Product Manager. Be specific and direct. "
        "Output format: 'ITEM N: [one sentence]' for each item."
    )

    try:
        response = route(titles_and_snippets, task_type=TaskType.REASONING, system=system)
        lines = [l.strip() for l in response.strip().split("\n") if l.strip()]
        summaries = {}
        for line in lines:
            if line.startswith("ITEM ") and ":" in line:
                parts = line.split(":", 1)
                try:
                    idx = int(parts[0].replace("ITEM", "").strip()) - 1
                    summaries[idx] = parts[1].strip()
                except ValueError:
                    pass

        for i, item in enumerate(items[:15]):
            if i in summaries:
                item.summary = summaries[i]
    except Exception as e:
        logger.warning(f"Summarisation failed: {e}")

    return items


def _deduplicate(items: list[NewsItem]) -> list[NewsItem]:
    seen_uids = set()
    seen_titles = set()
    unique = []
    for item in items:
        title_key = item.title.lower()[:60]
        if item.uid not in seen_uids and title_key not in seen_titles:
            seen_uids.add(item.uid)
            seen_titles.add(title_key)
            unique.append(item)
    return unique


def get_news_digest(max_items: int = 15) -> list[NewsItem]:
    """Main entry: fetch, deduplicate, summarise, and return news items."""
    all_items = []

    # Fetch from all RSS sources
    for name, url in RSS_FEEDS.items():
        all_items.extend(_fetch_rss(name, url))

    # Fetch from Hacker News
    all_items.extend(_fetch_hackernews())

    logger.info(f"Total raw items: {len(all_items)}")

    # Deduplicate
    items = _deduplicate(all_items)
    logger.info(f"After dedup: {len(items)}")

    # Sort by source priority (Lenny's > Reforge > others)
    priority_sources = ["Lenny's Newsletter", "Reforge"]
    items.sort(key=lambda x: (0 if x.source in priority_sources else 1, x.source))

    # Summarise top items
    items = _summarise_batch(items[:max_items])

    return items[:max_items]
