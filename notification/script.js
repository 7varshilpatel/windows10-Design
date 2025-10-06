(function () {
    const btn = document.getElementById('notificationBtn');
    const icon = document.getElementById('notificationIcon');
    const pop = document.getElementById('popover');
    const toastContainer = document.getElementById('toastContainer');
    const clearAllBtn = document.getElementById('clearAll');
    let open = false;
    let unreadExists = false;
    let shakeTimeouts = new Map();

    // 🔔 Global SVGs (replace paths with your own)
    const ICON_DEFAULT = `
            <svg viewBox="0 0 12 13" xmlns="http://www.w3.org/2000/svg" fill="var(--fg)">
                <path
                    d="M6.35 0c-.8 0-.83.57-.83.84v.52c-1.18.23-1.98.96-2.62 1.98-.68 1.08-.11 3.03-.48 4.05-.37 1.02-1.38 2.2-1.52 2.34-.14.14.16.44.37.44l10.25-.02c.16 0 .44-.23.29-.42-.15-.19-1.05-1.05-1.44-2.03-.39-.97.19-3.09-.52-4.24C9.19 2.39 8.39 1.59 7.18 1.37V.85C7.18.59 7.15 0 6.35 0Zm-2.31 11.23c.29.99.72 1.47 2.31 1.47 1.59 0 2.02-.48 2.31-1.47H4.04Z" />
            </svg>`;

    const ICON_UNREAD = `
            <svg viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" fill="var(--fg)">
                <path
                    d="M6.35 0c-.8 0-.83.57-.83.84v.52c-1.19.23-1.99.96-2.63 1.97-.68 1.08-.11 3.03-.48 4.05-.37 1.01-1.38 2.19-1.52 2.33-.14.14.16.44.37.44l10.25-.02c.15 0 .43-.22.28-.42-.15-.19-1.06-1.05-1.45-2.03-.16-.4-.16-.99-.15-1.63-.2.07-.41.1-.63.1a3 3 0 0 1-2.99-2.99c0-.52.14-1 .39-1.41V.85C7.18.59 7.15 0 6.35 0Zm3.24 1a2.14 2.14 0 0 0-2.14 2.14 2.14 2.14 0 0 0 2.14 2.14 2.14 2.14 0 0 0 2.14-2.14A2.14 2.14 0 0 0 9.59 1Zm-5.55 10.23c.29.99.72 1.47 2.31 1.47 1.59 0 2.02-.48 2.31-1.47H4.04Z" />
            </svg>`;

    const ICON_SHAKE = `
            <svg class="swing" viewBox="0 0 13 13" fill="var(--fg)">
                <path
                    d="M6.35.04c-.8 0-.82.56-.82.84v.52c-1.18.23-1.97.95-2.61 1.96-.68 1.08-.11 3.01-.47 4.02-.37 1.01-1.37 2.18-1.51 2.32-.14.14.15.43.35.43l10.18-.02c.15 0 .43-.22.28-.41-.15-.19-1.05-1.04-1.44-2.01-.39-.97.18-3.07-.51-4.22C9.17 2.41 8.38 1.62 7.17 1.4V.89c0-.27-.02-.85-.82-.85ZM2.73.35c-.03 0-.05 0-.08.01-.21.04-1.65.69-2.37 2.72C0 4.17 0 5.99 0 5.99c0 .25.05.49.34.56h.01c.29.07.71-.06.71-.33 0 0-.22-1.74.29-3.04.51-1.3 1.71-2 1.85-2.22.11-.17-.03-.39-.1-.47C3.03.43 2.9.34 2.73.35Zm7.23 0c-.17-.01-.3.08-.36.15-.07.08-.21.3-.1.48.14.22 1.34.91 1.85 2.21.51 1.3.29 3.04.29 3.04 0 .25.41.39.7.32h.01c.29-.07.34-.31.34-.56 0 0 .06-1.82-.28-2.9-.74-2.03-2.18-2.67-2.38-2.72-.03 0-.05 0-.08-.01ZM4.05 11.19c.29.98.71 1.46 2.3 1.46 1.58 0 2-.48 2.3-1.46H4.05Z" />
            </svg>`;

    function setOpen(next) {
        open = !!next;
        btn.setAttribute('aria-expanded', String(open));
        if (open) {
            pop.dataset.open = 'true';
            pop.removeAttribute('hidden');

            // 🛠 cancel all scheduled shakes when inbox opens
            shakeTimeouts.forEach((t) => clearTimeout(t));
            shakeTimeouts.clear();

            const swingSvg = icon.querySelector('.swing');
            if (swingSvg) {
                swingSvg.classList.remove('swing');
                swingSvg.style.transform = "rotate(0deg)"; // reset neatly

                // revert back to unread icon (if unread toasts still exist)
                if (document.querySelector('.toast.unread')) {
                    icon.innerHTML = ICON_UNREAD;
                } else {
                    // otherwise show default icon
                    icon.innerHTML = ICON_DEFAULT;
                }
            }

            // 🛠 after cleaning, reset to proper icon
            icon.innerHTML = document.querySelector('.toast.unread') ? ICON_UNREAD : ICON_DEFAULT;
        } else {
            pop.dataset.open = 'false';
            pop.setAttribute('hidden', '');
        }
    }

    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open); });
    document.addEventListener('pointerdown', (e) => { if (!open) return; if (e.target === btn || btn.contains(e.target) || pop.contains(e.target)) return; setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) { setOpen(false); btn.focus(); } });

    function updateNotificationIcon() {
        if (unreadExists) {
            // Replace with unread-notification SVG
            icon.innerHTML = ICON_UNREAD;
        } else {
            // Replace with default notification SVG
            icon.innerHTML = ICON_DEFAULT;
        }
    }

    function addToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast unread';
        toast.innerHTML = `<div class="toast-header"><span>${msg}</span>
          <div class="toast-controls"><button class="close">✕</button></div></div>
          <div class="toast-content">This is more detail about: ${msg}</div>`;

        toast.querySelector('.close').onclick = () => { removeToast(toast, "fade-out"); checkUnread(); };
        toast.onclick = (e) => {
            if (e.target.closest('.close')) return; // skip close button
            toast.classList.remove('unread');
            toast.classList.add('read');
            checkUnread();
        };

        toastContainer.prepend(toast);
        checkUnread();


        const t = setTimeout(() => {
            // only swing if still unread AND inbox is closed
            if (toast.isConnected && toast.classList.contains('unread') && !open) {
                icon.innerHTML = ICON_SHAKE;
            }
            shakeTimeouts.delete(toast);
        }, 5000);
        shakeTimeouts.set(toast, t);
    }

    function checkUnread() {
        unreadExists = !!toastContainer.querySelector('.toast.unread');
        updateNotificationIcon();
        // if (!unreadExists) { btn.classList.remove('shake'); }
    }

    function removeToast(toast, effect = "fade-out") {
        toast.classList.add(effect);
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }

    clearAllBtn.onclick = () => {
        const toasts = toastContainer.querySelectorAll('.toast');
        toasts.forEach((t, i) => {
            // stagger effect a bit for nicer look
            setTimeout(() => removeToast(t, "fade-out"), i * 80);
        });
        // after last animation, checkUnread()
        if (toasts.length) {
            toasts[toasts.length - 1].addEventListener("animationend", checkUnread, { once: true });
        } else {
            checkUnread();
        }
    };

    document.getElementById('addToast1').onclick = () => addToast('Toast-Btn1 clicked');
    document.getElementById('addToast2').onclick = () => addToast('Toast-Btn2 clicked');
    document.getElementById('addToast3').onclick = () => addToast('Toast-Btn3 clicked');
})();