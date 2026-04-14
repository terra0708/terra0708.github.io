window.initArticleDetail = () => {
    const baseUrl = 'https://www.ozturkavukatlikburosu.av.tr';
    const path = window.location.pathname.replace(/\/+$/, '/') || '/';
    const isEnglish = path.startsWith('/en/');

    const articleMap = {
        '1': {
            trSlug: '/tr/hukuki-alanlar/is-hukuku/is-hukukunda-yeni-duzenlemeler/',
            enSlug: '/en/legal-areas/labor-law/new-regulations-in-labor-law/',
            trTitle: 'İş Hukukunda Yeni Düzenlemeler',
            enTitle: 'New Regulations in Labor Law',
            trDate: '15 Ocak 2024',
            enDate: 'January 15, 2024'
        },
        '2': {
            trSlug: '/tr/hukuki-alanlar/aile-hukuku/aile-hukukunda-velayet-davalari/',
            enSlug: '/en/legal-areas/family-law/custody-cases-in-family-law/',
            trTitle: 'Aile Hukukunda Velayet Davaları',
            enTitle: 'Custody Cases in Family Law',
            trDate: '10 Ocak 2024',
            enDate: 'January 10, 2024'
        },
        '3': {
            trSlug: '/tr/hukuki-alanlar/gayrimenkul-hukuku/gayrimenkul-alim-satim-surecleri/',
            enSlug: '/en/legal-areas/real-estate-law/real-estate-purchase-sale-processes/',
            trTitle: 'Gayrimenkul Alım-Satım Süreçleri',
            enTitle: 'Real Estate Purchase-Sale Processes',
            trDate: '5 Ocak 2024',
            enDate: 'January 5, 2024'
        },
        '4': {
            trSlug: '/tr/hukuki-alanlar/calisma-hukuku/calisma-hukukunda-sendika-haklari/',
            enSlug: '/en/legal-areas/employment-law/union-rights-in-employment-law/',
            trTitle: 'Çalışma Hukukunda Sendika Hakları',
            enTitle: 'Union Rights in Employment Law',
            trDate: '28 Aralık 2023',
            enDate: 'December 28, 2023'
        },
        '5': {
            trSlug: '/tr/hukuki-alanlar/miras-hukuku/miras-hukuku-ve-vasiyetname/',
            enSlug: '/en/legal-areas/inheritance-law/inheritance-law-and-wills/',
            trTitle: 'Miras Hukuku ve Vasiyetname',
            enTitle: 'Inheritance Law and Wills',
            trDate: '20 Aralık 2023',
            enDate: 'December 20, 2023'
        },
        '6': {
            trSlug: '/tr/hukuki-alanlar/aile-hukuku/bosanma-surecleri-ve-haklar/',
            enSlug: '/en/legal-areas/family-law/divorce-processes-and-rights/',
            trTitle: 'Boşanma Süreçleri ve Haklar',
            enTitle: 'Divorce Processes and Rights',
            trDate: '15 Aralık 2023',
            enDate: 'December 15, 2023'
        },
        '7': {
            trSlug: '/tr/hukuki-alanlar/miras-hukuku/tereke-tespiti-davasi/',
            enSlug: '/en/legal-areas/inheritance-law/estate-detection-case/',
            trTitle: 'Terekenin Tespiti Davası Nedir? Nasıl Açılır?',
            enTitle: 'What Is an Estate Determination Case and How Is It Opened?',
            trDate: '2026',
            enDate: '2026'
        },
        '8': {
            trSlug: '/tr/hukuki-alanlar/miras-hukuku/vasiyetnamenin-acilmasi-davasi/',
            enSlug: '/en/legal-areas/inheritance-law/opening-of-will-case/',
            trTitle: 'Vasiyetnamenin Açılması Davası Nedir? Nasıl Açılır?',
            enTitle: 'What Is the Proceeding to Open a Will and How Does It Work?',
            trDate: '2026',
            enDate: '2026'
        },
        '9': {
            trSlug: '/tr/hukuki-alanlar/miras-hukuku/vasiyetnamenin-tenfizi-davasi/',
            enSlug: '/en/legal-areas/inheritance-law/enforcement-of-will-case/',
            trTitle: 'Vasiyetnamenin Tenfizi (Vasiyetnamenin Yerine Getirilmesi) Davası Nedir? Nasıl Açılır?',
            enTitle: 'What Is an Action for Enforcement of a Will and How Is It Filed?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '10': {
            trSlug: '/tr/hukuki-alanlar/miras-hukuku/vasiyetnamenin-iptali-davasi/',
            enSlug: '/en/legal-areas/inheritance-law/annulment-of-will-case/',
            trTitle: 'Vasiyetnamenin İptali Davası Nedir? Nasıl Açılır?',
            enTitle: 'What Is an Action for Annulment of a Will and How Is It Filed?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '11': {
            trSlug: '/tr/hukuki-alanlar/miras-hukuku/mirasin-reddi/',
            enSlug: '/en/legal-areas/inheritance-law/rejection-of-inheritance/',
            trTitle: 'Mirasın Reddi Nedir? Nasıl Yapılır?',
            enTitle: 'What is Disclaimer of Inheritance and How is it Done?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '12': {
            trSlug: '/tr/hukuki-alanlar/is-ve-sosyal-guvenlik-hukuku/ise-iade-davasi/',
            enSlug: '/en/legal-areas/labor-and-social-security-law/reinstatement-lawsuit/',
            trTitle: 'İşe İade Davası Nedir? Nasıl Açılır?',
            enTitle: 'What is a Reinstatement Lawsuit and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '13': {
            trSlug: '/tr/hukuki-alanlar/is-ve-sosyal-guvenlik-hukuku/is-kazasinin-tespiti-davasi/',
            enSlug: '/en/legal-areas/labor-and-social-security-law/work-accident-determination-case/',
            trTitle: 'İş Kazası Tespit Davası Nedir? Nasıl Açılır?',
            enTitle: 'What is a Work Accident Determination Case and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '14': {
            trSlug: '/tr/hukuki-alanlar/kira-uyusmazliklari/kira-tespit-davasi/',
            enSlug: '/en/legal-areas/rental-disputes/rent-determination-case/',
            trTitle: 'Kira Bedelinin Tespiti Davası Nedir? Nasıl Açılır?',
            enTitle: 'What is a Rent Determination Case and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '15': {
            trSlug: '/tr/hukuki-alanlar/kira-uyusmazliklari/kira-uyarlama-davasi/',
            enSlug: '/en/legal-areas/rental-disputes/rent-adaptation-case/',
            trTitle: 'Kira Uyarlama Davası Nedir? Nasıl Açılır?',
            enTitle: 'What is a Rent Adaptation Case and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '16': {
            trSlug: '/tr/hukuki-alanlar/tasinmaz-hukuku/ortakligin-giderilmesi-davasi/',
            enSlug: '/en/legal-areas/real-estate-law/dissolution-of-partnership-lawsuit/',
            trTitle: 'Ortaklığın Giderilmesi (İzale-i Şuyu) Davası Nedir? Nasıl Açılır?',
            enTitle: 'Dissolution of Partnership (Partition) Case: What is it and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '17': {
            trSlug: '/tr/hukuki-alanlar/tasinmaz-hukuku/muris-muvazaasi-nedeniyle-tapu-iptali-ve-tescil-davasi/',
            enSlug: '/en/legal-areas/real-estate-law/cancellation-of-deed-and-registration-case/',
            trTitle: 'Muris Muvazaası Nedeniyle Tapu İptali ve Tescil Davası Nedir? Nasıl Açılır?',
            enTitle: 'Cancellation of Title Deed due to Collusive Transfer: What is it and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '18': {
            trSlug: '/tr/hukuki-alanlar/aile-hukuku/cekismeli-bosanma-davasi/',
            enSlug: '/en/legal-areas/family-law/contested-divorce-case/',
            trTitle: 'Çekişmeli Boşanma Davası Nedir? Nasıl Açılır?',
            enTitle: 'What is a Contested Divorce Case and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '19': {
            trSlug: '/tr/hukuki-alanlar/aile-hukuku/anlasmali-bosanma-davasi/',
            enSlug: '/en/legal-areas/family-law/uncontested-divorce-case/',
            trTitle: 'Anlaşmalı Boşanma Davası Nedir? Nasıl Açılır?',
            enTitle: 'What is an Uncontested Divorce Case and How to File?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '20': {
            trSlug: '/tr/hukuki-alanlar/ceza-hukuku/tehdit-sucu/',
            enSlug: '/en/legal-areas/criminal-law/crime-of-threat/',
            trTitle: 'Tehdit Suçu Nedir? Cezası ne kadardır?',
            enTitle: 'What is the Crime of Threat? What are the Penalties?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '21': {
            trSlug: '/tr/hukuki-alanlar/ceza-hukuku/kasten-yaralama-sucu/',
            enSlug: '/en/legal-areas/criminal-law/intentional-injury-offense/',
            trTitle: 'Kasten Yaralama Suçu Nedir? Cezası ne kadardır?',
            enTitle: 'What is the Intentional Injury Offense? What are the Penalties?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '22': {
            trSlug: '/tr/hukuki-alanlar/ceza-hukuku/uyusturucu-madde-kullanimi-veya-bulundurma-sucu/',
            enSlug: '/en/legal-areas/criminal-law/drug-use-or-possession-offense/',
            trTitle: 'Uyuşturucu Madde Kullanma veya Bulundurma Suçu Nedir? Cezası ne kadardır?',
            enTitle: 'What is the Drug Use or Possession Offense? What are the Penalties?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '23': {
            trSlug: '/tr/hukuki-alanlar/ceza-hukuku/ceza-yargilamasi-sureci/',
            enSlug: '/en/legal-areas/criminal-law/criminal-procedure-step-by-step/',
            trTitle: 'Ceza Yargılaması Süreci Nasıl İşler? (Adım Adım Anlatım)',
            enTitle: 'How Does the Criminal Procedure Progress? (Step-by-Step Explanation)',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '24': {
            trSlug: '/tr/hukuki-alanlar/ceza-hukuku/ceza-yargilamasinin-temel-kavramlari/',
            enSlug: '/en/legal-areas/criminal-law/fundamental-concepts-of-criminal-proceedings/',
            trTitle: 'Ceza Yargılamasının Temel Kavramları Nelerdir?',
            enTitle: 'What are the Fundamental Concepts of Criminal Proceedings?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '25': {
            trSlug: '/tr/hukuki-alanlar/ceza-hukuku/ceza-yargilamasinda-verilebilecek-karar-turleri/',
            enSlug: '/en/legal-areas/criminal-law/types-of-judgments-in-criminal-trial/',
            trTitle: 'Ceza Yargılaması Sonunda Verilebilecek Kararlar Nelerdir?',
            enTitle: 'What are the Decisions That Can Be Made at the End of a Criminal Trial?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        },
        '26': {
            trSlug: '/tr/hukuki-alanlar/ceza-hukuku/ceza-yargilamasinda-uzlastirma/',
            enSlug: '/en/legal-areas/criminal-law/mediation-in-criminal-proceedings/',
            trTitle: 'Ceza Yargılamasında Uzlaştırma Nedir? Nasıl Yapılır?',
            enTitle: 'What is Mediation in Criminal Proceedings? How is it Done?',
            trDate: '14 Nisan 2026',
            enDate: 'April 14, 2026'
        }
    };

    const slugAliases = {};

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

    initArticleFaqAccordion();
};

const FAQ_PANEL_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const FAQ_PANEL_MS = 550;

function initArticleFaqAccordion() {
    document.querySelectorAll('.article-faq-accordion').forEach((accordion) => {
        const items = Array.from(accordion.querySelectorAll('[data-faq-item]'));

        const closeItem = (item) => {
            const panel = item.querySelector('.article-faq-item__panel');
            const inner = item.querySelector('.article-faq-item__panel-inner');
            const btn = item.querySelector('.article-faq-item__summary');
            if (!panel || !inner || !btn || !item.classList.contains('is-open')) return;
            const h = inner.scrollHeight;
            panel.style.maxHeight = `${h}px`;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    panel.style.maxHeight = '0px';
                });
            });
            btn.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');

            const onEnd = (e) => {
                if (e.propertyName !== 'max-height') return;
                clearTimeout(fallback);
                item.classList.remove('is-open');
                panel.removeEventListener('transitionend', onEnd);
            };
            const fallback = window.setTimeout(() => {
                item.classList.remove('is-open');
                panel.removeEventListener('transitionend', onEnd);
            }, FAQ_PANEL_MS + 100);
            panel.addEventListener('transitionend', onEnd);
        };

        const openItem = (item) => {
            const panel = item.querySelector('.article-faq-item__panel');
            const inner = item.querySelector('.article-faq-item__panel-inner');
            const btn = item.querySelector('.article-faq-item__summary');
            if (!panel || !inner || !btn) return;
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            panel.setAttribute('aria-hidden', 'false');
            panel.style.maxHeight = `${inner.scrollHeight}px`;
        };

        items.forEach((item) => {
            const panel = item.querySelector('.article-faq-item__panel');
            const inner = item.querySelector('.article-faq-item__panel-inner');
            const btn = item.querySelector('.article-faq-item__summary');
            if (!panel || !inner || !btn) return;

            panel.style.overflow = 'hidden';
            panel.style.maxHeight = '0px';
            panel.style.transition = `max-height ${FAQ_PANEL_MS}ms ${FAQ_PANEL_EASE}`;
            panel.setAttribute('aria-hidden', 'true');

            btn.addEventListener('click', () => {
                if (item.classList.contains('is-open')) {
                    closeItem(item);
                    return;
                }
                items.forEach((other) => {
                    if (other !== item) closeItem(other);
                });
                openItem(item);
            });
        });
    });

    if (!window._articleFaqResizeBound) {
        window._articleFaqResizeBound = true;
        window.addEventListener(
            'resize',
            () => {
                document.querySelectorAll('.article-faq-item--accordion.is-open .article-faq-item__panel').forEach((panel) => {
                    const inner = panel.querySelector('.article-faq-item__panel-inner');
                    if (inner) {
                        panel.style.maxHeight = `${inner.scrollHeight}px`;
                    }
                });
            },
            { passive: true }
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.initArticleDetail();
});
