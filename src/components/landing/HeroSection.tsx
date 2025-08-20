import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Container from "@/components/ui/Container"

export const HeroSection = () => {
  return (
    <section className="bg-white py-20 lg:py-32">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - ImportGenius exact copy */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                See the world of trade
                <span className="block text-blue-600">
                  like never before
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                —gain the insights your business needs
              </p>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                For nearly two decades, ImportGenius has set the standard in global 
                trade data, providing businesses with the insights to stay ahead. We 
                offer access to U.S. customs import and export records at the bill of 
                lading level and access to trade data across multiple continents.
              </p>
            </div>

            {/* CTA Buttons - ImportGenius style */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg">
                  Request a demo
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-4 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-lg">
                Sign up
              </Button>
            </div>
          </div>

          {/* Right Column - Professional Data Visualization */}
          <div className="relative">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Trade Data Dashboard</h3>
                  <div className="text-sm text-green-600 font-medium">Live</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.4M+</div>
                    <div className="text-sm text-gray-600">Shipments tracked</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">180+</div>
                    <div className="text-sm text-gray-600">Countries covered</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Electronics • CN → US</span>
                    <span className="text-sm font-medium text-gray-900">$2.3B</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Textiles • IN → EU</span>
                    <span className="text-sm font-medium text-gray-900">$1.8B</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Machinery • DE → US</span>
                    <span className="text-sm font-medium text-gray-900">$1.2B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}