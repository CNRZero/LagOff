// ============================================
// LagOff - Gaming Performance Optimizer
// Enhanced JavaScript with Animations
// ============================================

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

// ============================================
// Navigation
// ============================================

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Animated Counter
// ============================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        // Add appropriate suffix
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

// Stats animation observer
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

// Observe all stat items
document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// Fade-in Animation Observer
// ============================================

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger the animations
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            fadeInObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    fadeInObserver.observe(element);
});

// ============================================
// Metric Bar Animation
// ============================================

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
// Parallax Effect
// ============================================

let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Update orbs
    document.querySelectorAll('.orb').forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// Feature Card Hover Effects
// ============================================

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            animation: rippleExpand 0.6s ease-out forwards;
        `;
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleExpand {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Testimonial Cards Tilt Effect
// ============================================

document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============================================
// Typing Effect for Hero (Optional)
// ============================================

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// Dashboard Live Update Simulation
// ============================================

function simulateLiveMetrics() {
    const metricCards = document.querySelectorAll('.dashboard-preview .metric-card');
    
    if (metricCards.length === 0) return;
    
    // Simulate subtle value changes for visual interest
    const cpuCard = metricCards[0];
    const gpuCard = metricCards[1];
    const ramCard = metricCards[2];
    const fpsCard = metricCards[3];
    
    function updateMetric(card, baseValue, variance, unit = '%') {
        const valueElement = card.querySelector('.metric-value');
        const fillElement = card.querySelector('.metric-fill');
        
        if (!valueElement || !fillElement) return;
        
        const change = (Math.random() - 0.5) * variance;
        let newValue = baseValue + change;
        newValue = Math.max(10, Math.min(95, newValue));
        
        if (unit === '') {
            valueElement.textContent = Math.floor(newValue);
        } else {
            valueElement.textContent = Math.floor(newValue) + unit;
        }
        
        if (unit === '%') {
            fillElement.style.width = newValue + '%';
        }
    }
    
    // Update every 3 seconds
    setInterval(() => {
        updateMetric(cpuCard, 45, 10);
        updateMetric(gpuCard, 78, 8);
        updateMetric(ramCard, 62, 6);
        // FPS stays stable for better UX perception
    }, 3000);
}

// Start live simulation after page load
setTimeout(simulateLiveMetrics, 2000);

// ============================================
// Smooth Reveal on Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
    
    // Trigger initial stat animation if visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
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
});

// ============================================
// Button Click Effects
// ============================================

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create click ripple
        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        
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

// Add button ripple animation
const btnStyle = document.createElement('style');
btnStyle.textContent = `
    @keyframes btnRipple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(btnStyle);

// ============================================
// Console Branding
// ============================================

console.log(
    '%c LagOff ',
    'background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;'
);
console.log(
    '%c Optimize your gaming performance! ',
    'color: #94a3b8; font-size: 14px; padding: 5px 0;'
);

// ============================================
// Performance: Debounce Utility
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Smooth Scroll Progress Indicator (Optional)
// ============================================

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    // You can use this progress value to update a progress bar if needed
    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
}

window.addEventListener('scroll', debounce(updateScrollProgress, 10));

// ============================================
// Preload Critical Images (if any)
// ============================================

function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ============================================
// Easter Egg: Konami Code
// ============================================

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            // Trigger easter egg
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
