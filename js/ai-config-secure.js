// Secure AI Configuration - Fixed version

class SecureAIConfig {
    constructor() {
        this.initialized = false;
        this.apiKey = null;
        this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.isLiveServer = window.location.port === '5500';
    }
    
    async initialize() {
        try {
            // Load configuration
            const config = await window.EnvLoader.loadConfig();
            
            if (config && config.OPENAI_API_KEY) {
                this.apiKey = config.OPENAI_API_KEY;
            }
            
            // Fallback to stored key
            if (!this.apiKey) {
                this.apiKey = window.EnvLoader.getStoredKey();
            }
            
            if (this.apiKey) {
                window.DiasporaAI.initialize(this.apiKey);
                this.initialized = true;
                this.showAIStatus('AI features enabled ✅');
                this.enhanceExistingSearch();
                return true;
            } else {
                this.showAIStatus('AI features disabled - using static data', 'warning');
                return false;
            }
            
        } catch (error) {
            console.error('Failed to initialize AI:', error);
            this.showAIStatus('AI features unavailable', 'error');
            return false;
        }
    }
    
    // Enhance the existing country search with AI
    enhanceExistingSearch() {
        console.log('Enhancing existing country search with AI...');
        
        // Override the showAISummary function to use real AI
        if (window.showAISummary) {
            const originalShowAISummary = window.showAISummary;
            window.showAISummary = async (country) => {
                // Call the original function first (for UI setup)
                originalShowAISummary(country);
                
                // Then enhance with real AI
                await this.enhanceCountrySummaryWithAI(country);
            };
        }
        
        // Add AI enhancement to global scope
        window.enhanceWithAI = this.enhanceCountrySummaryWithAI.bind(this);
    }
    
    // Enhance the country summary display with real AI
    async enhanceCountrySummaryWithAI(country) {
        console.log('🤖 Starting AI enhancement for:', country.name);
        
        if (!this.initialized || !this.apiKey) {
            console.log('❌ AI not available - initialized:', this.initialized, 'has key:', !!this.apiKey);
            // Don't show error - just use the static content that's already displayed
            return;
        }
        
        try {
            const summaryText = document.getElementById('summary-text');
            const summaryStats = document.getElementById('summary-stats');
            
            if (!summaryText) {
                console.log('❌ Summary text element not found');
                return;
            }
            
            console.log('✅ AI is initialized, starting enhancement...');
            
            // Show that AI is processing
            const loadingText = document.createElement('div');
            loadingText.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                color: var(--primary-color);
                font-style: italic;
                margin-top: 10px;
                font-size: 0.9rem;
            `;
            loadingText.innerHTML = `
                <i class="fas fa-robot"></i>
                AI is enhancing this summary...
            `;
            summaryText.appendChild(loadingText);
            
            console.log('🔄 Calling DiasporaAI.generateCountrySummary...');
            
            // Generate AI summary
            const result = await window.DiasporaAI.generateCountrySummary(country.name);
            
            console.log('📝 AI result received:', result);
            
            // Remove loading text
            loadingText.remove();
            
            // Check if we got a real AI result or fallback
            if (result && result.text && !result.text.includes('rich history spanning multiple continents')) {
                console.log('✅ Using real AI content');
                
                // Replace with AI-generated content
                summaryText.innerHTML = `
                    <p>${result.text}</p>
                    <div class="ai-badge" style="margin-top: 15px;">
                        <i class="fas fa-robot"></i>
                        <span>Enhanced with AI</span>
                    </div>
                `;
                
                // Update stats if AI provided them
                if (result.statistics && summaryStats) {
                    console.log('📊 Updating stats with AI data:', result.statistics);
                    
                    const diasporaPopulation = document.getElementById('diaspora-population');
                    const mainDestinations = document.getElementById('main-destinations');
                    const culturalCenters = document.getElementById('cultural-centers');
                    
                    // FIXED: Only update if we have valid data (not "Data unavailable")
                    if (result.statistics.population && 
                        result.statistics.population !== 'Data unavailable' && 
                        diasporaPopulation) {
                        diasporaPopulation.textContent = result.statistics.population;
                    }
                    if (result.statistics.destinations && 
                        result.statistics.destinations !== 'Data unavailable' && 
                        mainDestinations) {
                        mainDestinations.textContent = result.statistics.destinations;
                    }
                    if (result.statistics.centers && 
                        result.statistics.centers !== 'Data unavailable' && 
                        culturalCenters) {
                        culturalCenters.textContent = result.statistics.centers;
                    }
                }
            } else {
                console.log('⚠️ Got fallback content instead of real AI');
                
                // FIXED: Just add AI badge to existing content, don't replace with fallback message
                const existingContent = summaryText.innerHTML;
                summaryText.innerHTML = `
                    ${existingContent}
                    <div class="ai-badge" style="margin-top: 15px; background: rgba(255, 152, 0, 0.1); border: 1px solid rgba(255, 152, 0, 0.3); color: #ff9800; padding: 10px; border-radius: 6px; font-size: 0.85rem;">
                        <i class="fas fa-info-circle"></i>
                        <span>AI enhancement used fallback data</span>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('💥 Failed to enhance with AI:', error);
            
            const summaryText = document.getElementById('summary-text');
            if (summaryText) {
                const errorNote = document.createElement('div');
                errorNote.style.cssText = `
                    background: rgba(244, 67, 54, 0.1);
                    border: 1px solid rgba(244, 67, 54, 0.3);
                    color: #f44336;
                    padding: 8px 12px;
                    border-radius: 6px;
                    margin-top: 10px;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;
                errorNote.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    AI enhancement temporarily unavailable
                `;
                summaryText.appendChild(errorNote);
            }
        }
    }
    
    showAIStatus(message, type = 'info') {
        console.log(`AI Status [${type}]:`, message);
        
        if (this.isDevelopment) {
            const statusDiv = document.createElement('div');
            statusDiv.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4caf50'};
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            `;
            statusDiv.textContent = message;
            document.body.appendChild(statusDiv);
            
            setTimeout(() => statusDiv.remove(), 3000);
        }
    }
}

// Initialize when DOM is ready (after country-search.js loads)
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for other scripts to load
    setTimeout(async () => {
        const aiConfig = new SecureAIConfig();
        window.secureAIConfigInstance = aiConfig;
        await aiConfig.initialize();
    }, 1000);
});

window.SecureAIConfig = SecureAIConfig;