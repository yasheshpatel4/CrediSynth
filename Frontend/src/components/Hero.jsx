"use client"

import { ArrowRight } from "lucide-react"
import images from "../assets/images.jpeg"


const Hero = ({ openSignupModal }) => {
    return (
        <div className="relative bg-[#050e1d] overflow-hidden py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                            <span className="block text-blue-500">CrediSynth</span>
                            <span className="block">Your Financial Management Platform</span>
                            <span className="block text-blue-500">Goal-Based Saving, Investment Tracking & AI Insights</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                            Empowering you to achieve your financial goals with smart saving plans, real-time investment tracking, and AI-driven money insights.
                        </p>
                        <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                            <div className="grid gap-3 sm:grid-flow-col sm:gap-4">
                                <button onClick={openSignupModal} className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                                <button className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-500 bg-[#0a1628] hover:bg-[#0f1f35]">
                                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                        <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                            <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                                <img
                                src={images}
                                alt="Financial Dashboard"
                                className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
