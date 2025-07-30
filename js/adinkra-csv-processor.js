// js/adinkra-csv-processor.js - CSV Processing WITHOUT automatic AI enhancement
// Loads and processes Adinkra symbols from CSV data


/**
 * Adinkra CSV Processor
 * Handles loading and processing of Adinkra symbols from CSV data
 * AI enhancement is now user-controlled via separate handler
 */
class AdinkraCsvProcessor {
    constructor() {
        this.symbols = [];
        this.isLoaded = false;
        this.csvUrl = 'data/adinkra-symbols.csv';
        
        this.init();
    }

    async init() {
        console.log('📄 Initializing Adinkra CSV Processor...');
        // Load symbols but don't auto-enhance
        await this.loadSymbolsFromCSV();
    }

    /**
     * Load symbols from CSV file
     */
    async loadSymbolsFromCSV() {
        try {
            console.log('📄 Loading Adinkra symbols from CSV...');
            
            // Check cache first
            const cached = this.getCachedSymbols();
            if (cached && cached.length > 0) {
                this.symbols = cached;
                this.isLoaded = true;
                console.log(`💾 Loaded ${this.symbols.length} symbols from cache`);
                return this.symbols;
            }

            // Fetch CSV data
            const csvData = await this.fetchCSVData();
            if (!csvData) {
                throw new Error('Failed to fetch CSV data');
            }

            // Parse CSV
            const parsedData = await this.parseCSV(csvData);
            if (!parsedData || parsedData.length === 0) {
                throw new Error('No symbols found in CSV data');
            }

            // Process symbols (but don't enhance with AI)
            this.symbols = this.processSymbolData(parsedData);
            this.isLoaded = true;

            // Cache the basic symbols
            this.cacheSymbols(this.symbols);

            console.log(`✅ Loaded ${this.symbols.length} symbols from CSV`);
            return this.symbols;

        } catch (error) {
            console.error('❌ Error loading symbols from CSV:', error);
            
            // Fallback to basic symbols
            this.symbols = this.getFallbackSymbols();
            this.isLoaded = true;
            
            return this.symbols;
        }
    }

    /**
     * Fetch CSV data from file or URL
     */
    async fetchCSVData() {
        try {
            const response = await fetch(this.csvUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            if (!csvText || csvText.trim().length === 0) {
                throw new Error('Empty CSV file');
            }
            
            return csvText;
            
        } catch (error) {
            console.warn('Could not fetch CSV from URL, trying fallback data:', error);
            return this.getFallbackCSVData();
        }
    }

    /**
     * Parse CSV data using PapaParse
     */
    async parseCSV(csvData) {
        return new Promise((resolve, reject) => {
            if (typeof Papa === 'undefined') {
                console.warn('PapaParse not available, using basic parsing');
                resolve(this.basicCSVParse(csvData));
                return;
            }

            Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                delimitersToGuess: [',', '\t', '|', ';'],
                complete: (results) => {
                    if (results.errors && results.errors.length > 0) {
                        console.warn('CSV parsing warnings:', results.errors);
                    }
                    
                    resolve(results.data);
                },
                error: (error) => {
                    console.error('CSV parsing error:', error);
                    reject(error);
                }
            });
        });
    }

    /**
     * Basic CSV parsing fallback
     */
    basicCSVParse(csvData) {
        const lines = csvData.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            data.push(row);
        }

        return data;
    }

    /**
     * Process raw CSV data into symbol objects
     */
    processSymbolData(rawData) {
        const processed = [];
        
        for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            
            // Skip empty rows
            if (!row.name && !row.Name && !row.symbol_name) {
                continue;
            }
            
            const symbol = this.createSymbolObject(row);
            if (symbol) {
                processed.push(symbol);
            }
        }
        
        return processed;
    }

    /**
     * Create standardized symbol object from CSV row
     */
    createSymbolObject(row) {
        try {
            // Handle different CSV column naming conventions
            const name = row.name || row.Name || row.symbol_name || row['Symbol Name'];
            const meaning = row.meaning || row.Meaning || row.description || row.Description;
            
            if (!name || !meaning) {
                return null;
            }

            return {
                name: name.trim(),
                meaning: meaning.trim(),
                category: this.determineCategory(row),
                country: row.country || row.Country || 'Ghana',
                region: row.region || row.Region || 'West Africa',
                symbolCategory: 'Adinkra',
                type: 'origin',
                source: 'CSV Data',
                // Additional fields from CSV
                akan_name: row.akan_name || row['Akan Name'],
                pronunciation: row.pronunciation || row.Pronunciation,
                themes: row.themes || row.Themes,
                usage: row.usage || row.Usage,
                // Visual representation
                unicode: row.unicode || row.Unicode,
                svgPattern: row.svg_pattern || row['SVG Pattern'],
                icon: this.determineIcon(row)
            };
            
        } catch (error) {
            console.warn('Error creating symbol object:', error, row);
            return null;
        }
    }

    /**
     * Determine symbol category from CSV data
     */
    determineCategory(row) {
        const meaning = (row.meaning || row.description || '').toLowerCase();
        const themes = (row.themes || '').toLowerCase();
        const combined = meaning + ' ' + themes;
        
        if (combined.includes('god') || combined.includes('divine') || combined.includes('spiritual')) {
            return 'spiritual';
        }
        if (combined.includes('wisdom') || combined.includes('knowledge') || combined.includes('learn')) {
            return 'wisdom';
        }
        if (combined.includes('strength') || combined.includes('courage') || combined.includes('power')) {
            return 'character';
        }
        if (combined.includes('unity') || combined.includes('community') || combined.includes('cooperation')) {
            return 'social';
        }
        
        return 'cultural';
    }

    /**
     * Determine appropriate icon for symbol
     */
    determineIcon(row) {
        const category = this.determineCategory(row);
        const iconMap = {
            'spiritual': 'fas fa-star-and-crescent',
            'wisdom': 'fas fa-lightbulb',
            'character': 'fas fa-shield-alt',
            'social': 'fas fa-users',
            'cultural': 'fas fa-circle'
        };
        
        return iconMap[category] || 'fas fa-star-and-crescent';
    }

    /**
     * Get cached symbols
     */
    getCachedSymbols() {
        try {
            const cached = localStorage.getItem('adinkra_symbols_cache');
            if (cached) {
                const data = JSON.parse(cached);
                // Check if cache is still valid (24 hours)
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    return data.symbols;
                }
            }
        } catch (error) {
            console.warn('Error loading cached symbols:', error);
        }
        return null;
    }

    /**
     * Cache symbols
     */
    cacheSymbols(symbols) {
        try {
            const cacheData = {
                symbols: symbols,
                timestamp: Date.now()
            };
            localStorage.setItem('adinkra_symbols_cache', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Error caching symbols:', error);
        }
    }

    /**
     * Get all loaded symbols
     */
    async getSymbols() {
        if (!this.isLoaded) {
            await this.loadSymbolsFromCSV();
        }
        return this.symbols;
    }

    /**
     * Get random symbols
     */
    async getRandomSymbols(count = 6) {
        const symbols = await this.getSymbols();
        const shuffled = [...symbols].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Search symbols
     */
    async searchSymbols(query) {
        const symbols = await this.getSymbols();
        const searchTerm = query.toLowerCase();
        
        return symbols.filter(symbol => 
            symbol.name.toLowerCase().includes(searchTerm) ||
            symbol.meaning.toLowerCase().includes(searchTerm) ||
            (symbol.country && symbol.country.toLowerCase().includes(searchTerm)) ||
            (symbol.category && symbol.category.toLowerCase().includes(searchTerm)) ||
            (symbol.themes && symbol.themes.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Get symbol by name
     */
    async getSymbolByName(name) {
        const symbols = await this.getSymbols();
        return symbols.find(symbol => 
            symbol.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Refresh symbol data
     */
    async refreshSymbolData() {
        // Clear cache
        localStorage.removeItem('adinkra_symbols_cache');
        
        // Reload symbols
        this.symbols = [];
        this.isLoaded = false;
        
        return await this.loadSymbolsFromCSV();
    }

    /**
     * Get fallback CSV data if file not available
     */
    getFallbackCSVData() {
        return `name,meaning,category,themes,country,region
Gye Nyame,"Except for God - Symbol of the omnipotence and supremacy of God",spiritual,"god,divine,supreme",Ghana,"West Africa"
Sankofa,"Look back and fetch it - Learn from the past to move forward wisely",wisdom,"learning,history,wisdom",Ghana,"West Africa"
Dwennimmen,"Ram's horns - Humility and strength",character,"strength,humility,wisdom",Ghana,"West Africa"
Pempamsie,"Sew in readiness - Being prepared and ready",character,"preparation,readiness,work",Ghana,"West Africa"
Nyame Nnwu Na Mawu,"God never dies therefore I cannot die",spiritual,"god,eternal,divine",Ghana,"West Africa"
Adwo,"Peace and tranquility",social,"peace,harmony,calm",Ghana,"West Africa"
Aya,"Fern - Endurance and resourcefulness",character,"endurance,strength,survival",Ghana,"West Africa"
Akoma,"Heart - Love and patience",social,"love,patience,heart",Ghana,"West Africa"
Ese Ne Tekrema,"Teeth and tongue - Friendship and interdependence",social,"friendship,cooperation,unity",Ghana,"West Africa"
Fihankra,"House - Security and safety",social,"home,security,safety",Ghana,"West Africa"`;
    }

    /**
     * Get fallback symbols if CSV loading fails
     */
    getFallbackSymbols() {
        return [
            {
                name: "Gye Nyame",
                meaning: "Except for God - Symbol of the omnipotence and supremacy of God",
                category: "spiritual",
                country: "Ghana",
                region: "West Africa",
                symbolCategory: "Adinkra",
                type: "origin",
                source: "Fallback Data",
                icon: "fas fa-star-and-crescent"
            },
            {
                name: "Sankofa",
                meaning: "Look back and fetch it - Learn from the past to move forward wisely",
                category: "wisdom",
                country: "Ghana",
                region: "West Africa",
                symbolCategory: "Adinkra",
                type: "origin",
                source: "Fallback Data",
                icon: "fas fa-lightbulb"
            },
            {
                name: "Dwennimmen",
                meaning: "Ram's horns - Humility and strength, learning and wisdom",
                category: "character",
                country: "Ghana",
                region: "West Africa",
                symbolCategory: "Adinkra",
                type: "origin",
                source: "Fallback Data",
                icon: "fas fa-shield-alt"
            },
            {
                name: "Pempamsie",
                meaning: "Sew in readiness - Being prepared, steadfast, and hardworking",
                category: "character",
                country: "Ghana",
                region: "West Africa",
                symbolCategory: "Adinkra",
                type: "origin",
                source: "Fallback Data",
                icon: "fas fa-shield-alt"
            }
        ];
    }

    /**
     * Get statistics about loaded symbols
     */
    getStats() {
        return {
            totalSymbols: this.symbols.length,
            categories: this.getCategories(),
            isLoaded: this.isLoaded,
            sources: this.getSources()
        };
    }

    /**
     * Get available sources
     */
    getSources() {
        const sources = {};
        this.symbols.forEach(symbol => {
            const source = symbol.source || 'Unknown';
            sources[source] = (sources[source] || 0) + 1;
        });
        return sources;
    }

    /**
     * Clear all caches
     */
    clearCache() {
        localStorage.removeItem('adinkra_symbols_cache');
        console.log('🗑️ Adinkra symbols cache cleared');
    }
}

// Initialize global instance
window.AdinkraCsvProcessor = new AdinkraCsvProcessor();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdinkraCsvProcessor;
}

console.log('📄 Adinkra CSV Processor loaded (without auto AI enhancement)');