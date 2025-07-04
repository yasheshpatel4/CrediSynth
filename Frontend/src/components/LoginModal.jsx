"use client"

import { useState } from "react"
import { X } from "lucide-react"

const LoginModal = ({ onClose, switchToSignup, onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store the token in localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("email", data.email)
      localStorage.setItem("name",data.username)

      // Call onLogin to update login state in parent
      if (onLogin) {
        onLogin()
      }

      // Close the modal and redirect or update UI
      onClose()
      window.location.href = "/dashboard" // Redirect to dashboard
    } catch (err) {
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a1628] rounded-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Login to CrediSynth</h2>

          {error && <div className="bg-red-900 text-white p-3 rounded-md mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#0f1f35] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#0f1f35] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 mb-4"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center text-gray-400">
            <p>
              Don't have an account?{" "}
              <button onClick={switchToSignup} className="text-blue-500 hover:underline">
                Sign up
              </button>
            </p>
            <p className="mt-2">
              <button className="text-blue-500 hover:underline">Forgot password?</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
