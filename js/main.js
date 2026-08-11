// Master Cobbler Shop - Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const rtlBtn = document.getElementById('rtl-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    const scrollTopBtn = document.getElementById('scroll-to-top');
    const header = document.querySelector('header');
    
    // Quote Cart / Drawer Elements
    const cartToggle = document.getElementById('cart-toggle');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartClose = document.getElementById('cart-close');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartToast = document.getElementById('cart-toast');

    let cart = JSON.parse(localStorage.getItem('cobbler_quote_cart')) || [];
    updateCart();

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(savedTheme);
    body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);

    // Initialize RTL
    const savedRTL = localStorage.getItem('rtl') === 'true';
    document.documentElement.setAttribute('dir', savedRTL ? 'rtl' : 'ltr');
    updateRTLText(savedRTL);

    // Theme Toggle Handler
    const themeBtns = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
    themeBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.classList.remove(currentTheme);
                document.documentElement.classList.add(targetTheme);
                body.classList.remove(currentTheme);
                body.classList.add(targetTheme);
                
                localStorage.setItem('theme', targetTheme);
                themeBtns.forEach(b => updateThemeIcon(b, targetTheme));
            });
        }
    });

    // RTL Toggle Handler
    const rtlBtns = [document.getElementById('rtl-toggle'), document.getElementById('rtl-toggle-mobile')];
    rtlBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                const currentDir = document.documentElement.getAttribute('dir');
                const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
                document.documentElement.setAttribute('dir', newDir);
                localStorage.setItem('rtl', newDir === 'rtl');
                rtlBtns.forEach(b => updateRTLText(b, newDir === 'rtl'));
            });
        }
    });

    // Mobile Menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('open');
        });
    }

    if (mobileMenuCloseBtn && mobileMenu) {
        mobileMenuCloseBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    }

    // Auto-close mobile menu on link click
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('open');
        });
    });

    // Sticky Header & Scroll to Top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            if (header) header.classList.add('sticky');
            if (scrollTopBtn) scrollTopBtn.classList.add('show');
        } else {
            if (header) header.classList.remove('sticky');
            if (scrollTopBtn) scrollTopBtn.classList.remove('show');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Quote Cart Event Listeners
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            if (cartDrawer) cartDrawer.classList.add('open');
        });
    }
    const cartToggleMobile = document.getElementById('cart-toggle-mobile');
    if (cartToggleMobile) {
        cartToggleMobile.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('open');
            if (cartDrawer) cartDrawer.classList.add('open');
        });
    }
    if (cartClose) {
        cartClose.addEventListener('click', () => {
            if (cartDrawer) cartDrawer.classList.remove('open');
        });
    }

    // Add Service to Quote Cart
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart');
        if (addBtn) {
            const id = addBtn.dataset.id;
            const name = addBtn.dataset.name;
            const price = parseFloat(addBtn.dataset.price);
            const image = addBtn.dataset.image || 'images/service_sole.png';

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, image, quantity: 1 });
            }

            localStorage.setItem('cobbler_quote_cart', JSON.stringify(cart));
            updateCart();
            showToast(`${name} added to repair request`);
            
            if (cartDrawer) {
                cartDrawer.classList.add('open');
                setTimeout(() => cartDrawer.classList.remove('open'), 2500);
            }
        }

        // Remove Service
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const btn = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const id = btn.dataset.id;
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cobbler_quote_cart', JSON.stringify(cart));
            updateCart();
        }
    });

    function updateCart() {
        if (!cartItemsList) return;
        
        cartItemsList.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;
            
            cartItemsList.innerHTML += `
                <div class="flex items-center justify-between mb-4 group border-b border-stone-200 dark:border-stone-800 pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded overflow-hidden flex-shrink-0">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h5 class="text-sm font-semibold text-stone-900 dark:text-stone-100">${item.name}</h5>
                            <p class="text-xs text-amber-700 dark:text-amber-400 font-medium">From $${item.price} <span class="text-[10px] text-stone-500 font-normal">(Qty: ${item.quantity})</span></p>
                        </div>
                    </div>
                    <button class="remove-item text-xs text-red-600 dark:text-red-400 hover:underline p-1" data-id="${item.id}">Remove</button>
                </div>
            `;
        });

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="text-sm text-stone-500 dark:text-stone-400 text-center py-8">Your repair request list is empty. Select services from our pricing guide.</p>';
        }

        const cartCounts = [document.getElementById('cart-count'), document.getElementById('cart-count-mobile')];
        cartCounts.forEach(el => {
            if (el) el.innerText = count;
        });
        if (cartTotal) cartTotal.innerText = `$${total.toLocaleString()}`;
    }

    function showToast(msg) {
        if (!cartToast) return;
        cartToast.innerText = msg;
        cartToast.classList.add('show');
        setTimeout(() => cartToast.classList.remove('show'), 3000);
    }

    // Interactive Before / After Slider
    const baSliders = document.querySelectorAll('.ba-container');
    baSliders.forEach(container => {
        const handle = container.querySelector('.ba-handle');
        const afterWrapper = container.querySelector('.ba-image-after-wrapper');
        let isDragging = false;

        if (!handle || !afterWrapper) return;

        const updatePosition = (x) => {
            const rect = container.getBoundingClientRect();
            let offsetX = x - rect.left;
            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;
            const percentage = (offsetX / rect.width) * 100;
            afterWrapper.style.width = `${percentage}%`;
            handle.style.left = `${percentage}%`;
        };

        const onStart = (e) => {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePosition(clientX);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePosition(clientX);
        };

        const onEnd = () => {
            isDragging = false;
        };

        container.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        container.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onEnd);
    });

    // Intersection Observer for Fade-in effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Form Handling with visual feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            if (valid) {
                const nameInput = form.querySelector('[name="name"], [type="text"]');
                const clientName = nameInput ? nameInput.value.trim() : 'Customer';
                showToast(`Thank you, ${clientName}! Drop-off request submitted successfully. We will text you shortly.`);
                form.reset();
            } else {
                showToast(`Please complete all required fields.`);
            }
        });
    });

    // Initial UI State Sync
    themeBtns.forEach(btn => updateThemeIcon(btn, savedTheme));
    rtlBtns.forEach(btn => updateRTLText(btn, savedRTL));

    function updateThemeIcon(btn, theme) {
        if (!btn) return;
        btn.innerHTML = theme === 'dark' 
            ? '<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>' 
            : '<svg class="w-5 h-5 text-stone-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>';
    }

    function updateRTLText(btn, isRTL) {
        if (!btn) return;
        btn.innerText = isRTL ? 'LTR' : 'RTL';
    }
});

