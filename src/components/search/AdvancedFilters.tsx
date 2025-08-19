import React, { useState } from "react"
import { ChevronDown, ChevronRight, Filter, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Autocomplete } from "@/components/ui/autocomplete"
import { useLocationAutocomplete } from "@/hooks/useLocationAutocomplete"
import { useCommodityAutocomplete } from "@/hooks/useCommodityAutocomplete"
import { cn } from "@/lib/utils"

interface AdvancedFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
  onApplyFilters: () => void
}

function DatePicker({ value, onChange, placeholder }: { value?: Date, onChange: (date?: Date) => void, placeholder: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  )
}

export function AdvancedFilters({ filters, onFiltersChange, onApplyFilters }: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['shipment', 'dates'])
  const locationAutocomplete = useLocationAutocomplete()
  const commodityAutocomplete = useCommodityAutocomplete()

  const { searchCountries, searchCities } = locationAutocomplete
  const { searchCommodities } = commodityAutocomplete

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateFilter = (key: string, value: string | Date | undefined) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      mode: "all",
      range: "90d",
      origin_country: "",
      origin_zip: "",
      dest_country: "",
      dest_zip: "",
      hs_codes: "",
      commodity: "",
      entity: "all",
      min_shipments: "",
      min_confidence: "",
      // Date filters
      shipment_date_from: undefined,
      shipment_date_to: undefined,
      arrival_date_from: undefined,
      arrival_date_to: undefined,
      // Revenue Vessel filters
      importer_name: "",
      carrier_name: "",
      forwarder_name: "",
      notify_party: "",
      container_number: "",
      master_bol_number: "",
      house_bol_number: "",
      vessel_name: "",
      voyage_number: "",
      container_types: "all",
      is_lcl: "all"
    })
  }

  const getActiveFilterCount = () => {
    const activeFilters = Object.entries(filters).filter(([key, value]) => 
      key !== 'mode' && key !== 'range' && value && value !== '' && value !== undefined
    )
    return activeFilters.length
  }

  return (
    <div className="border rounded-lg bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Advanced Filters</span>
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()} active
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
            <Button size="sm" onClick={onApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Date Filters */}
        <Collapsible open={expandedSections.includes('dates')}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('dates')}
            className="flex items-center gap-2 w-full text-left font-medium hover:text-primary"
          >
            {expandedSections.includes('dates') ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
            Date Filters
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Shipment Date From</label>
                <DatePicker
                  value={filters.shipment_date_from}
                  onChange={(date) => updateFilter('shipment_date_from', date)}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Shipment Date To</label>
                <DatePicker
                  value={filters.shipment_date_to}
                  onChange={(date) => updateFilter('shipment_date_to', date)}
                  placeholder="Select end date"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Arrival Date From</label>
                <DatePicker
                  value={filters.arrival_date_from}
                  onChange={(date) => updateFilter('arrival_date_from', date)}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Arrival Date To</label>
                <DatePicker
                  value={filters.arrival_date_to}
                  onChange={(date) => updateFilter('arrival_date_to', date)}
                  placeholder="Select end date"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Shipment Details */}
        <Collapsible open={expandedSections.includes('shipment')}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('shipment')}
            className="flex items-center gap-2 w-full text-left font-medium hover:text-primary"
          >
            {expandedSections.includes('shipment') ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
            Shipment Details
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Cargo Description</label>
                <Autocomplete
                  placeholder="Search commodities..."
                  value={filters.commodity}
                  onValueChange={(value) => updateFilter('commodity', value)}
                  options={searchCommodities(filters.commodity)}
                  searchPlaceholder="Type to search commodities..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">HS Code</label>
                <Input
                  placeholder="Enter HS code"
                  value={filters.hs_codes}
                  onChange={(e) => updateFilter('hs_codes', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vessel Name</label>
                <Input
                  placeholder="Enter vessel name"
                  value={filters.vessel_name}
                  onChange={(e) => updateFilter('vessel_name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Voyage Number</label>
                <Input
                  placeholder="Enter voyage number"
                  value={filters.voyage_number}
                  onChange={(e) => updateFilter('voyage_number', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Container Type</label>
                <Select value={filters.container_types} onValueChange={(value) => updateFilter('container_types', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select container type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="20GP">20ft GP</SelectItem>
                    <SelectItem value="40GP">40ft GP</SelectItem>
                    <SelectItem value="40HQ">40ft HQ</SelectItem>
                    <SelectItem value="45HQ">45ft HQ</SelectItem>
                    <SelectItem value="20RF">20ft Reefer</SelectItem>
                    <SelectItem value="40RF">40ft Reefer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Shipment Type</label>
                <Select value={filters.is_lcl} onValueChange={(value) => updateFilter('is_lcl', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="false">FCL</SelectItem>
                    <SelectItem value="true">LCL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Involved Parties */}
        <Collapsible open={expandedSections.includes('parties')}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('parties')}
            className="flex items-center gap-2 w-full text-left font-medium hover:text-primary"
          >
            {expandedSections.includes('parties') ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
            Involved Parties
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Importer</label>
                <Input
                  placeholder="Enter importer name"
                  value={filters.importer_name}
                  onChange={(e) => updateFilter('importer_name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ocean Carrier</label>
                <Input
                  placeholder="Enter carrier name"
                  value={filters.carrier_name}
                  onChange={(e) => updateFilter('carrier_name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Forwarder</label>
                <Input
                  placeholder="Enter forwarder name"
                  value={filters.forwarder_name}
                  onChange={(e) => updateFilter('forwarder_name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notify Party</label>
                <Input
                  placeholder="Enter notify party"
                  value={filters.notify_party}
                  onChange={(e) => updateFilter('notify_party', e.target.value)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Location */}
        <Collapsible open={expandedSections.includes('location')}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('location')}
            className="flex items-center gap-2 w-full text-left font-medium hover:text-primary"
          >
            {expandedSections.includes('location') ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
            Location
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Port of Lading</label>
                <Autocomplete
                  placeholder="Search origin location..."
                  value={filters.origin_country}
                  onValueChange={(value) => updateFilter('origin_country', value)}
                  options={[]}
                  searchPlaceholder="Type to search locations..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Port of Unlading</label>
                <Autocomplete
                  placeholder="Search destination location..."
                  value={filters.dest_country}
                  onValueChange={(value) => updateFilter('dest_country', value)}
                  options={[]}
                  searchPlaceholder="Type to search locations..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Origin ZIP</label>
                <Input
                  placeholder="Enter origin ZIP"
                  value={filters.origin_zip}
                  onChange={(e) => updateFilter('origin_zip', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Destination ZIP</label>
                <Input
                  placeholder="Enter destination ZIP"
                  value={filters.dest_zip}
                  onChange={(e) => updateFilter('dest_zip', e.target.value)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Additional Filters */}
        <Collapsible open={expandedSections.includes('additional')}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('additional')}
            className="flex items-center gap-2 w-full text-left font-medium hover:text-primary"
          >
            {expandedSections.includes('additional') ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
            Additional
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Master BOL Number</label>
                <Input
                  placeholder="Enter master BOL"
                  value={filters.master_bol_number}
                  onChange={(e) => updateFilter('master_bol_number', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">House BOL Number</label>
                <Input
                  placeholder="Enter house BOL"
                  value={filters.house_bol_number}
                  onChange={(e) => updateFilter('house_bol_number', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Container Number</label>
                <Input
                  placeholder="Enter container number"
                  value={filters.container_number}
                  onChange={(e) => updateFilter('container_number', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Transport Mode</label>
                <Select value={filters.mode} onValueChange={(value) => updateFilter('mode', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}