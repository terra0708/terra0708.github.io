'use strict';

/**
 * build-articles.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Seçenek B — Build-Time Static Site Generator (TR + EN)
 *
 * Çalışma sırası (her dil için):
 *  1. data/articles-{lang}.json oku
 *  2. dateISO'ya göre azalan sırala (en yeni → en eski)
 *  3. featured:true olan en yeni 4'ü ana sayfaya bas
 *  4. Tüm listeyi 10'arlı sayfalara bölerek oluştur
 *     TR • Sayfa 1  → tr/makaleler/index.html
 *     TR • Sayfa 2+ → tr/makaleler/sayfa/N/index.html
 *     EN • Sayfa 1  → en/articles/index.html
 *     EN • Sayfa 2+ → en/articles/page/N/index.html
 *  5. Her sayfanın altına statik pagination nav ekle
 *  6. Sayfa 2+'da SEO etiketlerini benzersiz yap
 *
 * Kullanım: node scripts/build-articles.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

// ── Yapılandırma ─────────────────────────────────────────────────────────────
const ROOT     = path.resolve(__dirname, '..');
const PER_PAGE = 10;
const BASE_URL = 'https://www.ozturkavukatlikburosu.av.tr';

// Dil bazında yapılandırma
const LANGS = [
  {
    lang        : 'tr',
    dataFile    : path.join(ROOT, 'data', 'articles-tr.json'),
    homeFile    : path.join(ROOT, 'tr', 'index.html'),
    listFile    : path.join(ROOT, 'tr', 'makaleler', 'index.html'),
    pageDir     : (...n) => path.join(ROOT, 'tr', 'makaleler', 'sayfa', ...n),
    pageUrl     : (n) => n === 1 ? '/tr/makaleler/' : `/tr/makaleler/sayfa/${n}/`,
    absPageUrl  : (n) => n === 1
      ? `${BASE_URL}/tr/makaleler/`
      : `${BASE_URL}/tr/makaleler/sayfa/${n}/`,
    pageTitle   : (n) => `Makaleler - Sayfa ${n} | Öztürk Avukatlık`,
    pageDesc    : (n) => `Öztürk Avukatlık hukuki makale arşivi — Sayfa ${n}. Güncel hukuki bilgilendirmeler ve rehberler.`,
    prevLabel   : '← Önceki',
    nextLabel   : 'Sonraki →',
    paginationAria: 'Makale sayfaları',
    pageAria    : (n) => `Sayfa ${n}`,
  },
  {
    lang        : 'en',
    dataFile    : path.join(ROOT, 'data', 'articles-en.json'),
    homeFile    : path.join(ROOT, 'en', 'index.html'),
    listFile    : path.join(ROOT, 'en', 'articles', 'index.html'),
    pageDir     : (...n) => path.join(ROOT, 'en', 'articles', 'page', ...n),
    pageUrl     : (n) => n === 1 ? '/en/articles/' : `/en/articles/page/${n}/`,
    absPageUrl  : (n) => n === 1
      ? `${BASE_URL}/en/articles/`
      : `${BASE_URL}/en/articles/page/${n}/`,
    pageTitle   : (n) => `Articles - Page ${n} | Ozturk Law Firm`,
    pageDesc    : (n) => `Ozturk Law Firm legal article archive — Page ${n}. Current legal guides and information.`,
    prevLabel   : '← Previous',
    nextLabel   : 'Next →',
    paginationAria: 'Article pages',
    pageAria    : (n) => `Page ${n}`,
  },
];

// ── Yardımcı: güvenli dosya okuma ────────────────────────────────────────────
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dosya bulunamadı: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// ── Yardımcı: marker arasına enjekte et (marker'lar korunur) ─────────────────
function inject(html, startTag, endTag, content) {
  const si = html.indexOf(startTag);
  const ei = html.indexOf(endTag);
  if (si === -1) throw new Error(`Başlangıç marker bulunamadı: "${startTag}"`);
  if (ei === -1) throw new Error(`Bitiş marker bulunamadı: "${endTag}"`);
  if (si >= ei)  throw new Error(`Marker sırası yanlış: "${startTag}" gelmiyor "${endTag}"'den önce`);
  return (
    html.slice(0, si + startTag.length) +
    '\n' + content + '\n' +
    html.slice(ei)
  );
}

// ── Kart HTML üretici ────────────────────────────────────────────────────────
function renderCard(article, index) {
  const cls = index === 0
    ? 'card article-card-page fade-in'
    : 'card article-card';
  return [
    `                    <article class="${cls}">`,
    `                        <div class="article-image-container">`,
    `                            <img src="${article.image}" alt="${article.imageAlt}" loading="lazy">`,
    `                        </div>`,
    `                        <div class="article-content">`,
    `                            <span class="article-date">${article.date}</span>`,
    `                            <h3 class="card-title">${article.title}</h3>`,
    `                            <p>${article.summary}</p>`,
    `                            <a href="${article.url}?source=blog" class="btn btn-outline-gold mt-sm">Read More ›</a>`,
    `                        </div>`,
    `                    </article>`,
  ].join('\n');
}

// ── TR kart üretici (Türkçe CTA) ─────────────────────────────────────────────
function renderCardTR(article, index) {
  const cls = index === 0
    ? 'card article-card-page fade-in'
    : 'card article-card';
  return [
    `                    <article class="${cls}">`,
    `                        <div class="article-image-container">`,
    `                            <img src="${article.image}" alt="${article.imageAlt}" loading="lazy">`,
    `                        </div>`,
    `                        <div class="article-content">`,
    `                            <span class="article-date">${article.date}</span>`,
    `                            <h3 class="card-title">${article.title}</h3>`,
    `                            <p>${article.summary}</p>`,
    `                            <a href="${article.url}?source=blog" class="btn btn-outline-gold mt-sm">Devamını Oku ›</a>`,
    `                        </div>`,
    `                    </article>`,
  ].join('\n');
}

// ── Grid sarmalı ile kart listesi üret ───────────────────────────────────────
function renderGrid(articles, gridClass, lang) {
  const renderer = lang === 'tr' ? renderCardTR : renderCard;
  const cardsHtml = articles.map((a, i) => renderer(a, i)).join('\n');
  return [
    `                <div class="grid ${gridClass}">`,
    cardsHtml,
    `                </div>`,
  ].join('\n');
}

// ── Pagination nav HTML üret ─────────────────────────────────────────────────
function renderPagination(current, total, cfg) {
  if (total <= 1) return '';

  const prevHref = current === 1 ? null : cfg.pageUrl(current - 1);
  const nextHref = current === total ? null : cfg.pageUrl(current + 1);

  let pageLinks = '';
  for (let i = 1; i <= total; i++) {
    const isCur = i === current;
    const cls   = isCur ? 'pagination-page pagination-active' : 'pagination-page';
    const aria  = isCur ? ' aria-current="page"' : '';
    pageLinks  += `\n                        <a href="${cfg.pageUrl(i)}" class="${cls}"${aria} aria-label="${cfg.pageAria(i)}">${i}</a>`;
  }

  const prevBtn = prevHref
    ? `<a href="${prevHref}" class="pagination-btn pagination-prev" aria-label="${cfg.prevLabel}">${cfg.prevLabel}</a>`
    : `<span class="pagination-btn pagination-prev pagination-disabled" aria-disabled="true">${cfg.prevLabel}</span>`;

  const nextBtn = nextHref
    ? `<a href="${nextHref}" class="pagination-btn pagination-next" aria-label="${cfg.nextLabel}">${cfg.nextLabel}</a>`
    : `<span class="pagination-btn pagination-next pagination-disabled" aria-disabled="true">${cfg.nextLabel}</span>`;

  return [
    '',
    `        <nav class="pagination-nav" aria-label="${cfg.paginationAria}">`,
    `            <div class="container">`,
    `                <div class="pagination">`,
    `                    ${prevBtn}`,
    `                    <div class="pagination-pages">${pageLinks}`,
    `                    </div>`,
    `                    ${nextBtn}`,
    `                </div>`,
    `            </div>`,
    `        </nav>`,
  ].join('\n');
}

// ── SEO meta'larını sayfa 2+ için güncelle ───────────────────────────────────
function applyPageSeo(html, page, cfg) {
  const pageUrl   = cfg.absPageUrl(page);
  const pageTitle = cfg.pageTitle(page);
  const pageDesc  = cfg.pageDesc(page);

  // <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${pageTitle}</title>`
  );

  // <meta name="description" ...> (tek veya çok satırlı)
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?>/,
    `<meta name="description" content="${pageDesc}">`
  );

  // hreflang dil etiketini güncelle (tr → canonical lang, en → canonical lang)
  // Hangi hreflang güncellenecek: cfg.lang'e göre
  const hreflangAttr = cfg.lang === 'tr' ? 'tr' : 'en';
  html = html.replace(
    new RegExp(`(<link\\s[^>]*hreflang="${hreflangAttr}"[^>]*href=")[^"]+"`),
    `$1${pageUrl}"`
  );

  // hreflang x-default
  html = html.replace(
    /(<link\s[^>]*hreflang="x-default"[^>]*href=")[^"]+"/,
    `$1${pageUrl}"`
  );

  // Canonical
  const canonical = `    <link rel="canonical" href="${pageUrl}" />`;
  html = inject(html, '<!-- SEO_BUILD_START -->', '<!-- SEO_BUILD_END -->', canonical);

  return html;
}

// ════════════════════════════════════════════════════════════════════════════
// ANA ÇALIŞMA AKIŞI
// ════════════════════════════════════════════════════════════════════════════

for (const cfg of LANGS) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${cfg.lang.toUpperCase()} — Build başlıyor`);
  console.log(`${'═'.repeat(60)}`);

  // 1. JSON oku ve sırala
  const articles = JSON.parse(readFile(cfg.dataFile));
  articles.sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
  console.log(`📚 ${articles.length} makale yüklendi — dateISO azalan sıralandı`);

  articles.forEach((a, i) => {
    const mark = a.featured ? ' ⭐' : '';
    console.log(`   ${String(i + 1).padStart(2, '0')}. [${a.dateISO}] ${a.title.substring(0, 52)}...${mark}`);
  });

  // 2. Ana sayfa: featured en yeni 4
  const top4 = articles.filter(a => a.featured).slice(0, 4);
  console.log(`\n⭐ Featured kart (${top4.length}):`);
  top4.forEach(a => console.log(`   • [${a.dateISO}] ${a.title}`));

  let homeHtml = readFile(cfg.homeFile);
  homeHtml = inject(
    homeHtml,
    '<!-- ARTICLES_PREVIEW_START -->',
    '<!-- ARTICLES_PREVIEW_END -->',
    renderGrid(top4, 'grid-4', cfg.lang)
  );
  fs.writeFileSync(cfg.homeFile, homeHtml, 'utf8');
  console.log(`✓  ${cfg.lang}/ ana sayfa güncellendi`);

  // 3. Sayfalandır
  const totalPages  = Math.ceil(articles.length / PER_PAGE);
  const baseTemplate = readFile(cfg.listFile);   // şablonu bir kez oku
  console.log(`\n📄 ${articles.length} makale → ${totalPages} sayfa (${PER_PAGE}/sayfa)`);

  for (let page = 1; page <= totalPages; page++) {
    const start = (page - 1) * PER_PAGE;
    const chunk = articles.slice(start, start + PER_PAGE);
    let   html  = baseTemplate;

    html = inject(html, '<!-- ARTICLES_GRID_START -->', '<!-- ARTICLES_GRID_END -->', renderGrid(chunk, 'grid-3', cfg.lang));
    html = inject(html, '<!-- PAGINATION_START -->',    '<!-- PAGINATION_END -->',    renderPagination(page, totalPages, cfg));

    if (page === 1) {
      // Sayfa 1 — canonical boş
      html = inject(html, '<!-- SEO_BUILD_START -->', '<!-- SEO_BUILD_END -->', '');
      fs.writeFileSync(cfg.listFile, html, 'utf8');
      console.log(`✓  ${cfg.lang} sayfa 1/${totalPages} → liste dosyası güncellendi (${chunk.length} kart)`);
    } else {
      // Sayfa 2+ — SEO güncelle ve fiziksel klasör oluştur
      html = applyPageSeo(html, page, cfg);
      const dir = cfg.pageDir(String(page));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
      console.log(`✓  ${cfg.lang} sayfa ${page}/${totalPages} → ${dir.split('ozturk-avukatlik')[1]} (${chunk.length} kart)`);
    }
  }
}

console.log('\n\n🟢 Tüm diller için build tamamlandı!\n');
