import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Mail, 
  TrendingUp, 
  Ship, 
  Plane, 
  ArrowRight,
  BarChart3,
  DollarSign,
  Globe,
  Calendar,
  FileText,
  Calculator
} from 'lucide-react';

// Mock data - in production this would come from API calls
const mockStats = {
  totalSearches: 1247,
  companiesSaved: 89,
  emailsSent: 156,
  activeQuotes: 23
};

const mockRecentCompanies = [
  { 
    id: 1, 
    name: "Global Logistics Corp", 
    totalShipments: 1250, 
    lastSeen: "2 days ago", 
    value: "$5.5M", 
    mode: "Ocean",
    avatar: "GL",
    color: "blue",
    country: "USA"
  },
    name: "Ocean Freight Solutions", 
    totalShipments: 890, 
    lastSeen: "5 days ago", 
    value: "$3.2M", 
    mode: "Ocean",
    avatar: "OF",
    color: "purple",
    country: "Germany"
  },
  { 
    id: 3, 
    name: "Air Cargo Express", 
    totalShipments: 445, 
    lastSeen: "1 week ago", 
    value: "$4.1M", 
    mode: "Air",
    avatar: "AC",
    color: "green",
    country: "Singapore"
  },
  { 
    id: 4, 
    name: "International Shipping Co", 
    totalShipments: 667, 
    lastSeen: "3 days ago", 
    value: "$2.8M", 
    mode: "Ocean",
    avatar: "IS",
    color: "orange",
    country: "Netherlands"
  },
  { 
    id: 5, 
    name: "Maritime Transport Ltd", 
    totalShipments: 1100, 
    lastSeen: "1 day ago", 
    value: "$6.2M", 
    mode: "Ocean",
    avatar: "MT",
    color: "pink",
    country: "UK"
  }
];

const mockRecentActivity = [
  { type: 'search', description: 'Searched for electronics importers in USA', time: '2 hours ago' },
  { type: 'company', description: 'Saved Global Logistics Corp', time: '5 hours ago' },
  { type: 'email', description: 'Sent outreach campaign to 12 prospects', time: '1 day ago' },
  { type: 'quote', description: 'Generated quote for Ocean Freight Solutions', time: '2 days ago' },
];

export function DashboardOverview() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Intelligence<span className="text-lg text-blue-600">™</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your trade operations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalSearches.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Companies Saved</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.companiesSaved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.emailsSent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.activeQuotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Companies - Full width on mobile, 2 cols on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Companies</h2>
                <Link 
                  to="/dashboard/companies" 
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {mockRecentCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm
                        ${company.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          company.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          company.color === 'green' ? 'bg-green-100 text-green-600' :
                          company.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          'bg-pink-100 text-pink-600'}`}>
                        {company.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            {company.mode === 'Ocean' ? 
                              <Ship className="w-3 h-3 mr-1" /> : 
                              <Plane className="w-3 h-3 mr-1" />
                            }
                            {company.totalShipments.toLocaleString()} shipments
                          </span>
                          <span>{company.country}</span>
                          <span>{company.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-green-600 font-semibold">{company.value}</span>
                      <Link 
                        to={`/company/${company.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Search</h3>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <Link to="/dashboard/search">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Advanced Search
                  </button>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/dashboard/email"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Mail className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium text-purple-900">Create Campaign</span>
                </Link>
                
                <Link 
                  to="/dashboard/widgets/quote"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FileText className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-900">Generate Quote</span>
                </Link>
                
                <Link 
                  to="/dashboard/widgets/tariff"
                  className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Calculator className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="font-medium text-orange-900">Calculate Tariffs</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {mockRecentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${activity.type === 'search' ? 'bg-blue-400' :
                        activity.type === 'company' ? 'bg-green-400' :
                        activity.type === 'email' ? 'bg-purple-400' :
                        'bg-orange-400'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Overview - Full width bottom section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
              <Link 
                to="/dashboard/benchmark" 
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">195+</p>
                <p className="text-sm text-blue-700">Countries</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Ship className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">50M+</p>
                <p className="text-sm text-green-700">Ocean Records</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plane className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-900">25M+</p>
                <p className="text-sm text-purple-700">Air Records</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-900">Real-time</p>
                <p className="text-sm text-orange-700">Updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
