/**
 * Filter Slice
 * Manages search, filter, and sort states:
 * - Search query (with debounce support)
 * - Property type filters
 * - Price range filters
 * - Location filters
 * - Sorting options
 */
import { createSlice } from '@reduxjs/toolkit'

// Initial state for filter slice
const initialState = {
  // Search query
  searchQuery: '',
  
  // Debounced search query (for API calls)
  debouncedSearchQuery: '',
  
  // Property type filter (house, apartment, villa, etc.)
  propertyType: 'all',
  
  // Price range filter
  priceRange: {
    min: 0,
    max: 10000000,
  },
  
  // Bedrooms filter
  bedrooms: 'any',
  
  // Bathrooms filter
  bathrooms: 'any',
  
  // Location/city filter
  location: 'all',
  
  // Property status (for sale, for rent)
  status: 'all',
  
  // Sort option
  sortBy: 'newest',
  
  // Available sort options
  sortOptions: [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'beds-high', label: 'Most Bedrooms' },
    { value: 'sqft-high', label: 'Largest Size' },
  ],
  
  // Available property types
  propertyTypes: [
    { value: 'all', label: 'All Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
  ],
  
  // Available bedroom options
  bedroomOptions: [
    { value: 'any', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
  ],
  
  // Available bathroom options
  bathroomOptions: [
    { value: 'any', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
  ],
  
  // Available status options
  statusOptions: [
    { value: 'all', label: 'All Status' },
    { value: 'for-sale', label: 'For Sale' },
    { value: 'for-rent', label: 'For Rent' },
  ],
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    /**
     * Set search query (immediate)
     */
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    
    /**
     * Set debounced search query (for API calls)
     */
    setDebouncedSearchQuery: (state, action) => {
      state.debouncedSearchQuery = action.payload
    },
    
    /**
     * Set property type filter
     */
    setPropertyType: (state, action) => {
      state.propertyType = action.payload
    },
    
    /**
     * Set price range filter
     */
    setPriceRange: (state, action) => {
      state.priceRange = action.payload
    },
    
    /**
     * Set minimum price
     */
    setMinPrice: (state, action) => {
      state.priceRange.min = action.payload
    },
    
    /**
     * Set maximum price
     */
    setMaxPrice: (state, action) => {
      state.priceRange.max = action.payload
    },
    
    /**
     * Set bedrooms filter
     */
    setBedrooms: (state, action) => {
      state.bedrooms = action.payload
    },
    
    /**
     * Set bathrooms filter
     */
    setBathrooms: (state, action) => {
      state.bathrooms = action.payload
    },
    
    /**
     * Set location filter
     */
    setLocation: (state, action) => {
      state.location = action.payload
    },
    
    /**
     * Set property status filter
     */
    setStatus: (state, action) => {
      state.status = action.payload
    },
    
    /**
     * Set sort option
     */
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    
    /**
     * Reset all filters to default values
     */
    resetFilters: (state) => {
      state.searchQuery = ''
      state.debouncedSearchQuery = ''
      state.propertyType = 'all'
      state.priceRange = { min: 0, max: 10000000 }
      state.bedrooms = 'any'
      state.bathrooms = 'any'
      state.location = 'all'
      state.status = 'all'
      state.sortBy = 'newest'
    },
    
    /**
     * Apply multiple filters at once
     */
    applyFilters: (state, action) => {
      const filters = action.payload
      Object.keys(filters).forEach(key => {
        if (state.hasOwnProperty(key)) {
          state[key] = filters[key]
        }
      })
    },
  },
})

// Export actions
export const {
  setSearchQuery,
  setDebouncedSearchQuery,
  setPropertyType,
  setPriceRange,
  setMinPrice,
  setMaxPrice,
  setBedrooms,
  setBathrooms,
  setLocation,
  setStatus,
  setSortBy,
  resetFilters,
  applyFilters,
} = filterSlice.actions

// Export selectors
export const selectSearchQuery = (state) => state.filter.searchQuery
export const selectDebouncedSearchQuery = (state) => state.filter.debouncedSearchQuery
export const selectPropertyType = (state) => state.filter.propertyType
export const selectPriceRange = (state) => state.filter.priceRange
export const selectBedrooms = (state) => state.filter.bedrooms
export const selectBathrooms = (state) => state.filter.bathrooms
export const selectLocation = (state) => state.filter.location
export const selectStatus = (state) => state.filter.status
export const selectSortBy = (state) => state.filter.sortBy
export const selectAllFilters = (state) => state.filter

export default filterSlice.reducer
