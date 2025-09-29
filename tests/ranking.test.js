const { calculateRank, getLeadersByCategory, updateLeaderStats } = require('../src/data/leaders');

describe('Pin Kings Ranking System', () => {
    describe('calculateRank', () => {
        test('should award Gold rank for exceptional performance', () => {
            const leaderStats = {
                eventsHosted: 50,
                averageRating: 4.8,
                attendeeCount: 1000,
                consistency: 0.9
            };
            const rank = calculateRank(leaderStats);
            expect(rank).toBe('Gold');
        });

        test('should award Silver rank for good performance', () => {
            const leaderStats = {
                eventsHosted: 30,
                averageRating: 4.5,
                attendeeCount: 500,
                consistency: 0.7
            };
            const rank = calculateRank(leaderStats);
            expect(rank).toBe('Silver');
        });

        test('should award Bronze rank for new or less active leaders', () => {
            const leaderStats = {
                eventsHosted: 10,
                averageRating: 4.0,
                attendeeCount: 200,
                consistency: 0.5
            };
            const rank = calculateRank(leaderStats);
            expect(rank).toBe('Bronze');
        });
    });

    describe('getLeadersByCategory', () => {
        test('should return leaders sorted by rank in a category', () => {
            const category = 'fitness';
            const leaders = getLeadersByCategory(category);
            
            expect(Array.isArray(leaders)).toBe(true);
            expect(leaders.length).toBeGreaterThan(0);
            
            // Verify sorting by rank (Gold > Silver > Bronze)
            for (let i = 1; i < leaders.length; i++) {
                const currentRankValue = getRankValue(leaders[i].rank);
                const previousRankValue = getRankValue(leaders[i-1].rank);
                expect(currentRankValue).toBeLessThanOrEqual(previousRankValue);
            }
        });

        test('should include required leader properties', () => {
            const leaders = getLeadersByCategory('fitness');
            leaders.forEach(leader => {
                expect(leader).toHaveProperty('id');
                expect(leader).toHaveProperty('name');
                expect(leader).toHaveProperty('rank');
                expect(leader).toHaveProperty('specialty');
                expect(leader).toHaveProperty('stats');
            });
        });
    });

    describe('updateLeaderStats', () => {
        test('should update leader stats after event completion', () => {
            const leaderId = 'leader123';
            const eventStats = {
                attendeeCount: 50,
                averageRating: 4.7,
                completedOnTime: true
            };

            const updatedLeader = updateLeaderStats(leaderId, eventStats);
            expect(updatedLeader.stats.eventsHosted).toBeGreaterThan(0);
            expect(updatedLeader.stats.averageRating).toBeGreaterThanOrEqual(0);
            expect(updatedLeader.stats.attendeeCount).toBeGreaterThan(0);
        });

        test('should recalculate rank after stats update', () => {
            const leaderId = 'leader123';
            const eventStats = {
                attendeeCount: 100,
                averageRating: 5.0,
                completedOnTime: true
            };

            const previousRank = getLeaderRank(leaderId);
            const updatedLeader = updateLeaderStats(leaderId, eventStats);
            
            // If the stats are good enough, rank should improve or stay the same
            const rankValue = getRankValue(updatedLeader.rank);
            const previousRankValue = getRankValue(previousRank);
            expect(rankValue).toBeGreaterThanOrEqual(previousRankValue);
        });
    });
});

// Helper function for rank comparison
function getRankValue(rank) {
    const rankValues = {
        'Gold': 3,
        'Silver': 2,
        'Bronze': 1
    };
    return rankValues[rank] || 0;
}