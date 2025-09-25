const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import sample data
const sampleEvents = require('./src/data/events.js');

// In-memory storage (in a real app, you'd use a database)
let events = [...sampleEvents];
let eventIdCounter = events.length;

// API Routes

// Get all events with optional filtering
app.get('/api/events', (req, res) => {
    try {
        let filteredEvents = [...events];
        
        // Filter by category
        if (req.query.category) {
            filteredEvents = filteredEvents.filter(event => 
                event.category === req.query.category
            );
        }
        
        // Filter by search term
        if (req.query.search) {
            const searchTerm = req.query.search.toLowerCase();
            filteredEvents = filteredEvents.filter(event =>
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm) ||
                event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Filter by location
        if (req.query.location) {
            const location = req.query.location.toLowerCase();
            filteredEvents = filteredEvents.filter(event =>
                event.city.toLowerCase().includes(location) ||
                event.address.toLowerCase().includes(location)
            );
        }
        
        // Exclude specific event (for related events)
        if (req.query.exclude) {
            filteredEvents = filteredEvents.filter(event => 
                event.id !== req.query.exclude
            );
        }
        
        // Sort by date (upcoming first)
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Limit results
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            filteredEvents = filteredEvents.slice(0, limit);
        }
        
        res.json(filteredEvents);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single event by ID
app.get('/api/events/:id', (req, res) => {
    try {
        const eventId = req.params.id;
        const event = events.find(e => e.id === eventId);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new event
app.post('/api/events', (req, res) => {
    try {
        const {
            title,
            description,
            category,
            type,
            date,
            time,
            datetime,
            duration,
            timezone,
            venue,
            address,
            city,
            state,
            isFree,
            price,
            maxAttendees,
            tags,
            image,
            organizer,
            email
        } = req.body;
        
        // Validation
        if (!title || !description || !category || !type || !date || !time || !city || !organizer || !email) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                success: false 
            });
        }
        
        // Create new event
        const newEvent = {
            id: uuidv4(),
            title: title.trim(),
            description: description.trim(),
            category,
            type,
            date: datetime || `${date}T${time}:00.000Z`,
            duration: duration || null,
            timezone: timezone || 'EST',
            venue: venue ? venue.trim() : null,
            address: address ? address.trim() : null,
            city: city.trim(),
            state: state ? state.trim() : null,
            isFree: Boolean(isFree),
            price: isFree ? 0 : (parseFloat(price) || 0),
            maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
            image: image || null,
            organizer: organizer.trim(),
            organizerEmail: email.trim(),
            attendees: 0,
            interested: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to events array
        events.push(newEvent);
        eventIdCounter++;
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            eventId: newEvent.id,
            event: newEvent
        });
        
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            success: false 
        });
    }
});

// Update event
app.put('/api/events/:id', (req, res) => {
    try {
        const eventId = req.params.id;
        const eventIndex = events.findIndex(e => e.id === eventId);
        
        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        // Update event (merge with existing data)
        const updatedEvent = {
            ...events[eventIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        events[eventIndex] = updatedEvent;
        
        res.json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });
        
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete event
app.delete('/api/events/:id', (req, res) => {
    try {
        const eventId = req.params.id;
        const eventIndex = events.findIndex(e => e.id === eventId);
        
        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        // Remove event from array
        const deletedEvent = events.splice(eventIndex, 1)[0];
        
        res.json({
            success: true,
            message: 'Event deleted successfully',
            event: deletedEvent
        });
        
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update attendance (simplified version)
app.post('/api/events/:id/attendance', (req, res) => {
    try {
        const eventId = req.params.id;
        const { type, action } = req.body; // type: 'going' | 'interested', action: 'add' | 'remove'
        
        const event = events.find(e => e.id === eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        if (type === 'going') {
            if (action === 'add') {
                event.attendees = (event.attendees || 0) + 1;
            } else if (action === 'remove' && event.attendees > 0) {
                event.attendees -= 1;
            }
        } else if (type === 'interested') {
            if (action === 'add') {
                event.interested = (event.interested || 0) + 1;
            } else if (action === 'remove' && event.interested > 0) {
                event.interested -= 1;
            }
        }
        
        res.json({
            success: true,
            attendees: event.attendees,
            interested: event.interested
        });
        
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get event statistics (for admin dashboard)
app.get('/api/stats', (req, res) => {
    try {
        const totalEvents = events.length;
        const totalAttendees = events.reduce((sum, event) => sum + (event.attendees || 0), 0);
        const eventsByCategory = events.reduce((acc, event) => {
            acc[event.category] = (acc[event.category] || 0) + 1;
            return acc;
        }, {});
        
        const upcomingEvents = events.filter(event => 
            new Date(event.date) > new Date()
        ).length;
        
        res.json({
            totalEvents,
            upcomingEvents,
            totalAttendees,
            eventsByCategory
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve HTML pages for SPA routing
app.get('/event-details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'event-details.html'));
});

app.get('/create-event.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-event.html'));
});

// Catch-all handler: serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 EventHub server is running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api/events`);
    console.log(`🎉 Total events loaded: ${events.length}`);
});

module.exports = app;