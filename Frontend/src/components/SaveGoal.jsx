import axios from "axios";
import React, { useEffect, useState } from "react";

const SaveGoal = () => {
    const [goal, setGoal] = useState({
        name: "",
        targetAmount: "",
        savedAmount: "",
        deadline: "",
    });
    const [goals, setGoals] = useState([]);
    const userId = "john.doe@example.com"; // ideally fetched from auth

    const fetchGoals = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/goals/${userId}`);
            setGoals(res.data);
            console.log(res.data)
        } catch (err) {
            console.error("Error fetching goals:", err);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleChange = (e) => {
        setGoal({ ...goal, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:8080/api/goals/${userId}`,
                goal,
                { headers: { "Content-Type": "application/json" } }
            );
            alert("Goal submitted successfully!");
            setGoal({ name: "", targetAmount: "", savedAmount: "", deadline: "" });
            fetchGoals();
        } catch (error) {
            console.error("Error submitting goal:", error);
            alert("Failed to submit goal.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/goals/delete/${id}`);
            fetchGoals();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleAnalyze = async (goalData) => {
        try {
            const res = await axios.post(`http://localhost:8080/api/goals/analyze/${goalData.id}`, goalData);
            console.log(res.data)
        } catch (error) {
            console.error("Error analyzing goal:", error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
                <h2 className="text-3xl font-semibold mb-4 text-center text-blue-600">Create a Saving Goal</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Goal Name" value={goal.name} onChange={handleChange} className="p-3 border rounded-xl" required />
                    <input type="number" name="targetAmount" placeholder="Target Amount" value={goal.targetAmount} onChange={handleChange} className="p-3 border rounded-xl" required />
                    <input type="number" name="savedAmount" placeholder="Saved Amount" value={goal.savedAmount} onChange={handleChange} className="p-3 border rounded-xl" />
                    <input type="date" name="deadline" value={goal.deadline} onChange={handleChange} className="p-3 border rounded-xl" required />
                    <button type="submit" className="col-span-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition">Add Goal</button>
                </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Goals</h2>
                <div className="space-y-4">
                    {goals.map((g) => (
                        <div key={g.id} className="border p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{g.name}</h3>
                                <p className="text-sm text-gray-600">Target: ₹{g.targetAmount}, Saved: ₹{g.savedAmount}</p>
                                <p className="text-sm text-gray-500">Deadline: {g.deadline}</p>
                            </div>
                            <div className="flex gap-3 mt-3 md:mt-0">
                                <button onClick={() => handleDelete(g.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                                <button onClick={() => handleAnalyze(g)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Analyze</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SaveGoal;
