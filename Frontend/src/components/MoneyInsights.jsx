import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Pie, Bar, Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
)

const MoneyInsights = () => {
  const [detailType, setDetailType] = useState("expense")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [barData, setBarData] = useState(null)
  const [lineData, setLineData] = useState(null)
  const [pieData, setPieData] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const userEmail = localStorage.getItem("email")

  const fetchAnalysisData = async () => {
    setLoading(true)
    setError("")
      try {
        const res = await axios.post(`http://localhost:8080/api/money-insights/analyze/${userEmail}`)
        const data = res.data

        // console.log("Category Wise Spending from backend:", data.categoryWiseSpending)

        // Prepare Bar Chart Data (Monthly saving and expense)
        const barLabels = data.monthlySavingExpense?.labels || []
        const savingValues = data.monthlySavingExpense?.saving || []
        const expenseValues = data.monthlySavingExpense?.expense || []
        setBarData({
          labels: barLabels,
          datasets: [
            {
              label: "Saving",
              data: savingValues,
              backgroundColor: "#36A2EB",
            },
            {
              label: "Expense",
              data: expenseValues,
              backgroundColor: "#FF6384",
            },
          ],
        })

        // Prepare Line Chart Data (Monthly saving)
        const lineLabels = data.monthlySaving?.labels || []
        const monthlySavingValues = data.monthlySaving?.data || []
        setLineData({
          labels: lineLabels,
          datasets: [
            {
              label: "Monthly Saving",
              data: monthlySavingValues,
              borderColor: "#36A2EB",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        })

        // Prepare Pie Chart Data (Category wise spending)
        const pieLabels = data.categoryWiseSpending?.labels || []
        const pieValues = data.categoryWiseSpending?.data || []
        setPieData({
          labels: pieLabels,
          datasets: [
            {
              label: "Category Wise Spending",
              data: pieValues,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              borderWidth: 1,
            },
          ],
        })

        setSubmitSuccess(true)
        setError("")
      } catch (err) {
        setError("Failed to fetch analysis data.")
        console.error(err)
      } finally {
        setLoading(false)
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitSuccess(false)

    if (!description || !amount || !date || !category) {
      setError("Please fill in all fields.")
      return
    }

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.")
      return
    }

    setLoading(true)
    try {
      // Send user input data to backend
      await axios.post(`http://localhost:8080/api/money-insights/add/${userEmail}`, {
        description,
        amount: numericAmount,
        date,
        category,
        type: detailType,
      })

      // Fetch analysis data from backend
      await fetchAnalysisData()

      // Clear form fields
      setDescription("")
      setAmount("")
      setDate("")
      setCategory("")
    } catch (err) {
      setError("Failed to submit or fetch analysis data.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userEmail) {
      fetchAnalysisData()
    }
  }, [userEmail])

  return (
    <section id="money-insights" className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="flex items-center mb-6">
        <h2 className="text-3xl font-bold mr-6">Money Insights</h2>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="detailType"
              value="expense"
              checked={detailType === "expense"}
              onChange={() => setDetailType("expense")}
              className="accent-blue-500"
            />
            <span>Expense</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="detailType"
              value="saving"
              checked={detailType === "saving"}
              onChange={() => setDetailType("saving")}
              className="accent-blue-500"
            />
            <span>Saving</span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0a1628] p-6 rounded-lg shadow-md mb-8 max-w-md space-y-4 w-full max-w-lg">
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border border-gray-600 bg-[#14253d] p-2 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block mb-1 font-semibold">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded border border-gray-600 bg-[#14253d] p-2 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block mb-1 font-semibold">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border border-gray-600 bg-[#14253d] p-2 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1 font-semibold">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded border border-gray-600 bg-[#14253d] p-2 text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {submitSuccess && <p className="text-green-500 mt-2">Data submitted and analysis updated successfully.</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {barData && (
          <div className="bg-[#0a1628] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Monthly Saving and Expense</h3>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
        )}
        {lineData && (
          <div className="bg-[#0a1628] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Monthly Saving</h3>
            <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
          </div>
        )}
        {pieData && (
          <div className="bg-[#0a1628] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Category Wise Spending</h3>
            <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
          </div>
        )}
      </div>

      {/** Recommendations Section */}
      {submitSuccess && (
        <div className="bg-[#0a1628] p-6 rounded-lg shadow-md max-w-7xl mt-8 text-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Personalized Recommendations</h3>
          {pieData && (
            <ul className="list-disc list-inside">
              {pieData.recommendations ? (
                pieData.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)
              ) : (
                <li>No recommendations available at this time.</li>
              )}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}

export default MoneyInsights
