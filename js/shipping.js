/**
 * STACKLY - Shipping, Returns & Tracking Page Controller (shipping.html)
 * Handles segmented tabs (Shipping, Returns, Track your order), live order tracking,
 * return review submissions, delivery FAQ accordion, shipping fee calculator,
 * concierge inquiry form, AOS initialization, and GSAP ScrollTrigger animations.
 */

(function initStacklyShipping() {
    'use strict';

    const TRACKING_DATABASE = {
        'STK-84920': {
            code: 'STK-84920',
            headline: 'In Transit — On Schedule',
            badgeText: 'In Transit',
            badgeIcon: 'fa-truck-fast',
            badgeClass: 'in-transit',
            eta: '2–3 Business Days',
            total: '$249.00',
            stepIndex: 2, // 0: confirmed, 1: packed, 2: dispatched, 3: delivered
            items: 'View 27 QHD Monitor (x1)'
        },
        'STK-39104': {
            code: 'STK-39104',
            headline: 'Delivered — Paid on Delivery',
            badgeText: 'Delivered',
            badgeIcon: 'fa-circle-check',
            badgeClass: 'delivered',
            eta: 'Delivered to Front Door',
            total: '$129.00',
            stepIndex: 3,
            items: 'Sonix Pro Wireless (x1)'
        },
        'STK-77219': {
            code: 'STK-77219',
            headline: 'Order Confirmed — Preparing Dispatch',
            badgeText: 'Confirmed',
            badgeIcon: 'fa-clipboard-check',
            badgeClass: 'in-transit',
            eta: '3–5 Business Days',
            total: '$888.00',
            stepIndex: 1,
            items: 'Book Air 14 (x1), Desk Duo Keyboard & Mouse (x1)'
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

    function onReady() {
        // 1. Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 750,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                once: true,
                offset: 40
            });
        }

        // 2. Initialize GSAP & ScrollTrigger
        initShippingGSAP();

        // 3. Initialize Segmented Tabs (Shipping | Returns | Track your order)
        initSegmentedTabs();

        // 4. Initialize Live Order Tracking & Return Request Form
        initTrackingAndReturns();

        // 5. Initialize Delivery FAQ Accordion
        initDeliveryAccordion();

        // 6. Initialize Interactive Shipping Cost & Transit Estimator
        initShippingCalculator();

        // 7. Initialize Delivery Concierge Form
        initConciergeForm();
    }

    // ==========================================
    // 1. GSAP & ScrollTrigger Animations
    // ==========================================
    function initShippingGSAP() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Header entrance
        const header = document.querySelector('.site-header');
        if (header) {
            const logo = header.querySelector('.logo');
            const navLinks = header.querySelectorAll('.nav-links > li');
            const navIcons = header.querySelectorAll('.nav-icons > *:not(.search-box-wrapper)');

            const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.1 });
            if (logo) tl.fromTo(logo, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45 });
            if (navLinks.length) tl.fromTo(navLinks, { opacity: 0, y: -8 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 }, '-=0.25');
            if (navIcons.length) tl.fromTo(navIcons, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.35, clearProps: 'transform,opacity' }, '-=0.2');

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    start: 'top -20',
                    onUpdate: (self) => {
                        header.classList.toggle('scrolled', self.scroll() > 40);
                    }
                });
            }
        }

        // Hero Banner entrance & background image subtle zoom
        const heroImg = document.querySelector('.shipping-hero-img');
        const heroEyebrow = document.querySelector('.shipping-hero-content .shop-eyebrow');
        const heroTitle = document.querySelector('.shipping-hero-title');
        const heroSub = document.querySelector('.shipping-hero-subtitle');

        if (heroImg) {
            gsap.fromTo(heroImg, { scale: 1.07 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
        }

        if (heroTitle) {
            const hTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
            if (heroEyebrow) hTl.fromTo(heroEyebrow, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 });
            hTl.fromTo(heroTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.25');
            if (heroSub) hTl.fromTo(heroSub, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');
        }

        // Parallax on Extra Packaging Section image
        if (typeof ScrollTrigger !== 'undefined') {
            const packImg = document.querySelector('#packaging-estimator .shop-split-img-wrap img');
            if (packImg) {
                gsap.fromTo(packImg,
                    { scale: 1.08 },
                    {
                        scale: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '#packaging-estimator',
                            start: 'top 80%',
                            end: 'bottom 20%',
                            scrub: 0.6
                        }
                    }
                );
            }
        }
    }

    // ==========================================
    // 2. Segmented Tabs (Shipping | Returns | Track your order)
    // ==========================================
    function initSegmentedTabs() {
        const tabBtns = Array.from(document.querySelectorAll('.shipping-tab-btn'));
        const panels = {
            'shipping': document.getElementById('panel-shipping'),
            'returns': document.getElementById('panel-returns'),
            'tracking': document.getElementById('panel-tracking')
        };
        const jumpToTrackingBtn = document.getElementById('jump-to-tracking-btn');

        function activateTab(tabKey, focusInput = false) {
            if (!panels[tabKey]) return;

            tabBtns.forEach((btn) => {
                const isActive = btn.getAttribute('data-tab') === tabKey;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            Object.keys(panels).forEach((key) => {
                const panel = panels[key];
                if (!panel) return;
                if (key === tabKey) {
                    panel.hidden = false;
                    panel.classList.add('active');
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(panel,
                            { opacity: 0, y: 14 },
                            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
                        );
                    }
                } else {
                    panel.hidden = true;
                    panel.classList.remove('active');
                }
            });

            if (focusInput && tabKey === 'tracking') {
                const input = document.getElementById('tracking-code-input');
                if (input) setTimeout(() => input.focus(), 120);
            }
        }

        tabBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab') || 'shipping';
                activateTab(targetTab, false);
            });
        });

        if (jumpToTrackingBtn) {
            jumpToTrackingBtn.addEventListener('click', () => {
                activateTab('tracking', true);
            });
        }

        // Check URL parameter ?tab=tracking or ?tab=returns
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam && panels[tabParam]) {
            activateTab(tabParam, tabParam === 'tracking');
        }
    }

    // ==========================================
    // 3. Live Order Tracking & Return Review Form
    // ==========================================
    function initTrackingAndReturns() {
        const trackingForm = document.getElementById('order-tracking-form');
        const trackingInput = document.getElementById('tracking-code-input');
        const samplePills = document.querySelectorAll('.sample-code-pill');

        const displayCode = document.getElementById('trk-display-code');
        const displayStatus = document.getElementById('trk-display-status');
        const displayBadge = document.getElementById('trk-display-badge');
        const displayEta = document.getElementById('trk-display-eta');
        const displayItems = document.getElementById('trk-display-items');
        const timelineSteps = Array.from(document.querySelectorAll('#trk-steps-timeline .trk-step'));
        const trackingCard = document.getElementById('live-tracking-card');

        function renderTrackingCode(rawCode) {
            const cleanCode = (rawCode || '').trim().toUpperCase();
            if (!cleanCode) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Please enter a valid private tracking code', 'fa-circle-exclamation');
                }
                return;
            }

            const record = TRACKING_DATABASE[cleanCode] || {
                code: cleanCode,
                headline: 'In Transit — Carrier Handoff Complete',
                badgeText: 'In Transit',
                badgeIcon: 'fa-truck-fast',
                badgeClass: 'in-transit',
                eta: '2–4 Business Days',
                total: '$199.00',
                stepIndex: 2,
                items: 'STACKLY Curated Tech Order (x1)'
            };

            if (displayCode) displayCode.textContent = record.code;
            if (displayStatus) displayStatus.textContent = record.headline;
            if (displayBadge) {
                displayBadge.className = `tracking-status-badge ${record.badgeClass}`;
                displayBadge.innerHTML = `<i class="fa-solid ${record.badgeIcon}"></i> ${record.badgeText}`;
            }
            if (displayEta) {
                displayEta.innerHTML = `Estimated arrival: <strong>${record.eta}</strong> &bull; Payment due on delivery: <strong id="trk-display-total">${record.total}</strong>`;
            }
            if (displayItems) {
                displayItems.innerHTML = `<span><i class="fa-solid fa-box"></i> Items: <strong>${record.items}</strong></span>`;
            }

            timelineSteps.forEach((step, idx) => {
                step.classList.remove('completed', 'active');
                if (idx < record.stepIndex) {
                    step.classList.add('completed');
                } else if (idx === record.stepIndex) {
                    step.classList.add(record.stepIndex === 3 ? 'completed' : 'active');
                }
            });

            if (trackingCard && typeof gsap !== 'undefined') {
                gsap.fromTo(trackingCard,
                    { opacity: 0.4, scale: 0.98 },
                    { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
                );
            }

            if (typeof window.showToast === 'function') {
                window.showToast(`Loaded live tracking for ${record.code}`, 'fa-box-open');
            }
        }

        if (trackingForm) {
            trackingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                renderTrackingCode(trackingInput ? trackingInput.value : '');
            });
        }

        samplePills.forEach((pill) => {
            pill.addEventListener('click', () => {
                const code = pill.getAttribute('data-code') || 'STK-84920';
                if (trackingInput) trackingInput.value = code;
                renderTrackingCode(code);
            });
        });

        // Return Request Form
        const returnForm = document.getElementById('return-request-form');
        const returnFeedback = document.getElementById('return-form-feedback');

        if (returnForm) {
            returnForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeVal = (document.getElementById('return-tracking-code')?.value || '').trim().toUpperCase();
                const reasonVal = document.getElementById('return-reason')?.value || '';

                if (!codeVal || !reasonVal) {
                    if (returnFeedback) {
                        returnFeedback.style.color = '#DC2626';
                        returnFeedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter your tracking code and select a return reason.';
                    }
                    return;
                }

                const refId = 'RET-' + Math.floor(10000 + Math.random() * 90000);
                if (returnFeedback) {
                    returnFeedback.style.color = '#059669';
                    returnFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Return review submitted for <strong>${codeVal}</strong> (Ref: <strong>${refId}</strong>). Keep your packaging—next steps will be confirmed shortly.`;
                }
                if (typeof window.showToast === 'function') {
                    window.showToast(`Return request ${refId} submitted!`, 'fa-rotate-left');
                }
                returnForm.reset();
            });
        }
    }

    // ==========================================
    // 4. Delivery FAQ Accordion
    // ==========================================
    function initDeliveryAccordion() {
        const items = document.querySelectorAll('.clarity-accordion-item');
        items.forEach((item) => {
            const btn = item.querySelector('.clarity-row-btn');
            const content = item.querySelector('.clarity-row-content');
            if (!btn || !content) return;

            btn.addEventListener('click', () => {
                const isExpanded = item.classList.contains('active');

                items.forEach((other) => {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                        other.querySelector('.clarity-row-btn')?.setAttribute('aria-expanded', 'false');
                        const oc = other.querySelector('.clarity-row-content');
                        if (oc) oc.hidden = true;
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
    // 5. Interactive Shipping Cost & Transit Calculator
    // ==========================================
    function initShippingCalculator() {
        const slider = document.getElementById('est-order-slider');
        const regionSelect = document.getElementById('est-region-select');
        const orderValEl = document.getElementById('est-order-val');
        const feeOutputEl = document.getElementById('est-fee-output');
        const daysOutputEl = document.getElementById('est-days-output');
        const totalOutputEl = document.getElementById('est-total-output');
        const helperNoteEl = document.getElementById('est-helper-note');

        if (!slider || !regionSelect) return;

        function updateEstimate() {
            const subtotal = parseFloat(slider.value) || 0;
            const isFree = subtotal >= 100;
            const fee = isFree ? 0 : 7;
            const total = subtotal + fee;
            const selectedOption = regionSelect.options[regionSelect.selectedIndex];
            const days = selectedOption ? selectedOption.getAttribute('data-days') : '3–5 business days';

            if (orderValEl) orderValEl.textContent = `$${subtotal.toFixed(2)}`;
            if (feeOutputEl) {
                if (isFree) {
                    feeOutputEl.className = 'est-free-tag';
                    feeOutputEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> FREE ($0.00)';
                } else {
                    feeOutputEl.className = '';
                    feeOutputEl.textContent = '$7.00';
                }
            }
            if (daysOutputEl) daysOutputEl.textContent = days;
            if (totalOutputEl) totalOutputEl.textContent = `$${total.toFixed(2)}`;

            if (helperNoteEl) {
                if (isFree) {
                    helperNoteEl.innerHTML = '<i class="fa-solid fa-truck-fast"></i> Your order is $100 or more &mdash; you qualify for <strong>Free Shipping</strong>!';
                } else {
                    const diff = (100 - subtotal).toFixed(2);
                    helperNoteEl.innerHTML = `<i class="fa-solid fa-circle-info"></i> Add <strong>$${diff}</strong> more to unlock <strong>Free Shipping</strong> ($7.00 fee below $100).`;
                }
            }
        }

        slider.addEventListener('input', updateEstimate);
        regionSelect.addEventListener('change', updateEstimate);
        updateEstimate();
    }

    // ==========================================
    // 6. Delivery Concierge Form
    // ==========================================
    function initConciergeForm() {
        const form = document.getElementById('concierge-mini-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = (document.getElementById('concierge-code')?.value || '').trim();
            const msg = (document.getElementById('concierge-msg')?.value || '').trim();

            if (!code || !msg) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Please enter your tracking code and message', 'fa-circle-exclamation');
                }
                return;
            }

            if (typeof window.showToast === 'function') {
                window.showToast(`Dispatch desk notified for ${code.toUpperCase()}!`, 'fa-paper-plane');
            }
            form.reset();
        });
    }

})();
