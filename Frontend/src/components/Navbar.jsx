"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import Logo from "./Logo"

const Navbar = ({ isLoggedIn, openLoginModal, openSignupModal, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogoClick = () => {
    if (!isLoggedIn) {
      openLoginModal()
    }
  }

  return (
    <nav
      className={`bg-[#050e1d] border-b border-gray-800/40 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={handleLogoClick} title="Click to login">
              <Logo />
            </div>
          </div>
          <div className="hidden md:flex md:space-x-8 md:items-center justify-end flex-1">
            <Link
              to="/goal-based-saving"
              className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              Goal-Based Saving
            </Link>

            <Link
              to="/investment-tracking"
              className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              Investment Tracking
            </Link>

            <Link
              to="/money-insights"
              className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              Money Insights
            </Link>           

            <Link
              to="/update-profile"
              className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              Profile
            </Link>
            
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  if (onLogout) {
                    onLogout()
                  }
                }}
                className="text-gray-300 hover:text-red-500 px-4 py-2 text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="text-gray-300 hover:text-blue-500 px-4 py-2 text-sm font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={openSignupModal}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a1628]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 whitespace-nowrap">
            <Link
              to="/goal-based-saving"
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              Goal-Based Saving
            </Link>
            <Link
              to="/investment-tracking"
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              Investment Tracking
            </Link>
            <Link
              to="/money-insights"
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              Money Insights
            </Link>
            <Link
              to="/ai-suggestions"
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault()
                  openLoginModal()
                }
                setIsMenuOpen(false)
              }}
            >
              AI Suggestions
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="mt-3 px-2 space-y-1">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    if (onLogout) {
                      onLogout()
                    }
                    setIsMenuOpen(false)
                  }}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-red-500 w-full text-left"
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openLoginModal()
                      setIsMenuOpen(false)
                    }}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-500 w-full text-left"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      openSignupModal()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
