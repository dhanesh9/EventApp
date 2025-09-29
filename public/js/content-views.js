document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const categorySelect = document.getElementById('category-select');
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const eventsView = document.getElementById('events-view');

    // Sample data - In real app, this would come from your backend
    const eventTypes = {
        fitness: {
            name: 'Fitness & Sports',
            events: [
                {
                    title: 'Morning Yoga Session',
                    category: 'Fitness',
                    date: '2025-09-26',
                    time: '07:00 AM',
                    location: 'Central Park',
                    organizer: {
                        name: 'Sarah Johnson',
                        rank: 'Gold Pin King',
                        image: 'https://via.placeholder.com/40'
                    },
                    image: 'https://via.placeholder.com/300x200'
                },
                // Add more events...
            ],
            leaders: [
                {
                    name: 'Sarah Johnson',
                    specialty: 'Yoga Instructor',
                    rank: 'Gold Pin King',
                    rating: 4.9,
                    events: 50,
                    image: 'https://via.placeholder.com/150'
                },
                // Add more leaders...
            ]
        },
        tech: {
            name: 'Technology & Coding',
            // Add similar structure for other categories
        }
    };

    // Toggle View Function
    function toggleView(viewType) {
        toggleBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewType);
        });
        eventsView.classList.toggle('active', viewType === 'events');
        leadersView.classList.toggle('active', viewType === 'leaders');
    }

    // Render Events Function
    function renderEvents(category) {
        const eventsGrid = document.querySelector('.events-grid');
        const events = eventTypes[category]?.events || [];
        
        eventsGrid.innerHTML = events.map(event => `
            <div class="event-card" data-category="${event.categoryId}">
                <img src="${event.image}" alt="${event.title}" class="event-image">
                <div class="event-details">
                    <div class="event-category">
                        <i class="fas ${getCategoryIcon(event.categoryId)}"></i>
                        ${event.category}
                    </div>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-info">
                        <p><i class="far fa-calendar"></i> ${event.date}</p>
                        <p><i class="far fa-clock"></i> ${event.time}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    </div>
                    <div class="event-organizer">
                        <img src="${event.organizer.image}" alt="${event.organizer.name}" class="organizer-image">
                        <div class="organizer-details">
                            <div class="organizer-name">${event.organizer.name}</div>
                            <div class="organizer-rank">
                                <i class="fas fa-crown" style="color: var(--${event.categoryId}-primary)"></i>
                                ${event.organizer.rank} in ${event.category}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Leaders feature removed: no leader rendering

    // Event Listeners
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        if (category) {
            renderEvents(category);
        }
    });

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => toggleView(btn.dataset.view));
    });

    searchBtn.addEventListener('click', function() {
        const category = categorySelect.value;
        const location = locationInput.value;
        if (category && location) {
            renderEvents(category);
        }
    });
});