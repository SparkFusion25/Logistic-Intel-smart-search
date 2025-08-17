"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NewDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineId: string;
  preselectedStageId?: string;
  onSuccess: () => void;
  contactId?: string;
  companyName?: string;
}

export function NewDealDialog({ open, onOpenChange, pipelineId, preselectedStageId, onSuccess, contactId, companyName }: NewDealDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company_name: companyName || "",
    value_usd: "",
    currency: "USD",
    expected_close_date: "",
    contact_id: contactId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Deal title is required");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crm-deals', {
        body: {
          pipelineId,
          stageId: preselectedStageId,
          title: formData.title,
          company_name: formData.company_name || null,
          value_usd: formData.value_usd ? parseFloat(formData.value_usd) : null,
          currency: formData.currency,
          expected_close_date: formData.expected_close_date || null,
          contact_id: formData.contact_id || null,
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast.success("Deal created successfully");
      onOpenChange(false);
      setFormData({
        title: "",
        company_name: companyName || "",
        value_usd: "",
        currency: "USD",
        expected_close_date: "",
        contact_id: contactId || "",
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Deal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter deal title"
              required
            />
          </div>

          <div>
            <Label htmlFor="company_name">Company</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              placeholder="Company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="value_usd">Deal Value</Label>
              <Input
                id="value_usd"
                type="number"
                step="0.01"
                value={formData.value_usd}
                onChange={(e) => setFormData(prev => ({ ...prev, value_usd: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="expected_close_date">Expected Close Date</Label>
            <Input
              id="expected_close_date"
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => setFormData(prev => ({ ...prev, expected_close_date: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}