
document.addEventListener('DOMContentLoaded', () => {
    // 1. Phone input restrictions (only digits allowed)
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone"], input[placeholder*="Phone"], input[placeholder*="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, ''); // Remove non-digits immediately
        });
    });

    // Clear error visuals on input
    document.body.addEventListener('input', (e) => {
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            e.target.style.border = '';
            const err = e.target.parentElement.querySelector('.validation-error');
            if(err) err.remove();
        }
    });

    function showError(input, message) {
        input.style.border = '1px solid #D32F2F'; // Professional Red
        const err = document.createElement('div');
        err.className = 'validation-error';
        err.style.color = '#D32F2F';
        err.style.fontSize = '0.8rem';
        err.style.marginTop = '4px';
        err.textContent = message;
        
        // ensure parent is relative if needed, but appendChild is usually fine for our standard form-groups
        input.parentElement.appendChild(err);
    }

    // 2. Intercept All Form Submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Reset styling
                input.style.border = '';
                const oldErr = input.parentElement.querySelector('.validation-error');
                if(oldErr) oldErr.remove();

                const val = input.value.trim();

                // Validation logic
                if(input.hasAttribute('required') && val === '') {
                    showError(input, 'This field is required. Please fill it out.');
                    isValid = false;
                } 
                else if(val !== '') {
                    // Check Email strictly
                    if(input.type === 'email' || input.id.toLowerCase().includes('email')) {
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        if(!emailRegex.test(val)) {
                            showError(input, 'Please enter a valid professional email address (e.g., name@domain.com). Domain is missing.');
                            isValid = false;
                        }
                    }
                    // Check Phone strictly
                    else if(input.type === 'tel' || input.id.toLowerCase().includes('phone')) {
                        if(val.length < 10) {
                            showError(input, 'Please enter a valid phone number with at least 10 digits.');
                            isValid = false;
                        }
                    }
                }
            });

            if(isValid) {
                // Successful Validation -> Redirect to 404
                window.location.href = '../404.html';
            }
        }, true); // Capture phase to beat existing listeners
    });

    // 3. Search Bar Validation
    const searchBars = document.querySelectorAll('.search-bar input, .filter-search input');
    searchBars.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                input.style.border = '';
                const oldErr = input.parentElement.querySelector('.validation-error');
                if(oldErr) oldErr.remove();
                
                if(input.value.trim() === '') {
                    showError(input, 'Please enter a valid search term before searching.');
                } else {
                    window.location.href = '../404.html';
                }
            }
        }, true);
    });

    // 4. Intercept All Action Buttons -> Redirect to 404
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button, .action-btn, .icon-btn, .btn-primary-admin, .btn-secondary-admin');
        if(!target) return;

        // Exemptions:
        // Let standard menu/nav functionality work
        if(
            target.type === 'submit' || // handled by form logic
            target.classList.contains('hamburger') ||
            target.classList.contains('close-sidebar') ||
            target.classList.contains('close-mobile') ||
            target.closest('.sidebar-nav') ||
            target.closest('.mobile-menu')
        ) {
            return;
        }

        // Specific exemption for Modals (so they can still be seen/tested if forms are inside)
        if(target.id === 'open-add-modal' || target.classList.contains('close-modal-btn')) {
            return;
        }

        // All other buttons (Add to cart, View, Edit, Export, Bell Icon, etc.)
        if(target.type !== 'submit') {
            e.preventDefault();
            e.stopImmediatePropagation();
            window.location.href = '../404.html';
        }
    }, true);
});
