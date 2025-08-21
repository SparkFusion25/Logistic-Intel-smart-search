-- Delete all CRM contacts created today (they're all wrong imports from Panjiva)
DELETE FROM crm_contacts 
WHERE DATE(created_at) = CURRENT_DATE;