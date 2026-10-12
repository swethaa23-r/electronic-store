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

    // ==========================================
    // 2. Shopping Cart Management
    // ==========================================
    const cartCountElems = document.querySelectorAll('.cart-count');
    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem('stacklyCart')) || [];
    } catch(e) {
        cart = [];
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElems.forEach(el => {
            el.textContent = totalItems;
        });
    }
    updateCartUI();

    function addToCart(item) {
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

    // Event delegation for Add to Cart
    document.addEventListener('click', function(e) {
        const addBtn = e.target.closest('.btn-add-cart');
        if (!addBtn) return;

        e.preventDefault();
        e.stopPropagation();

        // Extract details from card if available
        const card = addBtn.closest('.product-card, .large-card, .promo-banner, .quick-view-card');
        let itemName = 'Tech Gadget';
        let itemPrice = '$99.00';
        let itemImg = 'assets/img/monitor.webp';

        if (card) {
            const titleEl = card.querySelector('.product-title, h3');
            const priceEl = card.querySelector('.price');
            const imgEl = card.querySelector('img');

            if (titleEl) itemName = titleEl.textContent.trim();
            if (priceEl) itemPrice = priceEl.textContent.trim();
            if (imgEl) itemImg = imgEl.src;
        }

        addToCart({
            id: Date.now(),
            name: itemName,
            price: itemPrice,
            image: itemImg,
            quantity: 1
        });
    });

    // ==========================================
    // 3. Wishlist Toggle Functionality
    // ==========================================
    let wishlistCount = 0;
    const navWishlistBadge = document.getElementById('nav-wishlist-count');

    function updateWishlistBadge() {
        const activeHearts = document.querySelectorAll('.wishlist-btn.active').length;
        wishlistCount = activeHearts;
        if (navWishlistBadge) {
            navWishlistBadge.textContent = wishlistCount;
            navWishlistBadge.style.transform = 'scale(1.25)';
            setTimeout(() => {
                navWishlistBadge.style.transform = 'scale(1)';
            }, 200);
        }
    }

    document.addEventListener('click', function(e) {
        const wishBtn = e.target.closest('.wishlist-btn');
        if (!wishBtn) return;

        e.preventDefault();
        e.stopPropagation();

        const icon = wishBtn.querySelector('i');
        const isFavorited = wishBtn.classList.contains('active');

        if (isFavorited) {
            wishBtn.classList.remove('active');
            if (icon) {
                icon.className = 'fa-regular fa-heart';
            }
            updateWishlistBadge();
            showToast("Removed from wishlist", "fa-heart-circle-xmark");
        } else {
            wishBtn.classList.add('active');
            if (icon) {
                icon.className = 'fa-solid fa-heart';
            }
            updateWishlistBadge();
            showToast("Saved to your wishlist!", "fa-heart");
        }
    });

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

    function renderFilteredProducts(categoryKey) {
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

        productsGrid.style.opacity = '0';
        productsGrid.style.transform = 'translateY(10px)';
        productsGrid.style.transition = 'all 0.25s ease';

        setTimeout(() => {
            productsGrid.innerHTML = html;
            productsGrid.style.opacity = '1';
            productsGrid.style.transform = 'translateY(0)';
        }, 180);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            renderFilteredProducts(filter);
        });
    });

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
                renderFilteredProducts(targetFilter);
            }

            // Smooth scroll to freshly-dropped
            const dropSection = document.getElementById('freshly-dropped');
            if (dropSection) {
                window.scrollTo({
                    top: dropSection.offsetTop - 85,
                    behavior: 'smooth'
                });
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
                window.scrollTo({
                    top: dropSec.offsetTop - 85,
                    behavior: 'smooth'
                });
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
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
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
});
