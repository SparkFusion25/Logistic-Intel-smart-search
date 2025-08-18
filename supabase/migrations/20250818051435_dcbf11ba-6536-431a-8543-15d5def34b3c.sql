-- Create table for storing Gmail OAuth tokens
CREATE TABLE public.gmail_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own Gmail tokens"
ON public.gmail_tokens
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_gmail_tokens_user_id ON public.gmail_tokens(user_id);
CREATE INDEX idx_gmail_tokens_expires_at ON public.gmail_tokens(expires_at);