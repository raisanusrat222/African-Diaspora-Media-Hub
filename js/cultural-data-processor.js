// js/cultural-data-processor.js - Process Excel cultural data for maps

/**
 * Cultural Data Processor for Maps Integration
 * Handles Excel data processing and AI enhancement for historical regions
 */
class CulturalDataProcessor {
    constructor() {
        this.culturalData = new Map();
        this.migrationData = new Map();
        this.isLoaded = false;
        this.isInitializing = false;
        this.cacheKey = 'maps_cultural_data_cache';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
        
        this.init();
    }

    async init() {
        if (this.isInitializing || this.isLoaded) return;
        
        this.isInitializing = true;
        
        try {
            console.log('🗺️ Initializing Cultural Data Processor for Maps...');
            
            // Try to load from cache first
            if (this.loadFromCache()) {
                console.log('✅ Cultural data loaded from cache');
                this.isLoaded = true;
                this.isInitializing = false;
                return;
            }
            
            // Load Excel files
            await this.loadExcelData();
            
            // Add fallback data for regions not in Excel
            this.addFallbackData();
            
            // Save to cache
            this.saveToCache();
            
            this.isLoaded = true;
            console.log('✅ Cultural Data Processor initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Cultural Data Processor:', error);
            // Use fallback data only
            this.addFallbackData();
            this.isLoaded = true;
        }
        
        this.isInitializing = false;
    }

    async loadExcelData() {
        try {
            // Check if files exist and load them
            await Promise.all([
                this.loadBeforeTradeData(),
                this.loadMigrationData()
            ]);
            
        } catch (error) {
            console.warn('⚠️ Could not load Excel files, using fallback data:', error);
        }
    }

    async loadBeforeTradeData() {
        try {
            // Try to read the before trade data file
            const response = await window.fs.readFile('beforetransatlanticslavetradeinfo.xlsx');
            
            // Import SheetJS for Excel processing
            if (typeof XLSX === 'undefined') {
                console.warn('SheetJS not available, using sample data');
                this.addSampleBeforeTradeData();
                return;
            }

            const workbook = XLSX.read(response, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true
            });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            this.processBeforeTradeData(data);
            
        } catch (error) {
            console.warn('⚠️ Before trade data file not found, using sample data');
            this.addSampleBeforeTradeData();
        }
    }

    async loadMigrationData() {
        try {
            const response = await window.fs.readFile('keymigrations.xlsx');
            
            if (typeof XLSX === 'undefined') {
                console.warn('SheetJS not available, using sample migration data');
                this.addSampleMigrationData();
                return;
            }

            const workbook = XLSX.read(response, {
                cellStyles: true,
                cellFormulas: true,
                cellDates: true
            });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            this.processMigrationData(data);
            
        } catch (error) {
            console.warn('⚠️ Migration data file not found, using sample data');
            this.addSampleMigrationData();
        }
    }

    processBeforeTradeData(data) {
        if (!data || data.length < 2) return;
        
        // Expected headers: Region, Country, Food, Music, Clothing, Religion, Languages & Dialects, Celebrations/Festivals, Education/Learning
        const headers = data[0];
        
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length < 2) continue;
            
            const countryKey = this.normalizeKey(row[1]); // Country column
            
            const culturalInfo = {
                region: row[0] || '',
                country: row[1] || '',
                food: row[2] || '',
                music: row[3] || '',
                clothing: row[4] || '',
                religion: row[5] || '',
                languages: row[6] || '',
                celebrations: row[7] || '',
                education: row[8] || ''
            };
            
            this.culturalData.set(countryKey, culturalInfo);
            console.log(`📚 Loaded cultural data for ${culturalInfo.country}`);
        }
    }

    processMigrationData(data) {
        if (!data || data.length < 2) return;
        
        // Expected headers: Region, Country, Key Migration Waves
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length < 3) continue;
            
            const countryKey = this.normalizeKey(row[1]);
            
            const migrationInfo = {
                region: row[0] || '',
                country: row[1] || '',
                migrationWaves: row[2] || ''
            };
            
            this.migrationData.set(countryKey, migrationInfo);
            console.log(`🌍 Loaded migration data for ${migrationInfo.country}`);
        }
    }

    addSampleBeforeTradeData() {
        // Sample data based on the Angola example you provided
        const sampleData = {
            angola: {
                region: 'Africa',
                country: 'Angola',
                food: 'Staples included sorghum, pearl millet, finger millet, African rice, teff, fonio, true yams, taro. Legumes like cowpeas and Bambara groundnuts. Porridges and breads made from staples, paired with vegetables, legumes, or fish.',
                music: 'Drums (Ngoma & Mpwita), musical bows (hungu/mbulumbumba), trumpets (Mpungu), string fiddles (xihumba, xicomba), xylophones and lamellophones. Used for rituals, ceremonies, and communication.',
                clothing: 'Bark cloth, raffia, animal hides, plant fibers, leather. Basic garments included loincloths, wraps, skirts, capes. Adorned with beads, shells, metal buttons, tattoos, scarification, ochre paint.',
                religion: 'Belief in supreme creator (Nzambi Mpungu), nature spirits, ancestor veneration. Bakongo cosmology with physical (Ku Nseke) and spiritual (Ku Mpemba) realms connected by Kalunga line. Banganga served as diviners and healers.',
                languages: 'Umbundu (Ovimbundu), Kimbundu (Mbundu), Kikongo (Bakongo), Chokwe, Mbunda, Nyaneka, Kuvale, Bolo dialects. Rich diversity of Bantu languages across regions.',
                celebrations: 'Mukanda circumcision rites with makishi masked dancers, Engolo martial dance rituals, harvest festivals, ancestral celebrations, Luanda Island feasts. Central to community identity and spiritual practice.',
                education: 'Oral tradition, storytelling, community-based apprenticeship, practical training, rite of passage ceremonies, initiation schools, mnemonic and ideographic traditions.'
            },
            mali: {
                region: 'Africa',
                country: 'Mali',
                food: 'Millet, sorghum, rice along Niger River. Cultivation of yams, beans, groundnuts. Trade brought dates, salt. Communal cooking traditions with emphasis on sharing.',
                music: 'Griots with kora, balafon, djembe drums. Call-and-response vocals, praise songs, historical narratives. Music integral to governance and social cohesion.',
                clothing: 'Cotton textiles, indigo dyes, elaborate robes indicating status. Gold thread embroidery for nobility. Islamic influence on dress codes in urban centers.',
                religion: 'Traditional beliefs with nature spirits, ancestor veneration. Islamic influence through trans-Saharan trade. Syncretic practices blending both traditions.',
                languages: 'Mandinka, Bambara, Fulfulde, Soninke. Arabic for scholarship and trade. Complex linguistic landscape reflecting empire\'s diversity.',
                celebrations: 'Harvest festivals, royal ceremonies, Islamic holidays. Griots performances at major events. Seasonal celebrations tied to agricultural cycles.',
                education: 'Islamic schools in Timbuktu, oral traditions, apprenticeships. Centers of learning attracting scholars from across Africa and Islamic world.'
            },
            nigeria: {
                region: 'Africa',
                country: 'Nigeria',
                food: 'Yams, cassava, plantains, rice in north. Complex seasoning with indigenous spices. Regional variations from forest to savanna zones.',
                music: 'Talking drums, flutes, xylophones. Yoruba dundun drums, Igbo wooden gongs. Music for communication and ceremonial purposes.',
                clothing: 'Adire cloth, kente-style weaving, leather work. Status symbols through textiles. Regional variations in dress and ornamentation.',
                religion: 'Yoruba orishas, Igbo chi and alusi, northern spirit traditions. Complex pantheons with specialized deities for different aspects of life.',
                languages: 'Yoruba, Igbo, Hausa, Fulani, over 500 languages. Tonal languages with rich oral literature traditions.',
                celebrations: 'Yam festivals, royal ceremonies, age-grade initiations. Masquerade traditions, seasonal celebrations.',
                education: 'Age-grade systems, apprenticeships, initiation schools. Knowledge transmission through practical training and oral tradition.'
            }
        };

        Object.entries(sampleData).forEach(([key, data]) => {
            this.culturalData.set(key, data);
        });
    }

    addSampleMigrationData() {
        const sampleMigrations = {
            angola: {
                region: 'Africa',
                country: 'Angola',
                migrationWaves: 'Bantu migrations, transatlantic slave trade, colonial labor migration'
            },
            mali: {
                region: 'Africa',
                country: 'Mali',
                migrationWaves: 'Trans-Saharan trade migrations, Mandinka expansion, Islamic scholar movements'
            },
            nigeria: {
                region: 'Africa',
                country: 'Nigeria',
                migrationWaves: 'Bantu migrations, Yoruba city-state expansion, Fulani pastoral movements, transatlantic slave trade'
            }
        };

        Object.entries(sampleMigrations).forEach(([key, data]) => {
            this.migrationData.set(key, data);
        });
    }

    addFallbackData() {
        // Add basic cultural data for regions that might not be in Excel files
        const fallbackRegions = [
            'ghana', 'senegal', 'ethiopia', 'kenya', 'benin-kingdom', 'yoruba', 
            'igbo', 'kongo', 'zimbabwe', 'songhai', 'ghana-empire'
        ];

        fallbackRegions.forEach(region => {
            if (!this.culturalData.has(region)) {
                this.culturalData.set(region, {
                    region: 'Africa',
                    country: this.formatRegionName(region),
                    food: 'Traditional agricultural products and local cuisine',
                    music: 'Indigenous musical traditions and instruments',
                    clothing: 'Traditional textiles and ceremonial dress',
                    religion: 'Ancestral beliefs and spiritual practices',
                    languages: 'Local languages and dialects',
                    celebrations: 'Seasonal festivals and ceremonial occasions',
                    education: 'Oral traditions and community-based learning'
                });
            }

            if (!this.migrationData.has(region)) {
                this.migrationData.set(region, {
                    region: 'Africa',
                    country: this.formatRegionName(region),
                    migrationWaves: 'Historical population movements and cultural exchanges'
                });
            }
        });
    }

    normalizeKey(countryName) {
        if (!countryName) return '';
        return countryName.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    formatRegionName(key) {
        return key.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getCulturalData(regionKey) {
        const normalizedKey = this.normalizeKey(regionKey);
        return this.culturalData.get(normalizedKey) || null;
    }

    getMigrationData(regionKey) {
        const normalizedKey = this.normalizeKey(regionKey);
        return this.migrationData.get(normalizedKey) || null;
    }

    getAllRegions() {
        return Array.from(this.culturalData.keys());
    }

    saveToCache() {
        try {
            const cacheData = {
                cultural: Object.fromEntries(this.culturalData),
                migration: Object.fromEntries(this.migrationData),
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log('💾 Cultural data cached successfully');
        } catch (error) {
            console.warn('Could not save cultural data to cache:', error);
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

            this.culturalData = new Map(Object.entries(cacheData.cultural));
            this.migrationData = new Map(Object.entries(cacheData.migration));

            return true;
        } catch (error) {
            console.warn('Could not load cultural data from cache:', error);
            return false;
        }
    }

    async ensureLoaded() {
        if (!this.isLoaded && !this.isInitializing) {
            await this.init();
        }
        return this.isLoaded;
    }

    cleanup() {
        this.culturalData.clear();
        this.migrationData.clear();
        this.isLoaded = false;
        this.isInitializing = false;
    }
}

// Global instance
window.culturalDataProcessor = new CulturalDataProcessor();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CulturalDataProcessor;
}