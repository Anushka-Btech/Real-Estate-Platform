/**
 * Property Slice
 * Manages all property-related state including:
 * - Property listings
 * - Saved/favorite properties
 * - CRUD operations (localStorage-based)
 * - Loading and error states
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { propertyService } from '../services/propertyService'

// Storage keys for localStorage persistence
const SAVED_PROPERTIES_KEY = 'savedProperties'
const USER_PROPERTIES_KEY = 'userProperties'

/**
 * Async thunk to fetch all properties
 * Combines mock data with user-added properties from localStorage
 */
export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      // Get properties from mock data/API
      const apiProperties = await propertyService.getAllProperties()
      
      // Get user-added properties from localStorage
      const userProperties = JSON.parse(localStorage.getItem(USER_PROPERTIES_KEY) || '[]')
      
      // Combine both sources
      return [...apiProperties, ...userProperties]
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch properties')
    }
  }
)

/**
 * Async thunk to fetch a single property by ID
 */
export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      return await propertyService.getPropertyById(id)
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch property details')
    }
  }
)

// Initial state for property slice
const initialState = {
  // All properties list
  properties: [],
  
  // Currently selected property for detail view
  selectedProperty: null,
  
  // User's saved/favorite properties
  savedProperties: [],
  
  // Loading states
  isLoading: false,
  isLoadingDetails: false,
  
  // Error handling
  error: null,
  
  // Pagination
  currentPage: 1,
  propertiesPerPage: 9,
  totalProperties: 0,
}

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    /**
     * Load saved properties from localStorage
     */
    loadSavedProperties: (state) => {
      const saved = localStorage.getItem(SAVED_PROPERTIES_KEY)
      if (saved) {
        state.savedProperties = JSON.parse(saved)
      }
    },
    
    /**
     * Toggle save/unsave a property
     */
    toggleSaveProperty: (state, action) => {
      const property = action.payload
      const existingIndex = state.savedProperties.findIndex(p => p.id === property.id)
      
      if (existingIndex >= 0) {
        // Remove from saved
        state.savedProperties.splice(existingIndex, 1)
      } else {
        // Add to saved
        state.savedProperties.push(property)
      }
      
      // Persist to localStorage
      localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(state.savedProperties))
    },
    
    /**
     * Add a new property (user-created)
     */
    addProperty: (state, action) => {
      const newProperty = {
        ...action.payload,
        id: `user-${Date.now()}`, // Generate unique ID
        createdAt: new Date().toISOString(),
        isUserCreated: true,
      }
      
      state.properties.unshift(newProperty)
      state.totalProperties = state.properties.length
      
      // Persist user properties to localStorage
      const userProperties = JSON.parse(localStorage.getItem(USER_PROPERTIES_KEY) || '[]')
      userProperties.unshift(newProperty)
      localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(userProperties))
    },
    
    /**
     * Update an existing property
     */
    updateProperty: (state, action) => {
      const { id, updates } = action.payload
      
      // Update in properties array
      const propertyIndex = state.properties.findIndex(p => p.id === id)
      if (propertyIndex >= 0) {
        state.properties[propertyIndex] = { ...state.properties[propertyIndex], ...updates }
      }
      
      // Update in saved properties if exists
      const savedIndex = state.savedProperties.findIndex(p => p.id === id)
      if (savedIndex >= 0) {
        state.savedProperties[savedIndex] = { ...state.savedProperties[savedIndex], ...updates }
        localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(state.savedProperties))
      }
      
      // Update in localStorage if user-created
      if (id.startsWith('user-')) {
        const userProperties = JSON.parse(localStorage.getItem(USER_PROPERTIES_KEY) || '[]')
        const userIndex = userProperties.findIndex(p => p.id === id)
        if (userIndex >= 0) {
          userProperties[userIndex] = { ...userProperties[userIndex], ...updates }
          localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(userProperties))
        }
      }
    },
    
    /**
     * Delete a property
     */
    deleteProperty: (state, action) => {
      const id = action.payload
      
      // Remove from properties array
      state.properties = state.properties.filter(p => p.id !== id)
      state.totalProperties = state.properties.length
      
      // Remove from saved properties if exists
      state.savedProperties = state.savedProperties.filter(p => p.id !== id)
      localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(state.savedProperties))
      
      // Remove from localStorage if user-created
      if (id.startsWith('user-')) {
        const userProperties = JSON.parse(localStorage.getItem(USER_PROPERTIES_KEY) || '[]')
        const filtered = userProperties.filter(p => p.id !== id)
        localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(filtered))
      }
    },
    
    /**
     * Set current page for pagination
     */
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    
    /**
     * Clear selected property
     */
    clearSelectedProperty: (state) => {
      state.selectedProperty = null
    },
    
    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch all properties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false
        state.properties = action.payload
        state.totalProperties = action.payload.length
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch single property
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoadingDetails = true
        state.error = null
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.isLoadingDetails = false
        state.selectedProperty = action.payload
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoadingDetails = false
        state.error = action.payload
      })
  },
})

// Export actions
export const {
  loadSavedProperties,
  toggleSaveProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  setCurrentPage,
  clearSelectedProperty,
  clearError,
} = propertySlice.actions

// Export selectors
export const selectAllProperties = (state) => state.property.properties
export const selectSavedProperties = (state) => state.property.savedProperties
export const selectSelectedProperty = (state) => state.property.selectedProperty
export const selectIsLoading = (state) => state.property.isLoading
export const selectError = (state) => state.property.error

export default propertySlice.reducer
