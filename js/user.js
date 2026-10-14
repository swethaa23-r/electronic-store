
document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const userRole = localStorage.getItem('userRole') || "User";
    if (userRole !== "User" && userRole !== "Admin") {
        window.location.href = "../login.html";
    }

    // Dynamic Topbar Profile Email & Profile Header
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

    // Mobile Sidebar Toggle
    const hamburger = document.querySelector('.hamburger');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');

    function openSidebar() { sidebar.classList.add('active'); overlay.classList.add('active'); document.body.classList.add('no-scroll'); }
    function closeSidebarFunc() { sidebar.classList.remove('active'); overlay.classList.remove('active'); document.body.classList.remove('no-scroll'); }

    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (overlay) overlay.addEventListener('click', closeSidebarFunc);

    // Modal Logic (for Orders)
    const viewBtns = document.querySelectorAll('.view-order-btn');
    const orderModal = document.getElementById('order-modal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');

    if (orderModal) {
        function openModal() { orderModal.classList.add('active'); document.body.classList.add('no-scroll'); }
        function closeModal() { orderModal.classList.remove('active'); document.body.classList.remove('no-scroll'); }

        viewBtns.forEach(btn => btn.addEventListener('click', openModal));
        closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
        window.addEventListener('click', (e) => { if (e.target === orderModal) closeModal(); });
    }

    // Dynamic rendering of customer orders from localStorage
    const ordersTableBody = document.querySelector('.products-table-section .admin-table tbody');
    if (ordersTableBody) {
        try {
            const savedOrders = JSON.parse(localStorage.getItem('stacklyOrders')) || [];
            if (savedOrders.length > 0) {
                // Prepend demo orders
                savedOrders.forEach(ord => {
                    const tr = document.createElement('tr');
                    const itemsSummary = ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
                    tr.innerHTML = `
                        <td><strong>#${ord.orderId}</strong></td>
                        <td>${itemsSummary}</td>
                        <td><strong>${ord.total}</strong></td>
                        <td><span class="badge badge-paid">Confirmed (Demo)</span></td>
                        <td>${ord.date}</td>
                        <td><button class="action-btn view-order-btn" type="button">View Details</button></td>
                    `;
                    ordersTableBody.prepend(tr);
                });

                // Re-bind modal buttons
                document.querySelectorAll('.view-order-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (orderModal) {
                            orderModal.classList.add('active');
                            document.body.classList.add('no-scroll');
                        }
                    });
                });
            }
        } catch(e) {}
    }
});
