const Logo = () => {
    return (
        <div className="flex items-center">
            <div className="h-8 w-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-md transform rotate-45"></div>
                <div className="absolute inset-1 bg-[#050e1d] rounded-sm transform rotate-45"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-sm transform rotate-45"></div>
            </div>
            <span className="ml-2 text-xl font-bold text-blue-500">CrediSynth</span>
        </div>
    )
}

export default Logo
