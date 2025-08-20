import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TariffCalculator() {
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState<number | null>(null);

  const calculateTariff = () => {
    // Simple calculation for demo
    const tariffRate = 0.15; // 15%
    const calculatedValue = parseFloat(value) * tariffRate;
    setResult(calculatedValue);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Origin Country</label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger>
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="china">China</SelectItem>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="japan">Japan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Destination Country</label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Weight (kg)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Value (USD)</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter cargo value"
          />
        </div>
      </div>
      
      <Button 
        onClick={calculateTariff} 
        className="w-full bg-primary text-primary-foreground hover:opacity-90 h-12"
        disabled={!origin || !destination || !weight || !value}
      >
        Calculate Tariff
      </Button>
      
      {result !== null && (
        <div className="card-glass p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
              <span>$</span>
              {result.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Estimated Tariff Cost</p>
          </div>
        </div>
      )}
    </div>
  );
}