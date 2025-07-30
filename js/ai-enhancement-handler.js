// js/ai-enhancement-handler.js - User-Controlled AI Symbol Enhancement
// Handles on-demand AI enhancement of individual symbols

/**
 * AI Enhancement Handler for Symbols
 * Provides user-controlled AI enhancement with rate limiting and caching
 */
class AIEnhancementHandler {
    constructor() {
        this.enhancedCache = new Map();
        this.isEnhancing = new Map();
        this.rateLimitQueue = [];
        this.lastRequestTime = 0;
        this.minRequestInterval = 20000; // 20 seconds between requests due to rate limit
        
        this.init();
    }

    init() {
        console.log('🤖 AI Enhancement Handler initialized');
        this.loadCachedEnhancements();
    }

    /**
     * Load previously cached enhancements
     */
    loadCachedEnhancements() {
        try {
            const cached = localStorage.getItem('ai_enhanced_symbols');
            if (cached) {
                const data = JSON.parse(cached);
                this.enhancedCache = new Map(data);
                console.log(`💾 Loaded ${this.enhancedCache.size} cached AI enhancements`);
            }
        } catch (error) {
            console.warn('Could not load cached enhancements:', error);
        }
    }

    /**
     * Save enhancements to cache
     */
    saveCachedEnhancements() {
        try {
            const data = Array.from(this.enhancedCache.entries());
            localStorage.setItem('ai_enhanced_symbols', JSON.stringify(data));
        } catch (error) {
            console.warn('Could not cache enhancements:', error);
        }
    }

    /**
     * Check if symbol is already enhanced
     */
    isSymbolEnhanced(symbolName) {
        return this.enhancedCache.has(symbolName);
    }

    /**
     * Get enhanced symbol data
     */
    getEnhancedSymbol(symbolName) {
        return this.enhancedCache.get(symbolName);
    }

    /**
     * Add AI enhancement button to symbol card
     */
    addEnhancementButton(cardElement, symbol) {
        // Don't add button if already enhanced
        if (this.isSymbolEnhanced(symbol.name)) {
            return;
        }

        // Don't add button if already exists
        if (cardElement.querySelector('.ai-enhance-btn')) {
            return;
        }

        const enhanceBtn = document.createElement('button');
        enhanceBtn.className = 'ai-enhance-btn';
        enhanceBtn.innerHTML = '<i class="fas fa-sparkles"></i>';
        enhanceBtn.title = 'Enhance with AI Analysis';
        
        enhanceBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            this.enhanceSymbol(symbol, cardElement);
        });

        cardElement.appendChild(enhanceBtn);
    }

    /**
     * Enhance individual symbol with AI
     */
    async enhanceSymbol(symbol, cardElement) {
        const symbolName = symbol.name;

        // Check if already enhanced
        if (this.isSymbolEnhanced(symbolName)) {
            this.applyEnhancement(symbol, cardElement);
            return;
        }

        // Check if currently enhancing
        if (this.isEnhancing.get(symbolName)) {
            return;
        }

        // Check if AI service is available
        if (!window.DiasporaAI || typeof window.DiasporaAI.callOpenAI !== 'function') {
            this.showEnhancementError(cardElement, 'AI service not available');
            return;
        }

        // Check rate limits
        const now = Date.now();
        if (now - this.lastRequestTime < this.minRequestInterval) {
            const waitTime = Math.ceil((this.minRequestInterval - (now - this.lastRequestTime)) / 1000);
            this.showEnhancementError(cardElement, `Please wait ${waitTime}s due to rate limits`);
            return;
        }

        try {
            this.isEnhancing.set(symbolName, true);
            this.showEnhancementLoading(cardElement);
            this.lastRequestTime = now;

            const enhancedData = await this.callAIEnhancement(symbol);
            
            if (enhancedData) {
                // Cache the enhancement
                this.enhancedCache.set(symbolName, enhancedData);
                this.saveCachedEnhancements();
                
                // Apply to current symbol
                Object.assign(symbol, enhancedData);
                this.applyEnhancement(symbol, cardElement);
                
                console.log(`✨ Enhanced ${symbolName} with AI`);
            } else {
                this.showEnhancementError(cardElement, 'Enhancement failed');
            }

        } catch (error) {
            console.error('AI Enhancement error:', error);
            
            if (error.message && error.message.includes('429')) {
                this.showEnhancementError(cardElement, 'Rate limit reached. Try again later.');
            } else {
                this.showEnhancementError(cardElement, 'Enhancement unavailable');
            }
        } finally {
            this.isEnhancing.set(symbolName, false);
        }
    }

    /**
     * Call AI service for enhancement
     */
    async callAIEnhancement(symbol) {
        const prompt = `Enhance this Adinkra symbol information for cultural education:

Symbol Name: ${symbol.name}
Basic Meaning: ${symbol.meaning || symbol.description}
Country: ${symbol.country || 'Ghana'}
Region: ${symbol.region || 'West Africa'}

Please provide enhanced information in this exact format:
**Enhanced Description**: [Detailed cultural and historical context]
**Philosophical Significance**: [Deep meaning and life lessons]
**Historical Context**: [When and how it was used historically]
**Sacred Usage**: [Ceremonial and spiritual applications]
**Modern Applications**: [How it's used today]
**Visual Elements**: [Description of the design elements]

Keep responses educational, respectful, and culturally accurate.`;

        try {
            const response = await window.DiasporaAI.callOpenAI(prompt);
            return this.parseAIResponse(response, symbol);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Parse AI response into structured data
     */
    parseAIResponse(response, originalSymbol) {
        try {
            const enhanced = { ...originalSymbol };
            
            // Extract sections using regex
            const extractSection = (pattern) => {
                const match = response.match(pattern);
                return match ? match[1].trim() : null;
            };

            const enhancedDesc = extractSection(/\*\*Enhanced Description\*\*:?\s*([^*]+)/i);
            const philosophical = extractSection(/\*\*Philosophical Significance\*\*:?\s*([^*]+)/i);
            const historical = extractSection(/\*\*Historical Context\*\*:?\s*([^*]+)/i);
            const sacred = extractSection(/\*\*Sacred Usage\*\*:?\s*([^*]+)/i);
            const modern = extractSection(/\*\*Modern Applications\*\*:?\s*([^*]+)/i);
            const visual = extractSection(/\*\*Visual Elements\*\*:?\s*([^*]+)/i);

            // Apply enhancements
            if (enhancedDesc) enhanced.description = enhancedDesc;
            if (philosophical) enhanced.philosophicalSignificance = philosophical;
            if (historical) enhanced.historicalContext = historical;
            if (sacred) enhanced.sacredUsage = sacred;
            if (modern) enhanced.modernApplications = modern;
            if (visual) enhanced.visualElements = visual;

            // Mark as AI enhanced
            enhanced.source = (enhanced.source || 'Traditional') + ' + AI Enhanced';
            enhanced.aiEnhanced = true;

            return enhanced;

        } catch (error) {
            console.error('Error parsing AI response:', error);
            return null;
        }
    }

    /**
     * Apply enhancement to symbol card
     */
    applyEnhancement(symbol, cardElement) {
        // Remove enhancement button
        const enhanceBtn = cardElement.querySelector('.ai-enhance-btn');
        if (enhanceBtn) {
            enhanceBtn.remove();
        }

        // Update symbol card source text if needed
        const originElement = cardElement.querySelector('.symbol-origin');
        if (originElement && symbol.source && symbol.source.includes('AI Enhanced')) {
            originElement.textContent = '🌟 AI Enhanced Cultural Analysis';
        }

        // Show subtle success animation
        if (window.gsap) {
            gsap.fromTo(cardElement, 
                { scale: 1 },
                { 
                    scale: 1.02, 
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                }
            );
        }
    }

    /**
     * Show enhancement loading state
     */
    showEnhancementLoading(cardElement) {
        const enhanceBtn = cardElement.querySelector('.ai-enhance-btn');
        if (enhanceBtn) {
            enhanceBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            enhanceBtn.disabled = true;
            enhanceBtn.title = 'Enhancing with AI...';
        }
    }

    /**
     * Show enhancement error
     */
    showEnhancementError(cardElement, message) {
        const enhanceBtn = cardElement.querySelector('.ai-enhance-btn');
        if (enhanceBtn) {
            enhanceBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            enhanceBtn.disabled = true;
            enhanceBtn.title = message;
            
            // Reset button after 3 seconds
            setTimeout(() => {
                enhanceBtn.innerHTML = '<i class="fas fa-sparkles"></i>';
                enhanceBtn.disabled = false;
                enhanceBtn.title = 'Enhance with AI Analysis';
            }, 3000);
        }
    }

    /**
     * Get enhanced symbol data for modal display
     */
    getSymbolForModal(symbol) {
        const enhanced = this.getEnhancedSymbol(symbol.name);
        return enhanced ? { ...symbol, ...enhanced } : symbol;
    }

    /**
     * Clear all cached enhancements (for debugging)
     */
    clearCache() {
        this.enhancedCache.clear();
        localStorage.removeItem('ai_enhanced_symbols');
        console.log('🗑️ AI enhancement cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            cachedSymbols: this.enhancedCache.size,
            isEnhancing: Array.from(this.isEnhancing.values()).filter(Boolean).length,
            lastRequestTime: this.lastRequestTime
        };
    }
}

// Initialize global instance
window.aiEnhancementHandler = new AIEnhancementHandler();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIEnhancementHandler;
}

console.log('🤖 AI Enhancement Handler loaded');