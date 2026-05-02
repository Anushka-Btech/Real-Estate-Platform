/**
 * DashboardPage Component
 * Analytics dashboard with charts and statistics
 * Uses Recharts for data visualization
 */
import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Building,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { propertyService } from '../services/propertyService'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatNumber, formatPrice } from '../utils/helpers'

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { darkMode } = useSelector((state) => state.user)

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const data = await propertyService.getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Chart colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  const chartTextColor = darkMode ? '#9ca3af' : '#6b7280'
  const gridColor = darkMode ? '#374151' : '#e5e7eb'

  // Stats cards data
  const statsCards = useMemo(() => {
    if (!analytics) return []
    
    return [
      {
        title: 'Total Listings',
        value: analytics.summary.totalListings,
        change: '+12%',
        isPositive: true,
        icon: Building,
        color: 'bg-blue-500',
      },
      {
        title: 'Total Sales',
        value: analytics.summary.totalSales,
        change: '+8%',
        isPositive: true,
        icon: TrendingUp,
        color: 'bg-green-500',
      },
      {
        title: 'Total Revenue',
        value: `$${formatNumber(analytics.summary.totalRevenue)}`,
        change: '+15%',
        isPositive: true,
        icon: DollarSign,
        color: 'bg-amber-500',
      },
      {
        title: 'Avg Days on Market',
        value: analytics.summary.avgDaysOnMarket,
        change: '-5%',
        isPositive: true,
        icon: Calendar,
        color: 'bg-purple-500',
      },
    ]
  }, [analytics])

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading analytics..." />
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time insights and market trends
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Monthly Sales & Revenue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.monthlySales}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={chartTextColor} />
                <YAxis stroke={chartTextColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: darkMode ? '#fff' : '#111827' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  name="Sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Property Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Property Type Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.propertyTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                >
                  {analytics.propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Price Range Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Price Range Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.priceRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="range" stroke={chartTextColor} />
                <YAxis stroke={chartTextColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: darkMode ? '#fff' : '#111827' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Properties" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Location Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Listings by Location
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.locationStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis type="number" stroke={chartTextColor} />
                <YAxis dataKey="city" type="category" stroke={chartTextColor} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: darkMode ? '#fff' : '#111827' }}
                  formatter={(value, name) => {
                    if (name === 'avgPrice') {
                      return [`$${value.toLocaleString()}`, 'Avg Price']
                    }
                    return [value, name]
                  }}
                />
                <Legend />
                <Bar dataKey="listings" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Listings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Summary Table */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Market Summary by Location
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Location
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Listings
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Avg Price
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Market Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.locationStats.map((location, index) => {
                  const totalListings = analytics.locationStats.reduce((sum, l) => sum + l.listings, 0)
                  const marketShare = ((location.listings / totalListings) * 100).toFixed(1)
                  
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {location.city}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {location.listings}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">
                        ${location.avgPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${marketShare}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                            {marketShare}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {analytics.summary.activeAgents}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Agents</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {analytics.summary.newListingsThisMonth}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">New This Month</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {Math.round((analytics.summary.totalSales / analytics.summary.totalListings) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${formatNumber(analytics.summary.totalRevenue / analytics.summary.totalSales)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Sale Price</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
