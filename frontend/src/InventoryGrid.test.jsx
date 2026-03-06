import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import InventoryGrid from './InventoryGrid';

// Mock data
const mockItems = [
    { id: 1, name: 'High-End Laptop', price: 1500.00, stock: 10 },
    { id: 2, name: 'Wireless Mouse', price: 25.50, stock: 50 }
];

describe('InventoryGrid Component', () => {
    let originalFetch;

    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = vi.fn();
    });

    afterEach(() => {
        global.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    it('displays loading state initially', () => {
        // Return unresolved promise to freeze it
        global.fetch.mockImplementation(() => new Promise(() => { }));

        render(<InventoryGrid credential={null} onRefresh={() => { }} />);
        expect(screen.getByText(/Connecting to secure database.../i)).toBeInTheDocument();
    });

    it('renders items fetched from API', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockItems
        });

        render(<InventoryGrid credential={null} onRefresh={() => { }} />);

        // Wait for items to appear
        await waitFor(() => {
            expect(screen.getByText('High-End Laptop')).toBeInTheDocument();
        });
        expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
        expect(screen.getByText('$1500.00')).toBeInTheDocument();
        expect(screen.getByText('$25.50')).toBeInTheDocument();

        const purchaseBtns = screen.getAllByRole('button', { name: /Purchase/i });
        expect(purchaseBtns).toHaveLength(2);
    });

    it('calls POST purchase endpoint when clicking purchase', async () => {
        const user = userEvent.setup();

        // Initial GET fetch
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockItems
        });

        // POST purchase fetch
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 1, name: 'High-End Laptop', price: 1500.00, stock: 9
            })
        });

        // 3rd GET fetch
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, name: 'High-End Laptop', price: 1500.00, stock: 9 },
                { id: 2, name: 'Wireless Mouse', price: 25.50, stock: 50 }
            ]
        });

        // Submits with credentials
        const b64Creds = btoa('admin:password');

        render(<InventoryGrid credential={b64Creds} onRefresh={() => { }} />);

        // Wait for render
        await waitFor(() => {
            expect(screen.getByText('High-End Laptop')).toBeInTheDocument();
        });

        // Click first purchase button (Laptop)
        const purchaseBtns = screen.getAllByRole('button', { name: /Purchase/i });
        await user.click(purchaseBtns[0]);

        // Expect the 2nd fetch to be the POST call
        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/inventory/1/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${b64Creds}`
            }
        });
    });
});
