window.initFAQ = () => {
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

