-- Get the current user's org_id and create default pipeline
DO $$
DECLARE
    v_user_id uuid;
    v_org_id uuid;
    v_pipeline_id uuid;
    v_stage_id uuid;
    stage_names text[] := ARRAY['Prospect Identified', 'Contacted', 'Engaged', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
    stage_name text;
    i integer;
BEGIN
    -- Get the first user and use their ID as org_id (simplified for now)
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
        v_org_id := v_user_id; -- Using user ID as org ID for simplicity
        
        -- Create default pipeline if it doesn't exist
        INSERT INTO public.pipelines (org_id, name)
        VALUES (v_org_id, 'Default')
        ON CONFLICT DO NOTHING
        RETURNING id INTO v_pipeline_id;
        
        -- If pipeline already exists, get its ID
        IF v_pipeline_id IS NULL THEN
            SELECT id INTO v_pipeline_id FROM public.pipelines WHERE org_id = v_org_id AND name = 'Default' LIMIT 1;
        END IF;
        
        -- Create stages if they don't exist
        FOR i IN 1..array_length(stage_names, 1) LOOP
            stage_name := stage_names[i];
            
            INSERT INTO public.pipeline_stages (org_id, pipeline_id, name, stage_order)
            VALUES (v_org_id, v_pipeline_id, stage_name, i)
            ON CONFLICT DO NOTHING;
        END LOOP;
        
        RAISE NOTICE 'Seeded default pipeline for org_id: %', v_org_id;
    ELSE
        RAISE NOTICE 'No users found to seed pipeline for';
    END IF;
END $$;