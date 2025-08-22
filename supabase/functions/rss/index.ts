// supabase/functions/rss/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

// @ts-ignore
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');

    // Build query based on filters
    let query = supabaseClient
      .from('blog_posts')
      .select(`
        slug, title, dek, published_at, content_html,
        author:users(full_name),
        category:blog_categories(name, slug)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    if (category) {
      query = query.eq('category.slug', category);
    }

    if (tag) {
      query = query.eq('tags.tag.slug', tag);
    }

    const { data: posts, error } = await query;

    if (error) {
      throw error;
    }

    // Generate RSS XML
    const siteUrl = 'https://logisticintel.com';
    const feedTitle = category 
      ? `Logistic Intel Blog - ${category}` 
      : tag 
      ? `Logistic Intel Blog - #${tag}`
      : 'Logistic Intel Blog';
    
    const feedDescription = category
      ? `Latest posts from ${category} category`
      : tag
      ? `Latest posts tagged with ${tag}`
      : 'Latest insights on global trade, logistics intelligence, and supply chain optimization';

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${feedTitle}</title>
    <description>${feedDescription}</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/rss${category ? `?category=${category}` : tag ? `?tag=${tag}` : ''}" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <managingEditor>blog@logisticintel.com (Logistic Intel Team)</managingEditor>
    <webMaster>tech@logisticintel.com (Logistic Intel)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Logistic Intel CMS</generator>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>${feedTitle}</title>
      <link>${siteUrl}/blog</link>
    </image>
    ${posts?.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.dek}]]></description>
      <content:encoded><![CDATA[${post.content_html || ''}]]></content:encoded>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <author>blog@logisticintel.com (${post.author?.full_name || 'Logistic Intel Team'})</author>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ''}
    </item>`).join('') || ''}
  </channel>
</rss>`;

    return new Response(rssXml, { headers: corsHeaders });

  } catch (error) {
    console.error('RSS generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate RSS feed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});