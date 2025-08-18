-- Create comprehensive affiliate management system

-- Affiliates table (extends users)
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

-- Affiliate requests table for users who want to become affiliates
CREATE TABLE public.affiliate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliate links table
CREATE TABLE public.affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  link_name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  tracking_code TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Promo codes for affiliates
CREATE TABLE public.affiliate_promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliate referrals tracking
CREATE TABLE public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tracking_code TEXT,
  promo_code TEXT,
  conversion_value DECIMAL(10,2),
  commission_earned DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Affiliate payouts
CREATE TABLE public.affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliate_profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Content management for admin
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

-- User profiles table for storing additional user data
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  company TEXT,
  job_title TEXT,
  phone TEXT,
  bio TEXT,
  plan TEXT DEFAULT 'trial',
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliate_profiles
CREATE POLICY "Users can view their own affiliate profile" ON public.affiliate_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own affiliate profile" ON public.affiliate_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all affiliate profiles" ON public.affiliate_profiles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for affiliate_requests
CREATE POLICY "Users can create affiliate requests" ON public.affiliate_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own requests" ON public.affiliate_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all requests" ON public.affiliate_requests
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for affiliate_links
CREATE POLICY "Affiliates can manage their own links" ON public.affiliate_links
  FOR ALL USING (affiliate_id IN (
    SELECT id FROM public.affiliate_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all links" ON public.affiliate_links
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for affiliate_promo_codes
CREATE POLICY "Affiliates can manage their own promo codes" ON public.affiliate_promo_codes
  FOR ALL USING (affiliate_id IN (
    SELECT id FROM public.affiliate_profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for affiliate_referrals
CREATE POLICY "Affiliates can view their own referrals" ON public.affiliate_referrals
  FOR SELECT USING (affiliate_id IN (
    SELECT id FROM public.affiliate_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all referrals" ON public.affiliate_referrals
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for affiliate_payouts
CREATE POLICY "Affiliates can view their own payouts" ON public.affiliate_payouts
  FOR SELECT USING (affiliate_id IN (
    SELECT id FROM public.affiliate_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all payouts" ON public.affiliate_payouts
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS Policies for site_content
CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Everyone can read site content" ON public.site_content
  FOR SELECT USING (true);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Create function to generate unique tracking codes
CREATE OR REPLACE FUNCTION generate_tracking_code() RETURNS TEXT AS $$
BEGIN
  RETURN 'AF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate tracking codes
CREATE OR REPLACE FUNCTION set_tracking_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
    NEW.tracking_code := generate_tracking_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER affiliate_links_tracking_code_trigger
  BEFORE INSERT ON public.affiliate_links
  FOR EACH ROW EXECUTE FUNCTION set_tracking_code();

-- Create function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default site content
INSERT INTO public.site_content (page_slug, section_key, content_type, content_value, updated_by) VALUES
('home', 'hero_title', 'text', 'Global Trade Intelligence Platform', '00000000-0000-0000-0000-000000000000'),
('home', 'hero_subtitle', 'text', 'Discover hidden opportunities in global supply chains with our comprehensive trade data platform', '00000000-0000-0000-0000-000000000000'),
('home', 'cta_primary', 'text', 'Start Free Trial', '00000000-0000-0000-0000-000000000000'),
('home', 'cta_secondary', 'text', 'Watch Demo', '00000000-0000-0000-0000-000000000000'),
('pricing', 'trial_title', 'text', 'Free Trial', '00000000-0000-0000-0000-000000000000'),
('pricing', 'starter_title', 'text', 'Starter', '00000000-0000-0000-0000-000000000000'),
('pricing', 'pro_title', 'text', 'Professional', '00000000-0000-0000-0000-000000000000'),
('pricing', 'enterprise_title', 'text', 'Enterprise', '00000000-0000-0000-0000-000000000000');