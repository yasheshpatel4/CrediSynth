import { Shield, Lock, Eye, Server } from "lucide-react"

const securityFeatures = [
  {
    name: "256-bit Encryption",
    description: "All your data is encrypted with bank-level security standards",
    icon: Lock,
  },
  {
    name: "Privacy First",
    description: "We never sell your data to third parties",
    icon: Eye,
  },
  {
    name: "Secure Infrastructure",
    description: "Our systems are hosted in SOC 2 compliant data centers",
    icon: Server,
  },
  {
    name: "Regular Audits",
    description: "Independent security experts regularly test our systems",
    icon: Shield,
  },
]

const Security = () => {
  return (
    <div id="security" className="bg-[#050e1d] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-500 sm:text-4xl">Security</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Your data security and privacy are our top priorities
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {securityFeatures.map((feature) => (
              <div key={feature.name} className="bg-[#0a1628] rounded-lg p-6">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-[#0f1f35] text-blue-400 mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white text-center">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-400 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-[#0a1628] rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">SOC 2 Compliant</h3>
              <p className="mt-4 text-gray-400">
                CrediSynth has successfully completed the SOC 2 Type II audit, demonstrating our commitment to security,
                availability, processing integrity, confidentiality, and privacy.
              </p>
              <button className="mt-6 bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                View Security Whitepaper
              </button>
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-[#0f1f35] rounded-full flex items-center justify-center">
                <Shield className="h-24 w-24 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Security
