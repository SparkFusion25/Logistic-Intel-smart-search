import { Link } from "react-router-dom";

export default function BlogPreview() {
  // Sample blog posts - these would come from Supabase in real implementation
  const posts = [
    {
      slug: "trade-lane-analysis-2024",
      title: "Trade Lane Analysis: What 2024 Data Reveals",
      excerpt: "Deep dive into global shipping patterns and emerging trade routes shaping the logistics industry.",
      author: "Logistic Intel Team",
      date: "2024-01-15",
      readTime: "5 min read"
    },
    {
      slug: "customs-data-accuracy",
      title: "The Importance of Customs Data Accuracy",
      excerpt: "Why precise trade data matters for logistics professionals and how to leverage it effectively.",
      author: "Sarah Chen",
      date: "2024-01-10", 
      readTime: "3 min read"
    },
    {
      slug: "supply-chain-resilience",
      title: "Building Supply Chain Resilience in 2024",
      excerpt: "Strategies for adapting to global trade disruptions and building robust supply chains.",
      author: "Marcus Rodriguez",
      date: "2024-01-05",
      readTime: "7 min read"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#0B1E39] mb-4">
          Latest Insights
        </h2>
        <p className="text-lg text-slate-600">
          Expert analysis and industry trends from our logistics intelligence team
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
            <article className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 group-hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <div className="flex items-center text-xs text-slate-500 mb-2">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#0B1E39] mb-2 group-hover:text-[#0F4C81] transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">By {post.author}</span>
                <span className="text-[#0F4C81] font-medium group-hover:underline">
                  Read more →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      <div className="text-center">
        <Link 
          to="/blog" 
          className="inline-flex items-center rounded-xl px-6 py-3 font-semibold border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition"
        >
          View All Articles
        </Link>
      </div>
    </section>
  );
}