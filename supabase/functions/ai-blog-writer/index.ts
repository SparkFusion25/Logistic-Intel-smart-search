// supabase/functions/ai-blog-writer/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogRequest {
  topic: string;
  persona: string;
  keywords: string[];
  outline_depth: number;
  word_count: number;
  tone: 'professional' | 'conversational' | 'technical' | 'executive';
  cta_type: 'demo' | 'trial' | 'contact' | 'newsletter';
  category_id?: string;
  tag_ids?: string[];
}

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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify JWT and get user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const blogRequest: BlogRequest = await req.json();

    // Validate required fields
    if (!blogRequest.topic || !blogRequest.persona) {
      throw new Error('Missing required fields: topic and persona');
    }

    // Generate content with OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a logistics market analyst and expert content writer for Logistic Intel's blog. 

BRAND VOICE: Clear, confident, practitioner-level insights for logistics professionals. Avoid buzzwords and focus on actionable intelligence.

TONE: ${blogRequest.tone} - adapt your writing style accordingly.

CONSTRAINTS:
- Write factual, original content only
- Include specific data points and industry examples
- Cite credible sources (prefer: industry reports, government trade data, major logistics companies)
- End with a clear CTA for ${blogRequest.cta_type}
- Target word count: ${blogRequest.word_count} words
- Primary keywords to include naturally: ${blogRequest.keywords.join(', ')}

STRUCTURE:
- Compelling headline
- Brief meta description (150-160 chars)
- Introduction that hooks the reader
- ${blogRequest.outline_depth} main sections with subheadings
- Data-driven insights throughout
- Conclusion with CTA

AUDIENCE: ${blogRequest.persona}

Remember: Logistic Intel helps logistics professionals find opportunities, optimize routes, and grow their business through trade intelligence.`;

    const userPrompt = `Write a comprehensive blog post about: ${blogRequest.topic}

Please format your response as JSON with these fields:
{
  "title": "SEO-optimized headline",
  "meta_description": "150-160 character meta description",
  "outline": ["Section 1 title", "Section 2 title", ...],
  "content_mdx": "Full MDX content with proper markdown formatting",
  "suggested_keywords": ["keyword1", "keyword2", ...],
  "citations": ["Source 1", "Source 2", "Source 3"]
}

Ensure the content is substantive, actionable, and includes at least 3 credible citations.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const generatedContent = openaiData.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated from OpenAI');
    }

    // Parse the JSON response from OpenAI
    let parsedContent;
    try {
      // Remove markdown code blocks if present
      const cleanContent = generatedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Generate slug from title
    const slug = parsedContent.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Calculate reading time
    const wordCount = parsedContent.content_mdx.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Create draft blog post
    const { data: newPost, error: insertError } = await supabaseClient
      .from('blog_posts')
      .insert({
        title: parsedContent.title,
        slug: slug,
        dek: parsedContent.meta_description,
        content_mdx: parsedContent.content_mdx,
        content_html: '', // Will be generated on publish
        status: 'draft',
        category_id: blogRequest.category_id,
        reading_time: readingTime,
        word_count: wordCount,
        meta: {
          ai_generated: true,
          ai_prompt: blogRequest.topic,
          suggested_keywords: parsedContent.suggested_keywords,
          citations: parsedContent.citations,
          outline: parsedContent.outline
        },
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Add tags if provided
    if (blogRequest.tag_ids && blogRequest.tag_ids.length > 0) {
      const tagInserts = blogRequest.tag_ids.map(tagId => ({
        post_id: newPost.id,
        tag_id: tagId
      }));

      await supabaseClient
        .from('blog_post_tags')
        .insert(tagInserts);
    }

    // Create revision entry
    await supabaseClient
      .from('revisions')
      .insert({
        entity_type: 'blog_post',
        entity_id: newPost.id,
        snapshot: {
          title: newPost.title,
          content_mdx: newPost.content_mdx,
          meta: newPost.meta
        },
        created_by: user.id
      });

    return new Response(
      JSON.stringify({
        success: true,
        post: newPost,
        ai_analysis: {
          word_count: wordCount,
          reading_time: readingTime,
          outline: parsedContent.outline,
          citations: parsedContent.citations,
          suggested_keywords: parsedContent.suggested_keywords
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('AI blog writer error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to generate blog post'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});