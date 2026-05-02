/**
 * SavedPropertiesPage Component
 * Displays user's saved/favorite properties
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Heart, ArrowRight, Building } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'

const SavedPropertiesPage = () => {
  const { savedProperties } = useSelector((state) => state.property)
  const { isAuthenticated } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Saved Properties
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-13">
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedProperties.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              No Saved Properties Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring properties and click the heart icon to save your favorites for easy access later.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Saved Properties Grid */
          <>
            {/* Stats Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Total Saved:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {savedProperties.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">For Sale:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {savedProperties.filter(p => p.status === 'for-sale').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">For Rent:</span>
                    <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                      {savedProperties.filter(p => p.status === 'for-rent').length}
                    </span>
                  </div>
                </div>
                <Link
                  to="/properties"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm"
                >
                  Browse More Properties
                </Link>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  showActions={isAuthenticated}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SavedPropertiesPage
