'use strict';

/**
 * build-articles.js — Çift Dilli SSG Motor (TR + EN)
 * ─────────────────────────────────────────────────────────────────────────────
 * ÇALIŞMA SIRASI:
 *  0.  TR ve EN JSON'larını yükle, azalan dateISO'ya göre sırala
 *  1.  assertSynchronized → makale sayısı ve dateISO sırası birebir eşleşmeli;
 *      herhangi bir uyuşmazlıkta script DURUR, hiçbir dosya yazılmaz
 *  2.  Her dil için dateISO'yu yerel tarih formatına çevir (toLocaleDateString
 *      bağımsız, ICU güvenli yöntem)
 *  3.  featured:true olan en yeni 4 makaleyi ana sayfaya bas
 *  4.  Tüm listeyi 10'arlı sayfalara böl:
 *        Sayfa 1  → mevcut index.html'i güncelle (marker arası yeniden yaz)
 *        Sayfa 2+ → fiziksel klasör oluştur ve tam HTML dosyası üret
 *  5.  sitemap.xml içindeki eski pagination (/sayfa/N, /page/N) bloklarını
 *      regex ile sil (delete-and-rewrite), ardından hesaplanan sayfa sayısına
 *      göre TR+EN hreflang çiftlerini </urlset>'den önce ekle
 *
 * KULLANIM:   node scripts/build-articles.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

// ── Yapılandırma ──────────────────────────────────────────────────────────────
const ROOT         = path.resolve(__dirname, '..');
const PER_PAGE     = 10;
const BASE_URL     = 'https://www.ozturkavukatlikburosu.av.tr';
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');

// Dil başına yapılandırma nesneleri
const CFG = {
  tr: {
    dataFile      : path.join(ROOT, 'data', 'articles-tr.json'),
    homeFile      : path.join(ROOT, 'tr', 'index.html'),
    listFile      : path.join(ROOT, 'tr', 'makaleler', 'index.html'),
    pageDir       : (n) => path.join(ROOT, 'tr', 'makaleler', 'sayfa', String(n)),
    pageUrl       : (n) => (n === 1) ? '/tr/makaleler/' : `/tr/makaleler/sayfa/${n}/`,
    absPageUrl    : (n) => (n === 1) ? `${BASE_URL}/tr/makaleler/` : `${BASE_URL}/tr/makaleler/sayfa/${n}/`,
    hreflangKey   : 'tr',
    pageTitle     : (n) => `Makaleler - Sayfa ${n} | Öztürk Avukatlık`,
    pageDesc      : (n) => `Öztürk Avukatlık hukuki makale arşivi — Sayfa ${n}. Güncel hukuki bilgilendirmeler ve rehberler.`,
    prevLabel     : '← Önceki',
    nextLabel     : 'Sonraki →',
    navAria       : 'Makale sayfaları',
    pageAria      : (n) => `Sayfa ${n}`,
    readMore      : 'Devamını Oku ›',
  },
  en: {
    dataFile      : path.join(ROOT, 'data', 'articles-en.json'),
    homeFile      : path.join(ROOT, 'en', 'index.html'),
    listFile      : path.join(ROOT, 'en', 'articles', 'index.html'),
    pageDir       : (n) => path.join(ROOT, 'en', 'articles', 'page', String(n)),
    pageUrl       : (n) => (n === 1) ? '/en/articles/' : `/en/articles/page/${n}/`,
    absPageUrl    : (n) => (n === 1) ? `${BASE_URL}/en/articles/` : `${BASE_URL}/en/articles/page/${n}/`,
    hreflangKey   : 'en',
    pageTitle     : (n) => `Articles - Page ${n} | Ozturk Law Firm`,
    pageDesc      : (n) => `Ozturk Law Firm legal article archive — Page ${n}. Current legal guides and information.`,
    prevLabel     : '← Previous',
    nextLabel     : 'Next →',
    navAria       : 'Article pages',
    pageAria      : (n) => `Page ${n}`,
    readMore      : 'Read More ›',
  },
};

// ── Tarih Formatlayıcı (ICU bağımsız, locale güvenli) ────────────────────────
// toLocaleDateString() Node.js sürümüne göre farklı sonuç verebilir;
// sabit ay isim dizileri ile bu bağımlılığı ortadan kaldırıyoruz.
const MONTHS = {
  tr: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
       'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
  en: ['January','February','March','April','May','June',
       'July','August','September','October','November','December'],
};

/**
 * dateISO (YYYY-MM-DD) → yerel tarih metni
 * TR örnek: "16 Nisan 2026"   EN örnek: "April 16, 2026"
 */
function formatDate(dateISO, lang) {
  const [y, m, d] = dateISO.split('-').map(Number);
  const month = MONTHS[lang][m - 1];
  return (lang === 'tr') ? `${d} ${month} ${y}` : `${month} ${d}, ${y}`;
}

// ── Yardımcı: Dosya okuma ─────────────────────────────────────────────────────
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dosya bulunamadı: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// ── Yardımcı: Marker arası enjeksiyon (marker'lar dosyada kalır) ──────────────
function inject(html, startTag, endTag, content) {
  const si = html.indexOf(startTag);
  const ei = html.indexOf(endTag);
  if (si === -1) throw new Error(`Başlangıç marker bulunamadı: "${startTag}"`);
  if (ei === -1) throw new Error(`Bitiş marker bulunamadı: "${endTag}"`);
  if (si >= ei)  throw new Error(`Marker sırası hatalı: "${startTag}" → "${endTag}"`);
  return (
    html.slice(0, si + startTag.length) +
    '\n' + content + '\n' +
    html.slice(ei)
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// assertSynchronized — BUILD KALKANI
// ════════════════════════════════════════════════════════════════════════════════
/**
 * TR ve EN JSON'larının tam senkron olduğunu doğrular.
 * Kural 1: Her iki listede makale sayısı eşit olmalıdır.
 * Kural 2: N. sıradaki TR makalesinin dateISO'su, N. sıradaki EN makalesinin
 *          dateISO'su ile birebir eşleşmelidir.
 *
 * Herhangi bir kural ihlalinde script hata fırlatır → hiçbir dosya yazılmaz.
 */
function assertSynchronized(trArticles, enArticles) {
  if (trArticles.length !== enArticles.length) {
    throw new Error(
      `\n❌ SENKRON HATASI — Makale sayısı eşleşmiyor:\n` +
      `   TR: ${trArticles.length} makale\n` +
      `   EN: ${enArticles.length} makale\n` +
      `   Her iki JSON dosyasına aynı anda ekleme yapılmalıdır!`
    );
  }

  const trDates = trArticles.map(a => a.dateISO);
  const enDates = enArticles.map(a => a.dateISO);
  const mismatch = trDates.findIndex((d, i) => d !== enDates[i]);

  if (mismatch !== -1) {
    throw new Error(
      `\n❌ SIRALAMA UYUŞMAZLIĞI — Sıra ${mismatch + 1}:\n` +
      `   TR[${mismatch}].dateISO = "${trDates[mismatch]}"\n` +
      `   EN[${mismatch}].dateISO = "${enDates[mismatch]}"\n` +
      `   Makaleler her iki JSON'da aynı dateISO sırasında olmalıdır!`
    );
  }

  console.log(
    `   ✅ assertSynchronized → ${trArticles.length} makale, ` +
    `${trArticles.length} dateISO çifti doğrulandı`
  );
}

// ── HTML Üreticiler ──────────────────────────────────────────────────────────

/** Tek makale kartı */
function renderCard(article, index, lang) {
  const cls  = (index === 0) ? 'card article-card-page fade-in' : 'card article-card';
  const date = formatDate(article.dateISO, lang);
  const cta  = CFG[lang].readMore;
  return [
    `                    <article class="${cls}">`,
    `                        <div class="article-image-container">`,
    `                            <img src="${article.image}" alt="${article.imageAlt}" loading="lazy">`,
    `                        </div>`,
    `                        <div class="article-content">`,
    `                            <span class="article-date">${date}</span>`,
    `                            <h3 class="card-title">${article.title}</h3>`,
    `                            <p>${article.summary}</p>`,
    `                            <a href="${article.url}?source=blog" class="btn btn-outline-gold mt-sm">${cta}</a>`,
    `                        </div>`,
    `                    </article>`,
  ].join('\n');
}

/** Grid sarmalı + kart listesi */
function renderGrid(articles, gridClass, lang) {
  const cards = articles.map((a, i) => renderCard(a, i, lang)).join('\n');
  return [
    `                <div class="grid ${gridClass}">`,
    cards,
    `                </div>`,
  ].join('\n');
}

/** Pagination nav HTML */
function renderPagination(current, total, cfg) {
  if (total <= 1) return '';

  const prevHref = (current === 1) ? null : cfg.pageUrl(current - 1);
  const nextHref = (current === total) ? null : cfg.pageUrl(current + 1);

  let pageLinks = '';
  for (let i = 1; i <= total; i++) {
    const isCur  = (i === current);
    const cls    = isCur ? 'pagination-page pagination-active' : 'pagination-page';
    const aria   = isCur ? ' aria-current="page"' : '';
    pageLinks   += `\n                        ` +
                   `<a href="${cfg.pageUrl(i)}" class="${cls}"${aria} aria-label="${cfg.pageAria(i)}">${i}</a>`;
  }

  const prevBtn = prevHref
    ? `<a href="${prevHref}" class="pagination-btn pagination-prev" aria-label="${cfg.prevLabel}">${cfg.prevLabel}</a>`
    : `<span class="pagination-btn pagination-prev pagination-disabled" aria-disabled="true">${cfg.prevLabel}</span>`;

  const nextBtn = nextHref
    ? `<a href="${nextHref}" class="pagination-btn pagination-next" aria-label="${cfg.nextLabel}">${cfg.nextLabel}</a>`
    : `<span class="pagination-btn pagination-next pagination-disabled" aria-disabled="true">${cfg.nextLabel}</span>`;

  return [
    '',
    `        <nav class="pagination-nav" aria-label="${cfg.navAria}">`,
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

/** Sayfa 2+ için SEO meta etiketlerini güncelle */
function applyPageSeo(html, page, cfg) {
  const absUrl = cfg.absPageUrl(page);

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${cfg.pageTitle(page)}</title>`
  );
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?>/,
    `<meta name="description" content="${cfg.pageDesc(page)}">`
  );
  html = html.replace(
    new RegExp(`(<link\\s[^>]*hreflang="${cfg.hreflangKey}"[^>]*href=")[^"]+"`),
    `$1${absUrl}"`
  );
  html = html.replace(
    /(<link\s[^>]*hreflang="x-default"[^>]*href=")[^"]+"/,
    `$1${absUrl}"`
  );
  html = inject(
    html,
    '<!-- SEO_BUILD_START -->',
    '<!-- SEO_BUILD_END -->',
    `    <link rel="canonical" href="${absUrl}" />`
  );

  return html;
}

// ── Sitemap Güncelleme (Delete-and-Rewrite) ───────────────────────────────────
/**
 * 1. /sayfa/N/ ve /page/N/ içeren tüm <url> bloklarını regex ile sil
 * 2. Hesaplanan totalPages'e göre TR+EN hreflang çiftlerini
 *    </urlset>'den hemen önce ekle
 * Bu işlem her çalıştırmada idempotent (aynı sonuç) üretir.
 */
function updateSitemap(totalPages) {
  console.log('\n📍 sitemap.xml güncelleniyor...');

  let sitemap = readFile(SITEMAP_PATH);

  // Regex: tek satır <url>...</url> bloğu, /sayfa/N/ veya /page/N/ içerenler
  const PAGINATION_RE = /<url><loc>[^<]*(\/sayfa\/\d+\/|\/page\/\d+\/)[^<]*<\/loc>[^]*?<\/url>/g;
  const oldMatches = sitemap.match(PAGINATION_RE) || [];
  sitemap = sitemap.replace(PAGINATION_RE, '');
  sitemap = sitemap.replace(/\n{3,}/g, '\n');   // artık boş satırları temizle
  console.log(`   — ${oldMatches.length} eski pagination URL silindi`);

  // Yeni hreflang çiftleri (sayfa 1 zaten sitemap'te mevcut)
  const newLines = [];
  for (let n = 2; n <= totalPages; n++) {
    const trUrl = `${BASE_URL}/tr/makaleler/sayfa/${n}/`;
    const enUrl = `${BASE_URL}/en/articles/page/${n}/`;
    // TR satırı
    newLines.push(
      `  <url><loc>${trUrl}</loc>` +
      `<xhtml:link rel="alternate" hreflang="tr" href="${trUrl}" />` +
      `<xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${trUrl}" /></url>`
    );
    // EN satırı
    newLines.push(
      `  <url><loc>${enUrl}</loc>` +
      `<xhtml:link rel="alternate" hreflang="tr" href="${trUrl}" />` +
      `<xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${trUrl}" /></url>`
    );
  }

  if (newLines.length > 0) {
    sitemap = sitemap.replace('</urlset>', newLines.join('\n') + '\n</urlset>');
    console.log(`   + ${newLines.length} yeni pagination URL eklendi (sayfa 2–${totalPages})`);
  } else {
    console.log('   — Tek sayfa mevcut; pagination girişi eklenmedi');
  }

  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
  console.log('   ✓  sitemap.xml yazıldı');
}

// ════════════════════════════════════════════════════════════════════════════════
// ANA ÇALIŞMA AKIŞI
// ════════════════════════════════════════════════════════════════════════════════

const DIVIDER = '═'.repeat(64);
console.log('\n' + DIVIDER);
console.log('  build-articles.js — Çift Dilli SSG Motor');
console.log(DIVIDER);

// 0. JSON'ları yükle ve dateISO'ya göre azalan sırala
const trArticles = JSON.parse(readFile(CFG.tr.dataFile));
const enArticles = JSON.parse(readFile(CFG.en.dataFile));
trArticles.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
enArticles.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));

// 1. assertSynchronized — BUILD KALKANI
console.log('\n🔒 Senkron kontrolü...');
assertSynchronized(trArticles, enArticles);

const totalArticles = trArticles.length;
const totalPages    = Math.ceil(totalArticles / PER_PAGE);
console.log(
  `   Toplam: ${totalArticles} makale → ${totalPages} sayfa (${PER_PAGE}/sayfa)`
);

// 2. Her dil için HTML build
const ARTICLES = { tr: trArticles, en: enArticles };

for (const [lang, articles] of Object.entries(ARTICLES)) {
  const cfg = CFG[lang];
  console.log(`\n${'─'.repeat(64)}`);
  console.log(`  ${lang.toUpperCase()} Build`);
  console.log('─'.repeat(64));

  // Sıralı makale listesini konsola yaz
  articles.forEach((a, i) => {
    const mark = a.featured ? ' ⭐' : '   ';
    const date = formatDate(a.dateISO, lang);
    console.log(
      `   ${String(i + 1).padStart(2, '0')}.${mark}[${a.dateISO}] ${date} | ${a.title.slice(0, 42)}...`
    );
  });

  // Ana sayfa: featured:true olan en yeni 4
  const top4 = articles.filter(a => a.featured).slice(0, 4);
  console.log(`\n   ⭐ Featured (${top4.length} kart):`);
  top4.forEach(a => console.log(`      • [${a.dateISO}] ${a.title}`));

  let homeHtml = readFile(cfg.homeFile);
  homeHtml = inject(
    homeHtml,
    '<!-- ARTICLES_PREVIEW_START -->',
    '<!-- ARTICLES_PREVIEW_END -->',
    renderGrid(top4, 'grid-4', lang)
  );
  fs.writeFileSync(cfg.homeFile, homeHtml, 'utf8');
  console.log(`\n   ✓  ${lang}/ ana sayfa → ${top4.length} featured kart güncellendi`);

  // Sayfalandır
  const baseTemplate = readFile(cfg.listFile);   // şablonu bir kez oku

  for (let page = 1; page <= totalPages; page++) {
    const chunk = articles.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    let   html  = baseTemplate;    // her iterasyon için temiz kopya

    // Kart grid'ini enjekte et
    html = inject(
      html,
      '<!-- ARTICLES_GRID_START -->',
      '<!-- ARTICLES_GRID_END -->',
      renderGrid(chunk, 'grid-3', lang)
    );

    // Pagination nav'ı enjekte et
    html = inject(
      html,
      '<!-- PAGINATION_START -->',
      '<!-- PAGINATION_END -->',
      renderPagination(page, totalPages, cfg)
    );

    if (page === 1) {
      // Sayfa 1: canonical boş bırak; liste dosyasını güncelle
      html = inject(html, '<!-- SEO_BUILD_START -->', '<!-- SEO_BUILD_END -->', '');
      fs.writeFileSync(cfg.listFile, html, 'utf8');
      console.log(`   ✓  ${lang} sayfa 1/${totalPages} → liste güncellendi (${chunk.length} kart)`);
    } else {
      // Sayfa 2+: benzersiz SEO meta, fiziksel klasör oluştur
      html = applyPageSeo(html, page, cfg);
      const dir = cfg.pageDir(page);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
      const rel = dir.replace(ROOT + path.sep, '');
      console.log(`   ✓  ${lang} sayfa ${page}/${totalPages} → ${rel}/ (${chunk.length} kart)`);
    }
  }
}

// 3. Sitemap güncelle (Delete-and-Rewrite)
updateSitemap(totalPages);

console.log('\n' + DIVIDER);
console.log('  🟢 Build tamamlandı!');
console.log(DIVIDER + '\n');
