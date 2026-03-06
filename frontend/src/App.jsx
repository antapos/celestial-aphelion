import { createSignal } from 'solid-js';
import Auth from './components/Auth';
import InventoryGrid from './components/InventoryGrid';

function App() {
    const [isLoggedIn, setIsLoggedIn] = createSignal(false);
    const [user, setUser] = createSignal(null);
    const [credential, setCredential] = createSignal(null);
    const [refreshTrigger, setRefreshTrigger] = createSignal(0);
    const [totalItems, setTotalItems] = createSignal(0);
    const [totalValue, setTotalValue] = createSignal(0);

    const handleLogin = (username, password) => {
        const b64 = btoa(`${username}:${password}`);
        setCredential(b64);
        setUser({ username });
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setCredential(null);
        setUser(null);
        setIsLoggedIn(false);
    };

    const handleItemsLoaded = (items) => {
        let tItems = 0;
        let tValue = 0;
        items.forEach(item => {
            tItems += item.quantity;
            tValue += item.quantity * item.price;
        });
        setTotalItems(tItems);
        setTotalValue(tValue);
    };

    const doRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div class="app-root">
            <div id="toast-container"></div>

            <header class="hero">
                <div class="header-content">
                    <h1>Celestial Aphelion</h1>
                    <p class="subtitle">Next-Generation Inventory Management System</p>
                </div>
                <div class="auth-box">
                    <Auth
                        isLoggedIn={isLoggedIn()}
                        user={user()}
                        onLogin={handleLogin}
                        onLogout={handleLogout}
                    />
                </div>
            </header>

            <main class="container">
                <div class="dashboard-stats">
                    <div class="stat-card glass focus-purple">
                        <h3>{totalItems().toLocaleString()}</h3>
                        <p>Tracked Items</p>
                    </div>
                    <div class="stat-card glass focus-blue">
                        <h3>${totalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        <p>Total Value</p>
                    </div>
                </div>

                <section class="inventory-section">
                    <div class="section-header">
                        <h2>Live Inventory Database</h2>
                        <button class="add-item-btn" onClick={doRefresh}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.14-10.42M2.5 22v-6h6M21.87 8.43a9 9 0 1 0-3.14 10.42" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                    <InventoryGrid
                        credential={credential()}
                        refreshTrigger={refreshTrigger()}
                        onItemsLoaded={handleItemsLoaded}
                        onLogout={handleLogout}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
