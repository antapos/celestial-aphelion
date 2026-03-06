import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
    it('renders the header with Celestial Aphelion', () => {
        render(<App />);
        const heading = screen.getByText(/Celestial Aphelion/i);
        expect(heading).toBeInTheDocument();
    });

    it('renders the login button when not logged in', () => {
        render(<App />);
        const loginBtn = screen.getByRole('button', { name: /Login/i });
        expect(loginBtn).toBeInTheDocument();
    });

    it('renders the Live Inventory Database section', () => {
        render(<App />);
        expect(screen.getByText(/Live Inventory Database/i)).toBeInTheDocument();
    });
});
