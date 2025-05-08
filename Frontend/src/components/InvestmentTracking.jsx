"use client"

import { useEffect, useState, useRef } from "react"
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, ResponsiveContainer } from "recharts"

const API_BASE = "http://localhost:8080/api/investments"
const USER_ID = localStorage.getItem("email")

const COLORS = ["#4ade80", "#f87171"]
const CHART_COLORS = ["#4ade80", "#60a5fa", "#f87171", "#facc15", "#a78bfa"]

// Asset options based on investment type
const ASSET_OPTIONS = {
  "Stock": ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"],
  "Bond": ["Treasury", "Corporate", "Municipal", "High-Yield"],
  "Crypto": ["BTC", "ETH", "SOL", "ADA", "DOT"],
  "ETF": ["SPY", "QQQ", "VTI", "ARKK", "VOO"],
  "Mutual Fund": ["FXAIX", "VFIAX", "SWPPX", "VTSAX"]
}

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
  const [assetOptions, setAssetOptions] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null)
  const analysisRef = useRef(null)

  const fetchInvestments = async () => {
    const res = await fetch(`${API_BASE}/user/${USER_ID}`)
    const data = await res.json()
    setInvestments(data)
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  // Effect to update asset options when investment type changes
  useEffect(() => {
    if (form.investmentType) {
      setAssetOptions(ASSET_OPTIONS[form.investmentType] || [])
      setForm(prev => ({ ...prev, asset: "" })) // Reset asset when type changes
    } else {
      setAssetOptions([])
    }
  }, [form.investmentType])

  // Effect to scroll to analysis result when it appears
  useEffect(() => {
    if (analysisResult && analysisRef.current) {
      analysisRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      })
    }
  }, [analysisResult])

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
    const res = await fetch(`${API_BASE}/predict/${id}`, { method: "POST" })
    const data = await res.json()
    
    // Use the actual response data format
    const analysisData = {
      id,
      asset: investments.find(inv => inv.id === id)?.asset || "",
      investmentType: investments.find(inv => inv.id === id)?.investmentType || "",
      investment_quality: data.predictedROI > 0 ? "Good" : "Poor",
      actualROI: data.actualROI,
      predictedROI: data.predictedROI,
      holdingDays: data.holdingDays,
      recommendedHoldingDays: data.recommendedHoldingDays,
      predictedOutperformance: data.predictedOutperformance,
      recommendation: data.recommendation,
      alternatives: data.alternatives,
      summary_message: data.summary_message || `Investment analysis complete. Recommendation: ${data.recommendation}`
    }
    
    setAnalysisResult(analysisData)
  }

  const totalValue = investments.reduce((acc, inv) => acc + inv.currentValue, 0)
  
  // Calculate investment type distribution
  const investmentTypeData = investments.reduce((acc, inv) => {
    const existing = acc.find(item => item.name === inv.investmentType)
    if (existing) {
      existing.value += inv.currentValue
    } else if (inv.investmentType) {
      acc.push({ name: inv.investmentType, value: inv.currentValue })
    }
    return acc
  }, [])

  // Format days in a readable way
  const formatDays = (days) => {
    if (!days && days !== 0) return "N/A"
    
    // Handle negative days (possibly for future investments or errors)
    const absDays = Math.abs(days)
    const prefix = days < 0 ? "-" : ""
    
    if (absDays < 30) return `${prefix}${absDays} day${absDays !== 1 ? 's' : ''}`
    const months = Math.floor(absDays / 30)
    if (months < 12) return `${prefix}${months} month${months > 1 ? 's' : ''}`
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return `${prefix}${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
  }

  // Format asset name with its type (e.g., "AAPL (Stock)")
  const formatAssetName = (asset, type) => {
    return `${asset} (${type})`
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Investment Tracking</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#0a1628] p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Portfolio</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr>
                  <th className="pb-2">Asset</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Purchase Price</th>
                  <th className="pb-2">Current Value</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-t border-gray-700">
                    <td className="py-2">{formatAssetName(inv.asset, inv.investmentType)}</td>
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
                  <td colSpan="3" className="py-2 text-right">Total Value</td>
                  <td className="py-2">${totalValue.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {investmentTypeData.length > 0 && (
          <div className="bg-[#0a1628] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Portfolio Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={investmentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {investmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Analysis Result Section - Placed before the form for better UX flow */}
      {analysisResult && (
        <div 
          ref={analysisRef} 
          className="bg-[#132340] p-6 rounded-lg shadow-lg text-white mb-10"
        >
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-xl font-bold text-green-400">Investment Analysis</h4>
            <button 
              onClick={() => setAnalysisResult(null)} 
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h5 className="text-lg font-semibold text-blue-400 mb-2">Summary</h5>
                <div className="bg-[#0a1628] p-4 rounded">
                  <p><strong>Investment:</strong> {formatAssetName(analysisResult.asset, analysisResult.investmentType)}</p>
                  <p>
                    <strong>Quality:</strong>{" "}
                    <span
                      className={`ml-2 font-semibold ${
                        analysisResult.investment_quality === "Good" || analysisResult.actualROI > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {analysisResult.investment_quality || (analysisResult.actualROI > 0 ? "Good" : "Poor")}
                    </span>
                  </p>
                  <p><strong>Current ROI:</strong> <span className="text-green-400">{analysisResult.actualROI}%</span></p>
                  <p><strong>Holding Period:</strong> {formatDays(analysisResult.holdingDays)}</p>
                  <p><strong>Recommendation:</strong> <span className="text-yellow-400">{analysisResult.recommendation}</span></p>
                  <p className="mt-2">{analysisResult.summary_message}</p>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-semibold text-blue-400 mb-2">Performance Metrics</h5>
                <div className="bg-[#0a1628] p-4 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <span>Actual ROI:</span>
                    <span className="text-green-400 font-bold">{analysisResult.actualROI}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, analysisResult.actualROI)}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span>Predicted ROI:</span>
                    <span className="text-blue-400 font-bold">{analysisResult.predictedROI}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, analysisResult.predictedROI)}%` }}></div>
                  </div>
                  
                  <div className="mt-4">
                    <p><strong>Optimal Holding Period:</strong> {formatDays(analysisResult.recommendedHoldingDays)}</p>
                    <p>
                      <strong>Market Outperformance:</strong>{" "}
                      <span className={analysisResult.predictedOutperformance ? "text-green-400" : "text-red-400"}>
                        {analysisResult.predictedOutperformance ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-blue-400 mb-2">ROI Comparison</h5>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { name: "Actual", value: analysisResult.actualROI },
                      { name: "Predicted", value: analysisResult.predictedROI }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="value" name="ROI %" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h5 className="text-lg font-semibold text-blue-400 mb-2">Alternative Investments</h5>
                <div className="bg-[#0a1628] p-4 rounded">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[
                        { name: "Current", value: analysisResult.predictedROI, type: analysisResult.investmentType },
                        ...analysisResult.alternatives.map(alt => ({
                          name: alt.type,
                          value: alt.estimated_roi,
                          type: alt.type
                        }))
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-gray-800 p-2 rounded border border-gray-700">
                              <p className="text-white">{`${payload[0].payload.type}: ${payload[0].value.toFixed(2)}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Bar dataKey="value" name="Expected ROI %" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Form Section - Now after analysis results */}
      <div className="bg-[#0a1628] p-6 rounded-lg shadow-md mt-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Add Investment</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white" onSubmit={handleSubmit}>
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
            <option value="Mutual Fund">Mutual Fund</option>
          </select>

          <select
            name="asset"
            value={form.asset}
            onChange={handleChange}
            className="p-2 rounded bg-gray-800"
            required
            disabled={!form.investmentType}
          >
            <option value="">Select Asset</option>
            {assetOptions.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
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
            className="md:col-span-2 bg-blue-600 py-2 rounded hover:bg-blue-700"
          >
            Add Investment
          </button>
        </form>
      </div>
    </section>
  )
}

export default InvestmentTracking