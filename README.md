# EventHub - Event Management Platform

A modern, responsive event management website similar to EventBrite and Meetup, built with HTML, CSS, JavaScript, and Node.js.

## Features

### 🎉 Event Discovery
- Browse events by category (Technology, Business, Arts, Sports, Food, Music, etc.)
- Search events by title, description, or tags
- Filter events by location
- Filter by date (Today, Tomorrow, Weekend, All)
- Responsive event cards with images and key information

### 📅 Event Details
- Comprehensive event information display
- Interactive attendance buttons (Going, Interested)
- Social media sharing integration
- Related events suggestions
- Location information with map placeholder
- Organizer information and contact details

### ✨ Event Creation
- Step-by-step event creation form
- Real-time form validation
- Event preview functionality
- Support for in-person, online, and hybrid events
- Image upload support
- Tag system for better discoverability
- Pricing options (free or paid events)

### 🛠 Technical Features
- Responsive design that works on all devices
- Modern CSS with animations and transitions
- RESTful API with Express.js backend
- In-memory data storage (easily replaceable with database)
- Form validation and error handling
- Loading states and user feedback
- Mobile-friendly navigation

## Project Structure

```
EventApp/
├── public/                 # Frontend files
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   ├── main.js        # Homepage functionality
│   │   ├── event-details.js # Event details page
│   │   └── create-event.js  # Create event form
│   ├── images/            # Static images
│   ├── index.html         # Homepage
│   ├── event-details.html # Event details page
│   └── create-event.html  # Create event page
├── src/
│   ├── data/
│   │   └── events.js      # Sample event data
│   └── routes/            # API routes (future expansion)
├── server.js              # Express.js server
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd EventApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Events
- `GET /api/events` - Get all events with optional filtering
  - Query params: `category`, `search`, `location`, `exclude`, `limit`
- `GET /api/events/:id` - Get single event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Attendance
- `POST /api/events/:id/attendance` - Update attendance status

### Statistics
- `GET /api/stats` - Get platform statistics

## Sample Data

The application comes with 12 sample events covering different categories:
- Technology meetups
- Business workshops
- Art & cultural events
- Sports & fitness activities
- Food festivals
- Music performances
- Educational courses
- Health & wellness sessions

## Customization

### Adding New Categories
1. Update the category options in `create-event.html`
2. Add corresponding icons and styling in CSS
3. Update the `getCategoryDisplayName()` function in JavaScript files

### Styling
- Main styles are in `public/css/style.css`
- The design uses a modern color scheme with CSS Grid and Flexbox
- Responsive breakpoints at 768px and 480px

### Database Integration
To connect to a real database:
1. Replace the in-memory storage in `server.js`
2. Add database connection and models
3. Update API endpoints to use database queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

- User authentication and profiles
- Event registration and ticketing
- Payment integration
- Email notifications
- Calendar integration
- Advanced search filters
- Event analytics dashboard
- Social features (comments, reviews)
- Map integration for event locations
- Mobile app version

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Happy Event Planning! 🎉**