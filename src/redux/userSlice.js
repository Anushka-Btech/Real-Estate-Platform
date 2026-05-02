/**
 * User Slice
 * Manages user authentication and preferences:
 * - Mock authentication (localStorage-based)
 * - User session management
 * - Dark mode toggle
 * - User preferences
 */
import { createSlice } from '@reduxjs/toolkit'

// Storage keys for localStorage persistence
const AUTH_KEY = 'authUser'
const USERS_KEY = 'registeredUsers'
const DARK_MODE_KEY = 'darkMode'

/**
 * Helper function to get stored dark mode preference
 */
const getStoredDarkMode = () => {
  const stored = localStorage.getItem(DARK_MODE_KEY)
  if (stored !== null) {
    return JSON.parse(stored)
  }
  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Initial state for user slice
const initialState = {
  // Current logged-in user
  currentUser: null,
  
  // Authentication status
  isAuthenticated: false,
  
  // Loading state for auth operations
  isLoading: false,
  
  // Error handling
  error: null,
  
  // Theme preference
  darkMode: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Initialize authentication from localStorage
     * Called on app mount to restore session
     */
    initializeAuth: (state) => {
      const storedUser = localStorage.getItem(AUTH_KEY)
      const storedDarkMode = getStoredDarkMode()
      
      if (storedUser) {
        state.currentUser = JSON.parse(storedUser)
        state.isAuthenticated = true
      }
      
      state.darkMode = storedDarkMode
    },
    
    /**
     * Register a new user
     * Stores user data in localStorage
     */
    register: (state, action) => {
      const { email, password, name } = action.payload
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      
      // Check if email already exists
      if (users.find(u => u.email === email)) {
        state.error = 'Email already registered'
        return
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password, // In production, this should be hashed
        name,
        createdAt: new Date().toISOString(),
      }
      
      // Store user
      users.push(newUser)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
      
      // Auto-login after registration
      const userWithoutPassword = { ...newUser }
      delete userWithoutPassword.password
      
      state.currentUser = userWithoutPassword
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))
    },
    
    /**
     * Login user with email and password
     */
    login: (state, action) => {
      const { email, password } = action.payload
      
      // Get registered users
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      
      // Find user with matching credentials
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        const userWithoutPassword = { ...user }
        delete userWithoutPassword.password
        
        state.currentUser = userWithoutPassword
        state.isAuthenticated = true
        state.error = null
        localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))
      } else {
        state.error = 'Invalid email or password'
      }
    },
    
    /**
     * Logout current user
     */
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem(AUTH_KEY)
    },
    
    /**
     * Toggle dark mode
     */
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(state.darkMode))
    },
    
    /**
     * Set dark mode explicitly
     */
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(state.darkMode))
    },
    
    /**
     * Update user profile
     */
    updateProfile: (state, action) => {
      const updates = action.payload
      
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...updates }
        localStorage.setItem(AUTH_KEY, JSON.stringify(state.currentUser))
        
        // Also update in users list
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
        const userIndex = users.findIndex(u => u.id === state.currentUser.id)
        if (userIndex >= 0) {
          users[userIndex] = { ...users[userIndex], ...updates }
          localStorage.setItem(USERS_KEY, JSON.stringify(users))
        }
      }
    },
    
    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null
    },
    
    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

// Export actions
export const {
  initializeAuth,
  register,
  login,
  logout,
  toggleDarkMode,
  setDarkMode,
  updateProfile,
  clearError,
  setLoading,
} = userSlice.actions

// Export selectors
export const selectCurrentUser = (state) => state.user.currentUser
export const selectIsAuthenticated = (state) => state.user.isAuthenticated
export const selectDarkMode = (state) => state.user.darkMode
export const selectUserError = (state) => state.user.error

export default userSlice.reducer
