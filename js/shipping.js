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

        // 8. Initialize Self-Service Order Management Hub
        initOrderManagementHub();
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
            const maskChild = heroTitle.querySelector('.spotlight-reveal-text, .text-mask-child');
            if (maskChild) {
                hTl.fromTo(maskChild,
                    {
                        clipPath: 'circle(0% at 50% 50%)',
                        opacity: 0.1,
                        scale: 0.95,
                        filter: 'brightness(1.6) blur(4px)'
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
                    '-=0.25'
                );
            } else {
                hTl.fromTo(heroTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.25');
            }
            if (heroSub) hTl.fromTo(heroSub, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35');

            // Interactive cursor spotlight tracking on shipping hero banner
            const shippingHero = document.getElementById('shipping-hero');
            if (shippingHero) {
                shippingHero.addEventListener('mousemove', (e) => {
                    const rect = shippingHero.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    shippingHero.style.setProperty('--spot-x', `${x}%`);
                    shippingHero.style.setProperty('--spot-y', `${y}%`);
                }, { passive: true });
            }
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

            // Professional Dashboard Motion for Self-Service Order Management Hub
            const hubSection = document.getElementById('order-management-hub');
            if (hubSection) {
                const hubHeader = hubSection.querySelector('.order-hub-header');
                const portalCard = hubSection.querySelector('.order-portal-card');
                const guaranteeCards = hubSection.querySelectorAll('.guarantee-card');

                const hubTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: hubSection,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    defaults: { ease: 'power2.out' }
                });

                if (hubHeader) {
                    hubTl.fromTo(hubHeader, 
                        { opacity: 0, y: 12 }, 
                        { opacity: 1, y: 0, duration: 0.35 }
                    );
                }
                if (portalCard) {
                    hubTl.fromTo(portalCard, 
                        { opacity: 0, y: 14 }, 
                        { opacity: 1, y: 0, duration: 0.38 }, 
                        '-=0.18'
                    );
                }
                if (guaranteeCards.length) {
                    hubTl.fromTo(guaranteeCards, 
                        { opacity: 0, y: 12 }, 
                        { opacity: 1, y: 0, stagger: 0.05, duration: 0.32, clearProps: 'transform,opacity' }, 
                        '-=0.22'
                    );
                }
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
                    { opacity: 1, scale: 1, duration: 0.32, ease: 'power2.out' }
                );
                if (timelineSteps.length) {
                    gsap.fromTo(timelineSteps,
                        { opacity: 0, y: 8 },
                        { opacity: 1, y: 0, stagger: 0.05, duration: 0.28, ease: 'power2.out', clearProps: 'transform,opacity' }
                    );
                }
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

    // ==========================================
    // 7. Self-Service Order Management Hub
    // ==========================================
    function initOrderManagementHub() {
        const hubForm = document.getElementById('order-portal-form');
        const dynamicFields = document.getElementById('order-dynamic-fields');
        const submitBtnText = document.getElementById('hub-submit-text');
        const actionPills = document.querySelectorAll('.action-pill');
        const demoBtn = document.getElementById('btn-use-demo-code');
        const jumpTrackerBtn = document.getElementById('btn-jump-to-tracker');
        const feedbackBox = document.getElementById('order-portal-feedback');
        const feedbackHeadline = document.getElementById('feedback-headline');
        const feedbackDetail = document.getElementById('feedback-detail');
        const feedbackTime = document.getElementById('feedback-time');

        if (!hubForm || !dynamicFields) return;

        // Dynamic Field Templates
        const templates = {
            address: {
                btnText: 'Submit Address Amendment',
                html: `
                    <div class="order-field-group">
                        <label for="hub-new-address">New Delivery Address (Street &amp; Apartment) <span class="req-star">*</span></label>
                        <input type="text" id="hub-new-address" placeholder="e.g. 742 Evergreen Terrace, Apt 4B" required>
                    </div>
                    <div class="order-field-row-2">
                        <div class="order-field-group">
                            <label for="hub-city-state">City, State &amp; ZIP <span class="req-star">*</span></label>
                            <input type="text" id="hub-city-state" placeholder="e.g. Springfield, OR 97477" required>
                        </div>
                        <div class="order-field-group">
                            <label for="hub-recipient-phone">Recipient Phone <span class="req-star">*</span></label>
                            <input type="tel" id="hub-recipient-phone" placeholder="e.g. (555) 234-5678" required>
                        </div>
                    </div>
                `
            },
            reschedule: {
                btnText: 'Confirm Rescheduled Slot',
                html: `
                    <div class="order-field-row-2">
                        <div class="order-field-group">
                            <label for="hub-reschedule-date">Preferred Delivery Date <span class="req-star">*</span></label>
                            <input type="date" id="hub-reschedule-date" required>
                        </div>
                        <div class="order-field-group">
                            <label for="hub-delivery-slot">Preferred Window <span class="req-star">*</span></label>
                            <select id="hub-delivery-slot" required>
                                <option value="morning">Morning (9:00 AM – 1:00 PM)</option>
                                <option value="afternoon" selected>Afternoon (1:00 PM – 5:00 PM)</option>
                                <option value="evening">Evening (5:00 PM – 8:00 PM)</option>
                                <option value="weekend">Saturday Priority Slot</option>
                            </select>
                        </div>
                    </div>
                    <div class="order-field-group">
                        <label for="hub-delivery-notes">Delivery Gate / Concierge Access Note (Optional)</label>
                        <input type="text" id="hub-delivery-notes" placeholder="e.g. Leave with doorman or gate code #4092">
                    </div>
                `
            },
            invoice: {
                btnText: 'Generate &amp; Email Tax Invoice',
                html: `
                    <div class="order-field-group">
                        <label for="hub-company-name">Company / Business Name (Optional for Tax Filing)</label>
                        <input type="text" id="hub-company-name" placeholder="e.g. Acme Studio LLC">
                    </div>
                    <div class="order-field-row-2">
                        <div class="order-field-group">
                            <label for="hub-tax-id">Tax ID / VAT / GSTIN (Optional)</label>
                            <input type="text" id="hub-tax-id" placeholder="e.g. US-EIN-987654321">
                        </div>
                        <div class="order-field-group">
                            <label for="hub-invoice-format">Document Format</label>
                            <select id="hub-invoice-format">
                                <option value="pdf" selected>Standard Itemized PDF (with Serial #)</option>
                                <option value="commercial">Commercial Export Tax Invoice</option>
                            </select>
                        </div>
                    </div>
                `
            },
            cancel: {
                btnText: 'Submit Order Cancellation',
                html: `
                    <div class="order-field-group">
                        <label for="hub-cancel-reason">Primary Reason for Cancellation <span class="req-star">*</span></label>
                        <select id="hub-cancel-reason" required>
                            <option value="" disabled selected>Select a reason...</option>
                            <option value="mistake">Placed order by mistake</option>
                            <option value="shipping-speed">Found faster delivery elsewhere</option>
                            <option value="changed-mind">Changed mind / want different item</option>
                            <option value="payment">Need to change payment method</option>
                            <option value="other">Other reason</option>
                        </select>
                    </div>
                    <div class="order-field-group">
                        <label for="hub-cancel-notes">Additional Feedback (Optional)</label>
                        <textarea id="hub-cancel-notes" rows="2" placeholder="Let us know how we could have helped you better..."></textarea>
                    </div>
                `
            }
        };

        let currentAction = 'address';

        function renderActionFields(actionKey) {
            currentAction = actionKey;
            const data = templates[actionKey] || templates.address;
            dynamicFields.innerHTML = data.html;
            if (submitBtnText) submitBtnText.innerHTML = data.btnText;

            // Set minimum date for reschedule to tomorrow
            const dateInput = document.getElementById('hub-reschedule-date');
            if (dateInput) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                dateInput.min = tomorrow.toISOString().split('T')[0];
                dateInput.value = tomorrow.toISOString().split('T')[0];
            }
        }

        // Render initial action fields
        renderActionFields('address');

        // Handle pill selection
        actionPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const radio = pill.querySelector('input[type="radio"]');
                if (!radio) return;
                radio.checked = true;
                actionPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                renderActionFields(radio.value);
            });
        });

        // Demo ID autofill
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                const orderInput = document.getElementById('hub-order-code');
                const emailInput = document.getElementById('hub-contact-email');
                if (orderInput) orderInput.value = 'STK-84920';
                if (emailInput) emailInput.value = 'alex.chen@example.com';

                const newAddr = document.getElementById('hub-new-address');
                const cityState = document.getElementById('hub-city-state');
                const phone = document.getElementById('hub-recipient-phone');
                if (newAddr) newAddr.value = '428 Lexington Ave, Suite 1204';
                if (cityState) cityState.value = 'New York, NY 10017';
                if (phone) phone.value = '(212) 555-0198';

                if (typeof window.showToast === 'function') {
                    window.showToast('Demo order STK-84920 filled!', 'fa-circle-check');
                }
            });
        }

        // Jump to live shipment tracker
        if (jumpTrackerBtn) {
            jumpTrackerBtn.addEventListener('click', () => {
                const trackTab = document.getElementById('track-tab-btn');
                if (trackTab) trackTab.click();
                const trackSection = document.getElementById('shipping-tabs');
                if (trackSection) {
                    trackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // Form submission
        hubForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const orderCode = (document.getElementById('hub-order-code')?.value || '').trim().toUpperCase();
            const email = (document.getElementById('hub-contact-email')?.value || '').trim();

            if (!orderCode || !email) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Please enter both Order ID and Email address.', 'fa-circle-exclamation');
                }
                return;
            }

            // Generate action-specific reference code
            const suffixes = { address: 'ADR', reschedule: 'SCH', invoice: 'INV', cancel: 'CNL' };
            const suffix = suffixes[currentAction] || 'REQ';
            const cleanCode = orderCode.replace(/[^A-Z0-9]/g, '') || 'STK84920';
            const generatedRef = `REQ-${cleanCode}-${suffix}`;

            const headlines = {
                address: 'Shipping Address Amendment Confirmed',
                reschedule: 'Delivery Slot Rescheduled',
                invoice: 'Digital Tax Invoice Dispatched',
                cancel: 'Order Cancellation Request Queued'
            };

            const details = {
                address: `Your updated delivery address has been verified and registered in the dispatch queue for order <strong>${orderCode}</strong>.`,
                reschedule: `Your preferred delivery window has been synchronized with the courier dispatch desk for order <strong>${orderCode}</strong>.`,
                invoice: `An itemized PDF invoice with serialized hardware certificates has been generated and sent to <strong>${email}</strong>.`,
                cancel: `Your cancellation request for order <strong>${orderCode}</strong> is being processed with zero cancellation fee.`
            };

            if (feedbackHeadline) feedbackHeadline.textContent = headlines[currentAction] || 'Request Submitted';
            if (feedbackDetail) feedbackDetail.innerHTML = `${details[currentAction]} Reference code: <strong id="feedback-ref">${generatedRef}</strong>.`;
            if (feedbackTime) feedbackTime.textContent = `Updated just now &bull; Confirmation sent to ${email}`;

            if (feedbackBox) {
                feedbackBox.style.display = 'flex';
                feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            if (typeof window.showToast === 'function') {
                window.showToast(`Request ${generatedRef} registered successfully!`, 'fa-circle-check');
            }
        });
    }

})();
