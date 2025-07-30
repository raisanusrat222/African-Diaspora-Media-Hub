// js/news-ai.js - News-specific AI functionality

class NewsAIManager {
    constructor() {
        this.currentArticles = [];
        this.currentFilters = {
            continent: 'all',
            category: 'all',
            sentiment: 'all'
        };
        this.insightsPanelOpen = false;
        this.loadingStates = {
            frontpages: false,
            articles: false,
            insights: false
        };
        
        // Mock newspaper data - In production, this would come from APIs
        this.mockNewspapers = this.generateMockNewspapers();
        this.mockArticles = this.generateMockArticles();
        
        this.initializeEventListeners();
    }
    
    // Initialize all event listeners
    initializeEventListeners() {
        console.log('🎛️ Initializing News AI event listeners...');
        
        // Continental tab switching
        document.addEventListener('click', (e) => {
            if (e.target.closest('.continent-tab')) {
                this.handleContinentSwitch(e.target.closest('.continent-tab'));
            }
        });
        
        // Category filtering
        document.addEventListener('click', (e) => {
            if (e.target.closest('.filter-btn')) {
                this.handleCategoryFilter(e.target.closest('.filter-btn'));
            }
        });
        
        // View toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-toggle')) {
                this.handleViewToggle(e.target.closest('.view-toggle'));
            }
        });
        
        // Article interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-btn[data-action="insights"]')) {
                this.showAIInsights(e.target.closest('.news-card'));
            } else if (e.target.closest('.action-btn[data-action="read"]')) {
                this.openArticleModal(e.target.closest('.news-card'));
            } else if (e.target.closest('.news-card')) {
                this.handleArticleClick(e.target.closest('.news-card'));
            }
        });
        
        // AI insights panel
        document.addEventListener('click', (e) => {
            if (e.target.closest('#close-insights')) {
                this.closeInsightsPanel();
            }
        });
        
        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.handleSortChange(sortSelect.value);
            });
        }
        
        // Load more button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#load-more-btn')) {
                this.loadMoreArticles();
            }
        });
        
        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('#modal-close') || e.target.closest('#modal-overlay')) {
                this.closeModal();
            }
        });
        
        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.insightsPanelOpen) {
                    this.closeInsightsPanel();
                } else if (document.getElementById('news-modal').classList.contains('open')) {
                    this.closeModal();
                }
            }
        });
    }
    
    // Initialize news page
    async initializeNewsPage() {
        console.log('🚀 Initializing News AI Manager...');
        
        try {
            // Load featured front pages
            await this.loadFeaturedFrontPages();
            
            // Load initial news articles
            await this.loadNewsArticles();
            
            // Set up real-time updates (mock)
            this.startMockRealTimeUpdates();
            
            console.log('✅ News page initialization complete');
            
        } catch (error) {
            console.error('❌ News page initialization failed:', error);
            this.showErrorState();
        }
    }
    
    // Load featured front pages with AI curation
    async loadFeaturedFrontPages() {
        console.log('📰 Loading featured front pages...');
        
        const carousel = document.getElementById('frontpages-carousel');
        const track = document.getElementById('frontpages-track');
        
        if (!track) return;
        
        this.loadingStates.frontpages = true;
        
        try {
            // Simulate AI curation delay
            await this.delay(2000);
            
            // Clear loading state
            track.innerHTML = '';
            
            // Generate featured newspapers with AI insights
            const featuredNewspapers = await this.generateFeaturedNewspapers();
            
            // Render front page cards
            featuredNewspapers.forEach((newspaper, index) => {
                const card = this.createFrontPageCard(newspaper, index);
                track.appendChild(card);
            });
            
            // Initialize carousel controls
            this.initializeCarousel();
            
            this.loadingStates.frontpages = false;
            console.log('✅ Featured front pages loaded');
            
        } catch (error) {
            console.error('❌ Failed to load front pages:', error);
            this.showFrontPageError();
        }
    }
    
    // Generate featured newspapers with AI insights
    async generateFeaturedNewspapers() {
        const newspapers = this.mockNewspapers.slice(0, 8);
        
        // Add AI analysis to each newspaper
        for (let newspaper of newspapers) {
            try {
                if (window.DiasporaAI) {
                    // Get AI sentiment analysis
                    const sentiment = await window.DiasporaAI.analyzeNewsSentiment(
                        newspaper.headline,
                        newspaper.excerpt
                    );
                    newspaper.aiSentiment = sentiment;
                    
                    // Get diaspora relevance score
                    const relevance = await window.DiasporaAI.categorizeNewsRelevance(newspaper);
                    newspaper.diasporaRelevance = relevance;
                }
            } catch (error) {
                console.log('⚠️ AI analysis failed for newspaper, using fallback');
                newspaper.aiSentiment = { sentiment: 'neutral', explanation: 'Analysis unavailable' };
                newspaper.diasporaRelevance = { overallRelevance: 'MEDIUM', primaryCategory: 'general' };
            }
        }
        
        return newspapers;
    }
    
    // Create front page card element
    createFrontPageCard(newspaper, index) {
        const card = document.createElement('div');
        card.className = 'frontpage-card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="frontpage-preview">
                <img src="${newspaper.image}" alt="${newspaper.name} front page" class="newspaper-image">
                <div class="sentiment-indicator sentiment-${newspaper.aiSentiment?.sentiment || 'neutral'}"></div>
                <div class="ai-overlay">
                    <div class="ai-analysis">
                        <h4><i class="fas fa-robot"></i> AI Analysis</h4>
                        <p>${newspaper.aiSentiment?.explanation || 'Diaspora community relevance detected'}</p>
                        <div class="relevance-tags">
                            <span class="relevance-tag">${newspaper.diasporaRelevance?.primaryCategory || 'General'}</span>
                            <span class="relevance-tag">${newspaper.diasporaRelevance?.overallRelevance || 'Medium'} Impact</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="frontpage-info">
                <div class="newspaper-name">${newspaper.name}</div>
                <div class="newspaper-country">
                    <i class="fas fa-map-marker-alt"></i>
                    ${newspaper.country}, ${newspaper.continent}
                </div>
                <div class="diaspora-relevance">
                    <i class="fas fa-chart-line"></i>
                    <span>Diaspora Relevance</span>
                    <span class="relevance-score">${newspaper.diasporaRelevance?.maxScore || 7}/10</span>
                </div>
                <div class="frontpage-actions">
                    <button class="visit-site-btn" onclick="window.open('${newspaper.url || '#'}', '_blank')" title="Visit ${newspaper.name}">
                        <i class="fas fa-external-link-alt"></i>
                        Visit Site
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Load news articles with AI enhancement
    async loadNewsArticles() {
        console.log('📄 Loading news articles...');
        
        const newsGrid = document.getElementById('news-grid');
        const loadingElement = document.getElementById('news-loading');
        
        if (!newsGrid) return;
        
        this.loadingStates.articles = true;
        
        try {
            // Show loading state
            if (loadingElement) loadingElement.style.display = 'block';
            newsGrid.classList.remove('loaded');
            
            // Simulate AI processing delay
            await this.delay(3000);
            
            // Filter articles based on current filters
            let articles = this.filterArticles(this.mockArticles);
            
            // Add AI analysis to articles
            articles = await this.enhanceArticlesWithAI(articles.slice(0, 12));
            
            // Clear and populate grid
            newsGrid.innerHTML = '';
            articles.forEach(article => {
                const card = this.createNewsCard(article);
                newsGrid.appendChild(card);
            });
            
            // Hide loading, show articles
            if (loadingElement) loadingElement.style.display = 'none';
            newsGrid.classList.add('loaded');
            
            // Show load more button if there are more articles
            const loadMoreContainer = document.getElementById('load-more-container');
            if (loadMoreContainer && this.mockArticles.length > 12) {
                loadMoreContainer.style.display = 'block';
            }
            
            this.currentArticles = articles;
            this.loadingStates.articles = false;
            
            console.log('✅ News articles loaded with AI enhancement');
            
        } catch (error) {
            console.error('❌ Failed to load articles:', error);
            this.showArticleError();
        }
    }
    
    // Enhance articles with AI analysis
    async enhanceArticlesWithAI(articles) {
        console.log('🤖 Enhancing articles with AI analysis...');
        
        for (let article of articles) {
            try {
                if (window.DiasporaAI) {
                    // Get sentiment analysis
                    const sentiment = await window.DiasporaAI.analyzeNewsSentiment(
                        article.headline,
                        article.excerpt
                    );
                    article.aiSentiment = sentiment;
                    
                    // Get categorization
                    const categorization = await window.DiasporaAI.categorizeNewsRelevance(article);
                    article.aiCategorization = categorization;
                    
                    // Track AI usage
                    if (window.DiasporaAI.trackNewsInteraction) {
                        window.DiasporaAI.trackNewsInteraction('ai_analysis', {
                            headline: article.headline,
                            sentiment: sentiment.sentiment,
                            category: categorization.primaryCategory
                        });
                    }
                }
            } catch (error) {
                console.log('⚠️ AI enhancement failed for article, using fallback');
                article.aiSentiment = { sentiment: 'neutral', explanation: 'Analysis unavailable' };
                article.aiCategorization = { overallRelevance: 'MEDIUM', primaryCategory: 'general' };
            }
            
            // Small delay to prevent rate limiting
            await this.delay(100);
        }
        
        return articles;
    }
    
    // Create news card element
    createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.dataset.category = article.aiCategorization?.primaryCategory || article.category;
        card.dataset.continent = article.continent;
        card.dataset.sentiment = article.aiSentiment?.sentiment || 'neutral';
        card.dataset.relevance = article.aiCategorization?.overallRelevance || 'MEDIUM';
        
        const timeAgo = this.getTimeAgo(article.publishedAt);
        const tags = this.generateDiasporaTags(article);
        
        card.innerHTML = `
            <div class="news-card-image">
                <img src="${article.image}" alt="${article.headline}" class="news-thumbnail">
                <div class="news-badges">
                    <div class="sentiment-badge ${article.aiSentiment?.sentiment || 'neutral'}">
                        ${(article.aiSentiment?.sentiment || 'neutral').toUpperCase()}
                    </div>
                </div>
            </div>
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-time">
                        <i class="fas fa-clock"></i>
                        ${timeAgo}
                    </span>
                </div>
                <h3 class="news-headline">${article.headline}</h3>
                <p class="news-excerpt">${article.excerpt}</p>
                <div class="news-actions">
                    <div class="diaspora-tags">
                        ${tags.map(tag => `<span class="diaspora-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="news-actions-btns">
                        <button class="action-btn" data-action="insights">
                            <i class="fas fa-robot"></i>
                            AI Insights
                        </button>
                        <button class="action-btn" data-action="read">
                            <i class="fas fa-external-link-alt"></i>
                            Read
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Handle continent tab switching
    handleContinentSwitch(tab) {
        console.log('🌍 Switching continent filter...');
        
        // Update active state
        document.querySelectorAll('.continent-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update filter
        this.currentFilters.continent = tab.dataset.continent;
        
        // Reload articles with new filter
        this.loadNewsArticles();
        
        // Track user interaction
        if (window.DiasporaAI?.trackNewsInteraction) {
            window.DiasporaAI.trackNewsInteraction('region_filter', {
                region: this.currentFilters.continent
            });
        }
    }
    
    // Handle category filtering
    handleCategoryFilter(button) {
        console.log('🏷️ Switching category filter...');
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        
        // Update filter
        this.currentFilters.category = button.dataset.category;
        
        // Reload articles with new filter
        this.loadNewsArticles();
        
        // Track user interaction
        if (window.DiasporaAI?.trackNewsInteraction) {
            window.DiasporaAI.trackNewsInteraction('category_filter', {
                category: this.currentFilters.category
            });
        }
    }
    
    // Show AI insights panel
    async showAIInsights(newsCard) {
        console.log('🔍 Showing AI insights...');
        
        const panel = document.getElementById('ai-insights-panel');
        const content = document.getElementById('insights-content');
        
        if (!panel || !content) return;
        
        // Open panel
        panel.classList.add('open');
        this.insightsPanelOpen = true;
        
        // Show loading state
        content.innerHTML = `
            <div class="insights-loading">
                <div class="ai-spinner"></div>
                <p>Analyzing news relevance to diaspora communities...</p>
            </div>
        `;
        
        try {
            // Get article data
            const headline = newsCard.querySelector('.news-headline')?.textContent || '';
            const excerpt = newsCard.querySelector('.news-excerpt')?.textContent || '';
            const category = newsCard.dataset.category || 'general';
            const continent = newsCard.dataset.continent || 'global';
            
            // Generate AI insights
            let insights = '';
            if (window.DiasporaAI) {
                const context = await window.DiasporaAI.generateNewsContext(headline, continent, category);
                insights = context.context;
            } else {
                insights = this.getFallbackInsights(headline, category);
            }
            
            // Display insights
            content.innerHTML = `
                <div class="insight-section">
                    <h5><i class="fas fa-lightbulb"></i> Diaspora Context</h5>
                    <p>${insights}</p>
                    <div class="insight-tags">
                        <span class="insight-tag">${category}</span>
                        <span class="insight-tag">${continent}</span>
                        <span class="insight-tag">AI Analyzed</span>
                    </div>
                </div>
                <div class="insight-section">
                    <h5><i class="fas fa-chart-bar"></i> Community Impact</h5>
                    <p>This story has been classified as having <strong>${newsCard.dataset.relevance?.toLowerCase() || 'medium'}</strong> relevance to diaspora communities based on AI analysis of content themes and keywords.</p>
                </div>
            `;
            
            // Track interaction
            if (window.DiasporaAI?.trackNewsInteraction) {
                window.DiasporaAI.trackNewsInteraction('insights_view', {
                    headline: headline,
                    category: category,
                    continent: continent
                });
            }
            
        } catch (error) {
            console.error('❌ Failed to generate insights:', error);
            content.innerHTML = `
                <div class="insight-section">
                    <h5><i class="fas fa-exclamation-triangle"></i> Analysis Unavailable</h5>
                    <p>We're unable to provide AI insights for this article at the moment. Please try again later.</p>
                </div>
            `;
        }
    }
    
    // Close insights panel
    closeInsightsPanel() {
        const panel = document.getElementById('ai-insights-panel');
        if (panel) {
            panel.classList.remove('open');
            this.insightsPanelOpen = false;
        }
    }
    
    // Handle article click for modal
    handleArticleClick(card) {
        // Don't open modal if clicking on action buttons
        if (event.target.closest('.action-btn')) return;
        
        this.openArticleModal(card);
    }
    
    // Open article modal
    openArticleModal(newsCard) {
        console.log('📖 Opening article modal...');
        
        const modal = document.getElementById('news-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalTitle || !modalBody) return;
        
        // Get article data
        const headline = newsCard.querySelector('.news-headline')?.textContent || 'News Article';
        const source = newsCard.querySelector('.news-source')?.textContent || 'Unknown Source';
        const excerpt = newsCard.querySelector('.news-excerpt')?.textContent || '';
        const image = newsCard.querySelector('.news-thumbnail')?.src || '';
        const sentiment = newsCard.dataset.sentiment || 'neutral';
        
        // Set modal content
        modalTitle.textContent = headline;
        modalBody.innerHTML = `
            <div class="modal-article">
                ${image ? `<img src="${image}" alt="${headline}" class="modal-image">` : ''}
                <div class="modal-meta">
                    <span class="modal-source">Source: ${source}</span>
                    <span class="modal-sentiment sentiment-${sentiment}">
                        <i class="fas fa-chart-line"></i>
                        ${sentiment.toUpperCase()} sentiment
                    </span>
                </div>
                <div class="modal-content-text">
                    <p>${excerpt}</p>
                    <p><em>This is a preview. Click "Read Full Article" to visit the original source.</em></p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="window.open('#', '_blank')">
                        <i class="fas fa-external-link-alt"></i>
                        Read Full Article
                    </button>
                    <button class="btn btn-outline" onclick="newsAI.showAIInsights(this.closest('.news-modal').querySelector('.modal-content'))">
                        <i class="fas fa-robot"></i>
                        AI Analysis
                    </button>
                </div>
            </div>
        `;
        
        // Show modal
        modal.classList.add('open');
        
        // Track interaction
        if (window.DiasporaAI?.trackNewsInteraction) {
            window.DiasporaAI.trackNewsInteraction('article_read', {
                headline: headline,
                source: source
            });
        }
    }
    
    // Close modal
    closeModal() {
        const modal = document.getElementById('news-modal');
        if (modal) {
            modal.classList.remove('open');
        }
    }
    
    // Handle view toggle (grid/list)
    handleViewToggle(button) {
        const viewType = button.dataset.view;
        const newsGrid = document.getElementById('news-grid');
        
        // Update active button
        document.querySelectorAll('.view-toggle').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        
        // Update grid class
        if (newsGrid) {
            if (viewType === 'list') {
                newsGrid.classList.add('list-view');
            } else {
                newsGrid.classList.remove('list-view');
            }
        }
    }
    
    // Handle sort change
    handleSortChange(sortType) {
        console.log('🔄 Sorting articles by:', sortType);
        
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;
        
        const cards = Array.from(newsGrid.querySelectorAll('.news-card'));
        
        cards.sort((a, b) => {
            switch (sortType) {
                case 'time':
                    // Sort by most recent (mock implementation)
                    return Math.random() - 0.5;
                case 'sentiment':
                    // Sort positive first
                    const sentimentOrder = { positive: 3, neutral: 2, negative: 1 };
                    return sentimentOrder[b.dataset.sentiment] - sentimentOrder[a.dataset.sentiment];
                case 'relevance':
                    // Sort by diaspora relevance
                    const relevanceOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                    return relevanceOrder[b.dataset.relevance] - relevanceOrder[a.dataset.relevance];
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        cards.forEach(card => newsGrid.appendChild(card));
    }
    
    // Load more articles
    async loadMoreArticles() {
        console.log('📄 Loading more articles...');
        
        const loadMoreBtn = document.getElementById('load-more-btn');
        const newsGrid = document.getElementById('news-grid');
        
        if (!loadMoreBtn || !newsGrid) return;
        
        // Show loading state
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        try {
            // Simulate loading delay
            await this.delay(1500);
            
            // Generate more mock articles
            const moreArticles = this.generateMockArticles(6);
            const enhancedArticles = await this.enhanceArticlesWithAI(moreArticles);
            
            // Add to grid
            enhancedArticles.forEach(article => {
                const card = this.createNewsCard(article);
                newsGrid.appendChild(card);
            });
            
            // Update current articles
            this.currentArticles = [...this.currentArticles, ...enhancedArticles];
            
            // Reset button
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Stories';
            
            console.log('✅ More articles loaded');
            
        } catch (error) {
            console.error('❌ Failed to load more articles:', error);
            loadMoreBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error Loading';
        }
    }
    
    // Filter articles based on current filters
    filterArticles(articles) {
        return articles.filter(article => {
            const continentMatch = this.currentFilters.continent === 'all' || 
                                 article.continent === this.currentFilters.continent;
            const categoryMatch = this.currentFilters.category === 'all' || 
                                 article.category === this.currentFilters.category;
            
            return continentMatch && categoryMatch;
        });
    }
    
    // Generate diaspora tags for articles
    generateDiasporaTags(article) {
        const tags = [];
        
        // Add category tag
        if (article.category) {
            tags.push(article.category);
        }
        
        // Add continent tag
        if (article.continent) {
            tags.push(article.continent);
        }
        
        // Add AI-determined relevance
        if (article.aiCategorization?.overallRelevance) {
            tags.push(`${article.aiCategorization.overallRelevance.toLowerCase()} impact`);
        }
        
        return tags.slice(0, 3); // Limit to 3 tags
    }
    
    // Initialize carousel controls
    initializeCarousel() {
        const prevBtn = document.getElementById('frontpage-prev');
        const nextBtn = document.getElementById('frontpage-next');
        const track = document.getElementById('frontpages-track');
        
        if (!prevBtn || !nextBtn || !track) return;
        
        let currentIndex = 0;
        const cards = track.querySelectorAll('.frontpage-card');
        const cardWidth = 380; // Card width + margin
        const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
        const maxIndex = Math.max(0, cards.length - visibleCards);
        
        const updateCarousel = () => {
            const translateX = -currentIndex * cardWidth;
            track.style.transform = `translateX(${translateX}px)`;
            
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        };
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        // Auto-scroll every 8 seconds
        setInterval(() => {
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }, 8000);
        
        updateCarousel();
    }
    
    // Start mock real-time updates
    startMockRealTimeUpdates() {
        // Update news counts every 30 seconds
        setInterval(() => {
            this.updateNewsCounts();
        }, 30000);
        
        // Add new articles periodically
        setInterval(() => {
            this.addBreakingNews();
        }, 120000); // Every 2 minutes
    }
    
    // Update news counts in continental tabs
    updateNewsCounts() {
        const counts = {
            all: Math.floor(Math.random() * 100) + 1200,
            africa: Math.floor(Math.random() * 50) + 450,
            americas: Math.floor(Math.random() * 40) + 380,
            europe: Math.floor(Math.random() * 30) + 240,
            asia: Math.floor(Math.random() * 20) + 130
        };
        
        Object.keys(counts).forEach(continent => {
            const countElement = document.getElementById(`count-${continent}`);
            if (countElement) {
                countElement.textContent = counts[continent] + '+';
            }
        });
    }
    
    // Add breaking news notification
    addBreakingNews() {
        const breakingNews = this.generateMockArticles(1)[0];
        breakingNews.isBreaking = true;
        
        // Show notification (mock)
        this.showBreakingNewsNotification(breakingNews);
    }
    
    // Show breaking news notification
    showBreakingNewsNotification(article) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'breaking-news-notification';
        notification.innerHTML = `
            <div class="breaking-badge">
                <i class="fas fa-bolt"></i>
                BREAKING
            </div>
            <div class="breaking-content">
                <h4>${article.headline}</h4>
                <p>${article.source} • Just now</p>
            </div>
            <button class="breaking-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 8000);
        
        // Close button
        notification.querySelector('.breaking-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Error handling methods
    showErrorState() {
        const newsGrid = document.getElementById('news-grid');
        const loadingElement = document.getElementById('news-loading');
        
        if (loadingElement) loadingElement.style.display = 'none';
        
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Unable to Load News</h3>
                    <p>We're having trouble loading the latest news. Please check your connection and try refreshing the page.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-redo"></i>
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }
    
    showFrontPageError() {
        const track = document.getElementById('frontpages-track');
        if (track) {
            track.innerHTML = `
                <div class="frontpage-error">
                    <i class="fas fa-newspaper"></i>
                    <h3>Front Pages Unavailable</h3>
                    <p>Unable to load today's featured front pages. Please try again later.</p>
                </div>
            `;
        }
    }
    
    showArticleError() {
        const newsGrid = document.getElementById('news-grid');
        const loadingElement = document.getElementById('news-loading');
        
        if (loadingElement) loadingElement.style.display = 'none';
        
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="article-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Articles Unavailable</h3>
                    <p>We couldn't load the latest articles. Our AI analysis system may be temporarily offline.</p>
                    <button class="btn btn-primary" onclick="newsAI.loadNewsArticles()">
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    }
    
    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    getTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString();
    }
    
    getFallbackInsights(headline, category) {
        const insights = {
            migration: `This migration-related story affects diaspora communities' mobility, settlement options, and family reunification opportunities across borders.`,
            culture: `This cultural development impacts how diaspora communities preserve their heritage while fostering cross-cultural connections in their host countries.`,
            politics: `Political developments like this influence diaspora communities' civic participation, voting rights, and policy advocacy efforts.`,
            economics: `Economic news of this nature affects diaspora business opportunities, remittance flows, and financial stability across communities.`,
            community: `Community-focused stories like this highlight the social networks and collective action that strengthen diaspora connections worldwide.`
        };
        
        return insights[category] || insights.community;
    }
    
    // Mock data generation methods
    generateMockNewspapers() {
        const newspapers = [
            {
                name: 'The Daily Nation',
                country: 'Kenya',
                continent: 'africa',
                headline: 'Why Diani and Kilifi are the new party hotspots',
                excerpt: 'For party lovers, the shift from the crowded chaos of city clubs to barefoot dancing beneath the stars may seem natural...',
                image: 'assets/images/newspapers/nation-kenya.png',
                url: 'https://nation.africa/kenya'
            },
            {
                name: 'Jamaica Observer',
                country: 'Jamaica',
                continent: 'americas',
                headline: 'Dreams being brought within reach',
                excerpt: 'Governor Nasir Idris of Kebbi has approved the immediate implementation of a six-month maternity leave for pregnant women in the Kebbi State Civil Service...',
                image: 'assets/images/newspapers/observer-jamaica.png',
                url: 'https://www.jamaicaobserver.com/'
            },
            {
                name: 'This Day',
                country: 'Nigeria',
                continent: 'africa',
                headline: 'Kebbi Gov Approves Six Months Maternity Leave for Female Workers',
                excerpt: 'Nigerian filmmakers making significant impact in global entertainment...',
                image: 'assets/images/newspapers/thisday-nigeria.jpg',
                url: 'https://www.thisdaylive.com/'
            }
        ];
        
        return newspapers;
    }
    
    generateMockArticles(count = 24) {
        const articles = [
            {
                headline: 'New Immigration Pathways Open for Skilled African Workers',
                excerpt: 'Canada announces expanded immigration programs targeting skilled professionals from African countries, with streamlined application processes.',
                source: 'Immigration Today',
                category: 'migration',
                continent: 'africa',
                image: 'assets/images/news/immigration-africa.jpg',
                publishedAt: '2025-01-29T10:00:00Z'
            },
            {
                headline: 'Caribbean Cultural Festival Breaks Attendance Records in Brooklyn',
                excerpt: 'Annual celebration of Caribbean heritage draws over 100,000 participants, showcasing music, food, and traditional arts.',
                source: 'Caribbean Voice',
                category: 'culture',
                continent: 'americas',
                image: 'assets/images/news/caribbean-festival.jpg',
                publishedAt: '2025-01-29T08:30:00Z'
            },
            {
                headline: 'Diaspora Remittances to West Africa Reach Record $50 Billion',
                excerpt: 'World Bank reports show significant increase in money transfers from diaspora communities, boosting local economies.',
                source: 'Economic Times',
                category: 'economics',
                continent: 'africa',
                image: 'assets/images/news/remittances-africa.jpg',
                publishedAt: '2025-01-29T06:15:00Z'
            },
            {
                headline: 'Nigerian-American Wins Major Literary Award',
                excerpt: 'Chimamanda Ngozi Adichie receives prestigious international recognition for her contribution to contemporary literature.',
                source: 'Literary Review',
                category: 'culture',
                continent: 'africa',
                image: 'assets/images/news/literary-award.jpg',
                publishedAt: '2025-01-28T20:45:00Z'
            },
            {
                headline: 'Black History Month Programming Expands Across UK Universities',
                excerpt: 'Educational institutions increase focus on African and Caribbean heritage contributions to British society.',
                source: 'Education Weekly',
                category: 'culture',
                continent: 'europe',
                image: 'assets/images/news/black-history-uk.jpg',
                publishedAt: '2025-01-28T18:20:00Z'
            },
            {
                headline: 'Diaspora Voting Rights Expansion Proposed in Ghana Parliament',
                excerpt: 'New legislation would allow Ghanaian citizens abroad to participate in local elections, not just presidential votes.',
                source: 'Ghana Politics',
                category: 'politics',
                continent: 'africa',
                image: 'assets/images/news/ghana-voting.jpg',
                publishedAt: '2025-01-28T15:10:00Z'
            }
        ];
        
        // Generate additional articles if needed
        while (articles.length < count) {
            const randomIndex = Math.floor(Math.random() * articles.length);
            const baseArticle = articles[randomIndex];
            
            articles.push({
                ...baseArticle,
                headline: this.generateVariantHeadline(baseArticle.headline),
                publishedAt: this.generateRandomDate()
            });
        }
        
        return articles.slice(0, count);
    }
    
    generateVariantHeadline(originalHeadline) {
        const variants = [
            'Study Shows ', 'Report: ', 'Analysis: ', 'Breaking: ', 'Update: ',
            'Investigation: ', 'Survey: ', 'Research: ', 'Data: ', 'Exclusive: '
        ];
        
        const prefix = variants[Math.floor(Math.random() * variants.length)];
        return prefix + originalHeadline;
    }
    
    generateRandomDate() {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 7);
        const hoursAgo = Math.floor(Math.random() * 24);
        
        const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));
        return date.toISOString();
    }
}

// Initialize News AI Manager
let newsAI;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on news page
    if (window.location.pathname.includes('news.html') || 
        document.querySelector('.news-header')) {
        
        console.log('🗞️ Initializing News AI Manager...');
        newsAI = new NewsAIManager();
        
        // Wait for AI service to be ready
        setTimeout(() => {
            newsAI.initializeNewsPage();
        }, 2000);
        
        // Make globally available
        window.newsAI = newsAI;
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsAIManager;
}