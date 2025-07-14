// Cultural Symbols Database

/**
 * Database of cultural symbols organized by country and region
 * Each symbol includes traditional meaning, visual characteristics, and diaspora evolution
 */
const CulturalSymbolsDB = {
    // West African Origin Countries
    Ghana: {
        country: "Ghana",
        region: "West Africa",
        symbols: {
            adinkra: [
                {
                    name: "Gye Nyame",
                    meaning: "Except for God - symbolizes the supremacy and omnipotence of God",
                    category: "spiritual",
                    icon: "fas fa-star",
                    description: "One of the most important Adinkra symbols representing divine authority and the belief that only God is eternal.",
                    diasporaEvolution: {
                        Jamaica: "Adopted by Maroon communities as spiritual protection symbols in sacred ceremonies",
                        "United States": "Incorporated into African American quilting patterns and religious art",
                        Brazil: "Integrated into Candomblé spiritual practices and ceremonial objects"
                    },
                    visualElements: "Circular design with internal geometric patterns, often featuring a central cross or star motif"
                },
                {
                    name: "Sankofa",
                    meaning: "Look back and fetch it - learn from the past to move forward",
                    category: "wisdom",
                    icon: "fas fa-undo-alt",
                    description: "Represents the importance of learning from history and ancestral wisdom to progress.",
                    diasporaEvolution: {
                        "United States": "Became a powerful symbol in Civil Rights movement and African American education",
                        Haiti: "Incorporated into Vodou ceremonies emphasizing ancestral connection",
                        Canada: "Used in African diaspora community centers and cultural programs"
                    },
                    visualElements: "Bird with head turned backward or heart-shaped symbol with decorative elements"
                },
                {
                    name: "Dwennimmen",
                    meaning: "Ram's horns - symbolizes humility and strength",
                    category: "character",
                    icon: "fas fa-mountain",
                    description: "Represents the balance between strength and humility, showing that true power comes with wisdom.",
                    diasporaEvolution: {
                        "United States": "Used in African American fraternal organizations and leadership symbols",
                        Brazil: "Adapted in Capoeira culture to represent mental and physical strength",
                        "United Kingdom": "Featured in Ghanaian diaspora community emblems and cultural organizations"
                    },
                    visualElements: "Stylized ram horns in curved, symmetrical patterns"
                }
            ],
            kente: [
                {
                    name: "Sikafuturo Pattern",
                    meaning: "Gold dust - represents wealth, prosperity, and royalty",
                    category: "status",
                    icon: "fas fa-gem",
                    description: "Traditional kente pattern using gold colors to signify prosperity and divine blessing.",
                    diasporaEvolution: {
                        "United States": "Adapted in African American graduation ceremonies and cultural celebrations",
                        Jamaica: "Influenced traditional textile patterns in cultural festivals",
                        "Costa Rica": "Integrated into Afro-Caribbean ceremonial clothing"
                    },
                    visualElements: "Gold and yellow geometric patterns with diamond and triangle motifs"
                }
            ]
        }
    },

    Nigeria: {
        country: "Nigeria",
        region: "West Africa", 
        symbols: {
            yoruba: [
                {
                    name: "Ifa Symbols",
                    meaning: "Divine wisdom and spiritual guidance through divination",
                    category: "spiritual",
                    icon: "fas fa-eye",
                    description: "Sacred symbols used in Ifa divination system representing cosmic order and spiritual communication.",
                    diasporaEvolution: {
                        Brazil: "Central to Candomblé religious practices and ritual objects",
                        Cuba: "Preserved in Santería spiritual traditions and ceremonial art",
                        Haiti: "Integrated into Vodou spiritual symbols and sacred drawings"
                    },
                    visualElements: "Linear and geometric patterns, often featuring vertical and horizontal lines in specific combinations"
                },
                {
                    name: "Ori Symbol",
                    meaning: "Inner head or personal destiny - represents individual spiritual essence",
                    category: "spiritual",
                    icon: "fas fa-user-circle",
                    description: "Represents the spiritual head that guides individual destiny and connection to divine purpose.",
                    diasporaEvolution: {
                        "Trinidad and Tobago": "Incorporated into spiritual practices and personal protection rituals",
                        "United States": "Used in African American spiritual movements and personal empowerment symbols",
                        Venezuela: "Preserved in Afro-Venezuelan religious ceremonies"
                    },
                    visualElements: "Circular or oval shapes often containing facial features or geometric patterns"
                }
            ],
            igbo: [
                {
                    name: "Uli Patterns",
                    meaning: "Beauty, status, and spiritual protection through body art",
                    category: "decorative",
                    icon: "fas fa-paint-brush",
                    description: "Traditional body painting patterns that indicated social status and provided spiritual protection.",
                    diasporaEvolution: {
                        "United States": "Influenced African American body art and contemporary artistic expressions",
                        Brazil: "Adapted in Afro-Brazilian carnival decorations and artistic traditions",
                        Jamaica: "Integrated into Maroon cultural art and ceremonial body painting"
                    },
                    visualElements: "Flowing, organic curves and spiral patterns often featuring plant and animal motifs"
                }
            ]
        }
    },

    Senegal: {
        country: "Senegal",
        region: "West Africa",
        symbols: {
            islamic: [
                {
                    name: "Geometric Patterns",
                    meaning: "Divine infinity and Islamic artistic tradition",
                    category: "spiritual",
                    icon: "fas fa-th",
                    description: "Islamic geometric patterns representing divine order and infinite nature of Allah.",
                    diasporaEvolution: {
                        "United States": "Influenced African American Islamic communities and architectural designs",
                        France: "Preserved in Senegalese diaspora mosque decorations and cultural centers",
                        Brazil: "Integrated into Afro-Brazilian Islamic artistic traditions"
                    },
                    visualElements: "Complex geometric interlacing patterns with star, polygon, and arabesque motifs"
                }
            ],
            textile: [
                {
                    name: "Mudcloth Patterns",
                    meaning: "Family history, cultural identity, and ancestral knowledge",
                    category: "identity",
                    icon: "fas fa-fabric",
                    description: "Traditional textile patterns that tell stories of family lineage and cultural heritage.",
                    diasporaEvolution: {
                        "United States": "Adapted in African American quilting traditions and contemporary fashion",
                        France: "Preserved in Senegalese diaspora textile arts and fashion design",
                        Italy: "Influenced Afro-European artistic collaborations and cultural exhibitions"
                    },
                    visualElements: "Earth-toned patterns with symbols representing water, fertility, and ancestral wisdom"
                }
            ]
        }
    },

    Angola: {
        country: "Angola",
        region: "Central Africa",
        symbols: {
            bantu: [
                {
                    name: "Cosmogram",
                    meaning: "Cycle of life, death, and rebirth - spiritual cosmology",
                    category: "spiritual",
                    icon: "fas fa-circle-notch",
                    description: "Sacred symbol representing the eternal cycle of existence and connection between worlds.",
                    diasporaEvolution: {
                        Brazil: "Central to Capoeira traditions and Afro-Brazilian spiritual practices",
                        "United States": "Preserved in African American folk traditions and spiritual ceremonies",
                        Cuba: "Integrated into Afro-Cuban religious symbols and ritual art"
                    },
                    visualElements: "Circle divided by cross with additional symbolic elements representing cardinal directions"
                }
            ]
        }
    },

    // Diaspora Destination Countries with Adapted Symbols
    Brazil: {
        country: "Brazil",
        region: "South America",
        adaptedSymbols: {
            candomble: [
                {
                    name: "Orixá Symbols",
                    meaning: "Yoruba deities adapted for Brazilian spiritual practice",
                    originalOrigin: "Nigeria (Yoruba)",
                    category: "spiritual",
                    icon: "fas fa-hands",
                    description: "Yoruba spiritual symbols adapted and preserved in Brazilian Candomblé religion.",
                    adaptation: "Combined with Catholic saints imagery, adapted to local materials and artistic styles",
                    visualElements: "Stylized representations of nature elements, tools, and divine attributes"
                }
            ],
            capoeira: [
                {
                    name: "Berimbau Symbols",
                    meaning: "Musical and spiritual symbols from Angola adapted for martial arts",
                    originalOrigin: "Angola",
                    category: "cultural",
                    icon: "fas fa-music",
                    description: "Angolan musical traditions adapted into Brazilian Capoeira culture.",
                    adaptation: "Simplified for practical use in Capoeira, combined with Brazilian indigenous influences",
                    visualElements: "Musical note patterns, rhythm symbols, and movement representations"
                }
            ]
        }
    },

    Jamaica: {
        country: "Jamaica",
        region: "Caribbean",
        adaptedSymbols: {
            maroon: [
                {
                    name: "Akan Protection Symbols",
                    meaning: "Spiritual protection adapted from Ghanaian Akan traditions",
                    originalOrigin: "Ghana (Akan)",
                    category: "spiritual",
                    icon: "fas fa-shield-alt",
                    description: "Akan spiritual symbols preserved and adapted by Jamaican Maroon communities.",
                    adaptation: "Modified for local materials, combined with indigenous Taíno influences",
                    visualElements: "Geometric patterns carved in wood and stone, protective amulet designs"
                }
            ],
            rastafari: [
                {
                    name: "Ethiopian Symbols",
                    meaning: "Lion of Judah and Ethiopian imperial symbols",
                    originalOrigin: "Ethiopia",
                    category: "identity",
                    icon: "fas fa-crown",
                    description: "Ethiopian royal and religious symbols adopted by Rastafari movement.",
                    adaptation: "Reinterpreted through Pan-African lens, combined with Jamaican cultural elements",
                    visualElements: "Lion imagery, crowns, Ethiopian flag colors, and religious iconography"
                }
            ]
        }
    },

    "United States": {
        country: "United States",
        region: "North America",
        adaptedSymbols: {
            quilting: [
                {
                    name: "Underground Railroad Quilt Codes",
                    meaning: "Navigation and communication symbols adapted from various African traditions",
                    originalOrigin: "Multiple African regions",
                    category: "resistance",
                    icon: "fas fa-compass",
                    description: "African symbolic traditions adapted for secret communication during slavery.",
                    adaptation: "Simplified into geometric quilt patterns, encoded with practical information",
                    visualElements: "Star patterns, geometric shapes, and directional symbols in textile form"
                }
            ],
            spirituals: [
                {
                    name: "Call and Response Symbols",
                    meaning: "Musical communication patterns from West African traditions",
                    originalOrigin: "West Africa (Multiple)",
                    category: "cultural",
                    icon: "fas fa-microphone-alt",
                    description: "West African musical traditions preserved in African American spirituals.",
                    adaptation: "Combined with Christian imagery, adapted to English language and American context",
                    visualElements: "Musical notation patterns, rhythm symbols, and vocal arrangement indicators"
                }
            ]
        }
    },

    Haiti: {
        country: "Haiti",
        region: "Caribbean",
        adaptedSymbols: {
            vodou: [
                {
                    name: "Vèvè Symbols",
                    meaning: "Sacred symbols from Dahomey and Yoruba traditions",
                    originalOrigin: "Benin (Dahomey), Nigeria (Yoruba)",
                    category: "spiritual",
                    icon: "fas fa-star-and-crescent",
                    description: "West African spiritual symbols adapted for Haitian Vodou practice.",
                    adaptation: "Combined multiple African traditions, adapted with Catholic and indigenous influences",
                    visualElements: "Intricate linear patterns drawn with cornmeal, featuring crosses, stars, and flowing lines"
                }
            ]
        }
    }
};

/**
 * Symbol search and filtering utilities
 */
class SymbolDatabase {
    static getAllSymbols() {
        const allSymbols = [];
        
        for (const [country, data] of Object.entries(CulturalSymbolsDB)) {
            // Process origin country symbols
            if (data.symbols) {
                for (const [category, symbols] of Object.entries(data.symbols)) {
                    symbols.forEach(symbol => {
                        allSymbols.push({
                            ...symbol,
                            country,
                            region: data.region,
                            symbolCategory: category,
                            type: 'origin'
                        });
                    });
                }
            }
            
            // Process adapted symbols for diaspora countries
            if (data.adaptedSymbols) {
                for (const [category, symbols] of Object.entries(data.adaptedSymbols)) {
                    symbols.forEach(symbol => {
                        allSymbols.push({
                            ...symbol,
                            country,
                            region: data.region,
                            symbolCategory: category,
                            type: 'adapted'
                        });
                    });
                }
            }
        }
        
        return allSymbols;
    }
    
    static searchSymbols(query) {
        const allSymbols = this.getAllSymbols();
        const lowercaseQuery = query.toLowerCase();
        
        return allSymbols.filter(symbol => {
            return (
                symbol.name.toLowerCase().includes(lowercaseQuery) ||
                symbol.meaning.toLowerCase().includes(lowercaseQuery) ||
                symbol.category.toLowerCase().includes(lowercaseQuery) ||
                symbol.country.toLowerCase().includes(lowercaseQuery) ||
                symbol.description.toLowerCase().includes(lowercaseQuery) ||
                (symbol.originalOrigin && symbol.originalOrigin.toLowerCase().includes(lowercaseQuery))
            );
        });
    }
    
    static getSymbolsByCountry(country) {
        const countryData = CulturalSymbolsDB[country];
        if (!countryData) return [];
        
        const symbols = [];
        
        if (countryData.symbols) {
            for (const [category, categorySymbols] of Object.entries(countryData.symbols)) {
                categorySymbols.forEach(symbol => {
                    symbols.push({
                        ...symbol,
                        country,
                        region: countryData.region,
                        symbolCategory: category,
                        type: 'origin'
                    });
                });
            }
        }
        
        if (countryData.adaptedSymbols) {
            for (const [category, categorySymbols] of Object.entries(countryData.adaptedSymbols)) {
                categorySymbols.forEach(symbol => {
                    symbols.push({
                        ...symbol,
                        country,
                        region: countryData.region,
                        symbolCategory: category,
                        type: 'adapted'
                    });
                });
            }
        }
        
        return symbols;
    }
    
    static getSymbolsByCategory(category) {
        const allSymbols = this.getAllSymbols();
        return allSymbols.filter(symbol => symbol.category === category);
    }
    
    static getRandomSymbols(count = 6) {
        const allSymbols = this.getAllSymbols();
        const shuffled = allSymbols.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    static getEvolutionPath(originCountry, destinationCountry) {
        const originSymbols = this.getSymbolsByCountry(originCountry);
        const destinationSymbols = this.getSymbolsByCountry(destinationCountry);
        
        const evolutionPairs = [];
        
        // Find symbols that evolved from origin to destination
        originSymbols.forEach(originSymbol => {
            if (originSymbol.diasporaEvolution && originSymbol.diasporaEvolution[destinationCountry]) {
                // Find corresponding adapted symbol in destination
                const adaptedSymbol = destinationSymbols.find(destSymbol => 
                    destSymbol.originalOrigin && destSymbol.originalOrigin.includes(originCountry)
                );
                
                evolutionPairs.push({
                    original: originSymbol,
                    adapted: adaptedSymbol,
                    evolutionDescription: originSymbol.diasporaEvolution[destinationCountry]
                });
            }
        });
        
        return evolutionPairs;
    }
}

/**
 * Country mapping for the interactive map
 */
const CountryMappings = {
    // African Origin Countries
    originCountries: [
        "Angola", "Benin", "Burkina Faso", "Cameroon", "Congo", 
        "Ghana", "Côte d'Ivoire", "Liberia", "Mozambique", "Nigeria", 
        "Senegal", "The Gambia", "Sierra Leone", "South Africa", "Togo"
    ],
    
    // Diaspora Destination Countries  
    destinationCountries: [
        "Brazil", "Colombia", "Paraguay", "Peru", "United States", 
        "Puerto Rico", "Mexico", "Canada", "Cuba", "Dominican Republic", 
        "Haiti", "Jamaica", "Costa Rica", "El Salvador", "Honduras", 
        "Nicaragua", "Panama"
    ],
    
    // Alternative country names for mapping
    alternativeNames: {
        "United States of America": "United States",
        "USA": "United States",
        "US": "United States",
        "Republic of Ghana": "Ghana",
        "Federal Republic of Nigeria": "Nigeria",
        "Republic of Senegal": "Senegal",
        "Republic of Angola": "Angola"
    },
    
    getCountryType(countryName) {
        const normalizedName = this.alternativeNames[countryName] || countryName;
        
        if (this.originCountries.includes(normalizedName)) {
            return 'origin';
        } else if (this.destinationCountries.includes(normalizedName)) {
            return 'destination';
        }
        return 'other';
    },
    
    isValidCountry(countryName) {
        const normalizedName = this.alternativeNames[countryName] || countryName;
        return this.originCountries.includes(normalizedName) || 
               this.destinationCountries.includes(normalizedName);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CulturalSymbolsDB, SymbolDatabase, CountryMappings };
} else {
    // Make available globally for browser use
    window.CulturalSymbolsDB = CulturalSymbolsDB;
    window.SymbolDatabase = SymbolDatabase;
    window.CountryMappings = CountryMappings;
}