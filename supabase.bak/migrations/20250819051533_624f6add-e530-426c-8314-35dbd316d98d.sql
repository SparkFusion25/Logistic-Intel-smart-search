-- Add missing audit columns to unified_shipments table
ALTER TABLE public.unified_shipments 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create function to update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row changes
DROP TRIGGER IF EXISTS update_unified_shipments_updated_at ON public.unified_shipments;
CREATE TRIGGER update_unified_shipments_updated_at
    BEFORE UPDATE ON public.unified_shipments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();