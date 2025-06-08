import { useEffect, useState } from "react"
import axios from "axios"
import { Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

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
  const [analysisResult, setAnalysisResult] = useState(null)

  const userId = localStorage.getItem("email")

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/goals/${userId}`)
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
      setFormData({ name: "", targetAmount: "", savedAmount: "", deadline: "" })
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
      setAnalysisResult(res.data)
    } catch (error) {
      console.error("Error analyzing goal:", error)
    }
  }

  const chartData = analysisResult
    ? {
      labels: ["Saved Amount", "Target Amount"],
      datasets: [
        {
          label: "Goal Progress",
          data: [analysisResult.goal.savedAmount, analysisResult.goal.targetAmount],
          backgroundColor: ["rgba(34, 197, 94, 0.7)", "rgba(239, 68, 68, 0.7)"],
          borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)"],
          borderWidth: 2,
        },
      ],
    }
    : {}

  const allGoalsChartData = goals.length > 0 ? {
    labels: goals.map((goal) => goal.name),
    datasets: [
      {
        label: "Saved Amount",
        data: goals.map((goal) => goal.savedAmount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Target Amount",
        data: goals.map((goal) => goal.targetAmount),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  } : null

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {allGoalsChartData && (
        <section className="bg-[#0a1628] p-6 rounded-lg shadow-md text-white mb-6">
          <h2 className="text-xl font-semibold mb-4">Overall Goal Progress</h2>
          <Bar
            data={allGoalsChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: "white" } },
              },
              scales: {
                x: {
                  ticks: { color: "white" },
                  grid: { color: "rgba(255,255,255,0.1)" },
                },
                y: {
                  ticks: { color: "white" },
                  grid: { color: "rgba(255,255,255,0.1)" },
                },
              },
            }}
          />
        </section>
      )}

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1f2f46] p-8 rounded-2xl shadow-2xl text-white">
        <h2 className="text-3xl font-bold mb-6">Create a New Savings Goal</h2>
        {error && <div className="mb-4 p-4 bg-red-600 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["name", "targetAmount", "savedAmount", "deadline"].map((field, idx) => (
            <div key={idx}>
              <label htmlFor={field} className="block mb-1 font-medium capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={field === "deadline" ? "date" : field.includes("Amount") ? "number" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#15233c] border border-gray-700 focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition duration-300"
            >
              Add Goal
            </button>
          </div>
        </form>
      </section>

      <section className="bg-[#0a1628] p-8 rounded-2xl shadow-2xl text-white">
        <h2 className="text-3xl font-semibold mb-6">Your Goals</h2>
        <div className="space-y-6">
          {goals.map((g) => (
            <div
              key={g.id}
              className="bg-[#15233c] p-5 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-green-400">{g.name}</h3>
                <p className="text-sm text-gray-300">
                  Target: ₹{g.targetAmount} | Saved: ₹{g.savedAmount}
                </p>
                <p className="text-sm text-gray-400">Deadline: {g.deadline}</p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  className="text-red-400 hover:underline"
                  onClick={() => handleDelete(g.id)}
                >
                  Delete
                </button>
                <button
                  className="text-blue-400 hover:underline"
                  onClick={() => handleAnalyze(g)}
                >
                  Analyze
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {analysisResult && (
        <section className="bg-[#0a1628] p-8 rounded-2xl shadow-2xl text-white">
          <h3 className="text-3xl font-bold mb-6">Goal Analysis</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Info & Progress */}
            <div className="space-y-4 text-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-300">Status:</span>
                <span
                  className={`font-bold ${analysisResult.goal.goalStatus === "Achieved"
                      ? "text-green-400"
                      : analysisResult.goal.goalStatus === "On Track"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                >
                  {analysisResult.goal.goalStatus}
                </span>
              </div>

              <div>
                <p className="text-gray-300">Progress:</p>
                <Doughnut
                  data={{
                    labels: ["Saved", "Remaining"],
                    datasets: [
                      {
                        data: [
                          analysisResult.goal.progressPercent,
                          100 - analysisResult.goal.progressPercent,
                        ],
                        backgroundColor: ["#10b981", "#4b5563"],
                        borderColor: ["#10b981", "#4b5563"],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        labels: { color: "white" },
                        position: "bottom",
                      },
                    },
                    cutout: "70%",
                  }}
                />
              </div>

              <div className="bg-[#1f2f46] p-4 rounded-lg text-sm space-y-2 mt-4">
                <p>📅 <strong>Deadline:</strong> {analysisResult.goal.deadline}</p>
                <p>⏳ <strong>Time Left:</strong> {analysisResult.goal.daysLeft} days | {analysisResult.goal.weeksLeft} weeks | {analysisResult.goal.monthsLeft} months</p>
                <p>💰 <strong>Daily Savings Needed:</strong> ₹{Number(analysisResult.goal.dailySavingsNeeded).toFixed(2)}</p>
              </div>

              <div className="mt-4 italic text-green-300">
                {analysisResult.goal.recommendation}
              </div>

              <div className="text-sm mt-4 text-gray-400">
                Prediction Confidence: {(analysisResult.confidence * 100).toFixed(2)}%
              </div>
            </div>

            {/* Right: Bar Chart */}
            <div className="bg-[#15233c] p-4 rounded-lg">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: "white" },
                    },
                    title: {
                      display: true,
                      text: "Goal Comparison",
                      color: "white",
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
                    },
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

export default GoalBasedSaving