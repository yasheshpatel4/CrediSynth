"use client"

import { useState, useEffect } from "react"
import { Menu, X, Globe, Moon } from "lucide-react"
import Logo from "./Logo"

const Navbar = ({ openLoginModal, openSignupModal }) => {
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

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
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
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("security")}
                className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              >
                Security
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-gray-300 hover:text-blue-500 px-3 py-2 text-sm font-medium"
              >
                FAQ
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center text-gray-300 hover:text-blue-500">
              <Globe className="h-5 w-5 mr-1" />
              <span>English</span>
            </button>
            <button className="text-gray-300 hover:text-blue-500">
              <Moon className="h-5 w-5" />
            </button>
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("security")}
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
            >
              Security
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-gray-300 hover:text-blue-500 block px-3 py-2 text-base font-medium w-full text-left"
            >
              FAQ
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5 space-x-3">
              <button className="flex items-center text-gray-300 hover:text-blue-500">
                <Globe className="h-5 w-5 mr-1" />
                <span>English</span>
              </button>
              <button className="text-gray-300 hover:text-blue-500">
                <Moon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
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
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
