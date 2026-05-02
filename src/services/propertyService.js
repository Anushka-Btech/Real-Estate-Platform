/**
 * Property Service
 * Handles all property-related API calls using Axios
 * Uses mock data to simulate backend responses
 */
import axios from 'axios'
import { mockProperties, analyticsData } from '../data/mockProperties'

// Simulate network delay for realistic UX
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Storage key for user-created properties
const USER_PROPERTIES_KEY = 'userProperties'

/**
 * Get all user-created properties from localStorage
 */
const getUserProperties = () => {
  return JSON.parse(localStorage.getItem(USER_PROPERTIES_KEY) || '[]')
}

/**
 * Property Service object containing all API methods
 */
export const propertyService = {
  /**
   * Get all properties (mock data + user-created)
   * @returns {Promise<Array>} Array of property objects
   */
  getAllProperties: async () => {
    await simulateDelay(800)
    const userProperties = getUserProperties()
    return [...mockProperties, ...userProperties]
  },

  /**
   * Get a single property by ID
   * @param {string} id - Property ID
   * @returns {Promise<Object>} Property object
   */
  getPropertyById: async (id) => {
    await simulateDelay(500)
    
    // Check mock properties first
    let property = mockProperties.find(p => p.id === id)
    
    // Check user-created properties if not found
    if (!property) {
      const userProperties = getUserProperties()
      property = userProperties.find(p => p.id === id)
    }
    
    if (!property) {
      throw new Error('Property not found')
    }
    
    return property
  },

  /**
   * Get featured properties
   * @param {number} limit - Maximum number of properties to return
   * @returns {Promise<Array>} Array of featured property objects
   */
  getFeaturedProperties: async (limit = 6) => {
    await simulateDelay(600)
    return mockProperties.filter(p => p.featured).slice(0, limit)
  },

  /**
   * Search properties with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Filtered array of properties
   */
  searchProperties: async (filters) => {
    await simulateDelay(700)
    
    const allProperties = [...mockProperties, ...getUserProperties()]
    
    return allProperties.filter(property => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesSearch = 
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query)
        
        if (!matchesSearch) return false
      }
      
      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (property.type !== filters.propertyType) return false
      }
      
      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (property.status !== filters.status) return false
      }
      
      // Price range filter
      if (filters.priceRange) {
        const { min, max } = filters.priceRange
        if (property.price < min || property.price > max) return false
      }
      
      // Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        if (property.bedrooms < parseInt(filters.bedrooms)) return false
      }
      
      // Bathrooms filter
      if (filters.bathrooms && filters.bathrooms !== 'any') {
        if (property.bathrooms < parseInt(filters.bathrooms)) return false
      }
      
      // Location filter
      if (filters.location && filters.location !== 'all') {
        if (property.city !== filters.location) return false
      }
      
      return true
    })
  },

  /**
   * Sort properties by specified criteria
   * @param {Array} properties - Array of properties to sort
   * @param {string} sortBy - Sort criteria
   * @returns {Array} Sorted array of properties
   */
  sortProperties: (properties, sortBy) => {
    const sorted = [...properties]
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      case 'beds-high':
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms)
      case 'sqft-high':
        return sorted.sort((a, b) => b.sqft - a.sqft)
      default:
        return sorted
    }
  },

  /**
   * Get analytics data for dashboard
   * @returns {Promise<Object>} Analytics data object
   */
  getAnalytics: async () => {
    await simulateDelay(600)
    return analyticsData
  },

  /**
   * Get properties by type
   * @param {string} type - Property type
   * @returns {Promise<Array>} Filtered properties
   */
  getPropertiesByType: async (type) => {
    await simulateDelay(500)
    if (type === 'all') return mockProperties
    return mockProperties.filter(p => p.type === type)
  },

  /**
   * Get similar properties
   * @param {Object} property - Reference property
   * @param {number} limit - Maximum number of similar properties
   * @returns {Promise<Array>} Array of similar properties
   */
  getSimilarProperties: async (property, limit = 3) => {
    await simulateDelay(400)
    
    return mockProperties
      .filter(p => 
        p.id !== property.id && 
        (p.type === property.type || p.city === property.city)
      )
      .slice(0, limit)
  },
}

/**
 * Axios instance with interceptors for error handling
 * Note: In this frontend-only app, we use mock data directly
 * This is prepared for future API integration
 */
export const apiClient = axios.create({
  baseURL: '/api', // Would be actual API URL in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('authToken')
          break
        case 404:
          // Handle not found
          break
        case 500:
          // Handle server error
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  }
)

export default propertyService
