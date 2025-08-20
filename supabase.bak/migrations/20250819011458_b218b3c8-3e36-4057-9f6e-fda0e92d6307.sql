-- Create Excel-specific relaxed company name validation function
CREATE OR REPLACE FUNCTION public.is_valid_company_name_excel(company_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  -- Excel-specific validation - MORE PERMISSIVE than XML validation
  -- Consider valid if:
  -- 1. Not null and not empty
  -- 2. More than 1 character (very permissive for Excel files)
  -- 3. Contains at least one letter
  -- 4. Allow shorter names and generic terms that would be rejected for XML
  
  IF company_name IS NULL OR LENGTH(TRIM(company_name)) <= 1 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for completely generic/placeholder names (reduced list for Excel)
  IF LOWER(TRIM(company_name)) IN (
    'unknown', 'n/a', 'na', 'none', 'null', 'not available', 'tbd', 'pending', 'missing'
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain at least one letter
  IF NOT (company_name ~ '[a-zA-Z]') THEN
    RETURN FALSE;
  END IF;
  
  -- Excel files: Accept most company names including:
  -- - Short names (ABC, Inc)
  -- - Generic terms (Company, Corp)
  -- - Numbers in names (Company 123)
  -- - Common business suffixes alone
  
  RETURN TRUE;
END;
$function$;