// js/figure-csv-processor.js - Cultural Figures CSV Data Processor

/**
 * Figure CSV Processor
 * Handles loading, caching, and processing of cultural figures data
 */
class FigureCsvProcessor {
    constructor() {
        this.figuresData = [];
        this.processedFigures = [];
        this.csvPath = 'assets/data/cultural-figures.csv';
        this.cacheKey = 'cultural_figures_cache';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
        this.isLoaded = false;
        this.isInitializing = false;
        this.initPromise = null;
        
        // Debug: Log the expected path
        console.log('📁 CSV path configured as:', this.csvPath);
        console.log('🌐 Current location:', window.location.href);
        console.log('📂 Expected full URL:', new URL(this.csvPath, window.location.href).href);
    }

    async init() {
        // Prevent multiple initializations
        if (this.isInitializing || this.isLoaded) {
            return this.initPromise || Promise.resolve();
        }

        this.isInitializing = true;
        this.initPromise = this._performInit();
        
        try {
            await this.initPromise;
            this.isLoaded = true;
            this.isInitializing = false;
            
            // Notify that processor is ready
            this.notifyReady();
            
        } catch (error) {
            this.isInitializing = false;
            throw error;
        }
        
        return this.initPromise;
    }

    async _performInit() {
        try {
            console.log('🚀 Starting Figure CSV Processor initialization...');
            
            // Try to load from cache first
            const cachedData = this.loadFromCache();
            if (cachedData) {
                this.figuresData = cachedData.figures;
                this.processedFigures = cachedData.processed;
                console.log('📚 Cultural figures loaded from cache');
                return;
            }

            // Load from CSV if no cache
            console.log('💾 No cache found, loading from CSV...');
            await this.loadFiguresFromCSV();
            
        } catch (error) {
            console.error('❌ Error initializing Figure CSV Processor:', error);
            console.log('🔄 Using fallback figures...');
            
            this.figuresData = this.getFallbackFigures();
            this.processedFigures = this.processRawFigures(this.figuresData);
            
            console.log(`✅ Loaded ${this.figuresData.length} fallback figures`);
        }
    }

    /**
     * Notify other components that processor is ready
     */
    notifyReady() {
        console.log('📢 Figure CSV Processor is ready, notifying components...');
        
        // Dispatch custom event
        const readyEvent = new CustomEvent('figureCsvProcessorReady', {
            detail: { processor: this }
        });
        document.dispatchEvent(readyEvent);
        
        // Also set a flag for immediate checks
        window.figureCsvProcessorReady = true;
    }

    /**
     * Load figures from CSV file
     */
    async loadFiguresFromCSV() {
        try {
            console.log('📥 Loading cultural figures from CSV...');
            console.log('🔗 Fetching from:', this.csvPath);
            
            const response = await fetch(this.csvPath);
            console.log('📡 Response status:', response.status);
            console.log('📡 Response URL:', response.url);
            
            if (!response.ok) {
                console.error('❌ Fetch failed with status:', response.status);
                console.error('❌ Response details:', await response.text());
                throw new Error(`Failed to fetch CSV: ${response.status}`);
            }

            const csvText = await response.text();
            console.log('📄 CSV text length:', csvText.length);
            console.log('📄 CSV preview:', csvText.substring(0, 200));
            
            // Parse CSV using Papa Parse
            const parseResult = await this.parseCSV(csvText);
            
            if (parseResult.errors.length > 0) {
                console.warn('CSV parsing warnings:', parseResult.errors);
            }

            this.figuresData = parseResult.data;
            this.processedFigures = this.processRawFigures(this.figuresData);
            
            // Cache the processed data
            this.saveToCache();
            
            console.log(`✅ Loaded ${this.figuresData.length} cultural figures`);
            
            return this.processedFigures;
            
        } catch (error) {
            console.error('❌ Error loading figures CSV:', error);
            console.log('🔄 Falling back to static figures...');
            throw error;
        }
    }

    /**
     * Parse CSV data using Papa Parse with robust checking
     */
    async parseCSV(csvText) {
        return new Promise((resolve, reject) => {
            // Check if Papa Parse is available
            if (typeof Papa === 'undefined') {
                console.error('❌ Papa Parse library not loaded');
                console.log('🔄 Attempting basic CSV parsing fallback...');
                
                try {
                    // Basic CSV parsing fallback
                    const lines = csvText.trim().split('\n');
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const data = [];
                    
                    for (let i = 1; i < lines.length; i++) {
                        if (lines[i].trim()) {
                            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                            const row = {};
                            headers.forEach((header, index) => {
                                row[header] = values[index] || '';
                            });
                            data.push(row);
                        }
                    }
                    
                    console.log('✅ Basic CSV parsing successful:', data.length, 'rows');
                    resolve({ data, errors: [], meta: { fields: headers } });
                } catch (error) {
                    console.error('❌ Basic CSV parsing failed:', error);
                    reject(new Error('CSV parsing failed: Papa Parse not available and fallback failed'));
                }
                return;
            }

            console.log('✅ Papa Parse available, using advanced parsing');
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                delimitersToGuess: [',', '\t', '|', ';'],
                complete: function(results) {
                    console.log('✅ Papa Parse completed:', results.data.length, 'rows');
                    resolve(results);
                },
                error: function(error) {
                    console.error('❌ Papa Parse error:', error);
                    reject(error);
                }
            });
        });
    }

    /**
     * Process raw CSV data into structured figures
     */
    processRawFigures(rawData) {
        return rawData.map(row => {
            // Clean and structure the data
            const figure = {
                id: this.safeParseInt(row.id),
                name: this.cleanString(row.name),
                birthYear: this.safeParseInt(row.birth_year),
                deathYear: row.death_year ? this.safeParseInt(row.death_year) : null,
                isAlive: !row.death_year || row.status === 'alive',
                region: this.cleanString(row.region),
                heritage: this.cleanString(row.heritage),
                primaryField: this.cleanString(row.primary_field),
                secondaryFields: this.parseStringArray(row.secondary_fields),
                achievement: this.cleanString(row.achievement),
                famousQuote: this.cleanString(row.famous_quote),
                shortBio: this.cleanString(row.short_bio),
                imageFilename: this.cleanString(row.image_filename),
                era: this.cleanString(row.era),
                gender: this.cleanString(row.gender),
                status: this.cleanString(row.status),
                connections: this.parseStringArray(row.connections),
                aiEnhanced: row.ai_enhanced === true || row.ai_enhanced === 'true',
                
                // Computed fields
                lifespan: this.calculateLifespan(row.birth_year, row.death_year),
                age: this.calculateAge(row.birth_year, row.death_year),
                imagePath: this.getImagePath(row.image_filename),
                fields: this.combineFields(row.primary_field, row.secondary_fields),
                searchableText: this.createSearchableText(row)
            };

            return figure;
        }).filter(figure => figure.name && figure.id); // Filter out invalid entries
    }

    /**
     * Get random selection of figures
     */
    async getRandomFigures(count = 6) {
        await this.ensureLoaded();
        
        const shuffled = [...this.processedFigures].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Get figures by era
     */
    async getFiguresByEra(era) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.era.toLowerCase() === era.toLowerCase()
        );
    }

    /**
     * Get figures by field
     */
    async getFiguresByField(field) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.fields.some(f => f.toLowerCase().includes(field.toLowerCase()))
        );
    }

    /**
     * Get figures by region
     */
    async getFiguresByRegion(region) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.region.toLowerCase().includes(region.toLowerCase()) ||
            figure.heritage.toLowerCase().includes(region.toLowerCase())
        );
    }

    /**
     * Get figures by gender
     */
    async getFiguresByGender(gender) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.gender.toLowerCase() === gender.toLowerCase()
        );
    }

    /**
     * Search figures with query
     */
    async searchFigures(query) {
        await this.ensureLoaded();
        
        if (!query || query.trim().length < 2) {
            return this.processedFigures;
        }

        const searchTerm = query.toLowerCase().trim();
        
        return this.processedFigures.filter(figure => 
            figure.searchableText.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Get figure by ID
     */
    async getFigureById(id) {
        await this.ensureLoaded();
        
        return this.processedFigures.find(figure => figure.id === parseInt(id));
    }

    /**
     * Get connected figures for a given figure
     */
    async getConnectedFigures(figureId) {
        await this.ensureLoaded();
        
        const figure = await this.getFigureById(figureId);
        if (!figure || !figure.connections.length) {
            return [];
        }

        const connected = [];
        for (const connectionName of figure.connections) {
            const connectedFigure = this.processedFigures.find(f => 
                f.name.toLowerCase() === connectionName.toLowerCase()
            );
            if (connectedFigure) {
                connected.push(connectedFigure);
            }
        }

        return connected;
    }

    /**
     * Get all unique eras
     */
    async getAvailableEras() {
        await this.ensureLoaded();
        
        const eras = [...new Set(this.processedFigures.map(f => f.era))];
        return eras.sort();
    }

    /**
     * Get all unique fields
     */
    async getAvailableFields() {
        await this.ensureLoaded();
        
        const fields = new Set();
        this.processedFigures.forEach(figure => {
            figure.fields.forEach(field => fields.add(field));
        });
        
        return [...fields].sort();
    }

    /**
     * Get all unique regions
     */
    async getAvailableRegions() {
        await this.ensureLoaded();
        
        const regions = [...new Set(this.processedFigures.map(f => f.region))];
        return regions.sort();
    }

    /**
     * Filter figures with multiple criteria
     */
    async filterFigures(filters = {}) {
        await this.ensureLoaded();
        
        let filtered = [...this.processedFigures];

        if (filters.era) {
            filtered = filtered.filter(f => f.era.toLowerCase() === filters.era.toLowerCase());
        }

        if (filters.field) {
            filtered = filtered.filter(f => 
                f.fields.some(field => field.toLowerCase().includes(filters.field.toLowerCase()))
            );
        }

        if (filters.region) {
            filtered = filtered.filter(f => 
                f.region.toLowerCase().includes(filters.region.toLowerCase())
            );
        }

        if (filters.gender) {
            filtered = filtered.filter(f => f.gender.toLowerCase() === filters.gender.toLowerCase());
        }

        if (filters.status) {
            const isAlive = filters.status.toLowerCase() === 'alive';
            filtered = filtered.filter(f => f.isAlive === isAlive);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(f => f.searchableText.toLowerCase().includes(searchTerm));
        }

        return filtered;
    }

    /**
     * Utility methods
     */
    safeParseInt(value, fallback = 0) {
        if (value === null || value === undefined || value === '') {
            return fallback;
        }
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? fallback : parsed;
    }

    cleanString(value) {
        if (typeof value !== 'string') {
            return String(value || '');
        }
        return value.trim();
    }

    parseStringArray(value) {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        
        return value.toString().split(',').map(item => item.trim()).filter(item => item);
    }

    calculateLifespan(birthYear, deathYear) {
        if (!birthYear) return 'Unknown';
        if (!deathYear) return `${birthYear} - present`;
        return `${birthYear} - ${deathYear}`;
    }

    calculateAge(birthYear, deathYear) {
        if (!birthYear) return null;
        
        const endYear = deathYear || new Date().getFullYear();
        return endYear - birthYear;
    }

    getImagePath(filename) {
        if (!filename) return 'assets/images/figures/placeholder.jpg';
        return `assets/images/figures/${filename}`;
    }

    combineFields(primary, secondary) {
        const fields = [primary];
        if (secondary) {
            fields.push(...this.parseStringArray(secondary));
        }
        return fields.filter(field => field);
    }

    createSearchableText(row) {
        const searchFields = [
            row.name,
            row.heritage,
            row.region,
            row.primary_field,
            row.secondary_fields,
            row.achievement,
            row.short_bio,
            row.era,
            row.famous_quote
        ];
        
        return searchFields.join(' ').toLowerCase();
    }

    /**
     * Cache management
     */
    saveToCache() {
        try {
            const cacheData = {
                figures: this.figuresData,
                processed: this.processedFigures,
                timestamp: Date.now()
            };
            
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log('💾 Cultural figures cached successfully');
        } catch (error) {
            console.warn('Could not save figures to cache:', error);
        }
    }

    loadFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            
            if (age > this.cacheExpiry) {
                localStorage.removeItem(this.cacheKey);
                return null;
            }

            return cacheData;
        } catch (error) {
            console.warn('Could not load figures from cache:', error);
            return null;
        }
    }

    /**
     * Ensure data is loaded
     */
    async ensureLoaded() {
        if (!this.isLoaded && !this.isInitializing) {
            await this.init();
        } else if (this.isInitializing) {
            await this.initPromise;
        }
    }

    /**
     * Fallback figures if CSV fails to load
     */
    getFallbackFigures() {
        return [
            {
                id: 1,
                name: "Maya Angelou",
                birth_year: 1928,
                death_year: 2014,
                region: "United States",
                heritage: "African American",
                primary_field: "Literature",
                secondary_fields: "Civil Rights,Arts",
                achievement: "Poet and civil rights activist",
                famous_quote: "Still I Rise",
                short_bio: "Poet, memoirist, and civil rights activist known for 'I Know Why the Caged Bird Sings'",
                image_filename: "maya-angelou.jpg",
                era: "Modern",
                gender: "Female",
                status: "deceased",
                connections: "James Baldwin,Martin Luther King Jr.",
                ai_enhanced: true
            },
            {
                id: 2,
                name: "Nelson Mandela",
                birth_year: 1918,
                death_year: 2013,
                region: "South Africa",
                heritage: "Xhosa",
                primary_field: "Politics",
                secondary_fields: "Law,Human Rights",
                achievement: "Anti-apartheid leader and South African President",
                famous_quote: "Education is the most powerful weapon",
                short_bio: "Anti-apartheid revolutionary who became South Africa's first Black president",
                image_filename: "nelson-mandela.jpg",
                era: "Modern",
                gender: "Male",
                status: "deceased",
                connections: "Desmond Tutu,Oliver Tambo",
                ai_enhanced: true
            },
            {
                id: 3,
                name: "Bob Marley",
                birth_year: 1945,
                death_year: 1981,
                region: "Jamaica",
                heritage: "Jamaican",
                primary_field: "Music",
                secondary_fields: "Spirituality,Activism",
                achievement: "Reggae legend and Rastafarian icon",
                famous_quote: "One love, one heart",
                short_bio: "Reggae musician who brought Jamaican music and Rastafarian beliefs to global audiences",
                image_filename: "bob-marley.jpg",
                era: "Modern",
                gender: "Male",
                status: "deceased",
                connections: "Peter Tosh,Jimmy Cliff",
                ai_enhanced: true
            },
            {
                id: 4,
                name: "Chinua Achebe",
                birth_year: 1930,
                death_year: 2013,
                region: "Nigeria",
                heritage: "Igbo",
                primary_field: "Literature",
                secondary_fields: "Education,Academia",
                achievement: "Author of 'Things Fall Apart'",
                famous_quote: "If you don't like someone's story, write your own",
                short_bio: "Nigerian novelist who revolutionized African literature in English",
                image_filename: "chinua-achebe.jpg",
                era: "Modern",
                gender: "Male",
                status: "deceased",
                connections: "Wole Soyinka,Ngugi wa Thiong'o",
                ai_enhanced: true
            },
            {
                id: 5,
                name: "Wangari Maathai",
                birth_year: 1940,
                death_year: 2011,
                region: "Kenya",
                heritage: "Kikuyu",
                primary_field: "Activism",
                secondary_fields: "Environment,Politics",
                achievement: "First African woman Nobel Peace Prize winner",
                famous_quote: "When we plant trees, we plant the seeds of peace",
                short_bio: "Environmental activist and Nobel laureate who founded the Green Belt Movement",
                image_filename: "wangari-maathai.jpg",
                era: "Contemporary",
                gender: "Female",
                status: "deceased",
                connections: "Vandana Shiva,Al Gore",
                ai_enhanced: true
            },
            {
                id: 6,
                name: "Barack Obama",
                birth_year: 1961,
                death_year: null,
                region: "United States",
                heritage: "Kenyan-American",
                primary_field: "Politics",
                secondary_fields: "Law,Writing",
                achievement: "First African American U.S. President",
                famous_quote: "Yes we can",
                short_bio: "44th President of the United States and bestselling author",
                image_filename: "barack-obama.jpg",
                era: "Contemporary",
                gender: "Male",
                status: "alive",
                connections: "Michelle Obama,Nelson Mandela",
                ai_enhanced: true
            },
            {
                id: 7,
                name: "Oprah Winfrey",
                birth_year: 1954,
                death_year: null,
                region: "United States",
                heritage: "African American",
                primary_field: "Media",
                secondary_fields: "Philanthropy,Business",
                achievement: "Media mogul and philanthropist",
                famous_quote: "The biggest adventure you can take is to live the life of your dreams",
                short_bio: "Media executive, actress, and philanthropist who revolutionized television",
                image_filename: "oprah-winfrey.jpg",
                era: "Contemporary",
                gender: "Female",
                status: "alive",
                connections: "Maya Angelou,Gayle King",
                ai_enhanced: true
            },
            {
                id: 8,
                name: "Marcus Garvey",
                birth_year: 1887,
                death_year: 1940,
                region: "Jamaica",
                heritage: "Jamaican",
                primary_field: "Activism",
                secondary_fields: "Politics,Business",
                achievement: "Founder of UNIA and Black nationalism leader",
                famous_quote: "A people without knowledge of their past is like a tree without roots",
                short_bio: "Pan-Africanist leader who promoted Black pride and economic independence",
                image_filename: "marcus-garvey.jpg",
                era: "Colonial",
                gender: "Male",
                status: "deceased",
                connections: "W.E.B. Du Bois,Amy Jacques Garvey",
                ai_enhanced: true
            }
        ];
    }

    /**
     * Public API for getting statistics
     */
    async getStatistics() {
        await this.ensureLoaded();
        
        const stats = {
            total: this.processedFigures.length,
            byEra: {},
            byGender: {},
            byField: {},
            byRegion: {},
            byStatus: { alive: 0, deceased: 0 }
        };

        this.processedFigures.forEach(figure => {
            // Count by era
            stats.byEra[figure.era] = (stats.byEra[figure.era] || 0) + 1;
            
            // Count by gender
            stats.byGender[figure.gender] = (stats.byGender[figure.gender] || 0) + 1;
            
            // Count by primary field
            stats.byField[figure.primaryField] = (stats.byField[figure.primaryField] || 0) + 1;
            
            // Count by region
            stats.byRegion[figure.region] = (stats.byRegion[figure.region] || 0) + 1;
            
            // Count by status
            if (figure.isAlive) {
                stats.byStatus.alive++;
            } else {
                stats.byStatus.deceased++;
            }
        });

        return stats;
    }

    /**
     * Cleanup method
     */
    cleanup() {
        this.figuresData = [];
        this.processedFigures = [];
        this.isLoaded = false;
        this.isInitializing = false;
        this.initPromise = null;
        console.log('🧹 Figure CSV Processor cleaned up');
    }
}

/**
 * Initialize Figure CSV Processor immediately
 */
(function initializeFigureProcessor() {
    if (!window.figureCsvProcessor) {
        console.log('📚 Creating Cultural Figures CSV Processor...');
        window.figureCsvProcessor = new FigureCsvProcessor();
        
        // Start initialization immediately
        window.figureCsvProcessor.init().then(() => {
            console.log('✅ Figure CSV Processor ready');
        }).catch(error => {
            console.error('❌ Figure CSV Processor initialization failed:', error);
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (window.figureCsvProcessor) {
                window.figureCsvProcessor.cleanup();
            }
        });
    }
})();

/**
 * Export for module use
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FigureCsvProcessor;
}