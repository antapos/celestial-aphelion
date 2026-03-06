export const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    // Using vanilla CSS classes defined in index.css
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    // Remove after 3 seconds with a smooth fade
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};
