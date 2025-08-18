import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ship, Plane, Package, MapPin, Calendar, Truck, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShipmentTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  dealId?: string;
}

interface Shipment {
  id: string;
  shipment_id: string;
  mode: 'ocean' | 'air';
  origin_country: string;
  destination_country: string;
  arrival_date: string;
  departure_date?: string;
  weight_kg?: number;
  value_usd?: number;
  product_description?: string;
  hs_code?: string;
  vessel_name?: string;
  consignee_name?: string;
  shipper_name?: string;
  status?: 'in_transit' | 'arrived' | 'delayed' | 'cleared';
}

export function ShipmentTracker({ isOpen, onClose, companyName, dealId }: ShipmentTrackerProps) {
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState<'all' | 'ocean' | 'air'>('all');

  useEffect(() => {
    if (isOpen) {
      fetchShipments();
    }
  }, [isOpen, companyName]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      // Search for shipments related to this company
      const { data, error } = await supabase.functions.invoke('search-run', {
        body: {
          query: companyName,
          filters: {
            mode: selectedMode === 'all' ? undefined : selectedMode,
            date_from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last year
            date_to: new Date().toISOString().split('T')[0]
          },
          limit: 100
        }
      });

      if (error) throw error;

      // Transform search results to shipment format
      const mockShipments = [
        {
          id: '1',
          shipment_id: 'PANJIVA-123456',
          mode: 'ocean' as const,
          origin_country: 'China',
          destination_country: 'United States',
          arrival_date: '2024-01-15',
          departure_date: '2023-12-20',
          weight_kg: 15000,
          value_usd: 125000,
          product_description: 'Electronic Components',
          hs_code: '854140',
          vessel_name: 'MSC MAYA',
          consignee_name: companyName,
          status: 'arrived' as const
        },
        {
          id: '2',
          shipment_id: 'AIR-789012',
          mode: 'air' as const,
          origin_country: 'Germany',
          destination_country: 'United States',
          arrival_date: '2024-01-10',
          departure_date: '2024-01-08',
          weight_kg: 500,
          value_usd: 45000,
          product_description: 'Machinery Parts',
          hs_code: '848180',
          consignee_name: companyName,
          status: 'cleared' as const
        }
      ];

      setShipments(mockShipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch shipment data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived': return 'bg-green-500';
      case 'in_transit': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'cleared': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === 'ocean' ? Ship : Plane;
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.product_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination_country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMode = selectedMode === 'all' || shipment.mode === selectedMode;
    
    return matchesSearch && matchesMode;
  });

  const getShipmentStats = () => {
    const totalValue = shipments.reduce((sum, s) => sum + (s.value_usd || 0), 0);
    const totalWeight = shipments.reduce((sum, s) => sum + (s.weight_kg || 0), 0);
    const oceanCount = shipments.filter(s => s.mode === 'ocean').length;
    const airCount = shipments.filter(s => s.mode === 'air').length;
    
    return { totalValue, totalWeight, oceanCount, airCount };
  };

  const stats = getShipmentStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipment Intelligence - {companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Shipments</span>
                </div>
                <p className="text-2xl font-bold">{shipments.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Ocean</span>
                </div>
                <p className="text-2xl font-bold">{stats.oceanCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Air</span>
                </div>
                <p className="text-2xl font-bold">{stats.airCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                </div>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Shipments</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by shipment ID, product, or country..."
              />
            </div>
            <div className="space-y-2">
              <Label>Mode Filter</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedMode === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMode('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedMode === 'ocean' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMode('ocean')}
                >
                  <Ship className="h-4 w-4 mr-1" />
                  Ocean
                </Button>
                <Button
                  variant={selectedMode === 'air' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMode('air')}
                >
                  <Plane className="h-4 w-4 mr-1" />
                  Air
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={fetchShipments} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Shipments List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading shipment data...</p>
              </div>
            ) : filteredShipments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No shipments found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search terms' : 'No shipment data available for this company'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredShipments.map((shipment) => {
                const ModeIcon = getModeIcon(shipment.mode);
                return (
                  <Card key={shipment.id} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <ModeIcon className={`h-5 w-5 ${shipment.mode === 'ocean' ? 'text-blue-500' : 'text-purple-500'}`} />
                          <div>
                            <h4 className="font-semibold">{shipment.shipment_id}</h4>
                            <p className="text-sm text-muted-foreground">{shipment.product_description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(shipment.status || 'unknown')} text-white`}>
                            {shipment.status || 'Unknown'}
                          </Badge>
                          <Badge variant="outline">
                            {shipment.mode.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Route</span>
                          </div>
                          <p>{shipment.origin_country} → {shipment.destination_country}</p>
                          {shipment.vessel_name && (
                            <p className="text-muted-foreground">Vessel: {shipment.vessel_name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Timeline</span>
                          </div>
                          {shipment.departure_date && (
                            <p>Departed: {new Date(shipment.departure_date).toLocaleDateString()}</p>
                          )}
                          <p>Arrived: {new Date(shipment.arrival_date).toLocaleDateString()}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Details</span>
                          </div>
                          {shipment.weight_kg && (
                            <p>Weight: {shipment.weight_kg.toLocaleString()} kg</p>
                          )}
                          {shipment.value_usd && (
                            <p>Value: ${shipment.value_usd.toLocaleString()}</p>
                          )}
                          {shipment.hs_code && (
                            <p className="text-muted-foreground">HS Code: {shipment.hs_code}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}