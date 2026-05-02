/**
 * Navbar Component
 * Main navigation bar with responsive design and dark mode toggle
 */
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, X, Home, Building, LayoutDashboard, Heart, User, LogOut, Sun, Moon } from 'lucide-react'
import { logout, toggleDarkMode } from '../redux/userSlice'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { isAuthenticated, currentUser, darkMode } = useSelector((state) => state.user)
  const { savedProperties } = useSelector((state) => state.property)

  // Navigation links configuration
  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/properties', label: 'Properties', icon: Building },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/saved', label: 'Saved', icon: Heart, badge: savedProperties.length },
  ]

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsMenuOpen(false)
  }

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode())
  }

  // NavLink styling based on active state
  const getNavLinkClass = ({ isActive }) => `
    flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors duration-200
    ${isActive 
      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}
  `

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              RealEstate<span className="text-primary-600">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
                <link.icon className="w-4 h-4" />
                {link.label}
                {link.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-primary-600 text-white rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Hi, {currentUser?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={getNavLinkClass}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                  {link.badge > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary-600 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
              
              <hr className="my-2 border-gray-200 dark:border-gray-800" />
              
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    Signed in as {currentUser?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-primary-600 dark:text-primary-400 font-medium"
                >
                  <User className="w-5 h-5" />
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
