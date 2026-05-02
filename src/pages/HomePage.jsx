/**
 * HomePage Component
 * Landing page with hero section, featured properties, and stats
 */
import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  Search, 
  Building, 
  Users, 
  Award, 
  TrendingUp,
  ArrowRight,
  Home,
  MapPin,
  Key
} from 'lucide-react'
import { fetchProperties } from '../redux/propertySlice'
import PropertyCard from '../components/PropertyCard'
import LoadingSpinner from '../components/LoadingSpinner'

const HomePage = () => {
  const dispatch = useDispatch()
  const { properties, isLoading, error } = useSelector((state) => state.property)

  // Fetch properties on mount
  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  // Get featured properties
  const featuredProperties = useMemo(() => {
    return properties.filter(p => p.featured).slice(0, 6)
  }, [properties])

  // Statistics data
  const stats = [
    { icon: Building, value: '500+', label: 'Properties Listed' },
    { icon: Users, value: '2,000+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: TrendingUp, value: '$2B+', label: 'Property Sold' },
  ]

  // Property type categories
  const categories = [
    { icon: Home, label: 'Houses', count: 145, type: 'house' },
    { icon: Building, label: 'Apartments', count: 112, type: 'apartment' },
    { icon: Key, label: 'Condos', count: 78, type: 'condo' },
    { icon: MapPin, label: 'Villas', count: 45, type: 'villa' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect 
              <span className="text-primary-300"> Dream Home</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Discover thousands of properties with our smart real estate platform. 
              Get advanced analytics, market insights, and find the perfect home that fits your lifestyle.
            </p>

            {/* Quick Search Bar */}
            <div className="bg-white rounded-xl p-2 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, property type..."
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Link
                  to="/properties"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Search
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-primary-200 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Property Type
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our diverse collection of properties across different categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.type}
                to={`/properties?type=${category.type}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <category.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {category.label}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {category.count} Properties
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Hand-picked properties for you
              </p>
            </div>
            <Link
              to="/properties"
              className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner size="medium" message="Loading featured properties..." />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center mt-8 sm:hidden">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View All Properties
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose RealEstatePro?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide the best real estate services with cutting-edge technology and expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Analytics',
                description: 'Get detailed market insights, price trends, and property analytics to make informed decisions.',
                icon: TrendingUp,
              },
              {
                title: 'Verified Listings',
                description: 'All our properties are verified and updated regularly to ensure accuracy and reliability.',
                icon: Award,
              },
              {
                title: 'Expert Support',
                description: 'Our team of experienced agents is always ready to help you find your dream property.',
                icon: Users,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Start your property search today and discover thousands of listings tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
