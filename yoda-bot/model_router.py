"""
modules/model_router.py

Centralised AI model dispatch for Yoda.
Routes tasks to the best-fit model based on task type.

Routing logic:
  - real_time / search  → Gemini (Google AI Studio)
  - reasoning / summary → Claude (Anthropic)
  - structured / code   → GPT-4o (OpenAI)
"""

import os
import time
import logging
from enum import Enum
from typing import Optional

logger = logging.getLogger("yoda.model_router")


class TaskType(Enum):
    REAL_TIME = "real_time"      # Web search, live data
    REASONING = "reasoning"     # Analysis, summarisation
    STRUCTURED = "structured"   # JSON output, code tasks


def call_claude(
    prompt: str,
    system: Optional[str] = None,
    max_tokens: int = 1500,
) -> str:
    """Call Anthropic Claude for reasoning/summarisation tasks."""
    import anthropic

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    messages = [{"role": "user", "content": prompt}]

    kwargs = {"model": "claude-opus-4-5", "max_tokens": max_tokens, "messages": messages}
    if system:
        kwargs["system"] = system

    response = client.messages.create(**kwargs)
    return response.content[0].text


def call_gemini(prompt: str, max_tokens: int = 1500) -> str:
    """Call Google Gemini for real-time/web-grounded tasks."""
    import google.generativeai as genai

    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    return response.text


def call_gpt(
    prompt: str,
    system: Optional[str] = None,
    response_format: Optional[str] = None,
    max_tokens: int = 1500,
) -> str:
    """Call OpenAI GPT-4o for structured output or fallback tasks."""
    from openai import OpenAI

    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    kwargs = {
        "model": "gpt-4o",
        "max_tokens": max_tokens,
        "messages": messages,
    }
    if response_format == "json":
        kwargs["response_format"] = {"type": "json_object"}

    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content


def route(
    prompt: str,
    task_type: TaskType = TaskType.REASONING,
    system: Optional[str] = None,
    max_retries: int = 3,
    fallback: bool = True,
) -> str:
    """
    Route a prompt to the appropriate model based on task type.
    Retries with exponential backoff, then falls back to next model.
    """
    primary_fn, fallback_fns = _get_model_chain(task_type, system)

    for attempt in range(max_retries):
        try:
            logger.debug(f"Routing to primary model (attempt {attempt + 1})")
            return primary_fn(prompt)
        except Exception as e:
            wait = 2 ** attempt
            logger.warning(f"Primary model failed (attempt {attempt + 1}): {e}. Retrying in {wait}s")
            time.sleep(wait)

    if fallback:
        for fn_name, fn in fallback_fns:
            try:
                logger.info(f"Falling back to: {fn_name}")
                return fn(prompt)
            except Exception as e:
                logger.warning(f"Fallback {fn_name} also failed: {e}")

    raise RuntimeError(f"All models failed for task type: {task_type.value}")


def _get_model_chain(task_type: TaskType, system: Optional[str]):
    """Returns (primary_fn, [(name, fallback_fn), ...]) for given task type."""

    if task_type == TaskType.REAL_TIME:
        primary = lambda p: call_gemini(p)
        fallbacks = [
            ("claude", lambda p: call_claude(p, system=system)),
            ("gpt", lambda p: call_gpt(p, system=system)),
        ]

    elif task_type == TaskType.REASONING:
        primary = lambda p: call_claude(p, system=system)
        fallbacks = [
            ("gemini", lambda p: call_gemini(p)),
            ("gpt", lambda p: call_gpt(p, system=system)),
        ]

    else:  # STRUCTURED
        primary = lambda p: call_gpt(p, system=system, response_format="json")
        fallbacks = [
            ("claude", lambda p: call_claude(p, system=system)),
            ("gemini", lambda p: call_gemini(p)),
        ]

    return primary, fallbacks
