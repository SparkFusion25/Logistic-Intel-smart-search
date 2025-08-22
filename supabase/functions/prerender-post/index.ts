// supabase/functions/prerender-post/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { post_id, slug } = await req.json();

    if (!post_id && !slug) {
      throw new Error('Either post_id or slug is required');
    }

    // Get the post data
    let query = supabaseClient
      .from('blog_posts')
      .select(`
        *,
        author:users(full_name, avatar_url, bio),
        category:blog_categories(name, slug),
        tags:blog_post_tags(tag:blog_tags(name, slug))
      `)
      .eq('status', 'published');

    if (post_id) {
      query = query.eq('id', post_id);
    } else {
      query = query.eq('slug', slug);
    }

    const { data: post, error: postError } = await query.single();

    if (postError || !post) {
      throw new Error('Post not found or not published');
    }

    // Get related posts
    const { data: relatedPosts } = await supabaseClient
      .from('blog_posts')
      .select(`
        id, slug, title, dek, cover_image, published_at, reading_time,
        author:users(full_name),
        category:blog_categories(name, slug)
      `)
      .eq('category_id', post.category_id)
      .eq('status', 'published')
      .neq('id', post.id)
      .order('published_at', { ascending: false })
      .limit(3);

    // Generate static HTML
    const siteUrl = 'https://logisticintel.com';
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const publishDate = new Date(post.published_at);
    const modifiedDate = new Date(post.updated_at || post.published_at);

    // Generate breadcrumb JSON-LD
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${siteUrl}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.category?.name || "Article",
          "item": `${siteUrl}/blog/category/${post.category?.slug}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": post.title,
          "item": postUrl
        }
      ]
    };

    // Generate Article JSON-LD
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.dek,
      "image": post.cover_image || `${siteUrl}/og/default.jpg`,
      "url": postUrl,
      "datePublished": post.published_at,
      "dateModified": post.updated_at || post.published_at,
      "author": {
        "@type": "Person",
        "name": post.author?.full_name || "Logistic Intel Team",
        "description": post.author?.bio || "Expert in logistics and supply chain intelligence"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Logistic Intel",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": postUrl
      },
      "articleSection": post.category?.name || "Logistics",
      "keywords": post.tags?.map(t => t.tag.name).join(', ') || '',
      "wordCount": post.word_count,
      "timeRequired": `PT${post.reading_time}M`
    };

    const staticHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} - Logistic Intel</title>
  <meta name="description" content="${post.dek}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${postUrl}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.dek}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${postUrl}">
  <meta property="og:image" content="${post.cover_image || `${siteUrl}/og/default.jpg`}">
  <meta property="og:site_name" content="Logistic Intel">
  <meta property="article:published_time" content="${post.published_at}">
  <meta property="article:modified_time" content="${post.updated_at || post.published_at}">
  <meta property="article:author" content="${post.author?.full_name || 'Logistic Intel Team'}">
  <meta property="article:section" content="${post.category?.name || 'Logistics'}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.dek}">
  <meta name="twitter:image" content="${post.cover_image || `${siteUrl}/og/default.jpg`}">
  
  <!-- JSON-LD -->
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  
  <!-- Preload critical assets -->
  <link rel="preload" href="${siteUrl}/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${siteUrl}/styles.css">
  
  <!-- Favicon -->
  <link rel="icon" href="${siteUrl}/favicon.ico">
  <link rel="apple-touch-icon" href="${siteUrl}/favicon/apple-touch-icon.png">
</head>
<body class="bg-[#F7F8FA]">
  <!-- Prerendered content for SEO -->
  <main class="max-w-4xl mx-auto px-4 py-8">
    <article>
      <header class="mb-8">
        <nav class="text-sm text-slate-600 mb-4">
          <a href="/" class="hover:text-[#0F4C81]">Home</a> / 
          <a href="/blog" class="hover:text-[#0F4C81]">Blog</a> / 
          <a href="/blog/category/${post.category?.slug}" class="hover:text-[#0F4C81]">${post.category?.name}</a> / 
          <span class="text-slate-900">${post.title}</span>
        </nav>
        
        ${post.cover_image ? `
        <div class="aspect-video mb-8 rounded-2xl overflow-hidden">
          <img src="${post.cover_image}" alt="${post.title}" class="w-full h-full object-cover">
        </div>` : ''}
        
        <h1 class="text-4xl font-bold text-[#0B1E39] mb-4">${post.title}</h1>
        <p class="text-xl text-slate-700 mb-6">${post.dek}</p>
        
        <div class="flex items-center justify-between border-t border-b border-slate-200 py-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] rounded-full"></div>
            <div>
              <div class="font-semibold text-[#0B1E39]">${post.author?.full_name || 'Logistic Intel Team'}</div>
              <div class="text-sm text-slate-600">${publishDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
          <div class="text-sm text-slate-600">${post.reading_time} min read</div>
        </div>
      </header>
      
      <div class="prose prose-lg max-w-none">
        ${post.content_html || '<!-- Content will be rendered by client -->'}
      </div>
      
      ${post.tags && post.tags.length > 0 ? `
      <footer class="mt-8 pt-8 border-t border-slate-200">
        <div class="flex flex-wrap gap-2">
          ${post.tags.map(t => `<a href="/blog/tag/${t.tag.slug}" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">#${t.tag.name}</a>`).join('')}
        </div>
      </footer>` : ''}
    </article>
    
    ${relatedPosts && relatedPosts.length > 0 ? `
    <section class="mt-16">
      <h2 class="text-2xl font-bold text-[#0B1E39] mb-8">Related Articles</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${relatedPosts.map(related => `
        <article class="bg-white rounded-xl p-6 shadow">
          <h3 class="font-semibold text-[#0B1E39] mb-2">
            <a href="/blog/${related.slug}" class="hover:text-[#0F4C81]">${related.title}</a>
          </h3>
          <p class="text-slate-600 text-sm mb-3">${related.dek}</p>
          <div class="text-xs text-slate-500">${related.reading_time} min read</div>
        </article>`).join('')}
      </div>
    </section>` : ''}
  </main>
  
  <!-- Load React app for interactivity -->
  <div id="root"></div>
  <script type="module" src="${siteUrl}/src/main.tsx"></script>
</body>
</html>`;

    // Upload to Supabase Storage
    const fileName = `blog/${post.slug}.html`;
    const { error: uploadError } = await supabaseClient.storage
      .from('static-html')
      .upload(fileName, staticHtml, {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Update post with prerender status
    await supabaseClient
      .from('blog_posts')
      .update({ 
        meta: { 
          ...post.meta, 
          prerendered: true, 
          prerender_path: fileName,
          prerender_date: new Date().toISOString()
        }
      })
      .eq('id', post.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Post prerendered successfully',
        static_url: `${siteUrl}/static/${fileName}`,
        file_path: fileName
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Prerender error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to prerender post'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});