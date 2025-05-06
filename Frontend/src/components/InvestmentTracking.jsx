"use client"

import { useState } from "react"

const InvestmentTracking = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Buy", asset: "AAPL", amount: 10, price: 150, date: "2024-05-01" },
    { id: 2, type: "Sell", asset: "TSLA", amount: 5, price: 700, date: "2024-05-10" },
  ])

  const [portfolio, setPortfolio] = useState({
    AAPL: { shares: 50, currentPrice: 155 },
    TSLA: { shares: 20, currentPrice: 710 },
    GOOGL: { shares: 15, currentPrice: 2800 },
  })

  const totalValue = Object.entries(portfolio).reduce(
    (acc, [asset, data]) => acc + data.shares * data.currentPrice,
    0
  )

  return (
    <section id="investment-tracking" className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Investment Tracking</h2>

      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Portfolio</h3>
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr>
              <th className="pb-2">Asset</th>
              <th className="pb-2">Shares</th>
              <th className="pb-2">Current Price</th>
              <th className="pb-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(portfolio).map(([asset, data]) => (
              <tr key={asset} className="border-t border-gray-700">
                <td className="py-2">{asset}</td>
                <td className="py-2">{data.shares}</td>
                <td className="py-2">${data.currentPrice.toFixed(2)}</td>
                <td className="py-2">${(data.shares * data.currentPrice).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="border-t border-gray-700 font-semibold text-white">
              <td colSpan="3" className="py-2 text-right">Total Value</td>
              <td className="py-2">${totalValue.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Transactions</h3>
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr>
              <th className="pb-2">Date</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Asset</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-gray-700">
                <td className="py-2">{tx.date}</td>
                <td className="py-2">{tx.type}</td>
                <td className="py-2">{tx.asset}</td>
                <td className="py-2">{tx.amount}</td>
                <td className="py-2">${tx.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default InvestmentTracking
