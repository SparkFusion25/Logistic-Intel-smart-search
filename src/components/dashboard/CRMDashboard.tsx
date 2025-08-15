import { useState } from 'react'
import { 
  Users, Plus, Search, Filter, MoreVertical, Mail, Phone, 
  Building2, MapPin, Calendar, Star, Tag, Eye, Edit3,
  UserPlus, Download, RefreshCw, ArrowUpRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('contacts')
  const [viewMode, setViewMode] = useState('grid')
  const { toast } = useToast()

  const stats = [
    { name: 'Total Contacts', value: '1,247', change: '+12.5%', icon: Users, color: 'from-blue-400 to-blue-500' },
    { name: 'Active Deals', value: '89', change: '+8.2%', icon: Star, color: 'from-emerald-400 to-emerald-500' },
    { name: 'This Month Revenue', value: '$2.4M', change: '+15.7%', icon: ArrowUpRight, color: 'from-purple-400 to-purple-500' },
    { name: 'Conversion Rate', value: '23.8%', change: '+3.1%', icon: Tag, color: 'from-orange-400 to-orange-500' },
  ]

  const contacts = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'VP of Procurement',
      company: 'Global Logistics Corp',
      email: 'sarah.chen@globallogistics.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      industry: 'Logistics',
      dealValue: '$450K',
      stage: 'Qualified',
      lastContact: '2 days ago',
      tags: ['Hot Lead', 'Enterprise'],
      avatar: 'SC',
      status: 'active'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Supply Chain Director',
      company: 'TechFlow Solutions',
      email: 'marcus.r@techflow.com',
      phone: '+1 (555) 987-6543',
      location: 'San Francisco, CA',
      industry: 'Technology',
      dealValue: '$280K',
      stage: 'Proposal',
      lastContact: '1 week ago',
      tags: ['Mid-Market', 'Tech'],
      avatar: 'MR',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emily Watson',
      title: 'Head of Operations',
      company: 'European Imports Ltd',
      email: 'e.watson@europeanports.com',
      phone: '+44 20 7123 4567',
      location: 'London, UK',
      industry: 'Import/Export',
      dealValue: '$675K',
      stage: 'Negotiation',
      lastContact: '3 days ago',
      tags: ['Enterprise', 'International'],
      avatar: 'EW',
      status: 'active'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Logistics Manager',
      company: 'Asia Pacific Trading',
      email: 'david.kim@aptrading.com',
      phone: '+82 2 1234 5678',
      location: 'Seoul, South Korea',
      industry: 'Trading',
      dealValue: '$190K',
      stage: 'Discovery',
      lastContact: '5 days ago',
      tags: ['APAC', 'Small Business'],
      avatar: 'DK',
      status: 'pending'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Chief Procurement Officer',
      company: 'Manufacturing Plus',
      email: 'lisa.t@mfgplus.com',
      phone: '+1 (555) 456-7890',
      location: 'Chicago, IL',
      industry: 'Manufacturing',
      dealValue: '$820K',
      stage: 'Closed Won',
      lastContact: '1 month ago',
      tags: ['Enterprise', 'Customer'],
      avatar: 'LT',
      status: 'closed'
    },
  ]

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Discovery': return 'bg-blue-100 text-blue-800'
      case 'Qualified': return 'bg-emerald-100 text-emerald-800'
      case 'Proposal': return 'bg-yellow-100 text-yellow-800'
      case 'Negotiation': return 'bg-orange-100 text-orange-800'
      case 'Closed Won': return 'bg-green-100 text-green-800'
      case 'Closed Lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Action handlers
  const handleAddContact = () => {
    toast({
      title: "Add Contact",
      description: "Contact form would open here",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your CRM data is being exported...",
    })
  }

  const handleSendEmail = (contact: any) => {
    toast({
      title: "Email Composer",
      description: `Opening email to ${contact.name}`,
    })
  }

  const handleCall = (contact: any) => {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`)
    } else {
      toast({
        title: "Phone Not Available",
        description: "No phone number on file for this contact",
        variant: "destructive"
      })
    }
  }

  const handleViewContact = (contact: any) => {
    toast({
      title: "Contact Details",
      description: `Viewing details for ${contact.name}`,
    })
  }

  const handleEditContact = (contact: any) => {
    toast({
      title: "Edit Contact",
      description: `Editing ${contact.name}`,
    })
  }

  const handleStarContact = (contact: any) => {
    toast({
      title: "Contact Starred",
      description: `${contact.name} has been added to favorites`,
    })
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    toast({
      title: `${tabId} View`,
      description: `Switched to ${tabId} view`
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage contacts, deals, and relationships</p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button 
              onClick={handleExport}
              className="flex items-center px-4 py-2 text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button 
              onClick={handleAddContact}
              className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-emerald-600 mt-1">{stat.change} vs last month</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'contacts', label: 'Contacts', count: 1247 },
              { id: 'deals', label: 'Deals', count: 89 },
              { id: 'companies', label: 'Companies', count: 456 },
              { id: 'activities', label: 'Activities', count: 2341 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  onChange={(e) => console.log('Search:', e.target.value)}
                />
              </div>
              <button 
                onClick={() => toast({ title: "Filters", description: "Filter panel would open here" })}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                onChange={(e) => console.log('Sort:', e.target.value)}
              >
                <option>Sort by: Last Contact</option>
                <option>Sort by: Name</option>
                <option>Sort by: Company</option>
                <option>Sort by: Deal Value</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-sky-50 text-sky-600' : 'text-gray-400'}`}
                >
                  <Users className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-sky-50 text-sky-600' : 'text-gray-400'}`}
                >
                  <Building2 className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={() => toast({ title: "Refreshed", description: "Contact data has been refreshed" })}
                className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'contacts' ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contacts.map((contact) => (
                <div key={contact.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {contact.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                          {contact.name}
                        </h3>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toast({ title: "Menu", description: "Contact menu options" })}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      {contact.company}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {contact.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Last contact: {contact.lastContact}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(contact.stage)}`}>
                      {contact.stage}
                    </span>
                    <span className="font-bold text-gray-900">{contact.dealValue}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {contact.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-gray-600 rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleSendEmail(contact)}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleCall(contact)}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Call Contact"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleViewContact(contact)}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleStarContact(contact)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Add to Favorites"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleEditContact(contact)}
                      className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      title="Edit Contact"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {contact.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-600">{contact.title} at {contact.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{contact.dealValue}</p>
                      <p className="text-xs text-gray-500">Deal Value</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(contact.stage)}`}>
                      {contact.stage}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleSendEmail(contact)}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleCall(contact)}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Call Contact"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditContact(contact)}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Edit Contact"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              )}
            </>
          ) : activeTab === 'deals' ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Active Deals</h3>
              <div className="grid gap-4">
                {contacts.filter(c => c.stage !== 'Closed Won').map((deal) => (
                  <div key={deal.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{deal.company}</h4>
                        <p className="text-sm text-gray-600">{deal.name} - {deal.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{deal.dealValue}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                          {deal.stage}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last contact: {deal.lastContact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'companies' ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Companies</h3>
              <div className="grid gap-4">
                {[...new Set(contacts.map(c => c.company))].map((company, index) => {
                  const companyContacts = contacts.filter(c => c.company === company)
                  const totalValue = companyContacts.reduce((sum, c) => sum + parseInt(c.dealValue.replace(/[$K]/g, '')), 0)
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{company}</h4>
                          <p className="text-sm text-gray-600">{companyContacts.length} contact{companyContacts.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">${totalValue}K</p>
                          <p className="text-sm text-gray-600">Total value</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{companyContacts[0]?.industry}</span>
                        <MapPin className="w-4 h-4 text-gray-400 ml-4" />
                        <span className="text-sm text-gray-600">{companyContacts[0]?.location}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Recent Activities</h3>
              <div className="space-y-4">
                {[
                  { type: 'email', contact: 'Sarah Chen', action: 'Sent proposal email', time: '2 hours ago', icon: Mail },
                  { type: 'call', contact: 'Marcus Rodriguez', action: 'Had discovery call', time: '1 day ago', icon: Phone },
                  { type: 'meeting', contact: 'Emily Watson', action: 'Scheduled demo meeting', time: '2 days ago', icon: Calendar },
                  { type: 'email', contact: 'David Kim', action: 'Follow-up email sent', time: '3 days ago', icon: Mail },
                  { type: 'note', contact: 'Lisa Thompson', action: 'Added contact notes', time: '1 week ago', icon: Edit3 },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.contact} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}