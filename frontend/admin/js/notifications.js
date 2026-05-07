/* ===== TOAST NOTIFICATIONS SYSTEM ===== */

class NotificationManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.notifications = [];
    }

    show(message, type = 'info', duration = 3000) {
        const id = Date.now();
        const toast = this.createToastElement(message, type, id);
        
        this.container.appendChild(toast);
        this.notifications.push({ id, element: toast, timeout: null });

        // Auto remove
        if (duration > 0) {
            const timeout = setTimeout(() => this.close(id), duration);
            const notif = this.notifications.find(n => n.id === id);
            if (notif) notif.timeout = timeout;
        }

        return id;
    }

    createToastElement(message, type, id) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = `toast-${id}`;

        let icon = '✓';
        let title = 'Success';

        switch (type) {
            case 'success':
                icon = '✓';
                title = 'Success';
                break;
            case 'error':
                icon = '✕';
                title = 'Error';
                break;
            case 'warning':
                icon = '!';
                title = 'Warning';
                break;
            case 'info':
                icon = 'ℹ';
                title = 'Info';
                break;
        }

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <p class="toast-title">${title}</p>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close" onclick="notificationManager.close(${id})">✕</button>
        `;

        return toast;
    }

    close(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
            if (notif.timeout) clearTimeout(notif.timeout);
            notif.element.style.animation = 'slideInRight 0.3s reverse';
            setTimeout(() => {
                notif.element.remove();
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 300);
        }
    }

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 3000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 3000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// Initialize global notification manager
const notificationManager = new NotificationManager();
