import { useState, useEffect } from "react";
import axios from "axios";

const UpdateProfile = () => {
    const [form, setForm] = useState({
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        monthlyIncome: "",
        savingsTarget: "",
        investmentPreferences: "",
        riskTolerance: "",
        financialGoals: ""
    });

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    // Fetch profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/auth/profile/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setForm(prev => ({
                    ...prev,
                    ...res.data,
                    email: email, // ensure email remains consistent
                    name: localStorage.getItem("name") || res.data.name // override name if available
                }));

            } catch (error) {
                console.log(`No existing profile found or error fetching profile. ${error}`);
            }
        };

        fetchProfile();
    }, [email, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`http://localhost:8081/api/auth/profile/${email}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            alert("Profile saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Something went wrong while saving profile.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#0a1628] mt-6 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-6 text-blue-500">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
                        required
                        readOnly
                    />
                </div>

                {/* Monthly Income */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Monthly Income (₹)</label>
                    <input
                        type="number"
                        name="monthlyIncome"
                        value={form.monthlyIncome}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
                    />
                </div>

                {/* Savings Target */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Savings Target (₹)</label>
                    <input
                        type="number"
                        name="savingsTarget"
                        value={form.savingsTarget}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
                    />
                </div>

                {/* Risk Tolerance */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Risk Tolerance</label>
                    <select
                        name="riskTolerance"
                        value={form.riskTolerance}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
                    >
                        <option value="">Select</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                    </select>
                </div>

                {/* Investment Preferences */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Investment Preferences</label>
                    <input
                        type="text"
                        name="investmentPreferences"
                        value={form.investmentPreferences}
                        onChange={handleChange}
                        placeholder="e.g. Stocks, Mutual Funds"
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
                    />
                </div>

                {/* Financial Goals */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Financial Goals</label>
                    <textarea
                        name="financialGoals"
                        value={form.financialGoals}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none"
                        rows={3}
                        placeholder="e.g. Buy a house, retire early, education fund"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
