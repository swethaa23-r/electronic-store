/**
 * STACKLY Electronics - Contact Page Controller (contact.js)
 * Production-ready form validation, accessible UX, and demo state handler.
 * Easy integration for Spring Boot REST API (/api/v1/contact).
 */

(function () {
    'use strict';

    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 650,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                once: true,
                offset: 30
            });
        } else {
            // Force visible if AOS library is missing or blocked
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.classList.add('aos-animate');
            });
        }
    }

    function dismissPreloaderSafely() {
        const preloader = document.getElementById('stackly-preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            preloader.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 400);
        }
    }

    function onInit() {
        dismissPreloaderSafely();
        initAOS();
        initContactGSAP();
        initContactForm();
        initScrollTriggers();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onInit);
    } else {
        onInit();
    }

    window.addEventListener('load', () => {
        dismissPreloaderSafely();
        initAOS();
    });

    // Failsafe timer to guarantee preloader is dismissed and content visible
    setTimeout(onInit, 600);

    // ==========================================
    // GSAP & ScrollTrigger Animations
    // ==========================================
    function initContactGSAP() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // 1. Header entrance
        const header = document.querySelector('.site-header');
        if (header) {
            const logo = header.querySelector('.logo');
            const navLinks = header.querySelectorAll('.nav-links > li');
            const navIcons = header.querySelectorAll('.nav-icons > *:not(.search-box-wrapper)');

            const headerTl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.1 });
            if (logo) headerTl.fromTo(logo, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45 });
            if (navLinks.length) headerTl.fromTo(navLinks, { opacity: 0, y: -8 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 }, '-=0.25');
            if (navIcons.length) headerTl.fromTo(navIcons, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.35, clearProps: 'transform,opacity' }, '-=0.2');
        }

        // 2. Contact Hero sequence:
        // - Main heading with clipped text effect
        // - Supporting paragraph revealed strictly after heading finishes
        // - Existing hero imagery with restrained mask reveal
        // - CTA buttons with short stagger
        const heroEyebrow = document.querySelector('.contact-hero-content .shop-eyebrow');
        const heroTitle = document.querySelector('.contact-hero-title');
        const heroSub = document.querySelector('.contact-hero-subtitle');
        const heroImg = document.querySelector('.contact-hero-image img, .contact-hero-img, .contact-hero-bg img, .contact-hero-visual img');
        const heroBtns = document.querySelectorAll('.contact-hero-actions .btn');

        if (heroTitle) {
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.18 });
            if (heroEyebrow) heroTl.fromTo(heroEyebrow, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
            
            const maskChild = heroTitle.querySelector('.spotlight-reveal-text, .text-mask-child');
            if (maskChild) {
                // Theatrical Spotlight Reveal on contact heading
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
                heroTl.fromTo(heroTitle, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, heroEyebrow ? '-=0.15' : 0);
            }

            // Reveal supporting paragraph strictly AFTER the heading completes
            if (heroSub) {
                heroTl.fromTo(heroSub, 
                    { opacity: 0, y: 16 }, 
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 
                    '+=0.1'
                );
            }

            // Interactive cursor spotlight tracking on contact hero section
            const contactHero = document.querySelector('.contact-hero-section');
            if (contactHero) {
                contactHero.addEventListener('mousemove', (e) => {
                    const rect = contactHero.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    contactHero.style.setProperty('--spot-x', `${x}%`);
                    contactHero.style.setProperty('--spot-y', `${y}%`);
                }, { passive: true });
            }

            // Introduce existing hero imagery with restrained mask reveal if present
            if (heroImg) {
                heroTl.fromTo(heroImg,
                    { clipPath: 'inset(10% 0 10% 0)', opacity: 0.3, scale: 1.05 },
                    { clipPath: 'inset(0% 0 0% 0)', opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
                    '-=0.2'
                );
            }

            // Animate CTA buttons with short stagger
            if (heroBtns.length) {
                heroTl.fromTo(heroBtns, 
                    { opacity: 0, y: 12, scale: 0.96 }, 
                    { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' }, 
                    '-=0.15'
                );
            }
        }

        // 3. Contact Form & Side Guidance sequence with ScrollTrigger:
        // - Form heading revealed separately
        // - Form container revealed smoothly
        // - Fully interactive throughout
        const formSection = document.getElementById('contact-form-section');
        if (formSection && typeof ScrollTrigger !== 'undefined') {
            const sideEyebrow = formSection.querySelector('.contact-side-info .shop-eyebrow');
            const sideTitle = formSection.querySelector('.contact-side-title');
            const sideLead = formSection.querySelector('.contact-side-lead');
            const guidanceItems = formSection.querySelectorAll('.contact-guidance-item');
            const hoursBadge = formSection.querySelector('.contact-hours-badge');
            const formCard = formSection.querySelector('.contact-form-card');

            const formTl = gsap.timeline({
                scrollTrigger: {
                    trigger: formSection,
                    start: 'top 82%',
                    once: true
                },
                defaults: { ease: 'power2.out' }
            });

            // Reveal form heading separately from form container
            if (sideEyebrow) formTl.fromTo(sideEyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 });
            if (sideTitle) formTl.fromTo(sideTitle, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.25');
            if (sideLead) formTl.fromTo(sideLead, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25');

            // Guidance items in coordinated sequence
            if (guidanceItems.length) {
                formTl.fromTo(guidanceItems,
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, clearProps: 'transform,opacity' },
                    '-=0.2'
                );
            }
            if (hoursBadge) formTl.fromTo(hoursBadge, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, clearProps: 'transform,opacity' }, '-=0.15');

            // Reveal form container smoothly
            if (formCard) {
                formTl.fromTo(formCard,
                    { opacity: 0, y: 24 },
                    { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', clearProps: 'transform,opacity' },
                    '-=0.45'
                );
            }
        }

        // 4. Contact Information Cards / Office & Map sequence:
        // - Reveal cards in coordinated sequence
        // - Avoid large card movements
        const mapSection = document.getElementById('contact-map-section');
        if (mapSection && typeof ScrollTrigger !== 'undefined') {
            const secHeader = mapSection.querySelector('.section-header');
            const officeCard = mapSection.querySelector('.office-info-card');
            const officeBadge = mapSection.querySelector('.office-header-badge');
            const officeTitle = mapSection.querySelector('.office-title');
            const officeDetails = mapSection.querySelectorAll('.office-detail-item');
            const officeActions = mapSection.querySelectorAll('.office-actions .btn');
            const mapEmbed = mapSection.querySelector('.map-embed-wrapper');

            const mapTl = gsap.timeline({
                scrollTrigger: {
                    trigger: mapSection,
                    start: 'top 82%',
                    once: true
                },
                defaults: { ease: 'power2.out' }
            });

            if (secHeader) mapTl.fromTo(secHeader, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 });

            // Reveal cards in coordinated sequence
            if (officeCard) {
                mapTl.fromTo(officeCard,
                    { opacity: 0, y: 22 },
                    { opacity: 1, y: 0, duration: 0.6, clearProps: 'transform,opacity' },
                    '-=0.3'
                );
            }
            if (officeBadge) mapTl.fromTo(officeBadge, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, clearProps: 'transform,opacity' }, '-=0.4');
            if (officeTitle) mapTl.fromTo(officeTitle, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, clearProps: 'transform,opacity' }, '-=0.25');

            if (officeDetails.length) {
                mapTl.fromTo(officeDetails,
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, clearProps: 'transform,opacity' },
                    '-=0.2'
                );
            }

            if (officeActions.length) {
                mapTl.fromTo(officeActions,
                    { opacity: 0, y: 10, scale: 0.96 },
                    { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.4, clearProps: 'transform,opacity' },
                    '-=0.15'
                );
            }

            if (mapEmbed) {
                mapTl.fromTo(mapEmbed,
                    { opacity: 0, y: 24, scale: 0.98 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform,opacity' },
                    '-=0.45'
                );
            }
        }

        // 5. Frequently Asked Questions (FAQ Section) sequence:
        const faqSection = document.getElementById('contact-faq');
        if (faqSection && typeof ScrollTrigger !== 'undefined') {
            const faqHeader = faqSection.querySelector('.section-header');
            const faqItems = faqSection.querySelectorAll('.faq-item');

            const faqTl = gsap.timeline({
                scrollTrigger: {
                    trigger: faqSection,
                    start: 'top 85%',
                    once: true
                },
                defaults: { ease: 'power2.out' }
            });

            if (faqHeader) faqTl.fromTo(faqHeader, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55 });
            if (faqItems.length) {
                faqTl.fromTo(faqItems,
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, stagger: 0.07, duration: 0.48, clearProps: 'transform,opacity' },
                    '-=0.25'
                );
            }
        }

        // 6. Support Banner sequence with ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            const banner = document.getElementById('contact-support-banner');
            if (banner) {
                const title = banner.querySelector('.support-banner-title');
                const desc = banner.querySelector('.support-banner-desc');
                const actions = banner.querySelectorAll('.support-banner-actions .btn');

                const bannerTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: banner,
                        start: 'top 85%'
                    },
                    defaults: { ease: 'power2.out' }
                });

                if (title) bannerTl.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
                if (desc) bannerTl.fromTo(desc, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.25');
                if (actions.length) bannerTl.fromTo(actions, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, stagger: 0.08, duration: 0.4 }, '-=0.2');
            }
        }
    }

    /**
     * Smooth scroll helpers for hero, card, and banner CTA buttons
     */
    function initScrollTriggers() {
        const formSection = document.getElementById('contact-form-section');
        const enquirySelect = document.getElementById('contact-enquiry');

        // Hero "Send Us a Message" button
        const heroMsgBtn = document.getElementById('hero-msg-btn');
        if (heroMsgBtn && formSection) {
            heroMsgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                focusFirstFormField();
            });
        }

        // Card 3 "Technical Support" action button
        const techSupportBtn = document.getElementById('btn-tech-support');
        if (techSupportBtn && formSection) {
            techSupportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (enquirySelect) {
                    enquirySelect.value = 'Technical Support';
                    enquirySelect.dispatchEvent(new Event('change'));
                }
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                const messageInput = document.getElementById('contact-message');
                if (messageInput) {
                    setTimeout(() => messageInput.focus(), 500);
                }
            });
        }

        // Additional Support Banner "Contact Support" button
        const bannerContactBtn = document.getElementById('banner-contact-btn');
        if (bannerContactBtn && formSection) {
            bannerContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                focusFirstFormField();
            });
        }
    }

    function focusFirstFormField() {
        const nameInput = document.getElementById('contact-name');
        if (nameInput) {
            setTimeout(() => nameInput.focus(), 450);
        }
    }

    /**
     * Contact Form Validation & Submission Handler
     */
    function initContactForm() {
        const form = document.getElementById('stackly-contact-form');
        if (!form) return;

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const phoneInput = document.getElementById('contact-phone');
        const subjectInput = document.getElementById('contact-subject');
        const enquirySelect = document.getElementById('contact-enquiry');
        const orderNumInput = document.getElementById('contact-order-num');
        const messageInput = document.getElementById('contact-message');
        const consentCheckbox = document.getElementById('contact-consent');
        const submitBtn = document.getElementById('contact-submit-btn');
        const resetBtn = document.getElementById('contact-reset-btn');
        const statusBanner = document.getElementById('contact-status-banner');

        // Regex patterns
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{2,4}[-\s\.]?[0-9]{3,5}[-\s\.]?[0-9]{0,4}$/;

        // Attach live input validation listeners to clear errors on change
        const fields = [
            { el: nameInput, validator: validateName },
            { el: emailInput, validator: validateEmail },
            { el: phoneInput, validator: validatePhone },
            { el: subjectInput, validator: validateSubject },
            { el: enquirySelect, validator: validateEnquiry },
            { el: messageInput, validator: validateMessage },
            { el: consentCheckbox, validator: validateConsent }
        ];

        fields.forEach(({ el, validator }) => {
            if (!el) return;
            const eventName = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(eventName, () => {
                if (el.classList.contains('is-invalid')) {
                    validator();
                }
            });
            el.addEventListener('blur', () => {
                // Validate on blur if field has a value or user visited
                if (el.value.trim().length > 0 || el === consentCheckbox) {
                    validator();
                }
            });
        });

        function setError(field, errorElId, message) {
            field.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');
            const errorEl = document.getElementById(errorElId);
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('visible');
            }
            return false;
        }

        function clearError(field, errorElId) {
            field.classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
            const errorEl = document.getElementById(errorElId);
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('visible');
            }
            return true;
        }

        function validateName() {
            const val = nameInput.value.trim();
            if (!val) {
                return setError(nameInput, 'contact-name-error', 'Full Name is required.');
            }
            if (val.length < 2) {
                return setError(nameInput, 'contact-name-error', 'Please enter at least 2 characters.');
            }
            return clearError(nameInput, 'contact-name-error');
        }

        function validateEmail() {
            const val = emailInput.value.trim();
            if (!val) {
                return setError(emailInput, 'contact-email-error', 'Email address is required.');
            }
            if (!emailRegex.test(val)) {
                return setError(emailInput, 'contact-email-error', 'Please enter a valid email address (e.g., name@example.com).');
            }
            return clearError(emailInput, 'contact-email-error');
        }

        function validatePhone() {
            const val = phoneInput.value.trim();
            if (!val) {
                // Phone is optional
                return clearError(phoneInput, 'contact-phone-error');
            }
            // Strip spaces, dashes, and parens for minimum digit length check
            const digits = val.replace(/[^0-9]/g, '');
            if (digits.length < 7 || !phoneRegex.test(val)) {
                return setError(phoneInput, 'contact-phone-error', 'Please enter a valid phone number or leave blank.');
            }
            return clearError(phoneInput, 'contact-phone-error');
        }

        function validateSubject() {
            const val = subjectInput.value.trim();
            if (!val) {
                return setError(subjectInput, 'contact-subject-error', 'Subject is required.');
            }
            if (val.length < 4) {
                return setError(subjectInput, 'contact-subject-error', 'Subject must be at least 4 characters.');
            }
            return clearError(subjectInput, 'contact-subject-error');
        }

        function validateEnquiry() {
            const val = enquirySelect.value;
            if (!val || val === '') {
                return setError(enquirySelect, 'contact-enquiry-error', 'Please select an enquiry type.');
            }
            return clearError(enquirySelect, 'contact-enquiry-error');
        }

        function validateMessage() {
            const val = messageInput.value.trim();
            if (!val) {
                return setError(messageInput, 'contact-message-error', 'Message cannot be empty.');
            }
            if (val.length < 15) {
                return setError(messageInput, 'contact-message-error', `Message is too short (${val.length}/15 characters minimum).`);
            }
            return clearError(messageInput, 'contact-message-error');
        }

        function validateConsent() {
            if (!consentCheckbox.checked) {
                return setError(consentCheckbox, 'contact-consent-error', 'You must agree to the privacy consent to proceed.');
            }
            return clearError(consentCheckbox, 'contact-consent-error');
        }

        function validateAll() {
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isSubjectValid = validateSubject();
            const isEnquiryValid = validateEnquiry();
            const isMessageValid = validateMessage();
            const isConsentValid = validateConsent();

            const isValid = isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isEnquiryValid && isMessageValid && isConsentValid;

            if (!isValid) {
                // Focus the first invalid element
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            return isValid;
        }

        // Reset form handler
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                fields.forEach(({ el }) => {
                    if (el) {
                        el.classList.remove('is-invalid');
                        el.removeAttribute('aria-invalid');
                    }
                });
                const errors = form.querySelectorAll('.field-error-msg');
                errors.forEach(err => {
                    err.textContent = '';
                    err.classList.remove('visible');
                });
                if (statusBanner) {
                    statusBanner.classList.remove('visible');
                    statusBanner.innerHTML = '';
                }
            });
        }

        // Form Submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateAll()) {
                return;
            }

            // Prepare Payload (Trimming unnecessary whitespace)
            const payload = {
                fullName: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phoneNumber: phoneInput.value.trim() || null,
                subject: subjectInput.value.trim(),
                enquiryType: enquirySelect.value,
                orderNumber: orderNumInput.value.trim() || null,
                message: messageInput.value.trim(),
                privacyConsent: consentCheckbox.checked,
                submittedAt: new Date().toISOString()
            };

            // Loading state to prevent duplicate submissions
            submitBtn.classList.add('is-loading');
            submitBtn.setAttribute('disabled', 'true');
            if (resetBtn) resetBtn.setAttribute('disabled', 'true');

            try {
                // Call API or demo dispatcher
                const response = await submitContactForm(payload);

                if (response && response.success) {
                    displayDemoSuccessState(payload, response);
                    form.reset();
                } else {
                    displaySubmissionError(response ? response.message : 'Submission failed. Please try again.');
                }
            } catch (err) {
                console.error('[STACKLY Contact Error]:', err);
                displaySubmissionError('A network or unexpected error occurred. Please try again.');
            } finally {
                submitBtn.classList.remove('is-loading');
                submitBtn.removeAttribute('disabled');
                if (resetBtn) resetBtn.removeAttribute('disabled');
            }
        });

        /**
         * Dispatches contact payload.
         * Configured to connect cleanly to a Spring Boot REST API endpoint:
         * POST /api/v1/contact
         */
        async function submitContactForm(payload) {
            /* 
             * Spring Boot Integration Hook:
             * When the backend REST API is deployed, uncomment the fetch block below:
             * 
             * const response = await fetch('/api/v1/contact', {
             *     method: 'POST',
             *     headers: {
             *         'Content-Type': 'application/json',
             *         'Accept': 'application/json'
             *     },
             *     body: JSON.stringify(payload)
             * });
             * if (!response.ok) {
             *     throw new Error(`HTTP error! status: ${response.status}`);
             * }
             * return await response.json();
             */

            // Simulated network latency (600ms) for realistic UI responsiveness
            await new Promise((resolve) => setTimeout(resolve, 600));

            return {
                success: true,
                isDemo: true,
                endpoint: 'POST /api/v1/contact',
                message: 'Inquiry validated and processed in demo mode.'
            };
        }

        /**
         * Clear, honest demo submission state
         * Explicitly informs user this is a verified demo state ready for Spring Boot.
         * Adheres to Project Rule: Do not fake database/email delivery.
         */
        function displayDemoSuccessState(payload, response) {
            if (!statusBanner) return;

            statusBanner.className = 'contact-status-banner status-success visible';
            statusBanner.setAttribute('role', 'alert');

            const safeOrderNum = payload.orderNumber ? payload.orderNumber : 'N/A';
            const safePhone = payload.phoneNumber ? payload.phoneNumber : 'Not provided';

            statusBanner.innerHTML = `
                <div class="status-header">
                    <i class="fa-solid fa-circle-check"></i>
                    <div>
                        <span class="status-demo-tag"><i class="fa-solid fa-shield-halved"></i> DEMO SUBMISSION STATE</span>
                        <h4>Message Validated Successfully!</h4>
                    </div>
                </div>
                <div class="status-body">
                    <p>
                        Thank you, <strong>${escapeHtml(payload.fullName)}</strong>. Your contact form submission has passed all client-side validation rules.
                    </p>
                    <p style="margin-top: 6px; font-size: 0.84rem; color: #166534;">
                        <em>Notice:</em> Because no backend server is currently connected, this form is operating in verified Demo Mode. No data has been saved to local storage or an external database.
                    </p>
                    <div class="status-details-box">
<strong>Spring Boot Payload Verified:</strong>
Endpoint: ${escapeHtml(response.endpoint)}
Name:     ${escapeHtml(payload.fullName)}
Email:    ${escapeHtml(payload.email)}
Phone:    ${escapeHtml(safePhone)}
Subject:  ${escapeHtml(payload.subject)}
Enquiry:  ${escapeHtml(payload.enquiryType)}
Order #:  ${escapeHtml(safeOrderNum)}
Timestamp: ${escapeHtml(payload.submittedAt)}
                    </div>
                    <button type="button" class="status-reset-btn" id="btn-status-reset">
                        <i class="fa-solid fa-plus"></i> Send Another Message
                    </button>
                </div>
            `;

            statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const statusResetBtn = document.getElementById('btn-status-reset');
            if (statusResetBtn) {
                statusResetBtn.addEventListener('click', () => {
                    statusBanner.classList.remove('visible');
                    statusBanner.innerHTML = '';
                    focusFirstFormField();
                });
            }
        }

        function displaySubmissionError(errorMessage) {
            if (!statusBanner) return;
            statusBanner.className = 'contact-status-banner status-error visible';
            statusBanner.setAttribute('role', 'alert');
            statusBanner.innerHTML = `
                <div class="status-header">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <h4>Unable to Send Message</h4>
                </div>
                <div class="status-body">
                    <p>${escapeHtml(errorMessage)}</p>
                </div>
            `;
            statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    }
})();
