/**
 * STACKLY Electronic Store — Dashboard Global Controller & Route Synchronizer
 * Manages topbar search, notification routing, session logout, sub-page navigation,
 * and action button routing across User and Admin dashboards.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Navbar Search Bar — Redirect to 404.html only when details are entered
    const topbarSearchForms = document.querySelectorAll('.topbar-search-form');
    topbarSearchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const query = input ? input.value.trim() : '';
            if (query.length > 0) {
                window.location.href = '../404.html';
            }
        });
    });

    const topbarSearchInputs = document.querySelectorAll('.topbar-search-input, .search-bar input');
    topbarSearchInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query.length > 0) {
                    e.preventDefault();
                    window.location.href = '../404.html';
                } else {
                    e.preventDefault();
                }
            }
        });
    });

    // 2. Notification Bell Click Handler — Always routes to 404.html
    const bellButtons = document.querySelectorAll('.icon-btn, a.icon-btn, button.icon-btn');
    bellButtons.forEach(btn => {
        if (btn.querySelector('.fa-bell')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../404.html';
            });
        }
    });

    // 3. Logout Handler — Clears session and redirects to login.html
    const logoutLinks = document.querySelectorAll('.logout-link, a[href*="login.html"]');
    logoutLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes('logout')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    localStorage.removeItem('stacklyUserSession');
                    localStorage.removeItem('userRole');
                } catch (err) {}
                window.location.href = '../login.html';
            });
        }
    });

    // 4. Sub-page Action Buttons Routing — All action buttons inside sub-pages route to 404.html
    // Note: Sidebar nav links (.sidebar-nav a) switch to their respective sub-pages.
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .action-btn, .btn-primary-admin, .btn-secondary-admin, a.btn-primary-admin, a.btn-secondary-admin, a.action-btn, a.view-all');
        if (!btn) return;

        // Exempt sidebar navigation, close-sidebar, hamburger, topbar search, and logout
        if (btn.closest('.sidebar-nav') ||
            btn.classList.contains('hamburger') ||
            btn.classList.contains('close-sidebar') ||
            btn.classList.contains('search-submit-btn') ||
            btn.closest('.topbar-search-form') ||
            btn.classList.contains('logout-link') ||
            btn.closest('.logout-link') ||
            btn.textContent.trim().toLowerCase() === 'logout') {
            return;
        }

        // Exempt notification bell (already redirects to 404)
        if (btn.querySelector('.fa-bell')) {
            return;
        }

        // Action button inside dashboard sub-pages -> route to 404.html!
        e.preventDefault();
        window.location.href = '../404.html';
    });

    // Submitting any form inside .admin-content routes to 404.html
    const contentForms = document.querySelectorAll('.admin-content form');
    contentForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = '../404.html';
        });
    });

    // 5. Phone input restrictions (only digits allowed)
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone"], input[placeholder*="Phone"], input[placeholder*="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    });

    // 6. Dynamic Dashboard Topbar Profile Email Sync
    try {
        const session = JSON.parse(localStorage.getItem('stacklyUserSession'));
        const emailEl = document.getElementById('topbar-user-email');
        if (emailEl) {
            if (session && session.email) {
                emailEl.textContent = session.email;
            } else {
                const isAdmin = window.location.pathname.includes('admin');
                emailEl.textContent = isAdmin ? 'admin@stackly.com' : 'customer@stackly.com';
            }
        }
    } catch (e) {}
});
