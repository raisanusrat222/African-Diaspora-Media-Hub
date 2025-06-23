// Secure AI Configuration for prod

class SecureAIConfig {
    constructor() {
        this.initialized = false;
        this.apiKey = null;
        this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.isLiveServer = window.location.port === '5500'; // Live Server default port
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
                this.initializeAIFeatures();
                return true;
            } else {
                this.showAIStatus('AI features disabled - using demo mode', 'warning');
                this.initializeDemoMode();
                return false;
            }
            
        } catch (error) {
            console.error('Failed to initialize AI:', error);
            this.showAIStatus('AI features unavailable', 'error');
            this.initializeDemoMode();
            return false;
        }
    }
    
    // Method 1: Load API key from backend (PROD)
    async loadFromBackend() {
        try {
            const response = await fetch('/api/ai-config', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                const config = await response.json();
                return config.apiKey;
            }
        } catch (error) {
            console.warn('Could not load API key from backend:', error);
        }
        return null;
    }
    
    // Method 2: GitHub Pages with Netlify/Vercel Functions
    async loadFromGitHubBackend() {
        try {
            // If using Netlify Functions
            const response = await fetch('/.netlify/functions/get-api-key', {
                method: 'GET',
            });
            
            // Or if using Vercel
            // const response = await fetch('/api/get-api-key');
            
            if (response.ok) {
                const data = await response.json();
                return data.apiKey;
            }
        } catch (error) {
            console.warn('Could not load API key from serverless function:', error);
        }
        return null;
    }
    
    // Method 3: Development prompt (ONLY for local dev)
    async promptForAPIKey() {
        if (this.isDevelopment || this.isLiveServer) {
            const stored = localStorage.getItem('dev_openai_key');
            if (stored) {
                const useStored = confirm('Use previously entered API key for development?');
                if (useStored) return stored;
            }
            
            const apiKey = prompt(`
🔐 DEVELOPMENT MODE ONLY

Enter OpenAI API key for testing:

⚠️ This is only for local development!!
⚠️ Never commit API keys to git!!
            `.trim());
            
            if (apiKey && apiKey.startsWith('sk-')) {
                localStorage.setItem('dev_openai_key', apiKey);
                return apiKey;
            }
        }
        return null;
    }
    
    // Demo mode with fallback content when no API key
    initializeDemoMode() {
        console.log('Initializing demo mode with fallback content');
        
        // Override AI service to use only fallbacks
        window.DiasporaAI.generateCountrySummary = async (country) => {
            return window.DiasporaAI.getFallbackCountrySummary(country);
        };
        
        window.DiasporaAI.generatePersonalizedRecommendations = async () => {
            return window.DiasporaAI.getDefaultRecommendations();
        };
        
        window.DiasporaAI.generateSearchSuggestions = async (query) => {
            return window.DiasporaAI.getFallbackSearchSuggestions(query);
        };
        
        // Initialize other features that don't need API
        this.enhanceCountrySearch();
        this.initializePersonalization();
        
        // Show demo mode indicator
        this.showDemoModeIndicator();
    }
    
    showDemoModeIndicator() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
        `;
        indicator.innerHTML = `
            <i class="fas fa-info-circle"></i> Demo Mode
            <div style="font-size: 10px; margin-top: 2px; opacity: 0.9;">
                Using fallback content
            </div>
        `;
        document.body.appendChild(indicator);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 5000);
    }
    
    // Rest of existing methods...
    enhanceCountrySearch() {
        const countrySearchInput = document.getElementById('country-search-input');
        const countrySearchBtn = document.getElementById('country-search-btn');
        
        if (countrySearchInput && countrySearchBtn) {
            countrySearchBtn.addEventListener('click', this.handleAICountrySearch.bind(this));
            
            countrySearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAICountrySearch();
                }
            });
        }
    }
    
    async handleAICountrySearch() {
        const input = document.getElementById('country-search-input');
        const summaryContainer = document.getElementById('ai-summary-container');
        const loadingElement = document.getElementById('summary-loading');
        const summaryText = document.getElementById('summary-text');
        const summaryStats = document.getElementById('summary-stats');
        const countryName = document.getElementById('country-name');
        
        if (!input || !summaryContainer) return;
        
        const country = input.value.trim();
        if (!country) return;
        
        try {
            // Show loading state
            summaryContainer.style.display = 'block';
            summaryContainer.classList.add('show');
            loadingElement.style.display = 'block';
            summaryText.style.display = 'none';
            summaryStats.style.display = 'none';
            
            // Update country name
            if (countryName) {
                countryName.textContent = country;
            }
            
            // Generate AI summary (will use fallback if no API key)
            const result = await window.DiasporaAI.generateCountrySummary(country);
            
            // Simulate loading for demo effect
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Hide loading and show results
            loadingElement.style.display = 'none';
            
            // Display summary text
            if (summaryText) {
                summaryText.innerHTML = `<p>${result.text}</p>`;
                summaryText.style.display = 'block';
            }
            
            // Display statistics
            if (summaryStats && result.statistics) {
                const statsHTML = `
                    <div class="stat-item">
                        <div class="stat-number">${result.statistics.population || '-'}</div>
                        <div class="stat-label">Diaspora Population</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${result.statistics.destinations || '-'}</div>
                        <div class="stat-label">Main Destinations</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${result.statistics.centers || '-'}</div>
                        <div class="stat-label">Cultural Centers</div>
                    </div>
                `;
                summaryStats.innerHTML = statsHTML;
                summaryStats.style.display = 'flex';
            }
            
            // Track analytics
            this.trackAIUsage('country_search', country);
            
        } catch (error) {
            console.error('Error in AI country search:', error);
            this.showErrorMessage('Unable to generate summary. Please try again.');
        }
    }
    
    initializePersonalization() {
        const currentPage = this.getCurrentPage();
        window.DiasporaAI.trackUserInterest('topic', currentPage);
        
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            window.DiasporaAI.trackPageTime(currentPage, timeSpent);
        });
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'home';
        return page.replace('.html', '');
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
    
    showErrorMessage(message) {
        const summaryText = document.getElementById('summary-text');
        if (summaryText) {
            summaryText.innerHTML = `<p style="color: #ff6b6b;"><i class="fas fa-exclamation-triangle"></i> ${message}</p>`;
            summaryText.style.display = 'block';
        }
    }
    
    trackAIUsage(feature, details) {
        if (window.DiasporaHub && window.DiasporaHub.Analytics) {
            window.DiasporaHub.Analytics.track('ai_feature_used', {
                feature: feature,
                details: details,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const aiConfig = new SecureAIConfig();
    await aiConfig.initialize();
});

window.SecureAIConfig = SecureAIConfig;