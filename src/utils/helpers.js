/**
 * Utility Helper Functions
 * Common functions used throughout the application
 */

/**
 * Format price to currency string
 * @param {number} price - Price value
 * @param {string} status - Property status (for-sale or for-rent)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, status = 'for-sale') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  const formattedPrice = formatter.format(price)
  
  if (status === 'for-rent') {
    return `${formattedPrice}/mo`
  }
  
  return formattedPrice
}

/**
 * Format large numbers with abbreviations
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Format square footage
 * @param {number} sqft - Square footage value
 * @returns {string} Formatted square footage string
 */
export const formatSqft = (sqft) => {
  return new Intl.NumberFormat('en-US').format(sqft)
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Calculate time ago from date
 * @param {string} dateString - ISO date string
 * @returns {string} Time ago string
 */
export const timeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }
  
  return 'Just now'
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Generate property slug from title
 * @param {string} title - Property title
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength level
 */
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length
  
  return {
    isValid: password.length >= minLength && strength >= 3,
    strength,
    message: password.length < minLength
      ? `Password must be at least ${minLength} characters`
      : strength < 3
        ? 'Password needs more variety (uppercase, lowercase, numbers, special characters)'
        : 'Strong password',
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * Get unique values from array of objects
 * @param {Array} array - Array of objects
 * @param {string} key - Key to extract
 * @returns {Array} Array of unique values
 */
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]))]
}

/**
 * Calculate pagination
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination info
 */
export const calculatePagination = (totalItems, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  return {
    totalPages,
    startIndex,
    endIndex,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  }
}

/**
 * Classnames utility (similar to clsx)
 * @param  {...any} classes - Class names
 * @returns {string} Combined class names
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default {
  formatPrice,
  formatNumber,
  formatSqft,
  formatDate,
  timeAgo,
  truncateText,
  generateSlug,
  capitalize,
  isValidEmail,
  validatePassword,
  debounce,
  getUniqueValues,
  calculatePagination,
  cn,
}
