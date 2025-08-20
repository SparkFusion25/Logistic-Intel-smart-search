import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plane, Ship, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ManualQuoteCard() {
  const [pol, setPol] = useState('');
  const [pod, setPod] = useState('');
  const [commodity, setCommodity] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [mode, setMode] = useState<'air' | 'sea'>('air');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuote = async () => {
    if (!pol.trim() || !pod.trim() || !commodity.trim() || !totalCost.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const cost = parseFloat(totalCost);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Invalid cost",
        description: "Please enter a valid cost amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.from('quotes').insert({
        creator_id: user.data.user.id,
        org_id: user.data.user.id, // Use user ID as org_id for now
        amount: cost,
        status: 'draft',
        line_items: {
          pol: pol.trim(),
          pod: pod.trim(),
          mode,
          commodity: commodity.trim(),
          currency: 'USD'
        }
      }).select();

      if (error) throw error;

      toast({
        title: "Quote generated successfully",
        description: `Quote ID: ${data[0]?.id || 'N/A'}`,
      });
      // Reset form
      setPol('');
      setPod('');
      setCommodity('');
      setTotalCost('');
    } catch (error) {
      toast({
        title: "Quote generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-glass p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Quick Quote</h3>
          <p className="text-sm text-muted-foreground">Generate freight quote instantly</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Transport Mode
          </label>
          <div className="toggle-container">
            <button
              onClick={() => setMode('air')}
              className="toggle-item"
              data-active={mode === 'air'}
            >
              <Plane className="h-4 w-4 mr-2" />
              Air
            </button>
            <button
              onClick={() => setMode('sea')}
              className="toggle-item"
              data-active={mode === 'sea'}
            >
              <Ship className="h-4 w-4 mr-2" />
              Sea
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Port of Loading *
            </label>
            <input
              type="text"
              value={pol}
              onChange={(e) => setPol(e.target.value)}
              placeholder="e.g., Shanghai"
              className="input-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Port of Discharge *
            </label>
            <input
              type="text"
              value={pod}
              onChange={(e) => setPod(e.target.value)}
              placeholder="e.g., Los Angeles"
              className="input-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Commodity *
          </label>
          <input
            type="text"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            placeholder="e.g., Electronics, Textiles..."
            className="input-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Total Cost (USD) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="0.00"
              className="input-primary pl-10"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateQuote}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Generating...
            </div>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Quote
            </>
          )}
        </button>
      </div>
    </div>
  );
}