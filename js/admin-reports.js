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

    const ctx = document.getElementById('reportsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    { label: 'Revenue ($)', data: [12000, 19000, 15000, 22000, 18000, 28000], borderColor: '#333333', backgroundColor: 'rgba(17, 17, 17, 0.1)', borderWidth: 2, tension: 0.4, fill: true },
                    { label: 'Orders', data: [120, 190, 150, 220, 180, 280], borderColor: '#555555', borderDash: [5, 5], borderWidth: 2, tension: 0.4, fill: false },
                    { label: 'Customer Growth', data: [50, 80, 60, 110, 90, 140], borderColor: '#999999', borderWidth: 2, tension: 0.4, fill: false }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#333333', font: { family: 'Inter', size: 12 } } } },
                scales: {
                    x: { grid: { color: '#E5E5E5', drawBorder: false }, ticks: { color: '#666666', font: { family: 'Inter' } } },
                    y: { grid: { color: '#E5E5E5', drawBorder: false }, ticks: { color: '#666666', font: { family: 'Inter' } } }
                }
            }
        });
    }
});
