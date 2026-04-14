"""One-off: set unique article dates Mar 15 – Apr 4, 2026 across article pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TOPIC_DATES: dict[str, tuple[str, str]] = {
    "anlasmali-bosanma-davasi": ("15 Mart 2026", "March 15, 2026"),
    "cekismeli-bosanma-davasi": ("16 Mart 2026", "March 16, 2026"),
    "ceza-yargilamasi-sureci": ("17 Mart 2026", "March 17, 2026"),
    "ceza-yargilamasinda-uzlastirma": ("18 Mart 2026", "March 18, 2026"),
    "ceza-yargilamasinda-verilebilecek-karar-turleri": ("19 Mart 2026", "March 19, 2026"),
    "ceza-yargilamasinin-genel-isleyisi-ve-uzlastirma": ("20 Mart 2026", "March 20, 2026"),
    "ceza-yargilamasinin-temel-kavramlari": ("21 Mart 2026", "March 21, 2026"),
    "kasten-yaralama-sucu": ("22 Mart 2026", "March 22, 2026"),
    "tehdit-sucu": ("23 Mart 2026", "March 23, 2026"),
    "uyusturucu-madde-kullanimi-veya-bulundurma-sucu": ("24 Mart 2026", "March 24, 2026"),
    "ise-iade-davasi": ("25 Mart 2026", "March 25, 2026"),
    "is-kazasinin-tespiti-davasi": ("26 Mart 2026", "March 26, 2026"),
    "kira-tespit-davasi": ("27 Mart 2026", "March 27, 2026"),
    "kira-uyarlama-davasi": ("28 Mart 2026", "March 28, 2026"),
    "mirasin-reddi": ("29 Mart 2026", "March 29, 2026"),
    "tereke-tespiti-davasi": ("30 Mart 2026", "March 30, 2026"),
    "vasiyetnamenin-acilmasi-davasi": ("31 Mart 2026", "March 31, 2026"),
    "vasiyetnamenin-iptali-davasi": ("1 Nisan 2026", "April 1, 2026"),
    "vasiyetnamenin-tenfizi-davasi": ("2 Nisan 2026", "April 2, 2026"),
    "muris-muvazaasi-nedeniyle-tapu-iptali-ve-tescil-davasi": ("3 Nisan 2026", "April 3, 2026"),
    "ortakligin-giderilmesi-davasi": ("4 Nisan 2026", "April 4, 2026"),
}

EN_ALIASES: dict[str, str] = {
    "crime-of-threat": "tehdit-sucu",
    "threat-offense": "tehdit-sucu",
    "partition-action-case": "ortakligin-giderilmesi-davasi",
    "dissolution-of-partnership-lawsuit": "ortakligin-giderilmesi-davasi",
    "fictitious-transaction-title-deed-cancellation": "muris-muvazaasi-nedeniyle-tapu-iptali-ve-tescil-davasi",
    "cancellation-of-deed-and-registration-case": "muris-muvazaasi-nedeniyle-tapu-iptali-ve-tescil-davasi",
    "uncontested-divorce-case": "anlasmali-bosanma-davasi",
    "contested-divorce-case": "cekismeli-bosanma-davasi",
    "criminal-procedure-step-by-step": "ceza-yargilamasi-sureci",
    "mediation-in-criminal-proceedings": "ceza-yargilamasinda-uzlastirma",
    "types-of-judgments-in-criminal-trial": "ceza-yargilamasinda-verilebilecek-karar-turleri",
    "criminal-trial-overview-and-mediation": "ceza-yargilamasinin-genel-isleyisi-ve-uzlastirma",
    "fundamental-concepts-of-criminal-proceedings": "ceza-yargilamasinin-temel-kavramlari",
    "intentional-injury-offense": "kasten-yaralama-sucu",
    "drug-use-or-possession-offense": "uyusturucu-madde-kullanimi-veya-bulundurma-sucu",
    "reinstatement-lawsuit": "ise-iade-davasi",
    "work-accident-determination-case": "is-kazasinin-tespiti-davasi",
    "rent-determination-case": "kira-tespit-davasi",
    "rent-adaptation-case": "kira-uyarlama-davasi",
    "rejection-of-inheritance": "mirasin-reddi",
    "estate-detection-case": "tereke-tespiti-davasi",
    "opening-of-will-case": "vasiyetnamenin-acilmasi-davasi",
    "annulment-of-will-case": "vasiyetnamenin-iptali-davasi",
    "enforcement-of-will-case": "vasiyetnamenin-tenfizi-davasi",
}

SPAN_RE = re.compile(
    r'(<span class="article-detail-date" id="article-date">)[^<]*(</span>)'
)


def topic_from_path(rel: Path) -> str | None:
    parts = rel.parts
    if "hukuki-alanlar" in parts:
        i = parts.index("hukuki-alanlar")
        if len(parts) > i + 2:
            return parts[-2]
    if "legal-areas" in parts:
        i = parts.index("legal-areas")
        if len(parts) > i + 2:
            slug = parts[-2]
            if slug in EN_ALIASES:
                return EN_ALIASES[slug]
            return slug if slug in TOPIC_DATES else None
    return None


def main() -> None:
    for html in ROOT.rglob("index.html"):
        if "node_modules" in html.parts:
            continue
        rel = html.relative_to(ROOT)
        s = rel.as_posix()
        if "hukuki-alanlar" not in s and "legal-areas" not in s:
            continue
        topic = topic_from_path(rel)
        if not topic or topic not in TOPIC_DATES:
            continue
        tr_d, en_d = TOPIC_DATES[topic]
        is_en = s.startswith("en/")
        new_date = en_d if is_en else tr_d
        text = html.read_text(encoding="utf-8")
        new_text, n = SPAN_RE.subn(lambda m: m.group(1) + new_date + m.group(2), text, count=1)
        if n:
            html.write_text(new_text, encoding="utf-8")
            print("updated", s)
        else:
            print("no span", s)


if __name__ == "__main__":
    main()
