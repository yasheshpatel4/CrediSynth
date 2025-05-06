"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How does CrediSynth get my credit information?",
    answer:
      "CrediSynth securely connects to major credit bureaus like CIBIL, Experian, Equifax, and CRIF through their official APIs. We use bank-level encryption to ensure your data remains secure throughout the process.",
  },
  {
    question: "Will checking my score through CrediSynth affect my credit?",
    answer:
      "No, checking your credit score through CrediSynth is considered a 'soft inquiry' and will not impact your credit score. You can check as often as you like without any negative effects.",
  },
  {
    question: "How accurate are the credit scores provided by CrediSynth?",
    answer:
      "CrediSynth provides the same scores that lenders see from each bureau. We don't create our own scores - we show you exactly what the bureaus report, giving you complete transparency into your credit profile.",
  },
  {
    question: "How often is my credit information updated?",
    answer:
      "Your credit information is updated in real-time whenever you log in. Additionally, we send you alerts when important changes occur in your credit report, such as new accounts, inquiries, or changes to your payment history.",
  },
  {
    question: "Is CrediSynth available internationally?",
    answer:
      "Currently, CrediSynth is available in India, the United States, Canada, the United Kingdom, and Australia. We're actively working on expanding to more countries to serve our global customers better.",
  },
  {
    question: "How does CrediSynth make money if the service is free?",
    answer:
      "CrediSynth offers a free basic plan that gives you access to your credit scores and basic recommendations. We make money through our premium subscription plans that offer advanced features and through partnerships with financial institutions when you choose to apply for their products through our platform.",
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <div id="faq" className="bg-[#050e1d] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-500 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Find answers to common questions about CrediSynth
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left bg-[#0a1628] hover:bg-[#0f1f35] rounded-lg focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-blue-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-[#0f1f35] rounded-b-lg border-t border-gray-800">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <button className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-md text-base font-medium transition-colors duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQ
