// js/adinkra-csv-processor.js - CSV-based Adinkra Symbols with AI Enhancement

/**
 * CSV-based Adinkra symbol processor with AI enhancement
 * Reads symbols from CSV and uses AI to generate rich descriptions
 */
class AdinkraCsvProcessor {
    constructor() {
        this.symbols = [];
        this.isLoaded = false;
        this.csvPath = 'assets/data/adinkra-symbols.csv';
        this.enhancedSymbols = new Map();
        this.svgSymbols = new Map();
    }

    /**
     * Load and process CSV file containing Adinkra symbols
     */
    async loadSymbolsFromCSV() {
        if (this.isLoaded && this.symbols.length > 0) {
            console.log('📚 Using cached CSV symbols');
            return this.symbols;
        }

        console.log('📄 Loading Adinkra symbols from CSV...');

        try {
            // Try to read the CSV file
            let csvData;
            if (window.fs && typeof window.fs.readFile === 'function') {
                // If file API is available (for uploaded files)
                csvData = await window.fs.readFile(this.csvPath, { encoding: 'utf8' });
            } else {
                // Fallback to fetch
                const response = await fetch(this.csvPath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch CSV: ${response.status}`);
                }
                csvData = await response.text();
            }

            // Parse CSV data
            const parsedData = this.parseCSV(csvData);
            
            if (parsedData && parsedData.length > 0) {
                console.log(`✅ Loaded ${parsedData.length} symbols from CSV`);
                
                // Enhance symbols with AI
                this.symbols = await this.enhanceSymbolsWithAI(parsedData);
                this.isLoaded = true;
                
                // Cache the results
                this.cacheSymbols();
                
                return this.symbols;
            } else {
                throw new Error('No symbols found in CSV');
            }

        } catch (error) {
            console.error('❌ Error loading CSV symbols:', error);
            console.log('📚 Using fallback symbol data');
            this.symbols = this.getFallbackSymbols();
            this.isLoaded = true;
            return this.symbols;
        }
    }

    /**
     * Parse CSV data using Papa Parse
     */
    parseCSV(csvText) {
        try {
            // Use Papa Parse if available
            if (typeof Papa !== 'undefined') {
                const parsed = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                    transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_')
                });

                if (parsed.errors.length > 0) {
                    console.warn('CSV parsing warnings:', parsed.errors);
                }

                return parsed.data;
            } else {
                // Fallback manual CSV parsing
                return this.manualCSVParse(csvText);
            }
        } catch (error) {
            console.error('Error parsing CSV:', error);
            return [];
        }
    }

    /**
     * Manual CSV parsing fallback
     */
    manualCSVParse(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
        const symbols = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = this.parseCSVLine(line);
            if (values.length >= headers.length) {
                const symbol = {};
                headers.forEach((header, index) => {
                    symbol[header] = values[index] ? values[index].trim() : '';
                });
                symbols.push(symbol);
            }
        }

        return symbols;
    }

    /**
     * Parse a single CSV line handling quotes
     */
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current);
        return values;
    }

    /**
     * Enhance symbols with AI-generated descriptions and cultural context
     */
    async enhanceSymbolsWithAI(rawSymbols) {
        const enhancedSymbols = [];

        for (const rawSymbol of rawSymbols) {
            try {
                const enhanced = await this.enhanceSingleSymbol(rawSymbol);
                enhancedSymbols.push(enhanced);
                
                // Add small delay to avoid overwhelming the AI service
                await this.delay(100);
                
            } catch (error) {
                console.warn(`Error enhancing symbol ${rawSymbol.name}:`, error);
                // Add unenhanced symbol as fallback
                enhancedSymbols.push(this.formatBasicSymbol(rawSymbol));
            }
        }

        return enhancedSymbols;
    }

    /**
     * Enhance a single symbol with AI
     */
    async enhanceSingleSymbol(rawSymbol) {
        const symbolName = rawSymbol.name || rawSymbol.symbol_name || '';
        const basicMeaning = rawSymbol.meaning || rawSymbol.description || '';
        
        if (!symbolName) {
            return this.formatBasicSymbol(rawSymbol);
        }

        // Check cache first
        const cacheKey = symbolName.toLowerCase();
        if (this.enhancedSymbols.has(cacheKey)) {
            return this.enhancedSymbols.get(cacheKey);
        }

        try {
            let enhancedDescription = basicMeaning;
            let diasporaConnections = {};

            // Try to enhance with AI if available
            if (window.DiasporaAI && typeof window.DiasporaAI.callOpenAI === 'function') {
                const prompt = `Enhance this Adinkra symbol information for cultural education:

Symbol Name: ${symbolName}
Basic Meaning: ${basicMeaning}

Please provide:
1. **Enhanced Description** (2-3 sentences): Expand on the cultural significance and spiritual meaning of this symbol in Akan/Ghanaian culture
2. **Visual Elements**: Describe the key visual characteristics and design elements
3. **Diaspora Connections**: How this symbol might have influenced or appeared in African diaspora communities (Jamaica, Brazil, USA, Haiti)

Format as natural, educational text. Focus on cultural respect and accuracy.`;

                try {
                    const aiResponse = await window.DiasporaAI.callOpenAI(prompt, 300, 0.7);
                    const parsed = this.parseAIResponse(aiResponse);
                    
                    if (parsed.description) {
                        enhancedDescription = parsed.description;
                    }
                    if (parsed.diasporaConnections) {
                        diasporaConnections = parsed.diasporaConnections;
                    }
                    
                } catch (aiError) {
                    console.warn(`AI enhancement failed for ${symbolName}:`, aiError);
                }
            }

            const enhanced = {
                name: symbolName,
                meaning: enhancedDescription,
                basicMeaning: basicMeaning,
                category: this.categorizeSymbol(symbolName, enhancedDescription),
                icon: 'fas fa-star-and-crescent',
                country: 'Ghana',
                region: 'West Africa',
                type: 'origin',
                description: enhancedDescription,
                source: 'CSV + AI Enhanced',
                visualElements: rawSymbol.visual_elements || this.generateVisualDescription(symbolName),
                diasporaEvolution: Object.keys(diasporaConnections).length > 0 ? diasporaConnections : this.getDefaultDiasporaConnections(),
                csvData: rawSymbol,
                svgPattern: this.generateSVGPattern(symbolName),
                unicode: rawSymbol.unicode || null
            };

            // Cache the enhanced symbol
            this.enhancedSymbols.set(cacheKey, enhanced);
            
            return enhanced;

        } catch (error) {
            console.error(`Error enhancing symbol ${symbolName}:`, error);
            return this.formatBasicSymbol(rawSymbol);
        }
    }

    /**
     * Parse AI response to extract structured information
     */
    parseAIResponse(aiResponse) {
        const result = {};
        
        // Extract enhanced description (usually the first substantial paragraph)
        const lines = aiResponse.split('\n').filter(line => line.trim());
        let description = '';
        let diasporaConnections = {};

        for (const line of lines) {
            const trimmed = line.trim();
            
            // Skip headers and short lines
            if (trimmed.length < 20 || trimmed.includes('**') || trimmed.includes(':')) {
                continue;
            }
            
            // Use the first substantial line as description
            if (!description && trimmed.length > 50) {
                description = trimmed;
            }
            
            // Look for diaspora mentions
            if (trimmed.toLowerCase().includes('diaspora') || 
                trimmed.toLowerCase().includes('jamaica') ||
                trimmed.toLowerCase().includes('brazil') ||
                trimmed.toLowerCase().includes('haiti')) {
                // Simple extraction - could be enhanced
                if (trimmed.includes('Jamaica')) {
                    diasporaConnections['Jamaica'] = this.extractDiasporaConnection(trimmed, 'Jamaica');
                }
                if (trimmed.includes('Brazil')) {
                    diasporaConnections['Brazil'] = this.extractDiasporaConnection(trimmed, 'Brazil');
                }
                if (trimmed.includes('United States') || trimmed.includes('USA')) {
                    diasporaConnections['United States'] = this.extractDiasporaConnection(trimmed, 'United States');
                }
            }
        }

        result.description = description || null;
        result.diasporaConnections = diasporaConnections;
        
        return result;
    }

    /**
     * Extract diaspora connection from AI text
     */
    extractDiasporaConnection(text, country) {
        // Simple extraction logic - could be enhanced with more sophisticated parsing
        const sentences = text.split('.').map(s => s.trim());
        for (const sentence of sentences) {
            if (sentence.toLowerCase().includes(country.toLowerCase())) {
                return sentence.replace(country, '').trim();
            }
        }
        return `Influences found in ${country} cultural expressions`;
    }

    /**
     * Categorize symbol based on name and meaning
     */
    categorizeSymbol(name, meaning) {
        const nameAndMeaning = (name + ' ' + meaning).toLowerCase();
        
        if (nameAndMeaning.includes('god') || nameAndMeaning.includes('spiritual') || nameAndMeaning.includes('divine')) {
            return 'spiritual';
        } else if (nameAndMeaning.includes('wisdom') || nameAndMeaning.includes('knowledge') || nameAndMeaning.includes('learn')) {
            return 'wisdom';
        } else if (nameAndMeaning.includes('strength') || nameAndMeaning.includes('power') || nameAndMeaning.includes('courage')) {
            return 'strength';
        } else if (nameAndMeaning.includes('unity') || nameAndMeaning.includes('cooperation') || nameAndMeaning.includes('community')) {
            return 'unity';
        } else if (nameAndMeaning.includes('peace') || nameAndMeaning.includes('harmony') || nameAndMeaning.includes('calm')) {
            return 'peace';
        } else {
            return 'cultural';
        }
    }

    /**
     * Generate visual description for symbols
     */
    generateVisualDescription(symbolName) {
        const visualDescriptions = {
            'sankofa': 'Stylized bird with head turned backward, or heart-shaped symbol with decorative curves',
            'gye nyame': 'Circular design with radiating patterns and central motif representing divine omnipresence',
            'dwennimmen': 'Symmetrical curved horn patterns representing ram\'s horns',
            'nyame dua': 'Stylized tree design with distinctive branching pattern',
            'adwo': 'Gentle flowing curves suggesting peaceful water or serene movement',
            'aya': 'Delicate fern frond pattern with intricate leaflet details'
        };

        const key = symbolName.toLowerCase();
        return visualDescriptions[key] || `Traditional Adinkra geometric pattern with symbolic significance`;
    }

    /**
     * Generate simple SVG pattern for the symbol
     */
    generateSVGPattern(symbolName) {
        const patterns = {
            'sankofa': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 20 Q30 40 20 60 Q30 80 50 85 Q70 80 80 60 Q70 40 50 20" 
                      fill="none" stroke="currentColor" stroke-width="3"/>
                <circle cx="25" cy="65" r="8" fill="currentColor"/>
                <path d="M25 57 Q20 50 15 55" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>`,
            
            'gye nyame': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="3"/>
                <path d="M30 30 L70 70 M70 30 L30 70" stroke="currentColor" stroke-width="2"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="50" cy="50" r="5" fill="currentColor"/>
            </svg>`,
            
            'dwennimmen': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 80 Q20 40 40 30 Q50 25 60 30 Q80 40 80 80" 
                      fill="none" stroke="currentColor" stroke-width="4"/>
                <path d="M25 75 Q25 45 35 40" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M75 75 Q75 45 65 40" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>`,
            
            'default': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="3"/>
                <path d="M30 30 L70 70 M70 30 L30 70" stroke="currentColor" stroke-width="2"/>
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>`
        };

        const key = symbolName.toLowerCase().replace(/\s+/g, '');
        return patterns[key] || patterns['default'];
    }

    /**
     * Format basic symbol without AI enhancement
     */
    formatBasicSymbol(rawSymbol) {
        const name = rawSymbol.name || rawSymbol.symbol_name || 'Unknown Symbol';
        const meaning = rawSymbol.meaning || rawSymbol.description || 'Traditional Adinkra symbol';

        return {
            name: name,
            meaning: meaning,
            basicMeaning: meaning,
            category: this.categorizeSymbol(name, meaning),
            icon: 'fas fa-star-and-crescent',
            country: 'Ghana',
            region: 'West Africa',
            type: 'origin',
            description: meaning,
            source: 'CSV Data',
            visualElements: this.generateVisualDescription(name),
            diasporaEvolution: this.getDefaultDiasporaConnections(),
            csvData: rawSymbol,
            svgPattern: this.generateSVGPattern(name),
            unicode: rawSymbol.unicode || null
        };
    }

    /**
     * Get default diaspora connections
     */
    getDefaultDiasporaConnections() {
        return {
            "United States": "Incorporated into African American cultural education and artistic expressions",
            "Jamaica": "Adapted by Maroon communities for spiritual and cultural purposes", 
            "Brazil": "Integrated into Afro-Brazilian spiritual practices and contemporary art",
            "Haiti": "Influenced cultural preservation and spiritual practices in Vodou tradition"
        };
    }

    /**
     * Cache symbols to localStorage
     */
    cacheSymbols() {
        try {
            const cacheData = {
                symbols: this.symbols,
                timestamp: Date.now(),
                source: 'CSV + AI Enhanced'
            };
            localStorage.setItem('enhanced_symbols_cache', JSON.stringify(cacheData));
            console.log('💾 Cached enhanced symbols');
        } catch (error) {
            console.warn('Could not cache symbols:', error);
        }
    }

    /**
     * Get cached symbols if available
     */
    getCachedSymbols() {
        try {
            const cached = localStorage.getItem('enhanced_symbols_cache');
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

            if (age < maxAge) {
                return cacheData.symbols;
            } else {
                localStorage.removeItem('enhanced_symbols_cache');
                return null;
            }
        } catch (error) {
            console.warn('Error reading cached symbols:', error);
            return null;
        }
    }

    /**
     * Fallback symbols if CSV loading fails
     */
    getFallbackSymbols() {
        return [
            {
                name: "Gye Nyame",
                meaning: "Except for God - This symbol represents the omnipotence and supremacy of God in all affairs. It expresses deep faith in divine providence and the belief that God's power surpasses all earthly authority.",
                basicMeaning: "Except for God",
                category: "spiritual",
                icon: "fas fa-star-and-crescent",
                country: "Ghana",
                region: "West Africa",
                type: "origin",
                description: "One of the most revered Adinkra symbols representing divine authority and eternal nature of God.",
                source: "Fallback Data",
                visualElements: "Circular design with radiating elements and central cross-like motif symbolizing divine omnipresence",
                diasporaEvolution: this.getDefaultDiasporaConnections(),
                svgPattern: this.generateSVGPattern('gye nyame')
            },
            {
                name: "Sankofa",
                meaning: "Look back and fetch it - Learn from the past to move forward wisely. This symbol teaches that we must understand our history and heritage to make progress in the future.",
                basicMeaning: "Look back and fetch it",
                category: "wisdom", 
                icon: "fas fa-star-and-crescent",
                country: "Ghana",
                region: "West Africa",
                type: "origin",
                description: "Represents the importance of learning from history and ancestral wisdom.",
                source: "Fallback Data",
                visualElements: "Stylized bird with head turned backward or heart-shaped symbol with decorative curves",
                diasporaEvolution: this.getDefaultDiasporaConnections(),
                svgPattern: this.generateSVGPattern('sankofa')
            }
        ];
    }

    /**
     * Utility function for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Public methods
     */
    async getSymbols() {
        // Try cache first
        const cached = this.getCachedSymbols();
        if (cached && cached.length > 0) {
            this.symbols = cached;
            this.isLoaded = true;
            return cached;
        }

        // Load fresh data
        return await this.loadSymbolsFromCSV();
    }

    async searchSymbols(query) {
        const symbols = await this.getSymbols();
        const lowercaseQuery = query.toLowerCase();
        
        return symbols.filter(symbol => 
            symbol.name.toLowerCase().includes(lowercaseQuery) ||
            symbol.meaning.toLowerCase().includes(lowercaseQuery) ||
            symbol.description.toLowerCase().includes(lowercaseQuery) ||
            symbol.category.toLowerCase().includes(lowercaseQuery)
        );
    }

    async getRandomSymbols(count = 6) {
        const symbols = await this.getSymbols();
        const shuffled = symbols.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}

// Global instance
window.AdinkraCsvProcessor = new AdinkraCsvProcessor();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdinkraCsvProcessor;
}