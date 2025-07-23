// js/ai-service.js - Enhanced version with gap-filling capabilities
class DiasporaAIService {
    constructor() {
        // Store API key securely - you'll set this via environment or config
        this.apiKey = null;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-4o-mini';
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
                            content: "You are an expert on African diaspora history, culture, and communities worldwide. Provide direct, engaging, and culturally sensitive information. Never start with filler words like 'certainly', 'oh', 'well', or 'indeed'. Jump straight into the content. Write in an engaging, informative style with specific details, names, and facts."
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
    
    // NEW: Enhanced country summary with gap-filling
    async enhanceCountrySummaryWithAI(country) {
        console.log('🎯 Enhancing country summary with AI for:', country.name);
        
        const summaryText = document.getElementById('summary-text');
        if (!summaryText) {
            console.log('❌ Summary text element not found');
            return;
        }
        
        try {
            // Identify gaps in current data
            const gaps = this.identifyCountryGaps(country);
            console.log('📊 Identified gaps:', gaps);
            
            // Build gap-filling prompt
            const enhancedPrompt = this.buildGapFillingPrompt(country, gaps);
            
            // Show AI enhancement indicator
            this.showAIEnhancementIndicator();
            
            // Get AI enhancement
            const enhancement = await this.callOpenAI(enhancedPrompt, 400, 0.7);
            
            // Update the summary with enhancement
            this.updateSummaryWithEnhancement(country, enhancement);
            
            // Track user interest
            this.trackUserInterest('country', country.name);
            
        } catch (error) {
            console.error('❌ AI enhancement failed:', error);
            this.hideAIEnhancementIndicator();
            
            // Add fallback enhancement
            this.addFallbackEnhancement(country);
        }
    }
    
    // NEW: Identify what data gaps exist for a country
    identifyCountryGaps(country) {
        const gaps = [];
        
        // Check for missing notable figures
        if (!country.notableFigures || country.notableFigures.length === 0) {
            gaps.push('notable_figures');
        }
        
        // Check for missing festivals
        if (!country.festivals || country.festivals.length === 0) {
            gaps.push('festivals');
        }
        
        // Check for missing cuisine info
        if (!country.cuisine || !country.cuisineDetails) {
            gaps.push('cuisine');
        }
        
        // Check for missing language info
        if (!country.languages || country.languages.length === 0) {
            gaps.push('languages');
        }
        
        // Check for missing economic impact
        if (!country.economicImpact) {
            gaps.push('economic_impact');
        }
        
        return gaps;
    }
    
    // NEW: Build prompt for filling identified gaps
    buildGapFillingPrompt(country, gaps) {
        const gapInstructions = this.buildGapInstructions(country.name, gaps);
        
        return `
Create enhanced content for ${country.name} diaspora community that seamlessly extends the existing information.

EXISTING DATA (reference only, don't repeat):
- Population: ${country.diaspora} worldwide
- Region: ${country.region}
- Main destinations: ${country.destinations} countries
- Cultural centers: ${country.culturalCenters}

${gapInstructions}

Write 2-3 additional paragraphs that naturally flow from the existing summary. Make it feel like one cohesive, authoritative description. Include specific names, places, and examples where possible. Write in an engaging, informative style.
        `.trim();
    }
    
    // NEW: Build specific instructions for each gap type
    buildGapInstructions(countryName, gaps) {
        let instructions = 'ENHANCE WITH THESE DETAILS:\n';
        
        if (gaps.includes('notable_figures')) {
            instructions += `- Notable Figures: Name 2-3 prominent ${countryName} diaspora members (writers, artists, business leaders, etc.)\n`;
        }
        
        if (gaps.includes('festivals')) {
            instructions += `- Cultural Festivals: Describe 1-2 major ${countryName} celebrations held in diaspora communities worldwide\n`;
        }
        
        if (gaps.includes('cuisine')) {
            instructions += `- Cuisine Impact: How ${countryName} traditional foods have influenced global cuisine and where they're popular\n`;
        }
        
        if (gaps.includes('languages')) {
            instructions += `- Languages: What ${countryName} languages are preserved and spoken in diaspora communities\n`;
        }
        
        if (gaps.includes('economic_impact')) {
            instructions += `- Economic Contributions: Estimate remittances sent back to ${countryName} and economic impact on host countries\n`;
        }
        
        return instructions;
    }
    
    // NEW: Show AI enhancement loading indicator
    showAIEnhancementIndicator() {
        const summaryText = document.getElementById('summary-text');
        if (!summaryText) return;
        
        // Remove any existing indicator
        const existingIndicator = summaryText.querySelector('.ai-enhancement-indicator');
        if (existingIndicator) existingIndicator.remove();
        
        const indicator = document.createElement('div');
        indicator.className = 'ai-enhancement-indicator';
        indicator.style.cssText = `
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            animation: aiPulse 2s infinite;
        `;
        indicator.innerHTML = `
            <div class="spinner" style="
                width: 16px; 
                height: 16px; 
                border: 2px solid rgba(255,255,255,0.3); 
                border-top: 2px solid white; 
                border-radius: 50%; 
                animation: spin 1s linear infinite;
            "></div>
            <span>AI is enhancing this summary with additional insights...</span>
        `;
        
        summaryText.appendChild(indicator);
        
        // Add CSS animations if not already present
        if (!document.getElementById('ai-enhancement-styles')) {
            const style = document.createElement('style');
            style.id = 'ai-enhancement-styles';
            style.textContent = `
                @keyframes aiPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.02); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // NEW: Hide AI enhancement indicator
    hideAIEnhancementIndicator() {
        const indicator = document.querySelector('.ai-enhancement-indicator');
        if (indicator) {
            indicator.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => indicator.remove(), 300);
        }
    }
    
    // NEW: Update summary with AI enhancement
    updateSummaryWithEnhancement(country, enhancement) {
        const summaryText = document.getElementById('summary-text');
        if (!summaryText) return;
        
        // Remove loading indicator
        this.hideAIEnhancementIndicator();
        
        // Get current content
        const currentContent = summaryText.innerHTML;
        
        // Add enhanced content
        const enhancedContent = `
            ${currentContent}
            <div class="ai-enhanced-content" style="
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                animation: fadeInUp 0.8s ease;
            ">
                ${this.formatEnhancementContent(enhancement)}
            </div>
        `;
        
        summaryText.innerHTML = enhancedContent;
        
        // Add success indicator
        this.addEnhancementSuccessIndicator();
        
        // Add fade-in animation CSS if not present
        if (!document.getElementById('enhancement-animations')) {
            const style = document.createElement('style');
            style.id = 'enhancement-animations';
            style.textContent = `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // NEW: Format AI enhancement content
    formatEnhancementContent(content) {
        // Split into paragraphs and clean up
        const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
        
        return paragraphs.map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
    }
    
    // NEW: Add success indicator
    addEnhancementSuccessIndicator() {
        const summaryText = document.getElementById('summary-text');
        if (!summaryText) return;
        
        const successIndicator = document.createElement('div');
        successIndicator.style.cssText = `
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            color: #4caf50;
            padding: 8px 12px;
            border-radius: 6px;
            margin-top: 15px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: fadeInUp 0.5s ease;
        `;
        successIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Enhanced with AI insights';
        
        summaryText.appendChild(successIndicator);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successIndicator.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => successIndicator.remove(), 300);
        }, 3000);
    }
    
    // NEW: Add fallback enhancement when AI fails
    addFallbackEnhancement(country) {
        const summaryText = document.getElementById('summary-text');
        if (!summaryText) return;
        
        const fallbackContent = this.getFallbackEnhancement(country);
        
        const enhancedContent = `
            ${summaryText.innerHTML}
            <div class="fallback-enhanced-content" style="
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                animation: fadeInUp 0.8s ease;
            ">
                ${fallbackContent}
            </div>
        `;
        
        summaryText.innerHTML = enhancedContent;
        
        // Add info indicator
        const infoIndicator = document.createElement('div');
        infoIndicator.style.cssText = `
            background: rgba(255, 152, 0, 0.1);
            border: 1px solid rgba(255, 152, 0, 0.3);
            color: #ff9800;
            padding: 8px 12px;
            border-radius: 6px;
            margin-top: 15px;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        infoIndicator.innerHTML = '<i class="fas fa-info-circle"></i> Enhanced with curated insights';
        
        summaryText.appendChild(infoIndicator);
    }
    
    // NEW: Get fallback enhancement content
    getFallbackEnhancement(country) {
        const fallbackEnhancements = {
            'Nigeria': `
                <p>The Nigerian diaspora includes influential figures like author Chimamanda Ngozi Adichie and business magnate Aliko Dangote, who have elevated Nigeria's global profile through literature and entrepreneurship. Nigerian communities worldwide celebrate Independence Day festivals each October, featuring traditional Afrobeat music, colorful attire, and authentic cuisine.</p>
                <p>Nigerian dishes like jollof rice, suya, and plantains have gained international popularity, with Nigerian restaurants thriving in major cities. The diaspora maintains connections through languages like Yoruba, Igbo, and Hausa, often taught in weekend cultural schools.</p>
            `,
            'Jamaica': `
                <p>The Jamaican diaspora has produced global icons like Bob Marley and Marcus Garvey, whose influence extends far beyond music into social consciousness and Pan-African identity. Annual events like Jamaican Independence Day and Bob Marley's birthday celebrations unite communities worldwide through reggae music and cultural pride.</p>
                <p>Jamaican cuisine, including jerk chicken, ackee and saltfish, and patties, has become globally recognized comfort food. Patois language and Rastafarian philosophy continue to influence international culture and spirituality.</p>
            `,
            'Ghana': `
                <p>Ghana's diaspora includes notable figures like author Ama Ata Aidoo and businessman Tony Elumelu, contributing to global literature and business innovation. The country's "Year of Return" initiative has strengthened connections between African Americans and Ghana, with annual homecoming celebrations becoming major cultural events.</p>
                <p>Ghanaian foods like kelewele, banku, and jollof rice compete globally for culinary recognition. Traditional languages like Twi and Ga are preserved through cultural associations and weekend schools in diaspora communities.</p>
            `
        };
        
        return fallbackEnhancements[country.name] || `
            <p>The ${country.name} diaspora maintains strong cultural connections through traditional festivals, cuisine, and language preservation. Community leaders and cultural organizations work to bridge homeland and diaspora experiences.</p>
            <p>Economic contributions through remittances and business networks continue to strengthen ties between ${country.name} and its global communities.</p>
        `;
    }
    
    // Generate country diaspora summary with clean prompting
    async generateCountrySummary(country) {
        const enhancedPrompt = `Write a 250-300 word summary about the ${country} diaspora community. Include:

- Specific population numbers and where they've settled globally
- 2-3 notable figures who've made significant impacts (name them specifically)
- Unique cultural contributions or innovations they've brought to their new countries
- How they maintain connections to ${country} today
- One surprising or lesser-known fact about this diaspora community

Write in an engaging, informative tone with concrete examples and specific details. Start directly with the content - no introductory phrases.`;
        
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
        Main Destinations: [top 3-4 countries like "USA, UK, Canada, Germany"]
        Cultural Centers: [number like "300+ globally"]
        
        Be specific with actual numbers, not vague ranges. Start with the data immediately.`;
        
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
    
    // Enhanced literature search with topic-based recommendations
    async enhanceLiteratureSearch(query, works) {
        const searchPrompt = `I'm searching for "${query}" in African diaspora literature. Here are some works in our collection: ${works.map(w => `${w.title} by ${w.author}`).slice(0, 5).join(', ')}.

Explain what connects "${query}" to African diaspora literature. What themes, experiences, or perspectives should readers expect when exploring this topic? Write 2-3 sentences that help readers understand why this topic matters in diaspora storytelling.

Start directly with the explanation - no introductory phrases.`;
        
        try {
            const insight = await this.callOpenAI(searchPrompt, 200, 0.7);
            this.trackUserInterest('topic', query);
            return insight;
        } catch (error) {
            console.error('Error enhancing literature search:', error);
            return this.getFallbackSearchInsight(query);
        }
    }
    
    // Generate work analysis with clean, direct responses
    async generateWorkAnalysis(work) {
        const analysisPrompt = `Analyze "${work.title}" by ${work.author}. Write 150-200 words covering:

- Why this ${work.type} is significant in African diaspora literature
- What makes it compelling for modern readers
- How it explores themes like ${work.themes.slice(0, 3).join(', ')}
- Its lasting impact or relevance

Write in an engaging, informative style. Start directly with the analysis - no introductory phrases.`;
        
        try {
            const analysis = await this.callOpenAI(analysisPrompt, 300, 0.7);
            
            const recommendationsPrompt = `Based on "${work.title}" by ${work.author}, recommend 3 similar works from African diaspora literature. For each recommendation:

- Title and author
- 2-3 sentences explaining why it's similar and worth reading

Focus on works that share themes like ${work.themes.slice(0, 2).join(' and ')} or similar narrative approaches. Format as a clear list.`;
            
            const recommendations = await this.callOpenAI(recommendationsPrompt, 300, 0.6);
            
            return { analysis, recommendations };
            
        } catch (error) {
            console.error('Error generating work analysis:', error);
            return this.getPreGeneratedAnalysis(work.id);
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
        
        Format as a brief, engaging list with explanations why each recommendation connects to their interests. Start directly with the recommendations.`;
        
        try {
            return await this.callOpenAI(prompt, 300);
        } catch (error) {
            return this.getDefaultRecommendations();
        }
    }
    
    // Smart search suggestions for literature topics
    async generateSearchSuggestions(query) {
        const prompt = `For someone searching "${query}" on a diaspora literature platform, suggest 5 related search terms that would help them discover more relevant works. Focus on:
        - Related themes or concepts
        - Cultural topics
        - Historical periods
        - Literary movements
        
        Return only the search terms, separated by commas. No explanations.`;
        
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
            return "Content Unavailable";
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
    
    // FIXED: Fallback stats with valid structure
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
            'history': ['slave trade', 'great migration', 'independence movements', 'civil rights'],
            'identity': ['cultural heritage', 'belonging', 'roots', 'home'],
            'migration': ['displacement', 'settlement', 'adaptation', 'diaspora'],
            'poetry': ['spoken word', 'harlem renaissance', 'contemporary poetry', 'oral traditions'],
            'novels': ['african fiction', 'caribbean literature', 'contemporary narratives', 'coming of age']
        };
        
        const key = Object.keys(suggestions).find(k => query.toLowerCase().includes(k));
        return key ? suggestions[key] : ['cultural heritage', 'diaspora stories', 'identity', 'migration'];
    }
    
    // Enhanced pre-generated analysis with clean, direct content
    getPreGeneratedAnalysis(itemId) {
        const analyses = {
            'things-fall-apart': {
                analysis: "Achebe's masterpiece fundamentally changed how the world sees Africa in literature. Instead of colonial stereotypes, he presents a complex Igbo society with sophisticated justice systems, spiritual beliefs, and social structures. The novel's power lies in showing colonialism's impact through African eyes - not as 'civilization' arriving, but as a destructive force that shattered functioning communities. Essential reading for understanding how storytelling can reclaim narrative power and challenge dominant perspectives.",
                recommendations: "Arrow of God by Chinua Achebe - Continues exploring colonial impact on Igbo communities with deeper character development. Nervous Conditions by Tsitsi Dangarembga - Examines similar themes of tradition vs. modernity in colonial Zimbabwe through a young woman's perspective. So Long a Letter by Mariama Bâ - Explores tradition and change in post-colonial Senegal through intimate correspondence."
            },
            'douglass-narrative': {
                analysis: "Douglass transformed his life story into a powerful weapon against slavery, proving enslaved people's full humanity through brilliant prose and moral reasoning. The narrative's genius lies in showing education as both liberation and torment - literacy revealed slavery's full horror while providing tools for resistance. This bestseller demolished racist justifications for slavery through lived experience, establishing the template for resistance literature that influenced generations of writers.",
                recommendations: "Incidents in the Life of a Slave Girl by Harriet Jacobs - Provides crucial female perspective on slavery with similar literary power and moral clarity. Beloved by Toni Morrison - Explores slavery's psychological aftermath through innovative narrative techniques. Up From Slavery by Booker T. Washington - Offers contrasting post-emancipation perspective on African American progress and education."
            }
        };
        
        return analyses[itemId] || {
            analysis: "This work represents an important contribution to African diaspora literature, exploring themes of identity, culture, and the human experience through a unique lens that challenges conventional narratives and offers fresh perspectives on the diaspora experience.",
            recommendations: "Related works in our collection explore similar themes of migration, identity, and cultural adaptation. Contemporary authors continue these conversations in modern contexts. Historical narratives provide important background to current diaspora experiences."
        };
    }
    
    getFallbackSearchInsight(query) {
        const insights = {
            'identity': "Identity in diaspora literature explores the complex experience of belonging to multiple worlds simultaneously, examining how individuals navigate between heritage and adaptation.",
            'migration': "Migration narratives in diaspora literature capture both loss and discovery, showing how people carry entire cultures while creating new forms of home.",
            'colonialism': "Post-colonial literature gives voice to experiences often marginalized in mainstream narratives, revealing colonialism's lasting impact on communities and individuals.",
            'resistance': "Resistance literature celebrates the countless ways people fight back against oppression, from armed rebellion to cultural preservation.",
            'family': "Family narratives explore how traditions, trauma, and love travel across generations and continents in diaspora communities.",
            'memory': "Memory in diaspora writing preserves languages, customs, and stories that might otherwise be lost to time and displacement."
        };
        
        const key = Object.keys(insights).find(k => query.toLowerCase().includes(k));
        return key ? insights[key] : "This topic reveals important aspects of diaspora experience, from cultural preservation to adaptation in new environments.";
    }
}

// Create global instance
window.DiasporaAI = new DiasporaAIService();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiasporaAIService;
}