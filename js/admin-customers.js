/**
 * STACKLY - Admin Customers Controller (admin-customers.js)
 * Handles customer search, status filtering, dynamic customer details modal,
 * and simulated status updates with complete demonstration integrity.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Mobile Sidebar Toggle
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

    if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'admin-sidebar');
        hamburger.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebarFunc();
            } else {
                openSidebar();
            }
        });
    }
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (overlay) overlay.addEventListener('click', closeSidebarFunc);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) closeSidebarFunc();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            closeSidebarFunc();
            if (hamburger) hamburger.focus();
        }
    });

    // 2. Toast Notification Helper
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

    // 3. Live Customer Search & Status Filtering
    const searchInput = document.getElementById('customer-search-input');
    const statusSelect = document.getElementById('customer-status-filter');
    const tableBody = document.querySelector('.products-table-section .admin-table tbody');

    function applyCustomerFilters() {
        if (!tableBody) return;
        const rows = tableBody.querySelectorAll('tr:not(.no-results-row)');
        const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const statusVal = (statusSelect ? statusSelect.value : '').toLowerCase();

        let visibleCount = 0;

        rows.forEach(row => {
            const id = row.children[0]?.textContent.trim().toLowerCase() || '';
            const name = row.children[1]?.textContent.trim().toLowerCase() || '';
            const email = row.children[2]?.textContent.trim().toLowerCase() || '';
            const status = row.children[5]?.textContent.trim().toLowerCase() || '';

            const matchesQuery = !q || id.includes(q) || name.includes(q) || email.includes(q);
            const matchesStatus = !statusVal || status.includes(statusVal);

            if (matchesQuery && matchesStatus) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Clear empty state
        let noResultsRow = tableBody.querySelector('.no-results-row');
        if (visibleCount === 0) {
            if (!noResultsRow) {
                noResultsRow = document.createElement('tr');
                noResultsRow.className = 'no-results-row';
                noResultsRow.innerHTML = `
                    <td colspan="8" style="text-align: center; padding: 48px 20px; color: var(--text-secondary);">
                        <i class="fa-solid fa-users-slash" style="font-size: 2.2rem; margin-bottom: 12px; display: block; opacity: 0.45;"></i>
                        <h4 style="font-size: 1.05rem; color: var(--primary); margin-bottom: 6px;">No customers found</h4>
                        <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Try adjusting your search query or status filter.</p>
                    </td>
                `;
                tableBody.appendChild(noResultsRow);
            }
            noResultsRow.style.display = '';
        } else if (noResultsRow) {
            noResultsRow.style.display = 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', applyCustomerFilters);
    if (statusSelect) statusSelect.addEventListener('change', applyCustomerFilters);

    // 4. Dynamic Customer Details Modal Logic
    const custModal = document.getElementById('customer-modal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    let currentCustomerRow = null;

    function openCustomerModal(row) {
        if (!custModal) return;
        currentCustomerRow = row;

        const id = row.children[0]?.textContent.trim() || '#CST-000';
        const name = row.children[1]?.textContent.trim() || 'Customer';
        const email = row.children[2]?.textContent.trim() || 'email@example.com';
        const orders = row.children[3]?.textContent.trim() || '0';
        const spent = row.children[4]?.textContent.trim() || '$0.00';
        const statusSpan = row.children[5]?.querySelector('.badge');
        const statusText = statusSpan ? statusSpan.textContent.trim() : 'Active';
        const regDate = row.children[6]?.textContent.trim() || 'Recent';

        // Populate modal header
        const modalHeading = custModal.querySelector('.modal-header h2');
        if (modalHeading) modalHeading.textContent = `${name} (${id})`;

        const modalBadge = custModal.querySelector('.modal-header .badge');
        if (modalBadge) {
            modalBadge.textContent = statusText;
            modalBadge.className = statusText.toLowerCase() === 'active' ? 'badge badge-paid mt-1' : 'badge badge-cancelled mt-1';
        }

        // Populate profile box
        const detailBoxes = custModal.querySelectorAll('.order-details-grid .detail-box');
        if (detailBoxes[0]) {
            detailBoxes[0].innerHTML = `
                <h4>Profile &amp; Contact</h4>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> +1 (555) 019-2834</p>
            `;
        }
        if (detailBoxes[1]) {
            detailBoxes[1].innerHTML = `
                <h4>Spending &amp; Orders</h4>
                <p><strong>Total Orders:</strong> ${orders}</p>
                <p><strong>Total Spent:</strong> ${spent}</p>
                <p><strong>Customer ID:</strong> ${id}</p>
            `;
        }
        if (detailBoxes[2]) {
            const select = detailBoxes[2].querySelector('select');
            if (select) {
                select.value = statusText.toLowerCase() === 'active' ? 'active' : 'suspended';
            }
        }
        if (detailBoxes[3]) {
            detailBoxes[3].innerHTML = `
                <h4>Recent Activity</h4>
                <p><strong>Last Login:</strong> Today</p>
                <p><strong>Last Order:</strong> Active item</p>
                <p><strong>Reg Date:</strong> ${regDate}</p>
            `;
        }

        custModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeCustomerModal() {
        if (!custModal) return;
        custModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        currentCustomerRow = null;
    }

    // Attach click to View Details buttons
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-customer-btn');
            if (btn) {
                const tr = btn.closest('tr');
                if (tr) openCustomerModal(tr);
            }
        });
    }

    closeBtns.forEach(btn => btn.addEventListener('click', closeCustomerModal));
    window.addEventListener('click', (e) => {
        if (e.target === custModal) closeCustomerModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && custModal && custModal.classList.contains('active')) closeCustomerModal();
    });

    // 5. Update Status Button in Modal (Simulated Demo Action)
    const updateStatusBtn = custModal?.querySelector('.detail-box button.btn-primary-admin');
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', () => {
            const statusSelectModal = custModal.querySelector('.detail-box select.status-select');
            const newStatus = statusSelectModal ? statusSelectModal.value : 'active';
            const isNowActive = newStatus === 'active';

            if (currentCustomerRow) {
                const statusCell = currentCustomerRow.children[5];
                if (statusCell) {
                    statusCell.innerHTML = isNowActive 
                        ? '<span class="badge badge-paid">Active</span>' 
                        : '<span class="badge badge-cancelled">Suspended</span>';
                }
            }

            const modalBadge = custModal.querySelector('.modal-header .badge');
            if (modalBadge) {
                modalBadge.textContent = isNowActive ? 'Active' : 'Suspended';
                modalBadge.className = isNowActive ? 'badge badge-paid mt-1' : 'badge badge-cancelled mt-1';
            }

            showAdminToast(`Customer status updated to ${isNowActive ? 'Active' : 'Suspended'} (Demo Mode)`);
            setTimeout(closeCustomerModal, 500);
        });
    }

    // 6. Add Customer Demo Action
    const addCustBtn = document.getElementById('add-customer-btn');
    if (addCustBtn) {
        addCustBtn.addEventListener('click', () => {
            const sampleNames = ['Elena Rostova', 'Marcus Thorne', 'Aria Chen', 'Liam O\'Connor'];
            const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
            const randomId = '#CST-0' + Math.floor(100 + Math.random() * 900);
            const randomEmail = randomName.toLowerCase().replace(/[^a-z]/g, '.') + '@example.com';

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${randomId}</td>
                <td>${randomName}</td>
                <td>${randomEmail}</td>
                <td>1</td>
                <td>$149.00</td>
                <td><span class="badge badge-paid">Active</span></td>
                <td>Oct 15, 2026</td>
                <td><button class="action-btn view-customer-btn">View Details</button></td>
            `;
            if (tableBody) tableBody.prepend(newRow);

            // Update stats
            const totalStat = document.querySelector('.statistics-grid .stat-card:first-child .stat-val');
            if (totalStat) {
                const count = parseInt(totalStat.textContent.replace(/[^0-9]/g, ''), 10) || 8920;
                totalStat.textContent = (count + 1).toLocaleString();
            }

            showAdminToast(`Added customer "${randomName}" (${randomId}) (Demo Mode)`);
        });
    }
});
