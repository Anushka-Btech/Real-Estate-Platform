/**
 * PropertyCard Component
 * Displays individual property information in a card format
 * Used in listings, featured properties, and saved properties
 */
import React, { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Edit2, 
  Trash2,
  Eye
} from 'lucide-react'
import { toggleSaveProperty, deleteProperty } from '../redux/propertySlice'
import { formatPrice, formatSqft } from '../utils/helpers'
import PropertyModal from './PropertyModal'

const PropertyCard = memo(({ property, showActions = false }) => {
  const dispatch = useDispatch()
  const { savedProperties } = useSelector((state) => state.property)
  const { isAuthenticated } = useSelector((state) => state.user)
  
  const [showEditModal, setShowEditModal] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Check if property is saved
  const isSaved = savedProperties.some(p => p.id === property.id)

  // Handle save/unsave toggle
  const handleToggleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleSaveProperty(property))
  }

  // Handle delete property
  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this property?')) {
      dispatch(deleteProperty(property.id))
    }
  }

  // Get status badge styling
  const getStatusBadge = () => {
    const isForRent = property.status === 'for-rent'
    return {
      text: isForRent ? 'For Rent' : 'For Sale',
      className: isForRent 
        ? 'bg-green-500 text-white' 
        : 'bg-primary-600 text-white'
    }
  }

  const statusBadge = getStatusBadge()
  const fallbackImage = 'https://via.placeholder.com/800x600/e2e8f0/64748b?text=No+Image'

  return (
    <>
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link to={`/property/${property.id}`}>
            <img
              src={imageError ? fallbackImage : property.images?.[0] || fallbackImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </Link>
          
          {/* Status Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}>
            {statusBadge.text}
          </div>

          {/* Property Type Badge */}
          <div className="absolute top-3 right-12 px-3 py-1 bg-black/60 text-white rounded-full text-xs font-medium capitalize">
            {property.type}
          </div>

          {/* Save Button */}
          <button
            onClick={handleToggleSave}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              isSaved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Overlay */}
          <Link 
            to={`/property/${property.id}`}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors"
          >
            <span className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-4 h-4" />
              View Details
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {formatPrice(property.price, property.status)}
          </div>

          {/* Title */}
          <Link to={`/property/${property.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-4 text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}, {property.state}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{formatSqft(property.sqft)} sqft</span>
              </div>
            </div>
          </div>

          {/* Admin Actions (for user-created properties) */}
          {showActions && property.isUserCreated && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <PropertyModal
          property={property}
          onClose={() => setShowEditModal(false)}
          mode="edit"
        />
      )}
    </>
  )
})

PropertyCard.displayName = 'PropertyCard'

export default PropertyCard
