// js/art-evolution-tracker.js - AI-Enhanced Art Evolution Analysis

/**
 * Visual Arts AI service for art evolution analysis
 * Works independently or extends existing DiasporaAI service
 */
class VisualArtsAI {
    constructor() {
        this.artAnalysisCache = new Map();
        this.evolutionCache = new Map();
        this.isInitialized = false;
        this.baseService = null;
    }

    /**
     * Initialize with base AI service capabilities if available
     */
    initialize(baseService) {
        if (baseService && typeof baseService.callOpenAI === 'function') {
            this.baseService = baseService;
            this.isInitialized = true;
            console.log('✅ VisualArtsAI initialized with base service');
        } else {
            this.isInitialized = true;
            console.log('⚠️ VisualArtsAI initialized in standalone mode');
        }
        return this;
    }

    /**
     * Call OpenAI API through base service or fallback
     */
    async callOpenAI(prompt, maxTokens, temperature) {
        if (this.baseService && typeof this.baseService.callOpenAI === 'function') {
            return await this.baseService.callOpenAI(prompt, maxTokens, temperature);
        } else {
            console.log('🤖 AI call attempted but no service available, using fallback');
            throw new Error('AI service not available');
        }
    }

    /**
     * Track user interest through base service or fallback
     */
    trackUserInterest(type, value) {
        if (this.baseService && typeof this.baseService.trackUserInterest === 'function') {
            this.baseService.trackUserInterest(type, value);
        } else {
            console.log('📊 User interest tracked:', type, '-', value);
        }
    }

    /**
     * Analyze artistic evolution between two countries
     */
    async analyzeArtEvolution(originCountry, destCountry, artStyle) {
        if (!artStyle) {
            artStyle = 'traditional patterns';
        }

        const cacheKey = originCountry + '-' + destCountry + '-' + artStyle;
        
        // Check cache first
        if (this.evolutionCache.has(cacheKey)) {
            console.log('📚 Using cached evolution analysis');
            return this.evolutionCache.get(cacheKey);
        }

        const prompt = 'Analyze the artistic evolution from ' + originCountry + ' to ' + destCountry + ':\n\n' +
            'Focus on ' + artStyle + ' and cultural artistic traditions:\n\n' +
            '**Original Form in ' + originCountry + ':**\n' +
            '- Traditional techniques, materials, and cultural significance\n' +
            '- Ceremonial and daily life applications\n' +
            '- Key visual characteristics and symbolic meanings\n' +
            '- Social and spiritual context\n\n' +
            '**Migration Journey (Historical Context):**\n' +
            '- How artistic traditions traveled (forced migration, voluntary movement)\n' +
            '- What changed due to new environments and available materials\n' +
            '- Cultural adaptation pressures and opportunities\n' +
            '- Interactions with local artistic traditions\n\n' +
            '**Evolution in ' + destCountry + ':**\n' +
            '- New influences absorbed (indigenous, European, other African cultures)\n' +
            '- How core traditions were preserved or transformed\n' +
            '- Contemporary expressions and modern interpretations\n' +
            '- Role in maintaining cultural identity\n\n' +
            '**Specific Examples:**\n' +
            '- Name actual artworks, artists, or artistic movements representing each phase\n' +
            '- Describe visual transformation of key symbolic elements\n' +
            '- Highlight innovative fusion techniques or styles\n\n' +
            'Write this as an engaging story of cultural resilience, adaptation, and artistic innovation. Focus on specific details and concrete examples rather than generalizations.';

        try {
            const analysis = await this.callOpenAI(prompt, 600, 0.7);
            
            // Generate complementary content
            const timeline = await this.generateArtEvolutionTimeline(originCountry, destCountry);
            const symbolConnections = await this.findSymbolConnections(originCountry, destCountry);
            const artExamples = await this.generateArtExamples(originCountry, destCountry);
            
            const result = {
                story: analysis,
                timeline: timeline,
                symbolConnections: symbolConnections,
                artExamples: artExamples,
                generatedAt: Date.now()
            };

            // Cache the result
            this.evolutionCache.set(cacheKey, result);
            
            // Track user interest
            this.trackUserInterest('art_evolution', originCountry + '-' + destCountry);
            
            return result;

        } catch (error) {
            console.error('Error in art evolution analysis:', error);
            return this.getFallbackEvolutionAnalysis(originCountry, destCountry);
        }
    }

    /**
     * Generate detailed timeline of artistic evolution
     */
    async generateArtEvolutionTimeline(originCountry, destCountry) {
        const prompt = 'Create a detailed artistic evolution timeline from ' + originCountry + ' to ' + destCountry + ':\n\n' +
            'Format each period with specific artistic developments:\n\n' +
            '**Pre-1500s: Traditional Foundations**\n' +
            '- [Describe original artistic traditions in ' + originCountry + ']\n' +
            '- [Key techniques, materials, cultural context]\n\n' +
            '**1500s-1700s: Migration and Early Adaptation**\n' +
            '- [How art traveled and first adaptations]\n' +
            '- [Challenges and preservation efforts]\n\n' +
            '**1700s-1800s: Cultural Fusion Period**\n' +
            '- [New artistic forms emerging in ' + destCountry + ']\n' +
            '- [Integration with local traditions]\n\n' +
            '**1800s-1900s: Established Diaspora Expressions**\n' +
            '- [Mature fusion styles and techniques]\n' +
            '- [Notable artists and movements]\n\n' +
            '**1900s-Present: Modern and Contemporary Evolution**\n' +
            '- [Contemporary interpretations and innovations]\n' +
            '- [Current artists and global influence]\n\n' +
            'Include specific dates, artist names, artwork titles, and cultural movements where possible. Focus on concrete examples rather than general statements.';

        try {
            const timelineText = await this.callOpenAI(prompt, 500, 0.6);
            return this.parseTimelineResponse(timelineText);
        } catch (error) {
            console.error('Error generating timeline:', error);
            return this.getFallbackTimeline(originCountry, destCountry);
        }
    }

    /**
     * Find symbol connections between countries
     */
    async findSymbolConnections(originCountry, destCountry) {
        // Use the cultural symbols database if available
        if (window.SymbolDatabase && typeof window.SymbolDatabase.getEvolutionPath === 'function') {
            try {
                const evolutionPairs = window.SymbolDatabase.getEvolutionPath(originCountry, destCountry);
                if (evolutionPairs && evolutionPairs.length > 0) {
                    return evolutionPairs;
                }
            } catch (error) {
                console.warn('Error accessing symbol database:', error);
            }
        }

        // Generate AI analysis if no direct database connections
        const prompt = 'Identify specific cultural symbols that evolved from ' + originCountry + ' to ' + destCountry + ':\n\n' +
            'Look for:\n' +
            '- Traditional symbols from ' + originCountry + ' that appear in ' + destCountry + ' art\n' +
            '- How these symbols were adapted or reinterpreted\n' +
            '- What new meanings they acquired in the diaspora context\n' +
            '- Visual changes in form, color, or application\n\n' +
            'Provide 3-4 specific examples with both traditional and adapted meanings.';

        try {
            const symbolAnalysis = await this.callOpenAI(prompt, 350, 0.5);
            return this.parseSymbolConnections(symbolAnalysis);
        } catch (error) {
            console.error('Error generating symbol connections:', error);
            return this.getFallbackSymbolConnections(originCountry, destCountry);
        }
    }

    /**
     * Generate specific art examples for the evolution
     */
    async generateArtExamples(originCountry, destCountry) {
        const prompt = 'Suggest specific artworks that illustrate the artistic evolution from ' + originCountry + ' to ' + destCountry + ':\n\n' +
            '**Traditional Example from ' + originCountry + ':**\n' +
            '- Artwork name or type\n' +
            '- Artist (if known) or cultural group\n' +
            '- Brief description of style and significance\n' +
            '- Key visual elements\n\n' +
            '**Contemporary Example from ' + destCountry + ':**\n' +
            '- Artwork name or artist\n' +
            '- How it shows evolution from ' + originCountry + ' traditions\n' +
            '- New elements or innovations\n' +
            '- Cultural significance in diaspora context\n\n' +
            'Focus on real examples when possible, or describe typical representative works with specific visual details.';

        try {
            const examples = await this.callOpenAI(prompt, 300, 0.6);
            return this.parseArtExamples(examples);
        } catch (error) {
            console.error('Error generating art examples:', error);
            return this.getFallbackArtExamples(originCountry, destCountry);
        }
    }

    /**
     * Parse timeline response into structured data
     */
    parseTimelineResponse(timelineText) {
        const periods = [];
        const lines = timelineText.split('\n');
        let currentPeriod = null;

        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            
            if (trimmedLine.includes('**') && trimmedLine.includes(':')) {
                // This is a period header
                if (currentPeriod) {
                    periods.push(currentPeriod);
                }
                const periodName = trimmedLine.replace(/\*\*/g, '').replace(':', '').trim();
                currentPeriod = {
                    period: periodName,
                    content: []
                };
            } else if (currentPeriod && trimmedLine.startsWith('-')) {
                // This is content for the current period
                currentPeriod.content.push(trimmedLine.substring(1).trim());
            } else if (currentPeriod && trimmedLine.length > 0 && !trimmedLine.includes('**')) {
                // Regular content line
                currentPeriod.content.push(trimmedLine);
            }
        }

        if (currentPeriod) {
            periods.push(currentPeriod);
        }

        return periods;
    }

    /**
     * Parse art examples into structured data
     */
    parseArtExamples(examplesText) {
        const lines = examplesText.split('\n');
        const examples = { 
            traditional: {}, 
            contemporary: {} 
        };
        let currentSection = null;

        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            
            if (trimmedLine.includes('Traditional Example')) {
                currentSection = 'traditional';
            } else if (trimmedLine.includes('Contemporary Example')) {
                currentSection = 'contemporary';
            } else if (currentSection && trimmedLine.startsWith('-')) {
                const content = trimmedLine.substring(1).trim();
                
                if (content.toLowerCase().includes('artwork') || content.toLowerCase().includes('name')) {
                    const colonIndex = content.indexOf(':');
                    if (colonIndex > -1) {
                        examples[currentSection].name = content.substring(colonIndex + 1).trim();
                    }
                } else if (content.toLowerCase().includes('artist')) {
                    const colonIndex = content.indexOf(':');
                    if (colonIndex > -1) {
                        examples[currentSection].artist = content.substring(colonIndex + 1).trim();
                    }
                } else if (content.toLowerCase().includes('description')) {
                    const colonIndex = content.indexOf(':');
                    if (colonIndex > -1) {
                        examples[currentSection].description = content.substring(colonIndex + 1).trim();
                    }
                }
            }
        }

        return examples;
    }

    /**
     * Parse symbol connections into structured data
     */
    parseSymbolConnections(symbolText) {
        const connections = [];
        const lines = symbolText.split('\n');
        let currentSymbol = null;

        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            
            if (trimmedLine.startsWith('-') || trimmedLine.match(/^\d+\./)) {
                if (currentSymbol) {
                    connections.push(currentSymbol);
                }
                const symbolName = trimmedLine.replace(/^[-\d.]\s*/, '').split(':')[0].trim();
                currentSymbol = {
                    name: symbolName,
                    traditional: '',
                    adapted: ''
                };
            } else if (currentSymbol && trimmedLine.length > 0) {
                if (trimmedLine.toLowerCase().includes('traditional')) {
                    currentSymbol.traditional += trimmedLine + ' ';
                } else if (trimmedLine.toLowerCase().includes('adapted') || trimmedLine.toLowerCase().includes('diaspora')) {
                    currentSymbol.adapted += trimmedLine + ' ';
                }
            }
        }

        if (currentSymbol) {
            connections.push(currentSymbol);
        }

        return connections;
    }

    /**
     * Fallback evolution analysis when AI is unavailable
     */
    getFallbackEvolutionAnalysis(originCountry, destCountry) {
        const story = 'The artistic traditions of ' + originCountry + ' underwent significant transformation when they traveled to ' + destCountry + '. Through the resilience of communities and the adaptation to new environments, these artistic expressions evolved while maintaining their cultural essence. This evolution represents a powerful story of cultural preservation and innovation in the face of displacement and change.\n\n' +
            'The journey from ' + originCountry + ' to ' + destCountry + ' brought together diverse cultural influences, creating unique artistic forms that honor ancestral traditions while embracing new possibilities. Artists and craftspeople adapted their techniques to available materials, incorporated local aesthetic elements, and developed innovative ways to express their cultural identity in new landscapes.\n\n' +
            'These artistic evolutions serve as visual narratives of the diaspora experience, documenting both loss and discovery, preservation and innovation. They demonstrate how culture travels not as a static entity, but as a living, breathing force that adapts and grows while maintaining its essential spirit.';

        return {
            story: story,
            timeline: this.getFallbackTimeline(originCountry, destCountry),
            symbolConnections: this.getFallbackSymbolConnections(originCountry, destCountry),
            artExamples: this.getFallbackArtExamples(originCountry, destCountry),
            generatedAt: Date.now()
        };
    }

    /**
     * Fallback timeline when AI is unavailable
     */
    getFallbackTimeline(originCountry, destCountry) {
        return [
            {
                period: "Traditional Foundations (Pre-1500s)",
                content: [
                    'Rich artistic traditions established in ' + originCountry + ' with deep cultural significance',
                    "Complex symbolic systems and sophisticated craftsmanship techniques"
                ]
            },
            {
                period: "Migration Period (1500s-1700s)", 
                content: [
                    "Artistic traditions travel through forced and voluntary migration",
                    "Initial adaptation to new environments and available materials"
                ]
            },
            {
                period: "Cultural Fusion (1700s-1800s)",
                content: [
                    'New artistic forms emerge in ' + destCountry + ' through cultural exchange',
                    "Integration with indigenous and colonial artistic traditions"
                ]
            },
            {
                period: "Established Expressions (1800s-1900s)",
                content: [
                    "Mature diaspora artistic styles develop distinct characteristics",
                    "Balance between cultural preservation and local innovation"
                ]
            },
            {
                period: "Contemporary Evolution (1900s-Present)",
                content: [
                    "Modern interpretations gain global recognition and influence",
                    "Digital age enables new forms of cultural expression and connection"
                ]
            }
        ];
    }

    /**
     * Fallback symbol connections when AI is unavailable
     */
    getFallbackSymbolConnections(originCountry, destCountry) {
        return [
            {
                name: "Traditional Patterns",
                traditional: 'Sacred geometric patterns from ' + originCountry + ' representing spiritual concepts and cultural values',
                adapted: 'Evolved into textile designs and decorative arts in ' + destCountry + ', maintaining symbolic meaning while adapting to new contexts'
            },
            {
                name: "Spiritual Symbols", 
                traditional: 'Religious and spiritual iconography central to ' + originCountry + ' cultural identity',
                adapted: 'Integrated into new spiritual practices and artistic expressions in ' + destCountry + ', often blended with local beliefs'
            },
            {
                name: "Ceremonial Elements",
                traditional: 'Traditional ceremonial objects and designs used in ' + originCountry + ' rituals and celebrations',
                adapted: 'Transformed into contemporary artistic expressions and community celebrations in ' + destCountry
            }
        ];
    }

    /**
     * Fallback art examples when AI is unavailable
     */
    getFallbackArtExamples(originCountry, destCountry) {
        return {
            traditional: {
                name: 'Traditional ' + originCountry + ' Artistic Heritage',
                artist: "Cultural artisans and communities",
                description: 'Representative examples of ' + originCountry + '\'s rich artistic traditions, including traditional crafts, symbolic art, and ceremonial objects that carry deep cultural meaning'
            },
            contemporary: {
                name: 'Contemporary ' + destCountry + ' Diaspora Expression',
                artist: "Diaspora artists and cultural practitioners",
                description: 'Modern artistic interpretations that show clear evolution from ' + originCountry + ' traditions while incorporating new influences and contemporary techniques'
            }
        };
    }
}

/**
 * Extend the existing DiasporaAI service with visual arts capabilities
 */
function extendDiasporaAI() {
    if (window.DiasporaAI && window.DiasporaAI.isInitialized) {
        
        // Check if already extended
        if (window.DiasporaAI.analyzeArtEvolution) {
            console.log('✅ Visual Arts AI already extended');
            return true;
        }
        
        console.log('🎨 Extending DiasporaAI with Visual Arts capabilities...');
        
        // Create visual arts AI instance and initialize it with base service
        const visualArtsAI = new VisualArtsAI();
        visualArtsAI.initialize(window.DiasporaAI);
        
        // List of methods to add to DiasporaAI
        const methodsToAdd = [
            'analyzeArtEvolution',
            'generateArtEvolutionTimeline', 
            'findSymbolConnections',
            'generateArtExamples',
            'parseTimelineResponse',
            'parseArtExamples',
            'parseSymbolConnections',
            'getFallbackEvolutionAnalysis',
            'getFallbackTimeline',
            'getFallbackSymbolConnections',
            'getFallbackArtExamples'
        ];
        
        // Copy methods to DiasporaAI
        for (let i = 0; i < methodsToAdd.length; i++) {
            const methodName = methodsToAdd[i];
            if (typeof visualArtsAI[methodName] === 'function') {
                window.DiasporaAI[methodName] = visualArtsAI[methodName].bind(window.DiasporaAI);
                console.log('📎 Added method: ' + methodName);
            }
        }
        
        // Copy instance properties
        window.DiasporaAI.artAnalysisCache = new Map();
        window.DiasporaAI.evolutionCache = new Map();
        
        // Mark as extended
        window.DiasporaAI.visualArtsExtended = true;
        
        console.log('✨ Visual Arts AI capabilities successfully added to DiasporaAI service');
        
        // Test the extension
        if (typeof window.DiasporaAI.analyzeArtEvolution === 'function') {
            console.log('✅ Extension verification successful - analyzeArtEvolution is available');
            return true;
        } else {
            console.error('❌ Extension verification failed');
            return false;
        }
    }
    return false;
}

/**
 * Wait for DiasporaAI to be ready and extend it
 */
function waitForAIAndExtend() {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    function checkAndExtend() {
        attempts++;
        
        if (window.DiasporaAI && window.DiasporaAI.isInitialized) {
            if (extendDiasporaAI()) {
                console.log('🎉 Visual Arts AI extension completed successfully');
                return;
            }
        }
        
        if (attempts < maxAttempts) {
            setTimeout(checkAndExtend, 100);
        } else {
            console.warn('⚠️ Could not extend DiasporaAI after 5 seconds, creating standalone instance');
            // Create standalone instance as fallback
            window.VisualArtsAI = new VisualArtsAI();
            window.VisualArtsAI.initialize(); // Initialize without base service
            console.log('📦 Standalone VisualArtsAI instance created');
        }
    }
    
    checkAndExtend();
}

// Make extension function globally available
window.extendDiasporaAI = extendDiasporaAI;

// Start the extension process
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForAIAndExtend);
} else {
    waitForAIAndExtend();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualArtsAI;
}