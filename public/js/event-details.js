// Event Details JavaScript
class EventDetailsApp {
    constructor() {
        this.eventId = this.getEventIdFromUrl();
        this.event = null;
        this.userAttendance = {
            isGoing: false,
            isInterested: false
        };
        
        this.init();
    }

    init() {
        if (!this.eventId) {
            this.showError('Event not found');
            return;
        }
        
        this.setupEventListeners();
        this.loadEventDetails();
        this.loadRelatedEvents();
        this.setupMobileMenu();
    }

    getEventIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    setupEventListeners() {
        // Attendance buttons
        const attendBtn = document.getElementById('attend-btn');
        const interestedBtn = document.getElementById('interested-btn');

        if (attendBtn) {
            attendBtn.addEventListener('click', () => this.toggleAttendance('going'));
        }

        if (interestedBtn) {
            interestedBtn.addEventListener('click', () => this.toggleAttendance('interested'));
        }

        // Share buttons
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                this.shareEvent(platform);
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    async loadEventDetails() {
        this.showLoading();
        
        try {
            const response = await fetch(`/api/events/${this.eventId}`);
            if (!response.ok) {
                throw new Error('Event not found');
            }
            
            this.event = await response.json();
            this.renderEventDetails();
        } catch (error) {
            console.error('Error loading event details:', error);
            this.showError('Failed to load event details. Please try again later.');
        } finally {
            this.hideLoading();
        }
    }

    renderEventDetails() {
        if (!this.event) return;

        // Update page title and breadcrumb
        document.title = `${this.event.title} - EventHub`;
        const breadcrumb = document.getElementById('event-breadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = this.event.title;
        }

        // Update event image
        const eventImage = document.getElementById('event-image');
        if (eventImage) {
            eventImage.src = this.event.image || '/images/default-event.svg';
            eventImage.alt = this.event.title;
        }

        // Update event category badge
        const categoryBadge = document.getElementById('event-category');
        if (categoryBadge) {
            categoryBadge.textContent = this.getCategoryDisplayName(this.event.category);
        }

        // Update event title
        const eventTitle = document.getElementById('event-title');
        if (eventTitle) {
            eventTitle.textContent = this.event.title;
        }

        // Update event meta information
        this.updateEventMeta();

        // Update event description
        const descriptionContent = document.getElementById('event-description-content');
        if (descriptionContent) {
            descriptionContent.innerHTML = this.formatDescription(this.event.description);
        }

        // Update organizer information
        this.updateOrganizerInfo();

        // Update event tags
        this.updateEventTags();

        // Update pricing information
        this.updatePricingInfo();

        // Update location information
        this.updateLocationInfo();

        // Update attendance counts
        this.updateAttendanceCounts();
    }

    updateEventMeta() {
        const eventDate = new Date(this.event.date);
        
        const dateElement = document.getElementById('event-date');
        if (dateElement) {
            dateElement.textContent = eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        const timeElement = document.getElementById('event-time');
        if (timeElement) {
            const timeStr = eventDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            
            if (this.event.duration) {
                const endTime = new Date(eventDate.getTime() + (this.event.duration * 60 * 60 * 1000));
                const endTimeStr = endTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                timeElement.textContent = `${timeStr} - ${endTimeStr}`;
            } else {
                timeElement.textContent = timeStr;
            }
        }

        const locationElement = document.getElementById('event-location');
        if (locationElement) {
            if (this.event.type === 'online') {
                locationElement.innerHTML = '<i class="fas fa-globe"></i> Online Event';
            } else {
                locationElement.textContent = `${this.event.venue || ''} ${this.event.city}, ${this.event.state || ''}`.trim();
            }
        }

        const attendeesElement = document.getElementById('event-attendees');
        if (attendeesElement) {
            attendeesElement.textContent = `${this.event.attendees || 0} attendees`;
        }
    }

    updateOrganizerInfo() {
        const organizerName = document.getElementById('organizer-name');
        const organizerBio = document.getElementById('organizer-bio');

        if (organizerName) {
            organizerName.textContent = this.event.organizer || 'Event Organizer';
        }

        if (organizerBio) {
            organizerBio.textContent = this.event.organizerBio || 'Event organizer';
        }
    }

    updateEventTags() {
        const tagsContainer = document.getElementById('event-tags');
        if (tagsContainer && this.event.tags && this.event.tags.length > 0) {
            tagsContainer.innerHTML = this.event.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('');
        } else if (tagsContainer) {
            tagsContainer.innerHTML = '<span class="tag">No tags</span>';
        }
    }

    updatePricingInfo() {
        const priceElement = document.getElementById('event-price');
        if (priceElement) {
            priceElement.textContent = this.event.isFree ? 'Free' : `$${this.event.price}`;
        }
    }

    updateLocationInfo() {
        const locationAddress = document.getElementById('location-address');
        if (locationAddress) {
            if (this.event.type === 'online') {
                locationAddress.innerHTML = `
                    <p><strong>Online Event</strong></p>
                    <p>Join link will be provided after registration</p>
                `;
            } else {
                const address = [
                    this.event.venue,
                    this.event.address,
                    this.event.city,
                    this.event.state
                ].filter(Boolean).join(', ');
                
                locationAddress.innerHTML = `<p>${address}</p>`;
            }
        }
    }

    updateAttendanceCounts() {
        const goingCount = document.getElementById('going-count');
        const interestedCount = document.getElementById('interested-count');

        if (goingCount) {
            goingCount.textContent = this.event.attendees || 0;
        }

        if (interestedCount) {
            interestedCount.textContent = this.event.interested || 0;
        }
    }

    formatDescription(description) {
        // Convert line breaks to paragraphs
        return description.split('\n').map(paragraph => 
            paragraph.trim() ? `<p>${paragraph}</p>` : ''
        ).join('');
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

    async toggleAttendance(type) {
        const attendBtn = document.getElementById('attend-btn');
        const interestedBtn = document.getElementById('interested-btn');

        try {
            if (type === 'going') {
                this.userAttendance.isGoing = !this.userAttendance.isGoing;
                if (this.userAttendance.isGoing) {
                    this.userAttendance.isInterested = false;
                    attendBtn.innerHTML = '<i class="fas fa-check"></i> Attending';
                    attendBtn.classList.add('attending');
                    interestedBtn.innerHTML = '<i class="fas fa-heart"></i> Interested';
                    interestedBtn.classList.remove('interested');
                } else {
                    attendBtn.innerHTML = '<i class="fas fa-check"></i> Attend Event';
                    attendBtn.classList.remove('attending');
                }
            } else if (type === 'interested') {
                this.userAttendance.isInterested = !this.userAttendance.isInterested;
                if (this.userAttendance.isInterested) {
                    this.userAttendance.isGoing = false;
                    interestedBtn.innerHTML = '<i class="fas fa-heart"></i> Interested';
                    interestedBtn.classList.add('interested');
                    attendBtn.innerHTML = '<i class="fas fa-check"></i> Attend Event';
                    attendBtn.classList.remove('attending');
                } else {
                    interestedBtn.innerHTML = '<i class="fas fa-heart"></i> Interested';
                    interestedBtn.classList.remove('interested');
                }
            }

            // Here you would typically send the update to the server
            // await this.updateAttendanceOnServer(type);
            
        } catch (error) {
            console.error('Error updating attendance:', error);
            this.showNotification('Failed to update attendance. Please try again.', 'error');
        }
    }

    shareEvent(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.event.title);
        const description = encodeURIComponent(this.event.description.substring(0, 100) + '...');

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'copy':
                this.copyToClipboard(window.location.href);
                this.showNotification('Link copied to clipboard!', 'success');
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    async loadRelatedEvents() {
        try {
            const response = await fetch(`/api/events?category=${this.event.category}&exclude=${this.eventId}&limit=3`);
            const relatedEvents = await response.json();
            this.renderRelatedEvents(relatedEvents);
        } catch (error) {
            console.error('Error loading related events:', error);
        }
    }

    renderRelatedEvents(events) {
        const relatedEventsGrid = document.getElementById('related-events-grid');
        if (!relatedEventsGrid) return;

        if (events.length === 0) {
            relatedEventsGrid.innerHTML = '<p>No related events found.</p>';
            return;
        }

        relatedEventsGrid.innerHTML = events.map(event => this.createEventCard(event)).join('');
    }

    createEventCard(event) {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

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
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.city}</span>
                        </div>
                    </div>
                    <div class="event-price">${event.isFree ? 'Free' : '$' + event.price}</div>
                </div>
            </div>
        `;
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
        const eventContent = document.querySelector('.event-content');
        if (eventContent) {
            eventContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Event Not Found</h3>
                    <p>${message}</p>
                    <a href="/" class="btn btn-primary">Back to Events</a>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventDetailsApp();
});

// Add CSS for notifications and attendance states
const additionalStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 1001;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #28a745;
    }
    
    .notification-error {
        border-left: 4px solid #dc3545;
    }
    
    .notification-info {
        border-left: 4px solid #007bff;
    }
    
    .btn.attending {
        background: #28a745 !important;
    }
    
    .btn.interested {
        background: #e83e8c !important;
        border-color: #e83e8c !important;
        color: white !important;
    }
    
    .error-message {
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
    }
    
    .error-message i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #ffc107;
    }
    
    .error-message h3 {
        margin-bottom: 1rem;
        color: #333;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);