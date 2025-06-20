// maps-interactive.js

// Country profile data
const countryProfiles = {
    'Nigeria': {
        flag: 'assets/images/countries/flags/nigeria flag.gif',
        anthem: 'Arise, O Compatriots',
        religion: 'Christianity (50%), Islam (45%), Traditional (5%)',
        overview: {
            history: 'Nigeria\'s history spans over 2,000 years, featuring powerful kingdoms like Nok, Ife, and Benin. The region experienced significant involvement in the transatlantic slave trade from the 15th-19th centuries.',
            slaveTradeRole: 'Major source region with an estimated 1.5 million people enslaved and transported. Key departure ports included Lagos, Bonny, and Calabar.',
            familyStructure: 'Extended family systems with strong kinship bonds. Traditional polygamous and patriarchal structures, though modernizing.',
            communityStructure: 'Village-based communities led by traditional rulers (Obas, Emirs, Obi). Age-grade associations and title societies maintain social order.'
        },
        culture: {
            festivals: ['Osun Festival', 'Durbar Festival', 'New Yam Festival', 'Eyo Festival'],
            foods: ['Jollof Rice', 'Pounded Yam', 'Egusi Soup', 'Suya', 'Akara'],
            dress: ['Agbada', 'Kaftan', 'Wrapper and Blouse', 'Ankara fabrics'],
            music: ['Afrobeat', 'Highlife', 'Fuji', 'Traditional drumming']
        },
        heritage: {
            thenNow: [
                {
                    category: 'Music',
                    then: 'Traditional drumming and folk songs',
                    now: 'Afrobeats and global fusion',
                    thenImage: 'assets/images/heritage/nigeria-traditional-music.jpg',
                    nowImage: 'assets/images/heritage/nigeria-modern-music.jpg'
                },
                {
                    category: 'Food',
                    then: 'Simple grains and vegetables',
                    now: 'Complex spiced dishes and global influences',
                    thenImage: 'assets/images/heritage/nigeria-traditional-food.jpg',
                    nowImage: 'assets/images/heritage/nigeria-modern-food.jpg'
                }
            ],
            videos: [
                {
                    title: 'Traditional Yoruba Wedding Ceremony',
                    description: 'Experience the rich traditions of a Yoruba wedding',
                    thumbnail: 'assets/images/videos/yoruba-wedding-thumb.jpg'
                },
                {
                    title: 'Igbo Masquerade Festival',
                    description: 'Ancient spiritual traditions brought to life',
                    thumbnail: 'assets/images/videos/igbo-masquerade-thumb.jpg'
                }
            ]
        }
    },
    'Ghana': {
        flag: 'assets/images/countries/flags/ghana flag.gif',
        anthem: 'God Bless Our Homeland Ghana',
        religion: 'Christianity (71%), Islam (18%), Traditional (5%)',
        overview: {
            history: 'Ancient Ghana Empire was a major gold trading center. The region later saw the rise of Ashanti Kingdom and significant involvement in Atlantic trade.',
            slaveTradeRole: 'Central hub with Cape Coast and Elmina castles. An estimated 1 million people were enslaved and shipped from Ghanaian ports.',
            familyStructure: 'Matrilineal and patrilineal systems coexist. Extended family networks provide social security and identity.',
            communityStructure: 'Traditional chieftaincy system with paramount chiefs. Community decisions made through council of elders.'
        },
        culture: {
            festivals: ['Homowo Festival', 'Yam Festival', 'Akwasidae', 'Panafest'],
            foods: ['Fufu', 'Banku', 'Kelewele', 'Red Red', 'Waakye'],
            dress: ['Kente cloth', 'Smock', 'Adinkra prints', 'Traditional sandals'],
            music: ['Highlife', 'Hiplife', 'Traditional drumming', 'Azonto']
        },
        heritage: {
            thenNow: [
                {
                    category: 'Textiles',
                    then: 'Hand-woven Kente on wooden looms',
                    now: 'Machine-made Kente and modern fashion',
                    thenImage: 'assets/images/heritage/ghana-traditional-kente.jpg',
                    nowImage: 'assets/images/heritage/ghana-modern-kente.jpg'
                }
            ],
            videos: [
                {
                    title: 'Ashanti Royal Ceremony',
                    description: 'Traditional coronation and cultural displays',
                    thumbnail: 'assets/images/videos/ashanti-ceremony-thumb.jpg'
                }
            ]
        }
    },
    'Senegal': {
        flag: 'assets/images/countries/flags/senegal flag.gif',
        anthem: 'Pincez Tous vos Koras, Frappez les Balafons',
        religion: 'Islam (96%), Christianity (3%), Traditional (1%)',
        overview: {
            history: 'Historical kingdoms of Wolof, Serer, and Fula. Gorée Island became a major slave trading post under European colonization.',
            slaveTradeRole: 'Gorée Island was a crucial departure point. An estimated 500,000 people were enslaved from this region.',
            familyStructure: 'Islamic family structures with strong extended family ties. Polygamy is practiced within Islamic guidelines.',
            communityStructure: 'Islamic brotherhoods (Murids, Tijaniyya) provide social organization alongside traditional village structures.'
        },
        culture: {
            festivals: ['Tabaski', 'Magal', 'Korité', 'Tamkharit'],
            foods: ['Thieboudienne', 'Yassa', 'Mafe', 'Pastels', 'Bissap'],
            dress: ['Boubou', 'Kaftan', 'Wrapper and headwrap', 'Traditional sandals'],
            music: ['Mbalax', 'Sabar drumming', 'Griot traditions', 'Modern Senegalese pop']
        },
        heritage: {
            thenNow: [
                {
                    category: 'Music',
                    then: 'Griot oral traditions and kora music',
                    now: 'Mbalax fusion and international collaborations',
                    thenImage: 'assets/images/heritage/senegal-traditional-griot.jpg',
                    nowImage: 'assets/images/heritage/senegal-modern-music.jpg'
                }
            ],
            videos: [
                {
                    title: 'Griot Storytelling Tradition',
                    description: 'Ancient oral history preservation methods',
                    thumbnail: 'assets/images/videos/griot-tradition-thumb.jpg'
                }
            ]
        }
    },
    'Ethiopia': {
        flag: 'assets/images/countries/flags/ethiopia.png',
        anthem: 'Whedefit Gesgeshi Woude Henate Ethiopia',
        religion: 'Ethiopian Orthodox (44%), Islam (34%), Protestant (19%)',
        overview: {
            history: 'One of the oldest independent nations, never fully colonized. Ancient Kingdom of Aksum was a major trading power.',
            slaveTradeRole: 'Limited involvement in Atlantic trade; more connected to Indian Ocean and Arab slave trades.',
            familyStructure: 'Patriarchal extended families with strong lineage connections. Orthodox Christian and Islamic influences.',
            communityStructure: 'Village councils and traditional assemblies. Religious institutions play central roles in community life.'
        },
        culture: {
            festivals: ['Timkat', 'Meskel', 'Genna', 'Irreecha'],
            foods: ['Injera', 'Doro Wat', 'Kitfo', 'Berbere spice', 'Coffee ceremony'],
            dress: ['Habesha kemis', 'Netela', 'Traditional cotton garments', 'Shamma'],
            music: ['Traditional highland music', 'Ethio-jazz', 'Religious chants', 'Modern Ethiopian pop']
        },
        heritage: {
            thenNow: [
                {
                    category: 'Coffee Culture',
                    then: 'Ancient coffee ceremonies in clay pots',
                    now: 'Traditional ceremonies meet modern coffee culture',
                    thenImage: 'assets/images/heritage/ethiopia-traditional-coffee.jpg',
                    nowImage: 'assets/images/heritage/ethiopia-modern-coffee.jpg'
                }
            ],
            videos: [
                {
                    title: 'Ethiopian Orthodox Timkat Ceremony',
                    description: 'Ancient baptismal celebration traditions',
                    thumbnail: 'assets/images/videos/timkat-ceremony-thumb.jpg'
                }
            ]
        }
    }
};

// Initialize interactive maps functionality
function initializeInteractiveMaps() {
    // Set up map switching
    setupMapTabs();
    
    // Initialize markers
    setupMapMarkers();
    
    // Set up modal functionality
    setupCountryModal();
    
    // Initialize then-now sliders
    initializeThenNowSliders();
}

function setupMapTabs() {
    const mapTabs = document.querySelectorAll('.map-tab-btn');
    
    mapTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const mapType = this.dataset.map;
            switchMap(mapType);
        });
    });
}

function switchMap(mapType) {
    // Update tab states
    document.querySelectorAll('.map-tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-map="${mapType}"]`).classList.add('active');
    
    // Update map views
    document.querySelectorAll('.map-view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${mapType}-map`).classList.add('active');
    
    // Update legend
    document.querySelectorAll('.legend-items').forEach(legend => {
        legend.classList.remove('active');
    });
    document.querySelector(`.${mapType}-legend`).classList.add('active');
    
    // Track analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('map_switch', {
            mapType: mapType,
            timestamp: new Date().toISOString()
        });
    }
}

function setupMapMarkers() {
    // Add click events to markers
    const markers = document.querySelectorAll('.map-marker');
    
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const country = this.dataset.country;
            const kingdom = this.dataset.kingdom;
            
            if (country) {
                loadCountryProfile(country);
            } else if (kingdom) {
                showKingdomInfo(kingdom);
            }
        });
    });
}

function loadCountryProfile(countryName) {
    const profile = countryProfiles[countryName];
    if (!profile) return;
    
    const modal = document.getElementById('country-profile-modal');
    const countryNameEl = document.getElementById('profile-country-name');
    
    countryNameEl.textContent = countryName;
    
    // Load overview tab by default
    switchProfileTab('overview');
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Track analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('country_profile_view', {
            country: countryName,
            timestamp: new Date().toISOString()
        });
    }
}

function switchProfileTab(tabName) {
    const countryName = document.getElementById('profile-country-name').textContent;
    const profile = countryProfiles[countryName];
    if (!profile) return;
    
    // Update tab states
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="switchProfileTab('${tabName}')"]`).classList.add('active');
    
    // Load content based on tab
    const content = document.getElementById('profile-content');
    
    switch(tabName) {
        case 'overview':
            content.innerHTML = generateOverviewContent(profile, countryName);
            break;
        case 'culture':
            content.innerHTML = generateCultureContent(profile);
            break;
        case 'heritage':
            content.innerHTML = generateHeritageContent(profile);
            break;
    }
    
    // Re-initialize sliders if heritage tab
    if (tabName === 'heritage') {
        setTimeout(() => {
            initializeThenNowSliders();
        }, 100);
    }
}

function generateOverviewContent(profile, countryName) {
    return `
        <div class="country-overview">
            <div class="country-header">
                <div class="country-flag">
                    <img src="${profile.flag}" alt="${countryName} flag" style="width: 80px; height: auto; border-radius: 5px;">
                </div>
                <div class="country-details">
                    <h3>National Information</h3>
                    <p><strong>National Anthem:</strong> ${profile.anthem}</p>
                    <p><strong>Dominant Religions:</strong> ${profile.religion}</p>
                </div>
            </div>
            
            <div class="overview-sections">
                <div class="overview-section">
                    <h4><i class="fas fa-scroll"></i> Brief History</h4>
                    <p>${profile.overview.history}</p>
                </div>
                
                <div class="overview-section">
                    <h4><i class="fas fa-ship"></i> Role in Slave Trade</h4>
                    <p>${profile.overview.slaveTradeRole}</p>
                </div>
                
                <div class="overview-section">
                    <h4><i class="fas fa-users"></i> Family Structure</h4>
                    <p>${profile.overview.familyStructure}</p>
                </div>
                
                <div class="overview-section">
                    <h4><i class="fas fa-building"></i> Community Structure</h4>
                    <p>${profile.overview.communityStructure}</p>
                </div>
            </div>
        </div>
    `;
}

function generateCultureContent(profile) {
    return `
        <div class="culture-content">
            <div class="culture-grid">
                <div class="culture-category">
                    <h4><i class="fas fa-calendar"></i> Festivals</h4>
                    <ul class="culture-list">
                        ${profile.culture.festivals.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="culture-category">
                    <h4><i class="fas fa-utensils"></i> Traditional Foods</h4>
                    <ul class="culture-list">
                        ${profile.culture.foods.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="culture-category">
                    <h4><i class="fas fa-tshirt"></i> Traditional Dress</h4>
                    <ul class="culture-list">
                        ${profile.culture.dress.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="culture-category">
                    <h4><i class="fas fa-music"></i> Music & Arts</h4>
                    <ul class="culture-list">
                        ${profile.culture.music.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function generateHeritageContent(profile) {
    const thenNowSliders = profile.heritage.thenNow.map((item, index) => `
        <div class="heritage-item">
            <h4>${item.category}</h4>
            <div class="then-now-slider" data-slider="${index}">
                <div class="slider-container">
                    <div class="slider-image then" style="background-image: url('${item.thenImage}');">
                        <div class="image-placeholder">
                            <i class="fas fa-history"></i>
                            <p>Traditional ${item.category}</p>
                        </div>
                    </div>
                    <div class="slider-image now" style="background-image: url('${item.nowImage}');">
                        <div class="image-placeholder">
                            <i class="fas fa-globe"></i>
                            <p>Modern ${item.category}</p>
                        </div>
                    </div>
                    <div class="slider-divider"></div>
                </div>
                <div class="slider-labels">
                    <div class="slider-label">Then: ${item.then}</div>
                    <div class="slider-label">Now: ${item.now}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    const videos = profile.heritage.videos.map(video => `
        <div class="video-card">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="video-placeholder" style="display: none;">
                    <i class="fas fa-video" style="font-size: 2rem; color: var(--primary-color);"></i>
                </div>
                <button class="video-play-btn" onclick="playHeritageVideo('${video.title}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.description}</p>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="heritage-content">
            <div class="heritage-section">
                <h3><i class="fas fa-exchange-alt"></i> Cultural Evolution</h3>
                <p>Explore how traditions have evolved over time through our interactive sliders.</p>
                ${thenNowSliders}
            </div>
            
            <div class="heritage-section">
                <h3><i class="fas fa-video"></i> Traditional Ceremonies & Practices</h3>
                <div class="heritage-videos">
                    ${videos}
                </div>
            </div>
        </div>
    `;
}

function initializeThenNowSliders() {
    const sliders = document.querySelectorAll('.then-now-slider');
    
    sliders.forEach(slider => {
        const divider = slider.querySelector('.slider-divider');
        const thenImage = slider.querySelector('.slider-image.then');
        const nowImage = slider.querySelector('.slider-image.now');
        
        let isDragging = false;
        
        function updateSlider(percentage) {
            thenImage.style.width = percentage + '%';
            nowImage.style.width = (100 - percentage) + '%';
            divider.style.left = percentage + '%';
        }
        
        function startDrag(e) {
            isDragging = true;
            slider.style.cursor = 'ew-resize';
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const rect = slider.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            
            updateSlider(percentage);
        }
        
        function stopDrag() {
            isDragging = false;
            slider.style.cursor = '';
        }
        
        // Mouse events
        divider.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events for mobile
        divider.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDrag);
        
        // Prevent default drag behavior
        divider.addEventListener('dragstart', e => e.preventDefault());
    });
}

function playHeritageVideo(videoTitle) {
    // In a real implementation, this would open a video player
    alert(`Playing video: ${videoTitle}\n\nIn a full implementation, this would open a video player with the cultural heritage content.`);
    
    // Track analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('heritage_video_play', {
            videoTitle: videoTitle,
            timestamp: new Date().toISOString()
        });
    }
}

function showKingdomInfo(kingdom) {
    // Simple kingdom info display
    const kingdomInfo = {
        'mali': 'Mali Empire (1230-1600): One of the wealthiest empires in history, famous for Mansa Musa\'s pilgrimage to Mecca.',
        'songhai': 'Songhai Empire (1464-1591): The largest empire in African history, controlling important trade routes.',
        'kongo': 'Kingdom of Kongo (1390-1914): Powerful Central African kingdom with sophisticated political structure.',
        'ethiopia': 'Ethiopian Empire: One of the oldest continuous civilizations, never fully colonized by Europeans.'
    };
    
    alert(kingdomInfo[kingdom] || 'Ancient African Kingdom - Click to learn more about this historical civilization.');
}

function closeCountryProfile() {
    const modal = document.getElementById('country-profile-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Legacy function for backward compatibility
function filterMap(type) {
    // Map old filter types to new map types
    const typeMapping = {
        'migration': 'trade-routes',
        'cultural': 'modern-borders',
        'historical': 'pre-slavery'
    };
    
    const newType = typeMapping[type] || 'modern-borders';
    switchMap(newType);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the maps page
    if (document.querySelector('.interactive-map-container')) {
        initializeInteractiveMaps();
    }
});

// Export functions for global access
window.MapsInteractive = {
    switchMap,
    loadCountryProfile,
    switchProfileTab,
    closeCountryProfile,
    playHeritageVideo,
    filterMap // Legacy support
};