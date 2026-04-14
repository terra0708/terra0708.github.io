# URL Mapping (Legacy -> New)

## Core Turkish pages

- `/index.html` -> `/tr/`
- `/hakkimizda.html` -> `/tr/hakkimizda/`
- `/hukuki-alanlar.html` -> `/tr/hukuki-alanlar/`
- `/sss.html` -> `/tr/sss/`
- `/makaleler.html` -> `/tr/makaleler/` (kronolojik makale listesi; makale içeriği burada değil)
- `/iletisim.html` -> `/tr/iletisim/`

## Core English pages

- `/en/index.html` -> `/en/`
- `/en/about.html` -> `/en/about/`
- `/en/legal-areas.html` -> `/en/legal-areas/`
- `/en/faq.html` -> `/en/faq/`
- `/en/articles.html` -> `/en/articles/` (chronological article index; article bodies live under `/en/legal-areas/`)
- `/en/contact.html` -> `/en/contact/`

## 301: Eski makale yolları -> hukuki silolar

Apache `.htaccess` ile kalıcı yönlendirme:

- `/tr/makaleler/{kategori}/{makale}/` -> `/tr/hukuki-alanlar/{kategori}/{makale}/`
- `/en/articles/{category}/{article}/` -> `/en/legal-areas/{category}/{article}/`

## Article silo mapping (TR) — `makale-detay.html` query hedefleri

Canonical makale dosyaları: `/tr/hukuki-alanlar/{kategori}/{slug}/`

- `/makale-detay.html?id=1` -> `/tr/hukuki-alanlar/is-hukuku/is-hukukunda-yeni-duzenlemeler/`
- `/makale-detay.html?id=2` -> `/tr/hukuki-alanlar/aile-hukuku/aile-hukukunda-velayet-davalari/`
- `/makale-detay.html?id=3` -> `/tr/hukuki-alanlar/gayrimenkul-hukuku/gayrimenkul-alim-satim-surecleri/`
- `/makale-detay.html?id=4` -> `/tr/hukuki-alanlar/calisma-hukuku/calisma-hukukunda-sendika-haklari/`
- `/makale-detay.html?id=5` -> `/tr/hukuki-alanlar/miras-hukuku/miras-hukuku-ve-vasiyetname/`
- `/makale-detay.html?id=6` -> `/tr/hukuki-alanlar/aile-hukuku/bosanma-surecleri-ve-haklar/`

**Not:** `js/article-detail.js` içinde `slugAliases` ile `/tr/hukuki-alanlar/miras-hukuku/tereke-tespiti-davasi/` yolu `id=5` ile eşlenir (başlık/tarih için varsayılan meta aynı id kaynağından); canonical URL yine tereke sayfasının kendi yoludur.

## Article silo mapping (EN) — `en/article-detail.html` query hedefleri

Canonical makale dosyaları: `/en/legal-areas/{category}/{slug}/`

- `/en/article-detail.html?id=1` -> `/en/legal-areas/labor-law/new-regulations-in-labor-law/`
- `/en/article-detail.html?id=2` -> `/en/legal-areas/family-law/custody-cases-in-family-law/`
- `/en/article-detail.html?id=3` -> `/en/legal-areas/real-estate-law/real-estate-purchase-sale-processes/`
- `/en/article-detail.html?id=4` -> `/en/legal-areas/employment-law/union-rights-in-employment-law/`
- `/en/article-detail.html?id=5` -> `/en/legal-areas/inheritance-law/inheritance-law-and-wills/`
- `/en/article-detail.html?id=6` -> `/en/legal-areas/family-law/divorce-processes-and-rights/`

**Not:** `slugAliases` ile `/en/legal-areas/inheritance-law/estate-detection-case/` yolu `id=5` ile eşlenir; canonical URL estate-detection sayfasının kendi yoludur.
