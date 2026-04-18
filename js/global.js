/* ============================================
   GLOBAL JAVASCRIPT - Ozturk Avukatlik
   Premium Law Firm Website
   ============================================ */

// ========== NAVBAR & GLOBAL UI FUNCTIONALITY ==========
// ========== THEME MANAGEMENT ==========
const ThemeManager = {
    init: function () {
        const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark mode
        this.setTheme(savedTheme);
        this.addToggleListener();
    },

    getSystemPreference: function () {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    },

    setTheme: function (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleButton(theme);
        this.updateMapTheme(theme);
    },

    updateMapTheme: function (theme) {
        const mapIframe = document.querySelector('.map-container iframe');
        if (mapIframe) {
            // Keep map rendering consistent across themes by relying on CSS only.
            mapIframe.style.removeProperty('filter');
        }
    },


    toggleTheme: function () {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    addToggleListener: function () {
        // We use event delegation since the navbar might be re-initialized by Barba.js
        document.removeEventListener('click', this.handleButtonClick);
        this.handleButtonClick = (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        };
        document.addEventListener('click', this.handleButtonClick);
    },

    updateToggleButton: function (theme) {
        // Optional: Any extra Logic for the button if needed (handled by CSS mostly)
    }
};

// ========== LANGUAGE MANAGEMENT ==========
const LanguageManager = {
    // Define handler function once (outside of addLanguageSwitcher)
    handleLanguageClick: function (e) {
        // Use closest for reliable element detection
        let toggle = e.target.closest('.language-toggle');
        let switcher = e.target.closest('.language-switcher');
        let option = e.target.closest('.language-option');

        // If closest didn't work (e.g., SVG elements), traverse up manually
        if (!switcher && !toggle && !option) {
            let target = e.target;
            while (target && target !== document.body && target !== document.documentElement) {
                if (target.classList) {
                    if (target.classList.contains('language-toggle') && !toggle) {
                        toggle = target;
                    }
                    if (target.classList.contains('language-switcher') && !switcher) {
                        switcher = target;
                    }
                    if (target.classList.contains('language-option') && !option) {
                        option = target;
                    }
                }
                if (switcher) break;
                target = target.parentElement;
            }
        }

        // Handle language option click
        if (option) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const targetLang = option.getAttribute('data-lang');
            const currentLang = LanguageManager.detectLanguage();

            // Close all dropdowns
            document.querySelectorAll('.language-switcher').forEach(sw => {
                sw.classList.remove('active');
                const btn = sw.querySelector('.language-toggle');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // Only switch if different language
            if (targetLang !== currentLang) {
                LanguageManager.switchLanguage(targetLang);
            }
            return;
        }

        // Handle toggle button click (including SVG elements inside)
        // Find the switcher element - try multiple methods
        let currentSwitcher = switcher;
        if (!currentSwitcher && toggle) {
            currentSwitcher = toggle.closest('.language-switcher');
        }
        if (!currentSwitcher) {
            // Last resort: check if click is inside any language-switcher
            const allSwitchers = document.querySelectorAll('.language-switcher');
            for (let sw of allSwitchers) {
                if (sw.contains(e.target)) {
                    currentSwitcher = sw;
                    break;
                }
            }
        }

        if (toggle || switcher || currentSwitcher) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (!currentSwitcher) return;

            const isActive = currentSwitcher.classList.contains('active');

            // Close all dropdowns first
            document.querySelectorAll('.language-switcher').forEach(sw => {
                sw.classList.remove('active');
                const btn = sw.querySelector('.language-toggle');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            // Toggle current dropdown
            if (!isActive) {
                currentSwitcher.classList.add('active');
                const toggleBtn = currentSwitcher.querySelector('.language-toggle');
                if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
            }
            return;
        }

        // Close dropdowns when clicking outside
        if (!switcher) {
            document.querySelectorAll('.language-switcher').forEach(sw => {
                sw.classList.remove('active');
                const btn = sw.querySelector('.language-toggle');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        }
    },
    init: function () {
        this.currentLang = this.detectLanguage();
        // Always re-add listener to ensure it works on all pages
        // This is safe because we remove old listeners first
        this.addLanguageSwitcher();
    },

    detectLanguage: function () {
        // Detect from URL path
        const path = window.location.pathname;
        return path.startsWith('/en/') ? 'en' : 'tr';
    },

    getCurrentLanguage: function () {
        return this.currentLang;
    },

    getAlternateURL: function (targetLang) {
        let currentPath = window.location.pathname;
        if (currentPath.endsWith('/index.html')) {
            currentPath = currentPath.substring(0, currentPath.length - 10);
        }
        currentPath = currentPath.replace(/\/+$/, '/') || '/';
        const currentLang = this.detectLanguage();

        if (currentLang === targetLang) {
            return currentPath;
        }

        const staticMap = {
            '/': '/en/',
            '/tr/': '/en/',
            '/tr/hakkimizda/': '/en/about/',
            '/tr/hukuki-alanlar/': '/en/legal-areas/',
            '/tr/sss/': '/en/faq/',
            '/tr/makaleler/': '/en/articles/',
            '/tr/iletisim/': '/en/contact/',
            '/index.html': '/en/',
            '/en/': '/tr/',
            '/en/about/': '/tr/hakkimizda/',
            '/en/legal-areas/': '/tr/hukuki-alanlar/',
            '/en/faq/': '/tr/sss/',
            '/en/articles/': '/tr/makaleler/',
            '/en/contact/': '/tr/iletisim/',
            '/en/index.html': '/tr/'
        };

        const articlePairs = {
            '/tr/hukuki-alanlar/miras-hukuku/tereke-tespiti-davasi/': '/en/legal-areas/inheritance-law/estate-detection-case/',
            '/tr/hukuki-alanlar/miras-hukuku/mirasin-reddi/': '/en/legal-areas/inheritance-law/rejection-of-inheritance/',
            '/tr/hukuki-alanlar/is-ve-sosyal-guvenlik-hukuku/is-kazasinin-tespiti-davasi/': '/en/legal-areas/labor-and-social-security-law/work-accident-determination-case/',
            '/tr/hukuki-alanlar/kira-uyusmazliklari/kira-tespit-davasi/': '/en/legal-areas/rental-disputes/rent-determination-case/',
            '/tr/hukuki-alanlar/tasinmaz-hukuku/ortakligin-giderilmesi-davasi/': '/en/legal-areas/real-estate-law/dissolution-of-partnership-lawsuit/',
            '/tr/hukuki-alanlar/tasinmaz-hukuku/muris-muvazaasi-nedeniyle-tapu-iptali-ve-tescil-davasi/': '/en/legal-areas/real-estate-law/cancellation-of-deed-and-registration-case/',
            '/tr/hukuki-alanlar/ceza-hukuku/tehdit-sucu/': '/en/legal-areas/criminal-law/crime-of-threat/',
            '/tr/hukuki-alanlar/ceza-hukuku/uyusturucu-madde-kullanimi-veya-bulundurma-sucu/': '/en/legal-areas/criminal-law/drug-use-or-possession-offense/',
            '/tr/hukuki-alanlar/ceza-hukuku/kasten-yaralama-sucu/': '/en/legal-areas/criminal-law/intentional-injury-offense/',
            '/tr/hukuki-alanlar/ceza-hukuku/ceza-yargilamasinda-verilebilecek-karar-turleri/': '/en/legal-areas/criminal-law/types-of-judgments-in-criminal-trial/',
            '/tr/hukuki-alanlar/ceza-hukuku/ceza-yargilamasinin-genel-isleyisi-ve-uzlastirma/': '/en/legal-areas/criminal-law/criminal-trial-overview-and-mediation/',
            '/tr/hukuki-alanlar/ceza-hukuku/ceza-yargilamasinin-temel-kavramlari/': '/en/legal-areas/criminal-law/fundamental-concepts-of-criminal-proceedings/',
            '/tr/hukuki-alanlar/aile-hukuku/cekismeli-bosanma-davasi/': '/en/legal-areas/family-law/contested-divorce-case/',
            '/tr/hukuki-alanlar/aile-hukuku/anlasmali-bosanma-davasi/': '/en/legal-areas/family-law/uncontested-divorce-case/'
        };

        Object.keys(articlePairs).forEach((trPath) => {
            const enPath = articlePairs[trPath];
            staticMap[trPath] = enPath;
            staticMap[enPath] = trPath;
        });

        const categorySiloPairs = {
            '/en/legal-areas/family-law/': '/tr/hukuki-alanlar/aile-hukuku/',
            '/tr/hukuki-alanlar/aile-hukuku/': '/en/legal-areas/family-law/',
            '/en/legal-areas/inheritance-law/': '/tr/hukuki-alanlar/miras-hukuku/',
            '/tr/hukuki-alanlar/miras-hukuku/': '/en/legal-areas/inheritance-law/',
            '/en/legal-areas/labor-and-social-security-law/': '/tr/hukuki-alanlar/is-ve-sosyal-guvenlik-hukuku/',
            '/tr/hukuki-alanlar/is-ve-sosyal-guvenlik-hukuku/': '/en/legal-areas/labor-and-social-security-law/',
            '/en/legal-areas/rental-disputes/': '/tr/hukuki-alanlar/kira-uyusmazliklari/',
            '/tr/hukuki-alanlar/kira-uyusmazliklari/': '/en/legal-areas/rental-disputes/',
            '/en/legal-areas/immovable-property-law/': '/tr/hukuki-alanlar/tasinmaz-hukuku/',
            '/tr/hukuki-alanlar/tasinmaz-hukuku/': '/en/legal-areas/immovable-property-law/',
            '/en/legal-areas/criminal-law/': '/tr/hukuki-alanlar/ceza-hukuku/',
            '/tr/hukuki-alanlar/ceza-hukuku/': '/en/legal-areas/criminal-law/'
        };
        Object.keys(categorySiloPairs).forEach((path) => {
            staticMap[path] = categorySiloPairs[path];
        });

        const mapped = staticMap[currentPath] || (
            currentPath.startsWith('/en/')
                ? currentPath.replace(/^\/en\//, '/tr/')
                : currentPath.replace(/^\/(tr\/)?/, '/en/')
        );
        return mapped;
    },

    switchLanguage: function (targetLang) {
        const alternateURL = this.getAlternateURL(targetLang);
        window.location.href = alternateURL;
    },

    addLanguageSwitcher: function () {
        // Update current language display
        this.updateLanguageDisplay();

        // Remove old listeners if they exist (both capture and bubble)
        if (this.boundHandler) {
            document.removeEventListener('click', this.boundHandler, true);
            document.removeEventListener('click', this.boundHandler, false);
        }
        // Also try removing unbound version (for backwards compatibility)
        document.removeEventListener('click', this.handleLanguageClick, true);
        document.removeEventListener('click', this.handleLanguageClick, false);

        // Bind handler to LanguageManager context
        this.boundHandler = this.handleLanguageClick.bind(this);

        // Add document-level listener with capture phase (works for all pages, even after Barba.js transitions)
        // Capture phase ensures we get the event before other listeners
        document.addEventListener('click', this.boundHandler, true);

        // Also add in bubble phase as backup
        document.addEventListener('click', this.boundHandler, false);
    },

    updateLanguageDisplay: function () {
        const currentLang = this.detectLanguage();
        document.querySelectorAll('.current-lang').forEach(el => {
            el.textContent = currentLang.toUpperCase();
        });

        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
};

window.initGlobalUI = function () {
    // Initialize Theme (this will also update logos)
    ThemeManager.init();

    // Initialize Language Manager (handles display update internally)
    LanguageManager.init();

    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (!navbar) return;

    // Navbar scroll effect
    const handleScroll = function () {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Mobile menu toggle
    if (navbarToggle && navbarMenu) {
        // Clone and replace to remove old listeners if navbar is persistent (though we move it inside)
        const newToggle = navbarToggle.cloneNode(true);
        navbarToggle.parentNode.replaceChild(newToggle, navbarToggle);

        newToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            newToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navbarLinks = document.querySelectorAll('.navbar-link');
        navbarLinks.forEach(link => {
            link.addEventListener('click', function () {
                newToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        const handleOutsideClick = function (event) {
            const isClickInsideNav = navbar.contains(event.target);
            if (!isClickInsideNav && navbarMenu.classList.contains('active')) {
                newToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        };
        document.removeEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleOutsideClick);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
};

// Initialize language switcher as early as possible
// This ensures it works on all pages, including direct navigation
(function () {
    // Wait for LanguageManager to be defined
    const initLanguageSwitcher = () => {
        if (typeof LanguageManager !== 'undefined' && LanguageManager.addLanguageSwitcher) {
            LanguageManager.addLanguageSwitcher();
        } else {
            // Retry if LanguageManager not ready yet
            setTimeout(initLanguageSwitcher, 10);
        }
    };

    // Try immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
    } else {
        initLanguageSwitcher();
    }
})();

document.addEventListener('DOMContentLoaded', window.initGlobalUI);

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    window.initGlobalUI();
}

// ========== UTILITY FUNCTIONS ==========
const Utils = {
    // Debounce function for performance
    debounce: function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport: function (element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Run on load
window.addEventListener('load', () => {
    // Other load initializations if any
});

