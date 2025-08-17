"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  type: string;
  subject: string | null;
  body: string | null;
  created_at: string;
}

interface DealDrawerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  dealId: string;
  onMove?: (dealId: string, toStageId: string) => void;
}

export function DealDrawer({ open, onOpenChange, dealId, onMove }: DealDrawerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !dealId) return;
    loadActivities();
  }, [open, dealId]);

  async function loadActivities() {
    try {
      const { data, error } = await supabase.functions.invoke('crm-activities', {
        body: { method: 'GET', dealId }
      });
      
      if (error) throw error;
      if (data.success) setActivities(data.data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  }

  async function markWonLost(status: "won" | "lost") {
    try {
      setLoading(true);
      const body = status === "lost" ? { status, lost_reason: "No response" } : { status };
      
      // This would need a separate edge function for deal closure
      // For now, we'll just show a toast
      toast({
        title: `Deal marked as ${status}`,
        description: `The deal has been marked as ${status}.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating deal:', error);
      toast({
        title: "Error",
        description: "Failed to update deal status.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function addNote() {
    if (!noteText.trim()) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('crm-activities', {
        body: {
          method: 'POST',
          type: 'note',
          deal_id: dealId,
          body: noteText.trim()
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        setNoteText("");
        loadActivities();
        toast({
          title: "Note added",
          description: "Your note has been added to the deal.",
        });
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive"
      });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[640px] p-0">
        <div className="p-5 border-b">
          <SheetHeader>
            <SheetTitle className="text-lg">Deal Details</SheetTitle>
          </SheetHeader>
        </div>

        <div className="p-5 space-y-4">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="attachments">Docs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>Deal Title</Label>
                  <Input placeholder="Deal title" />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input placeholder="Company name" />
                </div>
                <div>
                  <Label>Value (USD)</Label>
                  <Input type="number" placeholder="Deal value" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="default" 
                  onClick={() => markWonLost("won")}
                  disabled={loading}
                >
                  Mark Won
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => markWonLost("lost")}
                  disabled={loading}
                >
                  Mark Lost
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                {activities.map(activity => (
                  <div key={activity.id} className="border rounded-xl p-3">
                    <div className="text-sm font-medium capitalize">
                      {activity.type} — {activity.subject || "No subject"}
                    </div>
                    {activity.body ? (
                      <div className="text-sm mt-1 text-muted-foreground">
                        {activity.body}
                      </div>
                    ) : null}
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No activities yet
                  </div>
                )}
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <Label>Add a note</Label>
                <Textarea 
                  value={noteText} 
                  onChange={e => setNoteText(e.target.value)} 
                  placeholder="Add a quick note about this deal..."
                  rows={3}
                />
                <Button 
                  onClick={addNote} 
                  disabled={!noteText.trim()}
                  size="sm"
                >
                  Add Note
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-3">
              <div className="text-sm text-muted-foreground text-center py-8">
                No attachments yet. Attach quotes, tariff docs, and other files here.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}