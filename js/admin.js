document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Mock Check
    // If you uncomment the below line, it enforces auth check.
    // For now we assume the user role is not admin if not set.
    const userRole = localStorage.getItem('userRole') || "Admin"; // Set default to Admin for demo
    if (userRole !== "Admin") {
        window.location.href = "../login.html";
    }

    // 1.5 Dynamic Topbar Profile Email
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
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

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

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                closeSidebarFunc();
            }
        });
    });

    // Close on Escape key press (Modals & Sidebar)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            const activeModals = document.querySelectorAll('.modal-overlay-ui.active, .modal.active');
            if (activeModals.length > 0) {
                activeModals.forEach(m => m.classList.remove('active'));
                document.body.classList.remove('no-scroll');
                return;
            }
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebarFunc();
                if (hamburger) hamburger.focus();
            }
        }
    });

    // 3. Toast Notification Helper
    function showAdminToast(message, icon = 'fa-circle-check') {
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

    // 4. Initialize Chart.js with Monochrome palette & Dynamic Date Range
    const ctx = document.getElementById('salesChart');
    let salesChart = null;

    const chartRanges = {
        'week': {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            sales: [1200, 1900, 1500, 2200, 1800, 2800, 2400],
            orders: [12, 19, 15, 22, 18, 28, 24]
        },
        'month': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            sales: [28500, 31200, 34100, 34630],
            orders: [310, 345, 380, 388]
        },
        'year': {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            sales: [280000, 310000, 340000, 360000],
            orders: [3100, 3400, 3750, 3870]
        }
    };

    if (ctx && typeof Chart !== 'undefined') {
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartRanges['week'].labels,
                datasets: [
                    {
                        label: 'Sales ($)',
                        data: chartRanges['week'].sales,
                        borderColor: '#333333',
                        backgroundColor: 'rgba(17, 17, 17, 0.08)',
                        borderWidth: 2,
                        tension: 0.38,
                        fill: true
                    },
                    {
                        label: 'Orders',
                        data: chartRanges['week'].orders,
                        borderColor: '#999999',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        tension: 0.38,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#333333',
                            font: { family: 'Inter', size: 12 }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#E5E5E5', drawBorder: false },
                        ticks: { color: '#666666', font: { family: 'Inter' } }
                    },
                    y: {
                        grid: { color: '#E5E5E5', drawBorder: false },
                        ticks: { color: '#666666', font: { family: 'Inter' } }
                    }
                }
            }
        });
    }

    // Date range selector listener
    const dateSelector = document.querySelector('.date-selector select');
    if (dateSelector) {
        dateSelector.addEventListener('change', () => {
            const text = dateSelector.options[dateSelector.selectedIndex].text.toLowerCase();
            let key = 'week';
            if (text.includes('month')) key = 'month';
            else if (text.includes('year')) key = 'year';

            if (salesChart) {
                salesChart.data.labels = chartRanges[key].labels;
                salesChart.data.datasets[0].data = chartRanges[key].sales;
                salesChart.data.datasets[1].data = chartRanges[key].orders;
                salesChart.update();
                showAdminToast(`Updated charts for ${dateSelector.options[dateSelector.selectedIndex].text}`);
            }
        });
    }

    // 5. Recent Orders Live Search & Empty State
    const searchBarInput = document.querySelector('.search-bar input');
    const recentOrdersTableBody = document.querySelector('.recent-orders-section .admin-table tbody, .products-table-section .admin-table tbody');

    if (searchBarInput && recentOrdersTableBody) {
        searchBarInput.addEventListener('input', () => {
            const query = searchBarInput.value.trim().toLowerCase();
            const rows = recentOrdersTableBody.querySelectorAll('tr:not(.no-results-row)');
            let visibleCount = 0;

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (!query || text.includes(query)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            let noResultsRow = recentOrdersTableBody.querySelector('.no-results-row');
            if (visibleCount === 0) {
                if (!noResultsRow) {
                    noResultsRow = document.createElement('tr');
                    noResultsRow.className = 'no-results-row';
                    noResultsRow.innerHTML = `
                        <td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                            <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
                            <h4 style="font-size: 1rem; color: var(--primary); margin-bottom: 4px;">No matching records found</h4>
                            <p style="font-size: 0.85rem; margin: 0;">Try a different search keyword.</p>
                        </td>
                    `;
                    recentOrdersTableBody.appendChild(noResultsRow);
                }
                noResultsRow.style.display = '';
            } else if (noResultsRow) {
                noResultsRow.style.display = 'none';
            }
        });
    }

    // 6. Topbar Notification -> 404.html
    const bellBtn = document.querySelector('.topbar-right button.icon-btn, .topbar-right a.icon-btn');
    if (bellBtn) {
        bellBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../404.html';
        });
    }

    // 7. GSAP Admin Dashboard Entrance Sequence (Professional & Restrained)
    initAdminDashboardEntrance();

    function initAdminDashboardEntrance() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion || typeof gsap === 'undefined') return;

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, delay: 0.05 });

        // Subtle header reveal (restrained 8px travel)
        const headerEl = document.querySelector('.dashboard-header, .page-header');
        if (headerEl) {
            tl.fromTo(headerEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.32, clearProps: 'transform,opacity' });
        }

        // Summary KPI cards staggered entrance
        const statCards = document.querySelectorAll('.statistics-grid .stat-card, .kpi-card');
        if (statCards.length) {
            tl.fromTo(statCards,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, stagger: 0.04, duration: 0.28, clearProps: 'transform,opacity' },
                '-=0.15'
            );
        }

        // Section Cards & Charts entrance
        const sectionCards = document.querySelectorAll('.card, .chart-card, .table-card');
        if (sectionCards.length) {
            tl.fromTo(sectionCards,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.32, clearProps: 'transform,opacity' },
                '-=0.12'
            );
        }

        // Table rows entrance (first 10 rows for optimal performance)
        const tableRows = Array.from(document.querySelectorAll('.admin-table tbody tr')).slice(0, 10);
        if (tableRows.length) {
            tl.fromTo(tableRows,
                { opacity: 0, y: 6 },
                { opacity: 1, y: 0, stagger: 0.03, duration: 0.24, clearProps: 'transform,opacity' },
                '-=0.1'
            );
        }
    }
});
