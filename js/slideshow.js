// slideshow.js

let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = 5;

// Initialize slideshow
function initializeSlideshow() {
    if (slides.length === 0) return;
    
    // Start automatic slideshow
    startSlideshow();
    
    // Pause on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', pauseSlideshow);
        slideshowContainer.addEventListener('mouseleave', startSlideshow);
    }
    
    // Touch support for mobile
    setupTouchNavigation();
}

// Start automatic slideshow
function startSlideshow() {
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

// Pause slideshow
function pauseSlideshow() {
    clearInterval(slideInterval);
}

// Go to specific slide
function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;
    
    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Track analytics
    trackSlideView(currentSlide);
}

// Next slide
function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
}

// Previous slide
function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
}

// Setup touch navigation for mobile
function setupTouchNavigation() {
    const slideshowWrapper = document.querySelector('.slideshow-wrapper');
    if (!slideshowWrapper) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    slideshowWrapper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    slideshowWrapper.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Only register horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                prevSlide(); // Swipe right - go to previous
            } else {
                nextSlide(); // Swipe left - go to next
            }
        }
    }, { passive: true });
}

// Track slide views for analytics
function trackSlideView(slideIndex) {
    const slideFeatures = ['maps', 'podcasts', 'films', 'timeline', 'culture'];
    const feature = slideFeatures[slideIndex];
    
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('slideshow_view', {
            slide: slideIndex,
            feature: feature,
            timestamp: new Date().toISOString()
        });
    }
}

// Add keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Only handle arrow keys when slideshow is visible
        const slideshowSection = document.querySelector('.feature-slideshow-section');
        if (!slideshowSection) return;
        
        const rect = slideshowSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    nextSlide();
                    break;
            }
        }
    });
}

// Add slide transition effects
function addSlideTransitions() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        slide.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                // Slide is now active - add entrance animation to content
                const overlay = this.querySelector('.slide-overlay');
                if (overlay) {
                    overlay.style.animation = 'slideIn 0.6s ease-out';
                    setTimeout(() => {
                        overlay.style.animation = '';
                    }, 600);
                }
            }
        });
    });
    
    // Add CSS for slide content animation
    if (!document.getElementById('slideshow-animations')) {
        const style = document.createElement('style');
        style.id = 'slideshow-animations';
        style.textContent = `
            @keyframes slideIn {
                0% {
                    opacity: 0;
                    transform: translateY(30px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Preload feature pages for faster navigation
function preloadFeaturePages() {
    const featurePages = ['maps', 'podcasts', 'films', 'historical-timeline', 'music-dance'];
    
    featurePages.forEach(page => {
        // Create invisible link to hint to browser to preload
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = `${page}.html`;
        document.head.appendChild(link);
    });
}

// Handle slide click to navigate to feature - FIXED VERSION
function setupSlideNavigation() {
    slides.forEach(slide => {
        slide.addEventListener('click', function(e) {
            // Don't navigate if clicking on button
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const feature = this.dataset.feature;
            const pageMap = {
                'maps': 'maps.html',
                'podcasts': 'podcasts.html',
                'films': 'films.html',
                'timeline': 'historical-timeline.html',
                'culture': 'music-dance.html'
            };
            
            // Always use direct navigation to be safe
            if (pageMap[feature]) {
                window.location.href = pageMap[feature];
            }
        });
    });
}

// Also fix the button clicks in slide overlays
function setupSlideButtonNavigation() {
    // Target buttons more specifically and override their onclick behavior
    const slideButtons = document.querySelectorAll('.slide .btn, .slide button');
    
    slideButtons.forEach(button => {
        // Remove any existing onclick handlers
        button.removeAttribute('onclick');
        
        // Add our own click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Determine which page to navigate to based on button text or parent slide
            const buttonText = this.textContent.toLowerCase();
            const parentSlide = this.closest('.slide');
            const feature = parentSlide ? parentSlide.dataset.feature : null;
            
            let targetPage = null;
            
            // Map based on button text first
            if (buttonText.includes('maps') || buttonText.includes('explore maps')) {
                targetPage = 'maps.html';
            } else if (buttonText.includes('podcast') || buttonText.includes('listen')) {
                targetPage = 'podcasts.html';
            } else if (buttonText.includes('film') || buttonText.includes('watch')) {
                targetPage = 'films.html';
            } else if (buttonText.includes('history') || buttonText.includes('timeline')) {
                targetPage = 'historical-timeline.html';
            } else if (buttonText.includes('arts') || buttonText.includes('culture') || buttonText.includes('music')) {
                targetPage = 'music-dance.html';
            } else if (feature) {
                // Fallback to feature mapping
                const pageMap = {
                    'maps': 'maps.html',
                    'podcasts': 'podcasts.html',
                    'films': 'films.html',
                    'timeline': 'historical-timeline.html',
                    'culture': 'music-dance.html'
                };
                targetPage = pageMap[feature];
            }
            
            if (targetPage) {
                console.log('Navigating to:', targetPage); // Debug log
                window.location.href = targetPage;
            } else {
                console.warn('Could not determine target page for button:', this);
            }
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        initializeSlideshow();
        setupKeyboardNavigation();
        addSlideTransitions();
        preloadFeaturePages();
        setupSlideNavigation();
        setupSlideButtonNavigation();
    }, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
});

// Export functions for global access
window.SlideshowUtils = {
    goToSlide,
    nextSlide,
    prevSlide,
    startSlideshow,
    pauseSlideshow
};