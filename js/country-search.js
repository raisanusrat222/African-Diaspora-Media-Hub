// country-search.js

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
    const summaryContainer = document.getElementById('ai-summary-container');

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
    }).slice(0, 5); // Limit to 5 results
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
    suggestions.classList.remove('show');
}

function selectCountry(country) {
    const searchInput = document.getElementById('country-search-input');
    const summaryContainer = document.getElementById('ai-summary-container');
    
    // Update search input
    searchInput.value = country.name;
    
    // Hide suggestions
    hideSuggestions();
    
    // Show and populate AI summary
    showAISummary(country);
    
    // Scroll to summary
    setTimeout(() => {
        summaryContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 300);
    
    // Track analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('country_search', {
            country: country.name,
            region: country.region
        });
    }
}

function showAISummary(country) {
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
    countryName.textContent = country.name;
    countryRegion.textContent = country.region;
    
    // Update flag image - try to show the actual flag
    if (country.flagImage && flagImage && flagIcon) {
        // Start with icon hidden and try to load image
        flagIcon.style.display = 'none';
        flagImage.style.display = 'block';
        flagImage.src = country.flagImage;
        flagImage.alt = `${country.name} flag`;
        
        flagImage.onload = function() {
            // Image loaded successfully
            console.log(`Flag loaded for ${country.name}: ${country.flagImage}`);
            flagIcon.style.display = 'none';
            flagImage.style.display = 'block';
        };
        
        flagImage.onerror = function() {
            // Image failed to load, show icon instead
            console.log(`Flag failed to load for ${country.name}: ${country.flagImage}`);
            flagImage.style.display = 'none';
            flagIcon.style.display = 'flex';
        };
    }
    
    // Show container
    summaryContainer.style.display = 'block';
    summaryContainer.classList.add('show');
    
    // Show loading state
    summaryLoading.style.display = 'block';
    summaryText.style.display = 'none';
    summaryStats.style.display = 'none';
    
    // Simulate AI processing delay
    setTimeout(() => {
        // Hide loading
        summaryLoading.style.display = 'none';
        
        // Show content with animation
        summaryText.innerHTML = `<p>${country.summary}</p>`;
        summaryText.style.display = 'block';
        
        // Update stats
        diasporaPopulation.textContent = country.diaspora;
        mainDestinations.textContent = country.destinations;
        culturalCenters.textContent = country.culturalCenters;
        
        summaryStats.style.display = 'grid';
        
        // Animate stats
        setTimeout(() => {
            const statNumbers = summaryStats.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                }, index * 100);
            });
        }, 300);
        
    }, 2000); // 2 second delay to simulate AI processing
}

function exploreCountryMore() {
    const countryName = document.getElementById('country-name').textContent;
    
    // This would typically navigate to a detailed country page
    // For now, we'll show an alert
    alert(`Exploring more about ${countryName} diaspora communities...`);
    
    // Track analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('explore_country_more', {
            country: countryName
        });
    }
}

function shareCountrySummary() {
    const countryName = document.getElementById('country-name').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: `${countryName} Diaspora Information`,
            text: `Learn about the ${countryName} diaspora community on Voices of the Diaspora media hub.`,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        });
    }
    
    // Track analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('share_country_summary', {
            country: countryName
        });
    }
}

// Utility function for debouncing (if not already defined)
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
    initializeCountrySearch();
});