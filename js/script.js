document.addEventListener("DOMContentLoaded", function() {
    // Initialize AOS Animation library
    

    // Cart Counter Logic
    const cartCount = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    let count = 0;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            cartCount.textContent = count;
            
            // Add a small animation to cart icon
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Mobile Menu Logic
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const closeMobile = document.querySelector('.close-mobile');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    function openMenu(e) {
        if(e) e.preventDefault();
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    if(mobileToggle) mobileToggle.addEventListener('click', openMenu);
    if(closeMobile) closeMobile.addEventListener('click', closeMenu);
    if(mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Newsletter Validation Logic
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const errorMsg = document.querySelector('.error-msg');
    const successMsg = document.querySelector('.success-msg');

    if(newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailValue = emailInput.value.trim();
            
            // Simple email regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailValue || !emailRegex.test(emailValue)) {
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
            } else {
                errorMsg.style.display = 'none';
                successMsg.style.display = 'block';
                emailInput.value = ''; // clear input
                
                // Hide success message after 4 seconds
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 4000);
            }
        });
    }
});


// Global Interceptions for Header Search and Buttons
document.addEventListener('DOMContentLoaded', () => {
    // 1. Search Bar Validation
    const searchBars = document.querySelectorAll('.search-bar input, .filter-search input, .nav-icons input');
    searchBars.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                input.style.border = '';
                const oldErr = input.parentElement.querySelector('.validation-error');
                if(oldErr) oldErr.remove();
                
                if(input.value.trim() === '') {
                    input.style.border = '1px solid #D32F2F';
                    const err = document.createElement('div');
                    err.className = 'validation-error';
                    err.style.color = '#D32F2F';
                    err.style.fontSize = '0.8rem';
                    err.style.position = 'absolute';
                    err.style.marginTop = '5px';
                    err.textContent = 'Please enter a valid search term before searching.';
                    input.parentElement.style.position = 'relative';
                    input.parentElement.appendChild(err);
                } else {
                    window.location.href = '404.html';
                }
            }
        }, true);
        
        input.addEventListener('input', () => {
            input.style.border = '';
            const err = input.parentElement.querySelector('.validation-error');
            if(err) err.remove();
        });
    });

    // 2. Intercept Buttons (Add to cart, Wishlist, Bell) -> 404
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button, .action-btn, .btn-primary, .btn-secondary, .btn-add-cart, .icon-link, .nav-icons a');
        if(!target) return;

        // Exemptions: Mobile toggles, Submit buttons
        if(
            target.type === 'submit' || 
            target.classList.contains('mobile-toggle') ||
            target.classList.contains('close-mobile')
        ) {
            return;
        }

        // Standard link exemption
        if(target.tagName === 'A' && target.href && !target.href.includes('javascript:void(0)') && !target.href.includes('#')) {
            // Let legitimate links pass
            return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = '404.html';
    }, true);
});


/* --- Enhanced Home Page Scripts --- */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Countdown Timer Logic
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const cdSecs = document.getElementById('cd-secs');

    if (cdDays) {
        // Set countdown for 2 days, 14 hours, 35 mins, 20 secs from now for demo
        let timeRemaining = (2 * 24 * 60 * 60) + (14 * 60 * 60) + (35 * 60) + 20;
        
        const timer = setInterval(() => {
            if (timeRemaining <= 0) {
                clearInterval(timer);
                const promoCountdown = document.getElementById('promo-countdown');
                if (promoCountdown) promoCountdown.innerHTML = '<h3 style="color:#D32F2F;">OFFER ENDED</h3>';
                return;
            }
            
            timeRemaining--;
            
            const d = Math.floor(timeRemaining / (24 * 60 * 60));
            const h = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
            const m = Math.floor((timeRemaining % (60 * 60)) / 60);
            const s = Math.floor(timeRemaining % 60);
            
            cdDays.textContent = d.toString().padStart(2, '0');
            cdHours.textContent = h.toString().padStart(2, '0');
            cdMins.textContent = m.toString().padStart(2, '0');
            cdSecs.textContent = s.toString().padStart(2, '0');
        }, 1000);
    }

    // 2. Add To Cart Logic
    const cartCountElems = document.querySelectorAll('.cart-count');
    const addCartBtns = document.querySelectorAll('.btn-add-cart');
    
    // Initialize cart count
    let cart = JSON.parse(localStorage.getItem('stacklyCart')) || [];
    function updateCartUI() {
        cartCountElems.forEach(el => el.textContent = cart.length);
    }
    updateCartUI();

    addCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent going to 404 from global validation script
            e.preventDefault();
            e.stopImmediatePropagation();
            
            cart.push({ id: Date.now(), item: 'Gadget' });
            localStorage.setItem('stacklyCart', JSON.stringify(cart));
            updateCartUI();
            
            // Show toast notification
            const toast = document.createElement('div');
            toast.textContent = "Item added to cart!";
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.right = '20px';
            toast.style.backgroundColor = '#333333';
            toast.style.color = '#FFFFFF';
            toast.style.padding = '12px 20px';
            toast.style.borderRadius = '6px';
            toast.style.zIndex = '9999';
            toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            toast.style.fontSize = '0.9rem';
            toast.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        });
    });

    // 3. Smooth Scrolling for Hero Buttons
    const scrollLinks = document.querySelectorAll('.scroll-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // stop 404 redirect
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSec = document.querySelector(targetId);
                if (targetSec) {
                    window.scrollTo({
                        top: targetSec.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4. Newsletter Validation
    const nlForm = document.getElementById('newsletter-form');
    if (nlForm) {
        nlForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            const emailInput = document.getElementById('email-input');
            const errorMsg = document.querySelector('.form-feedback .error-msg');
            const successMsg = document.querySelector('.form-feedback .success-msg');
            
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';
            emailInput.style.border = '';
            
            const val = emailInput.value.trim();
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
            if (val === '' || !emailRegex.test(val)) {
                errorMsg.style.display = 'block';
                emailInput.style.border = '1px solid #D32F2F';
            } else {
                successMsg.style.display = 'block';
                emailInput.value = '';
            }
        });
    }

        // 5. Dynamic Product Filters Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('freshly-dropped-grid');
    
    // Original initial HTML (ALL) is preserved on load. We only switch when a filter is clicked.
    // If they click 'all', we either restore the original or just re-render. We'll render dynamically.
    const productData = {
        'all': [
            { cat: 'Monitors', name: 'Pro Display X1', rating: '4.8', price: '$899.00', img: 'assets/img/monitor.webp', badge: 'NEW' },
            { cat: 'Gaming', name: 'Play One Console', rating: '5.0', price: '$449.00', img: 'assets/img/console.webp', badge: 'BESTSELLER' },
            { cat: 'Laptops', name: 'Book Air 14', rating: '4.2', price: '$799.00', img: 'assets/img/laptop.webp', badge: '' },
            { cat: 'Accessories', name: 'Mechanical Keys', rating: '4.6', price: '$129.00', img: 'assets/img/keyboard.webp', badge: '' }
        ],
        'smartphones': [
            { cat: 'Smartphones', name: 'Galaxy Z-Fold Pro', rating: '4.9', price: '$1799.00', img: 'assets/img/fold-phone.webp', badge: 'NEW' },
            { cat: 'Smartphones', name: 'Flip Smart X', rating: '4.8', price: '$999.00', img: 'assets/img/flip-phone.webp', badge: 'TRENDING' },
            { cat: 'Smartphones', name: 'Ultra Phone 14', rating: '4.7', price: '$1199.00', img: 'assets/img/normal-phone.webp', badge: '' },
            { cat: 'Smartphones', name: 'Lite Phone Z', rating: '4.5', price: '$499.00', img: 'assets/img/lite-phone.webp', badge: '' }
        ],
        'laptops': [
            { cat: 'Laptops', name: 'Creator Pro 16', rating: '5.0', price: '$2499.00', img: 'assets/img/laptop-pro.webp', badge: 'BESTSELLER' },
            { cat: 'Laptops', name: 'Book Air 14', rating: '4.2', price: '$799.00', img: 'assets/img/laptop.webp', badge: '' },
            { cat: 'Laptops', name: 'Gaming Beast 17', rating: '4.8', price: '$1899.00', img: 'assets/img/laptop-gaming.webp', badge: 'NEW' },
            { cat: 'Laptops', name: 'UltraLight 13', rating: '4.6', price: '$999.00', img: 'assets/img/laptop-light.webp', badge: '' }
        ],
        'smart-gadgets': [
            { cat: 'Smart Gadgets', name: 'Watch Series 8', rating: '4.9', price: '$399.00', img: 'assets/img/watch.webp', badge: 'TRENDING' },
            { cat: 'Smart Gadgets', name: 'ANC Earbuds', rating: '4.7', price: '$249.00', img: 'assets/img/earbuds.webp', badge: '' },
            { cat: 'Smart Gadgets', name: 'Smart Tag', rating: '4.5', price: '$29.00', img: 'assets/img/tag.webp', badge: '' },
            { cat: 'Smart Gadgets', name: 'Fitness Band X', rating: '4.6', price: '$59.00', img: 'assets/img/band.webp', badge: '' }
        ],
        'gaming': [
            { cat: 'Gaming', name: 'Play One Console', rating: '5.0', price: '$449.00', img: 'assets/img/console.webp', badge: 'BESTSELLER' },
            { cat: 'Gaming', name: 'VR Headset Pro', rating: '4.8', price: '$299.00', img: 'assets/img/vr.webp', badge: 'NEW' },
            { cat: 'Gaming', name: 'Pro Controller', rating: '4.9', price: '$69.00', img: 'assets/img/controller.webp', badge: '' },
            { cat: 'Accessories', name: 'Mechanical Keys', rating: '4.6', price: '$129.00', img: 'assets/img/keyboard.webp', badge: '' }
        ]
    };

    function renderProducts(category) {
        if (!productsGrid) return;
        
        const items = productData[category] || productData['all'];
        
        let html = '';
        items.forEach((item, index) => {
            const badgeHtml = item.badge ? `<div class="badge ${item.badge.toLowerCase() === 'new' ? 'new-badge' : 'bestseller-badge'}">${item.badge}</div>` : '';
            
            // Note: In real app, we re-bind listeners, but since we use global event delegation or simple onclicks, it works.
            // For the add to cart button to work without re-binding if we used querySelectorAll previously, we just re-run that piece.
            html += `
                <div class="product-card" style="animation: fadeUp 0.5s ease ${index * 0.1}s both;">
                    <div class="card-actions">
                        <button class="wishlist-btn"><i class="fa-regular fa-heart"></i></button>
                        <button class="quick-view-btn"><i class="fa-regular fa-eye"></i></button>
                    </div>
                    ${badgeHtml}
                    <div class="img-container">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="card-info">
                        <p class="category-label">${item.cat}</p>
                        <h3>${item.name}</h3>
                        <div class="rating"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i> <span>(${item.rating})</span></div>
                        <p class="price">${item.price}</p>
                        <button class="btn btn-add-cart w-100 mt-2">ADD TO CART</button>
                    </div>
                </div>
            `;
        });
        
        productsGrid.style.opacity = '0';
        setTimeout(() => {
            productsGrid.innerHTML = html;
            productsGrid.style.opacity = '1';
            
            // Re-bind add to cart
            const newCartBtns = productsGrid.querySelectorAll('.btn-add-cart');
            newCartBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    
                    let cart = JSON.parse(localStorage.getItem('stacklyCart')) || [];
                    cart.push({ id: Date.now(), item: 'Gadget' });
                    localStorage.setItem('stacklyCart', JSON.stringify(cart));
                    
                    const cartCountElems = document.querySelectorAll('.cart-count');
                    cartCountElems.forEach(el => el.textContent = cart.length);
                    
                    const toast = document.createElement('div');
                    toast.textContent = "Item added to cart!";
                    toast.style.position = 'fixed';
                    toast.style.bottom = '20px';
                    toast.style.right = '20px';
                    toast.style.backgroundColor = '#333333';
                    toast.style.color = '#FFFFFF';
                    toast.style.padding = '12px 20px';
                    toast.style.borderRadius = '6px';
                    toast.style.zIndex = '9999';
                    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    toast.style.fontSize = '0.9rem';
                    toast.style.transition = 'opacity 0.3s ease';
                    document.body.appendChild(toast);
                    
                    setTimeout(() => {
                        toast.style.opacity = '0';
                        setTimeout(() => toast.remove(), 300);
                    }, 3000);
                });
            });
            
            // Re-bind hover GSAP
            if (typeof gsap !== 'undefined') {
                const newCards = productsGrid.querySelectorAll('.product-card');
                newCards.forEach(card => {
                    const img = card.querySelector('.img-container img, img');
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' });
                        if (img) gsap.to(img, { scale: 1.04, duration: 0.4, ease: 'power2.out' });
                    });
                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
                        if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
                    });
                });
            }
        }, 200);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            // Remove active class from siblings
            const parent = btn.parentElement;
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterKey = btn.getAttribute('data-filter') || btn.textContent.toLowerCase().replace(' ', '-');
            renderProducts(filterKey);
        });
    });
});
