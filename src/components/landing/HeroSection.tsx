import { Link } from "react-router-dom"

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Ocean Blue Background matching ImportGenius */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content matching ImportGenius exactly */}
          <div className="text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                The global leader in trade
                <span className="block">
                  intelligence
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                For nearly two decades, ImportGenius has set the standard in global 
                trade data, providing businesses with the insights to stay ahead. We 
                offer access to U.S. customs import and export records at the bill of 
                lading level and access to trade data across multiple continents.
              </p>
            </div>

            {/* CTA Buttons matching ImportGenius */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
                  Request a demo
                </button>
              </Link>
              <button className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors duration-200">
                Sign up
              </button>
            </div>
          </div>

          {/* Right Column - Container Ship Image matching ImportGenius */}
          <div className="relative">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
                alt="Container ship carrying cargo across the ocean"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}