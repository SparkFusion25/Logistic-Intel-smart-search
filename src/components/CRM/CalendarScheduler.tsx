import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createActivityMeeting } from '@/repositories/crm.repo';
import { Calendar as CalendarIcon, Clock, Video, Phone, MapPin } from 'lucide-react';

interface CalendarSchedulerProps {
  dealId: string;
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export function CalendarScheduler({ dealId, contactId, contactName, contactEmail }: CalendarSchedulerProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [meetingType, setMeetingType] = useState<string>('video');
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    location: '',
    duration: '30'
  });

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !meetingData.title) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time, and meeting title",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Build ISO datetime safely
      const meetingDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const iso = isNaN(meetingDate.getTime()) ? null : meetingDate.toISOString();

      // Guard required ids
      if (!contactId) {
        toast({ title: 'Missing contact', description: 'Select a contact before scheduling.', variant: 'destructive' });
        return;
      }

      const { success, error } = await createActivityMeeting({
        contact_id: contactId,
        deal_id: dealId || null,
        title: meetingData.title || null,
        body: JSON.stringify({
          description: meetingData.description,
          meeting_type: meetingType,
          location: meetingData.location,
          duration: meetingData.duration,
          attendees: contactEmail ? [contactEmail] : []
        }),
        scheduled_at: iso,
        created_by: null, // Add user ID when auth is implemented
        org_id: null // Add org ID when multi-tenancy is implemented
      });

      if (!success) throw new Error(error);

      toast({
        title: "Meeting Scheduled",
        description: `Meeting scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setMeetingData({ title: '', description: '', location: '', duration: '30' });
      
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time & Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Meeting Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="time">Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={meetingData.duration} onValueChange={(value) => setMeetingData({ ...meetingData, duration: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Meeting Type</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video Call
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Call
                    </div>
                  </SelectItem>
                  <SelectItem value="in-person">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      In Person
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meeting Form */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={meetingData.title}
              onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
              placeholder={`Meeting with ${contactName || 'contact'}`}
            />
          </div>

          <div>
            <Label htmlFor="description">Description/Agenda</Label>
            <Textarea
              id="description"
              value={meetingData.description}
              onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
              placeholder="Meeting agenda or description..."
              rows={3}
            />
          </div>

          {meetingType === 'in-person' && (
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={meetingData.location}
                onChange={(e) => setMeetingData({ ...meetingData, location: e.target.value })}
                placeholder="Meeting location"
              />
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={handleSchedule} disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}