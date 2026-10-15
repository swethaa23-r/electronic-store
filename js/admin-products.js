/**
 * STACKLY - Admin Products & Inventory Controller (admin-products.js)
 * Manages product catalog, stock/inventory levels, search, filtering,
 * modal dialogs, and simulated CRUD actions with clear frontend demonstration integrity.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Mobile Sidebar Toggle with Accessible Controls
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

    // 3. Multi-Criteria Live Search & Filtering
    const searchInput = document.getElementById('prod-search-input');
    const categorySelect = document.getElementById('prod-category-filter');
    const priceSelect = document.getElementById('prod-price-filter');
    const stockSelect = document.getElementById('prod-stock-filter');
    const statusSelect = document.getElementById('prod-status-filter');
    const tableBody = document.querySelector('.products-table-section .admin-table tbody');

    function applyProductFilters() {
        if (!tableBody) return;
        const rows = tableBody.querySelectorAll('tr:not(.no-results-row)');
        const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const cat = (categorySelect ? categorySelect.value : '').toLowerCase();
        const priceTier = (priceSelect ? priceSelect.value : '').toLowerCase();
        const stockTier = (stockSelect ? stockSelect.value : '').toLowerCase();
        const statusVal = (statusSelect ? statusSelect.value : '').toLowerCase();

        let visibleCount = 0;

        rows.forEach(row => {
            const prodName = row.children[0]?.textContent.trim().toLowerCase() || '';
            const prodCat = row.children[1]?.textContent.trim().toLowerCase() || '';
            const priceText = row.children[2]?.textContent.replace(/[^0-9.]/g, '') || '0';
            const priceNum = parseFloat(priceText) || 0;
            const stockText = row.children[3]?.textContent.replace(/[^0-9]/g, '') || '0';
            const stockNum = parseInt(stockText, 10) || 0;
            const statusText = row.children[4]?.textContent.trim().toLowerCase() || '';

            // Match text
            const matchesQuery = !q || prodName.includes(q) || prodCat.includes(q);

            // Match category
            const matchesCat = !cat || prodCat.includes(cat);

            // Match price tier
            let matchesPrice = true;
            if (priceTier === 'low') matchesPrice = priceNum < 100;
            else if (priceTier === 'medium') matchesPrice = priceNum >= 100 && priceNum <= 500;
            else if (priceTier === 'high') matchesPrice = priceNum > 500;

            // Match stock / inventory tier
            let matchesStock = true;
            if (stockTier === 'in') matchesStock = stockNum > 10;
            else if (stockTier === 'low') matchesStock = stockNum > 0 && stockNum <= 10;
            else if (stockTier === 'out') matchesStock = stockNum === 0;

            // Match status
            const matchesStatus = !statusVal || statusText.includes(statusVal);

            const isMatch = matchesQuery && matchesCat && matchesPrice && matchesStock && matchesStatus;

            if (isMatch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // 4. Clear Empty State Handling
        let noResultsRow = tableBody.querySelector('.no-results-row');
        if (visibleCount === 0) {
            if (!noResultsRow) {
                noResultsRow = document.createElement('tr');
                noResultsRow.className = 'no-results-row';
                noResultsRow.innerHTML = `
                    <td colspan="7" style="text-align: center; padding: 48px 20px; color: var(--text-secondary);">
                        <i class="fa-solid fa-box-open" style="font-size: 2.4rem; margin-bottom: 12px; display: block; opacity: 0.45;"></i>
                        <h4 style="font-size: 1.05rem; color: var(--primary); margin-bottom: 6px;">No products match your filters</h4>
                        <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Try adjusting your search query, price tier, or stock selection.</p>
                    </td>
                `;
                tableBody.appendChild(noResultsRow);
            }
            noResultsRow.style.display = '';
        } else if (noResultsRow) {
            noResultsRow.style.display = 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', applyProductFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyProductFilters);
    if (priceSelect) priceSelect.addEventListener('change', applyProductFilters);
    if (stockSelect) stockSelect.addEventListener('change', applyProductFilters);
    if (statusSelect) statusSelect.addEventListener('change', applyProductFilters);

    // 5. Add / Edit Product Modal Logic
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    const productForm = document.getElementById('product-form');
    let editingRow = null;

    function openModal(isEdit = false, rowData = null) {
        if (!productModal) return;
        productModal.classList.add('active');
        document.body.classList.add('no-scroll');

        const modalTitle = productModal.querySelector('.modal-header h2');
        if (isEdit && rowData) {
            if (modalTitle) modalTitle.textContent = 'Edit Product (Demo)';
            document.getElementById('prod-name').value = rowData.name || '';
            document.getElementById('prod-category').value = rowData.category.toLowerCase() || '';
            document.getElementById('prod-price').value = rowData.price || '';
            document.getElementById('prod-stock').value = rowData.stock || '';
            document.getElementById('prod-status').value = rowData.status.toLowerCase() || 'active';
        } else {
            if (modalTitle) modalTitle.textContent = 'Add New Product (Demo)';
            if (productForm) productForm.reset();
        }
    }

    function closeModal() {
        if (!productModal) return;
        productModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        editingRow = null;
        if (productForm) {
            productForm.reset();
            const errorMsg = document.getElementById('form-error');
            const successMsg = document.getElementById('form-success');
            if (errorMsg) errorMsg.style.display = 'none';
            if (successMsg) successMsg.style.display = 'none';
        }
    }

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            editingRow = null;
            openModal(false);
        });
    }

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) closeModal();
    });

    // 6. Form Submission (Simulated CRUD with validation)
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('prod-name').value.trim();
            const category = document.getElementById('prod-category').value;
            const price = document.getElementById('prod-price').value.trim();
            const stock = document.getElementById('prod-stock').value.trim();
            const status = document.getElementById('prod-status').value;
            const errorMsg = document.getElementById('form-error');
            const successMsg = document.getElementById('form-success');

            if (!name || !category || !price || !stock) {
                if (errorMsg) errorMsg.style.display = 'block';
                if (successMsg) successMsg.style.display = 'none';
                return;
            }

            if (errorMsg) errorMsg.style.display = 'none';
            if (successMsg) successMsg.style.display = 'block';

            setTimeout(() => {
                const formattedPrice = '$' + parseFloat(price).toFixed(2);
                const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
                const statusBadge = status === 'active' 
                    ? '<span class="badge badge-paid">Active</span>' 
                    : '<span class="badge badge-pending">Draft</span>';

                if (editingRow) {
                    // Update existing row
                    editingRow.children[0].querySelector('span').textContent = name;
                    editingRow.children[1].textContent = categoryLabel;
                    editingRow.children[2].textContent = formattedPrice;
                    editingRow.children[3].textContent = stock;
                    editingRow.children[4].innerHTML = statusBadge;
                    showAdminToast(`Updated "${name}" successfully (Demo Mode)`);
                } else {
                    // Add new product row
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>
                            <div class="product-col">
                                <div class="prod-img"></div>
                                <span>${name}</span>
                            </div>
                        </td>
                        <td>${categoryLabel}</td>
                        <td>${formattedPrice}</td>
                        <td>${stock}</td>
                        <td>${statusBadge}</td>
                        <td>Just now</td>
                        <td>
                            <div class="action-icons">
                                <button class="icon-btn-small" title="View"><i class="fa-regular fa-eye"></i></button>
                                <button class="icon-btn-small" title="Edit"><i class="fa-solid fa-pen"></i></button>
                                <button class="icon-btn-small" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                        </td>
                    `;
                    tableBody.prepend(newRow);
                    attachRowActionListeners(newRow);

                    // Update total product stat card
                    const totalCard = document.querySelector('.statistics-grid .stat-card:first-child .stat-val');
                    if (totalCard) {
                        const cur = parseInt(totalCard.textContent.replace(/[^0-9]/g, ''), 10) || 425;
                        totalCard.textContent = cur + 1;
                    }
                    showAdminToast(`Added "${name}" to product catalog (Demo Mode)`);
                }
                closeModal();
            }, 600);
        });
    }

    // 7. Attach Interactive Handlers for View, Edit, Delete
    function attachRowActionListeners(row) {
        const viewBtn = row.querySelector('.action-icons button[title="View"]');
        const editBtn = row.querySelector('.action-icons button[title="Edit"]');
        const deleteBtn = row.querySelector('.action-icons button[title="Delete"]');

        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const name = row.children[0]?.querySelector('span')?.textContent || 'Product';
                const cat = row.children[1]?.textContent || '';
                const price = row.children[2]?.textContent || '';
                const stock = row.children[3]?.textContent || '';
                showAdminToast(`${name} (${cat}) • ${price} • Stock: ${stock} units`, 'fa-circle-info');
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editingRow = row;
                const name = row.children[0]?.querySelector('span')?.textContent || '';
                const category = row.children[1]?.textContent || '';
                const price = row.children[2]?.textContent.replace(/[^0-9.]/g, '') || '';
                const stock = row.children[3]?.textContent.replace(/[^0-9]/g, '') || '';
                const status = row.children[4]?.textContent.trim().toLowerCase() || 'active';
                openModal(true, { name, category, price, stock, status });
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const name = row.children[0]?.querySelector('span')?.textContent || 'Product';
                row.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    row.remove();
                    applyProductFilters();
                    // Update stat
                    const totalCard = document.querySelector('.statistics-grid .stat-card:first-child .stat-val');
                    if (totalCard) {
                        const cur = parseInt(totalCard.textContent.replace(/[^0-9]/g, ''), 10) || 425;
                        if (cur > 0) totalCard.textContent = cur - 1;
                    }
                    showAdminToast(`Deleted "${name}" from inventory (Demo Mode)`, 'fa-trash-can');
                }, 260);
            });
        }
    }

    // Attach listeners to all initial rows
    if (tableBody) {
        tableBody.querySelectorAll('tr').forEach(attachRowActionListeners);
    }
});
