-- Drop existing triggers if they exist to avoid conflicts
DROP TRIGGER IF EXISTS queue_invalid_company_for_enrichment_enhanced_trigger ON unified_shipments;
DROP TRIGGER IF EXISTS queue_invalid_company_for_enrichment_enhanced_trigger ON airfreight_shipments;
DROP TRIGGER IF EXISTS queue_invalid_company_for_enrichment_enhanced_trigger ON ocean_shipments;
DROP TRIGGER IF EXISTS queue_invalid_company_for_enrichment_enhanced_trigger ON trade_shipments;

-- Attach trigger to unified_shipments table
CREATE TRIGGER queue_invalid_company_for_enrichment_enhanced_trigger
    AFTER INSERT ON unified_shipments
    FOR EACH ROW
    EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();