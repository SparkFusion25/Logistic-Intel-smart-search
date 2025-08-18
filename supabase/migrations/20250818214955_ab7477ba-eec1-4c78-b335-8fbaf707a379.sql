-- Phase 1: Enhance the is_valid_company_name function to catch AI-generated placeholders
CREATE OR REPLACE FUNCTION public.is_valid_company_name(company_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
  -- Consider valid if:
  -- 1. Not null and not empty
  -- 2. More than 2 characters
  -- 3. Not generic placeholders or AI-generated names
  -- 4. Contains at least one letter
  -- 5. Not suspiciously generic patterns
  
  IF company_name IS NULL OR LENGTH(TRIM(company_name)) <= 2 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for generic/placeholder names (expanded list)
  IF LOWER(TRIM(company_name)) IN (
    'unknown', 'unknown company', 'n/a', 'na', 'none', 'null', 
    'not available', 'tbd', 'pending', 'missing', 'unnamed',
    'company', 'business', 'corp', 'inc', 'ltd',
    'default company', 'test company', 'sample company',
    'placeholder', 'temp company', 'temporary company',
    'shipper', 'consignee', 'importer', 'exporter',
    'company name', 'company_name', 'companyname'
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Check for numbered placeholders (Company 1, Shipper 123, etc.)
  IF LOWER(TRIM(company_name)) ~ '^(company|shipper|consignee|importer|exporter)\s*\d+$' THEN
    RETURN FALSE;
  END IF;
  
  -- Check for generic patterns with numbers
  IF LOWER(TRIM(company_name)) ~ '^(test|sample|demo|placeholder|temp|temporary)\s*(company|corp|inc|ltd|business)?\s*\d*$' THEN
    RETURN FALSE;
  END IF;
  
  -- Check for suspiciously short acronyms (less than 3 chars, all caps)
  IF LENGTH(TRIM(company_name)) < 3 AND TRIM(company_name) ~ '^[A-Z]+$' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain at least one letter
  IF NOT (company_name ~ '[a-zA-Z]') THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$;