-- Execute the clean migration to populate unified_shipments with correct data
SELECT migrate_legacy_shipments();