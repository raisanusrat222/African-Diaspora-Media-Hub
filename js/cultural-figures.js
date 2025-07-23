// enhanced with AI Integration for Gap-Filling

/**
 * Cultural Figures Manager - Enhanced with AI Integration
 */
class CulturalFiguresManager {
    constructor() {
        this.figures = [];
        this.currentIndex = 0;
        this.visibleCards = 4; // Always show 4 cards
        this.isAutoRotating = true;
        this.autoRotateInterval = null;
        this.autoRotateDelay = 10000; 
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    async init() {
        try {
            console.log('🎭 Initializing Enhanced Cultural Figures Manager...');

            // Initialize AI service first
            this.initializeAIService();

            // Wait for CSV processor to be ready
            await this.waitForProcessor();
            console.log('✅ CSV processor ready');

            // Load figures data
            await this.loadFigures();
            console.log(`✅ Loaded ${this.figures.length} figures`);

            // Only set up if on homepage
            if (this.isHomepage()) {
                console.log('✅ Homepage detected, using existing cultural figures section');

                // Check if the section exists in DOM
                const existingSection = document.getElementById('cultural-figures-section');
                if (existingSection) {
                    this.renderFigures();
                    this.setupEventHandlers();
                    this.startAutoRotation();
                    console.log('✅ Enhanced carousel initialized in existing section');
                } else {
                    console.warn('⚠️ No cultural figures section found in HTML. Skipping setup.');
                }
            } else {
                console.log('ℹ️ Not on homepage, skipping cultural figures setup');
            }

            console.log('🎭 Enhanced Cultural Figures Manager initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Cultural Figures Manager:', error);
            this.showError();
        }
    }

    // NEW: Initialize AI service
    initializeAIService() {
        console.log('🤖 Initializing AI service for cultural figures...');
        
        const apiKey = this.getAPIKey();
        
        if (apiKey && window.DiasporaAI) {
            try {
                window.DiasporaAI.initialize(apiKey);
                console.log('✅ AI service initialized for cultural figures');
            } catch (error) {
                console.error('❌ Failed to initialize AI service:', error);
            }
        } else {
            console.log('⚠️ API key not found or DiasporaAI not available for cultural figures');
        }
    }

    // NEW: Get API key using your config pattern
    getAPIKey() {
        if (window.CONFIG && window.CONFIG.OPENAI_API_KEY) {
            return window.CONFIG.OPENAI_API_KEY;
        }
        return null;
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
     * Create individual figure card with improved image handling
     */
    createFigureCard(figure, index) {
        const card = document.createElement('div');
        card.className = 'figure-card';
        card.dataset.era = figure.era.toLowerCase();
        card.dataset.index = index;
        card.dataset.figureId = figure.id;

        // Create portrait with better error handling
        const portraitHTML = this.createPortraitHTML(figure);

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

        return card;
    }

    /**
     * Create portrait HTML with improved fallback handling
     */
createPortraitHTML(figure) {
    // Check if we have a valid image path
    if (figure.imagePath && figure.imagePath !== 'assets/images/figures/placeholder.jpg') {
        return `
            <div class="figure-portrait">
                <img src="${figure.imagePath}" 
                     alt="${figure.name}" 
                     loading="lazy" 
                     onload="this.style.opacity = '1';"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="figure-portrait-placeholder" style="display: none;" title="${figure.name}">
                    ${this.getInitials(figure.name)}
                </div>
            </div>
        `;
    } else {
        // Use placeholder directly
        return `
            <div class="figure-portrait-placeholder" title="${figure.name}">
                ${this.getInitials(figure.name)}
            </div>
        `;
    }
}

     // Get initials for placeholder
    getInitials(name) {
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

     // Create navigation dots based on the number of slides
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
     * ENHANCED: AI-powered figure interactions with gap-filling
     */
    async showFigureDetails(figureId) {
        try {
            console.log('🔍 Showing AI-enhanced figure details for ID:', figureId);
            
            const figure = await window.figureCsvProcessor.getFigureById(figureId);
            if (!figure) {
                console.error('Figure not found:', figureId);
                this.showErrorModal('Figure not found');
                return;
            }

            console.log('✅ Figure found:', figure.name);

            // Show loading state
            this.showModal('figure-details', this.getLoadingModalHTML(figure.name));

            // Identify gaps in figure data
            const gaps = this.identifyFigureGaps(figure);
            console.log('📊 Identified data gaps:', gaps);

            // Start with existing data
            let enhancedBio = figure.shortBio;
            let modernRelevance = '';
            let culturalImpact = '';
            let personalLife = '';

            // ENHANCED: AI gap-filling if service is available
            if (window.DiasporaAI && window.DiasporaAI.isInitialized) {
                try {
                    console.log('🤖 Generating AI-enhanced content for', figure.name);
                    
                    // Enhanced biography with gap-filling
                    if (gaps.includes('detailed_biography') || figure.shortBio.length < 100) {
                        const bioPrompt = `Write a compelling 250-word biography of ${figure.name}, ${figure.achievement}. Include:
                        - Their early life and background in ${figure.heritage || figure.region}
                        - Key accomplishments in ${figure.primaryField}
                        - Their impact on the African diaspora community
                        - What made them unique in the ${figure.era} era
                        
                        Base this on historical facts. Write in an engaging, informative style.`;

                        enhancedBio = await window.DiasporaAI.callOpenAI(bioPrompt, 400, 0.7);
                        console.log('✅ Enhanced biography generated');
                    }

                    // Modern relevance (always generate)
                    const relevancePrompt = `In 2-3 sentences, explain why ${figure.name} remains relevant to African diaspora communities today. Focus on:
                    - Their lasting impact on ${figure.primaryField}
                    - Lessons for current generations
                    - How their work influences modern movements
                    
                    Write in an engaging, contemporary style.`;
                    
                    modernRelevance = await window.DiasporaAI.callOpenAI(relevancePrompt, 150, 0.7);

                    // Cultural impact analysis
                    if (gaps.includes('cultural_impact')) {
                        const impactPrompt = `Analyze ${figure.name}'s cultural impact on the African diaspora in 100-150 words. Focus on:
                        - How they changed perceptions or opened doors
                        - Their influence on other artists/leaders/activists
                        - What traditions or movements they started
                        
                        Be specific about their contributions to diaspora culture.`;
                        
                        culturalImpact = await window.DiasporaAI.callOpenAI(impactPrompt, 200, 0.7);
                    }

                    // Personal life details (if missing)
                    if (gaps.includes('personal_details')) {
                        const personalPrompt = `Provide interesting personal details about ${figure.name} in 2-3 sentences:
                        - Their personality traits or characteristics
                        - Lesser-known facts about their life
                        - Their relationships with family or other notable figures
                        
                        Keep it factual and respectful.`;
                        
                        personalLife = await window.DiasporaAI.callOpenAI(personalPrompt, 120, 0.7);
                    }

                    console.log('✅ All AI content generated successfully');

                } catch (aiError) {
                    console.warn('⚠️ AI enhancement failed, using static content:', aiError);
                    // Continue with static content
                }
            } else {
                console.log('ℹ️ AI service not available, using static content with fallback enhancements');
                modernRelevance = this.getFallbackModernRelevance(figure);
                if (gaps.length > 0) {
                    culturalImpact = this.getFallbackCulturalImpact(figure);
                }
            }

            // Update modal with enhanced content
            this.showModal('figure-details', this.getEnhancedFigureDetailsHTML(figure, {
                biography: enhancedBio,
                modernRelevance,
                culturalImpact,
                personalLife,
                gaps
            }));

        } catch (error) {
            console.error('❌ Error showing figure details:', error);
            this.showErrorModal('Could not load figure details. Please try again.');
        }
    }

    // NEW: Identify gaps in figure data
    identifyFigureGaps(figure) {
        const gaps = [];
        
        // Check for missing or minimal biography
        if (!figure.shortBio || figure.shortBio.length < 100) {
            gaps.push('detailed_biography');
        }
        
        // Check for missing personal details
        if (!figure.personalLife && !figure.shortBio.includes('born') && !figure.shortBio.includes('family')) {
            gaps.push('personal_details');
        }
        
        // Check for missing cultural impact info
        if (!figure.culturalImpact && figure.shortBio.length < 200) {
            gaps.push('cultural_impact');
        }
        
        // Check for missing modern connections
        if (figure.era !== 'Contemporary' && !figure.modernRelevance) {
            gaps.push('modern_relevance');
        }
        
        return gaps;
    }

    // NEW: Enhanced figure details modal with AI content
    getEnhancedFigureDetailsHTML(figure, aiContent) {
        const portraitHTML = this.createModalPortraitHTML(figure);
        
        return `
            <div class="modal-header">
                ${portraitHTML}
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
                    <p>${aiContent.biography}</p>
                </div>

                ${aiContent.personalLife ? `
                    <div class="modal-personal-details">
                        <h3>Personal Life</h3>
                        <p>${aiContent.personalLife}</p>
                    </div>
                ` : ''}

                ${aiContent.culturalImpact ? `
                    <div class="modal-cultural-impact">
                        <h3>Cultural Impact</h3>
                        <p>${aiContent.culturalImpact}</p>
                    </div>
                ` : ''}
                
                ${aiContent.modernRelevance ? `
                    <div class="modal-ai-insights">
                        <h3><i class="fas fa-lightbulb"></i> Why ${figure.name} Matters Today</h3>
                        <p>${aiContent.modernRelevance}</p>
                    </div>
                ` : ''}

                ${aiContent.gaps.length > 0 ? `
                    <div class="modal-enhancement-note">
                        <i class="fas fa-magic"></i>
                        <span>Enhanced with AI insights${window.DiasporaAI && window.DiasporaAI.isInitialized ? '' : ' and curated content'}</span>
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

    // NEW: Fallback content for when AI is not available
    getFallbackModernRelevance(figure) {
        const relevanceMap = {
            'Maya Angelou': 'Angelou\'s powerful storytelling and advocacy for civil rights continue to inspire writers and activists today, particularly in movements for social justice and equality.',
            'Nelson Mandela': 'Mandela\'s principles of reconciliation and peaceful resistance remain a guiding light for modern democracy movements and conflict resolution worldwide.',
            'Bob Marley': 'Marley\'s message of unity and spiritual consciousness through reggae music continues to influence global peace movements and cultural identity preservation.',
            'Chinua Achebe': 'Achebe\'s literary legacy shows African writers how to reclaim narrative power and challenge Western stereotypes in contemporary literature.',
            'Marcus Garvey': 'Garvey\'s Pan-African philosophy and Black pride message resonate strongly with modern movements for African unity and diaspora empowerment.'
        };
        
        return relevanceMap[figure.name] || `${figure.name}'s contributions to ${figure.primaryField} continue to influence modern African diaspora communities, inspiring new generations to preserve their cultural heritage while building bridges across cultures.`;
    }

    getFallbackCulturalImpact(figure) {
        return `${figure.name} significantly shaped ${figure.primaryField} within the African diaspora, opening doors for future generations and establishing important cultural precedents that continue to influence communities worldwide.`;
    }

    async showConnections(figureId) {
        try {
            console.log('🔗 Showing enhanced connections for figure ID:', figureId);
            
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

            // ENHANCED: Generate AI explanations for connections
            if (window.DiasporaAI && window.DiasporaAI.isInitialized && connections.length > 0) {
                try {
                    const connectionNames = connections.map(c => c.name).join(', ');
                    const prompt = `Explain the relationships between ${figure.name} and these historical figures: ${connectionNames}. 
                    
                    For each connection, briefly describe:
                    - How they knew each other or were connected (personally, professionally, or ideologically)
                    - What they shared in common (movements, ideas, time periods, goals)
                    - How their relationship impacted the African diaspora community
                    
                    Focus on historical accuracy. Keep each explanation to 2-3 sentences. Write in an engaging, informative style.`;

                    connectionInsights = await window.DiasporaAI.callOpenAI(prompt, 400, 0.7);
                    console.log('✅ AI connection analysis generated');

                } catch (aiError) {
                    console.warn('⚠️ AI connection analysis failed:', aiError);
                    connectionInsights = this.getFallbackConnectionInsights(figure, connections);
                }
            } else if (connections.length > 0) {
                connectionInsights = this.getFallbackConnectionInsights(figure, connections);
            }

            // Update modal with connections
            this.showModal('figure-connections', this.getConnectionsHTML(figure, connections, connectionInsights));

        } catch (error) {
            console.error('❌ Error showing connections:', error);
            this.showErrorModal('Could not load figure connections. Please try again.');
        }
    }

    // NEW: Fallback connection insights
    getFallbackConnectionInsights(figure, connections) {
        if (connections.length === 0) return '';
        
        const connectionNames = connections.map(c => c.name).join(' and ');
        return `${figure.name} shared important connections with ${connectionNames} through their work in ${figure.primaryField} and their shared commitment to African diaspora empowerment. These relationships helped shape cultural and social movements that continue to influence communities today.`;
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

    /**
     * Create modal portrait HTML with better fallback
     */
    createModalPortraitHTML(figure) {
        if (figure.imagePath && figure.imagePath !== 'assets/images/figures/placeholder.jpg') {
            return `
                <div class="modal-figure-portrait">
                    <img src="${figure.imagePath}" 
                         alt="${figure.name}" 
                         onerror="this.style.display='none'; this.parentElement.innerHTML = '<div class=\\"modal-portrait-placeholder\\">${this.getInitials(figure.name)}</div>'">
                </div>
            `;
        } else {
            return `
                <div class="modal-portrait-placeholder">
                    ${this.getInitials(figure.name)}
                </div>
            `;
        }
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
                                    ${this.createConnectionPortraitHTML(connected)}
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
                            <h3><i class="fas fa-brain"></i> Connection Analysis</h3>
                            <div class="ai-insights-content">${aiInsights}</div>
                        </div>
                    ` : ''}
                ` : `
                    <div class="no-connections">
                        <i class="fas fa-users"></i>
                        <h3>No Direct Connections Found</h3>
                        <p>This figure's connections haven't been mapped yet, but they contributed significantly to the broader diaspora community.</p>
                        
                        ${window.DiasporaAI && window.DiasporaAI.isInitialized ? `
                            <button class="modal-btn primary" onclick="culturalFiguresManager.suggestConnections('${figure.name}', ${figure.id})">
                                <i class="fas fa-lightbulb"></i>
                                Suggest Possible Connections
                            </button>
                        ` : ''}
                    </div>
                `}
            </div>
        `;
    }

    // NEW: AI-powered connection suggestions
    async suggestConnections(figureName, figureId) {
        try {
            console.log('💡 Generating connection suggestions for:', figureName);
            
            const figure = await window.figureCsvProcessor.getFigureById(figureId);
            if (!figure) return;

            // Update modal with loading state
            const modal = document.querySelector('.modal-body .no-connections');
            if (modal) {
                modal.innerHTML = `
                    <div class="traditional-loading-container">
                        <div class="adinkra-loader"></div>
                        <p class="loading-text">Finding possible connections...</p>
                        <p class="loading-subtext">Analyzing historical relationships</p>
                    </div>
                `;
            }

            if (window.DiasporaAI && window.DiasporaAI.isInitialized) {
                const prompt = `Based on ${figure.name}'s life (${figure.lifespan}), work in ${figure.primaryField}, and ${figure.era} era background, suggest 3-4 historical figures from the African diaspora they might have known, influenced, or been influenced by.

                For each suggestion, provide:
                - The person's name and brief description
                - How they might have connected (shared time period, location, field, or movements)
                - Why this connection would be significant
                
                Focus on historically plausible connections. Write in a clear, informative style.`;

                const suggestions = await window.DiasporaAI.callOpenAI(prompt, 350, 0.7);

                // Update modal with suggestions
                if (modal) {
                    modal.innerHTML = `
                        <div class="connection-suggestions">
                            <i class="fas fa-lightbulb"></i>
                            <h3>Possible Historical Connections</h3>
                            <p class="suggestions-intro">Based on ${figure.name}'s era and work, here are some figures they might have known or influenced:</p>
                            <div class="ai-suggestions-content">${suggestions}</div>
                            <div class="suggestions-disclaimer">
                                <i class="fas fa-info-circle"></i>
                                <span>These are AI-generated suggestions based on historical analysis. Actual connections may vary.</span>
                            </div>
                        </div>
                    `;
                }
            }

        } catch (error) {
            console.error('❌ Error generating connection suggestions:', error);
            if (modal) {
                modal.innerHTML = `
                    <div class="no-connections">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Could not generate suggestions</h3>
                        <p>Unable to analyze possible connections at this time. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    /**
     * Create connection portrait HTML
     */
    createConnectionPortraitHTML(connected) {
        if (connected.imagePath && connected.imagePath !== 'assets/images/figures/placeholder.jpg') {
            return `<img src="${connected.imagePath}" alt="${connected.name}" onerror="this.parentElement.innerHTML = '<div class=\\"connection-placeholder\\">${this.getInitials(connected.name)}</div>'">`;
        } else {
            return `<div class="connection-placeholder">${this.getInitials(connected.name)}</div>`;
        }
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
     * Enhanced fallback figures with proper image handling
     */
    getFallbackFigures() {
        return [
            {
                id: 1,
                name: "Maya Angelou",
                birthYear: 1928,
                deathYear: 2014,
                isAlive: false,
                achievement: "Renowned poet, memoirist, and civil rights activist",
                famousQuote: "There is no greater agony than bearing an untold story inside you.",
                shortBio: "Maya Angelou was an American poet, memoirist, and civil rights activist. She published seven autobiographies, three books of essays, several books of poetry, and is credited with a list of plays, movies, and television shows spanning over 50 years.",
                era: "Modern",
                fields: ["Literature", "Civil Rights"],
                lifespan: "1928 - 2014",
                imagePath: "assets/images/figures/maya-angelou.jpg",
                imageFilename: "maya-angelou.jpg",
                connections: ["James Baldwin", "Martin Luther King Jr."],
                heritage: "African American",
                region: "United States",
                primaryField: "Literature"
            },
            {
                id: 2,
                name: "Nelson Mandela",
                birthYear: 1918,
                deathYear: 2013,
                isAlive: false,
                achievement: "Anti-apartheid revolutionary and South African President",
                famousQuote: "Education is the most powerful weapon which you can use to change the world.",
                shortBio: "Nelson Rolihlahla Mandela was a South African anti-apartheid revolutionary, political leader, and philanthropist who served as President of South Africa from 1994 to 1999.",
                era: "Modern",
                fields: ["Politics", "Human Rights"],
                lifespan: "1918 - 2013",
                imagePath: "assets/images/figures/nelson-mandela.jpg",
                imageFilename: null,
                connections: ["Desmond Tutu", "Oliver Tambo"],
                heritage: "Xhosa",
                region: "South Africa",
                primaryField: "Politics"
            },
            {
                id: 3,
                name: "Bob Marley",
                birthYear: 1945,
                deathYear: 1981,
                isAlive: false,
                achievement: "Reggae legend and global cultural icon",
                famousQuote: "One love, one heart, let's get together and feel all right.",
                shortBio: "Robert Nesta Marley was a Jamaican singer, songwriter, and musician. Considered one of the pioneers of reggae, his musical career was marked by fusing elements of reggae, ska, and rocksteady.",
                era: "Modern",
                fields: ["Music", "Spirituality"],
                lifespan: "1945 - 1981",
                imagePath: null,
                imageFilename: null,
                connections: ["Peter Tosh", "Jimmy Cliff"],
                heritage: "Jamaican",
                region: "Jamaica",
                primaryField: "Music"
            },
            {
                id: 4,
                name: "Chinua Achebe",
                birthYear: 1930,
                deathYear: 2013,
                isAlive: false,
                achievement: "Author of 'Things Fall Apart' and literary pioneer",
                famousQuote: "If you don't like someone's story, write your own.",
                shortBio: "Chinua Achebe was a Nigerian novelist, poet, professor, and critic. His first novel Things Fall Apart is the most widely read book in modern African literature.",
                era: "Modern",
                fields: ["Literature", "Education"],
                lifespan: "1930 - 2013",
                imagePath: null,
                imageFilename: null,
                connections: ["Wole Soyinka", "Ngugi wa Thiong'o"],
                heritage: "Igbo",
                region: "Nigeria",
                primaryField: "Literature"
            },
            {
                id: 5,
                name: "Wangari Maathai",
                birthYear: 1940,
                deathYear: 2011,
                isAlive: false,
                achievement: "First African woman to receive the Nobel Peace Prize",
                famousQuote: "When we plant trees, we plant the seeds of peace and seeds of hope.",
                shortBio: "Wangari Muta Maathai was a Kenyan social, environmental, and political activist and the first African woman to win the Nobel Peace Prize.",
                era: "Contemporary",
                fields: ["Environmental Activism", "Politics"],
                lifespan: "1940 - 2011",
                imagePath: null,
                imageFilename: null,
                connections: ["Vandana Shiva", "Al Gore"],
                heritage: "Kikuyu",
                region: "Kenya",
                primaryField: "Environmental Activism"
            },
            {
                id: 6,
                name: "Barack Obama",
                birthYear: 1961,
                deathYear: null,
                isAlive: true,
                achievement: "44th President of the United States",
                famousQuote: "Yes we can.",
                shortBio: "Barack Hussein Obama II is an American politician and attorney who served as the 44th president of the United States from 2009 to 2017.",
                era: "Contemporary",
                fields: ["Politics", "Law"],
                lifespan: "1961 - present",
                imagePath: null,
                imageFilename: null,
                connections: ["Michelle Obama", "Nelson Mandela"],
                heritage: "Kenyan-American",
                region: "United States",
                primaryField: "Politics"
            },
            {
                id: 7,
                name: "Oprah Winfrey",
                birthYear: 1954,
                deathYear: null,
                isAlive: true,
                achievement: "Media mogul and philanthropist",
                famousQuote: "The biggest adventure you can take is to live the life of your dreams.",
                shortBio: "Oprah Gail Winfrey is an American talk show host, television producer, actress, media executive, and philanthropist.",
                era: "Contemporary",
                fields: ["Media", "Philanthropy"],
                lifespan: "1954 - present",
                imagePath: null,
                imageFilename: null,
                connections: ["Maya Angelou", "Gayle King"],
                heritage: "African American",
                region: "United States",
                primaryField: "Media"
            },
            {
                id: 8,
                name: "Marcus Garvey",
                birthYear: 1887,
                deathYear: 1940,
                isAlive: false,
                achievement: "Founder of UNIA and Black nationalism leader",
                famousQuote: "A people without the knowledge of their past history, origin and culture is like a tree without roots.",
                shortBio: "Marcus Mosiah Garvey Jr. was a Jamaican political activist, publisher, journalist, entrepreneur, and orator.",
                era: "Colonial",
                fields: ["Activism", "Politics"],
                lifespan: "1887 - 1940",
                imagePath: null,
                imageFilename: null,
                connections: ["W.E.B. Du Bois", "Amy Jacques Garvey"],
                heritage: "Jamaican",
                region: "Jamaica",
                primaryField: "Activism"
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
        
        console.log('🧹 Enhanced Cultural Figures Manager cleaned up');
    }
}

/**
 * Initialize Enhanced Cultural Figures Manager
 */
function initializeCulturalFiguresManager() {
    // Only initialize on homepage or if specifically requested
    const shouldInitialize = window.location.pathname === '/' || 
                            window.location.pathname === '/index.html' ||
                            window.location.pathname.endsWith('/') ||
                            document.querySelector('.cultural-figures-preview');
    
    if (shouldInitialize) {
        console.log('🎭 Initializing Enhanced Cultural Figures Manager with AI...');
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
            console.log('✅ Received processor ready event, initializing enhanced cultural figures manager');
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