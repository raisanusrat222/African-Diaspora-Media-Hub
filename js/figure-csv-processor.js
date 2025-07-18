// js/figure-csv-processor.js - Complete Cultural Figures CSV Data Processor

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
        
        console.log('📁 CSV path configured as:', this.csvPath);
        console.log('🌐 Current location:', window.location.href);
        console.log('📂 Expected full URL:', new URL(this.csvPath, window.location.href).href);
    }

    async init() {
        if (this.isInitializing || this.isLoaded) {
            return this.initPromise || Promise.resolve();
        }

        this.isInitializing = true;
        this.initPromise = this._performInit();
        
        try {
            await this.initPromise;
            this.isLoaded = true;
            this.isInitializing = false;
            this.notifyReady();
        } catch (error) {
            this.isInitializing = false;
            console.error('❌ CSV initialization failed, using fallback data:', error);
            this.figuresData = this.getFallbackFigures();
            this.processedFigures = this.processRawFigures(this.figuresData);
            this.isLoaded = true;
            this.notifyReady();
        }
        
        return this.initPromise;
    }

    async _performInit() {
        try {
            console.log('🚀 Starting Figure CSV Processor initialization...');
            
            const cachedData = this.loadFromCache();
            if (cachedData) {
                this.figuresData = cachedData.figures;
                this.processedFigures = cachedData.processed;
                console.log('📚 Cultural figures loaded from cache');
                return;
            }

            console.log('💾 No cache found, loading from CSV...');
            await this.loadFiguresFromCSV();
            
        } catch (error) {
            console.error('❌ Error initializing Figure CSV Processor:', error);
            throw error;
        }
    }

    notifyReady() {
        console.log('📢 Figure CSV Processor is ready, notifying components...');
        
        const readyEvent = new CustomEvent('figureCsvProcessorReady', {
            detail: { processor: this }
        });
        document.dispatchEvent(readyEvent);
        
        window.figureCsvProcessorReady = true;
    }

    async loadFiguresFromCSV() {
        try {
            console.log('📥 Loading cultural figures from CSV...');
            console.log('🔗 Fetching from:', this.csvPath);
            
            const response = await fetch(this.csvPath);
            console.log('📡 Response status:', response.status);
            console.log('📡 Response URL:', response.url);
            
            if (!response.ok) {
                console.error('❌ Fetch failed with status:', response.status);
                throw new Error(`Failed to fetch CSV: ${response.status}`);
            }

            const csvText = await response.text();
            console.log('📄 CSV text length:', csvText.length);
            console.log('📄 CSV preview:', csvText.substring(0, 500));
            
            const parseResult = await this.parseCSV(csvText);
            
            if (parseResult.errors && parseResult.errors.length > 0) {
                console.warn('CSV parsing warnings:', parseResult.errors);
            }

            this.figuresData = parseResult.data;
            this.processedFigures = this.processRawFigures(this.figuresData);
            
            this.saveToCache();
            
            console.log(`✅ Loaded ${this.figuresData.length} cultural figures`);
            
            return this.processedFigures;
            
        } catch (error) {
            console.error('❌ Error loading figures CSV:', error);
            throw error;
        }
    }

    async parseCSV(csvText) {
        return new Promise((resolve, reject) => {
            if (typeof Papa === 'undefined') {
                console.log('⚠️ Papa Parse not available, using robust fallback parser');
                
                try {
                    const result = this.parseCSVRobust(csvText);
                    console.log('✅ Robust CSV parsing successful:', result.data.length, 'rows');
                    resolve(result);
                } catch (error) {
                    console.error('❌ Robust CSV parsing failed:', error);
                    reject(new Error('CSV parsing failed: ' + error.message));
                }
                return;
            }

            console.log('✅ Papa Parse available, using Papa Parse');
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: false,
                skipEmptyLines: true,
                delimiter: ',',
                quoteChar: '"',
                escapeChar: '"',
                complete: (results) => {
                    console.log('✅ Papa Parse completed:', results.data.length, 'rows');
                    console.log('CSV Headers:', results.meta.fields);
                    
                    if (results.data.length > 0) {
                        const firstRow = results.data[0];
                        console.log('🔍 First row validation:');
                        console.log('- Name:', firstRow.name);
                        console.log('- Image filename:', firstRow.image_filename);
                        console.log('- Achievement:', firstRow.achievement);
                        console.log('- Famous quote:', firstRow.famous_quote);
                    }
                    
                    resolve(results);
                },
                error: (error) => {
                    console.error('❌ Papa Parse error:', error);
                    try {
                        const result = this.parseCSVRobust(csvText);
                        console.log('✅ Fallback to robust parser successful');
                        resolve(result);
                    } catch (fallbackError) {
                        reject(new Error('Both Papa Parse and fallback failed: ' + fallbackError.message));
                    }
                }
            });
        });
    }

    parseCSVRobust(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = this.parseCSVLine(lines[0]);
        
        console.log('📋 Parsed headers:', headers);
        console.log('📋 Expected 17 columns, found:', headers.length);
        
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = this.parseCSVLine(lines[i]);
                
                if (i <= 3) {
                    console.log(`Row ${i}: ${values.length} values`);
                }
                
                if (values.length !== headers.length) {
                    console.warn(`⚠️ Row ${i} has ${values.length} values but expected ${headers.length}, skipping`);
                    continue;
                }
                
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                
                data.push(row);
            }
        }
        
        console.log(`✅ Parsed ${data.length} valid rows`);
        return {
            data: data,
            errors: [],
            meta: { fields: headers }
        };
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        let i = 0;
        
        while (i < line.length) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                    current += '"';
                    i += 2;
                } else {
                    inQuotes = !inQuotes;
                    i++;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
                i++;
            } else {
                current += char;
                i++;
            }
        }
        
        values.push(current.trim());
        
        return values.map(value => {
            if (value.startsWith('"') && value.endsWith('"')) {
                return value.slice(1, -1);
            }
            return value;
        });
    }

    processRawFigures(rawData) {
        return rawData.map((row, index) => {
            if (index < 3) {
                console.log(`🔍 Processing row ${index + 1}:`, {
                    name: row.name,
                    image_filename: row.image_filename,
                    achievement: row.achievement
                });
            }

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
                imageFilename: this.validateImageFilename(row.image_filename),
                era: this.cleanString(row.era),
                gender: this.cleanString(row.gender),
                status: this.cleanString(row.status),
                connections: this.parseStringArray(row.connections),
                aiEnhanced: row.ai_enhanced === true || row.ai_enhanced === 'true',
                
                lifespan: this.calculateLifespan(row.birth_year, row.death_year),
                age: this.calculateAge(row.birth_year, row.death_year),
                imagePath: this.getImagePath(this.validateImageFilename(row.image_filename)),
                fields: this.combineFields(row.primary_field, row.secondary_fields),
                searchableText: this.createSearchableText(row)
            };

            if (index < 3) {
                console.log(`✅ Processed figure ${index + 1}:`, {
                    name: figure.name,
                    imageFilename: figure.imageFilename,
                    imagePath: figure.imagePath,
                    achievement: figure.achievement
                });
            }

            return figure;
        }).filter(figure => figure.name && figure.id);
    }

    validateImageFilename(filename) {
        if (!filename) return null;
        
        const cleaned = this.cleanString(filename);
        
        if (cleaned.length > 50 || (cleaned.includes(' ') && !cleaned.includes('.'))) {
            console.warn('❌ Invalid image filename detected (looks like description):', cleaned);
            return null;
        }
        
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const hasValidExtension = validExtensions.some(ext => cleaned.toLowerCase().endsWith(ext));
        
        if (!hasValidExtension && cleaned !== 'placeholder.jpg') {
            console.warn('❌ Invalid image filename (no valid extension):', cleaned);
            return null;
        }
        
        return cleaned;
    }

    getImagePath(filename) {
        if (!filename || filename === 'placeholder.jpg' || filename === '') {
            return null;
        }
        
        if (filename.startsWith('http')) {
            return filename;
        }
        
        return `assets/images/figures/${filename}`;
    }

    async getRandomFigures(count = 6) {
        await this.ensureLoaded();
        
        const shuffled = [...this.processedFigures].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    async getFiguresByEra(era) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.era.toLowerCase() === era.toLowerCase()
        );
    }

    async getFiguresByField(field) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.fields.some(f => f.toLowerCase().includes(field.toLowerCase()))
        );
    }

    async getFiguresByRegion(region) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.region.toLowerCase().includes(region.toLowerCase()) ||
            figure.heritage.toLowerCase().includes(region.toLowerCase())
        );
    }

    async getFiguresByGender(gender) {
        await this.ensureLoaded();
        
        return this.processedFigures.filter(figure => 
            figure.gender.toLowerCase() === gender.toLowerCase()
        );
    }

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

    async getFigureById(id) {
        await this.ensureLoaded();
        
        return this.processedFigures.find(figure => figure.id === parseInt(id));
    }

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

    async getAvailableEras() {
        await this.ensureLoaded();
        
        const eras = [...new Set(this.processedFigures.map(f => f.era))];
        return eras.sort();
    }

    async getAvailableFields() {
        await this.ensureLoaded();
        
        const fields = new Set();
        this.processedFigures.forEach(figure => {
            figure.fields.forEach(field => fields.add(field));
        });
        
        return [...fields].sort();
    }

    async getAvailableRegions() {
        await this.ensureLoaded();
        
        const regions = [...new Set(this.processedFigures.map(f => f.region))];
        return regions.sort();
    }

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

    combineFields(primary, secondary) {
        const fields = [];
        if (primary) fields.push(primary);
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
        
        return searchFields.filter(field => field).join(' ').toLowerCase();
    }

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

    async ensureLoaded() {
        if (!this.isLoaded && !this.isInitializing) {
            await this.init();
        } else if (this.isInitializing) {
            await this.initPromise;
        }
    }

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
                secondary_fields: "Civil Rights,Activism",
                achievement: "Renowned poet, memoirist, and civil rights activist",
                famous_quote: "There is no greater agony than bearing an untold story inside you.",
                short_bio: "Maya Angelou was an American poet, memoirist, and civil rights activist. She published seven autobiographies, three books of essays, several books of poetry, and is credited with a list of plays, movies, and television shows spanning over 50 years.",
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
                secondary_fields: "Human Rights,Law",
                achievement: "Anti-apartheid revolutionary and South African President",
                famous_quote: "Education is the most powerful weapon which you can use to change the world.",
                short_bio: "Nelson Rolihlahla Mandela was a South African anti-apartheid revolutionary, political leader, and philanthropist who served as President of South Africa from 1994 to 1999.",
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
                achievement: "Reggae legend and global cultural icon",
                famous_quote: "One love, one heart, let's get together and feel all right.",
                short_bio: "Robert Nesta Marley was a Jamaican singer, songwriter, and musician. Considered one of the pioneers of reggae, his musical career was marked by fusing elements of reggae, ska, and rocksteady.",
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
                achievement: "Author of Things Fall Apart and literary pioneer",
                famous_quote: "If you don't like someone's story, write your own.",
                short_bio: "Chinua Achebe was a Nigerian novelist, poet, professor, and critic. His first novel Things Fall Apart is the most widely read book in modern African literature.",
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
                primary_field: "Environmental Activism",
                secondary_fields: "Politics,Women's Rights",
                achievement: "First African woman to receive the Nobel Peace Prize",
                famous_quote: "When we plant trees, we plant the seeds of peace and seeds of hope.",
                short_bio: "Wangari Muta Maathai was a Kenyan social, environmental, and political activist and the first African woman to win the Nobel Peace Prize.",
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
                achievement: "44th President of the United States",
                famous_quote: "Yes we can.",
                short_bio: "Barack Hussein Obama II is an American politician and attorney who served as the 44th president of the United States from 2009 to 2017.",
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
                famous_quote: "The biggest adventure you can take is to live the life of your dreams.",
                short_bio: "Oprah Gail Winfrey is an American talk show host, television producer, actress, media executive, and philanthropist.",
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
                famous_quote: "A people without the knowledge of their past history, origin and culture is like a tree without roots.",
                short_bio: "Marcus Mosiah Garvey Jr. was a Jamaican political activist, publisher, journalist, entrepreneur, and orator.",
                image_filename: "marcus-garvey.jpg",
                era: "Colonial",
                gender: "Male",
                status: "deceased",
                connections: "W.E.B. Du Bois,Amy Jacques Garvey",
                ai_enhanced: true
            },
            {
                id: 9,
                name: "James Baldwin",
                birth_year: 1924,
                death_year: 1987,
                region: "United States",
                heritage: "African American",
                primary_field: "Literature",
                secondary_fields: "Civil Rights,Social Criticism",
                achievement: "Influential writer and social critic",
                famous_quote: "Not everything that is faced can be changed, but nothing can be changed until it is faced.",
                short_bio: "James Arthur Baldwin was an American novelist, essayist, playwright, poet, and social critic. His essays explore intricacies of racial, sexual, and class distinctions in Western societies.",
                image_filename: "james-baldwin.jpg",
                era: "Modern",
                gender: "Male",
                status: "deceased",
                connections: "Maya Angelou,Langston Hughes",
                ai_enhanced: true
            },
            {
                id: 10,
                name: "Frida Kahlo",
                birth_year: 1907,
                death_year: 1954,
                region: "Mexico",
                heritage: "Mexican",
                primary_field: "Visual Arts",
                secondary_fields: "Politics,Activism",
                achievement: "Iconic painter and feminist symbol",
                famous_quote: "I paint my own reality.",
                short_bio: "Frida Kahlo was a Mexican artist who painted many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.",
                image_filename: "frida-kahlo.jpg",
                era: "Modern",
                gender: "Female",
                status: "deceased",
                connections: "Diego Rivera,André Breton",
                ai_enhanced: true
            },
            {
                id: 11,
                name: "Martin Luther King Jr.",
                birth_year: 1929,
                death_year: 1968,
                region: "United States",
                heritage: "African American",
                primary_field: "Civil Rights",
                secondary_fields: "Religion,Activism",
                achievement: "Leader of the American civil rights movement",
                famous_quote: "I have a dream that one day this nation will rise up and live out the true meaning of its creed.",
                short_bio: "Martin Luther King Jr. was an American Baptist minister and activist who became the most visible spokesperson and leader in the American civil rights movement.",
                image_filename: "martin-luther-king.jpg",
                era: "Modern",
                gender: "Male",
                status: "deceased",
                connections: "Maya Angelou,Rosa Parks",
                ai_enhanced: true
            },
            {
                id: 12,
                name: "Kwame Nkrumah",
                birth_year: 1909,
                death_year: 1972,
                region: "Ghana",
                heritage: "Akan",
                primary_field: "Politics",
                secondary_fields: "Pan-Africanism,Philosophy",
                achievement: "First President of Ghana and Pan-African leader",
                famous_quote: "We face neither East nor West; we face forward.",
                short_bio: "Kwame Nkrumah was a Ghanaian politician and revolutionary. He was the first Prime Minister and President of Ghana, having led the Gold Coast to independence from Britain in 1957.",
                image_filename: "kwame-nkrumah.jpg",
                era: "Modern",
                gender: "Male",
                status: "deceased",
                connections: "Julius Nyerere,Gamal Abdel Nasser",
                ai_enhanced: true
            }
        ];
    }

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
            stats.byEra[figure.era] = (stats.byEra[figure.era] || 0) + 1;
            stats.byGender[figure.gender] = (stats.byGender[figure.gender] || 0) + 1;
            stats.byField[figure.primaryField] = (stats.byField[figure.primaryField] || 0) + 1;
            stats.byRegion[figure.region] = (stats.byRegion[figure.region] || 0) + 1;
            
            if (figure.isAlive) {
                stats.byStatus.alive++;
            } else {
                stats.byStatus.deceased++;
            }
        });

        return stats;
    }

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