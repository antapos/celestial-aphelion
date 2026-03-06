import './index.css';
import { useState } from 'react';
import Auth from './Auth';
import InventoryGrid from './InventoryGrid';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [credential, setCredential] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const handleLogin = (username, password) => {
    // In a real app we'd validate, but for this demo standardizing the base64 basic auth:
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
      tValue += (item.quantity * item.price);
    });
    setTotalItems(tItems);
    setTotalValue(tValue);
  };

  return (
    <div className="app-root">
      <div id="toast-container"></div>

      <header className="hero">
        <div className="header-content">
          <h1>Celestial Aphelion</h1>
          <p className="subtitle">Next-Generation Inventory Management System</p>
        </div>
        <div className="auth-box">
          <Auth
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
            user={user}
          />
        </div>
      </header>

      <main className="container">
        <div className="dashboard-stats">
          <div className="stat-card glass focus-purple">
            <h3>{totalItems.toLocaleString()}</h3>
            <p>Tracked Items</p>
          </div>
          <div className="stat-card glass focus-blue">
            <h3>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p>Total Value Value</p>
          </div>
        </div>

        <section className="inventory-section">
          <div className="section-header">
            <h2>Live Inventory Database</h2>
            <button className="add-item-btn" onClick={() => setRefreshTrigger(prev => prev + 1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.14-10.42M2.5 22v-6h6M21.87 8.43a9 9 0 1 0-3.14 10.42" /></svg>
              Refresh
            </button>
          </div>
          <InventoryGrid
            credential={credential}
            onRefresh={refreshTrigger}
            onItemsLoaded={handleItemsLoaded}
            onLogout={handleLogout}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
