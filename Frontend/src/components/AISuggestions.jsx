"use client"

import { useState } from "react"

const AISuggestions = () => {
  const [predictions] = useState([
    {
      id: 1,
      title: "Market Trend Prediction",
      description: "The AI model predicts a bullish trend in technology stocks over the next quarter.",
    },
    {
      id: 2,
      title: "Savings Optimization",
      description: "Based on your spending habits, increasing monthly savings by 10% is recommended.",
    },
    {
      id: 3,
      title: "Investment Strategy",
      description: "Diversify your portfolio by adding more healthcare sector stocks.",
    },
  ])

  return (
    <section id="ai-suggestions" className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-white">AI Suggestions & Predictions</h2>
      <div className="space-y-6 bg-[#0a1628] p-6 rounded-lg shadow-md">
        {predictions.map((item) => (
          <div key={item.id} className="border border-gray-700 rounded-md p-4">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">{item.title}</h3>
            <p className="text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AISuggestions
