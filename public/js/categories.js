// Category Data Structure
const categories = {
    health: {
        name: 'Health & Wellbeing',
        color: '#2ecc71',
        subcategories: [
            { id: 'gym', name: 'Gym Instructors', icon: 'dumbbell' },
            { id: 'yoga', name: 'Yoga Instructors', icon: 'om' },
            { id: 'martial-arts', name: 'Martial Arts & Boxing', icon: 'fist-raised' },
            { id: 'dance', name: 'Dance & Zumba', icon: 'music' },
            { id: 'nutrition', name: 'Nutrition & Wellness', icon: 'apple-alt' }
        ]
    },
    tech: {
        name: 'Tech & Innovation',
        color: '#3498db',
        subcategories: [
            { id: 'ai', name: 'AI Speakers', icon: 'robot' },
            { id: 'security', name: 'Cybersecurity Experts', icon: 'shield-alt' },
            { id: 'web3', name: 'Web3 & Blockchain', icon: 'link' },
            { id: 'startup', name: 'Startup Builders', icon: 'rocket' },
            { id: 'coding', name: 'Coding Coaches', icon: 'code' }
        ]
    },
    // Add other categories similarly
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category tiles
    initializeCategoryTiles();
    
    // Initialize dropdown navigation
    initializeDropdowns();
});

function initializeCategoryTiles() {
    const categoryTiles = document.querySelectorAll('.category-tile');
    
    categoryTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showCategoryContent(category);
        });
        
        // Add hover animation
        tile.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        tile.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function showCategoryContent(category) {
    // Update active category
    document.querySelectorAll('.category-tile').forEach(tile => {
        tile.classList.remove('active');
    });
    document.querySelector(`.category-tile[data-category="${category}"]`).classList.add('active');
    
    // Filter content based on category
    filterContentByCategory(category);
}

function filterContentByCategory(category) {
    // Get all event cards
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add category-specific styling to elements
function applyCategoryStyle(element, category) {
    const categoryData = categories[category];
    if (categoryData) {
        element.style.setProperty('--category-color', categoryData.color);
        element.classList.add(`category-${category}`);
    }
}

// Initialize category dropdowns
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.category-dropdown-trigger');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownContent = this.nextElementSibling;
            dropdownContent.classList.toggle('active');
        });
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.matches('.category-dropdown-trigger')) {
        document.querySelectorAll('.category-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});