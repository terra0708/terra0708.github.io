# -*- coding: utf-8 -*-
"""Generate TR/EN legal topic pages from existing article templates (no article-detail.js)."""
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
DOMAIN = "https://www.ozturkavukatlikburosu.av.tr"

TR_SRC = BASE / "tr/hukuki-alanlar/miras-hukuku/miras-hukuku-ve-vasiyetname/index.html"
EN_SRC = BASE / "en/legal-areas/inheritance-law/inheritance-law-and-wills/index.html"

# (tr_cat, tr_slug, tr_title, en_cat, en_slug, en_title, cat_tr, cat_en, tr_date, en_date)
ROWS = [
    ("miras-hukuku", "mirasin-reddi", "Mirasın Reddi", "inheritance-law", "rejection-of-inheritance", "Rejection of Inheritance", "Miras Hukuku", "Inheritance Law", "2026", "2026"),
    ("is-ve-sosyal-guvenlik-hukuku", "ise-iade-davasi", "İşe İade Davası", "labor-and-social-security-law", "reinstatement-lawsuit", "Reinstatement Lawsuit", "İş ve Sosyal Güvenlik Hukuku", "Labor & Social Security Law", "2026", "2026"),
    ("is-ve-sosyal-guvenlik-hukuku", "is-kazasinin-tespiti-davasi", "İş Kazasının Tespiti Davası", "labor-and-social-security-law", "work-accident-determination-case", "Work Accident Determination Case", "İş ve Sosyal Güvenlik Hukuku", "Labor & Social Security Law", "2026", "2026"),
    ("kira-uyusmazliklari", "kira-tespit-davasi", "Kira Tespit Davası", "rental-disputes", "rent-determination-case", "Rent Determination Case", "Kira Uyuşmazlıkları", "Rental Disputes", "2026", "2026"),
    ("tasinmaz-hukuku", "ortakligin-giderilmesi-davasi", "Ortaklığın Giderilmesi Davası", "immovable-property-law", "partition-action-case", "Partition Action", "Taşınmaz Hukuku", "Immovable Property Law", "2026", "2026"),
    ("tasinmaz-hukuku", "muris-muvazaasi-nedeniyle-tapu-iptali-ve-tescil-davasi", "Muris Muvazaası Nedeniyle Tapu İptali ve Tescil Davası", "immovable-property-law", "fictitious-transaction-title-deed-cancellation", "Title Deed Cancellation (Fictitious Transaction)", "Taşınmaz Hukuku", "Immovable Property Law", "2026", "2026"),
    ("ceza-hukuku", "tehdit-sucu", "Tehdit Suçu", "criminal-law", "threat-offense", "Threat Offense", "Ceza Hukuku", "Criminal Law", "2026", "2026"),
    ("ceza-hukuku", "uyusturucu-madde-kullanimi-veya-bulundurma-sucu", "Uyuşturucu Madde Kullanma veya Bulundurma Suçu", "criminal-law", "drug-use-or-possession-offense", "Drug Use or Possession Offense", "Ceza Hukuku", "Criminal Law", "2026", "2026"),
    ("ceza-hukuku", "kasten-yaralama-sucu", "Kasten Yaralama Suçu", "criminal-law", "intentional-injury-offense", "Intentional Injury Offense", "Ceza Hukuku", "Criminal Law", "2026", "2026"),
    ("ceza-hukuku", "ceza-yargilamasinda-verilebilecek-karar-turleri", "Ceza Yargılamasında Verilebilecek Karar Türleri", "criminal-law", "types-of-judgments-in-criminal-trial", "Types of Judgments in Criminal Trial", "Ceza Hukuku", "Criminal Law", "2026", "2026"),
    ("ceza-hukuku", "ceza-yargilamasinin-genel-isleyisi-ve-uzlastirma", "Ceza Yargılamasının Genel İşleyişi ve Uzlaştırma", "criminal-law", "criminal-trial-overview-and-mediation", "Criminal Trial Overview and Mediation", "Ceza Hukuku", "Criminal Law", "2026", "2026"),
    ("ceza-hukuku", "ceza-yargilamasinin-temel-kavramlari", "Ceza Yargılamasının Temel Kavramları", "criminal-law", "fundamental-concepts-of-criminal-proceedings", "Fundamental Concepts of Criminal Proceedings", "Ceza Hukuku", "Criminal Law", "2026", "2026"),
    ("aile-hukuku", "cekismeli-bosanma-davasi", "Çekişmeli Boşanma Davası", "family-law", "contested-divorce-case", "Contested Divorce Case", "Aile Hukuku", "Family Law", "2026", "2026"),
    ("aile-hukuku", "anlasmali-bosanma-davasi", "Anlaşmalı Boşanma Davası", "family-law", "uncontested-divorce-case", "Uncontested Divorce Case", "Aile Hukuku", "Family Law", "2026", "2026"),
]


BC_TR_OLD = (
    '      <a href="/tr/">Ana Sayfa</a> &gt; <a href="/tr/hukuki-alanlar/">Hukuki Alanlar</a> &gt; '
    '<a href="/tr/hukuki-alanlar/miras-hukuku/">Miras Hukuku</a> &gt; <span>Miras Hukuku ve Vasiyetname</span>'
)
BC_EN_OLD = (
    '      <a href="/en/">Home</a> &gt; <a href="/en/legal-areas/">Legal Areas</a> &gt; '
    '<a href="/en/legal-areas/inheritance-law/">Inheritance Law</a> &gt; <span>Inheritance Law and Wills</span>'
)


def build_tr(tr_cat, tr_slug, title, cat_label, tr_date, en_cat, en_slug):
    t = TR_SRC.read_text(encoding="utf-8")
    t = t.replace("\n    <script src=\"/js/article-detail.js\"></script>", "")
    old = "miras-hukuku/miras-hukuku-ve-vasiyetname"
    new = f"{tr_cat}/{tr_slug}"
    t = t.replace(old, new)
    t = t.replace(
        f"{DOMAIN}/en/legal-areas/inheritance-law/inheritance-law-and-wills/",
        f"{DOMAIN}/en/legal-areas/{en_cat}/{en_slug}/",
    )
    bc_new = (
        f'      <a href="/tr/">Ana Sayfa</a> &gt; <a href="/tr/hukuki-alanlar/">Hukuki Alanlar</a> &gt; '
        f'<a href="/tr/hukuki-alanlar/{tr_cat}/">{cat_label}</a> &gt; <span>{title}</span>'
    )
    t = t.replace(BC_TR_OLD, bc_new)
    t = t.replace("Miras Hukuku ve Vasiyetname", title)
    t = t.replace("Makale Başlığı", title)
    t = t.replace("Hukuki Makale Detayı - Öztürk Avukatlık tarafından hazırlanan hukuki makale detay sayfası.", f"{title} — Öztürk Avukatlık hukuki bilgilendirme.")
    t = t.replace(
        '<span class="article-detail-date" id="article-date">15 Ocak 2024</span>',
        f'<span class="article-detail-date" id="article-date">{tr_date}</span>',
    )
    return t


def build_en(en_cat, en_slug, title, cat_label, en_date, tr_cat, tr_slug):
    t = EN_SRC.read_text(encoding="utf-8")
    t = t.replace("\n    <script src=\"/js/article-detail.js\"></script>", "")
    old = "inheritance-law/inheritance-law-and-wills"
    new = f"{en_cat}/{en_slug}"
    t = t.replace(old, new)
    t = t.replace(
        f"{DOMAIN}/tr/hukuki-alanlar/miras-hukuku/miras-hukuku-ve-vasiyetname/",
        f"{DOMAIN}/tr/hukuki-alanlar/{tr_cat}/{tr_slug}/",
    )
    bc_new = (
        f'      <a href="/en/">Home</a> &gt; <a href="/en/legal-areas/">Legal Areas</a> &gt; '
        f'<a href="/en/legal-areas/{en_cat}/">{cat_label}</a> &gt; <span>{title}</span>'
    )
    t = t.replace(BC_EN_OLD, bc_new)
    t = t.replace("Inheritance Law and Wills", title)
    t = t.replace("Article Title", title)
    t = t.replace("Article details and content.", f"{title} — Ozturk Law Firm.")
    t = t.replace(
        '<span class="article-detail-date" id="article-date">January 15, 2024</span>',
        f'<span class="article-detail-date" id="article-date">{en_date}</span>',
    )
    return t


def main():
    for row in ROWS:
        tr_cat, tr_slug, tr_title, en_cat, en_slug, en_title, cat_tr, cat_en, tr_date, en_date = row
        tr_dir = BASE / "tr/hukuki-alanlar" / tr_cat / tr_slug
        en_dir = BASE / "en/legal-areas" / en_cat / en_slug
        tr_dir.mkdir(parents=True, exist_ok=True)
        en_dir.mkdir(parents=True, exist_ok=True)
        (tr_dir / "index.html").write_text(
            build_tr(tr_cat, tr_slug, tr_title, cat_tr, tr_date, en_cat, en_slug), encoding="utf-8"
        )
        (en_dir / "index.html").write_text(
            build_en(en_cat, en_slug, en_title, cat_en, en_date, tr_cat, tr_slug), encoding="utf-8"
        )
    print("Wrote", len(ROWS), "TR+EN topic pairs.")


if __name__ == "__main__":
    main()
