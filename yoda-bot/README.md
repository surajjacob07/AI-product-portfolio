# 🟢 YODA — Your Operational Daily Assistant

> *"Do or do not. There is no try."*

**Yoda** is a personal AI assistant bot built for daily productivity — a wise, no-nonsense digital companion that finds product management jobs, delivers curated PM news, and runs background tasks so you don't have to. It runs on a **Mac Mini**, uses APIs from **Google Gemini (AI Studio)**, **Anthropic Claude**, **OpenAI**, and integrates with tools like **Notion** and other productivity services.

Yoda is not connected to WhatsApp or any messaging platform by default. It operates as a **local-first automation engine**, triggered by schedule or on-demand.

---

## 🧠 Personality & Nature

Yoda is calm, wise, direct, and occasionally cryptic — just like his namesake. He doesn't waste words. When he gives you something, it's relevant. When he skips something, it wasn't worth your time.

| Trait | Description |
|---|---|
| **Tone** | Measured, insightful, occasionally dry |
| **Voice** | First-person when reporting, Yoda-style quips on greetings |
| **Priorities** | Signal over noise. Relevance over volume |
| **Quirks** | Timestamps everything. Never repeats itself. Will tell you if data is stale |

> *"Much to learn, you still have. But today's PM jobs? Gathered, I have."*

---

## ⚡ What Yoda Can Do

### 🔍 Job Discovery
- Searches for **Product Management** and **AI Product Manager** roles daily
- Sources: LinkedIn, Indeed, Glassdoor, Wellfound (AngelList), company career pages
- Filters by: location, remote/hybrid, seniority level, company size
- Deduplicates across sources
- Outputs a ranked, clean list with links

### 📰 PM & AI News Digest
- Aggregates top Product Management news from Lenny's Newsletter, Reforge, Product Hunt, Hacker News
- Pulls AI-specific updates: new model releases, AI product launches, research papers
- Summarises each item in 2–3 lines
- Tags items: `[strategy]` `[tools]` `[jobs]` `[research]` `[interview-prep]`

### 🤖 AI Model Routing
- Routes tasks to the **best-fit model**:
  - **Gemini (Google AI Studio)** → web search, real-time grounding
  - **Claude (Anthropic)** → reasoning, summarisation, document tasks
  - **GPT-4o (OpenAI)** → structured output, code tasks, fallback

### 📋 Daily Briefing
- Compiles everything into a single daily report
- Saved as Markdown locally and optionally pushed to Notion
- Delivered at a scheduled time each morning

### 🗂️ Notion Integration
- Creates and updates Notion pages with job listings
- Logs daily digests to a Notion database
- Tags, sorts, and archives entries automatically

---

## 🖥️ Setup on Mac Mini

### Hardware & OS
- **Machine**: Apple Mac Mini (M-series recommended)
- **OS**: macOS 13 Ventura or later
- **Python**: 3.11+
- **Shell**: zsh (default on macOS)

### Prerequisites

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.11

# Install pip dependencies manager
pip install --upgrade pip
```

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/yoda-bot.git
cd yoda-bot
```

### 2. Create a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure API Keys

Copy the example config and fill in your keys:

```bash
cp config/config.example.env config/.env
```

Edit `config/.env`:

```env
# Google AI Studio (Gemini)
GOOGLE_API_KEY=your_google_ai_studio_key_here

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_key_here

# OpenAI
OPENAI_API_KEY=your_openai_key_here

# Notion
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id

# Job Search Preferences
JOB_SEARCH_KEYWORDS=AI Product Manager, Product Manager AI, Head of Product
JOB_LOCATION=Remote, Bangalore, Mumbai
JOB_EXPERIENCE_LEVEL=mid,senior

# Scheduling
DAILY_RUN_TIME=07:30
TIMEZONE=Asia/Kolkata
```

### 5. Run Setup Check

```bash
python scripts/check_setup.py
```

### 6. Run Yoda Manually (First Test)

```bash
python yoda.py --run-now
```

### 7. Schedule Daily Runs via cron (Mac)

```bash
# Open crontab
crontab -e

# Add this line to run Yoda at 7:30 AM daily
30 7 * * * /path/to/yoda-bot/venv/bin/python /path/to/yoda-bot/yoda.py >> /path/to/yoda-bot/logs/yoda.log 2>&1
```

Or use **launchd** (macOS preferred):

```bash
cp config/com.yoda.daily.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.yoda.daily.plist
```

---

## 📁 Repository Structure

```
yoda-bot/
│
├── yoda.py                  # Main entry point
├── requirements.txt         # Python dependencies
├── README.md                # This file
│
├── config/
│   ├── config.example.env   # Template for environment variables
│   ├── com.yoda.daily.plist # macOS launchd schedule file
│   └── preferences.yaml     # Job search & digest preferences
│
├── modules/
│   ├── job_finder.py        # Job scraping & aggregation logic
│   ├── news_digest.py       # PM & AI news aggregation
│   ├── model_router.py      # AI model routing (Gemini/Claude/GPT)
│   ├── notion_sync.py       # Notion API integration
│   └── report_builder.py    # Compiles daily briefing
│
├── scripts/
│   ├── check_setup.py       # Validates API keys and dependencies
│   └── manual_run.py        # Run individual modules standalone
│
├── docs/
│   ├── PERSONALITY.md       # Yoda's character guide
│   ├── ARCHITECTURE.md      # System design and flow
│   └── CHANGELOG.md         # Version history
│
├── logs/                    # Auto-generated log files
│   └── .gitkeep
│
└── .github/
    └── ISSUE_TEMPLATE.md
```

---

## 🔌 API & Service Dependencies

| Service | Purpose | Free Tier? |
|---|---|---|
| Google AI Studio (Gemini) | Web-grounded search, real-time data | ✅ Yes |
| Anthropic Claude | Reasoning, summarisation | ✅ Limited |
| OpenAI GPT-4o | Fallback, structured tasks | ❌ Paid |
| Notion API | Storage, organisation | ✅ Yes |
| SerpAPI / Serper | Web/job search results | ✅ Limited |

---

## ⚠️ Limitations

| Limitation | Notes |
|---|---|
| **No real-time messaging** | Yoda is not connected to WhatsApp, Telegram, or SMS. Output is local Markdown + Notion |
| **Job data is best-effort** | Scraped sources may change structure; expect occasional gaps |
| **Rate limits apply** | Free tiers on Gemini/Claude have daily caps — monitor usage |
| **No memory across sessions** | Each run is stateless. Context is rebuilt from logs and Notion each time |
| **Mac-only launchd scheduler** | The `.plist` scheduler is macOS-specific; Linux users should use `cron` |
| **No UI** | Yoda is CLI + Notion only. No web dashboard (yet) |
| **Internet required** | All API calls require active connection. No offline fallback |

---

## 🧩 Extending Yoda

Want to add a new capability? Follow this pattern:

1. Create a new module in `modules/`
2. Register it in `yoda.py` under the task runner
3. Add relevant API keys to `config/.env`
4. Update `preferences.yaml` with user-configurable settings
5. Document it here in README

---

## 📜 License

MIT License — use freely, credit appreciated.

---

## 🙏 Built With

- [LangChain](https://www.langchain.com/) — orchestration layer
- [Google Generative AI Python SDK](https://github.com/google-gemini/generative-ai-python)
- [Anthropic Python SDK](https://github.com/anthropic-ai/anthropic-sdk-python)
- [OpenAI Python SDK](https://github.com/openai/openai-python)
- [Notion SDK for Python](https://github.com/ramnes/notion-sdk-py)
- [APScheduler](https://apscheduler.readthedocs.io/) — scheduling

---

> *"When you look at the dark side, careful you must be. For the dark side looks back."*
> — Yoda (and also good advice for reading unfiltered job listings)
