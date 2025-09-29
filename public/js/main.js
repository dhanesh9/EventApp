// Main JavaScript for EventHub Homepage
class EventApp {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilter = 'all';
        this.eventsPerPage = 6;
        this.currentPage = 1;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadEvents();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        const locationInput = document.getElementById('location-input');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        if (locationInput) {
            locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        // Category filtering
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setActiveFilter(btn, filter);
                this.filterEvents(filter);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreEvents());
        }

        // Create event button
        const createEventBtn = document.getElementById('create-event-btn');
        if (createEventBtn) {
            createEventBtn.addEventListener('click', () => {
                window.location.href = '/create-event.html';
            });
        }
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }

        // Carousel initialization moved to public/js/new-home.js (initTopCoachesCarousel)
    }

    async loadEvents() {
        this.showLoading();
        
        try {
            const response = await fetch('/api/events');
            this.events = await response.json();
            this.filteredEvents = [...this.events];
            this.renderEvents();
        } catch (error) {
            console.error('Error loading events:', error);
            this.showError('Failed to load events. Please try again later.');
        } finally {
            this.hideLoading();
        }
    }

    handleSearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const location = document.getElementById('location-input').value.toLowerCase();

        this.filteredEvents = this.events.filter(event => {
            const matchesSearch = !searchTerm || 
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                event.tags.some(tag => tag.toLowerCase().includes(searchTerm));

            const matchesLocation = !location ||
                event.city.toLowerCase().includes(location) ||
                event.address.toLowerCase().includes(location);

            return matchesSearch && matchesLocation;
        });

        this.currentPage = 1;
        this.renderEvents();
    }

    filterByCategory(category) {
        this.filteredEvents = this.events.filter(event => 
            event.category === category
        );
        this.currentPage = 1;
        this.renderEvents();
        
        // Scroll to events section
        document.querySelector('.featured-events').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    setActiveFilter(activeBtn, filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
        this.currentFilter = filter;
    }

    filterEvents(filter) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextSaturday = new Date(today);
        nextSaturday.setDate(today.getDate() + (6 - today.getDay()));
        const nextSunday = new Date(nextSaturday);
        nextSunday.setDate(nextSaturday.getDate() + 1);

        switch (filter) {
            case 'today':
                this.filteredEvents = this.events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === today.toDateString();
                });
                break;
            case 'tomorrow':
                this.filteredEvents = this.events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === tomorrow.toDateString();
                });
                break;
            case 'weekend':
                this.filteredEvents = this.events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === nextSaturday.toDateString() || 
                           eventDate.toDateString() === nextSunday.toDateString();
                });
                break;
            default:
                this.filteredEvents = [...this.events];
        }

        this.currentPage = 1;
        this.renderEvents();
    }

    renderEvents() {
        const eventsGrid = document.getElementById('events-grid');
        if (!eventsGrid) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.eventsPerPage;
        const eventsToShow = this.filteredEvents.slice(startIndex, endIndex);

        if (eventsToShow.length === 0) {
            eventsGrid.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No events found</h3>
                    <p>Try adjusting your search criteria or browse different categories.</p>
                </div>
            `;
            this.hideLoadMoreButton();
            return;
        }

        eventsGrid.innerHTML = eventsToShow.map(event => this.createEventCard(event)).join('');
        this.updateLoadMoreButton();
    }

    createEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        const truncatedDescription = event.description.length > 100 
            ? event.description.substring(0, 100) + '...'
            : event.description;

        return `
            <div class="event-card" onclick="window.location.href='/event-details.html?id=${event.id}'">
                <div class="event-image">
                    <img src="${event.image || '/images/default-event.svg'}" alt="${event.title}" onerror="this.src='/images/default-event.svg'">
                    <div class="event-badge">${this.getCategoryDisplayName(event.category)}</div>
                </div>
                <div class="event-info">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${formattedTime}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.city}, ${event.state || ''}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span class="event-attendees">${event.attendees || 0} attending</span>
                        </div>
                    </div>
                    <p>${truncatedDescription}</p>
                    <div class="event-price">${event.isFree ? 'Free' : '$' + event.price}</div>
                </div>
            </div>
        `;
    }

    getCategoryDisplayName(category) {
        const categoryMap = {
            'technology': 'Technology',
            'business': 'Business',
            'arts': 'Arts & Culture',
            'sports': 'Sports & Fitness',
            'food': 'Food & Drink',
            'music': 'Music',
            'education': 'Education',
            'health': 'Health & Wellness',
            'other': 'Other'
        };
        return categoryMap[category] || category;
    }

    loadMoreEvents() {
        this.currentPage++;
        this.renderEvents();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.eventsPerPage;
        if (totalShown >= this.filteredEvents.length) {
            this.hideLoadMoreButton();
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    hideLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('active');
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('active');
        }
    }

    showError(message) {
        const eventsGrid = document.getElementById('events-grid');
        if (eventsGrid) {
            eventsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
                </div>
            `;
        }
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function getTimeUntilEvent(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;
    
    if (diff < 0) return 'Event has passed';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} away`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} away`;
    } else {
        return 'Starting soon';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventApp();
});

// Add CSS for error and no events states
const additionalStyles = `
    .no-events,
    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
    }
    
    .no-events i,
    .error-message i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #ddd;
    }
    
    .no-events h3,
    .error-message h3 {
        margin-bottom: 1rem;
        color: #333;
    }
    
    .error-message i {
        color: #ffc107;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);