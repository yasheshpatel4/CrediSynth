import { UserPlus, CreditCard, LineChart, Award } from "lucide-react"

const steps = [
  {
    id: "01",
    name: "Create an account",
    description: "Sign up for free in less than 2 minutes. No credit card required.",
    icon: UserPlus,
  },
  {
    id: "02",
    name: "Connect your accounts",
    description: "Securely link your credit bureaus and financial accounts.",
    icon: CreditCard,
  },
  {
    id: "03",
    name: "Get personalized insights",
    description: "Receive tailored recommendations and insights based on your credit profile.",
    icon: LineChart,
  },
  {
    id: "04",
    name: "Improve your score",
    description: "Take action on recommendations to improve your credit score.",
    icon: Award,
  },
]

const HowItWorks = () => {
  return (
    <div id="how-it-works" className="bg-[#0a1628] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-500 sm:text-4xl">How It Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Getting started with CrediSynth is easy and takes just a few minutes
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-6">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.name}</h3>
                  <p className="text-gray-400 text-center">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-24 h-1 bg-blue-500 transform -translate-x-12"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-md text-base font-medium transition-colors duration-300">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
