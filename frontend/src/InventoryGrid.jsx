import { useState, useEffect, useRef } from 'react';
import { showToast } from './toast';

function InventoryGrid({ credential, onRefresh, onItemsLoaded, onLogout }) {
    const [items, setItems] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true); // only true before first successful fetch
    const isFirstFetch = useRef(true);

    const fetchItems = async () => {
        // Only show the full loading placeholder on the very first fetch
        if (isFirstFetch.current) {
            setInitialLoad(true);
        }
        try {
            const response = await fetch('/api/inventory');
            if (!response.ok) throw new Error('Failed to fetch inventory');
            const data = await response.json();
            setItems(data);
            if (onItemsLoaded) onItemsLoaded(data);
        } catch (err) {
            showToast('Could not reach backend servers.', 'error');
            setItems(null);
        } finally {
            if (isFirstFetch.current) {
                setInitialLoad(false);
                isFirstFetch.current = false;
            }
        }
    };

    useEffect(() => {
        fetchItems();
    }, [onRefresh]);


    const handlePurchase = async (id) => {
        // Authentication check — mirrors vanilla exactly
        if (!credential) {
            showToast('Access Denied. Please login to purchase items.', 'error');
            // Focus the username field just like vanilla does
            if (window.__focusUsername) window.__focusUsername();
            return;
        }

        const qtyInput = document.getElementById(`qty-${id}`);
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

        // Quantity validation — mirrors vanilla exactly
        if (isNaN(quantity) || quantity < 1) {
            showToast('Invalid quantity amount.', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/inventory/${id}/purchase?quantity=${quantity}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credential}`
                }
            });

            if (response.ok) {
                showToast(`Successfully purchased ${quantity}x ${id}!`, 'success');
                await fetchItems();
                // Reset input
                if (qtyInput) qtyInput.value = 1;

            } else if (response.status === 401) {
                // Invalid credentials — call logout and show specific toast, like vanilla
                if (onLogout) onLogout();
                showToast('Authentication failed. Invalid username or password.', 'error');

            } else if (response.status === 400) {
                // Insufficient stock — vanilla shows this specific message
                showToast('Transaction Failed: Insufficient stock.', 'error');

            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }

        } catch (err) {
            showToast('Failed to process transaction over network.', 'error');
        }
    };

    if (initialLoad) {
        return <div className="loading-state">Connecting to secure database...</div>;
    }

    // null means a network error occurred (mirrors vanilla's offline message)
    if (items === null) {
        return (
            <div className="loading-state">
                Database offline. Did you start the Spring Boot server? <br /><br />
                <code>./mvnw spring-boot:run</code>
            </div>
        );
    }

    if (items.length === 0) {
        return <div className="loading-state">Database is empty.</div>;
    }

    return (
        <div className="inventory-grid">
            {items.map(item => {
                // Stock indicator logic — exact match to vanilla
                let stockClass = '';
                let stockText = `${item.quantity} in stock`;

                if (item.quantity === 0) {
                    stockClass = 'out';
                    stockText = 'Out of stock';
                } else if (item.quantity <= 10) {
                    stockClass = 'low';
                }

                return (
                    <div key={item.id} className="item-card glass">
                        <div className="item-header">
                            <span className="item-id">{item.id}</span>
                            <span className="item-price">${item.price.toFixed(2)}</span>
                        </div>
                        <h4 className="item-name">{item.name}</h4>
                        <div className="item-stock">
                            <div className={`stock-indicator ${stockClass}`}></div>
                            <span>{stockText}</span>
                        </div>
                        <div className="card-actions">
                            <input
                                type="number"
                                id={`qty-${item.id}`}
                                className="qty-input"
                                min="1"
                                max={item.quantity}
                                defaultValue="1"
                                disabled={item.quantity === 0}
                            />
                            <button
                                className="purchase-btn"
                                disabled={item.quantity === 0}
                                onClick={() => handlePurchase(item.id)}
                            >
                                Purchase
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default InventoryGrid;
