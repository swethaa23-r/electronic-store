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
                    duration: 0.55,
                    clearProps: 'transform,opacity'
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
                    duration: 0.45,
                    clearProps: 'transform,opacity'
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
        // Reusable Theatrical Spotlight Reveal Animation
        // Expands an optical circular spotlight beam with luminous focus and scale settling.
        // ----------------------------------------------------
        function applySpotlightReveal(tl, target, position = '-=0.2', duration = 0.95, stagger = 0.18) {
            if (!target) return;
            return tl.fromTo(target,
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
                    duration: duration,
                    stagger: stagger,
                    ease: 'power3.out',
                    clearProps: 'clipPath,filter,transform,opacity'
                },
                position
            );
        }

        // ----------------------------------------------------
        // 2. Hero Section Entrance Animation (Theatrical Spotlight Reveal)
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

            // Check for spotlight reveal / text masking wrappers or words
            const maskChildren = heroH1 ? heroH1.querySelectorAll('.spotlight-reveal-text, .text-mask-child') : [];
            let words = [];
            if (maskChildren.length === 0 && heroH1) {
                words = splitTextIntoWords(heroH1);
            }

            // Timeline for coordinated cinematic entrance with Spotlight Reveal
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.22 });

            if (ambientPrimary || ambientSecondary) {
                heroTl.fromTo([ambientPrimary, ambientSecondary].filter(Boolean),
                    { opacity: 0, scale: 0.82 },
                    { opacity: 0.85, scale: 1, duration: 1.2, ease: 'power2.out', clearProps: 'opacity,scale' },
                    0
                );
            }

            if (eyebrow) {
                heroTl.from(eyebrow, {
                    opacity: 0,
                    y: -15,
                    duration: 0.5,
                    clearProps: 'opacity,transform'
                });
            }

            if (maskChildren.length > 0) {
                // Theatrical Spotlight Reveal: expanding circular spotlight beam with optical illumination
                applySpotlightReveal(heroTl, maskChildren, '-=0.25', 1.05, 0.22);
            } else if (words && words.length > 0) {
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
        // ----------------------------------------------------
        // 3. Categories Grid: Fixed Box, Staggered Clipping Reveal & Delayed Titles
        // ----------------------------------------------------
        function initCategoryAnimations() {
            const catSection = document.getElementById('categories');
            if (!catSection || typeof ScrollTrigger === 'undefined') return;

            const heading = catSection.querySelector('.section-heading');
            const grid = catSection.querySelector('.grid-4');
            const items = catSection.querySelectorAll('.category-item');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: catSection,
                    start: 'top 84%',
                    once: true
                },
                defaults: { ease: 'power3.out' }
            });

            // 1. Heading masked text reveal
            if (heading) {
                const tagline = heading.querySelector('.tagline');
                const maskChild = heading.querySelector('.text-mask-child');
                const subtitle = heading.querySelector('.subtitle');

                if (tagline) {
                    tl.fromTo(tagline,
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' }
                    );
                }
                if (maskChild) {
                    applySpotlightReveal(tl, maskChild, tagline ? '-=0.25' : 0, 0.85);
                }
                if (subtitle) {
                    tl.fromTo(subtitle,
                        { opacity: 0, y: 12 },
                        { opacity: 1, y: 0, duration: 0.55, clearProps: 'opacity,transform' },
                        '-=0.35'
                    );
                }
            }

            // 2. Staggered clipping image reveals & delayed titles
            if (items && items.length > 0) {
                items.forEach((item, index) => {
                    const img = item.querySelector('.cat-img-box img');
                    const titleRow = item.querySelector('.cat-header-row');
                    const desc = item.querySelector('.cat-info p');
                    const link = item.querySelector('.explore-link');
                    const startTime = (heading ? 0.35 : 0) + (index * 0.08);

                    // Restrained card entrance
                    tl.fromTo(item, 
                        { opacity: 0, y: 16 },
                        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'opacity,transform' },
                        startTime
                    );

                    // Reveal category images with staggered clipping and scale-and-fade
                    if (img) {
                        tl.fromTo(img,
                            { clipPath: 'inset(0 0 100% 0)', scale: 1.08, opacity: 0.25 },
                            {
                                clipPath: 'inset(0 0 0% 0)',
                                scale: 1,
                                opacity: 1,
                                duration: 0.75,
                                ease: 'power3.out',
                                clearProps: 'clipPath,transform,opacity'
                            },
                            startTime + 0.04
                        );
                    }

                    // Reveal category titles with a small delay after their images
                    if (titleRow) {
                        tl.fromTo(titleRow,
                            { opacity: 0, y: 10 },
                            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' },
                            startTime + 0.22 // Deliberate delay after image clipping begins
                        );
                    }

                    if (desc || link) {
                        const subElements = [desc, link].filter(Boolean);
                        tl.fromTo(subElements,
                            { opacity: 0, y: 8 },
                            { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out', clearProps: 'opacity,transform' },
                            startTime + 0.28
                        );
                    }
                });
            }

            // Natural desktop hover with subtle image zoom without layout shift
            const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (isDesktop) {
                items.forEach(item => {
                    const img = item.querySelector('.cat-img-box img');
                    const linkIcon = item.querySelector('.explore-link i');

                    item.addEventListener('mouseenter', () => {
                        gsap.to(item, { y: -4, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
                        if (img) gsap.to(img, { scale: 1.06, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                        if (linkIcon) gsap.to(linkIcon, { x: 4, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
                    });
                    item.addEventListener('mouseleave', () => {
                        gsap.to(item, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(item, { clearProps: 'transform' }) });
                        if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(img, { clearProps: 'transform' }) });
                        if (linkIcon) gsap.to(linkIcon, { x: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(linkIcon, { clearProps: 'transform' }) });
                    });
                });
            }
        }

        // ----------------------------------------------------
        // 4. Featured Technology Showcase: Left/Right Lateral Enters & Subtle Image Zoom
        // ----------------------------------------------------
        // ----------------------------------------------------
        // 4. Featured Technology Showcase: Coordinated Opposite Direction Reveals & Masked Heading
        // ----------------------------------------------------
        function initShowcaseAnimation() {
            const showcase = document.getElementById('showcase');
            if (!showcase || typeof ScrollTrigger === 'undefined') return;

            const heading = showcase.querySelector('.section-heading');
            const leftCard = showcase.querySelector('.sc-left');
            const centerCard = showcase.querySelector('.sc-center-card');
            const rightCard = showcase.querySelector('.sc-right');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: showcase,
                    start: 'top 82%',
                    once: true
                },
                defaults: { ease: 'power3.out' }
            });

            // 1. Masked heading text reveal and restrained paragraph opacity
            if (heading) {
                const tagline = heading.querySelector('.tagline');
                const maskChild = heading.querySelector('.text-mask-child');
                const subtitle = heading.querySelector('.subtitle');

                if (tagline) {
                    tl.fromTo(tagline,
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' }
                    );
                }
                if (maskChild) {
                    applySpotlightReveal(tl, maskChild, tagline ? '-=0.25' : 0, 0.85);
                }
                if (subtitle) {
                    tl.fromTo(subtitle,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.35'
                    );
                }
            }

            // 2. Coordinated reveal of images from opposite directions
            const cardsStartTime = heading ? '-=0.15' : 0;

            // Left card slides in gently from opposite direction: LEFT (x: -45)
            if (leftCard) {
                const leftImg = leftCard.querySelector('.sc-img-wrap img');
                const leftNum = leftCard.querySelector('.sc-num');
                const leftTitle = leftCard.querySelector('h4');
                const leftText = leftCard.querySelector('p');

                tl.fromTo(leftCard,
                    { opacity: 0, x: -45, scale: 0.96 },
                    { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
                    cardsStartTime
                );
                if (leftImg) {
                    tl.fromTo(leftImg,
                        { opacity: 0.35, scale: 0.93 },
                        { opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out', clearProps: 'transform,opacity' },
                        '<+=0.08'
                    );
                }
                if (leftNum || leftTitle || leftText) {
                    tl.fromTo([leftNum, leftTitle, leftText].filter(Boolean),
                        { opacity: 0, y: 8 },
                        { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' },
                        '<+=0.12'
                    );
                }
            }

            // Center centerpiece card lifts smoothly with restrained vertical scale
            if (centerCard) {
                const centerImg = centerCard.querySelector('.sc-main-img');
                const tag = centerCard.querySelector('.sc-floating-tag');
                const centerNum = centerCard.querySelector('.sc-num');
                const centerTitle = centerCard.querySelector('h4');
                const centerText = centerCard.querySelector('p');
                const btn = centerCard.querySelector('.btn');

                tl.fromTo(centerCard,
                    { opacity: 0, y: 25, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out', clearProps: 'transform' },
                    cardsStartTime
                );
                if (centerImg) {
                    tl.fromTo(centerImg,
                        { opacity: 0.4, scale: 0.93 },
                        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' },
                        '<+=0.1'
                    );
                }
                if (tag) {
                    tl.fromTo(tag,
                        { opacity: 0, scale: 0.9, y: 8 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)', clearProps: 'transform,opacity' },
                        '<+=0.2'
                    );
                }
                if (centerNum || centerTitle || centerText || btn) {
                    tl.fromTo([centerNum, centerTitle, centerText, btn].filter(Boolean),
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity' },
                        '<+=0.15'
                    );
                }
            }

            // Right card slides in from opposite direction: RIGHT (x: 45)
            if (rightCard) {
                const rightImgs = rightCard.querySelectorAll('.sc-img-wrap img');
                const rightNum = rightCard.querySelector('.sc-num');
                const rightTitle = rightCard.querySelector('h4');
                const rightText = rightCard.querySelector('p');

                tl.fromTo(rightCard,
                    { opacity: 0, x: 45, scale: 0.96 },
                    { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
                    cardsStartTime
                );
                if (rightImgs.length > 0) {
                    tl.fromTo(rightImgs,
                        { opacity: 0.35, scale: 0.93 },
                        { opacity: 1, scale: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity' },
                        '<+=0.08'
                    );
                }
                if (rightNum || rightTitle || rightText) {
                    tl.fromTo([rightNum, rightTitle, rightText].filter(Boolean),
                        { opacity: 0, y: 8 },
                        { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' },
                        '<+=0.12'
                    );
                }
            }

            // 3. Subtle scroll-linked image movement (scrub parallax on center display)
            if (centerCard) {
                const centerImg = centerCard.querySelector('.sc-main-img');
                if (centerImg) {
                    gsap.to(centerImg, {
                        y: -18,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: centerCard,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.2
                        }
                    });
                }
            }

            // Desktop hover image zoom without container overflow
            const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (isDesktop) {
                showcase.querySelectorAll('.sc-side-card').forEach(card => {
                    const imgs = card.querySelectorAll('.sc-img-wrap img');
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
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
                        gsap.to(centerCard, { y: -4, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
                        if (centerImg) gsap.to(centerImg, { scale: 1.04, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
                    });
                    centerCard.addEventListener('mouseleave', () => {
                        gsap.to(centerCard, { y: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(centerCard, { clearProps: 'transform' }) });
                        if (centerImg) gsap.to(centerImg, { scale: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto', onComplete: () => gsap.set(centerImg, { clearProps: 'transform' }) });
                    });
                }
            }
        }

        // ----------------------------------------------------
        // 5. Workspace Showcase: Coordinated Opposite Direction Reveals & Masked Heading
        // ----------------------------------------------------
        function initWorkspaceAnimation() {
            const setup = document.getElementById('setup-feature');
            if (!setup || typeof ScrollTrigger === 'undefined') return;

            const heading = setup.querySelector('.section-heading');
            const imageFrame = setup.querySelector('.setup-image-frame');
            const pointCards = setup.querySelectorAll('.setup-point-card');
            const actionBtn = setup.querySelector('.setup-action');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: setup,
                    start: 'top 82%',
                    once: true
                },
                defaults: { ease: 'power3.out' }
            });

            // 1. Masked heading text reveal and restrained paragraph opacity
            if (heading) {
                const tagline = heading.querySelector('.tagline');
                const maskChild = heading.querySelector('.text-mask-child');
                const subtitle = heading.querySelector('.subtitle');

                if (tagline) {
                    tl.fromTo(tagline,
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' }
                    );
                }
                if (maskChild) {
                    applySpotlightReveal(tl, maskChild, tagline ? '-=0.25' : 0, 0.85);
                }
                if (subtitle) {
                    tl.fromTo(subtitle,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.35'
                    );
                }
            }

            // 2. Coordinated reveal of images from opposite directions (Left: image frame; Right: points)
            const contentStartTime = heading ? '-=0.15' : 0;

            if (imageFrame) {
                tl.fromTo(imageFrame, 
                    { opacity: 0, x: -45, scale: 0.96 },
                    {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.85,
                        ease: 'power3.out',
                        clearProps: 'transform'
                    },
                    contentStartTime
                );
            }

            if (pointCards && pointCards.length > 0) {
                tl.fromTo(pointCards, 
                    { opacity: 0, x: 40 },
                    {
                        opacity: 1,
                        x: 0,
                        stagger: 0.1,
                        duration: 0.7,
                        ease: 'power3.out',
                        clearProps: 'transform'
                    },
                    contentStartTime
                );
            }

            if (actionBtn) {
                tl.fromTo(actionBtn,
                    { opacity: 0, y: 12 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: 'power2.out',
                        clearProps: 'transform,opacity'
                    },
                    '-=0.25'
                );
            }

            // 3. Subtle scroll-linked image movement (scrub parallax)
            const seqStack = setup.querySelector('.sequence-frames-stack') || imageFrame;
            if (seqStack) {
                gsap.to(seqStack, {
                    y: -16,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: setup,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2
                    }
                });
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
                        y: -4,
                        boxShadow: '0 16px 32px -8px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.04)',
                        borderColor: '#CBD5E1',
                        duration: 0.35,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                    if (img) {
                        gsap.to(img, {
                            scale: 1.05,
                            duration: 0.4,
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
                        duration: 0.3,
                        ease: 'power2.out',
                        overwrite: 'auto',
                        onComplete: () => {
                            gsap.set(card, { clearProps: 'transform,boxShadow,borderColor' });
                        }
                    });
                    if (img) {
                        gsap.to(img, {
                            scale: 1,
                            duration: 0.35,
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

            // Sophisticated text reveal on section heading
            if (typeof ScrollTrigger !== 'undefined' && sectionHeading) {
                const headTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionHeading,
                        start: 'top 86%',
                        once: true
                    },
                    defaults: { ease: 'power3.out' }
                });

                const tagline = sectionHeading.querySelector('.tagline');
                const maskChild = sectionHeading.querySelector('.text-mask-child');
                const subtitle = sectionHeading.querySelector('.subtitle');

                if (tagline) {
                    headTl.fromTo(tagline,
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' }
                    );
                }
                if (maskChild) {
                    applySpotlightReveal(headTl, maskChild, tagline ? '-=0.25' : 0, 0.85);
                }
                if (subtitle) {
                    headTl.fromTo(subtitle,
                        { opacity: 0, y: 12 },
                        { opacity: 1, y: 0, duration: 0.55, clearProps: 'opacity,transform' },
                        '-=0.35'
                    );
                }
                if (filterBar) {
                    headTl.fromTo(filterBar,
                        { opacity: 0, y: 12 },
                        { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' },
                        '-=0.3'
                    );
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

                    // Coordinated stagger sequence (90ms between cards, 80-150ms guideline)
                    const cardStartTime = index * 0.09;

                    // 1. Restrained product card reveal (no excessive movement: 14px subtle upward slide)
                    tl.fromTo(card,
                        { opacity: 0, y: 14 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: 'power2.out',
                            onComplete: () => {
                                gsap.set(card, { clearProps: 'transform' });
                            }
                        },
                        cardStartTime
                    );

                    // 2. Reveal product images using a refined clip-path with scale-and-fade
                    if (img) {
                        tl.fromTo(img,
                            { clipPath: 'inset(14% 0 0 0)', scale: 1.08, opacity: 0.25 },
                            {
                                clipPath: 'inset(0% 0 0 0)',
                                scale: 1,
                                opacity: 1,
                                duration: 0.8,
                                ease: 'power3.out',
                                onComplete: () => {
                                    gsap.set(img, { clearProps: 'clipPath,transform,opacity' });
                                }
                            },
                            cardStartTime + 0.05
                        );
                    }

                    // 3. Text, price and action button animation
                    const textElements = [badge, actions, category, title, rating, price, addCartBtn].filter(Boolean);
                    if (textElements.length > 0) {
                        tl.fromTo(textElements,
                            { opacity: 0, y: 8 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.45,
                                stagger: 0.03,
                                ease: 'power2.out',
                                onComplete: () => {
                                    textElements.forEach(el => gsap.set(el, { clearProps: 'transform,opacity' }));
                                }
                            },
                            cardStartTime + 0.12
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
        // 7. Handpicked for You: Coordinated Alternating Reveals & Masked Heading
        // ----------------------------------------------------
        function initHandpickedAnimation() {
            const handpicked = document.getElementById('handpicked');
            if (!handpicked || typeof ScrollTrigger === 'undefined') return;

            const heading = handpicked.querySelector('.section-heading');
            const largeCards = handpicked.querySelectorAll('.large-card');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: handpicked,
                    start: 'top 82%',
                    once: true
                },
                defaults: { ease: 'power3.out' }
            });

            // 1. Masked heading text reveal and restrained paragraph opacity
            if (heading) {
                const tagline = heading.querySelector('.tagline');
                const maskChild = heading.querySelector('.text-mask-child');
                const subtitle = heading.querySelector('.subtitle');

                if (tagline) {
                    tl.fromTo(tagline,
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' }
                    );
                }
                if (maskChild) {
                    applySpotlightReveal(tl, maskChild, tagline ? '-=0.25' : 0, 0.85);
                }
                if (subtitle) {
                    tl.fromTo(subtitle,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.35'
                    );
                }
            }

            // 2. Coordinated reveal of alternating cards from opposite directions
            const cardsStartTime = heading ? '-=0.15' : 0;

            if (largeCards && largeCards.length >= 2) {
                // Card 1 on left slides gently from LEFT (x: -35)
                const card1Img = largeCards[0].querySelector('.large-card-img img');
                tl.fromTo(largeCards[0],
                    { opacity: 0, x: -35 },
                    { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
                    cardsStartTime
                );
                if (card1Img) {
                    tl.fromTo(card1Img,
                        { opacity: 0.35, scale: 0.94 },
                        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' },
                        '<+=0.1'
                    );
                }

                // Card 2 on right slides from opposite direction: RIGHT (x: 35)
                const card2Img = largeCards[1].querySelector('.large-card-img img');
                tl.fromTo(largeCards[1],
                    { opacity: 0, x: 35 },
                    { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
                    cardsStartTime + 0.12
                );
                if (card2Img) {
                    tl.fromTo(card2Img,
                        { opacity: 0.35, scale: 0.94 },
                        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' },
                        '<+=0.1'
                    );
                }
            } else if (largeCards && largeCards.length > 0) {
                tl.fromTo(largeCards,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, stagger: 0.12, duration: 0.75, ease: 'power3.out', clearProps: 'transform,opacity' },
                    cardsStartTime
                );
            }

            // Hover interactions on large cards (with subtle image zoom)
            largeCards.forEach(card => {
                const img = card.querySelector('.large-card-img img');
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { y: -4, duration: 0.28, ease: 'power2.out' });
                    if (img) gsap.to(img, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { y: 0, duration: 0.28, ease: 'power2.out' });
                    if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
                });
            });
        }

        // ----------------------------------------------------
        // 8. Promo Banner Section: Coordinated 4-Step Reveal Sequence
        // ----------------------------------------------------
        function initPromoBannerAnimation() {
            const promo = document.getElementById('promo-banner');
            if (!promo || typeof ScrollTrigger === 'undefined') return;

            const content = promo.querySelector('.promo-content');
            const tagline = content ? content.querySelector('.tagline') : null;
            const headingMasks = content ? content.querySelectorAll('.text-mask-child') : null;
            const desc = content ? content.querySelector('.promo-desc') : null;
            const countdown = document.getElementById('promo-countdown');
            const priceWrap = content ? content.querySelector('.price-wrap') : null;
            const promoButtons = content ? content.querySelector('.promo-buttons') : null;
            const imgWrap = promo.querySelector('.promo-image-wrap');
            const img = imgWrap ? imgWrap.querySelector('img') : null;

            const promoTl = gsap.timeline({
                scrollTrigger: {
                    trigger: promo,
                    start: 'top 82%',
                    once: true
                },
                defaults: { ease: 'power3.out' }
            });

            // Step 1: Heading reveals first
            if (tagline) {
                promoTl.fromTo(tagline,
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.45, clearProps: 'opacity,transform' }
                );
            }
            if (headingMasks && headingMasks.length > 0) {
                applySpotlightReveal(promoTl, headingMasks, tagline ? '-=0.2' : 0, 0.85, 0.16);
            }

            // Step 2: Supporting content follows
            const supporting = [desc, countdown, priceWrap].filter(Boolean);
            if (supporting.length > 0) {
                promoTl.fromTo(supporting,
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', clearProps: 'opacity,transform' },
                    '-=0.2'
                );
            }

            // Step 3: CTA appears after the text
            if (promoButtons) {
                promoTl.fromTo(promoButtons,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' },
                    '-=0.15'
                );
            }

            // Step 4: Promotional image reveals using a controlled clipping effect
            if (img) {
                promoTl.fromTo(img,
                    { clipPath: 'inset(0 100% 0 0)', scale: 1.08, opacity: 0.25 },
                    {
                        clipPath: 'inset(0 0% 0 0)',
                        scale: 1,
                        opacity: 1,
                        duration: 0.85,
                        ease: 'power3.out',
                        clearProps: 'clipPath,transform,opacity'
                    },
                    '-=0.55'
                );
            }
        }

        // ----------------------------------------------------
        // 9. Customer Reviews & Testimonials: Coordinated Stagger & Preserved Carousel
        // ----------------------------------------------------
        function initTestimonialsAnimation() {
            const testSec = document.getElementById('testimonials');
            if (!testSec || typeof ScrollTrigger === 'undefined') return;

            const headerText = testSec.querySelector('.reviews-header-text');
            const trustBadge = testSec.querySelector('.community-trust-badge');
            const featuredCard = testSec.querySelector('.featured-review-card');
            const carouselPanel = testSec.querySelector('.reviews-carousel-panel');

            const testTl = gsap.timeline({
                scrollTrigger: {
                    trigger: testSec,
                    start: 'top 82%',
                    once: true
                },
                defaults: { ease: 'power3.out' }
            });

            // 1. Heading and trust badge reveal
            if (headerText) {
                const tagline = headerText.querySelector('.tagline');
                const maskChild = headerText.querySelector('.text-mask-child');
                const subtitle = headerText.querySelector('.subtitle');

                if (tagline) {
                    testTl.fromTo(tagline,
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 0.45, clearProps: 'opacity,transform' }
                    );
                }
                if (maskChild) {
                    applySpotlightReveal(testTl, maskChild, tagline ? '-=0.2' : 0, 0.85);
                }
                if (subtitle) {
                    testTl.fromTo(subtitle,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.35'
                    );
                }
            }

            if (trustBadge) {
                testTl.fromTo(trustBadge,
                    { opacity: 0, x: 20, scale: 0.96 },
                    { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: 'power2.out', clearProps: 'opacity,transform' },
                    '-=0.45'
                );
            }

            // 2. Reveal testimonial cards using a coordinated stagger
            const cards = [featuredCard, carouselPanel].filter(Boolean);
            if (cards.length > 0) {
                testTl.fromTo(cards,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.75, stagger: 0.14, ease: 'power3.out', clearProps: 'opacity,transform' },
                    '-=0.2'
                );
            }

            // Subtle inner elements reveal inside featured review card
            if (featuredCard) {
                const innerElements = featuredCard.querySelectorAll('.featured-quote, .review-product-chip, .featured-author');
                if (innerElements.length > 0) {
                    testTl.fromTo(innerElements,
                        { opacity: 0, y: 8 },
                        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.4'
                    );
                }
            }

            // Animate customer avatars & author badges
            const avatars = testSec.querySelectorAll('.avatar-ring, .avatar-ring-sm');
            if (avatars.length > 0) {
                testTl.fromTo(avatars,
                    { scale: 0.86, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'back.out(1.2)', clearProps: 'transform,opacity' },
                    '-=0.3'
                );
            }

            // Staggered entrance for initial visible carousel review cards
            const carouselReviewInners = testSec.querySelectorAll('.reviews-viewport .review-card-inner');
            if (carouselReviewInners.length > 0) {
                testTl.fromTo(Array.from(carouselReviewInners).slice(0, 3),
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out', clearProps: 'opacity,transform' },
                    '-=0.35'
                );
            }
        }

        // ----------------------------------------------------
        // 10. Buying Guides Articles: Image Masking, Sequential Content & Refined Transitions
        // ----------------------------------------------------
        function initArticlesAnimation() {
            const artSec = document.getElementById('articles');
            if (!artSec || typeof ScrollTrigger === 'undefined') return;

            const headerRow = artSec.querySelector('.section-header-row');
            const cards = artSec.querySelectorAll('.article-card');

            const artTl = gsap.timeline({
                scrollTrigger: {
                    trigger: artSec,
                    start: 'top 83%',
                    once: true
                },
                defaults: { ease: 'power3.out' }
            });

            // 1. Heading and explore link reveal
            if (headerRow) {
                const tagline = headerRow.querySelector('.tagline');
                const maskChild = headerRow.querySelector('.text-mask-child');
                const link = headerRow.querySelector('.link-explore');

                if (tagline) {
                    artTl.fromTo(tagline,
                        { opacity: 0, y: -10 },
                        { opacity: 1, y: 0, duration: 0.45, clearProps: 'opacity,transform' }
                    );
                }
                if (maskChild) {
                    applySpotlightReveal(artTl, maskChild, tagline ? '-=0.2' : 0, 0.85);
                }
                if (link) {
                    artTl.fromTo(link,
                        { opacity: 0, x: 20 },
                        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.4'
                    );
                }
            }

            // 2. Article cards: smooth image-mask reveal and sequential text
            if (cards && cards.length > 0) {
                cards.forEach((card, idx) => {
                    const cardStartTime = (headerRow ? 0.35 : 0) + (idx * 0.14);
                    const img = card.querySelector('.article-img-wrap img');
                    const pill = card.querySelector('.read-pill');
                    const catTag = card.querySelector('.article-body .tagline');
                    const title = card.querySelector('.article-title');
                    const desc = card.querySelector('.desc');
                    const btn = card.querySelector('.read-btn');

                    // Card entrance
                    artTl.fromTo(card,
                        { opacity: 0, y: 18 },
                        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform,opacity' },
                        cardStartTime
                    );

                    // Reveal article images using a smooth image-mask effect (clipPath)
                    if (img) {
                        artTl.fromTo(img,
                            { clipPath: 'inset(0 100% 0 0)', scale: 1.08, opacity: 0.3 },
                            {
                                clipPath: 'inset(0 0% 0 0)',
                                scale: 1,
                                opacity: 1,
                                duration: 0.85,
                                ease: 'power3.out',
                                clearProps: 'clipPath,transform,opacity'
                            },
                            cardStartTime + 0.06
                        );
                    }

                    // Reveal card titles and descriptions in sequence
                    const seqItems = [pill, catTag, title, desc, btn].filter(Boolean);
                    if (seqItems.length > 0) {
                        artTl.fromTo(seqItems,
                            { opacity: 0, y: 8 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.45,
                                stagger: 0.05,
                                ease: 'power2.out',
                                clearProps: 'transform,opacity'
                            },
                            cardStartTime + 0.22
                        );
                    }
                });
            }

            // Desktop hover image zoom & refined link transition
            const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            if (isDesktop) {
                cards.forEach(card => {
                    const img = card.querySelector('.article-img-wrap img');
                    const btnIcon = card.querySelector('.read-btn i');

                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -4, duration: 0.28, ease: 'power2.out' });
                        if (img) gsap.to(img, { scale: 1.05, duration: 0.4, ease: 'power2.out' });
                        if (btnIcon) gsap.to(btnIcon, { x: 4, duration: 0.25, ease: 'power2.out' });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, duration: 0.28, ease: 'power2.out' });
                        if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
                        if (btnIcon) gsap.to(btnIcon, { x: 0, duration: 0.25, ease: 'power2.out' });
                    });
                });
            }
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
        // 11. Newsletter & Footer: Masked Heading, Form Stagger & Input Focus
        // ----------------------------------------------------
        function initNewsletterAndFooter() {
            const newsletter = document.getElementById('newsletter');
            if (newsletter && typeof ScrollTrigger !== 'undefined') {
                const content = newsletter.querySelector('.newsletter-content');
                const formContainer = newsletter.querySelector('.newsletter-form-container');
                const input = document.getElementById('email-input');
                const submitBtn = document.getElementById('newsletter-submit-btn');

                const newsTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: newsletter,
                        start: 'top 85%',
                        once: true
                    },
                    defaults: { ease: 'power3.out' }
                });

                // 1. Reveal heading and supporting text
                if (content) {
                    const tagline = content.querySelector('.tagline');
                    const maskChild = content.querySelector('.text-mask-child');
                    const desc = content.querySelector('p:not(.tagline)');

                    if (tagline) {
                        newsTl.fromTo(tagline,
                            { opacity: 0, y: -10 },
                            { opacity: 1, y: 0, duration: 0.45, clearProps: 'opacity,transform' }
                        );
                    }
                    if (maskChild) {
                        applySpotlightReveal(newsTl, maskChild, tagline ? '-=0.2' : 0, 0.85);
                    }
                    if (desc) {
                        newsTl.fromTo(desc,
                            { opacity: 0, y: 10 },
                            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'opacity,transform' },
                            '-=0.35'
                        );
                    }
                }

                // 2. Bring the form into view with a subtle stagger
                if (formContainer) {
                    newsTl.fromTo(formContainer,
                        { opacity: 0, y: 16 },
                        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.25'
                    );
                }

                const formElements = [input, submitBtn].filter(Boolean);
                if (formElements.length > 0) {
                    newsTl.fromTo(formElements,
                        { opacity: 0, y: 8 },
                        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'opacity,transform' },
                        '-=0.35'
                    );
                }
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
                        y: 25,
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
        // 13. Official Partner Brands Heading Scroll Reveal
        // ----------------------------------------------------
        function initSectionHeadingsAnimation() {
            if (typeof ScrollTrigger === 'undefined') return;

            // Partner Brands: Heading reveal
            const partnerSec = document.getElementById('partner-brands');
            if (partnerSec) {
                const head = partnerSec.querySelector('.section-heading');
                if (head) {
                    const tagline = head.querySelector('.tagline');
                    const title = head.querySelector('h2');
                    const subtitle = head.querySelector('.subtitle');

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: head,
                            start: 'top 86%',
                            once: true
                        },
                        defaults: { ease: 'power3.out' }
                    });

                    if (tagline) {
                        tl.fromTo(tagline, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' });
                    }
                    if (title) {
                        tl.fromTo(title, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, clearProps: 'opacity,transform' }, '-=0.25');
                    }
                    if (subtitle) {
                        tl.fromTo(subtitle, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, clearProps: 'opacity,transform' }, '-=0.35');
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
