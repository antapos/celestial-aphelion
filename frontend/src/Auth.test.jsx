import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Auth from './Auth';

describe('Auth Component', () => {
    it('renders login form when not logged in', () => {
        render(<Auth isLoggedIn={false} onLogin={() => { }} onLogout={() => { }} user={null} />);
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('handles typing and calls onLogin with credentials', async () => {
        const handleLogin = vi.fn();
        const user = userEvent.setup();

        render(<Auth isLoggedIn={false} onLogin={handleLogin} onLogout={() => { }} user={null} />);

        const usernameInput = screen.getByPlaceholderText(/Username/i);
        const passwordInput = screen.getByPlaceholderText(/Password/i);
        const loginBtn = screen.getByRole('button', { name: /Login/i });

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'password');
        await user.click(loginBtn);

        expect(handleLogin).toHaveBeenCalledWith('admin', 'password');
    });

    it('renders user details when logged in', () => {
        render(<Auth isLoggedIn={true} onLogin={() => { }} onLogout={() => { }} user={{ username: 'testuser' }} />);
        expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    it('calls onLogout when clicking logout', async () => {
        const handleLogout = vi.fn();
        const user = userEvent.setup();

        render(<Auth isLoggedIn={true} onLogin={() => { }} onLogout={handleLogout} user={{ username: 'testuser' }} />);

        const logoutBtn = screen.getByRole('button', { name: /Logout/i });
        await user.click(logoutBtn);

        expect(handleLogout).toHaveBeenCalledTimes(1);
    });
});
