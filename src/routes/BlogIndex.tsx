import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SeoHelmet from "@/components/seo/SeoHelmet";
import { supabase } from "@/lib/supabase-client";

type Post = { 
  id: string; 
  slug: string; 
  title: string; 
  dek: string | null; 
  published_at: string | null; 
};

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, slug, title, dek, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching posts:", error);
        } else {
          setPosts(data ?? []);
        }
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SeoHelmet
        title="Blog - Logistic Intel"
        description="Expert analysis and industry trends from our logistics intelligence team"
        canonical="https://logisticintel.com/blog"
      />
      
      <main className="bg-[#F7F8FA]">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#0B1E39] mb-4">
              Logistics Intelligence Blog
            </h1>
            <p className="text-xl text-slate-700">
              Expert analysis and industry trends from our team
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading articles...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block bg-white rounded-2xl p-6 shadow hover:shadow-md transition"
                >
                  <div className="text-sm text-slate-500 mb-2">
                    {new Date(post.published_at ?? "").toLocaleDateString()}
                  </div>
                  <h2 className="text-lg font-semibold text-[#0B1E39] mb-2">
                    {post.title}
                  </h2>
                  {post.dek && (
                    <p className="text-sm text-slate-600">{post.dek}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">No articles published yet.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}