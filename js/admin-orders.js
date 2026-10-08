document.addEventListener('DOMContentLoaded', () => {
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

    // Modal Logic
    const viewBtns = document.querySelectorAll('.view-order-btn');
    const orderModal = document.getElementById('order-modal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');

    function openModal() { orderModal.classList.add('active'); document.body.classList.add('no-scroll'); }
    function closeModal() { orderModal.classList.remove('active'); document.body.classList.remove('no-scroll'); }

    viewBtns.forEach(btn => btn.addEventListener('click', openModal));
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    window.addEventListener('click', (e) => { if (e.target === orderModal) closeModal(); });
});
