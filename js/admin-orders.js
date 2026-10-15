/**
 * STACKLY - Admin Order Management Dashboard Controller (admin-orders.html)
 * Professional, restrained dashboard animation system:
 * - Subtle heading reveals (restrained typographic entrance, no marketing clip masks)
 * - Coordinated entrances for existing order summary cards (Total Orders, Completed, Pending, Cancelled)
 * - Smooth chart-container reveals (Order fulfillment & status pipeline)
 * - Restrained row transitions (table rows staggered entrance & fast micro-transitions)
 * - Smooth order-detail panel expansion (fluid expansion with controlled height & opacity)
 * - Subtle status-indicator transitions (badges with gentle state update pulse)
 * - Instant responsive filtering, search, and action feedback
 * - Strict preservation of actual order values (no odometer number counter animations)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Authentication Mock Check & Profile Display
    const userRole = localStorage.getItem('userRole') || 'Admin';
    if (userRole !== 'Admin') {
        window.location.href = '../login.html';
        return;
    }

    try {
        const session = JSON.parse(localStorage.getItem('stacklyUserSession'));
        const emailEl = document.getElementById('topbar-user-email');
        if (emailEl) {
            emailEl.textContent = (session && session.email) ? session.email : 'admin@stackly.com';
        }
    } catch (e) {}

    // 2. Mobile Sidebar Toggle
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

    // 3. GSAP Dashboard Entrance Sequence (Professional & Restrained)
    initGSAPDashboardEntrance();

    // 4. Chart.js Order Fulfillment & Status Pipeline Chart
    initOrdersChart();

    // 5. Instant Responsive Search & Filters
    initResponsiveFilters();

    // 6. Smooth Order-Detail Panel Expansion & Dynamic Data Binding
    initOrderDetailPanel();

    // 7. Subtle Status-Indicator Transitions & Updates
    initStatusUpdates();

    // 8. Order Actions (Export, Print, Quick Buttons)
    initOrderActions();

    // ==========================================
    // 3. GSAP Dashboard Entrance Sequence
    // ==========================================
    function initGSAPDashboardEntrance() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

        // Subtle heading reveal (Restrained entrance)
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            const breadcrumb = pageHeader.querySelector('.breadcrumb');
            const h1 = pageHeader.querySelector('h1');
            const headerRight = pageHeader.querySelector('.header-right');

            tl.fromTo(pageHeader, 
                { opacity: 0, y: 10 }, 
                { opacity: 1, y: 0, duration: 0.35 }
            );
            if (breadcrumb) {
                tl.fromTo(breadcrumb, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.25 }, '-=0.2');
            }
            if (h1) {
                tl.fromTo(h1, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.28 }, '-=0.2');
            }
            if (headerRight) {
                tl.fromTo(headerRight, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.25 }, '-=0.18');
            }
        }

        // Coordinated entrances for existing order summary cards
        // Note: Preserves exact numbers (no odometer tickers or value manipulation)
        const statCards = document.querySelectorAll('.statistics-grid .stat-card');
        if (statCards.length) {
            tl.fromTo(statCards,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.32, clearProps: 'transform,opacity' },
                '-=0.15'
            );
        }

        // Smooth chart-container reveal
        const chartCard = document.getElementById('orders-chart-card') || document.querySelector('.analytics-section .card');
        if (chartCard) {
            tl.fromTo(chartCard,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.38, clearProps: 'transform,opacity' },
                '-=0.12'
            );
        }

        // Filters section entrance
        const filtersCard = document.querySelector('.filters-section');
        if (filtersCard) {
            tl.fromTo(filtersCard,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.3, clearProps: 'transform,opacity' },
                '-=0.15'
            );
        }

        // Restrained row transitions for orders table
        const tableRows = document.querySelectorAll('.admin-table tbody tr');
        if (tableRows.length) {
            tl.fromTo(tableRows,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, stagger: 0.04, duration: 0.28, clearProps: 'transform,opacity' },
                '-=0.12'
            );
        }
    }

    // ==========================================
    // 4. Chart.js Order Fulfillment Pipeline Chart
    // ==========================================
    function initOrdersChart() {
        const canvas = document.getElementById('ordersChart');
        if (!canvas || typeof Chart === 'undefined') return;

        // Monochrome palette matching STACKLY brand design
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Completed Deliveries',
                        data: [142, 168, 155, 190, 210, 245, 198],
                        borderColor: '#333333',
                        backgroundColor: 'rgba(51, 51, 51, 0.08)',
                        borderWidth: 2,
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: '#333333',
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: 'In Transit / Dispatched',
                        data: [38, 45, 42, 60, 52, 70, 58],
                        borderColor: '#777777',
                        backgroundColor: 'transparent',
                        borderWidth: 1.8,
                        tension: 0.35,
                        borderDash: [4, 4],
                        pointBackgroundColor: '#777777',
                        pointRadius: 2,
                        pointHoverRadius: 4
                    },
                    {
                        label: 'Pending Fulfillment',
                        data: [15, 12, 18, 14, 22, 16, 11],
                        borderColor: '#BDBDBD',
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        tension: 0.35,
                        pointBackgroundColor: '#BDBDBD',
                        pointRadius: 2,
                        pointHoverRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 650,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: '#333333',
                            font: { family: 'Inter', size: 11, weight: '500' },
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1A1A1A',
                        titleColor: '#FFFFFF',
                        bodyColor: '#E5E5E5',
                        titleFont: { family: 'Inter', size: 12, weight: '600' },
                        bodyFont: { family: 'Inter', size: 11 },
                        padding: 10,
                        cornerRadius: 6,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#EBEBEB', drawBorder: false },
                        ticks: { color: '#777777', font: { family: 'Inter', size: 11 } }
                    },
                    y: {
                        grid: { color: '#EBEBEB', drawBorder: false },
                        ticks: { color: '#777777', font: { family: 'Inter', size: 11 } },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // ==========================================
    // 5. Instant Responsive Search & Filters
    // ==========================================
    function initResponsiveFilters() {
        const searchInput = document.getElementById('order-search-input');
        const statusSelect = document.getElementById('order-status-filter');
        const paymentSelect = document.getElementById('order-payment-filter');
        const dateInput = document.getElementById('order-date-filter');
        const tableBody = document.querySelector('.products-table-section .admin-table tbody');
        if (!tableBody) return;

        const rows = Array.from(tableBody.querySelectorAll('tr'));

        function applyFilters() {
            const query = (searchInput?.value || '').trim().toLowerCase();
            const statusFilter = (statusSelect?.value || '').trim().toLowerCase();
            const paymentFilter = (paymentSelect?.value || '').trim().toLowerCase();

            let visibleCount = 0;

            rows.forEach(row => {
                const orderId = (row.getAttribute('data-order-id') || row.children[0]?.textContent || '').toLowerCase();
                const customer = (row.getAttribute('data-customer') || row.children[1]?.textContent || '').toLowerCase();
                const product = (row.getAttribute('data-product') || row.children[2]?.textContent || '').toLowerCase();
                const payment = (row.getAttribute('data-payment') || row.children[4]?.textContent || '').toLowerCase();
                const status = (row.getAttribute('data-status') || row.children[5]?.textContent || '').toLowerCase();

                const matchesQuery = !query || orderId.includes(query) || customer.includes(query) || product.includes(query);
                const matchesStatus = !statusFilter || status.includes(statusFilter);
                const matchesPayment = !paymentFilter || payment.includes(paymentFilter) || 
                    (paymentFilter === 'cc' && payment.includes('credit')) ||
                    (paymentFilter === 'paypal' && payment.includes('paypal')) ||
                    (paymentFilter === 'applepay' && payment.includes('apple'));

                const isMatch = matchesQuery && matchesStatus && matchesPayment;

                if (isMatch) {
                    visibleCount++;
                    row.classList.remove('row-hidden');
                    row.classList.remove('row-fade-out');
                    row.classList.add('row-fade-in');
                } else {
                    row.classList.remove('row-fade-in');
                    row.classList.add('row-fade-out');
                    setTimeout(() => {
                        if (row.classList.contains('row-fade-out')) {
                            row.classList.add('row-hidden');
                        }
                    }, 120);
                }
            });

            // Handle empty state
            let noResultsRow = tableBody.querySelector('.no-results-row');
            if (visibleCount === 0) {
                if (!noResultsRow) {
                    noResultsRow = document.createElement('tr');
                    noResultsRow.className = 'no-results-row';
                    noResultsRow.innerHTML = `
                        <td colspan="8" style="text-align: center; padding: 36px 20px; color: #777;">
                            <i class="fa-solid fa-folder-open" style="font-size: 1.8rem; margin-bottom: 8px; display: block; opacity: 0.6;"></i>
                            <strong>No matching orders found</strong>
                            <p style="font-size: 0.85rem; margin-top: 4px;">Try adjusting your search criteria or clear status filters.</p>
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
        if (dateInput) dateInput.addEventListener('change', applyFilters);
    }

    // ==========================================
    // 6. Smooth Order-Detail Panel Expansion
    // ==========================================
    let currentActiveRow = null;

    function initOrderDetailPanel() {
        const orderModal = document.getElementById('order-modal');
        const modalContainer = orderModal?.querySelector('.order-modal-container');
        const closeBtns = document.querySelectorAll('.close-modal-btn');
        if (!orderModal || !modalContainer) return;

        // Modal Elements
        const modalOrderId = document.getElementById('modal-order-id');
        const modalBadge = document.getElementById('modal-order-badge');
        const modalStatusSelect = document.getElementById('modal-status-select');
        const customerBox = document.querySelector('.detail-box:nth-child(1)');
        const shippingBox = document.querySelector('.detail-box:nth-child(2)');
        const paymentBox = document.querySelector('.detail-box:nth-child(3)');
        const productsBody = document.querySelector('.order-products-table tbody');
        const summaryTotal = document.querySelector('.order-summary .total-line span:last-child');
        const summarySubtotal = document.querySelector('.order-summary .summary-line:nth-child(1) span:last-child');

        function openModalForOrder(row) {
            currentActiveRow = row;

            const orderId = row.getAttribute('data-order-id') || row.children[0]?.textContent?.trim() || '#ORD-7392';
            const customer = row.getAttribute('data-customer') || row.children[1]?.textContent?.trim() || 'Customer';
            const email = row.getAttribute('data-email') || 'customer@stackly.com';
            const phone = row.getAttribute('data-phone') || '+1 (555) 000-0000';
            const address = row.getAttribute('data-address') || '123 Tech Avenue, New York, NY 10001, United States';
            const product = row.getAttribute('data-product') || row.children[2]?.textContent?.trim() || 'Pro Display X1';
            const amount = row.getAttribute('data-amount') || row.children[3]?.textContent?.trim() || '$899.00';
            const paymentDetail = row.getAttribute('data-payment-detail') || row.children[4]?.textContent?.trim() || 'Credit Card';
            const status = (row.getAttribute('data-status') || 'completed').toLowerCase();
            const date = row.getAttribute('data-date') || row.children[6]?.textContent?.trim() || 'Oct 8, 2026';

            // Populate Modal Content
            if (modalOrderId) modalOrderId.textContent = orderId;
            if (modalBadge) {
                const badgeClasses = {
                    completed: 'badge badge-paid',
                    pending: 'badge badge-pending',
                    cancelled: 'badge badge-cancelled'
                };
                modalBadge.className = (badgeClasses[status] || 'badge badge-paid') + ' mt-1';
                modalBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            }
            if (modalStatusSelect) {
                modalStatusSelect.value = status;
            }

            if (customerBox) {
                customerBox.innerHTML = `
                    <h4>Customer</h4>
                    <p><strong>${customer}</strong></p>
                    <p>${email}</p>
                    <p>${phone}</p>
                `;
            }

            if (shippingBox) {
                const addrParts = address.split(', ');
                const street = addrParts[0] || '123 Tech Avenue';
                const suite = addrParts[1] || '';
                const cityState = addrParts[2] || 'New York, NY 10001';
                const country = addrParts[3] || 'United States';
                shippingBox.innerHTML = `
                    <h4>Shipping Address</h4>
                    <p>${street}${suite ? ', ' + suite : ''}</p>
                    <p>${cityState}</p>
                    <p>${country}</p>
                `;
            }

            if (paymentBox) {
                paymentBox.innerHTML = `
                    <h4>Payment</h4>
                    <p><strong>Method:</strong> ${paymentDetail}</p>
                    <p><strong>Transaction:</strong> TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}</p>
                    <p><strong>Date:</strong> ${date} 14:30 EST</p>
                `;
            }

            if (productsBody) {
                productsBody.innerHTML = `
                    <tr>
                        <td>${product}</td>
                        <td>1</td>
                        <td>${amount}</td>
                        <td>${amount}</td>
                    </tr>
                `;
            }

            if (summarySubtotal) summarySubtotal.textContent = amount;
            if (summaryTotal) {
                // Calculate total with tax
                const num = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
                const tax = num * 0.08875;
                const total = num + tax;
                summaryTotal.textContent = `$${total.toFixed(2)}`;
            }

            // Open with smooth expansion animation
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
                        { opacity: 0, y: 8 },
                        { opacity: 1, y: 0, stagger: 0.03, duration: 0.22, delay: 0.06, ease: 'power2.out' }
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

        // Attach click listeners to all view buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-order-btn');
            if (btn) {
                const row = btn.closest('tr');
                if (row) openModalForOrder(row);
            }
        });

        closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

        window.addEventListener('click', (e) => {
            if (e.target === orderModal) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && orderModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ==========================================
    // 7. Subtle Status-Indicator Transitions & Updates
    // ==========================================
    function initStatusUpdates() {
        const updateStatusBtn = document.getElementById('modal-update-status-btn');
        const modalStatusSelect = document.getElementById('modal-status-select');
        const modalBadge = document.getElementById('modal-order-badge');

        if (!updateStatusBtn || !modalStatusSelect) return;

        updateStatusBtn.addEventListener('click', () => {
            const newStatus = modalStatusSelect.value;
            const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

            const badgeClasses = {
                completed: 'badge badge-paid',
                pending: 'badge badge-pending',
                cancelled: 'badge badge-cancelled'
            };

            // Update modal badge with micro-pulse transition
            if (modalBadge) {
                modalBadge.className = (badgeClasses[newStatus] || 'badge badge-paid') + ' mt-1 badge-updated';
                modalBadge.textContent = statusLabel;
                setTimeout(() => modalBadge.classList.remove('badge-updated'), 600);
            }

            // Update active table row
            if (currentActiveRow) {
                currentActiveRow.setAttribute('data-status', newStatus);
                const tableBadge = currentActiveRow.querySelector('.badge');
                if (tableBadge) {
                    tableBadge.className = (badgeClasses[newStatus] || 'badge badge-paid') + ' badge-updated';
                    tableBadge.textContent = statusLabel;
                    setTimeout(() => tableBadge.classList.remove('badge-updated'), 600);
                }

                // Update summary metrics cards cleanly (integer count preservation, no tickers)
                updateSummaryCounts();
            }

            showAdminToast(`Order status updated to ${statusLabel}`, 'fa-circle-check');
        });

        function updateSummaryCounts() {
            const allRows = Array.from(document.querySelectorAll('.admin-table tbody tr:not(.no-results-row)'));
            let total = allRows.length;
            let completed = 0;
            let pending = 0;
            let cancelled = 0;

            allRows.forEach(r => {
                const s = (r.getAttribute('data-status') || '').toLowerCase();
                if (s === 'completed') completed++;
                else if (s === 'pending') pending++;
                else if (s === 'cancelled') cancelled++;
            });

            // Update DOM text directly without large number odometer ticker animations
            const statVals = document.querySelectorAll('.statistics-grid .stat-val');
            if (statVals.length >= 4) {
                statVals[0].textContent = '1,245'; // Keep baseline store totals
                statVals[1].textContent = (1150 + (completed - 2)).toLocaleString();
                statVals[2].textContent = (80 + (pending - 1)).toLocaleString();
                statVals[3].textContent = (15 + (cancelled - 1)).toLocaleString();
            }
        }
    }

    // ==========================================
    // 8. Order Actions (Export, Print, Quick Actions)
    // ==========================================
    function initOrderActions() {
        const exportBtn = document.getElementById('btn-export-orders');
        const printBtn = document.getElementById('btn-print-invoice');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportBtn.classList.add('loading');
                exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating CSV...';
                
                setTimeout(() => {
                    exportBtn.classList.remove('loading');
                    exportBtn.innerHTML = '<i class="fa-solid fa-download"></i> Export Orders';
                    showAdminToast('Orders dataset exported to stackly-orders-2026.csv', 'fa-file-csv');
                }, 400);
            });
        }

        if (printBtn) {
            printBtn.addEventListener('click', () => {
                const orderId = document.getElementById('modal-order-id')?.textContent || 'Order';
                showAdminToast(`Preparing print invoice for ${orderId}...`, 'fa-print');
                setTimeout(() => window.print(), 350);
            });
        }
    }

    // ==========================================
    // 9. Toast Notification Utility
    // ==========================================
    function showAdminToast(message, iconClass = 'fa-circle-check') {
        let container = document.getElementById('admin-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'admin-toast-container';
            container.className = 'admin-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'admin-toast';
        toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        // Force reflow for animation
        toast.offsetHeight;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }

    window.showAdminToast = showAdminToast;
});
