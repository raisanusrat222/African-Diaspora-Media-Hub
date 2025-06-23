// Country data with diaspora information
const countryData = [
    {
        name: 'Nigeria',
        region: 'West Africa',
        diaspora: '17M+',
        destinations: '180+',
        culturalCenters: '450+',
        flagImage: 'assets/images/countries/flags/nigeria flag.gif',
        summary: 'Nigeria has one of the largest diasporas in the world, with over 17 million Nigerians living abroad. The diaspora is particularly strong in the United States, United Kingdom, Canada, and other African countries. Nigerian communities have made significant contributions to business, academia, medicine, and the arts globally. The country maintains strong cultural ties through organizations, festivals, and remittance flows that significantly impact the homeland economy.',
        keywords: ['west africa', 'lagos', 'abuja', 'yoruba', 'igbo', 'hausa']
    },
    {
        name: 'Jamaica',
        region: 'Caribbean',
        diaspora: '3.5M+',
        destinations: '25+',
        culturalCenters: '120+',
        flagImage: 'assets/images/countries/flags/jamaica flag.webp',
        summary: 'Jamaica has a vibrant diaspora community spread across North America, the United Kingdom, and other Caribbean nations. The Jamaican diaspora has profoundly influenced global music, sports, and culture, with reggae music and Rastafarian culture gaining worldwide recognition. Communities in cities like New York, London, and Toronto maintain strong connections to their homeland through cultural festivals, cuisine, and family networks.',
        keywords: ['caribbean', 'kingston', 'reggae', 'rastafarian', 'patois', 'marley']
    },
    {
        name: 'Ghana',
        region: 'West Africa',
        diaspora: '3.2M+',
        destinations: '75+',
        culturalCenters: '200+',
        flagImage: 'assets/images/countries/flags/ghana flag.gif',
        summary: 'Ghana has a significant diaspora community worldwide, with many Ghanaians living in the United States, United Kingdom, Germany, and neighboring African countries. The country has been a leader in promoting diaspora engagement through initiatives like the Year of Return and Beyond the Return programs, encouraging African Americans and other diaspora members to connect with their roots. Ghanaian communities abroad are known for their entrepreneurship and cultural preservation.',
        keywords: ['west africa', 'accra', 'akan', 'twi', 'kente', 'year of return']
    },
    {
        name: 'Ethiopia',
        region: 'East Africa',
        diaspora: '2.8M+',
        destinations: '50+',
        culturalCenters: '180+',
        flagImage: 'assets/images/countries/flags/ethiopia.png',
        summary: 'Ethiopia has a diverse diaspora community spread across the globe, with significant populations in the United States, Saudi Arabia, Sudan, and European countries. The Ethiopian diaspora maintains strong cultural connections through Orthodox Christianity, traditional cuisine, and the celebration of holidays like Timkat and Meskel. The community has been instrumental in supporting development projects and maintaining cultural institutions abroad.',
        keywords: ['east africa', 'addis ababa', 'amharic', 'orthodox', 'injera', 'timkat']
    },
    {
        name: 'South Africa',
        region: 'Southern Africa',
        diaspora: '2.5M+',
        destinations: '40+',
        culturalCenters: '150+',
        flagImage: 'assets/images/countries/flags/south africa flag.gif',
        summary: 'South Africa has diaspora communities worldwide, formed through various historical periods including apartheid exile and recent economic migration. Major communities exist in Australia, the United Kingdom, United States, and other African countries. The diaspora includes diverse groups reflecting South Africa\'s multicultural society, maintaining connections through cultural organizations, sports, and business networks.',
        keywords: ['southern africa', 'cape town', 'johannesburg', 'apartheid', 'mandela', 'ubuntu']
    },
    {
        name: 'Kenya',
        region: 'East Africa',
        diaspora: '3M+',
        destinations: '60+',
        culturalCenters: '140+',
        flagImage: 'assets/images/countries/flags/kenya.png',
        summary: 'Kenya has a growing diaspora community with significant populations in the United States, United Kingdom, Canada, and other African countries. Kenyan communities abroad are known for their active civic engagement and contributions to education and healthcare. The diaspora maintains strong ties through cultural festivals, professional associations, and support for development projects in Kenya.',
        keywords: ['east africa', 'nairobi', 'swahili', 'maasai', 'safari', 'harambee']
    },
    {
        name: 'Senegal',
        region: 'West Africa',
        diaspora: '1.8M+',
        destinations: '45+',
        culturalCenters: '90+',
        flagImage: 'assets/images/countries/flags/senegal flag.gif',
        summary: 'Senegal has a notable diaspora community, particularly in France, Italy, Spain, and the United States, reflecting historical and linguistic ties. The Senegalese diaspora is known for its strong business networks, particularly in trade and services. Cultural connections are maintained through Wolof language, Islamic traditions, and the celebration of festivals like Tabaski.',
        keywords: ['west africa', 'dakar', 'wolof', 'islam', 'teranga', 'baobab']
    },
    {
        name: 'Haiti',
        region: 'Caribbean',
        diaspora: '2.5M+',
        destinations: '35+',
        culturalCenters: '110+',
        flagImage: 'assets/images/countries/flags/haiti flag.webp',
        summary: 'Haiti has a significant diaspora community, with large populations in the United States, Canada, France, and other Caribbean countries. The Haitian diaspora has maintained strong cultural connections through Creole language, Vodou traditions, and vibrant arts communities. Remittances from the diaspora play a crucial role in Haiti\'s economy, and cultural festivals worldwide celebrate Haitian heritage.',
        keywords: ['caribbean', 'port-au-prince', 'creole', 'vodou', 'kompa', 'revolution']
    },
    {
        name: 'Brazil',
        region: 'South America',
        diaspora: '4.5M+',
        destinations: '70+',
        culturalCenters: '200+',
        flagImage: 'assets/images/countries/flags/brazil flag.gif',
        summary: 'Brazil has a diverse diaspora reflecting its multicultural society, with significant Afro-Brazilian communities in the United States, Europe, and other Latin American countries. The diaspora includes descendants of enslaved Africans who have maintained cultural traditions through capoeira, samba, candomblé, and other expressions. Brazilian communities abroad celebrate their heritage through festivals and cultural centers.',
        keywords: ['south america', 'rio de janeiro', 'sao paulo', 'portuguese', 'samba', 'capoeira', 'carnival']
    },
    {
        name: 'Trinidad and Tobago',
        region: 'Caribbean',
        diaspora: '800K+',
        destinations: '25+',
        culturalCenters: '60+',
        flagImage: 'assets/images/countries/flags/trinidad-tobago.png',
        summary: 'Trinidad and Tobago has a vibrant diaspora community, particularly in North America and the United Kingdom. The diaspora has significantly influenced global culture through calypso and soca music, steel pan, and Carnival celebrations. Communities abroad maintain strong connections through cultural festivals, cuisine, and professional networks.',
        keywords: ['caribbean', 'port of spain', 'calypso', 'soca', 'steel pan', 'carnival', 'doubles']
    }
];

// Initialize country search functionality
function initializeCountrySearch() {
    const searchInput = document.getElementById('country-search-input');
    const searchBtn = document.getElementById('country-search-btn');
    const suggestions = document.getElementById('country-suggestions');

    if (!searchInput || !searchBtn || !suggestions) return;

    // Event listeners
    searchInput.addEventListener('input', debounce(handleCountrySearchInput, 300));
    searchInput.addEventListener('focus', handleCountrySearchFocus);
    searchBtn.addEventListener('click', handleCountrySearchSubmit);
    
    // Handle click outside to close suggestions
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            hideSuggestions();
        }
    });

    // Handle enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstSuggestion = suggestions.querySelector('.country-suggestion-item');
            if (firstSuggestion) {
                firstSuggestion.click();
            }
        }
    });
}

function handleCountrySearchInput(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length >= 2) {
        const matches = findCountryMatches(query);
        displaySuggestions(matches);
    } else {
        hideSuggestions();
    }
}

function handleCountrySearchFocus(e) {
    const query = e.target.value.trim().toLowerCase();
    if (query.length >= 2) {
        const matches = findCountryMatches(query);
        displaySuggestions(matches);
    }
}

function handleCountrySearchSubmit() {
    const query = document.getElementById('country-search-input').value.trim();
    if (query.length >= 2) {
        const matches = findCountryMatches(query.toLowerCase());
        if (matches.length > 0) {
            selectCountry(matches[0]);
        }
    }
}

function findCountryMatches(query) {
    return countryData.filter(country => {
        return country.name.toLowerCase().includes(query) ||
               country.region.toLowerCase().includes(query) ||
               country.keywords.some(keyword => keyword.includes(query));
    }).slice(0, 5);
}

function displaySuggestions(matches) {
    const suggestions = document.getElementById('country-suggestions');
    
    if (matches.length === 0) {
        suggestions.innerHTML = `
            <div class="country-suggestion-item">
                <i class="fas fa-search"></i>
                <div class="suggestion-info">
                    <h4>No countries found</h4>
                    <p>Try searching for Nigeria, Jamaica, Ghana, or other countries</p>
                </div>
            </div>
        `;
    } else {
        suggestions.innerHTML = matches.map(country => `
            <div class="country-suggestion-item" onclick="selectCountry(${JSON.stringify(country).replace(/"/g, '&quot;')})">
                <i class="fas fa-globe-africa"></i>
                <div class="suggestion-info">
                    <h4>${country.name}</h4>
                    <p>${country.region} • ${country.diaspora} diaspora</p>
                </div>
            </div>
        `).join('');
    }
    
    suggestions.classList.add('show');
}

function hideSuggestions() {
    const suggestions = document.getElementById('country-suggestions');
    if (suggestions) {
        suggestions.classList.remove('show');
    }
}

function selectCountry(country) {
    console.log('Country selected:', country.name);
    
    const searchInput = document.getElementById('country-search-input');
    const summaryContainer = document.getElementById('ai-summary-container');
    
    // Update search input
    searchInput.value = country.name;
    
    // Hide suggestions
    hideSuggestions();
    
    // Show and populate summary
    showAISummary(country);
    
    // Scroll to summary
    setTimeout(() => {
        if (summaryContainer) {
            summaryContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 300);
}

function showAISummary(country) {
    console.log('Showing AI summary for:', country.name);
    
    const summaryContainer = document.getElementById('ai-summary-container');
    const countryName = document.getElementById('country-name');
    const countryRegion = document.getElementById('country-region');
    const summaryLoading = document.getElementById('summary-loading');
    const summaryText = document.getElementById('summary-text');
    const summaryStats = document.getElementById('summary-stats');
    const diasporaPopulation = document.getElementById('diaspora-population');
    const mainDestinations = document.getElementById('main-destinations');
    const culturalCenters = document.getElementById('cultural-centers');
    const flagImage = document.querySelector('.country-flag-image');
    const flagIcon = document.querySelector('.country-flag-placeholder i');
    
    // Update header information
    if (countryName) countryName.textContent = country.name;
    if (countryRegion) countryRegion.textContent = country.region;
    
    // Handle flag image
    if (country.flagImage && flagImage && flagIcon) {
        flagIcon.style.display = 'none';
        flagImage.style.display = 'block';
        flagImage.src = country.flagImage;
        flagImage.alt = country.name + ' flag';
        
        flagImage.onload = function() {
            console.log('Flag loaded for', country.name);
            flagIcon.style.display = 'none';
            flagImage.style.display = 'block';
        };
        
        flagImage.onerror = function() {
            console.log('Flag failed to load for', country.name);
            flagImage.style.display = 'none';
            flagIcon.style.display = 'flex';
        };
    }
    
    // Show container
    if (summaryContainer) {
        summaryContainer.style.display = 'block';
        summaryContainer.classList.add('show');
    }
    
    // Show loading state
    if (summaryLoading) summaryLoading.style.display = 'block';
    if (summaryText) summaryText.style.display = 'none';
    if (summaryStats) summaryStats.style.display = 'none';
    
    // Show static content first
    setTimeout(() => {
        console.log('Showing static content...');
        
        // Hide loading
        if (summaryLoading) summaryLoading.style.display = 'none';
        
        // Show static content
        if (summaryText) {
            summaryText.innerHTML = '<p>' + country.summary + '</p>';
            summaryText.style.display = 'block';
        }
        
        // Update stats
        if (diasporaPopulation) diasporaPopulation.textContent = country.diaspora;
        if (mainDestinations) mainDestinations.textContent = country.destinations;
        if (culturalCenters) culturalCenters.textContent = country.culturalCenters;
        
        if (summaryStats) summaryStats.style.display = 'grid';
        
        // Animate stats
        setTimeout(() => {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                }, index * 100);
            });
        }, 300);
        
        // NOW trigger AI enhancement
        setTimeout(() => {
            triggerAIEnhancement(country);
        }, 1000);
        
    }, 1000);
}

// Trigger AI enhancement function
function triggerAIEnhancement(country) {
    console.log('Triggering AI enhancement for:', country.name);
    
    // Check if AI is available
    if (window.secureAIConfigInstance && window.secureAIConfigInstance.initialized) {
        console.log('AI is available, enhancing content...');
        window.secureAIConfigInstance.enhanceCountrySummaryWithAI(country);
    } else if (window.enhanceWithAI) {
        console.log('Using global AI enhancement function...');
        window.enhanceWithAI(country);
    } else {
        console.log('AI not available:', {
            configInstance: !!window.secureAIConfigInstance,
            initialized: window.secureAIConfigInstance ? window.secureAIConfigInstance.initialized : false,
            enhanceWithAI: !!window.enhanceWithAI
        });
        
        // Show that AI wasn't available
        const summaryText = document.getElementById('summary-text');
        if (summaryText) {
            const aiNote = document.createElement('div');
            aiNote.style.cssText = `
                background: rgba(255, 152, 0, 0.1);
                border: 1px solid rgba(255, 152, 0, 0.3);
                color: #ff9800;
                padding: 8px 12px;
                border-radius: 6px;
                margin-top: 15px;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            aiNote.innerHTML = '<i class="fas fa-info-circle"></i> AI enhancement unavailable - showing static content';
            summaryText.appendChild(aiNote);
        }
    }
}

function exploreCountryMore() {
    const countryName = document.getElementById('country-name');
    const name = countryName ? countryName.textContent : 'this country';
    alert('Exploring more about ' + name + ' diaspora communities...');
}

function shareCountrySummary() {
    const countryName = document.getElementById('country-name');
    const name = countryName ? countryName.textContent : 'diaspora';
    
    if (navigator.share) {
        navigator.share({
            title: name + ' Diaspora Information',
            text: 'Learn about the ' + name + ' diaspora community on Voices of the Diaspora media hub.',
            url: window.location.href
        });
    } else {
        const url = window.location.href;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            });
        } else {
            alert('Share link: ' + url);
        }
    }
}

// Utility function for debouncing
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing country search...');
    initializeCountrySearch();
});