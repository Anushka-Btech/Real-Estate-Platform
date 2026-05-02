/**
 * Redux Store Configuration
 * Central store setup combining all slices
 */
import { configureStore } from '@reduxjs/toolkit'
import propertyReducer from './propertySlice'
import userReducer from './userSlice'
import filterReducer from './filterSlice'

// Configure Redux store with all reducers
export const store = configureStore({
  reducer: {
    // Manages property data, saved properties, and CRUD operations
    property: propertyReducer,
    
    // Manages user authentication and preferences
    user: userReducer,
    
    // Manages search, filter, and sort states
    filter: filterReducer,
  },
  
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
})

// Export store types for use in components
export default store
