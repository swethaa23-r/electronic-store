document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Mock Check
    // If you uncomment the below line, it enforces auth check.
    // For now we assume the user role is not admin if not set.
    const userRole = localStorage.getItem('userRole') || "Admin"; // Set default to Admin for demo
    if (userRole !== "Admin") {
        window.location.href = "../login.html";
    }

    // 2. Mobile Sidebar Toggle
    const hamburger = document.querySelector('.hamburger');
    const closeSidebar = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.admin-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeSidebarFunc() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (overlay) overlay.addEventListener('click', closeSidebarFunc);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebarFunc();
            }
        });
    });

    // 3. Initialize Chart.js with Monochrome palette
    // Required colors: #333333, #555555, #999999, #D9D9D9
    const ctx = document.getElementById('salesChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Sales ($)',
                        data: [1200, 1900, 1500, 2200, 1800, 2800, 2400],
                        borderColor: '#333333',
                        backgroundColor: 'rgba(17, 17, 17, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Orders',
                        data: [12, 19, 15, 22, 18, 28, 24], // scaled down for demo
                        borderColor: '#999999',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        tension: 0.4,
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
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#E5E5E5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666666',
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: '#E5E5E5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666666',
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
    }
});
