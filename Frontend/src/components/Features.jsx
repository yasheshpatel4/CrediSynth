import { BarChart3, MessageSquare, Shield, Globe, Bell, Zap, AlertCircle, TrendingUp } from "lucide-react"

const features = [
  {
    name: "Multi-Bureau Aggregation",
    description: "Combine scores from CIBIL, Experian, Equifax, CRIF and more for a complete picture",
    icon: BarChart3,
    iconColor: "text-blue-400",
  },
  {
    name: "AI-Powered Chatbot",
    description: "Get instant answers to credit questions and personalized advice",
    icon: MessageSquare,
    iconColor: "text-blue-400",
  },
  {
    name: "Real-Time Risk Assessment",
    description: "Advanced algorithms to detect fraud and assess lending risk",
    icon: Shield,
    iconColor: "text-blue-400",
  },
  {
    name: "Multi-Language Support",
    description: "Access credit insights in your preferred language",
    icon: Globe,
    iconColor: "text-blue-400",
  },
  {
    name: "Credit Alert System",
    description: "Get notified of important changes to your credit report in real-time",
    icon: Bell,
    iconColor: "text-blue-400",
  },
  {
    name: "Score Optimizer",
    description: "AI algorithms suggest the fastest path to improving your score",
    icon: Zap,
    iconColor: "text-blue-400",
  },
  {
    name: "Dispute Management",
    description: "Easily identify and resolve credit report errors across all bureaus",
    icon: AlertCircle,
    iconColor: "text-blue-400",
  },
  {
    name: "Score Prediction",
    description: "Forecast how financial decisions will impact your future credit score",
    icon: TrendingUp,
    iconColor: "text-blue-400",
  },
]

const Features = () => {
  return (
    <div id="features" className="bg-[#050e1d] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-500 sm:text-4xl">Key Features</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Powerful tools for both individuals and financial institutions
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="bg-[#0a1628] rounded-lg p-6">
                <div className="flex justify-center">
                  <div className={`p-3 rounded-full bg-[#0f1f35] ${feature.iconColor} mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white text-center">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-400 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
