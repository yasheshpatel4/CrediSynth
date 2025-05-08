"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Bar, Doughnut, Radar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

const MoneyInsights = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  const userid = localStorage.getItem("email");

  const fetchData = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/insights/${userid}`)
      const { diversification_score_percent, features_used, predicted_insight, roi_percent, savings_progress_percent, suggestions } = response.data

      setData({
        diversification_score_percent,
        features_used,
        predicted_insight,
        roi_percent,
        savings_progress_percent,
        suggestions,
      })

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const savingsData = {
    labels: ["Savings Progress"],
    datasets: [{
      label: "Savings Progress",
      data: [data.savings_progress_percent || 0],
      backgroundColor: "#34d399",
      borderRadius: 8,
    }]
  }

  const roiData = {
    labels: ["ROI"],
    datasets: [{
      label: "Return on Investment (%)",
      data: [data.roi_percent || 0],
      backgroundColor: "#60a5fa",
      borderRadius: 8,
    }]
  }

  const diversificationData = {
    labels: ["Score", "Remaining"],
    datasets: [{
      label: "Diversification Score",
      data: [data.diversification_score_percent || 0, 100 - (data.diversification_score_percent || 0)],
      backgroundColor: ["#10b981", "#1e293b"],
      borderWidth: 0,
    }]
  }

  const investSaveCompare = {
    labels: ["Saved Amount", "Savings Target"],
    datasets: [{
      label: "Investment vs Target",
      data: [
        data.features_used?.savedAmount || 0,
        data.features_used?.savingsTarget || 0,
      ],
      backgroundColor: ["#3b82f6", "#f59e0b"],
      borderRadius: 6,
    }]
  }

  const riskData = {
    labels: ["Low", "Medium", "High"],
    datasets: [{
      label: "Risk Tolerance Level",
      data: [
        data.features_used?.riskTolerance === "low" ? 1 : 0,
        data.features_used?.riskTolerance === "medium" ? 1 : 0,
        data.features_used?.riskTolerance === "high" ? 1 : 0,
      ],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#f3f4f6",
        borderColor: "#4b5563",
        borderWidth: 1,
      },
      legend: {
        labels: {
          color: "white",
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
        beginAtZero: true,
        max: 100,
      },
    },
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-white">Loading Data...</h2>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-white">Real-Time Money Insights</h2>

      {/* Diversification Score (Doughnut) */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Diversification Score</h3>
        <div className="w-full h-[250px]">
          <Doughnut data={diversificationData} options={chartOptions} />
        </div>
        <p className="text-gray-300 mt-4 text-center">
          {data.diversification_score_percent}% - {data.diversification_score_percent >= 70 ? "Good" : "Needs Improvement"}
        </p>
      </div>

      {/* Features Used */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Features Used</h3>
        <ul className="text-gray-300 space-y-2">
          <li>Investment Type: {data.features_used?.investmentType}</li>
          <li>Risk Tolerance: {data.features_used?.riskTolerance}</li>
          <li>Monthly Income: ${data.features_used?.monthlyIncome.toFixed(2)}</li>
          <li>Average Purchase Price: ${data.features_used?.purchasePriceAvg.toFixed(2)}</li>
          <li>Saved Amount: ${data.features_used?.savedAmount.toFixed(2)}</li>
          <li>Savings Target: ${data.features_used?.savingsTarget.toFixed(2)}</li>
        </ul>
      </div>

      {/* ROI Chart */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">ROI (Return on Investment)</h3>
        <div className="w-full h-[250px]">
          <Bar data={roiData} options={chartOptions} />
        </div>
      </div>

      {/* Savings Progress */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Savings Progress</h3>
        <div className="w-full h-[250px]">
          <Bar data={savingsData} options={chartOptions} />
        </div>
      </div>

      {/* Investment vs Savings Target */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Investment vs Savings Target</h3>
        <div className="w-full h-[250px]">
          <Bar data={investSaveCompare} options={chartOptions} />
        </div>
      </div>

      {/* Risk Tolerance */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Risk Tolerance</h3>
        <div className="w-full h-[250px]">
          <Bar data={riskData} options={chartOptions} />
        </div>
      </div>

      {/* Predicted Insight */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Predicted Insight</h3>
        <p className="text-gray-300">{data.predicted_insight}</p>
      </div>

      {/* Suggestions */}
      <div className="mb-8 bg-[#0a1628] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Suggestions</h3>
        <ul className="text-gray-300 space-y-2">
          {data.suggestions?.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default MoneyInsights
