// Core Application Logic for Celestial Aphelion Frontend

const app = {
    state: {
        items: [],
        credentials: null // Used to store Base64 encoded 'username:password'
    },

    // Initialization
    init() {
        console.log("Celestial Aphelion Frontend Initialized.");
        this.checkAuth();
        this.refreshInventory();
    },

    // ----------------------------------------------------
    // Authentication Flow
    // ----------------------------------------------------

    login() {
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (!user || !pass) {
            this.showToast('Please enter both username and password', 'error');
            return;
        }

        // Store credentials in basic auth format
        this.state.credentials = btoa(`${user}:${pass}`);
        this.showToast('Login successful! Welcome commander.', 'success');

        // Update UI
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('loggedInUser').classList.remove('hidden');

        // Clear in-memory inputs
        document.getElementById('password').value = '';
    },

    logout() {
        this.state.credentials = null;
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('loggedInUser').classList.add('hidden');
        document.getElementById('username').value = '';
        this.showToast('Logged out successfully.', 'info');
    },

    checkAuth() {
        // Just a simple UI toggle check based on memory
        if (this.state.credentials) {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('loggedInUser').classList.remove('hidden');
        } else {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('loggedInUser').classList.add('hidden');
        }
    },

    // ----------------------------------------------------
    // API Interactions
    // ----------------------------------------------------

    async refreshInventory() {
        try {
            // GET /api/inventory is public according to our SecurityConfig
            const response = await fetch('/api/inventory');
            if (!response.ok) throw new Error('Failed to fetch inventory');

            this.state.items = await response.json();
            this.renderInventory();
            this.updateStats();
        } catch (err) {
            console.error(err);
            this.showToast('Could not reach backend servers.', 'error');
            document.getElementById('inventoryGrid').innerHTML = `
                <div class="loading-state">
                    Database offline. Did you start the Spring Boot server? <br><br>
                    <code>./mvnw spring-boot:run</code>
                </div>
            `;
        }
    },

    async purchaseItem(id) {
        // Authentication check!
        if (!this.state.credentials) {
            this.showToast('Access Denied. Please login to purchase items.', 'error');
            document.getElementById('username').focus();
            return;
        }

        const qtyInput = document.getElementById(`qty-${id}`);
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

        if (isNaN(quantity) || quantity < 1) {
            this.showToast('Invalid quantity amount.', 'error');
            return;
        }

        try {
            // Construct the headers to include our Basic Auth token
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${this.state.credentials}`
            };

            // Send POST request, this endpoint is secured
            const response = await fetch(`/api/inventory/${id}/purchase`, {
                method: 'POST',
                headers: headers,
                body: `quantity=${quantity}` // we used @RequestParam so urlencoded body works best
            });

            if (response.ok) {
                this.showToast(`Successfully purchased ${quantity}x ${id}!`, 'success');
                // Refresh data to show new stock level
                await this.refreshInventory();

                // Reset input
                if (qtyInput) qtyInput.value = 1;

            } else if (response.status === 401) {
                // Invalid credentials! Let's wipe them
                this.logout();
                this.showToast('Authentication failed. Invalid username or password.', 'error');
            } else if (response.status === 400) {
                // Likely Insufficient Stock Based on our API design
                this.showToast('Transaction Failed: Insufficient stock.', 'error');
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }

        } catch (err) {
            console.error(err);
            this.showToast('Failed to process transaction over network.', 'error');
        }
    },

    // ----------------------------------------------------
    // UI Rendering
    // ----------------------------------------------------

    updateStats() {
        let totalItems = 0;
        let totalValue = 0;

        this.state.items.forEach(item => {
            totalItems += item.quantity;
            totalValue += (item.quantity * item.price);
        });

        // Format neatly
        document.getElementById('statTotalItems').textContent = totalItems.toLocaleString();
        document.getElementById('statTotalValue').textContent = `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    renderInventory() {
        const grid = document.getElementById('inventoryGrid');

        if (this.state.items.length === 0) {
            grid.innerHTML = '<div class="loading-state">Database is empty.</div>';
            return;
        }

        grid.innerHTML = ''; // Clear current

        this.state.items.forEach(item => {
            // Logic for stock indicator dot
            let stockClass = '';
            let stockText = `${item.quantity} in stock`;

            if (item.quantity === 0) {
                stockClass = 'out';
                stockText = 'Out of stock';
            } else if (item.quantity <= 10) {
                stockClass = 'low';
            }

            const card = document.createElement('div');
            card.className = 'item-card glass';

            card.innerHTML = `
                <div class="item-header">
                    <span class="item-id">${item.id}</span>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                </div>
                <h4 class="item-name">${item.name}</h4>
                <div class="item-stock">
                    <div class="stock-indicator ${stockClass}"></div>
                    <span>${stockText}</span>
                </div>
                
                <div class="card-actions">
                    <input type="number" id="qty-${item.id}" class="qty-input" min="1" max="${item.quantity}" value="1" ${item.quantity === 0 ? 'disabled' : ''}>
                    <button class="purchase-btn" onclick="app.purchaseItem('${item.id}')" ${item.quantity === 0 ? 'disabled' : ''}>
                        Purchase
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });
    },

    // ----------------------------------------------------
    // Utilities (Toasts)
    // ----------------------------------------------------

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
