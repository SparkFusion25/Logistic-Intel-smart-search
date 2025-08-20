import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function QuoteForm(){
  const [form,setForm]=useState({company_name:'',origin:'',destination:'',mode:'ocean',hs_code:'',commodity:''});
  const [resp,setResp]=useState<any>(null);
  
  const submit = async () => { 
    try {
      const { data, error } = await supabase.functions.invoke('quote-generator', { body: form });
      if (error) throw error;
      setResp(data);
    } catch (error: any) {
      setResp({ success: false, error: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-name">Client Name</Label>
          <Input
            id="client-name"
            placeholder="Enter client name"
            value={form.company_name}
            onChange={e=>setForm({...form,company_name:e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="service-type">Service Type</Label>
          <Select value={form.mode} onValueChange={value=>setForm({...form,mode:value})}>
            <SelectTrigger id="service-type">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ocean">Ocean</SelectItem>
              <SelectItem value="air">Air</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            placeholder="Origin port/city"
            value={form.origin}
            onChange={e=>setForm({...form,origin:e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            placeholder="Destination port/city"
            value={form.destination}
            onChange={e=>setForm({...form,destination:e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            placeholder="Total weight"
            value={form.hs_code}
            onChange={e=>setForm({...form,hs_code:e.target.value})}
          />
        </div>
      </div>
      
      <Button onClick={submit} className="w-full bg-primary text-primary-foreground hover:opacity-90 h-12">
        Generate Quote
      </Button>
      
      {resp && (
        <div className="card-glass p-4">
          <pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap">
            {JSON.stringify(resp,null,2)}
          </pre>
        </div>
      )}
    </div>
  );
}