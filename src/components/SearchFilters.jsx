/**
 * SearchFilters Component
 * Advanced search and filter controls for property listings
 * Includes search bar, property type, price range, bedrooms, etc.
 */
import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import {
  setSearchQuery,
  setDebouncedSearchQuery,
  setPropertyType,
  setPriceRange,
  setBedrooms,
  setBathrooms,
  setLocation,
  setStatus,
  setSortBy,
  resetFilters,
} from '../redux/filterSlice'
import { useDebounce } from '../hooks/useDebounce'
import { availableCities } from '../data/mockProperties'
import { formatPrice } from '../utils/helpers'

const SearchFilters = ({ onSearch }) => {
  const dispatch = useDispatch()
  const filters = useSelector((state) => state.filter)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Local state for search input
  const [localSearch, setLocalSearch] = useState(filters.searchQuery)

  // Debounce search query
  const debouncedSearch = useDebounce(localSearch, 500)

  // Update Redux state when debounced search changes
  useEffect(() => {
    dispatch(setSearchQuery(localSearch))
    dispatch(setDebouncedSearchQuery(debouncedSearch))
    if (onSearch) {
      onSearch()
    }
  }, [debouncedSearch, dispatch, onSearch])

  // Price range options
  const priceOptions = useMemo(() => [
    { min: 0, max: 10000000, label: 'Any Price' },
    { min: 0, max: 100000, label: 'Up to $100K' },
    { min: 100000, max: 300000, label: '$100K - $300K' },
    { min: 300000, max: 500000, label: '$300K - $500K' },
    { min: 500000, max: 1000000, label: '$500K - $1M' },
    { min: 1000000, max: 2000000, label: '$1M - $2M' },
    { min: 2000000, max: 5000000, label: '$2M - $5M' },
    { min: 5000000, max: 10000000, label: '$5M+' },
  ], [])

  // Handle price range change
  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split('-').map(Number)
    dispatch(setPriceRange({ min, max }))
  }

  // Handle filter reset
  const handleReset = () => {
    dispatch(resetFilters())
    setLocalSearch('')
    if (onSearch) onSearch()
  }

  // Check if any filters are active
  const hasActiveFilters = 
    filters.searchQuery ||
    filters.propertyType !== 'all' ||
    filters.status !== 'all' ||
    filters.bedrooms !== 'any' ||
    filters.bathrooms !== 'any' ||
    filters.location !== 'all' ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 10000000

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 lg:p-6 mb-6">
      {/* Main Search Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by location, property name, or address..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex gap-3">
          {/* Property Type */}
          <select
            value={filters.propertyType}
            onChange={(e) => dispatch(setPropertyType(e.target.value))}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {filters.propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => dispatch(setStatus(e.target.value))}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {filters.statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Range
              </label>
              <select
                value={`${filters.priceRange.min}-${filters.priceRange.max}`}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {priceOptions.map((option) => (
                  <option key={option.label} value={`${option.min}-${option.max}`}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => dispatch(setBedrooms(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {filters.bedroomOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => dispatch(setBathrooms(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {filters.bathroomOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => dispatch(setLocation(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {availableCities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {filters.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleReset}
                disabled={!hasActiveFilters}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilters
