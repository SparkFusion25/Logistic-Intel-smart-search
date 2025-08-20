import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function Footer() {
  const navigation = {
    product: [
      { name: 'Search Platform', href: '/search' },
      { name: 'Trade Analytics', href: '/analytics' },
      { name: 'Contact Database', href: '/contacts' },
      { name: 'API Access', href: '/api' },
      { name: 'Custom Reports', href: '/reports' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Leadership Team', href: '/team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Trade Reports', href: '/reports' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Help Center', href: '/help' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Data Processing', href: '/data-processing' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const blogPosts = [
    {
      title: 'Global Trade Trends: What to Expect in 2024',
      excerpt: 'Analysis of emerging trade patterns and their impact on supply chains worldwide.',
      date: '2024-01-15',
      author: 'Sarah Chen',
      category: 'Market Analysis',
      href: '/blog/global-trade-trends-2024'
    },
    {
      title: 'How AI is Transforming Supply Chain Intelligence',
      excerpt: 'Exploring the role of artificial intelligence in modern trade data analysis.',
      date: '2024-01-10',
      author: 'Michael Torres',
      category: 'Technology',
      href: '/blog/ai-supply-chain-intelligence'
    },
    {
      title: 'Trade War Impact: Winners and Losers in Global Commerce',
      excerpt: 'Comprehensive analysis of how recent trade policies are reshaping international business.',
      date: '2024-01-08',
      author: 'Jennifer Liu',
      category: 'Policy Analysis',
      href: '/blog/trade-war-impact-analysis'
    }
  ];

  const industryNews = [
    {
      title: 'Ocean freight rates surge 15% amid Red Sea tensions',
      source: 'Maritime Executive',
      time: '2 hours ago',
      badge: 'Breaking'
    },
    {
      title: 'New US-EU trade agreement affects electronics imports',
      source: 'Trade Weekly',
      time: '4 hours ago',
      badge: 'Policy'
    },
    {
      title: 'China manufacturing PMI shows continued growth',
      source: 'Global Trade Review',
      time: '6 hours ago',
      badge: 'Markets'
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Industry News Section */}
      <div className="border-b border-gray-800">
        <Container>
          <div className="py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Industry News</h3>
              <Link 
                to="/news" 
                className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium"
              >
                View all news
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {industryNews.map((news, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-600 text-white text-xs font-medium shrink-0">
                      {news.badge}
                    </Badge>
                    <div className="min-w-0">
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Blog Section */}
      <div className="border-b border-gray-800">
        <Container>
          <div className="py-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-white">Latest from Our Blog</h3>
              <Link 
                to="/blog" 
                className="text-blue-400 hover:text-blue-300 flex items-center font-medium"
              >
                View all posts
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article key={index} className="group">
                  <Link to={post.href} className="block">
                    <div className="bg-gray-800 rounded-lg p-6 h-full hover:bg-gray-750 transition-colors">
                      <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 mb-4">
                        {post.category}
                      </Badge>
                      <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <Container>
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LI</span>
                </div>
                <span className="text-xl font-semibold text-white">Logistic Intel</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                The world's leading platform for global trade intelligence and supply chain insights.
              </p>
              <div className="text-sm text-gray-400">
                <p>📍 New York, NY</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>✉️ info@logisticintel.com</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Logistic Intel. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>🌍 Global trade data coverage</span>
                <span>🔒 Enterprise security</span>
                <span>⚡ Real-time updates</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}