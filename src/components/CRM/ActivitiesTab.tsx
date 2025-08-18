import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MessageSquare, Phone, Mail, FileText, Clock, Plus, CheckCircle } from 'lucide-react';

interface ActivitiesTabProps {
  dealId: string;
  contactId?: string;
}

const activityTypes = [
  { value: 'note', label: 'Note', icon: MessageSquare },
  { value: 'call', label: 'Phone Call', icon: Phone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Meeting', icon: Calendar },
  { value: 'task', label: 'Task', icon: FileText }
];

export function ActivitiesTab({ dealId, contactId }: ActivitiesTabProps) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'note',
    subject: '',
    body: '',
    due_at: ''
  });

  useEffect(() => {
    loadActivities();
  }, [dealId]);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('crm-activities', {
        body: { dealId }
      });

      if (error) throw error;
      if (data?.success) {
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.subject.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a subject for the activity",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crm-activities', {
        body: {
          deal_id: dealId,
          contact_id: contactId,
          type: newActivity.type,
          subject: newActivity.subject,
          body: newActivity.body,
          due_at: newActivity.due_at || null
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Activity Added",
          description: "Activity has been saved successfully"
        });
        setNewActivity({ type: 'note', subject: '', body: '', due_at: '' });
        setShowForm(false);
        loadActivities();
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: "Error",
        description: "Failed to save activity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', activityId);

      if (error) throw error;

      toast({
        title: "Activity Completed",
        description: "Activity marked as complete"
      });
      loadActivities();
    } catch (error) {
      console.error('Error marking activity complete:', error);
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive"
      });
    }
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.value === type);
    const Icon = activityType?.icon || MessageSquare;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Activity Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Activities</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Add Activity Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Activity Type</Label>
              <Select value={newActivity.type} onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newActivity.subject}
                onChange={(e) => setNewActivity({ ...newActivity, subject: e.target.value })}
                placeholder="Activity subject"
              />
            </div>

            <div>
              <Label htmlFor="body">Notes/Description</Label>
              <Textarea
                id="body"
                value={newActivity.body}
                onChange={(e) => setNewActivity({ ...newActivity, body: e.target.value })}
                placeholder="Activity notes or description"
                rows={3}
              />
            </div>

            {['task', 'meeting', 'call'].includes(newActivity.type) && (
              <div>
                <Label htmlFor="due_at">Due Date/Time</Label>
                <Input
                  id="due_at"
                  type="datetime-local"
                  value={newActivity.due_at}
                  onChange={(e) => setNewActivity({ ...newActivity, due_at: e.target.value })}
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddActivity} disabled={loading}>
                {loading ? 'Saving...' : 'Save Activity'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activities List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Activities Yet</h3>
              <p className="text-muted-foreground">
                Add notes, calls, meetings, and tasks to track your deal progress.
              </p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{activity.subject}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {activityTypes.find(t => t.value === activity.type)?.label || activity.type}
                        </Badge>
                        {activity.completed_at && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      {activity.body && (
                        <p className="text-sm text-muted-foreground mb-2">{activity.body}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created {formatDate(activity.created_at)}
                        </span>
                        {activity.due_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due {formatDate(activity.due_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!activity.completed_at && ['task', 'call', 'meeting'].includes(activity.type) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsComplete(activity.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}