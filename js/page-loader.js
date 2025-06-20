// page-loader.js

function loadPage(pageName) {
    // Show loading animation
    showLoadingSpinner();
    
    // Track navigation
    if (window.NavigationUtils) {
        window.NavigationUtils.trackNavigation(pageName, 'navigation');
    }
    
    // Simulate page loading with content switching
    setTimeout(() => {
        switchPageContent(pageName);
        hideLoadingSpinner();
        
        // Update navigation state
        if (window.NavigationUtils && window.NavigationUtils.NavigationState) {
            window.NavigationUtils.NavigationState.navigateTo(pageName);
        }
    }, 800);
}

function switchPageContent(pageName) {
    const mainContent = document.getElementById('main-content');
    
    // Page content templates
    const pageTemplates = {
        'historical-timeline': `
            <section class="page-header">
                <div class="container">
                    <h1>Historical Timeline</h1>
                    <p>Journey through key moments in African diaspora history</p>
                </div>
            </section>
            <section class="timeline-content">
                <div class="container">
                    <div class="timeline">
                        <div class="timeline-item fade-in-up">
                            <div class="timeline-date">3000 BCE</div>
                            <div class="timeline-content-item">
                                <h3>Ancient African Civilizations</h3>
                                <p>Rise of Nubian kingdoms and early trade networks across the Red Sea and Indian Ocean.</p>
                            </div>
                        </div>
                        <div class="timeline-item fade-in-up">
                            <div class="timeline-date">1400s-1800s</div>
                            <div class="timeline-content-item">
                                <h3>Transatlantic Slave Trade</h3>
                                <p>Forced migration of millions of Africans to the Americas, creating diaspora communities.</p>
                            </div>
                        </div>
                        <div class="timeline-item fade-in-up">
                            <div class="timeline-date">1960s</div>
                            <div class="timeline-content-item">
                                <h3>Civil Rights Movement</h3>
                                <p>Pan-African solidarity and independence movements across Africa and the diaspora.</p>
                            </div>
                        </div>
                        <div class="timeline-item fade-in-up">
                            <div class="timeline-date">2000s-Present</div>
                            <div class="timeline-content-item">
                                <h3>Digital Renaissance</h3>
                                <p>Technology enables new forms of cultural connection and diaspora identity expression.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        'maps': `
            <section class="page-header">
                <div class="container">
                    <h1>Interactive Maps</h1>
                    <p>Explore migration patterns and cultural connections</p>
                </div>
            </section>
            <section class="maps-content">
                <div class="container">
                    <div class="map-container">
                        <div class="map-placeholder fade-in-up">
                            <i class="fas fa-globe-africa" style="font-size: 5rem; color: var(--primary-color);"></i>
                            <h3>Interactive World Map</h3>
                            <p>Click regions to explore diaspora communities and migration routes</p>
                            <div class="map-controls">
                                <button class="btn btn-primary" onclick="filterMap('migration')">Migration Routes</button>
                                <button class="btn btn-outline" onclick="filterMap('cultural')">Cultural Centers</button>
                                <button class="btn btn-outline" onclick="filterMap('historical')">Historical Sites</button>
                            </div>
                        </div>
                        <div class="map-legend fade-in-up">
                            <h4>Legend</h4>
                            <div class="legend-item">
                                <span class="legend-color" style="background: var(--primary-color);"></span>
                                <span>Major Diaspora Communities</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: var(--secondary-color);"></span>
                                <span>Historical Trade Routes</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background: var(--accent-color);"></span>
                                <span>Cultural Heritage Sites</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        'podcasts': `
            <section class="page-header">
                <div class="container">
                    <h1>Podcasts</h1>
                    <p>Voices and stories from across the diaspora</p>
                </div>
            </section>
            <section class="podcasts-content">
                <div class="container">
                    <div class="podcast-grid">
                        <div class="podcast-card fade-in-up">
                            <div class="podcast-image">
                                <i class="fas fa-microphone"></i>
                            </div>
                            <h3>Diaspora Voices</h3>
                            <p>Weekly conversations with community leaders and cultural innovators</p>
                            <div class="podcast-meta">
                                <span class="episode-count">42 Episodes</span>
                                <span class="rating">★★★★★ 4.8</span>
                            </div>
                            <button class="btn btn-small" onclick="playPodcast('diaspora-voices')">Listen Now</button>
                        </div>
                        <div class="podcast-card fade-in-up">
                            <div class="podcast-image">
                                <i class="fas fa-headphones"></i>
                            </div>
                            <h3>Heritage Stories</h3>
                            <p>Personal narratives of identity, tradition, and belonging</p>
                            <div class="podcast-meta">
                                <span class="episode-count">28 Episodes</span>
                                <span class="rating">★★★★☆ 4.6</span>
                            </div>
                            <button class="btn btn-small" onclick="playPodcast('heritage-stories')">Listen Now</button>
                        </div>
                        <div class="podcast-card fade-in-up">
                            <div class="podcast-image">
                                <i class="fas fa-broadcast-tower"></i>
                            </div>
                            <h3>Cultural Currents</h3>
                            <p>Exploring contemporary arts, music, and creative expressions</p>
                            <div class="podcast-meta">
                                <span class="episode-count">35 Episodes</span>
                                <span class="rating">★★★★★ 4.9</span>
                            </div>
                            <button class="btn btn-small" onclick="playPodcast('cultural-currents')">Listen Now</button>
                        </div>
                    </div>
                    <div class="featured-episode fade-in-up">
                        <h3>Featured Episode</h3>
                        <div class="episode-player">
                            <div class="episode-info">
                                <h4>The Digital Griot: Preserving Stories in the Modern Age</h4>
                                <p>Exploring how technology is revolutionizing oral tradition preservation</p>
                                <div class="episode-controls">
                                    <button class="play-btn"><i class="fas fa-play"></i></button>
                                    <div class="progress-bar">
                                        <div class="progress"></div>
                                    </div>
                                    <span class="duration">42:30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `,
        'news': `
            <section class="page-header">
                <div class="container">
                    <h1>News & Updates</h1>
                    <p>Latest developments in diaspora communities worldwide</p>
                </div>
            </section>
            <section class="news-content">
                <div class="container">
                    <div class="news-filters fade-in-up">
                        <button class="filter-btn active" onclick="filterNews('all')">All News</button>
                        <button class="filter-btn" onclick="filterNews('culture')">Culture</button>
                        <button class="filter-btn" onclick="filterNews('politics')">Politics</button>
                        <button class="filter-btn" onclick="filterNews('education')">Education</button>
                        <button class="filter-btn" onclick="filterNews('technology')">Technology</button>
                    </div>
                    <div class="news-grid">
                        <article class="news-article featured fade-in-up">
                            <div class="article-image">
                                <i class="fas fa-newspaper"></i>
                            </div>
                            <div class="article-content">
                                <span class="article-category">Culture</span>
                                <h2>International Year of African Heritage Celebration</h2>
                                <p>Communities across six continents unite to celebrate shared cultural legacy through virtual and in-person events highlighting the rich contributions of the African diaspora to global society.</p>
                                <div class="article-meta">
                                    <span class="article-date">June 15, 2025</span>
                                    <span class="article-author">Heritage Today</span>
                                    <span class="read-time">5 min read</span>
                                </div>
                            </div>
                        </article>
                        <article class="news-article fade-in-up">
                            <span class="article-category">Technology</span>
                            <h3>New Digital Archive Launched</h3>
                            <p>Preserving oral histories from elder community members through AI-enhanced recording and transcription technology.</p>
                            <span class="article-date">June 14, 2025</span>
                        </article>
                        <article class="news-article fade-in-up">
                            <span class="article-category">Education</span>
                            <h3>Youth Leadership Summit</h3>
                            <p>Next generation leaders gather to discuss future initiatives and sustainable community development projects.</p>
                            <span class="article-date">June 12, 2025</span>
                        </article>
                        <article class="news-article fade-in-up">
                            <span class="article-category">Politics</span>
                            <h3>Diaspora Voting Rights Expanded</h3>
                            <p>New legislation allows greater political participation for diaspora communities in homeland elections.</p>
                            <span class="article-date">June 10, 2025</span>
                        </article>
                    </div>
                </div>
            </section>
        `,
        'films': `
            <section class="page-header">
                <div class="container">
                    <h1>Films & Documentaries</h1>
                    <p>Visual storytelling from diaspora filmmakers</p>
                </div>
            </section>
            <section class="films-content">
                <div class="container">
                    <div class="film-categories fade-in-up">
                        <button class="category-btn active" onclick="filterFilms('all')">All Films</button>
                        <button class="category-btn" onclick="filterFilms('documentary')">Documentaries</button>
                        <button class="category-btn" onclick="filterFilms('feature')">Feature Films</button>
                        <button class="category-btn" onclick="filterFilms('short')">Short Films</button>
                    </div>
                    <div class="films-grid">
                        <div class="film-card fade-in-up">
                            <div class="film-poster">
                                <i class="fas fa-film"></i>
                                <div class="play-overlay">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                            <div class="film-info">
                                <h3>Roots Revisited</h3>
                                <p>A documentary exploring modern genealogy research in diaspora communities</p>
                                <div class="film-meta">
                                    <span class="duration">92 min</span>
                                    <span class="year">2024</span>
                                    <span class="rating">★★★★☆</span>
                                </div>
                            </div>
                        </div>
                        <div class="film-card fade-in-up">
                            <div class="film-poster">
                                <i class="fas fa-video"></i>
                                <div class="play-overlay">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                            <div class="film-info">
                                <h3>Digital Griots</h3>
                                <p>How technology preserves and transforms traditional storytelling</p>
                                <div class="film-meta">
                                    <span class="duration">75 min</span>
                                    <span class="year">2025</span>
                                    <span class="rating">★★★★★</span>
                                </div>
                            </div>
                        </div>
                        <div class="film-card fade-in-up">
                            <div class="film-poster">
                                <i class="fas fa-camera"></i>
                                <div class="play-overlay">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                            <div class="film-info">
                                <h3>Bridges Across Waters</h3>
                                <p>Personal stories of connection between homeland and diaspora</p>
                                <div class="film-meta">
                                    <span class="duration">110 min</span>
                                    <span class="year">2024</span>
                                    <span class="rating">★★★★☆</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `
    };

    // Add page-specific styles
    const pageStyles = getPageSpecificStyles();

    // Replace content
    if (pageTemplates[pageName]) {
        mainContent.innerHTML = pageTemplates[pageName];
        
        // Add page-specific styles
        updatePageStyles(pageStyles);
        
        // Re-initialize animations for new content
        setTimeout(() => {
            if (window.setupAnimations) {
                setupAnimations();
            }
            
            // Trigger entrance animations
            const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate');
                }, index * 100);
            });
        }, 100);
        
    } else {
        // Default page or go back to home
        location.reload();
    }

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