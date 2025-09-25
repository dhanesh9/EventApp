// Create Event JavaScript
class CreateEventApp {
    constructor() {
        this.form = document.getElementById('create-event-form');
        this.previewPanel = document.getElementById('preview-panel');
        this.isPreviewOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupConditionalFields();
        this.setupMobileMenu();
        this.setDefaultValues();
    }

    setupEventListeners() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Preview functionality
        const previewBtn = document.getElementById('preview-btn');
        const closePreviewBtn = document.getElementById('close-preview');

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.togglePreview());
        }

        if (closePreviewBtn) {
            closePreviewBtn.addEventListener('click', () => this.closePreview());
        }

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Event type change handler
        const eventTypeSelect = document.getElementById('event-type');
        if (eventTypeSelect) {
            eventTypeSelect.addEventListener('change', () => this.handleEventTypeChange());
        }

        // Free event checkbox
        const freeEventCheckbox = document.getElementById('free-event');
        if (freeEventCheckbox) {
            freeEventCheckbox.addEventListener('change', () => this.handleFreeEventToggle());
        }

        // Modal handlers
        const successModal = document.getElementById('success-modal');
        const viewEventBtn = document.getElementById('view-event-btn');
        const createAnotherBtn = document.getElementById('create-another-btn');

        if (viewEventBtn) {
            viewEventBtn.addEventListener('click', () => this.handleViewEvent());
        }

        if (createAnotherBtn) {
            createAnotherBtn.addEventListener('click', () => this.handleCreateAnother());
        }
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

    setDefaultValues() {
        // Set minimum date to today
        const eventDateInput = document.getElementById('event-date');
        if (eventDateInput) {
            const today = new Date().toISOString().split('T')[0];
            eventDateInput.min = today;
        }

        // Set default timezone based on user's location
        const timezoneSelect = document.getElementById('event-timezone');
        if (timezoneSelect) {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const timezoneMap = {
                'America/New_York': 'EST',
                'America/Chicago': 'CST',
                'America/Denver': 'MST',
                'America/Los_Angeles': 'PST'
            };
            const mappedTimezone = timezoneMap[userTimezone];
            if (mappedTimezone) {
                timezoneSelect.value = mappedTimezone;
            }
        }
    }

    setupConditionalFields() {
        this.handleEventTypeChange();
        this.handleFreeEventToggle();
    }

    handleEventTypeChange() {
        const eventType = document.getElementById('event-type').value;
        const venueSection = document.getElementById('venue-section');
        const addressSection = document.getElementById('address-section');
        const locationDetails = document.getElementById('location-details');
        const addressInput = document.getElementById('event-address');

        if (eventType === 'online') {
            if (venueSection) venueSection.style.display = 'none';
            if (locationDetails) locationDetails.style.display = 'none';
            if (addressInput) {
                addressInput.placeholder = 'Meeting link (will be shared after registration)';
                addressInput.required = false;
            }
        } else {
            if (venueSection) venueSection.style.display = 'block';
            if (locationDetails) locationDetails.style.display = 'block';
            if (addressInput) {
                addressInput.placeholder = 'Full address';
                addressInput.required = true;
            }
        }
    }

    handleFreeEventToggle() {
        const freeEventCheckbox = document.getElementById('free-event');
        const priceSection = document.getElementById('price-section');
        const priceInput = document.getElementById('event-price');

        if (freeEventCheckbox && freeEventCheckbox.checked) {
            if (priceSection) priceSection.style.display = 'none';
            if (priceInput) priceInput.required = false;
        } else {
            if (priceSection) priceSection.style.display = 'block';
            if (priceInput) priceInput.required = false; // Make optional for now
        }
    }

    setupFormValidation() {
        // Custom validation messages
        const validators = {
            'event-title': {
                required: 'Event title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters long' }
            },
            'event-description': {
                required: 'Event description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters long' }
            },
            'event-category': {
                required: 'Please select a category'
            },
            'event-type': {
                required: 'Please select event type'
            },
            'event-date': {
                required: 'Event date is required',
                custom: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                        return 'Event date cannot be in the past';
                    }
                    return null;
                }
            },
            'event-time': {
                required: 'Start time is required'
            },
            'event-address': {
                required: 'Address is required'
            },
            'event-city': {
                required: 'City is required'
            },
            'organizer-name': {
                required: 'Organizer name is required'
            },
            'contact-email': {
                required: 'Contact email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
            }
        };

        this.validators = validators;
    }

    validateField(field) {
        const fieldName = field.id;
        const value = field.value.trim();
        const validator = this.validators[fieldName];

        if (!validator) return true;

        // Clear previous errors
        this.clearFieldError(field);

        // Required validation
        if (validator.required && !value) {
            this.showFieldError(field, validator.required);
            return false;
        }

        // Skip other validations if field is empty and not required
        if (!value) return true;

        // Min length validation
        if (validator.minLength && value.length < validator.minLength.value) {
            this.showFieldError(field, validator.minLength.message);
            return false;
        }

        // Pattern validation
        if (validator.pattern && !validator.pattern.value.test(value)) {
            this.showFieldError(field, validator.pattern.message);
            return false;
        }

        // Custom validation
        if (validator.custom) {
            const customError = validator.custom(value);
            if (customError) {
                this.showFieldError(field, customError);
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(field.id.replace('event-', '').replace('contact-', '').replace('organizer-', '') + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(field.id.replace('event-', '').replace('contact-', '').replace('organizer-', '') + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showNotification('Please fix all errors before submitting', 'error');
            return;
        }

        const formData = this.collectFormData();
        
        try {
            this.showLoading();
            const response = await this.submitEvent(formData);
            
            if (response.success) {
                this.showSuccessModal(response.eventId);
            } else {
                throw new Error(response.message || 'Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            this.showNotification('Failed to create event. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Process tags
        if (data.tags) {
            data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        // Process checkbox values
        data.isFree = document.getElementById('free-event').checked;

        // Set price to 0 if free event
        if (data.isFree) {
            data.price = 0;
        } else {
            data.price = parseFloat(data.price) || 0;
        }

        // Process duration
        if (data.duration) {
            data.duration = parseFloat(data.duration);
        }

        // Process max attendees
        if (data.maxAttendees) {
            data.maxAttendees = parseInt(data.maxAttendees);
        }

        // Combine date and time
        if (data.date && data.time) {
            data.datetime = new Date(`${data.date}T${data.time}`).toISOString();
        }

        return data;
    }

    async submitEvent(eventData) {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        return await response.json();
    }

    togglePreview() {
        if (this.isPreviewOpen) {
            this.closePreview();
        } else {
            this.openPreview();
        }
    }

    openPreview() {
        const formData = this.collectFormData();
        this.renderPreview(formData);
        this.previewPanel.classList.add('active');
        this.isPreviewOpen = true;
        document.body.style.paddingRight = '400px';
    }

    closePreview() {
        this.previewPanel.classList.remove('active');
        this.isPreviewOpen = false;
        document.body.style.paddingRight = '0';
    }

    renderPreview(data) {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;

        const eventDate = data.date ? new Date(data.date + 'T' + (data.time || '12:00')) : new Date();
        
        previewContent.innerHTML = `
            <div class="preview-event-card">
                <div class="preview-image">
                    <img src="${data.image || '/images/default-event.svg'}" alt="Event preview" onerror="this.src='/images/default-event.svg'">
                    <div class="preview-badge">${this.getCategoryDisplayName(data.category) || 'Category'}</div>
                </div>
                <div class="preview-info">
                    <h3>${data.title || 'Event Title'}</h3>
                    <div class="preview-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${data.time || 'Time TBD'}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${data.type === 'online' ? 'Online Event' : (data.city || 'Location TBD')}</span>
                        </div>
                    </div>
                    <p>${data.description || 'Event description will appear here...'}</p>
                    <div class="preview-price">${data.isFree ? 'Free' : '$' + (data.price || '0')}</div>
                    ${data.tags && data.tags.length > 0 ? `
                        <div class="preview-tags">
                            ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
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

    showSuccessModal(eventId) {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.add('active');
            // Store event ID for navigation
            this.createdEventId = eventId;
        }
    }

    hideSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    handleViewEvent() {
        if (this.createdEventId) {
            window.location.href = `/event-details.html?id=${this.createdEventId}`;
        }
    }

    handleCreateAnother() {
        this.hideSuccessModal();
        this.form.reset();
        this.setDefaultValues();
        this.setupConditionalFields();
        window.scrollTo(0, 0);
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
    new CreateEventApp();
});

// Add CSS for preview and form validation
const additionalStyles = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .preview-event-card {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background: white;
    }
    
    .preview-image {
        height: 200px;
        position: relative;
        overflow: hidden;
    }
    
    .preview-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .preview-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
    }
    
    .preview-info {
        padding: 1.5rem;
    }
    
    .preview-info h3 {
        margin-bottom: 1rem;
        color: #333;
    }
    
    .preview-meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .preview-meta .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        font-size: 0.9rem;
    }
    
    .preview-meta .meta-item i {
        color: #007bff;
        width: 16px;
    }
    
    .preview-price {
        font-weight: 600;
        color: #28a745;
        font-size: 1.1rem;
        margin: 1rem 0;
    }
    
    .preview-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
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
    
    @media (max-width: 768px) {
        body.preview-open {
            padding-right: 0 !important;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);