window.initFAQ = () => {
    const isEnglish = window.location.pathname.startsWith('/en/');
    const accordionGrid = document.querySelector('.faq-accordion-grid');
    if (!accordionGrid) return;

    const articleFaqsByLang = {
        tr: [
            {
                question: 'Kira sözleşmesi bitmeden tahliye davası açılabilir mi?',
                answer: 'Kiracının temerrüdü, ihtiyaç veya tahliye taahhüdü gibi hukuki sebepler mevcutsa sözleşme süresi dolmadan da tahliye talep edilebilir. Her dosyada dayanak sebep ve deliller ayrı değerlendirilmelidir.',
                articleTitle: 'Kira ve Tahliye Davaları',
                articleUrl: 'makale-detay.html?id=3'
            },
            {
                question: 'Dernek genel kurul kararının iptali için süre var mı?',
                answer: 'Genel kurul kararlarına karşı iptal davası, kanunda öngörülen hak düşürücü süreler içinde açılmalıdır. Toplantı usulü, gündem ve üyelik statüsü gibi unsurlar davanın sonucunu doğrudan etkiler.',
                articleTitle: 'Dernek ve Vakıflardan Doğan Davalar',
                articleUrl: 'makale-detay.html?id=5'
            }
        ],
        en: [
            {
                question: 'Can an eviction case be filed before the lease term ends?',
                answer: 'If legal grounds such as tenant default, genuine need, or a valid eviction undertaking exist, an eviction claim may be filed before the lease term ends. The legal basis and evidence must be assessed case by case.',
                articleTitle: 'Lease and Eviction Cases',
                articleUrl: 'article-detail.html?id=3'
            },
            {
                question: 'Is there a time limit for cancelling a foundation or association general assembly decision?',
                answer: 'Yes. Actions for annulment are subject to statutory time limits. Procedural defects, agenda compliance, and membership status are key elements in evaluating such cases.',
                articleTitle: 'Disputes Arising from Associations and Foundations',
                articleUrl: 'article-detail.html?id=5'
            }
        ]
    };

    const labels = isEnglish
        ? { readText: 'Related Article' }
        : { readText: 'İlgili Makale' };

    // Inject article-based FAQs once.
    if (!accordionGrid.querySelector('[data-source="article"]')) {
        const articleFaqs = isEnglish ? articleFaqsByLang.en : articleFaqsByLang.tr;
        if (articleFaqs.length > 0) {
            const existingCount = accordionGrid.querySelectorAll('.faq-item-modern').length;
            articleFaqs.forEach((item, index) => {
                const order = String(existingCount + index + 1).padStart(2, '0');
                const faqEl = document.createElement('div');
                faqEl.className = 'faq-item-modern';
                faqEl.setAttribute('data-source', 'article');
                faqEl.innerHTML = `
                    <button class="faq-trigger">
                        <span class="faq-number">${order}</span>
                        <span class="faq-text">${item.question}</span>
                        <span class="faq-plus"></span>
                    </button>
                    <div class="faq-content">
                        <div class="faq-content-inner">
                            <p>${item.answer}</p>
                            <p class="faq-article-link-wrap">
                                <a href="${item.articleUrl}" class="faq-article-link">${labels.readText}: ${item.articleTitle}</a>
                            </p>
                        </div>
                    </div>
                `;
                accordionGrid.appendChild(faqEl);
            });
        }
    }

    const faqItems = document.querySelectorAll('.faq-item-modern');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (!trigger || !content) return;

        trigger.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }

            // Re-trigger scroll animations or smooth scrolling if needed
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.initFAQ();
});

