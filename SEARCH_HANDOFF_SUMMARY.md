# Trade Intelligence Search - Handoff Summary

## Current Implementation Overview

### Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Database**: PostgreSQL with RLS policies
- **Search Route**: `/dashboard/search` (dedicated page)

### Key Components
1. **SearchIntelligence.tsx** - Main search container
2. **AdvancedFilters.tsx** - Filter controls and form
3. **RevenueVesselResults.tsx** - Results display component
4. **SearchPanel.tsx** - Legacy component (needs cleanup)

### Database Tables & Policies

#### Core Data Tables
1. **airfreight_shipments** - Air cargo data
   - Policies: Public read, service role full access
   - Contains: shipper_name, consignee_name, hs_code, arrival_date, etc.

2. **ocean_shipments** - Ocean cargo data  
   - Policies: Public read, service role full access
   - Contains: company_name, shipper_name, consignee_name, hs_code, etc.

3. **trade_shipments** - Trade data
   - Policies: Public read, service role full access
   - Contains: inferred_company_name, value_usd, shipment_date, etc.

4. **unified_shipments** - Consolidated view
   - Policies: Public read, service role full access
   - Contains: unified_company_name, mode, unified_date, etc.

5. **companies** - Company profiles
   - Policies: Public read, authenticated insert
   - Contains: company_name, industry, confidence_score, etc.

#### Supporting Tables
- **census_trade_data** - Government trade statistics
- **airfreight_insights** - Air freight analytics
- **company_trade_profiles** - Enhanced company data
- **bts_route_matches** - Route analysis data

### Edge Functions
1. **search-run** - Main search functionality
2. **search-quick** - Quick search operations

## Current Issues & Problems

### 1. Mobile Optimization
- Search page layout not responsive
- Advanced filters panel too wide on mobile
- Results cards not optimized for small screens
- Need mobile-first responsive design

### 2. Search Logic Flaws
**Issue**: Empty search returns "200 results for ''"
- Should show recent/popular results or prompt for search terms
- Default state handling is broken

**Issue**: Term-based search confusion
- Searching "Ocean" returns companies with "ocean" in name
- Should search ocean shipments data, not just company names
- Mode filtering (air/ocean) not properly implemented

### 3. Data Display Problems
**Company Cards Missing Data**:
- No shipment counts displayed
- Missing trade volume/value
- No last activity dates
- Incomplete company profiles

**Airfreight Cards Show Null**:
- Data mapping issues in RevenueVesselResults.tsx
- Null values not handled gracefully
- Missing fallback data display

### 4. Search Architecture Issues
- Multiple search components with conflicting logic
- Inconsistent filter state management
- No proper search result typing
- Edge function response format inconsistencies

## Required Search Logic Fix

### Search Functionality Should Work As Follows:

#### 1. Search Modes
```typescript
type SearchMode = 'companies' | 'shipments' | 'routes' | 'contacts';
type TransportMode = 'all' | 'ocean' | 'air' | 'ground';
```

#### 2. Search Logic by Mode

**Companies Mode**:
- Search across: companies, company_trade_profiles
- Filter by: industry, location, shipment_volume
- Display: company_name, industry, total_shipments, last_activity
- Sort by: relevance, shipment_count, trade_value

**Shipments Mode**: 
- Search across: unified_shipments, ocean_shipments, airfreight_shipments
- Filter by: transport_mode, date_range, hs_code, origin/destination
- Display: company_name, origin, destination, commodity, date, value
- Sort by: date, value, relevance

**Routes Mode**:
- Aggregate shipment data by routes
- Filter by: transport_mode, frequency, volume
- Display: origin-destination pairs, volume, frequency, top_companies

**Contacts Mode**:
- Search across: crm_contacts, enriched contact data
- Filter by: company, title, location
- Display: name, company, title, contact_info

#### 3. Filter Logic
```typescript
interface SearchFilters {
  // Core filters
  mode: TransportMode;
  range: string; // '30d', '90d', '1y', 'all'
  entity: 'all' | 'importer' | 'exporter';
  
  // Geographic
  origin_country: string;
  dest_country: string;
  origin_zip: string;
  dest_zip: string;
  
  // Product
  hs_codes: string;
  commodity: string;
  
  // Volume/Value
  min_shipments: number;
  min_confidence: number;
  
  // Parties
  importer_name: string;
  carrier_name: string;
  forwarder_name: string;
  notify_party: string;
  
  // Shipment Details
  container_number: string;
  master_bol_number: string;
  house_bol_number: string;
  vessel_name: string;
  voyage_number: string;
  container_types: string;
  is_lcl: string;
}
```

#### 4. Search Results Format
```typescript
interface SearchResult {
  type: 'company' | 'shipment' | 'route' | 'contact';
  id: string;
  title: string;
  subtitle: string;
  metadata: Record<string, any>;
  score: number;
  highlight_fields: string[];
}

interface SearchResponse {
  results: SearchResult[];
  total_count: number;
  filters_applied: SearchFilters;
  search_time_ms: number;
  suggestions?: string[];
}
```

### 5. Edge Function Requirements

**search-run** should:
- Handle all search modes with proper SQL queries
- Implement proper full-text search with rankings
- Apply filters correctly across different table structures  
- Return consistent result format
- Handle empty/invalid queries gracefully
- Implement pagination and sorting
- Cache frequent searches for performance

**Database Query Strategy**:
- Use PostgreSQL full-text search (tsvector)
- Implement fuzzy matching for company names
- Use proper indexes for performance
- Join tables efficiently based on search mode
- Handle data quality issues (null/empty values)

### 6. UI/UX Requirements

**Mobile Responsiveness**:
- Collapsible filter panel
- Touch-friendly controls
- Responsive result cards
- Proper typography scaling

**Search Experience**:
- Real-time search suggestions
- Search history
- Quick filters (recent, popular, saved)
- Empty state handling
- Loading states
- Error handling

**Result Display**:
- Rich company cards with metrics
- Proper data fallbacks for missing info
- Export functionality
- Save search functionality
- CRM integration buttons

## Next Steps for Implementation

1. **Fix Mobile Layout** - Implement responsive design
2. **Rewrite Search Logic** - Create new edge function with proper query logic
3. **Fix Data Display** - Handle null values and improve card components
4. **Add Search Suggestions** - Implement autocomplete and suggestions
5. **Optimize Performance** - Add caching and proper indexing
6. **Clean Up Components** - Remove duplicate/legacy search components

## Technical Debt to Address
- Multiple overlapping search components
- Inconsistent state management
- Missing error handling
- No loading states
- Poor mobile experience
- Hardcoded filter options
- No search analytics/logging

---

**Priority**: HIGH - Search is core functionality and currently broken
**Estimated Effort**: 2-3 days for complete rewrite
**Dependencies**: Database optimization, mobile design system