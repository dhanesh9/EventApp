// Medal System Configuration
const medalSystem = {
    categories: {
        health: {
            icon: 'fa-heart',
            pointsPerEvent: 50,
            ranks: {
                bronze: 500,
                silver: 1000,
                gold: 2000,
                crownKing: 5000
            }
        },
        tech: {
            icon: 'fa-laptop-code',
            pointsPerEvent: 50,
            ranks: {
                bronze: 500,
                silver: 1000,
                gold: 2000,
                crownKing: 5000
            }
        },
        sports: {
            icon: 'fa-running',
            pointsPerEvent: 50,
            ranks: {
                bronze: 500,
                silver: 1000,
                gold: 2000,
                crownKing: 5000
            }
        },
        arts: {
            icon: 'fa-palette',
            pointsPerEvent: 50,
            ranks: {
                bronze: 500,
                silver: 1000,
                gold: 2000,
                crownKing: 5000
            }
        },
        growth: {
            icon: 'fa-seedling',
            pointsPerEvent: 50,
            ranks: {
                bronze: 500,
                silver: 1000,
                gold: 2000,
                crownKing: 5000
            }
        },
        business: {
            icon: 'fa-briefcase',
            pointsPerEvent: 50,
            ranks: {
                bronze: 500,
                silver: 1000,
                gold: 2000,
                crownKing: 5000
            }
        }
    }
};

// Get Medal Badge HTML
function getMedalBadge(category, points) {
    const rank = calculateRank(category, points);
    const categoryConfig = medalSystem.categories[category];
    
    return `
        <div class="medal-badge ${category} ${rank}">
            <i class="fas ${categoryConfig.icon}"></i>
            <span>${formatRank(rank)} - ${category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
    `;
}

// Calculate Rank based on points
function calculateRank(category, points) {
    const ranks = medalSystem.categories[category].ranks;
    
    if (points >= ranks.crownKing) return 'crown-king';
    if (points >= ranks.gold) return 'gold';
    if (points >= ranks.silver) return 'silver';
    if (points >= ranks.bronze) return 'bronze';
    return 'novice';
}

// Format rank for display
function formatRank(rank) {
    switch(rank) {
        case 'crown-king': return 'Crown King';
        case 'gold': return 'Gold';
        case 'silver': return 'Silver';
        case 'bronze': return 'Bronze';
        default: return 'Novice';
    }
}

// Calculate points for hosting an event
function calculateEventPoints(category, attendees, rating) {
    const basePoints = medalSystem.categories[category].pointsPerEvent;
    const attendeeBonus = Math.floor(attendees * 2);
    const ratingBonus = Math.floor(rating * 10);
    
    return basePoints + attendeeBonus + ratingBonus;
}

// Display points progress
function displayPointsProgress(category, points) {
    const ranks = medalSystem.categories[category].ranks;
    const nextRank = getNextRank(category, points);
    
    if (!nextRank) return ''; // Already Crown King
    
    const pointsNeeded = ranks[nextRank] - points;
    return `
        <div class="points-display">
            <div class="points-category">
                <i class="fas ${medalSystem.categories[category].icon}"></i>
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
            <div class="points-value">${points} / ${ranks[nextRank]}</div>
            <div class="points-needed">${pointsNeeded} points to ${formatRank(nextRank)}</div>
        </div>
    `;
}

// Get next rank
function getNextRank(category, points) {
    const ranks = medalSystem.categories[category].ranks;
    
    if (points < ranks.bronze) return 'bronze';
    if (points < ranks.silver) return 'silver';
    if (points < ranks.gold) return 'gold';
    if (points < ranks.crownKing) return 'crownKing';
    return null;
}

// Export functions
window.medalSystem = {
    getMedalBadge,
    calculateRank,
    calculateEventPoints,
    displayPointsProgress
};