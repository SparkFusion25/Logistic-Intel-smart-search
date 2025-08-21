-- Allow admin users to manage bulk imports without org_id restrictions
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, we consider all authenticated users as admins for bulk operations
  -- This can be enhanced later with a proper user roles system
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update bulk_imports RLS policies to allow admin operations
DROP POLICY IF EXISTS "Users can insert their bulk imports" ON bulk_imports;
DROP POLICY IF EXISTS "Users can update their bulk imports" ON bulk_imports;
DROP POLICY IF EXISTS "Users can manage their imports" ON bulk_imports;

-- Create new policies that allow admin operations
CREATE POLICY "Admins can insert bulk imports" ON bulk_imports
FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update bulk imports" ON bulk_imports
FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admins can select bulk imports" ON bulk_imports
FOR SELECT USING (is_admin_user());

CREATE POLICY "Admins can delete bulk imports" ON bulk_imports
FOR DELETE USING (is_admin_user());