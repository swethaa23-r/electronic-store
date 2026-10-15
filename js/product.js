/**
 * STACKLY Electronic Store — Dynamic Product Details Page Controller
 * Renders product details for every store product (`product.html?id=<slug>`),
 * handles gallery thumbnails, finish selection, quantity control,
 * Add to Bag, Buy Now (Instant Checkout), Wishlist toggle, and Related Products shelf.
 */

(function (window, document) {
    'use strict';

    function slugify(text) {
        if (!text) return '';
        return text.toString().toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Complete Product Catalog Database (All 14 Shop Products + All 16 Home Products)
    const PRODUCTS_DB = {
        // ==========================================
        // 1. SHOP PAGE PRODUCTS (14 Core Products)
        // ==========================================
        'sonix-pro-wireless': {
            id: 'sonix-pro-wireless',
            name: 'Sonix Pro Wireless',
            category: 'Headphones',
            badge: 'Bestseller',
            eyebrow: 'HEADPHONES / BESTSELLER',
            price: '$129.00',
            oldPrice: '$199.00',
            rating: '4.8',
            reviews: 142,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-headphones.webp',
            gallery: [
                'assets/img/shop-headphones.webp',
                'assets/img/shop-headphones-studio.webp',
                'assets/img/promo.webp',
                'assets/img/promo-girl.webp'
            ],
            description: 'Your own little world of sound. Rich, beautifully balanced audio meets adaptive noise cancellation and a fit that feels as good as it sounds.',
            finishes: [
                { name: 'Graphite', hex: '#2D3036', image: 'assets/img/shop-headphones.webp' },
                { name: 'Studio Black', hex: '#141518', image: 'assets/img/shop-headphones-studio.webp' },
                { name: 'Warm Silver', hex: '#D5D7DC', image: 'assets/img/promo.webp' }
            ],
            specs: [
                { label: 'Battery life', value: 'Up to 40 hours' },
                { label: 'Connectivity', value: 'Bluetooth 5.3' },
                { label: 'Noise cancellation', value: 'Adaptive ANC' },
                { label: 'Charging', value: 'USB-C fast charging' },
                { label: 'Weight', value: '250 g' }
            ]
        },

        'sonix-studio-max': {
            id: 'sonix-studio-max',
            name: 'Sonix Studio Max',
            category: 'Headphones',
            badge: 'Studio collection',
            eyebrow: 'HEADPHONES / STUDIO COLLECTION',
            price: '$199.00',
            oldPrice: '$249.00',
            rating: '4.9',
            reviews: 98,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-headphones-studio.webp',
            gallery: [
                'assets/img/shop-headphones-studio.webp',
                'assets/img/shop-headphones.webp',
                'assets/img/promo.webp'
            ],
            description: 'Reference-grade over-ear headphones engineered for deep soundstage clarity, plush memory-foam comfort, and studio-calibrated active noise cancellation.',
            finishes: [
                { name: 'Studio Black', hex: '#18191C', image: 'assets/img/shop-headphones-studio.webp' },
                { name: 'Graphite', hex: '#3A3E47', image: 'assets/img/shop-headphones.webp' },
                { name: 'Silver Mist', hex: '#D8DCE3', image: 'assets/img/promo.webp' }
            ],
            specs: [
                { label: 'Battery life', value: 'Up to 45 hours' },
                { label: 'Drivers', value: '45 mm custom beryllium' },
                { label: 'Noise cancellation', value: 'Hybrid Studio ANC + Transparency' },
                { label: 'Connectivity', value: 'Bluetooth 5.3 + 3.5 mm lossless audio' },
                { label: 'Weight', value: '268 g' }
            ]
        },

        'view-27-qhd-monitor': {
            id: 'view-27-qhd-monitor',
            name: 'View 27 QHD Monitor',
            category: 'Monitors',
            badge: 'New arrival',
            eyebrow: 'MONITORS / NEW ARRIVAL',
            price: '$249.00',
            oldPrice: '$329.00',
            rating: '4.8',
            reviews: 116,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-monitor-qhd.webp',
            gallery: [
                'assets/img/shop-monitor-qhd.webp',
                'assets/img/shop-monitor-4k.webp',
                'assets/img/monitor.webp'
            ],
            description: 'Crisp 2560 x 1440 QHD resolution on an ultra-thin three-side borderless IPS panel. Built for effortless multitasking, smooth 100Hz motion, and all-day eye comfort.',
            finishes: [
                { name: 'Matte Black', hex: '#1E2024', image: 'assets/img/shop-monitor-qhd.webp' },
                { name: 'Space Silver', hex: '#C7CCD4', image: 'assets/img/shop-monitor-4k.webp' }
            ],
            specs: [
                { label: 'Display panel', value: '27-inch IPS QHD (2560 x 1440)' },
                { label: 'Refresh rate', value: '100 Hz Adaptive-Sync' },
                { label: 'Color accuracy', value: '99% sRGB factory calibrated' },
                { label: 'Connectivity', value: 'USB-C (65W PD), HDMI 2.0, DisplayPort' },
                { label: 'Ergonomics', value: 'Height, tilt, swivel & VESA mount' }
            ]
        },

        'view-27-4k-monitor': {
            id: 'view-27-4k-monitor',
            name: 'View 27 4K Monitor',
            category: 'Monitors',
            badge: 'Creative pick',
            eyebrow: 'MONITORS / CREATIVE PICK',
            price: '$399.00',
            oldPrice: '$499.00',
            rating: '4.9',
            reviews: 84,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-monitor-4k.webp',
            gallery: [
                'assets/img/shop-monitor-4k.webp',
                'assets/img/shop-monitor-qhd.webp',
                'assets/img/monitor.webp'
            ],
            description: 'Pin-sharp 4K UHD clarity with single-cable 90W USB-C power delivery. Designed for photo editors, filmmakers, and detail-focused workspaces.',
            finishes: [
                { name: 'Anodized Silver', hex: '#CFD4DC', image: 'assets/img/shop-monitor-4k.webp' },
                { name: 'Graphite Black', hex: '#23262B', image: 'assets/img/shop-monitor-qhd.webp' }
            ],
            specs: [
                { label: 'Resolution', value: '27-inch 4K UHD (3840 x 2160)' },
                { label: 'Color gamut', value: '98% DCI-P3 / Delta E < 1.5' },
                { label: 'Power delivery', value: '90W USB-C single-cable dock' },
                { label: 'HDR support', value: 'VESA DisplayHDR 400' },
                { label: 'Stand adjustments', value: 'Height, 90° pivot, tilt & swivel' }
            ]
        },

        'play-one-console': {
            id: 'play-one-console',
            name: 'Play One Console',
            category: 'Gaming Consoles',
            badge: 'Play your way',
            eyebrow: 'GAMING CONSOLES / PLAY YOUR WAY',
            price: '$449.00',
            oldPrice: '$499.00',
            rating: '5.0',
            reviews: 215,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-console.webp',
            gallery: [
                'assets/img/shop-console.webp',
                'assets/img/shop-console-bundle.webp',
                'assets/img/console.webp',
                'assets/img/controller.webp'
            ],
            description: 'Next-generation 4K 120fps gaming in a whisper-quiet architectural silhouette. Instant SSD loading, ray-traced lighting, and tactile haptic controller feedback.',
            finishes: [
                { name: 'Glacier White', hex: '#F3F4F6', image: 'assets/img/shop-console.webp' },
                { name: 'Stealth Black', hex: '#1B1D22', image: 'assets/img/shop-console-bundle.webp' }
            ],
            specs: [
                { label: 'Performance', value: '4K at up to 120 fps with Ray Tracing' },
                { label: 'Storage', value: '1 TB custom NVMe PCIe 4.0 SSD' },
                { label: 'Audio engine', value: 'Tempest 3D Spatial Audio' },
                { label: 'Connectivity', value: 'HDMI 2.1, Wi-Fi 6E, 3x USB-C' },
                { label: 'Included in box', value: 'Play One Console + 1 Wireless Controller' }
            ]
        },

        'play-one-extra-controller-bundle': {
            id: 'play-one-extra-controller-bundle',
            name: 'Play One Extra Controller Bundle',
            category: 'Gaming Consoles',
            badge: 'Better together',
            eyebrow: 'GAMING CONSOLES / BETTER TOGETHER',
            price: '$499.00',
            oldPrice: '$569.00',
            rating: '4.9',
            reviews: 129,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-console-bundle.webp',
            gallery: [
                'assets/img/shop-console-bundle.webp',
                'assets/img/shop-console.webp',
                'assets/img/controller.webp'
            ],
            description: 'Everything in the Play One Console system plus a second dual-haptic wireless controller so you are ready for couch co-op and split-screen tournaments right out of the box.',
            finishes: [
                { name: 'Duo White & Black', hex: '#262930', image: 'assets/img/shop-console-bundle.webp' },
                { name: 'Glacier White', hex: '#F3F4F6', image: 'assets/img/shop-console.webp' }
            ],
            specs: [
                { label: 'Controllers included', value: '2x Dual-Haptic Wireless Controllers' },
                { label: 'Storage', value: '1 TB ultra-fast NVMe SSD' },
                { label: 'Video output', value: '4K 120Hz HDMI 2.1 with VRR' },
                { label: 'Controller battery', value: 'Up to 18 hours per charge' },
                { label: 'Warranty', value: '2-Year STACKLY hardware coverage' }
            ]
        },

        'book-air-14': {
            id: 'book-air-14',
            name: 'Book Air 14',
            category: 'Laptops',
            badge: 'Work anywhere',
            eyebrow: 'LAPTOPS / WORK ANYWHERE',
            price: '$799.00',
            oldPrice: '$849.00',
            rating: '4.8',
            reviews: 174,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-laptop.webp',
            gallery: [
                'assets/img/shop-laptop.webp',
                'assets/img/laptop.webp',
                'assets/img/laptop-light.webp',
                'assets/img/laptop-pro.webp'
            ],
            description: 'Featherlight precision crafted from recycled unibody aluminum. Delivers 18 hours of real-world battery life, a silent fanless thermal design, and a vivid 2.8K Liquid Retina display.',
            finishes: [
                { name: 'Starlight Silver', hex: '#D9DDE3', image: 'assets/img/shop-laptop.webp' },
                { name: 'Space Gray', hex: '#4A4E58', image: 'assets/img/laptop.webp' },
                { name: 'Midnight', hex: '#1F242D', image: 'assets/img/laptop-pro.webp' }
            ],
            specs: [
                { label: 'Display', value: '14.2-inch 2.8K IPS (2880 x 1800), 500 nits' },
                { label: 'Memory & Storage', value: '16 GB Unified RAM / 512 GB PCIe SSD' },
                { label: 'Battery life', value: 'Up to 18 hours video playback' },
                { label: 'Ports', value: '2x Thunderbolt 4, HDMI 2.1, MagCharge, Audio' },
                { label: 'Weight', value: '1.24 kg (2.7 lbs)' }
            ]
        },

        'desk-duo-keyboard-mouse': {
            id: 'desk-duo-keyboard-mouse',
            name: 'Desk Duo Keyboard & Mouse',
            category: 'Accessories',
            badge: 'Desk essential',
            eyebrow: 'ACCESSORIES / DESK ESSENTIAL',
            price: '$89.00',
            oldPrice: '$119.00',
            rating: '4.7',
            reviews: 93,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-accessories.webp',
            gallery: [
                'assets/img/shop-accessories.webp',
                'assets/img/keyboard.webp',
                'assets/img/setup.webp'
            ],
            description: 'A quiet, low-profile tactile wireless keyboard paired with a sculpted precision mouse. Seamlessly switches across up to three laptops, tablets, or desktops at the tap of a key.',
            finishes: [
                { name: 'Charcoal Slate', hex: '#2B2E34', image: 'assets/img/shop-accessories.webp' },
                { name: 'Mechanical Noir', hex: '#17181B', image: 'assets/img/keyboard.webp' }
            ],
            specs: [
                { label: 'Multi-device pairing', value: '3-channel Bluetooth 5.2 + 2.4GHz USB receiver' },
                { label: 'Key switch feel', value: 'Scissor-tactile quiet low-profile keys' },
                { label: 'Mouse sensor', value: '4000 DPI track-on-glass optical sensor' },
                { label: 'Battery life', value: 'Up to 4 months per USB-C charge' },
                { label: 'Compatibility', value: 'macOS, Windows, iPadOS & Linux' }
            ]
        },

        'air-buds-pro': {
            id: 'air-buds-pro',
            name: 'Air Buds Pro',
            category: 'Earbuds',
            badge: 'New arrival',
            eyebrow: 'EARBUDS / NEW ARRIVAL',
            price: '$79.00',
            oldPrice: '$119.00',
            rating: '4.8',
            reviews: 164,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-earbuds-pro.webp',
            gallery: [
                'assets/img/shop-earbuds-pro.webp',
                'assets/img/shop-earbuds-lite.webp',
                'assets/img/earbuds.webp'
            ],
            description: 'Pocket-sized studio sound with smart adaptive noise control, wind-resistant voice microphones, and a wireless MagSafe-compatible charging case.',
            finishes: [
                { name: 'Pearl White', hex: '#F3F4F6', image: 'assets/img/shop-earbuds-pro.webp' },
                { name: 'Graphite', hex: '#343840', image: 'assets/img/earbuds.webp' }
            ],
            specs: [
                { label: 'Battery life', value: '7 hrs buds / 32 hrs with charging case' },
                { label: 'Noise cancellation', value: 'Active ANC + Conversation Awareness' },
                { label: 'Water resistance', value: 'IPX5 sweat & weather resistant' },
                { label: 'Connectivity', value: 'Bluetooth 5.3 with Multipoint' },
                { label: 'Charging', value: 'USB-C & Qi wireless charging' }
            ]
        },

        'air-buds-lite': {
            id: 'air-buds-lite',
            name: 'Air Buds Lite',
            category: 'Earbuds',
            badge: 'Great value',
            eyebrow: 'EARBUDS / GREAT VALUE',
            price: '$49.00',
            oldPrice: '$69.00',
            rating: '4.6',
            reviews: 108,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-earbuds-lite.webp',
            gallery: [
                'assets/img/shop-earbuds-lite.webp',
                'assets/img/shop-earbuds-pro.webp',
                'assets/img/earbuds.webp'
            ],
            description: 'Featherweight everyday wireless earbuds with punchy dynamic drivers, instant flip-open pairing, and all-day battery life that keeps up with every commute.',
            finishes: [
                { name: 'Cloud White', hex: '#F8FAFC', image: 'assets/img/shop-earbuds-lite.webp' },
                { name: 'Soft Charcoal', hex: '#3F434C', image: 'assets/img/earbuds.webp' }
            ],
            specs: [
                { label: 'Battery life', value: '6 hrs buds / 26 hrs with case' },
                { label: 'Drivers', value: '11 mm dynamic neodymium' },
                { label: 'Water resistance', value: 'IPX4 splash proof' },
                { label: 'Connectivity', value: 'Bluetooth 5.3 fast pair' },
                { label: 'Weight', value: '4.1 g per earbud' }
            ]
        },

        'pulse-mini-speaker': {
            id: 'pulse-mini-speaker',
            name: 'Pulse Mini Speaker',
            category: 'Speakers',
            badge: 'Everyday favorite',
            eyebrow: 'SPEAKERS / EVERYDAY FAVORITE',
            price: '$59.00',
            oldPrice: '$89.00',
            rating: '4.7',
            reviews: 131,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-speaker-mini.webp',
            gallery: [
                'assets/img/shop-speaker-mini.webp',
                'assets/img/shop-speaker-home.webp'
            ],
            description: 'Surprising 360-degree acoustic punch in a rugged, palm-sized woven silhouette. Waterproof, dustproof, and ready to clip onto your pack or brighten your desk.',
            finishes: [
                { name: 'Charcoal Weave', hex: '#2C2F36', image: 'assets/img/shop-speaker-mini.webp' },
                { name: 'Stone Gray', hex: '#9BA1AB', image: 'assets/img/shop-speaker-home.webp' }
            ],
            specs: [
                { label: 'Battery life', value: 'Up to 15 hours continuous play' },
                { label: 'Durability', value: 'IP67 waterproof & dustproof' },
                { label: 'Sound architecture', value: '360° omnidirectional radiator' },
                { label: 'Stereo pairing', value: 'True Wireless Stereo (TWS) link' },
                { label: 'Weight', value: '310 g' }
            ]
        },

        'pulse-home-speaker': {
            id: 'pulse-home-speaker',
            name: 'Pulse Home Speaker',
            category: 'Speakers',
            badge: 'Home essentials',
            eyebrow: 'SPEAKERS / HOME ESSENTIALS',
            price: '$129.00',
            oldPrice: '$169.00',
            rating: '4.8',
            reviews: 87,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-speaker-home.webp',
            gallery: [
                'assets/img/shop-speaker-home.webp',
                'assets/img/shop-speaker-mini.webp'
            ],
            description: 'Room-filling warmth that automatically adapts to the acoustics of your space. Wrapped in acoustic textile with seamless Wi-Fi AirPlay 2 and Bluetooth streaming.',
            finishes: [
                { name: 'Graphite Fabric', hex: '#353840', image: 'assets/img/shop-speaker-home.webp' },
                { name: 'Obsidian', hex: '#1B1D22', image: 'assets/img/shop-speaker-mini.webp' }
            ],
            specs: [
                { label: 'Acoustic drivers', value: '4-inch high-excursion woofer + dual tweeters' },
                { label: 'Room calibration', value: 'Automatic real-time spatial tuning' },
                { label: 'Wireless streaming', value: 'Wi-Fi 6, AirPlay 2, Spotify Connect, BT 5.3' },
                { label: 'Multi-room audio', value: 'Sync up to 6 Pulse speakers' },
                { label: 'Power', value: 'Detachable braided AC power cord' }
            ]
        },

        'watch-one': {
            id: 'watch-one',
            name: 'Watch One',
            category: 'Wearables',
            badge: 'New arrival',
            eyebrow: 'WEARABLES / NEW ARRIVAL',
            price: '$149.00',
            oldPrice: '$199.00',
            rating: '4.8',
            reviews: 119,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-watch-one.webp',
            gallery: [
                'assets/img/shop-watch-one.webp',
                'assets/img/shop-watch-active.webp',
                'assets/img/watch.webp'
            ],
            description: 'A sleek always-on AMOLED timepiece that tracks sleep recovery, heart-rate variability, and daily movement without overwhelming you with noise.',
            finishes: [
                { name: 'Midnight Black', hex: '#1C1E24', image: 'assets/img/shop-watch-one.webp' },
                { name: 'Titanium Slate', hex: '#59606D', image: 'assets/img/shop-watch-active.webp' }
            ],
            specs: [
                { label: 'Display', value: '1.75-inch Always-On LTPO AMOLED' },
                { label: 'Battery life', value: 'Up to 7 days typical use' },
                { label: 'Health sensors', value: 'Continuous HR, SpO2, Sleep & Stress tracking' },
                { label: 'Water resistance', value: '5 ATM swim-proof (50m)' },
                { label: 'Compatibility', value: 'iOS 15+ and Android 10+' }
            ]
        },

        'watch-active': {
            id: 'watch-active',
            name: 'Watch Active',
            category: 'Wearables',
            badge: 'Made to move',
            eyebrow: 'WEARABLES / MADE TO MOVE',
            price: '$179.00',
            oldPrice: '$229.00',
            rating: '4.9',
            reviews: 94,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/shop-watch-active.webp',
            gallery: [
                'assets/img/shop-watch-active.webp',
                'assets/img/shop-watch-one.webp',
                'assets/img/watch.webp'
            ],
            description: 'Built for trail runners, swimmers, and weekend explorers. Dual-band GPS accuracy, sapphire crystal glass, and a breathable fluoroelastomer sport loop.',
            finishes: [
                { name: 'Carbon Black', hex: '#181A1F', image: 'assets/img/shop-watch-active.webp' },
                { name: 'Obsidian Sport', hex: '#2E323B', image: 'assets/img/shop-watch-one.webp' }
            ],
            specs: [
                { label: 'GPS navigation', value: 'Dual-frequency L1 + L5 satellite tracking' },
                { label: 'Battery life', value: 'Up to 10 days / 28 hrs continuous GPS' },
                { label: 'Case material', value: 'Aerospace-grade titanium bezel + Sapphire glass' },
                { label: 'Water rating', value: '10 ATM water resistant (100m)' },
                { label: 'Workout modes', value: '120+ tracked indoor & outdoor sports' }
            ]
        },

        // ==========================================
        // 2. HOME PAGE &ADDITIONAL CATALOG PRODUCTS
        // ==========================================
        'pro-display-x1': {
            id: 'pro-display-x1',
            name: 'Pro Display X1',
            category: 'Monitors',
            badge: 'Flagship Display',
            eyebrow: 'MONITORS / FLAGSHIP DISPLAY',
            price: '$899.00',
            oldPrice: '$999.00',
            rating: '4.9',
            reviews: 156,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/monitor.webp',
            gallery: [
                'assets/img/monitor.webp',
                'assets/img/shop-monitor-4k.webp',
                'assets/img/shop-monitor-qhd.webp'
            ],
            description: 'Studio-reference 32-inch 6K Retina display with nano-texture anti-reflective glass, Thunderbolt 4 hub, and true 10-bit color depth.',
            finishes: [
                { name: 'Space Black', hex: '#1B1D22', image: 'assets/img/monitor.webp' },
                { name: 'Studio Silver', hex: '#D0D5DD', image: 'assets/img/shop-monitor-4k.webp' }
            ],
            specs: [
                { label: 'Panel', value: '32-inch IPS 6K (6016 x 3384), 1000 nits' },
                { label: 'Color gamut', value: '99% DCI-P3 / True 10-bit color' },
                { label: 'Connectivity', value: 'Thunderbolt 4 (96W PD) + 3x USB-C' },
                { label: 'Finish glass', value: 'Low-reflectivity optical coating' },
                { label: 'Stand', value: 'Counterbalanced height & tilt adjustable' }
            ]
        },

        'mechanical-keys': {
            id: 'mechanical-keys',
            name: 'Mechanical Keys',
            category: 'Accessories',
            badge: 'Tactile Pro',
            eyebrow: 'ACCESSORIES / TACTILE PRO',
            price: '$129.00',
            oldPrice: '$159.00',
            rating: '4.7',
            reviews: 112,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/keyboard.webp',
            gallery: [
                'assets/img/keyboard.webp',
                'assets/img/shop-accessories.webp'
            ],
            description: 'Gasket-mounted wireless mechanical keyboard with hot-swappable lubed tactile switches, PBT double-shot keycaps, and a solid CNC aluminum frame.',
            finishes: [
                { name: 'Charcoal', hex: '#262930', image: 'assets/img/keyboard.webp' },
                { name: 'Slate Duo', hex: '#4B505C', image: 'assets/img/shop-accessories.webp' }
            ],
            specs: [
                { label: 'Layout', value: '75% compact tenkeyless (84 keys)' },
                { label: 'Switches', value: 'Hot-swappable pre-lubed tactile mechanical' },
                { label: 'Connectivity', value: 'Bluetooth 5.1, 2.4GHz wireless & USB-C wired' },
                { label: 'Battery life', value: '4000 mAh (up to 180 hours)' },
                { label: 'Chassis', value: 'Acoustic silicone-damped aluminum' }
            ]
        },

        'galaxy-z-fold-pro': {
            id: 'galaxy-z-fold-pro',
            name: 'Galaxy Z-Fold Pro',
            category: 'Smartphones',
            badge: 'New arrival',
            eyebrow: 'SMARTPHONES / NEW ARRIVAL',
            price: '$1,799.00',
            oldPrice: '$1,899.00',
            rating: '4.9',
            reviews: 204,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/fold-phone.webp',
            gallery: [
                'assets/img/fold-phone.webp',
                'assets/img/flip-phone.webp',
                'assets/img/normal-phone.webp'
            ],
            description: 'Unfold a cinema-grade 7.6-inch Dynamic AMOLED 2X workspace in your pocket. Built with an Armor Aluminum hinge, multi-window productivity, and pro-grade triple cameras.',
            finishes: [
                { name: 'Phantom Black', hex: '#181A1F', image: 'assets/img/fold-phone.webp' },
                { name: 'Titanium Gray', hex: '#686E7A', image: 'assets/img/normal-phone.webp' }
            ],
            specs: [
                { label: 'Main display', value: '7.6-inch QXGA+ 120Hz Foldable AMOLED' },
                { label: 'Processor', value: 'Octa-core 4nm flagship silicon' },
                { label: 'Storage & RAM', value: '512 GB UFS 4.0 / 12 GB LPDDR5X' },
                { label: 'Camera system', value: '50MP OIS Wide + 12MP Ultra-Wide + 10MP 3x Tele' },
                { label: 'Water resistance', value: 'IPX8 water resistant' }
            ]
        },

        'flip-smart-x': {
            id: 'flip-smart-x',
            name: 'Flip Smart X',
            category: 'Smartphones',
            badge: 'Bestseller',
            eyebrow: 'SMARTPHONES / BESTSELLER',
            price: '$999.00',
            oldPrice: '$1,099.00',
            rating: '4.8',
            reviews: 168,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/flip-phone.webp',
            gallery: [
                'assets/img/flip-phone.webp',
                'assets/img/fold-phone.webp',
                'assets/img/normal-phone.webp'
            ],
            description: 'Iconic pocketable flip design featuring an interactive edge-to-edge cover screen, hands-free FlexCam photography, and all-day fast-charging battery.',
            finishes: [
                { name: 'Lavender Mist', hex: '#C084FC', image: 'assets/img/flip-phone.webp' },
                { name: 'Graphite', hex: '#2C3038', image: 'assets/img/normal-phone.webp' }
            ],
            specs: [
                { label: 'Inner display', value: '6.7-inch FHD+ 120Hz Dynamic AMOLED' },
                { label: 'Cover screen', value: '3.4-inch Super AMOLED interactive widget view' },
                { label: 'Storage', value: '256 GB / 8 GB RAM' },
                { label: 'Battery', value: '3700 mAh with 25W fast charge & wireless Qi' },
                { label: 'Weight', value: '187 g' }
            ]
        },

        'ultra-phone-14': {
            id: 'ultra-phone-14',
            name: 'Ultra Phone 14',
            category: 'Smartphones',
            badge: 'Pro Camera',
            eyebrow: 'SMARTPHONES / PRO CAMERA',
            price: '$1,199.00',
            oldPrice: '$1,299.00',
            rating: '4.7',
            reviews: 143,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/normal-phone.webp',
            gallery: [
                'assets/img/normal-phone.webp',
                'assets/img/lite-phone.webp',
                'assets/img/fold-phone.webp'
            ],
            description: 'Forged in aerospace titanium with a 200MP pro camera array, 5x optical periscope zoom, and an ultra-bright 2600-nit ProMotion display.',
            finishes: [
                { name: 'Titanium Gray', hex: '#6E737D', image: 'assets/img/normal-phone.webp' },
                { name: 'Glacier Blue', hex: '#60A5FA', image: 'assets/img/lite-phone.webp' }
            ],
            specs: [
                { label: 'Display', value: '6.8-inch QHD+ 1-120Hz LTPO OLED' },
                { label: 'Camera', value: '200MP Main + 50MP 5x Optical Telephoto' },
                { label: 'Battery life', value: '5000 mAh (up to 29 hours video)' },
                { label: 'Protection', value: 'Grade 5 Titanium frame + IP68 rating' },
                { label: 'Connectivity', value: '5G, Wi-Fi 7, Ultra Wideband, USB-C 3.2' }
            ]
        },

        'lite-phone-z': {
            id: 'lite-phone-z',
            name: 'Lite Phone Z',
            category: 'Smartphones',
            badge: 'Everyday Value',
            eyebrow: 'SMARTPHONES / EVERYDAY VALUE',
            price: '$499.00',
            oldPrice: '$549.00',
            rating: '4.5',
            reviews: 89,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/lite-phone.webp',
            gallery: [
                'assets/img/lite-phone.webp',
                'assets/img/normal-phone.webp'
            ],
            description: 'Clean, fast, and dependable. A vibrant 120Hz OLED screen, stabilized 50MP night camera, and two-day battery life at a refreshingly honest price.',
            finishes: [
                { name: 'Glacier Blue', hex: '#60A5FA', image: 'assets/img/lite-phone.webp' },
                { name: 'Slate Black', hex: '#252830', image: 'assets/img/normal-phone.webp' }
            ],
            specs: [
                { label: 'Display', value: '6.4-inch 120Hz FHD+ OLED' },
                { label: 'Storage', value: '128 GB / 8 GB RAM' },
                { label: 'Main camera', value: '50MP OIS primary + 12MP ultra-wide' },
                { label: 'Battery', value: '4600 mAh with 30W fast USB-C charging' },
                { label: 'Water resistance', value: 'IP67 dust & water resistant' }
            ]
        },

        'creator-pro-16': {
            id: 'creator-pro-16',
            name: 'Creator Pro 16',
            category: 'Laptops',
            badge: 'Bestseller',
            eyebrow: 'LAPTOPS / BESTSELLER',
            price: '$2,499.00',
            oldPrice: '$2,699.00',
            rating: '5.0',
            reviews: 192,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/laptop-pro.webp',
            gallery: [
                'assets/img/laptop-pro.webp',
                'assets/img/shop-laptop.webp',
                'assets/img/laptop-gaming.webp'
            ],
            description: 'Extreme mobile workstation built for 8K timelines, 3D rendering, and compiling massive codebases. Features Mini-LED XDR brilliance and studio six-speaker sound.',
            finishes: [
                { name: 'Space Gray', hex: '#3D414A', image: 'assets/img/laptop-pro.webp' },
                { name: 'Silver', hex: '#D3D7DF', image: 'assets/img/shop-laptop.webp' }
            ],
            specs: [
                { label: 'Display', value: '16.2-inch Mini-LED 120Hz XDR (3456 x 2234)' },
                { label: 'Memory & Storage', value: '32 GB Unified Memory / 1 TB NVMe SSD' },
                { label: 'Battery life', value: 'Up to 22 hours per charge' },
                { label: 'Ports', value: '3x Thunderbolt 4, HDMI 2.1, SDXC slot, MagCharge' },
                { label: 'Weight', value: '2.1 kg' }
            ]
        },

        'gaming-beast-17': {
            id: 'gaming-beast-17',
            name: 'Gaming Beast 17',
            category: 'Laptops',
            badge: 'New arrival',
            eyebrow: 'LAPTOPS / NEW ARRIVAL',
            price: '$1,899.00',
            oldPrice: '$2,099.00',
            rating: '4.8',
            reviews: 118,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/laptop-gaming.webp',
            gallery: [
                'assets/img/laptop-gaming.webp',
                'assets/img/laptop-pro.webp',
                'assets/img/shop-laptop.webp'
            ],
            description: 'Desktop-caliber graphics in a vapor-chamber cooled 17-inch chassis. 240Hz QHD+ G-Sync display and per-key tactile RGB mechanical switches.',
            finishes: [
                { name: 'Stealth Black', hex: '#181A20', image: 'assets/img/laptop-gaming.webp' },
                { name: 'Storm Gray', hex: '#494E59', image: 'assets/img/laptop-pro.webp' }
            ],
            specs: [
                { label: 'Display', value: '17.3-inch QHD+ 240Hz 3ms G-Sync IPS' },
                { label: 'Graphics', value: 'Dedicated RTX-class 12GB GDDR6 GPU' },
                { label: 'Memory & SSD', value: '32 GB DDR5 / 1 TB PCIe Gen 4 SSD' },
                { label: 'Cooling', value: 'Full-coverage vapor chamber + liquid metal' },
                { label: 'Networking', value: 'Wi-Fi 6E + 2.5Gb Ethernet port' }
            ]
        },

        'ultralight-13': {
            id: 'ultralight-13',
            name: 'UltraLight 13',
            category: 'Laptops',
            badge: 'Travel Ready',
            eyebrow: 'LAPTOPS / TRAVEL READY',
            price: '$999.00',
            oldPrice: '$1,099.00',
            rating: '4.6',
            reviews: 76,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/laptop-light.webp',
            gallery: [
                'assets/img/laptop-light.webp',
                'assets/img/shop-laptop.webp',
                'assets/img/laptop.webp'
            ],
            description: 'Under one kilogram of magnesium-alloy craftsmanship. Slip it into any tote and enjoy instant wake, crisp OLED contrast, and all-day battery freedom.',
            finishes: [
                { name: 'Starlight', hex: '#E5E0D8', image: 'assets/img/laptop-light.webp' },
                { name: 'Silver', hex: '#D4D8E0', image: 'assets/img/shop-laptop.webp' }
            ],
            specs: [
                { label: 'Display', value: '13.3-inch 2.8K OLED (100% DCI-P3)' },
                { label: 'Weight', value: '980 g ultra-light magnesium alloy' },
                { label: 'Memory & Storage', value: '16 GB LPDDR5 / 512 GB NVMe SSD' },
                { label: 'Battery life', value: 'Up to 16 hours' },
                { label: 'Charging', value: '65W compact GaN USB-C adapter included' }
            ]
        },

        'watch-series-8': {
            id: 'watch-series-8',
            name: 'Watch Series 8',
            category: 'Wearables',
            badge: 'Bestseller',
            eyebrow: 'WEARABLES / BESTSELLER',
            price: '$399.00',
            oldPrice: '$449.00',
            rating: '4.9',
            reviews: 184,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/watch.webp',
            gallery: [
                'assets/img/watch.webp',
                'assets/img/shop-watch-one.webp',
                'assets/img/shop-watch-active.webp'
            ],
            description: 'Our most advanced health and connectivity smartwatch with ECG, blood oxygen sensing, crash detection, and a crack-resistant edge-to-edge Retina crystal.',
            finishes: [
                { name: 'Midnight', hex: '#1B1F28', image: 'assets/img/watch.webp' },
                { name: 'Graphite', hex: '#434854', image: 'assets/img/shop-watch-one.webp' }
            ],
            specs: [
                { label: 'Case size', value: '45 mm aerospace aluminum case' },
                { label: 'Health sensors', value: 'ECG app, Blood Oxygen, Temperature & HR' },
                { label: 'Display', value: 'Always-On Retina LTPO OLED (2000 nits)' },
                { label: 'Durability', value: 'WR50 swim-proof + IP6X dust resistant' },
                { label: 'Charging', value: 'Fast magnetic USB-C charging puck' }
            ]
        },

        'anc-earbuds': {
            id: 'anc-earbuds',
            name: 'ANC Earbuds',
            category: 'Earbuds',
            badge: 'New arrival',
            eyebrow: 'EARBUDS / NEW ARRIVAL',
            price: '$249.00',
            oldPrice: '$299.00',
            rating: '4.7',
            reviews: 121,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/earbuds.webp',
            gallery: [
                'assets/img/earbuds.webp',
                'assets/img/shop-earbuds-pro.webp',
                'assets/img/shop-earbuds-lite.webp'
            ],
            description: 'Next-level active noise cancellation with personalized spatial head tracking, lossless low-latency audio, and four silicone ear-tip sizes for a custom seal.',
            finishes: [
                { name: 'Pearl White', hex: '#F3F4F6', image: 'assets/img/earbuds.webp' },
                { name: 'Matte White', hex: '#E5E7EB', image: 'assets/img/shop-earbuds-pro.webp' }
            ],
            specs: [
                { label: 'Battery life', value: '6 hrs ANC on / 30 hrs with MagSafe case' },
                { label: 'Audio chip', value: 'Ultra-low latency H-Series DSP' },
                { label: 'Noise control', value: '2x Active ANC + Adaptive Transparency' },
                { label: 'Protection', value: 'IP54 dust, sweat & water resistant' },
                { label: 'Case finder', value: 'Built-in precision speaker chime' }
            ]
        },

        'smart-tag-pro': {
            id: 'smart-tag-pro',
            name: 'Smart Tag Pro',
            category: 'Accessories',
            badge: 'Everyday Essential',
            eyebrow: 'ACCESSORIES / EVERYDAY ESSENTIAL',
            price: '$29.00',
            oldPrice: '$35.00',
            rating: '4.5',
            reviews: 147,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/tag.webp',
            gallery: [
                'assets/img/tag.webp',
                'assets/img/shop-accessories.webp'
            ],
            description: 'Keep track of your keys, luggage, and camera gear with Ultra Wideband precision directional finding and a replaceable one-year coin battery.',
            finishes: [
                { name: 'Polished White', hex: '#F8FAFC', image: 'assets/img/tag.webp' },
                { name: 'Slate Ring', hex: '#475569', image: 'assets/img/shop-accessories.webp' }
            ],
            specs: [
                { label: 'Tracking tech', value: 'Bluetooth LE + Ultra Wideband Precision Finding' },
                { label: 'Battery', value: 'User-replaceable CR2032 (12+ months)' },
                { label: 'Water rating', value: 'IP67 water & dust resistant' },
                { label: 'Built-in speaker', value: '85 dB high-clarity locator chime' },
                { label: 'Dimensions', value: '31.9 mm diameter x 8.0 mm' }
            ]
        },

        'fitness-band-x': {
            id: 'fitness-band-x',
            name: 'Fitness Band X',
            category: 'Wearables',
            badge: 'Light & Active',
            eyebrow: 'WEARABLES / LIGHT & ACTIVE',
            price: '$59.00',
            oldPrice: '$79.00',
            rating: '4.6',
            reviews: 103,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/band.webp',
            gallery: [
                'assets/img/band.webp',
                'assets/img/shop-watch-active.webp'
            ],
            description: 'Ultra-slim 14-day fitness tracker with 24/7 heart rate monitoring, sleep stage insights, and 50-meter swim resistance.',
            finishes: [
                { name: 'Graphite', hex: '#2B2F36', image: 'assets/img/band.webp' },
                { name: 'Carbon Black', hex: '#16181D', image: 'assets/img/shop-watch-active.webp' }
            ],
            specs: [
                { label: 'Battery life', value: 'Up to 14 days on a single charge' },
                { label: 'Display', value: '1.62-inch AMOLED pill display (600 nits)' },
                { label: 'Water resistance', value: '5 ATM swim-ready' },
                { label: 'Sensors', value: 'Optical HR, SpO2, 6-axis motion' },
                { label: 'Weight', value: '24 g with strap' }
            ]
        },

        'vr-headset-pro': {
            id: 'vr-headset-pro',
            name: 'VR Headset Pro',
            category: 'Gaming Consoles',
            badge: 'New arrival',
            eyebrow: 'GAMING / NEW ARRIVAL',
            price: '$299.00',
            oldPrice: '$349.00',
            rating: '4.8',
            reviews: 91,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/vr.webp',
            gallery: [
                'assets/img/vr.webp',
                'assets/img/shop-console.webp',
                'assets/img/controller.webp'
            ],
            description: 'Standalone mixed-reality headset with pancake optics, 4K+ infinite display resolution, full-color passthrough, and inside-out hand tracking.',
            finishes: [
                { name: 'Onyx White', hex: '#F1F5F9', image: 'assets/img/vr.webp' },
                { name: 'Carbon', hex: '#262930', image: 'assets/img/controller.webp' }
            ],
            specs: [
                { label: 'Optics', value: 'Dual pancake lenses (2064 x 2208 per eye)' },
                { label: 'Refresh rate', value: '90 Hz / 120 Hz low-persistence' },
                { label: 'Audio', value: 'Integrated spatial stereo strap speakers' },
                { label: 'Storage', value: '256 GB standalone + PC VR Link ready' },
                { label: 'Controllers', value: '2x TruTouch haptic ringless controllers' }
            ]
        },

        'pro-controller': {
            id: 'pro-controller',
            name: 'Pro Controller',
            category: 'Gaming Consoles',
            badge: 'Pro Gaming',
            eyebrow: 'GAMING / PRO GAMING',
            price: '$69.00',
            oldPrice: '$79.00',
            rating: '4.9',
            reviews: 158,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/controller.webp',
            gallery: [
                'assets/img/controller.webp',
                'assets/img/shop-console-bundle.webp',
                'assets/img/shop-console.webp'
            ],
            description: 'Hall-effect drift-free thumbsticks, adjustable hair-trigger locks, and remappable rear paddles for competitive console and PC play.',
            finishes: [
                { name: 'Carbon Black', hex: '#1B1D22', image: 'assets/img/controller.webp' },
                { name: 'Glacier Duo', hex: '#E2E8F0', image: 'assets/img/shop-console.webp' }
            ],
            specs: [
                { label: 'Thumbsticks', value: 'Magnetic Hall-effect anti-drift sensors' },
                { label: 'Triggers', value: 'Adaptive impulse triggers with 2-stage lock' },
                { label: 'Battery life', value: 'Up to 35 hours rechargeable' },
                { label: 'Connectivity', value: 'Bluetooth 5.2, 2.4GHz dongle & USB-C' },
                { label: 'Weight', value: '245 g' }
            ]
        },

        'premium-anc-headphones': {
            id: 'premium-anc-headphones',
            name: 'Premium ANC Headphones',
            category: 'Headphones',
            badge: 'Studio Edition',
            eyebrow: 'HEADPHONES / STUDIO EDITION',
            price: '$349.00',
            oldPrice: '$399.00',
            rating: '4.9',
            reviews: 134,
            inStock: true,
            stockText: 'Available to order',
            image: 'assets/img/promo.webp',
            gallery: [
                'assets/img/promo.webp',
                'assets/img/shop-headphones.webp',
                'assets/img/shop-headphones-studio.webp'
            ],
            description: 'Flagship acoustic engineering with eight noise-sensing microphones, lambskin memory cushions, and LDAC high-resolution wireless audio.',
            finishes: [
                { name: 'Obsidian Black', hex: '#15171C', image: 'assets/img/promo.webp' },
                { name: 'Graphite', hex: '#323640', image: 'assets/img/shop-headphones.webp' }
            ],
            specs: [
                { label: 'Battery life', value: 'Up to 40 hours with Active ANC' },
                { label: 'Codec support', value: 'LDAC, aptX Adaptive, AAC, SBC' },
                { label: 'Noise cancellation', value: '8-mic Dual-Processor Adaptive ANC' },
                { label: 'Fast charge', value: '3 min charge = 3 hours playback' },
                { label: 'Weight', value: '254 g' }
            ]
        }
    };

    // Slug aliases so every card across index.html, shop.html, guides.html, wishlist.html maps cleanly
    const SLUG_ALIASES = {
        'sonix-pro-wireless-anc-headphones': 'sonix-pro-wireless',
        'book-air-14-laptop': 'book-air-14',
        'view-27-pro-4k-monitor': 'view-27-4k-monitor',
        'play-station-s-duo-bundle': 'play-one-extra-controller-bundle',
        'studio-over-ear-anc': 'sonix-studio-max',
        'sound-home-speaker': 'pulse-home-speaker'
    };

    // Default 4 products shown in "A little more to love." (Exact Screenshot 2 match)
    const DEFAULT_RELATED_SLUGS = [
        'view-27-qhd-monitor',
        'play-one-console',
        'book-air-14',
        'desk-duo-keyboard-mouse'
    ];

    function parsePriceNumber(priceStr) {
        if (!priceStr) return 0;
        const num = parseFloat(priceStr.toString().replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
    }

    function resolveProduct(rawId) {
        const cleanSlug = slugify(rawId || 'sonix-pro-wireless');
        const canonicalSlug = SLUG_ALIASES[cleanSlug] || cleanSlug;

        if (PRODUCTS_DB[canonicalSlug]) {
            return PRODUCTS_DB[canonicalSlug];
        }

        // Partial match fallback
        const foundKey = Object.keys(PRODUCTS_DB).find(
            k => k.includes(canonicalSlug) || canonicalSlug.includes(k)
        );
        if (foundKey) {
            return PRODUCTS_DB[foundKey];
        }

        // Default to Sonix Pro Wireless
        return PRODUCTS_DB['sonix-pro-wireless'];
    }

    function buildStarsHtml(ratingStr) {
        const rating = parseFloat(ratingStr) || 4.8;
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                html += '<i class="fa-solid fa-star"></i>';
            } else if (rating >= i - 0.5) {
                html += '<i class="fa-solid fa-star-half-stroke"></i>';
            } else {
                html += '<i class="fa-regular fa-star"></i>';
            }
        }
        return html;
    }

    document.addEventListener('DOMContentLoaded', function () {
        const params = new URLSearchParams(window.location.search);
        const requestedId = params.get('id') || 'sonix-pro-wireless';
        const product = resolveProduct(requestedId);

        let selectedFinish = (product.finishes && product.finishes[0])
            ? product.finishes[0].name
            : 'Graphite';
        let currentQty = 1;

        // 1. Update Document Title & Breadcrumb
        document.title = `${product.name} — STACKLY`;
        const bcCategory = document.getElementById('pd-bc-category');
        const bcCurrent = document.getElementById('pd-bc-current');
        if (bcCategory) {
            bcCategory.textContent = product.category;
            bcCategory.href = `shop.html?category=${encodeURIComponent(product.category)}`;
        }
        if (bcCurrent) {
            bcCurrent.textContent = product.name;
        }

        // 2. Populate Main Image & Gallery Thumbnails
        const mainImg = document.getElementById('pd-main-img');
        const thumbsContainer = document.getElementById('pd-gallery-thumbs');
        const galleryList = (product.gallery && product.gallery.length > 0)
            ? product.gallery
            : [product.image];

        function setMainImage(src, altText) {
            if (!mainImg) return;
            if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.to(mainImg, {
                    opacity: 0.3,
                    scale: 0.98,
                    duration: 0.15,
                    ease: 'power1.in',
                    onComplete: () => {
                        mainImg.src = src;
                        mainImg.alt = altText || product.name;
                        gsap.to(mainImg, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' });
                    }
                });
            } else {
                mainImg.src = src;
                mainImg.alt = altText || product.name;
            }
        }

        if (mainImg) {
            mainImg.src = product.image;
            mainImg.alt = product.name;
        }

        if (thumbsContainer) {
            if (galleryList.length > 1) {
                thumbsContainer.innerHTML = galleryList.map((imgSrc, idx) => `
                    <button type="button" class="pd-thumb-btn ${idx === 0 ? 'active' : ''}" data-img="${imgSrc}" aria-label="View angle ${idx + 1}">
                        <img src="${imgSrc}" alt="${product.name} view ${idx + 1}" loading="lazy">
                    </button>
                `).join('');

                thumbsContainer.querySelectorAll('.pd-thumb-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        thumbsContainer.querySelectorAll('.pd-thumb-btn').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        const imgSrc = this.getAttribute('data-img');
                        if (imgSrc) setMainImage(imgSrc, product.name);
                    });
                });
            } else {
                thumbsContainer.innerHTML = '';
            }
        }

        // 3. Populate Eyebrow, Title, Stock, Rating, Description & Price
        const eyebrowEl = document.getElementById('pd-eyebrow');
        const titleEl = document.getElementById('pd-title');
        const titleTextEl = document.getElementById('pd-title-text');
        const stockTextEl = document.getElementById('pd-stock-text');
        const starsEl = document.getElementById('pd-stars');
        const ratingNumEl = document.getElementById('pd-rating-num');
        const reviewCountEl = document.getElementById('pd-review-count');
        const descEl = document.getElementById('pd-description');
        const priceEl = document.getElementById('pd-price');
        const oldPriceEl = document.getElementById('pd-old-price');
        const savePillEl = document.getElementById('pd-save-pill');

        if (eyebrowEl) {
            eyebrowEl.textContent = product.eyebrow || `${product.category.toUpperCase()} / ${product.badge ? product.badge.toUpperCase() : 'COLLECTION'}`;
        }
        if (titleTextEl) {
            titleTextEl.textContent = product.name;
        } else if (titleEl) {
            titleEl.textContent = product.name;
        }
        if (stockTextEl) stockTextEl.textContent = product.stockText || 'Available to order';
        if (starsEl) starsEl.innerHTML = buildStarsHtml(product.rating);
        if (ratingNumEl) ratingNumEl.textContent = product.rating || '4.8';
        if (reviewCountEl) reviewCountEl.textContent = `(${product.reviews || 96} reviews)`;
        if (descEl) descEl.textContent = product.description;
        if (priceEl) priceEl.textContent = product.price;

        const currentVal = parsePriceNumber(product.price);
        const oldVal = parsePriceNumber(product.oldPrice);
        if (oldPriceEl) {
            if (oldVal > currentVal) {
                oldPriceEl.textContent = product.oldPrice;
                oldPriceEl.style.display = 'inline';
            } else {
                oldPriceEl.style.display = 'none';
            }
        }
        if (savePillEl) {
            if (oldVal > currentVal) {
                const diff = Math.round(oldVal - currentVal);
                savePillEl.textContent = `Save $${diff}`;
                savePillEl.style.display = 'inline-flex';
            } else {
                savePillEl.style.display = 'none';
            }
        }

        // 4. Populate Finish Swatches
        const finishNameEl = document.getElementById('pd-finish-name');
        const swatchesEl = document.getElementById('pd-swatches');
        const finishes = (product.finishes && product.finishes.length > 0)
            ? product.finishes
            : [{ name: 'Graphite', hex: '#2D3036', image: product.image }];

        if (finishNameEl) finishNameEl.textContent = selectedFinish;
        if (swatchesEl) {
            swatchesEl.innerHTML = finishes.map((f, idx) => `
                <button type="button"
                    class="pd-swatch-btn ${idx === 0 ? 'active' : ''}"
                    style="--swatch-color: ${f.hex};"
                    data-finish="${f.name}"
                    data-img="${f.image || product.image}"
                    title="${f.name}"
                    aria-label="Select finish ${f.name}"
                    aria-checked="${idx === 0 ? 'true' : 'false'}"
                    role="radio">
                </button>
            `).join('');

            swatchesEl.querySelectorAll('.pd-swatch-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    swatchesEl.querySelectorAll('.pd-swatch-btn').forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-checked', 'false');
                    });
                    this.classList.add('active');
                    this.setAttribute('aria-checked', 'true');
                    selectedFinish = this.getAttribute('data-finish') || 'Graphite';
                    if (finishNameEl) finishNameEl.textContent = selectedFinish;

                    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        gsap.fromTo(this, { scale: 0.9 }, { scale: 1, duration: 0.26, ease: 'back.out(2.5)', clearProps: 'transform' });
                    }

                    const swatchImg = this.getAttribute('data-img');
                    if (swatchImg) {
                        setMainImage(swatchImg, `${product.name} — ${selectedFinish}`);
                        if (thumbsContainer) {
                            thumbsContainer.querySelectorAll('.pd-thumb-btn').forEach(tb => {
                                tb.classList.toggle('active', tb.getAttribute('data-img') === swatchImg);
                            });
                        }
                    }
                });
            });
        }

        // 5. Quantity Selector
        const qtyInput = document.getElementById('pd-qty-input');
        const qtyMinus = document.getElementById('pd-qty-minus');
        const qtyPlus = document.getElementById('pd-qty-plus');

        if (qtyMinus && qtyInput) {
            qtyMinus.addEventListener('click', function () {
                currentQty = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
                qtyInput.value = currentQty;
                if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.fromTo(qtyMinus, { scale: 0.9 }, { scale: 1, duration: 0.16, ease: 'power2.out', clearProps: 'transform' });
                    gsap.fromTo(qtyInput, { scale: 0.96 }, { scale: 1, duration: 0.18, ease: 'power2.out', clearProps: 'transform' });
                }
            });
        }
        if (qtyPlus && qtyInput) {
            qtyPlus.addEventListener('click', function () {
                currentQty = Math.min(10, (parseInt(qtyInput.value, 10) || 1) + 1);
                qtyInput.value = currentQty;
                if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.fromTo(qtyPlus, { scale: 0.9 }, { scale: 1, duration: 0.16, ease: 'power2.out', clearProps: 'transform' });
                    gsap.fromTo(qtyInput, { scale: 1.05 }, { scale: 1, duration: 0.18, ease: 'power2.out', clearProps: 'transform' });
                }
            });
        }

        // 6. Populate Technical Specifications (5-Row Screenshot Layout)
        const specsListEl = document.getElementById('pd-specs-list');
        if (specsListEl && Array.isArray(product.specs)) {
            specsListEl.innerHTML = product.specs.map(spec => `
                <div class="pd-spec-row">
                    <span class="pd-spec-label">${spec.label}</span>
                    <strong class="pd-spec-val">${spec.value}</strong>
                </div>
            `).join('');
        }

        // Helper to build current product payload for Cart & Wishlist
        function getCurrentProductPayload() {
            return {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                oldPrice: product.oldPrice || '',
                image: (mainImg && mainImg.getAttribute('src')) ? mainImg.getAttribute('src') : product.image,
                color: selectedFinish,
                inStock: product.inStock !== false
            };
        }

        // 7. Wire "Add to bag" Button
        const addBagBtn = document.getElementById('pd-add-bag-btn');
        if (addBagBtn) {
            addBagBtn.addEventListener('click', function () {
                const payload = getCurrentProductPayload();
                const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

                if (window.StacklyCart && typeof window.StacklyCart.addItem === 'function') {
                    window.StacklyCart.addItem(payload, qty);
                }

                if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    gsap.fromTo(addBagBtn, { scale: 0.97 }, { scale: 1, duration: 0.22, ease: 'back.out(2)', clearProps: 'transform' });
                }

                // Subtle button confirmation feedback
                const labelSpan = addBagBtn.querySelector('span');
                const originalText = labelSpan ? labelSpan.textContent : 'Add to bag';
                if (labelSpan) labelSpan.textContent = 'Added to bag';
                addBagBtn.classList.add('is-added');
                setTimeout(() => {
                    if (labelSpan) labelSpan.textContent = originalText;
                    addBagBtn.classList.remove('is-added');
                }, 1400);
            });
        }

        // 8. Wire "Buy Now — Instant Checkout" Button (Flow C: Product Details -> Buy Now -> Checkout)
        const buyNowBtn = document.getElementById('pd-buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function () {
                const payload = getCurrentProductPayload();
                const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

                if (window.StacklyCart && typeof window.StacklyCart.addItem === 'function') {
                    window.StacklyCart.addItem(payload, qty);
                }
                window.location.href = 'checkout.html';
            });
        }

        // 9. Wire Square Wishlist Heart Button & Sync State
        const pdWishlistBtn = document.getElementById('pd-wishlist-btn');
        function syncPdWishlistButton() {
            if (!pdWishlistBtn || !window.StacklyWishlist) return;
            const isSaved = window.StacklyWishlist.has(product.id) || window.StacklyWishlist.has(product.name);
            const icon = pdWishlistBtn.querySelector('i');
            if (isSaved) {
                pdWishlistBtn.classList.add('active');
                pdWishlistBtn.setAttribute('aria-pressed', 'true');
                pdWishlistBtn.setAttribute('title', 'Remove from Wishlist');
                if (icon) icon.className = 'fa-solid fa-heart';
            } else {
                pdWishlistBtn.classList.remove('active');
                pdWishlistBtn.setAttribute('aria-pressed', 'false');
                pdWishlistBtn.setAttribute('title', 'Add to Wishlist');
                if (icon) icon.className = 'fa-regular fa-heart';
            }
        }

        if (pdWishlistBtn) {
            syncPdWishlistButton();
            pdWishlistBtn.addEventListener('click', function (e) {
                e.preventDefault();
                if (window.StacklyWishlist && typeof window.StacklyWishlist.toggle === 'function') {
                    window.StacklyWishlist.toggle(getCurrentProductPayload());
                    syncPdWishlistButton();
                    const icon = pdWishlistBtn.querySelector('i');
                    if (icon && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        gsap.fromTo(icon, { scale: 1.35 }, { scale: 1, duration: 0.32, ease: 'back.out(3)', clearProps: 'transform' });
                    }
                }
            });
            window.addEventListener('stackly:wishlist-updated', syncPdWishlistButton);
        }

        // 10. Render "A little more to love." Related Products Grid (4 Cards — Exact Screenshot 2 Match)
        const relatedGrid = document.getElementById('pd-related-grid');
        if (relatedGrid) {
            // Use the exact 4 cards from Screenshot 2, substituting 'sonix-pro-wireless' if viewing one of the 4
            const relatedSlugs = DEFAULT_RELATED_SLUGS.map(slug =>
                slug === product.id ? 'sonix-pro-wireless' : slug
            );

            relatedGrid.innerHTML = relatedSlugs.map((slug, idx) => {
                const item = PRODUCTS_DB[slug] || PRODUCTS_DB['view-27-qhd-monitor'];
                const isWished = window.StacklyWishlist && (window.StacklyWishlist.has(item.id) || window.StacklyWishlist.has(item.name));

                return `
                    <article class="product-card shop-product-card shelf-card" data-category="${item.category}" data-product-id="${item.id}" data-aos="fade-up" data-aos-delay="${(idx + 1) * 60}">
                        <div class="shop-card-media">
                            <span class="shop-pill-badge">${item.badge || 'Featured'}</span>
                            <div class="card-actions">
                                <button type="button" class="wishlist-btn ${isWished ? 'active' : ''}" title="${isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}" aria-label="Add ${item.name} to Wishlist">
                                    <i class="${isWished ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                                </button>
                                <button type="button" class="quick-view-btn" title="Quick View" aria-label="Quick view ${item.name}">
                                    <i class="fa-regular fa-eye"></i>
                                </button>
                            </div>
                            <a href="product.html?id=${item.id}" class="img-container pd-card-link" aria-label="View ${item.name} details">
                                <img src="${item.image}" alt="${item.name}" loading="lazy">
                            </a>
                        </div>
                        <div class="card-info shop-card-body">
                            <div class="shop-card-text">
                                <p class="category-label">${item.category}</p>
                                <h3 class="product-title"><a href="product.html?id=${item.id}" class="pd-title-link">${item.name}</a></h3>
                                <div class="rating" style="display:none;"><span>(${item.rating})</span></div>
                                <div class="shop-price-row">
                                    <p class="price">${item.price}</p>
                                    <span class="old-price">${item.oldPrice}</span>
                                </div>
                            </div>
                            <button type="button" class="btn-add-cart shop-bag-btn" title="Add ${item.name} to Cart" aria-label="Add ${item.name} to Cart">
                                <i class="fa-solid fa-bag-shopping"></i>
                            </button>
                        </div>
                    </article>
                `;
            }).join('');
        }

        // 11. Initialize AOS & GSAP Entrance Animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 700,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                once: true,
                offset: 40
            });
        }

        if (!prefersReducedMotion && typeof gsap !== 'undefined') {
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }

            // 1. Reveal primary product image with a controlled mask effect
            const mainImgBox = document.getElementById('pd-main-image-box');
            if (mainImgBox) {
                const img = mainImgBox.querySelector('img');
                if (img) {
                    gsap.fromTo(img,
                        { clipPath: 'inset(8% 0% 8% 0%)', scale: 1.06, opacity: 0.25 },
                        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1.0, opacity: 1, duration: 0.85, ease: 'power2.out' }
                    );
                }
            }

            // 2. Reveal breadcrumb, product title, and price strictly in sequence
            const pdTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.08 });
            pdTl
                .fromTo('.pd-breadcrumb', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
                .fromTo('#pd-title .spotlight-reveal-text, #pd-title .text-mask-child',
                    {
                        clipPath: 'circle(0% at 50% 50%)',
                        opacity: 0.1,
                        scale: 0.95,
                        filter: 'brightness(1.5) blur(4px)'
                    },
                    {
                        clipPath: 'circle(150% at 50% 50%)',
                        opacity: 1,
                        scale: 1,
                        filter: 'brightness(1) blur(0px)',
                        duration: 0.95,
                        ease: 'power3.out',
                        clearProps: 'clipPath,filter,transform,opacity'
                    },
                    '-=0.1'
                )
                .fromTo('.pd-status-row', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.2')
                .fromTo('#pd-description', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.15')
                .fromTo('.pd-price-block', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '+=0.05') // Strictly in sequence after title & description!
                .fromTo('.pd-options-row', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.15')
                .fromTo('.pd-cta-row', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.15')
                .fromTo('.pd-secondary-actions', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
                .fromTo('.pd-trust-strip', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15');

            // 3. Reveal related product cards with a short stagger
            const relatedCards = document.querySelectorAll('#pd-related-grid .shop-product-card');
            if (relatedCards.length) {
                gsap.fromTo(relatedCards,
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        stagger: 0.08,
                        ease: 'power2.out',
                        clearProps: 'transform',
                        scrollTrigger: {
                            trigger: '#pd-related-grid',
                            start: 'top 85%',
                            once: true
                        }
                    }
                );
            }
        }
    });

    // Expose catalog lookup globally for any script that needs it
    window.StacklyProductsDB = PRODUCTS_DB;
    window.resolveStacklyProductSlug = function (nameOrId) {
        const raw = slugify(nameOrId);
        return SLUG_ALIASES[raw] || raw;
    };

})(window, document);
