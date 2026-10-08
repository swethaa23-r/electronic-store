document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');
    function openSidebar() { sidebar.classList.add('active'); overlay.classList.add('active'); document.body.classList.add('no-scroll'); }
    function closeSidebarFunc() { sidebar.classList.remove('active'); overlay.classList.remove('active'); document.body.classList.remove('no-scroll'); }
    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (overlay) overlay.addEventListener('click', closeSidebarFunc);

    const form = document.getElementById('settings-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('save-settings-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Saved Successfully';
            btn.style.backgroundColor = '#333333';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        });
    }
});
