window.initArticleDetail = () => {
    const baseUrl = 'https://www.ozturkavukatlikburosu.av.tr';
    const path = window.location.pathname.replace(/\/+$/, '/') || '/';
    const isEnglish = path.startsWith('/en/');

    const articleMap = {
        '1': {
            trSlug: '/tr/makaleler/is-hukuku/is-hukukunda-yeni-duzenlemeler/',
            enSlug: '/en/articles/labor-law/new-regulations-in-labor-law/',
            trTitle: 'İş Hukukunda Yeni Düzenlemeler',
            enTitle: 'New Regulations in Labor Law',
            trDate: '15 Ocak 2024',
            enDate: 'January 15, 2024'
        },
        '2': {
            trSlug: '/tr/makaleler/aile-hukuku/aile-hukukunda-velayet-davalari/',
            enSlug: '/en/articles/family-law/custody-cases-in-family-law/',
            trTitle: 'Aile Hukukunda Velayet Davaları',
            enTitle: 'Custody Cases in Family Law',
            trDate: '10 Ocak 2024',
            enDate: 'January 10, 2024'
        },
        '3': {
            trSlug: '/tr/makaleler/gayrimenkul-hukuku/gayrimenkul-alim-satim-surecleri/',
            enSlug: '/en/articles/real-estate-law/real-estate-purchase-sale-processes/',
            trTitle: 'Gayrimenkul Alım-Satım Süreçleri',
            enTitle: 'Real Estate Purchase-Sale Processes',
            trDate: '5 Ocak 2024',
            enDate: 'January 5, 2024'
        },
        '4': {
            trSlug: '/tr/makaleler/calisma-hukuku/calisma-hukukunda-sendika-haklari/',
            enSlug: '/en/articles/employment-law/union-rights-in-employment-law/',
            trTitle: 'Çalışma Hukukunda Sendika Hakları',
            enTitle: 'Union Rights in Employment Law',
            trDate: '28 Aralık 2023',
            enDate: 'December 28, 2023'
        },
        '5': {
            trSlug: '/tr/makaleler/miras-hukuku/miras-hukuku-ve-vasiyetname/',
            enSlug: '/en/articles/inheritance-law/inheritance-law-and-wills/',
            trTitle: 'Miras Hukuku ve Vasiyetname',
            enTitle: 'Inheritance Law and Wills',
            trDate: '20 Aralık 2023',
            enDate: 'December 20, 2023'
        },
        '6': {
            trSlug: '/tr/makaleler/aile-hukuku/bosanma-surecleri-ve-haklar/',
            enSlug: '/en/articles/family-law/divorce-processes-and-rights/',
            trTitle: 'Boşanma Süreçleri ve Haklar',
            enTitle: 'Divorce Processes and Rights',
            trDate: '15 Aralık 2023',
            enDate: 'December 15, 2023'
        }
    };

    const slugAliases = {
        '/tr/makaleler/miras-hukuku/tereke-tespiti-davasi/': '5',
        '/en/articles/inheritance-law/estate-detection-case/': '5'
    };

    const urlParams = new URLSearchParams(window.location.search);
    let articleId = urlParams.get('id');

    if (!articleId) {
        for (const [id, meta] of Object.entries(articleMap)) {
            if (path === meta.trSlug || path === meta.enSlug) {
                articleId = id;
                break;
            }
        }
        if (!articleId && slugAliases[path]) {
            articleId = slugAliases[path];
        }
    }

    if (!articleId || !articleMap[articleId]) {
        articleId = '1';
    }

    const selected = articleMap[articleId];
    const title = isEnglish ? selected.enTitle : selected.trTitle;
    const date = isEnglish ? selected.enDate : selected.trDate;

    const titleEl = document.getElementById('article-title');
    const dateEl = document.getElementById('article-date');
    if (titleEl) titleEl.textContent = title;
    if (dateEl) dateEl.textContent = date;

    document.title = `${title} - ${isEnglish ? 'Ozturk Law Firm' : 'Öztürk Avukatlık'}`;

    const canonicalHref = isEnglish ? selected.enSlug : selected.trSlug;
    const trHref = selected.trSlug;
    const enHref = selected.enSlug;

    const setHref = (selector, href) => {
        const el = document.querySelector(selector);
        if (el) {
            el.setAttribute('href', `${baseUrl}${href}`);
        }
    };

    setHref('link[rel="canonical"]', canonicalHref);
    setHref('link[rel="alternate"][hreflang="tr"]', trHref);
    setHref('link[rel="alternate"][hreflang="en"]', enHref);
    setHref('link[rel="alternate"][hreflang="x-default"]', trHref);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        ogUrl.setAttribute('content', `${baseUrl}${canonicalHref}`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.initArticleDetail();
});
