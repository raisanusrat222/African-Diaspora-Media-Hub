// js/ai-service.js - Fixed version with NaN prevention
class DiasporaAIService {
    constructor() {
        // Store API key securely - you'll set this via environment or config
        this.apiKey = null;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-4.1';
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
            console.log('❌ AI service not initialized');
            throw new Error('AI service not initialized. Please call initialize() with your API key.');
        }
        
        console.log('🚀 Making OpenAI API call...');
        console.log('📝 Prompt preview:', prompt.substring(0, 100) + '...');
        
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
                            content: "You are an expert on African diaspora history, culture, and communities worldwide. Provide accurate, engaging, and culturally sensitive information."
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
            
            console.log('📡 API response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ OpenAI API error:', response.status, errorText);
                throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            
            console.log('✅ API success! Content preview:', content.substring(0, 100) + '...');
            
            return content;
            
        } catch (error) {
            console.error('💥 AI Service Error:', error);
            
            // Fallback to pre-written content if API fails
            console.log('⚠️ Falling back to static content');
            return this.getFallbackContent(prompt);
        }
    }
    
    // Generate country diaspora summary with better prompting
    async generateCountrySummary(country) {
        const enhancedPrompt = `Write an engaging 300-word or less summary about the ${country} diaspora community. Make it interesting and informative by including:

- Specific numbers and geographic spread of the diaspora
- 2-3 notable figures who've made an impact (name them specifically)
- Unique cultural contributions or innovations they've brought to their new countries
- How they maintain connections to ${country} today
- Similarities in modern African Diaspora
- One surprising or lesser-known fact about this diaspora community

Write in a conversational, engaging tone that would captivate someone browsing a cultural website. Focus on stories and concrete examples rather than generic statements.`;
        
        try {
            const summary = await this.callOpenAI(enhancedPrompt, 400, 0.8);
            
            // Track user interest
            this.trackUserInterest('country', country);
            
            return {
                text: summary,
                statistics: await this.generateCountryStats(country),
                recommendations: this.getDefaultRecommendations()
            };
            
        } catch (error) {
            console.error('Error generating country summary:', error);
            return this.getFallbackCountrySummary(country);
        }
    }
    
    // Generate country statistics
    async generateCountryStats(country) {
        const prompt = `Provide realistic statistics for the ${country} diaspora in this exact format:
        Diaspora Population: [specific number like "4.2M worldwide"]
        Main Destinations: [top 3-4 countries like "USA, UK, Canada, Germany that the diaspora migrated to"]
        Cultural Centers: [number like "300+ globally"]
        
        Be specific with actual numbers, not vague ranges.`;
        
        try {
            const stats = await this.callOpenAI(prompt, 150, 0.3);
            const parsedStats = this.parseStatsResponse(stats);
            
            // If AI parsing failed or returned empty, use fallback
            if (!parsedStats.population && !parsedStats.destinations && !parsedStats.centers) {
                console.log('AI stats parsing failed, using fallback for:', country);
                return this.getFallbackStats(country);
            }
            
            // Mix AI results with fallbacks for missing fields
            const fallbackStats = this.getFallbackStats(country);
            return {
                population: parsedStats.population || fallbackStats.population,
                destinations: parsedStats.destinations || fallbackStats.destinations,
                centers: parsedStats.centers || fallbackStats.centers
            };
            
        } catch (error) {
            console.error('Error generating country stats:', error);
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
        // FIXED: Add NaN prevention for time tracking
        const validTimeSpent = this.safeParseNumber(timeSpent, 0);
        const currentTime = this.safeParseNumber(this.userProfile.timeSpent[page], 0);
        
        this.userProfile.timeSpent[page] = currentTime + validTimeSpent;
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
                const parsedProfile = JSON.parse(saved);
                // FIXED: Ensure loaded profile has valid structure
                this.userProfile = {
                    countries: Array.isArray(parsedProfile.countries) ? parsedProfile.countries : [],
                    interests: Array.isArray(parsedProfile.interests) ? parsedProfile.interests : [],
                    timeSpent: typeof parsedProfile.timeSpent === 'object' && parsedProfile.timeSpent !== null ? parsedProfile.timeSpent : {},
                    lastActivity: this.safeParseNumber(parsedProfile.lastActivity, Date.now())
                };
            }
        } catch (error) {
            console.warn('Could not load user profile:', error);
            // Reset to default if parsing fails
            this.userProfile = {
                countries: [],
                interests: [],
                timeSpent: {},
                lastActivity: Date.now()
            };
        }
    }
    
    // FIXED: Enhanced parseStatsResponse with NaN prevention
    parseStatsResponse(response) {
        const lines = response.split('\n');
        const stats = {};
        
        lines.forEach(line => {
            try {
                if (line.includes('Diaspora Population:')) {
                    const value = line.split(':')[1];
                    stats.population = value ? value.trim() : 'Data unavailable';
                } else if (line.includes('Main Destinations:')) {
                    const value = line.split(':')[1];
                    stats.destinations = value ? value.trim() : 'Data unavailable';
                } else if (line.includes('Cultural Centers:')) {
                    const value = line.split(':')[1];
                    stats.centers = value ? value.trim() : 'Data unavailable';
                }
            } catch (error) {
                console.warn('Error parsing stats line:', line, error);
            }
        });
        
        // FIXED: Ensure all required fields exist with fallbacks
        return {
            population: stats.population || 'Data unavailable',
            destinations: stats.destinations || 'Data unavailable',
            centers: stats.centers || 'Data unavailable'
        };
    }
    
    // FIXED: Added utility function for safe number parsing
    safeParseNumber(value, fallback = 0) {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }
        
        const parsed = typeof value === 'number' ? value : parseFloat(value);
        return isNaN(parsed) ? fallback : parsed;
    }
    
    // FIXED: Enhanced safeParseInt for integer values
    safeParseInt(value, fallback = 0) {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }
        
        const parsed = typeof value === 'number' ? Math.floor(value) : parseInt(value, 10);
        return isNaN(parsed) ? fallback : parsed;
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
    
    // FIXED: Enhanced fallback stats with guaranteed valid structure
    getFallbackStats(country) {
        const fallbackData = {
            'Nigeria': { population: "17M+", destinations: "USA, UK, Canada", centers: "450+" },
            'Jamaica': { population: "3.5M+", destinations: "USA, UK, Canada", centers: "120+" },
            'Ghana': { population: "3.2M+", destinations: "USA, UK, Germany", centers: "200+" },
            'Ethiopia': { population: "2.8M+", destinations: "USA, Saudi Arabia, Sudan", centers: "180+" },
            'South Africa': { population: "2.5M+", destinations: "Australia, UK, USA", centers: "150+" },
            'Kenya': { population: "3M+", destinations: "USA, UK, Canada", centers: "140+" },
            'Senegal': { population: "1.8M+", destinations: "France, Italy, Spain", centers: "90+" },
            'Haiti': { population: "2.5M+", destinations: "USA, Canada, France", centers: "110+" },
            'Brazil': { population: "4.5M+", destinations: "USA, Europe, Latin America", centers: "200+" },
            'Trinidad and Tobago': { population: "800K+", destinations: "USA, UK, Canada", centers: "60+" }
        };
        
        const defaultStats = {
            population: "Several million worldwide",
            destinations: "North America, Europe, Caribbean",
            centers: "100+ globally"
        };
        
        // FIXED: Ensure we always return a valid stats object
        const countryStats = fallbackData[country] || defaultStats;
        return {
            population: countryStats.population || defaultStats.population,
            destinations: countryStats.destinations || defaultStats.destinations,
            centers: countryStats.centers || defaultStats.centers
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