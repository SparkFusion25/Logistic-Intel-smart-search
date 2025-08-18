import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Bell, Video, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CalendarViewProps {
  isOpen: boolean;
  onClose: () => void;
  dealId?: string;
  contactName?: string;
  contactEmail?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  type?: 'call' | 'meeting' | 'demo' | 'follow-up';
}

export function CalendarView({ isOpen, onClose, dealId, contactName, contactEmail }: CalendarViewProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    duration: 60,
    type: 'call' as const,
    reminder: 15
  });

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calendar-integration', {
        body: { action: 'fetch' }
      });

      if (error) throw error;

      if (data?.success) {
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch calendar events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    if (!eventForm.title || !eventForm.startDate || !eventForm.startTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calendar-integration', {
        body: {
          action: 'create',
          eventData: {
            ...eventForm,
            attendees: contactEmail ? [contactEmail] : []
          },
          dealId
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Success",
          description: "Meeting scheduled successfully",
        });
        setShowForm(false);
        setEventForm({
          title: '',
          description: '',
          startDate: '',
          startTime: '',
          duration: 60,
          type: 'call',
          reminder: 15
        });
        fetchEvents();
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create calendar event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-500';
      case 'meeting': return 'bg-green-500';
      case 'demo': return 'bg-purple-500';
      case 'follow-up': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return events.filter(event => new Date(event.start) > now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);
  };

  const getTodayEvents = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return events.filter(event => event.start.startsWith(todayStr));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar & Meetings
            {contactName && <span className="text-muted-foreground">- {contactName}</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {events.length} scheduled events
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {getTodayEvents().length} today
                  </Badge>
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Today's Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getTodayEvents().length === 0 ? (
                        <p className="text-muted-foreground text-sm">No events scheduled for today</p>
                      ) : (
                        getTodayEvents().map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                            <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type || 'call')}`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.type || 'call'}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getUpcomingEvents().length === 0 ? (
                        <p className="text-muted-foreground text-sm">No upcoming events</p>
                      ) : (
                        getUpcomingEvents().map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                            <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type || 'call')}`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.start).toLocaleDateString()} at{' '}
                                {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {event.type || 'call'}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Scheduled Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No events scheduled</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Schedule your first meeting to get started
                        </p>
                        <Button onClick={() => setShowForm(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </Button>
                      </div>
                    ) : (
                      events.map((event) => (
                        <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg border">
                          <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type || 'call')}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{event.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {event.type || 'call'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {new Date(event.start).toLocaleDateString()} • {' '}
                              {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Schedule New Meeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Meeting Title *</Label>
                    <Input
                      id="title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={`Meeting with ${contactName || 'Contact'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Meeting Type</Label>
                    <select
                      id="type"
                      value={eventForm.type}
                      onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="call">Phone Call</option>
                      <option value="meeting">In-Person Meeting</option>
                      <option value="demo">Product Demo</option>
                      <option value="follow-up">Follow-up</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventForm.startDate}
                      onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <select
                      id="duration"
                      value={eventForm.duration}
                      onChange={(e) => setEventForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description/Agenda</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Meeting agenda, topics to discuss..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder">Reminder</Label>
                  <select
                    id="reminder"
                    value={eventForm.reminder}
                    onChange={(e) => setEventForm(prev => ({ ...prev, reminder: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value={5}>5 minutes before</option>
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={1440}>1 day before</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={createEvent} disabled={loading}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {loading ? 'Scheduling...' : 'Schedule Meeting'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}