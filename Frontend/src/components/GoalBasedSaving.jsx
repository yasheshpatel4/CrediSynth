import { useEffect, useState } from "react"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const GoalBasedSaving = () => {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
  })
  const [error, setError] = useState("")
  const [goals, setGoals] = useState([])
  const [analysisResult, setAnalysisResult] = useState(null) // To store prediction result

  const userId = localStorage.getItem("email") // ideally from auth context

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/goals/${userId}`)
      setGoals(res.data)
    } catch (err) {
      console.error("Error fetching goals:", err)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, targetAmount, savedAmount, deadline } = formData

    if (!name || !targetAmount || !savedAmount || !deadline) {
      setError("Please fill in all fields")
      return
    }

    try {
      await axios.post(`http://localhost:8080/api/goals/${userId}`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      alert("Goal submitted successfully!")
      setFormData({
        name: "",
        targetAmount: "",
        savedAmount: "",
        deadline: "",
      })
      setError("")
      fetchGoals()
    } catch (error) {
      console.error("Error submitting goal:", error)
      alert("Failed to submit goal.")
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/goals/delete/${id}`)
      fetchGoals()
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const handleAnalyze = async (goalData) => {
    try {
      const res = await axios.post(`http://localhost:8080/api/goals/analyze/${goalData.id}`, goalData)
      console.log(res.data)
      setAnalysisResult(res.data) // Set analysis result here
    } catch (error) {
      console.error("Error analyzing goal:", error)
    }
  }

  // Define chart data dynamically based on the analysis result
  const chartData = analysisResult ? {
    labels: ['Saved Amount', 'Target Amount'],
    datasets: [
      {
        label: 'Goal Progress',
        data: [analysisResult.savedAmount, analysisResult.targetAmount], // Replace with appropriate data
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  } : {}

  return (
    <div className="max-w-4xl mx-auto p-6">
      <section className="bg-[#0a1628] p-6 rounded-lg shadow-md text-white">
        <h2 className="text-2xl font-bold mb-4">Goal Based Saving</h2>
        {error && <div className="mb-4 p-3 bg-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Goal
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
            <label htmlFor="deadline" className="block mb-1">
              Target Date
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
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

      <section className="bg-[#0a1628] p-6 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Goals</h2>
        <div className="space-y-4">
          {goals.map((g) => (
            <div
              key={g.id}
              className="border p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{g.name}</h3>
                <p className="text-sm text-gray-600">
                  Target: ₹{g.targetAmount}, Saved: ₹{g.savedAmount}
                </p>
                <p className="text-sm text-gray-500">Deadline: {g.deadline}</p>
              </div>
              <div className="flex gap-3 mt-3 md:mt-0">
                <button
                  onClick={() => handleDelete(g.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAnalyze(g)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Analyze
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis Result Section */}
      {analysisResult && (
        <section className="bg-[#0a1628] p-6 rounded-lg shadow-md text-white">
          <h3 className="text-2xl font-bold mb-4">Prediction Analysis</h3>
          <div className="text-lg">
            <p>{analysisResult.message}</p>
            <p>Confidence: {analysisResult.confidence}%</p>
            <p>Prediction Status: {analysisResult.prediction === 1 ? 'Likely to Achieve' : 'Unlikely to Achieve'}</p>
          </div>
          <div className="mt-6">
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
        </section>
      )}
    </div>
  )
}

export default GoalBasedSaving