// page-loader.js

function loadPage(pageName) {
    // Show loading animation
    showLoadingSpinner();
    
    // Track navigation
    if (window.NavigationUtils) {
        window.NavigationUtils.trackNavigation(pageName, 'navigation');
    }
    
    // fetch HTML files
    fetch(pageName + '.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load page');
            return response.text();
        })
        .then(html => {
            document.getElementById('main-content').innerHTML = html;
            hideLoadingSpinner();
            
            // Update navigation state
            if (window.NavigationUtils && window.NavigationUtils.NavigationState) {
                window.NavigationUtils.NavigationState.navigateTo(pageName);
            }
            
            // Re-initialize animations for new content
            if (window.setupAnimations) {
                setupAnimations();
            }
        })
        .catch(err => {
            console.error('Failed to load page:', err);
            hideLoadingSpinner();
            location.href = pageName + '.html'; // fallback: full reload
        });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update page title
    updatePageTitle(pageName);
}
function getPageSpecificStyles() {
    return `
        .page-header {
            padding: 120px 0 60px;
            background: var(--gradient-primary);
            color: var(--light-color);
            text-align: center;
        }
        
        .page-header h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .timeline {
            position: relative;
            padding: 40px 0;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--primary-color);
            transform: translateX(-50%);
        }
        
        .timeline-item {
            display: flex;
            margin-bottom: 40px;
            position: relative;
        }
        
        .timeline-item:nth-child(odd) {
            flex-direction: row-reverse;
        }
        
        .timeline-date {
            flex: 1;
            text-align: center;
            font-weight: bold;
            color: var(--primary-color);
            padding: 20px;
            font-size: 1.2rem;
        }
        
        .timeline-content-item {
            flex: 1;
            background: var(--light-color);
            padding: 30px;
            border-radius: 10px;
            box-shadow: var(--shadow);
            margin: 0 20px;
        }
        
        .timeline-content-item h3 {
            color: var(--secondary-color);
            margin-bottom: 15px;
        }
        
        .map-container, .podcast-grid, .news-grid, .films-grid {
            padding: 60px 0;
        }
        
        .map-placeholder {
            text-align: center;
            padding: 100px 50px;
            background: var(--light-color);
            border-radius: 20px;
            box-shadow: var(--shadow);
            margin-bottom: 40px;
        }
        
        .map-controls {
            margin-top: 30px;
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .map-legend {
            background: var(--light-color);
            padding: 30px;
            border-radius: 15px;
            box-shadow: var(--shadow);
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 3px;
            margin-right: 10px;
        }
        
        .podcast-grid, .films-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .podcast-card, .film-card {
            background: var(--light-color);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: var(--shadow);
            transition: transform 0.3s ease;
        }
        
        .podcast-card:hover, .film-card:hover {
            transform: translateY(-5px);
        }
        
        .podcast-image i, .film-poster i {
            font-size: 3rem;
            color: var(--primary-color);
            margin-bottom: 20px;
        }
        
        .podcast-meta, .film-meta {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            font-size: 0.9rem;
            color: #666;
        }
        
        .featured-episode {
            background: var(--light-color);
            padding: 40px;
            border-radius: 20px;
            box-shadow: var(--shadow);
            margin-top: 40px;
        }
        
        .episode-player {
            margin-top: 20px;
        }
        
        .episode-controls {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 15px;
        }
        
        .play-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            border: none;
            color: var(--dark-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .progress-bar {
            flex: 1;
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .progress {
            height: 100%;
            background: var(--primary-color);
            width: 30%;
            transition: width 0.3s ease;
        }
        
        .news-filters, .film-categories {
            display: flex;
            gap: 15px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        
        .filter-btn, .category-btn {
            padding: 10px 20px;
            border: 2px solid var(--primary-color);
            background: transparent;
            color: var(--primary-color);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .filter-btn.active, .category-btn.active {
            background: var(--primary-color);
            color: var(--dark-color);
        }
        
        .filter-btn:hover, .category-btn:hover {
            background: var(--primary-color);
            color: var(--dark-color);
        }
        
        .news-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
        }
        
        .news-article {
            background: var(--light-color);
            padding: 30px;
            border-radius: 15px;
            box-shadow: var(--shadow);
            margin-bottom: 30px;
        }
        
        .featured {
            grid-row: span 2;
        }
        
        .article-image i {
            font-size: 4rem;
            color: var(--primary-color);
            margin-bottom: 20px;
        }
        
        .article-category {
            background: var(--primary-color);
            color: var(--dark-color);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .article-meta {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: #666;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .film-poster {
            position: relative;
            height: 200px;
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            overflow: hidden;
            cursor: pointer;
        }
        
        .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .film-poster:hover .play-overlay {
            opacity: 1;
        }
        
        .play-overlay i {
            font-size: 3rem !important;
            color: white !important;
        }
        
        @media (max-width: 768px) {
            .timeline::before {
                left: 20px;
            }
            
            .timeline-item {
                flex-direction: column;
                margin-left: 40px;
            }
            
            .timeline-item:nth-child(odd) {
                flex-direction: column;
            }
            
            .timeline-content-item {
                margin: 10px 0 0 0;
            }
            
            .news-grid {
                grid-template-columns: 1fr;
            }
            
            .page-header h1 {
                font-size: 2rem;
            }
            
            .map-placeholder {
                padding: 60px 20px;
            }
            
            .podcast-grid, .films-grid {
                grid-template-columns: 1fr;
            }
            
            .episode-controls {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .article-meta {
                flex-direction: column;
                gap: 5px;
            }
        }
    `;
}

function updatePageStyles(styles) {
    // Remove existing page styles
    const existingPageStyles = document.getElementById('page-styles');
    if (existingPageStyles) {
        existingPageStyles.remove();
    }
    
    // Add new page styles
    const styleSheet = document.createElement('style');
    styleSheet.id = 'page-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

function updatePageTitle(pageName) {
    const titles = {
        'historical-timeline': 'Historical Timeline - Voices of the Diaspora',
        'maps': 'Interactive Maps - Voices of the Diaspora',
        'podcasts': 'Podcasts - Voices of the Diaspora',
        'news': 'News & Updates - Voices of the Diaspora',
        'films': 'Films & Documentaries - Voices of the Diaspora',
        'music-dance': 'Music & Dance - Voices of the Diaspora',
        'visual-arts': 'Visual Arts - Voices of the Diaspora',
        'literature': 'Literature - Voices of the Diaspora'
    };
    
    document.title = titles[pageName] || 'Voices of the Diaspora';
}

function showLoadingSpinner() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    // Add loading styles
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 26, 26, 0.9);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const spinnerStyle = document.createElement('style');
    spinnerStyle.id = 'loading-styles';
    spinnerStyle.textContent = `
        .loading-spinner p {
            margin-top: 20px;
            font-size: 1.2rem;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(212, 175, 55, 0.3);
            border-left: 4px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loadingOverlay);
    
    // Trigger fade in
    setTimeout(() => {
        loadingOverlay.style.opacity = '1';
    }, 10);
}

function hideLoadingSpinner() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingStyles = document.getElementById('loading-styles');
    
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
            if (loadingStyles) {
                loadingStyles.remove();
            }
        }, 300);
    }
}

// Interactive functions for specific pages
function filterMap(type) {
    console.log('Filtering map by:', type);
    // Implement map filtering logic here
    
    // Update button states
    const buttons = document.querySelectorAll('.map-controls .btn');
    buttons.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });
    
    event.target.classList.remove('btn-outline');
    event.target.classList.add('btn-primary');
}

function playPodcast(podcastId) {
    console.log('Playing podcast:', podcastId);
    // Implement podcast player logic here
    
    // Show playing state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Playing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Pause';
        button.disabled = false;
    }, 1000);
}

function filterNews(category) {
    console.log('Filtering news by:', category);
    // Implement news filtering logic here
    
    // Update filter button states
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter articles (simulation)
    const articles = document.querySelectorAll('.news-article');
    articles.forEach(article => {
        if (category === 'all') {
            article.style.display = 'block';
        } else {
            const articleCategory = article.querySelector('.article-category');
            if (articleCategory && articleCategory.textContent.toLowerCase() === category) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        }
    });
}

function filterFilms(category) {
    console.log('Filtering films by:', category);
    // Implement film filtering logic here
    
    // Update category button states
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Breadcrumb management for page navigation
function createBreadcrumb(pageName) {
    const breadcrumbData = {
        'historical-timeline': [
            { title: 'Home', url: 'home' },
            { title: 'History & Identity', url: 'history' },
            { title: 'Historical Timeline', url: 'historical-timeline' }
        ],
        'maps': [
            { title: 'Home', url: 'home' },
            { title: 'Interactive Maps', url: 'maps' }
        ],
        'podcasts': [
            { title: 'Home', url: 'home' },
            { title: 'Podcasts', url: 'podcasts' }
        ],
        'news': [
            { title: 'Home', url: 'home' },
            { title: 'News & Updates', url: 'news' }
        ],
        'films': [
            { title: 'Home', url: 'home' },
            { title: 'Films & Documentaries', url: 'films' }
        ]
    };
    
    if (window.NavigationUtils && breadcrumbData[pageName]) {
        window.NavigationUtils.createBreadcrumb(breadcrumbData[pageName]);
    }
}

// Page-specific initialization
function initializePage(pageName) {
    // Create breadcrumb
    createBreadcrumb(pageName);
    
    // Initialize page-specific features
    switch (pageName) {
        case 'podcasts':
            initializePodcastPlayer();
            break;
        case 'maps':
            initializeMapControls();
            break;
        case 'news':
            initializeNewsFilters();
            break;
        case 'films':
            initializeFilmPlayer();
            break;
    }
}

function initializePodcastPlayer() {
    // Initialize podcast player functionality
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle play/pause
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    });
}

function initializeMapControls() {
    // Initialize map control functionality
    console.log('Map controls initialized');
}

function initializeNewsFilters() {
    // Initialize news filtering functionality
    console.log('News filters initialized');
}

function initializeFilmPlayer() {
    // Initialize film player functionality
    const filmCards = document.querySelectorAll('.film-card');
    filmCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            console.log('Playing film:', title);
        });
    });
}

// Export page loader functions
window.PageLoader = {
    loadPage,
    switchPageContent,
    showLoadingSpinner,
    hideLoadingSpinner,
    filterMap,
    playPodcast,
    filterNews,
    filterFilms,
    initializePage
};