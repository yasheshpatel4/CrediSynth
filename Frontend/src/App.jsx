"use client"

import { useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Stats from "./components/Stats"
import RoleSelector from "./components/RoleSelector"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import Security from "./components/Security"
import Testimonials from "./components/Testimonials"
import FAQ from "./components/FAQ"
import Footer from "./components/Footer"
import LoginModal from "./components/LoginModal"
import SignupModal from "./components/SignupModal"
import "./index.css"

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)

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

  return (
    <div className="min-h-screen bg-[#050e1d] text-gray-100">
      <Navbar openLoginModal={openLoginModal} openSignupModal={openSignupModal} />
      <Hero openSignupModal={openSignupModal} />
      <Stats />
      <RoleSelector />
      <Features />
      <HowItWorks />
      <Security />
      <Testimonials />
      <FAQ />
      <Footer />

      {showLoginModal && <LoginModal onClose={closeModals} switchToSignup={openSignupModal} />}
      {showSignupModal && <SignupModal onClose={closeModals} switchToLogin={openLoginModal} />}
    </div>
  )
}

export default App
