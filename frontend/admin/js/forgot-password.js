document.addEventListener('DOMContentLoaded', () => {
    if (window.authManager && authManager.redirectIfAuthenticated()) {
        return;
    }

    const form = document.getElementById('forgotPasswordForm');
    const submitButton = document.getElementById('resetButton');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const identifier = document.getElementById('resetIdentifier').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword.length < 6) {
            notificationManager.error('Password kam se kam 6 characters ka hona chahiye');
            return;
        }

        if (newPassword !== confirmPassword) {
            notificationManager.error('New password aur confirm password match nahi kar rahe');
            return;
        }

        submitButton.disabled = true;
        const result = authManager.resetPassword(identifier, newPassword);

        if (!result.ok) {
            notificationManager.error(result.message);
            submitButton.disabled = false;
            return;
        }

        notificationManager.success(result.message);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 900);
    });
});