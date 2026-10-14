/**
 * STACKLY Electronic Store - Wishlist Manager
 * Handles local storage persistence, state synchronization, reactive badge counters,
 * product card heart toggle states, quick-view modal integration, and dynamic rendering.
 */

(function(window) {
    'use strict';

    const STORAGE_KEY = 'stacklyWishlist';
    const CART_STORAGE_KEY = 'stacklyCart';

    // Catalog lookup fallback for metadata (stock, oldPrice, default colors)
    const CATALOG_METADATA = {
        'pro-display-x1': { cat: 'Monitors', oldPrice: '$999.00', color: 'Space Black', inStock: true },
        'play-one-console': { cat: 'Gaming Consoles', oldPrice: '$499.00', color: 'Matte White', inStock: true },
        'book-air-14': { cat: 'Laptops', oldPrice: '$849.00', color: 'Silver', inStock: true },
        'book-air-14-laptop': { cat: 'Laptops', oldPrice: '$849.00', color: 'Silver', inStock: true },
        'mechanical-keys': { cat: 'Accessories', oldPrice: '$159.00', color: 'Charcoal', inStock: true },
        'galaxy-z-fold-pro': { cat: 'Smartphones', oldPrice: '$1,899.00', color: 'Phantom Black', inStock: true },
        'flip-smart-x': { cat: 'Smartphones', oldPrice: '$1,099.00', color: 'Lavender', inStock: true },
        'ultra-phone-14': { cat: 'Smartphones', oldPrice: '$1,299.00', color: 'Titanium Gray', inStock: true },
        'lite-phone-z': { cat: 'Smartphones', oldPrice: '$549.00', color: 'Glacier Blue', inStock: true },
        'creator-pro-16': { cat: 'Laptops', oldPrice: '$2,699.00', color: 'Space Gray', inStock: true },
        'gaming-beast-17': { cat: 'Laptops', oldPrice: '$2,099.00', color: 'Stealth Black', inStock: true },
        'ultralight-13': { cat: 'Laptops', oldPrice: '$1,099.00', color: 'Starlight', inStock: true },
        'watch-series-8': { cat: 'Smart Gadgets', oldPrice: '$449.00', color: 'Midnight', inStock: true },
        'anc-earbuds': { cat: 'Smart Gadgets', oldPrice: '$299.00', color: 'Pearl White', inStock: false },
        'smart-tag-pro': { cat: 'Smart Gadgets', oldPrice: '$35.00', color: 'White', inStock: true },
        'fitness-band-x': { cat: 'Smart Gadgets', oldPrice: '$79.00', color: 'Graphite', inStock: true },
        'vr-headset-pro': { cat: 'Gaming', oldPrice: '$349.00', color: 'Onyx Black', inStock: true },
        'pro-controller': { cat: 'Gaming', oldPrice: '$79.00', color: 'Carbon Black', inStock: true },
        'premium-anc-headphones': { cat: 'Audio', oldPrice: '$399.00', color: 'Black', inStock: true },
        'view-27-qhd-monitor': { cat: 'Monitors', oldPrice: '$329.00', color: 'Matte Black', inStock: true },
        'desk-duo-keyboard-mouse': { cat: 'Accessories', oldPrice: '$119.00', color: 'Charcoal Black', inStock: true },
        'view-27-4k-monitor': { cat: 'Monitors', oldPrice: '$499.00', color: 'Silver', inStock: true },
        'play-one-extra-controller-bundle': { cat: 'Gaming Consoles', oldPrice: '$569.00', color: 'Stealth Black', inStock: true },
        'sonix-pro-wireless': { cat: 'Headphones', oldPrice: '$199.00', color: 'Metallic Gray', inStock: true },
        'air-buds-pro': { cat: 'Earbuds', oldPrice: '$119.00', color: 'Pearl White', inStock: true },
        'pulse-mini-speaker': { cat: 'Speakers', oldPrice: '$89.00', color: 'Charcoal', inStock: true },
        'watch-one': { cat: 'Wearables', oldPrice: '$199.00', color: 'Midnight Black', inStock: true },
        'sonix-studio-max': { cat: 'Headphones', oldPrice: '$249.00', color: 'Studio Black', inStock: true },
        'air-buds-lite': { cat: 'Earbuds', oldPrice: '$69.00', color: 'White', inStock: true },
        'pulse-home-speaker': { cat: 'Speakers', oldPrice: '$169.00', color: 'Graphite', inStock: true },
        'watch-active': { cat: 'Wearables', oldPrice: '$229.00', color: 'Carbon Black', inStock: true }
    };

    // Default wishlist items seeded only if the user has never modified their wishlist
    const SEED_ITEMS = [
        {
            id: 'book-air-14',
            name: 'Book Air 14',
            category: 'Laptops',
            price: '$799.00',
            oldPrice: '$849.00',
            image: 'assets/img/laptop.webp',
            color: 'Silver',
            inStock: true
        },
        {
            id: 'mechanical-keys',
            name: 'Mechanical Keys',
            category: 'Accessories',
            price: '$129.00',
            oldPrice: '$159.00',
            image: 'assets/img/keyboard.webp',
            color: 'Charcoal',
            inStock: true
        },
        {
            id: 'play-one-console',
            name: 'Play One Console',
            category: 'Gaming',
            price: '$449.00',
            oldPrice: '$499.00',
            image: 'assets/img/console.webp',
            color: 'Matte White',
            inStock: true
        }
    ];

    function slugify(text) {
        if (!text) return 'item-' + Date.now();
        return text.toString().toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function safeImagePath(path) {
        if (!path) return 'assets/img/monitor.webp';
        // Normalize absolute or dash path
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

    const StacklyWishlist = {
        // Read wishlist items
        getItems: function() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored === null) {
                    // Seed initial favorite items
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ITEMS));
                    return [...SEED_ITEMS];
                }
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.error('[STACKLY Wishlist] Failed to read from localStorage:', e);
                return [];
            }
        },

        // Save wishlist items
        saveItems: function(items) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                this.syncUI();
                // Dispatch custom event for real-time window synchronization
                window.dispatchEvent(new CustomEvent('stackly:wishlist-updated', { detail: { items } }));
            } catch (e) {
                console.error('[STACKLY Wishlist] Failed to save to localStorage:', e);
            }
        },

        // Check if an item exists by ID or name
        has: function(idOrName) {
            if (!idOrName) return false;
            const targetSlug = slugify(idOrName);
            const items = this.getItems();
            return items.some(item => slugify(item.id) === targetSlug || slugify(item.name) === targetSlug);
        },

        // Add item (prevents duplicates)
        add: function(product) {
            if (!product || !product.name) return false;
            const items = this.getItems();
            const id = product.id ? slugify(product.id) : slugify(product.name);

            // Prevent duplicates
            const exists = items.some(item => slugify(item.id) === id || slugify(item.name) === slugify(product.name));
            if (exists) {
                return false;
            }

            // Enrich with catalog metadata if missing
            const meta = CATALOG_METADATA[id] || {};
            const enriched = {
                id: id,
                name: product.name.trim(),
                category: product.category || meta.cat || 'Electronics',
                price: product.price || '$99.00',
                oldPrice: product.oldPrice || meta.oldPrice || '',
                image: safeImagePath(product.image),
                color: product.color || meta.color || 'Standard',
                inStock: (product.inStock !== undefined) ? Boolean(product.inStock) : (meta.inStock !== undefined ? meta.inStock : true)
            };

            items.unshift(enriched);
            this.saveItems(items);
            this.showToast(`Saved ${enriched.name} to your wishlist!`, 'fa-heart');
            return true;
        },

        // Remove item by ID or name
        remove: function(idOrName) {
            if (!idOrName) return false;
            const targetSlug = slugify(idOrName);
            const items = this.getItems();
            const removedItem = items.find(item => slugify(item.id) === targetSlug || slugify(item.name) === targetSlug);
            const filtered = items.filter(item => slugify(item.id) !== targetSlug && slugify(item.name) !== targetSlug);

            if (filtered.length !== items.length) {
                this.saveItems(filtered);
                const title = removedItem ? removedItem.name : 'Item';
                this.showToast(`Removed ${title} from wishlist`, 'fa-heart-circle-xmark');
                return true;
            }
            return false;
        },

        // Toggle item
        toggle: function(product) {
            if (!product || !product.name) return false;
            const id = product.id ? slugify(product.id) : slugify(product.name);
            if (this.has(id)) {
                this.remove(id);
                return false;
            } else {
                this.add(product);
                return true;
            }
        },

        // Clear all wishlist items
        clear: function() {
            this.saveItems([]);
            this.showToast('Wishlist cleared', 'fa-trash-can');
        },

        // Total count
        getCount: function() {
            return this.getItems().length;
        },

        // Move to Cart
        addToCart: function(product) {
            if (!product) return;
            if (window.StacklyCart && typeof window.StacklyCart.addItem === 'function') {
                window.StacklyCart.addItem(product, 1);
                return;
            }
            try {
                let cart = [];
                try {
                    cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
                } catch(e) {
                    cart = [];
                }

                const cartItem = {
                    id: Date.now(),
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    color: product.color || 'Standard',
                    category: product.category || 'Electronics',
                    quantity: 1
                };

                cart.push(cartItem);
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

                // Update cart count badges across all pages
                const cartCountElems = document.querySelectorAll('.cart-count');
                const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                cartCountElems.forEach(el => {
                    el.textContent = totalItems;
                });

                // Animate cart icons
                const cartIcons = document.querySelectorAll('.cart-icon');
                cartIcons.forEach(icon => {
                    icon.style.transform = 'scale(1.25)';
                    setTimeout(() => { icon.style.transform = 'scale(1)'; }, 220);
                });

                this.showToast(`${product.name} added to your bag!`, 'fa-bag-shopping');
            } catch (e) {
                console.error('[STACKLY Wishlist] Failed to add to cart:', e);
            }
        },

        // Unified Toast notification
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

        // Extract product details from DOM container
        extractProductFromElement: function(el) {
            if (!el) return null;
            const card = el.closest('.product-card, .large-card, .promo-banner, .quick-view-card, .wishlist-card, .wishlist-item-card');
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
            const color = activeColorEl ? (activeColorEl.getAttribute('data-color') || activeColorEl.getAttribute('title') || 'Selected') : 'Standard';

            const id = slugify(name);
            const meta = CATALOG_METADATA[id] || {};

            return {
                id: id,
                name: name,
                category: category || meta.cat || 'Electronics',
                price: price,
                oldPrice: oldPrice || meta.oldPrice || '',
                image: safeImagePath(image),
                color: (color && color !== 'Selected') ? color : (meta.color || 'Standard'),
                inStock: (meta.inStock !== undefined) ? meta.inStock : true
            };
        },

        // Synchronize all UI elements (badges, buttons, icons)
        syncUI: function() {
            const items = this.getItems();
            const count = items.length;

            // Update badge counters
            const badges = document.querySelectorAll('#nav-wishlist-count, .wishlist-count, #wishlist-counter-badge');
            badges.forEach(badge => {
                badge.textContent = count;
                badge.style.transform = 'scale(1.25)';
                setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
            });

            // Update product card heart buttons
            const wishBtns = document.querySelectorAll('.wishlist-btn');
            wishBtns.forEach(btn => {
                // If it's a dedicated remove button or action button, skip
                if (btn.classList.contains('btn-wishlist-remove')) return;

                const card = btn.closest('.product-card, .large-card, .promo-banner, .quick-view-card');
                if (!card) return;

                const titleEl = card.querySelector('.product-title, h3, #qv-title, h4');
                if (!titleEl) return;

                const name = titleEl.textContent.trim();
                const isSaved = this.has(name);
                const icon = btn.querySelector('i');

                if (isSaved) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    btn.setAttribute('title', 'Remove from Wishlist');
                    if (icon) {
                        icon.className = 'fa-solid fa-heart';
                    }
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                    btn.setAttribute('title', 'Add to Wishlist');
                    if (icon) {
                        icon.className = 'fa-regular fa-heart';
                    }
                }
            });

            // Render Wishlist Page Grid if present
            if (document.getElementById('wishlist-items-grid') || document.getElementById('dashboard-wishlist-grid')) {
                this.renderWishlistPage();
            }
        },

        // Render dedicated Wishlist storefront page & dashboard
        renderWishlistPage: function() {
            const items = this.getItems();
            const gridEl = document.getElementById('wishlist-items-grid');
            const dashboardGridEl = document.getElementById('dashboard-wishlist-grid');
            const emptyStateEl = document.getElementById('wishlist-empty-state');
            const activeContentEl = document.getElementById('wishlist-content-wrapper');
            const totalCountPill = document.getElementById('wishlist-total-count');

            // Update counts & stats
            const statTotal = document.getElementById('stat-total-items');
            const statAvailable = document.getElementById('stat-available');
            const statOutOfStock = document.getElementById('stat-out-of-stock');
            const statPriceDrops = document.getElementById('stat-price-drops');

            const total = items.length;
            const inStockCount = items.filter(i => i.inStock !== false).length;
            const outOfStockCount = total - inStockCount;
            const priceDropsCount = items.filter(i => Boolean(i.oldPrice)).length;

            if (statTotal) statTotal.textContent = total;
            if (statAvailable) statAvailable.textContent = inStockCount;
            if (statOutOfStock) statOutOfStock.textContent = outOfStockCount;
            if (statPriceDrops) statPriceDrops.textContent = priceDropsCount;
            if (totalCountPill) totalCountPill.textContent = `${total} ${total === 1 ? 'item' : 'items'}`;

            // Handle Empty State
            if (total === 0) {
                if (emptyStateEl) emptyStateEl.style.display = 'block';
                if (activeContentEl) activeContentEl.style.display = 'none';
                if (gridEl) gridEl.innerHTML = '';
                if (dashboardGridEl) dashboardGridEl.innerHTML = `
                    <div class="empty-wishlist-card text-center" style="grid-column: 1 / -1; padding: 50px 20px; background: #fff; border-radius: 12px; border: 1px solid var(--border);">
                        <i class="fa-regular fa-heart" style="font-size: 3rem; color: #CBD5E1; margin-bottom: 16px;"></i>
                        <h3 style="font-size: 1.25rem; margin-bottom: 8px;">Your Wishlist is Empty</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 24px;">Explore our catalog to save your favorite tech gadgets.</p>
                        <a href="../index.html#freshly-dropped" class="btn btn-primary" style="display: inline-flex;"><i class="fa-solid fa-arrow-left"></i> Explore Products</a>
                    </div>
                `;
                return;
            }

            if (emptyStateEl) emptyStateEl.style.display = 'none';
            if (activeContentEl) activeContentEl.style.display = 'block';

            // 1. Render Storefront Grid (`wishlist-items-grid`)
            if (gridEl) {
                let html = '';
                items.forEach(item => {
                    const isAvailable = item.inStock !== false;
                    const stockBadge = isAvailable
                        ? `<span class="stock-pill stock-in"><i class="fa-solid fa-circle-check"></i> In Stock</span>`
                        : `<span class="stock-pill stock-out"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</span>`;

                    const oldPriceHtml = item.oldPrice
                        ? `<span class="old-price">${item.oldPrice}</span>`
                        : '';

                    const variantBadge = item.color
                        ? `<div class="variant-badge"><span class="variant-dot" style="background: ${getColorHex(item.color)};"></span><span>${item.color}</span></div>`
                        : '';

                    html += `
                        <div class="wishlist-item-card" data-id="${item.id}" data-name="${item.name}">
                            <div class="wishlist-card-media">
                                ${stockBadge}
                                <button type="button" class="btn-card-remove" title="Remove from Wishlist" aria-label="Remove ${item.name} from wishlist" data-action="remove">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                                <div class="wishlist-img-frame">
                                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                                </div>
                            </div>
                            <div class="wishlist-card-details">
                                <div class="card-meta-row">
                                    <span class="category-tag">${item.category || 'Electronics'}</span>
                                    ${variantBadge}
                                </div>
                                <h3 class="product-title">${item.name}</h3>
                                <div class="price-row">
                                    <span class="price">${item.price}</span>
                                    ${oldPriceHtml}
                                </div>
                                <div class="card-actions-row">
                                    <button type="button" class="btn btn-primary btn-wishlist-cart ${!isAvailable ? 'disabled' : ''}" 
                                        ${!isAvailable ? 'disabled aria-disabled="true"' : ''} 
                                        data-action="add-cart" 
                                        title="${isAvailable ? 'Add to bag' : 'Currently out of stock'}">
                                        <i class="fa-solid fa-cart-shopping"></i> ${isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
                                    </button>
                                    <button type="button" class="btn btn-outline-danger btn-wishlist-remove" data-action="remove" title="Remove from wishlist">
                                        <i class="fa-regular fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                gridEl.innerHTML = html;
            }

            // 2. Render Dashboard Grid (`dashboard-wishlist-grid`)
            if (dashboardGridEl) {
                let dashHtml = '';
                items.forEach(item => {
                    const isAvailable = item.inStock !== false;
                    const stockBadge = isAvailable
                        ? `<span class="badge badge-delivered" style="display:inline-block; margin-left:6px; font-size:0.75rem;">In Stock</span>`
                        : `<span class="badge badge-cancelled" style="display:inline-block; margin-left:6px; font-size:0.75rem;">Out of Stock</span>`;

                    dashHtml += `
                        <div class="wishlist-card" data-id="${item.id}">
                            <div class="wishlist-img-wrap" style="height:140px; background:#F8FAFC; border-radius:8px; display:flex; align-items:center; justify-content:center; padding:10px;">
                                <img src="../${item.image}" alt="${item.name}" style="max-height:110px; max-width:85%; object-fit:contain;">
                            </div>
                            <h4 style="font-size:1.05rem; margin-top:10px;">${item.name}</h4>
                            <p class="price" style="font-weight:700; color:var(--primary);">${item.price} ${stockBadge}</p>
                            <div class="variant-pill-small" style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:14px;">
                                Variant: <strong>${item.color || 'Standard'}</strong>
                            </div>
                            <div class="wishlist-actions" style="display:flex; flex-direction:column; gap:8px;">
                                <button class="btn-primary-admin btn-dash-cart" data-action="add-cart" ${!isAvailable ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
                                    <i class="fa-solid fa-cart-shopping"></i> ${isAvailable ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button class="btn-secondary-admin btn-dash-remove" data-action="remove" style="color:#DC2626; border-color:#FECDD3;">
                                    <i class="fa-regular fa-trash-can"></i> Remove
                                </button>
                            </div>
                        </div>
                    `;
                });
                dashboardGridEl.innerHTML = dashHtml;
            }
        }
    };

    function getColorHex(colorName) {
        if (!colorName) return '#94A3B8';
        const lower = colorName.toLowerCase();
        if (lower.includes('black')) return '#111827';
        if (lower.includes('white')) return '#FFFFFF';
        if (lower.includes('silver')) return '#D1D5DB';
        if (lower.includes('gray') || lower.includes('grey')) return '#64748B';
        if (lower.includes('lavender')) return '#C084FC';
        if (lower.includes('blue')) return '#38BDF8';
        if (lower.includes('charcoal')) return '#334155';
        if (lower.includes('midnight')) return '#1E293B';
        return '#64748B';
    }

    // Global Event Delegation for Wishlist actions
    document.addEventListener('click', function(e) {
        // 1. Storefront card actions (Remove / Add to Cart)
        const cardActionBtn = e.target.closest('[data-action="remove"], [data-action="add-cart"]');
        if (cardActionBtn) {
            const card = cardActionBtn.closest('.wishlist-item-card, .wishlist-card');
            if (card) {
                const action = cardActionBtn.getAttribute('data-action');
                const id = card.getAttribute('data-id');
                const name = card.getAttribute('data-name') || card.querySelector('h4, h3')?.textContent.trim();

                if (action === 'remove') {
                    e.preventDefault();
                    e.stopPropagation();

                    // Smooth fade-out before removal
                    card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';

                    setTimeout(() => {
                        StacklyWishlist.remove(id || name);
                    }, 240);
                    return;
                }

                if (action === 'add-cart') {
                    e.preventDefault();
                    e.stopPropagation();
                    const items = StacklyWishlist.getItems();
                    const item = items.find(i => slugify(i.id) === slugify(id) || slugify(i.name) === slugify(name));
                    if (item && item.inStock !== false) {
                        StacklyWishlist.addToCart(item);
                    }
                    return;
                }
            }
        }

        // 2. Clear All Wishlist button
        const clearBtn = e.target.closest('#btn-clear-wishlist');
        if (clearBtn) {
            e.preventDefault();
            if (confirm('Are you sure you want to clear your saved items?')) {
                StacklyWishlist.clear();
            }
            return;
        }

        // 3. Product card heart toggle button
        const wishBtn = e.target.closest('.wishlist-btn');
        if (wishBtn && !wishBtn.classList.contains('btn-wishlist-remove')) {
            e.preventDefault();
            e.stopPropagation();

            const product = StacklyWishlist.extractProductFromElement(wishBtn);
            if (product) {
                StacklyWishlist.toggle(product);
            }
        }
    });

    // Listen for storage events across other tabs or windows
    window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY || e.key === CART_STORAGE_KEY) {
            StacklyWishlist.syncUI();
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => StacklyWishlist.syncUI());
    } else {
        StacklyWishlist.syncUI();
    }

    // Expose API globally
    window.StacklyWishlist = StacklyWishlist;

})(window);
