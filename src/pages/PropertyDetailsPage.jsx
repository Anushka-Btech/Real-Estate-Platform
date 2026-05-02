/**
 * PropertyDetailsPage Component
 * Detailed view of a single property with images, features, and agent info
 */
import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Home,
  Check,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Building,
} from 'lucide-react'
import { fetchPropertyById, toggleSaveProperty, clearSelectedProperty } from '../redux/propertySlice'
import { formatPrice, formatSqft, formatDate } from '../utils/helpers'
import PropertyCard from '../components/PropertyCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { propertyService } from '../services/propertyService'

const PropertyDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { selectedProperty, savedProperties, isLoadingDetails, error, properties } = useSelector(
    (state) => state.property
  )
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [similarProperties, setSimilarProperties] = useState([])

  // Check if property is saved
  const isSaved = savedProperties.some(p => p.id === selectedProperty?.id)

  // Fetch property details on mount
  useEffect(() => {
    dispatch(fetchPropertyById(id))
    
    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedProperty())
    }
  }, [id, dispatch])

  // Fetch similar properties
  useEffect(() => {
    const fetchSimilar = async () => {
      if (selectedProperty) {
        const similar = await propertyService.getSimilarProperties(selectedProperty, 3)
        setSimilarProperties(similar)
      }
    }
    fetchSimilar()
  }, [selectedProperty])

  // Handle save toggle
  const handleToggleSave = () => {
    if (selectedProperty) {
      dispatch(toggleSaveProperty(selectedProperty))
    }
  }

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProperty?.title,
        text: `Check out this property: ${selectedProperty?.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Image navigation
  const nextImage = () => {
    if (selectedProperty?.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedProperty?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      )
    }
  }

  // Loading state
  if (isLoadingDetails) {
    return <LoadingSpinner size="large" message="Loading property details..." />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Listings
          </button>
        </div>
      </div>
    )
  }

  // No property found
  if (!selectedProperty) {
    return null
  }

  const property = selectedProperty
  const images = property.images || []
  const currentImage = images[currentImageIndex] || 'https://via.placeholder.com/800x600/e2e8f0/64748b?text=No+Image'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Listings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
              <div className="relative aspect-[16/9]">
                <img
                  src={currentImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? 'bg-white'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  property.status === 'for-rent'
                    ? 'bg-green-500 text-white'
                    : 'bg-primary-600 text-white'
                }`}>
                  {property.status === 'for-rent' ? 'For Rent' : 'For Sale'}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                        index === currentImageIndex
                          ? 'ring-2 ring-primary-600'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {formatPrice(property.price, property.status)}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSave}
                    className={`p-3 rounded-full transition-colors ${
                      isSaved
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 hover:text-red-500'
                    }`}
                    aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Share property"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Bed className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {property.bedrooms}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</div>
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Bath className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {property.bathrooms}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Square className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatSqft(property.sqft)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Sqft</div>
                  </div>
                </div>
                {property.yearBuilt && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {property.yearBuilt}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Year Built</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                      >
                        <Check className="w-5 h-5 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            {property.agent && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Agent
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {property.agent.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Real Estate Agent
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <Phone className="w-5 h-5" />
                    {property.agent.phone}
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <Mail className="w-5 h-5" />
                    {property.agent.email}
                  </a>
                </div>

                <button className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                  Schedule a Tour
                </button>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Property Details
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Property Type</dt>
                  <dd className="font-medium text-gray-900 dark:text-white capitalize">
                    {property.type}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {property.status === 'for-rent' ? 'For Rent' : 'For Sale'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Price per Sqft</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    ${Math.round(property.price / property.sqft).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Listed</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">
                    {formatDate(property.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyDetailsPage
