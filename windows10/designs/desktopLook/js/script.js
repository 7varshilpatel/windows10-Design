
// Get elements
const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');
const notificationButton = document.getElementById('notificationButton');
const notificationSidebar = document.getElementById('notificationSidebar');
const closeButton = document.getElementById('closeButton');
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('mainContent');

// State tracking
let isStartMenuOpen = false;
let isNotificationOpen = false;

// Start Menu functionality
function toggleStartMenu() {
    isStartMenuOpen = !isStartMenuOpen;

    if (isStartMenuOpen) {
        startMenu.classList.add('open');
        overlay.classList.add('active');
        startButton.classList.add('active');
        // Close notifications if open
        if (isNotificationOpen) {
            toggleNotifications();
        }
    } else {
        startMenu.classList.remove('open');
        overlay.classList.remove('active');
        startButton.classList.remove('active');
    }
}

// Notification sidebar functionality
function toggleNotifications() {
    isNotificationOpen = !isNotificationOpen;

    if (isNotificationOpen) {
        notificationSidebar.classList.add('open');
        overlay.classList.add('active');
        mainContent.classList.add('sidebar-open');
        notificationButton.classList.add('active');
        // Close start menu if open
        if (isStartMenuOpen) {
            toggleStartMenu();
        }
    } else {
        notificationSidebar.classList.remove('open');
        overlay.classList.remove('active');
        mainContent.classList.remove('sidebar-open');
        notificationButton.classList.remove('active');
    }
}

// Event listeners
startButton.addEventListener('click', toggleStartMenu);
notificationButton.addEventListener('click', toggleNotifications);
closeButton.addEventListener('click', toggleNotifications);

// Overlay click handling
overlay.addEventListener('click', () => {
    if (isStartMenuOpen) {
        toggleStartMenu();
    }
    if (isNotificationOpen) {
        toggleNotifications();
    }
});

// Handle individual notification close buttons
document.querySelectorAll('.action-button.close').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = button.closest('.notification-card');
        card.style.transform = 'translateX(100%)';
        card.style.opacity = '0';
        setTimeout(() => {
            card.remove();
        }, 300);
    });
});

// Handle settings buttons
document.querySelectorAll('.action-button.settings').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Settings clicked for notification');
    });
});

// Handle clear all notifications
document.querySelector('.clear-all-button').addEventListener('click', () => {
    const cards = document.querySelectorAll('.notification-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
            }, 300);
        }, index * 50);
    });
});

// Handle quick actions
document.querySelectorAll('.quick-action').forEach(action => {
    action.addEventListener('click', () => {
        console.log('Quick action clicked:', action.textContent);
    });
});

// Handle expand button
document.querySelector('.expand-button').addEventListener('click', () => {
    console.log('Expand clicked');
});

// Handle app items in start menu
document.querySelectorAll('.app-item').forEach(item => {
    item.addEventListener('click', () => {
        console.log('App clicked:', item.textContent.trim());
        toggleStartMenu(); // Close start menu when app is clicked
    });
});

// Handle tiles in start menu
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Tile clicked:', tile.querySelector('.tile-name').textContent);
        toggleStartMenu(); // Close start menu when tile is clicked
    });
});

// Escape key to close menus
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isStartMenuOpen) {
            toggleStartMenu();
        }
        if (isNotificationOpen) {
            toggleNotifications();
        }
    }
});

// Click outside to close start menu
document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && !startButton.contains(e.target) && isStartMenuOpen) {
        toggleStartMenu();
    }
});