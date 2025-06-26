// literature.js - Clean and Simple Literature Management

// Sample literature data
const literatureData = [
    {
        id: 'things-fall-apart',
        title: 'Things Fall Apart',
        author: 'Chinua Achebe',
        type: 'novel',
        year: 1958,
        region: 'africa',
        era: '1950-2000',
        description: 'A groundbreaking novel that tells the story of Okonkwo, a respected warrior in an Igbo village, and the arrival of European colonizers.',
        image: 'assets/images/literature/things-fall-apart.jpg',
        themes: ['colonialism', 'tradition vs modernity', 'masculinity', 'cultural identity'],
        rating: 4.8,
        aiEnhanced: true
    },
    {
        id: 'douglass-narrative',
        title: 'Narrative of the Life of Frederick Douglass',
        author: 'Frederick Douglass',
        type: 'memoir',
        year: 1845,
        region: 'north-america',
        era: '1800-1900',
        description: 'A powerful firsthand account of slavery that became one of the most influential abolitionist texts in American history.',
        image: 'assets/images/literature/narrative-douglass.jpg',
        themes: ['slavery', 'freedom', 'education', 'human rights'],
        rating: 4.9,
        aiEnhanced: true
    },
    {
        id: 'half-yellow-sun',
        title: 'Half of a Yellow Sun',
        author: 'Chimamanda Ngozi Adichie',
        type: 'novel',
        year: 2006,
        region: 'africa',
        era: '2000-present',
        description: 'A sweeping novel set during the Nigerian Civil War, exploring love, loss, and the search for identity.',
        image: 'assets/images/literature/half-yellow-sun.jpg',
        themes: ['war', 'identity', 'post-colonialism', 'love'],
        rating: 4.7,
        aiEnhanced: true
    },
    {
        id: 'beloved',
        title: 'Beloved',
        author: 'Toni Morrison',
        type: 'novel',
        year: 1987,
        region: 'north-america',
        era: '1950-2000',
        description: 'A haunting masterpiece about the psychological trauma of slavery and its enduring effects on individuals and families.',
        image: 'assets/images/literature/beloved.jpg',
        themes: ['slavery', 'trauma', 'memory', 'motherhood'],
        rating: 4.6,
        aiEnhanced: true
    },
    {
        id: 'breath-eyes-memory',
        title: 'Breath, Eyes, Memory',
        author: 'Edwidge Danticat',
        type: 'novel',
        year: 1994,
        region: 'caribbean',
        era: '1950-2000',
        description: 'A coming-of-age story that explores the complex relationship between mothers and daughters in Haitian culture.',
        image: 'assets/images/literature/breath-eyes-memory.jpg',
        themes: ['immigration', 'family', 'cultural identity', 'trauma'],
        rating: 4.5,
        aiEnhanced: true
    },
    {
        id: 'nervous-conditions',
        title: 'Nervous Conditions',
        author: 'Tsitsi Dangarembga',
        type: 'novel',
        year: 1988,
        region: 'africa',
        era: '1950-2000',
        description: 'A powerful novel about a young girl\'s struggle for education and independence in colonial Zimbabwe.',
        image: 'assets/images/literature/nervous-conditions.jpg',
        themes: ['education', 'gender', 'colonialism', 'coming-of-age'],
        rating: 4.4,
        aiEnhanced: true
    }
];

// State
let readingList = [];
let currentView = 'grid';
let currentFilter = { type: 'all', era: 'all', region: 'all', sort: 'relevance' };

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.literature-hero')) {
        initializeLiterature();
    }
});

function initializeLiterature() {
    loadReadingList();
    setupEventListeners();
    renderLiteratureGrid();
    updateStatistics();
    updateReadingListCount();
}

// Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('literature-search');
    const aiSearchBtn = document.getElementById('ai-search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAISearch();
            }
        });
    }
    
    if (aiSearchBtn) {
        aiSearchBtn.addEventListener('click', handleAISearch);
    }
    
    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            if (searchInput) {
                searchInput.value = query;
                handleAISearch();
            }
        });
    });
    
    // Filter controls
    ['type-filter', 'era-filter', 'region-filter', 'sort-filter'].forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', function() {
                const filterType = filterId.replace('-filter', '');
                currentFilter[filterType] = this.value;
                renderLiteratureGrid();
            });
        }
    });
    
    // View controls
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.getAttribute('data-view');
            updateViewDisplay();
        });
    });
    
    // Modal close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLiteratureModal();
            closeAIPanel();
            closeReadingList();
        }
    });
}

// Search Functions
function handleSearch() {
    const searchInput = document.getElementById('literature-search');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        clearSearch();
        return;
    }
    
    const results = filterWorks(query);
    renderLiteratureGrid(results);
}

function handleAISearch() {
    const searchInput = document.getElementById('literature-search');
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    console.log('🔍 AI Search for:', query);
    
    showSearchLoading();
    
    if (isAIAvailable()) {
        performAISearch(query);
    } else {
        performBasicSearch(query);
    }
}

async function performAISearch(query) {
    try {
        const works = getRelatedWorks(query);
        const aiInsights = await window.DiasporaAI.enhanceLiteratureSearch(query, works);
        renderSearchResults(works, aiInsights, query);
        
        if (window.DiasporaAI.trackUserInterest) {
            window.DiasporaAI.trackUserInterest('topic', query);
        }
    } catch (error) {
        console.warn('AI search failed:', error);
        performBasicSearch(query);
    }
}

function performBasicSearch(query) {
    setTimeout(() => {
        const works = getRelatedWorks(query);
        renderSearchResults(works, null, query);
    }, 500);
}

function getRelatedWorks(query) {
    const queryLower = query.toLowerCase();
    
    // Enhanced keyword matching
    const keywords = {
        'slave': ['slavery', 'enslaved', 'douglass', 'plantation'],
        'slavery': ['slave', 'enslaved', 'douglass', 'plantation', 'freedom'],
        'transatlantic': ['slavery', 'douglass', 'beloved', 'middle passage'],
        'trade': ['slavery', 'douglass', 'colonial'],
        'identity': ['cultural identity', 'belonging', 'immigration'],
        'war': ['conflict', 'violence', 'trauma'],
        'women': ['gender', 'motherhood', 'feminism']
    };
    
    // Expand search terms
    let searchTerms = [queryLower];
    Object.keys(keywords).forEach(key => {
        if (queryLower.includes(key)) {
            searchTerms.push(...keywords[key]);
        }
    });
    
    console.log('🔍 Search terms:', searchTerms);
    
    // Find matching works
    const matches = literatureData.filter(item => {
        return searchTerms.some(term => {
            return item.title.toLowerCase().includes(term) ||
                   item.author.toLowerCase().includes(term) ||
                   item.description.toLowerCase().includes(term) ||
                   item.themes.some(theme => 
                       theme.toLowerCase().includes(term) || 
                       term.includes(theme.toLowerCase())
                   );
        });
    });
    
    console.log('📚 Found works:', matches.map(w => w.title));
    return matches.slice(0, 6); // Max 6 results
}

function filterWorks(query) {
    return literatureData.filter(item => {
        return item.title.toLowerCase().includes(query) ||
               item.author.toLowerCase().includes(query) ||
               item.description.toLowerCase().includes(query) ||
               item.themes.some(theme => theme.toLowerCase().includes(query));
    });
}

// Render Functions
function showSearchLoading() {
    const searchSection = document.getElementById('search-results-section');
    const searchGrid = document.getElementById('search-results-grid');
    const featuredSection = document.querySelector('.featured-literature');
    const collectionSection = document.querySelector('.literature-collection');
    
    if (!searchGrid) return;
    
    // Show search section, hide others
    searchSection.style.display = 'block';
    if (featuredSection) featuredSection.style.display = 'none';
    if (collectionSection) collectionSection.style.display = 'none';
    
    searchGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <i class="fas fa-robot fa-spin" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 15px;"></i>
            <p>Searching for relevant works...</p>
        </div>
    `;
}

function renderSearchResults(works, aiInsights, query) {
    const searchGrid = document.getElementById('search-results-grid');
    if (!searchGrid) return;
    
    let html = '';
    
    // AI insights
    if (aiInsights) {
        html += `
            <div class="search-insights" style="grid-column: 1 / -1; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); color: var(--dark-color); padding: 20px; border-radius: 15px 15px 0 0;">
                    <h2 style="margin: 0 0 8px 0; font-size: 1.3rem;">
                        <i class="fas fa-lightbulb"></i> "${query}" in Diaspora Literature
                    </h2>
                </div>
                <div style="background: white; padding: 25px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <p style="margin: 0 0 20px 0; line-height: 1.7;">${aiInsights}</p>
                    <button class="btn-secondary" onclick="clearSearch()" style="padding: 8px 16px;">
                        <i class="fas fa-arrow-left"></i> Back to Browse
                    </button>
                </div>
            </div>
        `;
    }
    
    // Results
    if (works.length > 0) {
        html += `
            <div style="grid-column: 1 / -1; margin-bottom: 20px;">
                <h3 style="color: var(--dark-color); margin: 0; font-size: 1.2rem;">
                    <i class="fas fa-books" style="color: var(--primary-color);"></i>
                    ${works.length} work${works.length !== 1 ? 's' : ''} found
                </h3>
            </div>
        `;
        
        works.forEach(item => {
            html += generateItemHTML(item);
        });
    } else {
        html += `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 20px;"></i>
                <h3>No works found for "${query}"</h3>
                <button class="btn-primary" onclick="clearSearch()" style="margin-top: 15px;">
                    <i class="fas fa-arrow-left"></i> Browse All Literature
                </button>
            </div>
        `;
    }
    
    searchGrid.innerHTML = html;
    
    // Scroll to results
    document.getElementById('search-results-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function renderLiteratureGrid(data = null) {
    const grid = document.getElementById('literature-grid');
    if (!grid) return;
    
    let works = data || applyFilters(literatureData);
    works = applySorting(works);
    
    if (works.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-book" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 20px;"></i>
                <h3>No literature found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    works.forEach(item => {
        html += generateItemHTML(item);
    });
    
    grid.innerHTML = html;
}

function generateItemHTML(item) {
    const isInReadingList = readingList.some(saved => saved.id === item.id);
    
    return `
        <div class="literature-item" onclick="openLiteratureModal('${item.id}')">
            <div class="literature-item-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'">
                <div class="item-type-badge">${item.type}</div>
                ${item.aiEnhanced ? '<div class="item-ai-badge"><i class="fas fa-robot"></i> AI</div>' : ''}
            </div>
            <div class="literature-item-content">
                <h3>${item.title}</h3>
                <p class="literature-item-author">by ${item.author}</p>
                <p class="literature-item-description">${item.description}</p>
                <div class="literature-item-meta">
                    <span><i class="fas fa-calendar"></i> ${item.year}</span>
                    <span><i class="fas fa-star"></i> ${item.rating}/5</span>
                </div>
                <div class="literature-item-actions" onclick="event.stopPropagation()">
                    ${item.aiEnhanced ? `
                        <button class="action-btn action-btn-primary" onclick="showAIAnalysis('${item.id}')">
                            <i class="fas fa-brain"></i> AI Insights
                        </button>
                    ` : ''}
                    <button class="action-btn action-btn-secondary ${isInReadingList ? 'saved' : ''}" onclick="toggleReadingList('${item.id}')">
                        <i class="fas fa-bookmark${isInReadingList ? '' : '-o'}"></i>
                        ${isInReadingList ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Filter and Sort
function applyFilters(data) {
    return data.filter(item => {
        const typeMatch = currentFilter.type === 'all' || item.type === currentFilter.type;
        const eraMatch = currentFilter.era === 'all' || item.era === currentFilter.era;
        const regionMatch = currentFilter.region === 'all' || item.region === currentFilter.region;
        return typeMatch && eraMatch && regionMatch;
    });
}

function applySorting(data) {
    return [...data].sort((a, b) => {
        switch (currentFilter.sort) {
            case 'date-new': return b.year - a.year;
            case 'date-old': return a.year - b.year;
            case 'title': return a.title.localeCompare(b.title);
            case 'author': return a.author.localeCompare(b.author);
            case 'rating': return b.rating - a.rating;
            default: return 0;
        }
    });
}

function updateViewDisplay() {
    const grid = document.getElementById('literature-grid');
    const timeline = document.getElementById('literature-timeline');
    
    if (!grid || !timeline) return;
    
    switch (currentView) {
        case 'grid':
            grid.style.display = 'grid';
            grid.classList.remove('list-view');
            timeline.style.display = 'none';
            break;
        case 'list':
            grid.style.display = 'flex';
            grid.classList.add('list-view');
            timeline.style.display = 'none';
            break;
        case 'timeline':
            grid.style.display = 'none';
            timeline.style.display = 'block';
            renderTimelineView();
            break;
    }
}

function renderTimelineView() {
    const timeline = document.getElementById('literature-timeline');
    if (!timeline) return;
    
    const sortedData = [...literatureData].sort((a, b) => a.year - b.year);
    
    let html = '';
    sortedData.forEach(item => {
        html += `
            <div class="timeline-item">
                <div class="timeline-content" onclick="openLiteratureModal('${item.id}')">
                    <div class="timeline-year">${item.year}</div>
                    <h3>${item.title}</h3>
                    <p class="timeline-author">by ${item.author}</p>
                    <p class="timeline-description">${item.description}</p>
                    <div class="timeline-themes">
                        ${item.themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    timeline.innerHTML = html;
}

// Clear Search
function clearSearch() {
    const searchInput = document.getElementById('literature-search');
    const searchSection = document.getElementById('search-results-section');
    const featuredSection = document.querySelector('.featured-literature');
    const collectionSection = document.querySelector('.literature-collection');
    
    if (searchInput) searchInput.value = '';
    if (searchSection) searchSection.style.display = 'none';
    if (featuredSection) featuredSection.style.display = 'block';
    if (collectionSection) collectionSection.style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Modal Functions
function openLiteratureModal(itemId) {
    const item = literatureData.find(work => work.id === itemId);
    if (!item) return;
    
    const modal = document.getElementById('literature-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    if (!modal || !title || !body) return;
    
    title.textContent = item.title;
    body.innerHTML = `
        <div class="modal-literature-content">
            <h2>${item.title}</h2>
            <p><strong>by ${item.author}</strong></p>
            <p><strong>Year:</strong> ${item.year} | <strong>Type:</strong> ${item.type}</p>
            <p>${item.description}</p>
            <div style="margin: 20px 0;">
                <strong>Themes:</strong>
                ${item.themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('')}
            </div>
            <div style="margin: 20px 0;">
                <button class="btn-primary" onclick="addToReadingList('${item.id}')">
                    <i class="fas fa-bookmark"></i> Add to Reading List
                </button>
                ${item.aiEnhanced ? `
                    <button class="btn-secondary" onclick="showAIAnalysis('${item.id}'); closeLiteratureModal();" style="margin-left: 10px;">
                        <i class="fas fa-brain"></i> AI Analysis
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLiteratureModal() {
    const modal = document.getElementById('literature-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// AI Analysis
async function showAIAnalysis(itemId) {
    const item = literatureData.find(work => work.id === itemId);
    if (!item) return;
    
    const panel = document.getElementById('ai-insights-panel');
    const content = document.getElementById('ai-panel-content');
    
    if (!panel || !content) return;
    
    panel.classList.add('active');
    
    content.innerHTML = `
        <div class="loading">
            <i class="fas fa-brain fa-spin"></i>
            Analyzing "${item.title}"...
        </div>
    `;
    
    try {
        if (isAIAvailable()) {
            const analysis = await window.DiasporaAI.generateWorkAnalysis(item);
            renderAIAnalysis(item, analysis);
        } else {
            renderBasicAnalysis(item);
        }
    } catch (error) {
        console.error('AI analysis failed:', error);
        renderBasicAnalysis(item);
    }
}

function renderAIAnalysis(item, aiData) {
    const content = document.getElementById('ai-panel-content');
    if (!content) return;
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); border-radius: 12px; color: var(--dark-color);">
            <h3 style="margin: 0 0 5px 0;">${item.title}</h3>
            <p style="margin: 0; font-style: italic;">by ${item.author}</p>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 3px 15px rgba(0,0,0,0.08);">
            <h4 style="margin: 0 0 15px 0;">Why This Matters</h4>
            <p style="line-height: 1.7; margin: 0;">${aiData.analysis || 'Analysis not available'}</p>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 3px 15px rgba(0,0,0,0.08);">
            <h4 style="margin: 0 0 15px 0;">You Might Also Like</h4>
            <p style="line-height: 1.6; margin: 0;">${aiData.recommendations || 'Recommendations not available'}</p>
        </div>
        
        <div style="text-align: center;">
            <button class="btn-primary" onclick="addToReadingList('${item.id}')" style="margin-right: 10px;">
                <i class="fas fa-bookmark"></i> Save to List
            </button>
            <button class="btn-secondary" onclick="closeAIPanel()">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
}

function renderBasicAnalysis(item) {
    const content = document.getElementById('ai-panel-content');
    if (!content) return;
    
    const basicAnalysis = {
        'things-fall-apart': "Achebe's masterpiece changed how the world sees Africa in literature, showing complex Igbo society rather than colonial stereotypes.",
        'douglass-narrative': "Douglass turned his life story into a weapon against slavery, proving enslaved people's full humanity through brilliant prose.",
        'beloved': "Morrison uses magical realism to make slavery's psychological wounds visible, showing trauma that refuses to stay buried."
    };
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: linear-gradient(135deg, var(--primary-color), var(--accent-color)); border-radius: 12px; color: var(--dark-color);">
            <h3 style="margin: 0 0 5px 0;">${item.title}</h3>
            <p style="margin: 0; font-style: italic;">by ${item.author}</p>
        </div>
        
        <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 3px 15px rgba(0,0,0,0.08);">
            <h4 style="margin: 0 0 15px 0;">About This Work</h4>
            <p style="line-height: 1.7; margin: 0;">${basicAnalysis[item.id] || item.description}</p>
        </div>
        
        <div style="text-align: center;">
            <button class="btn-primary" onclick="addToReadingList('${item.id}')" style="margin-right: 10px;">
                <i class="fas fa-bookmark"></i> Save to List
            </button>
            <button class="btn-secondary" onclick="closeAIPanel()">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
}

function closeAIPanel() {
    const panel = document.getElementById('ai-insights-panel');
    if (panel) {
        panel.classList.remove('active');
    }
}

// Reading List
function loadReadingList() {
    try {
        const saved = localStorage.getItem('readingList');
        readingList = saved ? JSON.parse(saved) : [];
    } catch (error) {
        readingList = [];
    }
}

function saveReadingList() {
    try {
        localStorage.setItem('readingList', JSON.stringify(readingList));
    } catch (error) {
        console.error('Error saving reading list');
    }
}

function addToReadingList(itemId) {
    const item = literatureData.find(work => work.id === itemId);
    if (!item || readingList.some(saved => saved.id === itemId)) return;
    
    readingList.push({
        id: item.id,
        title: item.title,
        author: item.author,
        addedDate: new Date().toISOString()
    });
    
    saveReadingList();
    updateReadingListCount();
    showNotification(`"${item.title}" added to reading list!`);
}

function toggleReadingList(itemId) {
    const isInList = readingList.some(saved => saved.id === itemId);
    
    if (isInList) {
        readingList = readingList.filter(saved => saved.id !== itemId);
        saveReadingList();
        updateReadingListCount();
        renderLiteratureGrid();
        showNotification('Removed from reading list');
    } else {
        addToReadingList(itemId);
        renderLiteratureGrid();
    }
}

function updateReadingListCount() {
    const countElement = document.getElementById('reading-list-count');
    if (countElement) {
        countElement.textContent = readingList.length;
        countElement.style.display = readingList.length > 0 ? 'flex' : 'none';
    }
}

function toggleReadingList() {
    const sidebar = document.getElementById('reading-list-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
        updateReadingListSidebar();
    }
}

function closeReadingList() {
    const sidebar = document.getElementById('reading-list-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

function updateReadingListSidebar() {
    const content = document.getElementById('reading-list-content');
    if (!content) return;
    
    if (readingList.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>Your reading list is empty</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    readingList.forEach(item => {
        html += `
            <div class="reading-list-item">
                <div onclick="openLiteratureModal('${item.id}')">
                    <h4>${item.title}</h4>
                    <p>by ${item.author}</p>
                </div>
                <button onclick="toggleReadingList('${item.id}')" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function removeFromReadingList(itemId) {
    toggleReadingList(itemId);
}

function exportReadingList() {
    if (readingList.length === 0) {
        showNotification('Reading list is empty!');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalWorks: readingList.length,
        readingList: readingList
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `reading-list-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Reading list exported!');
}

// Utility Functions
function updateStatistics() {
    const totalWorksEl = document.getElementById('total-works');
    const totalAuthorsEl = document.getElementById('total-authors');
    const aiEnhancedEl = document.getElementById('ai-enhanced');
    
    if (totalWorksEl) totalWorksEl.textContent = literatureData.length;
    if (totalAuthorsEl) {
        const uniqueAuthors = new Set(literatureData.map(item => item.author));
        totalAuthorsEl.textContent = uniqueAuthors.size;
    }
    if (aiEnhancedEl) {
        const aiCount = literatureData.filter(item => item.aiEnhanced).length;
        aiEnhancedEl.textContent = aiCount;
    }
}

function isAIAvailable() {
    try {
        return window.DiasporaAI && 
               window.DiasporaAI.isInitialized && 
               typeof window.DiasporaAI.callOpenAI === 'function';
    } catch {
        return false;
    }
}

function debounce(func, wait) {
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

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        padding: 15px 20px;
        z-index: 10000;
        border-left: 4px solid var(--primary-color);
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-info-circle" style="color: var(--primary-color);"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Global exports for onclick handlers
window.openLiteratureModal = openLiteratureModal;
window.closeLiteratureModal = closeLiteratureModal;
window.showAIAnalysis = showAIAnalysis;
window.closeAIPanel = closeAIPanel;
window.addToReadingList = addToReadingList;
window.toggleReadingList = toggleReadingList;
window.closeReadingList = closeReadingList;
window.exportReadingList = exportReadingList;
window.clearSearch = clearSearch;
window.removeFromReadingList = removeFromReadingList;