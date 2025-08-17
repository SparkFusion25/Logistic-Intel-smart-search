-- Create pipelines and stages for all existing users who don't have them yet
INSERT INTO public.pipelines (org_id, name, created_at)
SELECT DISTINCT u.id, 'Default Sales Pipeline', NOW()
FROM auth.users u
LEFT JOIN public.pipelines p ON p.org_id = u.id
WHERE p.id IS NULL;

-- Get the pipeline IDs we just created (or existing ones)
DO $$
DECLARE
    pipeline_record RECORD;
BEGIN
    FOR pipeline_record IN 
        SELECT p.id as pipeline_id, p.org_id 
        FROM public.pipelines p
        WHERE NOT EXISTS (
            SELECT 1 FROM public.pipeline_stages ps 
            WHERE ps.pipeline_id = p.id
        )
    LOOP
        -- Create default pipeline stages
        INSERT INTO public.pipeline_stages (org_id, pipeline_id, name, stage_order, created_at) VALUES
        (pipeline_record.org_id, pipeline_record.pipeline_id, 'Prospect Identified', 1, NOW()),
        (pipeline_record.org_id, pipeline_record.pipeline_id, 'Contacted', 2, NOW()),
        (pipeline_record.org_id, pipeline_record.pipeline_id, 'Engaged', 3, NOW()),
        (pipeline_record.org_id, pipeline_record.pipeline_id, 'Qualified', 4, NOW()),
        (pipeline_record.org_id, pipeline_record.pipeline_id, 'Proposal Sent', 5, NOW()),
        (pipeline_record.org_id, pipeline_record.pipeline_id, 'Won', 6, NOW()),
        (pipeline_record.org_id, pipeline_record.pipeline_id, 'Lost', 7, NOW());
    END LOOP;
END $$;