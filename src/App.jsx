/**
 * Main App Component
 * Handles routing, theme management, and error boundaries
 */
import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import { initializeAuth } from './redux/userSlice'
import { loadSavedProperties } from './redux/propertySlice'

// Lazy load pages for code splitting and performance optimization
const HomePage = lazy(() => import('./pages/HomePage'))
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'))
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SavedPropertiesPage = lazy(() => import('./pages/SavedPropertiesPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.user)

  // Initialize authentication and saved properties from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuth())
    dispatch(loadSavedProperties())
  }, [dispatch])

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <ErrorBoundary>
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Home Page - Featured Properties */}
              <Route path="/" element={<HomePage />} />
              
              {/* Property Listings with Filters */}
              <Route path="/properties" element={<PropertiesPage />} />
              
              {/* Individual Property Details */}
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              
              {/* Analytics Dashboard with Charts */}
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* User's Saved Properties */}
              <Route path="/saved" element={<SavedPropertiesPage />} />
              
              {/* Login/Register Page */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        
        {/* Footer */}
        <Footer />
      </ErrorBoundary>
    </div>
  )
}

export default App
