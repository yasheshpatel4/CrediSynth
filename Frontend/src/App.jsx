"use client"

import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Stats from "./components/Stats"
import RoleSelector from "./components/RoleSelector"
import Footer from "./components/Footer"
import LoginModal from "./components/LoginModal"
import SignupModal from "./components/SignupModal"
import GoalBasedSaving from "./components/GoalBasedSaving"
import InvestmentTracking from "./components/InvestmentTracking"
import MoneyInsights from "./components/MoneyInsights"
import AISuggestions from "./components/AISuggestions"
import "./index.css"

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
  }

  return (
    <div className="min-h-screen bg-[#050e1d] text-gray-100">
      <Navbar
        isLoggedIn={isLoggedIn}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
        onLogout={handleLogout}
      />
      <Hero openSignupModal={openSignupModal} />
      <Stats />
      <RoleSelector />
      {isLoggedIn && (
        <>
          <GoalBasedSaving />
          <InvestmentTracking />
          <MoneyInsights />
          <AISuggestions />
        </>
      )}
      <Footer />

      {showLoginModal && <LoginModal onClose={closeModals} switchToSignup={openSignupModal} onLogin={handleLogin} />}
      {showSignupModal && <SignupModal onClose={closeModals} switchToLogin={openLoginModal} onLogin={handleLogin} />}
    </div>
  )
}

export default App
