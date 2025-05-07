import { Star, Users, BarChart3, Award } from "lucide-react"

const Stats = () => {
    return (
        <div className="bg-[#050e1d] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-[#0a1628] rounded-lg p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-[#0f1f35] text-yellow-400 mb-4">
                            <Star className="h-6 w-6" />
                        </div>
                        <div className="text-5xl font-bold text-blue-500">Goal-Based Saving</div>
                        <div className="mt-2 text-sm text-gray-400">Set and track your financial goals with ease.</div>
                    </div>

                    <div className="bg-[#0a1628] rounded-lg p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-[#0f1f35] text-blue-400 mb-4">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="text-5xl font-bold text-blue-500">Investment Tracking</div>
                        <div className="mt-2 text-sm text-gray-400">Monitor your investments and portfolio performance.</div>
                    </div>

                    <div className="bg-[#0a1628] rounded-lg p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-[#0f1f35] text-green-400 mb-4">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <div className="text-5xl font-bold text-blue-500">Real-Time Insights</div>
                        <div className="mt-2 text-sm text-gray-400">Get up-to-date financial insights and analytics.</div>
                    </div>

                    <div className="bg-[#0a1628] rounded-lg p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-[#0f1f35] text-purple-400 mb-4">
                            <Award className="h-6 w-6" />
                        </div>
                        <div className="text-5xl font-bold text-blue-500">AI Predictions</div>
                        <div className="mt-2 text-sm text-gray-400">Leverage AI to optimize your financial decisions.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats
