import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Logo from "./Logo"

const Footer = () => {
    return (
        <footer className="bg-[#0a1628] border-t border-gray-800">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-6 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <Logo />
                        <p className="text-gray-400 text-sm">
                             Manage your finances with goal-based saving, investment tracking, and AI insights.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-blue-500">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-500">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-500">
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-blue-500">
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>
                <div className="mt-6 border-t border-gray-800 pt-4">
                    <p className="text-center text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} CrediSynth. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
