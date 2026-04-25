#!/usr/bin/env python3

from __future__ import annotations

import argparse
import ast
import base64
import html
import re
from dataclasses import dataclass
from datetime import date, datetime, timedelta
import json
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = ROOT / "public" / "rueckblick"
BLOG_DIR = ROOT / "src" / "content" / "blog"


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


@dataclass(frozen=True)
class DonationEntry:
    kind: str
    amount: str
    label: str
    article: Article


@dataclass(frozen=True)
class EventEntry:
    kind: str
    label: str
    article: Article


FRONTMATTER_KEY_RE = re.compile(r"^([A-Za-z0-9_\-]+):\s*(.*)$")
SPENDE_RE = re.compile(
    r"^spende:(?P<sign>[+-])(?P<amount>[^:]+):(?P<label>.+)$", re.IGNORECASE
)
EVENT_RE = re.compile(
    r"^veranstaltung:(?P<kind>kinderlicht|extern):(?P<label>.+)$", re.IGNORECASE
)


@dataclass(frozen=True)
class SlideImage:
    source: Path
    output_name: str
    alt: str


@dataclass(frozen=True)
class CustomSlide:
    title: str
    subtitle: str
    body: str
    bullets: tuple[str, ...]
    image: str | None
    plot_slots: tuple[str, ...]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate a modern HTML slide deck for the annual Kinderlicht JHV."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Output HTML file or directory. When a directory is given, the script writes rueckblick-YYYY.html inside it.",
    )
    parser.add_argument(
        "--reference-date",
        type=str,
        default=None,
        help="Optional reference date in YYYY-MM-DD format. Defaults to today.",
    )
    parser.add_argument(
        "--custom-slides",
        type=Path,
        default=None,
        help="Optional JSON file with custom slides to append. Format: list of objects with title, subtitle, body, bullets[], image, plotSlots[]",
    )
    return parser.parse_args()


def load_custom_slides(path: Path | None) -> list[CustomSlide]:
    if path is None:
        return []

    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict):
        payload = payload.get("slides", [])
    if not isinstance(payload, list):
        raise ValueError(
            "Custom slides file must contain a list or an object with a 'slides' list"
        )

    slides: list[CustomSlide] = []
    for entry in payload:
        if not isinstance(entry, dict):
            continue
        title = str(entry.get("title", "")).strip()
        if not title:
            continue

        bullets_raw = entry.get("bullets", [])
        bullets = (
            tuple(str(item).strip() for item in bullets_raw if str(item).strip())
            if isinstance(bullets_raw, list)
            else tuple()
        )
        plot_raw = entry.get("plotSlots", [])
        plot_slots = (
            tuple(str(item).strip() for item in plot_raw if str(item).strip())
            if isinstance(plot_raw, list)
            else tuple()
        )
        image_raw = entry.get("image")
        image = str(image_raw).strip() if image_raw else None

        slides.append(
            CustomSlide(
                title=title,
                subtitle=str(entry.get("subtitle", "")).strip(),
                body=str(entry.get("body", "")).strip(),
                bullets=bullets,
                image=image,
                plot_slots=plot_slots,
            )
        )
    return slides


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


IMAGE_REF_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")


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

    candidate_paths = [
        (article_path.parent / reference).resolve(),
        (ROOT / reference.lstrip("/")).resolve(),
    ]
    for candidate in candidate_paths:
        if candidate.exists():
            return candidate
    return None


def slugify_filename(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return slug or "image"


def collect_slide_images(articles: Iterable[Article]) -> list[SlideImage]:
    collected: list[SlideImage] = []
    seen_sources: set[Path] = set()

    for article in articles:
        for reference in extract_image_references(article):
            source = resolve_image_source(article.path, reference)
            if source is None or source in seen_sources:
                continue
            seen_sources.add(source)
            suffix = source.suffix.lower() or ".jpg"
            base_name = f"{article.date.isoformat()}-{slugify_filename(article.title)}-{len(collected) + 1}"
            collected.append(
                SlideImage(
                    source=source, output_name=f"{base_name}{suffix}", alt=article.title
                )
            )
    return collected


def prepare_slide_images(
    images: Iterable[SlideImage], output_directory: Path
) -> list[str]:
    assets_dir = output_directory / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)

    urls: list[str] = []
    for image in images:
        target = assets_dir / image.output_name
        target.write_bytes(image.source.read_bytes())
        urls.append(f"assets/{image.output_name}")
    return urls


def resolve_custom_image_source(
    reference: str, custom_file: Path | None
) -> Path | None:
    if reference.startswith(("http://", "https://", "data:")):
        return None
    candidates = []
    if custom_file is not None:
        candidates.append((custom_file.parent / reference).resolve())
    candidates.append((ROOT / reference.lstrip("/")).resolve())
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def prepare_custom_slide_images(
    slides: list[CustomSlide], custom_file: Path | None, output_directory: Path
) -> dict[int, str]:
    assets_dir = output_directory / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)

    image_map: dict[int, str] = {}
    for idx, slide in enumerate(slides):
        if not slide.image:
            continue
        image_ref = slide.image
        if image_ref.startswith(("http://", "https://", "data:")):
            image_map[idx] = image_ref
            continue
        source = resolve_custom_image_source(image_ref, custom_file)
        if source is None:
            continue
        suffix = source.suffix.lower() or ".jpg"
        filename = f"custom-slide-{idx + 1}{suffix}"
        target = assets_dir / filename
        target.write_bytes(source.read_bytes())
        image_map[idx] = f"assets/{filename}"
    return image_map


def build_collage_html(
    image_urls: list[str], base_alt: str = "Bild aus einem Beitrag"
) -> str:
    if not image_urls:
        return '<div class="collage collage-empty"></div>'

    spans = ["tile large", "tile", "tile", "tile wide", "tile tall"]
    tiles = []
    for index, image_url in enumerate(image_urls[:5]):
        tile_class = spans[index] if index < len(spans) else "tile"
        tiles.append(
            f'<figure class="{tile_class}"><img src="{escape_html(image_url)}" alt="{escape_html(base_alt)} {index + 1}" loading="lazy" /></figure>'
        )
    return '<div class="collage">' + "".join(tiles) + "</div>"


def build_slideshow_html(
    image_urls: list[str],
    name: str,
    *,
    alt_prefix: str = "Beitragsbild",
    max_images: int = 10,
    fallback_title: str = "Kinderlicht",
) -> str:
    cleaned = [url for url in image_urls if url][:max_images]
    if not cleaned:
        cleaned = [
            make_placeholder_svg(fallback_title, "Bilder aus dem Vereinsjahr")
        ]

    frames: list[str] = []
    for index, url in enumerate(cleaned):
        frames.append(
            f'<img class="frame{(" active" if index == 0 else "")}" src="{escape_html(url)}" alt="{escape_html(alt_prefix)} {index + 1}" loading="lazy" />'
        )
    return (
        f'<div class="auto-slideshow" data-slideshow="{escape_html(name)}">'
        + "".join(frames)
        + "</div>"
    )


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("_", " ")).strip()


def format_german_date(value: date) -> str:
    return value.strftime("%d.%m.%Y")


def human_amount(value: str) -> str:
    cleaned = value.strip().replace(".", "")
    if "," in cleaned:
        number = cleaned
    else:
        number = f"{cleaned},00"
    return f"{number} €"


def extract_special_entries(
    articles: Iterable[Article],
) -> tuple[
    list[DonationEntry], list[DonationEntry], list[EventEntry], list[EventEntry]
]:
    received: list[DonationEntry] = []
    given: list[DonationEntry] = []
    kinderlicht_events: list[EventEntry] = []
    external_events: list[EventEntry] = []

    for article in articles:
        for tag in article.tags:
            donation_match = SPENDE_RE.match(tag)
            if donation_match:
                amount = human_amount(donation_match.group("amount"))
                label = normalize_text(donation_match.group("label"))
                kind = "received" if donation_match.group("sign") == "+" else "given"
                entry = DonationEntry(
                    kind=kind, amount=amount, label=label, article=article
                )
                if kind == "received":
                    received.append(entry)
                else:
                    given.append(entry)
                continue

            event_match = EVENT_RE.match(tag)
            if event_match:
                entry = EventEntry(
                    kind=event_match.group("kind").lower(),
                    label=normalize_text(event_match.group("label")),
                    article=article,
                )
                if entry.kind == "kinderlicht":
                    kinderlicht_events.append(entry)
                else:
                    external_events.append(entry)

    received.sort(
        key=lambda entry: (entry.article.date, entry.article.title), reverse=True
    )
    given.sort(
        key=lambda entry: (entry.article.date, entry.article.title), reverse=True
    )
    kinderlicht_events.sort(
        key=lambda entry: (entry.article.date, entry.article.title), reverse=True
    )
    external_events.sort(
        key=lambda entry: (entry.article.date, entry.article.title), reverse=True
    )
    return received, given, kinderlicht_events, external_events


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


def escape_html(value: str) -> str:
    return html.escape(value, quote=True)


def make_placeholder_svg(title: str, subtitle: str) -> str:
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="{escape_html(title)}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#17191f"/>
          <stop offset="100%" stop-color="#0f1115"/>
        </linearGradient>
        <linearGradient id="glow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#ff8a1c" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="#ffb15c" stop-opacity="0.18"/>
        </linearGradient>
        <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M64 0H0V64" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)"/>
      <rect width="1600" height="900" fill="url(#grid)" opacity="0.55"/>
      <circle cx="1260" cy="190" r="230" fill="url(#glow)" opacity="0.85"/>
      <circle cx="250" cy="760" r="210" fill="#ff8a1c" opacity="0.18"/>
      <rect x="110" y="140" width="1380" height="620" rx="42" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
      <text x="160" y="290" fill="#f4f6f8" font-family="sans-serif" font-size="68" font-weight="700">{escape_html(title)}</text>
      <text x="160" y="370" fill="#ffb15c" font-family="sans-serif" font-size="34" font-weight="600">{escape_html(subtitle)}</text>
      <text x="160" y="690" fill="#aab0ba" font-family="sans-serif" font-size="28">Rückblick und Ausblick im selben Stil</text>
      <path d="M1200 470h150v150h-150z" fill="none" stroke="#ff8a1c" stroke-width="14" opacity="0.6"/>
      <path d="M1235 505h80v80h-80z" fill="#ff8a1c" opacity="0.5"/>
    </svg>
    """.strip()
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode(
        "ascii"
    )


def make_voting_svg(title: str, subtitle: str) -> str:
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="{escape_html(title)}">
      <defs>
        <linearGradient id="voteBg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#17191f"/>
          <stop offset="100%" stop-color="#0e1014"/>
        </linearGradient>
        <linearGradient id="voteAccent" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#ff8a1c"/>
          <stop offset="100%" stop-color="#ffb15c"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#voteBg)"/>
      <rect x="72" y="72" width="1456" height="756" rx="40" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)"/>
      <g opacity="0.18">
        <circle cx="1320" cy="180" r="180" fill="#ff8a1c"/>
        <circle cx="300" cy="760" r="140" fill="#ff8a1c"/>
      </g>

      <g transform="translate(200,240)">
        <rect x="0" y="0" width="360" height="420" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)"/>
        <rect x="88" y="-70" width="184" height="92" rx="22" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)"/>
        <rect x="120" y="140" width="120" height="24" rx="12" fill="rgba(255,255,255,0.18)"/>
        <path d="M112 258l44 44 92-108" fill="none" stroke="url(#voteAccent)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
      </g>

      <g transform="translate(760,250)">
        <rect x="0" y="0" width="640" height="114" rx="20" fill="rgba(255,255,255,0.05)"/>
        <rect x="0" y="164" width="540" height="64" rx="18" fill="rgba(255,255,255,0.05)"/>
        <rect x="0" y="258" width="590" height="64" rx="18" fill="rgba(255,255,255,0.05)"/>
        <rect x="0" y="352" width="470" height="64" rx="18" fill="rgba(255,255,255,0.05)"/>
      </g>

      <text x="760" y="316" fill="#f4f6f8" font-family="sans-serif" font-size="54" font-weight="700">{escape_html(title)}</text>
      <text x="760" y="386" fill="#ffb15c" font-family="sans-serif" font-size="30" font-weight="600">{escape_html(subtitle)}</text>
    </svg>
    """.strip()
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode(
        "ascii"
    )


def category_cards(
    entries: Iterable[DonationEntry | EventEntry],
    empty_text: str,
    item_type: str,
    max_items: int = 6,
) -> str:
    items = list(entries)
    if not items:
        return f'<div class="empty-state">{escape_html(empty_text)}</div>'

    rendered: list[str] = []
    visible_items = items[: max_items if max_items > 0 else len(items)]
    for entry in visible_items:
        if item_type == "donation":
            assert isinstance(entry, DonationEntry)
            label_prefix = "eingegangen" if entry.kind == "received" else "geleistet"
            rendered.append(
                f"""
                <article class="entry-card">
                  <div class="entry-toprow">
                    <span class="badge">{escape_html(label_prefix)}</span>
                    <span class="entry-date">{escape_html(format_german_date(entry.article.date))}</span>
                  </div>
                  <h3>{escape_html(entry.amount)} <span class="dim">{escape_html(entry.label)}</span></h3>
                  <p class="entry-title">{escape_html(entry.article.title)}</p>
                  {f'<p class="entry-short">{escape_html(entry.article.short)}</p>' if entry.article.short else ""}
                </article>
                """.strip()
            )
        else:
            assert isinstance(entry, EventEntry)
            rendered.append(
                f"""
                <article class="entry-card">
                  <div class="entry-toprow">
                    <span class="badge">{escape_html(entry.kind)}</span>
                    <span class="entry-date">{escape_html(format_german_date(entry.article.date))}</span>
                  </div>
                  <h3>{escape_html(entry.label)}</h3>
                  <p class="entry-title">{escape_html(entry.article.title)}</p>
                  {f'<p class="entry-short">{escape_html(entry.article.short)}</p>' if entry.article.short else ""}
                </article>
                """.strip()
            )
    if len(items) > len(visible_items):
        rendered.append(
            f'<article class="entry-card"><p class="entry-short">+ {len(items) - len(visible_items)} weitere Einträge</p></article>'
        )
    return "\n".join(rendered)


def agenda_items(review_year: int) -> str:
    return f"""
    <ol class="agenda-list">
      <li><span>1</span><div><strong>Begrüßung</strong><p>Start und kurze Einführung.</p></div></li>
      <li><span>2</span><div><strong>Agenda</strong><p>Ablauf und Struktur der Sitzung.</p></div></li>
      <li><span>3</span><div><strong>Vereinsdaten</strong><p>Kennzahlen und aktuelle Lage.</p></div></li>
      <li><span>4</span><div><strong>Rückblick {review_year}</strong><p>Spenden, Aktionen und Highlights.</p></div></li>
      <li><span>5</span><div><strong>Kassenbericht</strong><p>Einnahmen, Ausgaben, Entwicklung.</p></div></li>
      <li><span>6</span><div><strong>Entlastung Vorstandschaft</strong><p>Abstimmung und Ergebnis.</p></div></li>
      <li><span>7</span><div><strong>Beitragsordnung &amp; Organe</strong><p>Beschlüsse und Besetzung.</p></div></li>
      <li><span>8</span><div><strong>Vorschau</strong><p>Nächste Schritte und Planung.</p></div></li>
    </ol>
    """.strip()


def overview_cards(
    article_count: int,
    received_count: int,
    given_count: int,
    event_count: int,
    boundary_date: date,
    reference: date,
) -> str:
    cards = [
        ("Artikel", str(article_count), f"seit {format_german_date(boundary_date)}"),
        ("Eingegangen", str(received_count), "Spenden"),
        ("Geleistet", str(given_count), "Spenden"),
        ("Veranstaltungen", str(event_count), f"bis {format_german_date(reference)}"),
    ]
    return "\n".join(
        f"""
        <article class="kpi-card">
          <p>{escape_html(label)}</p>
          <strong>{escape_html(value)}</strong>
          <span>{escape_html(detail)}</span>
        </article>
        """.strip()
        for label, value, detail in cards
    )


def render_slide_deck(
    *,
    review_year: int,
    boundary_date: date,
    reference_date: date,
    collage_images: list[str],
    custom_slides: list[CustomSlide],
    custom_image_map: dict[int, str],
    included_articles: list[Article],
    received: list[DonationEntry],
    given: list[DonationEntry],
    kinderlicht_events: list[EventEntry],
    external_events: list[EventEntry],
) -> str:
    overview_html = overview_cards(
        article_count=len(included_articles),
        received_count=len(received),
        given_count=len(given),
        event_count=len(kinderlicht_events) + len(external_events),
        boundary_date=boundary_date,
        reference=reference_date,
    )

    agenda_html = agenda_items(review_year)
    welcome_show = build_slideshow_html(
        collage_images[:12],
        "welcome",
        alt_prefix="Vereinsbild",
        fallback_title="Willkommen",
    )
    rueckblick_show = build_slideshow_html(
        collage_images[5:22],
        "rueckblick",
        alt_prefix="Rückblick",
        fallback_title="Rückblick",
    )

    rueckblick_received = category_cards(
        received,
        "Keine Spenden mit passendem Tag.",
        "donation",
        max_items=10,
    )
    rueckblick_given = category_cards(
        given,
        "Keine Ausgaben mit passendem Tag.",
        "donation",
        max_items=10,
    )
    rueckblick_kinderlicht = category_cards(
        kinderlicht_events,
        "Keine Kinderlicht-Veranstaltungen mit passendem Tag.",
        "event",
        max_items=10,
    )
    rueckblick_external = category_cards(
        external_events,
        "Keine externen Veranstaltungen mit passendem Tag.",
        "event",
        max_items=10,
    )

    entlastung_image = make_voting_svg(
      "Entlastung der Vorstandschaft",
      "Abstimmung und Ergebnis",
    )
    abstimmung_image = make_voting_svg(
      "Beitragsordnung & Vereinsorgane",
      "Beschluss und Besetzung",
    )

    custom_slides_html = ""
    for idx, slide in enumerate(custom_slides):
        bullets_html = "".join(
            f"<li>{escape_html(item)}</li>" for item in slide.bullets
        )
        plot_html = "".join(
            f'<div class="plot-slot" data-plot="{escape_html(slot)}"><span>{escape_html(slot)}</span></div>'
            for slot in slide.plot_slots
        )
        media_html = ""
        slide_class = "slide full content-focus"
        if idx in custom_image_map and not slide.plot_slots:
            slide_class = "slide split"
            media_html = (
                f'<div class="media-pane subtle"><div class="art"><img src="{escape_html(custom_image_map[idx])}" alt="{escape_html(slide.title)}" /></div></div>'
            )

        custom_slides_html += f"""
      <section class="{slide_class}">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Zusatz</div>
              <h1>{escape_html(slide.title)}</h1>
              {f'<p class="lead">{escape_html(slide.subtitle)}</p>' if slide.subtitle else ''}
              {f'<p class="lead">{escape_html(slide.body)}</p>' if slide.body else ''}
              {f'<ul class="bullet-list">{bullets_html}</ul>' if bullets_html else ''}
              {f'<div class="plot-grid">{plot_html}</div>' if plot_html else ''}
            </div>
          </div>
          {media_html}
        </div>
      </section>
        """.strip()

    preview_cards = """
      <article class="preview-card">
        <span>Termine</span>
        <strong>Jahresplanung</strong>
        <p>Wichtige Termine.</p>
      </article>
      <article class="preview-card">
        <span>Ideen</span>
        <strong>Neue Projekte</strong>
        <p>Nächste Vorhaben.</p>
      </article>
      <article class="preview-card">
        <span>Ausblick</span>
        <strong>Nächste Schritte</strong>
        <p>Konkrete To-dos.</p>
      </article>
    """.strip()

    welcome_stream_items = [
        f"Rückblick {review_year}",
        f"Beiträge {len(included_articles)}",
        f"Eingegangene Spenden {len(received)}",
        f"Geleistete Spenden {len(given)}",
        f"Veranstaltungen {len(kinderlicht_events) + len(external_events)}",
        f"Zeitraum ab {format_german_date(boundary_date)}",
    ]
    welcome_stream_html = "".join(
        f'<span>{escape_html(item)}</span>' for item in (welcome_stream_items * 4)
    )

    return f"""<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Rückblick {review_year} · Kinderlicht</title>
  <meta name="description" content="JHV-Folien für Kinderlicht." />
  <style>
    :root {{
      color-scheme: dark;
      --bg: #0f1115;
      --panel: rgba(255, 255, 255, 0.05);
      --border: rgba(255, 255, 255, 0.12);
      --border-soft: rgba(255, 255, 255, 0.08);
      --text: #f4f6f8;
      --muted: #aab0ba;
      --accent: #ff8a1c;
      --accent-strong: #ffb15c;
      --shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
      --shadow-soft: 0 10px 24px rgba(0, 0, 0, 0.2);
      --radius-lg: 20px;
      --radius-md: 14px;
    }}

    * {{ box-sizing: border-box; }}
    html, body {{ width: 100%; height: 100%; margin: 0; overflow: hidden; background: radial-gradient(circle at top left, rgba(255, 138, 28, 0.12), transparent 28%), linear-gradient(160deg, #111319 0%, #0d0f13 100%); color: var(--text); }}
    body {{ font-family: "Bahnschrift", "Segoe UI Variable", "Segoe UI", sans-serif; }}

    .deck-shell {{ position: relative; width: 100%; height: 100%; overflow: hidden; }}
    .hud {{ position: absolute; top: 6px; left: 10px; right: 10px; z-index: 20; display: flex; align-items: center; gap: 8px; }}
    .hud .brand {{ display: flex; align-items: center; gap: 8px; padding: 4px 10px; border: 1px solid var(--border-soft); border-radius: 999px; background: rgba(15, 17, 21, 0.45); }}
    .hud .dot {{ width: 10px; height: 10px; border-radius: 999px; background: var(--accent); }}
    .hud .brand strong {{ font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; }}
    .hud .counter {{ margin-left: auto; padding: 4px 9px; border-radius: 999px; background: rgba(15, 17, 21, 0.5); border: 1px solid var(--border-soft); color: var(--muted); font-size: 0.78rem; }}
    .hud button {{ appearance: none; width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid var(--border-soft); border-radius: 999px; background: rgba(255,255,255,0.04); color: var(--text); cursor: pointer; }}

    .progress-track {{ position: absolute; left: 10px; right: 10px; top: 36px; z-index: 20; height: 2px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; }}
    .progress-track > div {{ width: 0%; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-strong)); transition: width 0.4s ease; }}

    .slides {{ position: absolute; inset: 0; display: flex; width: 100vw; height: 100vh; transform: translateX(0); transition: transform 0.7s cubic-bezier(.16,.84,.22,1); }}
    .slide {{ position: relative; flex: 0 0 100vw; width: 100vw; height: 100vh; padding: 44px 16px 12px; }}
    .slide-inner {{ height: 100%; min-height: 0; }}
    .split-layout {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }}
    .slide.full .split-layout,
    .slide.content-focus .split-layout {{ grid-template-columns: 1fr; }}
    .content-pane {{ min-height: 0; }}
    .media-pane {{ min-height: 0; border-radius: var(--radius-lg); border: 1px solid var(--border-soft); background: rgba(255,255,255,0.03); overflow: hidden; box-shadow: var(--shadow); position: relative; }}
    .media-pane.story {{
      border-color: rgba(255, 138, 28, 0.34);
      background: linear-gradient(165deg, rgba(255, 138, 28, 0.15), rgba(18, 22, 30, 0.6));
    }}
    .media-pane.story::before {{
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(8, 10, 14, 0) 45%, rgba(8, 10, 14, 0.52) 100%);
      z-index: 2;
    }}
    .media-pane.subtle {{ box-shadow: var(--shadow-soft); opacity: 0.9; }}

    .cover-slide {{ padding: 0; }}
    .cover-stage {{ position: relative; width: 100%; height: 100%; overflow: hidden; }}
    .cover-bg {{ position: absolute; inset: 0; }}
    .cover-bg .auto-slideshow::after {{ display: none; }}
    .cover-bg .auto-slideshow .frame {{ transform: scale(1.08); filter: saturate(1.04) contrast(1.04); }}
    .cover-bg .auto-slideshow .frame.active {{ transform: scale(1.01); }}
    .cover-overlay {{
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 22% 22%, rgba(255, 138, 28, 0.26), transparent 36%),
        linear-gradient(180deg, rgba(10, 12, 16, 0.16) 0%, rgba(10, 12, 16, 0.68) 72%, rgba(10, 12, 16, 0.82) 100%);
      pointer-events: none;
      z-index: 2;
    }}
    .cover-content {{
      position: relative;
      z-index: 3;
      height: 100%;
      display: grid;
      grid-template-rows: 1fr auto;
      padding: 84px 48px 24px;
    }}
    .cover-panel {{
      align-self: center;
      max-width: min(74ch, 86%);
      display: grid;
      gap: 12px;
      padding: 22px 24px;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.22);
      background: linear-gradient(155deg, rgba(14, 16, 22, 0.68), rgba(14, 16, 22, 0.32));
      backdrop-filter: blur(6px);
      box-shadow: var(--shadow);
      max-height: calc(100vh - 230px);
      overflow: auto;
    }}
    .cover-panel .kicker {{ color: var(--accent-strong); text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.72rem; font-weight: 700; }}
    .cover-panel h1 {{ margin: 0; font-size: clamp(1.86rem, 3.8vw, 3.55rem); line-height: 1.05; letter-spacing: -0.03em; text-wrap: balance; overflow-wrap: anywhere; }}
    .cover-panel p {{ margin: 0; color: #d0d6df; font-size: clamp(0.9rem, 1.25vw, 1.1rem); line-height: 1.32; max-width: 62ch; }}
    .cover-facts {{ display: flex; flex-wrap: wrap; gap: 10px; }}
    .cover-facts .fact {{ padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #edf0f5; font-size: 0.75rem; white-space: nowrap; }}
    .cover-ticker {{
      margin-top: 18px;
      position: relative;
      overflow: hidden;
      border-top: 1px solid rgba(255,255,255,0.18);
      border-bottom: 1px solid rgba(255,255,255,0.18);
      background: linear-gradient(90deg, rgba(255,138,28,0.16), rgba(255,255,255,0.02), rgba(255,138,28,0.1));
      min-height: 48px;
      display: flex;
      align-items: center;
    }}
    .cover-ticker-track {{
      display: inline-flex;
      gap: 24px;
      white-space: nowrap;
      padding: 0 18px;
      animation: tickerMove 42s linear infinite;
      font-size: 0.82rem;
      color: #f3f5f8;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }}
    .cover-ticker-track span::before {{ content: "✦"; color: var(--accent-strong); margin-right: 10px; opacity: 0.85; }}

    .hero {{ display: grid; gap: 8px; align-content: start; padding: 14px; height: 100%; border-radius: var(--radius-md); background: linear-gradient(165deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025)); border: 1px solid var(--border-soft); box-shadow: var(--shadow); overflow: auto; }}
    .hero .kicker {{ color: var(--accent-strong); text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.68rem; font-weight: 700; }}
    .hero h1 {{ margin: 0; font-size: clamp(1.2rem, 1.8vw, 1.8rem); line-height: 1.15; max-width: 28ch; }}
    .hero p.lead {{ margin: 0; color: var(--muted); font-size: 0.84rem; line-height: 1.35; }}
    .hero .meta {{ display: flex; flex-wrap: wrap; gap: 8px; }}
    .pill {{ display: inline-flex; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-soft); font-size: 0.78rem; }}

    .agenda-stage {{
      position: relative;
      height: 100%;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(255,255,255,0.12);
      background:
        radial-gradient(circle at 86% 14%, rgba(255,138,28,0.18), rgba(255,138,28,0) 36%),
        radial-gradient(circle at 10% 92%, rgba(255,255,255,0.08), rgba(255,255,255,0) 32%),
        linear-gradient(160deg, rgba(22, 26, 34, 0.92), rgba(13, 16, 22, 0.95));
      box-shadow: var(--shadow);
      overflow: hidden;
      padding: 18px 18px 16px;
      display: grid;
      grid-template-rows: auto 1fr;
      gap: 12px;
    }}
    .agenda-stage::before {{
      content: "";
      position: absolute;
      left: 44px;
      top: 86px;
      bottom: 20px;
      width: 2px;
      background: linear-gradient(180deg, rgba(255,177,92,0.38), rgba(255,177,92,0.05));
      z-index: 0;
    }}
    .agenda-head {{ position: relative; z-index: 1; display: grid; gap: 4px; }}
    .agenda-head .kicker {{ color: var(--accent-strong); text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.68rem; font-weight: 700; }}
    .agenda-head h1 {{ margin: 0; font-size: clamp(1.35rem, 2.2vw, 2.1rem); letter-spacing: -0.02em; }}
    .agenda-head p {{ margin: 0; color: var(--muted); font-size: 0.82rem; }}
    .agenda-list {{
      position: relative;
      z-index: 1;
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(8, minmax(0, 1fr));
      gap: 8px;
      min-height: 0;
    }}
    .agenda-list li {{
      min-height: 0;
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 12px;
      background: rgba(255,255,255,0.045);
      border: 1px solid rgba(255,255,255,0.12);
    }}
    .agenda-list li span {{ width: 34px; height: 34px; display: grid; place-items: center; border-radius: 999px; background: linear-gradient(180deg, rgba(255,138,28,0.28), rgba(255,138,28,0.12)); color: var(--accent-strong); font-size: 0.8rem; font-weight: 700; }}
    .agenda-list li strong {{ display: block; font-size: clamp(0.82rem, 1.24vw, 1rem); line-height: 1.1; }}
    .agenda-list li p {{ margin: 2px 0 0; color: var(--muted); font-size: clamp(0.68rem, 0.94vw, 0.8rem); line-height: 1.2; }}

    .kpi-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }}
    .kpi-card {{ padding: 10px; border-radius: 12px; background: rgba(255,255,255,0.045); border: 1px solid var(--border-soft); }}
    .kpi-card p {{ margin: 0; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); font-size: 0.68rem; }}
    .kpi-card strong {{ display: block; margin-top: 4px; font-size: 1.4rem; }}
    .kpi-card span {{ color: var(--muted); font-size: 0.75rem; }}

    .entry-column {{ display: grid; gap: 8px; }}
    .entry-card {{ padding: 9px 10px; border-radius: 12px; background: rgba(255,255,255,0.045); border: 1px solid var(--border-soft); display: grid; gap: 5px; }}
    .entry-toprow {{ display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }}
    .badge {{ padding: 5px 8px; border-radius: 999px; background: rgba(255,138,28,0.18); border: 1px solid rgba(255,138,28,0.28); color: #ffd4a6; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.66rem; }}
    .entry-date {{ color: var(--muted); font-size: 0.74rem; }}
    .entry-card h3 {{ margin: 0; font-size: 0.88rem; }}
    .entry-card h3 .dim {{ color: var(--muted); font-weight: 500; }}
    .entry-title {{ margin: 0; color: var(--accent-strong); font-weight: 700; font-size: 0.8rem; }}
    .entry-short {{ margin: 0; color: var(--muted); font-size: 0.76rem; line-height: 1.3; }}

    .card-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }}
    .preview-card {{ padding: 10px; border-radius: 12px; background: rgba(255,255,255,0.045); border: 1px solid var(--border-soft); }}
    .preview-card span {{ color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.66rem; }}
    .preview-card strong {{ display: block; margin-top: 4px; font-size: 0.9rem; }}
    .preview-card p {{ margin: 4px 0 0 0; color: var(--muted); font-size: 0.76rem; }}

    .plot-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }}
    .plot-slot {{ min-height: 130px; border-radius: 12px; border: 1px dashed rgba(255, 138, 28, 0.55); background: rgba(255, 138, 28, 0.08); display: grid; place-items: center; color: #ffd4a6; font-size: 0.76rem; text-transform: uppercase; text-align: center; padding: 8px; }}

    .auto-slideshow {{ position: relative; width: 100%; height: 100%; }}
    .auto-slideshow .frame {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.9s ease, transform 6s ease; transform: scale(1.04); }}
    .auto-slideshow .frame.active {{ opacity: 1; }}
    .auto-slideshow .frame.active {{ transform: scale(1); }}
    .auto-slideshow::after {{
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 14px;
      height: 2px;
      border-radius: 99px;
      background: linear-gradient(90deg, rgba(255, 177, 92, 0.95), rgba(255, 138, 28, 0.2));
      z-index: 3;
      opacity: 0.8;
    }}

    .thanks-slide {{
      position: relative;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(255, 138, 28, 0.26);
      background:
        radial-gradient(circle at 50% 92%, rgba(255,138,28,0.24), rgba(255,138,28,0.04) 32%, rgba(20,22,28,0.8) 58%),
        linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
      overflow: hidden;
      display: grid;
      place-items: center;
      height: 100%;
      box-shadow: var(--shadow);
    }}
    .thanks-vignette {{
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: radial-gradient(circle at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.48) 100%);
    }}
    .thanks-grain {{
      position: absolute;
      inset: -40%;
      z-index: 1;
      opacity: 0.1;
      pointer-events: none;
      background-image:
        radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
        radial-gradient(rgba(255,138,28,0.25) 1px, transparent 1px);
      background-size: 4px 4px, 6px 6px;
      background-position: 0 0, 2px 2px;
      animation: noiseShift 5s steps(10) infinite;
    }}
    .thanks-flame {{
      position: absolute;
      inset: auto auto -22% 50%;
      width: 58vmin;
      height: 74vmin;
      transform: translateX(-50%);
      filter: blur(1px) saturate(1.08);
      pointer-events: none;
      z-index: 2;
    }}
    .thanks-flame .layer {{
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      border-radius: 52% 48% 46% 54% / 65% 65% 35% 35%;
      animation: flameRise 3.8s ease-in-out infinite;
      transform-origin: 50% 88%;
    }}
    .thanks-flame .outer {{ width: 100%; height: 100%; background: radial-gradient(circle at 50% 78%, rgba(255,138,28,0.88), rgba(255,138,28,0.14) 56%, rgba(70,72,78,0.08) 82%); }}
    .thanks-flame .mid {{ width: 66%; height: 72%; background: radial-gradient(circle at 50% 72%, rgba(255,177,92,0.96), rgba(255,138,28,0.3) 58%, rgba(255,138,28,0.02) 84%); animation-delay: -1.2s; }}
    .thanks-flame .inner {{ width: 40%; height: 50%; background: radial-gradient(circle at 50% 68%, rgba(255,243,220,0.98), rgba(255,193,117,0.7) 52%, rgba(255,138,28,0.04) 82%); animation-delay: -2.2s; }}
    .thanks-copy {{
      position: relative;
      z-index: 4;
      text-align: center;
      display: grid;
      gap: 10px;
      padding: 24px;
    }}
    .thanks-embers {{ position: absolute; inset: 0; z-index: 3; pointer-events: none; overflow: hidden; }}
    .thanks-embers span {{
      position: absolute;
      width: var(--s, 6px);
      height: var(--s, 6px);
      left: var(--x, 50%);
      bottom: -8%;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(255,222,184,0.95) 0%, rgba(255,138,28,0.75) 52%, rgba(255,138,28,0) 84%);
      box-shadow: 0 0 14px rgba(255,138,28,0.55);
      animation: emberFloat var(--d, 9s) linear infinite;
      animation-delay: var(--delay, 0s);
      opacity: 0;
    }}
    .thanks-copy .kicker {{
      color: var(--accent-strong);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-size: 0.75rem;
      font-weight: 700;
    }}
    .thanks-copy h1 {{
      margin: 0;
      font-size: clamp(2rem, 4vw, 3.8rem);
      letter-spacing: -0.03em;
    }}
    .thanks-copy p {{
      margin: 0;
      color: var(--muted);
      font-size: clamp(0.95rem, 1.4vw, 1.2rem);
    }}

    @keyframes flameRise {{
      0%, 100% {{ transform: translateX(-50%) scale(1) rotate(-2deg); }}
      35% {{ transform: translateX(-50%) scale(1.06, 0.95) rotate(2deg); }}
      70% {{ transform: translateX(-50%) scale(0.96, 1.07) rotate(-1deg); }}
    }}
    @keyframes emberFloat {{
      0% {{ transform: translate3d(0, 0, 0) scale(0.75); opacity: 0; }}
      10% {{ opacity: 0.9; }}
      70% {{ opacity: 0.58; }}
      100% {{ transform: translate3d(var(--dx, -14px), -96vh, 0) scale(0.2); opacity: 0; }}
    }}
    @keyframes noiseShift {{
      0% {{ transform: translate(0, 0); }}
      25% {{ transform: translate(-2%, 1%); }}
      50% {{ transform: translate(1%, -1%); }}
      75% {{ transform: translate(-1%, -2%); }}
      100% {{ transform: translate(0, 0); }}
    }}
    @keyframes tickerMove {{
      0% {{ transform: translateX(0); }}
      100% {{ transform: translateX(-50%); }}
    }}

    .art {{ width: 100%; height: 100%; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-soft); }}
    .art img {{ width: 100%; height: 100%; object-fit: cover; }}
    .bullet-list {{ margin: 0; padding-left: 18px; font-size: 0.84rem; line-height: 1.35; }}

    .page-number {{ position: absolute; right: 16px; bottom: 10px; z-index: 20; padding: 4px 8px; border-radius: 999px; background: rgba(15, 17, 21, 0.6); border: 1px solid var(--border-soft); color: var(--muted); font-size: 0.72rem; font-variant-numeric: tabular-nums; }}

    @media (max-width: 1100px) {{
      body {{ overflow: auto; }}
      .slides {{ height: auto; position: relative; transform: none !important; flex-direction: column; }}
      .slide {{ width: 100vw; min-height: 100vh; padding: 50px 10px 10px; }}
      .split-layout, .kpi-grid, .card-grid, .plot-grid {{ grid-template-columns: 1fr; }}
      .agenda-list {{ grid-template-rows: none; gap: 7px; }}
      .media-pane {{ min-height: 220px; }}
      .cover-slide {{ padding: 0; }}
      .cover-content {{ padding: 78px 14px 16px; }}
      .cover-panel {{ max-width: 100%; padding: 16px; }}
      .cover-ticker-track {{ animation-duration: 30s; gap: 18px; font-size: 0.74rem; }}
      .progress-track, .hud .counter, .hud button {{ display: none; }}
    }}

    @media (prefers-reduced-motion: reduce) {{
      .slides, .progress-track > div, .auto-slideshow .frame {{ transition: none; }}
      .cover-ticker-track, .thanks-flame .layer, .thanks-embers span, .thanks-grain {{ animation: none !important; }}
    }}
  </style>
</head>
<body>
  <div class="deck-shell">
    <header class="hud">
      <div class="brand"><div class="dot"></div><strong>Kinderlicht</strong></div>
      <button type="button" data-nav="prev" aria-label="Zurück">‹</button>
      <button type="button" data-nav="next" aria-label="Weiter">›</button>
      <div class="counter"><strong id="slide-index">1</strong> / <span id="slide-count">0</span></div>
    </header>
    <div class="progress-track"><div id="progress-bar"></div></div>

    <main class="slides" id="slides">
      <section class="slide full cover-slide">
        <div class="slide-inner cover-stage">
          <div class="cover-bg">{welcome_show}</div>
          <div class="cover-overlay"></div>
          <div class="cover-content">
            <div class="cover-panel">
              <div class="kicker">Begrüßung</div>
              <h1>Willkommen zur Jahreshauptversammlung</h1>
              <p>Rückblick {review_year} mit den wichtigsten Entwicklungen, Spenden und Veranstaltungen im Vereinsjahr.</p>
              <div class="cover-facts">
                <div class="fact">Rückblick {review_year}</div>
                <div class="fact">Seit {escape_html(format_german_date(boundary_date))}</div>
                <div class="fact">{len(included_articles)} Beiträge</div>
                <div class="fact">{len(received) + len(given)} Spendenvorgänge</div>
              </div>
            </div>
            <div class="cover-ticker" aria-label="Kennzahlen">
              <div class="cover-ticker-track">
                {welcome_stream_html}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="slide full">
        <div class="slide-inner">
          <div class="agenda-stage">
            <div class="agenda-head">
              <div class="kicker">Agenda</div>
              <h1>Tagesordnung</h1>
              <p>Ein klarer Ablauf mit Fokus auf Entscheidungen, Zahlen und Ausblick.</p>
            </div>
            {agenda_html}
          </div>
        </div>
      </section>

      <section class="slide full content-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Vereinsdaten</div>
              <h1>Übersicht aktueller Vereinsdaten</h1>
              <div class="kpi-grid">{overview_html}</div>
              <div class="plot-grid">
                <div class="plot-slot" data-plot="mitglieder-entwicklung"><span>Mitglieder Entwicklung</span></div>
                <div class="plot-slot" data-plot="vereinsaktivitaet"><span>Vereinsaktivität</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="slide split visual-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Rückblick</div>
              <h1>Eingegangene Spenden</h1>
              <div class="entry-column">{rueckblick_received}</div>
            </div>
          </div>
          <div class="media-pane story">{rueckblick_show}</div>
        </div>
      </section>

      <section class="slide split visual-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Rückblick</div>
              <h1>Geleistete Spenden</h1>
              <div class="entry-column">{rueckblick_given}</div>
            </div>
          </div>
          <div class="media-pane story">{rueckblick_show}</div>
        </div>
      </section>

      <section class="slide split visual-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Rückblick</div>
              <h1>Veranstaltungen Kinderlicht</h1>
              <div class="entry-column">{rueckblick_kinderlicht}</div>
            </div>
          </div>
          <div class="media-pane story">{rueckblick_show}</div>
        </div>
      </section>

      <section class="slide split visual-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Rückblick</div>
              <h1>Veranstaltungen Extern</h1>
              <div class="entry-column">{rueckblick_external}</div>
            </div>
          </div>
          <div class="media-pane story">{rueckblick_show}</div>
        </div>
      </section>

      <section class="slide full content-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Finanzen</div>
              <h1>Kassenbericht</h1>
              <div class="plot-grid">
                <div class="plot-slot" data-plot="kasse-einnahmen-ausgaben"><span>Einnahmen vs Ausgaben</span></div>
                <div class="plot-slot" data-plot="kasse-verlauf"><span>Kassenverlauf</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="slide split content-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Beschluss</div>
              <h1>Entlastung der Vorstandschaft</h1>
              <div class="plot-grid">
                <div class="plot-slot" data-plot="entlastung-stimmen"><span>Stimmenverteilung</span></div>
                <div class="plot-slot" data-plot="entlastung-anwesenheit"><span>Anwesenheit und Quorum</span></div>
              </div>
            </div>
          </div>
          <div class="media-pane subtle"><div class="art"><img src="{entlastung_image}" alt="Entlastung der Vorstandschaft" /></div></div>
        </div>
      </section>

      <section class="slide split content-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Beschluss</div>
              <h1>Beitragsordnung &amp; Vereinsorgane</h1>
              <div class="plot-grid">
                <div class="plot-slot" data-plot="beitragsordnung-optionen"><span>Optionen und Varianten</span></div>
                <div class="plot-slot" data-plot="organe-besetzung"><span>Besetzung Vereinsorgane</span></div>
              </div>
            </div>
          </div>
          <div class="media-pane subtle"><div class="art"><img src="{abstimmung_image}" alt="Beitragsordnung und Vereinsorgane" /></div></div>
        </div>
      </section>

      <section class="slide full content-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Ausblick</div>
              <h1>Vorschau</h1>
              <div class="card-grid">{preview_cards}</div>
              <div class="plot-grid">
                <div class="plot-slot" data-plot="vorschau-termine"><span>Termine im Jahresverlauf</span></div>
                <div class="plot-slot" data-plot="vorschau-prioritaeten"><span>Prioritäten und Verantwortliche</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="slide full">
        <div class="slide-inner">
          <div class="thanks-slide">
            <div class="thanks-vignette" aria-hidden="true"></div>
            <div class="thanks-grain" aria-hidden="true"></div>
            <div class="thanks-flame" aria-hidden="true">
              <div class="layer outer"></div>
              <div class="layer mid"></div>
              <div class="layer inner"></div>
            </div>
            <div class="thanks-embers" aria-hidden="true">
              <span style="--x:12%;--s:6px;--d:9.8s;--dx:16px;--delay:-0.6s"></span>
              <span style="--x:18%;--s:8px;--d:11.4s;--dx:-20px;--delay:-3.2s"></span>
              <span style="--x:24%;--s:5px;--d:8.6s;--dx:14px;--delay:-1.4s"></span>
              <span style="--x:31%;--s:7px;--d:12.8s;--dx:-18px;--delay:-5.7s"></span>
              <span style="--x:38%;--s:6px;--d:10.2s;--dx:22px;--delay:-2.1s"></span>
              <span style="--x:45%;--s:9px;--d:13.6s;--dx:-12px;--delay:-6.4s"></span>
              <span style="--x:52%;--s:5px;--d:9.2s;--dx:18px;--delay:-0.9s"></span>
              <span style="--x:58%;--s:7px;--d:10.8s;--dx:-16px;--delay:-4.6s"></span>
              <span style="--x:64%;--s:6px;--d:11.9s;--dx:20px;--delay:-8.1s"></span>
              <span style="--x:70%;--s:8px;--d:12.3s;--dx:-22px;--delay:-3.8s"></span>
              <span style="--x:76%;--s:5px;--d:8.9s;--dx:12px;--delay:-2.8s"></span>
              <span style="--x:82%;--s:7px;--d:13.1s;--dx:-14px;--delay:-7.3s"></span>
              <span style="--x:88%;--s:6px;--d:10.6s;--dx:15px;--delay:-4.1s"></span>
            </div>
            <div class="thanks-copy">
              <div class="kicker">Kinderlicht Wallersdorf e.V.</div>
              <h1>Danke</h1>
              <p>Für eure Zeit, euren Einsatz und eure Unterstützung.</p>
            </div>
          </div>
        </div>
      </section>

      {custom_slides_html}
    </main>
  </div>
  <script>
    const slides = Array.from(document.querySelectorAll('.slide'));
    const track = document.getElementById('slides');
    const slideIndex = document.getElementById('slide-index');
    const slideCount = document.getElementById('slide-count');
    const progressBar = document.getElementById('progress-bar');
    const prevButtons = document.querySelectorAll('[data-nav="prev"]');
    const nextButtons = document.querySelectorAll('[data-nav="next"]');
    let current = 0;

    const slideshows = Array.from(document.querySelectorAll('.auto-slideshow'));
    slideshows.forEach((slideshow) => {{
      const frames = Array.from(slideshow.querySelectorAll('.frame'));
      if (frames.length <= 1) return;
      let frameIndex = 0;
      setInterval(() => {{
        frames[frameIndex].classList.remove('active');
        frameIndex = (frameIndex + 1) % frames.length;
        frames[frameIndex].classList.add('active');
      }}, 4200);
    }});

    slides.forEach((slide, index) => {{
      const pageNumber = document.createElement('div');
      pageNumber.className = 'page-number';
      pageNumber.textContent = `${{String(index + 1).padStart(2, '0')}} / ${{String(slides.length).padStart(2, '0')}}`;
      slide.appendChild(pageNumber);
    }});

    function render() {{
      const max = Math.max(slides.length - 1, 1);
      slideIndex.textContent = String(current + 1);
      slideCount.textContent = String(slides.length);
      progressBar.style.width = `${{(current / max) * 100}}%`;
      track.style.transform = `translateX(${{-current * 100}}vw)`;
    }}

    function go(delta) {{
      current = Math.min(slides.length - 1, Math.max(0, current + delta));
      render();
    }}

    prevButtons.forEach((button) => button.addEventListener('click', () => go(-1)));
    nextButtons.forEach((button) => button.addEventListener('click', () => go(1)));
    window.addEventListener('keydown', (event) => {{
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {{
        event.preventDefault();
        go(1);
      }} else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {{
        event.preventDefault();
        go(-1);
      }} else if (event.key === 'Home') {{
        current = 0;
        render();
      }} else if (event.key === 'End') {{
        current = slides.length - 1;
        render();
      }}
    }});

    render();
  </script>
</body>
</html>
"""


def resolve_output_path(output: Path, review_year: int) -> Path:
    if output.suffix.lower() == ".html":
        return output
    output.mkdir(parents=True, exist_ok=True)
    return output / f"rueckblick-{review_year}.html"


def main() -> int:
    args = parse_args()
    reference_date = (
        parse_date(args.reference_date) if args.reference_date else date.today()
    )
    articles = load_articles()
    boundary_date = latest_jhv_boundary(articles, reference_date)
    included_articles = [
        article
        for article in articles
        if boundary_date < article.date <= reference_date
    ]
    if included_articles:
        review_year = max(article.date.year for article in included_articles)
    else:
        review_year = reference_date.year

    received, given, kinderlicht_events, external_events = extract_special_entries(
        included_articles
    )
    custom_slides = load_custom_slides(args.custom_slides)
    output_path = resolve_output_path(args.output, review_year)
    collage_sources = collect_slide_images(included_articles)
    collage_images = prepare_slide_images(collage_sources, output_path.parent)
    custom_image_map = prepare_custom_slide_images(
        custom_slides, args.custom_slides, output_path.parent
    )

    html_output = render_slide_deck(
        review_year=review_year,
        boundary_date=boundary_date,
        reference_date=reference_date,
        collage_images=collage_images,
        custom_slides=custom_slides,
        custom_image_map=custom_image_map,
        included_articles=included_articles,
        received=received,
        given=given,
        kinderlicht_events=kinderlicht_events,
        external_events=external_events,
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html_output, encoding="utf-8")
    print(f"Wrote {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
