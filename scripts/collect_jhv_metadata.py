#!/usr/bin/env python3

from __future__ import annotations

import argparse
import ast
import json
import re
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Iterable

from api_communication import (
    CAMPAI_FINANCE_ACCOUNTS_ENDPOINT,
    CAMPAI_FINANCE_TRANSACTIONS_ENDPOINT,
    build_account_report,
    build_members,
    fetch_campai_members,
    fetch_from_finance_api,
)


ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"
DEFAULT_OUTPUT_DIR = ROOT / "scripts" / "out"

FRONTMATTER_KEY_RE = re.compile(r"^([A-Za-z0-9_\-]+):\s*(.*)$")
SPENDE_RE = re.compile(
    r"^spende:(?P<sign>[+-])(?P<amount>[^:]+):(?P<label>.+)$", re.IGNORECASE
)
EVENT_RE = re.compile(
    r"^veranstaltung:(?P<kind>kinderlicht|extern):(?P<label>.+)$", re.IGNORECASE
)
IMAGE_REF_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")


@dataclass(frozen=True)
class Article:
    path: Path
    title: str
    date: date
    short: str
    tags: tuple[str, ...]
    draft: bool
    featured_image: str | None
    body: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Collect JHV metadata (articles, members, tags) into a JSON file."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output JSON file. Defaults to scripts/out/jhv-metadata-YYYY.json",
    )
    parser.add_argument(
        "--reference-date",
        type=str,
        default=None,
        help="Optional reference date in YYYY-MM-DD format. Defaults to today.",
    )
    parser.add_argument(
        "--api-key",
        type=str,
        required=True,
        help="Campai API key used to fetch member data.",
    )
    parser.add_argument(
        "--finance-api-key",
        type=str,
        required=True,
        help="Campai Finance API key used to fetch financial data.",
    )
    return parser.parse_args()


def parse_date(value: str) -> date:
    return datetime.strptime(value.strip().strip('"').strip("'"), "%Y-%m-%d").date()


def parse_value(raw: str):
    value = raw.strip()
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    try:
        return ast.literal_eval(value)
    except Exception:
        return value.strip('"').strip("'")


def parse_frontmatter(text: str) -> tuple[dict[str, object], str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        raise ValueError("Missing frontmatter start marker")

    end_index = None
    for index in range(1, len(lines)):
        if lines[index].strip() == "---":
            end_index = index
            break

    if end_index is None:
        raise ValueError("Missing frontmatter end marker")

    frontmatter: dict[str, object] = {}
    for line in lines[1:end_index]:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = FRONTMATTER_KEY_RE.match(line)
        if not match:
            continue
        key, raw_value = match.groups()
        frontmatter[key] = parse_value(raw_value)

    body = "\n".join(lines[end_index + 1 :]).lstrip("\n")
    return frontmatter, body


def read_article(path: Path) -> Article:
    frontmatter, body = parse_frontmatter(path.read_text(encoding="utf-8"))
    title = str(frontmatter.get("title", path.stem))
    date_value = frontmatter.get("date")
    if not isinstance(date_value, str):
        raise ValueError(f"Missing or invalid date in {path}")
    short = str(frontmatter.get("short", "")).strip()
    tags_value = frontmatter.get("tags", [])
    if isinstance(tags_value, list):
        tags = tuple(str(tag) for tag in tags_value)
    elif isinstance(tags_value, tuple):
        tags = tuple(str(tag) for tag in tags_value)
    else:
        tags = (str(tags_value),) if tags_value else tuple()

    draft_value = frontmatter.get("draft", False)
    draft = (
        bool(draft_value)
        if isinstance(draft_value, bool)
        else str(draft_value).lower() == "true"
    )
    featured_image_value = frontmatter.get("featuredImage")
    featured_image = str(featured_image_value).strip() if featured_image_value else None
    return Article(
        path=path,
        title=title,
        date=parse_date(date_value),
        short=short,
        tags=tags,
        draft=draft,
        featured_image=featured_image,
        body=body,
    )


def load_articles() -> list[Article]:
    articles: list[Article] = []
    for path in sorted(BLOG_DIR.glob("*.mdx")):
        try:
            article = read_article(path)
        except Exception:
            continue
        if article.draft:
            continue
        articles.append(article)
    articles.sort(key=lambda article: (article.date, article.path.name))
    return articles


def latest_jhv_boundary(articles: Iterable[Article], reference: date) -> date:
    jhv_articles = [
        article
        for article in articles
        if any(tag.lower() == "jhv" for tag in article.tags)
        and article.date <= reference
    ]
    if not jhv_articles:
        return reference - timedelta(days=365)
    return max(article.date for article in jhv_articles)


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("_", " ")).strip()


def human_amount(value: str) -> str:
    cleaned = value.strip().replace(".", "")
    number = cleaned if "," in cleaned else f"{cleaned},00"
    return f"{number} €"


def extract_image_references(article: Article) -> list[str]:
    references: list[str] = []
    if article.featured_image:
        references.append(article.featured_image)
    for match in IMAGE_REF_RE.finditer(article.body):
        references.append(match.group(1).strip())
    return references


def resolve_image_source(article_path: Path, reference: str) -> Path | None:
    if reference.startswith(("http://", "https://", "data:")):
        return None

    candidates = [
        (article_path.parent / reference).resolve(),
        (ROOT / reference.lstrip("/")).resolve(),
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def collect_slide_image_sources(articles: Iterable[Article]) -> list[dict[str, str]]:
    seen: set[Path] = set()
    collected: list[dict[str, str]] = []
    for article in articles:
        for reference in extract_image_references(article):
            source = resolve_image_source(article.path, reference)
            if source is None or source in seen:
                continue
            seen.add(source)
            collected.append({"source": str(source), "alt": article.title})
    return collected


def build_special_entries(
    articles: Iterable[Article],
) -> tuple[
    list[dict[str, str]],
    list[dict[str, str]],
    list[dict[str, str]],
    list[dict[str, str]],
]:
    received: list[dict[str, str]] = []
    given: list[dict[str, str]] = []
    kinderlicht_events: list[dict[str, str]] = []
    external_events: list[dict[str, str]] = []

    for article in articles:
        for tag in article.tags:
            donation_match = SPENDE_RE.match(tag)
            if donation_match:
                entry = {
                    "kind": "received"
                    if donation_match.group("sign") == "+"
                    else "given",
                    "amount": human_amount(donation_match.group("amount")),
                    "label": normalize_text(donation_match.group("label")),
                    "article_title": article.title,
                    "article_short": article.short,
                    "article_date": article.date.isoformat(),
                }
                if entry["kind"] == "received":
                    received.append(entry)
                else:
                    given.append(entry)
                continue

            event_match = EVENT_RE.match(tag)
            if event_match:
                entry = {
                    "kind": event_match.group("kind").lower(),
                    "label": normalize_text(event_match.group("label")),
                    "article_title": article.title,
                    "article_short": article.short,
                    "article_date": article.date.isoformat(),
                }
                if entry["kind"] == "kinderlicht":
                    kinderlicht_events.append(entry)
                else:
                    external_events.append(entry)

    key = lambda item: (item["article_date"], item["article_title"])
    received.sort(key=key, reverse=True)
    given.sort(key=key, reverse=True)
    kinderlicht_events.sort(key=key, reverse=True)
    external_events.sort(key=key, reverse=True)
    return received, given, kinderlicht_events, external_events


def to_member_dict(member) -> dict[str, object]:
    return {
        "id": member.id,
        "name": member.name,
        "age": member.age,
        "gender": member.gender,
        "joined_at": member.joined_at.isoformat() if member.joined_at else None,
        "leave_at": member.leave_at.isoformat() if member.leave_at else None,
        "active": member.active,
    }


def default_output_path(reference_date: date) -> Path:
    DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    return DEFAULT_OUTPUT_DIR / f"jhv-metadata-{reference_date.year}.json"


def main() -> int:
    args = parse_args()
    reference_date = (
        parse_date(args.reference_date) if args.reference_date else date.today()
    )

    member_payload = fetch_campai_members(args.api_key)
    if member_payload is None:
        raise RuntimeError("Campai API request failed. Check API key and connectivity.")
    members = build_members(member_payload)

    finance_report: dict[str, object] = {}
    try:
        cash_accounts = fetch_from_finance_api(
            finance_api_key=args.finance_api_key,
            url=CAMPAI_FINANCE_ACCOUNTS_ENDPOINT,
            key="cashAccounts",
        )
        transactions = fetch_from_finance_api(
            args.finance_api_key,
            url=CAMPAI_FINANCE_TRANSACTIONS_ENDPOINT,
            key="cashTransactions",
        )
        finance_report = build_account_report(
            transactions=transactions,
            cash_accounts=cash_accounts,
            reference_date=reference_date,
        )
    except Exception as error:
        print(f"Warning: failed to collect finance report: {error}")

    all_articles = load_articles()
    boundary_date = latest_jhv_boundary(all_articles, reference_date)
    included_articles = [
        article
        for article in all_articles
        if boundary_date < article.date <= reference_date
    ]
    review_year = (
        max(article.date.year for article in included_articles)
        if included_articles
        else reference_date.year
    )

    received, given, kinderlicht_events, external_events = build_special_entries(
        included_articles
    )

    metadata = {
        "reference_date": reference_date.isoformat(),
        "boundary_date": boundary_date.isoformat(),
        "review_year": review_year,
        "members": [to_member_dict(member) for member in members],
        "included_articles": [
            {
                "path": str(article.path),
                "title": article.title,
                "date": article.date.isoformat(),
                "short": article.short,
                "tags": list(article.tags),
            }
            for article in included_articles
        ],
        "slide_images": collect_slide_image_sources(included_articles),
        "finance_report": finance_report,
        "received": received,
        "given": given,
        "kinderlicht_events": kinderlicht_events,
        "external_events": external_events,
    }

    output_path = args.output or default_output_path(reference_date)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Wrote metadata to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
