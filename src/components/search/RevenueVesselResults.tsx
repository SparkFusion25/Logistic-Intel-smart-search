import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card" 
import { Button } from "@/components/ui/button"
import { Ship, Truck, Package, MapPin, Calendar, User, Building2 } from "lucide-react"

interface RevenueVesselResultsProps {
  results: any[]
  loading: boolean
}

export function RevenueVesselResults({ results, loading }: RevenueVesselResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((shipment, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {shipment.mode === 'ocean' ? (
                <Ship className="h-5 w-5 text-blue-500" />
              ) : shipment.mode === 'air' ? (
                <Package className="h-5 w-5 text-sky-500" />
              ) : (
                <Truck className="h-5 w-5 text-green-500" />
              )}
              <Badge variant={shipment.mode === 'ocean' ? 'default' : shipment.mode === 'air' ? 'secondary' : 'outline'}>
                {shipment.mode?.toUpperCase() || 'UNKNOWN'}
              </Badge>
            </div>
            <div className="text-right text-sm text-gray-500">
              <Calendar className="h-4 w-4 inline mr-1" />
              {shipment.arrival_date || shipment.shipment_date || 'No date'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Company Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Company
              </h4>
              <p className="text-sm text-gray-600">{shipment.company_name || shipment.unified_company_name || 'Unknown'}</p>
              {shipment.importer_name && (
                <p className="text-xs text-gray-500">Importer: {shipment.importer_name}</p>
              )}
            </div>

            {/* Route Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Route
              </h4>
              <p className="text-sm text-gray-600">
                {shipment.origin_country || shipment.port_of_lading || 'Unknown Origin'}
                {' → '}
                {shipment.destination_country || shipment.port_of_unlading || 'Unknown Destination'}
              </p>
              {shipment.destination_city && (
                <p className="text-xs text-gray-500">{shipment.destination_city}</p>
              )}
            </div>

            {/* Carrier Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                <User className="h-4 w-4" />
                Carrier
              </h4>
              <p className="text-sm text-gray-600">
                {shipment.carrier_name || 'Unknown Carrier'}
              </p>
              {shipment.vessel_name && (
                <p className="text-xs text-gray-500">Vessel: {shipment.vessel_name}</p>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-sm">
            {shipment.hs_code && (
              <div>
                <span className="font-medium">HS Code:</span>
                <p className="text-gray-600">{shipment.hs_code}</p>
              </div>
            )}
            {shipment.commodity_description && (
              <div>
                <span className="font-medium">Commodity:</span>
                <p className="text-gray-600 truncate" title={shipment.commodity_description}>
                  {shipment.commodity_description}
                </p>
              </div>
            )}
            {shipment.container_types && (
              <div>
                <span className="font-medium">Container:</span>
                <p className="text-gray-600">{shipment.container_types}</p>
              </div>
            )}
            {shipment.value_usd && (
              <div>
                <span className="font-medium">Value:</span>
                <p className="text-gray-600">${shipment.value_usd.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* BOL Numbers */}
          {(shipment.master_bol_number || shipment.house_bol_number) && (
            <div className="border-t pt-3 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {shipment.master_bol_number && (
                  <div>
                    <span className="font-medium">Master BOL:</span>
                    <p className="text-gray-600 font-mono">{shipment.master_bol_number}</p>
                  </div>
                )}
                {shipment.house_bol_number && (
                  <div>
                    <span className="font-medium">House BOL:</span>
                    <p className="text-gray-600 font-mono">{shipment.house_bol_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button variant="outline" size="sm">
              Add to CRM
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}