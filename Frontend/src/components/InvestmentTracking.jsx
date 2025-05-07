"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip } from "recharts"

const API_BASE = "http://localhost:8080/api/investments"
const USER_ID = localStorage.getItem("email")

const COLORS = ["#4ade80", "#f87171"]

const InvestmentTracking = () => {
  const [investments, setInvestments] = useState([])
  const [form, setForm] = useState({
    investmentType: "",
    asset: "",
    amount: "",
    purchasePrice: "",
    purchaseDate: "",
    currentValue: "",
  })
  const [analysisResult, setAnalysisResult] = useState(null)

  const fetchInvestments = async () => {
    const res = await fetch(`${API_BASE}/user/${USER_ID}`)
    const data = await res.json()
    setInvestments(data)
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/add/${USER_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: USER_ID }),
    })
    if (res.ok) {
      await fetchInvestments()
      setForm({
        investmentType: "",
        asset: "",
        amount: "",
        purchasePrice: "",
        purchaseDate: "",
        currentValue: "",
      })
    }
  }

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
    await fetchInvestments()
  }

  const handleAnalyze = async (id) => {
    const res = await fetch(`${API_BASE}/analyze/${id}`, { method: "POST" })
    const data = await res.json()
    console.log(data)
    // Adding the analysis response details to state
    setAnalysisResult({
      id,
      ...data,
      summary_message: data.summary_message
    })
  }

  const totalValue = investments.reduce((acc, inv) => acc + inv.currentValue, 0)

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Investment Tracking</h2>

      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Portfolio</h3>
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr>
              <th className="pb-2">Asset</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Purchase Price</th>
              <th className="pb-2">Current Value</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-700">
                <td className="py-2">{inv.asset}</td>
                <td className="py-2">{inv.investmentType}</td>
                <td className="py-2">{inv.amount}</td>
                <td className="py-2">${inv.purchasePrice}</td>
                <td className="py-2">${inv.currentValue}</td>
                <td className="py-2 flex space-x-4">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(inv.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => handleAnalyze(inv.id)}
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-700 font-semibold text-white">
              <td colSpan="4" className="py-2 text-right">Total Value</td>
              <td className="py-2">${totalValue.toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {analysisResult && (
        <div className="bg-[#132340] p-6 rounded-lg shadow-lg text-white mb-8">
          <h4 className="text-xl font-bold text-green-400 mb-3">Analysis Result</h4>
          <p><strong>Investment ID:</strong> {analysisResult.id}</p>
          <p>
            <strong>Quality:</strong>{" "}
            <span
              className={`ml-2 font-semibold ${analysisResult.investment_quality === "Good"
                ? "text-green-400"
                : "text-red-400"
                }`}
            >
              {analysisResult.investment_quality}
            </span>
          </p>
          <p><strong>Gain/Loss:</strong> ${analysisResult.gain_loss.toFixed(2)} ({analysisResult.gain_loss_percent}%)</p>
          <p><strong>Summary:</strong> {analysisResult.summary_message}</p>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">Prediction Chart</h4>
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  {
                    name: "Good",
                    value: analysisResult.raw_prediction === 1 ? 1 : 0,
                  },
                  {
                    name: "Bad",
                    value: analysisResult.raw_prediction === 0 ? 1 : 0,
                  },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      )}

      <div className="bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Add Investment</h3>
        <form className="grid grid-cols-2 gap-4 text-white" onSubmit={handleSubmit}>
          <select
            name="investmentType"
            value={form.investmentType}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800"
            required
          >
            <option value="">Select Investment Type</option>
            <option value="Stock">Stocks</option>
            <option value="Bond">Bonds</option>
            <option value="Crypto">Crypto</option>
            <option value="ETF">ETF</option>
            <option value="Mutual Fund">Mutial Fund</option>
          </select>

          <select
            name="asset"
            value={form.asset}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800"
            required
          >
            <option value="">Select Asset</option>
            <option value="AAPL">AAPL</option>
            <option value="TSLA">TSLA</option>
            <option value="GOOGL">GOOGL</option>
          </select>

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800"
            required
          />
          <input
            name="purchasePrice"
            type="number"
            placeholder="Purchase Price"
            value={form.purchasePrice}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800"
            required
          />
          <input
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800"
            required
          />
          <input
            name="currentValue"
            type="number"
            placeholder="Current Value"
            value={form.currentValue}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800"
            required
          />

          <button
            type="submit"
            className="col-span-2 bg-blue-600 py-2 rounded hover:bg-blue-700"
          >
            Add Investment
          </button>
        </form>
      </div>
    </section>
  )
}

export default InvestmentTracking
