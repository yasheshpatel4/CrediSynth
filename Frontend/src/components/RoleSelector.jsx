"use client"

import { useState } from "react"
import { BarChart3, Shield, LineChart } from "lucide-react"

const RoleSelector = () => {
  const [activeTab, setActiveTab] = useState("individuals")

  return (
    <div className="bg-[#050e1d] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-500 sm:text-4xl">Choose Your Role</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Whether you're an individual looking to improve your credit score or a bank making lending decisions,
            CrediSynth has the tools you need.
          </p>
        </div>

        <div className="mt-12">
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                className={`py-4 text-center font-medium ${
                  activeTab === "individuals"
                    ? "bg-[#0a1628] text-blue-500 border-b-2 border-blue-500"
                    : "bg-[#050e1d] text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("individuals")}
              >
                For Individuals
              </button>
              <button
                className={`py-4 text-center font-medium ${
                  activeTab === "banks"
                    ? "bg-[#0a1628] text-blue-500 border-b-2 border-blue-500"
                    : "bg-[#050e1d] text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("banks")}
              >
                For Banks
              </button>
            </div>

            <div className="p-6 bg-[#0a1628]">
              {activeTab === "individuals" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="bg-[#0f1f35] p-6 rounded-lg">
                    <div className="p-3 rounded-full bg-[#162a47] text-blue-400 inline-block mb-4">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Monitor Your Score</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Track your credit score across all major bureaus in one place
                    </p>
                  </div>
                  <div className="bg-[#0f1f35] p-6 rounded-lg">
                    <div className="p-3 rounded-full bg-[#162a47] text-blue-400 inline-block mb-4">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Improve Your Score</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Get personalized recommendations to boost your credit score
                    </p>
                  </div>
                  <div className="bg-[#0f1f35] p-6 rounded-lg">
                    <div className="p-3 rounded-full bg-[#162a47] text-blue-400 inline-block mb-4">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Protect Your Credit</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Receive alerts about important changes to your credit report
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="bg-[#0f1f35] p-6 rounded-lg">
                    <div className="p-3 rounded-full bg-[#162a47] text-blue-400 inline-block mb-4">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Risk Assessment</h3>
                    <p className="mt-2 text-sm text-gray-400">Advanced algorithms to assess lending risk accurately</p>
                  </div>
                  <div className="bg-[#0f1f35] p-6 rounded-lg">
                    <div className="p-3 rounded-full bg-[#162a47] text-blue-400 inline-block mb-4">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Fraud Detection</h3>
                    <p className="mt-2 text-sm text-gray-400">Identify potential fraud before approving loans</p>
                  </div>
                  <div className="bg-[#0f1f35] p-6 rounded-lg">
                    <div className="p-3 rounded-full bg-[#162a47] text-blue-400 inline-block mb-4">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-white">API Integration</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Seamlessly integrate with your existing banking systems
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelector
