// js/cultural-figures.js - Smooth Interactive Cultural Figures Component

/**
 * Cultural Figures Manager - Optimized for 4-card display
 * Handles the smooth interactive cultural figures carousel
 */
class CulturalFiguresManager {
    constructor() {
        this.figures = [];
        this.currentIndex = 0;
        this.visibleCards = 4; // Always show 4 cards
        this.isAutoRotating = true;
        this.autoRotateInterval = null;
        this.autoRotateDelay = 10000; // 10 seconds - much more relaxed
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    async init() {
        try {
            console.log('🎭 Initializing Cultural Figures Manager...');
            
            // Wait for CSV processor to be available
            await this.waitForProcessor();
            console.log('✅ CSV processor ready');
            
            // Load figures data - get more for smooth scrolling
            await this.loadFigures();
            console.log(`✅ Loaded ${this.figures.length} figures`);
            
            // Create carousel if on homepage
            if (this.isHomepage()) {
                console.log('✅ Homepage detected, creating carousel');
                this.createCarousel();
                this.setupEventHandlers();
                this.startAutoRotation();
            } else {
                console.log('ℹ️ Not on homepage, skipping carousel creation');
            }
            
            console.log('🎭 Cultural Figures Manager initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Cultural Figures Manager:', error);
            this.showError();
        }
    }

    /**
     * Wait for CSV processor to be ready
     */
    async waitForProcessor() {
        return new Promise((resolve) => {
            if (window.figureCsvProcessor && window.figureCsvProcessor.isLoaded) {
                resolve();
                return;
            }

            // If processor exists but isn't loaded yet, wait for it
            if (window.figureCsvProcessor && window.figureCsvProcessor.initPromise) {
                window.figureCsvProcessor.initPromise.then(() => {
                    resolve();
                }).catch(() => {
                    console.warn('Processor initialization failed, continuing anyway');
                    resolve();
                });
                return;
            }

            // Listen for the ready event
            const handleReady = () => {
                console.log('✅ Processor ready event received');
                resolve();
            };

            document.addEventListener('figureCsvProcessorReady', handleReady, { once: true });

            // Fallback timeout
            setTimeout(() => {
                console.warn('⚠️ Processor wait timeout, continuing with fallback');
                document.removeEventListener('figureCsvProcessorReady', handleReady);
                resolve();
            }, 5000);
        });
    }

    /**
     * Load figures from CSV processor - optimized for 4-card display
     */
    async loadFigures() {
        try {
            // Load 12 figures for smooth infinite scrolling (3 full sets of 4)
            this.figures = await window.figureCsvProcessor.getRandomFigures(12);
            
            // If we don't have enough, duplicate to ensure smooth scrolling
            while (this.figures.length < 8) {
                this.figures = [...this.figures, ...this.figures];
            }
            
            console.log(`📚 Loaded ${this.figures.length} cultural figures for smooth carousel`);
        } catch (error) {
            console.error('Error loading figures:', error);
            this.figures = this.getFallbackFigures();
        }
    }

    /**
     * Check if we're on the homepage
     */
    isHomepage() {
        return window.location.pathname === '/' || 
               window.location.pathname === '/index.html' ||
               window.location.pathname.endsWith('/');
    }

    /**
     * Create the carousel HTML structure
     */
    createCarousel() {
        console.log('🎭 Creating smooth cultural figures carousel...');
        
        const targetSection = this.findInsertionPoint();
        if (!targetSection) {
            console.error('❌ Could not find insertion point for cultural figures carousel');
            return;
        }

        console.log('📍 Insertion point found:', targetSection.className);

        const carouselSection = document.createElement('section');
        carouselSection.className = 'cultural-figures-preview';
        carouselSection.innerHTML = this.getCarouselHTML();

        // Insert after the target section
        if (targetSection.nextSibling) {
            targetSection.parentNode.insertBefore(carouselSection, targetSection.nextSibling);
        } else {
            targetSection.parentNode.appendChild(carouselSection);
        }

        console.log('✅ Smooth carousel HTML structure created');

        // Wait a moment for DOM to settle, then populate with figures
        setTimeout(() => {
            this.renderFigures();
            this.updateResponsiveSettings();
        }, 100);
    }

    /**
     * Find the best insertion point on the homepage
     */
    findInsertionPoint() {
        console.log('🔍 Looking for insertion point...');
        
        // Look for country search section first
        const countrySearch = document.querySelector('.country-search-section');
        if (countrySearch) {
            console.log('✅ Found country search section');
            return countrySearch;
        }

        // Fallback to featured content section
        const featuredContent = document.querySelector('.featured-content');
        if (featuredContent) {
            console.log('✅ Found featured content section (fallback)');
            return featuredContent;
        }

        // Last resort - main content
        const mainContent = document.querySelector('#main-content');
        if (mainContent) {
            console.log('⚠️ Using main content as last resort');
            return mainContent;
        }

        console.error('❌ No suitable insertion point found');
        return null;
    }

    /**
     * Generate carousel HTML structure - Clean without auto-rotation controls
     */
    getCarouselHTML() {
        return `
            <div class="container">
                <h2 class="section-title">Influential Diaspora Figures</h2>
                <div class="figures-carousel" id="figures-carousel">
                    <div class="figures-track" id="figures-track">
                        <!-- Figure cards will be inserted here -->
                    </div>
                    
                    <!-- Navigation arrows -->
                    <button class="carousel-nav prev" id="carousel-prev" aria-label="Previous figures" title="Previous">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-nav next" id="carousel-next" aria-label="Next figures" title="Next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <!-- Carousel controls -->
                <div class="carousel-controls">
                    <div class="carousel-dots" id="carousel-dots">
                        <!-- Dots will be generated based on figure count -->
                    </div>
                </div>
                
                <!-- View all link -->
                <div class="view-all-figures">
                    <a href="cultural-figures.html" class="view-all-btn" onclick="loadPage('cultural-figures')">
                        <i class="fas fa-users"></i>
                        <span>Explore All Cultural Figures</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Render figure cards in the carousel - optimized for 4-card display
     */
    renderFigures() {
        const track = document.getElementById('figures-track');
        if (!track) return;

        track.innerHTML = '';

        this.figures.forEach((figure, index) => {
            const card = this.createFigureCard(figure, index);
            track.appendChild(card);
        });

        this.createDots();
        this.updateCarouselPosition();
    }

    /**
     * Create individual figure card with smooth animations
     */
    createFigureCard(figure, index) {
        const card = document.createElement('div');
        card.className = 'figure-card';
        card.dataset.era = figure.era.toLowerCase();
        card.dataset.index = index;
        card.dataset.figureId = figure.id;

        // Create portrait or placeholder
        const portraitHTML = figure.imageFilename && figure.imageFilename !== 'placeholder.jpg' 
            ? `<div class="figure-portrait">
                 <img src="${figure.imagePath}" alt="${figure.name}" loading="lazy" 
                      onerror="this.parentElement.outerHTML = this.parentElement.dataset.fallback">
               </div>`
            : `<div class="figure-portrait-placeholder" title="${figure.name}">
                 ${this.getInitials(figure.name)}
               </div>`;

        card.innerHTML = `
            ${portraitHTML}
            <div class="figure-info">
                <h3>${figure.name}</h3>
                <div class="figure-lifespan">${figure.lifespan}</div>
                <div class="figure-achievement">${figure.achievement}</div>
                <div class="figure-fields">
                    ${figure.fields.slice(0, 2).map(field => 
                        `<span class="field-tag">${field}</span>`
                    ).join('')}
                </div>
                <div class="figure-era">${figure.era}</div>
            </div>
            
            <div class="figure-preview">
                <div class="figure-quote">${figure.famousQuote}</div>
                <div class="preview-actions">
                    <button class="preview-btn" onclick="culturalFiguresManager.showFigureDetails(${figure.id})">
                        <i class="fas fa-info-circle"></i>
                        Learn More
                    </button>
                    <button class="preview-btn secondary" onclick="culturalFiguresManager.showConnections(${figure.id})">
                        <i class="fas fa-project-diagram"></i>
                        Connections
                    </button>
                </div>
            </div>
        `;

        // Store fallback for image errors
        if (portraitHTML.includes('img')) {
            const portraitDiv = card.querySelector('.figure-portrait');
            portraitDiv.dataset.fallback = `<div class="figure-portrait-placeholder">${this.getInitials(figure.name)}</div>`;
        }

        return card;
    }

    /**
     * Get initials for placeholder
     */
    getInitials(name) {
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    /**
     * Create navigation dots based on the number of slides
     */
    createDots() {
        const dotsContainer = document.getElementById('carousel-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        
        // Calculate how many "pages" we have based on visible cards
        const totalSlides = Math.ceil(this.figures.length / this.visibleCards);
        
        console.log(`Creating ${totalSlides} dots for ${this.figures.length} figures (${this.visibleCards} visible per page)`);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }

    /**
     * Setup event handlers with clean interactions
     */
    setupEventHandlers() {
        // Navigation arrows
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        const carousel = document.querySelector('.figures-carousel');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Pause auto-rotation on hover
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoRotation());
            carousel.addEventListener('mouseleave', () => this.resumeAutoRotation());
        }

        // Touch/swipe support for mobile
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipeGesture();
            }, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.figures-carousel')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            }
        });

        // Responsive handling
        window.addEventListener('resize', () => {
            this.debounce(() => {
                this.updateResponsiveSettings();
            }, 250);
        });

        this.updateResponsiveSettings(); // Initial call
    }

    /**
     * Handle swipe gestures for mobile
     */
    handleSwipeGesture() {
        const minSwipeDistance = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe right - previous slide
                this.previousSlide();
            } else {
                // Swipe left - next slide
                this.nextSlide();
            }
        }
    }

    /**
     * Update responsive settings based on screen size
     */
    updateResponsiveSettings() {
        const width = window.innerWidth;
        
        // Always prioritize 4 cards on larger screens, scale down on mobile
        if (width < 480) {
            this.visibleCards = 1;
        } else if (width < 768) {
            this.visibleCards = 2;
        } else if (width < 1024) {
            this.visibleCards = 3;
        } else {
            this.visibleCards = 4; // Default: 4 cards
        }

        // Recreate dots and update position
        this.createDots();
        this.updateCarouselPosition();
        
        console.log(`Responsive update: ${this.visibleCards} cards visible on ${width}px screen`);
    }

    /**
     * Smooth navigation methods with improved UX
     */
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const maxIndex = Math.max(0, this.figures.length - this.visibleCards);
        
        if (this.currentIndex >= maxIndex) {
            // Smooth loop back to beginning
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        
        this.updateCarouselPosition();
        this.resetAutoRotation();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600); // Match CSS transition duration
        
        console.log(`Next slide: ${this.currentIndex}/${maxIndex} (showing ${this.visibleCards} of ${this.figures.length})`);
    }

    previousSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const maxIndex = Math.max(0, this.figures.length - this.visibleCards);
        
        if (this.currentIndex <= 0) {
            // Smooth loop to end
            this.currentIndex = maxIndex;
        } else {
            this.currentIndex--;
        }
        
        this.updateCarouselPosition();
        this.resetAutoRotation();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600); // Match CSS transition duration
        
        console.log(`Previous slide: ${this.currentIndex}/${maxIndex} (showing ${this.visibleCards} of ${this.figures.length})`);
    }

    goToSlide(slideIndex) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const maxIndex = Math.max(0, this.figures.length - this.visibleCards);
        this.currentIndex = Math.max(0, Math.min(slideIndex * this.visibleCards, maxIndex));
        
        this.updateCarouselPosition();
        this.resetAutoRotation();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
        
        console.log(`Go to slide: ${slideIndex} (index: ${this.currentIndex})`);
    }

    /**
     * Update carousel position with smooth animations
     */
    updateCarouselPosition() {
        const track = document.getElementById('figures-track');
        if (!track) return;

        // Calculate the offset based on card width + gap
        const cardWidth = 280; // Fixed card width from CSS
        const gap = 30; // Gap from CSS
        const totalCardWidth = cardWidth + gap;
        const offset = -this.currentIndex * totalCardWidth;
        
        track.style.transform = `translateX(${offset}px)`;

        // Update dots
        const dots = document.querySelectorAll('.carousel-dot');
        const activeSlide = Math.floor(this.currentIndex / this.visibleCards);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeSlide);
        });

        console.log(`Updated position: offset=${offset}px, currentIndex=${this.currentIndex}, activeSlide=${activeSlide}`);
    }

    /**
     * Simple auto-rotation with longer delay
     */
    startAutoRotation() {
        if (!this.isAutoRotating) return;

        this.autoRotateInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoRotateDelay);
    }

    pauseAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    resumeAutoRotation() {
        if (this.isAutoRotating && !this.autoRotateInterval) {
            this.startAutoRotation();
        }
    }

    resetAutoRotation() {
        this.pauseAutoRotation();
        
        // Wait 3 seconds after user interaction before resuming
        setTimeout(() => {
            if (this.isAutoRotating) {
                this.startAutoRotation();
            }
        }, 3000);
    }

    /**
     * Utility function for debouncing
     */
    debounce(func, wait) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(func, wait);
    }

    /**
     * AI-powered figure interactions - Fixed for proper modal display
     */
    async showFigureDetails(figureId) {
        try {
            console.log('🔍 Showing figure details for ID:', figureId);
            
            const figure = await window.figureCsvProcessor.getFigureById(figureId);
            if (!figure) {
                console.error('Figure not found:', figureId);
                this.showErrorModal('Figure not found');
                return;
            }

            console.log('✅ Figure found:', figure.name);

            // Show loading state
            this.showModal('figure-details', this.getLoadingModalHTML(figure.name));

            // Generate AI-enhanced biography
            let biography = figure.shortBio;
            let aiInsights = '';

            // Check if AI service is available
            if (window.DiasporaAI && typeof window.DiasporaAI.callOpenAI === 'function') {
                try {
                    console.log('🤖 Generating AI content for', figure.name);
                    
                    const prompt = `Write a compelling 200-word biography of ${figure.name}, the ${figure.achievement}. Include:
                    - Their most significant contributions to ${figure.primaryField}
                    - How they impacted the African diaspora community
                    - Their lasting legacy today
                    - What made them unique in their era (${figure.era})
                    
                    Write in an engaging, informative style. Start directly with their story.`;

                    biography = await window.DiasporaAI.callOpenAI(prompt, 300, 0.8);

                    // Get AI insights about their relevance
                    const insightsPrompt = `In 2-3 sentences, explain why ${figure.name} remains relevant to African diaspora communities today. Focus on their lasting impact and lessons for current generations.`;
                    
                    aiInsights = await window.DiasporaAI.callOpenAI(insightsPrompt, 150, 0.7);
                    
                    console.log('✅ AI content generated successfully');

                } catch (aiError) {
                    console.warn('⚠️ AI enhancement failed, using static content:', aiError);
                    // Continue with static content
                }
            } else {
                console.log('ℹ️ AI service not available, using static content');
            }

            // Update modal with full content
            this.showModal('figure-details', this.getFigureDetailsHTML(figure, biography, aiInsights));

        } catch (error) {
            console.error('❌ Error showing figure details:', error);
            this.showErrorModal('Could not load figure details. Please try again.');
        }
    }

    async showConnections(figureId) {
        try {
            console.log('🔗 Showing connections for figure ID:', figureId);
            
            const figure = await window.figureCsvProcessor.getFigureById(figureId);
            if (!figure) {
                console.error('Figure not found:', figureId);
                this.showErrorModal('Figure not found');
                return;
            }

            // Show loading state
            this.showModal('figure-connections', this.getLoadingModalHTML(`${figure.name}'s Connections`));

            const connections = await window.figureCsvProcessor.getConnectedFigures(figureId);
            console.log(`Found ${connections.length} connections for ${figure.name}`);

            let connectionInsights = '';

            // Generate AI explanations for connections
            if (window.DiasporaAI && typeof window.DiasporaAI.callOpenAI === 'function' && connections.length > 0) {
                try {
                    const connectionNames = connections.map(c => c.name).join(', ');
                    const prompt = `Explain the relationships between ${figure.name} and these figures: ${connectionNames}. 
                    
                    For each connection, briefly describe:
                    - How they knew each other or were connected
                    - What they shared in common (movements, ideas, time periods)
                    - How their relationship impacted the African diaspora community
                    
                    Keep each explanation to 2-3 sentences. Write in an engaging, informative style.`;

                    connectionInsights = await window.DiasporaAI.callOpenAI(prompt, 400, 0.7);
                    console.log('✅ AI connection analysis generated');

                } catch (aiError) {
                    console.warn('⚠️ AI connection analysis failed:', aiError);
                }
            }

            // Update modal with connections
            this.showModal('figure-connections', this.getConnectionsHTML(figure, connections, connectionInsights));

        } catch (error) {
            console.error('❌ Error showing connections:', error);
            this.showErrorModal('Could not load figure connections. Please try again.');
        }
    }

    /**
     * Modal management - Enhanced with better error handling
     */
    showModal(modalId, content) {
        console.log('📱 Showing modal:', modalId);
        
        // Remove existing modal
        const existingModal = document.getElementById('cultural-figure-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create new modal
        const modal = document.createElement('div');
        modal.id = 'cultural-figure-modal';
        modal.className = 'cultural-modal';
        modal.innerHTML = `
            <div class="cultural-modal-overlay" onclick="culturalFiguresManager.closeModal()"></div>
            <div class="cultural-modal-content">
                <button class="cultural-modal-close" onclick="culturalFiguresManager.closeModal()" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                ${content}
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add show class for animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add escape key listener
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        };
        document.addEventListener('keydown', this.handleEscapeKey);
        
        console.log('✅ Modal displayed successfully');
    }

    closeModal() {
        console.log('❌ Closing modal');
        
        const modal = document.getElementById('cultural-figure-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
                document.body.style.overflow = '';
            }, 300);
        }
        
        // Remove escape key listener
        if (this.handleEscapeKey) {
            document.removeEventListener('keydown', this.handleEscapeKey);
            this.handleEscapeKey = null;
        }
    }

    /**
     * Modal HTML templates - Enhanced with better loading states
     */
    getLoadingModalHTML(title) {
        return `
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                <div class="traditional-loading-container">
                    <div class="adinkra-loader"></div>
                    <p class="loading-text">Loading cultural insights...</p>
                    <p class="loading-subtext">Connecting wisdom across time and space</p>
                </div>
            </div>
        `;
    }

    getFigureDetailsHTML(figure, biography, aiInsights) {
        return `
            <div class="modal-header">
                <div class="modal-figure-portrait">
                    ${figure.imageFilename && figure.imageFilename !== 'placeholder.jpg' 
                        ? `<img src="${figure.imagePath}" alt="${figure.name}" onerror="this.style.display='none'">`
                        : `<div class="modal-portrait-placeholder">${this.getInitials(figure.name)}</div>`
                    }
                </div>
                <div class="modal-figure-info">
                    <h2>${figure.name}</h2>
                    <div class="modal-lifespan">${figure.lifespan}</div>
                    <div class="modal-achievement">${figure.achievement}</div>
                    <div class="modal-fields">
                        ${figure.fields.map(field => `<span class="modal-field-tag">${field}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-quote">
                    <i class="fas fa-quote-left"></i>
                    <p>"${figure.famousQuote}"</p>
                </div>
                
                <div class="modal-biography">
                    <h3>Biography</h3>
                    <p>${biography}</p>
                </div>
                
                ${aiInsights ? `
                    <div class="modal-ai-insights">
                        <h3><i class="fas fa-robot"></i> AI Insights: Relevance Today</h3>
                        <p>${aiInsights}</p>
                    </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="modal-btn primary" onclick="culturalFiguresManager.showConnections(${figure.id})">
                        <i class="fas fa-project-diagram"></i>
                        View Connections
                    </button>
                    <button class="modal-btn secondary" onclick="culturalFiguresManager.shareFigure(${figure.id})">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                </div>
            </div>
        `;
    }

    getConnectionsHTML(figure, connections, aiInsights) {
        return `
            <div class="modal-header">
                <h2>${figure.name}'s Cultural Connections</h2>
                <p>Exploring relationships across the diaspora</p>
            </div>
            <div class="modal-body">
                ${connections.length > 0 ? `
                    <div class="connections-grid">
                        ${connections.map(connected => `
                            <div class="connection-card" onclick="culturalFiguresManager.showFigureDetails(${connected.id})">
                                <div class="connection-portrait">
                                    ${connected.imageFilename && connected.imageFilename !== 'placeholder.jpg'
                                        ? `<img src="${connected.imagePath}" alt="${connected.name}">`
                                        : `<div class="connection-placeholder">${this.getInitials(connected.name)}</div>`
                                    }
                                </div>
                                <div class="connection-info">
                                    <h4>${connected.name}</h4>
                                    <div class="connection-era">${connected.era}</div>
                                    <div class="connection-field">${connected.primaryField}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${aiInsights ? `
                        <div class="modal-ai-insights">
                            <h3><i class="fas fa-robot"></i> AI Analysis: How They Connected</h3>
                            <div class="ai-insights-content">${aiInsights}</div>
                        </div>
                    ` : ''}
                ` : `
                    <div class="no-connections">
                        <i class="fas fa-users"></i>
                        <h3>No Direct Connections Found</h3>
                        <p>This figure's connections haven't been mapped yet, but they contributed significantly to the broader diaspora community.</p>
                    </div>
                `}
            </div>
        `;
    }

    showErrorModal(message) {
        this.showModal('error', `
            <div class="modal-header">
                <h2>Error</h2>
            </div>
            <div class="modal-body">
                <div class="modal-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button class="modal-btn primary" onclick="culturalFiguresManager.closeModal()">
                        Close
                    </button>
                </div>
            </div>
        `);
    }

    /**
     * Social sharing
     */
    shareFigure(figureId) {
        // Implementation for sharing figures
        if (navigator.share) {
            navigator.share({
                title: 'Cultural Figure from Voices of the Diaspora',
                text: 'Discover influential diaspora figures and their stories',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to clipboard
            const shareText = `Discover influential diaspora figures on Voices of the Diaspora: ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                // Show temporary notification
                this.showNotification('Link copied to clipboard!');
            }).catch(console.error);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'figure-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Error handling
     */
    showError() {
        const targetSection = this.findInsertionPoint();
        if (!targetSection) return;

        const errorSection = document.createElement('section');
        errorSection.className = 'cultural-figures-preview';
        errorSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">Influential Diaspora Figures</h2>
                <div class="figures-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Unable to Load Cultural Figures</h3>
                    <p>We're having trouble loading the cultural figures. Please check your connection and try refreshing the page.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-redo"></i>
                        Refresh Page
                    </button>
                </div>
            </div>
        `;

        targetSection.parentNode.insertBefore(errorSection, targetSection.nextSibling);
    }

    /**
     * Fallback figures if CSV fails - optimized for 4-card display
     */
    getFallbackFigures() {
        return [
            {
                id: 1,
                name: "Maya Angelou",
                birthYear: 1928,
                deathYear: 2014,
                isAlive: false,
                achievement: "Poet and civil rights activist",
                famousQuote: "Still I Rise",
                shortBio: "Poet, memoirist, and civil rights activist known for 'I Know Why the Caged Bird Sings'",
                era: "Modern",
                fields: ["Literature", "Civil Rights"],
                lifespan: "1928 - 2014",
                imagePath: "assets/images/figures/maya-angelou.jpg",
                imageFilename: "maya-angelou.jpg",
                connections: ["James Baldwin", "Martin Luther King Jr."]
            },
            {
                id: 2,
                name: "Nelson Mandela",
                birthYear: 1918,
                deathYear: 2013,
                isAlive: false,
                achievement: "Anti-apartheid leader and South African President",
                famousQuote: "Education is the most powerful weapon",
                shortBio: "Anti-apartheid revolutionary who became South Africa's first Black president",
                era: "Modern",
                fields: ["Politics", "Human Rights"],
                lifespan: "1918 - 2013",
                imagePath: "assets/images/figures/nelson-mandela.jpg",
                imageFilename: "nelson-mandela.jpg",
                connections: ["Desmond Tutu", "Oliver Tambo"]
            },
            {
                id: 3,
                name: "Bob Marley",
                birthYear: 1945,
                deathYear: 1981,
                isAlive: false,
                achievement: "Reggae legend and Rastafarian icon",
                famousQuote: "One love, one heart",
                shortBio: "Reggae musician who brought Jamaican music and Rastafarian beliefs to global audiences",
                era: "Modern",
                fields: ["Music", "Spirituality"],
                lifespan: "1945 - 1981",
                imagePath: "assets/images/figures/bob-marley.jpg",
                imageFilename: "bob-marley.jpg",
                connections: ["Peter Tosh", "Jimmy Cliff"]
            },
            {
                id: 4,
                name: "Chinua Achebe",
                birthYear: 1930,
                deathYear: 2013,
                isAlive: false,
                achievement: "Author of 'Things Fall Apart'",
                famousQuote: "If you don't like someone's story, write your own",
                shortBio: "Nigerian novelist who revolutionized African literature in English",
                era: "Modern",
                fields: ["Literature", "Education"],
                lifespan: "1930 - 2013",
                imagePath: "assets/images/figures/chinua-achebe.jpg",
                imageFilename: "chinua-achebe.jpg",
                connections: ["Wole Soyinka", "Ngugi wa Thiong'o"]
            },
            {
                id: 5,
                name: "Wangari Maathai",
                birthYear: 1940,
                deathYear: 2011,
                isAlive: false,
                achievement: "First African woman Nobel Peace Prize winner",
                famousQuote: "When we plant trees, we plant the seeds of peace",
                shortBio: "Environmental activist and Nobel laureate who founded the Green Belt Movement",
                era: "Contemporary",
                fields: ["Activism", "Environment"],
                lifespan: "1940 - 2011",
                imagePath: "assets/images/figures/wangari-maathai.jpg",
                imageFilename: "wangari-maathai.jpg",
                connections: ["Vandana Shiva", "Al Gore"]
            },
            {
                id: 6,
                name: "Barack Obama",
                birthYear: 1961,
                deathYear: null,
                isAlive: true,
                achievement: "First African American U.S. President",
                famousQuote: "Yes we can",
                shortBio: "44th President of the United States and bestselling author",
                era: "Contemporary",
                fields: ["Politics", "Law"],
                lifespan: "1961 - present",
                imagePath: "assets/images/figures/barack-obama.jpg",
                imageFilename: "barack-obama.jpg",
                connections: ["Michelle Obama", "Nelson Mandela"]
            },
            {
                id: 7,
                name: "Oprah Winfrey",
                birthYear: 1954,
                deathYear: null,
                isAlive: true,
                achievement: "Media mogul and philanthropist",
                famousQuote: "The biggest adventure you can take is to live the life of your dreams",
                shortBio: "Media executive, actress, and philanthropist who revolutionized television",
                era: "Contemporary",
                fields: ["Media", "Philanthropy"],
                lifespan: "1954 - present",
                imagePath: "assets/images/figures/oprah-winfrey.jpg",
                imageFilename: "oprah-winfrey.jpg",
                connections: ["Maya Angelou", "Gayle King"]
            },
            {
                id: 8,
                name: "Marcus Garvey",
                birthYear: 1887,
                deathYear: 1940,
                isAlive: false,
                achievement: "Founder of UNIA and Black nationalism leader",
                famousQuote: "A people without knowledge of their past is like a tree without roots",
                shortBio: "Pan-Africanist leader who promoted Black pride and economic independence",
                era: "Colonial",
                fields: ["Activism", "Politics"],
                lifespan: "1887 - 1940",
                imagePath: "assets/images/figures/marcus-garvey.jpg",
                imageFilename: "marcus-garvey.jpg",
                connections: ["W.E.B. Du Bois", "Amy Jacques Garvey"]
            }
        ];
    }

    /**
     * Cleanup method
     */
    cleanup() {
        this.pauseAutoRotation();
        this.closeModal();
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Clear timeouts
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        
        console.log('🧹 Cultural Figures Manager cleaned up');
    }
}

/**
 * Initialize Cultural Figures Manager with proper processor dependency
 */
function initializeCulturalFiguresManager() {
    // Only initialize on homepage or if specifically requested
    const shouldInitialize = window.location.pathname === '/' || 
                            window.location.pathname === '/index.html' ||
                            window.location.pathname.endsWith('/') ||
                            document.querySelector('.cultural-figures-preview');
    
    if (shouldInitialize) {
        console.log('🎭 Initializing Smooth Cultural Figures Manager...');
        window.culturalFiguresManager = new CulturalFiguresManager();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (window.culturalFiguresManager) {
                window.culturalFiguresManager.cleanup();
            }
        });
    }
}

// Wait for either the processor ready event or DOM + processor ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.figureCsvProcessorReady) {
        // Processor is already ready
        initializeCulturalFiguresManager();
    } else {
        // Wait for processor ready event
        document.addEventListener('figureCsvProcessorReady', function() {
            console.log('✅ Received processor ready event, initializing smooth cultural figures manager');
            initializeCulturalFiguresManager();
        }, { once: true });
    }
});

/**
 * Export for module use
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CulturalFiguresManager;
}