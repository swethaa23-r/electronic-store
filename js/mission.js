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
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 750,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            once: true,
            offset: 40
        });
    }

    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Header entrance
        gsap.from('.site-header', {
            y: -20,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out'
        });

        // Hero entrance
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
            .from('#mission-hero .shop-eyebrow', { y: 16, opacity: 0, duration: 0.45 }, 0.1)
            .from('.mission-hero-title', { y: 24, opacity: 0, duration: 0.6 }, 0.18)
            .from('.mission-hero-sub', { y: 20, opacity: 0, duration: 0.55 }, 0.28);

        // Subtle scroll reveal on editorial split image and wide setup banner
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray(['#thoughtful-upgrade .shop-split-img-wrap img', '.mission-wide-banner img']).forEach(img => {
                gsap.fromTo(
                    img,
                    { scale: 1.06 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top 90%',
                            end: 'bottom 20%',
                            scrub: true
                        }
                    }
                );
            });
        }
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
            linkHref: 'shop.html?category=Headphones'
        },
        {
            img: 'assets/img/mission-workshop.webp',
            badge: 'Stage 02 \u2022 Ergonomic Fit',
            icon: 'fa-hand-sparkles',
            metric: '8-Hour Continuous Comfort Standard',
            title: 'Designed to disappear while you work.',
            desc: 'From plush memory-foam ear cushions to low-profile scissor switches, our team tests every physical touchpoint across full workdays so nothing gets between you and your flow.',
            linkText: 'Explore ergonomic essentials',
            linkHref: 'shop.html?category=Accessories'
        },
        {
            img: 'assets/img/mission-carry.webp',
            badge: 'Stage 03 \u2022 Endurance & Battery',
            icon: 'fa-battery-full',
            metric: 'Multi-Day Real-World Battery Cycles',
            title: 'Built for years, not a single season.',
            desc: 'We test battery longevity with active noise cancellation and high-brightness workloads switched on—making sure our portable gear handles daily commutes and weekend trips effortlessly.',
            linkText: 'Shop portable & travel tech',
            linkHref: 'shop.html?category=Earbuds'
        },
        {
            img: 'assets/img/mission-desk.webp',
            badge: 'Stage 04 \u2022 Seamless Ecosystem',
            icon: 'fa-plug-circle-check',
            metric: 'Single-Cable USB-C & Fast Multipoint',
            title: 'One calm workspace. Zero adapter clutter.',
            desc: 'Every display, laptop, and accessory in the STACKLY lineup is chosen to work together right out of the box—with clean USB-C power delivery and instant wireless switching.',
            linkText: 'Build your workspace setup',
            linkHref: 'shop.html?category=Monitors'
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
            ctaHref: 'shop.html?category=Monitors'
        },
        commute: {
            img: 'assets/img/mission-listening.webp',
            eyebrow: 'LOOKBOOK 02 / THE QUIET COMMUTE',
            title: 'Your personal listening room, wherever you go.',
            desc: 'Block out train platforms and busy cafes with adaptive hybrid noise cancellation, pocketable wireless earbuds, and an AMOLED smart wearable that keeps notifications effortless.',
            tags: ['Studio ANC Headphones', 'Air Buds Pro', 'Watch One'],
            ctaText: 'Explore audio & wearables in Shop',
            ctaHref: 'shop.html?category=Headphones'
        },
        play: {
            img: 'assets/img/mission-setup.webp',
            eyebrow: 'LOOKBOOK 03 / WEEKEND GAME NIGHT',
            title: 'Immersive 4K worlds built to share.',
            desc: 'Pair fast-loading 4K gaming with a dual-controller couch setup and warm, room-filling sound so every co-op campaign and movie marathon feels larger than life.',
            tags: ['Play Station S Duo Bundle', 'View 27 Pro 4K', 'Sound Home Speaker'],
            ctaText: 'Explore gaming & sound in Shop',
            ctaHref: 'shop.html?category=Gaming Consoles'
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
