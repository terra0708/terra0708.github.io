# -*- coding: utf-8 -*-
"""Generate category hub index.html from miras-hukuku template."""
from pathlib import Path
import re

BASE = Path(__file__).resolve().parents[1]
DOMAIN = "https://www.ozturkavukatlikburosu.av.tr"
TR_TMPL = (BASE / "tr/hukuki-alanlar/miras-hukuku/index.html").read_text(encoding="utf-8")
EN_TMPL = (BASE / "en/legal-areas/inheritance-law/index.html").read_text(encoding="utf-8")

TR_CAT = [
    {
        "slug": "is-ve-sosyal-guvenlik-hukuku",
        "title": "İş ve Sosyal Güvenlik Hukuku",
        "desc": "İş ve sosyal güvenlik hukuku alanındaki bilgilendirmeler - Öztürk Avukatlık.",
        "kw": "iş hukuku, işe iade, iş kazası, avukat",
        "items": [
            ("2026", "İşe İade Davası", "İşe iade davası ve süreçleri hakkında bilgilendirme.", "ise-iade-davasi"),
            ("2026", "İş Kazasının Tespiti Davası", "İş kazasının tespiti davası hakkında bilgilendirme.", "is-kazasinin-tespiti-davasi"),
        ],
    },
    {
        "slug": "kira-uyusmazliklari",
        "title": "Kira Uyuşmazlıkları",
        "desc": "Kira uyuşmazlıkları ve kira hukuku bilgilendirmeleri - Öztürk Avukatlık.",
        "kw": "kira, kira tespit davası, avukat",
        "items": [
            ("2026", "Kira Tespit Davası", "Kira bedelinin tespiti ve ilgili süreçler.", "kira-tespit-davasi"),
        ],
    },
    {
        "slug": "tasinmaz-hukuku",
        "title": "Taşınmaz (Gayrimenkul) Hukuku",
        "desc": "Taşınmaz hukuku alanındaki bilgilendirmeler - Öztürk Avukatlık.",
        "kw": "tapu, ortaklığın giderilmesi, muvazaa, avukat",
        "items": [
            ("2026", "Ortaklığın Giderilmesi Davası", "Paylı mülkiyette ortaklığın giderilmesi davası.", "ortakligin-giderilmesi-davasi"),
            ("2026", "Muris Muvazaası Nedeniyle Tapu İptali ve Tescil Davası", "Muris muvazaası ve tapu iptali süreçleri.", "muris-muvazaasi-nedeniyle-tapu-iptali-ve-tescil-davasi"),
        ],
    },
    {
        "slug": "ceza-hukuku",
        "title": "Ceza Hukuku",
        "desc": "Ceza hukuku ve ceza muhakemesi bilgilendirmeleri - Öztürk Avukatlık.",
        "kw": "ceza hukuku, suç, avukat",
        "items": [
            ("2026", "Tehdit Suçu", "Tehdit suçunun unsurları ve süreçleri.", "tehdit-sucu"),
            ("2026", "Uyuşturucu Madde Kullanma veya Bulundurma Suçu", "Uyuşturucu ile ilgili suçlar hakkında bilgilendirme.", "uyusturucu-madde-kullanimi-veya-bulundurma-sucu"),
            ("2026", "Kasten Yaralama Suçu", "Kasten yaralama suçu hakkında bilgilendirme.", "kasten-yaralama-sucu"),
            ("2026", "Ceza Yargılamasında Verilebilecek Karar Türleri", "Hüküm türleri ve sonuçları.", "ceza-yargilamasinda-verilebilecek-karar-turleri"),
            ("2026", "Ceza Yargılamasının Genel İşleyişi ve Uzlaştırma", "Ceza muhakemesi ve uzlaştırma.", "ceza-yargilamasinin-genel-isleyisi-ve-uzlastirma"),
            ("2026", "Ceza Yargılamasının Temel Kavramları", "Soruşturma, kovuşturma ve temel kavramlar.", "ceza-yargilamasinin-temel-kavramlari"),
        ],
    },
]

EN_CAT = [
    {
        "slug": "labor-and-social-security-law",
        "title": "Labor & Social Security Law",
        "desc": "Guides in labor and social security law — Ozturk Law Firm.",
        "kw": "labor law, reinstatement, work accident, lawyer",
        "items": [
            ("2026", "Reinstatement Lawsuit", "Information on reinstatement proceedings.", "reinstatement-lawsuit"),
            ("2026", "Work Accident Determination Case", "Information on work accident determination cases.", "work-accident-determination-case"),
        ],
    },
    {
        "slug": "rental-disputes",
        "title": "Rental Disputes",
        "desc": "Rental law guides — Ozturk Law Firm.",
        "kw": "rent, lease, lawyer",
        "items": [
            ("2026", "Rent Determination Case", "Rent determination and related proceedings.", "rent-determination-case"),
        ],
    },
    {
        "slug": "immovable-property-law",
        "title": "Immovable (Real Estate) Law",
        "desc": "Real estate and title deed matters — Ozturk Law Firm.",
        "kw": "title deed, partition, lawyer",
        "items": [
            ("2026", "Partition Action", "Co-ownership partition actions.", "partition-action-case"),
            ("2026", "Title Deed Cancellation (Fictitious Transaction)", "Fictitious transactions and title cancellation.", "fictitious-transaction-title-deed-cancellation"),
        ],
    },
    {
        "slug": "criminal-law",
        "title": "Criminal Law",
        "desc": "Criminal law and procedure guides — Ozturk Law Firm.",
        "kw": "criminal law, offense, lawyer",
        "items": [
            ("2026", "Threat Offense", "Elements of the threat offense.", "threat-offense"),
            ("2026", "Drug Use or Possession Offense", "Drug-related offenses.", "drug-use-or-possession-offense"),
            ("2026", "Intentional Injury Offense", "Intentional injury offenses.", "intentional-injury-offense"),
            ("2026", "Types of Judgments in Criminal Trial", "Types of judgments and outcomes.", "types-of-judgments-in-criminal-trial"),
            ("2026", "Criminal Trial Overview and Mediation", "Criminal proceedings and mediation.", "criminal-trial-overview-and-mediation"),
            ("2026", "Fundamental Concepts of Criminal Proceedings", "Investigation, prosecution, and key concepts.", "fundamental-concepts-of-criminal-proceedings"),
        ],
    },
]


def tr_cards(items, cat_slug):
    parts = []
    for date, h3, p, slug in items:
        parts.append(f"""                    <article class="card article-card">
                        <div class="article-image-placeholder"></div>
                        <div class="article-content">
                            <span class="article-date">{date}</span>
                            <h3 class="card-title">{h3}</h3>
                            <p>{p}</p>
                            <a href="/tr/hukuki-alanlar/{cat_slug}/{slug}/" class="btn btn-outline-gold mt-sm">Devamını Oku ›</a>
                        </div>
                    </article>
""")
    return "\n".join(parts)


def en_cards(items, cat_slug):
    parts = []
    for date, h3, p, slug in items:
        parts.append(f"""                    <article class="card article-card">
                        <div class="article-image-placeholder"></div>
                        <div class="article-content">
                            <span class="article-date">{date}</span>
                            <h3 class="card-title">{h3}</h3>
                            <p>{p}</p>
                            <a href="/en/legal-areas/{cat_slug}/{slug}/" class="btn btn-outline-gold mt-sm">Read More ›</a>
                        </div>
                    </article>
""")
    return "\n".join(parts)


def build_tr(cat):
    en_slug = EN_CAT[TR_CAT.index(cat)]["slug"]
    t = TR_TMPL
    t = t.replace("Miras hukuku alanındaki makaleler ve bilgilendirmeler - Öztürk Avukatlık.", cat["desc"])
    t = t.replace('content="miras hukuku, vasiyetname, tereke, avukat"', f'content="{cat["kw"]}"')
    t = t.replace("/tr/hukuki-alanlar/miras-hukuku/", f"/tr/hukuki-alanlar/{cat['slug']}/")
    t = t.replace("en/legal-areas/inheritance-law/", f"en/legal-areas/{en_slug}/")
    t = t.replace("Miras Hukuku - Öztürk Avukatlık", f"{cat['title']} - Öztürk Avukatlık")
    t = t.replace("Miras hukuku alanındaki güncel yazılar ve bilgilendirmeler.", cat["desc"].split(" - ")[0] + ".")
    t = t.replace("Miras Hukuku | Öztürk Avukatlık", f"{cat['title']} | Öztürk Avukatlık")
    t = t.replace("<span>Miras Hukuku</span>", f"<span>{cat['title']}</span>")
    t = t.replace("<h1 class=\"page-title\">Miras Hukuku</h1>", f"<h1 class=\"page-title\">{cat['title']}</h1>")
    grid_old = re.search(
        r"<div class=\"grid grid-3\">.*?</div>\s*</div>\s*</section>",
        t,
        re.DOTALL,
    ).group(0)
    grid_new = (
        '<div class="grid grid-3">\n'
        + tr_cards(cat["items"], cat["slug"])
        + "                </div>\n            </div>\n        </section>"
    )
    t = t.replace(grid_old, grid_new)
    return t


def build_en(cat, tr_slug):
    t = EN_TMPL
    t = t.replace(
        'content="Inheritance law practice area — guides and updates — Ozturk Law Firm."',
        f'content="{cat["desc"]}"',
    )
    t = t.replace('content="inheritance law, wills, estate, legal articles"', f'content="{cat["kw"]}"')
    t = t.replace("/en/legal-areas/inheritance-law/", f"/en/legal-areas/{cat['slug']}/")
    t = t.replace("/tr/hukuki-alanlar/miras-hukuku/", f"/tr/hukuki-alanlar/{tr_slug}/")
    t = t.replace("Inheritance Law - Ozturk Law Firm", f"{cat['title']} - Ozturk Law Firm")
    t = t.replace("Guides and updates in inheritance law.", cat["desc"].rstrip("."))
    t = t.replace("Inheritance Law | Ozturk Law Firm", f"{cat['title']} | Ozturk Law Firm")
    t = t.replace("<span>Inheritance Law</span>", f"<span>{cat['title']}</span>")
    t = t.replace("<h1 class=\"page-title\">Inheritance Law</h1>", f"<h1 class=\"page-title\">{cat['title']}</h1>")
    grid_old = re.search(
        r"<div class=\"grid grid-3\">.*?</div>\s*</div>\s*</section>",
        t,
        re.DOTALL,
    ).group(0)
    grid_new = (
        '<div class="grid grid-3">\n'
        + en_cards(cat["items"], cat["slug"])
        + "                </div>\n            </div>\n        </section>"
    )
    t = t.replace(grid_old, grid_new)
    return t


def main():
    for i, cat in enumerate(TR_CAT):
        out = BASE / "tr/hukuki-alanlar" / cat["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build_tr(cat), encoding="utf-8")
    for i, cat in enumerate(EN_CAT):
        tr_slug = TR_CAT[i]["slug"]
        out = BASE / "en/legal-areas" / cat["slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(build_en(cat, tr_slug), encoding="utf-8")
    print("Wrote", len(TR_CAT), "TR +", len(EN_CAT), "EN category hubs.")


if __name__ == "__main__":
    main()
