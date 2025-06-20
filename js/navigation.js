// navigation.js

function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navCenter = document.querySelector('.nav-center');
    const navbar = document.getElementById('navbar');
    const dropdowns = document.querySelectorAll('.dropdown');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navCenter.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navCenter.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link (but not dropdown toggles)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close menu if this is a dropdown toggle
            if (this.classList.contains('dropdown-toggle')) {
                return; // Let the dropdown functionality handle it
            }
            
            // Only close menu for actual navigation links
            navCenter.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking on dropdown menu items (actual navigation)
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navCenter.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target)) {
            navCenter.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });

            // Hide search results
            hideSearchResults();
        }
    });

    // Mobile dropdown functionality
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) { // Updated breakpoint to match CSS
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                
                const dropdown = this.parentElement;
                
                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                
                // Don't close the mobile menu
                return false;
            }
        });
    });

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    let scrollTimeout;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional feature)
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollY = currentScrollY;

        // Clear timeout and set new one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            navbar.style.transform = 'translateY(0)';
        }, 150);
    }

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Search functionality
    setupSearchFunctionality();

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu and dropdowns
            navCenter.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });

            // Hide search results
            hideSearchResults();
        }

        // Search shortcut (Ctrl/Cmd + K)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900) { // Updated breakpoint
            // Reset mobile menu state on larger screens
            navCenter.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Active page highlighting
    highlightActivePage();
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    
    // Mobile search elements
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const mobileSearchResults = document.getElementById('mobile-search-results');

    // Desktop search setup
    if (searchInput && searchBtn && searchResults) {
        setupSearchEvents(searchInput, searchBtn, searchResults);
    }
    
    // Mobile search setup
    if (mobileSearchInput && mobileSearchBtn && mobileSearchResults) {
        setupSearchEvents(mobileSearchInput, mobileSearchBtn, mobileSearchResults);
    }
}

function setupSearchEvents(searchInput, searchBtn, searchResults) {
    const searchData = [
        {
            title: 'Historical Timeline',
            description: 'Explore key moments in African diaspora history',
            page: 'historical-timeline',
            icon: 'fas fa-clock',
            keywords: ['history', 'timeline', 'africa', 'diaspora', 'chronology', 'events']
        },
        {
            title: 'Interactive Maps',
            description: 'Navigate migration patterns and cultural connections',
            page: 'maps.html',
            icon: 'fas fa-map-marked-alt',
            keywords: ['maps', 'geography', 'migration', 'routes', 'location', 'travel']
        },
        {
            title: 'Podcasts',
            description: 'Voices and stories from across the diaspora',
            page: 'podcasts',
            icon: 'fas fa-podcast',
            keywords: ['podcast', 'audio', 'stories', 'voices', 'interviews', 'radio']
        },
        {
            title: 'News & Updates',
            description: 'Latest developments in diaspora communities',
            page: 'news',
            icon: 'fas fa-newspaper',
            keywords: ['news', 'current', 'events', 'updates', 'latest', 'press']
        },
        {
            title: 'Films & Documentaries',
            description: 'Visual storytelling from diaspora filmmakers',
            page: 'films',
            icon: 'fas fa-film',
            keywords: ['films', 'movies', 'documentaries', 'video', 'cinema', 'visual']
        },
        {
            title: 'Music & Dance',
            description: 'Cultural expressions through music and movement',
            page: 'music-dance',
            icon: 'fas fa-music',
            keywords: ['music', 'dance', 'rhythm', 'culture', 'performance', 'art']
        },
        {
            title: 'Visual Arts',
            description: 'Artistic expressions and cultural creativity',
            page: 'visual-arts',
            icon: 'fas fa-paint-brush',
            keywords: ['art', 'visual', 'painting', 'sculpture', 'creativity', 'artist']
        },
        {
            title: 'Literature',
            description: 'Written works and literary traditions',
            page: 'literature',
            icon: 'fas fa-feather-alt',
            keywords: ['literature', 'books', 'writing', 'poetry', 'stories', 'authors']
        },
        {
            title: 'Oral Histories',
            description: 'Preserved stories and traditional narratives',
            page: 'oral-histories',
            icon: 'fas fa-microphone-alt',
            keywords: ['oral', 'history', 'stories', 'tradition', 'narrative', 'memory']
        },
        {
            title: 'Educational Content',
            description: 'Learning resources and educational materials',
            page: 'educational-content',
            icon: 'fas fa-book-open',
            keywords: ['education', 'learning', 'teaching', 'curriculum', 'resources', 'study']
        }
    ];

    // Search input event listeners
    searchInput.addEventListener('input', debounce(function(e) {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            performSearch(query, searchData, searchResults);
        } else {
            hideSearchResults(searchResults);
        }
    }, 300));

    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            performSearch(this.value.trim(), searchData, searchResults);
        }
    });

    // Search button click
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
            performSearch(query, searchData, searchResults);
        }
    });

    // Enter key search
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstResult = searchResults.querySelector('.search-result-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });
}

function performSearch(query, searchData, resultsContainer) {
    const results = searchData.filter(item => {
        const searchTerms = query.toLowerCase().split(' ');
        return searchTerms.some(term => 
            item.title.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.keywords.some(keyword => keyword.includes(term))
        );
    });

    displaySearchResults(results, resultsContainer);
}

function displaySearchResults(results, resultsContainer) {
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>No results found. Try different keywords.</p>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="selectSearchResult('${result.page}', '${resultsContainer.id}')">
                <i class="${result.icon}"></i>
                <div>
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-description">${result.description}</div>
                </div>
            </div>
        `).join('');
    }

    resultsContainer.classList.add('show');
}

function hideSearchResults(resultsContainer) {
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
    }
}

function selectSearchResult(page, resultsContainerId) {
    const searchInput = resultsContainerId === 'mobile-search-results' ? 
        document.getElementById('mobile-search-input') : 
        document.getElementById('search-input');
    const resultsContainer = document.getElementById(resultsContainerId);
    
    hideSearchResults(resultsContainer);
    if (searchInput) {
        searchInput.blur();
    }
    
    // Close mobile menu if open
    const navCenter = document.querySelector('.nav-center');
    const navToggle = document.getElementById('nav-toggle');
    if (navCenter && navCenter.classList.contains('active')) {
        navCenter.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Load the selected page
    if (typeof loadPage === 'function') {
        loadPage(page);
    }
    
    // Track search analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('search_result_click', {
            query: searchInput ? searchInput.value : '',
            result: page,
            source: resultsContainerId === 'mobile-search-results' ? 'mobile' : 'desktop'
        });
    }
}

function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.includes(currentPage) || (currentPage === 'index.html' && href === '#'))) {
            link.classList.add('active');
        }
    });
}

// Breadcrumb navigation
function createBreadcrumb(pages) {
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (!breadcrumbContainer) return;

    const breadcrumbHTML = pages.map((page, index) => {
        if (index === pages.length - 1) {
            return `<span class="breadcrumb-current">${page.title}</span>`;
        } else {
            return `<a href="#" onclick="loadPage('${page.url}')" class="breadcrumb-link">${page.title}</a>`;
        }
    }).join('<span class="breadcrumb-separator">›</span>');

    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// Navigation state management
const NavigationState = {
    currentPage: 'home',
    history: ['home'],
    
    navigateTo: function(page) {
        this.history.push(page);
        this.currentPage = page;
        this.updateURL(page);
    },
    
    goBack: function() {
        if (this.history.length > 1) {
            this.history.pop();
            this.currentPage = this.history[this.history.length - 1];
            return this.currentPage;
        }
        return null;
    },
    
    updateURL: function(page) {
        if (history.pushState) {
            const url = page === 'home' ? '/' : `/${page}`;
            history.pushState({ page: page }, '', url);
        }
    }
};

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
        if (typeof loadPage === 'function') {
            loadPage(e.state.page);
        }
    }
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = section.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Navigation analytics
function trackNavigation(page, source) {
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('navigation', {
            page: page,
            source: source,
            timestamp: new Date().toISOString()
        });
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

// Go to home page function
function goToHomePage() {
    // Hide any open AI summary
    const summaryContainer = document.getElementById('ai-summary-container');
    if (summaryContainer) {
        summaryContainer.style.display = 'none';
        summaryContainer.classList.remove('show');
    }
    
    // Clear country search input
    const countrySearchInput = document.getElementById('country-search-input');
    if (countrySearchInput) {
        countrySearchInput.value = '';
    }
    
    // Hide country suggestions
    if (typeof hideSuggestions === 'function') {
        hideSuggestions();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update page title
    document.title = 'Voices of the Diaspora';
    
    // Update navigation state
    if (NavigationState) {
        NavigationState.navigateTo('home');
    }
    
    // Track analytics
    if (window.DiasporaHub && window.DiasporaHub.Analytics) {
        window.DiasporaHub.Analytics.track('logo_click_home', {
            timestamp: new Date().toISOString()
        });
    }
}

// Export navigation functions
window.NavigationUtils = {
    scrollToSection,
    createBreadcrumb,
    NavigationState,
    trackNavigation,
    selectSearchResult,
    hideSearchResults
};