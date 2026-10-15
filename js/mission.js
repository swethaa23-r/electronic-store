/**
 * STACKLY Electronics — Our Mission Page Controller (mission.js)
 * Powers:
 * 1. AOS & GSAP / ScrollTrigger Animations
 * 2. Interactive 4-Stage Curation Standards Explorer
 * 3. Animated Impact Stat Counters
 * 4. Interactive Everyday Setup Matcher (Focus / Commute / Play)
 * 5. Philosophy FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
    initMissionAnimations();
    initCurationExplorer();
    initImpactStatCounters();
    initSetupMatcher();
    initMissionFaqAccordion();
});

/* ==========================================================================
   1. AOS & GSAP / SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initMissionAnimations() {
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

    // 1. Hero entrance sequence (Main heading revealed line-by-line + supporting text in sequence)
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
    heroTl
        .fromTo('#mission-hero .shop-eyebrow', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' })
        .fromTo('#mission-hero .mission-hero-title .spotlight-reveal-text, #mission-hero .mission-hero-title .text-mask-child',
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
                stagger: 0.22, // Line-by-line theatrical spotlight reveal
                ease: 'power3.out',
                clearProps: 'clipPath,filter,transform,opacity'
            },
            '-=0.15'
        )
        .fromTo('.mission-hero-sub',
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
            '+=0.08'
        );

    // Interactive cursor spotlight tracking on mission hero section
    const missionHero = document.getElementById('mission-hero');
    if (missionHero) {
        missionHero.addEventListener('mousemove', (e) => {
            const rect = missionHero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            missionHero.style.setProperty('--spot-x', `${x}%`);
            missionHero.style.setProperty('--spot-y', `${y}%`);
        }, { passive: true });
    }

    // 2. Section 2: Editorial Split ("A thoughtful kind of upgrade.")
    // Alternating image-and-text entrance + smooth clipping transition on imagery
    const splitUpgrade = document.getElementById('thoughtful-upgrade');
    if (splitUpgrade) {
        const splitImg = splitUpgrade.querySelector('.shop-split-img-wrap img');
        const splitContent = splitUpgrade.querySelector('.shop-split-content');

        if (splitImg) {
            gsap.fromTo(splitImg,
                { opacity: 0.3, x: -36, clipPath: 'inset(10% 0% 10% 0%)', scale: 1.06 },
                {
                    opacity: 1,
                    x: 0,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    scale: 1,
                    duration: 0.95,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: splitUpgrade,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }

        if (splitContent) {
            gsap.fromTo(splitContent,
                { opacity: 0, x: 36 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: splitUpgrade,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }
    }

    // 3. Section 3: Three Pillars ("Sound first. | Design with purpose. | Choose thoughtfully.")
    // Stagger existing feature cards
    const pillarCols = gsap.utils.toArray('#mission-pillars .mission-pillar-col');
    if (pillarCols.length) {
        gsap.fromTo(pillarCols,
            { opacity: 0, y: 26 },
            {
                opacity: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.12,
                ease: 'power2.out',
                clearProps: 'transform',
                scrollTrigger: {
                    trigger: '#mission-pillars',
                    start: 'top 85%',
                    once: true
                }
            }
        );
    }

    // 4. Section 4: Narrative & Wide Setup Visual ("Make the everyday work better.")
    const narrativeSection = document.getElementById('make-everyday-better');
    if (narrativeSection) {
        const narrativeText = narrativeSection.querySelector('.mission-narrative-text');
        const bannerImg = narrativeSection.querySelector('.mission-wide-banner img');

        if (narrativeText) {
            gsap.fromTo(narrativeText,
                { opacity: 0, y: 22 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: narrativeSection,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }

        if (bannerImg) {
            // Introduce wide banner imagery using clipping and subtle scaling
            gsap.fromTo(bannerImg,
                { opacity: 0.3, clipPath: 'inset(8% 0% 8% 0%)', scale: 1.05 },
                {
                    opacity: 1,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    scale: 1,
                    duration: 1.0,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.mission-wide-banner',
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }
    }

    // 5. Section 5: Editorial Storytelling ("For the things that matter to you.")
    // Asymmetric split reveal: Left visual anchor & Right stacked editorial rows
    const thingsMatterSec = document.getElementById('things-that-matter');
    if (thingsMatterSec) {
        const leadVisual = thingsMatterSec.querySelector('.editorial-img-frame img');
        const editorialRows = gsap.utils.toArray('#things-that-matter .editorial-row-item');
        const headingMask = thingsMatterSec.querySelector('.spotlight-reveal-text, .text-mask-child');

        const editorialTl = gsap.timeline({
            scrollTrigger: {
                trigger: thingsMatterSec,
                start: 'top 82%',
                once: true
            },
            defaults: { ease: 'power3.out' }
        });

        // 1. Spotlight reveal on section title
        if (headingMask) {
            editorialTl.fromTo(headingMask,
                { clipPath: 'circle(0% at 50% 50%)', opacity: 0.1, scale: 0.95, filter: 'brightness(1.5) blur(4px)' },
                {
                    clipPath: 'circle(150% at 50% 50%)',
                    opacity: 1,
                    scale: 1,
                    filter: 'brightness(1) blur(0px)',
                    duration: 0.9,
                    clearProps: 'clipPath,filter,transform,opacity'
                }
            );
        }

        // 2. Optical unmasking on left curation workshop visual
        if (leadVisual) {
            editorialTl.fromTo(leadVisual,
                { clipPath: 'inset(12% 0% 12% 0%)', scale: 1.08, opacity: 0.4 },
                {
                    clipPath: 'inset(0% 0% 0% 0%)',
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    clearProps: 'clipPath,transform,opacity'
                },
                headingMask ? '-=0.45' : 0
            );
        }

        // 3. Sequential stagger for right stacked content rows
        if (editorialRows.length) {
            editorialTl.fromTo(editorialRows,
                { opacity: 0, x: 28 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.65,
                    stagger: 0.14,
                    ease: 'power2.out',
                    clearProps: 'transform,opacity'
                },
                '-=0.5'
            );
        }
    }

    // 6. Section 6: Curation Standards Explorer
    // Coordinated alternating entrances
    const curationSection = document.getElementById('curation-standards');
    if (curationSection) {
        const stepsList = curationSection.querySelector('.curation-steps-list');
        const stageDisplay = curationSection.querySelector('.curation-stage-card');

        if (stepsList) {
            gsap.fromTo(stepsList,
                { opacity: 0, x: -32 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    clearProps: 'transform',
                    scrollTrigger: {
                        trigger: curationSection,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }

        if (stageDisplay) {
            gsap.fromTo(stageDisplay,
                { opacity: 0, x: 32 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.85,
                    ease: 'power2.out',
                    clearProps: 'transform',
                    scrollTrigger: {
                        trigger: curationSection,
                        start: 'top 82%',
                        once: true
                    }
                }
            );
        }
    }

    // 7. Section 7: Impact Stat Cards
    // Stagger stat cards in coordinated sequence
    const statCards = gsap.utils.toArray('#mission-impact .mission-stat-card');
    if (statCards.length) {
        gsap.fromTo(statCards,
            { opacity: 0, y: 22 },
            {
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform',
                scrollTrigger: {
                    trigger: '#mission-impact',
                    start: 'top 85%',
                    once: true
                }
            }
        );
    }
}

/* ==========================================================================
   2. INTERACTIVE 4-STAGE CURATION STANDARDS EXPLORER
   ========================================================================== */
function initCurationExplorer() {
    const stageButtons = document.querySelectorAll('.curation-step-btn');
    const displayCard = document.getElementById('curation-stage-display');
    const stageImg = document.getElementById('curation-stage-img');
    const stageBadge = document.getElementById('curation-stage-badge');
    const stageMetric = document.getElementById('curation-stage-metric');
    const stageTitle = document.getElementById('curation-stage-title');
    const stageDesc = document.getElementById('curation-stage-desc');
    const stageLink = document.getElementById('curation-stage-link');

    if (!stageButtons.length || !displayCard) return;

    const stages = [
        {
            img: 'assets/img/mission-audio.webp',
            badge: 'Stage 01 \u2022 Studio Lab',
            icon: 'fa-sliders',
            metric: '99% sRGB & Custom Acoustic Tuning',
            title: 'True-to-life sound and color accuracy.',
            desc: 'We reject overly boosted bass and oversaturated panels. Every monitor and headphone in our store is measured for natural, fatigue-free clarity during long creative sessions.',
            linkText: 'Browse studio-tested gear',
            linkHref: '404.html'
        },
        {
            img: 'assets/img/mission-workshop.webp',
            badge: 'Stage 02 \u2022 Ergonomic Fit',
            icon: 'fa-hand-sparkles',
            metric: '8-Hour Continuous Comfort Standard',
            title: 'Designed to disappear while you work.',
            desc: 'From plush memory-foam ear cushions to low-profile scissor switches, our team tests every physical touchpoint across full workdays so nothing gets between you and your flow.',
            linkText: 'Explore ergonomic essentials',
            linkHref: '404.html'
        },
        {
            img: 'assets/img/mission-carry.webp',
            badge: 'Stage 03 \u2022 Endurance & Battery',
            icon: 'fa-battery-full',
            metric: 'Multi-Day Real-World Battery Cycles',
            title: 'Built for years, not a single season.',
            desc: 'We test battery longevity with active noise cancellation and high-brightness workloads switched on—making sure our portable gear handles daily commutes and weekend trips effortlessly.',
            linkText: 'Shop portable & travel tech',
            linkHref: '404.html'
        },
        {
            img: 'assets/img/mission-desk.webp',
            badge: 'Stage 04 \u2022 Seamless Ecosystem',
            icon: 'fa-plug-circle-check',
            metric: 'Single-Cable USB-C & Fast Multipoint',
            title: 'One calm workspace. Zero adapter clutter.',
            desc: 'Every display, laptop, and accessory in the STACKLY lineup is chosen to work together right out of the box—with clean USB-C power delivery and instant wireless switching.',
            linkText: 'Build your workspace setup',
            linkHref: '404.html'
        }
    ];

    stageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-stage'), 10);
            const data = stages[idx];
            if (!data) return;

            stageButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const applyStage = () => {
                stageImg.src = data.img;
                stageBadge.textContent = data.badge;
                stageMetric.innerHTML = `<i class="fa-solid ${data.icon}"></i> <span>${data.metric}</span>`;
                stageTitle.textContent = data.title;
                stageDesc.textContent = data.desc;
                stageLink.href = data.linkHref;
                const linkSpan = stageLink.querySelector('span');
                if (linkSpan) linkSpan.textContent = data.linkText;
            };

            if (typeof gsap !== 'undefined') {
                gsap.to(displayCard, {
                    opacity: 0.25,
                    y: 8,
                    duration: 0.16,
                    ease: 'power1.out',
                    onComplete: () => {
                        applyStage();
                        gsap.to(displayCard, {
                            opacity: 1,
                            y: 0,
                            duration: 0.32,
                            ease: 'power2.out'
                        });
                    }
                });
            } else {
                applyStage();
            }
        });
    });
}

/* ==========================================================================
   3. ANIMATED IMPACT STAT COUNTERS
   ========================================================================== */
function initImpactStatCounters() {
    const statEls = document.querySelectorAll('.mission-stat-num');
    if (!statEls.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    statEls.forEach(el => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target) || target === 0) return;

        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const counterObj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(counterObj, {
                    val: target,
                    duration: 1.4,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = `${prefix}${Math.round(counterObj.val)}${suffix}`;
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   4. INTERACTIVE EVERYDAY SETUP MATCHER
   ========================================================================== */
function initSetupMatcher() {
    const routinePills = document.querySelectorAll('.matcher-pills .shop-pill');
    const contentGrid = document.getElementById('matcher-content-grid');
    const matcherImg = document.getElementById('matcher-img');
    const matcherEyebrow = document.getElementById('matcher-eyebrow');
    const matcherTitle = document.getElementById('matcher-title');
    const matcherDesc = document.getElementById('matcher-desc');
    const matcherTags = document.getElementById('matcher-tags');
    const matcherCta = document.getElementById('matcher-cta');

    if (!routinePills.length || !contentGrid) return;

    const routines = {
        focus: {
            img: 'assets/img/mission-desk.webp',
            eyebrow: 'LOOKBOOK 01 / THE FOCUSED DESK',
            title: 'A little less clutter. A lot more possibility.',
            desc: 'Start with a sharp 27-inch QHD screen that gives your ideas room to breathe, a featherlight laptop that keeps you moving, and tactile wireless accessories that tie your workspace together.',
            tags: ['View 27 QHD Monitor', 'Book Air 14', 'Desk Duo Keyboard & Mouse'],
            ctaText: 'Explore desk essentials in Shop',
            ctaHref: '404.html'
        },
        commute: {
            img: 'assets/img/mission-listening.webp',
            eyebrow: 'LOOKBOOK 02 / THE QUIET COMMUTE',
            title: 'Your personal listening room, wherever you go.',
            desc: 'Block out train platforms and busy cafes with adaptive hybrid noise cancellation, pocketable wireless earbuds, and an AMOLED smart wearable that keeps notifications effortless.',
            tags: ['Studio ANC Headphones', 'Air Buds Pro', 'Watch One'],
            ctaText: 'Explore audio & wearables in Shop',
            ctaHref: '404.html'
        },
        play: {
            img: 'assets/img/mission-setup.webp',
            eyebrow: 'LOOKBOOK 03 / WEEKEND GAME NIGHT',
            title: 'Immersive 4K worlds built to share.',
            desc: 'Pair fast-loading 4K gaming with a dual-controller couch setup and warm, room-filling sound so every co-op campaign and movie marathon feels larger than life.',
            tags: ['Play Station S Duo Bundle', 'View 27 Pro 4K', 'Sound Home Speaker'],
            ctaText: 'Explore gaming & sound in Shop',
            ctaHref: '404.html'
        }
    };

    routinePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const key = pill.getAttribute('data-routine');
            const data = routines[key];
            if (!data) return;

            routinePills.forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-selected', 'false');
            });
            pill.classList.add('active');
            pill.setAttribute('aria-selected', 'true');

            const applyRoutine = () => {
                matcherImg.src = data.img;
                matcherEyebrow.textContent = data.eyebrow;
                matcherTitle.textContent = data.title;
                matcherDesc.textContent = data.desc;
                matcherTags.innerHTML = data.tags
                    .map(t => `<span><i class="fa-solid fa-check"></i> ${t}</span>`)
                    .join('');
                matcherCta.href = data.ctaHref;
                const ctaSpan = matcherCta.querySelector('span');
                if (ctaSpan) ctaSpan.textContent = data.ctaText;
            };

            if (typeof gsap !== 'undefined') {
                gsap.to(contentGrid, {
                    opacity: 0.2,
                    y: 8,
                    duration: 0.16,
                    ease: 'power1.out',
                    onComplete: () => {
                        applyRoutine();
                        gsap.to(contentGrid, {
                            opacity: 1,
                            y: 0,
                            duration: 0.32,
                            ease: 'power2.out'
                        });
                    }
                });
            } else {
                applyRoutine();
            }
        });
    });
}

/* ==========================================================================
   5. PHILOSOPHY FAQ ACCORDION
   ========================================================================== */
function initMissionFaqAccordion() {
    const items = document.querySelectorAll('#mission-faq .clarity-accordion-item');
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
