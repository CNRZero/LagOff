// ============================================
// LagOff - Gaming Performance Optimizer
// Enhanced JavaScript - v2.0
// ============================================

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar');
    const preloader = document.getElementById('preloader');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    const waitlistForm = document.getElementById('waitlistForm');
    const ctaForm = document.getElementById('ctaForm');
    const signupSuccess = document.getElementById('signupSuccess');
    const ctaSuccess = document.getElementById('ctaSuccess');
    const faqItems = document.querySelectorAll('.faq-item');

    // ============================================
    // Preloader
    // ============================================
    
    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }

    // Hide preloader when page loads
    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 500);
    });

    // Fallback: hide preloader after 3 seconds max
    setTimeout(hidePreloader, 3000);

    // ============================================
    // Navigation
    // ============================================

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close mobile menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll Events (Optimized)
    // ============================================

    let ticking = false;
    let lastScrollY = 0;

    function updateOnScroll() {
        const scrollY = window.pageYOffset;
        
        // Navbar styling
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Scroll progress bar
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollY / docHeight) * 100;
            scrollProgress.style.width = `${Math.min(progress, 100)}%`;
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Parallax effect for hero
        if (scrollY < window.innerHeight) {
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
            }
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }, { passive: true });

    // Back to top click handler
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Animated Counter
    // ============================================

    function animateCounter(element, target, duration = 2000) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-quart)
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * target);
            
            // Determine suffix
            let suffix = '+';
            if (target === 50 || target === 30) {
                suffix = '%';
            }
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================

    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const statValue = entry.target.querySelector('.stat-value');
                if (statValue) {
                    const target = parseInt(statValue.getAttribute('data-target'));
                    entry.target.classList.add('animated');
                    animateCounter(statValue, target);
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Fade-in animation observer
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add stagger delay based on data attribute or index
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add stagger delays to fade-in elements
    document.querySelectorAll('.fade-in').forEach((element, index) => {
        element.dataset.delay = (index % 6) * 100; // Reset every 6 items
        fadeInObserver.observe(element);
    });

    // Metric bar animation
    const metricObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const fills = entry.target.querySelectorAll('.metric-fill');
                fills.forEach((fill, index) => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 200 + (index * 150));
                });
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.dashboard-preview').forEach(dashboard => {
        metricObserver.observe(dashboard);
    });

    // ============================================
    // FAQ Accordion
    // ============================================

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isActive);
            });
        }
    });

    // ============================================
    // Form Handling
    // ============================================

    function handleFormSubmit(form, successElement) {
        if (!form || !successElement) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput?.value;
            
            if (email && isValidEmail(email)) {
                // Simulate submission (replace with actual API call)
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span>Submitting...</span>';
                }

                // Simulate API delay
                setTimeout(() => {
                    form.style.display = 'none';
                    successElement.hidden = false;
                    
                    // Store in localStorage to remember signup
                    localStorage.setItem('lagoff_waitlist', email);
                }, 800);
            }
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Initialize form handlers
    handleFormSubmit(waitlistForm, signupSuccess);
    handleFormSubmit(ctaForm, ctaSuccess);

    // Check if already signed up
    const savedEmail = localStorage.getItem('lagoff_waitlist');
    if (savedEmail) {
        if (waitlistForm && signupSuccess) {
            waitlistForm.style.display = 'none';
            signupSuccess.hidden = false;
        }
        if (ctaForm && ctaSuccess) {
            ctaForm.style.display = 'none';
            ctaSuccess.hidden = false;
        }
    }

    // ============================================
    // Feature Card Hover Effects
    // ============================================

    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'hover-ripple';
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%) scale(0);
                animation: rippleExpand 0.6s ease-out forwards;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ============================================
    // Testimonial Cards Tilt Effect
    // ============================================

    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ============================================
    // Dashboard Live Metrics Simulation
    // ============================================

    function simulateLiveMetrics() {
        const metricCards = document.querySelectorAll('.dashboard-preview .metric-card');
        if (metricCards.length < 4) return;

        const metrics = [
            { card: metricCards[0], base: 45, variance: 10, unit: '%' },
            { card: metricCards[1], base: 78, variance: 8, unit: '%' },
            { card: metricCards[2], base: 62, variance: 6, unit: '%' }
        ];

        function updateMetric({ card, base, variance, unit }) {
            const valueElement = card.querySelector('.metric-value');
            const fillElement = card.querySelector('.metric-fill');
            
            if (!valueElement || !fillElement) return;
            
            const change = (Math.random() - 0.5) * variance;
            let newValue = base + change;
            newValue = Math.max(10, Math.min(95, newValue));
            
            valueElement.textContent = Math.floor(newValue) + unit;
            fillElement.style.width = newValue + '%';
        }

        // Update metrics every 3 seconds
        setInterval(() => {
            metrics.forEach(updateMetric);
        }, 3000);
    }

    // Start simulation after a delay
    setTimeout(simulateLiveMetrics, 2500);

    // ============================================
    // Button Click Ripple Effect
    // ============================================

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: btnRipple 0.6s ease-out;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ============================================
    // Dynamic Styles
    // ============================================

    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        @keyframes rippleExpand {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
        
        @keyframes btnRipple {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
        
        .hover-ripple {
            z-index: 0;
        }
    `;
    document.head.appendChild(dynamicStyles);

    // ============================================
    // Console Branding
    // ============================================

    console.log(
        '%c LagOff ',
        'background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;'
    );
    console.log(
        '%c Currently in Development - Join our waitlist! ',
        'color: #10b981; font-size: 14px; padding: 5px 0;'
    );

    // ============================================
    // Easter Egg: Konami Code
    // ============================================

    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.style.animation = 'rainbow 2s ease-in-out';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 2000);
                konamiIndex = 0;
                console.log('%c You found the easter egg! ', 'background: #10b981; color: white; font-size: 16px; padding: 5px 10px; border-radius: 4px;');
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Rainbow animation style
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(180deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    // ============================================
    // Initialize on DOM Ready
    // ============================================

    // Trigger stats animation if already visible on load
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            document.querySelectorAll('.stat-item').forEach(stat => {
                if (!stat.classList.contains('animated')) {
                    const statValue = stat.querySelector('.stat-value');
                    if (statValue) {
                        const target = parseInt(statValue.getAttribute('data-target'));
                        stat.classList.add('animated');
                        setTimeout(() => animateCounter(statValue, target), 500);
                    }
                }
            });
        }
    }

    // Mark body as loaded
    document.body.classList.add('loaded');

})();
