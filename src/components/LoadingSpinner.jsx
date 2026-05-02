/**
 * LoadingSpinner Component
 * Full-page loading spinner for lazy-loaded components
 */
import React from 'react'

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  // Size variants
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  }

  const spinnerSize = sizeClasses[size] || sizeClasses.large

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      {/* Spinner */}
      <div className={`${spinnerSize} relative`}>
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      {/* Loading Text */}
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
          {message}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner
