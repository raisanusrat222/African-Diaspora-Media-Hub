// js/art-animation.js - GSAP-powered animations for visual arts page

/**
 * Advanced animation controller for the visual arts page
 * Uses GSAP for smooth, performant animations and transitions
 */
class ArtEvolutionAnimations {
    constructor() {
        this.isInitialized = false;
        this.animationTimelines = new Map();
        this.observer = null;
        
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.warn('⚠️ GSAP not loaded, animations will be limited');
            return;
        }

        this.setupScrollTriggerAnimations();
        this.setupPageLoadAnimations();
        this.setupHoverAnimations();
        this.isInitialized = true;
        
        console.log('✨ Art evolution animations initialized');
    }

    /**
     * Animations triggered by scroll position
     */
    setupScrollTriggerAnimations() {
        // Intersection Observer for scroll-triggered animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll(
            '.evolution-intro, .cultural-symbols-section h2, .featured-art-section h2, .symbol-card, .art-card'
        );
        
        animateElements.forEach(el => {
            this.observer.observe(el);
        });
    }

    triggerScrollAnimation(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        
        switch (animationType) {
            case 'fadeInUp':
                this.animateFadeInUp(element);
                break;
            case 'slideInLeft':
                this.animateSlideInLeft(element);
                break;
            case 'slideInRight':
                this.animateSlideInRight(element);
                break;
            default:
                this.animateFadeInUp(element);
        }
        
        // Stop observing this element
        this.observer.unobserve(element);
    }

    /**
     * Page load animations
     */
    setupPageLoadAnimations() {
        // Animate page header
        const header = document.querySelector('.visual-arts-header');
        if (header) {
            gsap.fromTo(header, 
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
            );
        }

        // Animate map container with delay
        const mapContainer = document.querySelector('.evolution-map-container');
        if (mapContainer) {
            gsap.fromTo(mapContainer,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1.2, delay: 0.3, ease: "back.out(1.2)" }
            );
        }

        // Stagger animate legend items
        const legendItems = document.querySelectorAll('.legend-item');
        if (legendItems.length > 0) {
            gsap.fromTo(legendItems,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, delay: 0.6 }
            );
        }
    }

    /**
     * Hover effect animations
     */
    setupHoverAnimations() {
        // Symbol cards hover effects
        const symbolCards = document.querySelectorAll('.symbol-card');
        symbolCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateSymbolCardHover(card, true));
            card.addEventListener('mouseleave', () => this.animateSymbolCardHover(card, false));
        });

        // Art cards hover effects
        const artCards = document.querySelectorAll('.art-card');
        artCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateArtCardHover(card, true));
            card.addEventListener('mouseleave', () => this.animateArtCardHover(card, false));
        });

        // Country info panel hover effects
        const mapLegend = document.querySelector('.map-legend');
        if (mapLegend) {
            mapLegend.addEventListener('mouseenter', () => this.animateMapLegendHover(true));
            mapLegend.addEventListener('mouseleave', () => this.animateMapLegendHover(false));
        }
    }

    /**
     * Evolution path animation when countries are selected
     */
    animateEvolutionPath(pathElement, originElement, destinationElement) {
        if (!this.isInitialized || !pathElement) return;

        const tl = gsap.timeline();

        // Highlight origin
        tl.to(originElement, {
            scale: 1.4,
            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.8))',
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
        })
        // Draw path
        .fromTo(pathElement, 
            { strokeDasharray: "0,1000" },
            { 
                strokeDasharray: "1000,0", 
                duration: 2,
                ease: "power2.out"
            }
        )
        // Highlight destination
        .to(destinationElement, {
            scale: 1.4,
            filter: 'drop-shadow(0 0 20px rgba(34, 139, 34, 0.8))',
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
        }, "-=1")
        // Start flowing animation
        .set(pathElement, {
            strokeDasharray: "10,5",
            animation: "pathFlow 3s linear infinite"
        });

        return tl;
    }

    /**
     * Art transformation sequence for evolution examples
     */
    animateArtTransformation(originArt, destArt, containerElement) {
        if (!this.isInitialized) return;

        const tl = gsap.timeline();

        // Stage 1: Show original art
        tl.fromTo(originArt, 
            { opacity: 0, scale: 0.8, rotationY: -90 },
            { opacity: 1, scale: 1, rotationY: 0, duration: 1, ease: "back.out(1.2)" }
        )
        // Stage 2: Transformation effect
        .to(originArt, { 
            rotationY: 90, 
            scale: 0.9,
            duration: 0.6,
            ease: "power2.inOut"
        }, "+=1")
        .set(destArt, { rotationY: -90, scale: 0.9 })
        .to(destArt, { 
            rotationY: 0, 
            scale: 1,
            opacity: 1, 
            duration: 0.6,
            ease: "power2.out"
        })
        // Stage 3: Celebration effect
        .to(containerElement, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });

        return tl;
    }

    /**
     * Country selection highlight animation
     */
    highlightCountry(countryElement, type = 'origin') {
        if (!this.isInitialized || !countryElement) return;

        const colors = {
            origin: { color: '#d4af37', glow: 'rgba(212, 175, 55, 0.8)' },
            destination: { color: '#228b22', glow: 'rgba(34, 139, 34, 0.8)' },
            hover: { color: '#8b0000', glow: 'rgba(139, 0, 0, 0.6)' }
        };

        const config = colors[type] || colors.hover;

        gsap.to(countryElement, {
            fill: config.color,
            filter: `drop-shadow(0 0 15px ${config.glow})`,
            scale: 1.3,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)"
        });
    }

    /**
     * Remove country highlight
     */
    removeCountryHighlight(countryElement, originalColor = '#e8e8e8') {
        if (!this.isInitialized || !countryElement) return;

        gsap.to(countryElement, {
            fill: originalColor,
            filter: 'none',
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
        });
    }

    /**
     * Symbol modal entrance animation
     */
    animateSymbolModal(modalElement, show = true) {
        if (!this.isInitialized || !modalElement) return;

        if (show) {
            gsap.set(modalElement, { display: 'flex' });
            
            const tl = gsap.timeline();
            tl.fromTo(modalElement,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            )
            .fromTo(modalElement.querySelector('.modal-content'),
                { scale: 0.7, rotationY: -15 },
                { scale: 1, rotationY: 0, duration: 0.4, ease: "back.out(1.3)" },
                "-=0.1"
            );
            
            return tl;
        } else {
            const tl = gsap.timeline();
            tl.to(modalElement.querySelector('.modal-content'),
                { scale: 0.8, rotationY: 15, duration: 0.3, ease: "power2.in" }
            )
            .to(modalElement,
                { opacity: 0, duration: 0.2 },
                "-=0.1"
            )
            .set(modalElement, { display: 'none' });
            
            return tl;
        }
    }

    /**
     * Evolution content reveal animation
     */
    animateEvolutionContentReveal(contentElement) {
        if (!this.isInitialized || !contentElement) return;

        const elements = contentElement.querySelectorAll('.evolution-story, .evolution-timeline, .art-examples');
        
        gsap.fromTo(elements,
            { opacity: 0, y: 40 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.2,
                ease: "power2.out"
            }
        );
    }

    /**
     * Timeline period animations
     */
    animateTimelinePeriods(timelineContainer) {
        if (!this.isInitialized || !timelineContainer) return;

        const periods = timelineContainer.querySelectorAll('.timeline-period');
        
        gsap.fromTo(periods,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: timelineContainer,
                    start: "top 80%"
                }
            }
        );
    }

    /**
     * Loading dots animation
     */
    animateLoadingDots(dotsContainer) {
        if (!this.isInitialized || !dotsContainer) return;

        const dots = dotsContainer.querySelectorAll('span');
        
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(dots, {
            scale: 1.4,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });

        return tl;
    }

    /**
     * Symbol card hover animation
     */
    animateSymbolCardHover(card, isEntering) {
        if (!this.isInitialized) return;

        const icon = card.querySelector('.symbol-icon');
        
        if (isEntering) {
            gsap.to(card, {
                y: -10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                duration: 0.3,
                ease: "power2.out"
            });
            
            if (icon) {
                gsap.to(icon, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        } else {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                duration: 0.3,
                ease: "power2.out"
            });
            
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }
    }

    /**
     * Art card hover animation
     */
    animateArtCardHover(card, isEntering) {
        if (!this.isInitialized) return;

        const overlay = card.querySelector('.art-overlay');
        
        if (isEntering) {
            gsap.to(card, {
                y: -15,
                scale: 1.02,
                boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                duration: 0.4,
                ease: "power2.out"
            });
            
            if (overlay) {
                gsap.to(overlay, {
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        } else {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                duration: 0.4,
                ease: "power2.out"
            });
            
            if (overlay) {
                gsap.to(overlay, {
                    y: '100%',
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in"
                });
            }
        }
    }

    /**
     * Map legend hover animation
     */
    animateMapLegendHover(isEntering) {
        if (!this.isInitialized) return;

        const legend = document.querySelector('.map-legend');
        if (!legend) return;

        if (isEntering) {
            gsap.to(legend, {
                scale: 1.02,
                boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            gsap.to(legend, {
                scale: 1,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }

    /**
     * Basic scroll animation methods
     */
    animateFadeInUp(element) {
        if (this.isInitialized) {
            gsap.fromTo(element,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        } else {
            // Fallback CSS animation
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    }

    animateSlideInLeft(element) {
        if (this.isInitialized) {
            gsap.fromTo(element,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
            );
        } else {
            element.style.animation = 'slideInLeft 0.8s ease-out forwards';
        }
    }

    animateSlideInRight(element) {
        if (this.isInitialized) {
            gsap.fromTo(element,
                { opacity: 0, x: 50 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
            );
        } else {
            element.style.animation = 'slideInRight 0.8s ease-out forwards';
        }
    }

    /**
     * Particle animation for backgrounds
     */
    createArtisticParticles(container, particleCount = 20) {
        if (!this.isInitialized || !container) return;

        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'art-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: ${this.getRandomArtColor()};
                border-radius: 50%;
                pointer-events: none;
                opacity: ${Math.random() * 0.6 + 0.2};
            `;
            
            container.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            gsap.set(particle, {
                x: Math.random() * container.offsetWidth,
                y: container.offsetHeight + 20
            });
            
            gsap.to(particle, {
                y: -20,
                x: `+=${Math.random() * 100 - 50}`,
                duration: Math.random() * 10 + 5,
                ease: "none",
                repeat: -1,
                delay: Math.random() * 5
            });
        }
        
        return particles;
    }

    getRandomArtColor() {
        const colors = ['#d4af37', '#8b0000', '#228b22', '#9932cc', '#ff6347'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Cleanup animations
     */
    cleanup() {
        // Clear all timelines
        this.animationTimelines.forEach(tl => tl.kill());
        this.animationTimelines.clear();
        
        // Disconnect observer
        if (this.observer) {
            this.observer.disconnect();
        }
        
        console.log('🧹 Art animations cleaned up');
    }

    /**
     * Public method to trigger specific animations
     */
    trigger(animationType, element, options = {}) {
        if (!this.isInitialized) {
            console.warn('⚠️ Animations not initialized');
            return;
        }

        switch (animationType) {
            case 'evolutionPath':
                return this.animateEvolutionPath(element, options.origin, options.destination);
            case 'artTransformation':
                return this.animateArtTransformation(element, options.destArt, options.container);
            case 'highlightCountry':
                return this.highlightCountry(element, options.type);
            case 'symbolModal':
                return this.animateSymbolModal(element, options.show);
            case 'contentReveal':
                return this.animateEvolutionContentReveal(element);
            case 'timelinePeriods':
                return this.animateTimelinePeriods(element);
            case 'loadingDots':
                return this.animateLoadingDots(element);
            default:
                console.warn(`⚠️ Unknown animation type: ${animationType}`);
        }
    }
}

// CSS fallback animations for when GSAP is not available
const fallbackCSS = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pathFlow {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 45; }
}

.art-particle {
    z-index: 1;
}
`;

// Inject fallback CSS
if (!document.getElementById('art-animation-fallback')) {
    const style = document.createElement('style');
    style.id = 'art-animation-fallback';
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
}

// Create global animation controller instance
window.ArtAnimations = new ArtEvolutionAnimations();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArtEvolutionAnimations;
}