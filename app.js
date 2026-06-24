/**
 * CampusConnect — Application Logic
 * Pure front-end interactivity with localStorage data persistence.
 */
// 1. Baseline default events
const defaultEvents = [
    {
        id: 1,
        name: 'Annual Tech Fest',
        category: 'fest',
        date: '2026-09-15',
        time: '10:00',
        venue: 'Main Auditorium',
        description: 'A 2-day celebration of technology, innovation, and student projects. Join coding hackathons, robot wars, and guest lectures from industry leaders.',
        organiser: 'Tech Club',
        contact: 'techclub@campus.edu'
    },
    {
        id: 2,
        name: 'Python for Beginners Workshop',
        category: 'workshop',
        date: '2026-09-20',
        time: '14:00',
        venue: 'Lab 3, Block B',
        description: 'Hands-on introduction to Python programming for first-year students. Learn syntax, basic data structures, and build your first script in 3 hours!',
        organiser: 'CS Dept',
        contact: 'cs@campus.edu'
    },
    {
        id: 3,
        name: 'Inter-College Cricket Tournament',
        category: 'sports',
        date: '2026-10-05',
        time: '09:00',
        venue: 'Campus Sports Ground',
        description: 'Cheer for your college team as they compete for the championship in the annual cricket league. Match schedules and team listings will be shared.',
        organiser: 'Sports Committee',
        contact: 'sports@campus.edu'
    },
    {
        id: 4,
        name: 'Photography Club Meetup',
        category: 'club',
        date: '2026-09-28',
        time: '16:00',
        venue: 'Seminar Hall 1',
        description: 'Connect with fellow photographers. We will review member portfolios, discuss techniques for low-light photography, and plan our next outdoor photowalk.',
        organiser: 'Creative Arts Club',
        contact: 'photography@campus.edu'
    },
    {
        id: 5,
        name: 'Web Development Boot Camp',
        category: 'workshop',
        date: '2026-10-12',
        time: '10:00',
        venue: 'Lab 5, Block C',
        description: 'Master HTML, CSS, and modern Javascript. Learn how to build responsive layouts and interact with browser APIs. Pre-requisite: basic programming logic.',
        organiser: 'Coding Society',
        contact: 'codesoc@campus.edu'
    },
    {
        id: 6,
        name: 'Cultural Night & Music Fest',
        category: 'fest',
        date: '2026-10-25',
        time: '18:00',
        venue: 'Open Air Theatre',
        description: 'An evening of music, dance, and drama showcasing the diverse cultures on campus. Performances by college band and invited guest artists.',
        organiser: 'Cultural Club',
        contact: 'cultural@campus.edu'
    }
];
// 2. Load custom events and combine with default events
function getEvents() {
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
    return [...defaultEvents, ...customEvents];
}
// 3. Toast Helper Function for Premium UX Notifications
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMsg = document.getElementById('toast-message');
    if (toastMsg) toastMsg.textContent = message;

    if (isSuccess) {
        toast.classList.add('toast-success');
    } else {
        toast.classList.remove('toast-success');
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
// 4. Render Event Cards for main listings (events.html)
function renderEvents(list) {
    const grid = document.getElementById('events-grid');
    if (!grid) return; // Exit if not on events.html

    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<p class="no-results" style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px 0;">No events found matching this category.</p>';
        return;
    }

    list.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';

        // Format category badge styling class
        const categoryClass = `badge-${event.category.toLowerCase()}`;

        card.innerHTML = `
      <span class="category-badge ${categoryClass}">${event.category}</span>
      <h3>${event.name}</h3>
      <div class="event-meta">
        <div><strong>Date:</strong> ${event.date}</div>
        <div><strong>Venue:</strong> ${event.venue}</div>
      </div>
      <p class="description">${event.description.slice(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
      <a href="event-detail.html?id=${event.id}" class="btn-primary">View Details</a>
    `;
        grid.appendChild(card);
    });
}
// 5. Render Featured Events on Landing Page (index.html)
function renderFeaturedEvents() {
    const featuredGrid = document.getElementById('featured-grid');
    if (!featuredGrid) return; // Exit if not on index.html

    const allEvents = getEvents();
    // Get first 3 events
    const featuredList = allEvents.slice(0, 3);

    featuredGrid.innerHTML = '';
    featuredList.forEach(event => {
        const card = document.createElement('article');
        card.className = 'event-card';
        const categoryClass = `badge-${event.category.toLowerCase()}`;

        card.innerHTML = `
      <span class="category-badge ${categoryClass}">${event.category}</span>
      <h3>${event.name}</h3>
      <div class="event-meta">
        <div><strong>Date:</strong> ${event.date}</div>
        <div><strong>Venue:</strong> ${event.venue}</div>
      </div>
      <p class="description">${event.description.slice(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
      <a href="event-detail.html?id=${event.id}" class="btn-primary">View Details</a>
    `;
        featuredGrid.appendChild(card);
    });
}
// 6. Category Filter Button Handlers (events.html)
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filters button');
    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Manage active visual state
            document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter.toLowerCase();
            const allEvents = getEvents();

            const filtered = filter === 'all'
                ? allEvents
                : allEvents.filter(e => e.category.toLowerCase() === filter);

            renderEvents(filtered);
        });
    });
}
// 7. Dynamic Event Detail Loading (event-detail.html)
function loadEventDetails() {
    const detailContainer = document.getElementById('detail-container');
    if (!detailContainer) return; // Exit if not on event-detail.html

    const params = new URLSearchParams(window.location.search);
    const eventId = parseInt(params.get('id'));

    if (isNaN(eventId)) {
        detailContainer.innerHTML = '<div class="empty-state"><h3>Invalid Event ID</h3><p>Please return to the events catalog to pick a valid event.</p><a href="events.html" class="btn-primary">Browse Events</a></div>';
        return;
    }

    const allEvents = getEvents();
    const event = allEvents.find(e => e.id === eventId);

    if (!event) {
        detailContainer.innerHTML = '<div class="empty-state"><h3>Event Not Found</h3><p>The event you are looking for does not exist or has been removed.</p><a href="events.html" class="btn-primary">Browse Events</a></div>';
        return;
    }

    // Fill text contents
    document.getElementById('event-title').textContent = event.name;
    document.getElementById('event-date').textContent = event.date;
    document.getElementById('event-time').textContent = event.time || '10:00 AM';
    document.getElementById('event-venue').textContent = event.venue;
    document.getElementById('event-desc').textContent = event.description;

    // Category badges
    const categoryBadge = document.getElementById('event-category');
    const categoryName = document.getElementById('event-category-name');

    if (categoryBadge && categoryName) {
        categoryBadge.textContent = event.category;
        categoryBadge.className = `category-badge badge-${event.category.toLowerCase()}`;
        categoryName.textContent = event.category.charAt(0).toUpperCase() + event.category.slice(1);
    }

    // Organizer details
    document.getElementById('organiser-name').textContent = event.organiser || 'Campus Organiser';
    document.getElementById('organiser-email').textContent = event.contact || 'contact@campus.edu';

    // Register button functionality
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        // Check if user is already registered for this event
        const registeredIds = JSON.parse(localStorage.getItem('registrations')) || [];
        if (registeredIds.includes(eventId)) {
            setRegisteredState(registerBtn);
        }

        registerBtn.addEventListener('click', function () {
            let registered = JSON.parse(localStorage.getItem('registrations')) || [];

            if (registered.includes(eventId)) {
                showToast('You have already registered for this event!', false);
                return;
            }

            registered.push(eventId);
            localStorage.setItem('registrations', JSON.stringify(registered));

            showToast('Successfully registered for this event!');
            setRegisteredState(this);
        });
    }
}
function setRegisteredState(button) {
    button.textContent = '✓ Registered!';
    button.disabled = true;
    button.style.backgroundColor = '#1B6E2E';
    button.style.boxShadow = 'none';
    button.style.cursor = 'default';
}
// 8. Render Registered Events (my-registrations.html)
function renderMyRegistrations() {
    const listContainer = document.getElementById('registrations-list');
    const emptyState = document.getElementById('empty-registrations-state');
    if (!listContainer || !emptyState) return; // Exit if not on my-registrations.html

    const registeredIds = JSON.parse(localStorage.getItem('registrations')) || [];
    const allEvents = getEvents();

    const registeredEvents = allEvents.filter(e => registeredIds.includes(e.id));

    if (registeredEvents.length === 0) {
        emptyState.style.display = 'block';
        listContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        listContainer.style.display = 'grid';
        listContainer.innerHTML = '';

        registeredEvents.forEach(event => {
            const card = document.createElement('article');
            card.className = 'event-card';
            const categoryClass = `badge-${event.category.toLowerCase()}`;

            card.innerHTML = `
        <span class="category-badge ${categoryClass}">${event.category}</span>
        <h3>${event.name}</h3>
        <div class="event-meta">
          <div><strong>Date:</strong> ${event.date}</div>
          <div><strong>Venue:</strong> ${event.venue}</div>
        </div>
        <p class="description">${event.description.slice(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
        <a href="event-detail.html?id=${event.id}" class="btn-primary">View Details</a>
      `;
            listContainer.appendChild(card);
        });
    }
}
// 9. Add Event Form Handler and Validation (add-event.html)
function setupAddEventForm() {
    const form = document.getElementById('add-event-form');
    if (!form) return; // Exit if not on add-event.html

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const name = document.getElementById('event-name').value.trim();
        const category = document.getElementById('category').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const venue = document.getElementById('venue').value.trim();
        const description = document.getElementById('description').value.trim();
        const organiserName = document.getElementById('organiser-name').value.trim();
        const organiserEmail = document.getElementById('organiser-email').value.trim();

        let hasError = false;

        // Validate fields
        if (!name) {
            showError('name-error', 'Event name is required');
            hasError = true;
        }

        if (!category) {
            showError('cat-error', 'Please select a category');
            hasError = true;
        }

        if (!date) {
            showError('date-error', 'Date is required');
            hasError = true;
        }

        if (!time) {
            showError('time-error', 'Time is required');
            hasError = true;
        }

        if (!venue) {
            showError('venue-error', 'Venue is required');
            hasError = true;
        }

        if (description.length < 20) {
            showError('desc-error', 'Description must be at least 20 characters');
            hasError = true;
        }

        if (!organiserName) {
            showError('organiser-name-error', 'Organiser or Club name is required');
            hasError = true;
        }

        if (!organiserEmail) {
            showError('organiser-email-error', 'Organiser email is required');
            hasError = true;
        } else if (!validateEmail(organiserEmail)) {
            showError('organiser-email-error', 'Please enter a valid email address');
            hasError = true;
        }

        if (hasError) {
            showToast('Please correct the validation errors', false);
            return;
        }

        // Save new event to localStorage
        const saved = JSON.parse(localStorage.getItem('customEvents')) || [];
        const newEvent = {
            id: Date.now(), // Generate unique ID
            name,
            category,
            date,
            time,
            venue,
            description,
            organiser: organiserName,
            contact: organiserEmail
        };

        saved.push(newEvent);
        localStorage.setItem('customEvents', JSON.stringify(saved));

        showToast('Event added successfully!');
        form.reset();

        // Optional redirection to events page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'events.html';
        }, 1500);
    });
}
function showError(id, msg) {
    const errorEl = document.getElementById(id);
    if (errorEl) {
        errorEl.textContent = msg;
    }
}
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
// 10. Initialization on page load
document.addEventListener('DOMContentLoaded', () => {
    // Determine page and trigger specific initialization
    const allEvents = getEvents();

    // If on events.html, render listings and set up filtering
    if (document.getElementById('events-grid')) {
        renderEvents(allEvents);
        setupCategoryFilters();
    }

    // If on index.html, load top 3 events
    if (document.getElementById('featured-grid')) {
        renderFeaturedEvents();
    }

    // If on event-detail.html, parse query params and populate
    if (document.getElementById('detail-container')) {
        loadEventDetails();
    }

    // If on my-registrations.html, fetch localstorage registered list
    if (document.getElementById('registrations-container')) {
        renderMyRegistrations();
    }

    // If on add-event.html, setup form controls and validations
    if (document.getElementById('add-event-form')) {
        setupAddEventForm();
    }
});
