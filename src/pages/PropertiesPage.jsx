/**
 * PropertiesPage Component
 * Property listings with search, filters, sort, and pagination
 */
import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Plus, Grid, List, Building } from 'lucide-react'
import { fetchProperties } from '../redux/propertySlice'
import { setPropertyType } from '../redux/filterSlice'
import { propertyService } from '../services/propertyService'
import PropertyCard from '../components/PropertyCard'
import SearchFilters from '../components/SearchFilters'
import Pagination from '../components/Pagination'
import PropertyModal from '../components/PropertyModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { usePagination } from '../hooks/usePagination'

const PropertiesPage = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  
  const { properties, isLoading, error } = useSelector((state) => state.property)
  const filters = useSelector((state) => state.filter)
  const { isAuthenticated } = useSelector((state) => state.user)

  // Handle URL query params for property type
  useEffect(() => {
    const typeFromUrl = searchParams.get('type')
    if (typeFromUrl) {
      dispatch(setPropertyType(typeFromUrl))
    }
  }, [searchParams, dispatch])

  // Fetch properties on mount
  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  // Filter and sort properties using useMemo for performance
  const filteredProperties = useMemo(() => {
    let result = [...properties]

    // Apply search filter
    if (filters.debouncedSearchQuery) {
      const query = filters.debouncedSearchQuery.toLowerCase()
      result = result.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query)
      )
    }

    // Apply property type filter
    if (filters.propertyType && filters.propertyType !== 'all') {
      result = result.filter(p => p.type === filters.propertyType)
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status)
    }

    // Apply price range filter
    if (filters.priceRange) {
      result = result.filter(p => 
        p.price >= filters.priceRange.min && 
        p.price <= filters.priceRange.max
      )
    }

    // Apply bedrooms filter
    if (filters.bedrooms && filters.bedrooms !== 'any') {
      result = result.filter(p => p.bedrooms >= parseInt(filters.bedrooms))
    }

    // Apply bathrooms filter
    if (filters.bathrooms && filters.bathrooms !== 'any') {
      result = result.filter(p => p.bathrooms >= parseInt(filters.bathrooms))
    }

    // Apply location filter
    if (filters.location && filters.location !== 'all') {
      result = result.filter(p => p.city === filters.location)
    }

    // Apply sorting
    result = propertyService.sortProperties(result, filters.sortBy)

    return result
  }, [properties, filters])

  // Pagination
  const {
    currentData: paginatedProperties,
    currentPage,
    totalPages,
    totalItems,
    pageNumbers,
    goToPage,
    nextPage,
    previousPage,
    hasPreviousPage,
    hasNextPage,
    resetPage,
  } = usePagination(filteredProperties, 9)

  // Reset to page 1 when filters change
  useEffect(() => {
    resetPage()
  }, [filters.debouncedSearchQuery, filters.propertyType, filters.status, 
      filters.priceRange, filters.bedrooms, filters.bathrooms, 
      filters.location, filters.sortBy])

  // Handle search callback
  const handleSearch = useCallback(() => {
    resetPage()
  }, [resetPage])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Property Listings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {totalItems} {totalItems === 1 ? 'property' : 'properties'} available
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Add Property Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Property</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <SearchFilters onSearch={handleSearch} />

        {/* Loading State */}
        {isLoading ? (
          <LoadingSpinner size="medium" message="Loading properties..." />
        ) : error ? (
          /* Error State */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Properties
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => dispatch(fetchProperties())}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          /* Property Grid/List */
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }>
              {paginatedProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  showActions={isAuthenticated}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              onPageChange={goToPage}
              onPrevious={previousPage}
              onNext={nextPage}
              hasPreviousPage={hasPreviousPage}
              hasNextPage={hasNextPage}
            />
          </>
        )}
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <PropertyModal
          onClose={() => setShowAddModal(false)}
          mode="add"
        />
      )}
    </div>
  )
}

export default PropertiesPage
