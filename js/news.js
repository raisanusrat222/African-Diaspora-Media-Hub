// js/news.js - Core news page functionality

class NewsPageManager {
    constructor() {
        this.initialized = false;
        this.currentPage = 1;
        this.articlesPerPage = 12;
        this.totalArticles = 0;
        
        console.log('📰 NewsPageManager initialized');
    }
    
    // Initialize news page
    async initialize() {
        if (this.initialized) return;
        
        console.log('🚀 Initializing news page...');
        
        try {
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize search functionality
            this.initializeSearch();
            
            // Set up responsive behavior
            this.setupResponsive();
            
            // Initialize animations
            this.initializeAnimations();
            
            this.initialized = true;
            console.log('✅ News page initialization complete');
            
        } catch (error) {
            console.error('❌ News page initialization failed:', error);
        }
    }
    
    // Set up event listeners
    setupEventListeners() {
        console.log('🎛️ Setting up news page event listeners...');
        
        // Navigation breadcrumb
        this.setupBreadcrumb();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Scroll-based updates
        this.setupScrollHandlers();
        
        // Window resize handling
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.getElementById('search-input');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchInput.addEventListener('focus', this.handleSearchFocus.bind(this));
            searchInput.addEventListener('blur', this.handleSearchBlur.bind(this));
        }
        
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', this.debounce(this.handleMobileSearch.bind(this), 300));
        }
    }
    
    // Handle search input
    handleSearch(event) {
        const query = event.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            this.clearSearchResults();
            return;
        }
        
        console.log('🔍 Searching news for:', query);
        
        // Get searchable news content
        const searchResults = this.searchNewsContent(query);
        this.displaySearchResults(searchResults, 'search-results');
        
        // Track search
        if (window.DiasporaAI?.trackNewsInteraction) {
            window.DiasporaAI.trackNewsInteraction('news_search', { query: query });
        }
    }
    
    // Search news content
    searchNewsContent(query) {
        const newsCards = document.querySelectorAll('.news-card');
        const results = [];
        
        newsCards.forEach(card => {
            const headline = card.querySelector('.news-headline')?.textContent?.toLowerCase() || '';
            const excerpt = card.querySelector('.news-excerpt')?.textContent?.toLowerCase() || '';
            const source = card.querySelector('.news-source')?.textContent?.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.diaspora-tag')).map(tag => 
                tag.textContent.toLowerCase()
            ).join(' ');
            
            const searchableText = `${headline} ${excerpt} ${source} ${tags}`;
            
            if (searchableText.includes(query)) {
                results.push({
                    title: card.querySelector('.news-headline')?.textContent || 'News Article',
                    description: card.querySelector('.news-excerpt')?.textContent || '',
                    source: card.querySelector('.news-source')?.textContent || '',
                    element: card
                });
            }
        });
        
        return results;
    }
    
    // Display search results
    displaySearchResults(results, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No news articles found. Try different keywords.</p>
                </div>
            `;
        } else {
            container.innerHTML = results.slice(0, 8).map(result => `
                <div class="search-result-item news-search-result" onclick="newsPage.scrollToArticle(this)">
                    <i class="fas fa-newspaper"></i>
                    <div class="search-result-content">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-source">${result.source}</div>
                        <div class="search-result-description">${result.description.substring(0, 120)}...</div>
                    </div>
                </div>
            `).join('');
        }
        
        container.classList.add('show');
    }
    
    // Scroll to article
    scrollToArticle(searchResultElement) {
        const title = searchResultElement.querySelector('.search-result-title').textContent;
        
        // Find matching article card
        const newsCards = document.querySelectorAll('.news-card');
        let targetCard = null;
        
        newsCards.forEach(card => {
            const cardTitle = card.querySelector('.news-headline')?.textContent;
            if (cardTitle === title) {
                targetCard = card;
            }
        });
        
        if (targetCard) {
            // Clear search results
            this.clearSearchResults();
            
            // Scroll to article with smooth animation
            targetCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Highlight article temporarily
            targetCard.classList.add('search-highlight');
            setTimeout(() => {
                targetCard.classList.remove('search-highlight');
            }, 3000);
        }
    }
    
    // Clear search results
    clearSearchResults() {
        const containers = ['search-results', 'mobile-search-results'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.classList.remove('show');
                setTimeout(() => {
                    container.innerHTML = '';
                }, 300);
            }
        });
    }
    
    // Handle search focus
    handleSearchFocus(event) {
        event.target.parentElement.classList.add('search-focused');
    }
    
    // Handle search blur
    handleSearchBlur(event) {
        setTimeout(() => {
            event.target.parentElement.classList.remove('search-focused');
            this.clearSearchResults();
        }, 200);
    }
    
    // Setup breadcrumb navigation
    setupBreadcrumb() {
        // Add breadcrumb to news header
        const headerContent = document.querySelector('.news-header-content');
        if (headerContent && !headerContent.querySelector('.breadcrumb')) {
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'breadcrumb';
            breadcrumb.innerHTML = `
                <a href="index.html" class="breadcrumb-link">
                    <i class="fas fa-home"></i>
                    Home
                </a>
                <i class="fas fa-chevron-right"></i>
                <span class="breadcrumb-current">News</span>
            `;
            
            headerContent.insertBefore(breadcrumb, headerContent.firstChild);
        }
    }
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Only activate shortcuts when not in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (event.key) {
                case '/':
                    event.preventDefault();
                    this.focusSearch();
                    break;
                case 'r':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.refreshNews();
                    }
                    break;
                case 'f':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.focusFilters();
                    }
                    break;
            }
        });
    }
    
    // Focus search input
    focusSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Refresh news content
    refreshNews() {
        console.log('🔄 Refreshing news content...');
        
        if (window.newsAI) {
            window.newsAI.loadNewsArticles();
        } else {
            location.reload();
        }
    }
    
    // Focus filter controls
    focusFilters() {
        const firstFilter = document.querySelector('.filter-btn');
        if (firstFilter) {
            firstFilter.focus();
        }
    }
    
    // Setup scroll handlers
    setupScrollHandlers() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollPosition();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Infinite scroll detection
        window.addEventListener('scroll', this.throttle(() => {
            if (this.isNearBottom() && window.newsAI && !window.newsAI.loadingStates.articles) {
                this.triggerLoadMore();
            }
        }, 1000));
    }
    
    // Update scroll position for animations
    updateScrollPosition() {
        const scrollY = window.scrollY;
        
        // Parallax effect on header
        const header = document.querySelector('.news-header');
        if (header) {
            const parallaxSpeed = 0.5;
            header.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        }
        
        // Show/hide scroll to top button
        this.toggleScrollToTop(scrollY > 600);
        
        // Update navigation opacity
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    // Check if near bottom of page
    isNearBottom() {
        const threshold = 1000; // pixels from bottom
        return (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold);
    }
    
    // Trigger load more articles
    triggerLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn && !loadMoreBtn.disabled) {
            console.log('♾️ Auto-loading more articles...');
            if (window.newsAI) {
                window.newsAI.loadMoreArticles();
            }
        }
    }
    
    // Toggle scroll to top button
    toggleScrollToTop(show) {
        let scrollBtn = document.getElementById('scroll-to-top');
        
        if (show && !scrollBtn) {
            // Create scroll to top button
            scrollBtn = document.createElement('button');
            scrollBtn.id = 'scroll-to-top';
            scrollBtn.className = 'scroll-to-top-btn';
            scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            scrollBtn.title = 'Scroll to top';
            
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            document.body.appendChild(scrollBtn);
            
            // Add CSS if not present
            if (!document.getElementById('scroll-to-top-styles')) {
                const style = document.createElement('style');
                style.id = 'scroll-to-top-styles';
                style.textContent = `
                    .scroll-to-top-btn {
                        position: fixed;
                        bottom: 30px;
                        right: 30px;
                        width: 50px;
                        height: 50px;
                        background: var(--primary-color);
                        color: var(--dark-color);
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.2rem;
                        box-shadow: var(--shadow);
                        transition: all 0.3s ease;
                        z-index: 1000;
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    .scroll-to-top-btn.show {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    .scroll-to-top-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: var(--shadow-hover);
                        background: #ffd700;
                    }
                    @media (max-width: 768px) {
                        .scroll-to-top-btn {
                            bottom: 20px;
                            right: 20px;
                            width: 45px;
                            height: 45px;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        if (scrollBtn) {
            if (show) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        }
    }
    
    // Setup responsive behavior
    setupResponsive() {
        // Handle mobile menu
        this.setupMobileMenu();
        
        // Handle responsive grid
        this.setupResponsiveGrid();
        
        // Handle touch gestures
        this.setupTouchGestures();
    }
    
    // Setup mobile menu behavior
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('.nav-container') && navMenu.classList.contains('mobile-open')) {
                    navMenu.classList.remove('mobile-open');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        }
    }
    
    // Setup responsive grid behavior
    setupResponsiveGrid() {
        const updateGridLayout = () => {
            const newsGrid = document.getElementById('news-grid');
            if (!newsGrid) return;
            
            const viewportWidth = window.innerWidth;
            
            // Adjust grid columns based on viewport
            if (viewportWidth < 480) {
                newsGrid.style.gridTemplateColumns = '1fr';
            } else if (viewportWidth < 768) {
                newsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            } else if (viewportWidth < 1024) {
                newsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
            } else {
                newsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
            }
        };
        
        updateGridLayout();
        window.addEventListener('resize', this.debounce(updateGridLayout, 250));
    }
    
    // Setup touch gestures
    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (event) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next in carousel
                    this.handleSwipeLeft();
                } else {
                    // Swipe right - previous in carousel
                    this.handleSwipeRight();
                }
            }
            
            touchStartX = 0;
            touchStartY = 0;
        });
    }
    
    // Handle swipe gestures
    handleSwipeLeft() {
        const nextBtn = document.getElementById('frontpage-next');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
        }
    }
    
    handleSwipeRight() {
        const prevBtn = document.getElementById('frontpage-prev');
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.click();
        }
    }
    
    // Initialize animations
    initializeAnimations() {
        // Intersection Observer for scroll animations
        this.setupScrollAnimations();
        
        // Loading animations
        this.setupLoadingAnimations();
        
        // Hover effects
        this.setupHoverEffects();
    }
    
    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animations for grid items
                    if (entry.target.classList.contains('news-card')) {
                        const cards = Array.from(entry.target.parentElement.children);
                        const index = cards.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe news cards and sections
        const observeElements = () => {
            document.querySelectorAll('.news-card, .continental-tabs, .filter-buttons').forEach(el => {
                observer.observe(el);
            });
        };
        
        observeElements();
        
        // Re-observe new elements when they're added
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList.contains('news-card')) {
                            observer.observe(node);
                        }
                        // Also observe children
                        node.querySelectorAll?.('.news-card').forEach(card => {
                            observer.observe(card);
                        });
                    }
                });
            });
        });
        
        const newsGrid = document.getElementById('news-grid');
        if (newsGrid) {
            mutationObserver.observe(newsGrid, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Setup loading animations
    setupLoadingAnimations() {
        // Add CSS for loading animations if not present
        if (!document.getElementById('news-loading-animations')) {
            const style = document.createElement('style');
            style.id = 'news-loading-animations';
            style.textContent = `
                .animate-in {
                    animation: slideInUp 0.6s ease forwards;
                }
                
                .search-highlight {
                    animation: highlightPulse 3s ease;
                }
                
                .breaking-news-notification {
                    position: fixed;
                    top: 80px;
                    right: -400px;
                    width: 350px;
                    background: var(--light-color);
                    border-left: 4px solid #f44336;
                    box-shadow: var(--shadow-hover);
                    border-radius: 8px;
                    padding: 15px;
                    z-index: 1001;
                    transition: right 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .breaking-news-notification.show {
                    right: 20px;
                }
                
                .breaking-badge {
                    background: #f44336;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    flex-shrink: 0;
                }
                
                .breaking-content {
                    flex: 1;
                    min-width: 0;
                }
                
                .breaking-content h4 {
                    margin: 0 0 5px;
                    font-size: 0.9rem;
                    color: var(--dark-color);
                    line-height: 1.3;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .breaking-content p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: var(--text-color);
                }
                
                .breaking-close {
                    background: none;
                    border: none;
                    color: var(--text-color);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.3s ease;
                    flex-shrink: 0;
                }
                
                .breaking-close:hover {
                    background: rgba(0,0,0,0.1);
                }
                
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes highlightPulse {
                    0%, 100% { background: transparent; }
                    50% { background: rgba(212, 175, 55, 0.2); }
                }
                
                @media (max-width: 768px) {
                    .breaking-news-notification {
                        width: calc(100vw - 40px);
                        right: -100vw;
                    }
                    
                    .breaking-news-notification.show {
                        right: 20px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Setup hover effects
    setupHoverEffects() {
        // Enhanced card hover effects
        document.addEventListener('mouseenter', (event) => {
            if (event.target.closest('.news-card')) {
                const card = event.target.closest('.news-card');
                this.enhanceCardHover(card, true);
            }
        }, true);
        
        document.addEventListener('mouseleave', (event) => {
            if (event.target.closest('.news-card')) {
                const card = event.target.closest('.news-card');
                this.enhanceCardHover(card, false);
            }
        }, true);
    }
    
    // Enhance card hover effect
    enhanceCardHover(card, isHovering) {
        const image = card.querySelector('.news-thumbnail');
        const badges = card.querySelector('.news-badges');
        
        if (isHovering) {
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
            if (badges) {
                badges.style.opacity = '1';
                badges.style.transform = 'translateY(0)';
            }
        } else {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            if (badges) {
                badges.style.opacity = '0.9';
                badges.style.transform = 'translateY(-5px)';
            }
        }
    }
    
    // Handle window resize
    handleResize() {
        // Debounced resize handler
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.onResize();
        }, 250);
    }
    
    // Resize handler
    onResize() {
        // Update carousel if it exists
        if (window.newsAI) {
            const track = document.getElementById('frontpages-track');
            if (track) {
                // Reset carousel position on resize
                track.style.transform = 'translateX(0)';
            }
        }
        
        // Update grid layout
        this.setupResponsiveGrid();
        
        // Update mobile menu state
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu) navMenu.classList.remove('mobile-open');
            if (navToggle) navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }
    
    // Utility methods
    debounce(func, wait) {
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
    
    throttle(func, limit) {
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
    
    // Analytics and tracking
    trackPageView() {
        if (window.DiasporaAI?.trackPageTime) {
            const startTime = Date.now();
            
            // Track time spent on page
            window.addEventListener('beforeunload', () => {
                const timeSpent = Date.now() - startTime;
                window.DiasporaAI.trackPageTime('news', timeSpent);
            });
        }
        
        // Track page view
        if (window.DiasporaAI?.trackUserInterest) {
            window.DiasporaAI.trackUserInterest('page_view', 'news');
        }
    }
    
    // Performance optimization
    optimizeImages() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
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
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    // Accessibility enhancements
    enhanceAccessibility() {
        // Add ARIA labels and roles
        this.addAriaLabels();
        
        // Keyboard navigation
        this.enhanceKeyboardNavigation();
        
        // Screen reader announcements
        this.setupScreenReaderAnnouncements();
    }
    
    addAriaLabels() {
        // Add missing ARIA labels
        const searchInput = document.getElementById('search-input');
        if (searchInput && !searchInput.getAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'Search news articles');
        }
        
        // Label filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                const category = btn.textContent.trim();
                btn.setAttribute('aria-label', `Filter by ${category}`);
            }
        });
        
        // Label carousel controls
        const prevBtn = document.getElementById('frontpage-prev');
        const nextBtn = document.getElementById('frontpage-next');
        
        if (prevBtn) prevBtn.setAttribute('aria-label', 'Previous newspapers');
        if (nextBtn) nextBtn.setAttribute('aria-label', 'Next newspapers');
    }
    
    enhanceKeyboardNavigation() {
        // Make cards keyboard focusable
        document.querySelectorAll('.news-card').forEach(card => {
            if (!card.getAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'article');
                
                // Add keyboard activation
                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        card.click();
                    }
                });
            }
        });
    }
    
    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        if (!document.getElementById('sr-announcements')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'sr-announcements';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(liveRegion);
        }
    }
    
    // Announce to screen readers
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('sr-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }
}

// Initialize News Page Manager
let newsPage;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on news page
    if (window.location.pathname.includes('news.html') || 
        document.querySelector('.news-header')) {
        
        console.log('📰 Initializing News Page Manager...');
        newsPage = new NewsPageManager();
        newsPage.initialize();
        
        // Track page view
        newsPage.trackPageView();
        
        // Optimize images
        newsPage.optimizeImages();
        
        // Enhance accessibility
        newsPage.enhanceAccessibility();
        
        // Make globally available
        window.newsPage = newsPage;
        
        console.log('✅ News page ready');
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsPageManager;
}