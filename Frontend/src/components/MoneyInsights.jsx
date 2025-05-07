"use client"

import { useState } from "react"

const MoneyInsights = () => {
  const [transactions] = useState([
    { id: 1, description: "Grocery Store", amount: -50, date: "2024-05-01" },
    { id: 2, description: "Salary", amount: 3000, date: "2024-05-05" },
    { id: 3, description: "Electricity Bill", amount: -120, date: "2024-05-10" },
  ])

  const [savingsGoals] = useState([
    { id: 1, name: "Vacation", target: 2000, saved: 500 },
    { id: 2, name: "Home", target: 50000, saved: 15000 },
  ])

  const [investmentPerformance] = useState({
    totalInvested: 20000,
    currentValue: 22000,
    returns: 2000,
  })

  return (
    <section id="money-insights" className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Real-Time Money Insights</h2>

      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Recent Transactions</h3>
        <ul className="text-gray-300 space-y-2">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex justify-between">
              <span>{tx.description} ({tx.date})</span>
              <span className={tx.amount < 0 ? "text-red-500" : "text-green-500"}>
                ${tx.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Savings Goals</h3>
        <ul className="text-gray-300 space-y-2">
          {savingsGoals.map((goal) => {
            const progress = (goal.saved / goal.target) * 100
            return (
              <li key={goal.id}>
                <div className="flex justify-between mb-1">
                  <span>{goal.name}</span>
                  <span>${goal.saved.toFixed(2)} / ${goal.target.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Investment Performance</h3>
        <p className="text-gray-300">
          Total Invested: ${investmentPerformance.totalInvested.toFixed(2)}
        </p>
        <p className="text-gray-300">
          Current Value: ${investmentPerformance.currentValue.toFixed(2)}
        </p>
        <p className="text-gray-300">
          Returns: <span className="text-green-500">${investmentPerformance.returns.toFixed(2)}</span>
        </p>
      </div>
    </section>
  )
}

export default MoneyInsights
