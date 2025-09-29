const { getByText, getByTestId, fireEvent } = require('@testing-library/dom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');

describe('Frontend Components', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        require('../public/js/content-views.js');
    });

    describe('Category Dropdown', () => {
        test('should show all category options', () => {
            const dropdown = document.getElementById('category-select');
            const options = dropdown.getElementsByTagName('option');
            
            expect(options.length).toBeGreaterThan(1); // Including default option
            expect(options[0].text).toBe('Select Category');
            
            // Verify some specific categories
            const categories = Array.from(options).map(opt => opt.text);
            expect(categories).toContain('Fitness & Sports');
            expect(categories).toContain('Technology & Coding');
        });

        test('should trigger content update on selection', () => {
            const dropdown = document.getElementById('category-select');
            const eventsView = document.getElementById('events-view');
            
            fireEvent.change(dropdown, { target: { value: 'fitness' } });
            
            const eventCards = eventsView.querySelectorAll('.event-card');
            expect(eventCards.length).toBeGreaterThan(0);
        });
    });

    describe('View Toggle', () => {
        // View toggle removed - leaderboard no longer available
    });

    describe('Search Functionality', () => {
        test('should filter results based on location input', () => {
            const locationInput = document.getElementById('location-input');
            const searchBtn = document.getElementById('search-btn');
            
            fireEvent.change(locationInput, { target: { value: '400001' } });
            fireEvent.click(searchBtn);
            
            // Verify that results are filtered
            const eventCards = document.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                const location = card.querySelector('.event-info').textContent;
                expect(location).toContain('400001');
            });
        });
    });

    describe('Leader Cards', () => {
        // Leaderboard tests removed because leaderboard carousel was removed from UI
    });
});