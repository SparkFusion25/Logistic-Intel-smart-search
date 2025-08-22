import { useState, useEffect } from "react";
import { SeoHelmet } from "@/components/seo/SeoHelmet";
import { JsonLd, createWebSiteSchema } from "@/components/seo/JsonLd";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/blog/Pagination";
import { blogHelpers } from "@/lib/supabase-client";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  dek: string;
  cover_image: string;
  author_id: string;
  category_id: string;
  published_at: string;
  reading_time: number;
  author?: {
    full_name: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

const POSTS_PER_PAGE = 12;

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, [currentPage, selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data: postsData, count } = await blogHelpers.getPublishedPosts(
        currentPage,
        POSTS_PER_PAGE,
        selectedCategory || undefined
      );

      setTotalPosts(count || 0);

      if (postsData) {
        // Set featured post (most recent on page 1)
        if (currentPage === 1 && postsData.length > 0) {
          setFeaturedPost(postsData[0]);
          setPosts(postsData.slice(1));
        } else {
          setPosts(postsData);
          setFeaturedPost(null);
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await blogHelpers.getCategories();
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      <SeoHelmet
        title="Blog - Logistic Intel"
        description="Stay updated with the latest insights on global trade, logistics intelligence, supply chain optimization, and freight industry trends."
        canonical="https://logisticintel.com/blog"
        keywords={["logistics blog", "freight intelligence", "supply chain insights", "trade analysis", "shipping trends"]}
      />
      <JsonLd data={createWebSiteSchema()} />

      <main className="bg-[#F7F8FA]">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B1E39] mb-6">
              Logistics Intelligence Hub
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Expert insights on global trade patterns, supply chain optimization, 
              and the latest trends shaping the logistics industry.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                !selectedCategory
                  ? 'bg-[#0F4C81] text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.slug);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition ${
                  selectedCategory === category.slug
                    ? 'bg-[#0F4C81] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && currentPage === 1 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto">
                  <img
                    src={featuredPost.cover_image || '/blog/default-cover.jpg'}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                                   bg-[#0F4C81] text-white">
                      Featured
                    </span>
                    {featuredPost.category && (
                      <span className="ml-3 text-sm text-[#0F4C81] font-medium">
                        {featuredPost.category.name}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#0B1E39] mb-4">
                    <a href={`/blog/${featuredPost.slug}`} className="hover:text-[#0F4C81] transition">
                      {featuredPost.title}
                    </a>
                  </h2>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                    {featuredPost.dek}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-full"></div>
                      <div>
                        <div className="font-medium text-[#0B1E39]">
                          {featuredPost.author?.full_name || 'Logistic Intel Team'}
                        </div>
                        <div className="text-sm text-slate-600">
                          {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      {featuredPost.reading_time} min read
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow animate-pulse">
                  <div className="aspect-video bg-slate-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-[#0B1E39] mb-2">No posts found</h3>
              <p className="text-slate-600">
                {selectedCategory 
                  ? `No posts in this category yet. Check back soon!`
                  : 'Our team is working on exciting content. Check back soon!'
                }
              </p>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Get the latest logistics intelligence insights delivered to your inbox weekly.
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-slate-900 placeholder-slate-500"
              />
              <button className="px-6 py-3 bg-white text-[#0F4C81] font-semibold rounded-xl hover:bg-slate-50 transition">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              Join 5,000+ logistics professionals. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}