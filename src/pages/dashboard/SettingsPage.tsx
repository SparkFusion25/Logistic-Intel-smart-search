import { useState } from 'react'
import { User, Bell, Shield, CreditCard, Database, Users, Globe, Save, Upload, Mail, Smartphone, Eye, EyeOff } from 'lucide-react'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { useNotifications } from "@/hooks/useNotifications"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const { 
    preferences, 
    setPreferences, 
    savePreferences, 
    toggleBrowserNotifications,
    isLoading,
    isPushSupported 
  } = useNotifications()

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'data', label: 'Data Sources', icon: Database },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account preferences and configurations</p>
              </div>

              <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                  <nav className="space-y-1 bg-white rounded-lg shadow p-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-sky-50 text-sky-700 border-l-4 border-sky-500'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg shadow">
                    
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                          <button className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="md:col-span-2 flex items-center space-x-6 mb-6">
                            <div className="relative">
                              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                JD
                              </div>
                              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50">
                                <Upload className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Profile Photo</h3>
                              <p className="text-sm text-gray-600">JPG, GIF or PNG. 1MB max.</p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                              type="text"
                              defaultValue="John"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                              type="text"
                              defaultValue="Doe"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              defaultValue="john.doe@company.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              defaultValue="+1 (555) 123-4567"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input
                              type="text"
                              defaultValue="Global Logistics Corp"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                            <input
                              type="text"
                              defaultValue="Logistics Manager"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <textarea
                              rows={4}
                              defaultValue="Experienced logistics professional with 10+ years in supply chain management and international trade."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                          <button 
                            onClick={() => savePreferences(preferences)}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>

                        <div className="space-y-6">
                          <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                  <div>
                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-600">Receive updates via email</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={preferences.email}
                                  onChange={(e) => setPreferences(prev => ({ ...prev, email: e.target.checked }))}
                                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Bell className="w-5 h-5 text-gray-400 mr-3" />
                                  <div>
                                    <p className="font-medium text-gray-900">Browser Notifications</p>
                                    <p className="text-sm text-gray-600">
                                      Show notifications in your browser
                                      {!isPushSupported && (
                                        <span className="text-amber-600 block">
                                          Not supported in this browser
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={preferences.browser}
                                  onChange={(e) => toggleBrowserNotifications(e.target.checked)}
                                  disabled={!isPushSupported}
                                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 disabled:opacity-50"
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                                  <div>
                                    <p className="font-medium text-gray-900">Mobile Push Notifications</p>
                                    <p className="text-sm text-gray-600">Receive alerts on your mobile device (coming soon)</p>
                                  </div>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={preferences.mobile}
                                  onChange={(e) => setPreferences(prev => ({ ...prev, mobile: e.target.checked }))}
                                  disabled
                                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500 opacity-50"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Preferences</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">Weekly Market Reports</p>
                                  <p className="text-sm text-gray-600">Get weekly insights and market trends</p>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={preferences.weekly}
                                  onChange={(e) => setPreferences(prev => ({ ...prev, weekly: e.target.checked }))}
                                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                />
                              </div>
                            </div>
                          </div>

                          {preferences.browser && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center">
                                <Bell className="w-5 h-5 text-green-600 mr-3" />
                                <div>
                                  <p className="font-medium text-green-900">Browser notifications enabled</p>
                                  <p className="text-sm text-green-700">
                                    You'll receive notifications about campaign updates, new shipment matches, and CRM activities.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                          <button className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>

                        <div className="space-y-6">
                          <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                  type="password"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <p className="text-sm text-amber-800">
                                Two-factor authentication is not currently enabled. Enable it for enhanced security.
                              </p>
                              <button className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                                Enable 2FA
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                        
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Pro Plan</h3>
                                <p className="text-sm text-gray-600">Billed monthly</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">$99</div>
                                <div className="text-sm text-gray-600">per month</div>
                              </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                              <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">
                                Manage Subscription
                              </button>
                              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                View Invoice History
                              </button>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-12 h-8 bg-gray-200 rounded mr-3 flex items-center justify-center">
                                  <CreditCard className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">**** **** **** 4242</p>
                                  <p className="text-sm text-gray-600">Expires 12/24</p>
                                </div>
                              </div>
                              <button className="text-sky-600 hover:text-sky-700 font-medium">
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Placeholder tabs */}
                    {(activeTab === 'data' || activeTab === 'team' || activeTab === 'preferences') && (
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                          {tabs.find(tab => tab.id === activeTab)?.label}
                        </h2>
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                          <p className="text-gray-500">This section will be implemented in the next phase.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}