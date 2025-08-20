-- Attach triggers to remaining tables
CREATE TRIGGER queue_invalid_company_for_enrichment_enhanced_trigger
    AFTER INSERT ON airfreight_shipments
    FOR EACH ROW
    EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();

CREATE TRIGGER queue_invalid_company_for_enrichment_enhanced_trigger
    AFTER INSERT ON ocean_shipments
    FOR EACH ROW
    EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();

CREATE TRIGGER queue_invalid_company_for_enrichment_enhanced_trigger
    AFTER INSERT ON trade_shipments
    FOR EACH ROW
    EXECUTE FUNCTION queue_invalid_company_for_enrichment_enhanced();