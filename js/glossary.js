class GlossaryApp {
    constructor() {
        this.terms = [];
        this.filteredTerms = [];
        this.currentView = 'cards';
        this.currentFilter = { category: 'all', origin: 'all', letter: 'all' };
        this.currentSort = 'alphabetical';
        this.favorites = this.loadFavorites();
        this.studyProgress = this.loadStudyProgress();
        this.flashcardDeck = [];
        this.currentFlashcard = 0;
        this.aiEnhanced = {};
        this.speechSynthesis = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        
        this.initializeApp();
    }

    async initializeApp() {
        this.setupEventListeners();
        this.initializeVoiceRecognition();
        await this.loadTermsData();
        this.renderTerms();
        this.updateFavoritesCount();
        
        // Wait for AI to initialize
        setTimeout(() => {
            this.checkAIAvailability();
        }, 2000);
    }

    // ===== DATA LOADING =====
    async loadTermsData() {
        this.terms = [
            {
                id: 'diaspora',
                name: 'Diaspora',
                pronunciation: '/daɪˈæspərə/',
                definition: 'The dispersion of people from their original homeland to other parts of the world, maintaining cultural connections to their place of origin.',
                category: 'cultural',
                origin: 'west-africa',
                etymology: 'From Greek "diaspora" meaning "to scatter about"',
                usageExample: 'The African diaspora has created vibrant communities across six continents.',
                relatedTerms: ['migration', 'displacement', 'transnationalism'],
                difficulty: 'intermediate',
                popularity: 95
            },
            {
                id: 'griot',
                name: 'Griot',
                pronunciation: '/ˈɡriːoʊ/',
                definition: 'Traditional West African storytellers, musicians, and historians who preserve oral traditions and genealogies through performance.',
                category: 'cultural',
                origin: 'west-africa',
                etymology: 'From French "griot," possibly derived from Portuguese "criado"',
                usageExample: 'The griot captivated the audience with ancient tales of kings and heroes.',
                relatedTerms: ['oral tradition', 'praise singer', 'djeli'],
                difficulty: 'beginner',
                popularity: 78
            },
            {
                id: 'ubuntu',
                name: 'Ubuntu',
                pronunciation: '/ʊˈbʊntuː/',
                definition: 'Southern African philosophy emphasizing interconnectedness and shared humanity: "I am because we are."',
                category: 'spiritual',
                origin: 'southern-africa',
                etymology: 'From Nguni languages, literally meaning "humanity"',
                usageExample: 'Ubuntu teaches us that individual well-being is connected to collective well-being.',
                relatedTerms: ['humanism', 'community', 'interconnectedness'],
                difficulty: 'intermediate',
                popularity: 86
            },
            {
                id: 'sankofa',
                name: 'Sankofa',
                pronunciation: '/sænˈkoʊfɑː/',
                definition: 'Akan concept meaning "to retrieve" or "go back and get it," symbolizing learning from the past.',
                category: 'cultural',
                origin: 'west-africa',
                etymology: 'From Akan "san" (return) + "ko" (go) + "fa" (look, seek, take)',
                usageExample: 'The sankofa bird reminds us to honor our ancestors while moving forward.',
                relatedTerms: ['wisdom', 'ancestors', 'adinkra'],
                difficulty: 'beginner',
                popularity: 72
            },
            {
                id: 'maroon',
                name: 'Maroon',
                pronunciation: '/məˈruːn/',
                definition: 'Descendants of escaped enslaved Africans who formed independent communities in the Americas.',
                category: 'historical',
                origin: 'caribbean',
                etymology: 'From Spanish "cimarrón" meaning "wild" or "untamed"',
                usageExample: 'Maroon communities preserved African traditions and fought for freedom.',
                relatedTerms: ['resistance', 'quilombo', 'palenque'],
                difficulty: 'advanced',
                popularity: 64
            },
            {
                id: 'creole',
                name: 'Creole',
                pronunciation: '/ˈkriːoʊl/',
                definition: 'Languages, cultures, or peoples that emerged from contact between different groups, especially in colonial contexts.',
                category: 'linguistic',
                origin: 'caribbean',
                etymology: 'From Spanish/Portuguese "criollo" meaning "native to the place"',
                usageExample: 'Haitian Creole blends French vocabulary with African grammatical structures.',
                relatedTerms: ['pidgin', 'patois', 'vernacular'],
                difficulty: 'intermediate',
                popularity: 81
            },
            {
                id: 'spirituals',
                name: 'Spirituals',
                pronunciation: '/ˈspɪrɪtʃuəlz/',
                definition: 'Religious folk songs created by enslaved African Americans, often containing coded messages about freedom.',
                category: 'musical',
                origin: 'north-america',
                etymology: 'From "spiritual songs" referring to religious music',
                usageExample: 'Spirituals like "Swing Low, Sweet Chariot" carried hidden meanings about the Underground Railroad.',
                relatedTerms: ['gospel', 'work songs', 'call and response'],
                difficulty: 'beginner',
                popularity: 88
            },
            {
                id: 'anansi',
                name: 'Anansi',
                pronunciation: '/əˈnænsi/',
                definition: 'West African trickster spider figure whose stories spread throughout the diaspora, teaching wisdom through cunning.',
                category: 'cultural',
                origin: 'west-africa',
                etymology: 'From Akan "kwaku anansi" meaning "spider"',
                usageExample: 'Anansi stories traveled from Ghana to Jamaica, preserving African wisdom traditions.',
                relatedTerms: ['trickster', 'folklore', 'oral tradition'],
                difficulty: 'beginner',
                popularity: 75
            }
        ];

        this.filteredTerms = [...this.terms];
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('glossary-search-input');
        const searchBtn = document.getElementById('glossary-search-btn');
        const voiceBtn = document.getElementById('voice-search-btn');

        searchInput?.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        searchBtn?.addEventListener('click', () => this.handleSearch());
        voiceBtn?.addEventListener('click', () => this.toggleVoiceSearch());

        // Filters
        document.getElementById('category-filter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('origin-filter')?.addEventListener('change', this.handleFilterChange.bind(this));
        document.getElementById('sort-select')?.addEventListener('change', this.handleSortChange.bind(this));

        // View toggles
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.changeView(btn.dataset.view));
        });

        // Alphabet navigation
        document.querySelectorAll('.letter-btn').forEach(btn => {
            btn.addEventListener('click', () => this.filterByLetter(btn.dataset.letter));
        });

        // Learning tools
        document.getElementById('flashcard-mode-btn')?.addEventListener('click', () => this.startFlashcardMode());
        document.getElementById('quiz-mode-btn')?.addEventListener('click', () => this.startQuizMode());
        document.getElementById('favorites-btn')?.addEventListener('click', () => this.showFavorites());
        document.getElementById('progress-btn')?.addEventListener('click', () => this.showProgress());

        // AI panel
        document.getElementById('close-ai-panel')?.addEventListener('click', () => this.closeAIPanel());

        // Flashcard modal
        document.getElementById('prev-card')?.addEventListener('click', () => this.previousFlashcard());
        document.getElementById('next-card')?.addEventListener('click', () => this.nextFlashcard());
        document.getElementById('flashcard-pronunciation')?.addEventListener('click', () => this.playFlashcardPronunciation());
    }

    // ===== SEARCH FUNCTIONALITY =====
    async handleSearch() {
        const query = document.getElementById('glossary-search-input')?.value.toLowerCase().trim();
        
        if (!query) {
            this.filteredTerms = [...this.terms];
            this.renderTerms();
            return;
        }

        // Basic search
        this.filteredTerms = this.terms.filter(term => 
            term.name.toLowerCase().includes(query) ||
            term.definition.toLowerCase().includes(query) ||
            term.category.toLowerCase().includes(query) ||
            term.relatedTerms.some(related => related.toLowerCase().includes(query))
        );

        // Get AI suggestions if available
        if (window.DiasporaAI && window.DiasporaAI.isInitialized) {
            try {
                const suggestions = await this.getAISearchSuggestions(query);
                this.displaySearchSuggestions(suggestions);
            } catch (error) {
                console.log('AI search suggestions unavailable:', error);
            }
        }

        this.renderTerms();
    }

    async getAISearchSuggestions(query) {
        const prompt = `For someone searching "${query}" in an African diaspora glossary, suggest 5 related terms they might want to explore. Focus on cultural, historical, or linguistic connections. Return only the terms, separated by commas.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 100, 0.5);
            return response.split(',').map(s => s.trim()).filter(s => s.length > 0);
        } catch (error) {
            return this.getDefaultSuggestions(query);
        }
    }

    getDefaultSuggestions(query) {
        const suggestionMap = {
            'culture': ['tradition', 'heritage', 'identity', 'community'],
            'music': ['spirituals', 'drumming', 'dance', 'rhythm'],
            'history': ['slavery', 'resistance', 'migration', 'freedom'],
            'language': ['creole', 'pidgin', 'oral tradition', 'storytelling'],
            'africa': ['homeland', 'ancestors', 'motherland', 'roots'],
            'identity': ['belonging', 'culture', 'heritage', 'self']
        };

        const key = Object.keys(suggestionMap).find(k => query.includes(k));
        return key ? suggestionMap[key] : ['diaspora', 'culture', 'heritage', 'identity'];
    }

    displaySearchSuggestions(suggestions) {
        const container = document.getElementById('search-suggestions');
        if (!container) return;

        if (suggestions.length === 0) {
            container.classList.remove('show');
            return;
        }

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="glossaryApp.searchForTerm('${suggestion}')">
                <i class="fas fa-search"></i>
                <span>${suggestion}</span>
            </div>
        `).join('');

        container.classList.add('show');
    }

    searchForTerm(term) {
        document.getElementById('glossary-search-input').value = term;
        document.getElementById('search-suggestions').classList.remove('show');
        this.handleSearch();
    }

    // ===== VOICE SEARCH =====
    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('glossary-search-input').value = transcript;
                this.handleSearch();
                this.stopVoiceSearch();
            };

            this.recognition.onerror = () => {
                this.stopVoiceSearch();
            };

            this.recognition.onend = () => {
                this.stopVoiceSearch();
            };
        }
    }

    toggleVoiceSearch() {
        if (!this.recognition) {
            alert('Voice search is not supported in your browser.');
            return;
        }

        if (this.isListening) {
            this.stopVoiceSearch();
        } else {
            this.startVoiceSearch();
        }
    }

    startVoiceSearch() {
        this.isListening = true;
        const voiceBtn = document.getElementById('voice-search-btn');
        voiceBtn?.classList.add('listening');
        this.recognition.start();
    }

    stopVoiceSearch() {
        this.isListening = false;
        const voiceBtn = document.getElementById('voice-search-btn');
        voiceBtn?.classList.remove('listening');
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    // ===== FILTERING & SORTING =====
    handleFilterChange() {
        this.currentFilter.category = document.getElementById('category-filter')?.value || 'all';
        this.currentFilter.origin = document.getElementById('origin-filter')?.value || 'all';
        this.applyFilters();
    }

    handleSortChange() {
        this.currentSort = document.getElementById('sort-select')?.value || 'alphabetical';
        this.applySort();
        this.renderTerms();
    }

    filterByLetter(letter) {
        this.currentFilter.letter = letter;
        
        // Update active button
        document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-letter="${letter}"]`)?.classList.add('active');
        
        this.applyFilters();
    }

    applyFilters() {
        this.filteredTerms = this.terms.filter(term => {
            const categoryMatch = this.currentFilter.category === 'all' || term.category === this.currentFilter.category;
            const originMatch = this.currentFilter.origin === 'all' || term.origin === this.currentFilter.origin;
            const letterMatch = this.currentFilter.letter === 'all' || term.name.charAt(0).toLowerCase() === this.currentFilter.letter.toLowerCase();
            
            return categoryMatch && originMatch && letterMatch;
        });

        this.applySort();
        this.renderTerms();
    }

    applySort() {
        switch (this.currentSort) {
            case 'alphabetical':
                this.filteredTerms.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'popularity':
                this.filteredTerms.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'recent':
                this.filteredTerms.reverse();
                break;
            case 'difficulty':
                const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
                this.filteredTerms.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
                break;
        }
    }

    // ===== VIEW MANAGEMENT =====
    changeView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
        
        this.renderTerms();
    }

    // ===== RENDERING =====
    renderTerms() {
        const container = document.getElementById('terms-container');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        
        if (!container) return;

        // Update results info
        if (resultsTitle) {
            if (this.currentFilter.letter !== 'all') {
                resultsTitle.textContent = `Terms starting with "${this.currentFilter.letter.toUpperCase()}"`;
            } else if (this.currentFilter.category !== 'all') {
                resultsTitle.textContent = `${this.currentFilter.category.charAt(0).toUpperCase() + this.currentFilter.category.slice(1)} Terms`;
            } else {
                resultsTitle.textContent = 'All Terms';
            }
        }

        if (resultsCount) {
            resultsCount.textContent = `${this.filteredTerms.length} terms found`;
        }

        // Clear existing content
        container.innerHTML = '';
        
        // Update container class
        container.className = `terms-container ${this.currentView}-view`;

        if (this.filteredTerms.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No terms found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        if (this.currentView === 'alphabet') {
            this.renderAlphabetView();
        } else {
            this.renderCardView();
        }
    }

    renderCardView() {
        const container = document.getElementById('terms-container');
        
        container.innerHTML = this.filteredTerms.map(term => {
            const isFavorite = this.favorites.includes(term.id);
            const isDynamic = term.isDynamic ? 'dynamic' : '';
            return `
                <div class="term-card ${term.category} ${isDynamic} ${this.currentView === 'list' ? 'list-view' : ''}" data-term-id="${term.id}">
                    <div class="term-header">
                        <div class="term-title-group">
                            <h3 class="term-name">${term.name}</h3>
                            <div class="term-pronunciation">${term.pronunciation}</div>
                            <div class="term-meta">
                                <span class="term-category">${term.category}</span>
                                <span class="term-origin">${term.origin.replace('-', ' ')}</span>
                            </div>
                        </div>
                        <div class="term-actions">
                            <button class="action-btn pronunciation-btn" onclick="glossaryApp.playPronunciation('${term.name}', '${term.pronunciation}')" title="Play pronunciation">
                                <i class="fas fa-volume-up"></i>
                            </button>
                            <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" onclick="glossaryApp.toggleFavorite('${term.id}')" title="Add to favorites">
                                <i class="fas fa-star"></i>
                            </button>
                            <button class="action-btn ai-enhance-btn" onclick="glossaryApp.enhanceWithAI('${term.id}')" title="AI Enhancement">
                                <i class="fas fa-robot"></i>
                            </button>
                        </div>
                    </div>
                    <div class="term-content">
                        <div class="term-definition">${term.definition}</div>
                        ${term.etymology ? `<div class="term-etymology"><strong>Etymology:</strong> ${term.etymology}</div>` : ''}
                        ${term.usageExample ? `<div class="term-usage-example">"${term.usageExample}"</div>` : ''}
                        ${term.relatedTerms && term.relatedTerms.length > 0 ? `
                            <div class="related-terms">
                                <h4>Related Terms:</h4>
                                <div class="related-links">
                                    ${term.relatedTerms.map(related => `
                                        <a href="#" class="related-link" onclick="glossaryApp.searchForTerm('${related}')">${related}</a>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAlphabetView() {
        const container = document.getElementById('terms-container');
        const groupedTerms = this.groupTermsByLetter();
        
        container.innerHTML = Object.keys(groupedTerms)
            .sort()
            .map(letter => `
                <div class="alphabet-section">
                    <div class="alphabet-letter-header">${letter.toUpperCase()}</div>
                    <div class="alphabet-terms">
                        ${groupedTerms[letter].map(term => {
                            const isFavorite = this.favorites.includes(term.id);
                            const isDynamic = term.isDynamic ? 'dynamic' : '';
                            return `
                                <div class="term-card ${term.category} ${isDynamic}" data-term-id="${term.id}">
                                    <div class="term-header">
                                        <div class="term-title-group">
                                            <h3 class="term-name">${term.name}</h3>
                                            <div class="term-pronunciation">${term.pronunciation}</div>
                                        </div>
                                        <div class="term-actions">
                                            <button class="action-btn pronunciation-btn" onclick="glossaryApp.playPronunciation('${term.name}', '${term.pronunciation}')">
                                                <i class="fas fa-volume-up"></i>
                                            </button>
                                            <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" onclick="glossaryApp.toggleFavorite('${term.id}')">
                                                <i class="fas fa-star"></i>
                                            </button>
                                            <button class="action-btn ai-enhance-btn" onclick="glossaryApp.enhanceWithAI('${term.id}')">
                                                <i class="fas fa-robot"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="term-definition">${term.definition}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('');
    }

    groupTermsByLetter() {
        const grouped = {};
        this.filteredTerms.forEach(term => {
            const letter = term.name.charAt(0).toUpperCase();
            if (!grouped[letter]) {
                grouped[letter] = [];
            }
            grouped[letter].push(term);
        });
        return grouped;
    }

    // ===== AI ENHANCEMENT =====
    checkAIAvailability() {
        const aiButtons = document.querySelectorAll('.ai-enhance-btn');
        if (window.DiasporaAI && window.DiasporaAI.isInitialized) {
            aiButtons.forEach(btn => {
                btn.style.display = 'flex';
                btn.title = 'AI Enhancement Available';
            });
            console.log('AI enhancement available for glossary');
        } else {
            aiButtons.forEach(btn => {
                btn.style.opacity = '0.5';
                btn.title = 'AI Enhancement Unavailable';
                btn.onclick = () => alert('AI enhancement is currently unavailable');
            });
            console.log('AI enhancement unavailable for glossary');
        }
    }

    async enhanceWithAI(termId) {
        const term = this.terms.find(t => t.id === termId);
        if (!term) return;

        if (!window.DiasporaAI || !window.DiasporaAI.isInitialized) {
            alert('AI enhancement is currently unavailable');
            return;
        }

        // Show AI panel
        this.showAIPanel();
        this.showAILoading();

        try {
            // Check if we already have AI enhancement for this term
            if (this.aiEnhanced[termId]) {
                this.displayAIContent(this.aiEnhanced[termId]);
                return;
            }

            // Generate AI enhancements
            const enhancements = await this.generateTermEnhancements(term);
            this.aiEnhanced[termId] = enhancements;
            this.displayAIContent(enhancements);

        } catch (error) {
            console.error('AI enhancement error:', error);
            this.showAIError();
        }
    }

    async generateTermEnhancements(term) {
        const enhancements = {};

        // Smart Definition (context-aware explanation)
        enhancements.smartDefinition = await this.generateSmartDefinition(term);
        
        // Related Terms
        enhancements.relatedTerms = await this.generateRelatedTerms(term);
        
        // Etymology
        enhancements.etymology = await this.generateEtymology(term);
        
        // Usage Examples
        enhancements.usageExamples = await this.generateUsageExamples(term);
        
        // Pronunciation Guide
        enhancements.pronunciationGuide = await this.generatePronunciationGuide(term);

        return enhancements;
    }

    async generateSmartDefinition(term) {
        const prompt = `Provide a context-aware explanation of "${term.name}" for someone learning about African diaspora culture. Make it accessible but comprehensive, explaining why this concept matters in diaspora studies. Include cultural significance and modern relevance. Write 2-3 sentences.`;
        
        try {
            return await window.DiasporaAI.callOpenAI(prompt, 200, 0.7);
        } catch (error) {
            return `${term.name} is an important concept in African diaspora studies that represents ${term.definition.toLowerCase()}`;
        }
    }

    async generateRelatedTerms(term) {
        const prompt = `List 5 terms closely related to "${term.name}" in African diaspora culture. For each term, provide the term name and a brief 1-sentence explanation. Format as: "Term: explanation"`;
        
        try {
            return await window.DiasporaAI.callOpenAI(prompt, 300, 0.6);
        } catch (error) {
            return term.relatedTerms.map(t => `${t}: Related concept in diaspora studies`).join('\n');
        }
    }

    async generateEtymology(term) {
        const prompt = `Explain the detailed etymology and historical development of the word "${term.name}". Include original language, meaning evolution, and how it entered diaspora vocabulary. Write 2-3 sentences.`;
        
        try {
            return await window.DiasporaAI.callOpenAI(prompt, 200, 0.5);
        } catch (error) {
            return term.etymology || `The term "${term.name}" has roots in African linguistic traditions and has evolved through diaspora communities.`;
        }
    }

    async generateUsageExamples(term) {
        const prompt = `Create 3 diverse, realistic usage examples for "${term.name}" in different contexts: academic, casual conversation, and cultural discussion. Make them relevant to diaspora experiences.`;
        
        try {
            return await window.DiasporaAI.callOpenAI(prompt, 250, 0.7);
        } catch (error) {
            return `1. Academic: "${term.usageExample}"\n2. Cultural: Understanding ${term.name} helps preserve heritage.\n3. Personal: This concept of ${term.name} resonates with my family's experience.`;
        }
    }

    async generatePronunciationGuide(term) {
        const prompt = `Provide a detailed pronunciation guide for "${term.name}" including syllable breakdown, stress patterns, and tips for English speakers. Also suggest the original language pronunciation if different.`;
        
        try {
            return await window.DiasporaAI.callOpenAI(prompt, 150, 0.5);
        } catch (error) {
            return `${term.name} is pronounced ${term.pronunciation}. Break it into syllables and emphasize the stressed parts.`;
        }
    }

    showAIPanel() {
        const panel = document.getElementById('ai-enhancement-panel');
        panel?.classList.add('show');
    }

    closeAIPanel() {
        const panel = document.getElementById('ai-enhancement-panel');
        panel?.classList.remove('show');
    }

    showAILoading() {
        const loading = document.getElementById('ai-loading');
        const content = document.getElementById('ai-content');
        
        if (loading) loading.style.display = 'block';
        if (content) content.style.display = 'none';
    }

    displayAIContent(enhancements) {
        const loading = document.getElementById('ai-loading');
        const content = document.getElementById('ai-content');
        
        if (loading) loading.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.innerHTML = `
                <div class="ai-section smart-definition">
                    <h4><i class="fas fa-brain"></i> Smart Definition</h4>
                    <div class="ai-section-content">${enhancements.smartDefinition}</div>
                </div>

                <div class="ai-section etymology">
                    <h4><i class="fas fa-history"></i> Etymology & Origins</h4>
                    <div class="ai-section-content">${enhancements.etymology}</div>
                </div>

                <div class="ai-section usage-examples">
                    <h4><i class="fas fa-comment-dots"></i> Usage Examples</h4>
                    <div class="ai-section-content">${enhancements.usageExamples.replace(/\n/g, '<br>')}</div>
                </div>

                <div class="ai-section related-terms">
                    <h4><i class="fas fa-sitemap"></i> Related Terms</h4>
                    <div class="ai-section-content">${enhancements.relatedTerms.replace(/\n/g, '<br>')}</div>
                </div>

                <div class="ai-section pronunciation">
                    <h4><i class="fas fa-volume-up"></i> Pronunciation Guide</h4>
                    <div class="ai-section-content">
                        ${enhancements.pronunciationGuide}
                        <div class="pronunciation-controls">
                            <button class="pronunciation-play-btn" onclick="glossaryApp.playAIEnhancedPronunciation()">
                                <i class="fas fa-play"></i>
                                Play Pronunciation
                            </button>
                            <div class="speed-control">
                                <label>Speed:</label>
                                <input type="range" min="0.5" max="2" step="0.1" value="1" id="speech-speed">
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    showAIError() {
        const loading = document.getElementById('ai-loading');
        const content = document.getElementById('ai-content');
        
        if (loading) loading.style.display = 'none';
        if (content) {
            content.style.display = 'block';
            content.innerHTML = `
                <div class="ai-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>AI Enhancement Unavailable</h4>
                    <p>We're unable to provide AI enhancements at the moment. Please try again later.</p>
                </div>
            `;
        }
    }

    // ===== PRONUNCIATION =====
    playPronunciation(term, pronunciation) {
        if (this.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(term);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 1;
            this.speechSynthesis.speak(utterance);
        }
    }

    playAIEnhancedPronunciation() {
        const termName = document.querySelector('.ai-section.pronunciation')?.textContent || '';
        if (termName && this.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(termName);
            const speed = document.getElementById('speech-speed')?.value || 1;
            utterance.rate = parseFloat(speed);
            this.speechSynthesis.speak(utterance);
        }
    }

    // ===== FAVORITES & PROGRESS =====
    toggleFavorite(termId) {
        const index = this.favorites.indexOf(termId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(termId);
        }
        
        this.saveFavorites();
        this.updateFavoritesCount();
        
        // Update UI
        const button = document.querySelector(`[data-term-id="${termId}"] .favorite-btn`);
        button?.classList.toggle('active');
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('glossary_favorites') || '[]');
        } catch {
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('glossary_favorites', JSON.stringify(this.favorites));
    }

    updateFavoritesCount() {
        const countElement = document.getElementById('favorites-count');
        if (countElement) {
            countElement.textContent = this.favorites.length;
        }
    }

    showFavorites() {
        const favoriteTerms = this.terms.filter(term => this.favorites.includes(term.id));
        
        if (favoriteTerms.length === 0) {
            alert('No favorite terms yet. Click the star icon on terms to add them to favorites!');
            return;
        }

        // Temporarily filter to show only favorites
        this.filteredTerms = favoriteTerms;
        document.getElementById('results-title').textContent = 'My Favorite Terms';
        this.renderTerms();
    }

    loadStudyProgress() {
        try {
            return JSON.parse(localStorage.getItem('glossary_progress') || '{}');
        } catch {
            return {};
        }
    }

    saveStudyProgress() {
        localStorage.setItem('glossary_progress', JSON.stringify(this.studyProgress));
    }

    showProgress() {
        const studiedTerms = Object.keys(this.studyProgress).length;
        const totalTerms = this.terms.length;
        const percentage = Math.round((studiedTerms / totalTerms) * 100);
        
        alert(`Learning Progress:\n\nStudied: ${studiedTerms}/${totalTerms} terms\nProgress: ${percentage}%\n\nKeep studying to improve your knowledge!`);
    }

    // ===== FLASHCARD MODE =====
    startFlashcardMode() {
        const termsToStudy = this.filteredTerms.length > 0 ? this.filteredTerms : this.terms;
        
        if (termsToStudy.length === 0) {
            alert('No terms available for flashcard study.');
            return;
        }

        this.flashcardDeck = [...termsToStudy].sort(() => Math.random() - 0.5); // Shuffle
        this.currentFlashcard = 0;
        
        this.showFlashcardModal();
        this.updateFlashcard();
    }

    showFlashcardModal() {
        const modal = document.getElementById('flashcard-modal');
        modal?.classList.add('show');
    }

    closeFlashcardModal() {
        const modal = document.getElementById('flashcard-modal');
        modal?.classList.remove('show');
    }

    updateFlashcard() {
        if (this.flashcardDeck.length === 0) return;

        const term = this.flashcardDeck[this.currentFlashcard];
        const counter = document.getElementById('card-counter');
        const termDisplay = document.getElementById('flashcard-term');
        const definitionDisplay = document.getElementById('flashcard-definition');
        const flashcard = document.querySelector('.flashcard');

        if (counter) counter.textContent = `${this.currentFlashcard + 1} / ${this.flashcardDeck.length}`;
        if (termDisplay) termDisplay.textContent = term.name;
        if (definitionDisplay) definitionDisplay.textContent = term.definition;
        
        // Reset flashcard to front
        flashcard?.classList.remove('flipped');
        
        // Add click to flip
        if (flashcard) {
            flashcard.onclick = () => flashcard.classList.toggle('flipped');
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prev-card');
        const nextBtn = document.getElementById('next-card');
        
        if (prevBtn) prevBtn.disabled = this.currentFlashcard === 0;
        if (nextBtn) nextBtn.disabled = this.currentFlashcard === this.flashcardDeck.length - 1;
    }

    previousFlashcard() {
        if (this.currentFlashcard > 0) {
            this.currentFlashcard--;
            this.updateFlashcard();
        }
    }

    nextFlashcard() {
        if (this.currentFlashcard < this.flashcardDeck.length - 1) {
            this.currentFlashcard++;
            this.updateFlashcard();
        }
    }

    playFlashcardPronunciation() {
        const term = this.flashcardDeck[this.currentFlashcard];
        if (term) {
            this.playPronunciation(term.name, term.pronunciation);
        }
    }

    markDifficulty(level) {
        const term = this.flashcardDeck[this.currentFlashcard];
        if (term) {
            this.studyProgress[term.id] = {
                difficulty: level,
                studiedAt: Date.now(),
                reviewCount: (this.studyProgress[term.id]?.reviewCount || 0) + 1
            };
            this.saveStudyProgress();
        }

        // Auto-advance to next card
        setTimeout(() => {
            this.nextFlashcard();
        }, 500);
    }

    // ===== DYNAMIC TERMS INTEGRATION =====
    addDynamicTerm(termData) {
        // Check if term already exists
        const existingTerm = this.terms.find(t => 
            t.name.toLowerCase() === termData.name.toLowerCase() ||
            t.id === termData.id
        );
        
        if (existingTerm) {
            console.log(`Term "${termData.name}" already exists, skipping...`);
            return false;
        }
        
        // Add required fields if missing
        const newTerm = {
            id: termData.id || termData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            name: termData.name,
            pronunciation: termData.pronunciation || this.generateBasicPronunciation(termData.name),
            definition: termData.definition,
            category: termData.category || 'cultural',
            origin: termData.origin || 'unknown',
            etymology: termData.etymology || '',
            usageExample: termData.usageExample || `Understanding ${termData.name} helps preserve cultural heritage.`,
            relatedTerms: termData.relatedTerms || [],
            difficulty: termData.difficulty || 'intermediate',
            popularity: termData.popularity || 60,
            source: termData.source || 'dynamic',
            extractedAt: termData.extractedAt || new Date().toISOString(),
            isDynamic: true
        };
        
        // Add to terms array
        this.terms.push(newTerm);
        
        // Re-apply current filters to include new term if it matches
        this.applyFilters();
        
        console.log(`Added dynamic term: ${newTerm.name}`);

        return true;
    }
    
    generateBasicPronunciation(termName) {
        // Simple pronunciation generation
        const cleaned = termName.toLowerCase().replace(/[^a-z]/g, '');
        if (cleaned.length <= 6) return `/${cleaned}/`;
        
        // Basic syllable breaking
        const syllables = cleaned.replace(/([aeiou])([bcdfghjklmnpqrstvwxyz])/g, '$1-$2');
        return `/${syllables}/`;
    }
    
    showDynamicTermNotification(term) {
        // Show a subtle notification that a new term was added
        const notification = document.createElement('div');
        notification.className = 'dynamic-term-added';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-plus-circle"></i>
                <span>New term added: <strong>${term.name}</strong></span>
                <button onclick="this.parentElement.parentElement.remove()" class="close-notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #d4af37, #ffd700);
            color: #1a1a1a;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 0.9rem;
            animation: slideInUp 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    getDynamicTermsCount() {
        return this.terms.filter(term => term.isDynamic).length;
    }
    
    clearDynamicTerms() {
        this.terms = this.terms.filter(term => !term.isDynamic);
        this.applyFilters();
        console.log('🗑️ Cleared all dynamic terms');
    }

    // ===== QUIZ MODE =====
    startQuizMode() {
        alert('Quiz mode coming soon! This will test your knowledge of diaspora terminology.');
    }

    // ===== UTILITY FUNCTIONS =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Additional CSS for dynamic terms
const glossaryCSS = `
<style>
@keyframes slideInUp {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes slideOutDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100px); opacity: 0; }
}

.dynamic-term-added .notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.close-notification {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    margin-left: auto;
    padding: 2px;
    border-radius: 3px;
    transition: background 0.2s ease;
}

.close-notification:hover {
    background: rgba(0,0,0,0.1);
}

.term-card.dynamic {
    border-left-color: #4caf50 !important;
    position: relative;
}

.term-card.dynamic::after {
    content: 'NEW';
    position: absolute;
    top: 10px;
    right: 10px;
    background: #4caf50;
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
}

.no-results {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-color);
}

.no-results i {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 20px;
}

.no-results h3 {
    color: var(--dark-color);
    margin-bottom: 10px;
}
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML('beforeend', glossaryCSS);

// Global functions for onclick handlers
window.closeFlashcardModal = function() {
    if (window.glossaryApp) {
        window.glossaryApp.closeFlashcardModal();
    }
};

window.markDifficulty = function(level) {
    if (window.glossaryApp) {
        window.glossaryApp.markDifficulty(level);
    }
};

// Initialize the glossary app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.glossaryApp = new GlossaryApp();
    
    // Initialize dynamic terms manager after AI is ready
    setTimeout(() => {
        if (window.DynamicTermsManager && window.glossaryApp) {
            window.dynamicTermsManager = new DynamicTermsManager(window.glossaryApp);
            console.log('🚀 Dynamic Terms Manager initialized');
        }
    }, 3000);
});

// Export for global access
window.GlossaryApp = GlossaryApp;