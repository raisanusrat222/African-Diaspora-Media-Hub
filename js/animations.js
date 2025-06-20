// animations.js

function setupAnimations() {
    // Scroll animations
    setupScrollAnimations();
    
    // Particle animation
    createParticleEffect();
    
    // Loading animations
    setupLoadingAnimations();
    
    // Hover effects
    setupHoverEffects();
    
    // Page transition animations
    setupPageTransitions();
}

function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Add stagger effect for multiple elements
                const siblings = Array.from(entry.target.parentElement.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
}

function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const displayValue = Math.floor(current);
        const suffix = target >= 1000 ? '+' : '';
        element.textContent = displayValue + suffix;
    }, stepTime);
}

function createParticleEffect() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;

    // Create floating particles
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const opacity = Math.random() * 0.5 + 0.2;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * duration;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255,255,255,${opacity});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${duration}s infinite linear;
            animation-delay: -${delay}s;
            pointer-events: none;
        `;
        heroParticles.appendChild(particle);
    }

    // Add CSS for particle animation if not already present
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes floatParticle {
                0% { 
                    transform: translateY(100vh) rotate(0deg); 
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% { 
                    transform: translateY(-100px) rotate(360deg); 
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function setupLoadingAnimations() {
    // Shimmer effect for loading states
    const shimmerElements = document.querySelectorAll('.shimmer');
    
    shimmerElements.forEach(el => {
        if (!el.querySelector('.shimmer-wave')) {
            const wave = document.createElement('div');
            wave.className = 'shimmer-wave';
            wave.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                animation: shimmerWave 1.5s infinite;
            `;
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.appendChild(wave);
        }
    });

    // Add shimmer wave animation
    if (!document.getElementById('shimmer-styles')) {
        const style = document.createElement('style');
        style.id = 'shimmer-styles';
        style.textContent = `
            @keyframes shimmerWave {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    }
}

function setupHoverEffects() {
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.featured-card, .podcast-card, .news-article');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function setupPageTransitions() {
    // Page entrance animations
    const pageElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    
    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                pageObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    pageElements.forEach(el => pageObserver.observe(el));
}

// Text animation functions
function typeWriter(element, text, speed = 100) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function animateTextReveal(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.textContent = '';
    
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `all 0.6s ease ${index * 0.1}s`;
        element.appendChild(span);
        
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Parallax scroll effects
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Loading spinner animation
function createLoadingSpinner(container) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
        <div class="spinner-ring"></div>
        <div class="spinner-text">Loading...</div>
    `;
    
    spinner.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
    `;
    
    const styles = `
        .spinner-ring {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(212, 175, 55, 0.3);
            border-left: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        
        .spinner-text {
            font-size: 14px;
            color: var(--text-color);
            opacity: 0.7;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    if (!document.getElementById('spinner-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'spinner-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    container.appendChild(spinner);
    return spinner;
}

// Progress bar animation
function animateProgressBar(element, targetPercentage, duration = 1000) {
    let start = null;
    const startPercentage = 0;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const currentPercentage = startPercentage + (targetPercentage - startPercentage) * progress;
        
        element.style.width = currentPercentage + '%';
        element.textContent = Math.round(currentPercentage) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Stagger animation for lists
function staggerAnimation(elements, delay = 100) {
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * delay}ms`;
        el.classList.add('animate-fade-in');
    });
}

// Cleanup function for animations
function cleanupAnimations() {
    // Remove particle effects
    document.querySelectorAll('.particle').forEach(p => p.remove());
    
    // Clear animation timeouts
    const animationTimeouts = window.animationTimeouts || [];
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    window.animationTimeouts = [];
}

// Performance monitoring for animations
function monitorAnimationPerformance() {
    if (performance.mark) {
        performance.mark('animations-start');
        
        setTimeout(() => {
            performance.mark('animations-end');
            performance.measure('animations', 'animations-start', 'animations-end');
            
            const measures = performance.getEntriesByName('animations');
            if (measures.length > 0) {
                console.log(`Animation setup took ${measures[0].duration}ms`);
            }
        }, 100);
    }
}

// Export animation functions
window.AnimationUtils = {
    typeWriter,
    animateTextReveal,
    createLoadingSpinner,
    animateProgressBar,
    staggerAnimation,
    setupParallaxEffects,
    cleanupAnimations,
    monitorAnimationPerformance
};

// Initialize performance monitoring
monitorAnimationPerformance();
