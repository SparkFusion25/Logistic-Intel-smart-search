interface BlogPost {
  id: string;
  slug: string;
  title: string;
  dek: string;
  cover_image: string;
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

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300">
      <a href={`/blog/${post.slug}`} className="block">
        <div className="aspect-video overflow-hidden rounded-t-2xl">
          <img
            src={post.cover_image || '/blog/default-cover.jpg'}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </a>
      
      <div className="p-6">
        {/* Category & Reading Time */}
        <div className="flex items-center justify-between mb-3">
          {post.category && (
            <a
              href={`/blog/category/${post.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                         bg-slate-100 text-[#0F4C81] hover:bg-slate-200 transition"
            >
              {post.category.name}
            </a>
          )}
          <span className="text-xs text-slate-500">
            {post.reading_time} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#0B1E39] mb-3 line-clamp-2">
          <a href={`/blog/${post.slug}`} className="hover:text-[#0F4C81] transition">
            {post.title}
          </a>
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {post.dek}
        </p>

        {/* Author & Date */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-full flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#0B1E39] truncate">
              {post.author?.full_name || 'Logistic Intel Team'}
            </div>
            <div className="text-xs text-slate-500">
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <a
                key={tag.slug}
                href={`/blog/tag/${tag.slug}`}
                className="text-xs text-slate-500 hover:text-[#0F4C81] transition"
              >
                #{tag.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}