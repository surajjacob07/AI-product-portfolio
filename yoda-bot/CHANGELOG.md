# CHANGELOG

## v1.0.0 — Initial Release

### Added
- `yoda.py` — main orchestrator with CLI flags (`--run-now`, `--dry-run`, `--module`, `--no-notion`)
- `modules/job_finder.py` — job search via SerpAPI with scoring and deduplication
- `modules/news_digest.py` — RSS + Hacker News aggregation with Claude summarisation
- `modules/model_router.py` — AI model routing (Gemini → Claude → GPT fallback chain)
- `modules/report_builder.py` — Yoda-formatted Markdown daily report
- `modules/notion_sync.py` — Notion database sync
- `scripts/check_setup.py` — pre-flight configuration validator
- `config/com.yoda.daily.plist` — macOS launchd scheduler
- `docs/PERSONALITY.md` — Yoda character guide
- `docs/ARCHITECTURE.md` — system design documentation
- `README.md` — full setup and usage documentation

### Limitations
- No WhatsApp or messaging integration (by design)
- No web UI (CLI + Notion only)
- SerpAPI required for job search (paid after free tier)
- Stateless between runs (no persistent memory)
