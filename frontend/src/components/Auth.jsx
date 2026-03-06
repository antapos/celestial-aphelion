import { createSignal, Show } from 'solid-js';
import { showToast } from '../toast';

function Auth(props) {
    let usernameRef;
    let passwordRef;

    window.__focusUsername = () => {
        if (usernameRef) usernameRef.focus();
    };

    const handleLoginClick = () => {
        const usr = usernameRef.value;
        const pass = passwordRef.value;

        if (!usr || !pass) {
            showToast('Please enter both username and password', 'error');
            return;
        }

        props.onLogin(usr, pass);
        showToast('Login successful! Welcome commander.', 'success');
        passwordRef.value = '';
    };

    const handleLogoutClick = () => {
        if (usernameRef) usernameRef.value = '';
        if (passwordRef) passwordRef.value = '';
        props.onLogout();
        showToast('Logged out successfully.', 'info');
    };

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') handleLoginClick();
    };

    return (
        <>
            <Show
                when={props.isLoggedIn && props.user}
                fallback={
                    <div class="login-form">
                        <input
                            ref={usernameRef}
                            id="username"
                            type="text"
                            placeholder="Username"
                            autocomplete="username"
                        />
                        <input
                            ref={passwordRef}
                            id="password"
                            type="password"
                            placeholder="Password"
                            autocomplete="current-password"
                            onKeyDown={handlePasswordKeyDown}
                        />
                        <button type="button" onClick={handleLoginClick}>Login</button>
                    </div>
                }
            >
                <div class="logged-in-user">
                    <div class="avatar">{props.user.username ? props.user.username.charAt(0).toUpperCase() : 'U'}</div>
                    <div class="user-details">
                        <span class="welcome-text">Welcome back,</span>
                        <span class="username-display">{props.user.username}</span>
                    </div>
                    <button class="logout-btn" onClick={handleLogoutClick}>Logout</button>
                </div>
            </Show>
        </>
    );
}

export default Auth;
