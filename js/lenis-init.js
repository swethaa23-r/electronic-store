/**
 * STACKLY - Lenis Smooth Scrolling Controller
 * Studio Freight / Darkroom Engineering Smooth Scroll integration with GSAP & ScrollTrigger
 */

(function initLenisSmoothScroll() {
    'use strict';

    // 1. Accessibility: Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.info('STACKLY: Lenis smooth scroll disabled due to prefers-reduced-motion.');
        return;
    }

    // 2. Ensure Lenis library is loaded
    if (typeof Lenis === 'undefined') {
        console.warn('STACKLY: Lenis script not found.');
        return;
    }

    // 3. Initialize Lenis instance
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease-out
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false, // Keep native touch behavior on mobile/touchscreens for maximum responsiveness
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false
    });

    // Expose instance globally for programmatic scrolling
    window.lenis = lenis;

    // 4. GSAP & ScrollTrigger Synchronization
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000); // Convert seconds to milliseconds for Lenis raf
        });

        // Turn off GSAP lag smoothing to prevent stuttering/delay during rapid scrolling
        gsap.ticker.lagSmoothing(0);
    } else {
        // Fallback standalone RAF loop if GSAP is not present on this page
        function rafLoop(time) {
            lenis.raf(time);
            requestAnimationFrame(rafLoop);
        }
        requestAnimationFrame(rafLoop);
    }

    // 5. Intercept In-Page Anchor Links (e.g. #faq, #reviews, #freshly-dropped)
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;

        const targetEl = document.querySelector(href);
        if (targetEl) {
            e.preventDefault();
            const header = document.querySelector('.site-header');
            const offset = header ? header.offsetHeight + 10 : 80;
            lenis.scrollTo(targetEl, {
                offset: -offset,
                duration: 1.2
            });
        }
    });

    // 6. Pause Lenis when modal/drawer overlays are opened (body.no-scroll)
    // Uses MutationObserver to dynamically react to any modal or drawer open/close
    const bodyClassObserver = new MutationObserver(() => {
        if (document.body.classList.contains('no-scroll')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });
    bodyClassObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // 7. Auto-resize Lenis on window load and accordion/filter layout changes
    window.addEventListener('load', () => {
        lenis.resize();
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });

    // Listen to clarity-accordion and faq toggles to recalculate page height dynamically
    document.addEventListener('click', (e) => {
        if (e.target.closest('.clarity-row-btn, .faq-question, .filter-group-header, .tab-btn')) {
            setTimeout(() => {
                lenis.resize();
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 320);
        }
    });

    console.info('STACKLY: Lenis smooth scrolling initialized successfully.');
})();
