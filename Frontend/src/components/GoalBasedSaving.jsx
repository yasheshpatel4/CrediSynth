"use client"

import { useState } from "react"

const GoalBasedSaving = () => {
  const [formData, setFormData] = useState({
    goal: "",
    targetAmount: "",
    savedAmount: "",
    targetDate: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !formData.goal ||
      !formData.targetAmount ||
      !formData.savedAmount ||
      !formData.targetDate
    ) {
      setError("Please fill in all fields")
      return
    }

    setError("")
    alert(
      `Goal: ${formData.goal}\nTarget Amount: ${formData.targetAmount}\nSaved Amount: ${formData.savedAmount}\nTarget Date: ${formData.targetDate}`
    )

    setFormData({
      goal: "",
      targetAmount: "",
      savedAmount: "",
      targetDate: "",
    })
  }

  return (
    <section className="max-w-md mx-auto p-6 bg-[#0a1628] rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-6">Goal Based Saving</h2>
      {error && <div className="mb-4 p-3 bg-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block mb-1">
            Goal
          </label>
          <input
            type="text"
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-[#15233c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="targetAmount" className="block mb-1">
            Target Amount
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-[#15233c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="savedAmount" className="block mb-1">
            Saved Amount
          </label>
          <input
            type="number"
            id="savedAmount"
            name="savedAmount"
            value={formData.savedAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-[#15233c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="targetDate" className="block mb-1">
            Target Date
          </label>
          <input
            type="date"
            id="targetDate"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-[#15233c] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </section>
  )
}

export default GoalBasedSaving
