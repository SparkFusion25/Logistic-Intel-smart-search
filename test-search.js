// Test script to verify search function is working
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zupuxlrtixhfnbuhxhum.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHV4bHJ0aXhoZm5idWh4aHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzkyMTYsImV4cCI6MjA3MDAxNTIxNn0.cuKMT_qhg8uOjFImnbQreg09K-TnVqV_NE_E5ngsQw0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSearch() {
  console.log('Testing search function...')
  
  try {
    const { data, error } = await supabase.functions.invoke('search-run', {
      body: {
        q: 'test',
        tab: 'companies'
      }
    })
    
    if (error) {
      console.error('Search error:', error)
    } else {
      console.log('Search successful:', data)
    }
  } catch (err) {
    console.error('Test failed:', err)
  }
}

testSearch()