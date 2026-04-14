"""Set article-date spans in tr/makaleler, en/articles, tr/index, en/index from topic map."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

from patch_article_dates import EN_ALIASES, TOPIC_DATES  # noqa: E402

# One card: article block contains .article-date then later the main <a href="...">
CARD_RE = re.compile(
    r'(<article[^>]*>[\s\S]*?<span class="article-date">)([^<]*)(</span>[\s\S]*?href=")([^"]+)(")',
)


def topic_from_href(href: str, lang: str) -> str | None:
    # /tr/hukuki-alanlar/{category}/{article-slug}/...
    if "/hukuki-alanlar/" in href:
        parts = [p for p in href.split("/") if p]
        try:
            i = parts.index("hukuki-alanlar")
            slug = parts[i + 2]  # article slug (after category)
            return slug.split("?")[0]
        except (ValueError, IndexError):
            return None
    # /en/legal-areas/{category}/{article-slug}/...
    if "/legal-areas/" in href:
        parts = [p for p in href.split("/") if p]
        try:
            i = parts.index("legal-areas")
            slug = parts[i + 2].split("?")[0]
            return EN_ALIASES.get(slug, slug)
        except (ValueError, IndexError):
            return None
    return None


def patch_file(path: Path, lang: str) -> None:
    text = path.read_text(encoding="utf-8")

    def repl(m: re.Match[str]) -> str:
        pre, _old, mid, href, post = m.groups()
        topic = topic_from_href(href, lang)
        if not topic or topic not in TOPIC_DATES:
            return m.group(0)
        tr_d, en_d = TOPIC_DATES[topic]
        new_date = en_d if lang == "en" else tr_d
        return pre + new_date + mid + href + post

    new_text, n = CARD_RE.subn(repl, text)
    if n:
        path.write_text(new_text, encoding="utf-8")
        print(path.relative_to(ROOT), n, "cards")
    else:
        print("no match", path.relative_to(ROOT))


def main() -> None:
    patch_file(ROOT / "tr/makaleler/index.html", "tr")
    patch_file(ROOT / "en/articles/index.html", "en")
    patch_file(ROOT / "tr/index.html", "tr")
    patch_file(ROOT / "en/index.html", "en")


if __name__ == "__main__":
    main()
