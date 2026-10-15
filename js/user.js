/**
 * STACKLY - User Dashboard Controller (user.js)
 * Supports customer dashboard pages including user-orders.html
 * Professional, restrained dashboard animation system:
 * - Subtle heading reveals
 * - Coordinated entrances for order summary cards
 * - Restrained row transitions
 * - Smooth order-detail panel expansion
 * - Immediate responsive controls
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Auth Check
    const userRole = localStorage.getItem('userRole') || "User";
    if (userRole !== "User" && userRole !== "Admin") {
        window.location.href = "../login.html";
        return;
    }

    // 2. Dynamic Topbar Profile Email & Profile Header
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
            }
            if (session.email) {
                const profileEmail = document.querySelector('.user-info-text p');
                if (profileEmail) profileEmail.textContent = session.email;
            }
        }
    } catch (e) {}

    // 3. Mobile Sidebar Toggle
    const hamburger = document.querySelector('.hamburger');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');

    function openSidebar() { 
        if (sidebar) sidebar.classList.add('active'); 
        if (overlay) overlay.classList.add('active'); 
        document.body.classList.add('no-scroll'); 
    }
    function closeSidebarFunc() { 
        if (sidebar) sidebar.classList.remove('active'); 
        if (overlay) overlay.classList.remove('active'); 
        document.body.classList.remove('no-scroll'); 
    }

    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (overlay) overlay.addEventListener('click', closeSidebarFunc);

    // 4. GSAP Dashboard Entrance Sequence (Professional & Restrained)
    initUserDashboardEntrance();

    // 5. Modal Logic (Smooth Order-Detail Panel Expansion)
    initUserOrderModal();

    // 6. Dynamic rendering of customer orders from localStorage
    initSavedOrdersRendering();

    // 7. Instant Search & Filters for user-orders.html
    initUserOrderFilters();

    function initUserDashboardEntrance() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // Subtle heading reveal
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            tl.fromTo(pageHeader, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
        }

        // Coordinated entrances for existing order summary cards
        const statCards = document.querySelectorAll('.statistics-grid .stat-card');
        if (statCards.length) {
            tl.fromTo(statCards, 
                { opacity: 0, y: 12 }, 
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.32, clearProps: 'transform,opacity' },
                '-=0.15'
            );
        }

        // Filters section entrance
        const filtersCard = document.querySelector('.filters-section');
        if (filtersCard) {
            tl.fromTo(filtersCard, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, clearProps: 'transform,opacity' }, '-=0.15');
        }

        // Restrained row transitions
        const tableRows = document.querySelectorAll('.admin-table tbody tr');
        if (tableRows.length) {
            tl.fromTo(tableRows, 
                { opacity: 0, y: 8 }, 
                { opacity: 1, y: 0, stagger: 0.04, duration: 0.28, clearProps: 'transform,opacity' },
                '-=0.12'
            );
        }
    }

    function initUserOrderModal() {
        const orderModal = document.getElementById('order-modal');
        const modalContainer = orderModal?.querySelector('.order-modal-container');
        const closeBtns = document.querySelectorAll('.close-modal-btn');

        if (!orderModal || !modalContainer) return;

        function openModal() {
            orderModal.classList.add('active');
            document.body.classList.add('no-scroll');

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion && typeof gsap !== 'undefined') {
                gsap.fromTo(modalContainer,
                    { scale: 0.96, y: 16, opacity: 0 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.28, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
                );
                const innerCards = modalContainer.querySelectorAll('.detail-box, .order-products-table, .order-summary');
                if (innerCards.length) {
                    gsap.fromTo(innerCards,
                        { opacity: 0, y: 6 },
                        { opacity: 1, y: 0, stagger: 0.03, duration: 0.22, delay: 0.05, ease: 'power2.out' }
                    );
                }
            }
        }

        function closeModal() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion && typeof gsap !== 'undefined') {
                gsap.to(modalContainer, {
                    scale: 0.97,
                    opacity: 0,
                    duration: 0.18,
                    ease: 'power2.in',
                    onComplete: () => {
                        orderModal.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        gsap.set(modalContainer, { clearProps: 'all' });
                    }
                });
            } else {
                orderModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-order-btn');
            if (btn) openModal();
        });

        closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
        window.addEventListener('click', (e) => { if (e.target === orderModal) closeModal(); });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && orderModal.classList.contains('active')) closeModal();
        });
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

    function initUserOrderFilters() {
        const searchInput = document.querySelector('.filter-search input');
        const filterSelects = document.querySelectorAll('.filters-bar select');
        const rows = document.querySelectorAll('.admin-table tbody tr');
        if (!searchInput || !rows.length) return;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (!query || text.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });

        filterSelects.forEach(sel => {
            sel.addEventListener('change', () => {
                const val = sel.value.trim().toLowerCase();
                if (val === 'all statuses' || val === 'all payments' || !val) {
                    rows.forEach(r => r.style.display = '');
                    return;
                }
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(val) ? '' : 'none';
                });
            });
        });
    }
});
