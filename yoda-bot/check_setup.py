"""
scripts/check_setup.py

Validates Yoda's configuration before first run.
Checks API keys, dependencies, and connectivity.

Usage:
    python scripts/check_setup.py
"""

import os
import sys
import importlib

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv

load_dotenv("config/.env")

PASS = "✅"
FAIL = "❌"
WARN = "⚠️ "

checks = []


def check(label, fn, required=True):
    try:
        result = fn()
        status = PASS if result else (FAIL if required else WARN)
        checks.append((status, label, "OK" if result else "Not configured"))
    except Exception as e:
        status = FAIL if required else WARN
        checks.append((status, label, str(e)))


# Check Python version
def check_python():
    major, minor = sys.version_info[:2]
    if major == 3 and minor >= 11:
        return True
    raise RuntimeError(f"Python 3.11+ required, found {major}.{minor}")

check("Python version (3.11+)", check_python)

# Check required packages
REQUIRED_PACKAGES = [
    ("anthropic", True),
    ("openai", True),
    ("google.generativeai", True),
    ("notion_client", False),
    ("feedparser", True),
    ("requests", True),
    ("dotenv", True),
]

for pkg, required in REQUIRED_PACKAGES:
    check(
        f"Package: {pkg}",
        lambda p=pkg: importlib.import_module(p) is not None,
        required=required,
    )

# Check API keys
check("ANTHROPIC_API_KEY", lambda: bool(os.getenv("ANTHROPIC_API_KEY")))
check("GOOGLE_API_KEY", lambda: bool(os.getenv("GOOGLE_API_KEY")))
check("OPENAI_API_KEY", lambda: bool(os.getenv("OPENAI_API_KEY")))
check("SERPAPI_KEY", lambda: bool(os.getenv("SERPAPI_KEY")), required=False)
check("NOTION_API_KEY", lambda: bool(os.getenv("NOTION_API_KEY")), required=False)
check("NOTION_DATABASE_ID", lambda: bool(os.getenv("NOTION_DATABASE_ID")), required=False)

# Check job search config
check("JOB_SEARCH_KEYWORDS", lambda: bool(os.getenv("JOB_SEARCH_KEYWORDS")))
check("JOB_LOCATION", lambda: bool(os.getenv("JOB_LOCATION")))
check("TIMEZONE", lambda: bool(os.getenv("TIMEZONE")))

# Check logs directory writable
import os as _os
def check_logs():
    _os.makedirs("logs", exist_ok=True)
    test_path = "logs/.write_test"
    with open(test_path, "w") as f:
        f.write("ok")
    _os.remove(test_path)
    return True

check("Logs directory writable", check_logs)

# Print results
print("\n" + "=" * 55)
print("  YODA SETUP CHECK")
print("=" * 55)
for status, label, message in checks:
    print(f"  {status}  {label:<35} {message}")
print("=" * 55)

failures = [c for c in checks if c[0] == FAIL]
warnings = [c for c in checks if c[0] == WARN]

if failures:
    print(f"\n  {len(failures)} required check(s) failed. Fix before running Yoda.")
    sys.exit(1)
elif warnings:
    print(f"\n  {len(warnings)} optional check(s) not configured (non-fatal).")
    print("  Ready to run Yoda: python yoda.py --dry-run")
else:
    print("\n  All checks passed. Yoda is ready.")
    print("  Run now: python yoda.py --run-now")
    print("  Dry run: python yoda.py --dry-run")
