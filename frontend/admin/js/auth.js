/* ===== SIMPLE ADMIN AUTH MANAGER ===== */

(function () {
    const CREDENTIALS_KEY = 'admin_credentials';
    const SESSION_KEY = 'admin_session';

    class AuthManager {
        constructor() {
            this.bootstrapDefaultCredentials();
        }

        bootstrapDefaultCredentials() {
            const existing = this.getCredentials();
            if (existing) {
                return;
            }

            const defaultCredentials = {
                username: 'admin',
                email: 'admin@gencyo.com',
                password: 'admin123'
            };
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
        }

        getCredentials() {
            const raw = localStorage.getItem(CREDENTIALS_KEY);
            return raw ? JSON.parse(raw) : null;
        }

        saveCredentials(credentials) {
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
        }

        getActiveSession() {
            const rawSession = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
            return rawSession ? JSON.parse(rawSession) : null;
        }

        isAuthenticated() {
            return !!this.getActiveSession();
        }

        login(identifier, password, rememberMe) {
            const creds = this.getCredentials();
            if (!creds) {
                return { ok: false, message: 'Credentials not initialized' };
            }

            const normalized = (identifier || '').trim().toLowerCase();
            const canLogin =
                (normalized === creds.username.toLowerCase() || normalized === creds.email.toLowerCase()) &&
                password === creds.password;

            if (!canLogin) {
                return { ok: false, message: 'Invalid username/email or password' };
            }

            const sessionData = {
                username: creds.username,
                loginAt: new Date().toISOString()
            };

            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_KEY);

            if (rememberMe) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            }

            return { ok: true, message: 'Login successful' };
        }

        logout() {
            sessionStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_KEY);
            window.location.href = 'login.html';
        }

        requireAuth() {
            const current = (window.location.pathname.split('/').pop() || '').toLowerCase();
            if (current === 'login.html' || current === 'forgot-password.html') {
                return true;
            }

            if (!this.isAuthenticated()) {
                window.location.href = 'login.html';
                return false;
            }

            return true;
        }

        redirectIfAuthenticated() {
            if (this.isAuthenticated()) {
                window.location.href = 'dashboard.html';
                return true;
            }
            return false;
        }

        changePassword(currentPassword, newPassword) {
            const creds = this.getCredentials();
            if (!creds) {
                return { ok: false, message: 'Credentials not found' };
            }

            if (creds.password !== currentPassword) {
                return { ok: false, message: 'Current password is incorrect' };
            }

            creds.password = newPassword;
            this.saveCredentials(creds);
            return { ok: true, message: 'Password updated successfully' };
        }

        resetPassword(identifier, newPassword) {
            const creds = this.getCredentials();
            if (!creds) {
                return { ok: false, message: 'Credentials not found' };
            }

            const normalized = (identifier || '').trim().toLowerCase();
            const userMatches = normalized === creds.username.toLowerCase() || normalized === creds.email.toLowerCase();

            if (!userMatches) {
                return { ok: false, message: 'Username/email does not match account' };
            }

            creds.password = newPassword;
            this.saveCredentials(creds);
            return { ok: true, message: 'Password reset successful' };
        }
    }

    window.authManager = new AuthManager();
    window.authManager.requireAuth();
})();
