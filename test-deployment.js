#!/usr/bin/env node

// Test script for Logistic Intel deployment
import fetch from 'node-fetch';
const BASE_URL = process.env.TEST_URL || 'https://logistic-intel-smart-search.vercel.app';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}:`, response.status, data.success ? '✓' : '✗');
    return { success: response.ok, data };
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log(`🚀 Testing Logistic Intel deployment at: ${BASE_URL}\n`);
  
  // Test 1: Search API
  console.log('📊 Testing Search API...');
  await testEndpoint('/api/search/unified?q=apple&mode=all&limit=5');
  
  // Test 2: CRM Contacts API
  console.log('\n👥 Testing CRM API...');
  await testEndpoint('/api/crm/contacts', 'GET');
  await testEndpoint('/api/crm/contacts', 'POST', {
    company_name: 'Apple Inc',
    full_name: 'Test Contact',
    email: 'test@apple.com',
    source: 'deployment_test'
  });
  
  // Test 3: Apollo Enrichment
  console.log('\n🔍 Testing Apollo Enrichment...');
  await testEndpoint('/api/enrichment/apollo', 'POST', {
    company: 'Apple',
    titles: ['Supply Chain Manager']
  });
  
  // Test 4: PhantomBuster
  console.log('\n🤖 Testing PhantomBuster...');
  await testEndpoint('/api/enrichment/phantombuster', 'POST', {
    company: 'Apple',
    titles: ['Director of Logistics']
  });
  
  // Test 5: Email Send
  console.log('\n📧 Testing Email API...');
  await testEndpoint('/api/email/send', 'POST', {
    to: 'test@example.com',
    subject: 'Test Email',
    body: 'This is a test email from Logistic Intel',
    type: 'gmail'
  });
  
  // Test 6: Quote Generator
  console.log('\n📄 Testing Quote Generator...');
  await testEndpoint('/api/widgets/quote', 'POST', {
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    origin: 'Shanghai, China',
    destination: 'Los Angeles, USA',
    mode: 'ocean',
    cargo_description: 'Electronics',
    estimated_cost: 1500
  });
  
  // Test 7: Tariff Calculator
  console.log('\n🧮 Testing Tariff Calculator...');
  await testEndpoint('/api/widgets/tariff/calc', 'POST', {
    hs_code: '850440',
    origin_country: 'China',
    destination_country: 'United States',
    mode: 'ocean',
    incoterm: 'FOB',
    customs_value: 10000
  });
  
  // Test 8: Plan Check
  console.log('\n🔐 Testing Plan Gating...');
  await testEndpoint('/api/auth/plan-check', 'POST', {
    user_id: 'test-user-123',
    action: 'check',
    feature: 'contact_view'
  });
  
  console.log('\n🎉 Deployment tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Verify Vercel deployment dashboard');
  console.log('2. Check Supabase tables are populated');
  console.log('3. Test frontend UI manually');
  console.log('4. Verify environment variables in Vercel');
}

// Run tests
runTests().catch(console.error);