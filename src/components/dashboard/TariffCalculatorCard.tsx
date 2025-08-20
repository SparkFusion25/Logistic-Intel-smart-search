import { useState } from 'react';
import { Calculator, Globe } from 'lucide-react';
import { tariffAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function TariffCalculatorCard() {
  const [originCountry, setOriginCountry] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [result, setResult] = useState<{ dutyRate: number; vatRate: number; source: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async () => {
    if (!originCountry.trim() || !destinationCountry.trim() || !hsCode.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await tariffAPI.calculate({
        originCountry: originCountry.trim(),
        destinationCountry: destinationCountry.trim(),
        hsCode: hsCode.trim()
      });

      if (response.ok && response.data) {
        setResult(response.data);
        toast({
          title: "Tariff calculated successfully",
          description: `Duty: ${response.data.dutyRate}%, VAT: ${response.data.vatRate}%`,
        });
      } else {
        throw new Error(response.error?.message || 'Failed to calculate tariff');
      }
    } catch (error) {
      toast({
        title: "Calculation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setOriginCountry('');
    setDestinationCountry('');
    setHsCode('');
  };

  return (
    <div className="card-glass p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Tariff Calculator</h3>
          <p className="text-sm text-muted-foreground">Calculate duties and taxes</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Origin Country *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              placeholder="e.g., China"
              className="input-primary pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Destination Country *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              placeholder="e.g., United States"
              className="input-primary pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            HS Code *
          </label>
          <input
            type="text"
            value={hsCode}
            onChange={(e) => setHsCode(e.target.value)}
            placeholder="e.g., 8528.72.64"
            className="input-primary"
          />
        </div>

        {result && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-medium text-foreground mb-3">Calculation Results</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Duty Rate</p>
                <p className="text-lg font-semibold text-foreground">{result.dutyRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VAT Rate</p>
                <p className="text-lg font-semibold text-foreground">{result.vatRate}%</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Source: {result.source}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Calculating...
              </div>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </>
            )}
          </button>
          {result && (
            <button
              onClick={clearResults}
              className="btn-secondary px-4"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}