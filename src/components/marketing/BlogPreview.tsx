import { Link } from "react-router-dom";

export default function BlogPreview() {
  // Placeholder blog posts - these would come from Supabase in real implementation
  const posts = [
    {
      slug: "trade-lane-analysis-2024",
      title: "Trade Lane Analysis: What 2024 Data Reveals",
      dek: "Deep dive into global shipping patterns and emerging trade routes",
      published_at: "2024-01-15"
    },
    {
      slug: "customs-data-accuracy",
      title: "The Importance of Customs Data Accuracy",
      dek: "Why precise trade data matters for logistics professionals",
      published_at: "2024-01-10"
    },
    {
      slug: "supply-chain-resilience",
      title: "Building Supply Chain Resilience in 2024",
      dek: "Strategies for adapting to global trade disruptions",
      published_at: "2024-01-05"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#0B1E39]">
          Latest Insights
        </h2>
        <p className="mt-4 text-lg text-slate-700">
          Expert analysis and industry trends from our logistics intelligence team
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="block bg-white rounded-2xl p-6 shadow hover:shadow-md transition">
            <div className="text-sm text-slate-500 mb-2">
              {new Date(post.published_at).toLocaleDateString()}
            </div>
            <h3 className="text-lg font-semibold text-[#0B1E39] mb-2">
              {post.title}
            </h3>
            <p className="text-slate-600 text-sm">
              {post.dek}
            </p>
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