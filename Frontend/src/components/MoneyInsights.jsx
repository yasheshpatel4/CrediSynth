"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const MoneyInsights = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const userid = localStorage.getItem("email")

  const fetchData = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/insights/${userid}`)
      setData(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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

  const chartData = {
    savings: {
      labels: ["Savings Progress"],
      datasets: [{
        label: "Savings Progress",
        data: [data.savings_progress_percent || 0],
        backgroundColor: "#34d399",
        borderRadius: 8,
      }]
    },
    roi: {
      labels: ["ROI"],
      datasets: [{
        label: "ROI (%)",
        data: [data.roi_percent || 0],
        backgroundColor: "#60a5fa",
        borderRadius: 8,
      }]
    },
    diversification: {
      labels: ["Score", "Remaining"],
      datasets: [{
        data: [data.diversification_score_percent || 0, 100 - (data.diversification_score_percent || 0)],
        backgroundColor: ["#10b981", "#1e293b"],
      }]
    },
    investSaveCompare: {
      labels: ["Saved", "Target"],
      datasets: [{
        data: [data.features_used?.savedAmount || 0, data.features_used?.savingsTarget || 0],
        backgroundColor: ["#3b82f6", "#f59e0b"],
      }]
    },
    risk: {
      labels: ["Low", "Medium", "High"],
      datasets: [{
        data: [
          data.features_used?.riskTolerance === "low" ? 1 : 0,
          data.features_used?.riskTolerance === "medium" ? 1 : 0,
          data.features_used?.riskTolerance === "high" ? 1 : 0,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      }]
    }
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-white animate-pulse">Loading Insights...</h2>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">Real-Time Money Insights</h2>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Diversification */}
        <Card title="Diversification Score">
          <div className="h-[250px]">
            <Doughnut data={chartData.diversification} options={chartOptions} />
          </div>
          <p className="text-center mt-4 text-white font-medium">
            {data.diversification_score_percent}% – {data.diversification_score_percent >= 70 ? "Good" : "Needs Improvement"}
          </p>
        </Card>

        {/* ROI */}
        <Card title="ROI (Return on Investment)">
          <div className="h-[250px]">
            <Bar data={chartData.roi} options={chartOptions} />
          </div>
        </Card>

        {/* Savings Progress */}
        <Card title="Savings Progress">
          <div className="h-[250px]">
            <Bar data={chartData.savings} options={chartOptions} />
          </div>
        </Card>

        {/* Investment vs Target */}
        <Card title="Investment vs Target">
          <div className="h-[250px]">
            <Bar data={chartData.investSaveCompare} options={chartOptions} />
          </div>
        </Card>

        {/* Risk Tolerance */}
        <Card title="Risk Tolerance">
          <div className="h-[250px]">
            {chartData.risk ? (
              <Bar data={chartData.risk} options={chartOptions} />
            ) : (
              <p>Loading risk chart...</p>
            )}
          </div>
        </Card>

        {/* Features Used */}
        <Card title="Features Used">
          <ul className="text-gray-300 space-y-1 text-sm">
            <li>Investment Type: {data.features_used?.investmentType}</li>
            <li>Risk Tolerance: {data.features_used?.riskTolerance}</li>
            <li>Monthly Income: ${data.features_used?.monthlyIncome.toFixed(2)}</li>
            <li>Avg. Purchase Price: ${data.features_used?.purchasePriceAvg.toFixed(2)}</li>
            <li>Saved Amount: ${data.features_used?.savedAmount.toFixed(2)}</li>
            <li>Savings Target: ${data.features_used?.savingsTarget.toFixed(2)}</li>
          </ul>
        </Card>

        {/* Predicted Insight */}
        <Card title="Predicted Insight">
          <p className="text-gray-300">{data.predicted_insight}</p>
        </Card>

        {/* Suggestions */}
        <Card title="Suggestions">
          <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
            {data.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </Card>

      </div>
    </section>
  )
}

const Card = ({ title, children }) => (
  <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 rounded-2xl shadow-lg">
    <h3 className="text-lg font-semibold text-cyan-400 mb-4">{title}</h3>
    {children}
  </div>
)

export default MoneyInsights
