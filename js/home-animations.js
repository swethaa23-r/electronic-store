/**
 * STACKLY - Premium GSAP & ScrollTrigger Animations
 * Professional E-Commerce Motion System
 */

(function initStacklyAnimations() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAnimations);
    } else {
        runAnimations();
    }

    function runAnimations() {
        // Reduced motion check
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            console.log('STACKLY: Motion reduced based on user accessibility preference.');
            return;
        }

        // Verify GSAP
        if (typeof gsap === 'undefined') {
            console.warn('STACKLY: GSAP not loaded.');
            return;
        }

        // Register ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Make sure animations refresh when everything finishes loading
        window.addEventListener('load', () => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });

        // ----------------------------------------------------
        // 1. Header & Navigation Entrance Animation
        // ----------------------------------------------------
        function initHeaderAnimation() {
            const header = document.querySelector('.site-header');
            if (!header) return;

            const logo = header.querySelector('.logo');
            const navLinks = header.querySelectorAll('.nav-links > li');
            const navIcons = header.querySelectorAll('.nav-icons > *:not(.search-box-wrapper)');

            const headerTl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.1 });

            if (logo) {
                headerTl.fromTo(logo, {
                    opacity: 0,
                    scale: 0.92
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.55
                });
            }

            if (navLinks && navLinks.length > 0) {
                headerTl.fromTo(navLinks, {
                    opacity: 0,
                    y: -10
                }, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.06,
                    duration: 0.45
                }, '-=0.3');
            }

            if (navIcons && navIcons.length > 0) {
                headerTl.fromTo(navIcons, {
                    opacity: 0,
                    scale: 0.85
                }, {
                    opacity: 1,
                    scale: 1,
                    stagger: 0.05,
                    duration: 0.4,
                    clearProps: 'transform,opacity'
                }, '-=0.25');
            }

            // Subtle header elevation on scroll
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    start: 'top -20',
                    onUpdate: (self) => {
                        if (self.direction === 1 && self.scroll() > 40) {
                            header.classList.add('scrolled');
                        } else if (self.scroll() <= 40) {
                            header.classList.remove('scrolled');
                        }
                    }
                });
            }
        }

        // ----------------------------------------------------
        // ----------------------------------------------------
        // Helper: Safe Semantic Text Splitting for GSAP
        // Preserves HTML semantics (h1, h2), child spans, <br>,
        // and accessibility with aria-label and aria-hidden.
        // ----------------------------------------------------
        function splitTextIntoWords(element) {
            if (!element) return [];
            if (element.dataset.gsapSplit === "true") {
                return Array.from(element.querySelectorAll('.gsap-word'));
            }
            element.dataset.gsapSplit = "true";

            // Preserve full clean phrase for screen readers
            const rawText = element.textContent.replace(/\s+/g, ' ').trim();
            if (!element.getAttribute('aria-label')) {
                element.setAttribute('aria-label', rawText);
            }

            const wordSpans = [];

            function traverseNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    if (!text.trim()) {
                        return document.createTextNode(text);
                    }
                    const frag = document.createDocumentFragment();
                    const parts = text.split(/(\s+)/);
                    parts.forEach(part => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(part));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'gsap-word';
                            span.setAttribute('aria-hidden', 'true');
                            span.textContent = part;
                            wordSpans.push(span);
                            frag.appendChild(span);
                        }
                    });
                    return frag;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'BR') {
                        return node.cloneNode(true);
                    }
                    const textContent = node.textContent.trim();
                    // If node is a leaf inline element containing a single word (e.g. <span class="hero-highlight">Connect.</span>)
                    if (textContent && !/\s/.test(textContent) && node.children.length === 0) {
                        const clone = node.cloneNode(true);
                        clone.classList.add('gsap-word');
                        clone.setAttribute('aria-hidden', 'true');
                        wordSpans.push(clone);
                        return clone;
                    }
                    const clone = node.cloneNode(false);
                    Array.from(node.childNodes).forEach(child => {
                        const res = traverseNode(child);
                        if (res) clone.appendChild(res);
                    });
                    return clone;
                }
                return node.cloneNode(true);
            }

            const newContent = document.createDocumentFragment();
            Array.from(element.childNodes).forEach(child => {
                const res = traverseNode(child);
                if (res) newContent.appendChild(res);
            });

            element.innerHTML = '';
            element.appendChild(newContent);
            return wordSpans;
        }

        // ----------------------------------------------------
        // 2. Hero Section Entrance Animation (Cinematic Word-by-Word)
        // ----------------------------------------------------
        function initHeroEntrance() {
            const hero = document.getElementById('hero');
            if (!hero) return;

            const eyebrow = hero.querySelector('.hero-eyebrow');
            const heroH1 = hero.querySelector('h1');
            const support = hero.querySelector('.hero-support');
            const heroBtns = hero.querySelectorAll('.hero-buttons .btn');
            const heroFeatures = hero.querySelectorAll('.hero-features .hf-item');
            const ambientPrimary = hero.querySelector('.glow-primary');
            const ambientSecondary = hero.querySelector('.glow-secondary');

            // Split hero heading word by word
            let words = [];
            if (heroH1) {
                words = splitTextIntoWords(heroH1);
            }

            // Timeline for coordinated cinematic entrance
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.22 });

            if (eyebrow) {
                heroTl.from(eyebrow, {
                    opacity: 0,
                    y: -15,
                    duration: 0.5,
                    clearProps: 'opacity,transform'
                });
            }

            if (words && words.length > 0) {
                heroTl.from(words, {
                    opacity: 0,
                    y: 35,
                    scale: 0.9,
                    stagger: 0.14,
                    duration: 0.85,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                }, '-=0.25');
            } else if (heroH1) {
                heroTl.from(heroH1, {
                    opacity: 0,
                    y: 28,
                    duration: 0.75,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                }, '-=0.25');
            }

            if (support) {
                heroTl.from(support, {
                    opacity: 0,
                    y: 22,
                    duration: 0.7,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                }, '-=0.35');
            }

            if (heroBtns && heroBtns.length > 0) {
                heroTl.from(heroBtns, {
                    opacity: 0,
                    y: 18,
                    stagger: 0.12,
                    duration: 0.6,
                    ease: 'power2.out',
                    clearProps: 'opacity,transform'
                }, '-=0.3');
            }

            if (heroFeatures && heroFeatures.length > 0) {
                heroTl.from(heroFeatures, {
                    opacity: 0,
                    y: 12,
                    stagger: 0.08,
                    duration: 0.5,
                    ease: 'power2.out',
                    clearProps: 'opacity,transform'
                }, '-=0.25');
            }

            // Interactive mouse parallax on hero ambient glow
            if (window.innerWidth > 992) {
                hero.addEventListener('mousemove', (e) => {
                    const { clientX, clientY } = e;
                    const xRel = (clientX / window.innerWidth - 0.5);
                    const yRel = (clientY / window.innerHeight - 0.5);

                    if (ambientPrimary) {
                        gsap.to(ambientPrimary, {
                            x: xRel * 30,
                            y: yRel * 30,
                            duration: 1.2,
                            ease: 'power2.out'
                        });
                    }
                    if (ambientSecondary) {
                        gsap.to(ambientSecondary, {
                            x: -xRel * 25,
                            y: -yRel * 25,
                            duration: 1.2,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        }

        // ----------------------------------------------------
        // 3. Category Cards Scroll Reveal & Hover
        // ----------------------------------------------------
        // 3. Categories Grid: Staggered Entrance & Image Reveals
        // ----------------------------------------------------
        function initCategoryAnimations() {
            const catSection = document.getElementById('categories');
            if (!catSection || typeof ScrollTrigger === 'undefined') return;

            const grid = catSection.querySelector('.grid-4');
            const items = catSection.querySelectorAll('.category-item');

            if (items && items.length > 0) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: grid || catSection,
                        start: 'top 85%',
                        once: true
                    }
                });

                items.forEach((item, index) => {
                    const img = item.querySelector('.cat-img-box img');
                    const info = item.querySelector('.cat-info');
                    const startTime = index * 0.08;

                    // Staggered card entrance
                    tl.fromTo(item, 
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', onComplete: () => gsap.set(item, { clearProps: 'transform' }) },
                        startTime
                    );

                    // Image subtle zoom-in entrance
                    if (img) {
                        tl.fromTo(img,
                            { opacity: 0.4, scale: 0.92 },
                            { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', onComplete: () => gsap.set(img, { clearProps: 'transform,opacity' }) },
                            startTime + 0.06
                        );
                    }

                    // Content text fade up
                    if (info) {
                        tl.fromTo(info,
                            { opacity: 0, y: 12 },
                            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', onComplete: () => gsap.set(info, { clearProps: 'transform,opacity' }) },
                            startTime + 0.1
                        );
                    }
                });
            }

            // Natural desktop hover effects
            const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (isDesktop) {
                items.forEach(item => {
                    const img = item.querySelector('.cat-img-box img');
                    item.addEventListener('mouseenter', () => {
                        gsap.to(item, { y: -6, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
                        if (img) gsap.to(img, { scale: 1.07, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                    });
                    item.addEventListener('mouseleave', () => {
                        gsap.to(item, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(item, { clearProps: 'transform' }) });
                        if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(img, { clearProps: 'transform' }) });
                    });
                });
            }
        }

        // ----------------------------------------------------
        // 4. Featured Technology Showcase: Left/Right Lateral Enters & Subtle Image Zoom
        // ----------------------------------------------------
        function initShowcaseAnimation() {
            const showcase = document.getElementById('showcase');
            if (!showcase || typeof ScrollTrigger === 'undefined') return;

            const leftCard = showcase.querySelector('.sc-left');
            const centerCard = showcase.querySelector('.sc-center-card');
            const rightCard = showcase.querySelector('.sc-right');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: showcase,
                    start: 'top 82%',
                    once: true
                }
            });

            // Left card slides in gently from the left (x: -35)
            if (leftCard) {
                const leftImg = leftCard.querySelector('.sc-img-wrap img');
                tl.fromTo(leftCard,
                    { opacity: 0, x: -35, scale: 0.96 },
                    { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out', onComplete: () => gsap.set(leftCard, { clearProps: 'transform' }) },
                    0
                );
                if (leftImg) {
                    tl.fromTo(leftImg,
                        { opacity: 0.5, scale: 0.93 },
                        { opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out', onComplete: () => gsap.set(leftImg, { clearProps: 'transform,opacity' }) },
                        0.08
                    );
                }
            }

            // Center card slides up with subtle zoom (y: 35, scale: 0.94)
            if (centerCard) {
                const centerImg = centerCard.querySelector('.sc-main-img');
                const tag = centerCard.querySelector('.sc-floating-tag');
                const btn = centerCard.querySelector('.btn');
                tl.fromTo(centerCard,
                    { opacity: 0, y: 35, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', onComplete: () => gsap.set(centerCard, { clearProps: 'transform' }) },
                    0.12
                );
                if (centerImg) {
                    tl.fromTo(centerImg,
                        { opacity: 0.5, scale: 0.93 },
                        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', onComplete: () => gsap.set(centerImg, { clearProps: 'transform,opacity' }) },
                        0.2
                    );
                }
                if (tag) {
                    tl.fromTo(tag,
                        { opacity: 0, scale: 0.88, y: 10 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out', onComplete: () => gsap.set(tag, { clearProps: 'transform,opacity' }) },
                        0.4
                    );
                }
                if (btn) {
                    tl.fromTo(btn,
                        { opacity: 0, y: 15 },
                        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', onComplete: () => gsap.set(btn, { clearProps: 'transform,opacity' }) },
                        0.45
                    );
                }
            }

            // Right card slides in gently from the right (x: 35)
            if (rightCard) {
                const rightImgs = rightCard.querySelectorAll('.sc-img-wrap img');
                tl.fromTo(rightCard,
                    { opacity: 0, x: 35, scale: 0.96 },
                    { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out', onComplete: () => gsap.set(rightCard, { clearProps: 'transform' }) },
                    0.22
                );
                if (rightImgs.length > 0) {
                    tl.fromTo(rightImgs,
                        { opacity: 0.5, scale: 0.93 },
                        { opacity: 1, scale: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out', onComplete: () => gsap.set(rightImgs, { clearProps: 'transform,opacity' }) },
                        0.3
                    );
                }
            }

            // Desktop hover image zoom without container overflow
            const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (isDesktop) {
                showcase.querySelectorAll('.sc-side-card').forEach(card => {
                    const imgs = card.querySelectorAll('.sc-img-wrap img');
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
                        if (imgs.length > 0) gsap.to(imgs, { scale: 1.05, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(card, { clearProps: 'transform' }) });
                        if (imgs.length > 0) gsap.to(imgs, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(imgs, { clearProps: 'transform' }) });
                    });
                });

                if (centerCard) {
                    const centerImg = centerCard.querySelector('.sc-main-img');
                    centerCard.addEventListener('mouseenter', () => {
                        gsap.to(centerCard, { y: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
                        if (centerImg) gsap.to(centerImg, { scale: 1.05, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
                    });
                    centerCard.addEventListener('mouseleave', () => {
                        gsap.to(centerCard, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(centerCard, { clearProps: 'transform' }) });
                        if (centerImg) gsap.to(centerImg, { scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(centerImg, { clearProps: 'transform' }) });
                    });
                }
            }
        }

        // ----------------------------------------------------
        // 5. Workspace Showcase: Image from Left, Points from Right
        // ----------------------------------------------------
        function initWorkspaceAnimation() {
            const setup = document.getElementById('setup-feature');
            if (!setup || typeof ScrollTrigger === 'undefined') return;

            const imageFrame = setup.querySelector('.setup-image-frame');
            const setupImg = setup.querySelector('.setup-img');
            const pointCards = setup.querySelectorAll('.setup-point-card');
            const actionBtn = setup.querySelector('.setup-action');

            // Left image frame slides in gently from the left with subtle zoom
            if (imageFrame) {
                gsap.fromTo(imageFrame, 
                    { opacity: 0, x: -40, scale: 0.95 },
                    {
                        scrollTrigger: {
                            trigger: setup,
                            start: 'top 80%',
                            once: true
                        },
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.85,
                        ease: 'power3.out',
                        onComplete: () => gsap.set(imageFrame, { clearProps: 'transform' })
                    }
                );

                if (setupImg) {
                    gsap.fromTo(setupImg,
                        { scale: 1.06 },
                        {
                            scrollTrigger: {
                                trigger: setup,
                                start: 'top 80%',
                                once: true
                            },
                            scale: 1,
                            duration: 1,
                            ease: 'power3.out',
                            onComplete: () => gsap.set(setupImg, { clearProps: 'transform' })
                        }
                    );
                }
            }

            // Right points column slides in gently from the right
            if (pointCards && pointCards.length > 0) {
                gsap.fromTo(pointCards, 
                    { opacity: 0, x: 35 },
                    {
                        scrollTrigger: {
                            trigger: setup.querySelector('.setup-points-column') || setup,
                            start: 'top 82%',
                            once: true
                        },
                        opacity: 1,
                        x: 0,
                        stagger: 0.1,
                        duration: 0.7,
                        ease: 'power3.out',
                        onComplete: () => gsap.set(pointCards, { clearProps: 'transform' })
                    }
                );
            }

            if (actionBtn) {
                gsap.fromTo(actionBtn,
                    { opacity: 0, y: 20 },
                    {
                        scrollTrigger: {
                            trigger: actionBtn,
                            start: 'top 92%',
                            once: true
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        onComplete: () => gsap.set(actionBtn, { clearProps: 'transform' })
                    }
                );
            }
        }

        // ----------------------------------------------------
        // 6. Freshly Dropped Products: Staggered Reveal & Fluid Interactions
        // ----------------------------------------------------
        function bindFreshlyDroppedHovers(cards) {
            // Check for desktop fine-pointer device to avoid touch tap conflicts
            const isDesktopHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (!isDesktopHover) return;

            cards.forEach(card => {
                if (card.dataset.freshlyHoverBound) return;
                card.dataset.freshlyHoverBound = "true";

                const img = card.querySelector('.img-container img');

                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -7,
                        boxShadow: '0 20px 38px -8px rgba(0, 0, 0, 0.12), 0 4px 14px rgba(0, 0, 0, 0.04)',
                        borderColor: '#CBD5E1',
                        duration: 0.35,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                    if (img) {
                        gsap.to(img, {
                            scale: 1.04,
                            duration: 0.45,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                    }
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
                        borderColor: '#E5E7EB',
                        duration: 0.32,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        onComplete: () => {
                            gsap.set(card, { clearProps: 'transform,boxShadow,borderColor' });
                        }
                    });
                    if (img) {
                        gsap.to(img, {
                            scale: 1,
                            duration: 0.38,
                            ease: 'power2.out',
                            overwrite: 'auto',
                            onComplete: () => {
                                gsap.set(img, { clearProps: 'transform' });
                            }
                        });
                    }
                });
            });
        }

        function initFreshlyDroppedAnimation() {
            const dropSection = document.getElementById('freshly-dropped');
            if (!dropSection) return;

            const sectionHeading = dropSection.querySelector('.section-heading');
            const filterBar = dropSection.querySelector('.filter-bar, .product-filters');
            const grid = document.getElementById('freshly-dropped-grid');
            if (!grid) return;

            if (typeof ScrollTrigger !== 'undefined') {
                if (sectionHeading) {
                    gsap.from(sectionHeading.children, {
                        scrollTrigger: {
                            trigger: sectionHeading,
                            start: 'top 88%',
                            once: true
                        },
                        opacity: 0,
                        y: 20,
                        stagger: 0.08,
                        duration: 0.65,
                        ease: 'power3.out',
                        clearProps: 'opacity,transform'
                    });
                }

                if (filterBar) {
                    gsap.from(filterBar, {
                        scrollTrigger: {
                            trigger: filterBar,
                            start: 'top 88%',
                            once: true
                        },
                        opacity: 0,
                        y: 18,
                        duration: 0.6,
                        ease: 'power3.out',
                        clearProps: 'opacity,transform'
                    });
                }
            }

            function animateCards(cardsList, useScrollTrigger = false) {
                if (!cardsList || cardsList.length === 0) return;

                const tl = gsap.timeline({
                    ...(useScrollTrigger && typeof ScrollTrigger !== 'undefined' ? {
                        scrollTrigger: {
                            trigger: grid,
                            start: 'top 82%',
                            once: true
                        }
                    } : {})
                });

                cardsList.forEach((card, index) => {
                    const img = card.querySelector('.img-container img');
                    const badge = card.querySelector('.badge');
                    const actions = card.querySelector('.card-actions');
                    const category = card.querySelector('.category-label');
                    const title = card.querySelector('.product-title');
                    const rating = card.querySelector('.rating');
                    const price = card.querySelector('.price');
                    const addCartBtn = card.querySelector('.btn-add-cart');

                    // 120ms stagger between cards (within 100-150ms requirement)
                    const cardStartTime = index * 0.12;

                    // 1. Staggered Product Card Reveal (25-35px upward slide, fade from 0 to 1, power3.out)
                    tl.fromTo(card,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                            onComplete: () => {
                                gsap.set(card, { clearProps: 'transform' });
                            }
                        },
                        cardStartTime
                    );

                    // 2. Product Image Animation (smooth scale from 0.94 to 1, centered and sharp)
                    if (img) {
                        tl.fromTo(img,
                            { opacity: 0.35, scale: 0.94 },
                            {
                                opacity: 1,
                                scale: 1,
                                duration: 0.75,
                                ease: 'power3.out',
                                onComplete: () => {
                                    gsap.set(img, { clearProps: 'transform,opacity' });
                                }
                            },
                            cardStartTime + 0.08
                        );
                    }

                    // 3. Text and Price Animation (subtle fade-in and upward slide)
                    const textElements = [badge, actions, category, title, rating, price, addCartBtn].filter(Boolean);
                    if (textElements.length > 0) {
                        tl.fromTo(textElements,
                            { opacity: 0, y: 14 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.55,
                                stagger: 0.03,
                                ease: 'power3.out',
                                onComplete: () => {
                                    textElements.forEach(el => gsap.set(el, { clearProps: 'transform,opacity' }));
                                }
                            },
                            cardStartTime + 0.14
                        );
                    }
                });

                // Bind hover interactions
                bindFreshlyDroppedHovers(cardsList);
            }

            const initialCards = grid.querySelectorAll('.product-card');
            animateCards(initialCards, true);

            // MutationObserver to animate new cards when category filter changes
            const observer = new MutationObserver((mutations) => {
                const hasAddedCards = mutations.some(m => m.addedNodes.length > 0);
                if (hasAddedCards) {
                    const newCards = Array.from(grid.querySelectorAll('.product-card')).filter(c => !c.dataset.filteredAnimated);
                    if (newCards.length > 0) {
                        animateCards(newCards, false);
                    }
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                    }
                }
            });
            observer.observe(grid, { childList: true });
        }

        // ----------------------------------------------------
        // 7. Handpicked for You (Large Cards & Lateral Entrances)
        // ----------------------------------------------------
        function initHandpickedAnimation() {
            const handpicked = document.getElementById('handpicked');
            if (!handpicked || typeof ScrollTrigger === 'undefined') return;

            const largeCards = handpicked.querySelectorAll('.large-card');

            if (largeCards && largeCards.length >= 2) {
                // Card on left slides gently from left (x: -35), card on right from right (x: 35)
                gsap.from(largeCards[0], {
                    scrollTrigger: {
                        trigger: handpicked.querySelector('.grid-2') || handpicked,
                        start: 'top 80%',
                        once: true
                    },
                    opacity: 0,
                    x: -35,
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity'
                });

                gsap.from(largeCards[1], {
                    scrollTrigger: {
                        trigger: handpicked.querySelector('.grid-2') || handpicked,
                        start: 'top 80%',
                        once: true
                    },
                    opacity: 0,
                    x: 35,
                    duration: 0.8,
                    delay: 0.12,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity'
                });

                // Subtle image scale-in reveal on enter
                largeCards.forEach((card, idx) => {
                    const img = card.querySelector('.large-card-img img');
                    if (img) {
                        gsap.fromTo(img,
                            { opacity: 0.4, scale: 0.94 },
                            {
                                scrollTrigger: {
                                    trigger: handpicked.querySelector('.grid-2') || handpicked,
                                    start: 'top 80%',
                                    once: true
                                },
                                opacity: 1,
                                scale: 1,
                                duration: 0.85,
                                delay: idx * 0.12 + 0.08,
                                ease: 'power3.out',
                                clearProps: 'transform,opacity'
                            }
                        );
                    }
                });
            } else if (largeCards && largeCards.length > 0) {
                gsap.from(largeCards, {
                    scrollTrigger: {
                        trigger: handpicked.querySelector('.grid-2') || handpicked,
                        start: 'top 80%',
                        once: true
                    },
                    opacity: 0,
                    y: 35,
                    stagger: 0.15,
                    duration: 0.75,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity'
                });
            }

            // Hover interactions on large cards (without interfering with color switch)
            largeCards.forEach(card => {
                const img = card.querySelector('.large-card-img img');
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { y: -5, duration: 0.28, ease: 'power2.out' });
                    if (img) gsap.to(img, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { y: 0, duration: 0.28, ease: 'power2.out' });
                    if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
                });
            });
        }

        // ----------------------------------------------------
        // 8. Promo Banner Section (Content Left, Image Right)
        // ----------------------------------------------------
        function initPromoBannerAnimation() {
            const promo = document.getElementById('promo-banner');
            if (!promo || typeof ScrollTrigger === 'undefined') return;

            const content = promo.querySelector('.promo-content');
            const imgWrap = promo.querySelector('.promo-image-wrap');
            const img = imgWrap ? imgWrap.querySelector('img') : null;

            // Content on the left slides gently from left
            if (content) {
                gsap.from(content, {
                    scrollTrigger: {
                        trigger: promo,
                        start: 'top 82%',
                        once: true
                    },
                    opacity: 0,
                    x: -35,
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });
            }

            // Image on the right slides in gently from right with subtle zoom-in
            if (imgWrap) {
                gsap.from(imgWrap, {
                    scrollTrigger: {
                        trigger: promo,
                        start: 'top 82%',
                        once: true
                    },
                    opacity: 0,
                    x: 40,
                    scale: 0.95,
                    duration: 0.85,
                    delay: 0.1,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });

                if (img) {
                    gsap.fromTo(img,
                        { scale: 0.94 },
                        {
                            scrollTrigger: {
                                trigger: promo,
                                start: 'top 82%',
                                once: true
                            },
                            scale: 1,
                            duration: 0.85,
                            delay: 0.15,
                            ease: 'power3.out',
                            clearProps: 'transform'
                        }
                    );
                }
            }
        }

        // ----------------------------------------------------
        // 9. Customer Reviews & Testimonials
        // ----------------------------------------------------
        function initTestimonialsAnimation() {
            const testSec = document.getElementById('testimonials');
            if (!testSec || typeof ScrollTrigger === 'undefined') return;

            const featuredCard = testSec.querySelector('.featured-review-card');
            const carouselPanel = testSec.querySelector('.reviews-carousel-panel');

            // Left side (featured review) slides in gently from left
            if (featuredCard) {
                gsap.from(featuredCard, {
                    scrollTrigger: {
                        trigger: testSec.querySelector('.reviews-showcase') || testSec,
                        start: 'top 80%',
                        once: true
                    },
                    opacity: 0,
                    x: -35,
                    duration: 0.8,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });
            }

            // Right side (carousel panel) slides in gently from right
            if (carouselPanel) {
                gsap.from(carouselPanel, {
                    scrollTrigger: {
                        trigger: testSec.querySelector('.reviews-showcase') || testSec,
                        start: 'top 80%',
                        once: true
                    },
                    opacity: 0,
                    x: 35,
                    duration: 0.8,
                    delay: 0.14,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });
            }
        }

        // ----------------------------------------------------
        // 10. Buying Guides Articles Section
        // ----------------------------------------------------
        function initArticlesAnimation() {
            const artSec = document.getElementById('articles');
            if (!artSec || typeof ScrollTrigger === 'undefined') return;

            const cards = artSec.querySelectorAll('.article-card');

            if (cards && cards.length >= 2) {
                // Left card slides from left
                gsap.from(cards[0], {
                    scrollTrigger: {
                        trigger: artSec.querySelector('.grid-2') || artSec,
                        start: 'top 85%',
                        once: true
                    },
                    opacity: 0,
                    x: -30,
                    duration: 0.75,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });

                // Right card slides from right
                gsap.from(cards[1], {
                    scrollTrigger: {
                        trigger: artSec.querySelector('.grid-2') || artSec,
                        start: 'top 85%',
                        once: true
                    },
                    opacity: 0,
                    x: 30,
                    duration: 0.75,
                    delay: 0.12,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });

                // Subtle image zoom entrance
                cards.forEach((card, idx) => {
                    const img = card.querySelector('.article-img-wrap img');
                    if (img) {
                        gsap.fromTo(img,
                            { opacity: 0.5, scale: 0.95 },
                            {
                                scrollTrigger: {
                                    trigger: artSec.querySelector('.grid-2') || artSec,
                                    start: 'top 85%',
                                    once: true
                                },
                                opacity: 1,
                                scale: 1,
                                duration: 0.8,
                                delay: idx * 0.12 + 0.08,
                                ease: 'power3.out',
                                clearProps: 'transform,opacity'
                            }
                        );
                    }
                });
            } else if (cards && cards.length > 0) {
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: artSec.querySelector('.grid-2') || artSec,
                        start: 'top 85%',
                        once: true
                    },
                    opacity: 0,
                    y: 30,
                    stagger: 0.12,
                    duration: 0.65,
                    ease: 'power2.out',
                    clearProps: 'opacity,transform'
                });
            }

            // Article card hover zoom
            cards.forEach(card => {
                const img = card.querySelector('.article-img-wrap img');
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { y: -5, duration: 0.28, ease: 'power2.out' });
                    if (img) gsap.to(img, { scale: 1.06, duration: 0.4, ease: 'power2.out' });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { y: 0, duration: 0.28, ease: 'power2.out' });
                    if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
                });
            });
        }

        // ----------------------------------------------------
        // 11. FAQ Accordion Scroll Entrance
        // ----------------------------------------------------
        function initFaqAnimation() {
            const faqSec = document.getElementById('faq');
            if (!faqSec || typeof ScrollTrigger === 'undefined') return;

            const heading = faqSec.querySelector('.section-heading');
            if (heading) {
                gsap.from(heading, {
                    scrollTrigger: {
                        trigger: faqSec,
                        start: 'top 86%',
                        once: true
                    },
                    opacity: 0,
                    y: 25,
                    duration: 0.7,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });
            }

            const faqItems = faqSec.querySelectorAll('.faq-item');
            if (faqItems && faqItems.length > 0) {
                gsap.from(faqItems, {
                    scrollTrigger: {
                        trigger: faqSec.querySelector('.faq-accordion') || faqSec,
                        start: 'top 85%',
                        once: true
                    },
                    opacity: 0,
                    y: 22,
                    stagger: 0.08,
                    duration: 0.65,
                    ease: 'power3.out',
                    clearProps: 'opacity,transform'
                });
            }
        }

        // ----------------------------------------------------
        // 11. Newsletter & Footer Entrance
        // ----------------------------------------------------
        function initNewsletterAndFooter() {
            const newsletter = document.getElementById('newsletter');
            if (newsletter && typeof ScrollTrigger !== 'undefined') {
                gsap.from(newsletter, {
                    scrollTrigger: {
                        trigger: newsletter,
                        start: 'top 85%'
                    },
                    opacity: 0,
                    y: 35,
                    duration: 0.7,
                    ease: 'power2.out'
                });
            }

            const footer = document.querySelector('.footer');
            if (footer && typeof ScrollTrigger !== 'undefined') {
                const cols = footer.querySelectorAll('.footer-col');
                if (cols.length > 0) {
                    gsap.from(cols, {
                        scrollTrigger: {
                            trigger: footer,
                            start: 'top 90%'
                        },
                        opacity: 0,
                        y: 30,
                        stagger: 0.08,
                        duration: 0.65,
                        ease: 'power2.out'
                    });
                }
            }
        }

        // ----------------------------------------------------
        // 12. Button Micro-Interactions (Restrained Press Feedback)
        // ----------------------------------------------------
        function initButtonInteractions() {
            const interactiveButtons = document.querySelectorAll('.btn, .icon-btn, .filter-btn');
            interactiveButtons.forEach(btn => {
                btn.addEventListener('mousedown', () => {
                    gsap.to(btn, { scale: 0.96, duration: 0.12, ease: 'power1.out' });
                });
                btn.addEventListener('mouseup', () => {
                    gsap.to(btn, { scale: 1, duration: 0.18, ease: 'power2.out' });
                });
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, { scale: 1, duration: 0.18, ease: 'power2.out' });
                });
            });
        }

        // ----------------------------------------------------
        // 13. Tailored Premium Section Headings GSAP Animations
        // Distinctive, modern scroll-triggered reveals for each section:
        // - Freshly Dropped: Word-by-word reveal with subtle scale
        // - Categories: Smooth fade-up with silky vertical lift
        // - Featured Technology: Subtle high-tech clip-path reveal
        // - Workspace Showcase: Line-by-line / two-part cadence reveal
        // - Handpicked for You: Word-by-word smooth rise
        // - Promo Banner: Line-by-line punchy reveal
        // - Testimonials: Staggered cadence reveal + Trust badge coordination
        // - Buying Guides: Word-by-word unfold + explore link slide
        // - Newsletter: Coordinated 3-part micro-timeline
        // ----------------------------------------------------
        function initSectionHeadingsAnimation() {
            if (typeof ScrollTrigger === 'undefined') return;

            // 1. Freshly Dropped: Word-by-Word Reveal with subtle scale
            const dropSec = document.getElementById('freshly-dropped');
            if (dropSec) {
                const head = dropSec.querySelector('.section-heading');
                if (head) {
                    const tagline = head.querySelector('.tagline');
                    const title = head.querySelector('h2');
                    const subtitle = head.querySelector('.subtitle');
                    const words = title ? splitTextIntoWords(title) : [];

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: head,
                            start: 'top 86%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (words.length > 0) {
                        tl.from(words, {
                            opacity: 0,
                            y: 26,
                            scale: 0.92,
                            stagger: 0.12,
                            duration: 0.75,
                            ease: 'power3.out',
                            clearProps: 'opacity,transform'
                        }, '-=0.25');
                    } else if (title) {
                        tl.from(title, { opacity: 0, y: 26, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.25');
                    }
                    if (subtitle) {
                        tl.from(subtitle, { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.35');
                    }
                }
            }

            // 2. Shop by Category: Smooth Fade-Up with silky vertical lift
            const catSec = document.getElementById('categories');
            if (catSec) {
                const head = catSec.querySelector('.section-heading');
                if (head) {
                    const tagline = head.querySelector('.tagline');
                    const title = head.querySelector('h2');
                    const subtitle = head.querySelector('.subtitle');

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: head,
                            start: 'top 86%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (title) {
                        tl.from(title, { opacity: 0, y: 28, duration: 0.8, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.25');
                    }
                    if (subtitle) {
                        tl.from(subtitle, { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.35');
                    }
                }
            }

            // 3. Featured Technology (Showcase): Subtle High-Tech Clip-Path Text Reveal
            const showSec = document.getElementById('showcase');
            if (showSec) {
                const head = showSec.querySelector('.section-heading');
                if (head) {
                    const tagline = head.querySelector('.tagline');
                    const title = head.querySelector('h2');
                    const subtitle = head.querySelector('.subtitle');

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: head,
                            start: 'top 86%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (title) {
                        tl.from(title, {
                            opacity: 0,
                            y: 28,
                            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
                            duration: 0.85,
                            ease: 'power3.out',
                            clearProps: 'opacity,transform,clipPath'
                        }, '-=0.25');
                    }
                    if (subtitle) {
                        tl.from(subtitle, { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.35');
                    }
                }
            }

            // 4. Workspace Showcase: Line-by-Line / Two-Part Cadence Reveal
            const workSec = document.getElementById('setup-feature');
            if (workSec) {
                const head = workSec.querySelector('.section-heading');
                if (head) {
                    const tagline = head.querySelector('.tagline');
                    const title = head.querySelector('h2');
                    const subtitle = head.querySelector('.subtitle');

                    let parts = [];
                    if (title && !title.dataset.gsapSplit) {
                        title.dataset.gsapSplit = "true";
                        const raw = title.textContent.trim();
                        title.setAttribute('aria-label', raw);
                        // Split into sentences / cadence segments: "A bigger view." & "A better setup."
                        const segments = raw.split(/(?<=\.)\s+/);
                        if (segments.length > 1) {
                            title.innerHTML = '';
                            segments.forEach(seg => {
                                const span = document.createElement('span');
                                span.className = 'gsap-line-wrap';
                                span.setAttribute('aria-hidden', 'true');
                                span.textContent = seg + ' ';
                                title.appendChild(span);
                                parts.push(span);
                            });
                        }
                    }

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: head,
                            start: 'top 86%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (parts.length > 0) {
                        tl.from(parts, {
                            opacity: 0,
                            y: 24,
                            stagger: 0.18,
                            duration: 0.75,
                            ease: 'power3.out',
                            clearProps: 'opacity,transform'
                        }, '-=0.25');
                    } else if (title) {
                        tl.from(title, { opacity: 0, y: 26, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.25');
                    }
                    if (subtitle) {
                        tl.from(subtitle, { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.35');
                    }
                }
            }

            // 5. Handpicked for You: Word-by-Word Smooth Rise
            const handSec = document.getElementById('handpicked');
            if (handSec) {
                const head = handSec.querySelector('.section-heading');
                if (head) {
                    const tagline = head.querySelector('.tagline');
                    const title = head.querySelector('h2');
                    const subtitle = head.querySelector('.subtitle');
                    const words = title ? splitTextIntoWords(title) : [];

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: head,
                            start: 'top 86%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (words.length > 0) {
                        tl.from(words, {
                            opacity: 0,
                            y: 25,
                            stagger: 0.08,
                            duration: 0.75,
                            ease: 'power3.out',
                            clearProps: 'opacity,transform'
                        }, '-=0.25');
                    } else if (title) {
                        tl.from(title, { opacity: 0, y: 26, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.25');
                    }
                    if (subtitle) {
                        tl.from(subtitle, { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.35');
                    }
                }
            }

            // 6. Promo Banner: Line-by-Line Punchy Reveal
            const promoSec = document.getElementById('promo-banner');
            if (promoSec) {
                const content = promoSec.querySelector('.promo-content');
                if (content) {
                    const tagline = content.querySelector('.tagline');
                    const title = content.querySelector('h2');
                    const desc = content.querySelector('.promo-desc');

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: promoSec,
                            start: 'top 84%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power2.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.45, clearProps: 'opacity,transform' });
                    }
                    if (title) {
                        tl.from(title, {
                            opacity: 0,
                            y: 24,
                            scale: 0.96,
                            duration: 0.7,
                            ease: 'power3.out',
                            clearProps: 'opacity,transform'
                        }, '-=0.2');
                    }
                    if (desc) {
                        tl.from(desc, { opacity: 0, y: 16, duration: 0.55, clearProps: 'opacity,transform' }, '-=0.3');
                    }
                }
            }

            // 7. Testimonials (Customer Reviews): Staggered Cadence Reveal + Trust Badge
            const testSec = document.getElementById('testimonials');
            if (testSec) {
                const headerText = testSec.querySelector('.reviews-header-text');
                const trustBadge = testSec.querySelector('.community-trust-badge');
                if (headerText) {
                    const tagline = headerText.querySelector('.tagline');
                    const title = headerText.querySelector('h2');
                    const subtitle = headerText.querySelector('.subtitle');

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: testSec,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (title) {
                        tl.from(title, { opacity: 0, y: 26, duration: 0.75, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.25');
                    }
                    if (subtitle) {
                        tl.from(subtitle, { opacity: 0, y: 16, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.35');
                    }
                    if (trustBadge) {
                        tl.from(trustBadge, {
                            opacity: 0,
                            x: 20,
                            scale: 0.96,
                            duration: 0.65,
                            ease: 'power2.out',
                            clearProps: 'opacity,transform'
                        }, '-=0.45');
                    }
                }
            }

            // 8. Buying Guides / Articles: Word-by-Word Reveal + Explore Link Slide
            const artSec = document.getElementById('articles');
            if (artSec) {
                const headerRow = artSec.querySelector('.section-header-row');
                if (headerRow) {
                    const tagline = headerRow.querySelector('.tagline');
                    const title = headerRow.querySelector('h2');
                    const link = headerRow.querySelector('.link-explore');
                    const words = title ? splitTextIntoWords(title) : [];

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: headerRow,
                            start: 'top 86%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -12, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (words.length > 0) {
                        tl.from(words, {
                            opacity: 0,
                            y: 24,
                            stagger: 0.09,
                            duration: 0.75,
                            ease: 'power3.out',
                            clearProps: 'opacity,transform'
                        }, '-=0.25');
                    } else if (title) {
                        tl.from(title, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.25');
                    }
                    if (link) {
                        tl.from(link, {
                            opacity: 0,
                            x: 20,
                            duration: 0.6,
                            ease: 'power2.out',
                            clearProps: 'opacity,transform'
                        }, '-=0.4');
                    }
                }
            }

            // 9. Newsletter: Coordinated 3-Part Micro-Timeline
            const newsSec = document.getElementById('newsletter');
            if (newsSec) {
                const content = newsSec.querySelector('.newsletter-content');
                if (content) {
                    const tagline = content.querySelector('.tagline');
                    const title = content.querySelector('h2');
                    const desc = content.querySelector('p:not(.tagline)');

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: newsSec,
                            start: 'top 86%',
                            toggleActions: 'play none none none'
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.from(tagline, { opacity: 0, y: -10, duration: 0.45, clearProps: 'opacity,transform' });
                    }
                    if (title) {
                        tl.from(title, { opacity: 0, y: 22, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.2');
                    }
                    if (desc) {
                        tl.from(desc, { opacity: 0, y: 14, duration: 0.55, ease: 'power3.out', clearProps: 'opacity,transform' }, '-=0.3');
                    }
                }
            }
        }

        // Initialize all modules
        initHeaderAnimation();
        initHeroEntrance();
        initSectionHeadingsAnimation();
        initCategoryAnimations();
        initShowcaseAnimation();
        initWorkspaceAnimation();
        initFreshlyDroppedAnimation();
        initHandpickedAnimation();
        initPromoBannerAnimation();
        initTestimonialsAnimation();
        initArticlesAnimation();
        initFaqAnimation();
        initNewsletterAndFooter();
        initButtonInteractions();
    }
})();
