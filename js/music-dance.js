// js/music-dance.js - Complete Music & Dance page functionality

class MusicDanceManager {
    constructor() {
        this.currentGenre = 'afrobeat';
        this.isTransitioning = false;
        this.initialized = false;
        
        // Genre data
        this.genres = this.initializeGenreData();
        
        console.log('🎵 MusicDanceManager initialized');
    }
    
    // Initialize the music dance page
    async initialize() {
        if (this.initialized) return;
        
        console.log('🚀 Initializing music dance page...');
        
        try {
            // Set up event listeners
            this.setupEventListeners();
            
            // Load initial content
            await this.loadGenreContent('afrobeat');
            
            // Initialize animations
            this.initializeAnimations();
            
            this.initialized = true;
            console.log('✅ Music dance page initialization complete');
            
        } catch (error) {
            console.error('❌ Music dance page initialization failed:', error);
        }
    }
    
    // Initialize genre data
    initializeGenreData() {
        return {
            afrobeat: {
                name: "Afrobeat",
                colors: ["#FF6B35", "#F7931E"],
                artist: {
                    name: "Fela Kuti",
                    title: "Pioneer of Afrobeat",
                    image: "assets/images/artists/fela-kuti.jpg",
                    bio: "Fela Anikulapo Kuti created Afrobeat by fusing traditional Yoruba music with jazz, funk, and highlife. His revolutionary music became the voice of political resistance and social consciousness across Africa and beyond.",
                    achievements: ["Grammy Hall of Fame", "Global Icon", "Political Activist", "Musical Innovator"]
                },
                playlist: {
                    title: "Best of Afrobeats 2025",
                    description: "The rhythmic foundation that sparked a global movement",
                    embed: "https://open.spotify.com/embed/playlist/5FDBAbJobJWaKh1RDiqtyn",
                    trackCount: 71
                },
                cultural: {
                    origin: "Lagos, Nigeria",
                    year: "1960s",
                    description: "Born in the vibrant streets of Lagos, Afrobeat emerged as a powerful fusion of traditional Yoruba rhythms with jazz and funk influences. The genre became a vehicle for social and political commentary, spreading across Africa and inspiring global music movements.",
                    impact: "Afrobeat's influence spans from hip-hop to electronic music, with artists worldwide incorporating its complex polyrhythms and conscious messaging."
                },
                timeline: [
                    { year: "1960s", era: "Origins", description: "Fela Kuti develops Afrobeat in Lagos" },
                    { year: "1980s", era: "Expansion", description: "Sound spreads across West Africa" },
                    { year: "2000s", era: "Global Recognition", description: "International artists embrace Afrobeat" },
                    { year: "2020s", era: "Modern Evolution", description: "Afrobeats dominates global charts" }
                ],
                performances: [
                    {
                        title: "Fela Kuti - Live at Glastonbury",
                        artist: "Fela Kuti",
                        image: "assets/images/performances/fela-glastonbury.jpg",
                        description: "Historic performance showcasing Afrobeat's power"
                    },
                    {
                        title: "Burna Boy - Coachella 2022",
                        artist: "Burna Boy",
                        image: "assets/images/performances/burna-coachella.jpg",
                        description: "Modern Afrobeat reaches global audience"
                    }
                ]
            },
            
            reggae: {
                name: "Reggae",
                colors: ["#228B22", "#32CD32"],
                artist: {
                    name: "Bob Marley",
                    title: "Reggae Legend & Global Icon",
                    image: "assets/images/artists/bob-marley.jpg",
                    bio: "Bob Marley transformed reggae from a local Jamaican sound into a global phenomenon. His music carried messages of peace, love, and social justice, making him an international symbol of resistance and unity.",
                    achievements: ["Grammy Lifetime Achievement", "Rock & Roll Hall of Fame", "Global Peace Ambassador", "Cultural Icon"]
                },
                playlist: {
                    title: "Reggae Classics",
                    description: "The roots and culture that moved the world",
                    embed: "https://open.spotify.com/embed/playlist/71R43lBYQZ6JQXH6LmRo1I",
                    trackCount: 84
                },
                cultural: {
                    origin: "Kingston, Jamaica",
                    year: "1960s",
                    description: "Reggae evolved from ska and rocksteady in the ghettos of Kingston, becoming the voice of Jamaica's Rastafarian movement. Its distinctive rhythm and conscious lyrics spread globally, influencing countless musicians and social movements.",
                    impact: "Reggae's message of unity and resistance resonates worldwide, inspiring genres from punk to hip-hop while remaining a powerful force for social change."
                },
                timeline: [
                    { year: "1960s", era: "Birth", description: "Reggae emerges from ska and rocksteady" },
                    { year: "1970s", era: "Global Breakthrough", description: "Bob Marley brings reggae worldwide" },
                    { year: "1980s", era: "Diversification", description: "Dancehall and digital reggae develop" },
                    { year: "2000s", era: "Revival", description: "New generation embraces reggae roots" }
                ],
                performances: [
                    {
                        title: "Bob Marley - One Love Peace Concert",
                        artist: "Bob Marley",
                        image: "assets/images/performances/marley-peace.jpg",
                        description: "Historic concert uniting Jamaica through music"
                    }
                ]
            },
            
            salsa: {
                name: "Salsa",
                colors: ["#DC143C", "#FF6347"],
                artist: {
                    name: "Celia Cruz",
                    title: "Queen of Salsa",
                    image: "assets/images/artists/celia-cruz.jpg",
                    bio: "Celia Cruz brought Afro-Cuban rhythms to the world stage, becoming the undisputed Queen of Salsa. Her powerful voice and vibrant performances made salsa a global phenomenon while celebrating Caribbean heritage.",
                    achievements: ["Grammy Awards", "Latin Music Icon", "Cultural Ambassador", "Salsa Pioneer"]
                },
                playlist: {
                    title: "Salsa Classics",
                    description: "The heat and passion of Caribbean rhythm",
                    embed: "https://open.spotify.com/embed/playlist/37i9dQZF1DX7SeoIaFyTmA",
                    trackCount: 100
                },
                cultural: {
                    origin: "Cuba & New York",
                    year: "1960s",
                    description: "Salsa emerged from the fusion of Afro-Cuban rhythms with Puerto Rican and other Caribbean influences, primarily in New York's Latino communities. The genre became a symbol of Latin pride and cultural identity.",
                    impact: "Salsa's infectious rhythms and passionate dance created a global community, establishing Latin music as a major force in international culture."
                },
                timeline: [
                    { year: "1940s", era: "Foundations", description: "Afro-Cuban rhythms develop" },
                    { year: "1960s", era: "NYC Fusion", description: "Salsa emerges in New York barrios" },
                    { year: "1970s", era: "Golden Age", description: "Salsa explodes globally" },
                    { year: "1990s", era: "Modern Era", description: "New salsa styles emerge worldwide" }
                ],
                performances: [
                    {
                        title: "Celia Cruz - Live at Madison Square Garden",
                        artist: "Celia Cruz",
                        image: "assets/images/performances/celia-msg.jpg",
                        description: "The Queen of Salsa's legendary performance"
                    }
                ]
            },
            
            house: {
                name: "House",
                colors: ["#4B0082", "#8A2BE2"],
                artist: {
                    name: "Frankie Knuckles",
                    title: "Godfather of House Music",
                    image: "assets/images/artists/frankie-knuckles.jpg",
                    bio: "Frankie Knuckles created house music in Chicago's underground clubs, blending disco, soul, and electronic elements. His innovations laid the foundation for modern electronic dance music and club culture worldwide.",
                    achievements: ["Grammy Winner", "House Music Pioneer", "Club Legend", "Cultural Innovator"]
                },
                playlist: {
                    title: "House Music is Black Music",
                    description: "The underground sound that revolutionized dance",
                    embed: "https://open.spotify.com/embed/playlist/5QlmvFsmVSDubwcTLRflbc",
                    trackCount: 124
                },
                cultural: {
                    origin: "Chicago, USA",
                    year: "1980s",
                    description: "House music emerged from Chicago's Black and Latino gay club scene, creating a space for expression and community. The four-on-the-floor beat and soulful vocals became the foundation of modern electronic dance music.",
                    impact: "House music transformed global nightlife and spawned countless electronic genres, while maintaining its roots in underground culture and community building."
                },
                timeline: [
                    { year: "1980s", era: "Birth", description: "House music emerges in Chicago" },
                    { year: "1990s", era: "Global Spread", description: "House conquers European clubs" },
                    { year: "2000s", era: "Mainstream Success", description: "EDM brings house to festivals" },
                    { year: "2010s", era: "Revival", description: "Underground house experiences rebirth" }
                ],
                performances: [
                    {
                        title: "Frankie Knuckles - Live at Warehouse",
                        artist: "Frankie Knuckles",
                        image: "assets/images/performances/knuckles-warehouse.jpg",
                        description: "The birthplace of house music comes alive"
                    }
                ]
            },
            
            kompa: {
                name: "Kompa",
                colors: ["#FF1493", "#FF69B4"],
                artist: {
                    name: "Nemours Jean-Baptiste",
                    title: "Father of Kompa",
                    image: "assets/images/artists/nemours-jean-baptiste.jpg",
                    bio: "Nemours Jean-Baptiste created kompa in Haiti, developing a sophisticated dance music that became the national sound. His orchestral arrangements and romantic lyrics defined Haitian popular music for generations.",
                    achievements: ["Kompa Originator", "Haitian Music Legend", "Cultural Pioneer", "Bandleader Extraordinaire"]
                },
                playlist: {
                    title: "Kompas Love Hits",
                    description: "The rhythm of Haiti",
                    embed: "https://open.spotify.com/embed/playlist/2RBapGnytZlnFLwMkcsdxt",
                    trackCount: 97
                },
                cultural: {
                    origin: "Port-au-Prince, Haiti",
                    year: "1950s",
                    description: "Kompa developed as Haiti's sophisticated answer to international dance music, incorporating French Caribbean influences with indigenous rhythms. The genre became central to Haitian social life and cultural identity.",
                    impact: "Kompa spread throughout the Caribbean diaspora, influencing zouk and other regional styles while maintaining its distinctly Haitian character."
                },
                timeline: [
                    { year: "1950s", era: "Creation", description: "Nemours creates kompa direk" },
                    { year: "1960s", era: "Golden Era", description: "Kompa becomes Haiti's national music" },
                    { year: "1980s", era: "Diaspora", description: "Kompa spreads with Haitian migration" },
                    { year: "2000s", era: "Evolution", description: "Modern kompa incorporates new influences" }
                ],
                performances: [
                    {
                        title: "Nemours Jean-Baptiste - Live in Port-au-Prince",
                        artist: "Nemours Jean-Baptiste",
                        image: "assets/images/performances/nemours-live.jpg",
                        description: "The father of Kompa in his element"
                    }
                ]
            },
            
            gogo: {
                name: "Go-Go",
                colors: ["#1E90FF", "#00BFFF"],
                artist: {
                    name: "Chuck Brown",
                    title: "Godfather of Go-Go",
                    image: "assets/images/artists/chuck-brown.jpg",
                    bio: "Chuck Brown created Go-Go in Washington D.C., developing a uniquely local sound that emphasized live performance and community participation. His percussion-heavy grooves became the soundtrack of D.C.'s Black communities.",
                    achievements: ["Go-Go Creator", "D.C. Music Legend", "Live Performance Master", "Community Builder"]
                },
                playlist: {
                    title: "DC's Best Go-Go",
                    description: "The pocket that never stops",
                    embed: "https://open.spotify.com/embed/playlist/738jm9mt9egPXFV9wX7njG",
                    trackCount: 85
                },
                cultural: {
                    origin: "Washington D.C., USA",
                    year: "1970s",
                    description: "Go-Go emerged in Washington D.C. as a distinctly local musical expression, emphasizing continuous percussion grooves and live audience participation. The genre became central to D.C.'s African American community identity.",
                    impact: "Go-Go remains deeply rooted in D.C. culture while influencing hip-hop and funk, representing the power of hyperlocal musical traditions in an increasingly globalized world."
                },
                timeline: [
                    { year: "1970s", era: "Origins", description: "Chuck Brown develops Go-Go sound" },
                    { year: "1980s", era: "Peak", description: "Go-Go dominates D.C. scene" },
                    { year: "1990s", era: "Hip-Hop Era", description: "Go-Go influences mainstream rap" },
                    { year: "2010s", era: "Preservation", description: "Community fights to preserve Go-Go culture" }
                ],
                performances: [
                    {
                        title: "Chuck Brown - Live at Howard Theatre",
                        artist: "Chuck Brown",
                        image: "assets/images/performances/chuck-howard.jpg",
                        description: "Go-Go's godfather in D.C.'s historic venue"
                    }
                ]
            }
        };
    }
    
    // Set up event listeners
    setupEventListeners() {
        console.log('🎛️ Setting up music dance event listeners...');
        
        // Genre tab switching
        const genreTabs = document.querySelectorAll('.genre-tab');
        genreTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const genre = tab.dataset.genre;
                if (genre && genre !== this.currentGenre && !this.isTransitioning) {
                    this.switchGenre(genre);
                }
            });
        });
        
        // Performance card clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.performance-card')) {
                this.handlePerformanceClick(e.target.closest('.performance-card'));
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            const genreKeys = {
                '1': 'afrobeat',
                '2': 'reggae', 
                '3': 'salsa',
                '4': 'house',
                '5': 'kompa',
                '6': 'gogo'
            };
            
            if (genreKeys[e.key] && !this.isTransitioning) {
                this.switchGenre(genreKeys[e.key]);
            }
        });
    }
    
    // Switch to a different genre
    async switchGenre(genre) {
        if (this.isTransitioning || genre === this.currentGenre) return;
        
        console.log('🎵 Switching to genre:', genre);
        this.isTransitioning = true;
        
        try {
            // Update active tab
            this.updateActiveTab(genre);
            
            // Update hero background
            this.updateHeroBackground(genre);
            
            // Load new content with transition
            await this.loadGenreContent(genre);
            
            this.currentGenre = genre;
            
        } catch (error) {
            console.error('❌ Genre switch failed:', error);
        } finally {
            this.isTransitioning = false;
        }
    }
    
    // Update active tab styling
    updateActiveTab(genre) {
        const tabs = document.querySelectorAll('.genre-tab');
        tabs.forEach(tab => {
            if (tab.dataset.genre === genre) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    // Update hero background and patterns
    updateHeroBackground(genre) {
        const heroBackground = document.getElementById('hero-background');
        const culturalPatterns = document.getElementById('cultural-patterns');
        
        if (heroBackground && culturalPatterns) {
            // Remove all genre classes
            const genreClasses = ['afrobeat', 'reggae', 'salsa', 'house', 'kompa', 'gogo'];
            genreClasses.forEach(cls => {
                heroBackground.classList.remove(cls);
                culturalPatterns.classList.remove(cls);
            });
            
            // Add new genre class
            heroBackground.classList.add(genre);
            culturalPatterns.classList.add(genre);
        }
    }
    
    // Load content for a specific genre
    async loadGenreContent(genre) {
        console.log('📄 Loading content for genre:', genre);
        
        const genreData = this.genres[genre];
        if (!genreData) {
            console.error('❌ Genre data not found:', genre);
            return;
        }
        
        // Load all content sections
        await Promise.all([
            this.loadArtistSpotlight(genreData.artist),
            this.loadPlaylist(genreData.playlist),
            this.loadCulturalContext(genreData.cultural),
            this.loadPerformances(genreData.performances),
            this.loadTimeline(genreData.timeline, genreData.name)
        ]);
        
        console.log('✅ Genre content loaded successfully');
    }
    
    // Load artist spotlight content
    async loadArtistSpotlight(artistData) {
        const artistCard = document.getElementById('artist-card');
        if (!artistCard) return;
        
        // Add loading transition
        artistCard.style.opacity = '0.5';
        
        // Simulate loading delay for smooth transition
        await this.delay(300);
        
        artistCard.innerHTML = `
            <img src="${artistData.image}" alt="${artistData.name}" class="artist-photo" 
                 onerror="this.src='assets/images/artists/placeholder.jpg'">
            <div class="artist-name">${artistData.name}</div>
            <div class="artist-title">${artistData.title}</div>
            <div class="artist-bio">${artistData.bio}</div>
            <div class="artist-achievements">
                ${artistData.achievements.map(achievement => 
                    `<span class="achievement-badge">${achievement}</span>`
                ).join('')}
            </div>
        `;
        
        // Fade in
        artistCard.style.opacity = '1';
    }
    
    // Load playlist content
    async loadPlaylist(playlistData) {
        const playlistCard = document.getElementById('playlist-card');
        if (!playlistCard) return;
        
        // Add loading transition
        playlistCard.style.opacity = '0.5';
        
        await this.delay(400);
        
        playlistCard.innerHTML = `
            <iframe src="${playlistData.embed}" 
                    class="playlist-embed" 
                    frameborder="0" 
                    allowtransparency="true" 
                    allow="encrypted-media">
            </iframe>
            <div class="playlist-info">
                <div class="playlist-title">${playlistData.title}</div>
                <div class="playlist-description">${playlistData.description}</div>
                <div class="track-count">${playlistData.trackCount} tracks</div>
            </div>
        `;
        
        playlistCard.style.opacity = '1';
    }
    
    // Load cultural context
    async loadCulturalContext(culturalData) {
        const contextCard = document.getElementById('context-card');
        if (!contextCard) return;
        
        contextCard.style.opacity = '0.5';
        
        await this.delay(500);
        
        contextCard.innerHTML = `
            <div class="context-map">
                <div class="map-pin">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
            </div>
            <div class="context-origin">
                <div class="origin-label">Origin</div>
                <div class="origin-location">${culturalData.origin}</div>
                <div class="origin-year">${culturalData.year}</div>
            </div>
            <div class="context-description">${culturalData.description}</div>
            <div class="cultural-impact">
                <div class="impact-title">Cultural Impact</div>
                <div class="impact-text">${culturalData.impact}</div>
            </div>
        `;
        
        contextCard.style.opacity = '1';
    }
    
    // Load performances
    async loadPerformances(performances) {
        const performancesGrid = document.getElementById('performances-grid');
        if (!performancesGrid || !performances.length) {
            if (performancesGrid) {
                performancesGrid.innerHTML = `
                    <div class="no-performances">
                        <p>Featured performances coming soon...</p>
                    </div>
                `;
            }
            return;
        }
        
        performancesGrid.innerHTML = performances.map(performance => `
            <div class="performance-card" data-performance="${performance.title}">
                <div class="performance-thumbnail">
                    <img src="${performance.image}" alt="${performance.title}" class="performance-image"
                         onerror="this.src='assets/images/performances/placeholder.jpg'">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="performance-info">
                    <div class="performance-title">${performance.title}</div>
                    <div class="performance-artist">${performance.artist}</div>
                    <div class="performance-description">${performance.description}</div>
                </div>
            </div>
        `).join('');
    }
    
    // Load timeline
    async loadTimeline(timelineData, genreName) {
        const timelineContainer = document.getElementById('timeline-content');
        const timelineTitle = document.getElementById('timeline-genre-title');
        
        if (!timelineContainer || !timelineData) return;
        
        // Update title
        if (timelineTitle) {
            timelineTitle.textContent = `${genreName} Evolution`;
        }
        
        timelineContainer.innerHTML = `
            <div class="timeline">
                ${timelineData.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-era">${item.era}</div>
                        <div class="timeline-description">${item.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Handle performance card clicks
    handlePerformanceClick(card) {
        const performanceTitle = card.dataset.performance;
        console.log('🎬 Performance clicked:', performanceTitle);
        
        // Add visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Here you could integrate with video players or external links
        // For now, we'll show a placeholder
        this.showPerformanceModal(performanceTitle);
    }
    
    // Show performance modal (placeholder)
    showPerformanceModal(title) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'performance-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Performance video would be embedded here.</p>
                    <p>Integration with YouTube, Vimeo, or other video platforms coming soon.</p>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.querySelector('.modal-content').style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
        `;
        
        modal.querySelector('.modal-header').style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        `;
        
        modal.querySelector('.modal-close').style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        `;
        
        // Add to DOM
        document.body.appendChild(modal);
        
        // Close handlers
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        modal.querySelector('.modal-close').onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        
        // Close on escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    // Initialize animations
    initializeAnimations() {
        // Add scroll-triggered animations
        this.setupScrollAnimations();
        
        // Add periodic background pattern animations
        this.startPatternAnimations();
        
        console.log('✨ Animations initialized');
    }
    
    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe content sections
        const sections = document.querySelectorAll('.content-column, .performance-card, .timeline-item');
        sections.forEach(section => observer.observe(section));
    }
    
    // Start pattern animations
    startPatternAnimations() {
        const patterns = document.getElementById('cultural-patterns');
        if (patterns) {
            patterns.style.animation = 'patternFloat 20s infinite linear';
        }
    }
    
    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Get current genre data
    getCurrentGenreData() {
        return this.genres[this.currentGenre];
    }
    
    // Public method to switch genre (for external use)
    switchToGenre(genre) {
        if (this.genres[genre]) {
            this.switchGenre(genre);
        } else {
            console.warn('❌ Unknown genre:', genre);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 DOM ready, initializing Music & Dance page...');
    
    // Create global instance
    window.musicDanceManager = new MusicDanceManager();
    
    // Initialize the page
    window.musicDanceManager.initialize();
    
    // Add CSS animation classes
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .performance-modal {
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .content-column {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .content-column.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .performance-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
        }
        
        .performance-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .timeline-item {
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.5s ease;
        }
        
        .timeline-item.animate-in {
            opacity: 1;
            transform: scale(1);
        }
        
        /* Enhanced hover effects */
        .genre-tab {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .genre-tab:hover {
            transform: translateY(-8px) scale(1.05);
        }
        
        .genre-tab:active {
            transform: translateY(-8px) scale(0.95);
        }
        
        /* Loading state improvements */
        .vinyl-loader,
        .waveform-loader,
        .map-loader {
            margin: 20px auto;
        }
        
        /* Responsive timeline adjustments */
        @media (max-width: 768px) {
            .timeline {
                flex-direction: column;
                gap: 20px;
            }
            
            .timeline::before {
                left: 50%;
                top: 0;
                bottom: 0;
                width: 3px;
                height: auto;
            }
            
            .timeline-item {
                max-width: 280px;
                margin: 0 auto;
            }
            
            .genre-tab {
                min-width: 70px;
                padding: 12px 8px;
            }
            
            .genre-icon {
                font-size: 1.2rem;
            }
            
            .performance-modal .modal-content {
                margin: 20px;
                max-width: calc(100vw - 40px);
            }
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
            .hero-title {
                font-size: 2.2rem;
                margin-bottom: 15px;
            }
            
            .hero-subtitle {
                font-size: 1rem;
                margin-bottom: 30px;
            }
            
            .genre-navigation {
                gap: 8px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .genre-tab {
                min-width: 60px;
                padding: 10px 6px;
            }
            
            .genre-tab span {
                font-size: 0.7rem;
            }
            
            .artist-photo {
                width: 100px;
                height: 100px;
            }
            
            .artist-name {
                font-size: 1.3rem;
            }
            
            .playlist-embed {
                height: 180px;
            }
            
            .timeline-item {
                padding: 15px;
                max-width: 250px;
            }
            
            .timeline-year {
                font-size: 1rem;
            }
            
            .timeline-description {
                font-size: 0.8rem;
            }
        }
        
        /* Performance optimizations */
        .content-column,
        .performance-card,
        .timeline-item {
            will-change: transform, opacity;
        }
        
        .genre-tab {
            will-change: transform;
        }
        
        /* Focus states for accessibility */
        .genre-tab:focus,
        .performance-card:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        .modal-close:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .content-column,
            .performance-card,
            .timeline-item,
            .genre-tab {
                transition: none;
                animation: none;
            }
            
            .cultural-patterns {
                animation: none;
            }
            
            .vinyl-loader {
                animation: none;
                border-top-color: var(--primary-color);
            }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .genre-tab {
                border-width: 3px;
            }
            
            .performance-card {
                border: 2px solid var(--dark-color);
            }
            
            .timeline-item {
                border-width: 4px;
            }
        }
        
        /* Print styles */
        @media print {
            .music-hero,
            .genre-navigation,
            .playlist-embed,
            .performance-modal {
                display: none;
            }
            
            .content-grid {
                display: block;
            }
            
            .content-column {
                break-inside: avoid;
                margin-bottom: 20px;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicDanceManager;
}

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    // Skip if we're in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (window.musicDanceManager) {
                e.preventDefault();
                window.musicDanceManager.navigateGenres(-1);
            }
            break;
        case 'ArrowRight':
            if (window.musicDanceManager) {
                e.preventDefault();
                window.musicDanceManager.navigateGenres(1);
            }
            break;
        case 'Escape':
            // Close any open modals
            const modal = document.querySelector('.performance-modal');
            if (modal) {
                modal.click();
            }
            break;
    }
});

// Add genre navigation method to the class
MusicDanceManager.prototype.navigateGenres = function(direction) {
    const genres = Object.keys(this.genres);
    const currentIndex = genres.indexOf(this.currentGenre);
    let newIndex = currentIndex + direction;
    
    // Wrap around
    if (newIndex >= genres.length) newIndex = 0;
    if (newIndex < 0) newIndex = genres.length - 1;
    
    this.switchGenre(genres[newIndex]);
};

// Add method to handle external playlist links
MusicDanceManager.prototype.openExternalPlaylist = function(platform, playlistId) {
    const urls = {
        spotify: `https://open.spotify.com/playlist/${playlistId}`,
        apple: `https://music.apple.com/playlist/${playlistId}`,
        youtube: `https://youtube.com/playlist?list=${playlistId}`
    };
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
    }
};

// Add social sharing functionality
MusicDanceManager.prototype.shareGenre = function(genre, platform) {
    const genreData = this.genres[genre];
    if (!genreData) return;
    
    const shareText = `Check out ${genreData.name} music and culture on Voices of the Diaspora!`;
    const shareUrl = `${window.location.origin}${window.location.pathname}#${genre}`;
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
};

// Add analytics tracking (placeholder)
MusicDanceManager.prototype.trackEvent = function(action, genre, details = {}) {
    // Placeholder for analytics integration
    console.log('📊 Event tracked:', {
        action,
        genre,
        timestamp: new Date().toISOString(),
        ...details
    });
    
    // Here you would integrate with Google Analytics, Mixpanel, etc.
    // Example: gtag('event', action, { genre, ...details });
};

// URL hash navigation for deep linking
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (window.musicDanceManager && window.musicDanceManager.genres[hash]) {
        window.musicDanceManager.switchToGenre(hash);
    }
});

// Initialize hash navigation on load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && window.musicDanceManager && window.musicDanceManager.genres[hash]) {
        setTimeout(() => {
            window.musicDanceManager.switchToGenre(hash);
        }, 1000);
    }
});

// Service Worker registration for offline support (if available)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('🔧 Service Worker registered:', registration);
        })
        .catch(error => {
            console.log('❌ Service Worker registration failed:', error);
        });
}

// Add touch gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold && window.musicDanceManager) {
        if (diff > 0) {
            // Swipe left - next genre
            window.musicDanceManager.navigateGenres(1);
        } else {
            // Swipe right - previous genre  
            window.musicDanceManager.navigateGenres(-1);
        }
    }
}

console.log('🎵 Music & Dance JavaScript fully loaded and ready!');