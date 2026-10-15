/**
 * STACKLY Electronic Store - Shopping Cart Manager
 * Unified cart state management, localStorage persistence, line-item quantity manipulation,
 * variant preservation, order summary calculations (subtotal, shipping, discount, grand total),
 * badge synchronization, and dynamic Cart page rendering.
 */

(function(window) {
    'use strict';

    const CART_STORAGE_KEY = 'stacklyCart';
    const FREE_SHIPPING_THRESHOLD = 75.00;
    const STANDARD_SHIPPING_FEE = 15.00;

    // Catalog metadata fallback for prices, variants, images, and category
    const CATALOG_METADATA = {
        'pro-display-x1': { cat: 'Monitors', price: '$899.00', oldPrice: '$999.00', color: 'Space Black', img: 'assets/img/monitor.webp' },
        'play-one-console': { cat: 'Gaming Consoles', price: '$449.00', oldPrice: '$499.00', color: 'Matte White', img: 'assets/img/shop-console.webp' },
        'book-air-14': { cat: 'Laptops', price: '$799.00', oldPrice: '$849.00', color: 'Silver', img: 'assets/img/shop-laptop.webp' },
        'book-air-14-laptop': { cat: 'Laptops', price: '$799.00', oldPrice: '$849.00', color: 'Silver', img: 'assets/img/laptop.webp' },
        'mechanical-keys': { cat: 'Accessories', price: '$129.00', oldPrice: '$159.00', color: 'Charcoal', img: 'assets/img/keyboard.webp' },
        'galaxy-z-fold-pro': { cat: 'Smartphones', price: '$1,799.00', oldPrice: '$1,899.00', color: 'Phantom Black', img: 'assets/img/fold-phone.webp' },
        'flip-smart-x': { cat: 'Smartphones', price: '$999.00', oldPrice: '$1,099.00', color: 'Lavender', img: 'assets/img/flip-phone.webp' },
        'ultra-phone-14': { cat: 'Smartphones', price: '$1,199.00', oldPrice: '$1,299.00', color: 'Titanium Gray', img: 'assets/img/normal-phone.webp' },
        'lite-phone-z': { cat: 'Smartphones', price: '$499.00', oldPrice: '$549.00', color: 'Glacier Blue', img: 'assets/img/lite-phone.webp' },
        'creator-pro-16': { cat: 'Laptops', price: '$2,499.00', oldPrice: '$2,699.00', color: 'Space Gray', img: 'assets/img/laptop-pro.webp' },
        'gaming-beast-17': { cat: 'Laptops', price: '$1,899.00', oldPrice: '$2,099.00', color: 'Stealth Black', img: 'assets/img/laptop-gaming.webp' },
        'ultralight-13': { cat: 'Laptops', price: '$999.00', oldPrice: '$1,099.00', color: 'Starlight', img: 'assets/img/laptop-light.webp' },
        'watch-series-8': { cat: 'Smart Gadgets', price: '$399.00', oldPrice: '$449.00', color: 'Midnight', img: 'assets/img/watch.webp' },
        'anc-earbuds': { cat: 'Smart Gadgets', price: '$249.00', oldPrice: '$299.00', color: 'Pearl White', img: 'assets/img/earbuds.webp' },
        'smart-tag-pro': { cat: 'Smart Gadgets', price: '$29.00', oldPrice: '$35.00', color: 'White', img: 'assets/img/tag.webp' },
        'fitness-band-x': { cat: 'Smart Gadgets', price: '$59.00', oldPrice: '$79.00', color: 'Graphite', img: 'assets/img/band.webp' },
        'vr-headset-pro': { cat: 'Gaming', price: '$299.00', oldPrice: '$349.00', color: 'Onyx Black', img: 'assets/img/vr.webp' },
        'pro-controller': { cat: 'Gaming', price: '$69.00', oldPrice: '$79.00', color: 'Carbon Black', img: 'assets/img/controller.webp' },
        'premium-anc-headphones': { cat: 'Audio', price: '$349.00', oldPrice: '$399.00', color: 'Black', img: 'assets/img/promo.webp' },
        'sonix-pro-wireless-anc-headphones': { cat: 'Audio', price: '$129.00', oldPrice: '$199.00', color: 'Midnight Black', img: 'assets/img/promo-girl.webp' },
        'view-27-qhd-monitor': { cat: 'Monitors', price: '$249.00', oldPrice: '$329.00', color: 'Matte Black', img: 'assets/img/shop-monitor-qhd.webp' },
        'desk-duo-keyboard-mouse': { cat: 'Accessories', price: '$89.00', oldPrice: '$119.00', color: 'Charcoal Black', img: 'assets/img/shop-accessories.webp' },
        'view-27-4k-monitor': { cat: 'Monitors', price: '$399.00', oldPrice: '$499.00', color: 'Silver', img: 'assets/img/shop-monitor-4k.webp' },
        'play-one-extra-controller-bundle': { cat: 'Gaming Consoles', price: '$499.00', oldPrice: '$569.00', color: 'Stealth Black', img: 'assets/img/shop-console-bundle.webp' },
        'sonix-pro-wireless': { cat: 'Headphones', price: '$129.00', oldPrice: '$199.00', color: 'Metallic Gray', img: 'assets/img/shop-headphones.webp' },
        'air-buds-pro': { cat: 'Earbuds', price: '$79.00', oldPrice: '$119.00', color: 'Pearl White', img: 'assets/img/shop-earbuds-pro.webp' },
        'pulse-mini-speaker': { cat: 'Speakers', price: '$59.00', oldPrice: '$89.00', color: 'Charcoal', img: 'assets/img/shop-speaker-mini.webp' },
        'watch-one': { cat: 'Wearables', price: '$149.00', oldPrice: '$199.00', color: 'Midnight Black', img: 'assets/img/shop-watch-one.webp' },
        'sonix-studio-max': { cat: 'Headphones', price: '$199.00', oldPrice: '$249.00', color: 'Studio Black', img: 'assets/img/shop-headphones-studio.webp' },
        'air-buds-lite': { cat: 'Earbuds', price: '$49.00', oldPrice: '$69.00', color: 'White', img: 'assets/img/shop-earbuds-lite.webp' },
        'pulse-home-speaker': { cat: 'Speakers', price: '$129.00', oldPrice: '$169.00', color: 'Graphite', img: 'assets/img/shop-speaker-home.webp' },
        'watch-active': { cat: 'Wearables', price: '$179.00', oldPrice: '$229.00', color: 'Carbon Black', img: 'assets/img/shop-watch-active.webp' }
    };

    function slugify(text) {
        if (!text) return 'item-' + Date.now();
        return text.toString().toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function parseNumericPrice(priceStr) {
        if (typeof priceStr === 'number') return isNaN(priceStr) ? 0 : priceStr;
        if (!priceStr) return 0;
        const cleaned = priceStr.toString().replace(/[^0-9.]/g, '');
        const val = parseFloat(cleaned);
        return isNaN(val) ? 0 : val;
    }

    function formatCurrency(val) {
        return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function safeImagePath(path) {
        if (!path) return 'assets/img/monitor.webp';
        if (path.startsWith('http://') || path.startsWith('https://')) {
            try {
                const url = new URL(path);
                const rel = url.pathname.replace(/^\/+/, '');
                if (rel.includes('assets/')) {
                    return rel.substring(rel.indexOf('assets/'));
                }
            } catch(e) {}
        }
        return path;
    }

    function getColorHex(colorName) {
        if (!colorName) return '#94A3B8';
        const lower = colorName.toLowerCase();
        if (lower.includes('black')) return '#111827';
        if (lower.includes('white')) return '#F8FAFC';
        if (lower.includes('silver')) return '#D1D5DB';
        if (lower.includes('gray') || lower.includes('grey')) return '#64748B';
        if (lower.includes('lavender')) return '#C084FC';
        if (lower.includes('blue')) return '#38BDF8';
        if (lower.includes('charcoal')) return '#334155';
        if (lower.includes('midnight')) return '#1E293B';
        if (lower.includes('starlight')) return '#E2E8F0';
        return '#64748B';
    }

    const StacklyCart = {
        // Read cart items from localStorage
        getItems: function() {
            try {
                const stored = localStorage.getItem(CART_STORAGE_KEY);
                if (!stored) return [];
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('[STACKLY Cart] Failed to parse cart from localStorage:', e);
                return [];
            }
        },

        // Save cart items to localStorage & notify listeners
        saveItems: function(items) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
                this.syncUI();
                window.dispatchEvent(new CustomEvent('stackly:cart-updated', { detail: { items } }));
            } catch (e) {
                console.error('[STACKLY Cart] Failed to save cart to localStorage:', e);
            }
        },

        // Total count of distinct units in cart
        getTotalCount: function() {
            const items = this.getItems();
            return items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
        },

        // Add to cart with duplicate merging & variant separation
        addItem: function(product, quantity = 1) {
            if (!product || !product.name) return false;

            const items = this.getItems();
            const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
            const baseSlug = product.id ? slugify(product.id) : slugify(product.name);
            const variantColor = (product.color && product.color.trim()) ? product.color.trim() : 'Standard';

            // Distinct key combining base slug and normalized variant
            const lineKey = baseSlug + '__' + slugify(variantColor);

            const existingIndex = items.findIndex(item => {
                const itemKey = (item.lineKey) ? item.lineKey : (slugify(item.id || item.name) + '__' + slugify(item.color || 'Standard'));
                return itemKey === lineKey;
            });

            const meta = CATALOG_METADATA[baseSlug] || {};
            const cleanPrice = product.price ? product.price : (meta.price || '$99.00');
            const cleanOldPrice = product.oldPrice ? product.oldPrice : (meta.oldPrice || '');

            if (existingIndex > -1) {
                // Increment existing line quantity
                items[existingIndex].quantity = (parseInt(items[existingIndex].quantity, 10) || 1) + qtyToAdd;
                // Preserve / update latest prices if available
                if (cleanPrice) items[existingIndex].price = cleanPrice;
                if (cleanOldPrice) items[existingIndex].oldPrice = cleanOldPrice;
            } else {
                // Insert fresh cart item
                const newItem = {
                    lineKey: lineKey,
                    id: baseSlug,
                    name: product.name.trim(),
                    category: product.category || meta.cat || 'Electronics',
                    price: cleanPrice,
                    oldPrice: cleanOldPrice,
                    image: safeImagePath(product.image || meta.img),
                    color: variantColor,
                    quantity: qtyToAdd
                };
                items.push(newItem);
            }

            this.saveItems(items);
            this.showToast(`${product.name.trim()} added to bag!`, 'fa-bag-shopping');
            this.animateCartBadges();
            return true;
        },

        // Update quantity for a specific line item
        updateQuantity: function(lineKey, newQuantity) {
            const items = this.getItems();
            const index = items.findIndex(item => {
                const k = item.lineKey || (slugify(item.id || item.name) + '__' + slugify(item.color || 'Standard'));
                return k === lineKey;
            });

            if (index === -1) return false;

            const parsedQty = parseInt(newQuantity, 10);
            if (isNaN(parsedQty) || parsedQty <= 0) {
                // If quantity drops to 0 or negative, remove item
                return this.removeItem(lineKey);
            }

            items[index].quantity = parsedQty;
            this.saveItems(items);
            return true;
        },

        // Remove a line item
        removeItem: function(lineKey) {
            const items = this.getItems();
            const index = items.findIndex(item => {
                const k = item.lineKey || (slugify(item.id || item.name) + '__' + slugify(item.color || 'Standard'));
                return k === lineKey;
            });

            if (index === -1) return false;

            const removedItem = items[index];
            items.splice(index, 1);
            this.saveItems(items);
            this.showToast(`${removedItem.name} removed from your cart`, 'fa-trash-can');
            return true;
        },

        // Clear entire cart
        clearCart: function() {
            this.saveItems([]);
            this.showToast('Shopping cart cleared', 'fa-trash-can');
        },

        // Compute financial totals
        getSummary: function() {
            const items = this.getItems();
            let subtotal = 0;
            let totalSavings = 0;

            items.forEach(item => {
                const qty = parseInt(item.quantity, 10) || 1;
                const priceNum = parseNumericPrice(item.price);
                subtotal += priceNum * qty;

                if (item.oldPrice) {
                    const oldNum = parseNumericPrice(item.oldPrice);
                    if (oldNum > priceNum) {
                        totalSavings += (oldNum - priceNum) * qty;
                    }
                }
            });

            const shippingFee = (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : STANDARD_SHIPPING_FEE;
            const finalTotal = subtotal + shippingFee;

            return {
                itemCount: this.getTotalCount(),
                subtotal: subtotal,
                subtotalFormatted: formatCurrency(subtotal),
                savings: totalSavings,
                savingsFormatted: formatCurrency(totalSavings),
                shipping: shippingFee,
                shippingFormatted: shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee),
                isFreeShipping: shippingFee === 0,
                freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
                amountNeededForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
                finalTotal: finalTotal,
                finalTotalFormatted: formatCurrency(finalTotal)
            };
        },

        // Bounce navbar cart bag icon
        animateCartBadges: function() {
            const cartIcons = document.querySelectorAll('.cart-icon');
            cartIcons.forEach(icon => {
                icon.style.transform = 'scale(1.28)';
                setTimeout(() => { icon.style.transform = 'scale(1)'; }, 220);
            });
        },

        // Toast utility fallback
        showToast: function(message, iconClass = 'fa-circle-check') {
            if (typeof window.showToast === 'function') {
                window.showToast(message, iconClass);
                return;
            }
            let toast = document.querySelector('.stackly-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'stackly-toast';
                document.body.appendChild(toast);
            }
            toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
            toast.classList.add('show');
            if (toast.timeoutId) clearTimeout(toast.timeoutId);
            toast.timeoutId = setTimeout(() => {
                toast.classList.remove('show');
            }, 3200);
        },

        // Synchronize counters across top navigation and render cart page if present
        syncUI: function() {
            const totalCount = this.getTotalCount();
            const cartCountElems = document.querySelectorAll('.cart-count, #nav-cart-count, #cart-total-badge');
            cartCountElems.forEach(el => {
                el.textContent = totalCount;
            });

            // If we are on cart.html, render the shopping cart view
            if (document.getElementById('cart-items-container') || document.getElementById('cart-summary-card')) {
                this.renderCartPage();

                if (typeof AOS !== 'undefined' && !window._cartAosInitialized) {
                    window._cartAosInitialized = true;
                    AOS.init({
                        duration: 700,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        once: true,
                        offset: 30
                    });
                }
            }
        },

        // Render dedicated Shopping Cart page
        renderCartPage: function() {
            const items = this.getItems();
            const container = document.getElementById('cart-items-container');
            const emptyState = document.getElementById('cart-empty-state');
            const cartContentWrapper = document.getElementById('cart-content-wrapper');
            const pageCountBadge = document.getElementById('cart-page-count-badge');
            const summary = this.getSummary();

            if (pageCountBadge) {
                pageCountBadge.textContent = `${summary.itemCount} ${summary.itemCount === 1 ? 'item' : 'items'}`;
            }

            // Check if cart is empty
            if (items.length === 0) {
                if (emptyState) emptyState.style.display = 'block';
                if (cartContentWrapper) cartContentWrapper.style.display = 'none';
                if (container) container.innerHTML = '';
                return;
            }

            if (emptyState) emptyState.style.display = 'none';
            if (cartContentWrapper) cartContentWrapper.style.display = 'grid';

            // 1. Render Line Items
            if (container) {
                let html = '';
                items.forEach(item => {
                    const lineKey = item.lineKey || (slugify(item.id || item.name) + '__' + slugify(item.color || 'Standard'));
                    const qty = parseInt(item.quantity, 10) || 1;
                    const unitPriceNum = parseNumericPrice(item.price);
                    const itemSubtotal = unitPriceNum * qty;
                    const variantText = item.color || 'Standard';
                    const oldPriceHtml = item.oldPrice ? `<span class="cart-unit-old">${item.oldPrice}</span>` : '';

                    html += `
                        <div class="cart-item-row" data-line-key="${lineKey}">
                            <div class="cart-item-media">
                                <img src="${item.image}" alt="${item.name}" loading="lazy">
                            </div>
                            <div class="cart-item-info">
                                <div class="cart-item-meta">
                                    <span class="category-tag">${item.category || 'Electronics'}</span>
                                    <div class="variant-chip-cart">
                                        <span class="variant-dot" style="background: ${getColorHex(variantText)};"></span>
                                        <span>${variantText}</span>
                                    </div>
                                </div>
                                <h3 class="cart-item-title">${item.name}</h3>
                                <div class="cart-item-unit-price">
                                    <span class="unit-label">Unit Price:</span>
                                    <span class="unit-val">${item.price}</span>
                                    ${oldPriceHtml}
                                </div>
                            </div>
                            <div class="cart-item-quantity-col">
                                <div class="cart-qty-control" role="group" aria-label="Quantity for ${item.name}">
                                    <button type="button" class="btn-qty btn-qty-minus" data-action="decrease-qty" aria-label="Decrease quantity">
                                        <i class="fa-solid fa-minus"></i>
                                    </button>
                                    <input type="number" class="qty-input" value="${qty}" min="1" max="99" aria-label="Quantity" data-action="input-qty">
                                    <button type="button" class="btn-qty btn-qty-plus" data-action="increase-qty" aria-label="Increase quantity">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="cart-item-subtotal-col">
                                <div class="cart-subtotal-val">${formatCurrency(itemSubtotal)}</div>
                            </div>
                            <div class="cart-item-remove-col">
                                <button type="button" class="btn-remove-cart-item" data-action="remove-item" title="Remove ${item.name} from cart" aria-label="Remove item">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                        </div>
                    `;
                });
                container.innerHTML = html;

                // Animate existing cart items with a short stagger & reveal order summary
                if (!window._cartInitialRendered) {
                    window._cartInitialRendered = true;
                    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        const rows = container.querySelectorAll('.cart-item-row');
                        if (rows.length) {
                            gsap.fromTo(rows,
                                { opacity: 0, y: 14 },
                                { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', clearProps: 'transform' }
                            );
                        }
                        const summaryCard = document.getElementById('cart-summary-card');
                        if (summaryCard) {
                            gsap.fromTo(summaryCard,
                                { opacity: 0, y: 16 },
                                { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform', delay: 0.08 }
                            );
                        }
                    }
                } else if (window._lastChangedLineKey) {
                    // Animate quantity changes subtly
                    const changedRow = container.querySelector(`.cart-item-row[data-line-key="${window._lastChangedLineKey}"]`);
                    if (changedRow && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        const qtyInput = changedRow.querySelector('.qty-input');
                        const subtotalVal = changedRow.querySelector('.cart-subtotal-val');
                        if (qtyInput) {
                            gsap.fromTo(qtyInput, { scale: 1.1 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
                        }
                        if (subtotalVal) {
                            gsap.fromTo(subtotalVal, { opacity: 0.6, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.24, ease: 'power2.out' });
                        }
                    }
                    window._lastChangedLineKey = null;
                }
            }

            // 2. Render Order Summary
            const subtotalEl = document.getElementById('summary-subtotal');
            const shippingEl = document.getElementById('summary-shipping');
            const discountRow = document.getElementById('summary-discount-row');
            const discountEl = document.getElementById('summary-discount');
            const grandTotalEl = document.getElementById('summary-grand-total');
            const shippingNoticeEl = document.getElementById('free-shipping-notice');

            if (subtotalEl) subtotalEl.textContent = summary.subtotalFormatted;
            if (shippingEl) {
                if (summary.isFreeShipping) {
                    shippingEl.innerHTML = '<span class="free-shipping-badge"><i class="fa-solid fa-circle-check"></i> FREE</span>';
                } else {
                    shippingEl.textContent = summary.shippingFormatted;
                }
            }

            if (discountRow && discountEl) {
                if (summary.savings > 0) {
                    discountRow.style.display = 'flex';
                    discountEl.textContent = `-${summary.savingsFormatted}`;
                } else {
                    discountRow.style.display = 'none';
                }
            }

            if (grandTotalEl) grandTotalEl.textContent = summary.finalTotalFormatted;

            // Free shipping threshold helper bar
            if (shippingNoticeEl) {
                if (summary.isFreeShipping) {
                    shippingNoticeEl.innerHTML = `
                        <div class="free-shipping-progress achieved">
                            <i class="fa-solid fa-truck-fast"></i>
                            <span>You unlocked <strong>Free Express Shipping</strong>!</span>
                        </div>
                    `;
                } else {
                    shippingNoticeEl.innerHTML = `
                        <div class="free-shipping-progress pending">
                            <i class="fa-solid fa-truck-fast"></i>
                            <span>Add <strong>${formatCurrency(summary.amountNeededForFreeShipping)}</strong> more to qualify for <strong>FREE Shipping</strong>!</span>
                        </div>
                    `;
                }
            }
        },

        // Helper to extract product info from any card element
        extractProductFromCard: function(btn) {
            if (!btn) return null;
            const card = btn.closest('.product-card, .large-card, .promo-banner, .quick-view-card, .wishlist-item-card, .wishlist-card');
            if (!card) return null;

            const titleEl = card.querySelector('.product-title, h3, #qv-title, h4');
            const priceEl = card.querySelector('.price, #qv-price');
            const oldPriceEl = card.querySelector('.old-price');
            const catEl = card.querySelector('.category-label, .category-tag, #qv-category');
            const imgEl = card.querySelector('.img-container img, .large-card-img img, #qv-img, img');
            const activeColorEl = card.querySelector('.colors .color.active');

            const name = titleEl ? titleEl.textContent.trim() : 'Tech Gadget';
            const price = priceEl ? priceEl.textContent.trim() : '$99.00';
            const oldPrice = oldPriceEl ? oldPriceEl.textContent.trim() : '';
            const category = catEl ? catEl.textContent.trim() : 'Electronics';
            const image = imgEl ? (imgEl.getAttribute('src') || imgEl.src) : 'assets/img/monitor.webp';
            const color = activeColorEl ? (activeColorEl.getAttribute('data-color') || activeColorEl.getAttribute('title') || 'Standard') : 'Standard';

            const baseId = slugify(name);
            const meta = CATALOG_METADATA[baseId] || {};

            return {
                id: baseId,
                name: name,
                category: category || meta.cat || 'Electronics',
                price: price,
                oldPrice: oldPrice || meta.oldPrice || '',
                image: safeImagePath(image),
                color: (color && color !== 'Standard') ? color : (meta.color || 'Standard'),
                quantity: 1
            };
        }
    };

    // Global Event Delegation for Cart buttons & interactions
    document.addEventListener('click', function(e) {
        // 1. Generic Add to Cart buttons
        const addBtn = e.target.closest('.btn-add-cart, #qv-add-cart-btn, #promo-add-cart-btn');
        if (addBtn) {
            e.preventDefault();
            e.stopPropagation();

            const product = StacklyCart.extractProductFromCard(addBtn);
            if (product) {
                StacklyCart.addItem(product, 1);
            }
            return;
        }

        // 2. Cart Page Item Actions (Quantity increase / decrease / remove)
        const cartActionBtn = e.target.closest('[data-action="increase-qty"], [data-action="decrease-qty"], [data-action="remove-item"]');
        if (cartActionBtn) {
            e.preventDefault();
            e.stopPropagation();

            const row = cartActionBtn.closest('.cart-item-row');
            if (!row) return;

            const lineKey = row.getAttribute('data-line-key');
            const action = cartActionBtn.getAttribute('data-action');
            const input = row.querySelector('.qty-input');
            let currentQty = input ? (parseInt(input.value, 10) || 1) : 1;

            if (action === 'increase-qty') {
                currentQty++;
                window._lastChangedLineKey = lineKey;
                StacklyCart.updateQuantity(lineKey, currentQty);
            } else if (action === 'decrease-qty') {
                if (currentQty <= 1) {
                    // Smooth transition when item is removed
                    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        gsap.to(row, {
                            opacity: 0,
                            x: 28,
                            duration: 0.24,
                            ease: 'power2.in',
                            onComplete: () => {
                                StacklyCart.removeItem(lineKey);
                            }
                        });
                    } else {
                        StacklyCart.removeItem(lineKey);
                    }
                } else {
                    currentQty--;
                    window._lastChangedLineKey = lineKey;
                    StacklyCart.updateQuantity(lineKey, currentQty);
                }
            } else if (action === 'remove-item') {
                // Smooth transition when item is removed
                if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.to(row, {
                        opacity: 0,
                        x: 28,
                        duration: 0.24,
                        ease: 'power2.in',
                        onComplete: () => {
                            StacklyCart.removeItem(lineKey);
                        }
                    });
                } else {
                    StacklyCart.removeItem(lineKey);
                }
            }
            return;
        }

        // 3. Clear Cart button on Cart page
        const clearCartBtn = e.target.closest('#btn-clear-cart');
        if (clearCartBtn) {
            e.preventDefault();
            if (confirm('Are you sure you want to empty your shopping cart?')) {
                StacklyCart.clearCart();
            }
            return;
        }

        // 4. Proceed to Checkout button
        const checkoutBtn = e.target.closest('#btn-checkout, .btn-checkout');
        if (checkoutBtn) {
            e.preventDefault();
            const summary = StacklyCart.getSummary();
            if (summary.itemCount === 0) {
                StacklyCart.showToast('Your cart is empty', 'fa-circle-exclamation');
                return;
            }
            window.location.href = 'checkout.html';
            return;
        }
    });

    // Handle direct quantity input changes on the cart page
    document.addEventListener('change', function(e) {
        const qtyInput = e.target.closest('.qty-input');
        if (qtyInput) {
            const row = qtyInput.closest('.cart-item-row');
            if (!row) return;
            const lineKey = row.getAttribute('data-line-key');
            const val = parseInt(qtyInput.value, 10);
            if (isNaN(val) || val < 1) {
                qtyInput.value = 1;
                StacklyCart.updateQuantity(lineKey, 1);
            } else {
                StacklyCart.updateQuantity(lineKey, val);
            }
        }
    });

    // Listen for storage events across other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === CART_STORAGE_KEY) {
            StacklyCart.syncUI();
        }
    });

    // Auto-initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => StacklyCart.syncUI());
    } else {
        StacklyCart.syncUI();
    }

    // Expose StacklyCart globally
    window.StacklyCart = StacklyCart;

})(window);
