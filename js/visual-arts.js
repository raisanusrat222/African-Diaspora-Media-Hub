// js/visual-arts.js - Main controller for Visual Arts page
// Enhanced version building on existing functionality

/**
 * Main Visual Arts page controller
 * Coordinates all components: map, symbols, AI analysis, animations
 */
class VisualArtsController {
    constructor() {
        this.map = null;
        this.symbolsLoaded = false;
        this.currentModal = null;
        this.searchTimeout = null;
        this.symbolEnhancer = null;
        
        this.init();
    }

    async init() {
        console.log('🎨 Initializing Visual Arts page...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    async setup() {
        try {
            // Initialize components in order
            await this.initializeMap();
            this.initializeSymbolSearch();
            this.loadDefaultSymbols();
            this.setupEventHandlers();
            this.setupKeyboardNavigation();
            
            console.log('✅ Visual Arts page initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Visual Arts page:', error);
            this.showInitializationError();
        }
    }

    /**
     * Initialize the interactive map
     */
    async initializeMap() {
        const mapContainer = document.getElementById('world-map');
        if (!mapContainer) {
            console.warn('⚠️ Map container not found');
            return;
        }

        try {
            // Create map instance
            this.map = new ArtEvolutionMap('#world-map');
            
            // Make map globally accessible for HTML onclick handlers
            window.artEvolutionMap = this.map;
            
            console.log('🗺️ Interactive map initialized');
            
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showMapError();
        }
    }

    /**
     * Initialize symbol search functionality
     */
    initializeSymbolSearch() {
        const searchInput = document.getElementById('symbol-search-input');
        const searchBtn = document.getElementById('symbol-search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSymbolSearch(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSymbolSearch(e.target.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value : '';
                this.performSymbolSearch(query);
            });
        }

        console.log('🔍 Symbol search initialized');
    }

    /**
     * Load and display default symbols
     */
    async loadDefaultSymbols() {
        try {
            console.log('📚 Loading cultural symbols...');
            
            // Show loading state
            this.showSymbolsLoading();
            
            // Try to get symbols from enhanced processor first
            let defaultSymbols = [];
            
            if (window.AdinkraCsvProcessor) {
                try {
                    defaultSymbols = await window.AdinkraCsvProcessor.getRandomSymbols(6);
                    console.log('✅ Loaded ' + defaultSymbols.length + ' authentic symbols');
                } catch (error) {
                    console.warn('Could not load enhanced symbols, trying standard database:', error);
                }
            }
            
            // Fallback to database if processor fails
            if (defaultSymbols.length === 0) {
                if (window.SymbolDatabase && typeof window.SymbolDatabase.getRandomSymbols === 'function') {
                    defaultSymbols = await window.SymbolDatabase.getRandomSymbols(6);
                    console.log('📚 Loaded ' + defaultSymbols.length + ' symbols from database');
                } else {
                    defaultSymbols = this.getFallbackSymbols();
                    console.log('⚠️ Using fallback symbols');
                }
            }
            
            this.displaySymbols(defaultSymbols);
            this.symbolsLoaded = true;
            
        } catch (error) {
            console.error('Error loading symbols:', error);
            this.showSymbolsError();
        }
    }

    /**
     * Perform symbol search
     */
    async performSymbolSearch(query) {
        if (!query || query.trim().length < 2) {
            this.loadDefaultSymbols();
            return;
        }

        try {
            console.log('🔍 Searching for: "' + query + '"');
            
            // Show loading state
            this.showSearchLoading();
            
            let results = [];
            
            // Try enhanced search first
            if (window.AdinkraCsvProcessor) {
                try {
                    results = await window.AdinkraCsvProcessor.searchSymbols(query.trim());
                    console.log('✅ Found ' + results.length + ' matching symbols');
                } catch (error) {
                    console.warn('Enhanced search failed, trying standard search:', error);
                }
            }
            
            // Fallback to database search
            if (results.length === 0) {
                if (window.SymbolDatabase && typeof window.SymbolDatabase.searchSymbols === 'function') {
                    results = await window.SymbolDatabase.searchSymbols(query.trim());
                    console.log('📚 Found ' + results.length + ' results from database');
                } else {
                    results = [];
                }
            }
            
            this.displaySymbols(results);
            
            // Track search for AI personalization
            if (window.DiasporaAI) {
                window.DiasporaAI.trackUserInterest('symbol_search', query.trim());
            }
            
        } catch (error) {
            console.error('Error performing symbol search:', error);
            this.showSearchError();
        }
    }

    /**
     * Setup general event handlers
     */
    setupEventHandlers() {
        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('symbol-modal')) {
                this.closeSymbolModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeSymbolModal();
            }
        });

        // Featured art card interactions
        const artCards = document.querySelectorAll('.art-card');
        for (let i = 0; i < artCards.length; i++) {
            const card = artCards[i];
            card.addEventListener('click', () => {
                const origin = card.dataset.origin;
                const destination = card.dataset.destination;
                
                if (origin && destination && this.map) {
                    this.triggerMapEvolution(origin, destination);
                }
            });
        }

        // Window resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        console.log('🎛️ Event handlers setup complete');
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Symbol cards keyboard navigation will be handled in displaySymbols method
        console.log('⌨️ Keyboard navigation setup complete');
    }

    /**
     * Trigger map evolution from featured art cards
     */
    triggerMapEvolution(originCountry, destinationCountry) {
        // Scroll to map
        const mapSection = document.querySelector('.evolution-map-container');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Simulate country selection on map
        setTimeout(() => {
            if (this.map) {
                // Reset map first
                this.map.reset();
                
                // Then simulate country clicks
                setTimeout(() => {
                    this.simulateCountrySelection(originCountry, destinationCountry);
                }, 500);
            }
        }, 1000);
    }

    /**
     * Simulate country selection on map
     */
    simulateCountrySelection(originCountry, destinationCountry) {
        // This would ideally trigger the map's country selection
        // For now, we'll show a message to guide the user
        const mapContainer = document.querySelector('.evolution-map-container');
        if (mapContainer) {
            const guideMessage = document.createElement('div');
            guideMessage.className = 'selection-guide';
            guideMessage.innerHTML = '<div class="guide-content">' +
                '<i class="fas fa-hand-pointer"></i>' +
                '<p>Click on <strong>' + originCountry + '</strong> then <strong>' + destinationCountry + '</strong> to see their artistic evolution!</p>' +
            '</div>';
            
            mapContainer.appendChild(guideMessage);
            
            // Remove guide after 5 seconds
            setTimeout(() => {
                if (guideMessage.parentNode) {
                    guideMessage.parentNode.removeChild(guideMessage);
                }
            }, 5000);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update map if needed
        if (this.map && typeof this.map.handleResize === 'function') {
            this.map.handleResize();
        }

        // Update symbol grid layout if needed
        this.adjustSymbolGridLayout();
    }

    /**
     * Adjust symbol grid layout for different screen sizes
     */
    adjustSymbolGridLayout() {
        const symbolsGrid = document.getElementById('symbols-grid');
        if (!symbolsGrid) return;

        const width = window.innerWidth;
        
        if (width < 480) {
            symbolsGrid.style.gridTemplateColumns = '1fr';
        } else if (width < 768) {
            symbolsGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            symbolsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        }
    }

    /**
     * Show loading state for symbols
     */
    showSymbolsLoading() {
        const symbolsGrid = document.getElementById('symbols-grid');
        if (symbolsGrid) {
            symbolsGrid.innerHTML = '<div class="csv-loading">' +
                '<div class="loading-spinner"></div>' +
                '<div class="loading-text">Loading cultural symbols...</div>' +
                '<div class="progress-bar">' +
                    '<div class="progress-fill"></div>' +
                '</div>' +
            '</div>';
        }
    }

    /**
     * Show loading state for search
     */
    showSearchLoading() {
        const symbolsGrid = document.getElementById('symbols-grid');
        if (symbolsGrid) {
            symbolsGrid.innerHTML = '<div class="csv-loading">' +
                '<div class="loading-spinner"></div>' +
                '<div class="loading-text">Searching symbols...</div>' +
            '</div>';
        }
    }

    /**
     * Refresh symbol data from sources
     */
    async refreshSymbolData() {
        try {
            console.log('🔄 Refreshing symbol data...');
            
            // Clear cache and refresh from sources
            if (window.AdinkraCsvProcessor) {
                localStorage.removeItem('enhanced_symbols_cache');
                await window.AdinkraCsvProcessor.loadSymbolsFromCSV();
            }
            
            if (window.SymbolDatabase && typeof window.SymbolDatabase.refreshSymbolData === 'function') {
                await window.SymbolDatabase.refreshSymbolData();
            }
            
            // Reload symbols
            this.loadDefaultSymbols();
            
            // Show success message
            this.showRefreshSuccess();
            
        } catch (error) {
            console.error('Error refreshing symbol data:', error);
            this.showRefreshError();
        }
    }

    /**
     * Load symbols from cultural sources (for troubleshooting)
     */
    async loadFromCSV() {
        try {
            console.log('🔄 Loading fresh cultural data...');
            
            if (window.AdinkraCsvProcessor) {
                // Clear cache and reload
                localStorage.removeItem('enhanced_symbols_cache');
                const symbols = await window.AdinkraCsvProcessor.loadSymbolsFromCSV();
                this.displaySymbols(symbols.slice(0, 6));
                this.showRefreshSuccess();
            } else {
                throw new Error('Cultural data processor not available');
            }
            
        } catch (error) {
            console.error('Error loading fresh data:', error);
            this.showRefreshError();
        }
    }

    /**
     * Show refresh success notification
     */
    showRefreshSuccess() {
        const notification = document.createElement('div');
        notification.className = 'refresh-notification success';
        notification.innerHTML = '<div class="notification-content">' +
            '<i class="fas fa-check"></i>' +
            '<span>Symbol data refreshed successfully!</span>' +
        '</div>';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Show refresh error notification
     */
    showRefreshError() {
        const notification = document.createElement('div');
        notification.className = 'refresh-notification error';
        notification.innerHTML = '<div class="notification-content">' +
            '<i class="fas fa-exclamation-triangle"></i>' +
            '<span>Could not refresh symbol data. Please try again later.</span>' +
        '</div>';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Get fallback symbols if all else fails
     */
    getFallbackSymbols() {
        return [
            {
                name: "Gye Nyame",
                meaning: "Except for God - This symbol represents the omnipotence and supremacy of God in all affairs.",
                category: "spiritual",
                icon: "fas fa-star-and-crescent",
                country: "Ghana",
                region: "West Africa",
                type: "origin",
                description: "One of the most revered Adinkra symbols representing divine authority and eternal nature of God.",
                source: "Fallback Data"
            },
            {
                name: "Sankofa",
                meaning: "Look back and fetch it - Learn from the past to move forward wisely.",
                category: "wisdom",
                icon: "fas fa-star-and-crescent",
                country: "Ghana",
                region: "West Africa",
                type: "origin",
                description: "Represents the importance of learning from history and ancestral wisdom.",
                source: "Fallback Data"
            }
        ];
    }

    /**
     * Error handling methods
     */
    showInitializationError() {
        const container = document.querySelector('.visual-arts-container');
        if (container) {
            const errorHTML = '<div class="initialization-error">' +
                '<div class="error-content">' +
                    '<i class="fas fa-exclamation-triangle"></i>' +
                    '<h2>Page Loading Error</h2>' +
                    '<p>We\'re having trouble loading the Visual Arts page. Please refresh to try again.</p>' +
                    '<button class="btn btn-primary" onclick="location.reload()">' +
                        '<i class="fas fa-redo"></i> Refresh Page' +
                    '</button>' +
                '</div>' +
            '</div>';
            container.innerHTML = errorHTML;
        }
    }

    showMapError() {
        const mapContainer = document.querySelector('.map-wrapper');
        if (mapContainer) {
            mapContainer.innerHTML = '<div class="map-error">' +
                '<div class="error-content">' +
                    '<i class="fas fa-map"></i>' +
                    '<h3>Interactive Map Unavailable</h3>' +
                    '<p>The interactive map is temporarily unavailable. You can still explore cultural symbols below.</p>' +
                    '<button class="btn btn-small" onclick="location.reload()">' +
                        '<i class="fas fa-redo"></i> Try Again' +
                    '</button>' +
                '</div>' +
            '</div>';
        }
    }

    showSymbolsError() {
        const symbolsGrid = document.getElementById('symbols-grid');
        if (symbolsGrid) {
            symbolsGrid.innerHTML = '<div class="symbols-error">' +
                '<i class="fas fa-database"></i>' +
                '<h3>Cultural Symbols Unavailable</h3>' +
                '<p>We\'re having trouble loading the cultural symbols. This might be due to network connectivity.</p>' +
                '<div class="error-actions">' +
                    '<button class="btn btn-small" onclick="visualArtsController.loadDefaultSymbols()">' +
                        '<i class="fas fa-redo"></i> Try Again' +
                    '</button>' +
                    '<button class="btn btn-outline btn-small" onclick="visualArtsController.refreshSymbolData()">' +
                        '<i class="fas fa-sync"></i> Refresh Data' +
                    '</button>' +
                '</div>' +
            '</div>';
        }
    }

    showSearchError() {
        const symbolsGrid = document.getElementById('symbols-grid');
        if (symbolsGrid) {
            symbolsGrid.innerHTML = '<div class="search-error">' +
                '<i class="fas fa-search"></i>' +
                '<h3>Search Error</h3>' +
                '<p>There was an error performing your search. This might be due to network connectivity.</p>' +
                '<div class="error-actions">' +
                    '<button class="btn btn-small" onclick="visualArtsController.loadDefaultSymbols()">' +
                        '<i class="fas fa-home"></i> Load Default Symbols' +
                    '</button>' +
                    '<button class="btn btn-outline btn-small" onclick="visualArtsController.refreshSymbolData()">' +
                        '<i class="fas fa-sync"></i> Refresh Data' +
                    '</button>' +
                '</div>' +
            '</div>';
        }
    }

    /**
     * Utility methods
     */
    isValidCountry(countryName) {
        if (window.CountryMappings) {
            return window.CountryMappings.isValidCountry(countryName);
        }
        return false;
    }

    getCountryType(countryName) {
        if (window.CountryMappings) {
            return window.CountryMappings.getCountryType(countryName);
        }
        return 'other';
    }

    /**
     * Analytics and tracking
     */
    trackUserAction(action, details) {
        if (!details) {
            details = {};
        }

        if (window.DiasporaAI) {
            const trackingData = {
                action: action,
                details: details,
                timestamp: Date.now(),
                page: 'visual-arts'
            };
            window.DiasporaAI.trackUserInterest('visual_arts_action', JSON.stringify(trackingData));
        }

        // Also send to analytics if available
        if (window.Analytics) {
            const analyticsData = {
                action: action
            };
            // Merge details into analytics data
            for (const key in details) {
                if (details.hasOwnProperty(key)) {
                    analyticsData[key] = details[key];
                }
            }
            window.Analytics.track('visual_arts_interaction', analyticsData);
        }
    }

    /**
     * Public API methods for external use
     */
    searchSymbols(query) {
        this.performSymbolSearch(query);
    }

    showSymbol(symbolName) {
        if (window.SymbolDatabase && typeof window.SymbolDatabase.getAllSymbols === 'function') {
            window.SymbolDatabase.getAllSymbols().then(symbols => {
                const symbol = symbols.find(s => s.name.toLowerCase() === symbolName.toLowerCase());
                if (symbol) {
                    this.showEnhancedSymbolModal(symbol);
                }
            }).catch(error => {
                console.error('Error finding symbol:', error);
            });
        }
    }

    exploreEvolution(originCountry, destinationCountry) {
        this.triggerMapEvolution(originCountry, destinationCountry);
    }

    /**
     * Close symbol modal
     */
    closeSymbolModal() {
        const modal = this.currentModal || document.getElementById('symbol-modal');
        if (!modal) return;

        if (window.ArtAnimations) {
            window.ArtAnimations.trigger('symbolModal', modal, { show: false });
        } else {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        this.currentModal = null;
    }

    /**
     * Cleanup method
     */
    cleanup() {
        // Clear timeouts
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Cleanup map
        if (this.map && typeof this.map.cleanup === 'function') {
            this.map.cleanup();
        }

        // Cleanup animations
        if (window.ArtAnimations && typeof window.ArtAnimations.cleanup === 'function') {
            window.ArtAnimations.cleanup();
        }

        console.log('🧹 Visual Arts controller cleaned up');
    }
}

// ===== YOUR EXISTING ENHANCED SYMBOL FUNCTIONS =====
// These are preserved exactly as you provided them

/**
 * Display symbols with clean card design - enhanced content only in modal
 */
VisualArtsController.prototype.displaySymbols = function(symbols) {
    const symbolsGrid = document.getElementById('symbols-grid');
    if (!symbolsGrid) return;

    if (symbols.length === 0) {
        symbolsGrid.innerHTML = '<div class="no-symbols-message">' +
            '<i class="fas fa-search"></i>' +
            '<h3>No Symbols Found</h3>' +
            '<p>Try searching for different terms like country names, meanings, or categories.</p>' +
            '<div class="error-actions">' +
                '<button class="btn btn-small" onclick="visualArtsController.refreshSymbolData()">' +
                    '<i class="fas fa-sync"></i> Refresh Symbols' +
                '</button>' +
                '<button class="btn btn-outline btn-small" onclick="visualArtsController.loadFromCSV()">' +
                    '<i class="fas fa-refresh"></i> Reload Data' +
                '</button>' +
            '</div>' +
        '</div>';
        return;
    }

    // Clear the grid
    symbolsGrid.innerHTML = '';
    
    // Create CLEAN symbol cards - no enhanced content here
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        const cardElement = this.createCleanSymbolCard(symbol);
        symbolsGrid.appendChild(cardElement);
    }

    // Add click handlers to all cards
    const symbolCards = symbolsGrid.querySelectorAll('.symbol-card');
    for (let i = 0; i < symbolCards.length; i++) {
        const card = symbolCards[i];
        const symbolName = card.querySelector('h3').textContent;
        const symbol = symbols.find(s => s.name === symbolName);
        
        if (symbol) {
            card.addEventListener('click', () => {
                this.showEnhancedSymbolModal(symbol);
            });
            
            // Make card keyboard accessible
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'View details for ' + symbol.name);
            
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showEnhancedSymbolModal(symbol);
                }
            });
        }
    }

    // Animate cards appearance
    if (window.gsap) {
        const cards = symbolsGrid.querySelectorAll('.symbol-card');
        for (let i = 0; i < cards.length; i++) {
            gsap.fromTo(cards[i], 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, delay: i * 0.1 }
            );
        }
    }

    console.log(`📊 Displayed ${symbols.length} clean symbol cards`);
};

/**
 * Create CLEAN symbol card - only basic info, no enhanced sections
 */
VisualArtsController.prototype.createCleanSymbolCard = function(symbol) {
    const card = document.createElement('div');
    card.className = 'symbol-card';
    card.setAttribute('data-category', symbol.category || 'cultural');
    
    // Determine source type and create badges
    let badges = '';
    let sourceType = 'traditional';
    let originText = '';
    
    if (symbol.source && symbol.source.indexOf('AI Enhanced') !== -1) {
        originText = '🌟 AI Enhanced Cultural Analysis';
        sourceType = 'enhanced';
        badges += '<div class="ai-enhanced-badge"><i class="fas fa-sparkles"></i> Enhanced</div>';
        card.setAttribute('data-ai-enhanced', 'true');
    } else if (symbol.source && symbol.source.indexOf('CSV') !== -1) {
        originText = '📚 Authentic Cultural Source';
        sourceType = 'authentic';
        badges += '<div class="csv-source-badge"><i class="fas fa-certificate"></i> Authentic</div>';
    } else if (symbol.source && symbol.source.indexOf('adinkrasymbols.org') !== -1) {
        originText = '🌐 Live Cultural Resource';
        sourceType = 'live';
        badges += '<div class="quality-badge"><i class="fas fa-star"></i> Verified</div>';
    } else if (symbol.originalOrigin) {
        originText = 'Adapted from ' + symbol.originalOrigin;
        sourceType = 'adapted';
    } else {
        originText = 'Traditional ' + (symbol.country || 'Cultural') + ' Symbol';
    }

    card.setAttribute('data-source', sourceType);

    // Create symbol icon content
    let iconContent = '';
    if (symbol.svgPattern) {
        iconContent = symbol.svgPattern;
    } else if (symbol.unicode) {
        iconContent = '<div class="unicode-display">' + symbol.unicode + '</div>';
    } else {
        iconContent = '<i class="' + (symbol.icon || 'fas fa-star-and-crescent') + '"></i>';
    }

    // CLEAN CARD STRUCTURE - only basic info
    card.innerHTML = badges +
        '<div class="symbol-icon ' + (symbol.svgPattern ? 'has-svg' : '') + '">' +
            iconContent +
        '</div>' +
        '<h3>' + (symbol.name || 'Unknown Symbol') + '</h3>' +
        '<p>' + (symbol.meaning || symbol.description || 'Cultural symbol with deep significance') + '</p>' +
        '<div class="symbol-origin">' + originText + '</div>';

    // Add AI enhancement button if handler is available
    if (window.aiEnhancementHandler && !symbol.aiEnhanced) {
        window.aiEnhancementHandler.addEnhancementButton(card, symbol);
    }

    return card;
};

/**
 * Show ENHANCED modal with all the rich content
 */
VisualArtsController.prototype.showEnhancedSymbolModal = function(symbol) {
    const modal = document.getElementById('symbol-modal');
    if (!modal) return;

    // Get enhanced version if available
    let displaySymbol = symbol;
    if (window.aiEnhancementHandler) {
        displaySymbol = window.aiEnhancementHandler.getSymbolForModal(symbol);
    }

    // Create enhanced modal content structure
    this.createEnhancedModalStructure();
    
    // Update modal with enhanced content
    this.updateEnhancedModalContent(displaySymbol);
    
    // Show modal with animation
    modal.classList.add('show');
    modal.style.display = 'flex';
    
    if (window.ArtAnimations) {
        window.ArtAnimations.trigger('symbolModal', modal, { show: true });
    }

    this.currentModal = modal;
    
    // Track symbol viewing for AI personalization
    if (window.DiasporaAI) {
        window.DiasporaAI.trackUserInterest('symbol_view', displaySymbol.name);
    }

    console.log('👁️ Viewing enhanced symbol modal: ' + displaySymbol.name);
};

/**
 * Create enhanced modal structure with all sections
 */
VisualArtsController.prototype.createEnhancedModalStructure = function() {
    const modal = document.getElementById('symbol-modal');
    if (!modal) return;

    // Enhanced modal structure
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="closeSymbolModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="symbol-detail">
                <div class="symbol-visual">
                    <div class="symbol-icon" id="modal-symbol-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3 id="modal-symbol-name">Symbol Name</h3>
                </div>
                <div class="symbol-info" id="modal-symbol-info">
                    <!-- Enhanced sections will be inserted here -->
                </div>
            </div>
        </div>
    `;
};

/**
 * Update modal with enhanced content using SymbolEnhancer-style sections
 */
VisualArtsController.prototype.updateEnhancedModalContent = function(symbol) {
    const elements = {
        icon: document.getElementById('modal-symbol-icon'),
        name: document.getElementById('modal-symbol-name'),
        info: document.getElementById('modal-symbol-info')
    };

    // Update icon with enhanced styling
    if (elements.icon) {
        if (symbol.svgPattern) {
            elements.icon.innerHTML = symbol.svgPattern;
            elements.icon.classList.add('has-svg');
        } else if (symbol.unicode) {
            elements.icon.innerHTML = '<div class="unicode-display">' + symbol.unicode + '</div>';
        } else {
            elements.icon.innerHTML = '<i class="' + (symbol.icon || 'fas fa-star-and-crescent') + '"></i>';
        }
    }

    if (elements.name) {
        elements.name.textContent = symbol.name || 'Unknown Symbol';
    }

    // Create enhanced content sections
    if (elements.info) {
        elements.info.innerHTML = this.generateEnhancedModalSections(symbol);
    }

    // Add interactive functionality
    this.addModalInteractivity();
};

/**
 * Generate all enhanced sections for the modal
 */
VisualArtsController.prototype.generateEnhancedModalSections = function(symbol) {
    let sections = '';

    // 1. Traditional Meaning Section
    sections += this.createTraditionalMeaningSection(symbol);

    // 2. Philosophical Significance Section
    sections += this.createPhilosophicalSection(symbol);

    // 3. Cultural Origin Section
    sections += this.createCulturalOriginSection(symbol);

    // 4. Historical Context Section
    sections += this.createHistoricalContextSection(symbol);

    // 5. Sacred Usage Section
    sections += this.createSacredUsageSection(symbol);

    // 6. Diaspora Evolution Section
    if (symbol.diasporaEvolution || symbol.adaptation) {
        sections += this.createDiasporaEvolutionSection(symbol);
    }

    // 7. Modern Applications Section
    sections += this.createModernApplicationsSection(symbol);

    // 8. Related Proverbs Section
    sections += this.createRelatedProverbsSection(symbol);

    // 9. Visual Elements Section
    if (symbol.visualElements) {
        sections += this.createVisualElementsSection(symbol);
    }

    // 10. Symbol Connections Section
    sections += this.createSymbolConnectionsSection(symbol);

    return sections;
};

/**
 * Create Traditional Meaning section
 */
VisualArtsController.prototype.createTraditionalMeaningSection = function(symbol) {
    const meaning = symbol.meaning || symbol.description || 'Traditional cultural symbol with deep significance';
    
    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-scroll"></i>
                Traditional Meaning
            </div>
            <div class="symbol-section-content">
                ${meaning}
            </div>
        </div>
    `;
};

/**
 * Create Philosophical Significance section
 */
VisualArtsController.prototype.createPhilosophicalSection = function(symbol) {
    const philosophical = this.generatePhilosophicalSignificance(symbol);
    if (!philosophical) return '';

    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-lightbulb"></i>
                Philosophical Significance
            </div>
            <div class="symbol-section-content symbol-expandable" id="philosophical-${this.sanitizeId(symbol.name)}">
                ${philosophical}
            </div>
            <button class="symbol-expand-btn" onclick="toggleExpansion('philosophical-${this.sanitizeId(symbol.name)}')">
                <i class="fas fa-chevron-down"></i>
                Read more
            </button>
        </div>
    `;
};

/**
 * Create Cultural Origin section
 */
VisualArtsController.prototype.createCulturalOriginSection = function(symbol) {
    let originText = '';
    
    if (symbol.source && symbol.source.indexOf('CSV + AI Enhanced') !== -1) {
        originText = `Authentic ${symbol.symbolCategory || 'Adinkra'} symbol from ${symbol.country || 'Ghana'} with enhanced cultural analysis - ${symbol.region || 'West Africa'}`;
    } else if (symbol.source && symbol.source.indexOf('CSV') !== -1) {
        originText = `Traditional ${symbol.symbolCategory || 'Adinkra'} symbol from ${symbol.country || 'Ghana'} with cultural documentation - ${symbol.region || 'West Africa'}`;
    } else if (symbol.originalOrigin) {
        originText = 'Originally from ' + symbol.originalOrigin + ', adapted in ' + (symbol.country || 'various regions');
    } else {
        originText = `Traditional symbol from ${symbol.country || 'West Africa'}, ${symbol.region || 'cultural heritage'}`;
    }

    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-globe-africa"></i>
                Cultural Origin
            </div>
            <div class="symbol-section-content">
                ${originText}
            </div>
        </div>
    `;
};

/**
 * Create Historical Context section
 */
VisualArtsController.prototype.createHistoricalContextSection = function(symbol) {
    const historical = this.generateHistoricalContext(symbol);
    
    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-history"></i>
                Historical Context
            </div>
            <div class="symbol-section-content">
                ${historical}
            </div>
        </div>
    `;
};

/**
 * Create Sacred Usage section
 */
VisualArtsController.prototype.createSacredUsageSection = function(symbol) {
    const sacredUsage = this.generateSacredUsage(symbol);
    
    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-place-of-worship"></i>
                Sacred Usage
            </div>
            <div class="symbol-section-content">
                ${sacredUsage}
            </div>
        </div>
    `;
};

/**
 * Create Diaspora Evolution section
 */
VisualArtsController.prototype.createDiasporaEvolutionSection = function(symbol) {
    let evolutionContent = '';
    
    if (symbol.diasporaEvolution && typeof symbol.diasporaEvolution === 'object') {
        const evolutionHTML = Object.entries(symbol.diasporaEvolution).map(([country, description]) => `
            <div class="diaspora-country">
                <div class="diaspora-country-name">${country}:</div>
                <div class="diaspora-description">${description}</div>
            </div>
        `).join('');
        
        evolutionContent = `<div class="diaspora-evolution">${evolutionHTML}</div>`;
    } else if (symbol.adaptation) {
        evolutionContent = symbol.adaptation;
    } else {
        evolutionContent = this.getDefaultEvolutionText(symbol);
    }

    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-route"></i>
                Diaspora Evolution
            </div>
            <div class="symbol-section-content">
                ${evolutionContent}
            </div>
        </div>
    `;
};

/**
 * Create Modern Applications section
 */
VisualArtsController.prototype.createModernApplicationsSection = function(symbol) {
    const applications = this.getModernApplications(symbol);
    
    const applicationsHTML = applications.map(app => `
        <div class="application-item">
            <i class="application-icon ${app.icon}"></i>
            <span>${app.description}</span>
        </div>
    `).join('');

    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-building"></i>
                Modern Applications
            </div>
            <div class="modern-applications">
                ${applicationsHTML}
            </div>
        </div>
    `;
};

/**
 * Create Related Proverbs section
 */
VisualArtsController.prototype.createRelatedProverbsSection = function(symbol) {
    const proverb = this.getRelatedProverb(symbol);
    if (!proverb) return '';

    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-quote-left"></i>
                Related Proverbs
            </div>
            <div class="proverb-container">
                <div class="proverb-text">"${proverb.text}"</div>
                <div class="proverb-translation">${proverb.translation}</div>
            </div>
        </div>
    `;
};

/**
 * Create Visual Elements section
 */
VisualArtsController.prototype.createVisualElementsSection = function(symbol) {
    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-eye"></i>
                Visual Elements
            </div>
            <div class="symbol-section-content">
                ${symbol.visualElements}
            </div>
        </div>
    `;
};

/**
 * Create Symbol Connections section
 */
VisualArtsController.prototype.createSymbolConnectionsSection = function(symbol) {
    const connections = this.getSymbolConnections(symbol);
    if (connections.length === 0) return '';

    const connectionsHTML = connections.map(connection => `
        <span class="connection-tag" onclick="searchSymbol('${connection}')">${connection}</span>
    `).join('');

    return `
        <div class="symbol-section">
            <div class="symbol-section-header">
                <i class="fas fa-project-diagram"></i>
                Related Symbols
            </div>
            <div class="symbol-connections">
                ${connectionsHTML}
            </div>
        </div>
    `;
};

/**
 * Generate philosophical significance text
 */
VisualArtsController.prototype.generatePhilosophicalSignificance = function(symbol) {
    const philosophical = {
        'Gye Nyame': 'Gye Nyame teaches us that after all human efforts, the final outcome rests with the Supreme Being. The symbol reminds us to maintain humility and faith while pursuing our goals, recognizing that divine providence guides our paths.',
        'Sankofa': 'Sankofa embodies the wisdom that progress requires understanding the past. The symbol teaches that we must learn from our ancestors\' experiences, both triumphs and mistakes, to build a better future for generations to come.',
        'Dwennimmen': 'Dwennimmen represents the paradox that true strength comes through humility. Like the ram that lowers its head before charging, this symbol teaches that power without wisdom and modesty leads to destruction.',
        'Pempamsie': 'This symbol preserves important cultural values and social principles, serving as a guide for ethical behavior and community relationships.',
        'Nyame Nnwu Na Mawu': 'This symbol represents the deep spiritual connection between the physical and divine realms, teaching us about the importance of maintaining faith and spiritual awareness in daily life.'
    };

    return philosophical[symbol.name] || this.generateGenericPhilosophical(symbol);
};

/**
 * Generate generic philosophical significance
 */
VisualArtsController.prototype.generateGenericPhilosophical = function(symbol) {
    const category = symbol.category || 'cultural';
    const templates = {
        'spiritual': 'This symbol represents the deep spiritual connection between the physical and divine realms, teaching us about the importance of maintaining faith and spiritual awareness in daily life.',
        'wisdom': 'This symbol embodies the collective wisdom of generations, reminding us that true knowledge comes not just from learning, but from applying ancient teachings to contemporary challenges.',
        'character': 'This symbol represents the ideals of moral character and personal integrity that form the foundation of community life and social harmony.',
        'cultural': 'This symbol preserves important cultural values and social principles, serving as a guide for ethical behavior and community relationships.'
    };

    return templates[category] || templates['cultural'];
};

/**
 * Generate historical context
 */
VisualArtsController.prototype.generateHistoricalContext = function(symbol) {
    const contexts = {
        'Gye Nyame': 'Created during the height of the Ashanti Empire (1670-1957), this symbol appeared on royal regalia and was reserved for the most sacred ceremonies honoring divine authority.',
        'Sankofa': 'Dating back to ancient Akan traditions, this symbol was traditionally carved on staff tops carried by linguists and appeared on ceremonial stools of chiefs.',
        'Dwennimmen': 'Historically used by Akan warriors and hunters, this symbol was painted on shields and weapons to invoke the protective power of humility and strategic thinking.',
        'Pempamsie': 'Originating in Ghana, this symbol has been part of cultural traditions for centuries, passing wisdom through generations of artisans and spiritual leaders.',
        'Nyame Nnwu Na Mawu': 'Originating in Ghana, this symbol has been part of cultural traditions for centuries, passing wisdom through generations of artisans and spiritual leaders.'
    };

    return contexts[symbol.name] || `Originating in ${symbol.country || 'West Africa'}, this symbol has been part of cultural traditions for centuries, passing wisdom through generations of artisans and spiritual leaders.`;
};

/**
 * Generate sacred usage text
 */
VisualArtsController.prototype.generateSacredUsage = function(symbol) {
    const usages = {
        'Gye Nyame': 'Stamped on funeral cloths, carved into shrine walls, worn by priests during ceremonies, featured on palace architecture.',
        'Sankofa': 'Carved on ancestral stools, painted on library walls, worn during naming ceremonies, displayed in schools and educational institutions.',
        'Dwennimmen': 'Painted on military banners, carved on traditional hunting gear, featured in leadership installations, displayed in council chambers.',
        'Pempamsie': 'Featured in ceremonial contexts, traditional rituals, community gatherings, and spiritual practices throughout West African cultures.',
        'Nyame Nnwu Na Mawu': 'Featured in ceremonial contexts, traditional rituals, community gatherings, and spiritual practices throughout West African cultures.'
    };

    return usages[symbol.name] || 'Featured in ceremonial contexts, traditional rituals, community gatherings, and spiritual practices throughout West African cultures.';
};

/**
 * Get modern applications for symbol
 */
VisualArtsController.prototype.getModernApplications = function(symbol) {
    const specificApplications = {
        'Gye Nyame': [
            { icon: 'fas fa-money-bill', description: 'Featured on Ghana\'s 200 cedi banknote' },
            { icon: 'fas fa-university', description: 'University of Cape Coast official logo' },
            { icon: 'fas fa-church', description: 'Catholic University College emblem' },
            { icon: 'fas fa-palette', description: 'Contemporary African art installations' }
        ],
        'Sankofa': [
            { icon: 'fas fa-graduation-cap', description: 'Educational institution symbols' },
            { icon: 'fas fa-book', description: 'Library and learning center logos' },
            { icon: 'fas fa-monument', description: 'Historical preservation sites' },
            { icon: 'fas fa-users', description: 'Community cultural centers' }
        ]
    };

    return specificApplications[symbol.name] || [
        { icon: 'fas fa-university', description: 'University logos and academic institutions' },
        { icon: 'fas fa-palette', description: 'Contemporary African art and design' },
        { icon: 'fas fa-tshirt', description: 'Fashion and textile designs' },
        { icon: 'fas fa-building', description: 'Architectural elements and decorations' }
    ];
};

/**
 * Get related proverb for symbol
 */
VisualArtsController.prototype.getRelatedProverb = function(symbol) {
    const proverbs = {
        'Gye Nyame': {
            text: 'Obi nkyere akwadaa Nyame',
            translation: 'Nobody teaches a child about God - meaning divine awareness is innate to all humanity'
        },
        'Sankofa': {
            text: 'Se wo were fi na wosane ba a, yenkyiri wo',
            translation: 'If you forget and then remember, we will not turn you away - emphasizing forgiveness and learning'
        },
        'Dwennimmen': {
            text: 'Odwennini ye tenten nanso obu ne ti ase',
            translation: 'The ram is long but it bows its head - true strength includes humility'
        }
    };

    return proverbs[symbol.name] || null;
};

/**
 * Get symbol connections
 */
VisualArtsController.prototype.getSymbolConnections = function(symbol) {
    const connections = {
        'Gye Nyame': ['Nyame Dua', 'Adwo', 'Osram Ne Nsoromma'],
        'Sankofa': ['Dwennimmen', 'Aya', 'Nkyinkyim'],
        'Dwennimmen': ['Sankofa', 'Akoko Nan', 'Osram Ne Nsoromma']
    };

    return connections[symbol.name] || [];
};

/**
 * Add modal interactivity
 */
VisualArtsController.prototype.addModalInteractivity = function() {
    // Add scroll progress for expandable sections
    const expandableSections = document.querySelectorAll('.symbol-expandable');
    expandableSections.forEach(section => {
        if (section.scrollHeight > section.clientHeight + 50) {
            const progress = document.createElement('div');
            progress.className = 'content-progress';
            progress.innerHTML = '<div class="progress-bar"></div>';
            section.parentNode.insertBefore(progress, section.nextSibling);
        }
    });
};

/**
 * Sanitize ID for HTML use
 */
VisualArtsController.prototype.sanitizeId = function(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
};

/**
 * Get default evolution text
 */
VisualArtsController.prototype.getDefaultEvolutionText = function(symbol) {
    if (symbol.type === 'adapted') {
        return 'This symbol was adapted and reinterpreted in ' + (symbol.country || 'diaspora communities') + ', maintaining its cultural significance while evolving to fit new contexts and environments.';
    } else {
        return 'This traditional symbol has traveled with diaspora communities, adapting to new environments while preserving its essential meaning and cultural importance.';
    }
};

/**
 * Global functions for HTML onclick handlers
 */
function closeSymbolModal() {
    if (window.visualArtsController) {
        window.visualArtsController.closeSymbolModal();
    }
}

function exploreCountryMore() {
    // Scroll to map section
    const mapSection = document.querySelector('.evolution-map-container');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function shareCountrySummary() {
    const shareText = "Discover fascinating cultural symbols and artistic evolution stories on Voices of the Diaspora!";
    
    if (navigator.share) {
        navigator.share({
            title: 'Cultural Symbols & Art Evolution',
            text: shareText,
            url: window.location.href
        }).catch(function(error) {
            console.error('Error sharing:', error);
        });
    } else {
        // Fallback: copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(function() {
                // Show temporary notification
                const notification = document.createElement('div');
                notification.className = 'share-notification';
                notification.innerHTML = '<div class="notification-content">' +
                    '<i class="fas fa-check"></i>' +
                    '<span>Share link copied to clipboard!</span>' +
                '</div>';
                document.body.appendChild(notification);
                
                setTimeout(function() {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 3000);
            }).catch(function(error) {
                console.error('Error copying to clipboard:', error);
            });
        }
    }
}

// Global functions for modal interactions
function toggleExpansion(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const button = section.nextElementSibling;
    
    if (section.classList.contains('expanded')) {
        section.classList.remove('expanded');
        if (button && button.classList.contains('symbol-expand-btn')) {
            button.innerHTML = '<i class="fas fa-chevron-down"></i> Read more';
        }
    } else {
        section.classList.add('expanded');
        if (button && button.classList.contains('symbol-expand-btn')) {
            button.innerHTML = '<i class="fas fa-chevron-up"></i> Read less';
        }
    }
}

function speakPronunciation(symbolName) {
    // Use Web Speech API for pronunciation
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(symbolName);
        utterance.rate = 0.7;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    } else {
        console.log('Speech synthesis not supported');
    }
}

function searchSymbol(symbolName) {
    if (window.visualArtsController) {
        // Close current modal
        window.visualArtsController.closeSymbolModal();
        
        // Search for the connected symbol
        setTimeout(() => {
            window.visualArtsController.searchSymbols(symbolName);
        }, 300);
    }
}

/**
 * Initialize the Visual Arts page when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the visual arts page
    const isVisualArtsPage = window.location.pathname.indexOf('visual-arts') !== -1 || 
                            document.querySelector('.visual-arts-container') ||
                            document.querySelector('.cultural-symbols-section');
    
    if (isVisualArtsPage) {
        console.log('🎨 Starting Visual Arts page initialization...');
        
        // Create global controller instance
        window.visualArtsController = new VisualArtsController();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (window.visualArtsController) {
                window.visualArtsController.cleanup();
            }
        });
    }
});

/**
 * Enhanced error boundary for the Visual Arts page
 */
window.addEventListener('error', function(event) {
    const isVisualArtsPage = window.location.pathname.indexOf('visual-arts') !== -1;
    
    if (isVisualArtsPage) {
        console.error('Visual Arts page error:', event.error);
        
        // Show user-friendly error message
        const errorContainer = document.querySelector('.visual-arts-container') || 
                              document.querySelector('.cultural-symbols-section') || 
                              document.body;
        
        const errorBanner = document.createElement('div');
        errorBanner.className = 'error-banner';
        errorBanner.innerHTML = '<div class="error-banner-content">' +
            '<i class="fas fa-exclamation-triangle"></i>' +
            '<span>Some features may not be working properly. Please refresh the page if you encounter issues.</span>' +
            '<button onclick="this.parentElement.parentElement.remove()">×</button>' +
        '</div>';
        
        errorContainer.insertBefore(errorBanner, errorContainer.firstChild);
        
        // Auto-remove after 10 seconds
        setTimeout(function() {
            if (errorBanner.parentNode) {
                errorBanner.parentNode.removeChild(errorBanner);
            }
        }, 10000);
    }
});

/**
 * Performance monitoring for the Visual Arts page
 */
if (typeof performance !== 'undefined' && performance.getEntriesByType) {
    window.addEventListener('load', function() {
        const isVisualArtsPage = window.location.pathname.indexOf('visual-arts') !== -1;
        
        if (isVisualArtsPage) {
            // Measure page load performance
            setTimeout(function() {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
                    
                    console.log('📊 Visual Arts page load time: ' + loadTime + 'ms');
                    
                    // Track performance if analytics available
                    if (window.Analytics) {
                        window.Analytics.track('page_performance', {
                            page: 'visual-arts',
                            loadTime: loadTime,
                            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
                        });
                    }
                }
            }, 0);
        }
    });
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualArtsController;
}

console.log('✨ Enhanced Visual Arts JS loaded - Clean cards with rich modal content');