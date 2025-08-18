import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Testing insert for user: ${user.id}`);

    // Test 5 different record insertions to verify the structure
    const testRecords = [
      {
        testName: 'Basic Ocean Record',
        record: {
          org_id: user.id,
          mode: 'ocean',
          unified_company_name: 'Test Ocean Shipper 1',
          unified_destination: 'Los Angeles, CA',
          unified_value: 50000,
          unified_weight: 15000,
          unified_date: '2024-01-15',
          shipper_name: 'Test Ocean Shipper 1',
          consignee_name: 'Test Ocean Consignee 1',
          origin_country: 'China',
          destination_country: 'United States',
          destination_city: 'Los Angeles',
          destination_state: 'CA',
          hs_code: '8471.30.0100',
          description: 'Computer equipment'
        }
      },
      {
        testName: 'Basic Air Record',
        record: {
          org_id: user.id,
          mode: 'air',
          unified_company_name: 'Test Air Shipper 1',
          unified_destination: 'New York, NY',
          unified_value: 25000,
          unified_weight: 500,
          unified_date: '2024-01-16',
          shipper_name: 'Test Air Shipper 1',
          consignee_name: 'Test Air Consignee 1',
          origin_country: 'Germany',
          destination_country: 'United States',
          destination_city: 'New York',
          destination_state: 'NY',
          hs_code: '9018.90.8000',
          description: 'Medical devices'
        }
      },
      {
        testName: 'Minimal Required Fields Only',
        record: {
          org_id: user.id,
          mode: 'ocean'
        }
      },
      {
        testName: 'Record with Nulls',
        record: {
          org_id: user.id,
          mode: 'air',
          unified_company_name: 'Test Company with Nulls',
          unified_destination: null,
          unified_value: null,
          unified_weight: null,
          unified_date: null,
          shipper_name: null,
          consignee_name: null
        }
      },
      {
        testName: 'Full Data Record',
        record: {
          org_id: user.id,
          mode: 'ocean',
          unified_company_name: 'Full Data Test Company',
          unified_destination: 'Miami, FL',
          unified_value: 75000,
          unified_weight: 25000,
          unified_date: '2024-01-17',
          unified_carrier: 'Maersk Line',
          hs_code: '6109.10.0010',
          description: 'Cotton t-shirts',
          commodity_description: 'Cotton t-shirts',
          shipper_name: 'Full Data Shipper',
          consignee_name: 'Full Data Consignee',
          origin_country: 'Vietnam',
          destination_country: 'United States',
          destination_city: 'Miami',
          destination_state: 'FL',
          port_of_loading: 'Ho Chi Minh City',
          port_of_discharge: 'Port of Miami',
          bol_number: 'MAEU123456789',
          vessel_name: 'Maersk Alabama',
          container_count: 2,
          carrier_name: 'Maersk Line',
          quantity: 1000,
          value_usd: 75000,
          weight_kg: 25000,
          shipment_date: '2024-01-15',
          arrival_date: '2024-01-17'
        }
      }
    ];

    const results = [];

    for (const test of testRecords) {
      console.log(`Testing: ${test.testName}`);
      
      try {
        const { data, error } = await supabaseClient
          .from('unified_shipments')
          .insert(test.record)
          .select();

        if (error) {
          console.error(`Error in ${test.testName}:`, error);
          results.push({
            testName: test.testName,
            success: false,
            error: error.message,
            details: error
          });
        } else {
          console.log(`Success: ${test.testName}`, data);
          results.push({
            testName: test.testName,
            success: true,
            insertedId: data[0]?.id,
            data: data[0]
          });
        }
      } catch (catchError) {
        console.error(`Catch error in ${test.testName}:`, catchError);
        results.push({
          testName: test.testName,
          success: false,
          error: catchError.message,
          details: catchError
        });
      }
    }

    // Clean up test data
    console.log('Cleaning up test data...');
    const successfulIds = results
      .filter(r => r.success && r.insertedId)
      .map(r => r.insertedId);

    if (successfulIds.length > 0) {
      await supabaseClient
        .from('unified_shipments')
        .delete()
        .in('id', successfulIds);
      console.log(`Cleaned up ${successfulIds.length} test records`);
    }

    const summary = {
      totalTests: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results: results
    };

    console.log('Test Summary:', summary);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Insert tests completed',
      summary
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in test-import-insert:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});