/**
 * usePagination Hook
 * Manages pagination state and calculations
 */
import { useState, useMemo } from 'react'

/**
 * Handle pagination logic
 * @param {Array} data - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Pagination state and handlers
 */
export const usePagination = (data = [], itemsPerPage = 9) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination values
  const paginationData = useMemo(() => {
    const totalItems = data.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentData = data.slice(startIndex, endIndex)

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      currentData,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    }
  }, [data, currentPage, itemsPerPage])

  // Navigation handlers
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, paginationData.totalPages))
    setCurrentPage(pageNumber)
  }

  const nextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const previousPage = () => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const resetPage = () => {
    setCurrentPage(1)
  }

  // Generate page numbers for display
  const pageNumbers = useMemo(() => {
    const pages = []
    const { totalPages } = paginationData
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first, last, and pages around current
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      pages.push(totalPages)
    }
    
    return pages
  }, [currentPage, paginationData.totalPages])

  return {
    ...paginationData,
    currentPage,
    pageNumbers,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
  }
}

export default usePagination
