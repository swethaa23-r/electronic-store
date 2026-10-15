/**
 * STACKLY Electronics — Buying Guides & Lookbooks Controller (guides.js)
 * Powers:
 * 1. AOS & GSAP / ScrollTrigger Animations
 * 2. Interactive Editorial Guide Reader Modal ("Find your sound" & "Everyday essentials edit")
 * 3. Lookbook 03 ("On The Move") Quick View Description & Image Click Enhancement
 * 4. Interactive 3-Step Buying Assistant Recommender (with live StacklyCart integration)
 * 5. Side-by-Side Spec Comparison Matrix (with live StacklyCart integration)
 * 6. Buying Guide FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
    initGuidesAnimations();
    initEditorialGuideReader();
    initCarryCardsInteractivity();
    initBuyingAssistantQuiz();
    initSpecComparator();
    initGuidesFaqAccordion();
});

/* ==========================================================================
   1. AOS & GSAP / SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initGuidesAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 750,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            once: true,
            offset: 40
        });
    }

    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Header subtle entrance
    gsap.from('.site-header', {
        y: -18,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });

    // 1. Hero entrance sequence (Masked heading reveal + supporting paragraph in sequence)
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
    heroTl
        .fromTo('.guides-hero-title .spotlight-reveal-text, .guides-hero-title .text-mask-child',
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
            '-=0.15'
        )
        .fromTo('.guides-hero-sub', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, '+=0.08');

    // Interactive cursor spotlight tracking on guides hero section
    const guidesHero = document.getElementById('guides-hero');
    if (guidesHero) {
        guidesHero.addEventListener('mousemove', (e) => {
            const rect = guidesHero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            guidesHero.style.setProperty('--spot-x', `${x}%`);
            guidesHero.style.setProperty('--spot-y', `${y}%`);
        }, { passive: true });
    }

    // 2. Featured Editorial Guide Cards & Smooth Imagery Clipping Transitions
    const guideCards = gsap.utils.toArray('#featured-guides .guide-editorial-card');
    if (guideCards.length) {
        guideCards.forEach((card, idx) => {
            const img = card.querySelector('.guide-card-img-wrap img');
            const meta = card.querySelector('.guide-card-meta');

            // Staggered card entrance
            gsap.fromTo(card,
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    delay: idx * 0.14,
                    ease: 'power2.out',
                    clearProps: 'transform',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        once: true
                    }
                }
            );

            // Smooth image clipping reveal with subtle scale settling
            if (img) {
                gsap.fromTo(img,
                    { clipPath: 'inset(10% 0% 10% 0%)', scale: 1.06, opacity: 0.3 },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        scale: 1,
                        opacity: 1,
                        duration: 0.9,
                        delay: idx * 0.14,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            }

            // Reveal article content in logical groups rather than animating every paragraph
            if (meta) {
                gsap.fromTo(meta,
                    { opacity: 0, y: 14 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: (idx * 0.14) + 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            }
        });
    }

    // 3. Alternating Image-and-Text Entrances
    // Lookbook 01: The Focused Desk (Text on Left, Image on Right)
    const lookbookDesk = document.getElementById('lookbook-desk');
    if (lookbookDesk) {
        const deskText = lookbookDesk.querySelector('.guides-lookbook-text');
        const deskImg = lookbookDesk.querySelector('.guides-lookbook-media img');

        if (deskText) {
            gsap.fromTo(deskText,
                { opacity: 0, x: -36 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: lookbookDesk,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }

        if (deskImg) {
            gsap.fromTo(deskImg,
                { opacity: 0.3, x: 36, clipPath: 'inset(8% 0% 8% 0%)', scale: 1.05 },
                {
                    opacity: 1,
                    x: 0,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    scale: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: lookbookDesk,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }
    }

    // Lookbook 02: The Play Space (Image on Left, Content on Right)
    const lookbookPlay = document.getElementById('lookbook-play');
    if (lookbookPlay) {
        const playImg = lookbookPlay.querySelector('.shop-split-img-wrap img');
        const playContent = lookbookPlay.querySelector('.shop-split-content');

        if (playImg) {
            gsap.fromTo(playImg,
                { opacity: 0.3, x: -36, clipPath: 'inset(8% 0% 8% 0%)', scale: 1.05 },
                {
                    opacity: 1,
                    x: 0,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    scale: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: lookbookPlay,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }

        if (playContent) {
            gsap.fromTo(playContent,
                { opacity: 0, x: 36 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: lookbookPlay,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }
    }

    // 4. Lookbook 03: On The Move (Staggered Shelf Cards)
    const lookbookMove = document.getElementById('lookbook-move');
    if (lookbookMove) {
        const carryHeader = lookbookMove.querySelector('.guides-carry-header');
        const shelfCards = lookbookMove.querySelectorAll('.shelf-card');

        if (carryHeader) {
            gsap.fromTo(carryHeader,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: lookbookMove,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }

        if (shelfCards.length) {
            gsap.fromTo(shelfCards,
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    stagger: 0.08,
                    ease: 'power2.out',
                    clearProps: 'transform',
                    scrollTrigger: {
                        trigger: lookbookMove,
                        start: 'top 80%',
                        once: true
                    }
                }
            );
        }
    }

    // 5. Interactive Sections (Quiz, Spec Comparison & FAQ Accordion)
    const quizSection = document.getElementById('buying-assistant');
    if (quizSection) {
        gsap.fromTo(quizSection.querySelector('.guides-quiz-card'),
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power2.out',
                clearProps: 'transform',
                scrollTrigger: {
                    trigger: quizSection,
                    start: 'top 82%',
                    once: true
                }
            }
        );
    }

    // 6. Buying Guides Interactive Question Cards ("Better choices begin with better questions.")
    const betterQuestionsSec = document.getElementById('better-questions');
    if (betterQuestionsSec) {
        const questionCards = gsap.utils.toArray('#better-questions .guide-question-card');
        const questionHeading = betterQuestionsSec.querySelector('.section-heading');

        if (questionHeading) {
            const headingMask = questionHeading.querySelector('.spotlight-reveal-text, .text-mask-child');
            if (headingMask) {
                gsap.fromTo(headingMask,
                    { clipPath: 'circle(0% at 50% 50%)', opacity: 0.1, scale: 0.95, filter: 'brightness(1.5) blur(4px)' },
                    {
                        clipPath: 'circle(150% at 50% 50%)',
                        opacity: 1,
                        scale: 1,
                        filter: 'brightness(1) blur(0px)',
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: betterQuestionsSec,
                            start: 'top 85%',
                            once: true
                        },
                        clearProps: 'clipPath,filter,transform,opacity'
                    }
                );
            }
        }

        if (questionCards.length) {
            gsap.fromTo(questionCards,
                { opacity: 0, y: 32, scale: 0.96 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.14,
                    ease: 'power2.out',
                    clearProps: 'transform,opacity',
                    scrollTrigger: {
                        trigger: betterQuestionsSec,
                        start: 'top 80%',
                        once: true
                    }
                }
            );

            // Optical reveal of the card top visual images
            const cardImgs = gsap.utils.toArray('#better-questions .guide-card-media img');
            if (cardImgs.length) {
                gsap.fromTo(cardImgs,
                    { clipPath: 'inset(14% 0% 0% 0%)', scale: 1.12, opacity: 0.3 },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.14,
                        ease: 'power3.out',
                        clearProps: 'clipPath,transform,opacity',
                        scrollTrigger: {
                            trigger: betterQuestionsSec,
                            start: 'top 80%',
                            once: true
                        }
                    }
                );
            }
        }
    }
}

/* ==========================================================================
   2. EDITORIAL GUIDE READER MODAL ("Find your sound" & "Everyday essentials")
   ========================================================================== */
function initEditorialGuideReader() {
    const modal = document.getElementById('guide-reader-modal');
    const closeBtn = document.getElementById('guide-reader-close');
    const doneBtn = document.getElementById('guide-reader-done');
    const eyebrowEl = document.getElementById('guide-reader-eyebrow');
    const titleEl = document.getElementById('guide-reader-title');
    const bodyEl = document.getElementById('guide-reader-body');
    const ctaEl = document.getElementById('guide-reader-cta');

    if (!modal) return;

    const articles = {
        sound: {
            eyebrow: 'THE BUYING GUIDE \u2022 5 MIN READ',
            title: 'Find your sound. Find your headphones.',
            ctaText: 'Shop Headphones & Earbuds',
            ctaHref: 'shop.html?category=Headphones',
            html: `
                <p>Choosing between over-ear headphones and true wireless earbuds comes down to three questions: where you listen, how long you wear them, and how much of the outside world you want to let in.</p>
                <h4>1. Over-Ear ANC: For deep focus &amp; long sessions</h4>
                <p>If most of your listening happens at a desk, in a studio, or on flights, over-ear headphones like our <strong>Sonix Pro Wireless ($149)</strong> and <strong>Studio Over-Ear ANC ($199)</strong> surround your ears in plush memory foam with 40+ hours of battery life.</p>
                <h4>2. In-Ear True Wireless: For effortless movement</h4>
                <p>When you want zero bulk in your coat pocket or gym bag, <strong>Air Buds Pro ($79)</strong> combine active noise cancellation and transparency mode in a featherweight charging case—while <strong>Air Buds Lite ($49)</strong> deliver crisp everyday audio on a lighter budget.</p>
                <h4>3. Our quick rule of thumb</h4>
                <p>Pick <strong>Studio Over-Ear ANC</strong> for reference acoustic detail, <strong>Sonix Pro</strong> for all-day hybrid travel comfort, or <strong>Air Buds Pro</strong> if you're constantly on the move.</p>
            `
        },
        essentials: {
            eyebrow: 'THE LOOKBOOK \u2022 3 MIN READ',
            title: 'The everyday essentials edit.',
            ctaText: 'Explore the Full Collection',
            ctaHref: 'shop.html',
            html: `
                <p>A well-chosen everyday kit removes friction from your morning commute, your focused afternoon work block, and your evening wind-down.</p>
                <h4>1. The anchor: A featherlight 14-inch laptop</h4>
                <p>Our <strong>Book Air 14 Laptop ($799)</strong> weighs barely three pounds, runs silently without fan noise, and charges over the same USB-C cable as your headphones and phone.</p>
                <h4>2. The companions: Audio &amp; wrist utility</h4>
                <p>Pair <strong>Air Buds Pro ($79)</strong> for quiet train rides with <strong>Watch One ($139)</strong> or <strong>Watch Active ($119)</strong> to glance at timers, messages, and heart-rate zones without pulling out your phone.</p>
                <h4>3. At the desk: Single-cable expansion</h4>
                <p>When you return home, plug into the <strong>View 27 QHD Monitor ($249)</strong> and <strong>Desk Duo Keyboard &amp; Mouse ($79)</strong> to turn your portable carry into a full studio workstation in seconds.</p>
            `
        }
    };

    const openGuide = (key) => {
        const data = articles[key];
        if (!data) return;
        eyebrowEl.textContent = data.eyebrow;
        titleEl.textContent = data.title;
        bodyEl.innerHTML = data.html;
        ctaEl.href = data.ctaHref;
        const span = ctaEl.querySelector('span');
        if (span) span.textContent = data.ctaText;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Reveal modal content in logical groups
        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const cardEl = modal.querySelector('.guide-reader-card');
            if (cardEl) {
                gsap.fromTo(cardEl,
                    { opacity: 0, scale: 0.96, y: 16 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'power2.out' }
                );
            }
            gsap.fromTo([eyebrowEl, titleEl, bodyEl, ctaEl ? ctaEl.parentElement : null].filter(Boolean),
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.32, stagger: 0.06, ease: 'power2.out' }
            );
        }
    };

    const closeGuide = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('.guide-editorial-card, .guide-open-btn').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = el.getAttribute('data-guide') || el.getAttribute('data-guide-id');
            if (key) openGuide(key);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeGuide);
    if (doneBtn) doneBtn.addEventListener('click', closeGuide);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGuide();
    });
}

/* ==========================================================================
   3. LOOKBOOK 03 ("ON THE MOVE") QUICK VIEW ENHANCEMENT
   ========================================================================== */
function initCarryCardsInteractivity() {
    const qvDesc = document.getElementById('qv-desc');

    document.addEventListener('click', (e) => {
        const mediaClick = e.target.closest('#lookbook-move .shop-card-media .img-container');
        if (mediaClick) {
            const card = mediaClick.closest('.shop-product-card');
            const qvBtn = card ? card.querySelector('.quick-view-btn') : null;
            if (qvBtn) qvBtn.click();
        }

        const qvTrigger = e.target.closest('#lookbook-move .quick-view-btn');
        if (qvTrigger && qvDesc) {
            const card = qvTrigger.closest('.shop-product-card');
            const customDesc = card ? card.getAttribute('data-desc') : null;
            if (customDesc) {
                setTimeout(() => {
                    qvDesc.textContent = customDesc;
                }, 15);
            }
        }
    });
}

/* ==========================================================================
   4. INTERACTIVE 3-STEP BUYING ASSISTANT QUIZ
   ========================================================================== */
function initBuyingAssistantQuiz() {
    const optionRows = document.querySelectorAll('.quiz-option-row');
    const resultCard = document.getElementById('guides-quiz-result');
    const matchPill = document.getElementById('quiz-match-pill');
    const catTag = document.getElementById('quiz-cat-tag');
    const recImg = document.getElementById('quiz-rec-img');
    const recTitle = document.getElementById('quiz-rec-title');
    const recPrice = document.getElementById('quiz-rec-price');
    const recWas = document.getElementById('quiz-rec-was');
    const recWhy = document.getElementById('quiz-rec-why');
    const recSpecs = document.getElementById('quiz-rec-specs');
    const addCartBtn = document.getElementById('quiz-add-cart-btn');
    const viewShopLink = document.getElementById('quiz-view-shop-link');

    if (!optionRows.length || !resultCard) return;

    const state = {
        space: 'desk',
        priority: 'visuals',
        budget: 'mid'
    };

    const recommendations = {
        desk_visuals_under150: {
            id: 'desk-duo-keyboard-mouse',
            match: '97% Desk Match',
            category: 'ACCESSORIES',
            img: 'assets/img/shop-accessories.webp',
            title: 'Desk Duo Keyboard & Mouse',
            price: '$79.00',
            was: '$109.00',
            why: 'Upgrades your home desk immediately under $150 with low-profile tactile typing, silent precision tracking, and zero cable clutter.',
            specs: ['Low-profile scissor switches', 'Multi-device Bluetooth & 2.4GHz', 'Rechargeable USB-C battery'],
            shopUrl: 'shop.html?category=Accessories'
        },
        desk_visuals_mid: {
            id: 'view-27-qhd-monitor',
            match: '99% Everyday Match',
            category: 'MONITORS',
            img: 'assets/img/shop-monitor-qhd.webp',
            title: 'View 27 QHD Monitor',
            price: '$249.00',
            was: '$329.00',
            why: 'Ideal for a focused home desk when crisp visuals matter most. Delivers 2560x1440 resolution, 99% sRGB accuracy, and single-cable USB-C power.',
            specs: ['27" IPS QHD (2560 x 1440)', 'Single-cable USB-C hub', 'Low-blue-light eye comfort'],
            shopUrl: 'shop.html?category=Monitors'
        },
        desk_visuals_flagship: {
            id: 'view-27-4k-monitor',
            match: '99% Studio Match',
            category: 'MONITORS',
            img: 'assets/img/shop-monitor-4k.webp',
            title: 'View 27 Pro 4K Monitor',
            price: '$349.00',
            was: '$429.00',
            why: 'Our reference-grade 4K UHD studio panel built for creators, designers, and flagship single-cable laptop setups.',
            specs: ['27" 4K UHD (3840 x 2160) HDR400', '90W USB-C Power Delivery', 'Height, tilt & pivot ergonomic stand'],
            shopUrl: 'shop.html?category=Monitors'
        },
        desk_sound: {
            id: 'sonix-studio-max',
            match: '98% Acoustic Match',
            category: 'HEADPHONES',
            img: 'assets/img/shop-headphones-studio.webp',
            title: 'Studio Over-Ear ANC',
            price: '$199.00',
            was: '$249.00',
            why: 'Reference-grade 45mm titanium drivers and plush memory-foam earcups engineered for distraction-free desk work and deep listening.',
            specs: ['45mm custom studio drivers', '45-hour battery + USB-C DAC', 'Adaptive hybrid noise cancellation'],
            shopUrl: 'shop.html?category=Headphones'
        },
        desk_speed: {
            id: 'book-air-14',
            match: '99% Workflow Match',
            category: 'LAPTOPS',
            img: 'assets/img/shop-laptop.webp',
            title: 'Book Air 14 Laptop',
            price: '$799.00',
            was: '$949.00',
            why: 'Featherlight 14-inch aluminum laptop with silent fanless speed, instant wake, and 18-hour battery life for effortless multitasking.',
            specs: ['14" Liquid Retina-class display', '18-hour all-day battery life', 'Dual Thunderbolt / USB-C ports'],
            shopUrl: 'shop.html?category=Laptops'
        },
        commute_under150: {
            id: 'air-buds-pro',
            match: '99% Commute Match',
            category: 'EARBUDS',
            img: 'assets/img/shop-earbuds-pro.webp',
            title: 'Air Buds Pro',
            price: '$79.00',
            was: '$119.00',
            why: 'Pocket-sized active noise cancellation and transparency mode that silences train noise and fits effortlessly in any pocket.',
            specs: ['Active Noise Cancellation + Transparency', '30-hour total battery with case', 'IPX4 sweat & rain resistance'],
            shopUrl: 'shop.html?category=Earbuds'
        },
        commute_mid: {
            id: 'sonix-pro-wireless',
            match: '98% Travel Match',
            category: 'HEADPHONES',
            img: 'assets/img/shop-headphones.webp',
            title: 'Sonix Pro Wireless',
            price: '$149.00',
            was: '$199.00',
            why: 'Fold-flat travel design with 40-hour battery life and multipoint Bluetooth so you can switch seamlessly between phone and laptop.',
            specs: ['40-hour ANC battery life', 'Bluetooth 5.3 dual-device pairing', '5-min charge = 4 hours playback'],
            shopUrl: 'shop.html?category=Headphones'
        },
        commute_wearable: {
            id: 'watch-active',
            match: '97% Active Match',
            category: 'WEARABLES',
            img: 'assets/img/shop-watch-active.webp',
            title: 'Watch Active',
            price: '$119.00',
            was: '$159.00',
            why: 'Featherweight AMOLED smart wearable built for daily movement, transit notifications, and accurate workout pacing.',
            specs: ['Always-on AMOLED display', '7-day battery endurance', 'Built-in GPS & heart-rate zones'],
            shopUrl: 'shop.html?category=Wearables'
        },
        living_sound: {
            id: 'pulse-home-speaker',
            match: '98% Room Audio Match',
            category: 'SPEAKERS',
            img: 'assets/img/shop-speaker-home.webp',
            title: 'Sound Home Speaker',
            price: '$129.00',
            was: '$169.00',
            why: 'Fills your living room or shared space with warm, room-calibrated acoustic sound and clean minimalist fabric styling.',
            specs: ['Room-filling stereo acoustic array', 'Wi-Fi AirPlay & Bluetooth 5.3', 'Tactile top-panel touch controls'],
            shopUrl: 'shop.html?category=Speakers'
        },
        living_play: {
            id: 'play-one-extra-controller-bundle',
            match: '99% Game Night Match',
            category: 'GAMING CONSOLES',
            img: 'assets/img/shop-console-bundle.webp',
            title: 'Play Station S Duo Bundle',
            price: '$349.00',
            was: '$429.00',
            why: 'Complete living-room 4K 120fps console bundle with two haptic wireless controllers ready for couch co-op out of the box.',
            specs: ['1TB ultra-fast NVMe SSD', 'Includes 2 wireless controllers', '4K 120Hz HDR & ray tracing'],
            shopUrl: 'shop.html?category=Gaming Consoles'
        }
    };

    let activeRec = recommendations.desk_visuals_mid;

    const pickRecommendation = () => {
        if (state.space === 'living') {
            if (state.priority === 'sound' || state.budget === 'under150') {
                return recommendations.living_sound;
            }
            return recommendations.living_play;
        }
        if (state.space === 'commute') {
            if (state.priority === 'speed' && state.budget === 'flagship') {
                return recommendations.desk_speed;
            }
            if (state.priority === 'visuals') {
                return recommendations.commute_wearable;
            }
            if (state.budget === 'under150') {
                return recommendations.commute_under150;
            }
            return recommendations.commute_mid;
        }
        if (state.priority === 'sound') {
            return state.budget === 'under150' ? recommendations.commute_under150 : recommendations.desk_sound;
        }
        if (state.priority === 'speed') {
            return state.budget === 'under150' ? recommendations.desk_visuals_under150 : recommendations.desk_speed;
        }
        if (state.budget === 'under150') return recommendations.desk_visuals_under150;
        if (state.budget === 'flagship') return recommendations.desk_visuals_flagship;
        return recommendations.desk_visuals_mid;
    };

    const renderQuizResult = () => {
        const rec = pickRecommendation();
        activeRec = rec;
        const updateDOM = () => {
            matchPill.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${rec.match}`;
            catTag.textContent = rec.category;
            recImg.src = rec.img;
            recImg.alt = rec.title;
            recTitle.textContent = rec.title;
            recPrice.textContent = rec.price;
            recWas.textContent = rec.was;
            recWhy.textContent = rec.why;
            recSpecs.innerHTML = rec.specs
                .map(s => `<li><i class="fa-solid fa-check"></i> ${s}</li>`)
                .join('');
            addCartBtn.setAttribute('data-id', rec.id);
            viewShopLink.href = rec.shopUrl;
        };

        if (typeof gsap !== 'undefined') {
            gsap.to(resultCard, {
                opacity: 0.25,
                y: 6,
                duration: 0.15,
                ease: 'power1.out',
                onComplete: () => {
                    updateDOM();
                    gsap.to(resultCard, {
                        opacity: 1,
                        y: 0,
                        duration: 0.28,
                        ease: 'power2.out'
                    });
                }
            });
        } else {
            updateDOM();
        }
    };

    optionRows.forEach(row => {
        const question = row.getAttribute('data-question');
        const buttons = row.querySelectorAll('.quiz-opt-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state[question] = btn.getAttribute('data-val');
                renderQuizResult();
            });
        });
    });

    if (addCartBtn) {
        addCartBtn.addEventListener('click', () => {
            if (window.StacklyCart && activeRec) {
                window.StacklyCart.addItem({
                    id: activeRec.id,
                    name: activeRec.title,
                    category: activeRec.category,
                    price: activeRec.price,
                    oldPrice: activeRec.was,
                    image: activeRec.img
                }, 1);
            }
            const span = addCartBtn.querySelector('span');
            if (span) {
                const orig = span.textContent;
                span.textContent = 'Added to Cart!';
                setTimeout(() => {
                    span.textContent = orig;
                }, 1200);
            }
        });
    }
}

/* ==========================================================================
   5. SIDE-BY-SIDE SPEC COMPARISON MATRIX
   ========================================================================== */
function initSpecComparator() {
    const tabBtns = document.querySelectorAll('.compare-category-tabs .shop-pill');
    const tableCard = document.getElementById('compare-table-card');

    if (!tabBtns.length || !tableCard) return;

    const matrix = {
        headphones: {
            a: {
                id: 'sonix-pro-wireless',
                badge: 'Best Seller',
                img: 'assets/img/shop-headphones.webp',
                title: 'Sonix Pro Wireless',
                price: '$149.00',
                was: '$199.00',
                best: 'Daily commutes, travel & open offices',
                feat: 'Hybrid Active Noise Cancellation',
                battery: '40 Hours + USB-C Fast Charge',
                conn: 'Bluetooth 5.3 Multipoint + 3.5mm'
            },
            b: {
                id: 'sonix-studio-max',
                badge: 'Studio Grade',
                img: 'assets/img/shop-headphones-studio.webp',
                title: 'Studio Over-Ear ANC',
                price: '$199.00',
                was: '$249.00',
                best: 'Deep studio listening & mastering',
                feat: '45mm Custom Titanium Reference Drivers',
                battery: '45 Hours + Lossless USB-C DAC',
                conn: 'Bluetooth 5.3 + Braided Coiled Cable'
            }
        },
        monitors: {
            a: {
                id: 'view-27-qhd-monitor',
                badge: 'Everyday Essential',
                img: 'assets/img/shop-monitor-qhd.webp',
                title: 'View 27 QHD Monitor',
                price: '$249.00',
                was: '$329.00',
                best: 'Home office, coding & daily productivity',
                feat: '27" QHD (2560 x 1440) 99% sRGB IPS',
                battery: '65W USB-C Laptop Charging',
                conn: 'USB-C, HDMI 2.0 & DisplayPort'
            },
            b: {
                id: 'view-27-4k-monitor',
                badge: 'Creator Pro',
                img: 'assets/img/shop-monitor-4k.webp',
                title: 'View 27 Pro 4K Monitor',
                price: '$349.00',
                was: '$429.00',
                best: '4K video editing, design & color work',
                feat: '27" 4K UHD (3840 x 2160) HDR400',
                battery: '90W USB-C Power Delivery Hub',
                conn: 'USB-C 90W, 2x HDMI 2.1 & DP 1.4'
            }
        },
        earbuds: {
            a: {
                id: 'air-buds-pro',
                badge: 'New Arrival',
                img: 'assets/img/shop-earbuds-pro.webp',
                title: 'Air Buds Pro',
                price: '$79.00',
                was: '$119.00',
                best: 'Noise-free commutes, calls & workouts',
                feat: 'Active Noise Cancellation + Transparency',
                battery: '30 Hours Total (Wireless Case)',
                conn: 'Bluetooth 5.3 Instant Auto-Pair'
            },
            b: {
                id: 'air-buds-lite',
                badge: 'Featherlight',
                img: 'assets/img/shop-earbuds-lite.webp',
                title: 'Air Buds Lite',
                price: '$49.00',
                was: '$69.00',
                best: 'Casual podcasts, walks & everyday carry',
                feat: 'Custom 10mm Dynamic Acoustic Drivers',
                battery: '24 Hours Total (USB-C Pocket Case)',
                conn: 'Bluetooth 5.3 Low-Latency Mode'
            }
        },
        watches: {
            a: {
                id: 'watch-one',
                badge: 'Classic Design',
                img: 'assets/img/shop-watch-one.webp',
                title: 'Watch One',
                price: '$139.00',
                was: '$179.00',
                best: 'All-day notifications, sleep & wellness',
                feat: 'Machined Aluminum Case + Sapphire Glass',
                battery: '7-Day Magnetic Fast-Charge Battery',
                conn: 'iOS & Android Companion Sync'
            },
            b: {
                id: 'watch-active',
                badge: 'Made to Move',
                img: 'assets/img/shop-watch-active.webp',
                title: 'Watch Active',
                price: '$119.00',
                was: '$159.00',
                best: 'Running, outdoor training & swim tracking',
                feat: 'Ultra-Light Case + Breathable Sport Band',
                battery: '7-Day Battery + Continuous GPS Mode',
                conn: 'iOS & Android + Bluetooth Audio Control'
            }
        }
    };

    let currentPair = matrix.headphones;

    const setCol = (prefix, item) => {
        document.getElementById(`comp-${prefix}-badge`).textContent = item.badge;
        const img = document.getElementById(`comp-${prefix}-img`);
        img.src = item.img;
        img.alt = item.title;
        document.getElementById(`comp-${prefix}-title`).textContent = item.title;
        document.getElementById(`comp-${prefix}-price`).textContent = item.price;
        document.getElementById(`comp-${prefix}-was`).textContent = item.was;
        document.getElementById(`comp-${prefix}-best`).textContent = item.best;
        document.getElementById(`comp-${prefix}-feat`).textContent = item.feat;
        document.getElementById(`comp-${prefix}-battery`).textContent = item.battery;
        document.getElementById(`comp-${prefix}-conn`).textContent = item.conn;
        document.getElementById(`comp-${prefix}-btn`).setAttribute('data-id', item.id);
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-comp');
            const pair = matrix[key];
            if (!pair) return;
            currentPair = pair;

            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const applyPair = () => {
                setCol('a', pair.a);
                setCol('b', pair.b);
            };

            if (typeof gsap !== 'undefined') {
                gsap.to(tableCard, {
                    opacity: 0.25,
                    y: 6,
                    duration: 0.15,
                    ease: 'power1.out',
                    onComplete: () => {
                        applyPair();
                        gsap.to(tableCard, {
                            opacity: 1,
                            y: 0,
                            duration: 0.28,
                            ease: 'power2.out'
                        });
                    }
                });
            } else {
                applyPair();
            }
        });
    });

    const btnA = document.getElementById('comp-a-btn');
    const btnB = document.getElementById('comp-b-btn');

    [
        { btn: btnA, side: 'a' },
        { btn: btnB, side: 'b' }
    ].forEach(({ btn, side }) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            const item = currentPair[side];
            if (item && window.StacklyCart) {
                window.StacklyCart.addItem({
                    id: item.id,
                    name: item.title,
                    price: item.price,
                    oldPrice: item.was,
                    image: item.img
                }, 1);
            }
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = 'Added!';
                setTimeout(() => {
                    span.textContent = 'Add to Cart';
                }, 1100);
            }
        });
    });
}

/* ==========================================================================
   6. BUYING GUIDE FAQ ACCORDION
   ========================================================================== */
function initGuidesFaqAccordion() {
    const items = document.querySelectorAll('#guides-faq .clarity-accordion-item');
    items.forEach(item => {
        const btn = item.querySelector('.clarity-row-btn');
        const content = item.querySelector('.clarity-row-content');
        if (!btn || !content) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            items.forEach(other => {
                other.classList.remove('active');
                const otherBtn = other.querySelector('.clarity-row-btn');
                const otherContent = other.querySelector('.clarity-row-content');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                if (otherContent) otherContent.hidden = true;
            });

            if (!isOpen) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                content.hidden = false;

                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(
                        content,
                        { opacity: 0, y: -6 },
                        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
                    );
                }
            }
        });
    });
}
