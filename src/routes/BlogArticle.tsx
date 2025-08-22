import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SeoHelmet from "@/components/seo/SeoHelmet";
import { supabase } from "@/lib/supabase-client";

export default function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching post:", error);
        } else {
          setPost(data);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-[#F7F8FA]">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <p className="text-center text-slate-600">Loading article...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="bg-[#F7F8FA]">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#0B1E39] mb-4">Article Not Found</h1>
          <p className="text-slate-600">The article you're looking for doesn't exist or has been removed.</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <SeoHelmet
        title={`${post.title} - Logistic Intel Blog`}
        description={post.dek || `Read ${post.title} on the Logistic Intel blog`}
        canonical={`https://logisticintel.com/blog/${post.slug}`}
      />
      
      <main className="bg-[#F7F8FA]">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-2xl shadow p-8 lg:p-12">
            <header className="mb-8">
              <div className="text-sm text-slate-500 mb-4">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#0B1E39] mb-4">
                {post.title}
              </h1>
              {post.dek && (
                <p className="text-xl text-slate-700 leading-relaxed">
                  {post.dek}
                </p>
              )}
            </header>

            <div className="prose prose-slate max-w-none">
              {/* Prefer prerendered HTML if present */}
              {post.content_html ? (
                <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
              ) : (
                <div className="whitespace-pre-wrap">
                  {post.content_mdx || "Content not available."}
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}