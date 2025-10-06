document.addEventListener('DOMContentLoaded', function () {
    const contextMenu = document.getElementById('contextMenu');
    let activeSubmenu = null;

    // Show the custom context menu on right-click
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        closeSubmenus();

        // Position the menu where the click occurred
        let posX = e.pageX;
        let posY = e.pageY;

        // Ensure the menu stays within the viewport
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;

        if (posX + menuWidth > window.innerWidth) {
            posX = window.innerWidth - menuWidth - 5;
        }

        if (posY + menuHeight > window.innerHeight) {
            posY = window.innerHeight - menuHeight - 5;
        }

        // Ensure menu doesn't go off the left or top
        posX = Math.max(5, posX);
        posY = Math.max(5, posY);

        contextMenu.style.left = posX + 'px';
        contextMenu.style.top = posY + 'px';
        contextMenu.style.display = 'block';
    });

    // Hide the custom context menu on left-click outside
    document.addEventListener('click', function (e) {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = 'none';
            closeSubmenus();
        }
    });

    // Add functionality to menu items
    const menuItems = contextMenu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (this.classList.contains('has-submenu')) {
                // Don't close menu if it has a submenu
                e.stopPropagation();
                return;
            }

            const action = this.querySelector('span:not(.shortcut):not(.menu-arrow)').textContent;
            alert(`You selected: ${action}`);
            contextMenu.style.display = 'none';
        });

        // Handle submenu hover
        item.addEventListener('mouseenter', function (e) {
            closeSubmenus();

            if (this.classList.contains('has-submenu')) {
                const submenu = this.querySelector('.submenu');
                if (submenu) {
                    activeSubmenu = submenu;

                    // Position the submenu properly
                    const rect = this.getBoundingClientRect();
                    const submenuWidth = submenu.offsetWidth;
                    const submenuHeight = submenu.offsetHeight;

                    let subPosX = rect.right;
                    let subPosY = rect.top;

                    // Adjust if submenu would go off the right side
                    if (subPosX + submenuWidth > window.innerWidth) {
                        subPosX = rect.left - submenuWidth;
                    }

                    // Adjust if submenu would go off the bottom
                    if (subPosY + submenuHeight > window.innerHeight) {
                        subPosY = window.innerHeight - submenuHeight - 5;
                    }

                    submenu.style.left = (subPosX - rect.left) + 'px';
                    submenu.style.top = '0';
                    submenu.style.display = 'block';
                }
            }
        });
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            contextMenu.style.display = 'none';
            closeSubmenus();
        }
    });

    function closeSubmenus() {
        if (activeSubmenu) {
            activeSubmenu.style.display = 'none';
            activeSubmenu = null;
        }

        // Close all submenus
        const allSubmenus = contextMenu.querySelectorAll('.submenu');
        allSubmenus.forEach(submenu => {
            submenu.style.display = 'none';
        });
    }

    // Theme switching functionality
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', function () {
            switchTheme(this.dataset.theme);
        });
    });

    function switchTheme(theme) {
        const root = document.documentElement;

        switch (theme) {
            case 'light':
                root.style.setProperty('--bg-primary', '#f5f5f5');
                root.style.setProperty('--bg-secondary', '#ffffff');
                root.style.setProperty('--bg-accent', '#e8e8e8');
                root.style.setProperty('--bg-hover', '#d0e8ff');
                root.style.setProperty('--text-primary', '#000000');
                root.style.setProperty('--text-secondary', '#333333');
                root.style.setProperty('--text-muted', '#666666');
                root.style.setProperty('--border-color', '#e0e0e0');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.15)');
                break;

            case 'blue':
                root.style.setProperty('--bg-primary', '#0d2b4b');
                root.style.setProperty('--bg-secondary', '#1a3c61');
                root.style.setProperty('--bg-accent', '#2a5298');
                root.style.setProperty('--bg-hover', '#3a6bc0');
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#e6f7ff');
                root.style.setProperty('--text-muted', '#a8d8ff');
                root.style.setProperty('--border-color', '#2a5298');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
                break;

            case 'green':
                root.style.setProperty('--bg-primary', '#1a3b2a');
                root.style.setProperty('--bg-secondary', '#244c36');
                root.style.setProperty('--bg-accent', '#2e8b57');
                root.style.setProperty('--bg-hover', '#3cb371');
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#e6fff2');
                root.style.setProperty('--text-muted', '#a8ffd6');
                root.style.setProperty('--border-color', '#2e8b57');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
                break;

            default: // dark theme
                root.style.setProperty('--bg-primary', '#1e1e1e');
                root.style.setProperty('--bg-secondary', '#2d2d30');
                root.style.setProperty('--bg-accent', '#3e3e42');
                root.style.setProperty('--bg-hover', '#094771');
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#cccccc');
                root.style.setProperty('--text-muted', '#888888');
                root.style.setProperty('--border-color', '#3e3e42');
                root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.4)');
        }
    }
});