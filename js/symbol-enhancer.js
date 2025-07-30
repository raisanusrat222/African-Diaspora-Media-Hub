// js/symbol-enhancer.js - Enhanced Symbol Card Display

/**
 * Enhanced Symbol Card Generator
 * Creates rich, detailed symbol cards with improved content structure
 */
class SymbolEnhancer {
    constructor() {
        this.pronunciationData = this.initializePronunciationData();
        this.modernApplications = this.initializeModernApplications();
        this.relatedProverbs = this.initializeRelatedProverbs();
        this.symbolConnections = this.initializeSymbolConnections();
    }

    /**
     * Enhanced symbol card generation
     */
    createEnhancedSymbolCard(symbol) {
        const card = document.createElement('div');
        card.className = `symbol-card ${symbol.category || 'cultural'}`;
        card.setAttribute('data-category', symbol.category || 'cultural');
        card.setAttribute('onclick', `openSymbolModal('${symbol.name}')`);

        card.innerHTML = `
            <div class="symbol-icon" ${symbol.svgPattern ? 'has-svg' : ''}>
                ${symbol.svgPattern || `<i class="${symbol.icon || 'fas fa-star'}"></i>`}
            </div>
            
            <h3>${symbol.name}</h3>
            
            <div class="symbol-content">
                ${this.createTraditionalMeaningSection(symbol)}
                ${this.createPhilosophicalSignificanceSection(symbol)}
                ${this.createCulturalOriginSection(symbol)}
                ${this.createHistoricalContextSection(symbol)}
                ${this.createSacredUsageSection(symbol)}
                ${this.createDiasporaEvolutionSection(symbol)}
                ${this.createModernApplicationsSection(symbol)}
                ${this.createRelatedProverbsSection(symbol)}
                ${this.createVisualElementsSection(symbol)}
                ${this.createPronunciationSection(symbol)}
                ${this.createSymbolConnectionsSection(symbol)}
            </div>
        `;

        // Add event listeners for interactive elements
        this.addCardInteractivity(card);

        return card;
    }

    createTraditionalMeaningSection(symbol) {
        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-scroll"></i>
                    Traditional Meaning
                </div>
                <div class="symbol-section-content">
                    ${this.extractBasicMeaning(symbol)}
                </div>
            </div>
        `;
    }

    createPhilosophicalSignificanceSection(symbol) {
        const philosophical = this.generatePhilosophicalSignificance(symbol);
        if (!philosophical) return '';

        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-lightbulb"></i>
                    Philosophical Significance
                </div>
                <div class="symbol-section-content symbol-expandable" id="philosophical-${this.sanitizeId(symbol.name)}">
                    ${philosophical}
                </div>
                <button class="symbol-expand-btn" onclick="toggleExpansion('philosophical-${this.sanitizeId(symbol.name)}')">
                    <i class="fas fa-chevron-down"></i>
                    Read more
                </button>
            </div>
        `;
    }

    createCulturalOriginSection(symbol) {
        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-globe-africa"></i>
                    Cultural Origin
                </div>
                <div class="symbol-section-content">
                    Authentic ${symbol.symbolCategory || 'Adinkra'} symbol from ${symbol.country || 'Ghana'} - ${symbol.region || 'West Africa'}
                </div>
            </div>
        `;
    }

    createHistoricalContextSection(symbol) {
        const historical = this.generateHistoricalContext(symbol);
        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-history"></i>
                    Historical Context
                </div>
                <div class="symbol-section-content">
                    ${historical}
                </div>
            </div>
        `;
    }

    createSacredUsageSection(symbol) {
        const sacredUsage = this.generateSacredUsage(symbol);
        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-place-of-worship"></i>
                    Sacred Usage
                </div>
                <div class="symbol-section-content">
                    ${sacredUsage}
                </div>
            </div>
        `;
    }

    createDiasporaEvolutionSection(symbol) {
        if (!symbol.diasporaEvolution) return '';

        const evolutionHTML = Object.entries(symbol.diasporaEvolution).map(([country, description]) => `
            <div class="diaspora-country">
                <div class="diaspora-country-name">${country}:</div>
                <div class="diaspora-description">${description}</div>
            </div>
        `).join('');

        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-route"></i>
                    Diaspora Evolution
                </div>
                <div class="diaspora-evolution">
                    ${evolutionHTML}
                </div>
            </div>
        `;
    }

    createModernApplicationsSection(symbol) {
        const applications = this.modernApplications[symbol.name] || this.generateDefaultModernApplications(symbol);
        
        const applicationsHTML = applications.map(app => `
            <div class="application-item">
                <i class="application-icon ${app.icon}"></i>
                <span>${app.description}</span>
            </div>
        `).join('');

        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-building"></i>
                    Modern Applications
                </div>
                <div class="modern-applications">
                    ${applicationsHTML}
                </div>
            </div>
        `;
    }

    createRelatedProverbsSection(symbol) {
        const proverb = this.relatedProverbs[symbol.name];
        if (!proverb) return '';

        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-quote-left"></i>
                    Related Proverbs
                </div>
                <div class="proverb-container">
                    <div class="proverb-text">"${proverb.text}"</div>
                    <div class="proverb-translation">${proverb.translation}</div>
                </div>
            </div>
        `;
    }

    createVisualElementsSection(symbol) {
        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-eye"></i>
                    Visual Elements
                </div>
                <div class="symbol-section-content">
                    ${symbol.visualElements || this.generateDefaultVisualElements(symbol)}
                </div>
            </div>
        `;
    }

    createPronunciationSection(symbol) {
        const pronunciation = this.pronunciationData[symbol.name];
        if (!pronunciation) return '';

        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-volume-up"></i>
                    Pronunciation
                </div>
                <div class="pronunciation-guide">
                    <span class="pronunciation-text">[${pronunciation.phonetic}]</span>
                    <button class="pronunciation-btn" onclick="speakPronunciation('${symbol.name}')">
                        <i class="fas fa-play"></i> Listen
                    </button>
                </div>
            </div>
        `;
    }

    createSymbolConnectionsSection(symbol) {
        const connections = this.symbolConnections[symbol.name] || [];
        if (connections.length === 0) return '';

        const connectionsHTML = connections.map(connection => `
            <span class="connection-tag" onclick="searchSymbol('${connection}')">${connection}</span>
        `).join('');

        return `
            <div class="symbol-section">
                <div class="symbol-section-header ${symbol.category || 'cultural'}">
                    <i class="fas fa-project-diagram"></i>
                    Related Symbols
                </div>
                <div class="symbol-connections">
                    ${connectionsHTML}
                </div>
            </div>
        `;
    }

    // Helper methods for generating enhanced content
    extractBasicMeaning(symbol) {
        // Extract the core meaning before any additional context
        return symbol.meaning || symbol.description || 'Traditional cultural symbol with deep significance';
    }

    generatePhilosophicalSignificance(symbol) {
        const philosophical = {
            'Gye Nyame': '"Gye Nyame teaches us that after all human efforts, the final outcome rests with the Supreme Being. The symbol reminds us to maintain humility and faith while pursuing our goals, recognizing that divine providence guides our paths."',
            'Sankofa': '"Sankofa embodies the wisdom that progress requires understanding the past. The symbol teaches that we must learn from our ancestors\' experiences, both triumphs and mistakes, to build a better future for generations to come."',
            'Dwennimmen': '"Dwennimmen represents the paradox that true strength comes through humility. Like the ram that lowers its head before charging, this symbol teaches that power without wisdom and modesty leads to destruction."'
        };

        return philosophical[symbol.name] || this.generateGenericPhilosophical(symbol);
    }

    generateGenericPhilosophical(symbol) {
        const category = symbol.category || 'cultural';
        const templates = {
            'spiritual': `This symbol represents the deep spiritual connection between the physical and divine realms, teaching us about the importance of maintaining faith and spiritual awareness in daily life.`,
            'wisdom': `This symbol embodies the collective wisdom of generations, reminding us that true knowledge comes not just from learning, but from applying ancient teachings to contemporary challenges.`,
            'character': `This symbol represents the ideals of moral character and personal integrity that form the foundation of community life and social harmony.`,
            'cultural': `This symbol preserves important cultural values and social principles, serving as a guide for ethical behavior and community relationships.`
        };

        return templates[category] || templates['cultural'];
    }

    generateHistoricalContext(symbol) {
        const contexts = {
            'Gye Nyame': 'Created during the height of the Ashanti Empire (1670-1957), this symbol appeared on royal regalia and was reserved for the most sacred ceremonies honoring divine authority.',
            'Sankofa': 'Dating back to ancient Akan traditions, this symbol was traditionally carved on staff tops carried by linguists and appeared on ceremonial stools of chiefs.',
            'Dwennimmen': 'Historically used by Akan warriors and hunters, this symbol was painted on shields and weapons to invoke the protective power of humility and strategic thinking.'
        };

        return contexts[symbol.name] || `Originating in ${symbol.country || 'West Africa'}, this symbol has been part of cultural traditions for centuries, passing wisdom through generations of artisans and spiritual leaders.`;
    }

    generateSacredUsage(symbol) {
        const usages = {
            'Gye Nyame': 'Stamped on funeral cloths, carved into shrine walls, worn by priests during ceremonies, featured on palace architecture.',
            'Sankofa': 'Carved on ancestral stools, painted on library walls, worn during naming ceremonies, displayed in schools and educational institutions.',
            'Dwennimmen': 'Painted on military banners, carved on traditional hunting gear, featured in leadership installations, displayed in council chambers.'
        };

        return usages[symbol.name] || 'Featured in ceremonial contexts, traditional rituals, community gatherings, and spiritual practices throughout West African cultures.';
    }

    generateDefaultModernApplications(symbol) {
        return [
            { icon: 'fas fa-university', description: 'University logos and academic institutions' },
            { icon: 'fas fa-palette', description: 'Contemporary African art and design' },
            { icon: 'fas fa-tshirt', description: 'Fashion and textile designs' },
            { icon: 'fas fa-building', description: 'Architectural elements and decorations' }
        ];
    }

    generateDefaultVisualElements(symbol) {
        return `Traditional geometric design with symbolic elements representing ${symbol.category || 'cultural'} concepts and ancestral wisdom.`;
    }

    // Data initialization methods
    initializePronunciationData() {
        return {
            'Gye Nyame': { phonetic: 'GYEH NYAH-meh', audio: null },
            'Sankofa': { phonetic: 'san-KOH-fah', audio: null },
            'Dwennimmen': { phonetic: 'DWEN-nim-men', audio: null },
            'Sikafuturo Pattern': { phonetic: 'see-kah-foo-TOO-roh', audio: null }
        };
    }

    initializeModernApplications() {
        return {
            'Gye Nyame': [
                { icon: 'fas fa-money-bill', description: 'Featured on Ghana\'s 200 cedi banknote' },
                { icon: 'fas fa-university', description: 'University of Cape Coast official logo' },
                { icon: 'fas fa-church', description: 'Catholic University College emblem' },
                { icon: 'fas fa-palette', description: 'Contemporary African art installations' }
            ],
            'Sankofa': [
                { icon: 'fas fa-graduation-cap', description: 'Educational institution symbols' },
                { icon: 'fas fa-book', description: 'Library and learning center logos' },
                { icon: 'fas fa-monument', description: 'Historical preservation sites' },
                { icon: 'fas fa-users', description: 'Community cultural centers' }
            ]
        };
    }

    initializeRelatedProverbs() {
        return {
            'Gye Nyame': {
                text: 'Obi nkyere akwadaa Nyame',
                translation: 'Nobody teaches a child about God - meaning divine awareness is innate to all humanity'
            },
            'Sankofa': {
                text: 'Se wo were fi na wosane ba a, yenkyiri wo',
                translation: 'If you forget and then remember, we will not turn you away - emphasizing forgiveness and learning'
            },
            'Dwennimmen': {
                text: 'Odwennini ye tenten nanso obu ne ti ase',
                translation: 'The ram is long but it bows its head - true strength includes humility'
            }
        };
    }

    initializeSymbolConnections() {
        return {
            'Gye Nyame': ['Nyame Dua', 'Adwo', 'Osram Ne Nsoromma'],
            'Sankofa': ['Dwennimmen', 'Aya', 'Nkyinkyim'],
            'Dwennimmen': ['Sankofa', 'Akoko Nan', 'Osram Ne Nsoromma']
        };
    }

    // Interactive functionality
    addCardInteractivity(card) {
        // Add hover effects and micro-animations
        card.addEventListener('mouseenter', () => {
            this.animateCardHover(card, true);
        });

        card.addEventListener('mouseleave', () => {
            this.animateCardHover(card, false);
        });

        // Add scroll progress for long content
        const expandableSections = card.querySelectorAll('.symbol-expandable');
        expandableSections.forEach(section => {
            this.addScrollProgress(section);
        });
    }

    animateCardHover(card, isEntering) {
        const icon = card.querySelector('.symbol-icon');
        const sections = card.querySelectorAll('.symbol-section');

        if (isEntering) {
            if (typeof gsap !== 'undefined') {
                gsap.to(icon, { rotation: 5, scale: 1.05, duration: 0.3 });
                gsap.to(sections, { x: 2, stagger: 0.02, duration: 0.2 });
            }
        } else {
            if (typeof gsap !== 'undefined') {
                gsap.to(icon, { rotation: 0, scale: 1, duration: 0.3 });
                gsap.to(sections, { x: 0, stagger: 0.02, duration: 0.2 });
            }
        }
    }

    addScrollProgress(section) {
        // Add visual progress indicator for long content
        if (section.scrollHeight > section.clientHeight + 50) {
            const progress = document.createElement('div');
            progress.className = 'content-progress';
            progress.innerHTML = '<div class="progress-bar"></div>';
            section.parentNode.insertBefore(progress, section.nextSibling);
        }
    }

    sanitizeId(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
}

// Global functions for interactive elements
function toggleExpansion(sectionId) {
    const section = document.getElementById(sectionId);
    const button = section.nextElementSibling;
    
    if (section.classList.contains('expanded')) {
        section.classList.remove('expanded');
        button.innerHTML = '<i class="fas fa-chevron-down"></i> Read more';
    } else {
        section.classList.add('expanded');
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Read less';
    }
}

function speakPronunciation(symbolName) {
    // Use Web Speech API for pronunciation
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(symbolName);
        utterance.rate = 0.7;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    } else {
        console.log('Speech synthesis not supported');
    }
}

function searchSymbol(symbolName) {
    const searchInput = document.getElementById('symbol-search-input');
    if (searchInput) {
        searchInput.value = symbolName;
        searchInput.dispatchEvent(new Event('input'));
    }
}

// Initialize enhanced symbol display
window.SymbolEnhancer = SymbolEnhancer;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SymbolEnhancer;
}