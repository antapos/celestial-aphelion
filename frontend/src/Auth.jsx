import { useRef } from 'react';
import { showToast } from './toast';

function Auth({ isLoggedIn, onLogin, onLogout, user }) {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    // Called from InventoryGrid when purchase is attempted without login
    // We expose the focus function on the username input via the global ref trick
    window.__focusUsername = () => {
        if (usernameRef.current) usernameRef.current.focus();
    };

    const handleLoginClick = () => {
        const user = usernameRef.current.value;
        const pass = passwordRef.current.value;

        if (!user || !pass) {
            showToast('Please enter both username and password', 'error');
            return;
        }

        onLogin(user, pass);
        showToast('Login successful! Welcome commander.', 'success');

        // Clear password field after login (keep username)
        passwordRef.current.value = '';
    };

    const handleLogoutClick = () => {
        // Clear the input fields
        if (usernameRef.current) usernameRef.current.value = '';
        if (passwordRef.current) passwordRef.current.value = '';
        onLogout();
        showToast('Logged out successfully.', 'info');
    };

    // Allow login via Enter key on password field
    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') handleLoginClick();
    };

    if (isLoggedIn && user) {
        return (
            <div className="logged-in-user">
                <div className="avatar">{user.username ? user.username.charAt(0).toUpperCase() : 'U'}</div>
                <div className="user-details">
                    <span className="welcome-text">Welcome back,</span>
                    <span className="username-display">{user.username}</span>
                </div>
                <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
            </div>
        );
    }

    return (
        <div className="login-form">
            <input
                ref={usernameRef}
                id="username"
                type="text"
                placeholder="Username"
                autoComplete="username"
            />
            <input
                ref={passwordRef}
                id="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                onKeyDown={handlePasswordKeyDown}
            />
            <button type="button" onClick={handleLoginClick}>Login</button>
        </div>
    );
}

export default Auth;
