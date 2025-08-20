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

    // Enhanced test records with file-type-specific validation scenarios
    const testRecords = [
      {
        testName: 'Excel Scenario 1: String "null" from XLSX parsing',
        record: {
          org_id: user.id,
          mode: 'ocean',
          unified_company_name: 'null', // String "null" from Excel - CRITICAL TEST
          hs_code: 'null', // String "null" from Excel
          unified_destination: 'null',
          unified_value: 'null', // String "null" numeric
          unified_weight: 'null', // String "null" numeric
          unified_date: 'null', // String "null" date
          origin_country: 'null',
          destination_country: 'USA',
          shipment_date: 'null'
        }
      },
      {
        testName: 'Excel Scenario 2: Mixed sparse data with empty strings',
        record: {
          org_id: user.id,
          mode: '',  // Empty string from Excel
          unified_company_name: 'ABC Corp', 
          hs_code: '', // Empty string from Excel
          unified_destination: 'Los Angeles',
          unified_value: null, // Actual null
          unified_weight: '', // Empty string
          unified_date: null,
          origin_country: 'China',
          destination_country: '',
          shipment_date: null
        }
      },
      {
        testName: 'Excel Scenario 3: Edge case company names for relaxed validation',
        record: {
          org_id: user.id,
          mode: 'air',
          unified_company_name: 'Co', // Very short - should pass Excel validation
          hs_code: '123456',
          unified_destination: 'New York',
          origin_country: 'USA',
          destination_country: 'UK'
        }
      },
      {
        testName: 'Excel Scenario 4: Company with numbers (common in Excel)',
        record: {
          org_id: user.id,
          mode: 'ocean',
          unified_company_name: 'Company 123', // Should pass Excel validation
          hs_code: '654321',
          unified_destination: 'Miami',
          origin_country: 'Germany',
          destination_country: 'USA'
        }
      },
      {
        testName: 'XML Scenario 1: Valid structured data for strict validation',
        record: {
          org_id: user.id,
          mode: 'ocean',
          unified_company_name: 'Global Freight Solutions LLC',
          unified_destination: 'Los Angeles, CA',
          unified_value: 50000,
          unified_weight: 2500,
          unified_date: '2024-01-15',
          unified_carrier: 'Evergreen Line',
          hs_code: '870323',
          description: 'Automotive parts',
          commodity_description: 'Car engine components',
          shipper_name: 'Global Freight Solutions LLC',
          consignee_name: 'Auto Import Corp',
          origin_country: 'China',
          destination_country: 'United States',
          destination_city: 'Los Angeles',
          destination_state: 'CA',
          port_of_loading: 'Shanghai',
          port_of_discharge: 'Port of Los Angeles',
          shipment_date: '2024-01-15',
          arrival_date: '2024-01-25'
        }
      },
      {
        testName: 'CSV Scenario 1: Medium validation - missing mode but has hs_code',
        record: {
          org_id: user.id,
          mode: null, // Missing mode
          unified_company_name: 'Trade International Inc',
          hs_code: '841899', // Has hs_code - should pass CSV validation
          unified_destination: 'Seattle',
          origin_country: 'Japan',
          destination_country: 'USA'
        }
      },
      {
        testName: 'CSV Scenario 2: Medium validation - missing hs_code but has mode',
        record: {
          org_id: user.id,
          mode: 'air', // Has mode
          unified_company_name: 'Air Cargo Solutions',
          hs_code: null, // Missing hs_code - should pass CSV validation
          unified_destination: 'Chicago',
          origin_country: 'Canada',
          destination_country: 'USA'
        }
      },
      {
        testName: 'All File Types: Complete null handling test',
        record: {
          org_id: user.id,
          mode: null,
          unified_company_name: null,
          hs_code: null,
          unified_destination: null,
          unified_value: null,
          unified_weight: null,
          unified_date: null,
          shipper_name: null,
          consignee_name: null,
          origin_country: null,
          destination_country: null
        }
      },
      {
        testName: 'Date Parsing: Invalid dates that should become null',
        record: {
          org_id: user.id,
          mode: 'ocean',
          unified_company_name: 'Date Test Company',
          hs_code: '123456',
          unified_date: 'invalid-date', // Should become null
          shipment_date: '2024-13-45', // Invalid date - should become null
          arrival_date: 'null' // String "null" - should become null
        }
      },
      {
        testName: 'Numeric Parsing: Various numeric edge cases',
        record: {
          org_id: user.id,
          mode: 'air',
          unified_company_name: 'Numeric Test Co',
          hs_code: '987654',
          unified_value: '$50,000', // With currency symbol and comma
          unified_weight: 'null', // String "null" - should become null
          quantity: '1,500', // With comma
          value_usd: 'invalid-number', // Should become null
          weight_kg: '' // Empty string - should become null
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