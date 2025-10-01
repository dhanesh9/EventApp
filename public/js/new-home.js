// Search Placeholder Animation
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.expandable-search');
    const placeholders = [
        'gym trainer',
        'yoga instructor',
        'guitar teacher',
        'python coach',
        'public speaking mentor'
    ];
    let currentIndex = 0;

    function rotatePlaceholder() {
        searchInput.setAttribute('placeholder', placeholders[currentIndex]);
        currentIndex = (currentIndex + 1) % placeholders.length;
    }

    setInterval(rotatePlaceholder, 3000);

    // Search Input Animation
    searchInput.addEventListener('focus', function() {
        this.parentElement.classList.add('expanded');
    });

    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('expanded');
        }
    });
});

// Live Ticker Updates
function showLiveTicker(message) {
    const ticker = document.createElement('div');
    ticker.className = 'live-ticker';
    ticker.innerHTML = message;
    
    document.body.appendChild(ticker);
    
    setTimeout(() => {
        ticker.style.opacity = '0';
        setTimeout(() => ticker.remove(), 500);
    }, 5000);
}

// Sample live updates
setInterval(() => {
    const updates = [
        '🔥 A Crown Fitness coach just got a 5★ review in 110011',
        '🎯 New Gold tier Tech mentor joined in your area',
        '🏆 Leadership coach reached Crown status in 110015',
        '💪 Top gym trainer just opened weekend slots in 110011'
    ];
    
    showLiveTicker(updates[Math.floor(Math.random() * updates.length)]);
}, 15000);

// Initialize Top Coaches Carousel (we already embedded 10 coach cards in HTML)
function initTopCoachesCarousel() {
    const $carousel = $('.coach-carousel');
    if (!$carousel || !$carousel.length) return;

    $carousel.owlCarousel({
        loop: true,
        margin: 25,
        nav: true,
        dots: false,
        autoplay: false,
        navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
        responsive: {
            0: { 
                items: 1,
                nav: true,
                margin: 15
            },
            480: { 
                items: 2,
                nav: true,
                margin: 20
            },
            768: { 
                items: 3,
                nav: true,
                margin: 20
            },
            992: { 
                items: 4,
                nav: true,
                margin: 25
            },
            1200: { 
                items: 4,
                nav: true,
                margin: 30
            }
        }
    });
}

// Initialize features
document.addEventListener('DOMContentLoaded', function() {
    initTopCoachesCarousel();
});