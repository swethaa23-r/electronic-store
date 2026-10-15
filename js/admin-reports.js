/**
 * STACKLY - Admin Reports & Analytics Controller (admin-reports.js)
 * Manages sales and growth trend charts, dynamic time-period filtering,
 * KPI metrics, and realistic CSV dataset exports for external analysis.
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

    // 3. Chart.js Initialization & Period Datasets
    const ctx = document.getElementById('reportsChart');
    let chartInstance = null;

    const reportDatasets = {
        '30': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            revenue: [28000, 31500, 29000, 36000],
            orders: [280, 310, 295, 360],
            growth: [40, 55, 48, 62],
            kpis: { rev: '$124,500', orders: '1,245', aov: '$100.00', growth: '+14.5%' }
        },
        '90': {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            revenue: [112000, 126000, 130200],
            orders: [1100, 1220, 1270],
            growth: [140, 175, 192],
            kpis: { rev: '$368,200', orders: '3,590', aov: '$102.50', growth: '+18.2%' }
        },
        'year': {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            revenue: [320000, 350000, 370000, 380000],
            orders: [3150, 3480, 3690, 3800],
            growth: [420, 510, 590, 640],
            kpis: { rev: '$1,420,000', orders: '14,120', aov: '$100.56', growth: '+22.4%' }
        }
    };

    if (ctx && typeof Chart !== 'undefined') {
        const initial = reportDatasets['30'];
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: initial.labels,
                datasets: [
                    {
                        label: 'Revenue ($)',
                        data: initial.revenue,
                        borderColor: '#333333',
                        backgroundColor: 'rgba(51, 51, 51, 0.08)',
                        borderWidth: 2,
                        tension: 0.38,
                        fill: true
                    },
                    {
                        label: 'Orders',
                        data: initial.orders,
                        borderColor: '#777777',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        tension: 0.38,
                        fill: false
                    },
                    {
                        label: 'Customer Growth',
                        data: initial.growth,
                        borderColor: '#AAAAAA',
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
                            font: { family: 'Inter', size: 12, weight: '500' }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#EBEBEB', drawBorder: false },
                        ticks: { color: '#666666', font: { family: 'Inter' } }
                    },
                    y: {
                        grid: { color: '#EBEBEB', drawBorder: false },
                        ticks: { color: '#666666', font: { family: 'Inter' } }
                    }
                }
            }
        });
    }

    // 4. Period Change Handler
    const periodSelect = document.getElementById('report-period-select');
    if (periodSelect) {
        periodSelect.addEventListener('change', () => {
            const val = periodSelect.value;
            const data = reportDatasets[val] || reportDatasets['30'];

            // Update Chart
            if (chartInstance) {
                chartInstance.data.labels = data.labels;
                chartInstance.data.datasets[0].data = data.revenue;
                chartInstance.data.datasets[1].data = data.orders;
                chartInstance.data.datasets[2].data = data.growth;
                chartInstance.update();
            }

            // Update 4 KPI Stat Cards
            const statCards = document.querySelectorAll('.statistics-grid .stat-card .stat-val');
            if (statCards.length >= 4) {
                statCards[0].textContent = data.kpis.rev;
                statCards[1].textContent = data.kpis.orders;
                statCards[2].textContent = data.kpis.aov;
                statCards[3].textContent = data.kpis.growth;
            }

            showAdminToast(`Updated reports for ${periodSelect.options[periodSelect.selectedIndex].text}`);
        });
    }

    // 5. CSV Export Data Download Simulation
    const exportButtons = document.querySelectorAll('.export-grid button');
    exportButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const reportName = btn.textContent.trim();
            let csvContent = "data:text/csv;charset=utf-8,";

            if (reportName.includes('Sales')) {
                csvContent += "Period,Revenue,Orders,AverageOrderValue,GrowthRate\r\n";
                csvContent += "Oct 2026,124500,1245,100.00,14.5%\r\n";
                csvContent += "Sep 2026,118200,1190,99.32,12.8%\r\n";
                csvContent += "Aug 2026,112400,1140,98.59,11.2%\r\n";
            } else if (reportName.includes('Product')) {
                csvContent += "ProductID,ProductName,Category,UnitsSold,Revenue,CurrentStock\r\n";
                csvContent += "PRD-001,Pro Display X1,Monitors,52,46748,124\r\n";
                csvContent += "PRD-002,Mechanical Keys,Accessories,118,15222,48\r\n";
                csvContent += "PRD-003,Book Air 14,Laptops,28,33572,15\r\n";
            } else if (reportName.includes('Customer')) {
                csvContent += "CustomerID,Name,Email,TotalOrders,TotalSpent,Status,JoinDate\r\n";
                csvContent += "CST-092,Sarah Jenkins,sarah.jenkins@example.com,14,3450.00,Active,2025-01-12\r\n";
                csvContent += "CST-093,Michael Reed,michael.reed@example.com,5,899.00,Active,2026-03-24\r\n";
                csvContent += "CST-094,David Torres,david.t@example.com,1,45.00,Suspended,2026-10-01\r\n";
            } else {
                csvContent += "OrderID,Date,Customer,Total,Status,PaymentMethod\r\n";
                csvContent += "ORD-7392,2026-10-08,Sarah Jenkins,899.00,Completed,Credit Card\r\n";
                csvContent += "ORD-7393,2026-10-08,Michael Reed,129.00,Pending,PayPal\r\n";
                csvContent += "ORD-7394,2026-10-07,Alex Johnson,450.00,Completed,Apple Pay\r\n";
            }

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            const filename = `stackly-${reportName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.csv`;
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showAdminToast(`Downloaded ${filename} successfully`, 'fa-file-arrow-down');
        });
    });
});
