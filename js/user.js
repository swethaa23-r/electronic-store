/**
 * STACKLY - User Dashboard Controller (user.js)
 * Supports customer dashboard pages:
 * - user-dashboard.html (Customer overview & welcome stats)
 * - user-orders.html (Order history, live filtering, dynamic order detail modal & shipping/tracking link)
 * - user-addresses.html (Saved address management, add, delete, set default)
 * - user-profile.html (Personal details, security preferences, session update)
 * - user-settings.html (Language, currency, notification preferences)
 * - user-wishlist.html (Coordinated with wishlist.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Auth Check (Demo Mode fallback)
    const userRole = localStorage.getItem('userRole') || "User";
    if (userRole !== "User" && userRole !== "Admin") {
        window.location.href = "../login.html";
        return;
    }

    // 2. Toast Notification Helper
    function showUserToast(message, icon = 'fa-circle-check') {
        let container = document.querySelector('.admin-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'admin-toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = 'admin-toast';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 260);
        }, 2600);
    }

    // 3. Dynamic Topbar Profile Email & Profile Header
    try {
        const session = JSON.parse(localStorage.getItem('stacklyUserSession'));
        const emailEl = document.getElementById('topbar-user-email');
        if (emailEl) {
            emailEl.textContent = (session && session.email) ? session.email : 'customer@stackly.com';
        }
        if (session) {
            if (session.name) {
                const welcomeHeading = document.querySelector('.user-info-text h2');
                if (welcomeHeading) welcomeHeading.textContent = `Welcome back, ${session.name}`;
                const avatarEl = document.querySelector('.user-avatar-large');
                if (avatarEl) {
                    const initials = session.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SJ';
                    avatarEl.textContent = initials;
                }
            }
            if (session.email) {
                const profileEmail = document.querySelector('.user-info-text p');
                if (profileEmail) profileEmail.textContent = session.email;
            }
        }
    } catch (e) {}

    // 4. Mobile Sidebar Toggle with Accessible Controls (<= 992px)
    const hamburger = document.querySelector('.hamburger');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');

    function openSidebar() { 
        if (sidebar) sidebar.classList.add('active'); 
        if (overlay) overlay.classList.add('active'); 
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll'); 
        document.documentElement.classList.add('no-scroll'); 
    }
    function closeSidebarFunc() { 
        if (sidebar) sidebar.classList.remove('active'); 
        if (overlay) overlay.classList.remove('active'); 
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll'); 
        document.documentElement.classList.remove('no-scroll'); 
    }

    function toggleSidebar() {
        const isOpen = sidebar && sidebar.classList.contains('active');
        if (isOpen) {
            closeSidebarFunc();
        } else {
            openSidebar();
        }
    }

    if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'admin-sidebar');
        hamburger.addEventListener('click', toggleSidebar);
    }
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (overlay) overlay.addEventListener('click', closeSidebarFunc);

    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                closeSidebarFunc();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebarFunc();
                if (hamburger) hamburger.focus();
            }
        }
    });

    // 5. GSAP Dashboard Entrance Sequence
    initUserDashboardEntrance();

    // 6. Dynamic rendering of customer orders from localStorage
    initSavedOrdersRendering();

    // 7. Dynamic Order Modal with Live Shipping & Tracking Link
    initUserOrderModal();

    // 8. Instant Search & Filters for user-orders.html with Empty State
    initUserOrderFilters();

    // 9. Saved Addresses Management (user-addresses.html)
    initAddressBook();

    // 10. Profile & Settings Form Management (user-profile.html & user-settings.html)
    initCustomerProfileAndSettings();

    function initUserDashboardEntrance() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        const pageHeader = document.querySelector('.page-header, .user-profile-header');
        if (pageHeader) {
            tl.fromTo(pageHeader, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
        }

        const statCards = document.querySelectorAll('.statistics-grid .stat-card');
        if (statCards.length) {
            tl.fromTo(statCards, 
                { opacity: 0, y: 12 }, 
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.32, clearProps: 'transform,opacity' },
                '-=0.15'
            );
        }

        const filtersCard = document.querySelector('.filters-section');
        if (filtersCard) {
            tl.fromTo(filtersCard, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, clearProps: 'transform,opacity' }, '-=0.15');
        }

        const tableRows = document.querySelectorAll('.admin-table tbody tr');
        if (tableRows.length) {
            tl.fromTo(tableRows, 
                { opacity: 0, y: 8 }, 
                { opacity: 1, y: 0, stagger: 0.04, duration: 0.28, clearProps: 'transform,opacity' },
                '-=0.12'
            );
        }
    }

    function initSavedOrdersRendering() {
        const ordersTableBody = document.querySelector('.products-table-section .admin-table tbody');
        if (!ordersTableBody) return;

        try {
            const savedOrders = JSON.parse(localStorage.getItem('stacklyOrders')) || [];
            if (savedOrders.length > 0) {
                savedOrders.forEach(ord => {
                    const tr = document.createElement('tr');
                    const itemsSummary = (ord.items || []).map(i => `${i.name} (x${i.quantity})`).join(', ') || 'Custom Hardware Package';
                    tr.innerHTML = `
                        <td><strong>#${ord.orderId || 'ORD-NEW'}</strong></td>
                        <td>${itemsSummary}</td>
                        <td><strong>${ord.total || '$199.00'}</strong></td>
                        <td><span class="badge badge-paid">Confirmed (Demo)</span></td>
                        <td>${ord.date || 'Recent'}</td>
                        <td><button class="action-btn view-order-btn" type="button">View Details</button></td>
                    `;
                    ordersTableBody.prepend(tr);
                });
            }
        } catch(e) {}
    }

    function initUserOrderModal() {
        const orderModal = document.getElementById('order-modal');
        const modalContainer = orderModal?.querySelector('.order-modal-container');
        const closeBtns = document.querySelectorAll('.close-modal-btn');

        if (!orderModal || !modalContainer) return;

        function openModal(row) {
            if (row) {
                const orderId = row.children[0]?.textContent.trim().replace(/^#/, '') || 'ORD-889';
                const productName = row.children[1]?.textContent.trim() || 'Pro Display X1';
                const amount = row.children[2]?.textContent.trim() || '$899.00';
                const statusBadge = row.children[3]?.querySelector('.badge');
                const statusText = statusBadge ? statusBadge.textContent.trim() : 'Delivered';
                const trackingCode = 'TRK-' + (orderId.replace(/[^0-9]/g, '') || '998877');

                // Populate Modal Header
                const modalH2 = orderModal.querySelector('.modal-header h2');
                if (modalH2) modalH2.textContent = `Order #${orderId}`;

                const modalBadge = orderModal.querySelector('.modal-header .badge');
                if (modalBadge) {
                    modalBadge.textContent = statusText;
                    modalBadge.className = statusText.toLowerCase().includes('deliv') || statusText.toLowerCase().includes('conf')
                        ? 'badge badge-paid mt-1'
                        : 'badge badge-pending mt-1';
                }

                // Populate Payment & Tracking box with clickable link to shipping.html
                const detailBoxes = orderModal.querySelectorAll('.order-details-grid .detail-box');
                if (detailBoxes.length >= 2) {
                    detailBoxes[1].innerHTML = `
                        <h4>Payment &amp; Tracking</h4>
                        <p><strong>Payment:</strong> Credit Card</p>
                        <p><strong>Tracking:</strong> 
                            <a href="../shipping.html?order=${encodeURIComponent(orderId)}" style="color:var(--primary); font-weight:700; text-decoration:underline;" title="Track package status on live tracking page">
                                ${trackingCode} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem;"></i>
                            </a>
                        </p>
                    `;
                }

                // Populate products table
                const prodRow = orderModal.querySelector('.order-products-table tbody tr');
                if (prodRow) {
                    prodRow.innerHTML = `
                        <td>${productName}</td>
                        <td>1</td>
                        <td>${amount}</td>
                    `;
                }

                // Populate subtotal and total
                const summaryLines = orderModal.querySelectorAll('.order-summary .summary-line');
                if (summaryLines.length >= 2) {
                    summaryLines[0].innerHTML = `<span>Subtotal</span><span>${amount}</span>`;
                    summaryLines[1].innerHTML = `<span>Total</span><span>${amount}</span>`;
                }
            }

            orderModal.classList.add('active');
            document.body.classList.add('no-scroll');

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion && typeof gsap !== 'undefined') {
                gsap.fromTo(modalContainer,
                    { scale: 0.96, y: 16, opacity: 0 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.28, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
                );
            }
        }

        function closeModal() {
            orderModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-order-btn');
            if (btn) {
                const tr = btn.closest('tr');
                openModal(tr);
            }
        });

        closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
        window.addEventListener('click', (e) => { if (e.target === orderModal) closeModal(); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && orderModal.classList.contains('active')) closeModal();
        });
    }

    function initUserOrderFilters() {
        const searchInput = document.getElementById('user-order-search') || document.querySelector('.filter-search input');
        const statusSelect = document.getElementById('user-order-status') || document.querySelector('.filters-bar select');
        const paymentSelect = document.getElementById('user-order-payment');
        const tableBody = document.querySelector('.products-table-section .admin-table tbody');
        if (!tableBody) return;

        function applyFilters() {
            const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
            const statusVal = (statusSelect ? statusSelect.value : '').trim().toLowerCase();
            const paymentVal = (paymentSelect ? paymentSelect.value : '').trim().toLowerCase();
            const rows = tableBody.querySelectorAll('tr:not(.no-results-row)');

            let visibleCount = 0;

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const matchesQuery = !query || text.includes(query);
                const matchesStatus = !statusVal || statusVal === 'all statuses' || text.includes(statusVal);
                const matchesPayment = !paymentVal || paymentVal === 'all payments' || text.includes(paymentVal);

                if (matchesQuery && matchesStatus && matchesPayment) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            // Empty state row
            let noResultsRow = tableBody.querySelector('.no-results-row');
            if (visibleCount === 0) {
                if (!noResultsRow) {
                    noResultsRow = document.createElement('tr');
                    noResultsRow.className = 'no-results-row';
                    noResultsRow.innerHTML = `
                        <td colspan="6" style="text-align: center; padding: 48px 20px; color: var(--text-secondary);">
                            <i class="fa-solid fa-receipt" style="font-size: 2.2rem; margin-bottom: 12px; display: block; opacity: 0.45;"></i>
                            <h4 style="font-size: 1.05rem; color: var(--primary); margin-bottom: 6px;">No orders found</h4>
                            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Try searching for a different order ID or product name.</p>
                        </td>
                    `;
                    tableBody.appendChild(noResultsRow);
                }
                noResultsRow.style.display = '';
            } else if (noResultsRow) {
                noResultsRow.style.display = 'none';
            }
        }

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (statusSelect) statusSelect.addEventListener('change', applyFilters);
        if (paymentSelect) paymentSelect.addEventListener('change', applyFilters);
    }

    // 9. Saved Addresses Management
    function initAddressBook() {
        const addressForm = document.getElementById('address-form');
        const scrollBtn = document.getElementById('add-address-scroll-btn');
        const addressGrid = document.getElementById('saved-addresses-grid');

        if (scrollBtn && addressForm) {
            scrollBtn.addEventListener('click', () => {
                addressForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const firstInput = addressForm.querySelector('input');
                if (firstInput) firstInput.focus();
            });
        }

        if (addressForm && addressGrid) {
            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('inp-full-name')?.value.trim();
                const phone = document.getElementById('inp-phone')?.value.trim();
                const address = document.getElementById('inp-address')?.value.trim();
                const city = document.getElementById('inp-city')?.value.trim();
                const state = document.getElementById('inp-state')?.value.trim();
                const pincode = document.getElementById('inp-pincode')?.value.trim();

                if (!name || !address || !city) {
                    showUserToast('Please complete all required address fields', 'fa-circle-exclamation');
                    return;
                }

                const newCard = document.createElement('div');
                newCard.className = 'card';
                newCard.innerHTML = `
                    <div class="card-header"><h2>Saved Address</h2></div>
                    <div class="detail-box" style="background: var(--white); border: none; padding: 0;">
                        <p><strong>${name}</strong></p>
                        <p>${address}</p>
                        <p>${city}, ${state} ${pincode}</p>
                        <p>Phone: ${phone}</p>
                        <div class="export-grid mt-2" style="margin-top: 15px;">
                            <button class="btn-secondary-admin btn-edit-addr" type="button">Edit</button>
                            <button class="btn-secondary-admin btn-del-addr" type="button">Delete</button>
                            <button class="btn-primary-admin btn-def-addr" type="button">Set Default</button>
                        </div>
                    </div>
                `;
                addressGrid.appendChild(newCard);
                addressForm.reset();
                showUserToast('Address saved successfully (Demo Mode)');
                newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        // Delegate Edit, Delete, Set Default actions on address cards
        if (addressGrid) {
            addressGrid.addEventListener('click', (e) => {
                const delBtn = e.target.closest('button:has(i.fa-trash), .btn-del-addr') || (e.target.textContent === 'Delete' ? e.target : null);
                if (delBtn) {
                    const card = delBtn.closest('.card');
                    if (card) {
                        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.remove();
                            showUserToast('Address removed (Demo Mode)', 'fa-trash-can');
                        }, 260);
                    }
                    return;
                }

                const defBtn = e.target.closest('.btn-def-addr') || (e.target.textContent === 'Set Default' ? e.target : null);
                if (defBtn) {
                    const card = defBtn.closest('.card');
                    if (card) {
                        // Reset other cards
                        addressGrid.querySelectorAll('.card-header h2').forEach(h => h.textContent = 'Saved Address');
                        const h2 = card.querySelector('.card-header h2');
                        if (h2) h2.textContent = 'Default Address';
                        showUserToast('Default address updated (Demo Mode)');
                    }
                    return;
                }

                const editBtn = e.target.closest('.btn-edit-addr') || (e.target.textContent === 'Edit' ? e.target : null);
                if (editBtn && addressForm) {
                    const card = editBtn.closest('.card');
                    const lines = card.querySelectorAll('p');
                    if (lines.length >= 3) {
                        const name = lines[0].textContent.trim();
                        const addr = lines[1].textContent.trim();
                        if (document.getElementById('inp-full-name')) document.getElementById('inp-full-name').value = name;
                        if (document.getElementById('inp-address')) document.getElementById('inp-address').value = addr;
                        addressForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        showUserToast(`Editing address for "${name}"`, 'fa-pen');
                    }
                }
            });
        }
    }

    // 10. Profile & Settings Form Management
    function initCustomerProfileAndSettings() {
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('inp-full-name');
                const emailInput = document.getElementById('inp-email-address');

                const newName = nameInput ? nameInput.value.trim() : 'Sarah Jenkins';
                const newEmail = emailInput ? emailInput.value.trim() : 'sarah.jenkins@example.com';

                try {
                    const session = JSON.parse(localStorage.getItem('stacklyUserSession')) || {};
                    session.name = newName;
                    session.email = newEmail;
                    localStorage.setItem('stacklyUserSession', JSON.stringify(session));
                } catch(e) {}

                // Update UI on page
                const h2 = document.querySelector('.user-info-text h2');
                if (h2) h2.textContent = newName;
                const pEmail = document.querySelector('.user-info-text p');
                if (pEmail) pEmail.textContent = newEmail;
                const topEmail = document.getElementById('topbar-user-email');
                if (topEmail) topEmail.textContent = newEmail;
                const avatar = document.querySelector('.user-avatar-large');
                if (avatar) avatar.textContent = newName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SJ';

                showUserToast('Profile changes saved successfully (Demo Mode)');
            });
        }

        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showUserToast('Account preferences saved (Demo Mode)');
            });
        }

        // Handle Delete Account button demo feedback
        const deleteAccountBtns = document.querySelectorAll('button:has(i.fa-trash), button[style*="red"]');
        deleteAccountBtns.forEach(btn => {
            if (btn.textContent.includes('Delete Account')) {
                btn.addEventListener('click', () => {
                    showUserToast('Frontend Demo Mode: Account deletion simulated. Your account remains active for testing.', 'fa-shield-halved');
                });
            }
        });
    }
});
