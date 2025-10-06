// js/script.js
"use strict";

// js/script.js
"use strict";

const actionCenterToggle = document.getElementById("actionCenterToggle");
const actionCenter = document.getElementById("actionCenter");
const clearAllBtn = document.querySelector(".clear-all");
const notificationsContainer = document.querySelector(".notifications");

// Badge simulation (for icon state)
let hasNotification = true;

function updateActionCenterIcon() {
    if (hasNotification) {
        actionCenterToggle.textContent = ""; // Filled icon (Segoe MDL2 Assets)
    } else {
        actionCenterToggle.textContent = ""; // Empty outline icon
    }
}

actionCenterToggle.addEventListener("click", () => {
    actionCenter.classList.toggle("open");
});

// Close panel when clicking outside
document.addEventListener("click", (e) => {
    if (
        !actionCenter.contains(e.target) &&
        !actionCenterToggle.contains(e.target)
    ) {
        actionCenter.classList.remove("open");
    }
});

// Clear all button
clearAllBtn.addEventListener("click", () => {
    notificationsContainer.innerHTML = ""; // Remove all notifications
    clearAllBtn.style.display = "none"; // Hide "Clear all"
    hasNotification = false;
    updateActionCenterIcon();
});

// On load, decide if "Clear all" should be visible
document.addEventListener("DOMContentLoaded", () => {
    if (notificationsContainer.children.length === 0) {
        clearAllBtn.style.display = "none";
        hasNotification = false;
    }
    updateActionCenterIcon();
});

// js/script.js (fix: only close panel if NO notifications remain)
notificationsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dismiss-btn")) {
        const note = e.target.closest(".notification");
        note.remove();

        if (notificationsContainer.children.length === 0) {
            clearAllBtn.style.display = "none";
            hasNotification = false;
            updateActionCenterIcon();
            actionCenter.classList.remove("open"); // close only when empty
        }
    }
});
