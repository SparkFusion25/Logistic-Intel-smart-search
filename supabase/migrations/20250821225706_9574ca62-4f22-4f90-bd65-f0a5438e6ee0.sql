-- Delete incorrectly imported CRM contacts from today
DELETE FROM crm_contacts 
WHERE DATE(created_at) = CURRENT_DATE 
AND source = 'panjiva';