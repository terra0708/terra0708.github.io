window.initFAQ = () => {
    const isEnglish = window.location.pathname.startsWith('/en/');
    const accordionGrid = document.querySelector('.faq-accordion-grid');
    if (!accordionGrid) return;

    const articleFaqsByLang = {
        tr: [
            {
                question: 'Kira bedeli konusunda anlaşmazlık çıkarsa ne yapılır?',
                answer: 'Kiraya veren ile kiracı arasında kira bedeline ilişkin uyuşmazlık doğduğunda öncelikle arabuluculuk süreci işletilir; sonuç alınamazsa sulh hukuk mahkemesinde kira bedelinin tespiti davası açılabilir. Görevli mahkeme, süre ve delil yükü dosyaya göre değerlendirilir.',
                articleTitle: 'Kira Bedelinin Tespiti Davası',
                articleUrl: '/tr/hukuki-alanlar/kira-uyusmazliklari/kira-tespit-davasi/'
            },
            {
                question: 'Miras bırakanın malvarlığı tam olarak bilinmiyorsa ne yapılır?',
                answer: 'Terekenin kapsamı net değilse veya mirasçılar arasında hangi mal ve hakların terekeye dahil olduğu konusunda tereddüt varsa, sulh hukuk mahkemesinde terekenin tespiti davası açılabilir. Bu dava, paylaşım öncesi malvarlığının belirlenmesine yöneliktir.',
                articleTitle: 'Terekenin Tespiti Davası',
                articleUrl: '/tr/hukuki-alanlar/miras-hukuku/tereke-tespiti-davasi/'
            }
        ],
        en: [
            {
                question: 'What if the landlord and tenant cannot agree on the rent amount?',
                answer: 'If mediation does not resolve the dispute, a rent determination case may be filed before the peace civil court. Which court has jurisdiction and what evidence is required depend on the specific lease and the facts of the case.',
                articleTitle: 'Rent Determination Case',
                articleUrl: '/en/legal-areas/rental-disputes/rent-determination-case/'
            },
            {
                question: 'What if the full extent of the deceased’s estate is unclear?',
                answer: 'When the scope of the estate is unknown or heirs disagree on what forms part of it, an estate (tereke) determination case may be filed to establish the assets and liabilities before partition.',
                articleTitle: 'Estate Determination Case',
                articleUrl: '/en/legal-areas/inheritance-law/estate-detection-case/'
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

