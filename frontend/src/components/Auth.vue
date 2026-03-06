<script setup>
import { ref } from 'vue'
import { showToast } from '../toast'

// Props mirror the React version: isLoggedIn, user, onLogin, onLogout
const props = defineProps({
  isLoggedIn: Boolean,
  user: Object
})
const emit = defineEmits(['login', 'logout'])

const usernameRef = ref(null)
const passwordRef = ref(null)

window.__focusUsername = () => {
  if (usernameRef.value) usernameRef.value.focus()
}

const handleLoginClick = () => {
  const usr = usernameRef.value.value
  const pass = passwordRef.value.value

  if (!usr || !pass) {
    showToast('Please enter both username and password', 'error')
    return
  }

  emit('login', usr, pass)
  showToast('Login successful! Welcome commander.', 'success')
  passwordRef.value.value = ''
}

const handleLogoutClick = () => {
  if (usernameRef.value) usernameRef.value.value = ''
  if (passwordRef.value) passwordRef.value.value = ''
  emit('logout')
  showToast('Logged out successfully.', 'info')
}

const handlePasswordKeyDown = (e) => {
  if (e.key === 'Enter') handleLoginClick()
}
</script>

<template>
  <!-- Logged-in state -->
  <div v-if="isLoggedIn && user" class="logged-in-user">
    <div class="avatar">{{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}</div>
    <div class="user-details">
      <span class="welcome-text">Welcome back,</span>
      <span class="username-display">{{ user.username }}</span>
    </div>
    <button class="logout-btn" @click="handleLogoutClick">Logout</button>
  </div>

  <!-- Logged-out / login form state -->
  <div v-else class="login-form">
    <input
      ref="usernameRef"
      id="username"
      type="text"
      placeholder="Username"
      autocomplete="username"
    />
    <input
      ref="passwordRef"
      id="password"
      type="password"
      placeholder="Password"
      autocomplete="current-password"
      @keydown="handlePasswordKeyDown"
    />
    <button type="button" @click="handleLoginClick">Login</button>
  </div>
</template>
