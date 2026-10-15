/**
 * STACKLY Electronic Store - Checkout Controller
 * Handles live cart synchronization, Indian mobile & PIN code validation,
 * delivery options calculation, mock/demo order placement, and order confirmation display.
 */

(function(window) {
    'use strict';

    const ORDERS_STORAGE_KEY = 'stacklyOrders';

    // State variables
    let currentDeliveryMethod = 'express'; // 'express' or 'standard'

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const CheckoutController = {
        init: function() {
            this.bindEvents();
            this.renderOrderSummary();

            // Safe AOS initialization
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 600,
                    easing: 'ease-out-cubic',
                    once: true,
                    offset: 60
                });
            }

            // Restrained GSAP entrance: Reveal main heading, form groups, and order summary without delaying interaction
            if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.08 });
                tl.fromTo('.checkout-header-text h1 .spotlight-reveal-text, .checkout-header-text h1 .text-mask-child',
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
                    }
                )
                .fromTo('.checkout-header-text .subtitle',
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.45 },
                    '-=0.2'
                )
                .fromTo('.checkout-card-section',
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, clearProps: 'transform' },
                    '-=0.15'
                )
                .fromTo('.checkout-summary-card',
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.45, clearProps: 'transform' },
                    '<+=0.08' // In parallel, without delaying user interaction
                );
            }
        },

        bindEvents: function() {
            const form = document.getElementById('checkout-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleSubmit(e));
            }

            // Real-time input validation to clear error states
            const formInputs = document.querySelectorAll('#checkout-form input, #checkout-form select');
            formInputs.forEach(input => {
                input.addEventListener('input', () => this.clearFieldError(input));
                input.addEventListener('change', () => this.clearFieldError(input));
            });

            // Delivery method radio buttons
            const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
            deliveryRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    currentDeliveryMethod = e.target.value;
                    this.renderOrderSummary();
                });
            });

            // Payment method selector visuals
            const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
            paymentRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    document.querySelectorAll('.payment-method-card').forEach(card => card.classList.remove('selected'));
                    const parentCard = e.target.closest('.payment-method-card');
                    if (parentCard) {
                        parentCard.classList.add('selected');
                        if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                            gsap.fromTo(parentCard, { scale: 0.99 }, { scale: 1, duration: 0.15, ease: 'power2.out' });
                        }
                    }
                });
            });

            // Mobile number formatting (allow only digits)
            const phoneInput = document.getElementById('checkout-phone');
            if (phoneInput) {
                phoneInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                });
            }

            // PIN code formatting (allow only 6 digits)
            const pinInput = document.getElementById('checkout-pincode');
            if (pinInput) {
                pinInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                });
            }

            // Listen for external cart changes
            window.addEventListener('stackly:cart-updated', () => {
                this.renderOrderSummary();
            });
            window.addEventListener('storage', (e) => {
                if (e.key === 'stacklyCart') this.renderOrderSummary();
            });
        },

        clearFieldError: function(input) {
            input.classList.remove('is-invalid');
            const parent = input.closest('.form-group');
            if (parent) {
                const err = parent.querySelector('.field-error-msg');
                if (err) {
                    err.classList.remove('is-visible');
                    setTimeout(() => {
                        if (!err.classList.contains('is-visible')) {
                            err.textContent = '';
                        }
                    }, 200);
                }
            }
        },

        setFieldError: function(input, message) {
            input.classList.add('is-invalid');
            const parent = input.closest('.form-group');
            if (parent) {
                let err = parent.querySelector('.field-error-msg');
                if (!err) {
                    err = document.createElement('span');
                    err.className = 'field-error-msg';
                    parent.appendChild(err);
                }
                err.textContent = message;
                requestAnimationFrame(() => {
                    err.classList.add('is-visible');
                });
            }
        },

        // Render Checkout Order Summary
        renderOrderSummary: function() {
            if (!window.StacklyCart) return;

            const items = window.StacklyCart.getItems();
            const itemsListEl = document.getElementById('checkout-items-list');
            const subtotalEl = document.getElementById('checkout-subtotal');
            const discountRow = document.getElementById('checkout-discount-row');
            const discountEl = document.getElementById('checkout-discount');
            const shippingEl = document.getElementById('checkout-shipping');
            const finalTotalEl = document.getElementById('checkout-final-total');
            const emptyNotice = document.getElementById('checkout-empty-notice');
            const formSection = document.getElementById('checkout-form-section');
            const orderSummaryBox = document.getElementById('checkout-summary-box');

            // Handle empty cart
            if (items.length === 0) {
                if (emptyNotice) emptyNotice.style.display = 'block';
                if (formSection) formSection.style.display = 'none';
                if (orderSummaryBox) orderSummaryBox.style.display = 'none';
                return;
            }

            if (emptyNotice) emptyNotice.style.display = 'none';
            if (formSection) formSection.style.display = 'block';
            if (orderSummaryBox) orderSummaryBox.style.display = 'block';

            const summary = window.StacklyCart.getSummary();

            // Calculate shipping based on selection & rules
            let shippingFee = 0;
            if (currentDeliveryMethod === 'express') {
                shippingFee = (summary.subtotal >= 75.00) ? 0 : 15.00;
            } else {
                shippingFee = 0; // Standard shipping is complimentary
            }

            const grandTotal = summary.subtotal + shippingFee;

            // Render Items
            if (itemsListEl) {
                let itemsHtml = '';
                items.forEach(item => {
                    const qty = parseInt(item.quantity, 10) || 1;
                    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                    const lineSubtotal = formatCurrency(priceNum * qty);
                    const variantText = item.color || 'Standard';

                    itemsHtml += `
                        <div class="checkout-product-item">
                            <div class="checkout-item-thumb">
                                <img src="${item.image}" alt="${item.name}">
                                <span class="checkout-item-qty-badge">${qty}</span>
                            </div>
                            <div class="checkout-item-details">
                                <h4 class="checkout-item-name">${item.name}</h4>
                                <div class="checkout-item-meta">
                                    <span class="variant-tag">${variantText}</span>
                                    <span class="unit-price-text">${item.price} each</span>
                                </div>
                            </div>
                            <div class="checkout-item-price">
                                <span>${lineSubtotal}</span>
                            </div>
                        </div>
                    `;
                });
                itemsListEl.innerHTML = itemsHtml;

                // Animate dynamic checkout items with GSAP
                if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.fromTo('.checkout-product-item', 
                        { opacity: 0, y: 12 }, 
                        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
                    );
                }
            }

            // Update Summary Line Items
            if (subtotalEl) subtotalEl.textContent = summary.subtotalFormatted;
            
            if (discountRow && discountEl) {
                if (summary.savings > 0) {
                    discountRow.style.display = 'flex';
                    discountEl.textContent = `-${summary.savingsFormatted}`;
                } else {
                    discountRow.style.display = 'none';
                }
            }

            if (shippingEl) {
                if (shippingFee === 0) {
                    shippingEl.innerHTML = '<span class="free-shipping-pill"><i class="fa-solid fa-circle-check"></i> FREE</span>';
                } else {
                    shippingEl.textContent = formatCurrency(shippingFee);
                }
            }

            if (finalTotalEl) finalTotalEl.textContent = formatCurrency(grandTotal);

            // Update delivery radio labels with accurate costs
            const expressLabel = document.getElementById('express-shipping-cost');
            if (expressLabel) {
                expressLabel.textContent = (summary.subtotal >= 75.00) ? 'FREE (Orders over $75)' : '$15.00';
            }
        },

        // Validate form fields
        validateForm: function() {
            let isValid = true;

            const nameInput = document.getElementById('checkout-name');
            const emailInput = document.getElementById('checkout-email');
            const phoneInput = document.getElementById('checkout-phone');
            const buildingInput = document.getElementById('checkout-building');
            const streetInput = document.getElementById('checkout-street');
            const cityInput = document.getElementById('checkout-city');
            const stateInput = document.getElementById('checkout-state');
            const pinInput = document.getElementById('checkout-pincode');
            const countryInput = document.getElementById('checkout-country');

            // 1. Full Name
            if (!nameInput || !nameInput.value.trim()) {
                this.setFieldError(nameInput, 'Full name is required.');
                isValid = false;
            } else if (nameInput.value.trim().length < 3) {
                this.setFieldError(nameInput, 'Please enter a valid full name (at least 3 characters).');
                isValid = false;
            }

            // 2. Email Address
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailInput || !emailInput.value.trim()) {
                this.setFieldError(emailInput, 'Email address is required.');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                this.setFieldError(emailInput, 'Please enter a valid email address (e.g., name@domain.com).');
                isValid = false;
            }

            // 3. Indian Mobile Number (10 digits, starts with 6-9)
            const phoneVal = phoneInput ? phoneInput.value.trim() : '';
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneInput || !phoneVal) {
                this.setFieldError(phoneInput, 'Mobile number is required.');
                isValid = false;
            } else if (!phoneRegex.test(phoneVal)) {
                this.setFieldError(phoneInput, 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
                isValid = false;
            }

            // 4. House / Flat / Building
            if (!buildingInput || !buildingInput.value.trim()) {
                this.setFieldError(buildingInput, 'House/Flat/Building information is required.');
                isValid = false;
            }

            // 5. Street / Area
            if (!streetInput || !streetInput.value.trim()) {
                this.setFieldError(streetInput, 'Street/Area address is required.');
                isValid = false;
            }

            // 6. City
            if (!cityInput || !cityInput.value.trim()) {
                this.setFieldError(cityInput, 'City is required.');
                isValid = false;
            }

            // 7. State
            if (!stateInput || !stateInput.value.trim()) {
                this.setFieldError(stateInput, 'State is required.');
                isValid = false;
            }

            // 8. Indian PIN Code (6 digits, does not start with 0)
            const pinVal = pinInput ? pinInput.value.trim() : '';
            const pinRegex = /^[1-9]\d{5}$/;
            if (!pinInput || !pinVal) {
                this.setFieldError(pinInput, 'PIN Code is required.');
                isValid = false;
            } else if (!pinRegex.test(pinVal)) {
                this.setFieldError(pinInput, 'Please enter a valid 6-digit Indian PIN Code.');
                isValid = false;
            }

            // 9. Country
            if (!countryInput || !countryInput.value.trim()) {
                this.setFieldError(countryInput, 'Country is required.');
                isValid = false;
            }

            return isValid;
        },

        // Handle order submission
        handleSubmit: function(e) {
            e.preventDefault();

            // Check if cart has items
            const items = window.StacklyCart ? window.StacklyCart.getItems() : [];
            if (items.length === 0) {
                if (window.StacklyCart) {
                    window.StacklyCart.showToast('Your cart is empty. Please add items before checking out.', 'fa-circle-exclamation');
                }
                return;
            }

            // Validate form
            const isFormValid = this.validateForm();
            if (!isFormValid) {
                // Focus first invalid element
                const firstInvalid = document.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                if (window.StacklyCart) {
                    window.StacklyCart.showToast('Please correct the highlighted errors before submitting.', 'fa-circle-exclamation');
                }
                return;
            }

            const submitBtn = document.getElementById('btn-place-order');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...';
            }

            // Collect Form Information
            const selectedPaymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
            const paymentMethodName = selectedPaymentRadio ? selectedPaymentRadio.getAttribute('data-name') : 'Cash on Delivery';

            const summary = window.StacklyCart.getSummary();
            const shippingFee = (currentDeliveryMethod === 'express' && summary.subtotal < 75.00) ? 15.00 : 0;
            const grandTotal = summary.subtotal + shippingFee;

            const orderRef = 'STK-' + Math.floor(100000 + Math.random() * 900000);
            const orderDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            const orderData = {
                orderId: orderRef,
                date: orderDate,
                customer: {
                    name: document.getElementById('checkout-name').value.trim(),
                    email: document.getElementById('checkout-email').value.trim(),
                    phone: document.getElementById('checkout-phone').value.trim(),
                    address: {
                        building: document.getElementById('checkout-building').value.trim(),
                        street: document.getElementById('checkout-street').value.trim(),
                        city: document.getElementById('checkout-city').value.trim(),
                        state: document.getElementById('checkout-state').value.trim(),
                        pincode: document.getElementById('checkout-pincode').value.trim(),
                        country: document.getElementById('checkout-country').value.trim()
                    }
                },
                deliveryMethod: currentDeliveryMethod === 'express' ? 'Express Delivery (2-4 Business Days)' : 'Standard Delivery (3-5 Business Days)',
                paymentMethod: paymentMethodName,
                items: [...items],
                subtotal: summary.subtotalFormatted,
                shipping: shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee),
                discount: summary.savings > 0 ? `-${summary.savingsFormatted}` : '$0.00',
                total: formatCurrency(grandTotal),
                status: 'Confirmed (Demo)'
            };

            // Save order to customer dashboard orders list
            try {
                let existingOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
                existingOrders.unshift(orderData);
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existingOrders));
            } catch (err) {
                console.error('Failed to record order:', err);
            }

            // Simulate realistic processing delay then display confirmation
            setTimeout(() => {
                // Clear the shopping cart
                if (window.StacklyCart) {
                    window.StacklyCart.clearCart();
                }

                // Show confirmation modal/card
                this.showConfirmation(orderData);
            }, 800);
        },

        showConfirmation: function(order) {
            const checkoutWrapper = document.getElementById('checkout-main-grid');
            const confirmationSection = document.getElementById('checkout-confirmation-section');

            if (checkoutWrapper) checkoutWrapper.style.display = 'none';
            if (confirmationSection) {
                // Populate confirmation values
                const refEl = document.getElementById('conf-order-id');
                const nameEl = document.getElementById('conf-customer-name');
                const emailEl = document.getElementById('conf-customer-email');
                const totalEl = document.getElementById('conf-order-total');
                const paymentEl = document.getElementById('conf-payment-method');
                const addressEl = document.getElementById('conf-shipping-address');
                const deliveryEl = document.getElementById('conf-delivery-estimate');

                if (refEl) refEl.textContent = '#' + order.orderId;
                if (nameEl) nameEl.textContent = order.customer.name;
                if (emailEl) emailEl.textContent = order.customer.email;
                if (totalEl) totalEl.textContent = order.total;
                if (paymentEl) paymentEl.textContent = order.paymentMethod;
                if (addressEl) {
                    const a = order.customer.address;
                    addressEl.textContent = `${a.building}, ${a.street}, ${a.city}, ${a.state} - ${a.pincode}, ${a.country}`;
                }
                if (deliveryEl) deliveryEl.textContent = order.deliveryMethod;

                confirmationSection.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });

                if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.fromTo(confirmationSection, 
                        { opacity: 0, scale: 0.95, y: 25 }, 
                        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                    );
                }
            }
        }
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CheckoutController.init());
    } else {
        CheckoutController.init();
    }

    window.CheckoutController = CheckoutController;

})(window);
