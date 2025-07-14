// js/visual-arts.js - Main controller for Visual Arts page

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
     * Display symbols with enhanced visual elements
     */
    displaySymbols(symbols) {
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

        // Removed symbols count indicator
        let htmlContent = '';
        
        // Add symbol cards
        for (let i = 0; i < symbols.length; i++) {
            htmlContent += this.createEnhancedSymbolCard(symbols[i]);
        }
        
        symbolsGrid.innerHTML = htmlContent;
        
        // Add click handlers to new cards
        const symbolCards = symbolsGrid.querySelectorAll('.symbol-card');
        for (let i = 0; i < symbolCards.length; i++) {
            const card = symbolCards[i];
            card.addEventListener('click', () => {
                const symbolId = card.dataset.symbolId;
                const symbol = symbols.find(s => this.getSymbolId(s) === symbolId);
                if (symbol) {
                    this.showSymbolModal(symbol);
                }
            });
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
    }

    /**
     * Create enhanced symbol card with patterns and quality indicators
     */
    createEnhancedSymbolCard(symbol) {
        const symbolId = this.getSymbolId(symbol);
        let originText = '';
        let badges = '';
        let sourceType = 'traditional';
        
        // Determine source and create appropriate badges
        if (symbol.source && symbol.source.indexOf('CSV + AI Enhanced') !== -1) {
            originText = '🌟 Enhanced Cultural Analysis';
            sourceType = 'enhanced';
            badges += '<div class="ai-enhanced-badge"><i class="fas fa-sparkles"></i> Enhanced</div>';
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
            originText = 'Traditional ' + symbol.country + ' Symbol';
        }

        // Create symbol icon content
        let iconContent = '';
        if (symbol.svgPattern) {
            iconContent = symbol.svgPattern;
        } else if (symbol.unicode) {
            iconContent = '<div class="unicode-display">' + symbol.unicode + '</div>';
        } else {
            iconContent = '<i class="' + (symbol.icon || 'fas fa-star-and-crescent') + '"></i>';
        }

        return '<div class="symbol-card" data-symbol-id="' + symbolId + '" data-category="' + symbol.category + '" data-source="' + sourceType + '">' +
            badges +
            '<div class="symbol-icon ' + (symbol.svgPattern ? 'has-svg' : '') + '">' +
                iconContent +
            '</div>' +
            '<h3>' + symbol.name + '</h3>' +
            '<p>' + symbol.meaning + '</p>' +
            '<div class="symbol-origin">' + originText + '</div>' +
        '</div>';
    }

    /**
     * Get information about symbol sources for display
     */
    getSymbolsCountInfo(symbols) {
        const sources = { enhanced: 0, authentic: 0, live: 0, traditional: 0 };
        
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            if (symbol.source && symbol.source.indexOf('CSV + AI Enhanced') !== -1) {
                sources.enhanced++;
            } else if (symbol.source && symbol.source.indexOf('CSV') !== -1) {
                sources.authentic++;
            } else if (symbol.source && symbol.source.indexOf('adinkrasymbols.org') !== -1) {
                sources.live++;
            } else {
                sources.traditional++;
            }
        }

        const parts = [];
        if (sources.enhanced > 0) parts.push(sources.enhanced + ' enhanced');
        if (sources.authentic > 0) parts.push(sources.authentic + ' authentic');
        if (sources.live > 0) parts.push(sources.live + ' verified');
        if (sources.traditional > 0) parts.push(sources.traditional + ' traditional');

        return parts.join(', ');
    }

    /**
     * Generate unique ID for a symbol
     */
    getSymbolId(symbol) {
        return (symbol.country + '-' + symbol.name).toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    /**
     * Show symbol details in modal
     */
    showSymbolModal(symbol) {
        const modal = document.getElementById('symbol-modal');
        if (!modal) return;

        // Update modal content
        this.updateModalContent(symbol);
        
        // Show modal with animation
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        if (window.ArtAnimations) {
            window.ArtAnimations.trigger('symbolModal', modal, { show: true });
        }

        this.currentModal = modal;
        
        // Track symbol viewing for AI personalization
        if (window.DiasporaAI) {
            window.DiasporaAI.trackUserInterest('symbol_view', symbol.name);
        }

        console.log('👁️ Viewing symbol: ' + symbol.name);
    }

    /**
     * Update modal content with enhanced symbol details
     */
    updateModalContent(symbol) {
        const elements = {
            icon: document.getElementById('modal-symbol-icon'),
            name: document.getElementById('modal-symbol-name'),
            meaning: document.getElementById('modal-symbol-meaning'),
            origin: document.getElementById('modal-symbol-origin'),
            evolution: document.getElementById('modal-symbol-evolution')
        };

        // Update icon with SVG pattern if available
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
            elements.name.textContent = symbol.name;
        }

        if (elements.meaning) {
            elements.meaning.textContent = symbol.meaning;
        }

        if (elements.origin) {
            let originText = '';
            
            if (symbol.source && symbol.source.indexOf('CSV + AI Enhanced') !== -1) {
                originText = 'Authentic Adinkra symbol from Ghana with enhanced cultural analysis - ' + symbol.region;
            } else if (symbol.source && symbol.source.indexOf('CSV') !== -1) {
                originText = 'Traditional Adinkra symbol from Ghana with cultural documentation - ' + symbol.region;
            } else if (symbol.originalOrigin) {
                originText = 'Originally from ' + symbol.originalOrigin + ', adapted in ' + symbol.country;
            } else {
                originText = 'Traditional symbol from ' + symbol.country + ', ' + symbol.region;
            }
            
            elements.origin.textContent = originText;
        }

        if (elements.evolution) {
            let evolutionText = '';
            
            if (symbol.diasporaEvolution && typeof symbol.diasporaEvolution === 'object') {
                const evolutionEntries = Object.entries(symbol.diasporaEvolution);
                if (evolutionEntries.length > 0) {
                    const descriptions = [];
                    for (let i = 0; i < evolutionEntries.length; i++) {
                        const entry = evolutionEntries[i];
                        descriptions.push('In ' + entry[0] + ': ' + entry[1]);
                    }
                    evolutionText = descriptions.join('. ');
                }
            } else if (symbol.adaptation) {
                evolutionText = symbol.adaptation;
            } else {
                evolutionText = this.getDefaultEvolutionText(symbol);
            }
            
            elements.evolution.textContent = evolutionText;
        }

        // Add visual elements description if available
        this.addVisualElementsSection(symbol);
    }

    /**
     * Add visual elements description section to modal
     */
    addVisualElementsSection(symbol) {
        const evolutionSection = document.getElementById('modal-symbol-evolution');
        if (!evolutionSection || !symbol.visualElements) return;

        // Check if visual elements section already exists
        let visualSection = evolutionSection.parentNode.querySelector('.visual-elements-section');
        
        if (!visualSection) {
            visualSection = document.createElement('div');
            visualSection.className = 'visual-elements-section';
            evolutionSection.parentNode.insertBefore(visualSection, evolutionSection.nextSibling);
        }

        visualSection.innerHTML = '<h5>Visual Elements</h5>' +
            '<p>' + symbol.visualElements + '</p>';
    }

    /**
     * Get default evolution text for symbols without specific evolution data
     */
    getDefaultEvolutionText(symbol) {
        if (symbol.type === 'adapted') {
            return 'This symbol was adapted and reinterpreted in ' + symbol.country + ', maintaining its cultural significance while evolving to fit new contexts and environments.';
        } else {
            return 'This traditional symbol has traveled with diaspora communities, adapting to new environments while preserving its essential meaning and cultural importance.';
        }
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
        // Symbol cards keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('symbol-card')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });

        // Make symbol cards focusable
        const symbolCards = document.querySelectorAll('.symbol-card');
        for (let i = 0; i < symbolCards.length; i++) {
            const card = symbolCards[i];
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            const symbolName = card.querySelector('h3');
            if (symbolName) {
                card.setAttribute('aria-label', 'View details for ' + symbolName.textContent);
            }
        }
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
                    this.showSymbolModal(symbol);
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

/**
 * Initialize the Visual Arts page when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the visual arts page
    const isVisualArtsPage = window.location.pathname.indexOf('visual-arts') !== -1 || 
                            document.querySelector('.visual-arts-container');
    
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
        const errorContainer = document.querySelector('.visual-arts-container') || document.body;
        
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