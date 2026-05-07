document.addEventListener('DOMContentLoaded', () => {
    if (window.authManager && authManager.redirectIfAuthenticated()) {
        return;
    }

    const form = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const identifier = document.getElementById('identifier').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        loginButton.disabled = true;
        const result = authManager.login(identifier, password, rememberMe);

        if (!result.ok) {
            notificationManager.error(result.message);
            loginButton.disabled = false;
            return;
        }

        notificationManager.success(result.message);
        window.location.href = 'dashboard.html';
    });
});