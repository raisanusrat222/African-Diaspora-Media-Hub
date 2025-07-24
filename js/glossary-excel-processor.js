// Processes Excel glossary file and enhances terms with AI-generated content

class GlossaryExcelProcessor {
    constructor() {
        this.excelTerms = new Map();
        this.isLoaded = false;
        this.isInitializing = false;
        this.cacheKey = 'glossary_excel_cache_v2';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
        this.aiEnhancementQueue = [];
        this.isEnhancing = false;
        
        // Default categories for AI to choose from
        this.validCategories = [
            'cultural', 'historical', 'geographical', 'linguistic', 'academic',
            'spiritual', 'musical', 'political', 'social', 'dance', 'religion'
        ];
        
        this.init();
    }

    async init() {
        if (this.isInitializing || this.isLoaded) return;
        
        this.isInitializing = true;
        
        try {
            console.log('📚 Initializing Glossary Excel Processor...');
            
            // Try to load from cache first
            if (this.loadFromCache()) {
                console.log('✅ Glossary terms loaded from cache');
                this.isLoaded = true;
                this.isInitializing = false;
                this.scheduleAIEnhancement(); // Continue enhancing cached terms
                return;
            }
            
            // Load Excel file
            await this.loadExcelFile();
            
            // Save to cache
            this.saveToCache();
            
            this.isLoaded = true;
            console.log('✅ Glossary Excel Processor initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Glossary Excel Processor:', error);
            this.isLoaded = true;
        }
        
        this.isInitializing = false;
    }

    async loadExcelFile() {
        try {
            // Check if XLSX library is available
            if (typeof XLSX === 'undefined') {
                console.warn('⚠️ XLSX library not available. Loading fallback script...');
                await this.loadXLSXLibrary();
            }

            // Try to read the glossary terms file
            const response = await window.fs.readFile('glossaryterms.xlsx');
            
            const workbook = XLSX.read(response, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true
            });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            await this.processExcelData(data);
            
        } catch (error) {
            console.warn('⚠️ Could not load Excel file:', error.message);
            console.log('📝 Continuing without Excel data - will use hardcoded fallbacks');
        }
    }

    async loadXLSXLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Could not load XLSX library'));
            document.head.appendChild(script);
        });
    }

    async processExcelData(data) {
        if (!data || data.length < 2) {
            console.warn('No valid data found in Excel file');
            return;
        }
        
        // Expected headers: Term, Definition, Category (or similar variations)
        const headers = data[0].map(h => h ? h.toString().toLowerCase().trim() : '');
        console.log('📋 Excel headers found:', headers);
        
        // Find column indices
        const termIndex = this.findColumnIndex(headers, ['term', 'name', 'word']);
        const defIndex = this.findColumnIndex(headers, ['definition', 'meaning', 'def']);
        const catIndex = this.findColumnIndex(headers, ['category', 'type', 'cat']);
        
        if (termIndex === -1 || defIndex === -1) {
            console.error('❌ Could not find required columns (Term and Definition)');
            return;
        }
        
        let processedCount = 0;
        
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length < 2) continue;
            
            const term = this.cleanText(row[termIndex]);
            const definition = this.cleanText(row[defIndex]);
            const category = catIndex !== -1 ? this.cleanText(row[catIndex]) : '';
            
            // Skip if essential data is missing
            if (!term || !definition || term.length < 2 || definition.length < 10) {
                continue;
            }
            
            const termData = {
                id: this.generateTermId(term),
                name: term,
                definition: definition,
                category: this.validateCategory(category),
                source: 'excel',
                // Fields to be AI-enhanced
                pronunciation: null,
                etymology: null,
                usageExample: null,
                origin: null,
                difficulty: null,
                popularity: 70,
                relatedTerms: [],
                dateAdded: new Date().toISOString(),
                isExcel: true
            };
            
            this.excelTerms.set(termData.id, termData);
            processedCount++;
        }
        
        console.log(`📊 Processed ${processedCount} terms from Excel file`);
        
        // Start AI enhancement process
        if (processedCount > 0) {
            this.scheduleAIEnhancement();
        }
    }

    findColumnIndex(headers, searchTerms) {
        for (const term of searchTerms) {
            const index = headers.findIndex(h => h.includes(term));
            if (index !== -1) return index;
        }
        return -1;
    }

    cleanText(text) {
        if (!text) return '';
        return text.toString().trim().replace(/\s+/g, ' ');
    }

    generateTermId(termName) {
        return termName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    validateCategory(category) {
        if (!category) return null;
        
        const cleaned = category.toLowerCase().trim();
        
        // Check if it matches any valid category
        const match = this.validCategories.find(cat => 
            cat.includes(cleaned) || cleaned.includes(cat)
        );
        
        return match || cleaned;
    }

    // ===== AI ENHANCEMENT =====
    scheduleAIEnhancement() {
        if (!window.DiasporaAI || !window.DiasporaAI.isInitialized) {
            console.log('🤖 AI not available for term enhancement - will retry later');
            setTimeout(() => this.scheduleAIEnhancement(), 5000);
            return;
        }
        
        console.log('🤖 Scheduling AI enhancement for Excel terms...');
        
        // Add all terms that need enhancement to queue
        this.aiEnhancementQueue.length = 0; // Clear existing queue
        this.excelTerms.forEach((term) => {
            if (this.needsEnhancement(term)) {
                this.aiEnhancementQueue.push(term.id);
            }
        });
        
        if (this.aiEnhancementQueue.length === 0) {
            console.log('✅ All terms already enhanced');
            return;
        }
        
        // Start enhancement process with delay
        setTimeout(() => {
            this.processAIEnhancement();
        }, 3000);
    }

    needsEnhancement(term) {
        return !term.pronunciation || 
               !term.etymology || 
               !term.usageExample || 
               !term.category ||
               !term.origin ||
               !term.difficulty;
    }

    async processAIEnhancement() {
        if (this.isEnhancing || this.aiEnhancementQueue.length === 0) return;
        
        this.isEnhancing = true;
        console.log(`🔄 Processing AI enhancement for ${this.aiEnhancementQueue.length} terms...`);
        
        const batchSize = 3;
        const delay = 2000;
        
        while (this.aiEnhancementQueue.length > 0) {
            const batch = this.aiEnhancementQueue.splice(0, batchSize);
            
            await Promise.all(batch.map(async (termId) => {
                try {
                    await this.enhanceTermWithAI(termId);
                } catch (error) {
                    console.warn(`Failed to enhance term ${termId}:`, error);
                }
            }));
            
            if (this.aiEnhancementQueue.length > 0) {
                await this.delay(delay);
            }
        }
        
        this.isEnhancing = false;
        console.log('✅ AI enhancement process completed');
        
        // Update cache with enhanced terms
        this.saveToCache();
    }

    async enhanceTermWithAI(termId) {
        const term = this.excelTerms.get(termId);
        if (!term) return;
        
        console.log(`🤖 AI enhancing: ${term.name}`);
        
        try {
            const enhancements = await this.generateTermEnhancements(term);
            Object.assign(term, enhancements);
            console.log(`✅ Enhanced: ${term.name}`);
        } catch (error) {
            console.warn(`Failed to enhance ${term.name}:`, error);
            this.applyFallbackEnhancements(term);
        }
    }

    async generateTermEnhancements(term) {
        const enhancements = {};
        
        // Generate pronunciation if missing
        if (!term.pronunciation) {
            enhancements.pronunciation = await this.generatePronunciation(term);
        }
        
        // Generate etymology if missing
        if (!term.etymology) {
            enhancements.etymology = await this.generateEtymology(term);
        }
        
        // Generate usage example if missing
        if (!term.usageExample) {
            enhancements.usageExample = await this.generateUsageExample(term);
        }
        
        // Determine category if missing
        if (!term.category) {
            enhancements.category = await this.generateCategory(term);
        }
        
        // Determine origin if missing
        if (!term.origin) {
            enhancements.origin = await this.generateOrigin(term);
        }
        
        // Assess difficulty if missing
        if (!term.difficulty) {
            enhancements.difficulty = await this.generateDifficulty(term);
        }
        
        return enhancements;
    }

    async generatePronunciation(term) {
        const prompt = `Provide the phonetic pronunciation for the African diaspora term "${term.name}". Return only the pronunciation in IPA format like "/pronunciation/" or a simplified phonetic guide.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 50, 0.3);
            const cleaned = response.trim().replace(/[^a-zA-Z0-9/ˈˌæɪɛɔʊəɹɫ\s]/g, '');
            
            if (cleaned.includes('/')) {
                return cleaned;
            } else {
                return `/${this.generateBasicPronunciation(term.name)}/`;
            }
        } catch (error) {
            return `/${this.generateBasicPronunciation(term.name)}/`;
        }
    }

    generateBasicPronunciation(termName) {
        return termName.toLowerCase()
            .replace(/[^a-z]/g, '')
            .replace(/([aeiou])([bcdfghjklmnpqrstvwxyz])/g, '$1-$2');
    }

    async generateEtymology(term) {
        const prompt = `Provide a brief etymology for the African diaspora term "${term.name}". Include original language, meaning, and how it evolved. Write 1-2 sentences only.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 100, 0.5);
            return response.trim();
        } catch (error) {
            return `The term "${term.name}" has roots in African cultural traditions and diaspora communities.`;
        }
    }

    async generateUsageExample(term) {
        const prompt = `Create a realistic usage example for the African diaspora term "${term.name}" based on this definition: "${term.definition}". Write one natural sentence showing how it would be used in context.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 80, 0.7);
            return response.trim().replace(/^["']|["']$/g, '');
        } catch (error) {
            return `Understanding ${term.name} helps preserve African diaspora heritage.`;
        }
    }

    async generateCategory(term) {
        const prompt = `Categorize this African diaspora term "${term.name}" with definition "${term.definition}". Choose the BEST category from: cultural, historical, geographical, linguistic, spiritual, musical, political, social. Return only the category word.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 20, 0.3);
            const category = response.trim().toLowerCase();
            
            return this.validCategories.includes(category) ? category : 'cultural';
        } catch (error) {
            return 'cultural';
        }
    }

    async generateOrigin(term) {
        const prompt = `Based on the term "${term.name}" and definition "${term.definition}", determine its geographical/cultural origin. Choose from: west-africa, east-africa, central-africa, southern-africa, caribbean, north-america, south-america, or unknown. Return only the origin.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 30, 0.3);
            const origin = response.trim().toLowerCase().replace(/\s+/g, '-');
            
            const validOrigins = ['west-africa', 'east-africa', 'central-africa', 'southern-africa', 'caribbean', 'north-america', 'south-america'];
            return validOrigins.includes(origin) ? origin : 'unknown';
        } catch (error) {
            return 'unknown';
        }
    }

    async generateDifficulty(term) {
        const prompt = `Rate the difficulty level for learning the African diaspora term "${term.name}" with definition "${term.definition}". Consider definition complexity and cultural context. Choose: beginner, intermediate, or advanced. Return only the difficulty level.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 20, 0.3);
            const difficulty = response.trim().toLowerCase();
            
            const validDifficulties = ['beginner', 'intermediate', 'advanced'];
            return validDifficulties.includes(difficulty) ? difficulty : 'intermediate';
        } catch (error) {
            // Fallback logic based on definition length and complexity
            const defLength = term.definition.length;
            const complexWords = (term.definition.match(/\b\w{8,}\b/g) || []).length;
            
            if (defLength < 100 && complexWords < 2) return 'beginner';
            if (defLength < 200 && complexWords < 4) return 'intermediate';
            return 'advanced';
        }
    }

    applyFallbackEnhancements(term) {
        if (!term.pronunciation) {
            term.pronunciation = `/${this.generateBasicPronunciation(term.name)}/`;
        }
        
        if (!term.etymology) {
            term.etymology = `The term "${term.name}" originates from African cultural traditions.`;
        }
        
        if (!term.usageExample) {
            term.usageExample = `Understanding ${term.name} enriches our knowledge of diaspora culture.`;
        }
        
        if (!term.category) {
            term.category = 'cultural';
        }
        
        if (!term.origin) {
            term.origin = 'unknown';
        }
        
        if (!term.difficulty) {
            term.difficulty = 'intermediate';
        }
    }

    // ===== CACHING =====
    saveToCache() {
        try {
            const cacheData = {
                terms: Object.fromEntries(this.excelTerms),
                timestamp: Date.now(),
                version: '2.0'
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log('💾 Excel glossary terms cached successfully');
        } catch (error) {
            console.warn('Could not save glossary terms to cache:', error);
        }
    }

    loadFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return false;

            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;

            if (age > this.cacheExpiry) {
                localStorage.removeItem(this.cacheKey);
                return false;
            }

            this.excelTerms = new Map(Object.entries(cacheData.terms));
            console.log(`📚 Loaded ${this.excelTerms.size} terms from cache`);

            return true;
        } catch (error) {
            console.warn('Could not load glossary terms from cache:', error);
            return false;
        }
    }

    // ===== PUBLIC API =====
    async getTerms() {
        await this.ensureLoaded();
        return Array.from(this.excelTerms.values());
    }

    async getTerm(termId) {
        await this.ensureLoaded();
        return this.excelTerms.get(termId);
    }

    getTermsCount() {
        return this.excelTerms.size;
    }

    async ensureLoaded() {
        if (!this.isLoaded && !this.isInitializing) {
            await this.init();
        }
        return this.isLoaded;
    }

    getEnhancementProgress() {
        if (this.excelTerms.size === 0) return { completed: 0, total: 0, percentage: 100 };
        
        let enhanced = 0;
        this.excelTerms.forEach(term => {
            if (!this.needsEnhancement(term)) {
                enhanced++;
            }
        });
        
        const total = this.excelTerms.size;
        const percentage = Math.round((enhanced / total) * 100);
        
        return { completed: enhanced, total, percentage };
    }

    // ===== UTILITY METHODS =====
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    cleanup() {
        this.excelTerms.clear();
        this.aiEnhancementQueue.length = 0;
        this.isLoaded = false;
        this.isInitializing = false;
        this.isEnhancing = false;
    }
}

// Global instance
window.glossaryExcelProcessor = new GlossaryExcelProcessor();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlossaryExcelProcessor;
}