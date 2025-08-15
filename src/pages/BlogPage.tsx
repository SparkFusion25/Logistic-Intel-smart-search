import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react'

export default function BlogPage() {
  const featuredPost = {
    title: 'The Future of Global Trade Intelligence: AI and Machine Learning Trends for 2025',
    excerpt: 'Explore how artificial intelligence and machine learning are revolutionizing trade intelligence, from predictive analytics to automated compliance checking.',
    author: 'Sarah Chen',
    date: 'March 15, 2025',
    readTime: '8 min read',
    category: 'Technology',
    image: '/blog/ai-trends-2025.jpg',
    href: '/blog/future-of-trade-intelligence-ai-ml-trends-2025',
  }

  const recentPosts = [
    {
      title: 'How to Identify Emerging Market Opportunities Using Trade Data',
      excerpt: 'Learn the strategies and techniques top logistics professionals use to spot new market opportunities before competitors.',
      author: 'Marcus Rodriguez',
      date: 'March 12, 2025',
      readTime: '6 min read',
      category: 'Strategy',
      href: '/blog/identify-market-opportunities-trade-data',
    },
    {
      title: 'Understanding Ocean Freight Rate Fluctuations: A Data-Driven Analysis',
      excerpt: 'Deep dive into the factors driving ocean freight rate changes and how to predict future pricing trends.',
      author: 'David Kim',
      date: 'March 10, 2025',
      readTime: '10 min read',
      category: 'Analytics',
      href: '/blog/ocean-freight-rate-analysis',
    },
    {
      title: 'Building Competitive Intelligence in the Logistics Industry',
      excerpt: 'A comprehensive guide to gathering and analyzing competitor intelligence for strategic advantage.',
      author: 'Lisa Wang',
      date: 'March 8, 2025',
      readTime: '7 min read',
      category: 'Intelligence',
      href: '/blog/competitive-intelligence-logistics',
    },
    {
      title: 'Supply Chain Disruption Patterns: Lessons from Recent Global Events',
      excerpt: 'Analysis of major supply chain disruptions and how predictive intelligence can help mitigate future risks.',
      author: 'Sarah Chen',
      date: 'March 5, 2025',
      readTime: '9 min read',
      category: 'Risk Management',
      href: '/blog/supply-chain-disruption-patterns',
    },
    {
      title: 'API Integration Best Practices for Trade Intelligence Platforms',
      excerpt: 'Technical guide for developers on integrating trade intelligence APIs into existing business systems.',
      author: 'Marcus Rodriguez',
      date: 'March 3, 2025',
      readTime: '12 min read',
      category: 'Technical',
      href: '/blog/api-integration-best-practices',
    },
    {
      title: 'ROI Measurement in Trade Intelligence: Key Metrics That Matter',
      excerpt: 'Learn how to measure and demonstrate the return on investment from trade intelligence initiatives.',
      author: 'David Kim',
      date: 'March 1, 2025',
      readTime: '8 min read',
      category: 'Business',
      href: '/blog/roi-measurement-trade-intelligence',
    },
  ]

  const categories = [
    { name: 'All Posts', count: 47, active: true },
    { name: 'Technology', count: 12 },
    { name: 'Strategy', count: 15 },
    { name: 'Analytics', count: 8 },
    { name: 'Intelligence', count: 9 },
    { name: 'Risk Management', count: 3 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Industry
              <span className="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Expert insights, trends analysis, and strategic guidance for logistics 
              professionals navigating the global trade landscape.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/blog/subscribe"
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:from-sky-500 hover:to-blue-600 transition-all duration-300"
              >
                Subscribe to Updates
              </Link>
              <Link
                to="/resources"
                className="bg-white border-2 border-sky-500 text-sky-600 px-8 py-4 rounded-lg font-bold hover:bg-sky-50 transition-all duration-300"
              >
                View Resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                        category.active
                          ? 'bg-sky-50 text-sky-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Newsletter</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get weekly insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                  />
                  <button className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors text-sm font-semibold">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <div className="mb-12">
              <Link
                to={featuredPost.href}
                className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Tag className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                      Featured Post
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-sky-600 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{featuredPost.author}</p>
                        <p className="text-sm text-gray-500">CEO & Co-Founder</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sky-600 font-semibold group-hover:translate-x-2 transition-transform">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Posts Grid */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {recentPosts.map((post, index) => (
                  <Link
                    key={index}
                    to={post.href}
                    className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.date}
                        </div>
                        <div className="flex items-center text-sky-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="bg-sky-600 text-white px-8 py-4 rounded-lg hover:bg-sky-700 transition-colors font-semibold">
                  Load More Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}