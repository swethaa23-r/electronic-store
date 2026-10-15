/**
 * STACKLY - Shop Page Interactive Controller & GSAP / AOS Animations
 * Handles category filtering, live search, sorting, editorial CTA jumps,
 * clarity accordion, quick view descriptions, AOS init, and GSAP ScrollTrigger motion.
 */

(function initStacklyShop() {
    'use strict';

    const PRODUCT_DESCRIPTIONS = {
        'View 27 QHD Monitor': 'Ultra-sharp 27-inch QHD IPS display with slim bezels, 99% sRGB color accuracy, and ergonomic tilt adjustment for effortless daily productivity.',
        'Play One Console': 'Next-generation 4K 120Hz gaming console with ultra-fast NVMe SSD storage, ray tracing graphics, and immersive haptic controller.',
        'Book Air 14': 'Featherlight 14-inch everyday laptop with all-day 18-hour battery life, crisp retina display, and silent fanless performance.',
        'Desk Duo Keyboard & Mouse': 'Low-profile wireless tactile keyboard paired with a sculpted silent-click mouse for a clean, cable-free workspace.',
        'View 27 4K Monitor': 'Studio-grade 27-inch 4K UHD monitor with USB-C 90W power delivery and factory-calibrated color precision for creators.',
        'Play One Extra Controller Bundle': 'Complete co-op gaming bundle featuring the Play One Console and two wireless dual-sense controllers for game night.',
        'Sonix Pro Wireless': 'Over-ear wireless headphones with hybrid active noise cancellation, plush memory-foam earcups, and 40-hour battery life.',
        'Air Buds Pro': 'Compact true wireless earbuds with adaptive noise cancellation, transparency mode, and wireless charging case.',
        'Pulse Mini Speaker': '360-degree room-filling acoustic speaker in a compact woven fabric body with 16-hour portable playback.',
        'Watch One': 'Sleek everyday smartwatch with always-on OLED display, heart-rate and sleep tracking, and 5-day battery endurance.',
        'Sonix Studio Max': 'Flagship audiophile wireless headphones engineered with custom 45mm beryllium drivers and spatial studio acoustics.',
        'Air Buds Lite': 'Lightweight everyday wireless earbuds with crisp balanced sound, IPX4 water resistance, and 28-hour total battery.',
        'Pulse Home Speaker': 'High-excursion smart home speaker delivering deep bass and automatic room-tuning acoustics for any living space.',
        'Watch Active': 'Rugged sport smartwatch featuring built-in dual-band GPS, workout recovery metrics, and breathable fluoroelastomer band.'
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

    function onReady() {
        // 1. Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 750,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                once: true,
                offset: 40
            });
        }

        // 2. Initialize GSAP & ScrollTrigger Animations
        initShopGSAP();

        // 3. Initialize Filtering, Sorting & Live Search
        initCatalogControls();

        // 4. Initialize Clarity Accordion
        initClarityAccordion();

        // 5. Enhance Quick View on Shop Cards
        initShopQuickViewEnhancements();
    }

    // ==========================================
    // GSAP & ScrollTrigger Animations
    // ==========================================
    function initShopGSAP() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Header entrance animation
        const header = document.querySelector('.site-header');
        if (header) {
            const logo = header.querySelector('.logo');
            const navLinks = header.querySelectorAll('.nav-links > li');
            const navIcons = header.querySelectorAll('.nav-icons > *:not(.search-box-wrapper)');

            const headerTl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.1 });
            if (logo) {
                headerTl.fromTo(logo, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45 });
            }
            if (navLinks.length) {
                headerTl.fromTo(navLinks, { opacity: 0, y: -8 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 }, '-=0.25');
            }
            if (navIcons.length) {
                headerTl.fromTo(navIcons, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.35, clearProps: 'transform,opacity' }, '-=0.2');
            }

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    start: 'top -20',
                    onUpdate: (self) => {
                        if (self.scroll() > 40) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                    }
                });
            }
        }

        // Hero Banner GSAP timeline (line-based heading reveal + supporting text reveal after heading)
        const heroEyebrow = document.querySelector('.shop-hero-banner .shop-eyebrow');
        const heroTitle = document.querySelector('.shop-hero-title');
        const heroSub = document.querySelector('.shop-hero-subtitle');

        if (heroTitle) {
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.18 });
            if (heroEyebrow) {
                heroTl.fromTo(heroEyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
            }
            const maskChild = heroTitle.querySelector('.spotlight-reveal-text, .text-mask-child');
            if (maskChild) {
                // Theatrical Spotlight Reveal for the main heading
                heroTl.fromTo(maskChild,
                    {
                        clipPath: 'circle(0% at 50% 50%)',
                        opacity: 0.1,
                        scale: 0.95,
                        filter: 'brightness(1.5) blur(4px)'
                    },
                    {
                        clipPath: 'circle(150% at 50% 50%)',
                        opacity: 1,
                        scale: 1,
                        filter: 'brightness(1) blur(0px)',
                        duration: 0.95,
                        ease: 'power3.out',
                        clearProps: 'clipPath,filter,transform,opacity'
                    },
                    heroEyebrow ? '-=0.15' : 0
                );
            } else {
                heroTl.fromTo(heroTitle, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, heroEyebrow ? '-=0.15' : 0);
            }
            if (heroSub) {
                // Reveal supporting text strictly AFTER the heading completes its spotlight reveal
                heroTl.fromTo(heroSub, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '+=0.1');
            }

            // Interactive cursor spotlight tracking on shop hero banner
            const heroBanner = document.querySelector('.shop-hero-banner');
            if (heroBanner) {
                heroBanner.addEventListener('mousemove', (e) => {
                    const rect = heroBanner.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    heroBanner.style.setProperty('--spot-x', `${x}%`);
                    heroBanner.style.setProperty('--spot-y', `${y}%`);
                }, { passive: true });
            }
        }

        // ========================================================
        // Staggered Grid Reveal for Shop Catalog Section
        // Multi-dimensional 2D wave reveal of product cards & images
        // ========================================================
        const shopGrid = document.getElementById('shop-products-grid');
        if (shopGrid && typeof ScrollTrigger !== 'undefined') {
            const initialCards = Array.from(shopGrid.querySelectorAll('.shop-product-card'));
            const initialImages = Array.from(shopGrid.querySelectorAll('.shop-product-card .img-container img'));

            if (initialCards.length) {
                const gridRevealTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: shopGrid,
                        start: 'top 84%',
                        once: true
                    },
                    defaults: { ease: 'power3.out' }
                });

                // 1. Staggered Grid Reveal for Card Envelopes (2D grid wave)
                gridRevealTl.fromTo(initialCards,
                    {
                        opacity: 0,
                        y: 28,
                        scale: 0.96
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.72,
                        ease: 'power2.out',
                        stagger: {
                            grid: 'auto',
                            from: 'start',
                            amount: 0.65
                        },
                        clearProps: 'transform,opacity'
                    }
                );

                // 2. Staggered Grid Reveal to show the Product Images
                // Optical clip-path expansion, scale settling, and brightness flare
                if (initialImages.length) {
                    gridRevealTl.fromTo(initialImages,
                        {
                            clipPath: 'inset(18% 0% 0% 0%)',
                            scale: 1.15,
                            opacity: 0.2,
                            filter: 'brightness(1.12) blur(2px)'
                        },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            scale: 1,
                            opacity: 1,
                            filter: 'brightness(1) blur(0px)',
                            duration: 0.85,
                            ease: 'power3.out',
                            stagger: {
                                grid: 'auto',
                                from: 'start',
                                amount: 0.65
                            },
                            clearProps: 'clipPath,transform,opacity,filter'
                        },
                        '-=0.55' // Coordinated overlap with cards entrance
                    );
                }
            }
        }

        // Editorial Split Image Reveal & Subtle Parallax with ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            const splitSections = document.querySelectorAll('.shop-editorial-split');
            splitSections.forEach((sec) => {
                const img = sec.querySelector('.shop-split-img-wrap img');
                if (img) {
                    gsap.fromTo(img,
                        { scale: 1.08 },
                        {
                            scale: 1,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: sec,
                                start: 'top 80%',
                                end: 'bottom 20%',
                                scrub: 0.6
                            }
                        }
                    );
                }
            });
        }
    }

    // ==========================================
    // Catalog Filtering, Sorting & Live Search
    // ==========================================
    function initCatalogControls() {
        const grid = document.getElementById('shop-products-grid');
        if (!grid) return;

        const allCards = Array.from(grid.querySelectorAll('.shop-product-card'));
        const pills = Array.from(document.querySelectorAll('#shop-category-pills .shop-pill'));
        const searchInput = document.getElementById('shop-search-input');
        const searchClear = document.getElementById('shop-search-clear');
        const countEl = document.getElementById('shop-product-count');
        const emptyState = document.getElementById('shop-empty-state');
        const resetBtn = document.getElementById('shop-reset-filters-btn');

        // Sort dropdown elements
        const sortDropdown = document.getElementById('shop-sort-dropdown');
        const sortTrigger = document.getElementById('shop-sort-trigger');
        const sortLabel = document.getElementById('shop-sort-label');
        const sortOptions = Array.from(document.querySelectorAll('#shop-sort-menu .sort-option'));

        let activeCategory = 'all';
        let searchQuery = '';
        let activeSort = 'featured';

        function applyFiltersAndSort(animate = true, isLiveSearch = false) {
            const query = searchQuery.trim().toLowerCase();

            // 1. Filter matching cards
            const matchingCards = [];
            allCards.forEach((card) => {
                const cat = (card.getAttribute('data-category') || '').trim();
                const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
                const badge = (card.querySelector('.shop-badge')?.textContent || '').toLowerCase();
                const priceVal = parseFloat(card.getAttribute('data-price')) || 0;
                const oldPriceText = (card.querySelector('.old-price')?.textContent || '').trim();

                const matchesCategory = (activeCategory === 'all') || (cat.toLowerCase() === activeCategory.toLowerCase());

                let matchesSearch = true;
                if (query) {
                    // Check direct text matching
                    const textMatch = title.includes(query) || cat.toLowerCase().includes(query) || badge.includes(query);

                    // Check price query expressions (e.g. "under 100", "under $200", "< 500", "> 200")
                    let priceMatch = false;
                    const underMatch = query.match(/(?:under|<|less than)\s*\$?(\d+)/);
                    const aboveMatch = query.match(/(?:above|>|more than)\s*\$?(\d+)/);
                    const exactPriceMatch = query.match(/^\$?(\d+(?:\.\d+)?)$/);

                    if (underMatch) {
                        const maxP = parseFloat(underMatch[1]);
                        priceMatch = priceVal <= maxP;
                    } else if (aboveMatch) {
                        const minP = parseFloat(aboveMatch[1]);
                        priceMatch = priceVal >= minP;
                    } else if (exactPriceMatch) {
                        priceMatch = Math.abs(priceVal - parseFloat(exactPriceMatch[1])) < 5;
                    }

                    // Check sale / deals
                    const saleMatch = (query === 'sale' || query === 'deal' || query === 'deals' || query === 'discount' || query === 'save') && Boolean(oldPriceText);

                    // Check color / finish match from global products DB
                    let colorMatch = false;
                    if (window.StacklyProductsDB) {
                        const pId = Object.keys(window.StacklyProductsDB).find(k => {
                            const pName = (window.StacklyProductsDB[k].name || '').toLowerCase();
                            return pName === title || title.includes(pName);
                        });
                        if (pId && window.StacklyProductsDB[pId].finishes) {
                            colorMatch = window.StacklyProductsDB[pId].finishes.some(f => (f.name || '').toLowerCase().includes(query));
                        }
                    }

                    matchesSearch = textMatch || priceMatch || saleMatch || colorMatch;
                }

                if (matchesCategory && matchesSearch) {
                    matchingCards.push(card);
                } else {
                    card.style.display = 'none';
                }
            });

            // 2. Sort matching cards
            matchingCards.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price')) || 0;
                const priceB = parseFloat(b.getAttribute('data-price')) || 0;
                const orderA = parseInt(a.getAttribute('data-order'), 10) || 0;
                const orderB = parseInt(b.getAttribute('data-order'), 10) || 0;
                const nameA = (a.querySelector('.product-title')?.textContent || '').trim();
                const nameB = (b.querySelector('.product-title')?.textContent || '').trim();

                if (activeSort === 'price-asc') return priceA - priceB;
                if (activeSort === 'price-desc') return priceB - priceA;
                if (activeSort === 'name-asc') return nameA.localeCompare(nameB);
                return orderA - orderB;
            });

            // 3. Re-append in sorted order & show
            matchingCards.forEach((card) => {
                card.style.display = 'flex';
                grid.appendChild(card);
            });

            // 4. Center last 2 items when showing all 14 products (matching Figma layout)
            if (matchingCards.length === 14) {
                grid.classList.add('center-last-two');
            } else {
                grid.classList.remove('center-last-two');
            }

            // 5. Update product count & empty state
            if (countEl) {
                countEl.textContent = `${matchingCards.length} ${matchingCards.length === 1 ? 'product' : 'products'}`;
            }

            if (emptyState) {
                emptyState.style.display = matchingCards.length === 0 ? 'block' : 'none';
            }

            // 6. Staggered Grid Reveal for updated / filtered results
            // (Strictly isolated to results grid; preserves responsiveness and avoids replaying hero animation)
            if (animate && matchingCards.length > 0) {
                if (typeof gsap !== 'undefined') {
                    gsap.killTweensOf(grid);
                    gsap.killTweensOf(matchingCards);

                    const matchingImgs = matchingCards.map(c => c.querySelector('.img-container img')).filter(Boolean);
                    if (matchingImgs.length) {
                        gsap.killTweensOf(matchingImgs);
                    }

                    if (isLiveSearch) {
                        // Instant keystroke responsiveness with a swift opacity fade
                        gsap.fromTo(grid,
                            { opacity: 0.65 },
                            { opacity: 1, duration: 0.16, ease: 'power1.out', clearProps: 'opacity' }
                        );
                    } else {
                        // Staggered Grid Reveal for filter pills & sort options
                        const staggerAmount = Math.min(0.38, matchingCards.length * 0.045);

                        gsap.fromTo(grid,
                            { opacity: 0.4 },
                            { opacity: 1, duration: 0.2, ease: 'power1.out', clearProps: 'opacity' }
                        );

                        // Card envelope 2D grid stagger
                        gsap.fromTo(matchingCards,
                            { opacity: 0.2, y: 14, scale: 0.98 },
                            {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.45,
                                ease: 'power2.out',
                                stagger: {
                                    grid: 'auto',
                                    from: 'start',
                                    amount: staggerAmount
                                },
                                clearProps: 'transform,opacity'
                            }
                        );

                        // Product image clip-path and scale reveal
                        if (matchingImgs.length) {
                            gsap.fromTo(matchingImgs,
                                {
                                    clipPath: 'inset(14% 0% 0% 0%)',
                                    scale: 1.08,
                                    opacity: 0.35
                                },
                                {
                                    clipPath: 'inset(0% 0% 0% 0%)',
                                    scale: 1,
                                    opacity: 1,
                                    duration: 0.52,
                                    ease: 'power3.out',
                                    stagger: {
                                        grid: 'auto',
                                        from: 'start',
                                        amount: staggerAmount
                                    },
                                    clearProps: 'clipPath,transform,opacity'
                                }
                            );
                        }
                    }
                } else {
                    grid.style.opacity = '1';
                }
            }
        }

        function setCategory(categoryName, scrollToGrid = false) {
            activeCategory = categoryName || 'all';
            pills.forEach((pill) => {
                const pillCat = pill.getAttribute('data-category') || 'all';
                const isMatch = pillCat.toLowerCase() === activeCategory.toLowerCase();
                pill.classList.toggle('active', isMatch);
                pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
            });

            applyFiltersAndSort(true, false);

            if (scrollToGrid) {
                const catalogSec = document.getElementById('shop-catalog');
                if (catalogSec) {
                    const yOffset = catalogSec.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: yOffset, behavior: 'smooth' });
                }
            }
        }

        // Category Pill Clicks
        pills.forEach((pill) => {
            pill.addEventListener('click', () => {
                const cat = pill.getAttribute('data-category') || 'all';
                setCategory(cat, false);
            });
        });

        // Live Search Input (Immediate response with subtle opacity transition)
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value || '';
                if (searchClear) {
                    searchClear.style.display = searchQuery.length > 0 ? 'inline-flex' : 'none';
                }
                applyFiltersAndSort(true, true);
            });
        }

        if (searchClear && searchInput) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchQuery = '';
                searchClear.style.display = 'none';
                searchInput.focus();
                applyFiltersAndSort(true, false);
            });
        }

        // Also hook header search input into live shop search when on shop.html
        const headerSearchInput = document.getElementById('header-search-input');
        const headerSearchBtn = document.getElementById('search-submit-btn');
        if (headerSearchInput) {
            headerSearchInput.addEventListener('input', (e) => {
                if (searchInput) {
                    searchInput.value = e.target.value;
                    searchQuery = e.target.value || '';
                    if (searchClear) {
                        searchClear.style.display = searchQuery.length > 0 ? 'inline-flex' : 'none';
                    }
                    applyFiltersAndSort(true, true);
                }
            });
        }
        if (headerSearchBtn && headerSearchInput) {
            headerSearchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const catalogSec = document.getElementById('shop-catalog');
                if (catalogSec) {
                    catalogSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Reset Filters Button
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (searchClear) searchClear.style.display = 'none';
                searchQuery = '';
                activeSort = 'featured';
                if (sortLabel) sortLabel.textContent = 'Featured';
                sortOptions.forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-sort') === 'featured'));
                setCategory('all', false);
            });
        }

        // Sort Dropdown Toggle & Selection
        if (sortTrigger && sortDropdown) {
            sortTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = sortDropdown.classList.toggle('open');
                sortTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            sortOptions.forEach((opt) => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    activeSort = opt.getAttribute('data-sort') || 'featured';
                    if (sortLabel) sortLabel.textContent = opt.textContent.trim();

                    sortOptions.forEach((o) => {
                        const active = o === opt;
                        o.classList.toggle('active', active);
                        o.setAttribute('aria-selected', active ? 'true' : 'false');
                    });

                    sortDropdown.classList.remove('open');
                    sortTrigger.setAttribute('aria-expanded', 'false');
                    applyFiltersAndSort(true, false);
                });
            });

            document.addEventListener('click', (e) => {
                if (!sortDropdown.contains(e.target)) {
                    sortDropdown.classList.remove('open');
                    sortTrigger.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Editorial CTA Category Jump Buttons ("Explore laptops", "Explore gaming consoles", "Explore headphones")
        const jumpBtns = document.querySelectorAll('.js-category-jump, .js-footer-cat');
        jumpBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const targetCat = btn.getAttribute('data-target-category');
                if (targetCat) {
                    e.preventDefault();
                    setCategory(targetCat, true);
                }
            });
        });

        // Support URL query parameter ?category=...
        const params = new URLSearchParams(window.location.search);
        const urlCat = params.get('category');
        if (urlCat) {
            setCategory(urlCat, true);
        }
    }

    // ==========================================
    // Clarity Accordion Section
    // ==========================================
    function initClarityAccordion() {
        const items = document.querySelectorAll('.clarity-accordion-item');
        items.forEach((item) => {
            const btn = item.querySelector('.clarity-row-btn');
            const content = item.querySelector('.clarity-row-content');
            if (!btn || !content) return;

            btn.addEventListener('click', () => {
                const isExpanded = item.classList.contains('active');

                // Close other open items
                items.forEach((other) => {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.clarity-row-btn');
                        const otherContent = other.querySelector('.clarity-row-content');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherContent) otherContent.hidden = true;
                    }
                });

                if (isExpanded) {
                    item.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                    content.hidden = true;
                } else {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                    content.hidden = false;
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(content, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
                    }
                }
            });
        });
    }

    // ==========================================
    // Quick View Modal Product Description Sync
    // ==========================================
    function initShopQuickViewEnhancements() {
        const qvDesc = document.getElementById('qv-desc');

        document.addEventListener('click', (e) => {
            const qvTrigger = e.target.closest('.quick-view-btn');
            if (qvTrigger && qvDesc) {
                const card = qvTrigger.closest('.shop-product-card');
                const title = card?.querySelector('.product-title')?.textContent?.trim();
                if (title && PRODUCT_DESCRIPTIONS[title]) {
                    setTimeout(() => {
                        qvDesc.textContent = PRODUCT_DESCRIPTIONS[title];
                    }, 10);
                }
            }
        });
    }

})();
