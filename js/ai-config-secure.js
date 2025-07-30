// Secure AI Configuration - Fixed version with proper DiasporaAI initialization

class SecureAIConfig {
    constructor() {
        this.initialized = false;
        this.apiKey = null;
        this.isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.isLiveServer = window.location.port === '5500';
    }
    
    async initialize() {
        try {
            console.log('🔧 Starting AI configuration initialization...');
            
            // Try multiple sources for API key
            console.log('🔍 Checking for API key...');
            
            // First: Check window.CONFIG (if it exists)
            if (window.CONFIG && window.CONFIG.OPENAI_API_KEY) {
                this.apiKey = window.CONFIG.OPENAI_API_KEY;
                console.log('✅ API key loaded from window.CONFIG');
            }
            
            // Second: Check localStorage
            if (!this.apiKey) {
                this.apiKey = localStorage.getItem('openai_api_key');
                if (this.apiKey) {
                    console.log('✅ API key loaded from localStorage');
                }
            }
            
            // Third: Try EnvLoader if available
            if (!this.apiKey && window.EnvLoader) {
                try {
                    const config = await window.EnvLoader.loadConfig();
                    if (config && config.OPENAI_API_KEY) {
                        this.apiKey = config.OPENAI_API_KEY;
                        console.log('✅ API key loaded from EnvLoader config');
                    }
                } catch (e) {
                    console.log('⚠️ EnvLoader not available or failed');
                }
            }
            
            // Fourth: Try EnvLoader stored key
            if (!this.apiKey && window.EnvLoader) {
                try {
                    this.apiKey = window.EnvLoader.getStoredKey();
                    if (this.apiKey) {
                        console.log('✅ API key loaded from EnvLoader storage');
                    }
                } catch (e) {
                    console.log('⚠️ Could not access EnvLoader stored key');
                }
            }
            
            // Fifth: Prompt user if in development mode and no key found
            if (!this.apiKey && this.isDevelopment) {
                console.log('🔑 No API key found, prompting user...');
                this.apiKey = prompt('Enter your OpenAI API key for AI features:');
                if (this.apiKey && this.apiKey.startsWith('sk-')) {
                    localStorage.setItem('openai_api_key', this.apiKey);
                    console.log('✅ API key saved to localStorage');
                }
            }
            
            console.log('🔍 API key search result:', this.apiKey ? 'Found' : 'Not found');
            
            if (this.apiKey) {
                // Create DiasporaAI service if it doesn't exist
                if (!window.DiasporaAI) {
                    console.log('🏗️ Creating DiasporaAI service...');
                    this.createDiasporaAI();
                }
                
                // Initialize the service
                if (window.DiasporaAI && typeof window.DiasporaAI.initialize === 'function') {
                    await window.DiasporaAI.initialize(this.apiKey);
                    this.initialized = true;
                    this.showAIStatus('AI features enabled ✅');
                    console.log('✅ DiasporaAI initialized successfully');
                } else {
                    console.error('❌ DiasporaAI service not available');
                    this.showAIStatus('AI service not available', 'error');
                    return false;
                }
                
                this.enhanceExistingSearch();
                return true;
            } else {
                console.log('⚠️ No API key found');
                this.showAIStatus('AI features disabled - using static data', 'warning');
                return false;
            }
            
        } catch (error) {
            console.error('Failed to initialize AI:', error);
            this.showAIStatus('AI features unavailable', 'error');
            return false;
        }
    }
    
    // Create a basic DiasporaAI service if it doesn't exist
    createDiasporaAI() {
        window.DiasporaAI = {
            isInitialized: false,
            apiKey: null,
            baseURL: 'https://api.openai.com/v1/chat/completions',
            
            async initialize(apiKey) {
                this.apiKey = apiKey;
                this.isInitialized = true;
                console.log('🤖 DiasporaAI service initialized');
                return true;
            },
            
            async callOpenAI(prompt, maxTokens = 500, temperature = 0.7) {
                if (!this.apiKey || !this.isInitialized) {
                    console.log('⚠️ DiasporaAI: No API key or not initialized, using fallback');
                    return this.getFallbackResponse(prompt);
                }
                
                try {
                    console.log('🔄 Making OpenAI API call...');
                    console.log('📝 Prompt length:', prompt.length, 'characters');
                    console.log('🎯 Max tokens requested:', maxTokens);
                    
                    const response = await fetch(this.baseURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-3.5-turbo',
                            messages: [{
                                role: 'system',
                                content: 'You are a knowledgeable cultural historian specializing in African diaspora studies. Provide detailed, complete responses without cutting off mid-sentence. Always finish your thoughts completely.'
                            }, {
                                role: 'user',
                                content: prompt
                            }],
                            max_tokens: maxTokens,
                            temperature: temperature
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    const result = data.choices[0].message.content;
                    
                    console.log('✅ OpenAI API call successful');
                    console.log('📏 Response length:', result.length, 'characters');
                    console.log('⚡ Tokens used:', data.usage?.total_tokens || 'unknown');
                    
                    return result;
                    
                } catch (error) {
                    console.error('❌ OpenAI API call failed:', error);
                    return this.getFallbackResponse(prompt);
                }
            },
            
            async generateCountrySummary(countryName) {
                const prompt = `Write a comprehensive summary about ${countryName} and its global diaspora communities.

Include these sections:

Cultural Heritage Overview:
- Brief history and cultural significance of ${countryName}
- Key cultural elements (traditions, languages, religions)

Global Diaspora:
- Major destination countries and estimated populations
- Historical migration patterns and reasons

Cultural Contributions:
- Arts, music, cuisine, and traditions preserved/adapted globally
- Notable achievements and influences in host countries

Contemporary Presence:
- Modern diaspora communities and cultural organizations
- Current cultural preservation efforts and innovations

Write in an engaging, educational style for a cultural heritage website. Provide specific examples and details. Make the content complete and informative.`;

                try {
                    const text = await this.callOpenAI(prompt, 600, 0.7);
                    
                    // Generate basic statistics
                    const statistics = {
                        population: this.estimateDiasporaPopulation(countryName),
                        destinations: this.getMainDestinations(countryName),
                        centers: this.getCulturalCenters(countryName)
                    };
                    
                    return { text, statistics };
                    
                } catch (error) {
                    console.error('Error generating country summary:', error);
                    return this.getFallbackCountrySummary(countryName);
                }
            },
            
            // Enhanced for Visual Arts
            async analyzeArtEvolution(originCountry, destCountry, artStyle = 'traditional patterns') {
                const prompt = `Provide a detailed analysis of artistic evolution from ${originCountry} to ${destCountry}.

Focus on ${artStyle} and cultural artistic traditions. Structure your response as follows:

ORIGINAL ARTISTIC TRADITIONS IN ${originCountry.toUpperCase()}:
Describe the traditional techniques, materials, and cultural significance. Include specific details about:
- Traditional methods and tools used
- Cultural and spiritual meanings
- Social contexts and ceremonial uses
- Key visual characteristics and symbolic elements

MIGRATION AND CULTURAL JOURNEY:
Explain how these artistic traditions traveled from ${originCountry} to ${destCountry}:
- Historical context of migration (forced or voluntary)
- Challenges faced in preserving traditions
- What elements were prioritized for preservation
- How knowledge was transmitted across generations

EVOLUTION AND ADAPTATION IN ${destCountry.toUpperCase()}:
Detail how the traditions evolved in the new environment:
- New materials and techniques adopted
- Influences from local indigenous and colonial traditions
- How core meanings were preserved or transformed
- Innovation and creative adaptations developed

CONTEMPORARY EXPRESSIONS:
Describe modern interpretations and current relevance:
- How these traditions manifest today in ${destCountry}
- Notable contemporary artists or movements
- Cultural significance in modern diaspora communities
- Global influence and recognition

Provide specific examples, artist names, artwork titles, and cultural movements where possible. Write as a compelling narrative of cultural resilience and artistic innovation.`;

                try {
                    const story = await this.callOpenAI(prompt, 800, 0.7);
                    
                    return {
                        story: story,
                        timeline: this.generateBasicTimeline(originCountry, destCountry),
                        artExamples: this.generateBasicArtExamples(originCountry, destCountry),
                        generatedAt: Date.now()
                    };
                    
                } catch (error) {
                    console.error('Error analyzing art evolution:', error);
                    return this.getFallbackArtEvolution(originCountry, destCountry);
                }
            },
            
            trackUserInterest(type, value) {
                console.log(`📊 User interest: ${type} - ${value}`);
            },
            
            // Fallback methods
            getFallbackResponse(prompt) {
                if (prompt.toLowerCase().includes('artistic evolution')) {
                    return "The artistic traditions evolved through cultural exchange, maintaining essential elements while adapting to new environments and available materials. This transformation represents remarkable cultural resilience and innovation.";
                }
                return "Cultural traditions demonstrate remarkable adaptability while preserving essential heritage elements across different geographical and temporal contexts.";
            },
            
            getFallbackCountrySummary(countryName) {
                return {
                    text: `${countryName} has a rich cultural heritage that has spread across the globe through diaspora communities. These communities have maintained their cultural identity while contributing significantly to their host countries through art, music, cuisine, and traditions. The diaspora continues to serve as a bridge between traditional heritage and contemporary global culture.`,
                    statistics: {
                        population: 'Data unavailable',
                        destinations: 'Multiple countries worldwide',
                        centers: 'Various cultural organizations'
                    }
                };
            },
            
            getFallbackArtEvolution(originCountry, destCountry) {
                return {
                    story: `The artistic evolution from ${originCountry} to ${destCountry} represents a journey of cultural preservation and adaptation. Traditional art forms were transformed through contact with new materials, techniques, and cultural influences while maintaining their essential spiritual and cultural meanings.`,
                    timeline: [
                        { period: "Traditional Era", content: [`Original forms in ${originCountry}`] },
                        { period: "Migration Period", content: ["Cultural traditions travel"] },
                        { period: "Adaptation Phase", content: [`New forms emerge in ${destCountry}`] },
                        { period: "Contemporary Era", content: ["Modern interpretations develop"] }
                    ],
                    artExamples: {
                        traditional: { name: `Traditional ${originCountry} Art`, description: "Original cultural forms" },
                        contemporary: { name: `${destCountry} Adaptation`, description: "Evolved expressions" }
                    },
                    generatedAt: Date.now()
                };
            },
            
            // Utility methods for basic data generation
            estimateDiasporaPopulation(country) {
                const populations = {
                    'Nigeria': '15-20 million',
                    'Ghana': '3-4 million', 
                    'Senegal': '2-3 million',
                    'Ethiopia': '2-3 million',
                    'Somalia': '1-2 million'
                };
                return populations[country] || '1-5 million';
            },
            
            getMainDestinations(country) {
                const destinations = {
                    'Nigeria': 'USA, UK, Canada, South Africa',
                    'Ghana': 'USA, UK, Germany, Canada',
                    'Senegal': 'France, USA, Italy, Spain',
                    'Ethiopia': 'USA, Sweden, Canada, Israel',
                    'Somalia': 'USA, UK, Canada, Sweden'
                };
                return destinations[country] || 'USA, Europe, Canada';
            },
            
            getCulturalCenters(country) {
                return 'Community centers, cultural associations, religious institutions';
            },
            
            generateBasicTimeline(origin, destination) {
                return [
                    { period: "Pre-1500s: Traditional Foundations", content: [`Rich traditions in ${origin}`] },
                    { period: "1500s-1800s: Migration Period", content: ["Cultural movement and adaptation"] },
                    { period: "1800s-1900s: Establishment", content: [`Communities form in ${destination}`] },
                    { period: "1900s-Present: Evolution", content: ["Modern expressions develop"] }
                ];
            },
            
            generateBasicArtExamples(origin, destination) {
                return {
                    traditional: { 
                        name: `Traditional ${origin} Art`, 
                        description: `Original cultural expressions from ${origin}` 
                    },
                    contemporary: { 
                        name: `${destination} Evolution`, 
                        description: `Adapted forms in ${destination} communities` 
                    }
                };
            }
        };
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
                <i class="fas fa-robot fa-pulse"></i>
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
            if (result && result.text && !result.text.includes('rich cultural heritage that has spread across the globe')) {
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
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for config file to load
    setTimeout(async () => {
        console.log('🚀 Initializing SecureAIConfig...');
        console.log('🔍 window.CONFIG available:', !!window.CONFIG);
        if (window.CONFIG) {
            console.log('🔍 CONFIG keys:', Object.keys(window.CONFIG));
        }
        
        const aiConfig = new SecureAIConfig();
        window.secureAIConfigInstance = aiConfig;
        const success = await aiConfig.initialize();
        
        if (success) {
            console.log('✅ AI configuration complete - features enabled');
        } else {
            console.log('⚠️ AI configuration complete - using fallback mode');
        }
    }, 1500);
});

window.SecureAIConfig = SecureAIConfig;