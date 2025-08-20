-- Create affiliate management system (working around existing tables)

-- Check if tables exist and only create if they don't
DO $$ 
BEGIN
    -- Affiliate profiles table (extends users)
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'affiliate_profiles') THEN
        CREATE TABLE public.affiliate_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
          commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00,
          payment_email TEXT,
          stripe_account_id TEXT,
          bio TEXT,
          website_url TEXT,
          social_links JSONB DEFAULT '{}',
          approved_at TIMESTAMPTZ,
          approved_by UUID REFERENCES auth.users(id),
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;

    -- Affiliate requests table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'affiliate_requests') THEN
        CREATE TABLE public.affiliate_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          reason TEXT,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          processed_by UUID REFERENCES auth.users(id),
          processed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;

    -- Update existing affiliate_links table or create new columns
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'affiliate_links') THEN
        -- Add missing columns to existing table if they don't exist
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS link_name TEXT;
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS base_url TEXT;
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS tracking_code TEXT;
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS conversions INTEGER DEFAULT 0;
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
        ALTER TABLE public.affiliate_links ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
    ELSE
        CREATE TABLE public.affiliate_links (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          affiliate_id UUID NOT NULL,
          link_name TEXT NOT NULL,
          base_url TEXT NOT NULL,
          tracking_code TEXT UNIQUE NOT NULL,
          clicks INTEGER DEFAULT 0,
          conversions INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;

    -- Promo codes for affiliates
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'affiliate_promo_codes') THEN
        CREATE TABLE public.affiliate_promo_codes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          affiliate_id UUID NOT NULL,
          code TEXT UNIQUE NOT NULL,
          discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
          discount_value DECIMAL(10,2) NOT NULL,
          max_uses INTEGER,
          current_uses INTEGER DEFAULT 0,
          expires_at TIMESTAMPTZ,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;

    -- Affiliate referrals tracking
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'affiliate_referrals') THEN
        CREATE TABLE public.affiliate_referrals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          affiliate_id UUID NOT NULL,
          referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          tracking_code TEXT,
          promo_code TEXT,
          conversion_value DECIMAL(10,2),
          commission_earned DECIMAL(10,2),
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;

    -- Affiliate payouts
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'affiliate_payouts') THEN
        CREATE TABLE public.affiliate_payouts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          affiliate_id UUID NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          period_start DATE NOT NULL,
          period_end DATE NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
          stripe_transfer_id TEXT,
          payment_method TEXT DEFAULT 'stripe',
          notes TEXT,
          processed_by UUID REFERENCES auth.users(id),
          processed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;

    -- Content management for admin
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'site_content') THEN
        CREATE TABLE public.site_content (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          page_slug TEXT NOT NULL,
          section_key TEXT NOT NULL,
          content_type TEXT NOT NULL CHECK (content_type IN ('text', 'html', 'json', 'image')),
          content_value TEXT NOT NULL,
          meta_data JSONB DEFAULT '{}',
          updated_by UUID REFERENCES auth.users(id) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now(),
          UNIQUE(page_slug, section_key)
        );
    END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own affiliate profile" ON public.affiliate_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own affiliate profile" ON public.affiliate_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can create affiliate requests" ON public.affiliate_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own requests" ON public.affiliate_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Everyone can read site content" ON public.site_content
  FOR SELECT USING (true);

-- Create function to generate unique tracking codes
CREATE OR REPLACE FUNCTION generate_tracking_code() RETURNS TEXT AS $$
BEGIN
  RETURN 'AF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Insert default site content
INSERT INTO public.site_content (page_slug, section_key, content_type, content_value, updated_by) VALUES
('home', 'hero_title', 'text', 'Global Trade Intelligence Platform', '00000000-0000-0000-0000-000000000000'),
('home', 'hero_subtitle', 'text', 'Discover hidden opportunities in global supply chains with our comprehensive trade data platform', '00000000-0000-0000-0000-000000000000'),
('home', 'cta_primary', 'text', 'Start Free Trial', '00000000-0000-0000-0000-000000000000'),
('home', 'cta_secondary', 'text', 'Watch Demo', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (page_slug, section_key) DO NOTHING;