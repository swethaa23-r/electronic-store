document.addEventListener('DOMContentLoaded', () => {
    // 1. Reduced Motion & Plugins
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // 2. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: prefersReducedMotion
        });
    }

    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    // 3. Hero Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Ensure elements are initially hidden for GSAP
    gsap.set('.hero-eyebrow, .hero h1, .hero-support, .hero-buttons a, .hero-features .hf-item', { opacity: 0 });

    heroTl.fromTo('.hero-eyebrow', 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo('.hero h1', 
        { opacity: 0, y: 60 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
        '-=0.5'
    )
    .fromTo('.hero-support', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
    )
    .fromTo('.hero-buttons a', 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        '-=0.5'
    )
    .fromTo('.hero-features .hf-item', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.3'
    );

    // 4. Hero Visual Subtle Float & Parallax
    const heroSection = document.querySelector('.hero');
    
    // Background pseudo-parallax (since background is via CSS)
    // For a real hero image, we apply subtle float:
    const heroImage = document.querySelector('.hero-bg-img, .hero-visual'); 
    if (heroImage) {
        gsap.fromTo(heroImage, 
            { opacity: 0, scale: 0.94, x: 40 },
            { opacity: 1, scale: 1, x: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
        );

        gsap.to(heroImage, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.7
        });
    }

    if (heroSection && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 16; // max 8px
            const yPos = (e.clientY / window.innerHeight - 0.5) * 16;
            
            gsap.to(heroSection, {
                backgroundPosition: `calc(50% + ${xPos}px) calc(50% + ${yPos}px)`,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    }

    // 5. Product Hover Animations (GSAP)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const img = card.querySelector('.img-container img, img');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' });
            if (img) gsap.to(img, { scale: 1.04, duration: 0.4, ease: 'power2.out' });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
            if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
        });
    });

    // 6. Category Hover Animations
    const categoryCards = document.querySelectorAll('.category-item');
    categoryCards.forEach(card => {
        const icon = card.querySelector('.cat-icon i, .cat-icon img');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' });
            if (icon) gsap.to(icon, { scale: 1.08, duration: 0.3, ease: 'back.out(1.5)' });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out', boxShadow: '0 2px 10px rgba(0,0,0,0)' });
            if (icon) gsap.to(icon, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });

    // 7. Technology Showcase (ScrollTrigger Reveal)
    const showcaseSection = document.querySelector('.showcase');
    if (showcaseSection) {
        const showcaseHeading = showcaseSection.querySelector('h2');
        const showcaseVisual = showcaseSection.querySelector('.sc-main-img, .sc-img-wrap img');
        const featurePoints = showcaseSection.querySelectorAll('.sc-feature, .showcase-point');

        if(showcaseHeading) gsap.set(showcaseHeading, { opacity: 0, y: 30 });
        if(showcaseVisual) gsap.set(showcaseVisual, { opacity: 0, scale: 0.96 });
        if(featurePoints.length) gsap.set(featurePoints, { opacity: 0, y: 20 });

        const showcaseTl = gsap.timeline({
            scrollTrigger: {
                trigger: showcaseSection,
                start: "top 75%",
                once: true
            }
        });

        if(showcaseHeading) {
            showcaseTl.to(showcaseHeading, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }
        if(showcaseVisual) {
            showcaseTl.to(showcaseVisual, { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, '-=0.4');
        }
        if(featurePoints.length) {
            showcaseTl.to(featurePoints, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.5');
        }
    }

    // 8. Promotional Banner Reveal (Disabled GSAP to prevent opacity clipping issues)

    // 9. Articles Hover
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        const img = card.querySelector('img');
        if (img && img.parentElement) {
            img.parentElement.style.overflow = 'hidden';
        }
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' });
            if (img) gsap.to(img, { scale: 1.04, duration: 0.5, ease: 'power2.out' });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
            if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
        });
    });

    // 10. Button Hover Animations
    const primaryBtns = document.querySelectorAll('.btn-primary, .btn-primary-admin');
    primaryBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.02, backgroundColor: '#555555', duration: 0.2, ease: 'power1.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, backgroundColor: '#333333', duration: 0.2, ease: 'power1.out' }));
    });

    const secondaryBtns = document.querySelectorAll('.btn-secondary, .btn-secondary-admin');
    secondaryBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { backgroundColor: '#F5F5F5', duration: 0.2, ease: 'power1.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { backgroundColor: '#FFFFFF', duration: 0.2, ease: 'power1.out' }));
    });

    // 11. Subtle Newsletter Reveal
    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
        gsap.fromTo(newsletter.children, 
            { opacity: 0, y: 20 },
            { 
                scrollTrigger: { trigger: newsletter, start: "top 85%", once: true },
                opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out'
            }
        );
    }
});
