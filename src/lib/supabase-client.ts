import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for blog content
export const blogHelpers = {
  // Get published posts with pagination
  async getPublishedPosts(page = 1, limit = 12, categorySlug?: string) {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:users(full_name, avatar_url),
        category:blog_categories(name, slug),
        tags:blog_post_tags(tag:blog_tags(name, slug))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (categorySlug) {
      query = query.eq('category.slug', categorySlug);
    }

    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1);

    return { data, error, count };
  },

  // Get single post by slug
  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:users(full_name, avatar_url, bio),
        category:blog_categories(name, slug),
        tags:blog_post_tags(tag:blog_tags(name, slug))
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    return { data, error };
  },

  // Get related posts
  async getRelatedPosts(categoryId: string, excludeId: string, limit = 3) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id, slug, title, dek, cover_image, published_at, reading_time,
        author:users(full_name),
        category:blog_categories(name, slug)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .neq('id', excludeId)
      .order('published_at', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    return { data, error };
  },

  // Get posts by category
  async getPostsByCategory(categorySlug: string, page = 1, limit = 12) {
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:users(full_name, avatar_url),
        category:blog_categories(name, slug),
        tags:blog_post_tags(tag:blog_tags(name, slug))
      `)
      .eq('status', 'published')
      .eq('category.slug', categorySlug)
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    return { data, error, count };
  },

  // Get posts by tag
  async getPostsByTag(tagSlug: string, page = 1, limit = 12) {
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:users(full_name, avatar_url),
        category:blog_categories(name, slug),
        tags:blog_post_tags(tag:blog_tags(name, slug))
      `)
      .eq('status', 'published')
      .eq('tags.tag.slug', tagSlug)
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    return { data, error, count };
  },

  // Generate reading time estimate
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  },

  // Sanitize HTML content (basic)
  sanitizeHtml(html: string): string {
    // This is a basic implementation - in production, use DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }
};