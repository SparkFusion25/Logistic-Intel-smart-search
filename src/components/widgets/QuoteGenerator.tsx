import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function QuoteGenerator() {
  const [clientName, setClientName] = React.useState('');
  const [service, setService] = React.useState('');
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [quoteGenerated, setQuoteGenerated] = React.useState(false);

  const generateQuote = () => {
    setQuoteGenerated(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Quote Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Client Name</label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Service Type</label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ocean">Ocean Freight</SelectItem>
                  <SelectItem value="air">Air Freight</SelectItem>
                  <SelectItem value="land">Land Transport</SelectItem>
                  <SelectItem value="multimodal">Multimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Origin</label>
              <Input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Origin port/city"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Destination</label>
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination port/city"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Weight (kg)</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Total weight"
              />
            </div>
          </div>
          
          <Button 
            onClick={generateQuote} 
            className="w-full bg-primary text-primary-foreground hover:opacity-90"
            disabled={!clientName || !service || !origin || !destination || !weight}
          >
            Generate Quote
          </Button>
        </CardContent>
      </Card>

      {quoteGenerated && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Generated Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Quote Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Client:</span> {clientName}</p>
                  <p><span className="font-medium">Service:</span> {service}</p>
                  <p><span className="font-medium">Route:</span> {origin} → {destination}</p>
                  <p><span className="font-medium">Weight:</span> {weight} kg</p>
                  <p><span className="font-medium">Estimated Cost:</span> $2,450.00</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline">Download PDF</Button>
                <Button variant="outline">Share Quote</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}