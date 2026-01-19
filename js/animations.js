gsap.registerPlugin(ScrollTrigger);

// Global Animation Initializer
window.initializeAnimations = (container = document) => {
    // Clear existing ScrollTriggers to avoid duplicates
    ScrollTrigger.getAll().forEach(t => t.kill());

    // 1. Initial State Setting (Prevent Flashes)
    const headerTitle = container.querySelector('.hero-title, .page-title, .article-detail-title, .practice-area-detail-title');
    const headerSubtitle = container.querySelector('.hero-subtitle, .page-subtitle, .article-detail-date');
    const headerButtons = container.querySelector('.hero-buttons');
    const scrollIndicator = container.querySelector('.scroll-indicator');

    if (headerTitle) gsap.set(headerTitle, { opacity: 0, y: 30 });
    if (headerSubtitle) gsap.set(headerSubtitle, { opacity: 0, y: 20 });
    if (headerButtons) gsap.set(headerButtons, { opacity: 0, y: 20 });
    if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0 });

    // Main Header Timeline (Hero or Subpage Header)
    const headerTl = gsap.timeline({ paused: true });

    // 2. Hero / Header Animations (Defensive)
    if (container.querySelector('.hero')) {
        if (headerTitle) headerTl.to(headerTitle, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });

        if (headerSubtitle) {
            const splitSubtitle = new SplitType(headerSubtitle, { types: 'words' });
            if (splitSubtitle.words && splitSubtitle.words.length > 0) {
                headerTl.to(splitSubtitle.words, {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: 'power3.out'
                }, '-=0.5');
            } else {
                headerTl.to(headerSubtitle, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5');
            }
        }

        if (headerButtons) headerTl.to(headerButtons, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3');
        if (scrollIndicator) headerTl.to(scrollIndicator, { opacity: 1, duration: 1 }, '+=0.5');

    } else {
        const subPageHeader = container.querySelector('.page-header, .article-detail-header, .practice-area-detail-header');
        if (subPageHeader) {
            if (headerTitle) headerTl.to(headerTitle, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
            if (headerSubtitle) {
                const splitSubtitle = new SplitType(headerSubtitle, { types: 'words' });
                if (splitSubtitle.words && splitSubtitle.words.length > 0) {
                    headerTl.to(splitSubtitle.words, {
                        y: 0, opacity: 1, duration: 0.6, stagger: 0.02, ease: 'power3.out'
                    }, headerTitle ? '-=0.4' : 0);
                } else {
                    headerTl.to(headerSubtitle, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, headerTitle ? '-=0.4' : 0);
                }
            }
        }
    }

    // 3. Section Reveal Animations
    container.querySelectorAll('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' },
            y: 30, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'all'
        });
    });

    const practiceCards = container.querySelectorAll('.practice-area-card');
    if (practiceCards.length > 0) {
        gsap.from(practiceCards, {
            scrollTrigger: {
                trigger: container.querySelector('.section-practice-areas') || container.querySelector('.section-practice-areas-page'),
                start: 'top 80%',
            },
            y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', clearProps: 'all'
        });
    }

    // 3.1. Why choose items reveal
    const whyChooseItems = container.querySelectorAll('.why-choose-item');
    if (whyChooseItems.length > 0) {
        gsap.from(whyChooseItems, {
            scrollTrigger: {
                trigger: container.querySelector('.section-why-choose'),
                start: 'top 75%'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        });
    }

    // 4. Article cards reveal
    if (container.querySelector('.article-card')) {
        gsap.from(container.querySelectorAll('.article-card'), {
            scrollTrigger: {
                trigger: container.querySelector('.section-articles-preview') || container.querySelector('.section-articles-page'),
                start: 'top 75%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            clearProps: 'all'
        });
    }

    // 5. Contact Page Animations
    if (container.querySelector('.section-contact')) {
        gsap.from(container.querySelectorAll('.contact-header h2, .contact-header p'), {
            scrollTrigger: {
                trigger: container.querySelector('.contact-header'),
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            clearProps: 'all'
        });

        gsap.from(container.querySelectorAll('.contact-card'), {
            scrollTrigger: {
                trigger: container.querySelector('.contact-info-grid'),
                start: 'top 95%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            clearProps: 'all'
        });

        const mapSection = container.querySelector('.map-section');
        if (mapSection) {
            gsap.from(mapSection, {
                scrollTrigger: {
                    trigger: mapSection,
                    start: 'top 95%'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                clearProps: 'all'
            });
        }
    }

    // 6. Timeline Animations
    container.querySelectorAll('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                onEnter: () => item.classList.add('active'),
                onLeaveBack: () => item.classList.remove('active'),
            },
            x: i % 2 === 0 ? 50 : -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'all'
        });
    });

    // 7. Scroll Indicator Fade
    if (container.querySelector('.scroll-indicator')) {
        gsap.to(container.querySelector('.scroll-indicator'), {
            scrollTrigger: {
                trigger: container.querySelector('.hero') || container.querySelector('.page-header'),
                start: '100px top',
                end: '300px top',
                scrub: true,
            },
            opacity: 0,
            y: 20,
            pointerEvents: 'none'
        });
    }

    // 4. Scroll Utilities (Progress & Back to Top)
    const scrollProgress = document.querySelector('.scroll-progress');
    const backToTop = document.querySelector('.back-to-top');

    // Make updateScroll global so it can be reused
    if (!window.updateScroll) {
        window.updateScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            const scrollProgressEl = document.querySelector('.scroll-progress');
            if (scrollProgressEl) scrollProgressEl.style.width = `${progress}%`;

            const backToTopEl = document.querySelector('.back-to-top');
            if (backToTopEl) {
                if (window.pageYOffset > 400) {
                    backToTopEl.classList.add('visible');
                } else {
                    backToTopEl.classList.remove('visible');
                }
            }
        };
    }

    window.removeEventListener('scroll', window.updateScroll);
    window.addEventListener('scroll', window.updateScroll);
    window.updateScroll();

    if (backToTop) {
        backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 5. Particles Re-init (with container context)
    if (window.initParticles) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        window.initParticles(container);
      }, 50);
    }

    // 6. Refresh ScrollTrigger on resize/zoom
    let resizeTimer;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    };

    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return headerTl;
};

// Sub-page header detection helper
const getSubPageHeader = (container) => container.querySelector('.page-header, .article-detail-header, .practice-area-detail-header');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles first, before animations
    if (window.initParticles) {
        window.initParticles();
    }

    const headerTl = window.initializeAnimations();
    const preloader = document.querySelector('.preloader');
    const preloaderLogo = document.querySelector('.preloader-logo');

    if (preloader) {
        gsap.timeline()
            .to(preloaderLogo, { opacity: 1, scale: 1.1, duration: 1, ease: 'power2.inOut' })
            .to(preloader, {
                yPercent: -100, duration: 0.8, ease: 'power4.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    headerTl.play();
                    // Re-init particles after preloader is gone to ensure visibility
                    if (window.initParticles) {
                        setTimeout(() => window.initParticles(), 100);
                    }
                }
            });
    } else {
        headerTl.play();
    }

    // Force ScrollTrigger refresh after initial load
    // This ensures all triggers are properly calculated
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);

    // Barba Initialization
    if (typeof barba !== 'undefined') {
        barba.init({
            transitions: [{
                name: 'premium-transition',
                leave(data) {
                    // Remove old footer before transition to prevent duplicates
                    const oldFooter = data.current.container.querySelector('.footer');
                    if (oldFooter) {
                        oldFooter.remove();
                    }
                    
                    // Also check wrapper for any footer outside container
                    const wrapperFooter = document.querySelector('body[data-barba="wrapper"] > .footer');
                    if (wrapperFooter && !data.next.container.querySelector('.footer')) {
                        wrapperFooter.remove();
                    }
                    
                    // Detect theme for smoother transitions
                    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
                    const easeFunction = isLightMode ? 'power2.in' : 'power3.inOut';
                    const duration = isLightMode ? 0.5 : 0.4;
                    
                    // Smooth fade out with theme-aware easing
                    return gsap.to(data.current.container, { 
                        opacity: 0, 
                        y: isLightMode ? -15 : -20,
                        scale: 0.99,
                        duration: duration, 
                        ease: easeFunction,
                        onComplete: () => {
                            // Ensure old container is completely removed
                            if (data.current.container && data.current.container.parentNode) {
                                data.current.container.innerHTML = '';
                            }
                        }
                    });
                },
                enter(data) {
                    window.scrollTo(0, 0);

                    // Clean up any duplicate footers before entering
                    const existingFooters = document.querySelectorAll('.footer');
                    if (existingFooters.length > 1) {
                        // Keep only the last one (the new one)
                        for (let i = 0; i < existingFooters.length - 1; i++) {
                            existingFooters[i].remove();
                        }
                    }

                    // Detect theme for smoother transitions
                    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
                    const easeFunction = isLightMode ? 'power2.out' : 'power3.out';
                    const duration = isLightMode ? 0.6 : 0.5;

                    // Set initial state for smooth entrance
                    gsap.set(data.next.container, { 
                        opacity: 0, 
                        y: isLightMode ? 15 : 20,
                        scale: 0.99
                    });

                    // Initialize particles immediately for new page
                    if (window.initParticles) {
                        window.initParticles(data.next.container);
                    }

                    // Start initialization immediately
                    const newHeaderTl = window.initializeAnimations(data.next.container);

                    // Smooth fade in with theme-aware timing
                    const enterTl = gsap.timeline({
                        onComplete: () => {
                            newHeaderTl.play();
                            if (window.initGlobalUI) window.initGlobalUI();
                            if (window.initIcons) window.initIcons();

                            const namespace = data.next.namespace;
                            if (namespace === 'faq' && window.initFAQ) window.initFAQ();
                            if (namespace === 'article-detail' && window.initArticleDetail) window.initArticleDetail();
                            if (namespace === 'practice-area-detail' && window.initPracticeAreaDetail) window.initPracticeAreaDetail();

                            // Active Link Update
                            const path = window.location.pathname;
                            const pageName = path.split('/').pop() || 'index.html';
                            document.querySelectorAll('.navbar-link').forEach(link => {
                                link.classList.remove('active');
                                const href = link.getAttribute('href');
                                if (href && href.split('/').pop() === pageName) link.classList.add('active');
                            });

                            // Reset back-to-top button visibility on page transition
                            const backToTop = document.querySelector('.back-to-top');
                            if (backToTop) {
                                backToTop.classList.remove('visible');
                                // Re-bind click handler
                                backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
                                // Ensure scroll listener is active
                                if (window.updateScroll) {
                                    window.updateScroll();
                                }
                            }

                            // Re-init particles after transition to ensure it's visible
                            if (window.initParticles) {
                                setTimeout(() => window.initParticles(data.next.container), 100);
                            }

                            // Final cleanup - ensure only one footer exists
                            setTimeout(() => {
                                const allFooters = document.querySelectorAll('.footer');
                                if (allFooters.length > 1) {
                                    for (let i = 0; i < allFooters.length - 1; i++) {
                                        allFooters[i].remove();
                                    }
                                }
                            }, 100);

                            // Refresh ScrollTrigger after page transition
                            setTimeout(() => ScrollTrigger.refresh(), 100);
                            setTimeout(() => ScrollTrigger.refresh(), 500);
                        }
                    });

                    // Smooth entrance animation with theme-aware settings
                    enterTl.to(data.next.container, { 
                        opacity: 1, 
                        y: 0,
                        scale: 1,
                        duration: duration, 
                        ease: easeFunction
                    });

                    return enterTl;
                }
            }]
        });
    }
});

// Fallback: Initialize particles on window load (in case CDN loads late)
window.addEventListener('load', () => {
    if (window.initParticles) {
        // Check if particles are already initialized
        const particlesContainer = document.querySelector('#particles-js');
        if (particlesContainer && (!particlesContainer.pJSDom || particlesContainer.pJSDom.length === 0)) {
            window.initParticles();
        }
    }
});
