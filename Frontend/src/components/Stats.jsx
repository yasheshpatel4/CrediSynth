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
                        <div className="text-5xl font-bold text-blue-500">90%</div>
                        <div className="mt-2 text-sm text-gray-400">Customer Satisfaction</div>
                    </div>

                    <div className="bg-[#0a1628] rounded-lg p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-[#0f1f35] text-blue-400 mb-4">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="text-5xl font-bold text-blue-500">200</div>
                        <div className="text-xl font-bold text-blue-500">K+</div>
                        <div className="mt-2 text-sm text-gray-400">Active Users</div>
                    </div>

                    <div className="bg-[#0a1628] rounded-lg p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-[#0f1f35] text-green-400 mb-4">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <div className="text-5xl font-bold text-blue-500">15</div>
                        <div className="text-xl font-bold text-blue-500">M+</div>
                        <div className="mt-2 text-sm text-gray-400">Credit Reports Generated</div>
                    </div>

                    <div className="bg-[#0a1628] rounded-lg p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-[#0f1f35] text-purple-400 mb-4">
                            <Award className="h-6 w-6" />
                        </div>
                        <div className="text-5xl font-bold text-blue-500">50</div>
                        <div className="text-xl font-bold text-blue-500">+</div>
                        <div className="mt-2 text-sm text-gray-400">Banking Partners</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Stats