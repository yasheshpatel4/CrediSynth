"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginModal from "./components/LoginModal"
import SignupModal from "./components/SignupModal"
import GoalBasedSaving from "./components/GoalBasedSaving"
import InvestmentTracking from "./components/InvestmentTracking"
import MoneyInsights from "./components/MoneyInsights"
import AISuggestions from "./components/AISuggestions"
import ProtectedRoute from "./components/ProtectedRoute"
import "./index.css"
import Hero from "./components/Hero"
import Stats from "./components/Stats"
// import Roleclotor from "./components/RoleSeclotor"
import Footer from "./components/Footer"
import Logo from "./components/Logo"

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check localStorage for token on mount
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const openLoginModal = () => {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  const openSignupModal = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  const closeModals = () => {
    setShowLoginModal(false)
    setShowSignupModal(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    closeModals()
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#050e1d] text-gray-100">
      <Navbar
        isLoggedIn={isLoggedIn}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={
          <>
            <Hero openSignupModal={openSignupModal} />
            <Stats />
            
          </>
        } />
        <Route path="/dashboard" element={
          <>
            <Hero openSignupModal={openSignupModal} />
            <Stats />
            
          </>
        } />
        <Route path="/goal-based-saving" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <GoalBasedSaving />
          </ProtectedRoute>
        } />
        <Route path="/investment-tracking" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <InvestmentTracking />
          </ProtectedRoute>
        } />
        <Route path="/money-insights" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MoneyInsights />
          </ProtectedRoute>
        } />
        <Route path="/ai-suggestions" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AISuggestions />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />

      {showLoginModal && <LoginModal onClose={closeModals} switchToSignup={openSignupModal} onLogin={handleLogin} />}
      {showSignupModal && <SignupModal onClose={closeModals} switchToLogin={openLoginModal} onLogin={handleLogin} />}
    </div>
  )
}

export default App
