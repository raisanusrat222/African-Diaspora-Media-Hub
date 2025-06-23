class DiasporaAIService {
    constructor() {
        // Store API key securely - you'll set this via environment or config
        this.apiKey = null;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
        this.isInitialized = false;
        
        // User tracking for personalization
        this.userProfile = {
            countries: [],
            interests: [],
            timeSpent: {},
            lastActivity: Date.now()
        };
        
        this.loadUserProfile();
    }
    
    // Initialize with API key
    initialize(apiKey) {
        this.apiKey = apiKey;
        this.isInitialized = true;
        console.log('DiasporaAI service initialized');
    }
    
    // Core OpenAI API call
    async callOpenAI(prompt, maxTokens = 400, temperature = 0.7) {
        if (!this.isInitialized) {
            throw new Error('AI service not initialized. Please call initialize() with your API key.');
        }
        
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert on African diaspora history, culture, and communities worldwide. Provide accurate, engaging, and culturally sensitive, unbiased information."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: temperature
                })
            });
            
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content.trim();
            
        } catch (error) {
            console.error('AI Service Error:', error);
            
            // Fallback to pre-written content if API fails
            return this.getFallbackContent(prompt);
        }
    }
    
    // Generate country diaspora summary
    async generateCountrySummary(country) {
        const prompt = `Generate a comprehensive but concise summary about the ${country} diaspora community. Include:
        
        1. Population estimates and main destination countries
        2. Key historical migration periods and reasons
        3. Cultural contributions and notable communities
        4. Current cultural centers and organizations
        5. Notable figures and achievements
        6. The impact on present-day diaspora communities
        
        Keep it engaging, informative, and 500 words or less. Focus on both positive and negative aspects, non bias, while being historically accurate. Include any fun facts that you see fit.`;
        
        try {
            const summary = await this.callOpenAI(prompt, 350);
            
            // Track user interest
            this.trackUserInterest('country', country);
            
            return {
                text: summary,
                statistics: await this.generateCountryStats(country),
                recommendations: await this.generateRelatedCountries(country)
            };
            
        } catch (error) {
            console.error('Error generating country summary:', error);
            return this.getFallbackCountrySummary(country);
        }
    }
    
    // Generate country statistics
    async generateCountryStats(country) {
        const prompt = `Provide key statistics for the ${country} diaspora in this format:
        Diaspora Population: [number]
        Main Destinations: [top 3 countries]
        Cultural Centers: [estimated number globally]
        
        Give realistic estimates based on known data.`;
        
        try {
            const stats = await this.callOpenAI(prompt, 150, 0.3);
            return this.parseStatsResponse(stats);
        } catch (error) {
            return this.getFallbackStats(country);
        }
    }
    
    // Generate personalized recommendations
    async generatePersonalizedRecommendations() {
        if (this.userProfile.countries.length === 0) {
            return this.getDefaultRecommendations();
        }
        
        const userContext = `User has shown interest in: ${this.userProfile.countries.join(', ')} 
        and topics: ${this.userProfile.interests.join(', ')}`;
        
        const prompt = `Based on a user interested in ${this.userProfile.countries.join(' and ')} diaspora communities, 
        recommend 3 specific things they should explore next on our diaspora platform. Consider:
        - Related countries with cultural connections
        - Specific historical events or time periods
        - Cultural expressions (music, art, literature)
        - Notable figures or movements
        
        Format as a brief, engaging list with explanations why each recommendation connects to their interests.`;
        
        try {
            return await this.callOpenAI(prompt, 300);
        } catch (error) {
            return this.getDefaultRecommendations();
        }
    }
    
    // Smart search suggestions
    async generateSearchSuggestions(query) {
        const prompt = `For someone searching "${query}" on a diaspora platform, suggest 3-5 related search terms that would help them discover more relevant content. Focus on:
        - Related countries or regions
        - Cultural topics
        - Historical periods
        - Notable figures
        
        Return only the search terms, separated by commas.`;
        
        try {
            const suggestions = await this.callOpenAI(prompt, 100, 0.5);
            return suggestions.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } catch (error) {
            return this.getFallbackSearchSuggestions(query);
        }
    }
    
    // User tracking methods
    trackUserInterest(type, value) {
        const now = Date.now();
        
        if (type === 'country' && !this.userProfile.countries.includes(value)) {
            this.userProfile.countries.push(value);
        } else if (type === 'topic' && !this.userProfile.interests.includes(value)) {
            this.userProfile.interests.push(value);
        }
        
        this.userProfile.lastActivity = now;
        this.saveUserProfile();
    }
    
    trackPageTime(page, timeSpent) {
        this.userProfile.timeSpent[page] = (this.userProfile.timeSpent[page] || 0) + timeSpent;
        this.saveUserProfile();
    }
    
    // User profile persistence
    saveUserProfile() {
        try {
            localStorage.setItem('diaspora_user_profile', JSON.stringify(this.userProfile));
        } catch (error) {
            console.warn('Could not save user profile:', error);
        }
    }
    
    loadUserProfile() {
        try {
            const saved = localStorage.getItem('diaspora_user_profile');
            if (saved) {
                this.userProfile = { ...this.userProfile, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Could not load user profile:', error);
        }
    }
    
    // Utility methods
    parseStatsResponse(response) {
        const lines = response.split('\n');
        const stats = {};
        
        lines.forEach(line => {
            if (line.includes('Diaspora Population:')) {
                stats.population = line.split(':')[1].trim();
            } else if (line.includes('Main Destinations:')) {
                stats.destinations = line.split(':')[1].trim();
            } else if (line.includes('Cultural Centers:')) {
                stats.centers = line.split(':')[1].trim();
            }
        });
        
        return stats;
    }
    
    // Fallback content when API is unavailable
    getFallbackContent(prompt) {
        if (prompt.toLowerCase().includes('country') || prompt.toLowerCase().includes('diaspora')) {
            return "This diaspora community has a rich history spanning multiple continents, with vibrant cultural expressions and significant contributions to their host countries. Cultural centers and organizations worldwide help preserve traditions while fostering new connections.";
        }
        return "Exploring the rich tapestry of diaspora communities reveals fascinating stories of migration, cultural preservation, and adaptation across the globe.";
    }
    
    getFallbackCountrySummary(country) {
        return {
            text: `The ${country} diaspora represents a vibrant global community with rich cultural traditions and significant contributions worldwide. Through migration patterns spanning centuries, ${country} communities have established themselves across multiple continents, maintaining strong cultural ties while adapting to new environments. Cultural centers, community organizations, and festivals help preserve traditions and foster connections between diaspora communities and their homeland.`,
            statistics: this.getFallbackStats(country),
            recommendations: [`Learn about ${country} cultural festivals`, `Explore ${country} music and dance`, `Discover ${country} literature and authors`]
        };
    }
    
    getFallbackStats(country) {
        return {
            population: "Several million worldwide",
            destinations: "North America, Europe, Caribbean",
            centers: "100+ globally"
        };
    }
    
    getDefaultRecommendations() {
        return [
            "Explore African music genres and their global influence",
            "Discover Caribbean cultural connections to Africa",
            "Learn about the Great Migration period in history"
        ];
    }
    
    getFallbackSearchSuggestions(query) {
        const suggestions = {
            'nigeria': ['afrobeat', 'igbo culture', 'yoruba traditions', 'nollywood'],
            'jamaica': ['reggae music', 'rastafari', 'caribbean culture', 'bob marley'],
            'ethiopia': ['orthodox christianity', 'coffee culture', 'haile selassie', 'traditional music'],
            'ghana': ['kente cloth', 'ashanti kingdom', 'highlife music', 'akan culture'],
            'music': ['afrobeats', 'reggae', 'jazz', 'blues', 'highlife'],
            'history': ['slave trade', 'great migration', 'independence movements', 'civil rights']
        };
        
        const key = Object.keys(suggestions).find(k => query.toLowerCase().includes(k));
        return key ? suggestions[key] : ['african culture', 'diaspora history', 'cultural heritage'];
    }
}

// Create global instance
window.DiasporaAI = new DiasporaAIService();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiasporaAIService;
}