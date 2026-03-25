"""
modules/notion_sync.py

Syncs Yoda's daily output to a Notion database.
Creates a new page per run with jobs and news sections.
"""

import os
import logging
from datetime import datetime

logger = logging.getLogger("yoda.notion_sync")


def _get_client():
    from notion_client import Client
    return Client(auth=os.environ["NOTION_API_KEY"])


def _build_job_blocks(jobs: list) -> list:
    blocks = [
        {
            "object": "block",
            "type": "heading_2",
            "heading_2": {
                "rich_text": [{"type": "text", "text": {"content": f"🟢 Jobs ({len(jobs)} found)"}}]
            },
        }
    ]
    for job in jobs:
        content = f"{job.title} @ {job.company} | {job.location} | ★ {job.match_score:.0f}%"
        blocks.append({
            "object": "block",
            "type": "bulleted_list_item",
            "bulleted_list_item": {
                "rich_text": [
                    {"type": "text", "text": {"content": content}},
                    {"type": "text", "text": {"content": " ", "link": {"url": job.url}}},
                ]
            },
        })
    return blocks


def _build_news_blocks(news: list) -> list:
    blocks = [
        {
            "object": "block",
            "type": "heading_2",
            "heading_2": {
                "rich_text": [{"type": "text", "text": {"content": f"📰 News ({len(news)} items)"}}]
            },
        }
    ]
    for item in news:
        content = f"{item.tag} {item.title}"
        if item.summary:
            content += f"\n→ {item.summary}"
        blocks.append({
            "object": "block",
            "type": "bulleted_list_item",
            "bulleted_list_item": {
                "rich_text": [{"type": "text", "text": {"content": content}}]
            },
        })
    return blocks


def sync_to_notion(results: dict) -> str:
    """
    Create a new Notion page for today's briefing.
    Returns the URL of the created page.
    """
    database_id = os.environ.get("NOTION_DATABASE_ID")
    if not database_id:
        logger.warning("NOTION_DATABASE_ID not set — skipping Notion sync")
        return ""

    client = _get_client()
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    title = f"Yoda Briefing — {date_str}"

    jobs = results.get("jobs", [])
    news = results.get("news", [])

    children = []
    children += _build_job_blocks(jobs)
    children += [{"object": "block", "type": "divider", "divider": {}}]
    children += _build_news_blocks(news)

    errors = results.get("errors", [])
    if errors:
        children.append({
            "object": "block",
            "type": "callout",
            "callout": {
                "rich_text": [{"type": "text", "text": {"content": f"⚠ {len(errors)} module error(s) — check logs"}}],
                "icon": {"emoji": "⚠️"},
            },
        })

    page = client.pages.create(
        parent={"database_id": database_id},
        properties={
            "Name": {
                "title": [{"type": "text", "text": {"content": title}}]
            },
            "Date": {
                "date": {"start": date_str}
            },
            "Jobs Found": {
                "number": len(jobs)
            },
            "News Items": {
                "number": len(news)
            },
        },
        children=children,
    )

    page_url = page.get("url", "")
    logger.info(f"Notion page created: {page_url}")
    return page_url
