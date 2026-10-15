/**
 * STACKLY - Core E-Commerce Functionality
 * Handles preloader, cart, filtering, quick view, wishlist, search, modals, and navigation
 */

// ==========================================
// 0. Premium Preloader Controller
// ==========================================
(function initPreloader() {
    const preloader = document.getElementById('stackly-preloader');
    if (!preloader) return;

    let isDismissed = false;

    function dismissPreloader() {
        if (isDismissed) return;
        isDismissed = true;

        preloader.classList.add('fade-out');
        preloader.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }

    if (document.readyState === 'complete') {
        setTimeout(dismissPreloader, 350);
    } else {
        window.addEventListener('load', () => {
            setTimeout(dismissPreloader, 350);
        });
    }

    // Safety failsafe: guarantee preloader never hangs indefinitely
    setTimeout(dismissPreloader, 2200);
})();

document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. Toast Notification Utility
    // ==========================================
    function showToast(message, iconClass = "fa-circle-check") {
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
    }

    window.showToast = showToast;

    // ==========================================
    // 2. Shopping Cart Management
    // ==========================================
    const cartCountElems = document.querySelectorAll('.cart-count');

    function updateCartUI() {
        if (window.StacklyCart && typeof window.StacklyCart.getTotalCount === 'function') {
            const total = window.StacklyCart.getTotalCount();
            cartCountElems.forEach(el => { el.textContent = total; });
            return;
        }
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('stacklyCart')) || [];
        } catch(e) {
            cart = [];
        }
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElems.forEach(el => {
            el.textContent = totalItems;
        });
    }
    updateCartUI();

    function addToCart(item) {
        if (window.StacklyCart && typeof window.StacklyCart.addItem === 'function') {
            window.StacklyCart.addItem(item, item.quantity || 1);
            return;
        }

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('stacklyCart')) || [];
        } catch(e) {}
        cart.push(item);
        try {
            localStorage.setItem('stacklyCart', JSON.stringify(cart));
        } catch(e) {}
        updateCartUI();

        // Bounce cart bag icon in navbar
        const cartIcons = document.querySelectorAll('.cart-icon');
        cartIcons.forEach(icon => {
            icon.style.transform = 'scale(1.25)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 220);
        });

        showToast(`${item.name || 'Item'} added to bag!`, "fa-bag-shopping");
    }

    // Event delegation for Add to Cart (only if StacklyCart is not handling it)
    document.addEventListener('click', function(e) {
        if (window.StacklyCart) return; // js/cart.js handles global delegation

        const addBtn = e.target.closest('.btn-add-cart');
        if (!addBtn) return;
        if (addBtn.classList.contains('btn-wishlist-cart')) return;

        e.preventDefault();
        e.stopPropagation();

        const card = addBtn.closest('.product-card, .large-card, .promo-banner, .quick-view-card');
        let itemName = 'Tech Gadget';
        let itemPrice = '$99.00';
        let itemImg = 'assets/img/monitor.webp';
        let itemColor = 'Standard';

        if (card) {
            const titleEl = card.querySelector('.product-title, h3, #qv-title');
            const priceEl = card.querySelector('.price, #qv-price');
            const imgEl = card.querySelector('img, #qv-img');
            const colorEl = card.querySelector('.colors .color.active');

            if (titleEl) itemName = titleEl.textContent.trim();
            if (priceEl) itemPrice = priceEl.textContent.trim();
            if (imgEl) itemImg = imgEl.getAttribute('src') || imgEl.src;
            if (colorEl) itemColor = colorEl.getAttribute('data-color') || colorEl.getAttribute('title') || 'Standard';
        }

        addToCart({
            id: Date.now(),
            name: itemName,
            price: itemPrice,
            image: itemImg,
            color: itemColor,
            quantity: 1
        });
    });

    // ==========================================
    // 3. Wishlist State & Synchronization
    // ==========================================
    // Sync initial state with StacklyWishlist
    if (window.StacklyWishlist) {
        window.StacklyWishlist.syncUI();
    }

    // ==========================================
    // 4. Quick View Modal
    // ==========================================
    const qvModal = document.getElementById('quick-view-modal');
    const qvCloseBtn = document.getElementById('modal-close-btn');
    const qvImg = document.getElementById('qv-img');
    const qvTitle = document.getElementById('qv-title');
    const qvCategory = document.getElementById('qv-category');
    const qvPrice = document.getElementById('qv-price');
    const qvRating = document.getElementById('qv-rating');

    function openQuickView(card) {
        if (!qvModal) return;

        const titleEl = card.querySelector('.product-title, h3');
        const catEl = card.querySelector('.category-label, .category-tag');
        const priceEl = card.querySelector('.price');
        const ratingEl = card.querySelector('.rating');
        const imgEl = card.querySelector('.img-container img, .large-card-img img, img');

        if (qvTitle && titleEl) qvTitle.textContent = titleEl.textContent.trim();
        if (qvCategory && catEl) qvCategory.textContent = catEl.textContent.trim();
        if (qvPrice && priceEl) qvPrice.textContent = priceEl.textContent.trim();
        if (qvImg && imgEl) {
            qvImg.src = imgEl.src;
            qvImg.alt = imgEl.alt || 'Product Preview';
        }
        if (qvRating && ratingEl) {
            qvRating.innerHTML = ratingEl.innerHTML;
        }

        // Sync modal wishlist button state
        const qvWishBtn = document.getElementById('qv-wishlist-btn');
        if (qvWishBtn && window.StacklyWishlist && titleEl) {
            const isFav = window.StacklyWishlist.has(titleEl.textContent.trim());
            const qvIcon = qvWishBtn.querySelector('i');
            if (isFav) {
                qvWishBtn.classList.add('active');
                if (qvIcon) qvIcon.className = 'fa-solid fa-heart';
            } else {
                qvWishBtn.classList.remove('active');
                if (qvIcon) qvIcon.className = 'fa-regular fa-heart';
            }
        }

        qvModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeQuickView() {
        if (!qvModal) return;
        qvModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    document.addEventListener('click', function(e) {
        const qvBtn = e.target.closest('.quick-view-btn');
        if (!qvBtn) return;

        e.preventDefault();
        e.stopPropagation();

        const card = qvBtn.closest('.product-card, .large-card');
        if (card) {
            openQuickView(card);
        }
    });

    if (qvCloseBtn) qvCloseBtn.addEventListener('click', closeQuickView);
    if (qvModal) {
        qvModal.addEventListener('click', function(e) {
            if (e.target === qvModal) closeQuickView();
        });
    }

    // ==========================================
    // 5. Dynamic Product Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('freshly-dropped-grid');

    const productCatalog = {
        'all': [
            { cat: 'Monitors', name: 'Pro Display X1', rating: '4.8', price: '$899.00', img: 'assets/img/monitor.webp', badge: 'NEW' },
            { cat: 'Gaming', name: 'Play One Console', rating: '5.0', price: '$449.00', img: 'assets/img/console.webp', badge: 'BESTSELLER' },
            { cat: 'Laptops', name: 'Book Air 14', rating: '4.2', price: '$799.00', img: 'assets/img/laptop.webp', badge: '' },
            { cat: 'Accessories', name: 'Mechanical Keys', rating: '4.6', price: '$129.00', img: 'assets/img/keyboard.webp', badge: '' }
        ],
        'smartphones': [
            { cat: 'Smartphones', name: 'Galaxy Z-Fold Pro', rating: '4.9', price: '$1,799.00', img: 'assets/img/fold-phone.webp', badge: 'NEW' },
            { cat: 'Smartphones', name: 'Flip Smart X', rating: '4.8', price: '$999.00', img: 'assets/img/flip-phone.webp', badge: 'BESTSELLER' },
            { cat: 'Smartphones', name: 'Ultra Phone 14', rating: '4.7', price: '$1,199.00', img: 'assets/img/normal-phone.webp', badge: '' },
            { cat: 'Smartphones', name: 'Lite Phone Z', rating: '4.5', price: '$499.00', img: 'assets/img/lite-phone.webp', badge: '' }
        ],
        'laptops': [
            { cat: 'Laptops', name: 'Creator Pro 16', rating: '5.0', price: '$2,499.00', img: 'assets/img/laptop-pro.webp', badge: 'BESTSELLER' },
            { cat: 'Laptops', name: 'Book Air 14', rating: '4.2', price: '$799.00', img: 'assets/img/laptop.webp', badge: '' },
            { cat: 'Laptops', name: 'Gaming Beast 17', rating: '4.8', price: '$1,899.00', img: 'assets/img/laptop-gaming.webp', badge: 'NEW' },
            { cat: 'Laptops', name: 'UltraLight 13', rating: '4.6', price: '$999.00', img: 'assets/img/laptop-light.webp', badge: '' }
        ],
        'smart-gadgets': [
            { cat: 'Smart Gadgets', name: 'Watch Series 8', rating: '4.9', price: '$399.00', img: 'assets/img/watch.webp', badge: 'BESTSELLER' },
            { cat: 'Smart Gadgets', name: 'ANC Earbuds', rating: '4.7', price: '$249.00', img: 'assets/img/earbuds.webp', badge: 'NEW' },
            { cat: 'Smart Gadgets', name: 'Smart Tag Pro', rating: '4.5', price: '$29.00', img: 'assets/img/tag.webp', badge: '' },
            { cat: 'Smart Gadgets', name: 'Fitness Band X', rating: '4.6', price: '$59.00', img: 'assets/img/band.webp', badge: '' }
        ],
        'gaming': [
            { cat: 'Gaming', name: 'Play One Console', rating: '5.0', price: '$449.00', img: 'assets/img/console.webp', badge: 'BESTSELLER' },
            { cat: 'Gaming', name: 'VR Headset Pro', rating: '4.8', price: '$299.00', img: 'assets/img/vr.webp', badge: 'NEW' },
            { cat: 'Gaming', name: 'Pro Controller', rating: '4.9', price: '$69.00', img: 'assets/img/controller.webp', badge: '' },
            { cat: 'Accessories', name: 'Mechanical Keys', rating: '4.6', price: '$129.00', img: 'assets/img/keyboard.webp', badge: '' }
        ]
    };

    let isFiltering = false;

    function renderFilteredCardsMarkup(categoryKey) {
        if (!productsGrid) return;
        const items = productCatalog[categoryKey] || productCatalog['all'];

        let html = '';
        items.forEach((item) => {
            const badgeHtml = item.badge 
                ? `<div class="badge ${item.badge.toLowerCase() === 'new' ? 'new-badge' : 'best-badge'}">${item.badge}</div>` 
                : '';

            html += `
                <div class="product-card">
                    <div class="card-actions">
                        <button class="wishlist-btn" title="Add to Wishlist" aria-label="Add to Wishlist"><i class="fa-regular fa-heart"></i></button>
                        <button class="quick-view-btn" title="Quick View" aria-label="Quick View"><i class="fa-regular fa-eye"></i></button>
                    </div>
                    ${badgeHtml}
                    <div class="img-container">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="card-info">
                        <p class="category-label">${item.cat}</p>
                        <h3 class="product-title">${item.name}</h3>
                        <div class="rating">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i> <span>(${item.rating})</span>
                        </div>
                        <p class="price">${item.price}</p>
                        <button class="btn btn-add-cart w-100 mt-2"><i class="fa-solid fa-cart-shopping"></i> ADD TO CART</button>
                    </div>
                </div>
            `;
        });

        productsGrid.innerHTML = html;
        if (window.StacklyWishlist) {
            window.StacklyWishlist.syncUI();
        }
    }

    function renderFilteredProducts(categoryKey, animate = true) {
        if (!productsGrid) return;
        const currentCards = productsGrid.querySelectorAll('.product-card');

        if (!animate || !window.gsap || currentCards.length === 0) {
            renderFilteredCardsMarkup(categoryKey);
            return;
        }

        if (isFiltering) {
            // Cancel any in-flight transitions on previous cards so rapid clicks are responsive
            gsap.killTweensOf(currentCards);
            gsap.killTweensOf(productsGrid.querySelectorAll('.product-card, .img-container img'));
            isFiltering = false;
        }
        isFiltering = true;

        productsGrid.classList.add('is-filtering');

        // 1. Smooth Staggered Flexbox Exit Animation
        gsap.to(productsGrid.querySelectorAll('.product-card'), {
            opacity: 0,
            scale: 0.92,
            y: -14,
            duration: 0.22,
            stagger: 0.025,
            ease: 'power2.in',
            onComplete: () => {
                // 2. Render new cards into flexbox grid
                renderFilteredCardsMarkup(categoryKey);

                const newCards = productsGrid.querySelectorAll('.product-card');
                newCards.forEach(c => { c.dataset.filteredAnimated = "true"; });

                // 3. Staggered Fluid Flexbox Entrance Animation
                gsap.fromTo(newCards,
                    { opacity: 0, scale: 0.9, y: 28 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.55,
                        stagger: 0.07,
                        ease: 'power3.out',
                        clearProps: 'transform,opacity',
                        onComplete: () => {
                            productsGrid.classList.remove('is-filtering');
                            isFiltering = false;
                            if (typeof ScrollTrigger !== 'undefined') {
                                ScrollTrigger.refresh();
                            }
                        }
                    }
                );

                // Subtle inner image zoom entrance
                newCards.forEach((c, idx) => {
                    const img = c.querySelector('.img-container img');
                    if (img) {
                        gsap.fromTo(img,
                            { scale: 0.92, opacity: 0.4 },
                            {
                                scale: 1,
                                opacity: 1,
                                duration: 0.6,
                                delay: idx * 0.07 + 0.06,
                                ease: 'power3.out',
                                clearProps: 'transform,opacity'
                            }
                        );
                    }
                });
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.classList.contains('active')) return;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (window.gsap) {
                gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 0.28, ease: 'back.out(2)' });
            }

            const filter = btn.getAttribute('data-filter');
            renderFilteredProducts(filter, true);
        });
    });

    // ==========================================
    // 5b. Universal Hero Text Masking Animation System
    // Masks hero headlines across every page
    // ==========================================
    function initHeroTextMasking() {
        if (typeof gsap === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Automatically target hero section titles and elements across every page
        const candidateTitles = document.querySelectorAll(
            '.shop-hero-title, .contact-hero-title, .shipping-hero-title, ' +
            '.guides-hero-title, .mission-hero-title, .pd-title, ' +
            '.cart-header-text h1, .checkout-header-text h1, .wishlist-header-text h1, ' +
            '.login-visual-title, .login-main-title, .error-title'
        );

        candidateTitles.forEach(titleEl => {
            if (titleEl.dataset.maskInitialized) return;
            titleEl.dataset.maskInitialized = 'true';

            let maskChildren = titleEl.querySelectorAll('.spotlight-reveal-text, .text-mask-child');
            if (maskChildren.length === 0) {
                // Auto-wrap innerHTML in spotlight-reveal-wrap and spotlight-reveal-text
                const originalHtml = titleEl.innerHTML.trim();
                titleEl.innerHTML = `<span class="spotlight-reveal-wrap text-mask-wrap"><span class="spotlight-reveal-text text-mask-child">${originalHtml}</span></span>`;
                maskChildren = titleEl.querySelectorAll('.spotlight-reveal-text, .text-mask-child');
            }

            // Theatrical Spotlight Reveal
            gsap.fromTo(maskChildren,
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
                    stagger: 0.15,
                    ease: 'power3.out',
                    clearProps: 'clipPath,filter,transform,opacity',
                    delay: 0.18
                }
            );
        });

        // Also animate any explicitly created .spotlight-reveal-text / .text-mask-child that hasn't been animated yet
        const orphanChildren = Array.from(document.querySelectorAll('.spotlight-reveal-text, .text-mask-child')).filter(
            c => !c.closest('[data-mask-initialized]') && !c.dataset.maskAnimated && !c.closest('.hero-title')
        );

        if (orphanChildren.length > 0) {
            orphanChildren.forEach(c => { c.dataset.maskAnimated = 'true'; });
            gsap.fromTo(orphanChildren,
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
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'power3.out',
                    clearProps: 'clipPath,filter,transform,opacity',
                    delay: 0.2
                }
            );
        }
    }

    initHeroTextMasking();
    window.initHeroTextMasking = initHeroTextMasking;

    // ==========================================
    // 5c. Workspace Image Sequence Animation Controller
    // ==========================================
    function initWorkspaceImageSequence() {
        const sequenceFrame = document.getElementById('setup-sequence-frame');
        if (!sequenceFrame) return;

        const frames = sequenceFrame.querySelectorAll('.sequence-frame');
        const stepDots = sequenceFrame.parentElement.querySelectorAll('.seq-step-dot');
        const pointCards = document.querySelectorAll('.setup-point-card');
        const prevBtn = document.getElementById('seq-prev-btn');
        const nextBtn = document.getElementById('seq-next-btn');
        const playToggle = document.getElementById('seq-play-toggle');
        const playText = playToggle ? playToggle.querySelector('.seq-play-text') : null;
        const playIcon = playToggle ? playToggle.querySelector('i') : null;
        const currFrameNum = document.getElementById('seq-curr-frame-num');
        const chipLabel = document.getElementById('setup-chip-label');
        const hotspotPin = document.getElementById('sequence-hotspot-pin');
        const tooltipText = document.getElementById('hotspot-tooltip-text');
        const progressFill = document.getElementById('sequence-progress-fill');

        if (frames.length === 0) return;

        let currentIndex = 0;
        let isPlaying = true;
        let autoPlayTimer = null;
        const FRAME_DURATION = 4200; // 4.2 seconds per frame

        function goToFrame(index, userAction = false) {
            if (index < 0) index = frames.length - 1;
            if (index >= frames.length) index = 0;
            currentIndex = index;

            // 1. Update sequential frame layers with crossfade and subtle zoom
            frames.forEach((frame, idx) => {
                if (idx === currentIndex) {
                    frame.classList.add('active');
                } else {
                    frame.classList.remove('active');
                }
            });

            const activeFrame = frames[currentIndex];

            // 2. Update HUD Frame Counter (01 / 04)
            if (currFrameNum) {
                currFrameNum.textContent = String(currentIndex + 1).padStart(2, '0');
            }

            // 3. Update Status Glass Chip
            const badgeText = activeFrame.getAttribute('data-badge') || 'Validated Ergonomics';
            if (chipLabel) {
                chipLabel.textContent = badgeText;
            }

            // 4. Update Hotspot Radar Pin position & tooltip text
            const pinX = activeFrame.getAttribute('data-pin-x') || '50%';
            const pinY = activeFrame.getAttribute('data-pin-y') || '40%';
            const pinLabel = activeFrame.getAttribute('data-pin-text') || 'Precision Hardware';
            if (hotspotPin) {
                hotspotPin.style.left = pinX;
                hotspotPin.style.top = pinY;
            }
            if (tooltipText) {
                tooltipText.textContent = pinLabel;
            }

            // 5. Update timeline progress bar fill
            if (progressFill) {
                const pct = ((currentIndex + 1) / frames.length) * 100;
                progressFill.style.width = pct + '%';
            }

            // 6. Update Step Dots
            stepDots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                }
            });

            // 7. Update Synchronized Point Cards
            pointCards.forEach((card, idx) => {
                const cardBar = card.querySelector('.point-card-progress-bar');
                if (idx === currentIndex) {
                    card.classList.add('active');
                    if (cardBar) {
                        cardBar.style.transition = 'none';
                        cardBar.style.width = '0%';
                        setTimeout(() => {
                            if (isPlaying) {
                                cardBar.style.transition = `width ${FRAME_DURATION}ms linear`;
                                cardBar.style.width = '100%';
                            }
                        }, 20);
                    }
                } else {
                    card.classList.remove('active');
                    if (cardBar) {
                        cardBar.style.transition = 'none';
                        cardBar.style.width = '0%';
                    }
                }
            });

            if (userAction && isPlaying) {
                resetAutoPlayTimer();
            }
        }

        function nextFrame(user = false) {
            goToFrame(currentIndex + 1, user);
        }

        function prevFrame(user = false) {
            goToFrame(currentIndex - 1, user);
        }

        function startAutoPlay() {
            stopAutoPlay();
            isPlaying = true;
            if (playIcon) playIcon.className = 'fa-solid fa-pause';
            if (playText) playText.textContent = 'PLAYING';
            goToFrame(currentIndex);
            autoPlayTimer = setInterval(() => {
                nextFrame(false);
            }, FRAME_DURATION);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }

        function pausePlay() {
            isPlaying = false;
            stopAutoPlay();
            if (playIcon) playIcon.className = 'fa-solid fa-play';
            if (playText) playText.textContent = 'PAUSED';
            const activeCard = pointCards[currentIndex];
            if (activeCard) {
                const bar = activeCard.querySelector('.point-card-progress-bar');
                if (bar) bar.style.transition = 'none';
            }
        }

        function resetAutoPlayTimer() {
            if (isPlaying) {
                stopAutoPlay();
                autoPlayTimer = setInterval(() => {
                    nextFrame(false);
                }, FRAME_DURATION);
            }
        }

        // Bind control buttons
        if (nextBtn) nextBtn.addEventListener('click', () => nextFrame(true));
        if (prevBtn) prevBtn.addEventListener('click', () => prevFrame(true));

        if (playToggle) {
            playToggle.addEventListener('click', () => {
                if (isPlaying) {
                    pausePlay();
                } else {
                    startAutoPlay();
                }
            });
        }

        // Bind Step Dots
        stepDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToFrame(idx, true);
            });
        });

        // Bind Point Cards (click & hover with smooth intent)
        let cardHoverTimer = null;
        pointCards.forEach((card, idx) => {
            const getCardIndex = () => {
                const attr = card.getAttribute('data-frame-index');
                return attr !== null ? parseInt(attr, 10) : idx;
            };
            card.addEventListener('click', () => {
                if (cardHoverTimer) clearTimeout(cardHoverTimer);
                goToFrame(getCardIndex(), true);
            });
            card.addEventListener('mouseenter', () => {
                if (cardHoverTimer) clearTimeout(cardHoverTimer);
                cardHoverTimer = setTimeout(() => {
                    goToFrame(getCardIndex(), true);
                }, 180);
            });
            card.addEventListener('mouseleave', () => {
                if (cardHoverTimer) {
                    clearTimeout(cardHoverTimer);
                    cardHoverTimer = null;
                }
            });
        });

        // Pause when hovering sequence frame, resume on leave
        sequenceFrame.addEventListener('mouseenter', () => {
            if (isPlaying) stopAutoPlay();
        });
        sequenceFrame.addEventListener('mouseleave', () => {
            if (isPlaying) {
                autoPlayTimer = setInterval(() => {
                    nextFrame(false);
                }, FRAME_DURATION);
            }
        });

        // Keyboard arrows navigation when focused
        sequenceFrame.setAttribute('tabindex', '0');
        sequenceFrame.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextFrame(true);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevFrame(true);
            }
        });

        // Initialize frame 0 and start auto-play
        startAutoPlay();
    }
    initWorkspaceImageSequence();

    // ==========================================
    // 6. Category Cards Interactive Navigation
    // ==========================================
    const categoryCards = document.querySelectorAll('.category-item');
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const cat = card.getAttribute('data-category') || '';
            const exploreLink = card.querySelector('.explore-link');
            const targetFilter = exploreLink ? exploreLink.getAttribute('data-filter') : 'all';

            // Find matching filter button
            const matchBtn = document.querySelector(`.filter-btn[data-filter="${targetFilter}"]`);
            if (matchBtn) {
                filterBtns.forEach(b => b.classList.remove('active'));
                matchBtn.classList.add('active');
                renderFilteredProducts(targetFilter, true);
            }

            // Smooth scroll to freshly-dropped
            const dropSection = document.getElementById('freshly-dropped');
            if (dropSection) {
                if (window.lenis) {
                    window.lenis.scrollTo(dropSection, { offset: -85, duration: 1.2 });
                } else {
                    window.scrollTo({
                        top: dropSection.offsetTop - 85,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==========================================
    // 7. Header Search Bar Toggle & Search
    // ==========================================
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchWrapper = document.getElementById('search-box-wrapper');
    const searchInput = document.getElementById('header-search-input');
    const searchSubmitBtn = document.getElementById('search-submit-btn');

    if (searchToggleBtn && searchWrapper && searchInput) {
        searchToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchWrapper.classList.toggle('active');
            if (searchWrapper.classList.contains('active')) {
                searchInput.focus();
            }
        });

        function handleSearch(term) {
            const q = term.trim().toLowerCase();
            if (!q) {
                showToast("Please enter a search term", "fa-circle-exclamation");
                return;
            }

            // Scroll to products and search
            const dropSec = document.getElementById('freshly-dropped');
            if (dropSec) {
                if (window.lenis) {
                    window.lenis.scrollTo(dropSec, { offset: -85, duration: 1.2 });
                } else {
                    window.scrollTo({
                        top: dropSec.offsetTop - 85,
                        behavior: 'smooth'
                    });
                }
            }

            // Map keyword to filter or toast
            if (q.includes('phone')) {
                const btn = document.querySelector('.filter-btn[data-filter="smartphones"]');
                if (btn) btn.click();
            } else if (q.includes('laptop') || q.includes('mac') || q.includes('book')) {
                const btn = document.querySelector('.filter-btn[data-filter="laptops"]');
                if (btn) btn.click();
            } else if (q.includes('game') || q.includes('play') || q.includes('console')) {
                const btn = document.querySelector('.filter-btn[data-filter="gaming"]');
                if (btn) btn.click();
            } else if (q.includes('watch') || q.includes('ear') || q.includes('audio') || q.includes('headphone')) {
                const btn = document.querySelector('.filter-btn[data-filter="smart-gadgets"]');
                if (btn) btn.click();
            } else {
                showToast(`Showing results for "${term}"`, "fa-magnifying-glass");
            }
        }

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(searchInput.value);
            }
        });

        if (searchSubmitBtn) {
            searchSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleSearch(searchInput.value);
            });
        }
    }

    // ==========================================
    // 8. Mobile Navigation Drawer
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const closeMobileBtn = document.getElementById('close-mobile');
    const mobileLinks = document.querySelectorAll('.mobile-nav-item');

    function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeMobileMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (closeMobileBtn) closeMobileBtn.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ==========================================
    // 9. Smooth Scrolling with Sticky Nav Offset
    // ==========================================
    const scrollLinks = document.querySelectorAll('.scroll-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = 82;
                    if (window.lenis) {
                        window.lenis.scrollTo(target, { offset: -headerHeight, duration: 1.2 });
                    } else {
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // ==========================================
    // 10. Live Countdown Timer in Promo Banner
    // ==========================================
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    if (cdDays && cdHours && cdMins && cdSecs) {
        let totalSeconds = (2 * 24 * 3600) + (14 * 3600) + (35 * 60) + 20;

        setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                const d = Math.floor(totalSeconds / (24 * 3600));
                const h = Math.floor((totalSeconds % (24 * 3600)) / 3600);
                const m = Math.floor((totalSeconds % 3600) / 60);
                const s = Math.floor(totalSeconds % 60);

                cdDays.textContent = String(d).padStart(2, '0');
                cdHours.textContent = String(h).padStart(2, '0');
                cdMins.textContent = String(m).padStart(2, '0');
                cdSecs.textContent = String(s).padStart(2, '0');
            }
        }, 1000);
    }

    // ==========================================
    // 11. Newsletter Form Validation
    // ==========================================
    const nlForm = document.getElementById('newsletter-form');
    const nlEmail = document.getElementById('email-input');
    const nlError = document.querySelector('.form-feedback .error-msg');
    const nlSuccess = document.querySelector('.form-feedback .success-msg');

    if (nlForm && nlEmail) {
        nlForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const val = nlEmail.value.trim();
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!val || !emailPattern.test(val)) {
                if (nlError) nlError.style.display = 'flex';
                if (nlSuccess) nlSuccess.style.display = 'none';
                nlEmail.style.borderColor = '#DC2626';
            } else {
                if (nlError) nlError.style.display = 'none';
                if (nlSuccess) nlSuccess.style.display = 'flex';
                nlEmail.style.borderColor = '';
                nlEmail.value = '';
                showToast("Subscribed! Thank you for joining STACKLY.", "fa-circle-check");

                setTimeout(() => {
                    if (nlSuccess) nlSuccess.style.display = 'none';
                }, 4500);
            }
        });

        nlEmail.addEventListener('input', () => {
            nlEmail.style.borderColor = '';
            if (nlError) nlError.style.display = 'none';
        });
    }

    // ==========================================
    // 12. Support & Info Modal
    // ==========================================
    const infoModal = document.getElementById('info-modal');
    const infoCloseBtn = document.getElementById('info-modal-close');
    const infoOkBtn = document.getElementById('info-modal-ok');
    const infoTitle = document.getElementById('info-modal-title');
    const infoBody = document.getElementById('info-modal-body');

    const infoContent = {
        'shipping': {
            title: 'Shipping & Returns Policy',
            body: '<p><strong>Fast & Free Delivery:</strong> We offer complimentary express shipping on all orders over $75 within the continental US. Standard delivery arrives within 2-4 business days.</p><br><p><strong>30-Day Hassle-Free Returns:</strong> If you are not completely satisfied with your purchase, return it in original packaging within 30 days for a full refund.</p>'
        },
        'tracking': {
            title: 'Track Your Order',
            body: '<p>You will receive an automated shipping notification with real-time tracking details as soon as your package leaves our fulfillment center.</p><br><p>Need help right now? Check your account dashboard under <em>My Orders</em> or contact support@stacklytech.com with your Order ID.</p>'
        },
        'faqs': {
            title: 'Frequently Asked Questions',
            body: '<p><strong>Are all products genuine?</strong><br>Yes, STACKLY is an authorized retailer for all featured brands. Every device comes with full manufacturer warranty.</p><br><p><strong>What payment methods do you accept?</strong><br>We accept all major credit cards, Apple Pay, Google Pay, and PayPal.</p>'
        },
        'warranty': {
            title: 'STACKLY Hardware Warranty',
            body: '<p>All electronics purchased on STACKLY come with a minimum 2-year warranty covering manufacturing defects, battery health standards, and verified hardware repairs.</p>'
        },
        'contact': {
            title: 'Contact Customer Support',
            body: '<p>Our support team is available 24 hours a day, 7 days a week.</p><br><p><strong>Email:</strong> support@stacklytech.com<br><strong>Phone:</strong> +1 (800) 555-STACK<br><strong>Live Chat:</strong> Available Mon-Sun via account dashboard.</p>'
        },
        'mission': {
            title: 'Our Mission',
            body: '<p>At STACKLY, our mission is to deliver thoughtfully selected, premium hardware engineered to elevate your daily productivity, gaming, and creative flow.</p><br><p>We partner directly with verified electronics manufacturers to offer authentic innovation, high endurance, and honest technology built for everyday life.</p>'
        }
    };

    document.querySelectorAll('.info-modal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const key = link.getAttribute('data-info');
            const data = infoContent[key] || infoContent['shipping'];

            if (infoTitle) infoTitle.textContent = data.title;
            if (infoBody) infoBody.innerHTML = data.body;
            if (infoModal) {
                infoModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    function closeInfoModal() {
        if (infoModal) {
            infoModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    if (infoCloseBtn) infoCloseBtn.addEventListener('click', closeInfoModal);
    if (infoOkBtn) infoOkBtn.addEventListener('click', closeInfoModal);
    if (infoModal) {
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) closeInfoModal();
        });
    }

    // Color Swatch Selection & Product Image Synchronization
    document.querySelectorAll('.color').forEach(swatch => {
        swatch.addEventListener('click', function() {
            const card = this.closest('.large-card');
            const siblings = this.parentElement.querySelectorAll('.color');
            siblings.forEach(s => {
                s.classList.remove('active');
                s.setAttribute('aria-checked', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-checked', 'true');

            // Swap card image if data-img is provided
            const newImgSrc = this.getAttribute('data-img');
            const colorName = this.getAttribute('data-color') || 'Selected';
            if (newImgSrc && card) {
                const imgEl = card.querySelector('.large-card-img img');
                if (imgEl && imgEl.getAttribute('src') !== newImgSrc) {
                    imgEl.style.opacity = '0';
                    setTimeout(() => {
                        imgEl.src = newImgSrc;
                        const title = card.querySelector('.product-title');
                        if (title) imgEl.alt = `${title.textContent} - ${colorName}`;
                        imgEl.style.opacity = '1';
                    }, 120);
                }
            }
        });
    });

    // ==========================================
    // 14. Customer Reviews Carousel Controller
    // ==========================================
    const reviewsTrack = document.getElementById('reviews-track');
    const reviewsViewport = document.getElementById('reviews-viewport');
    const revPrevBtn = document.getElementById('review-prev-btn');
    const revNextBtn = document.getElementById('review-next-btn');
    const revCounter = document.getElementById('review-counter-text');
    const revDots = document.querySelectorAll('#reviews-dots .dot-btn');
    const revSlides = document.querySelectorAll('.review-slide');

    let currentRevIndex = 0;
    const totalRevSlides = revSlides.length;

    function goToReviewSlide(index) {
        if (totalRevSlides === 0) return;
        currentRevIndex = (index + totalRevSlides) % totalRevSlides;

        if (reviewsTrack) {
            reviewsTrack.style.transform = `translateX(-${currentRevIndex * 100}%)`;
        }

        if (revCounter) {
            revCounter.textContent = `Review ${currentRevIndex + 1} of ${totalRevSlides}`;
        }

        revDots.forEach((dot, i) => {
            const isActive = i === currentRevIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    }

    if (revPrevBtn) {
        revPrevBtn.addEventListener('click', () => {
            goToReviewSlide(currentRevIndex - 1);
        });
    }

    if (revNextBtn) {
        revNextBtn.addEventListener('click', () => {
            goToReviewSlide(currentRevIndex + 1);
        });
    }

    revDots.forEach((dot) => {
        dot.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'), 10);
            if (!isNaN(idx)) goToReviewSlide(idx);
        });
    });

    // Keyboard Arrow navigation when viewport is focused
    if (reviewsViewport) {
        reviewsViewport.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToReviewSlide(currentRevIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToReviewSlide(currentRevIndex + 1);
            }
        });

        // Touch Swipe gestures on Mobile / Tablet
        let touchStartX = 0;
        let touchEndX = 0;
        let isTouching = false;

        reviewsViewport.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                isTouching = true;
            }
        }, { passive: true });

        reviewsViewport.addEventListener('touchmove', (e) => {
            if (isTouching && e.touches && e.touches.length > 0) {
                touchEndX = e.touches[0].clientX;
            }
        }, { passive: true });

        reviewsViewport.addEventListener('touchend', () => {
            if (!isTouching) return;
            isTouching = false;
            const diffX = touchStartX - touchEndX;
            // Min swipe distance 35px
            if (touchEndX !== 0 && Math.abs(diffX) > 35) {
                if (diffX > 0) {
                    goToReviewSlide(currentRevIndex + 1); // Swiped left
                } else {
                    goToReviewSlide(currentRevIndex - 1); // Swiped right
                }
            }
            touchStartX = 0;
            touchEndX = 0;
        });
    }

    // Close Modals on ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
            closeInfoModal();
            closeMobileMenu();
        }
    });

    // ==========================================
    // 15. Sticky Navbar Scroll Elevation
    // ==========================================
    const siteHeaderEl = document.querySelector('.site-header');
    if (siteHeaderEl) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 10) {
                siteHeaderEl.classList.add('is-scrolled', 'scrolled');
            } else {
                siteHeaderEl.classList.remove('is-scrolled', 'scrolled');
            }
        };
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll();
    }

    // ==========================================
    // 16. Accessible FAQ Accordion (Smooth Controlled Height & Opacity)
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach((item, index) => {
            const questionBtn = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!questionBtn || !answer) return;

            // Initialize state cleanly
            const isInitiallyActive = item.classList.contains('active');
            if (isInitiallyActive) {
                answer.removeAttribute('hidden');
                answer.style.height = 'auto';
                answer.style.opacity = '1';
                questionBtn.setAttribute('aria-expanded', 'true');
            } else {
                answer.style.height = '0px';
                answer.style.opacity = '0';
                answer.style.overflow = 'hidden';
                answer.setAttribute('hidden', '');
                questionBtn.setAttribute('aria-expanded', 'false');
            }

            questionBtn.addEventListener('click', () => {
                const isCurrentlyActive = item.classList.contains('active');

                // Close all other items (single-open accordion requirement)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.faq-question');
                        const otherAns = otherItem.querySelector('.faq-answer');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherAns) {
                            if (typeof gsap !== 'undefined') {
                                gsap.to(otherAns, {
                                    height: 0,
                                    opacity: 0,
                                    duration: 0.32,
                                    ease: 'power2.inOut',
                                    onComplete: () => {
                                        otherAns.setAttribute('hidden', '');
                                    }
                                });
                            } else {
                                otherAns.style.height = '0px';
                                otherAns.style.opacity = '0';
                                otherAns.setAttribute('hidden', '');
                            }
                        }
                    }
                });

                // Toggle current item
                if (isCurrentlyActive) {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                    if (typeof gsap !== 'undefined') {
                        gsap.to(answer, {
                            height: 0,
                            opacity: 0,
                            duration: 0.32,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                answer.setAttribute('hidden', '');
                            }
                        });
                    } else {
                        answer.style.height = '0px';
                        answer.style.opacity = '0';
                        answer.setAttribute('hidden', '');
                    }
                } else {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                    answer.removeAttribute('hidden');
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.killTweensOf(answer);
                        answer.style.height = 'auto';
                        const fullHeight = answer.scrollHeight;
                        gsap.fromTo(answer,
                            { height: 0, opacity: 0 },
                            {
                                height: fullHeight,
                                opacity: 1,
                                duration: 0.36,
                                ease: 'power2.out',
                                onComplete: () => {
                                    answer.style.height = 'auto';
                                }
                            }
                        );
                    } else {
                        answer.style.height = 'auto';
                        answer.style.opacity = '1';
                    }
                }
            });

            // Keyboard navigation (ArrowDown, ArrowUp, Home, End)
            questionBtn.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % faqItems.length;
                    const nextBtn = faqItems[nextIndex].querySelector('.faq-question');
                    if (nextBtn) nextBtn.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + faqItems.length) % faqItems.length;
                    const prevBtn = faqItems[prevIndex].querySelector('.faq-question');
                    if (prevBtn) prevBtn.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    const firstBtn = faqItems[0].querySelector('.faq-question');
                    if (firstBtn) firstBtn.focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    const lastBtn = faqItems[faqItems.length - 1].querySelector('.faq-question');
                    if (lastBtn) lastBtn.focus();
                }
            });
        });
    }

    // ==========================================
    // 17. Global Product Card -> Product Details Navigation
    // ==========================================
    const PRODUCT_SLUG_ALIASES = {
        'sonix-pro-wireless-anc-headphones': 'sonix-pro-wireless',
        'book-air-14-laptop': 'book-air-14',
        'view-27-pro-4k-monitor': 'view-27-4k-monitor',
        'play-station-s-duo-bundle': 'play-one-extra-controller-bundle',
        'studio-over-ear-anc': 'sonix-studio-max',
        'sound-home-speaker': 'pulse-home-speaker'
    };

    function toProductSlug(text) {
        if (!text) return 'sonix-pro-wireless';
        const raw = text.toString().toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return PRODUCT_SLUG_ALIASES[raw] || raw;
    }

    document.addEventListener('click', function (e) {
        // Ignore clicks on interactive action buttons, color swatches, or explicit links
        if (e.target.closest('button, a, input, select, textarea, .btn-add-cart, .wishlist-btn, .quick-view-btn, .colors, .color, [data-action]')) {
            return;
        }

        const card = e.target.closest('.product-card, .large-card, .wishlist-item-card');
        if (!card) return;

        const explicitId = card.getAttribute('data-product-id') || card.getAttribute('data-id');
        const titleEl = card.querySelector('.product-title, h3, h4');
        const rawIdentifier = explicitId || (titleEl ? titleEl.textContent.trim() : '');
        if (!rawIdentifier) return;

        const slug = toProductSlug(rawIdentifier);
        const isSubfolder = window.location.pathname.includes('/dashboards/');
        const targetPath = (isSubfolder ? '../' : '') + `product.html?id=${encodeURIComponent(slug)}`;
        window.location.href = targetPath;
    });
});

