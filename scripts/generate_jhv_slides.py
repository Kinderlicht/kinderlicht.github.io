#!/usr/bin/env python3

from __future__ import annotations

import argparse
import base64
import html
import io
import json
import math
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from string import Template


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = ROOT / "public" / "rueckblick"
TEMPLATE_DIR = ROOT / "scripts" / "templates"
DEFAULT_METADATA_DIR = ROOT / "scripts" / "out"
CONTENT_DIR = ROOT / "src" / "content"
PDF_DEPENDENCIES = ("reportlab", "cairosvg")


@dataclass(frozen=True)
class Member:
    id: str | None
    name: str
    age: int | None
    gender: str | None
    joined_at: date | None
    leave_at: date | None
    active: bool


@dataclass(frozen=True)
class CustomSlide:
    title: str
    subtitle: str
    body: str
    bullets: tuple[str, ...]
    image: str | None
    plot_slots: tuple[str, ...]


@dataclass(frozen=True)
class PreviewEvent:
    title: str
    description: str
    tags: tuple[str, ...]
    date: str


@dataclass(frozen=True)
class MemberInsights:
    active_count: int
    average_age: float | None
    gender_chart: str
    age_chart: str
    evolution_chart: str


@dataclass(frozen=True)
class PdfSlide:
    title: str
    subtitle: str
    bullets: tuple[str, ...]
    plot_images: tuple[str, ...]
    plot_placeholders: tuple[str, ...]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate JHV slide deck. Uses metadata JSON directly or auto-collects it first."
    )
    parser.add_argument(
        "--metadata",
        type=Path,
        default=None,
        help="Metadata JSON created by scripts/collect_jhv_metadata.py",
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default=None,
        help="Campai API key. If --metadata is omitted, metadata is collected automatically using this key.",
    )
    parser.add_argument(
        "--reference-date",
        type=str,
        default=None,
        help="Optional reference date in YYYY-MM-DD format. Used for auto-metadata collection.",
    )
    parser.add_argument(
        "--metadata-output",
        type=Path,
        default=None,
        help="Optional target metadata JSON path when auto-collecting metadata.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Output HTML file or directory. Directory writes rueckblick-YYYY.html.",
    )
    parser.add_argument(
        "--custom-slides",
        type=Path,
        default=None,
        help="Optional JSON file with custom slides.",
    )
    parser.add_argument(
        "--preview",
        type=Path,
        default=Path(__file__).parent / "preview.json",
        help="JSON file with upcoming preview events.",
    )
    parser.add_argument(
        "--pdf-output",
        type=Path,
        default=None,
        help="Optional output PDF path. If set, all slides are exported as one multi-page PDF.",
    )
    parser.add_argument(
        "--minutes-output",
        type=Path,
        default=None,
        help="Optional output path for the generated minutes text. If omitted, a text file is written next to the HTML output.",
    )
    parser.add_argument(
        "--install-pdf-deps",
        action="store_true",
        help="If set, missing PDF dependencies are installed automatically before export.",
    )
    parser.add_argument(
        "--force-voting-slide",
        action="store_true",
        help="Force the voting slide for Vereinsorgane even in odd years.",
    )
    return parser.parse_args()


def parse_date(value: str) -> date:
    return datetime.strptime(value.strip().strip('"').strip("'"), "%Y-%m-%d").date()


def escape_html(value: str) -> str:
    return html.escape(value, quote=True)


def _image_path_to_data_uri(image_path: Path) -> str:
    suffix = image_path.suffix.lower()
    mime_map = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
    }
    mime = mime_map.get(suffix, "application/octet-stream")
    payload = base64.b64encode(image_path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{payload}"


def resolve_slide_image_src(image_value: str | None) -> str:
    if not image_value:
        return ""

    raw = str(image_value).strip()
    if not raw:
        return ""
    if raw.startswith(("http://", "https://", "data:")):
        return raw

    normalized = raw.lstrip("/")
    if normalized.startswith("images/"):
        normalized = normalized[len("images/") :]

    candidates = [
        ROOT / "src" / "images" / normalized,
        ROOT / "static" / "images" / normalized,
        ROOT / "public" / "images" / normalized,
        ROOT / normalized,
    ]

    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            try:
                return _image_path_to_data_uri(candidate)
            except Exception:
                break

    return f"/images/{normalized}"


def format_german_date(value: date) -> str:
    return value.strftime("%d.%m.%Y")


def format_euro(value: float | int | None) -> str:
    if value is None:
        return "-"
    amount = float(value)
    sign = "-" if amount < 0 else ""
    absolute = abs(amount)
    formatted = f"{absolute:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{sign}{formatted} EUR"


def slugify_filename(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return slug or "image"


def load_custom_slides(path: Path | None) -> list[CustomSlide]:
    if path is None:
        return []

    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict):
        payload = payload.get("slides", [])
    if not isinstance(payload, list):
        raise ValueError("Custom slides file must contain a list or {slides: [...]}.")

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


def load_preview_events(path: Path | None) -> list[PreviewEvent]:
    if path is None:
        return []

    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, dict):
        payload = payload.get("events", payload.get("items", []))
    if not isinstance(payload, list):
        raise ValueError("Preview file must contain a list or {events: [...]}.")

    events: list[PreviewEvent] = []
    for entry in payload:
        if not isinstance(entry, dict):
            continue
        title = str(entry.get("title", "")).strip()
        description = str(entry.get("description", entry.get("body", ""))).strip()
        date_value = str(entry.get("date", "")).strip()
        tags_raw = entry.get("tags", [])
        tags = (
            tuple(str(item).strip() for item in tags_raw if str(item).strip())
            if isinstance(tags_raw, list)
            else tuple()
        )
        if not (title or description or date_value or tags):
            continue
        events.append(
            PreviewEvent(
                title=title or "Ohne Titel",
                description=description,
                tags=tags,
                date=date_value,
            )
        )
    return events


def find_custom_slide(custom_slides: list[CustomSlide], title: str) -> CustomSlide | None:
        target = title.strip().casefold()
        for slide in custom_slides:
                if slide.title.strip().casefold() == target:
                        return slide
        return None


def render_custom_slide_section(
    slide: CustomSlide,
    *,
    kicker: str | None = None,
    image_src: str | None = None,
) -> str:
        bullets_html = "".join(f"<li>{escape_html(item)}</li>" for item in slide.bullets)
        plot_html = "".join(
                f'<div class="plot-slot" data-plot="{escape_html(slot)}"><span>{escape_html(slot)}</span></div>'
                for slot in slide.plot_slots
        )
        media_html = ""
        slide_class = "slide full content-focus"
        resolved_image_src = image_src or slide.image or ""
        if resolved_image_src and not slide.plot_slots:
                slide_class = "slide split"
                media_html = (
                f'<div class="media-pane subtle"><div class="art"><img src="{escape_html(resolved_image_src)}" alt="{escape_html(slide.title)}" /></div></div>'
                )

        kicker_html = f'<div class="kicker">{escape_html(kicker)}</div>' if kicker else ""
        subtitle_html = (
                f'<p class="lead">{escape_html(slide.subtitle)}</p>' if slide.subtitle else ""
        )
        body_html = f'<p class="lead">{escape_html(slide.body)}</p>' if slide.body else ""
        bullets_block = f'<ul class="bullet-list">{bullets_html}</ul>' if bullets_html else ""
        plot_block = f'<div class="plot-grid">{plot_html}</div>' if plot_html else ""

        return f"""
            <section class="{slide_class}">
                <div class="slide-inner split-layout">
                    <div class="content-pane">
                        <div class="hero compact">
                            {kicker_html}
                            <h1>{escape_html(slide.title)}</h1>
                            {subtitle_html}
                            {body_html}
                            {bullets_block}
                            {plot_block}
                        </div>
                    </div>
                    {media_html}
                </div>
            </section>
        """.strip()


def render_preview_events_html(preview_events: list[PreviewEvent]) -> str:
    if not preview_events:
        return ""

    cards: list[str] = []
    for event in preview_events:
        tags_html = "".join(
            f'<span class="preview-event-tag">{escape_html(tag)}</span>'
            for tag in event.tags
        )
        cards.append(
            f"""
            <article class="preview-event-card">
              <div class="preview-event-toprow">
                <span class="preview-event-date">{escape_html(event.date)}</span>
                {f'<div class="preview-event-tags">{tags_html}</div>' if tags_html else ''}
              </div>
              <h3>{escape_html(event.title)}</h3>
              {f'<p>{escape_html(event.description)}</p>' if event.description else ''}
            </article>
            """.strip()
        )

    return f'<div class="preview-events-grid">{"".join(cards)}</div>'


def resolve_output_path(output: Path, review_year: int) -> Path:
    if output.suffix.lower() == ".html":
        return output
    output.mkdir(parents=True, exist_ok=True)
    return output / f"rueckblick-{review_year}.html"


def load_metadata(path: Path) -> dict[str, object]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    required_keys = {
        "reference_date",
        "boundary_date",
        "review_year",
        "members",
        "included_articles",
        "slide_images",
        "received",
        "given",
        "kinderlicht_events",
        "external_events",
    }
    missing = sorted(required_keys - set(payload.keys()))
    if missing:
        raise ValueError(f"Metadata is missing keys: {', '.join(missing)}")
    return payload


def resolve_metadata_path(args: argparse.Namespace) -> Path:
    if args.metadata is not None:
        return args.metadata

    if not args.api_key:
        raise ValueError(
            "Either --metadata or --api-key must be provided. "
            "With --api-key, metadata will be collected automatically."
        )

    collector_script = ROOT / "scripts" / "collect_jhv_metadata.py"
    if not collector_script.exists():
        raise FileNotFoundError(f"Collector script not found: {collector_script}")

    if args.metadata_output is not None:
        metadata_path = args.metadata_output
    else:
        ref = parse_date(args.reference_date) if args.reference_date else date.today()
        DEFAULT_METADATA_DIR.mkdir(parents=True, exist_ok=True)
        metadata_path = DEFAULT_METADATA_DIR / f"jhv-metadata-{ref.year}.json"

    command = [
        sys.executable,
        str(collector_script),
        "--api-key",
        args.api_key,
        "--output",
        str(metadata_path),
    ]
    if args.reference_date:
        command.extend(["--reference-date", args.reference_date])

    print(f"Collecting metadata: {' '.join(command)}")
    subprocess.run(command, check=True)
    return metadata_path


def deserialize_members(raw_members: list[dict[str, object]]) -> list[Member]:
    members: list[Member] = []
    for row in raw_members:
        joined = parse_date(str(row["joined_at"])) if row.get("joined_at") else None
        leave = parse_date(str(row["leave_at"])) if row.get("leave_at") else None
        members.append(
            Member(
                id=str(row["id"]) if row.get("id") else None,
                name=str(row.get("name") or "Unknown"),
                age=int(row["age"]) if isinstance(row.get("age"), int) else None,
                gender=str(row["gender"]) if row.get("gender") else None,
                joined_at=joined,
                leave_at=leave,
                active=bool(row.get("active", False)),
            )
        )
    return members


def prepare_slide_images(
    image_rows: list[dict[str, str]], output_directory: Path
) -> tuple[list[str], dict[str, str]]:
    assets_dir = output_directory / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)

    urls: list[str] = []
    image_by_title: dict[str, str] = {}
    for idx, item in enumerate(image_rows):
        source = Path(str(item.get("source", "")))
        if not source.exists():
            continue
        suffix = source.suffix.lower() or ".jpg"
        base = slugify_filename(str(item.get("alt") or f"image-{idx + 1}"))
        filename = f"metadata-{idx + 1}-{base}{suffix}"
        target = assets_dir / filename
        target.write_bytes(source.read_bytes())
        relative_url = f"assets/{filename}"
        urls.append(relative_url)
        alt_title = str(item.get("alt", "")).strip()
        if alt_title:
            image_by_title[alt_title] = relative_url
    return urls, image_by_title


def extract_mdx_preview(article_path: Path, max_chars: int = 900) -> str:
    if not article_path.exists():
        return ""

    raw = article_path.read_text(encoding="utf-8")
    body = raw
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) == 3:
            body = parts[2]

    # Strip most markdown syntax to keep a readable plain-text preview for modal use.
    body = re.sub(r"```[\s\S]*?```", " ", body)
    body = re.sub(r"`([^`]*)`", r"\1", body)
    body = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", body)
    body = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", body)
    body = re.sub(r"^#{1,6}\s*", "", body, flags=re.MULTILINE)
    body = re.sub(r"<[^>]+>", " ", body)
    body = re.sub(r"\s+", " ", body).strip()

    if len(body) <= max_chars:
        return body
    return body[: max_chars - 1].rstrip() + "…"


def build_article_details(
    included_articles: list[dict[str, object]],
    article_image_map: dict[str, str],
) -> dict[str, dict[str, str]]:
    details: dict[str, dict[str, str]] = {}
    for article in included_articles:
        title = str(article.get("title", "")).strip()
        if not title:
            continue

        article_path_raw = str(article.get("path", "")).strip()
        article_path = Path(article_path_raw) if article_path_raw else None
        full_text = (
            extract_mdx_preview(article_path) if article_path is not None else ""
        )

        details[title] = {
            "title": title,
            "date": str(article.get("date", "")).strip(),
            "short": str(article.get("short", "")).strip(),
            "text": full_text,
            "image": article_image_map.get(title, ""),
        }
    return details


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


def make_placeholder_svg(title: str, subtitle: str) -> str:
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="{escape_html(title)}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#17191f"/>
          <stop offset="100%" stop-color="#0f1115"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)"/>
      <text x="130" y="300" fill="#f4f6f8" font-family="sans-serif" font-size="68" font-weight="700">{escape_html(title)}</text>
      <text x="130" y="380" fill="#ffb15c" font-family="sans-serif" font-size="34" font-weight="600">{escape_html(subtitle)}</text>
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
                    <stop offset="0%" stop-color="#12151b"/>
                    <stop offset="100%" stop-color="#0b0e12"/>
                </linearGradient>
                <style>
                    @keyframes bob {{
                        0%, 100% {{ transform: translateY(0); opacity: 0.42; }}
                        50% {{ transform: translateY(-6px); opacity: 0.9; }}
                    }}
                    @keyframes handLift {{
                        0%, 100% {{ transform: translateY(0); }}
                        50% {{ transform: translateY(-10px); }}
                    }}
                    .person {{ animation: bob 2.8s ease-in-out infinite; transform-origin: center bottom; }}
                    .person.p2 {{ animation-delay: 0.2s; }}
                    .person.p3 {{ animation-delay: 0.4s; }}
                    .person.p4 {{ animation-delay: 0.6s; }}
                    .person.p5 {{ animation-delay: 0.8s; }}
                    .raised-arm {{ animation: handLift 1.4s ease-in-out infinite; transform-origin: center bottom; }}
                </style>
            </defs>
            <rect width="1600" height="900" fill="url(#voteBg)"/>
            <text x="160" y="240" fill="#f4f6f8" font-family="sans-serif" font-size="58" font-weight="700">{escape_html(title)}</text>
            <text x="160" y="300" fill="#ffb15c" font-family="sans-serif" font-size="28" font-weight="600">{escape_html(subtitle)}</text>

            <g transform="translate(300 520)">
                <g class="person p1" transform="translate(0 0)" fill="#ffffff" opacity="0.34">
                    <circle cx="60" cy="34" r="18"/>
                    <rect x="42" y="54" width="36" height="74" rx="17"/>
                    <rect x="26" y="74" width="12" height="56" rx="6"/>
                    <rect x="82" y="74" width="12" height="56" rx="6"/>
                    <rect x="44" y="126" width="12" height="64" rx="6"/>
                    <rect x="62" y="126" width="12" height="64" rx="6"/>
                </g>
                <g class="person p2" transform="translate(170 8)" fill="#ffffff" opacity="0.38">
                    <circle cx="60" cy="34" r="18"/>
                    <rect x="42" y="54" width="36" height="74" rx="17"/>
                    <rect x="26" y="74" width="12" height="56" rx="6"/>
                    <rect x="82" y="74" width="12" height="56" rx="6"/>
                    <rect x="44" y="126" width="12" height="64" rx="6"/>
                    <rect x="62" y="126" width="12" height="64" rx="6"/>
                    <rect class="raised-arm" x="88" y="28" width="10" height="72" rx="5" transform="rotate(-24 93 64)"/>
                </g>
                <g class="person p3" transform="translate(340 0)" fill="#ffffff" opacity="0.34">
                    <circle cx="60" cy="34" r="18"/>
                    <rect x="42" y="54" width="36" height="74" rx="17"/>
                    <rect x="26" y="74" width="12" height="56" rx="6"/>
                    <rect x="82" y="74" width="12" height="56" rx="6"/>
                    <rect x="44" y="126" width="12" height="64" rx="6"/>
                    <rect x="62" y="126" width="12" height="64" rx="6"/>
                </g>
                <g class="person p4" transform="translate(510 10)" fill="#ffffff" opacity="0.38">
                    <circle cx="60" cy="34" r="18"/>
                    <rect x="42" y="54" width="36" height="74" rx="17"/>
                    <rect x="26" y="74" width="12" height="56" rx="6"/>
                    <rect x="82" y="74" width="12" height="56" rx="6"/>
                    <rect x="44" y="126" width="12" height="64" rx="6"/>
                    <rect x="62" y="126" width="12" height="64" rx="6"/>
                    <rect class="raised-arm" x="88" y="28" width="10" height="72" rx="5" transform="rotate(-20 93 64)"/>
                </g>
                <g class="person p5" transform="translate(680 0)" fill="#ffffff" opacity="0.34">
                    <circle cx="60" cy="34" r="18"/>
                    <rect x="42" y="54" width="36" height="74" rx="17"/>
                    <rect x="26" y="74" width="12" height="56" rx="6"/>
                    <rect x="82" y="74" width="12" height="56" rx="6"/>
                    <rect x="44" y="126" width="12" height="64" rx="6"/>
                    <rect x="62" y="126" width="12" height="64" rx="6"/>
                </g>
            </g>
        </svg>
        """.strip()
        return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode(
                "ascii"
        )


def load_sponsors() -> int:
    """Load sponsors from sponsors.json and return count."""
    sponsors_file = CONTENT_DIR / "sponsors.json"
    if not sponsors_file.exists():
        return 0
    try:
        sponsors = json.loads(sponsors_file.read_text(encoding="utf-8"))
        return len(sponsors) if isinstance(sponsors, list) else 0
    except Exception:
        return 0


def load_board_members() -> list[dict[str, str]]:
    """Load board members from board.json."""
    board_file = CONTENT_DIR / "board.json"
    if not board_file.exists():
        return []
    try:
        board = json.loads(board_file.read_text(encoding="utf-8"))
        return board if isinstance(board, list) else []
    except Exception:
        return []


def render_board_members_html(board_members: list[dict[str, str]] | None) -> str:
    """Render board members in a grid layout with images and roles."""
    if not board_members:
        return '<div class="empty-state">Keine Vorstandsmitglieder verfügbar</div>'

    members_html = []
    for member in board_members:
        name = member.get("name", "").strip()
        role = member.get("role", "").strip()
        image = member.get("image", "").strip()
        image_url = resolve_slide_image_src(image)

        members_html.append(
            f"""
        <article class="board-member">
            {f'<div class="board-member-image"><img src="{escape_html(image_url)}" alt="{escape_html(name)}" /></div>' if image_url else '<div class="board-member-image-placeholder"></div>'}
            <h3>{escape_html(name)}</h3>
            <p class="role">{escape_html(role)}</p>
        </article>
        """.strip()
        )

    return f'<div class="board-grid">{"".join(members_html)}</div>'


def make_voting_animation_svg(title: str, subtitle: str) -> str:
    """Create a simple SVG animation of raised hands voting."""
    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="{escape_html(title)}">
      <defs>
        <linearGradient id="voteBg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#17191f"/>
          <stop offset="100%" stop-color="#0e1014"/>
        </linearGradient>
        <style>
          @keyframes handRaise {{
            0%, 100% {{ transform: translateY(12px); opacity: 0.55; }}
            50% {{ transform: translateY(0px); opacity: 0.95; }}
          }}
          .hand {{ animation: handRaise 2.2s ease-in-out infinite; transform-origin: bottom; }}
          .hand1 {{ animation-delay: 0s; }}
          .hand2 {{ animation-delay: 0.28s; }}
          .hand3 {{ animation-delay: 0.56s; }}
          .hand4 {{ animation-delay: 0.84s; }}
          .hand5 {{ animation-delay: 1.12s; }}
        </style>
      </defs>
      <rect width="1600" height="900" fill="url(#voteBg)"/>
      <text x="170" y="320" fill="#f4f6f8" font-family="sans-serif" font-size="64" font-weight="700">{escape_html(title)}</text>
      <text x="170" y="400" fill="#ffb15c" font-family="sans-serif" font-size="32" font-weight="600">{escape_html(subtitle)}</text>
      
      <!-- Raised hands animation -->
      <circle class="hand hand1" cx="420" cy="600" r="28" fill="#ff8a1c" opacity="0.7"/>
      <circle class="hand hand2" cx="640" cy="610" r="24" fill="#ffb15c" opacity="0.7"/>
      <circle class="hand hand3" cx="860" cy="600" r="26" fill="#ff8a1c" opacity="0.7"/>
      <circle class="hand hand4" cx="1080" cy="615" r="25" fill="#ffb15c" opacity="0.7"/>
      <circle class="hand hand5" cx="1300" cy="600" r="27" fill="#ff8a1c" opacity="0.7"/>
    </svg>
    """.strip()
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode(
        "ascii"
    )


def _chart_data_uri(svg: str) -> str:
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode(
        "ascii"
    )


def _normalize_gender(value: str | None) -> str:
    if not value:
        return "Divers/Unbekannt"
    normalized = value.strip().lower()
    if normalized in {"f", "w", "female", "frau", "weiblich"}:
        return "Weiblich"
    if normalized in {"m", "male", "mann", "maennlich", "männlich", "herr"}:
        return "Männlich"
    return "ohne Angabe"


def make_gender_pie_chart(members: list[Member]) -> str:
    active_members = [member for member in members if member.active]
    counts = {"Weiblich": 0, "Männlich": 0, "ohne Angabe": 0}
    for member in active_members:
        counts[_normalize_gender(member.gender)] += 1

    total = sum(counts.values())
    if total == 0:
        return make_placeholder_svg(
            "Geschlechterverteilung", "Keine aktiven Mitglieder"
        )

    colors = {
        "Weiblich": "#ff8a1c",
        "Männlich": "#ffb15c",
        "ohne Angabe": "#7f8894",
    }
    center_x = 320
    center_y = 240
    radius = 140

    def arc_path(start_angle: float, end_angle: float) -> str:
        x1 = center_x + radius * math.cos(start_angle)
        y1 = center_y + radius * math.sin(start_angle)
        x2 = center_x + radius * math.cos(end_angle)
        y2 = center_y + radius * math.sin(end_angle)
        large_arc = 1 if end_angle - start_angle > math.pi else 0
        return (
            f"M {center_x} {center_y} "
            f"L {x1:.2f} {y1:.2f} "
            f"A {radius} {radius} 0 {large_arc} 1 {x2:.2f} {y2:.2f} Z"
        )

    segments: list[str] = []
    labels: list[str] = []
    angle = -math.pi / 2
    for idx, (label, count) in enumerate(counts.items()):
        if count <= 0:
            continue
        sweep = 2 * math.pi * (count / total)
        segments.append(
            f'<path d="{arc_path(angle, angle + sweep)}" fill="{colors[label]}" />'
        )
        labels.append(
            f'<text x="520" y="{142 + idx * 40}" fill="#f4f6f8" font-family="sans-serif" font-size="20">{escape_html(label)}: {count}</text>'
        )
        angle += sweep

    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="Geschlechterverteilung">
      <rect width="900" height="520" rx="20" fill="#12151b" />
      <text x="28" y="44" fill="#ffb15c" font-family="sans-serif" font-size="20" font-weight="700">Geschlechterverteilung (aktiv)</text>
      {"".join(segments)}
      <circle cx="320" cy="240" r="64" fill="#12151b"/>
      <text x="320" y="235" fill="#f4f6f8" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="700">{total}</text>
      <text x="320" y="262" fill="#aab0ba" text-anchor="middle" font-family="sans-serif" font-size="14">aktive</text>
      {"".join(labels)}
    </svg>
    """.strip()
    return _chart_data_uri(svg)


def make_age_distribution_chart(members: list[Member]) -> tuple[str, float | None]:
    active_members = [
        member for member in members if member.active and member.age is not None
    ]
    ages = [member.age for member in active_members if member.age is not None]
    if not ages:
        return make_placeholder_svg(
            "Altersverteilung", "Keine Altersdaten verfügbar"
        ), None

    buckets = [
        ("<18", lambda age: age < 18),
        ("18-25", lambda age: 18 <= age <= 25),
        ("25-50", lambda age: 25 < age <= 50),
        (">50", lambda age: age > 50),
    ]
    counts = [sum(1 for age in ages if predicate(age)) for _, predicate in buckets]
    max_count = max(max(counts), 1)
    avg_age = round(sum(ages) / len(ages), 1)

    bars: list[str] = []
    labels: list[str] = []
    bar_width = 110
    gap = 38
    chart_left = 80
    chart_bottom = 420
    chart_height = 280

    for idx, ((label, _), count) in enumerate(zip(buckets, counts)):
        x = chart_left + idx * (bar_width + gap)
        height = (count / max_count) * chart_height
        y = chart_bottom - height
        bars.append(
            f'<rect x="{x}" y="{y:.1f}" width="{bar_width}" height="{height:.1f}" rx="12" fill="#ff8a1c" opacity="0.86" />'
        )
        labels.append(
            f'<text x="{x + bar_width / 2}" y="{chart_bottom + 28}" text-anchor="middle" fill="#f4f6f8" font-family="sans-serif" font-size="18">{escape_html(label)}</text>'
            f'<text x="{x + bar_width / 2}" y="{y - 10:.1f}" text-anchor="middle" fill="#ffcf9c" font-family="sans-serif" font-size="16">{count}</text>'
        )

    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="Altersverteilung">
      <rect width="900" height="520" rx="20" fill="#12151b" />
      <text x="28" y="44" fill="#ffb15c" font-family="sans-serif" font-size="20" font-weight="700">Altersverteilung (aktiv)</text>
      <line x1="70" y1="420" x2="650" y2="420" stroke="#5d6672" stroke-width="1" />
      <line x1="70" y1="420" x2="70" y2="130" stroke="#5d6672" stroke-width="1" />
      {"".join(bars)}
      {"".join(labels)}
      <text x="700" y="220" fill="#f4f6f8" font-family="sans-serif" font-size="20">Durchschnittsalter</text>
      <text x="700" y="258" fill="#ffb15c" font-family="sans-serif" font-size="48" font-weight="700">{avg_age:.1f}</text>
      <text x="700" y="286" fill="#aab0ba" font-family="sans-serif" font-size="16">Jahre</text>
    </svg>
    """.strip()
    return _chart_data_uri(svg), avg_age


def make_member_evolution_chart(members: list[Member], reference: date) -> str:
    members_with_join_date = [
        member for member in members if member.joined_at is not None
    ]
    if not members_with_join_date:
        return make_placeholder_svg(
            "Mitgliederentwicklung", "Keine Eintrittsdaten verfügbar"
        )

    foundation = min(member.joined_at for member in members_with_join_date)
    checkpoints = [foundation]
    for year in range(foundation.year, reference.year + 1):
        point = date(year, 12, 31)
        if foundation < point <= reference:
            checkpoints.append(point)
    if reference > foundation and reference not in checkpoints:
        checkpoints.append(reference)
    timeline = sorted(checkpoints)

    series: list[tuple[date, int]] = []
    for point in timeline:
        count = 0
        for member in members_with_join_date:
            if member.joined_at > point:
                continue
            if member.leave_at is not None and member.leave_at < point:
                continue
            count += 1
        series.append((point, count))

    max_count = max(count for _, count in series) if series else 1
    max_count = max(max_count, 1)
    min_x = 80
    max_x = 1110
    min_y = 430
    max_y = 90

    coords: list[tuple[float, float, date, int]] = []
    for idx, (point, count) in enumerate(series):
        ratio_x = idx / max(len(series) - 1, 1)
        x = min_x + ratio_x * (max_x - min_x)
        ratio_y = count / max_count
        y = min_y - ratio_y * (min_y - max_y)
        coords.append((x, y, point, count))

    polyline = " ".join(f"{x:.1f},{y:.1f}" for x, y, _, _ in coords)
    nodes = "".join(
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="#ffb15c" />'
        f'<text x="{x:.1f}" y="{y - 11:.1f}" text-anchor="middle" fill="#f4f6f8" font-family="sans-serif" font-size="11">{count}</text>'
        for x, y, _, count in coords
    )

    vertical_ticks = "".join(
        f'<line x1="{x:.1f}" y1="430" x2="{x:.1f}" y2="438" stroke="#6a7380" stroke-width="1" />'
        for x, _, _, _ in coords
    )
    year_labels = "".join(
        (
            f'<text x="{x:.1f}" y="458" text-anchor="middle" fill="#aab0ba" font-family="sans-serif" font-size="11">{point.strftime("%d.%m.%Y")}</text>'
            if idx == 0
            else f'<text x="{x:.1f}" y="458" text-anchor="middle" fill="#aab0ba" font-family="sans-serif" font-size="11">{point.year}</text>'
        )
        for idx, (x, _, point, _) in enumerate(coords)
    )

    step = max(1, math.ceil(max_count / 5))
    y_grid = []
    for value in range(0, max_count + 1, step):
        y_ratio = value / max_count
        y = min_y - y_ratio * (min_y - max_y)
        y_grid.append(
            f'<line x1="80" y1="{y:.1f}" x2="1110" y2="{y:.1f}" stroke="#38414d" stroke-width="1" opacity="0.55" />'
            f'<text x="64" y="{y + 4:.1f}" text-anchor="end" fill="#8f98a4" font-family="sans-serif" font-size="11">{value}</text>'
        )

    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" role="img" aria-label="Mitgliederentwicklung">
      <rect width="1200" height="520" rx="20" fill="#12151b" />
      <text x="28" y="44" fill="#ffb15c" font-family="sans-serif" font-size="20" font-weight="700">Entwicklung aktive Mitglieder</text>
      <text x="28" y="68" fill="#aab0ba" font-family="sans-serif" font-size="13">Startpunkt und danach jeweils zum 31.12. eines Jahres</text>
      {"".join(y_grid)}
      <line x1="80" y1="430" x2="1110" y2="430" stroke="#5d6672" stroke-width="1" />
      <line x1="80" y1="430" x2="80" y2="80" stroke="#5d6672" stroke-width="1" />
      {vertical_ticks}
      <polyline fill="none" stroke="#ff8a1c" stroke-width="4" points="{polyline}" />
      {nodes}
      {year_labels}
      <text x="80" y="492" fill="#aab0ba" font-family="sans-serif" font-size="12">Gruendung: {foundation.strftime("%d.%m.%Y")}</text>
      <text x="1110" y="492" text-anchor="end" fill="#aab0ba" font-family="sans-serif" font-size="12">Auswertung bis: {reference.strftime("%d.%m.%Y")}</text>
    </svg>
    """.strip()
    return _chart_data_uri(svg)


def build_member_insights(members: list[Member], reference: date) -> MemberInsights:
    active_members = [member for member in members if member.active]
    gender_chart = make_gender_pie_chart(members)
    age_chart, avg_age = make_age_distribution_chart(members)
    evolution_chart = make_member_evolution_chart(members, reference)
    return MemberInsights(
        active_count=len(active_members),
        average_age=avg_age,
        gender_chart=gender_chart,
        age_chart=age_chart,
        evolution_chart=evolution_chart,
    )


def _finance_value(mapping: dict[str, object], key: str) -> float:
    value = mapping.get(key)
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        cleaned = value.strip().replace(" ", "").replace("€", "")
        cleaned = cleaned.replace(".", "").replace(",", ".")
        try:
            return float(cleaned)
        except ValueError:
            return 0.0
    return 0.0


def _finance_movements_list(
    entries: object, empty_label: str
) -> list[dict[str, str | float | None]]:
    if not isinstance(entries, list):
        return []
    items: list[dict[str, str | float | None]] = []
    for raw in entries[:3]:
        if not isinstance(raw, dict):
            continue
        amount = raw.get("amount")
        parsed_amount = float(amount) if isinstance(amount, (int, float)) else 0.0
        items.append(
            {
                "date": str(raw.get("date") or "-"),
                "text": str(raw.get("text") or empty_label),
                "amount": parsed_amount,
            }
        )
    return items


def make_finance_balance_chart(finance_report: dict[str, object]) -> str:
    requested = finance_report.get("requested_accounts")
    if not isinstance(requested, dict):
        return make_placeholder_svg("Finanzübersicht", "Keine Kontodaten verfügbar")

    labels = ["Kasse", "Bank (liquide)", "Bank (Anlage)"]
    values: list[tuple[str, float, float]] = []
    for label in labels:
        row = requested.get(label)
        if not isinstance(row, dict):
            values.append((label, 0.0, 0.0))
            continue
        one_year_ago = _finance_value(row, "one_year_ago")
        today = _finance_value(row, "today")
        values.append((label, one_year_ago, today))

    max_value = max((max(v1, v2) for _, v1, v2 in values), default=1.0)
    max_value = max(max_value, 1.0)

    chart_left = 120
    chart_right = 1100
    chart_bottom = 430
    chart_top = 95
    chart_height = chart_bottom - chart_top
    group_count = len(values)
    group_width = (chart_right - chart_left) / max(group_count, 1)
    bar_width = 72
    gap = 18

    bars: list[str] = []
    x_labels: list[str] = []
    legends = []

    for idx, (label, last_value, today_value) in enumerate(values):
        group_center = chart_left + (idx + 0.5) * group_width
        x1 = group_center - bar_width - gap / 2
        x2 = group_center + gap / 2
        h1 = (last_value / max_value) * chart_height
        h2 = (today_value / max_value) * chart_height
        y1 = chart_bottom - h1
        y2 = chart_bottom - h2
        bars.append(
            f'<rect x="{x1:.1f}" y="{y1:.1f}" width="{bar_width}" height="{h1:.1f}" rx="10" fill="#6f7d8f" opacity="0.95" />'
        )
        bars.append(
            f'<rect x="{x2:.1f}" y="{y2:.1f}" width="{bar_width}" height="{h2:.1f}" rx="10" fill="#ff8a1c" opacity="0.95" />'
        )
        bars.append(
            f'<text x="{x1 + bar_width / 2:.1f}" y="{y1 - 10:.1f}" text-anchor="middle" fill="#dbe2ea" font-family="sans-serif" font-size="14">{int(round(last_value))}</text>'
        )
        bars.append(
            f'<text x="{x2 + bar_width / 2:.1f}" y="{y2 - 10:.1f}" text-anchor="middle" fill="#ffd9b4" font-family="sans-serif" font-size="14">{int(round(today_value))}</text>'
        )
        x_labels.append(
            f'<text x="{group_center:.1f}" y="458" text-anchor="middle" fill="#c6ced8" font-family="sans-serif" font-size="15">{escape_html(label)}</text>'
        )

    for step in range(0, 6):
        value = max_value * step / 5
        y = chart_bottom - chart_height * step / 5
        bars.append(
            f'<line x1="120" y1="{y:.1f}" x2="1100" y2="{y:.1f}" stroke="#3a4350" stroke-width="1" opacity="0.5" />'
        )
        bars.append(
            f'<text x="104" y="{y + 4:.1f}" text-anchor="end" fill="#8f98a4" font-family="sans-serif" font-size="12">{int(round(value))}</text>'
        )

    legends.append(
        '<rect x="760" y="54" width="18" height="18" rx="4" fill="#6f7d8f" /><text x="786" y="68" fill="#d8dee7" font-family="sans-serif" font-size="14">Vorjahr</text>'
    )
    legends.append(
        '<rect x="890" y="54" width="18" height="18" rx="4" fill="#ff8a1c" /><text x="916" y="68" fill="#ffd6b0" font-family="sans-serif" font-size="14">Heute</text>'
    )

    svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" role="img" aria-label="Kontostandvergleich Vorjahr und heute">
      <rect width="1200" height="520" rx="20" fill="#12151b" />
      <text x="28" y="44" fill="#ffb15c" font-family="sans-serif" font-size="20" font-weight="700">Kontostände: Vorjahr vs Heute</text>
      <text x="28" y="68" fill="#aab0ba" font-family="sans-serif" font-size="13">Y-Achse in EUR, X-Achse nach Kontotyp</text>
      <line x1="120" y1="430" x2="1100" y2="430" stroke="#5d6672" stroke-width="1" />
      <line x1="120" y1="430" x2="120" y2="90" stroke="#5d6672" stroke-width="1" />
      {"".join(bars)}
      {"".join(x_labels)}
      {"".join(legends)}
      <text x="22" y="102" fill="#8f98a4" font-family="sans-serif" font-size="12" transform="rotate(-90, 22, 102)">EUR</text>
    </svg>
    """.strip()
    return _chart_data_uri(svg)


def build_finance_markup(finance_report: dict[str, object]) -> dict[str, str]:
    expenses = finance_report.get("expenses_since_founding")
    income = finance_report.get("income_since_founding")
    totals = finance_report.get("totals_since_founding")
    top_expenses = _finance_movements_list(
        finance_report.get("top_3_expenses_last_year"), "Ausgabe"
    )
    top_income = _finance_movements_list(
        finance_report.get("top_3_income_last_year"), "Einnahme"
    )
    total_money = finance_report.get("total_money_comparison")
    requested_accounts = finance_report.get("requested_accounts")

    expenses = expenses if isinstance(expenses, dict) else {}
    income = income if isinstance(income, dict) else {}
    totals = totals if isinstance(totals, dict) else {}
    total_money = total_money if isinstance(total_money, dict) else {}
    requested_accounts = (
        requested_accounts if isinstance(requested_accounts, dict) else {}
    )

    expense_order = ["Vereinsverwaltung", "Unterstuetzung", "Veranstaltungen"]
    income_order = ["Spenden", "Veranstaltungen", "Mitgliedsbeitraege", "Sonstiges"]

    expenses_html = "".join(
        f'<article class="finance-card"><p>{escape_html(label)}</p><strong>{escape_html(format_euro(_finance_value(expenses, label)))}</strong></article>'
        for label in expense_order
    )
    income_html = "".join(
        f'<article class="finance-card"><p>{escape_html(label)}</p><strong>{escape_html(format_euro(_finance_value(income, label)))}</strong></article>'
        for label in income_order
    )

    totals_html = "".join(
        [
            f'<article class="finance-total"><span>Gesamteinnahmen seit Gründung</span><strong>{escape_html(format_euro(_finance_value(totals, "income")))}</strong></article>',
            f'<article class="finance-total"><span>Gesamtausgaben seit Gründung</span><strong>{escape_html(format_euro(_finance_value(totals, "expenses")))}</strong></article>',
            f'<article class="finance-total"><span>Differenz</span><strong>{escape_html(format_euro(_finance_value(totals, "difference")))}</strong></article>',
        ]
    )

    def movement_html(items: list[dict[str, str | float | None]], empty: str) -> str:
        if not items:
            return f'<div class="empty-state">{escape_html(empty)}</div>'
        return "".join(
            f'<article class="finance-movement"><div><span>{escape_html(str(item["date"]))}</span><p>{escape_html(str(item["text"]))}</p></div><strong>{escape_html(format_euro(float(item["amount"])))}</strong></article>'
            for item in items
        )

    top_expenses_html = movement_html(top_expenses, "Keine Ausgaben im letzten Jahr")
    top_income_html = movement_html(top_income, "Keine Einnahmen im letzten Jahr")

    account_rows = []
    for label in ("Kasse", "Bank (liquide)", "Bank (Anlage)"):
        row = requested_accounts.get(label)
        if not isinstance(row, dict):
            account_rows.append(
                f'<article class="finance-account-row"><span>{escape_html(label)}</span><span>-</span><span>-</span><span>-</span></article>'
            )
            continue
        one_year_ago = _finance_value(row, "one_year_ago")
        today = _finance_value(row, "today")
        diff = _finance_value(row, "difference")
        account_rows.append(
            f'<article class="finance-account-row"><span>{escape_html(label)}</span><span>{escape_html(format_euro(one_year_ago))}</span><span>{escape_html(format_euro(today))}</span><span>{escape_html(format_euro(diff))}</span></article>'
        )

    total_money_html = (
        f'<article class="finance-total"><span>Gesamt vor einem Jahr</span><strong>{escape_html(format_euro(_finance_value(total_money, "one_year_ago")))}</strong></article>'
        f'<article class="finance-total"><span>Gesamt heute</span><strong>{escape_html(format_euro(_finance_value(total_money, "today")))}</strong></article>'
        f'<article class="finance-total"><span>Differenz</span><strong>{escape_html(format_euro(_finance_value(total_money, "difference")))}</strong></article>'
    )

    return {
        "expenses_cards": expenses_html,
        "income_cards": income_html,
        "totals_cards": totals_html,
        "top_expenses": top_expenses_html,
        "top_income": top_income_html,
        "account_rows": "".join(account_rows),
        "total_money_cards": total_money_html,
        "balance_chart": make_finance_balance_chart(finance_report),
    }


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
        cleaned = [make_placeholder_svg(fallback_title, "Bilder aus dem Vereinsjahr")]

    frames = [
        f'<img class="frame{(" active" if index == 0 else "")}" src="{escape_html(url)}" alt="{escape_html(alt_prefix)} {index + 1}" loading="lazy" />'
        for index, url in enumerate(cleaned)
    ]
    return (
        f'<div class="auto-slideshow" data-slideshow="{escape_html(name)}">'
        + "".join(frames)
        + "</div>"
    )


def category_cards(
    entries: list[dict[str, str]],
    article_details: dict[str, dict[str, str]],
    empty_text: str,
    item_type: str,
    max_items: int = 6,
) -> str:
    if not entries:
        return f'<div class="empty-state">{escape_html(empty_text)}</div>'

    rendered: list[str] = []
    visible_items = entries[: max_items if max_items > 0 else len(entries)]
    for entry in visible_items:
        article_date = parse_date(str(entry["article_date"]))
        article_title = str(entry.get("article_title", "")).strip()
        detail = article_details.get(article_title, {})
        modal_payload = {
            "title": detail.get("title") or article_title,
            "date": detail.get("date") or str(entry.get("article_date", "")),
            "short": detail.get("short") or str(entry.get("article_short", "")).strip(),
            "text": detail.get("text") or str(entry.get("article_short", "")).strip(),
            "image": detail.get("image") or "",
        }
        payload_json = json.dumps(modal_payload, ensure_ascii=False)
        payload_b64 = base64.b64encode(payload_json.encode("utf-8")).decode("ascii")
        if item_type == "donation":
            label_prefix = "eingegangen" if entry["kind"] == "received" else "geleistet"
            rendered.append(
                f"""
                                <article class="entry-card entry-card-clickable" role="button" tabindex="0" data-entry="{escape_html(payload_b64)}">
                  <div class="entry-toprow">
                    <span class="badge">{escape_html(label_prefix)}</span>
                    <span class="entry-date">{escape_html(format_german_date(article_date))}</span>
                  </div>
                  <h3>{escape_html(entry["amount"])} <span class="dim">{escape_html(entry["label"])}</span></h3>
                  <p class="entry-title">{escape_html(entry["article_title"])}</p>
                  {f'<p class="entry-short">{escape_html(entry["article_short"])}</p>' if entry.get("article_short") else ""}
                </article>
                """.strip()
            )
        else:
            rendered.append(
                f"""
                                <article class="entry-card entry-card-clickable" role="button" tabindex="0" data-entry="{escape_html(payload_b64)}">
                  <div class="entry-toprow">
                    <span class="badge">{escape_html(entry["kind"])}</span>
                    <span class="entry-date">{escape_html(format_german_date(article_date))}</span>
                  </div>
                  <h3>{escape_html(entry["label"])}</h3>
                  <p class="entry-title">{escape_html(entry["article_title"])}</p>
                  {f'<p class="entry-short">{escape_html(entry["article_short"])}</p>' if entry.get("article_short") else ""}
                </article>
                """.strip()
            )

    if len(entries) > len(visible_items):
        rendered.append(
            f'<article class="entry-card"><p class="entry-short">+ {len(entries) - len(visible_items)} weitere Einträge</p></article>'
        )
    return "\n".join(rendered)


def agenda_items(review_year: int, include_organe_voting: bool) -> str:
    entries: list[tuple[str, str]] = [
        ("Begrüßung", "Start und kurze Einführung."),
        ("Agenda", "Ablauf und Struktur der Sitzung."),
        ("Versammlungsleitung", "Bestimmung Versammlungsleiter, Protokoll und Abstimmungsform."),
        ("Vereinsdaten", "Kennzahlen und aktuelle Lage."),
        (f"Rückblick {review_year}", "Spenden, Aktionen und Highlights."),
        ("Kassenbericht", "Einnahmen, Ausgaben, Entwicklung."),
        ("Entlastung Vorstandschaft", "Abstimmung und Ergebnis."),
        ("Beitragsordnung", "Beschluss zu Beitragsmodellen und Rabatt."),
    ]
    if include_organe_voting:
        entries.append(("Wahl neuer Vereinsorgane", "Wahl und Besetzung der Organe."))
    entries.append(("Vorschau", "Nächste Schritte und Planung."))

    rows = "".join(
        f"<li><span>{idx}</span><div><strong>{escape_html(title)}</strong><p>{escape_html(description)}</p></div></li>"
        for idx, (title, description) in enumerate(entries, start=1)
    )
    return f'<ol class="agenda-list">{rows}</ol>'


def overview_cards(
    article_count: int,
    active_member_count: int,
    event_count: int,
    boundary_date: date,
    reference_date: date,
    sponsor_count: int = 0,
) -> str:
    cards = [
        ("Artikel", str(article_count), f"seit {format_german_date(boundary_date)}"),
        ("Aktive Mitglieder", str(active_member_count), "Stand heute"),
        (
            "Veranstaltungen",
            str(event_count),
            f"bis {format_german_date(reference_date)}",
        ),
    ]
    if sponsor_count > 0:
        cards.append(
            ("Unterstützer/Sponsoren", str(sponsor_count), "Partner und Freunde")
        )
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


def render_slides_markup(
    *,
    review_year: int,
    boundary_date: date,
    reference_date: date,
    included_articles: list[dict[str, object]],
    collage_images: list[str],
    member_insights: MemberInsights,
    finance_report: dict[str, object],
    received: list[dict[str, str]],
    given: list[dict[str, str]],
    kinderlicht_events: list[dict[str, str]],
    external_events: list[dict[str, str]],
    article_details: dict[str, dict[str, str]],
    include_organe_voting: bool,
    custom_slides: list[CustomSlide],
    custom_image_map: dict[int, str],
    preview_events: list[PreviewEvent],
    board_members: list[dict[str, str]] | None = None,
    sponsor_count: int = 0,
) -> str:
    first_member_of_board = (
        [
            member
            for member in board_members
            if member.get("role") in ("Erster Vorstand", "Erste Vorständin")
        ][0]
        if board_members
        else None
    )
    minute_writer = (
        [
            member
            for member in board_members
            if member.get("role") in ("Schriftführer", "Schriftführerin")
        ][0]
        if board_members
        else None
    )
    if first_member_of_board is None or minute_writer is None:
        raise ValueError("Board members must include a first chair and a minute writer")
    overview_html = overview_cards(
        article_count=len(included_articles),
        active_member_count=member_insights.active_count,
        event_count=len(kinderlicht_events) + len(external_events),
        boundary_date=boundary_date,
        reference_date=reference_date,
        sponsor_count=sponsor_count,
    )

    agenda_html = agenda_items(review_year, include_organe_voting)
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
        article_details,
        "Keine Spenden mit passendem Tag.",
        "donation",
        max_items=4,
    )
    rueckblick_given = category_cards(
        given,
        article_details,
        "Keine Ausgaben mit passendem Tag.",
        "donation",
        max_items=4,
    )
    rueckblick_kinderlicht = category_cards(
        kinderlicht_events,
        article_details,
        "Keine Kinderlicht-Veranstaltungen mit passendem Tag.",
        "event",
        max_items=4,
    )
    rueckblick_external = category_cards(
        external_events,
        article_details,
        "Keine externen Veranstaltungen mit passendem Tag.",
        "event",
        max_items=4,
    )
    finance_markup = build_finance_markup(finance_report)

    entlastung_image = make_voting_animation_svg(
        "Entlastung der Vorstandschaft",
        "Abstimmung und Ergebnis",
    )

    beitragsordnung_image = make_voting_animation_svg(
        "Abstimmung Beitragsordnung",
        "Beschluss der Mitgliederversammlung",
    )
    voting_animation_three = make_voting_animation_svg(
        "Abstimmung Versammlungsleitung",
        "Versammlungsleiter, Schriftführer und Abstimmungsform",
    )
    voting_animation_organs = make_voting_animation_svg(
        "Neuwahl der Vereinsorgane",
        "Abstimmung und Besetzung der Organe",
    )

    beitragsordnung_markup = """
            <div class="beitragsordnung-stage">
                <div class="beitrags-top-grid">
                    <article class="beitrags-tarif highlight">
                        <span class="tarif-name">Standard</span>
                        <strong>24 EUR</strong>
                        <p>jährlich pro Person</p>
                    </article>
                    <article class="beitrags-tarif">
                        <span class="tarif-name">Partnerschaft</span>
                        <strong>21 EUR</strong>
                        <p>jährlich pro Person</p>
                    </article>
                    <article class="beitrags-tarif">
                        <span class="tarif-name">Kinder / Jugendliche</span>
                        <strong>12 EUR</strong>
                        <p>jährlich pro Person</p>
                    </article>
                </div>
                <article class="beitrags-rabatt">
                    <h3>Familienrabatt</h3>
                    <p>Fuer alle Familienangehoerigen ersten Grades sowie Geschwister gilt ein Rabatt von 3 EUR pro Person.</p>
                </article>
            </div>
    """.strip()

    board_members_html = render_board_members_html(board_members)

    versammlungsleiter_member = (
        board_members[0] if board_members and len(board_members) > 0 else {}
    )
    schriftfuehrer_member = (
        board_members[3] if board_members and len(board_members) > 3 else {}
    )

    def _member_vote_label(member: dict[str, str]) -> str:
        name = escape_html(member.get("name", "").strip())
        role = escape_html(member.get("role", "").strip())
        if name and role:
            return f"<strong>{name}</strong> ({role})"
        if name:
            return f"<strong>{name}</strong>"
        return "Nicht verfügbar"

    versammlungsleiter_html = _member_vote_label(versammlungsleiter_member)
    schriftfuehrer_html = _member_vote_label(schriftfuehrer_member)

    versammlungsleiter_image_src = resolve_slide_image_src(
        versammlungsleiter_member.get("image", "")
    )
    schriftfuehrer_image_src = resolve_slide_image_src(
        schriftfuehrer_member.get("image", "")
    )

    versammlungsleiter_img_html = (
        f'<div class="person-image"><img src="{escape_html(versammlungsleiter_image_src)}" alt="{escape_html(versammlungsleiter_member.get("name", "Versammlungsleiter"))}" /></div>'
        if versammlungsleiter_image_src
        else '<div class="person-image board-member-image-placeholder"></div>'
    )
    schriftfuehrer_img_html = (
        f'<div class="person-image"><img src="{escape_html(schriftfuehrer_image_src)}" alt="{escape_html(schriftfuehrer_member.get("name", "Schriftführer"))}" /></div>'
        if schriftfuehrer_image_src
        else '<div class="person-image board-member-image-placeholder"></div>'
    )

    versammlungsleiter_section = f"""
        <section class="slide full content-focus vote-section">
            <div class="slide-inner">
                <div class="hero compact vote-head">
                    <div class="kicker">Abstimmung</div>
                    <h1>Versammlungsleitung & Schriftführer</h1>
                    <p class="lead">Vorschläge für die Leitung und Protokoll dieser Jahreshauptversammlung.</p>
                </div>
                <div class="vote-stage vote-stage-stack">
                    <div class="voting-items-grid">
                        <article class="voting-person-item">
                            {versammlungsleiter_img_html}
                            <h3>Versammlungsleiter</h3>
                            <p class="person-name">{versammlungsleiter_html}</p>
                        </article>
                        <article class="voting-person-item">
                            {schriftfuehrer_img_html}
                            <h3>Protokoll & Schriftführer</h3>
                            <p class="person-name">{schriftfuehrer_html}</p>
                        </article>
                        <article class="voting-person-item voting-mode-item">
                            <div class="person-image hand-emoji" role="img" aria-label="Handzeichen">✋</div>
                            <h3>Abstimmungsform</h3>
                            <p class="person-name"><strong>Alle Abstimmungen erfolgen per Handzeichen</strong> (nicht geheim)</p>
                        </article>
                    </div>
                    <div class="voting-animation-panel">
                        <div class="art"><img src="{voting_animation_three}" alt="Abstimmung Versammlungsleitung" /></div>
                    </div>
                </div>
            </div>
        </section>
    """.strip()

    elect = (
        "Wir wählen neu für folgende Positionen, die bisher wie folgt besetzt sind:"
        if include_organe_voting
        else ""
    )
    if include_organe_voting:
        animation = f"""<div class="voting-animation-panel"><div class="art"><img src="{voting_animation_organs}" alt="Abstimmung Vereinsorgane" /></div></div>"""
        organe_voting_section = f"""
        <section class="slide split content-focus vote-section">
            <div class="slide-inner split-layout">
                <div class="content-pane">
                    <div class="hero compact vote-head">
                        <div class="kicker">Wahl</div>
                        <h1>Die aktuelle Vorstandschaft</h1>
                        <p class="lead">Dieser Tagesordnungspunkt findet gemäß Satzung nur in geraden Jahren statt. {elect}</p>
                        {board_members_html}
                    </div>
                </div>
                <div class="vote-stage vote-stage-media">
                    {animation}
                </div>
            </div>
        </section>
            """.strip()
    else:
        organe_voting_section = f"""
        <section class="slide full content-focus vote-section vote-section-solo">
            <div class="slide-inner">
                <div class="hero compact vote-head">
                    <div class="kicker">Wahl</div>
                    <h1>Die aktuelle Vorstandschaft</h1>
                    <p class="lead">Dieser Tagesordnungspunkt findet gemäß Satzung nur in geraden Jahren statt.</p>
                    {board_members_html}
                </div>
            </div>
        </section>
            """.strip()

    custom_slides_html = "\n".join(
        render_custom_slide_section(
            slide,
            kicker="Zusatz",
            image_src=custom_image_map.get(idx),
        )
        for idx, slide in enumerate(custom_slides)
                if slide.title.strip().casefold() != "vorschau"
    )

    preview_events_html = render_preview_events_html(preview_events)
    preview_section = f"""
        <section class="slide full content-focus">
            <div class="slide-inner">
                <div class="preview-stage">
                    <div class="agenda-head preview-head">
                        <div class="kicker">Ausblick</div>
                        <h1>Vorschau</h1>
                    </div>
                    {preview_events_html}
                </div>
            </div>
        </section>
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
        f"<span>{escape_html(item)}</span>" for item in (welcome_stream_items * 4)
    )

    return f"""
      <section class="slide full cover-slide">
        <div class="slide-inner cover-stage">
          <div class="cover-bg">{welcome_show}</div>
          <div class="cover-overlay"></div>
          <div class="cover-content">
            <div class="cover-panel">
              <div class="kicker">Begrüßung</div>
              <h1 class="cover-title-singleline">Willkommen zur Jahreshauptversammlung</h1>
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

            {versammlungsleiter_section}

      <section class="slide full content-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Vereinsdaten</div>
              <h1>Übersicht aktueller Vereinsdaten</h1>
              <div class="kpi-grid">{overview_html}</div>
              <div class="member-plot-grid">
                <article class="member-plot">
                  <img src="{member_insights.gender_chart}" alt="Geschlechterverteilung" />
                </article>
                <article class="member-plot">
                  <img src="{member_insights.age_chart}" alt="Altersverteilung mit Durchschnittsalter" />
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="slide full content-focus">
        <div class="slide-inner split-layout">
          <div class="content-pane">
            <div class="hero compact">
              <div class="kicker">Vereinsdaten</div>
              <h1>Mitgliederentwicklung zum Jahresende</h1>
              <p class="lead">Entwicklung ab Vereinsstart bis jeweils zum 31.12. jedes Jahres.</p>
              <div class="member-plot-grid">
                <article class="member-plot member-plot-wide">
                  <img src="{member_insights.evolution_chart}" alt="Mitgliederentwicklung vom Start bis zu den jeweiligen 31.12.-Stichtagen" />
                </article>
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
                            <h1>Einnahmen und Ausgaben nach Kategorie</h1>
                            <div class="finance-columns">
                                <div>
                                    <h3 class="finance-heading">Ausgaben seit Gründung</h3>
                                    <div class="finance-grid">{finance_markup["expenses_cards"]}</div>
                                </div>
                                <div>
                                    <h3 class="finance-heading">Einnahmen seit Gründung</h3>
                                    <div class="finance-grid">{finance_markup["income_cards"]}</div>
                                </div>
              </div>
                            <div class="finance-totals">{finance_markup["totals_cards"]}</div>
            </div>
          </div>
        </div>
      </section>

            <section class="slide full content-focus">
                <div class="slide-inner split-layout">
                    <div class="content-pane">
                        <div class="hero compact">
                            <div class="kicker">Finanzen</div>
                            <h1>Top 3 Bewegungen im letzten Jahr</h1>
                            <div class="finance-columns">
                                <div>
                                    <h3 class="finance-heading">Größte Ausgaben</h3>
                                    <div class="finance-movements">{finance_markup["top_expenses"]}</div>
                                </div>
                                <div>
                                    <h3 class="finance-heading">Größte Einnahmen</h3>
                                    <div class="finance-movements">{finance_markup["top_income"]}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="slide full content-focus">
                <div class="slide-inner split-layout">
                    <div class="content-pane">
                        <div class="hero compact">
                            <div class="kicker">Finanzen</div>
                            <h1>Vermögensübersicht: Vorjahr vs Heute</h1>
                            <div class="finance-totals">{finance_markup["total_money_cards"]}</div>
                            <article class="member-plot member-plot-wide finance-plot">
                                <img src="{finance_markup["balance_chart"]}" alt="Kontostände je Kontotyp im Vergleich Vorjahr zu heute" />
                            </article>
                            <div class="finance-account-table">
                                <article class="finance-account-row finance-account-head"><span>Kontotyp</span><span>Vorjahr</span><span>Heute</span><span>Diff</span></article>
                                {finance_markup["account_rows"]}
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
              <p class="lead">Unser freiwillig bestellter Kassenprüfer Ronald Koch empfiehlt die Entlastung der Vorstandschaft.</p>
            </div>
          </div>
          <div class="media-pane subtle"><div class="art"><img src="{entlastung_image}" alt="Entlastung der Vorstandschaft" /></div></div>
        </div>
      </section>

        <section class="slide split content-focus">
            <div class="slide-inner split-layout">
                <div class="content-pane">
                    <div class="hero compact beitragsordnung-hero">
                        <div class="kicker">Beschluss</div>
                        <h1>Beitragsordnung</h1>
                        <p class="lead">Abstimmung über die neuen Beitragssätze für Mitglieder und Familienrabatt.</p>
                        {beitragsordnung_markup}
                    </div>
                </div>
                <div class="media-pane subtle"><div class="art"><img src="{beitragsordnung_image}" alt="Abstimmung Beitragsordnung" /></div></div>
            </div>
        </section>

            {organe_voting_section}

            {preview_section}

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

            <div class="entry-modal" id="entry-modal" hidden aria-hidden="true">
                <div class="entry-modal-backdrop" data-modal-close></div>
                <article class="entry-modal-card" role="dialog" aria-modal="true" aria-labelledby="entry-modal-title">
                    <button type="button" class="entry-modal-close" data-modal-close aria-label="Schließen">×</button>
                    <div class="entry-modal-media" id="entry-modal-media" hidden>
                        <img id="entry-modal-image" src="" alt="" />
                    </div>
                    <div class="entry-modal-content">
                        <p class="entry-modal-date" id="entry-modal-date"></p>
                        <h2 id="entry-modal-title"></h2>
                        <p class="entry-modal-short" id="entry-modal-short"></p>
                        <p class="entry-modal-text" id="entry-modal-text"></p>
                    </div>
                </article>
            </div>

      {custom_slides_html}
    """.strip()


def render_minutes_text(
    *,
    review_year: int,
    boundary_date: date,
    reference_date: date,
    included_articles: list[dict[str, object]],
    member_insights: MemberInsights,
    finance_report: dict[str, object],
    received: list[dict[str, str]],
    given: list[dict[str, str]],
    kinderlicht_events: list[dict[str, str]],
    external_events: list[dict[str, str]],
    preview_events: list[PreviewEvent],
    board_members: list[dict[str, str]],
    sponsor_count: int,
    include_organe_voting: bool,
) -> str:
    template_path = TEMPLATE_DIR / "jhv_minutes_template.de.txt"
    template = Template(template_path.read_text(encoding="utf-8"))

    agenda_titles = [
        "Begrüßung",
        "Agenda",
        "Versammlungsleitung",
        "Vereinsdaten",
        f"Rückblick {review_year}",
        "Kassenbericht",
        "Entlastung Vorstandschaft",
        "Beitragsordnung",
    ]
    if include_organe_voting:
        agenda_titles.append("Wahl neuer Vereinsorgane")
    agenda_titles.append("Vorschau")

    board_lines = "\n".join(
        f"- {member.get('name', '').strip()} ({member.get('role', '').strip()})"
        for member in board_members
        if member.get("name") or member.get("role")
    ) or "- Keine Vorstandsmitglieder verfügbar"

    article_titles = "\n".join(
        f"- {str(article.get('title', '')).strip()}"
        for article in included_articles
        if str(article.get("title", "")).strip()
    ) or "- Keine Beiträge vorhanden"

    finance_totals = finance_report.get("totals_since_founding")
    finance_totals = finance_totals if isinstance(finance_totals, dict) else {}
    finance_requested = finance_report.get("requested_accounts")
    finance_requested = finance_requested if isinstance(finance_requested, dict) else {}

    top_expenses = _finance_movements_list(
        finance_report.get("top_3_expenses_last_year"), "Ausgabe"
    )
    top_income = _finance_movements_list(
        finance_report.get("top_3_income_last_year"), "Einnahme"
    )

    finance_summary_lines = [
        f"- Gesamteinnahmen seit Gründung: {format_euro(_finance_value(finance_totals, 'income'))}",
        f"- Gesamtausgaben seit Gründung: {format_euro(_finance_value(finance_totals, 'expenses'))}",
        f"- Differenz: {format_euro(_finance_value(finance_totals, 'difference'))}",
        f"- Kassenbestand heute: {format_euro(_finance_value(finance_requested.get('Kasse', {}), 'today') if isinstance(finance_requested.get('Kasse'), dict) else 0)}",
        f"- Bank (liquide) heute: {format_euro(_finance_value(finance_requested.get('Bank (liquide)', {}), 'today') if isinstance(finance_requested.get('Bank (liquide)'), dict) else 0)}",
        f"- Bank (Anlage) heute: {format_euro(_finance_value(finance_requested.get('Bank (Anlage)', {}), 'today') if isinstance(finance_requested.get('Bank (Anlage)'), dict) else 0)}",
    ]
    if top_expenses:
        finance_summary_lines.append("- Größte Ausgaben des letzten Jahres:")
        finance_summary_lines.extend(
            f"  - {item['date']}: {item['text']} ({format_euro(item['amount'])})"
            for item in top_expenses
        )
    if top_income:
        finance_summary_lines.append("- Größte Einnahmen des letzten Jahres:")
        finance_summary_lines.extend(
            f"  - {item['date']}: {item['text']} ({format_euro(item['amount'])})"
            for item in top_income
        )
    finance_summary = "\n".join(finance_summary_lines)

    preview_summary_lines = []
    for event in preview_events:
        tags_text = f" [{', '.join(event.tags)}]" if event.tags else ""
        preview_summary_lines.append(
            f"- {event.date}: {event.title}{tags_text}"
            + (f" - {event.description}" if event.description else "")
        )
    preview_summary = "\n".join(preview_summary_lines)

    voting_result_placeholder = "[[ERGEBNIS EINTRAGEN]]"
    versammlungsleiter_name = (
        f"{board_members[0].get('name', '')} ({board_members[0].get('role', '')})"
        if board_members and len(board_members) > 0
        else "Nicht verfügbar"
    )
    schriftfuehrer_name = (
        f"{board_members[3].get('name', '')} ({board_members[3].get('role', '')})"
        if board_members and len(board_members) > 3
        else "Nicht verfügbar"
    )

    return template.safe_substitute(
        review_year=review_year,
        boundary_date=format_german_date(boundary_date),
        reference_date=format_german_date(reference_date),
        article_count=len(included_articles),
        active_member_count=member_insights.active_count,
        average_age="-" if member_insights.average_age is None else f"{member_insights.average_age:.1f}",
        sponsor_count=sponsor_count,
        event_count=len(kinderlicht_events) + len(external_events),
        received_count=len(received),
        given_count=len(given),
        kinderlicht_event_count=len(kinderlicht_events),
        external_event_count=len(external_events),
        article_titles=article_titles,
        agenda_summary="\n".join(f"- {item}" for item in agenda_titles),
        board_overview=board_lines,
        versammlungsleiter_name=versammlungsleiter_name,
        schriftfuehrer_name=schriftfuehrer_name,
        voting_placeholder=voting_result_placeholder,
        finance_summary=finance_summary,
        preview_summary=preview_summary,
        preview_event_count=len(preview_events),
    )


def render_slide_deck(
    *,
    review_year: int,
    slides_markup: str,
) -> str:
    template_path = TEMPLATE_DIR / "slide_deck.html.tpl"
    css_path = TEMPLATE_DIR / "slide_deck.css"
    js_path = TEMPLATE_DIR / "slide_deck.js"

    template = Template(template_path.read_text(encoding="utf-8"))
    css = css_path.read_text(encoding="utf-8")
    js = js_path.read_text(encoding="utf-8")

    return template.substitute(
        deck_title=f"Rückblick {review_year} · Kinderlicht",
        embedded_css=css,
        slides_markup=slides_markup,
        embedded_js=js,
    )


def _decode_svg_data_uri(data_uri: str) -> str:
    if not data_uri.startswith("data:image/svg+xml;base64,"):
        raise ValueError("Only SVG data URI plots are supported for PDF export")
    encoded = data_uri.split(",", 1)[1]
    return base64.b64decode(encoded).decode("utf-8")


def _install_missing_pdf_dependencies(missing_dependencies: list[str]) -> None:
    install_cmd = [sys.executable, "-m", "pip", "install", *missing_dependencies]
    print("Installing missing PDF dependencies: " + " ".join(missing_dependencies))
    subprocess.run(install_cmd, check=True)


def _lazy_import_pdf_dependencies(*, auto_install: bool = False):
    A4 = None
    landscape = None
    ImageReader = None
    canvas = None
    cairosvg = None
    missing: list[str] = []

    try:
        from reportlab.lib.pagesizes import (
            A4 as reportlab_a4,
            landscape as reportlab_landscape,
        )
        from reportlab.lib.utils import ImageReader as reportlab_image_reader
        from reportlab.pdfgen import canvas as reportlab_canvas

        A4 = reportlab_a4
        landscape = reportlab_landscape
        ImageReader = reportlab_image_reader
        canvas = reportlab_canvas
    except ModuleNotFoundError:
        missing.append("reportlab")

    try:
        import cairosvg as cairosvg_module

        cairosvg = cairosvg_module
    except ModuleNotFoundError:
        missing.append("cairosvg")

    if missing:
        unique_missing = sorted(set(missing))
        if auto_install:
            _install_missing_pdf_dependencies(unique_missing)
            return _lazy_import_pdf_dependencies(auto_install=False)

        install_hint = f"{sys.executable} -m pip install " + " ".join(unique_missing)
        raise RuntimeError(
            "PDF export requires optional dependencies. Install with: "
            f"{install_hint} (or rerun with --install-pdf-deps)."
        )

    return {
        "A4": A4,
        "landscape": landscape,
        "ImageReader": ImageReader,
        "canvas": canvas,
        "cairosvg": cairosvg,
    }


def build_pdf_slides(
    *,
    review_year: int,
    boundary_date: date,
    reference_date: date,
    included_articles: list[dict[str, object]],
    member_insights: MemberInsights,
    received: list[dict[str, str]],
    given: list[dict[str, str]],
    kinderlicht_events: list[dict[str, str]],
    external_events: list[dict[str, str]],
    preview_events: list[PreviewEvent],
    include_organe_voting: bool,
) -> list[PdfSlide]:
    agenda_items = [
        "1 Begruessung",
        "2 Agenda",
        "3 Versammlungsleitung",
        "4 Vereinsdaten",
        f"5 Rueckblick {review_year}",
        "6 Kassenbericht",
        "7 Entlastung Vorstandschaft",
        "8 Beitragsordnung",
    ]
    if include_organe_voting:
        agenda_items.append("9 Wahl neuer Vereinsorgane")
        agenda_items.append("10 Vorschau")
    else:
        agenda_items.append("9 Vorschau")
    agenda = tuple(agenda_items)

    preview_bullets: tuple[str, ...]
    if preview_events:
        preview_bullets = tuple(
            f"{event.date}: {event.title}"
            + (f" [{', '.join(event.tags)}]" if event.tags else "")
            + (f" - {event.description}" if event.description else "")
            for event in preview_events
        )
    else:
        preview_bullets = tuple()

    def _entry_bullets(entries: list[dict[str, str]], prefix: str) -> tuple[str, ...]:
        if not entries:
            return ("Keine Eintraege vorhanden",)
        return tuple(
            f"{prefix}: {item['label']} ({item['article_date']})"
            for item in entries[:8]
        )

    slides = [
        PdfSlide(
            title="Willkommen zur Jahreshauptversammlung",
            subtitle=f"Rueckblick {review_year}",
            bullets=(
                f"Zeitraum: {format_german_date(boundary_date)} bis {format_german_date(reference_date)}",
                f"Beitraege: {len(included_articles)}",
                f"Spendenvorgaenge: {len(received) + len(given)}",
            ),
            plot_images=tuple(),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Tagesordnung",
            subtitle="Ablauf",
            bullets=agenda,
            plot_images=tuple(),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Versammlungsleitung & Schriftführer",
            subtitle="Abstimmung",
            bullets=(
                "Versammlungsleiter wird per Handzeichen bestätigt",
                "Schriftführer protokolliert die Sitzung",
                "Abstimmungsform: Handzeichen, nicht geheim",
            ),
            plot_images=tuple(),
            plot_placeholders=("Abstimmung",),
        ),
        PdfSlide(
            title="Vereinsdaten",
            subtitle="Kennzahlen und Verteilung",
            bullets=(
                f"Aktive Mitglieder: {member_insights.active_count}",
                f"Durchschnittsalter: {member_insights.average_age if member_insights.average_age is not None else '-'}",
            ),
            plot_images=(member_insights.gender_chart, member_insights.age_chart),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Mitgliederentwicklung",
            subtitle="Start bis Jahresend-Stichtage",
            bullets=tuple(),
            plot_images=(member_insights.evolution_chart,),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Eingegangene Spenden",
            subtitle="Rueckblick",
            bullets=_entry_bullets(received, "Spende +"),
            plot_images=tuple(),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Geleistete Spenden",
            subtitle="Rueckblick",
            bullets=_entry_bullets(given, "Spende -"),
            plot_images=tuple(),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Veranstaltungen Kinderlicht",
            subtitle="Rueckblick",
            bullets=_entry_bullets(kinderlicht_events, "Event"),
            plot_images=tuple(),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Veranstaltungen Extern",
            subtitle="Rueckblick",
            bullets=_entry_bullets(external_events, "Event"),
            plot_images=tuple(),
            plot_placeholders=tuple(),
        ),
        PdfSlide(
            title="Kassenbericht",
            subtitle="Finanzen",
            bullets=tuple(),
            plot_images=tuple(),
            plot_placeholders=("Einnahmen vs Ausgaben", "Kassenverlauf"),
        ),
        PdfSlide(
            title="Entlastung der Vorstandschaft",
            subtitle="Beschluss",
            bullets=tuple(),
            plot_images=tuple(),
            plot_placeholders=("Stimmenverteilung", "Anwesenheit und Quorum"),
        ),
        PdfSlide(
            title="Beitragsordnung und Vereinsorgane",
            subtitle="Beschluss",
            bullets=(
                "Standard: 24 EUR jährlich pro Person",
                "Partnerschaft: 21 EUR jährlich pro Person",
                "Kinder/Jugendliche: 12 EUR jährlich pro Person",
                "Rabatt: 3 EUR pro Person fuer Familienangehoerige ersten Grades und Geschwister",
            ),
            plot_images=tuple(),
            plot_placeholders=("Beitragsmodelle",),
        ),
        PdfSlide(
            title="Vorschau",
            subtitle="Naechste Schritte",
            bullets=preview_bullets,
            plot_images=tuple(),
            plot_placeholders=("Vorschau",),
        ),
        PdfSlide(
            title="Danke",
            subtitle="Kinderlicht Wallersdorf e.V.",
            bullets=("Fuer eure Zeit, euren Einsatz und eure Unterstuetzung.",),
            plot_images=tuple(),
            plot_placeholders=tuple(),
        ),
    ]

    if include_organe_voting:
        slides.insert(
            12,
            PdfSlide(
                title="Wahl neuer Vereinsorgane",
                subtitle="Beschluss",
                bullets=(
                    "Dieser Punkt findet regulaer nur in geraden Jahren statt.",
                    "Vorstellung, Wahl und Besetzung der Organe.",
                ),
                plot_images=tuple(),
                plot_placeholders=("Besetzung Vereinsorgane", "Stimmenverteilung"),
            ),
        )

    return slides


def export_slides_pdf(
    slides: list[PdfSlide], output_path: Path, *, auto_install_deps: bool = False
) -> None:
    deps = _lazy_import_pdf_dependencies(auto_install=auto_install_deps)
    A4 = deps["A4"]
    landscape = deps["landscape"]
    ImageReader = deps["ImageReader"]
    canvas = deps["canvas"]
    cairosvg = deps["cairosvg"]

    page_size = landscape(A4)
    page_width, page_height = page_size

    output_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(output_path), pagesize=page_size)

    for index, slide in enumerate(slides, start=1):
        # Background
        c.setFillColorRGB(0.07, 0.08, 0.11)
        c.rect(0, 0, page_width, page_height, stroke=0, fill=1)

        # Header
        c.setFillColorRGB(0.96, 0.97, 0.98)
        c.setFont("Helvetica-Bold", 28)
        c.drawString(40, page_height - 58, slide.title)
        if slide.subtitle:
            c.setFillColorRGB(1.0, 0.69, 0.36)
            c.setFont("Helvetica", 14)
            c.drawString(40, page_height - 80, slide.subtitle)

        # Bullet content
        y = page_height - 120
        c.setFillColorRGB(0.92, 0.94, 0.97)
        c.setFont("Helvetica", 12)
        for bullet in slide.bullets:
            if y < 70:
                break
            c.drawString(52, y, f"- {bullet}")
            y -= 18

        # Plot images (charts)
        if slide.plot_images:
            plot_top = y - 12
            if len(slide.plot_images) == 1:
                boxes = [(40, 70, page_width - 80, max(160, plot_top - 70))]
            else:
                half_w = (page_width - 120) / 2
                h = max(160, plot_top - 70)
                boxes = [
                    (40, 70, half_w, h),
                    (80 + half_w, 70, half_w, h),
                ]

            for plot_uri, (x, y0, w, h) in zip(slide.plot_images, boxes):
                try:
                    svg = _decode_svg_data_uri(plot_uri)
                    png_bytes = cairosvg.svg2png(
                        bytestring=svg.encode("utf-8"),
                        output_width=int(max(300, w)),
                        output_height=int(max(200, h)),
                    )
                    c.drawImage(
                        ImageReader(io.BytesIO(png_bytes)),
                        x,
                        y0,
                        width=w,
                        height=h,
                        preserveAspectRatio=True,
                        anchor="c",
                    )
                except Exception:
                    c.setFillColorRGB(0.2, 0.23, 0.29)
                    c.rect(x, y0, w, h, stroke=0, fill=1)
                    c.setFillColorRGB(1.0, 0.69, 0.36)
                    c.setFont("Helvetica", 11)
                    c.drawString(
                        x + 12,
                        y0 + h / 2,
                        "Plot konnte nicht gerendert werden",
                    )

        # Placeholder plots for non-data slides
        elif slide.plot_placeholders:
            box_w = (page_width - 120) / 2
            box_h = max(150, y - 85)
            for idx, label in enumerate(slide.plot_placeholders[:2]):
                x = 40 + idx * (box_w + 40)
                y0 = 70
                c.setFillColorRGB(0.15, 0.18, 0.22)
                c.roundRect(x, y0, box_w, box_h, 8, stroke=0, fill=1)
                c.setStrokeColorRGB(1.0, 0.54, 0.11)
                c.setDash(4, 4)
                c.roundRect(
                    x + 1,
                    y0 + 1,
                    box_w - 2,
                    box_h - 2,
                    8,
                    stroke=1,
                    fill=0,
                )
                c.setDash()
                c.setFillColorRGB(1.0, 0.83, 0.61)
                c.setFont("Helvetica", 12)
                c.drawCentredString(x + box_w / 2, y0 + box_h / 2, label)

        # Footer
        c.setFillColorRGB(0.67, 0.7, 0.75)
        c.setFont("Helvetica", 10)
        c.drawRightString(page_width - 20, 16, f"{index}/{len(slides)}")
        c.showPage()

    c.save()


def main() -> int:
    args = parse_args()
    metadata_path = resolve_metadata_path(args)
    metadata = load_metadata(metadata_path)

    reference_date = parse_date(str(metadata["reference_date"]))
    boundary_date = parse_date(str(metadata["boundary_date"]))
    review_year = int(metadata["review_year"])
    include_organe_voting = args.force_voting_slide or (review_year % 2 == 0)

    members = deserialize_members(list(metadata["members"]))
    included_articles = list(metadata["included_articles"])
    finance_report_raw = metadata.get("finance_report", {})
    finance_report = finance_report_raw if isinstance(finance_report_raw, dict) else {}
    received = list(metadata["received"])
    given = list(metadata["given"])
    kinderlicht_events = list(metadata["kinderlicht_events"])
    external_events = list(metadata["external_events"])

    output_path = resolve_output_path(args.output, review_year)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    collage_images, article_image_map = prepare_slide_images(
        list(metadata["slide_images"]),
        output_path.parent,
    )
    article_details = build_article_details(included_articles, article_image_map)
    custom_slides = load_custom_slides(args.custom_slides)
    custom_image_map = prepare_custom_slide_images(
        custom_slides, args.custom_slides, output_path.parent
    )
    preview_events = load_preview_events(args.preview)

    board_members = load_board_members()
    sponsor_count = load_sponsors()

    member_insights = build_member_insights(members, reference_date)
    slides_markup = render_slides_markup(
        review_year=review_year,
        boundary_date=boundary_date,
        reference_date=reference_date,
        included_articles=included_articles,
        collage_images=collage_images,
        member_insights=member_insights,
        finance_report=finance_report,
        received=received,
        given=given,
        kinderlicht_events=kinderlicht_events,
        external_events=external_events,
        article_details=article_details,
        include_organe_voting=include_organe_voting,
        custom_slides=custom_slides,
        custom_image_map=custom_image_map,
        preview_events=preview_events,
        board_members=board_members,
        sponsor_count=sponsor_count,
    )
    html_output = render_slide_deck(
        review_year=review_year,
        slides_markup=slides_markup,
    )

    output_path.write_text(html_output, encoding="utf-8")
    print(f"Wrote {output_path}")

    minutes_output_path = args.minutes_output
    if minutes_output_path is None:
        minutes_output_path = output_path.with_name(f"{output_path.stem}-protokoll.txt")

    minutes_text = render_minutes_text(
        review_year=review_year,
        boundary_date=boundary_date,
        reference_date=reference_date,
        included_articles=included_articles,
        member_insights=member_insights,
        finance_report=finance_report,
        received=received,
        given=given,
        kinderlicht_events=kinderlicht_events,
        external_events=external_events,
        preview_events=preview_events,
        board_members=board_members,
        sponsor_count=sponsor_count,
        include_organe_voting=include_organe_voting,
    )
    minutes_output_path.write_text(minutes_text, encoding="utf-8")
    print(f"Wrote {minutes_output_path}")

    if args.pdf_output is not None:
        pdf_slides = build_pdf_slides(
            review_year=review_year,
            boundary_date=boundary_date,
            reference_date=reference_date,
            included_articles=included_articles,
            member_insights=member_insights,
            received=received,
            given=given,
            kinderlicht_events=kinderlicht_events,
            external_events=external_events,
            preview_events=preview_events,
            include_organe_voting=include_organe_voting,
        )
        export_slides_pdf(
            pdf_slides,
            args.pdf_output,
            auto_install_deps=args.install_pdf_deps,
        )
        print(f"Wrote {args.pdf_output}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
