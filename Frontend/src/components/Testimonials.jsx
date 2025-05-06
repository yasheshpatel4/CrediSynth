import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content:
      "CrediSynth has completely changed how I monitor my credit. I've improved my score by 85 points in just 3 months by following their recommendations.",
    name: "Sarah Johnson",
    title: "Small Business Owner",
    rating: 5,
  },
  {
    id: 2,
    content:
      "As a bank, we've been able to make better lending decisions and reduce our default rate by 23% since implementing CrediSynth's risk assessment tools.",
    name: "Michael Chen",
    title: "VP of Risk, First National Bank",
    rating: 5,
  },
  {
    id: 3,
    content:
      "The multi-bureau aggregation feature is a game-changer. I can now see all my credit scores in one place instead of checking multiple websites.",
    name: "Jessica Williams",
    title: "Financial Advisor",
    rating: 4,
  },
]

const Testimonials = () => {
  return (
    <div id="testimonials" className="bg-[#0a1628] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-500 sm:text-4xl">Testimonials</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Join thousands of satisfied users who have improved their financial health with CrediSynth
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#0f1f35] rounded-lg p-8 border border-gray-800 hover:border-blue-500 transition-colors duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-600" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-[#0f1f35] rounded-lg border border-gray-800">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ring-2 ring-[#0f1f35]"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Join 200,000+ users</p>
              <p className="text-gray-400 text-sm">Start your credit journey today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
