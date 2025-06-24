// maps-interactive.js - Interactive Maps with Fixed Marker Positions

// Region data for detailed information
const regionData = {
    // Pre-Slavery Africa - Ancient Kingdoms
    'mali': {
        name: 'Mali Empire',
        period: '1230-1600 CE',
        capital: 'Niani',
        peakPopulation: '40-45 million',
        description: 'The Mali Empire was one of the richest and most powerful empires in medieval Africa, controlling trans-Saharan trade routes and vast gold mines. Famous for Mansa Musa, considered the wealthiest person in history.',
        achievements: [
            'Controlled trans-Saharan gold and salt trade',
            'Home to the University of Timbuktu',
            'Advanced Islamic scholarship and architecture',
            'Sophisticated administrative system'
        ],
        modernLegacy: 'Modern Mali, parts of Senegal, Niger, Burkina Faso, Guinea, Gambia, and Mauritania'
    },
    'songhai': {
        name: 'Songhai Empire',
        period: '1464-1591 CE',
        capital: 'Gao',
        peakPopulation: '20-25 million',
        description: 'The Songhai Empire was the largest empire in African history, known for its advanced military organization and the famous centers of learning in Timbuktu and Gao.',
        achievements: [
            'Largest empire in African history',
            'Advanced military and administrative systems',
            'Major centers of Islamic learning',
            'Controlled Niger River trade routes'
        ],
        modernLegacy: 'Modern Mali, Niger, and parts of Burkina Faso'
    },
    'kush': {
        name: 'Kingdom of Kush',
        period: '1070 BCE - 350 CE',
        capital: 'Meroe',
        peakPopulation: '2-3 million',
        description: 'The Kingdom of Kush was known for its powerful queens (Candaces), advanced iron working technology, and impressive pyramid building traditions.',
        achievements: [
            'Advanced iron working and metallurgy',
            'Built over 200 pyramids',
            'Ruled Egypt for nearly a century',
            'Powerful female rulers (Candaces)'
        ],
        modernLegacy: 'Modern Sudan and southern Egypt'
    },
    'kongo': {
        name: 'Kingdom of Kongo',
        period: '1390-1914 CE',
        capital: 'Mbanza-Kongo',
        peakPopulation: '2.5-3 million',
        description: 'The Kingdom of Kongo was a sophisticated Central African state with advanced metalworking, agriculture, and complex political systems.',
        achievements: [
            'Sophisticated political confederation',
            'Advanced copper and iron working',
            'Complex agricultural innovations',
            'Early diplomatic contact with Europe'
        ],
        modernLegacy: 'Modern Angola, Democratic Republic of Congo, Republic of Congo'
    },
    'zimbabwe': {
        name: 'Great Zimbabwe',
        period: '1220-1450 CE',
        capital: 'Great Zimbabwe',
        peakPopulation: '18,000-20,000',
        description: 'Great Zimbabwe was a medieval city known for its impressive stone architecture and control of gold trade routes between the interior and Indian Ocean coast.',
        achievements: [
            'Massive stone architecture without mortar',
            'Controlled Indian Ocean gold trade',
            'Advanced cattle domestication',
            'Sophisticated urban planning'
        ],
        modernLegacy: 'Modern Zimbabwe'
    },
    'ethiopia': {
        name: 'Ethiopian Empire',
        period: '1270-1974 CE',
        capital: 'Various (Gondar, Addis Ababa)',
        peakPopulation: '12-15 million (by 1900)',
        description: 'The Ethiopian Empire was one of the few African nations to resist European colonization, maintaining independence and preserving ancient Christian traditions.',
        achievements: [
            'Successfully resisted European colonization',
            'Ancient Christian civilization',
            'Unique calendar and writing system',
            'Original home of coffee cultivation'
        ],
        modernLegacy: 'Modern Ethiopia and Eritrea'
    },

    // Slave Trade Routes
    'senegambia': {
        name: 'Senegambia Region',
        period: '1500-1850',
        enslavedNumbers: '1.2 million',
        description: 'The Senegambia region, including modern Senegal and Gambia, was a major departure point for the transatlantic slave trade.',
        majorPorts: ['Gorée Island', 'Saint-Louis', 'James Island'],
        destinations: ['Caribbean', 'North America', 'South America'],
        culturalImpact: 'Wolof, Mandinka, and Fulani cultural influences spread throughout the Americas'
    },
    'gold-coast': {
        name: 'Gold Coast (Ghana)',
        period: '1471-1850',
        enslavedNumbers: '1 million',
        description: 'The Gold Coast saw the construction of numerous slave castles and became a major hub for the transatlantic slave trade.',
        majorPorts: ['Cape Coast Castle', 'Elmina Castle', 'Fort James'],
        destinations: ['Caribbean', 'Brazil', 'North America'],
        culturalImpact: 'Akan cultural traditions and languages preserved in Caribbean and Americas'
    },
    'west-central': {
        name: 'West Central Africa',
        period: '1500-1850',
        enslavedNumbers: '5.6 million',
        description: 'West Central Africa, primarily Angola and the Congo region, was the largest source of enslaved Africans.',
        majorPorts: ['Luanda', 'Benguela', 'Cabinda'],
        destinations: ['Brazil (primary)', 'Caribbean', 'Spanish Americas'],
        culturalImpact: 'Bantu languages and cultural practices heavily influenced Brazilian and Caribbean cultures'
    },
    'bight-benin': {
        name: 'Bight of Benin',
        period: '1640-1850',
        enslavedNumbers: '1.2 million',
        description: 'The Bight of Benin, including modern Nigeria and Benin, was known as the "Slave Coast" during the peak of the trade.',
        majorPorts: ['Ouidah', 'Lagos', 'Porto-Novo'],
        destinations: ['Haiti', 'Brazil', 'Cuba'],
        culturalImpact: 'Yoruba religious and cultural practices survived and evolved in the Americas'
    },
    'bight-biafra': {
        name: 'Bight of Biafra',
        period: '1650-1850',
        enslavedNumbers: '1.5 million',
        description: 'The Bight of Biafra region contributed significantly to the enslaved population in North America.',
        majorPorts: ['Bonny', 'Calabar', 'New Calabar'],
        destinations: ['Virginia', 'South Carolina', 'Caribbean'],
        culturalImpact: 'Igbo cultural influences and resistance traditions documented in American history'
    },
    'brazil': {
        name: 'Brazil',
        period: '1500-1850',
        receivedNumbers: '4.9 million',
        description: 'Brazil received the largest number of enslaved Africans and developed the largest Afro-descendant population outside Africa.',
        majorRegions: ['Bahia', 'Rio de Janeiro', 'Pernambuco'],
        culturalLegacy: 'Rich Afro-Brazilian culture including Capoeira, Candomblé, and Carnival traditions'
    },
    'caribbean': {
        name: 'Caribbean Islands',
        period: '1500-1850',
        receivedNumbers: '2.3 million',
        description: 'The Caribbean islands became centers of sugar production with brutal plantation conditions.',
        majorRegions: ['Jamaica', 'Haiti', 'Cuba', 'Barbados'],
        culturalLegacy: 'Maroon communities, early independence movements, and vibrant Caribbean cultures'
    },
    'north-america': {
        name: 'North America',
        period: '1619-1860',
        receivedNumbers: '400,000',
        description: 'North America received a smaller percentage but developed into the foundation of African American culture.',
        majorRegions: ['Virginia', 'South Carolina', 'Georgia', 'Louisiana'],
        culturalLegacy: 'Foundation of African American culture and Civil Rights movement'
    },

    // Modern Countries
    'nigeria': {
        name: 'Nigeria',
        population: '220 million',
        diaspora: '17 million+',
        description: 'Nigeria has the largest diaspora of any African country, with significant communities worldwide contributing to global culture and innovation.',
        diasporaCountries: ['United States', 'United Kingdom', 'Canada', 'Germany', 'South Africa'],
        culturalExports: ['Nollywood films', 'Afrobeats music', 'Literature', 'Fashion', 'Cuisine'],
        modernContributions: 'Technology innovation, entertainment industry, academic excellence, entrepreneurship'
    },
    'ghana': {
        name: 'Ghana',
        population: '32 million',
        diaspora: '3 million+',
        description: 'Ghana is a symbol of African independence and Pan-Africanism, with strong cultural ties to its diaspora.',
        diasporaCountries: ['United States', 'United Kingdom', 'Canada', 'Germany'],
        culturalExports: ['Kente cloth', 'Highlife music', 'Year of Return initiative', 'Traditional crafts'],
        modernContributions: 'Pan-African leadership, democratic governance, cultural tourism, gold mining'
    },
    'senegal': {
        name: 'Senegal',
        population: '17 million',
        diaspora: '1 million+',
        description: 'Senegal maintains strong cultural ties with its diaspora and is known for its vibrant arts scene and democratic stability.',
        diasporaCountries: ['France', 'Italy', 'United States', 'Spain'],
        culturalExports: ['Teranga hospitality', 'Mbalax music', 'Wrestling (Laamb)', 'Visual arts'],
        modernContributions: 'Democratic stability, cultural diplomacy, fishing industry, renewable energy'
    },
    'ethiopia': {
        name: 'Ethiopia',
        population: '120 million',
        diaspora: '2 million+',
        description: 'Ethiopia, never fully colonized, maintains ancient traditions while building a modern global diaspora community.',
        diasporaCountries: ['United States', 'Israel', 'Saudi Arabia', 'Sudan'],
        culturalExports: ['Coffee culture', 'Orthodox Christianity', 'Long-distance running', 'Ancient history'],
        modernContributions: 'Coffee industry, athletic excellence, ancient heritage preservation, regional diplomacy'
    },
    'kenya': {
        name: 'Kenya',
        population: '54 million',
        diaspora: '1.5 million+',
        description: 'Kenya has a rapidly growing diaspora, particularly in North America and Europe, known for innovation and athletics.',
        diasporaCountries: ['United States', 'United Kingdom', 'Canada', 'Australia'],
        culturalExports: ['Safari tourism', 'Athletics', 'Tea and coffee', 'Maasai culture'],
        modernContributions: 'Technology hub (Silicon Savannah), conservation leadership, mobile banking innovation'
    },
    'south-africa': {
        name: 'South Africa',
        population: '60 million',
        diaspora: '2.5 million+',
        description: 'South Africa has a complex history and significant diaspora communities worldwide, known for its transition to democracy.',
        diasporaCountries: ['United Kingdom', 'Australia', 'United States', 'Canada'],
        culturalExports: ['Anti-apartheid legacy', 'Wine industry', 'Mining expertise', 'Rainbow Nation concept'],
        modernContributions: 'Human rights leadership, mineral resources, democratic transition model, sports excellence'
    }
};

// Current state
let currentMap = 'pre-slavery';
let sidebarOpen = false;

// Initialize interactive maps
function initializeInteractiveMaps() {
    console.log('Initializing interactive maps...');
    setupMapTabs();
    setupMarkers();
    setupSidebar();
    
    // Show initial map
    showMap('pre-slavery');
}

// Setup map tab functionality
function setupMapTabs() {
    const tabs = document.querySelectorAll('.map-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const mapType = this.getAttribute('data-map');
            if (mapType && mapType !== currentMap) {
                showMap(mapType);
            }
        });
    });
}

// Show specific map
function showMap(mapType) {
    console.log('Switching to map:', mapType);
    currentMap = mapType;
    
    // Update tab states
    document.querySelectorAll('.map-tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-map="${mapType}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update map views
    document.querySelectorAll('.map-view').forEach(view => {
        view.classList.remove('active');
    });
    
    const activeMap = document.getElementById(`${mapType}-map`);
    if (activeMap) {
        activeMap.classList.add('active');
    }
    
    // Update legend
    document.querySelectorAll('.legend-items').forEach(legend => {
        legend.classList.remove('active');
    });
    
    const activeLegend = document.querySelector(`.${mapType}-legend`);
    if (activeLegend) {
        activeLegend.classList.add('active');
    }
    
    // Close sidebar when switching maps
    closeSidebar();
}

// Setup marker interactions
function setupMarkers() {
    const markers = document.querySelectorAll('.marker');
    
    markers.forEach(marker => {
        // Click handler
        marker.addEventListener('click', function(e) {
            e.stopPropagation();
            handleMarkerClick(this);
        });
        
        // Make markers keyboard accessible
        marker.setAttribute('tabindex', '0');
        marker.setAttribute('role', 'button');
        
        // Keyboard handler
        marker.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMarkerClick(this);
            }
        });
        
        // Add tooltip data attribute for accessibility
        const tooltip = marker.getAttribute('data-tooltip');
        if (tooltip) {
            marker.setAttribute('aria-label', tooltip);
        }
    });
}

// Handle marker clicks
function handleMarkerClick(marker) {
    const regionKey = marker.getAttribute('data-region');
    const regionInfo = regionData[regionKey];
    
    if (regionInfo) {
        // Remove selection from other markers
        document.querySelectorAll('.marker').forEach(m => {
            m.classList.remove('selected');
        });
        
        // Select current marker
        marker.classList.add('selected');
        
        // Show information in sidebar
        showRegionInfo(regionInfo);
        
        // Track analytics if available
        if (window.DiasporaHub && window.DiasporaHub.Analytics) {
            window.DiasporaHub.Analytics.track('marker_click', {
                region: regionKey,
                map: currentMap,
                timestamp: new Date().toISOString()
            });
        }
    }
}

// Show region information in sidebar
function showRegionInfo(regionInfo) {
    const sidebar = document.getElementById('info-sidebar');
    const title = document.getElementById('sidebar-title');
    const content = document.getElementById('sidebar-content');
    
    if (!sidebar || !title || !content) return;
    
    title.textContent = regionInfo.name;
    content.innerHTML = generateRegionContent(regionInfo);
    
    // Show sidebar (especially important for mobile)
    sidebar.classList.add('active');
    sidebarOpen = true;
}

// Generate content based on region type
function generateRegionContent(info) {
    let html = '<div class="region-info">';
    
    // Header with period/timeframe
    if (info.period) {
        html += `
            <div class="region-header">
                <div class="region-title">${info.name}</div>
                <div class="region-period">${info.period}</div>
            </div>
        `;
    } else {
        html += `
            <div class="region-header">
                <div class="region-title">${info.name}</div>
            </div>
        `;
    }
    
    // Description
    html += `<div class="region-description">${info.description}</div>`;
    
    // Stats section
    html += '<div class="region-stats"><h4>Key Information</h4>';
    
    if (info.capital) {
        html += `<div class="stat-row"><span class="stat-label">Capital:</span><span class="stat-value">${info.capital}</span></div>`;
    }
    
    if (info.peakPopulation) {
        html += `<div class="stat-row"><span class="stat-label">Peak Population:</span><span class="stat-value">${info.peakPopulation}</span></div>`;
    }
    
    if (info.population) {
        html += `<div class="stat-row"><span class="stat-label">Population:</span><span class="stat-value">${info.population}</span></div>`;
    }
    
    if (info.diaspora) {
        html += `<div class="stat-row"><span class="stat-label">Global Diaspora:</span><span class="stat-value">${info.diaspora}</span></div>`;
    }
    
    if (info.enslavedNumbers) {
        html += `<div class="stat-row"><span class="stat-label">People Enslaved:</span><span class="stat-value">${info.enslavedNumbers}</span></div>`;
    }
    
    if (info.receivedNumbers) {
        html += `<div class="stat-row"><span class="stat-label">People Received:</span><span class="stat-value">${info.receivedNumbers}</span></div>`;
    }
    
    html += '</div>';
    
    // Additional sections based on data type
    if (info.achievements) {
        html += '<div class="achievements-section"><h4>Major Achievements</h4><ul>';
        info.achievements.forEach(achievement => {
            html += `<li>${achievement}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (info.majorPorts) {
        html += `<div class="ports-section"><h4>Major Ports</h4><p>${info.majorPorts.join(', ')}</p></div>`;
    }
    
    if (info.culturalExports) {
        html += '<div class="cultural-section"><h4>Cultural Exports</h4><ul>';
        info.culturalExports.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (info.modernLegacy) {
        html += `<div class="legacy-section"><h4>Modern Legacy</h4><p>${info.modernLegacy}</p></div>`;
    }
    
    if (info.culturalImpact) {
        html += `<div class="impact-section"><h4>Cultural Impact</h4><p>${info.culturalImpact}</p></div>`;
    }
    
    if (info.modernContributions) {
        html += `<div class="contributions-section"><h4>Modern Contributions</h4><p>${info.modernContributions}</p></div>`;
    }
    
    html += '</div>';
    
    return html;
}

// Setup sidebar functionality
function setupSidebar() {
    const closeBtn = document.querySelector('.sidebar-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('info-sidebar');
        if (sidebarOpen && sidebar && !sidebar.contains(e.target) && !e.target.closest('.marker')) {
            closeSidebar();
        }
    });
    
    // Close sidebar with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebarOpen) {
            closeSidebar();
        }
    });
}

// Close sidebar and reset
function closeSidebar() {
    const sidebar = document.getElementById('info-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    // Clear selected markers
    document.querySelectorAll('.marker').forEach(marker => {
        marker.classList.remove('selected');
    });
    
    // Reset sidebar content
    const title = document.getElementById('sidebar-title');
    const content = document.getElementById('sidebar-content');
    
    if (title) title.textContent = 'Select a Region';
    if (content) {
        content.innerHTML = `
            <div class="default-content">
                <div class="instruction-icon">
                    <i class="fas fa-hand-pointer"></i>
                </div>
                <p>Click on any marker to explore detailed information about African heritage and diaspora connections.</p>
            </div>
        `;
    }
    
    sidebarOpen = false;
}

// Legacy function support for backward compatibility
function switchMap(mapType) {
    showMap(mapType);
}

function loadCountryProfile(countryName) {
    const regionKey = countryName.toLowerCase();
    const regionInfo = regionData[regionKey];
    if (regionInfo) {
        showRegionInfo(regionInfo);
    }
}

function closeCountryProfile() {
    closeSidebar();
}

function filterMap(type) {
    const mapping = {
        'migration': 'modern-borders',
        'cultural': 'modern-borders',
        'historical': 'pre-slavery',
        'trade': 'slave-trade'
    };
    showMap(mapping[type] || 'modern-borders');
}

// Utility function to handle window resize (maintain marker positions)
function handleResize() {
    // Markers maintain their percentage-based positions automatically
    // This function can be used for additional responsive adjustments if needed
    console.log('Window resized - markers maintain relative positions');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.interactive-map-container')) {
        initializeInteractiveMaps();
        
        // Add resize listener for potential future enhancements
        window.addEventListener('resize', handleResize);
    }
});

// Global exports for legacy compatibility
window.MapsInteractive = {
    showMap,
    closeSidebar,
    switchMap,
    loadCountryProfile,
    closeCountryProfile,
    filterMap,
    handleResize
};

// Additional helper functions for potential AI integration
function generateAIInsights(regionKey) {
    // Check if AI service is available
    if (window.AIService && window.AIService.isConfigured && window.AIService.isConfigured()) {
        const regionInfo = regionData[regionKey];
        if (regionInfo) {
            const prompt = `Provide additional historical insights about ${regionInfo.name}. Focus on lesser-known facts and cultural significance.`;
            
            window.AIService.generateCountrySummary(regionInfo.name, prompt)
                .then(insights => {
                    // Add AI insights to sidebar if currently open
                    const content = document.getElementById('sidebar-content');
                    if (content && sidebarOpen) {
                        const aiSection = document.createElement('div');
                        aiSection.className = 'ai-insights-section';
                        aiSection.innerHTML = `
                            <h4><i class="fas fa-robot"></i> AI Insights</h4>
                            <p>${insights}</p>
                        `;
                        content.appendChild(aiSection);
                    }
                })
                .catch(error => {
                    console.warn('AI insights not available:', error);
                });
        }
    }
}

// Export AI function for potential use
window.MapsInteractive.generateAIInsights = generateAIInsights;