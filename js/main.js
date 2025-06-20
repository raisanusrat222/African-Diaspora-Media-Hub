// main.js - Updated for multi-page architecture

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupAnimations();
    setupCounters();
    setupScrollEffects();
    initializeSearch();
    
    // Page-specific initializations
    initializePageSpecificFeatures();
}

// Go to home page function - defined globally
function goToHomePage() {
    window.location.href = 'index.html';
}

function initializePageSpecificFeatures() {
    const currentPage = getCurrentPageName();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'historical-timeline':
            initializeTimelinePage();
            break;
        case 'maps':
            initializeMapsPage();
            break;
        case 'podcasts':
            initializePodcastsPage();
            break;
        case 'films':
            initializeFilmsPage();
            break;
        case 'news':
            initializeNewsPage();
            break;
    }
}

function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    return filename.replace('.html', '') || 'index';
}

function initializeHomePage() {
    // Initialize slideshow if on homepage
    if (typeof initializeSlideshow === 'function') {
        initializeSlideshow();
    }
    
    // Initialize country search if on homepage
    if (typeof initializeCountrySearch === 'function') {
        initializeCountrySearch();
    }
}

function initializeTimelinePage() {
    // Enhanced timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

function initializeMapsPage() {
    // Initialize interactive maps if on maps page
    if (typeof initializeInteractiveMaps === 'function') {
        initializeInteractiveMaps();
    }
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializePodcastsPage() {
    // Initialize podcast-specific features
    initializePodcastFilters();
    initializePodcastPlayer();
}

function initializeFilmsPage() {
    // Initialize film-specific features
    console.log('Films page initialized');
}

function initializeNewsPage() {
    // Initialize news-specific features
    console.log('News page initialized');
}

function initializePodcastFilters() {
    // Podcast filtering functionality
    const filterButtons = document.querySelectorAll('.category-filter');
    const podcastCards = document.querySelectorAll('.podcast-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.textContent.toLowerCase();
            const filterValue = getCategoryFilter(category);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            podcastCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function getCategoryFilter(category) {
    const categoryMap = {
        'all podcasts': 'all',
        'culture & arts': 'culture',
        'history': 'history',
        'personal stories': 'voices',
        'education': 'education'
    };
    return categoryMap[category] || 'all';
}

function initializePodcastPlayer() {
    // Enhanced podcast player functionality
    const playButtons = document.querySelectorAll('.play-btn');
    const progressBars = document.querySelectorAll('.progress-bar');
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            togglePlayPause(this);
        });
    });
    
    progressBars.forEach(bar => {
        bar.addEventListener('click', function(e) {
            seekToPosition(e, this);
        });
    });
}

function togglePlayPause(button) {
    const icon = button.querySelector('i');
    const progressBar = button.parentElement.querySelector('.progress');
    
    if (icon.classList.contains('fa-play')) {
        // Start playing
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        
        // Animate progress bar
        animateProgress(progressBar);
    } else {
        // Pause
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        
        // Stop progress animation
        stopProgress(progressBar);
    }
}

function animateProgress(progressBar) {
    let width = parseInt(progressBar.style.width) || 30;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            // Reset to play button
            const playBtn = progressBar.closest('.episode-controls').querySelector('.play-btn i');
            playBtn.classList.remove('fa-pause');
            playBtn.classList.add('fa-play');
            progressBar.style.width = '0%';
            return;
        }
        
        width += 0.5;
        progressBar.style.width = width + '%';
    }, 100);
    
    // Store interval for cleanup
    progressBar.dataset.interval = interval;
}

function stopProgress(progressBar) {
    const interval = progressBar.dataset.interval;
    if (interval) {
        clearInterval(interval);
        delete progressBar.dataset.interval;
    }
}

function seekToPosition(event, progressBar) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    const progress = progressBar.querySelector('.progress');
    progress.style.width = Math.max(0, Math.min(100, percentage)) + '%';
}

function setupScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section (only on homepage)
    if (getCurrentPageName() === 'index') {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', debounce(performMobileSearch, 300));
    }
}

function performSearch(event) {
    const query = event.target.value.toLowerCase();
    if (query.length < 2) return;
    
    // Enhanced search with page-aware results
    const searchableContent = getSearchableContent();
    const results = searchableContent.filter(item => 
        item.keywords.some(keyword => keyword.includes(query)) ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    displaySearchResults(results, 'search-results');
}

function performMobileSearch(event) {
    const query = event.target.value.toLowerCase();
    if (query.length < 2) return;
    
    const searchableContent = getSearchableContent();
    const results = searchableContent.filter(item => 
        item.keywords.some(keyword => keyword.includes(query)) ||
        item.title.toLowerCase().includes(query)
    );

    displaySearchResults(results, 'mobile-search-results');
}

function getSearchableContent() {
    return [
        { 
            title: 'Historical Timeline', 
            description: 'Journey through key moments in African diaspora history',
            url: 'historical-timeline.html', 
            keywords: ['history', 'timeline', 'africa', 'diaspora', 'chronology', 'events', 'ancient', 'slavery', 'civil rights'] 
        },
        { 
            title: 'Interactive Maps', 
            description: 'Explore migration patterns and cultural connections',
            url: 'maps.html', 
            keywords: ['maps', 'geography', 'migration', 'routes', 'location', 'travel', 'countries', 'kingdoms'] 
        },
        { 
            title: 'Podcasts', 
            description: 'Voices and stories from across the diaspora',
            url: 'podcasts.html', 
            keywords: ['podcast', 'audio', 'stories', 'voices', 'interviews', 'radio', 'listen', 'heritage'] 
        },
        { 
            title: 'News & Updates', 
            description: 'Latest developments in diaspora communities',
            url: 'news.html', 
            keywords: ['news', 'current', 'events', 'updates', 'latest', 'press', 'community'] 
        },
        { 
            title: 'Films & Documentaries', 
            description: 'Visual storytelling from diaspora filmmakers',
            url: 'films.html', 
            keywords: ['films', 'movies', 'documentaries', 'video', 'cinema', 'visual', 'watch'] 
        },
        { 
            title: 'Music & Dance', 
            description: 'Cultural expressions through music and movement',
            url: 'music-dance.html', 
            keywords: ['music', 'dance', 'rhythm', 'culture', 'performance', 'art', 'traditional'] 
        },
        { 
            title: 'Visual Arts', 
            description: 'Artistic expressions and cultural creativity',
            url: 'visual-arts.html', 
            keywords: ['art', 'visual', 'painting', 'sculpture', 'creativity', 'artist', 'gallery'] 
        },
        { 
            title: 'Literature', 
            description: 'Written works and literary traditions',
            url: 'literature.html', 
            keywords: ['literature', 'books', 'writing', 'poetry', 'stories', 'authors', 'novels'] 
        },
        { 
            title: 'Oral Histories', 
            description: 'Preserved stories and traditional narratives',
            url: 'oral-histories.html', 
            keywords: ['oral', 'history', 'stories', 'tradition', 'narrative', 'memory', 'elders'] 
        }
    ];
}

function displaySearchResults(results, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>No results found. Try different keywords.</p>
            </div>
        `;
    } else {
        container.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="navigateToPage('${result.url}')">
                <i class="fas fa-external-link-alt"></i>
                <div>
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-description">${result.description}</div>
                </div>
            </div>
        `).join('');
    }
    
    container.classList.add('show');
}

function navigateToPage(url) {
    window.location.href = url;
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Enhanced animation setup
function setupAnimations() {
    setupScrollAnimations();
    createParticleEffect();
    setupHoverEffects();
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
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
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
    // Only create particles on homepage
    if (getCurrentPageName() !== 'index') return;
    
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

function setupHoverEffects() {
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.featured-card, .podcast-card, .film-card, .timeline-content-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Local storage utilities
const StorageManager = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('LocalStorage not available');
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
};

// User preferences
const UserPreferences = {
    theme: StorageManager.get('theme') || 'light',
    language: StorageManager.get('language') || 'en',
    
    setTheme: function(theme) {
        this.theme = theme;
        StorageManager.set('theme', theme);
        document.body.setAttribute('data-theme', theme);
    },
    
    setLanguage: function(language) {
        this.language = language;
        StorageManager.set('language', language);
        // Implement language switching logic here
    }
};

// Initialize user preferences
document.body.setAttribute('data-theme', UserPreferences.theme);

// Analytics tracking (placeholder)
const Analytics = {
    track: function(event, data) {
        // Implement analytics tracking here
        console.log('Analytics event:', event, data);
    },
    
    pageView: function(page) {
        this.track('page_view', { page: page });
    }
};

// Track page view
Analytics.pageView(getCurrentPageName());

// Export functions for use in other modules
window.DiasporaHub = {
    StorageManager,
    UserPreferences,
    Analytics,
    debounce,
    throttle,
    getCurrentPageName,
    navigateToPage
};