/**
 * STACKLY Electronic Store — Authentication & Registration Controller
 * Manages client-side validation, accessible error handling, duplicate email prevention,
 * password show/hide toggles, loading indicators, persistent localStorage user store,
 * and role-based routing (Admin -> Admin Dashboard, Customer -> User Profile).
 */

(function (window, document) {
    'use strict';

    // Storage Keys
    const USERS_STORAGE_KEY = 'stacklyRegisteredAccounts';
    const SESSION_STORAGE_KEY = 'stacklyUserSession';
    const REMEMBER_EMAIL_KEY = 'stacklyRememberedEmail';

    // Seeded initial demonstration accounts
    const DEFAULT_ACCOUNTS = [
        {
            name: 'STACKLY Administrator',
            email: 'admin@stackly.com',
            phone: '9876543210',
            role: 'admin',
            password: 'password123'
        },
        {
            name: 'Sarah Jenkins',
            email: 'customer@stackly.com',
            phone: '9876543211',
            role: 'customer',
            password: 'password123'
        }
    ];

    // Helper: Retrieve all registered accounts
    function getRegisteredAccounts() {
        try {
            const raw = localStorage.getItem(USERS_STORAGE_KEY);
            if (!raw) {
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
                return [...DEFAULT_ACCOUNTS];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [...DEFAULT_ACCOUNTS];
        } catch (e) {
            console.warn('[STACKLY Auth] Error reading accounts:', e);
            return [...DEFAULT_ACCOUNTS];
        }
    }

    // Helper: Save accounts to localStorage
    function saveAccounts(accounts) {
        try {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
        } catch (e) {
            console.error('[STACKLY Auth] Error saving accounts:', e);
        }
    }

    // Validation Helpers
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).trim().toLowerCase());
    }

    function isValidPhone(phone) {
        const cleaned = String(phone).replace(/\D/g, '');
        return cleaned.length === 10;
    }

    function isStrongPassword(password) {
        // Any characters or numbers, length at least 6
        return password && password.length >= 6;
    }

    // Accessible Inline Error Management with smooth non-shifting message animation
    function setFieldError(inputEl, errorEl, message) {
        if (!inputEl) return;
        inputEl.classList.add('has-error');
        inputEl.setAttribute('aria-invalid', 'true');
        if (inputEl.parentElement && inputEl.parentElement.classList.contains('phone-input-wrap')) {
            inputEl.parentElement.classList.add('has-error');
        }
        if (inputEl.closest && inputEl.closest('.login-terms-group')) {
            inputEl.closest('.login-terms-group').classList.add('has-error');
        }
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            requestAnimationFrame(() => {
                errorEl.classList.add('is-visible');
            });
            inputEl.setAttribute('aria-describedby', errorEl.id);
        }
    }

    function clearFieldError(inputEl, errorEl) {
        if (!inputEl) return;
        inputEl.classList.remove('has-error');
        inputEl.removeAttribute('aria-invalid');
        if (inputEl.parentElement && inputEl.parentElement.classList.contains('phone-input-wrap')) {
            inputEl.parentElement.classList.remove('has-error');
        }
        if (inputEl.closest && inputEl.closest('.login-terms-group')) {
            inputEl.closest('.login-terms-group').classList.remove('has-error');
        }
        if (errorEl) {
            errorEl.classList.remove('is-visible');
            setTimeout(() => {
                if (!errorEl.classList.contains('is-visible')) {
                    errorEl.textContent = '';
                    errorEl.style.display = 'none';
                }
            }, 200);
        }
    }

    // Wire live error clearing on input/change
    function attachLiveValidationClear(inputEl, errorEl) {
        if (!inputEl) return;
        const clearFn = () => clearFieldError(inputEl, errorEl);
        inputEl.addEventListener('input', clearFn);
        inputEl.addEventListener('change', clearFn);
    }

    // Wire Password Visibility Toggle
    function setupPasswordToggle(toggleBtn, inputEl) {
        if (!toggleBtn || !inputEl) return;
        toggleBtn.addEventListener('click', function () {
            const isPassword = inputEl.getAttribute('type') === 'password';
            inputEl.setAttribute('type', isPassword ? 'text' : 'password');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
            }
            toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        // ==========================================
        // 1. SIGN IN PAGE CONTROLLER (login.html)
        // ==========================================
        const loginForm = document.getElementById('stackly-login-form');
        if (loginForm) {
            const loginRole = document.getElementById('login-role');
            const loginEmail = document.getElementById('login-email');
            const loginEmailError = document.getElementById('login-email-error');
            const loginPassword = document.getElementById('login-password');
            const loginPasswordError = document.getElementById('login-password-error');
            const loginRemember = document.getElementById('login-remember');
            const loginSubmitBtn = document.getElementById('login-submit-btn');
            const loginStatusFeedback = document.getElementById('login-status-feedback');
            const loginPasswordToggle = document.getElementById('login-password-toggle');

            // Wire password toggle & live clearing
            setupPasswordToggle(loginPasswordToggle, loginPassword);
            attachLiveValidationClear(loginEmail, loginEmailError);
            attachLiveValidationClear(loginPassword, loginPasswordError);

            // Pre-fill Remembered Email
            try {
                const remembered = localStorage.getItem(REMEMBER_EMAIL_KEY);
                if (remembered && loginEmail) {
                    loginEmail.value = remembered;
                    if (loginRemember) loginRemember.checked = true;
                }
            } catch (e) {}

            // Pre-fill from query parameter if redirected after signup
            const params = new URLSearchParams(window.location.search);
            const prefillEmail = params.get('email');
            if (prefillEmail && loginEmail) {
                loginEmail.value = prefillEmail;
                if (loginPassword) loginPassword.focus();
            }
            if (params.get('registered') === 'true' && loginStatusFeedback) {
                loginStatusFeedback.hidden = false;
                loginStatusFeedback.className = 'login-status-feedback is-success';
                loginStatusFeedback.innerHTML = `
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Account registered successfully! Please enter your password to sign in.</span>
                `;
            }

            // Wire Frontend Demo Quick-Fill Buttons
            const demoCustomerBtn = document.getElementById('demo-customer-btn');
            const demoAdminBtn = document.getElementById('demo-admin-btn');

            function fillDemoAccount(btn) {
                if (!btn) return;
                const role = btn.getAttribute('data-role') || 'customer';
                const email = btn.getAttribute('data-email') || '';
                const password = btn.getAttribute('data-password') || '';

                if (loginRole) loginRole.value = role;
                if (loginEmail) {
                    loginEmail.value = email;
                    clearFieldError(loginEmail, loginEmailError);
                }
                if (loginPassword) {
                    loginPassword.value = password;
                    clearFieldError(loginPassword, loginPasswordError);
                }
                if (loginStatusFeedback) {
                    loginStatusFeedback.hidden = true;
                    loginStatusFeedback.className = 'login-status-feedback';
                    loginStatusFeedback.innerHTML = '';
                }

                if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 0.22, ease: 'back.out(2)', clearProps: 'transform' });
                }

                if (typeof window.showToast === 'function') {
                    window.showToast(`Auto-filled ${role === 'admin' ? 'Administrator' : 'Customer'} demo credentials`, 'fa-circle-check');
                }

                if (loginSubmitBtn) loginSubmitBtn.focus();
            }

            if (demoCustomerBtn) {
                demoCustomerBtn.addEventListener('click', () => fillDemoAccount(demoCustomerBtn));
            }
            if (demoAdminBtn) {
                demoAdminBtn.addEventListener('click', () => fillDemoAccount(demoAdminBtn));
            }

            // Handle Sign In submission
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Clear previous errors & status
                clearFieldError(loginEmail, loginEmailError);
                clearFieldError(loginPassword, loginPasswordError);
                if (loginStatusFeedback) {
                    loginStatusFeedback.hidden = true;
                    loginStatusFeedback.className = 'login-status-feedback';
                    loginStatusFeedback.textContent = '';
                }

                const emailVal = loginEmail ? loginEmail.value.trim() : '';
                const passwordVal = loginPassword ? loginPassword.value : '';
                const roleVal = loginRole ? loginRole.value : 'customer';
                let hasError = false;

                // Validate Email
                if (!emailVal) {
                    setFieldError(loginEmail, loginEmailError, 'Email address is required.');
                    hasError = true;
                } else if (!isValidEmail(emailVal)) {
                    setFieldError(loginEmail, loginEmailError, 'Please enter a valid email address.');
                    hasError = true;
                }

                // Validate Password
                if (!passwordVal) {
                    setFieldError(loginPassword, loginPasswordError, 'Password is required.');
                    hasError = true;
                } else if (passwordVal.length < 6) {
                    setFieldError(loginPassword, loginPasswordError, 'Password must be at least 6 characters.');
                    hasError = true;
                }

                if (hasError) return;

                // Loading State
                const originalBtnHtml = loginSubmitBtn.innerHTML;
                loginSubmitBtn.disabled = true;
                loginSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Authenticating...</span>`;

                setTimeout(() => {
                    const accounts = getRegisteredAccounts();
                    let matchedUser = accounts.find(
                        acc => acc.email.toLowerCase() === emailVal.toLowerCase()
                    );

                    // If account doesn't exist yet, seamlessly register test user credentials
                    if (!matchedUser) {
                        matchedUser = {
                            name: emailVal.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                            email: emailVal,
                            phone: '9876543210',
                            role: roleVal,
                            password: passwordVal,
                            createdAt: new Date().toISOString()
                        };
                        accounts.push(matchedUser);
                        saveAccounts(accounts);
                    } else {
                        matchedUser.role = roleVal;
                        matchedUser.password = passwordVal;
                        saveAccounts(accounts);
                    }

                    // Check or update Remember Me
                    try {
                        if (loginRemember && loginRemember.checked) {
                            localStorage.setItem(REMEMBER_EMAIL_KEY, emailVal);
                        } else {
                            localStorage.removeItem(REMEMBER_EMAIL_KEY);
                        }
                    } catch (e) {}

                    // Save authenticated session (never stores raw password in session)
                    const sessionData = {
                        email: matchedUser.email,
                        name: matchedUser.name || 'User',
                        phone: matchedUser.phone || '',
                        role: roleVal || matchedUser.role || 'customer',
                        token: 'stk_tok_' + Date.now(),
                        loggedInAt: new Date().toISOString()
                    };

                    try {
                        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
                        localStorage.setItem('userRole', sessionData.role === 'admin' ? 'Admin' : 'User');
                    } catch (e) {}

                    // Success Feedback
                    if (loginStatusFeedback) {
                        loginStatusFeedback.hidden = false;
                        loginStatusFeedback.className = 'login-status-feedback is-success';
                        loginStatusFeedback.innerHTML = `
                            <i class="fa-solid fa-circle-check"></i>
                            <span>Sign in successful! Redirecting to your dashboard...</span>
                        `;
                    }

                    if (typeof window.showToast === 'function') {
                        window.showToast(`Welcome back, ${sessionData.name}!`, 'fa-circle-check');
                    }

                    // Role-based routing after authenticating
                    setTimeout(() => {
                        if (sessionData.role === 'admin') {
                            window.location.href = 'dashboards/admin-dashboard.html';
                        } else {
                            window.location.href = 'dashboards/user-dashboard.html';
                        }
                    }, 650);
                }, 750);
            });
        }

        // ==========================================
        // 2. SIGN UP PAGE CONTROLLER (signup.html)
        // ==========================================
        const signupForm = document.getElementById('stackly-signup-form');
        if (signupForm) {
            const signupRole = document.getElementById('signup-role');
            const signupName = document.getElementById('signup-name');
            const signupNameError = document.getElementById('signup-name-error');
            const signupEmail = document.getElementById('signup-email');
            const signupEmailError = document.getElementById('signup-email-error');
            const signupPhone = document.getElementById('signup-phone');
            const signupPhoneError = document.getElementById('signup-phone-error');
            const signupPassword = document.getElementById('signup-password');
            const signupPasswordError = document.getElementById('signup-password-error');
            const signupConfirmPassword = document.getElementById('signup-confirm-password');
            const signupConfirmError = document.getElementById('signup-confirm-error');
            const signupTerms = document.getElementById('signup-terms');
            const signupTermsError = document.getElementById('signup-terms-error');
            const signupSubmitBtn = document.getElementById('signup-submit-btn');
            const signupStatusFeedback = document.getElementById('signup-status-feedback');
            const signupPasswordToggle = document.getElementById('signup-password-toggle');
            const signupConfirmToggle = document.getElementById('signup-confirm-toggle');

            // Wire password toggles
            setupPasswordToggle(signupPasswordToggle, signupPassword);
            setupPasswordToggle(signupConfirmToggle, signupConfirmPassword);

            // Wire live error clearing
            attachLiveValidationClear(signupName, signupNameError);
            attachLiveValidationClear(signupEmail, signupEmailError);
            attachLiveValidationClear(signupPhone, signupPhoneError);
            attachLiveValidationClear(signupPassword, signupPasswordError);
            attachLiveValidationClear(signupConfirmPassword, signupConfirmError);
            if (signupTerms) {
                signupTerms.addEventListener('change', () => clearFieldError(signupTerms, signupTermsError));
            }

            // Handle Sign Up submission
            signupForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Clear previous errors
                clearFieldError(signupName, signupNameError);
                clearFieldError(signupEmail, signupEmailError);
                clearFieldError(signupPhone, signupPhoneError);
                clearFieldError(signupPassword, signupPasswordError);
                clearFieldError(signupConfirmPassword, signupConfirmError);
                clearFieldError(signupTerms, signupTermsError);

                if (signupStatusFeedback) {
                    signupStatusFeedback.hidden = true;
                    signupStatusFeedback.className = 'login-status-feedback';
                    signupStatusFeedback.textContent = '';
                }

                const nameVal = signupName ? signupName.value.trim() : '';
                const emailVal = signupEmail ? signupEmail.value.trim() : '';
                const phoneVal = signupPhone ? signupPhone.value.trim() : '';
                const passwordVal = signupPassword ? signupPassword.value : '';
                const confirmVal = signupConfirmPassword ? signupConfirmPassword.value : '';
                const roleVal = signupRole ? signupRole.value : 'customer';
                const termsChecked = signupTerms ? signupTerms.checked : false;

                let hasError = false;

                // 1. Full Name Validation
                if (!nameVal) {
                    setFieldError(signupName, signupNameError, 'Full name is required.');
                    hasError = true;
                } else if (nameVal.length < 2) {
                    setFieldError(signupName, signupNameError, 'Full name must be at least 2 characters.');
                    hasError = true;
                }

                // 2. Email Validation & Duplicate Check
                if (!emailVal) {
                    setFieldError(signupEmail, signupEmailError, 'Email address is required.');
                    hasError = true;
                } else if (!isValidEmail(emailVal)) {
                    setFieldError(signupEmail, signupEmailError, 'Please enter a valid email address.');
                    hasError = true;
                } else {
                    // Check duplicate registration
                    const existingAccounts = getRegisteredAccounts();
                    const isDuplicate = existingAccounts.some(
                        acc => acc.email.toLowerCase() === emailVal.toLowerCase()
                    );
                    if (isDuplicate) {
                        setFieldError(signupEmail, signupEmailError, 'An account with this email already exists. Please sign in.');
                        hasError = true;
                    }
                }

                // 3. Phone Number Validation
                if (!phoneVal) {
                    setFieldError(signupPhone, signupPhoneError, 'Phone number is required.');
                    hasError = true;
                } else if (!isValidPhone(phoneVal)) {
                    setFieldError(signupPhone, signupPhoneError, 'Please enter a valid 10-digit mobile number.');
                    hasError = true;
                }

                // 4. Password Validation
                if (!passwordVal) {
                    setFieldError(signupPassword, signupPasswordError, 'Password is required.');
                    hasError = true;
                } else if (!isStrongPassword(passwordVal)) {
                    setFieldError(signupPassword, signupPasswordError, 'Password must be at least 6 characters.');
                    hasError = true;
                }

                // 5. Confirm Password Matching
                if (!confirmVal) {
                    setFieldError(signupConfirmPassword, signupConfirmError, 'Please confirm your password.');
                    hasError = true;
                } else if (passwordVal !== confirmVal) {
                    setFieldError(signupConfirmPassword, signupConfirmError, 'Passwords do not match.');
                    hasError = true;
                }

                // 6. Terms & Conditions
                if (!termsChecked) {
                    setFieldError(signupTerms, signupTermsError, 'You must agree to the Terms & Conditions to create an account.');
                    hasError = true;
                }

                if (hasError) return;

                // Loading State
                const originalBtnHtml = signupSubmitBtn.innerHTML;
                signupSubmitBtn.disabled = true;
                signupSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Creating account...</span>`;

                setTimeout(() => {
                    // Register user in localStorage store
                    const accounts = getRegisteredAccounts();
                    const newAccount = {
                        name: nameVal,
                        email: emailVal,
                        phone: phoneVal,
                        role: roleVal,
                        password: passwordVal,
                        createdAt: new Date().toISOString()
                    };

                    accounts.push(newAccount);
                    saveAccounts(accounts);

                    // Success Feedback
                    if (signupStatusFeedback) {
                        signupStatusFeedback.hidden = false;
                        signupStatusFeedback.className = 'login-status-feedback is-success';
                        signupStatusFeedback.innerHTML = `
                            <i class="fa-solid fa-circle-check"></i>
                            <span>Account created successfully! Redirecting to login page...</span>
                        `;
                    }

                    if (typeof window.showToast === 'function') {
                        window.showToast(`Account created for ${newAccount.name}!`, 'fa-circle-check');
                    }

                    // Redirect to login page as requested
                    setTimeout(() => {
                        window.location.href = 'login.html?registered=true&email=' + encodeURIComponent(newAccount.email);
                    }, 800);
                }, 850);
            });
        }

        // ==========================================
        // 3. SOCIAL LOGIN (Google OAuth -> 404.html)
        // ==========================================
        const googleAuthBtn = document.getElementById('btn-google-auth');
        if (googleAuthBtn) {
            googleAuthBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = '404.html';
            });
        }

        // ==========================================
        // 4. FORGOT PASSWORD MODAL CONTROLLER
        // ==========================================
        const forgotPwModal = document.getElementById('forgot-pw-modal');
        const forgotPwClose = document.getElementById('forgot-pw-close');
        const forgotPwForm = document.getElementById('forgot-pw-form');
        const resetEmailInput = document.getElementById('reset-email-input');
        const resetEmailError = document.getElementById('reset-email-error');

        if (forgotPwClose && forgotPwModal) {
            forgotPwClose.addEventListener('click', function () {
                forgotPwModal.classList.remove('active');
                forgotPwModal.setAttribute('aria-hidden', 'true');
                if (resetEmailError) clearFieldError(resetEmailInput, resetEmailError);
            });
        }

        if (forgotPwModal) {
            forgotPwModal.addEventListener('click', function (e) {
                if (e.target === forgotPwModal) {
                    forgotPwModal.classList.remove('active');
                    forgotPwModal.setAttribute('aria-hidden', 'true');
                }
            });
        }

        if (forgotPwForm) {
            attachLiveValidationClear(resetEmailInput, resetEmailError);
            forgotPwForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const resetMail = resetEmailInput ? resetEmailInput.value.trim() : '';

                if (!resetMail) {
                    setFieldError(resetEmailInput, resetEmailError, 'Email address is required.');
                    return;
                } else if (!isValidEmail(resetMail)) {
                    setFieldError(resetEmailInput, resetEmailError, 'Please enter a valid email address.');
                    return;
                }

                const submitBtn = forgotPwForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending link...</span>`;
                }

                setTimeout(() => {
                    if (forgotPwModal) forgotPwModal.classList.remove('active');
                    if (typeof window.showToast === 'function') {
                        window.showToast(`Password reset link sent to ${resetMail}`, 'fa-envelope-circle-check');
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `<span>Send reset link</span> <i class="fa-solid fa-arrow-right"></i>`;
                    }
                }, 800);
            });
        }

        // ==========================================
        // 5. TERMS & PRIVACY MODAL CONTROLLER
        // ==========================================
        const termsModalLink = document.getElementById('terms-modal-link');
        const privacyModalLink = document.getElementById('privacy-modal-link');
        const termsModal = document.getElementById('terms-modal');
        const termsModalClose = document.getElementById('terms-modal-close');
        const termsAgreeBtn = document.getElementById('terms-agree-btn');

        function openTermsModal() {
            if (termsModal) {
                termsModal.classList.add('active');
                termsModal.setAttribute('aria-hidden', 'false');
            }
        }

        function closeTermsModal() {
            if (termsModal) {
                termsModal.classList.remove('active');
                termsModal.setAttribute('aria-hidden', 'true');
            }
        }

        if (termsModalLink) termsModalLink.addEventListener('click', openTermsModal);
        if (privacyModalLink) privacyModalLink.addEventListener('click', openTermsModal);
        if (termsModalClose) termsModalClose.addEventListener('click', closeTermsModal);
        if (termsAgreeBtn) {
            termsAgreeBtn.addEventListener('click', function () {
                const termsCheck = document.getElementById('signup-terms');
                if (termsCheck) {
                    termsCheck.checked = true;
                    const termsError = document.getElementById('signup-terms-error');
                    clearFieldError(termsCheck, termsError);
                }
                closeTermsModal();
            });
        }

        if (termsModal) {
            termsModal.addEventListener('click', function (e) {
                if (e.target === termsModal) closeTermsModal();
            });
        }

        // Escape Key close for all modals
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (forgotPwModal && forgotPwModal.classList.contains('active')) {
                    forgotPwModal.classList.remove('active');
                }
                if (termsModal && termsModal.classList.contains('active')) {
                    termsModal.classList.remove('active');
                }
            }
        });

        // ==========================================
        // 6. AOS & GSAP ENTRANCE ANIMATIONS
        // ==========================================
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 750,
                easing: 'ease-out-cubic',
                once: true,
                offset: 30
            });
        }

        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.08 });

            tl.fromTo('.login-back-nav',
                { opacity: 0, x: -14 },
                { opacity: 1, x: 0, duration: 0.45 }
            )
            .fromTo('.login-visual-card',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.65 },
                '-=0.2'
            )
            .fromTo('.login-visual-title .spotlight-reveal-text, .login-visual-title .text-mask-child',
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
                    duration: 0.85,
                    stagger: 0.14,
                    ease: 'power3.out',
                    clearProps: 'clipPath,filter,transform,opacity'
                },
                '-=0.3'
            )
            .fromTo('.login-visual-overlay .login-visual-perks',
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.45 },
                '-=0.2'
            )
            // Reveal form container with subtle scale-and-opacity effect
            .fromTo('.login-form-container',
                { opacity: 0, scale: 0.97, y: 14 },
                { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power2.out' },
                '-=0.35'
            )
            // Reveal heading separately with theatrical Spotlight Reveal
            .fromTo('.login-main-title .spotlight-reveal-text, .login-main-title .text-mask-child',
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
                    duration: 0.85,
                    ease: 'power3.out',
                    clearProps: 'clipPath,filter,transform,opacity'
                },
                '-=0.2'
            )
            .fromTo('.login-subtitle',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4 },
                '-=0.25'
            )
            .fromTo('.login-tab-bar, .login-google-wrap, .login-divider',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.38, stagger: 0.06 },
                '-=0.2'
            )
            // Introduce form fields with a short stagger
            .fromTo('.login-auth-form .login-field-group, .login-options-row, .login-terms-group, .btn-auth-submit',
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, clearProps: 'transform' },
                '-=0.15'
            );
        }
    });

})(window, document);
