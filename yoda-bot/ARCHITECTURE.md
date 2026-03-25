# 🏗️ YODA — Architecture & System Design

## Overview

Yoda is a **scheduled, modular Python application** that runs daily on a Mac Mini. It coordinates multiple AI APIs and external services to produce a single curated daily output — saved locally as Markdown and optionally synced to Notion.

---

## High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     YODA DAILY RUN                          │
│                                                             │
│  [Scheduler: cron / launchd]                                │
│           │                                                 │
│           ▼                                                 │
│     yoda.py (orchestrator)                                  │
│           │                                                 │
│     ┌─────┼──────────────────────────┐                      │
│     ▼     ▼                          ▼                      │
│  Jobs   News                    model_router.py             │
│  Finder Digest  ──── uses ────►  (Gemini / Claude / GPT)    │
│     │     │                                                 │
│     └─────┼──────────────────────────┐                      │
│           ▼                          ▼                      │
│     report_builder.py          notion_sync.py               │
│           │                          │                      │
│           ▼                          ▼                      │
│    /logs/YYYY-MM-DD.md       Notion Database Page           │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### `yoda.py` — Orchestrator
- Entry point for all runs
- Accepts `--run-now`, `--module [name]`, `--dry-run` flags
- Loads config from `.env`
- Calls each module in sequence
- Handles top-level errors and logs them

### `modules/job_finder.py`
- Queries job sources via SerpAPI or direct scraping
- Deduplicates by URL hash
- Scores and ranks results against user preferences
- Returns a structured list of `JobListing` dataclass objects

### `modules/news_digest.py`
- Pulls from RSS feeds and direct APIs (Product Hunt, HN Algolia API)
- Filters by freshness (< 24h by default)
- Passes headlines + snippets to Claude for summarisation
- Returns tagged, ranked `NewsItem` list

### `modules/model_router.py`
- Centralised AI dispatch layer
- Routes to Gemini, Claude, or GPT based on task type
- Implements retry with exponential backoff
- Tracks token usage per run (logged to `logs/usage.jsonl`)

### `modules/notion_sync.py`
- Creates/updates pages in configured Notion database
- Maps job listings and news items to Notion properties
- Archives entries older than 30 days automatically

### `modules/report_builder.py`
- Assembles final Markdown report from all module outputs
- Applies Yoda's character format (greeting, structure, closer)
- Saves to `/logs/YYYY-MM-DD.md`

---

## Data Flow (Detailed)

```
1. Scheduler triggers yoda.py
2. Config loaded from config/.env
3. job_finder.py:
   a. Builds search queries from JOB_SEARCH_KEYWORDS
   b. Calls SerpAPI (or fallback) for each query
   c. Deduplicates, scores, returns top N
4. news_digest.py:
   a. Fetches RSS feeds + HN API
   b. Filters by recency
   c. Sends to Claude for summarisation
   d. Returns tagged items
5. model_router.py used throughout steps 3–4
6. report_builder.py compiles everything
7. notion_sync.py pushes to Notion (if configured)
8. Log written to /logs/
9. Run metadata appended to logs/run_history.jsonl
```

---

## Configuration Reference

All settings live in `config/.env` (never committed to git).

| Key | Description | Required |
|---|---|---|
| `GOOGLE_API_KEY` | Google AI Studio API key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NOTION_API_KEY` | Notion integration token | Optional |
| `NOTION_DATABASE_ID` | Target Notion database | Optional |
| `JOB_SEARCH_KEYWORDS` | Comma-separated job titles | Yes |
| `JOB_LOCATION` | Comma-separated locations | Yes |
| `DAILY_RUN_TIME` | HH:MM in 24h format | Yes |
| `TIMEZONE` | IANA timezone string | Yes |

---

## Error Handling Strategy

| Error Type | Behaviour |
|---|---|
| API timeout | Retry 3x with exponential backoff, then skip module |
| API rate limit | Wait and retry once; if still limited, skip and flag in report |
| Missing API key | Hard fail at startup with clear error message |
| No jobs found | Report empty with timestamp — never silently skip |
| Notion sync failure | Log error, continue — local Markdown is always written |

---

## Scheduling (macOS)

Yoda uses **launchd** (preferred on macOS) via a `.plist` file:

```xml
<!-- config/com.yoda.daily.plist -->
<key>StartCalendarInterval</key>
<dict>
    <key>Hour</key><integer>7</integer>
    <key>Minute</key><integer>30</integer>
</dict>
```

Load it with:
```bash
launchctl load ~/Library/LaunchAgents/com.yoda.daily.plist
```

---

## Logging

| File | Contents |
|---|---|
| `logs/YYYY-MM-DD.md` | Full daily report |
| `logs/yoda.log` | Runtime logs (stdout/stderr) |
| `logs/run_history.jsonl` | Per-run metadata (start time, module status, item counts) |
| `logs/usage.jsonl` | Token usage per API per run |

---

## Future Architecture Considerations

- [ ] Web dashboard (FastAPI + React) for browsing past reports
- [ ] Email delivery via SMTP
- [ ] Slack/Discord webhook output (no WhatsApp — by design)
- [ ] Vector store for semantic dedup across historical runs
- [ ] Fine-tuned ranking model trained on user click history
