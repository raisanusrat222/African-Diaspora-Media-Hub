// js/art-map-interactive.js - Interactive D3.js Map for Art Evolution

/**
 * Interactive world map for exploring artistic evolution between countries
 * Uses D3.js for map rendering and GSAP for smooth animations
 */
class ArtEvolutionMap {
    constructor(containerId) {
        this.container = d3.select(containerId);
        this.width = 1000;
        this.height = 500;
        this.selectedOrigin = null;
        this.selectedDestination = null;
        this.countries = null;
        this.svg = null;
        this.projection = null;
        this.path = null;
        this.evolutionPath = null;
        
        // Responsive breakpoints
        this.isMobile = window.innerWidth < 768;
        if (this.isMobile) {
            this.width = Math.min(400, window.innerWidth - 40);
            this.height = 300;
        }
        
        this.initializeMap();
        this.setupResponsiveHandlers();
    }

    async initializeMap() {
        try {
            console.log('🗺️ Initializing art evolution map...');
            
            // Create SVG
            this.svg = this.container.append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('class', 'evolution-map');

            // Set up projection
            this.projection = d3.geoNaturalEarth1()
                .scale(this.isMobile ? 120 : 160)
                .translate([this.width/2, this.height/2]);

            this.path = d3.geoPath().projection(this.projection);

            // Load world map data - using a simplified world countries dataset
            await this.loadWorldData();
            
            console.log('✅ Map initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing map:', error);
            this.showMapError();
        }
    }

    async loadWorldData() {
        try {
            // For now, we'll create a simplified dataset with our focus countries
            // In production, you'd load from a TopoJSON file
            const worldData = this.createSimplifiedWorldData();
            this.renderCountries(worldData);
            this.addInteractivity();
            
        } catch (error) {
            console.error('Error loading world data:', error);
            this.createFallbackMap();
        }
    }

    createSimplifiedWorldData() {
        // Simplified country data with approximate coordinates for our focus countries
        const countries = [
            // African Origin Countries
            { name: "Ghana", type: "origin", lat: 7.9465, lng: -1.0232 },
            { name: "Nigeria", type: "origin", lat: 9.0820, lng: 8.6753 },
            { name: "Senegal", type: "origin", lat: 14.4974, lng: -14.4524 },
            { name: "Angola", type: "origin", lat: -11.2027, lng: 17.8739 },
            { name: "Benin", type: "origin", lat: 9.3077, lng: 2.3158 },
            { name: "Burkina Faso", type: "origin", lat: 12.2383, lng: -1.5616 },
            { name: "Cameroon", type: "origin", lat: 7.3697, lng: 12.3547 },
            { name: "Congo", type: "origin", lat: -0.2280, lng: 15.8277 },
            { name: "Côte d'Ivoire", type: "origin", lat: 7.5400, lng: -5.5471 },
            { name: "Liberia", type: "origin", lat: 6.4281, lng: -9.4295 },
            { name: "Mozambique", type: "origin", lat: -18.6657, lng: 35.5296 },
            { name: "Sierra Leone", type: "origin", lat: 8.4606, lng: -11.7799 },
            { name: "South Africa", type: "origin", lat: -30.5595, lng: 22.9375 },
            { name: "Togo", type: "origin", lat: 8.6195, lng: 0.8248 },
            
            // American Destination Countries
            { name: "Brazil", type: "destination", lat: -14.2350, lng: -51.9253 },
            { name: "United States", type: "destination", lat: 37.0902, lng: -95.7129 },
            { name: "Jamaica", type: "destination", lat: 18.1096, lng: -77.2975 },
            { name: "Haiti", type: "destination", lat: 18.9712, lng: -72.2852 },
            { name: "Cuba", type: "destination", lat: 21.5218, lng: -77.7812 },
            { name: "Colombia", type: "destination", lat: 4.5709, lng: -74.2973 },
            { name: "Peru", type: "destination", lat: -9.1900, lng: -75.0152 },
            { name: "Mexico", type: "destination", lat: 23.6345, lng: -102.5528 },
            { name: "Canada", type: "destination", lat: 56.1304, lng: -106.3468 },
            { name: "Dominican Republic", type: "destination", lat: 18.7357, lng: -70.1627 },
            { name: "Costa Rica", type: "destination", lat: 9.7489, lng: -83.7534 },
            { name: "Panama", type: "destination", lat: 8.5380, lng: -80.7821 },
            { name: "Paraguay", type: "destination", lat: -23.4425, lng: -58.4438 },
            { name: "Puerto Rico", type: "destination", lat: 18.2208, lng: -66.5901 },
            { name: "El Salvador", type: "destination", lat: 13.7942, lng: -88.8965 },
            { name: "Honduras", type: "destination", lat: 15.2000, lng: -86.2419 },
            { name: "Nicaragua", type: "destination", lat: 12.8654, lng: -85.2072 }
        ];

        return countries;
    }

    renderCountries(countries) {
        this.countries = countries;
        
        // Create country groups
        const countryGroups = this.svg.selectAll('.country-group')
            .data(countries)
            .enter()
            .append('g')
            .attr('class', d => `country-group ${d.type}-country`)
            .attr('data-country', d => d.name);

        // Add country circles (simplified representation)
        countryGroups.append('circle')
            .attr('class', d => `country ${d.type}-country`)
            .attr('cx', d => this.projection([d.lng, d.lat])[0])
            .attr('cy', d => this.projection([d.lng, d.lat])[1])
            .attr('r', this.isMobile ? 8 : 12)
            .attr('data-country', d => d.name);

        // Add country labels
        countryGroups.append('text')
            .attr('class', 'country-label')
            .attr('x', d => this.projection([d.lng, d.lat])[0])
            .attr('y', d => this.projection([d.lng, d.lat])[1] + (this.isMobile ? 20 : 25))
            .attr('text-anchor', 'middle')
            .style('font-size', this.isMobile ? '10px' : '12px')
            .style('fill', '#333')
            .style('font-weight', '600')
            .text(d => d.name);

        console.log(`🌍 Rendered ${countries.length} countries`);
    }

    addInteractivity() {
        const self = this;
        
        // Add click handlers to countries
        this.svg.selectAll('.country')
            .style('cursor', 'pointer')
            .on('click', function(event, d) {
                self.handleCountryClick(d, this);
            })
            .on('mouseover', function(event, d) {
                self.handleCountryHover(d, this, true);
            })
            .on('mouseout', function(event, d) {
                self.handleCountryHover(d, this, false);
            });

        console.log('🖱️ Interactive handlers added');
    }

    handleCountryClick(countryData, element) {
        const countryName = countryData.name;
        const countryType = countryData.type;

        console.log(`🖱️ Clicked: ${countryName} (${countryType})`);

        if (countryType === 'origin') {
            this.selectOriginCountry(countryData, element);
        } else if (countryType === 'destination' && this.selectedOrigin) {
            this.selectDestinationCountry(countryData, element);
        } else if (countryType === 'destination' && !this.selectedOrigin) {
            this.showCountryInfo(countryData, 'Please select an African country first');
        }
    }

    selectOriginCountry(countryData, element) {
        // Clear previous selections
        this.clearSelections();
        
        // Set new selection
        this.selectedOrigin = countryData;
        
        // Visual feedback
        d3.select(element)
            .classed('selected-origin', true);
            
        // Animate selection
        gsap.to(element, {
            duration: 0.5,
            scale: 1.3,
            transformOrigin: 'center',
            ease: "elastic.out(1, 0.5)"
        });

        // Show country info
        this.showCountryInfo(countryData, 'Origin selected! Now click a destination country in the Americas.');
        
        // Highlight available destinations
        this.highlightDestinations();

        console.log(`🎯 Origin selected: ${countryData.name}`);
    }

    selectDestinationCountry(countryData, element) {
        this.selectedDestination = countryData;
        
        // Visual feedback
        d3.select(element)
            .classed('selected-destination', true);
            
        // Animate selection
        gsap.to(element, {
            duration: 0.5,
            scale: 1.3,
            transformOrigin: 'center',
            ease: "elastic.out(1, 0.5)"
        });

        // Draw evolution path
        this.drawEvolutionPath();
        
        // Show evolution analysis
        this.showEvolutionAnalysis();

        console.log(`🎯 Destination selected: ${countryData.name}`);
        console.log(`🔗 Evolution path: ${this.selectedOrigin.name} → ${countryData.name}`);
    }

    drawEvolutionPath() {
        if (!this.selectedOrigin || !this.selectedDestination) return;

        // Remove existing path
        this.svg.select('.evolution-path').remove();

        // Calculate path coordinates
        const originCoords = this.projection([this.selectedOrigin.lng, this.selectedOrigin.lat]);
        const destCoords = this.projection([this.selectedDestination.lng, this.selectedDestination.lat]);

        // Create curved path
        const pathData = this.createCurvedPath(originCoords, destCoords);

        // Draw path
        this.evolutionPath = this.svg.append('path')
            .attr('class', 'evolution-path')
            .attr('d', pathData)
            .style('stroke', '#d4af37')
            .style('stroke-width', 3)
            .style('fill', 'none')
            .style('stroke-dasharray', '10,5')
            .style('filter', 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6))');

        // Animate path drawing
        const totalLength = this.evolutionPath.node().getTotalLength();
        
        this.evolutionPath
            .style('stroke-dasharray', totalLength + ' ' + totalLength)
            .style('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .style('stroke-dashoffset', 0)
            .on('end', () => {
                // Start flowing animation
                this.evolutionPath
                    .style('stroke-dasharray', '10,5')
                    .style('animation', 'pathFlow 3s linear infinite');
            });

        console.log('🌊 Evolution path drawn and animated');
    }

    createCurvedPath(start, end) {
        // Create a curved path between two points
        const midX = (start[0] + end[0]) / 2;
        const midY = Math.min(start[1], end[1]) - 50; // Curve upward
        
        return `M ${start[0]} ${start[1]} Q ${midX} ${midY} ${end[0]} ${end[1]}`;
    }

    async showEvolutionAnalysis() {
        if (!this.selectedOrigin || !this.selectedDestination) return;

        console.log(`🔍 Starting evolution analysis: ${this.selectedOrigin.name} → ${this.selectedDestination.name}`);

        // Show the evolution analysis section
        const analysisSection = document.getElementById('evolution-analysis-section');
        if (analysisSection) {
            analysisSection.style.display = 'block';
            
            // Smooth scroll to analysis section
            analysisSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }

        // Update country names in the analysis section
        this.updateAnalysisHeader();
        
        // Show loading state
        this.showAnalysisLoading(true);

        try {
            let analysis;
            
            // Debug: Check what AI services are available
            console.log('🔍 Checking AI services...');
            console.log('DiasporaAI exists:', !!window.DiasporaAI);
            console.log('DiasporaAI initialized:', window.DiasporaAI ? window.DiasporaAI.isInitialized : 'N/A');
            console.log('DiasporaAI visual arts extended:', window.DiasporaAI ? window.DiasporaAI.visualArtsExtended : 'N/A');
            console.log('analyzeArtEvolution method exists:', window.DiasporaAI ? typeof window.DiasporaAI.analyzeArtEvolution : 'N/A');
            console.log('VisualArtsAI exists:', !!window.VisualArtsAI);
            
            // Try to use the extended DiasporaAI service
            if (window.DiasporaAI && typeof window.DiasporaAI.analyzeArtEvolution === 'function') {
                console.log('✅ Using extended DiasporaAI service');
                analysis = await window.DiasporaAI.analyzeArtEvolution(
                    this.selectedOrigin.name,
                    this.selectedDestination.name,
                    'traditional patterns'
                );
            } 
            // Fallback to standalone VisualArtsAI if available
            else if (window.VisualArtsAI && typeof window.VisualArtsAI.analyzeArtEvolution === 'function') {
                console.log('⚠️ Using standalone VisualArtsAI service');
                analysis = await window.VisualArtsAI.analyzeArtEvolution(
                    this.selectedOrigin.name,
                    this.selectedDestination.name,
                    'traditional patterns'
                );
            }
            // Force extension if DiasporaAI exists but isn't extended
            else if (window.DiasporaAI && window.DiasporaAI.isInitialized && !window.DiasporaAI.visualArtsExtended) {
                console.log('🔧 Attempting to force extend DiasporaAI...');
                
                // Try to extend now
                if (typeof extendDiasporaAI === 'function') {
                    extendDiasporaAI();
                }
                
                // Check if extension worked
                if (typeof window.DiasporaAI.analyzeArtEvolution === 'function') {
                    console.log('✅ Force extension successful, using DiasporaAI');
                    analysis = await window.DiasporaAI.analyzeArtEvolution(
                        this.selectedOrigin.name,
                        this.selectedDestination.name,
                        'traditional patterns'
                    );
                } else {
                    console.log('❌ Force extension failed, using fallback');
                    analysis = this.createFallbackAnalysis();
                }
            }
            // Last resort: create basic analysis
            else {
                console.warn('⚠️ No AI analysis available, using fallback');
                analysis = this.createFallbackAnalysis();
            }

            console.log('📖 Analysis generated successfully:', analysis ? 'Yes' : 'No');

            // Hide loading and show content
            this.showAnalysisLoading(false);
            this.displayEvolutionContent(analysis);
            
        } catch (error) {
            console.error('💥 Error generating evolution analysis:', error);
            this.showAnalysisError();
        }
    }

    createFallbackAnalysis() {
        const origin = this.selectedOrigin.name;
        const destination = this.selectedDestination.name;
        
        return {
            story: `The artistic traditions of ${origin} underwent significant transformation when they traveled to ${destination}. Through the resilience of communities and the adaptation to new environments, these artistic expressions evolved while maintaining their cultural essence. This evolution represents a powerful story of cultural preservation and innovation in the face of displacement and change.`,
            timeline: [
                {
                    period: "Traditional Foundations (Pre-1500s)",
                    content: [`Rich artistic traditions established in ${origin}`, "Complex symbolic systems and cultural meanings"]
                },
                {
                    period: "Migration Period (1500s-1700s)", 
                    content: ["Artistic traditions travel through migration", "Initial adaptation to new environments"]
                },
                {
                    period: "Cultural Fusion (1700s-1800s)",
                    content: [`New artistic forms emerge in ${destination}`, "Integration with local artistic traditions"]
                },
                {
                    period: "Established Expressions (1800s-1900s)",
                    content: ["Mature diaspora artistic styles develop", "Cultural preservation and innovation balance"]
                },
                {
                    period: "Contemporary Evolution (1900s-Present)",
                    content: ["Modern interpretations and global influence", "Continued innovation while honoring roots"]
                }
            ],
            artExamples: {
                traditional: {
                    name: `Traditional ${origin} Art`,
                    description: `Representative of ${origin} artistic heritage and cultural values`
                },
                contemporary: {
                    name: `Contemporary ${destination} Expression`,
                    description: `Modern interpretation showing evolution from ${origin} traditions`
                }
            },
            generatedAt: Date.now()
        };
    }

    updateAnalysisHeader() {
        const originElement = document.getElementById('origin-country-name');
        const destElement = document.getElementById('destination-country-name');
        
        if (originElement) originElement.textContent = this.selectedOrigin.name;
        if (destElement) destElement.textContent = this.selectedDestination.name;
    }

    showAnalysisLoading(show) {
        const loadingElement = document.getElementById('evolution-loading');
        const contentElement = document.getElementById('evolution-content');
        
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
        if (contentElement) {
            contentElement.style.display = show ? 'none' : 'block';
        }
    }

    displayEvolutionContent(analysis) {
        // Display story
        const storyElement = document.getElementById('evolution-story-text');
        if (storyElement) {
            storyElement.innerHTML = this.formatStoryText(analysis.story);
        }

        // Display timeline
        this.displayTimeline(analysis.timeline);
        
        // Display art examples
        this.displayArtExamples(analysis.artExamples);

        // Animate content appearance
        const contentElement = document.getElementById('evolution-content');
        if (contentElement) {
            gsap.fromTo(contentElement, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        }

        console.log('📖 Evolution content displayed');
    }

    formatStoryText(storyText) {
        // Convert story text to formatted HTML
        return storyText
            .split('\n\n')
            .map(paragraph => `<p>${paragraph.trim()}</p>`)
            .join('');
    }

    displayTimeline(timeline) {
        const timelineContainer = document.querySelector('#evolution-timeline .timeline-container');
        if (!timelineContainer || !timeline) return;

        timelineContainer.innerHTML = timeline.map(period => `
            <div class="timeline-period">
                <div class="timeline-date">${period.period}</div>
                <div class="timeline-content">
                    ${period.content.map(item => `<p>${item}</p>`).join('')}
                </div>
            </div>
        `).join('');
    }

    displayArtExamples(examples) {
        if (!examples) return;

        // Update traditional art example
        const traditionalName = document.getElementById('traditional-art-name');
        const traditionalDesc = document.getElementById('traditional-art-desc');
        
        if (traditionalName && examples.traditional) {
            traditionalName.textContent = examples.traditional.name || 'Traditional Art Form';
        }
        if (traditionalDesc && examples.traditional) {
            traditionalDesc.textContent = examples.traditional.description || 'Original cultural expression';
        }

        // Update contemporary art example
        const contemporaryName = document.getElementById('contemporary-art-name');
        const contemporaryDesc = document.getElementById('contemporary-art-desc');
        
        if (contemporaryName && examples.contemporary) {
            contemporaryName.textContent = examples.contemporary.name || 'Contemporary Expression';
        }
        if (contemporaryDesc && examples.contemporary) {
            contemporaryDesc.textContent = examples.contemporary.description || 'Evolved diaspora expression';
        }
    }

    showAnalysisError() {
        this.showAnalysisLoading(false);
        const contentElement = document.getElementById('evolution-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div class="analysis-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Analysis Temporarily Unavailable</h3>
                    <p>We're having trouble generating the evolution analysis right now. Please try again later.</p>
                    <button class="btn btn-small" onclick="artEvolutionMap.showEvolutionAnalysis()">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
            `;
            contentElement.style.display = 'block';
        }
    }

    handleCountryHover(countryData, element, isEntering) {
        if (isEntering) {
            // Show hover effects
            gsap.to(element, {
                duration: 0.2,
                scale: 1.1,
                transformOrigin: 'center'
            });
            
            // Show country info in side panel
            this.showCountryInfo(countryData);
        } else {
            // Remove hover effects (unless selected)
            if (!d3.select(element).classed('selected-origin') && 
                !d3.select(element).classed('selected-destination')) {
                gsap.to(element, {
                    duration: 0.2,
                    scale: 1,
                    transformOrigin: 'center'
                });
            }
        }
    }

    showCountryInfo(countryData, message = null) {
        const panel = document.getElementById('country-info-panel');
        const nameElement = document.getElementById('selected-country-name');
        const regionElement = document.getElementById('selected-country-region');
        const infoElement = document.getElementById('country-art-info');

        if (panel && nameElement && regionElement && infoElement) {
            nameElement.textContent = countryData.name;
            regionElement.textContent = countryData.type === 'origin' ? 'African Origin' : 'Diaspora Destination';
            
            if (message) {
                infoElement.innerHTML = `<p>${message}</p>`;
            } else {
                infoElement.innerHTML = this.getCountryArtInfo(countryData);
            }

            panel.classList.add('show');
            panel.style.display = 'block';
        }
    }

    getCountryArtInfo(countryData) {
        const artInfo = {
            'Ghana': 'Rich Adinkra symbols and Kente textile traditions representing wisdom and spiritual concepts.',
            'Nigeria': 'Yoruba and Igbo artistic traditions including Ifa symbols and Uli body art patterns.',
            'Senegal': 'Islamic geometric patterns and traditional mudcloth textiles with deep cultural meanings.',
            'Angola': 'Bantu cosmogram symbols and traditional patterns influential in capoeira culture.',
            'Brazil': 'Vibrant fusion of African, indigenous, and European influences in Candomblé art and carnival.',
            'Jamaica': 'Maroon artistic traditions preserving Akan symbols and Rastafari cultural expressions.',
            'Haiti': 'Vodou spiritual art combining Dahomey and Yoruba symbols with unique Haitian innovations.',
            'United States': 'African American artistic traditions including quilting, jazz culture, and contemporary expressions.'
        };

        return `<p>${artInfo[countryData.name] || 'Click to explore this country\'s artistic evolution story.'}</p>`;
    }

    highlightDestinations() {
        // Highlight destination countries as available
        this.svg.selectAll('.destination-country circle')
            .transition()
            .duration(500)
            .style('opacity', 1)
            .style('stroke', '#8b0000')
            .style('stroke-width', 2);
    }

    clearSelections() {
        // Remove visual selections
        this.svg.selectAll('.country')
            .classed('selected-origin selected-destination', false);

        // Reset scales
        gsap.set('.country', { scale: 1 });

        // Remove evolution path
        this.svg.select('.evolution-path').remove();

        // Clear selected countries
        this.selectedOrigin = null;
        this.selectedDestination = null;

        // Hide analysis section
        const analysisSection = document.getElementById('evolution-analysis-section');
        if (analysisSection) {
            analysisSection.style.display = 'none';
        }

        console.log('🧹 Selections cleared');
    }

    createFallbackMap() {
        // Create a simple fallback if map data fails to load
        const fallbackHTML = `
            <div class="map-fallback">
                <div class="fallback-content">
                    <i class="fas fa-map"></i>
                    <h3>Interactive Map Loading...</h3>
                    <p>The interactive map is being prepared. Please wait a moment.</p>
                </div>
            </div>
        `;
        
        this.container.html(fallbackHTML);
        
        // Retry after 3 seconds
        setTimeout(() => {
            this.container.html('');
            this.initializeMap();
        }, 3000);
    }

    showMapError() {
        const errorHTML = `
            <div class="map-error">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Map Temporarily Unavailable</h3>
                    <p>We're having trouble loading the interactive map. Please refresh the page to try again.</p>
                    <button class="btn btn-small" onclick="location.reload()">
                        <i class="fas fa-redo"></i> Refresh Page
                    </button>
                </div>
            </div>
        `;
        
        this.container.html(errorHTML);
    }

    setupResponsiveHandlers() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        const newIsMobile = window.innerWidth < 768;
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            
            // Update dimensions
            if (this.isMobile) {
                this.width = Math.min(400, window.innerWidth - 40);
                this.height = 300;
            } else {
                this.width = 1000;
                this.height = 500;
            }
            
            // Recreate map with new dimensions
            this.container.select('svg').remove();
            this.initializeMap();
        }
    }

    // Public methods for external control
    reset() {
        this.clearSelections();
        this.hideCountryPanel();
    }

    hideCountryPanel() {
        const panel = document.getElementById('country-info-panel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        }
    }
}

// Global functions for HTML onclick handlers
function closeCountryPanel() {
    if (window.artEvolutionMap) {
        window.artEvolutionMap.hideCountryPanel();
    }
}

function exploreMoreEvolution() {
    if (window.artEvolutionMap) {
        window.artEvolutionMap.reset();
        // Scroll back to map
        document.querySelector('.evolution-map-container').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function shareEvolution() {
    if (window.artEvolutionMap && window.artEvolutionMap.selectedOrigin && window.artEvolutionMap.selectedDestination) {
        const shareText = `Discover the artistic evolution from ${window.artEvolutionMap.selectedOrigin.name} to ${window.artEvolutionMap.selectedDestination.name} on Voices of the Diaspora!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Art Evolution Discovery',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
                alert('Share link copied to clipboard!');
            });
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtEvolutionMap;
}