// dynamic-terms.js - AI-Powered Dynamic Term Extraction System

class DynamicTermsManager {
    constructor(glossaryApp) {
        this.glossaryApp = glossaryApp;
        this.extractedTerms = new Map();
        this.pendingTerms = [];
        this.processedPages = new Set();
        this.realTimeObserver = null;
        this.extractionQueue = [];
        this.isProcessing = false;
        this.contentAnalysisTimeout = null;
        
        // Configuration
        this.config = {
            minTermLength: 3,
            maxTermLength: 30,
            extractionDelay: 2000,
            batchSize: 5,
            cooldownPeriod: 10000,
            confidenceThreshold: 0.7
        };
        
        this.initialize();
    }

    async initialize() {
        console.log('🤖 Initializing Dynamic Terms Manager...');
        
        // Start real-time detection
        this.startRealTimeDetection();
        
        // Extract from current page
        setTimeout(() => {
            this.scanCurrentPage();
        }, 3000);
        
        // Extract from site pages
        setTimeout(() => {
            this.extractFromSitePages();
        }, 5000);
    }

    // ===== AI-POWERED EXTRACTION =====
    async extractTermsWithAI(content, sourceContext = '') {
        if (!window.DiasporaAI || !window.DiasporaAI.isInitialized) {
            console.log('❌ AI not available for term extraction');
            return [];
        }

        console.log('🔍 AI extracting terms from content...');

        const prompt = `Analyze this content about African diaspora and extract important cultural, historical, and linguistic terms. 

Content: "${content.substring(0, 1500)}..."

For each term, provide a JSON object with:
- name: the exact term
- definition: clear 1-2 sentence definition
- category: one of [cultural, historical, linguistic, musical, spiritual, geographical]
- confidence: score 0-1 how confident you are this is a diaspora-relevant term
- origin: best guess of regional origin [west-africa, east-africa, central-africa, southern-africa, caribbean, north-america, south-america]
- etymology: brief word origin if known
- context: how it appeared in the source

Return as JSON array. Only include terms specifically relevant to African diaspora culture, history, or identity. Minimum confidence 0.7.`;

        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 800, 0.3);
            const extractedTerms = this.parseAIResponse(response);
            
            console.log(`✅ AI extracted ${extractedTerms.length} terms`);
            return extractedTerms.filter(term => term.confidence >= this.config.confidenceThreshold);
            
        } catch (error) {
            console.error('❌ AI term extraction failed:', error);
            return this.fallbackExtraction(content);
        }
    }

    parseAIResponse(response) {
        try {
            // Try to parse as JSON
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // Fallback: parse structured text
            return this.parseStructuredResponse(response);
            
        } catch (error) {
            console.log('⚠️ Failed to parse AI response, using fallback');
            return [];
        }
    }

    parseStructuredResponse(response) {
        const terms = [];
        const lines = response.split('\n');
        let currentTerm = {};
        
        lines.forEach(line => {
            line = line.trim();
            if (line.includes('name:') || line.includes('"name"')) {
                if (currentTerm.name) terms.push(currentTerm);
                currentTerm = { name: this.extractValue(line) };
            } else if (line.includes('definition:') || line.includes('"definition"')) {
                currentTerm.definition = this.extractValue(line);
            } else if (line.includes('category:') || line.includes('"category"')) {
                currentTerm.category = this.extractValue(line);
            } else if (line.includes('confidence:') || line.includes('"confidence"')) {
                currentTerm.confidence = parseFloat(this.extractValue(line)) || 0.8;
            } else if (line.includes('origin:') || line.includes('"origin"')) {
                currentTerm.origin = this.extractValue(line);
            }
        });
        
        if (currentTerm.name) terms.push(currentTerm);
        return terms.filter(t => t.name && t.definition);
    }

    extractValue(line) {
        const match = line.match(/:\s*"?([^",\n]+)"?/);
        return match ? match[1].trim() : '';
    }

    fallbackExtraction(content) {
        const patterns = [
            /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
            /\b\w+(?:ism|ity|ance|ence|tion|sion)\b/g,
            /\b\w*(?:African|diaspora|heritage|tradition|culture|ritual)\w*\b/gi
        ];
        
        const matches = [];
        patterns.forEach(pattern => {
            const found = content.match(pattern) || [];
            matches.push(...found);
        });
        
        return [...new Set(matches)]
            .filter(term => term.length >= this.config.minTermLength)
            .slice(0, 5)
            .map(term => ({
                name: term,
                definition: `Term related to African diaspora culture and heritage.`,
                category: 'cultural',
                confidence: 0.5,
                origin: 'unknown',
                source: 'pattern-matching'
            }));
    }

    // ===== REAL-TIME DETECTION =====
    startRealTimeDetection() {
        console.log('👁️ Starting real-time term detection...');
        
        // Observe DOM changes
        this.realTimeObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.scheduleContentAnalysis(node.textContent);
                        }
                    });
                }
            });
        });
        
        // Start observing
        this.realTimeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        // Detect user interactions
        this.setupInteractionDetection();
    }

    setupInteractionDetection() {
        let hoverTimeout;
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.textContent && e.target.textContent.length > 10) {
                hoverTimeout = setTimeout(() => {
                    this.analyzeHoveredContent(e.target.textContent);
                }, 2000);
            }
        });
        
        document.addEventListener('mouseout', () => {
            clearTimeout(hoverTimeout);
        });
        
        // Detect text selection
        document.addEventListener('mouseup', () => {
            const selection = window.getSelection().toString().trim();
            if (selection.length > 3 && selection.length < 50) {
                this.analyzeSelectedText(selection);
            }
        });
    }

    async analyzeHoveredContent(content) {
        const importantTerms = this.detectPotentialTerms(content);
        if (importantTerms.length > 0) {
            this.scheduleTermExtraction(content, 'user-hover');
        }
    }

    async analyzeSelectedText(selectedText) {
        console.log(`🎯 User selected: "${selectedText}"`);
        
        if (this.isDiasporaRelevant(selectedText)) {
            await this.quickTermAnalysis(selectedText);
        }
    }

    isDiasporaRelevant(text) {
        const diasporaKeywords = [
            'african', 'diaspora', 'heritage', 'tradition', 'culture', 'ancestor',
            'homeland', 'migration', 'identity', 'community', 'spiritual', 'ritual',
            'music', 'dance', 'art', 'language', 'creole', 'resistance', 'freedom'
        ];
        
        const textLower = text.toLowerCase();
        return diasporaKeywords.some(keyword => textLower.includes(keyword)) ||
               /^[A-Z][a-z]+$/.test(text);
    }

    async quickTermAnalysis(term) {
        if (!window.DiasporaAI || !window.DiasporaAI.isInitialized) return;
        
        const prompt = `Is "${term}" a term relevant to African diaspora culture, history, or identity? 
        If yes, provide a brief definition. If no, just say "not relevant".
        Keep response under 100 words.`;
        
        try {
            const response = await window.DiasporaAI.callOpenAI(prompt, 100, 0.5);
            
            if (!response.toLowerCase().includes('not relevant')) {
                console.log(`✨ Found potential term: ${term}`);
                this.suggestTermToUser(term, response);
            }
        } catch (error) {
            console.log('Quick analysis failed:', error);
        }
    }

    suggestTermToUser(term, definition) {
        this.showTermSuggestion(term, definition);
    }

    showTermSuggestion(term, definition) {
        const suggestion = document.createElement('div');
        suggestion.className = 'term-suggestion-popup';
        suggestion.innerHTML = `
            <div class="suggestion-content">
                <div class="suggestion-header">
                    <i class="fas fa-lightbulb"></i>
                    <span>New term detected!</span>
                    <button class="close-suggestion" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="suggestion-body">
                    <strong>${term}</strong>
                    <p>${definition.substring(0, 100)}...</p>
                </div>
                <div class="suggestion-actions">
                    <button class="btn-small add-term" onclick="dynamicTermsManager.addSuggestedTerm('${term}', '${definition.replace(/'/g, "&#39;")}')">
                        <i class="fas fa-plus"></i> Add to Glossary
                    </button>
                    <button class="btn-small ignore-term" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Ignore
                    </button>
                </div>
            </div>
        `;
        
        suggestion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
            font-family: 'Segoe UI', sans-serif;
        `;
        
        document.body.appendChild(suggestion);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (suggestion.parentElement) {
                suggestion.remove();
            }
        }, 10000);
    }

    addSuggestedTerm(term, definition) {
        const termData = {
            id: term.toLowerCase().replace(/\s+/g, '-'),
            name: term,
            definition: definition,
            category: 'cultural',
            origin: 'unknown',
            source: 'user-detected',
            confidence: 0.8,
            dateAdded: new Date().toISOString()
        };
        
        this.glossaryApp.addDynamicTerm(termData);
        
        // Remove suggestion popup
        document.querySelectorAll('.term-suggestion-popup').forEach(popup => popup.remove());
        
        // Show success message
        this.showNotification(`✅ "${term}" added to glossary!`, 'success');
    }

    // ===== SMART CURATION =====
    async extractFromSitePages() {
        console.log('Starting smart curation from site pages...');
        
        const siteSources = [
            { 
                url: 'historical-timeline.html', 
                type: 'historical',
                priority: 'high',
                context: 'Historical events and periods in African diaspora'
            },
            { 
                url: 'maps.html', 
                type: 'geographical',
                priority: 'high',
                context: 'Geographic locations and migration routes'
            },
            { 
                url: 'podcasts.html', 
                type: 'cultural',
                priority: 'medium',
                context: 'Contemporary diaspora voices and stories'
            },
            { 
                url: 'literature.html', 
                type: 'cultural',
                priority: 'medium',
                context: 'Literary works and authors from diaspora'
            },
            { 
                url: 'music-dance.html', 
                type: 'musical',
                priority: 'medium',
                context: 'Musical traditions and cultural expressions'
            },
            { 
                url: 'news.html', 
                type: 'contemporary',
                priority: 'low',
                context: 'Current events and modern diaspora issues'
            },
                        { 
                url: 'index.html', 
                type: 'general',
                priority: 'medium',
                context: 'Landing page for diaspora content'
            }
        ];
        
        // Process high priority sources first
        const prioritized = siteSources.sort((a, b) => {
            const priorities = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorities[b.priority] - priorities[a.priority];
        });
        
        for (const source of prioritized) {
            if (!this.processedPages.has(source.url)) {
                await this.extractFromSource(source);
                await this.delay(3000);
            }
        }
    }

    async extractFromSource(source) {
        console.log(`📄 Extracting terms from ${source.url}...`);
        
        try {
            const content = await this.fetchPageContent(source.url);
            if (!content) return;
            
            const extractedTerms = await this.extractTermsWithAI(content, source.context);
            const curatedTerms = await this.curateTerms(extractedTerms, source);
            
            curatedTerms.forEach(term => {
                this.glossaryApp.addDynamicTerm({
                    ...term,
                    source: source.url,
                    extractedAt: new Date().toISOString()
                });
            });
            
            this.processedPages.add(source.url);
            console.log(`✅ Added ${curatedTerms.length} terms from ${source.url}`);
            
        } catch (error) {
            console.error(`❌ Failed to extract from ${source.url}:`, error);
        }
    }

    async fetchPageContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const contentSelectors = [
                'main', '.content', '.page-content', 'article',
                '.timeline-content', '.featured-content', '.glossary-content'
            ];
            
            let content = '';
            for (const selector of contentSelectors) {
                const element = doc.querySelector(selector);
                if (element) {
                    content = element.textContent || '';
                    break;
                }
            }
            
            if (!content) {
                content = doc.body.textContent || '';
            }
            
            return content
                .replace(/\s+/g, ' ')
                .replace(/[^\w\s.,!?;:()\-'"]/g, '')
                .trim()
                .substring(0, 3000);
                
        } catch (error) {
            console.log(`Could not fetch ${url}:`, error);
            return null;
        }
    }

    async curateTerms(extractedTerms, source) {
        const curated = [];
        
        for (const term of extractedTerms) {
            // Skip if already exists
            if (this.glossaryApp.terms.find(t => 
                t.name.toLowerCase() === term.name.toLowerCase())) {
                continue;
            }
            
            // Validate term quality
            if (this.validateTerm(term, source)) {
                const enhanced = await this.enhanceTerm(term, source);
                curated.push(enhanced);
            }
        }
        
        return curated;
    }

    validateTerm(term, source) {
        if (!term.name || !term.definition) return false;
        if (term.name.length < this.config.minTermLength) return false;
        if (term.name.length > this.config.maxTermLength) return false;
        if (term.confidence < this.config.confidenceThreshold) return false;
        
        const irrelevantPatterns = [
            /^(the|and|but|for|with|from)$/i,
            /^(click|here|more|see|view|read)$/i,
            /^\d+$/,
            /^[a-z]+$/
        ];
        
        return !irrelevantPatterns.some(pattern => pattern.test(term.name));
    }

    async enhanceTerm(term, source) {
        const enhanced = {
            ...term,
            id: term.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            popularity: this.calculatePopularity(term, source),
            difficulty: this.assessDifficulty(term),
            pronunciation: await this.generatePronunciation(term.name),
            usageExample: await this.generateUsageExample(term, source.context)
        };
        
        return enhanced;
    }

    calculatePopularity(term, source) {
        const sourceWeights = {
            'historical': 80,
            'geographical': 70,
            'cultural': 85,
            'musical': 75,
            'contemporary': 60
        };
        
        return sourceWeights[source.type] || 60;
    }

    assessDifficulty(term) {
        const defLength = term.definition.length;
        const complexity = (term.definition.match(/\b\w{8,}\b/g) || []).length;
        
        if (defLength < 100 && complexity < 2) return 'beginner';
        if (defLength < 200 && complexity < 4) return 'intermediate';
        return 'advanced';
    }

    async generatePronunciation(termName) {
        if (termName.length <= 6) return `/${termName.toLowerCase()}/`;
        
        const syllables = termName.toLowerCase().replace(/([aeiou])([bcdfghjklmnpqrstvwxyz])/g, '$1-$2');
        return `/${syllables}/`;
    }

    async generateUsageExample(term, context) {
        if (!window.DiasporaAI || !window.DiasporaAI.isInitialized) {
            return `Understanding ${term.name} helps preserve cultural heritage.`;
        }
        
        try {
            const prompt = `Create a realistic usage example for "${term.name}" in the context of ${context}. Make it educational and relevant to African diaspora studies. One sentence only.`;
            
            const example = await window.DiasporaAI.callOpenAI(prompt, 100, 0.7);
            return example.trim();
        } catch (error) {
            return `The concept of ${term.name} plays an important role in diaspora communities.`;
        }
    }

    // ===== CONTENT ANALYSIS =====
    scanCurrentPage() {
        console.log('🔍 Scanning current page for terms...');
        
        const content = this.extractPageContent();
        if (content.length > 100) {
            this.scheduleTermExtraction(content, 'current-page');
        }
    }

    extractPageContent() {
        const contentSelectors = [
            'main', '.content', '.page-content', 'article',
            '.hero-content', '.featured-content', '.section-content'
        ];
        
        let content = '';
        for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                content += element.textContent + ' ';
            }
        }
        
        return content
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 2000);
    }

    scheduleTermExtraction(content, source) {
        this.extractionQueue.push({ content, source, timestamp: Date.now() });
        
        if (!this.isProcessing) {
            setTimeout(() => this.processExtractionQueue(), this.config.extractionDelay);
        }
    }

    async processExtractionQueue() {
        if (this.extractionQueue.length === 0 || this.isProcessing) return;
        
        this.isProcessing = true;
        console.log(`🔄 Processing ${this.extractionQueue.length} extraction requests...`);
        
        while (this.extractionQueue.length > 0) {
            const batch = this.extractionQueue.splice(0, this.config.batchSize);
            
            for (const item of batch) {
                try {
                    const terms = await this.extractTermsWithAI(item.content, item.source);
                    const curated = await this.curateTerms(terms, { type: 'dynamic', url: item.source });
                    
                    curated.forEach(term => {
                        this.glossaryApp.addDynamicTerm({
                            ...term,
                            source: item.source,
                            extractedAt: new Date().toISOString()
                        });
                    });
                    
                } catch (error) {
                    console.log('Extraction failed for batch item:', error);
                }
            }
            
            if (this.extractionQueue.length > 0) {
                await this.delay(this.config.cooldownPeriod);
            }
        }
        
        this.isProcessing = false;
        console.log('✅ Extraction queue processed');
    }

    scheduleContentAnalysis(content) {
        if (content && content.length > 50) {
            clearTimeout(this.contentAnalysisTimeout);
            this.contentAnalysisTimeout = setTimeout(() => {
                this.analyzeNewContent(content);
            }, this.config.extractionDelay);
        }
    }

    async analyzeNewContent(content) {
        const potentialTerms = this.detectPotentialTerms(content);
        if (potentialTerms.length > 0) {
            this.scheduleTermExtraction(content, 'realtime-detection');
        }
    }

    detectPotentialTerms(content) {
        const patterns = [
            /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g,
            /\b\w*(?:African|diaspora|heritage|culture|tradition)\w*\b/gi,
            /\b[A-Z][a-z]+(?:ism|ity|ance|ence|tion|sion)\b/g
        ];
        
        const matches = [];
        patterns.forEach(pattern => {
            const found = content.match(pattern) || [];
            matches.push(...found);
        });
        
        return [...new Set(matches)]
            .filter(term => 
                term.length >= this.config.minTermLength && 
                term.length <= this.config.maxTermLength
            );
    }

    // ===== UTILITY METHODS =====
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `dynamic-term-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===== PUBLIC API =====
    getExtractedTermsCount() {
        return this.extractedTerms.size;
    }

    getProcessingStatus() {
        return {
            isProcessing: this.isProcessing,
            queueLength: this.extractionQueue.length,
            processedPages: this.processedPages.size
        };
    }

    stopRealTimeDetection() {
        if (this.realTimeObserver) {
            this.realTimeObserver.disconnect();
            this.realTimeObserver = null;
        }
    }
}

// CSS Styles for dynamic term features
const dynamicTermsCSS = `
<style>
@keyframes slideInRight {
    from { transform: translateX(300px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(300px); opacity: 0; }
}

.term-suggestion-popup {
    font-family: 'Segoe UI', sans-serif;
}

.suggestion-content {
    padding: 20px;
}

.suggestion-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 15px;
    color: #d4af37;
    font-weight: 600;
    font-size: 0.9rem;
}

.close-suggestion {
    background: none;
    border: none;
    margin-left: auto;
    cursor: pointer;
    color: #999;
    padding: 4px;
}

.suggestion-body strong {
    color: #1a1a1a;
    font-size: 1.1rem;
}

.suggestion-body p {
    color: #666;
    font-size: 0.9rem;
    margin: 8px 0;
    line-height: 1.4;
}

.suggestion-actions {
    display: flex;
    gap: 8px;
    margin-top: 15px;
}

.btn-small {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
}

.add-term {
    background: #d4af37;
    color: #1a1a1a;
}

.add-term:hover {
    background: #b8941f;
    transform: translateY(-1px);
}

.ignore-term {
    background: #f5f5f5;
    color: #666;
}

.ignore-term:hover {
    background: #e0e0e0;
}
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML('beforeend', dynamicTermsCSS);

// Export for global access
window.DynamicTermsManager = DynamicTermsManager;