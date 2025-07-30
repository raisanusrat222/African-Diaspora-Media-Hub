// js/artistic-techniques.js - Interactive Artistic Techniques Evolution

/**
 * Artistic Techniques Evolution Manager
 * Handles split-screen comparisons and interactive technique exploration
 */
class ArtisticTechniques {
    constructor() {
        this.currentTechnique = 'textiles';
        this.techniques = this.initializeTechniques();
        this.isInitialized = false;
        this.sliderPosition = 50; // Percentage position of divider
        this.isDragging = false;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
        
        this.isInitialized = true;
        console.log('🎨 Artistic Techniques Evolution initialized');
    }

    initializeTechniques() {
        return {
            textiles: {
                traditional: {
                    title: "Traditional Kente Weaving",
                    origin: "Ghana, West Africa",
                    description: "Traditional hand-woven cloth made from silk and cotton threads. Each pattern has specific symbolic meaning representing proverbs, historical events, or important figures in Akan culture.",
                    icon: "fas fa-cut",
                    pattern: this.generateKentePattern()
                },
                evolved: {
                    title: "African American Quilting",
                    destination: "United States, North America",
                    description: "Adapted textile tradition using available materials like cotton scraps. Maintained symbolic storytelling through geometric patterns, often encoding messages and preserving cultural memory.",
                    icon: "fas fa-cut",
                    pattern: this.generateQuiltPattern()
                },
                insights: {
                    materials: "From luxury silk to available cotton scraps, adaptation to local resources",
                    patterns: "Symbolic meanings preserved through geometric adaptations",
                    purpose: "From ceremonial regalia to practical bedding with hidden cultural messages",
                    impact: "Maintained community identity and storytelling traditions"
                }
            },
            sculpture: {
                traditional: {
                    title: "Benin Bronze Casting",
                    origin: "Nigeria, West Africa",
                    description: "Advanced lost-wax bronze casting technique creating detailed plaques and sculptures. Represented royal court life, historical events, and spiritual beliefs with incredible artistic precision.",
                    icon: "fas fa-hammer",
                    pattern: this.generateBronzePattern()
                },
                evolved: {
                    title: "Haitian Metal Sculpture",
                    destination: "Haiti, Caribbean",
                    description: "Transformed metal working tradition using recycled oil drums and local materials. Maintained spiritual and narrative themes while developing unique Caribbean aesthetic and techniques.",
                    icon: "fas fa-hammer",
                    pattern: this.generateMetalPattern()
                },
                insights: {
                    materials: "From royal bronze to recycled oil drums, resourceful material adaptation",
                    patterns: "Royal court imagery evolved into spiritual and folk narrative themes",
                    purpose: "From palace decoration to community art and spiritual expression",
                    impact: "Preserved metalworking skills and artistic storytelling traditions"
                }
            },
            pottery: {
                traditional: {
                    title: "Yoruba Terra Cotta",
                    origin: "Nigeria, West Africa",
                    description: "Traditional clay vessels and sculptural forms used for spiritual ceremonies, storage, and daily life. Featured intricate surface decorations and symbolic patterns representing spiritual concepts.",
                    icon: "fas fa-wine-glass-alt",
                    pattern: this.generatePotteryPattern()
                },
                evolved: {
                    title: "Brazilian Ceramic Art",
                    destination: "Brazil, South America",
                    description: "Adapted ceramic traditions blending African techniques with indigenous and Portuguese influences. Created unique decorative styles for both functional and artistic purposes.",
                    icon: "fas fa-wine-glass-alt",
                    pattern: this.generateCeramicPattern()
                },
                insights: {
                    materials: "From traditional clay to mixed ceramic techniques with local materials",
                    patterns: "Spiritual symbols adapted with indigenous and European decorative elements",
                    purpose: "From ceremonial vessels to artistic expression and cultural identity",
                    impact: "Influenced Brazilian ceramic arts and preserved African aesthetic principles"
                }
            },
            "body-art": {
                traditional: {
                    title: "Igbo Uli Body Painting",
                    origin: "Nigeria, West Africa",
                    description: "Traditional body art using natural dyes and pigments. Intricate patterns indicated social status, spiritual protection, and cultural identity through symbolic designs.",
                    icon: "fas fa-hand-sparkles",
                    pattern: this.generateUliPattern()
                },
                evolved: {
                    title: "Brazilian Candomblé Body Art",
                    destination: "Brazil, South America",
                    description: "Spiritual body painting traditions adapted for Candomblé religious ceremonies. Maintained protective and identity functions while incorporating new symbolic elements.",
                    icon: "fas fa-hand-sparkles",
                    pattern: this.generateCandomblePattern()
                },
                insights: {
                    materials: "From natural forest dyes to available pigments and modern materials",
                    patterns: "Traditional protective symbols adapted for new spiritual contexts",
                    purpose: "From social status marking to spiritual ceremony and cultural expression",
                    impact: "Preserved body art traditions in Afro-Brazilian spiritual practices"
                }
            },
            patterns: {
                traditional: {
                    title: "Adinkra Symbol Printing",
                    origin: "Ghana, West Africa",
                    description: "Traditional stamping technique using carved calabash stamps and tree bark dye. Each symbol conveyed specific meanings about wisdom, strength, and spiritual concepts.",
                    icon: "fas fa-th",
                    pattern: this.generateAdinkraPattern()
                },
                evolved: {
                    title: "Caribbean Carnival Designs",
                    destination: "Trinidad & Tobago, Caribbean",
                    description: "Adapted symbolic pattern traditions for carnival costumes and decorations. Maintained cultural storytelling while creating vibrant, celebratory artistic expressions.",
                    icon: "fas fa-th",
                    pattern: this.generateCarnivalPattern()
                },
                insights: {
                    materials: "From calabash stamps and bark dye to modern printing and synthetic materials",
                    patterns: "Sacred symbols adapted for celebration and cultural performance",
                    purpose: "From spiritual communication to community celebration and cultural pride",
                    impact: "Preserved symbolic traditions in Caribbean festival and cultural arts"
                }
            }
        };
    }

    setupEventListeners() {
        // Technique selector buttons
        const techniqueButtons = document.querySelectorAll('.technique-btn');
        techniqueButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const technique = e.currentTarget.dataset.technique;
                this.switchTechnique(technique);
                
                // Update active state
                techniqueButtons.forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Split-screen slider interaction
        this.setupSliderInteraction();

        // Initialize with default technique
        this.switchTechnique(this.currentTechnique);

        console.log('🎛️ Event listeners setup complete');
    }

    setupSliderInteraction() {
        const slider = document.getElementById('comparison-slider');
        const wrapper = document.querySelector('.split-screen-wrapper');
        
        if (!slider || !wrapper) return;

        // Mouse events
        slider.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startDrag(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDrag(e, wrapper);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Touch events for mobile
        slider.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startDrag(e.touches[0]);
        });

        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleDrag(e.touches[0], wrapper);
            }
        });

        document.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }

    startDrag(event) {
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ew-resize';
    }

    handleDrag(event, wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = Math.max(20, Math.min(80, (x / rect.width) * 100));
        
        this.sliderPosition = percentage;
        this.updateSplitPosition(percentage);
    }

    updateSplitPosition(percentage) {
        const wrapper = document.querySelector('.split-screen-wrapper');
        if (!wrapper) return;

        // Update grid template columns
        wrapper.style.gridTemplateColumns = `${percentage}% auto ${100 - percentage}%`;
        
        // Add visual feedback
        const divider = document.querySelector('.comparison-divider');
        if (divider) {
            divider.style.background = `linear-gradient(135deg, 
                rgba(212, 175, 55, ${0.8 + (percentage - 50) * 0.004}), 
                rgba(34, 139, 34, ${0.8 - (percentage - 50) * 0.004}))`;
        }
    }

    switchTechnique(techniqueKey) {
        if (!this.techniques[techniqueKey]) {
            console.warn(`Unknown technique: ${techniqueKey}`);
            return;
        }

        this.currentTechnique = techniqueKey;
        const technique = this.techniques[techniqueKey];

        // Update traditional side
        this.updateTechniqueSide('traditional', technique.traditional);
        
        // Update evolved side
        this.updateTechniqueSide('evolved', technique.evolved);
        
        // Update insights
        this.updateInsights(technique.insights);

        // Animate transition
        this.animateTechniqueTransition();

        console.log(`🔄 Switched to ${techniqueKey} technique`);
    }

    updateTechniqueSide(side, data) {
        const prefix = side === 'traditional' ? 'traditional' : 'evolved';
        
        // Update title
        const titleElement = document.getElementById(`${prefix}-technique-title`);
        if (titleElement) titleElement.textContent = data.title;
        
        // Update origin/destination
        const locationElement = document.getElementById(`${prefix}-technique-${side === 'traditional' ? 'origin' : 'destination'}`);
        if (locationElement) locationElement.textContent = data[side === 'traditional' ? 'origin' : 'destination'];
        
        // Update description
        const descElement = document.getElementById(`${prefix}-technique-desc`);
        if (descElement) descElement.querySelector('p').textContent = data.description;
        
        // Update icon
        const iconElement = document.querySelector(`${side === 'traditional' ? '.traditional-side' : '.evolved-side'} .technique-icon i`);
        if (iconElement) {
            iconElement.className = data.icon;
        }
        
        // Update pattern
        const patternElement = document.getElementById(`${prefix}-technique-pattern`);
        if (patternElement) {
            patternElement.innerHTML = data.pattern;
        }
    }

    updateInsights(insights) {
        const insightElements = {
            materials: document.getElementById('materials-evolution'),
            patterns: document.getElementById('patterns-evolution'),
            purpose: document.getElementById('purpose-evolution'),
            impact: document.getElementById('impact-evolution')
        };

        Object.keys(insights).forEach(key => {
            if (insightElements[key]) {
                insightElements[key].textContent = insights[key];
            }
        });
    }

    animateTechniqueTransition() {
        if (typeof gsap === 'undefined') return;

        const elements = document.querySelectorAll('.technique-visual, .technique-description, .insight-item');
        
        gsap.fromTo(elements, 
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                stagger: 0.1,
                ease: "power2.out" 
            }
        );
    }

    // SVG Pattern Generators
    generateKentePattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="kente" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#FFD700"/>
                    <rect width="10" height="10" fill="#8B0000"/>
                    <rect x="10" y="10" width="10" height="10" fill="#8B0000"/>
                    <rect x="5" y="5" width="10" height="10" fill="#228B22"/>
                </pattern>
            </defs>
            <rect width="200" height="150" fill="url(#kente)"/>
            <g stroke="#333" stroke-width="1" fill="none">
                <line x1="0" y1="30" x2="200" y2="30"/>
                <line x1="0" y1="60" x2="200" y2="60"/>
                <line x1="0" y1="90" x2="200" y2="90"/>
                <line x1="0" y1="120" x2="200" y2="120"/>
            </g>
        </svg>`;
    }

    generateQuiltPattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <g>
                <rect x="0" y="0" width="50" height="50" fill="#4169E1"/>
                <rect x="50" y="0" width="50" height="50" fill="#FFE4B5"/>
                <rect x="100" y="0" width="50" height="50" fill="#8B0000"/>
                <rect x="150" y="0" width="50" height="50" fill="#228B22"/>
                <rect x="0" y="50" width="50" height="50" fill="#FFE4B5"/>
                <rect x="50" y="50" width="50" height="50" fill="#8B0000"/>
                <rect x="100" y="50" width="50" height="50" fill="#228B22"/>
                <rect x="150" y="50" width="50" height="50" fill="#4169E1"/>
                <rect x="0" y="100" width="50" height="50" fill="#8B0000"/>
                <rect x="50" y="100" width="50" height="50" fill="#228B22"/>
                <rect x="100" y="100" width="50" height="50" fill="#4169E1"/>
                <rect x="150" y="100" width="50" height="50" fill="#FFE4B5"/>
            </g>
            <g stroke="#333" stroke-width="2" fill="none">
                <path d="M25,25 L75,75 M75,25 L25,75"/>
                <path d="M125,25 L175,75 M175,25 L125,75"/>
                <path d="M25,125 L75,75 M75,125 L25,75"/>
                <path d="M125,125 L175,75 M175,125 L125,75"/>
            </g>
        </svg>`;
    }

    generateBronzePattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#CD7F32;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#B87333;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="200" height="150" fill="url(#bronze)"/>
            <g fill="#654321" stroke="#8B4513" stroke-width="1">
                <circle cx="50" cy="40" r="15"/>
                <rect x="35" y="60" width="30" height="40" rx="5"/>
                <circle cx="150" cy="40" r="15"/>
                <rect x="135" y="60" width="30" height="40" rx="5"/>
                <polygon points="100,30 110,50 90,50"/>
                <rect x="90" y="50" width="20" height="30"/>
                <rect x="80" y="80" width="40" height="15"/>
                <circle cx="60" cy="120" r="8"/>
                <circle cx="100" cy="120" r="8"/>
                <circle cx="140" cy="120" r="8"/>
            </g>
        </svg>`;
    }

    generateMetalPattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#C0C0C0;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#A9A9A9;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#808080;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="200" height="150" fill="url(#metal)"/>
            <g fill="#4169E1" stroke="#000080" stroke-width="2">
                <path d="M50,30 Q70,10 90,30 Q110,50 90,70 Q70,90 50,70 Q30,50 50,30"/>
                <circle cx="150" cy="50" r="20"/>
                <path d="M130,80 L170,80 L160,100 L140,100 Z"/>
                <path d="M80,110 Q100,90 120,110 Q140,130 120,130 Q100,130 80,110"/>
                <rect x="20" y="110" width="40" height="25" rx="5"/>
                <polygon points="100,20 105,10 110,20 115,15 120,25 110,30 90,30"/>
            </g>
        </svg>`;
    }

    generatePotteryPattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="clay" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" style="stop-color:#DEB887;stop-opacity:1" />
                    <stop offset="70%" style="stop-color:#D2691E;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
                </radialGradient>
            </defs>
            <ellipse cx="100" cy="140" rx="80" ry="20" fill="#8B4513"/>
            <path d="M40,140 Q40,100 50,80 Q60,40 80,30 Q100,20 120,30 Q140,40 150,80 Q160,100 160,140" 
                  fill="url(#clay)" stroke="#654321" stroke-width="2"/>
            <g stroke="#8B4513" stroke-width="1.5" fill="none">
                <path d="M60,60 Q80,55 100,60 Q120,55 140,60"/>
                <path d="M65,80 Q85,75 100,80 Q115,75 135,80"/>
                <path d="M70,100 Q90,95 100,100 Q110,95 130,100"/>
                <circle cx="80" cy="70" r="3" fill="#654321"/>
                <circle cx="120" cy="70" r="3" fill="#654321"/>
                <circle cx="100" cy="90" r="4" fill="#654321"/>
            </g>
        </svg>`;
    }

    generateCeramicPattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ceramic" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#F5F5DC;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#DEB887;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#CD853F;stop-opacity:1" />
                </linearGradient>
            </defs>
            <ellipse cx="100" cy="140" rx="70" ry="15" fill="#A0522D"/>
            <path d="M50,140 Q50,110 55,90 Q65,50 85,35 Q100,25 115,35 Q135,50 145,90 Q150,110 150,140" 
                  fill="url(#ceramic)" stroke="#8B4513" stroke-width="1.5"/>
            <g stroke="#4169E1" stroke-width="2" fill="#4169E1">
                <path d="M70,50 Q85,45 100,50 Q115,45 130,50" fill="none"/>
                <path d="M75,70 Q90,65 100,70 Q110,65 125,70" fill="none"/>
                <circle cx="85" cy="60" r="2"/>
                <circle cx="100" cy="55" r="2"/>
                <circle cx="115" cy="60" r="2"/>
                <path d="M80,85 L85,95 L90,85 L95,95 L100,85 L105,95 L110,85 L115,95 L120,85" 
                      fill="none" stroke="#228B22"/>
            </g>
        </svg>`;
    }

    generateUliPattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="150" fill="#F5DEB3"/>
            <g stroke="#8B4513" stroke-width="3" fill="none">
                <path d="M30,30 Q50,20 70,30 Q90,40 110,30 Q130,20 150,30 Q170,40 190,30"/>
                <path d="M30,60 Q50,50 70,60 Q90,70 110,60 Q130,50 150,60 Q170,70 190,60"/>
                <path d="M30,90 Q50,80 70,90 Q90,100 110,90 Q130,80 150,90 Q170,100 190,90"/>
                <path d="M30,120 Q50,110 70,120 Q90,130 110,120 Q130,110 150,120 Q170,130 190,120"/>
            </g>
            <g fill="#654321">
                <circle cx="60" cy="45" r="4"/>
                <circle cx="100" cy="45" r="4"/>
                <circle cx="140" cy="45" r="4"/>
                <circle cx="60" cy="105" r="4"/>
                <circle cx="100" cy="105" r="4"/>
                <circle cx="140" cy="105" r="4"/>
                <polygon points="80,75 85,65 90,75 85,85"/>
                <polygon points="120,75 125,65 130,75 125,85"/>
            </g>
        </svg>`;
    }

    generateCandomblePattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="150" fill="#2F4F4F"/>
            <g stroke="#FFD700" stroke-width="2" fill="none">
                <path d="M40,40 Q60,30 80,40 Q100,50 120,40 Q140,30 160,40"/>
                <path d="M40,70 Q60,60 80,70 Q100,80 120,70 Q140,60 160,70"/>
                <path d="M40,100 Q60,90 80,100 Q100,110 120,100 Q140,90 160,100"/>
            </g>
            <g fill="#FF6347">
                <circle cx="70" cy="55" r="5"/>
                <circle cx="130" cy="55" r="5"/>
                <circle cx="100" cy="85" r="6"/>
            </g>
            <g stroke="#32CD32" stroke-width="2" fill="#32CD32">
                <path d="M50,25 L55,35 L60,25 L55,15 Z"/>
                <path d="M100,25 L105,35 L110,25 L105,15 Z"/>
                <path d="M150,25 L155,35 L160,25 L155,15 Z"/>
                <path d="M75,125 L80,135 L85,125 L80,115 Z"/>
                <path d="M125,125 L130,135 L135,125 L130,115 Z"/>
            </g>
        </svg>`;
    }

    generateAdinkraPattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="150" fill="#F5F5DC"/>
            <g stroke="#8B4513" stroke-width="3" fill="none">
                <!-- Gye Nyame symbols -->
                <circle cx="50" cy="40" r="15"/>
                <path d="M42,32 L58,48 M58,32 L42,48"/>
                <circle cx="50" cy="40" r="8"/>
                
                <circle cx="150" cy="40" r="15"/>
                <path d="M142,32 L158,48 M158,32 L142,48"/>
                <circle cx="150" cy="40" r="8"/>
                
                <!-- Sankofa symbols -->
                <path d="M80,80 Q60,60 40,80 Q60,100 80,80"/>
                <circle cx="45" cy="85" r="5" fill="#8B4513"/>
                
                <path d="M120,80 Q160,60 160,80 Q140,100 120,80"/>
                <circle cx="155" cy="85" r="5" fill="#8B4513"/>
                
                <!-- Dwennimmen -->
                <path d="M70,120 Q70,100 85,95 Q100,100 100,120"/>
                <path d="M100,120 Q100,100 115,95 Q130,100 130,120"/>
            </g>
            <g fill="#654321">
                <circle cx="50" cy="40" r="3"/>
                <circle cx="150" cy="40" r="3"/>
            </g>
        </svg>`;
    }

    generateCarnivalPattern() {
        return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="carnival" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FF1493;stop-opacity:1" />
                    <stop offset="25%" style="stop-color:#FFD700;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#32CD32;stop-opacity:1" />
                    <stop offset="75%" style="stop-color:#1E90FF;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#9932CC;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="200" height="150" fill="url(#carnival)"/>
            <g stroke="#FFF" stroke-width="3" fill="none">
                <path d="M20,30 Q40,10 60,30 Q80,50 100,30 Q120,10 140,30 Q160,50 180,30"/>
                <path d="M20,60 Q40,40 60,60 Q80,80 100,60 Q120,40 140,60 Q160,80 180,60"/>
                <path d="M20,90 Q40,70 60,90 Q80,110 100,90 Q120,70 140,90 Q160,110 180,90"/>
                <path d="M20,120 Q40,100 60,120 Q80,140 100,120 Q120,100 140,120 Q160,140 180,120"/>
            </g>
            <g fill="#FFF">
                <star cx="50" cy="45" r1="8" r2="4"/>
                <star cx="100" cy="75" r1="10" r2="5"/>
                <star cx="150" cy="45" r1="8" r2="4"/>
                <circle cx="75" cy="105" r="6"/>
                <circle cx="125" cy="105" r="6"/>
            </g>
            <!-- Stars -->
            <g fill="#FFF">
                <polygon points="50,37 52,43 58,43 53,47 55,53 50,49 45,53 47,47 42,43 48,43"/>
                <polygon points="100,67 102,73 108,73 103,77 105,83 100,79 95,83 97,77 92,73 98,73"/>
                <polygon points="150,37 152,43 158,43 153,47 155,53 150,49 145,53 147,47 142,43 148,43"/>
            </g>
        </svg>`;
    }

    // Public methods for external control
    getCurrentTechnique() {
        return this.currentTechnique;
    }

    resetSlider() {
        this.sliderPosition = 50;
        this.updateSplitPosition(50);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }

    // Enhanced with AI integration
    async enhanceTechniqueWithAI(techniqueKey) {
        if (!window.DiasporaAI || typeof window.DiasporaAI.callOpenAI !== 'function') {
            console.log('AI enhancement not available');
            return;
        }

        const technique = this.techniques[techniqueKey];
        if (!technique) return;

        try {
            const prompt = `Enhance this artistic technique evolution analysis:

Traditional: ${technique.traditional.title} from ${technique.traditional.origin}
Evolved: ${technique.evolved.title} in ${technique.evolved.destination}

Provide additional insights about:
1. Specific historical factors that influenced the evolution
2. Notable artists or communities who preserved these traditions
3. Modern applications and contemporary relevance
4. Cultural significance and identity preservation

Keep response concise and educational.`;

            const enhancement = await window.DiasporaAI.callOpenAI(prompt, 250, 0.7);
            
            // Display enhancement in a dedicated area
            this.displayAIEnhancement(enhancement);
            
        } catch (error) {
            console.error('Error enhancing technique with AI:', error);
        }
    }

    displayAIEnhancement(enhancement) {
        // Add AI enhancement display area if it doesn't exist
        let enhancementArea = document.getElementById('ai-technique-enhancement');
        
        if (!enhancementArea) {
            enhancementArea = document.createElement('div');
            enhancementArea.id = 'ai-technique-enhancement';
            enhancementArea.className = 'ai-enhancement-panel';
            enhancementArea.innerHTML = `
                <div class="ai-enhancement-header">
                    <i class="fas fa-robot"></i>
                    <h5>AI Enhanced Insights</h5>
                    <button class="close-enhancement" onclick="this.parentElement.parentElement.style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ai-enhancement-content"></div>
            `;
            
            const detailsSection = document.querySelector('.technique-details');
            if (detailsSection) {
                detailsSection.appendChild(enhancementArea);
            }
        }

        const contentArea = enhancementArea.querySelector('.ai-enhancement-content');
        if (contentArea) {
            contentArea.innerHTML = `<p>${enhancement.replace(/\n/g, '</p><p>')}</p>`;
        }

        enhancementArea.style.display = 'block';

        // Animate appearance
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(enhancementArea, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    }
}

// Initialize when DOM is ready
let artisticTechniques;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        artisticTechniques = new ArtisticTechniques();
    });
} else {
    artisticTechniques = new ArtisticTechniques();
}

// Global functions for HTML onclick handlers
function enhanceCurrentTechnique() {
    if (artisticTechniques) {
        artisticTechniques.enhanceTechniqueWithAI(artisticTechniques.getCurrentTechnique());
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtisticTechniques;
} else {
    window.ArtisticTechniques = ArtisticTechniques;
}