"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewDealDialogProps {
  pipelineId: string;
  stageId?: string;
  onCreated?: () => void;
}

export function NewDealDialog({ pipelineId, stageId, onCreated }: NewDealDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function create() {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crm-deals', {
        body: {
          method: 'POST',
          pipeline_id: pipelineId,
          stage_id: stageId,
          title: title.trim(),
          company_name: companyName.trim() || null,
          value_usd: value ? parseFloat(value) : null
        }
      });

      if (error) throw error;

      if (data.success) {
        setOpen(false);
        setTitle("");
        setCompanyName("");
        setValue("");
        onCreated?.();
        toast({
          title: "Deal created",
          description: "Your new deal has been added to the pipeline.",
        });
      } else {
        throw new Error(data.error || 'Failed to create deal');
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Deal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Deal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Export lane LAX→JFK"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              placeholder="e.g. ACME Logistics"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Deal Value (USD)</Label>
            <Input
              id="value"
              type="number"
              placeholder="e.g. 50000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={create} 
            disabled={!title.trim() || loading}
          >
            {loading ? "Creating..." : "Create Deal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}