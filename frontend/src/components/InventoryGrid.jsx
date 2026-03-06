import { createSignal, createEffect, onMount, For, Show } from 'solid-js';
import { showToast } from '../toast';

function InventoryGrid(props) {
    const [items, setItems] = createSignal([]);
    const [initialLoad, setInitialLoad] = createSignal(true);
    let isFirstFetch = true;

    const fetchItems = async () => {
        if (isFirstFetch) {
            setInitialLoad(true);
        }
        try {
            const response = await fetch('/api/inventory');
            if (!response.ok) throw new Error('Failed to fetch inventory');
            const data = await response.json();
            setItems(data);
            if (props.onItemsLoaded) props.onItemsLoaded(data);
        } catch (err) {
            showToast('Could not reach backend servers.', 'error');
            setItems(null);
        } finally {
            if (isFirstFetch) {
                setInitialLoad(false);
                isFirstFetch = false;
            }
        }
    };

    const handlePurchase = async (id) => {
        if (!props.credential) {
            showToast('Access Denied. Please login to purchase items.', 'error');
            if (window.__focusUsername) window.__focusUsername();
            return;
        }

        const qtyInput = document.getElementById(`qty-${id}`);
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

        if (isNaN(quantity) || quantity < 1) {
            showToast('Invalid quantity amount.', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/inventory/${id}/purchase?quantity=${quantity}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${props.credential}`
                }
            });

            if (response.ok) {
                showToast(`Successfully purchased ${quantity}x ${id}!`, 'success');
                await fetchItems();
                if (qtyInput) qtyInput.value = 1;
            } else if (response.status === 401) {
                props.onLogout();
                showToast('Authentication failed. Invalid username or password.', 'error');
            } else if (response.status === 400) {
                showToast('Transaction Failed: Insufficient stock.', 'error');
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }
        } catch (err) {
            showToast('Failed to process transaction over network.', 'error');
        }
    };

    createEffect(() => {
        // Trigger on refreshTrigger change
        props.refreshTrigger;
        fetchItems();
    });

    onMount(() => {
        fetchItems();
    });

    return (
        <>
            <Show when={initialLoad()}>
                <div class="loading-state">Connecting to secure database...</div>
            </Show>

            <Show when={!initialLoad() && items() === null}>
                <div class="loading-state">
                    Database offline. Did you start the Spring Boot server? <br /><br />
                    <code>./mvnw spring-boot:run</code>
                </div>
            </Show>

            <Show when={!initialLoad() && items() && items().length === 0}>
                <div class="loading-state">Database is empty.</div>
            </Show>

            <Show when={!initialLoad() && items() && items().length > 0}>
                <div class="inventory-grid">
                    <For each={items()}>
                        {(item) => {
                            const stockClass = () => item.quantity === 0 ? 'out' : (item.quantity <= 10 ? 'low' : '');
                            const stockText = () => item.quantity === 0 ? 'Out of stock' : `${item.quantity} in stock`;

                            return (
                                <div class="item-card glass">
                                    <div class="item-header">
                                        <span class="item-id">{item.id}</span>
                                        <span class="item-price">${item.price.toFixed(2)}</span>
                                    </div>
                                    <h4 class="item-name">{item.name}</h4>
                                    <div class="item-stock">
                                        <div class={`stock-indicator ${stockClass()}`}></div>
                                        <span>{stockText()}</span>
                                    </div>
                                    <div class="card-actions">
                                        <input
                                            type="number"
                                            id={`qty-${item.id}`}
                                            class="qty-input"
                                            min="1"
                                            max={item.quantity}
                                            value="1"
                                            disabled={item.quantity === 0}
                                        />
                                        <button
                                            class="purchase-btn"
                                            disabled={item.quantity === 0}
                                            onClick={() => handlePurchase(item.id)}
                                        >
                                            Purchase
                                        </button>
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Show>
        </>
    );
}

export default InventoryGrid;
