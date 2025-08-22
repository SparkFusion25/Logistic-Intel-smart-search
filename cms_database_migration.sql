-- CMS Database Schema Migration
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'Logistic Intel',
    tagline TEXT DEFAULT 'Global freight intelligence, CRM, and outreach platform',
    default_meta JSONB DEFAULT '{}',
    social JSONB DEFAULT '{}',
    newsletter_provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Assets Table
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    filename TEXT NOT NULL,
    alt_text TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    mime_type TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages Table (for CMS-managed pages)
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_mdx TEXT,
    content_html TEXT,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    og_image UUID REFERENCES media_assets(id),
    meta JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Tags
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    dek TEXT, -- subtitle/excerpt
    content_mdx TEXT,
    content_html TEXT,
    cover_image UUID REFERENCES media_assets(id),
    author_id UUID REFERENCES auth.users(id),
    category_id UUID REFERENCES blog_categories(id),
    status TEXT CHECK (status IN ('draft', 'scheduled', 'published', 'archived')) DEFAULT 'draft',
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    meta JSONB DEFAULT '{}',
    reading_time INTEGER DEFAULT 0,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Post Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Revisions Table (for version control)
CREATE TABLE IF NOT EXISTS revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL, -- 'blog_post', 'page', etc.
    entity_id UUID NOT NULL,
    snapshot JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_revisions_entity ON revisions(entity_type, entity_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_title_search ON blog_posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_blog_posts_content_search ON blog_posts USING gin(to_tsvector('english', content_mdx));

-- Trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS idx_blog_posts_title_trgm ON blog_posts USING gin(title gin_trgm_ops);

-- Insert default site settings
INSERT INTO site_settings (site_name, tagline, default_meta, social) 
VALUES (
    'Logistic Intel',
    'Global freight intelligence, CRM, and outreach platform',
    '{
        "title": "Logistic Intel - Global Freight Intelligence Platform",
        "description": "Search shipments, analyze trade lanes, and launch campaigns with the most comprehensive logistics intelligence platform.",
        "keywords": ["logistics intelligence", "freight data", "supply chain analytics", "trade data"]
    }',
    '{
        "twitter": "@logisticintel",
        "linkedin": "company/logistic-intel"
    }'
) ON CONFLICT DO NOTHING;

-- Insert default blog categories
INSERT INTO blog_categories (slug, name, description) VALUES
    ('market-intelligence', 'Market Intelligence', 'Analysis of global trade patterns and market trends'),
    ('supply-chain', 'Supply Chain', 'Supply chain optimization and logistics strategies'),
    ('technology', 'Technology', 'Latest tech innovations in logistics and freight'),
    ('industry-insights', 'Industry Insights', 'Deep dives into specific logistics sectors'),
    ('company-news', 'Company News', 'Updates and announcements from Logistic Intel')
ON CONFLICT (slug) DO NOTHING;

-- Insert default blog tags
INSERT INTO blog_tags (slug, name) VALUES
    ('freight-forwarding', 'Freight Forwarding'),
    ('ocean-freight', 'Ocean Freight'),
    ('air-freight', 'Air Freight'),
    ('customs', 'Customs'),
    ('tariffs', 'Tariffs'),
    ('trade-data', 'Trade Data'),
    ('crm', 'CRM'),
    ('automation', 'Automation'),
    ('ai', 'AI'),
    ('analytics', 'Analytics')
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION publish_scheduled_posts()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE blog_posts 
    SET status = 'published', 
        published_at = NOW()
    WHERE status = 'scheduled' 
    AND scheduled_for <= NOW();
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND role IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Site Settings Policies
CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify site settings" ON site_settings FOR ALL USING (is_admin_user());

-- Media Assets Policies
CREATE POLICY "Anyone can view published media" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload media" ON media_assets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own media" ON media_assets FOR UPDATE USING (created_by = auth.uid() OR is_admin_user());
CREATE POLICY "Users can delete their own media" ON media_assets FOR DELETE USING (created_by = auth.uid() OR is_admin_user());

-- Pages Policies
CREATE POLICY "Anyone can view published pages" ON pages FOR SELECT USING (status = 'published' OR is_admin_user());
CREATE POLICY "Only admins can create pages" ON pages FOR INSERT WITH CHECK (is_admin_user());
CREATE POLICY "Only admins can update pages" ON pages FOR UPDATE USING (is_admin_user());
CREATE POLICY "Only admins can delete pages" ON pages FOR DELETE USING (is_admin_user());

-- Blog Categories Policies
CREATE POLICY "Anyone can view categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON blog_categories FOR ALL USING (is_admin_user());

-- Blog Tags Policies  
CREATE POLICY "Anyone can view tags" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Only admins can modify tags" ON blog_tags FOR ALL USING (is_admin_user());

-- Blog Posts Policies
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (
    status = 'published' OR 
    (auth.uid() = author_id) OR 
    is_admin_user()
);
CREATE POLICY "Authors can create posts" ON blog_posts FOR INSERT WITH CHECK (
    auth.uid() = author_id AND auth.role() = 'authenticated'
);
CREATE POLICY "Authors can update their own posts, admins can update any" ON blog_posts FOR UPDATE USING (
    auth.uid() = author_id OR is_admin_user()
);
CREATE POLICY "Only admins can delete posts" ON blog_posts FOR DELETE USING (is_admin_user());

-- Blog Post Tags Policies
CREATE POLICY "Anyone can view post tags" ON blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Authors can manage tags for their posts" ON blog_post_tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM blog_posts 
        WHERE id = post_id 
        AND (author_id = auth.uid() OR is_admin_user())
    )
);

-- Revisions Policies
CREATE POLICY "Users can view revisions of their content" ON revisions FOR SELECT USING (
    created_by = auth.uid() OR is_admin_user()
);
CREATE POLICY "Authenticated users can create revisions" ON revisions FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
);

-- Storage bucket for static HTML files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('static-html', 'static-html', true) 
ON CONFLICT DO NOTHING;

-- Storage policy for static HTML
CREATE POLICY "Anyone can view static HTML" ON storage.objects FOR SELECT USING (bucket_id = 'static-html');
CREATE POLICY "Service role can manage static HTML" ON storage.objects FOR ALL USING (bucket_id = 'static-html');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comment the tables for documentation
COMMENT ON TABLE site_settings IS 'Global site configuration and settings';
COMMENT ON TABLE media_assets IS 'Uploaded media files with metadata';
COMMENT ON TABLE pages IS 'CMS-managed static pages';
COMMENT ON TABLE blog_categories IS 'Blog post categories';
COMMENT ON TABLE blog_tags IS 'Blog post tags';
COMMENT ON TABLE blog_posts IS 'Blog posts with content and metadata';
COMMENT ON TABLE blog_post_tags IS 'Many-to-many relationship between posts and tags';
COMMENT ON TABLE revisions IS 'Version history for content changes';