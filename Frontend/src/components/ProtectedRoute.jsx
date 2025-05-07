import React from "react"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // Redirect to landing page or login page
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedRoute
