document.addEventListener('DOMContentLoaded', () => {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const form = document.getElementById('changePasswordForm');
    const modal = document.getElementById('changePasswordModal');

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            openModal('changePasswordModal');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authManager.logout();
        });
    }

    if (modal) {
        modal.querySelectorAll('[data-close-modal]').forEach((button) => {
            button.addEventListener('click', () => closeModal('changePasswordModal'));
        });
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('dashboardNewPassword').value;
            const confirmPassword = document.getElementById('confirmDashboardPassword').value;

            if (newPassword.length < 6) {
                notificationManager.error('New password kam se kam 6 characters ka hona chahiye');
                return;
            }

            if (newPassword !== confirmPassword) {
                notificationManager.error('New password aur confirm password match nahi kar rahe');
                return;
            }

            const result = authManager.changePassword(currentPassword, newPassword);

            if (!result.ok) {
                notificationManager.error(result.message);
                return;
            }

            notificationManager.success('Password update ho gaya. Ab login again karein.');
            closeModal('changePasswordModal');
            setTimeout(() => {
                authManager.logout();
            }, 900);
        });
    }
});