const { getEvents, getEventsByCategory, getEventsByPincode } = require('../src/data/events');

describe('Events Module', () => {
    describe('getEvents', () => {
        test('should return all events', () => {
            const events = getEvents();
            expect(Array.isArray(events)).toBe(true);
            expect(events.length).toBeGreaterThan(0);
        });

        test('each event should have required properties', () => {
            const events = getEvents();
            events.forEach(event => {
                expect(event).toHaveProperty('id');
                expect(event).toHaveProperty('title');
                expect(event).toHaveProperty('category');
                expect(event).toHaveProperty('date');
                expect(event).toHaveProperty('organizer');
            });
        });
    });

    describe('getEventsByCategory', () => {
        test('should return events filtered by category', () => {
            const category = 'fitness';
            const events = getEventsByCategory(category);
            events.forEach(event => {
                expect(event.category.toLowerCase()).toBe(category);
            });
        });

        test('should return empty array for non-existent category', () => {
            const events = getEventsByCategory('non-existent');
            expect(events).toHaveLength(0);
        });
    });

    describe('getEventsByPincode', () => {
        test('should return events in a specific pincode', () => {
            const pincode = '400001';
            const events = getEventsByPincode(pincode);
            events.forEach(event => {
                expect(event.location.pincode).toBe(pincode);
            });
        });

        test('should return events within 5km radius if exact pincode not found', () => {
            const pincode = '400002';
            const events = getEventsByPincode(pincode);
            events.forEach(event => {
                const distance = calculateDistance(pincode, event.location.pincode);
                expect(distance).toBeLessThanOrEqual(5);
            });
        });
    });
});