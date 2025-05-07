"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = ({ isLoggedIn, openLoginModal, openSignupModal, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const name = localStorage.getItem("name")
    if (name) {
      setUserName(name)
    }
  }, [])

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(prev => !prev)
  }

  const closeMobileMenu = () => setIsMenuOpen(false)

  return (
    <nav
      className={`bg-[#050e1d] border-b border-gray-800/40 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-blue-600 text-3xl font-serif font-semibold tracking-wide select-none cursor-default">
              CrediSynth
            </span>
            <div className="hidden md:ml-10 md:flex md:space-x-8 whitespace-nowrap">
              {["goal-based-saving", "investment-tracking", "money-insights", "ai-suggestions"].map(route => (
                <Link
                  key={route}
                  to={`/${route}`}
                  className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
                  onClick={e => {
                    if (!isLoggedIn) {
                      e.preventDefault()
                      openLoginModal()
                    }
                    closeMobileMenu()
                  }}
                >
                  {route.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 relative">
            {isLoggedIn ? (
              <div className="relative">
                <div
                  onClick={toggleProfileDropdown}
                  title={userName}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold cursor-pointer"
                >
                  {userName?.charAt(0).toUpperCase()}
                </div>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0a1628] border border-gray-700 rounded-md shadow-lg z-50">
                    <Link
                      to="/update-profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                     Profile
                    </Link>
                    <button
                      onClick={() => {
                        onLogout?.()
                        setProfileDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#0a1628]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 whitespace-nowrap">
            {["goal-based-saving", "investment-tracking", "money-insights", "ai-suggestions"].map(route => (
              <Link
                key={route}
                to={`/${route}`}
                className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
                onClick={e => {
                  if (!isLoggedIn) {
                    e.preventDefault()
                    openLoginModal()
                  }
                  closeMobileMenu()
                }}
              >
                {route.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="mt-3 px-2 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/update-profile"
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 w-full text-left"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      onLogout?.()
                      closeMobileMenu()
                    }}
                    className="block px-3 py-2 text-base font-medium text-red-400 hover:bg-gray-800 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openLoginModal()
                      closeMobileMenu()
                    }}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-500 w-full text-left"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      openSignupModal()
                      closeMobileMenu()
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
