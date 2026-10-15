document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth Check
    const userRole = localStorage.getItem('userRole') || 'Admin';
    if (userRole !== "Admin") {
        window.location.href = "../login.html";
        return;
    }

    // 2. Mobile Sidebar Logic
    const hamburger = document.querySelector('.hamburger');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');

    function toggleSidebar(show) {
        if (show) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        } else {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    if (hamburger) hamburger.addEventListener('click', () => toggleSidebar(true));
    if (closeSidebar) closeSidebar.addEventListener('click', () => toggleSidebar(false));
    if (overlay) overlay.addEventListener('click', () => toggleSidebar(false));

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userRole');
            window.location.href = "../login.html";
        });
    }

    // 3. Category Data Management
    let categories = [];
    
    function initData() {
        const stored = localStorage.getItem('stacklyCategories');
        if (stored) {
            categories = JSON.parse(stored);
        } else {
            // Realistic Demo Data
            categories = [
                { id: 'cat-1', name: 'Laptops', desc: 'High performance laptops and ultrabooks', image: 'fa-laptop', products: 45, status: 'Active', date: 'Oct 01, 2026', order: 1 },
                { id: 'cat-2', name: 'Monitors', desc: '4K and Ultra-wide professional displays', image: 'fa-desktop', products: 30, status: 'Active', date: 'Oct 02, 2026', order: 2 },
                { id: 'cat-3', name: 'Gaming', desc: 'Consoles, VR, and gaming accessories', image: 'fa-gamepad', products: 12, status: 'Active', date: 'Oct 03, 2026', order: 3 },
                { id: 'cat-4', name: 'Accessories', desc: 'Cables, chargers, and adapters', image: 'fa-plug', products: 0, status: 'Inactive', date: 'Oct 04, 2026', order: 4 },
                { id: 'cat-5', name: 'Smart Devices', desc: 'Home automation and smart speakers', image: 'fa-lightbulb', products: 37, status: 'Active', date: 'Oct 05, 2026', order: 5 }
            ];
            saveData();
        }
    }
    
    function saveData() {
        localStorage.setItem('stacklyCategories', JSON.stringify(categories));
    }

    // 4. UI Elements
    const tbody = document.getElementById('categories-tbody');
    const emptyMsg = document.getElementById('empty-state-msg');
    const searchInput = document.getElementById('search-input');
    const filterStatus = document.getElementById('filter-status');
    const sortSelect = document.getElementById('sort-select');
    const clearBtn = document.getElementById('clear-filters-btn');

    // Modals
    const catModal = document.getElementById('category-modal');
    const deleteModal = document.getElementById('delete-modal');
    const form = document.getElementById('category-form');
    const modalTitle = document.getElementById('modal-title');
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    
    let deleteTargetId = null;

    // Toast
    const toast = document.getElementById('toast-notification');
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // 5. Render Logic
    function renderCategories() {
        const query = searchInput.value.toLowerCase();
        const status = filterStatus.value;
        const sortMode = sortSelect.value;

        // Filter
        let filtered = categories.filter(c => {
            const matchQuery = c.name.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query);
            const matchStatus = status === 'All' || c.status === status;
            return matchQuery && matchStatus;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortMode === 'Name A-Z') return a.name.localeCompare(b.name);
            if (sortMode === 'Name Z-A') return b.name.localeCompare(a.name);
            if (sortMode === 'Most Products') return b.products - a.products;
            if (sortMode === 'Recently Added') return new Date(b.date) - new Date(a.date);
            return 0;
        });

        // Update Stats
        updateStats(categories);

        tbody.innerHTML = '';
        if (filtered.length === 0) {
            emptyMsg.style.display = 'block';
            document.getElementById('categories-table').style.display = 'none';
        } else {
            emptyMsg.style.display = 'none';
            document.getElementById('categories-table').style.display = 'table';
            
            filtered.forEach(cat => {
                const badgeClass = cat.status === 'Active' ? 'badge-paid' : 'badge-cancelled';
                const icon = cat.image || 'fa-folder';
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><div class="category-img-cell"><i class="fa-solid ${icon}"></i></div></td>
                    <td><strong>${cat.name}</strong></td>
                    <td style="color: #777777; font-size: 0.9rem;">${cat.desc}</td>
                    <td>${cat.products}</td>
                    <td><span class="badge ${badgeClass}">${cat.status}</span></td>
                    <td style="color: #777777;">${cat.date}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${cat.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn toggle-btn" data-id="${cat.id}" title="Toggle Status"><i class="fa-solid fa-power-off"></i></button>
                        <button class="action-btn delete-btn" data-id="${cat.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            attachActionListeners();
        }
    }

    function updateStats(allCats) {
        const total = allCats.length;
        const active = allCats.filter(c => c.status === 'Active').length;
        const products = allCats.reduce((acc, curr) => acc + curr.products, 0);
        const empty = allCats.filter(c => c.products === 0).length;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-active').textContent = active;
        document.getElementById('stat-products').textContent = products;
        document.getElementById('stat-empty').textContent = empty;
    }

    function attachActionListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openEditModal(id);
            });
        });
        
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                toggleStatus(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openDeleteModal(id);
            });
        });
    }

    // 6. Action Functions
    function toggleStatus(id) {
        const cat = categories.find(c => c.id === id);
        if(cat) {
            cat.status = cat.status === 'Active' ? 'Inactive' : 'Active';
            saveData();
            renderCategories();
            showToast(`Category marked as ${cat.status}.`);
        }
    }

    function openDeleteModal(id) {
        deleteTargetId = id;
        const cat = categories.find(c => c.id === id);
        const msgEl = document.getElementById('delete-msg');
        const confirmBtn = document.getElementById('confirm-delete-btn');
        
        if (cat.products > 0) {
            msgEl.textContent = "This category contains products. Please reassign the products before deleting the category.";
            confirmBtn.style.display = 'none';
        } else {
            msgEl.textContent = "Are you sure you want to delete this category?";
            confirmBtn.style.display = 'block';
        }
        
        deleteModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            deleteTargetId = null;
        });
    }

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if(deleteTargetId) {
                categories = categories.filter(c => c.id !== deleteTargetId);
                saveData();
                renderCategories();
                showToast("Category deleted successfully.");
                deleteModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
                deleteTargetId = null;
            }
        });
    }

    // 7. Add / Edit Modal Logic
    const openAddModalBtn = document.getElementById('open-add-modal');
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('cat-id').value = '';
            modalTitle.textContent = 'Add Category';
            clearErrors();
            catModal.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }

    function openEditModal(id) {
        const cat = categories.find(c => c.id === id);
        if(!cat) return;
        
        clearErrors();
        document.getElementById('cat-id').value = cat.id;
        document.getElementById('cat-name').value = cat.name;
        document.getElementById('cat-desc').value = cat.desc;
        document.getElementById('cat-image').value = cat.image || '';
        document.getElementById('cat-order').value = cat.order;
        document.getElementById('cat-status').value = cat.status;
        
        modalTitle.textContent = 'Edit Category';
        catModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catModal.classList.remove('active');
            deleteModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    function clearErrors() {
        document.getElementById('err-name').classList.remove('show');
        document.getElementById('err-desc').classList.remove('show');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        
        const nameVal = document.getElementById('cat-name').value.trim();
        const descVal = document.getElementById('cat-desc').value.trim();
        
        let isValid = true;
        if(nameVal.length < 3) {
            document.getElementById('err-name').classList.add('show');
            isValid = false;
        }
        if(descVal.length === 0) {
            document.getElementById('err-desc').classList.add('show');
            isValid = false;
        }
        
        if(!isValid) return;

        const idVal = document.getElementById('cat-id').value;
        const imageVal = document.getElementById('cat-image').value.trim();
        const orderVal = parseInt(document.getElementById('cat-order').value) || 1;
        const statusVal = document.getElementById('cat-status').value;

        if (idVal) {
            // Edit
            const cat = categories.find(c => c.id === idVal);
            if(cat) {
                cat.name = nameVal;
                cat.desc = descVal;
                cat.image = imageVal;
                cat.order = orderVal;
                cat.status = statusVal;
                showToast("Category updated successfully.");
            }
        } else {
            // Add
            const newCat = {
                id: 'cat-' + Date.now(),
                name: nameVal,
                desc: descVal,
                image: imageVal,
                order: orderVal,
                status: statusVal,
                products: 0,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            };
            categories.push(newCat);
            showToast("Category added successfully.");
        }

        saveData();
        renderCategories();
        catModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    // 8. Filters & Search Listeners
    searchInput.addEventListener('input', renderCategories);
    filterStatus.addEventListener('change', renderCategories);
    sortSelect.addEventListener('change', renderCategories);
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterStatus.value = 'All';
        sortSelect.value = 'Name A-Z';
        renderCategories();
    });

    // Init
    initData();
    renderCategories();
});
