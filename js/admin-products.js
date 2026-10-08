document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Sidebar Toggle (Same as admin.js)
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

    // 2. Modal Logic
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const closeBtns = document.querySelectorAll('.close-modal-btn');

    function openModal() {
        productModal.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeModal() {
        productModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        // Reset form on close
        const form = document.getElementById('product-form');
        if (form) {
            form.reset();
            document.getElementById('form-error').style.display = 'none';
            document.getElementById('form-success').style.display = 'none';
        }
    }

    if (addProductBtn) addProductBtn.addEventListener('click', openModal);
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });

    // 3. Form Validation Logic (No alert, No blue)
    const productForm = document.getElementById('product-form');
    
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('prod-name').value.trim();
            const category = document.getElementById('prod-category').value;
            const price = document.getElementById('prod-price').value.trim();
            const stock = document.getElementById('prod-stock').value.trim();
            
            const errorMsg = document.getElementById('form-error');
            const successMsg = document.getElementById('form-success');

            // Basic validation check
            if (!name || !category || !price || !stock) {
                errorMsg.style.display = 'block';
                successMsg.style.display = 'none';
            } else {
                errorMsg.style.display = 'none';
                successMsg.style.display = 'block';
                
                // Simulate saving delay
                setTimeout(() => {
                    closeModal();
                }, 1500);
            }
        });
    }

});
