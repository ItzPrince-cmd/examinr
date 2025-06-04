import React, { useState } from 'react';
import { motion } from 'framer-motion';

  import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Plus,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Bell,
  Filter,
  Download,
  Repeat,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  FileText} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from '../../components/ui/use-toast';

// Types 
interface ScheduleEvent { 
  id: string;
  title: string;
  type: 'class' | 'test' | 'meeting' | 'event';
  date: Date;
  startTime: string;
  endTime: string;
  batch?: string;
  subject?: string;
  location?: string;
  isOnline?: boolean;
  attendees?: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  recurring?: boolean;
  description?: string
}

// Mock Data 
const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Physics - Mechanics',
    type: 'class',
  date: new Date(),startTime: '09:00',endTime: '10:30',batch: 'JEE Advanced 2024',subject: 'Physics',location: 'Room 101',
  attendees: 30,status: 'scheduled',
  recurring: true
    }, {id: '2',title: 'Chemistry Mock Test',type: 'test',
  date: new Date(),startTime: '11:00',endTime: '13:00',batch: 'NEET 2024',subject: 'Chemistry',location: 'Test Hall A',
  attendees: 45,status: 'scheduled'
    }, {id: '3',title: 'Parent-Teacher Meeting',type: 'meeting',
  date: new Date(),startTime: '14:00',endTime: '15:00',
  isOnline: true,
  attendees: 15,status: 'scheduled'
    }, {id: '4',title: 'Mathematics - Calculus',type: 'class',
  date: new Date(),startTime: '15:30',endTime: '17:00',batch: 'JEE Mains 2024',subject: 'Mathematics',location: 'Room 203',
  attendees: 35,status: 'scheduled',
  recurring: true
} ];

  const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedBatch, setSelectedBatch] = useState('all');
  
  // Get week dates 
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) { 
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  }

  const weekDates = getWeekDates(selectedDate);
  
  // Filter events 
  const filteredEvents = mockEvents.filter((event) => {
    if (selectedBatch !== 'all' && event.batch !== selectedBatch) return false;
    return true;
  });
  
  // Group events by time for the schedule grid 
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) { 
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  const getEventTypeColor = (type: string) => {
    switch (type) { 
      case 'class': return 'bg-blue-500';
      case 'test': return 'bg-red-500';
      case 'meeting': return 'bg-purple-500';
      case 'event': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

    const getEventTypeIcon = (type: string) => {switch (type) { case 'class': return <BookOpen className="h-4 w-4" />;case 'test': return <FileText className="h-4 w-4" />;case 'meeting': return <Users className="h-4 w-4" />;case 'event': return <Calendar className="h-4 w-4" />;
      default: return null
} };

    const handleEventAction = (action: string, eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId

    );
    toast({ title: `${action} Event`, description: `${action} ${event?.title}`, }

    )
}

  return (<div className="container py-6 space-y-6">
      {
    /* Header */
    }<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div><h1 className="text-3xl font-bold tracking-tight">Schedule</h1><p className="text-muted-foreground">Manage your classes, tests, and meetings</p>
  </div><div className="flex gap-3">
  <Select value={selectedBatch} onValueChange={setSelectedBatch}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Select batch" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Batches</SelectItem><SelectItem value="JEE Advanced 2024">JEE Advanced 2024</SelectItem><SelectItem value="JEE Mains 2024">JEE Mains 2024</SelectItem><SelectItem value="NEET 2024">NEET 2024</SelectItem>
  </SelectContent>
  </Select><Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filters </Button>
  <Button><Plus className="h-4 w-4 mr-2" /> Add Event </Button>
  </div>
  </div>
      {
    /* Calendar Controls */
    }
    <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><Button variant="outline" size="icon" onClick={() => {
      const newDate = new Date(selectedDate

      );
      newDate.setDate(newDate.getDate() - 7

      );
      setSelectedDate(newDate

      )
}}><ChevronLeft className="h-4 w-4" />
  </Button><h2 className="text-lg font-semibold">{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }
    )
    }
    </h2><Button variant="outline" size="icon" onClick={() => {
      const newDate = new Date(selectedDate

      );
      newDate.setDate(newDate.getDate() + 7

      );
      setSelectedDate(newDate

      )
}}><ChevronRight className="h-4 w-4" />
  </Button><Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}> Today </Button>
  </div>
  <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
  <TabsList><TabsTrigger value="day">Day</TabsTrigger><TabsTrigger value="week">Week</TabsTrigger><TabsTrigger value="month">Month</TabsTrigger>
  </TabsList>
  </Tabs>
  </div>
  </CardContent>
  </Card>
      {
    /* Schedule View */} {selectedView === 'week' && ( <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full">
    <thead><tr className="border-b"><th className="p-4 text-left text-sm font-medium text-muted-foreground w-20">Time</th>
        {weekDates.map((date, index) => {
        const isToday = date.toDateString() === new Date().toDateString();const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = date.getDate();
        return (<th key={index} className={`p-4 text-center ${isToday ? 'bg-primary/10' : ''}`}><div className="text-sm font-medium">
        {dayName}
        </div><div className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>
        {dayNumber}
        </div>
        </th>
        )
}
      )
      }
    </tr>
    </thead>
    <tbody>{timeSlots.map((time, timeIndex) => ( <tr key={time} className="border-b"><td className="p-4 text-sm text-muted-foreground">
      {time}
      </td>
          {weekDates.map((date, dateIndex) => {
            const dayEvents = filteredEvents.filter((event) => {
              return event.date.toDateString() === date.toDateString() && 
                     event.startTime.startsWith(time.substring(0, 2));
            });
          return (<td key={dateIndex} className="p-2 align-top relative h-20">{dayEvents.map((event) => ( <motion.div key={event.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`absolute left-1 right-1 p-2 rounded-md text-white text-xs cursor-pointer ${getEventTypeColor(event.type)} transition-opacity`} onClick={() => handleEventAction('View', event.id)} ><div className="flex items-center gap-1 mb-1">
            {getEventTypeIcon(event.type)}<span className="font-medium truncate">
            {event.title}
            </span>
            </div><div className="text-[10px] opacity-90">
            {event.startTime} - {event.endTime}
            </div>{event.location && ( <div className="text-[10px] opacity-90 flex items-center gap-1">{event.isOnline ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {event.location}
            </div> )}
          </motion.div> ))}
          </td>
          )
}
        )
        }
    </tr> ))}
    </tbody>
    </table>
    </div>
    </CardContent>
    </Card> )} {/* Today's Schedule Summary */
    }<div className="grid gap-4 md:grid-cols-2">
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Today's Schedule </CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-3">{mockEvents.slice(0, 4).map((event) => ( <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
    <div className={`w-2 h-12 rounded-full ${getEventTypeColor(event.type)}`} /><div className="flex-1"><div className="flex items-center gap-2"><p className="font-medium">
      {event.title}
    </p>{event.recurring && <Badge variant="outline" className="text-xs">Recurring</Badge>}
    </div><div className="flex items-center gap-4 text-sm text-muted-foreground mt-1"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />
      {event.startTime} - {event.endTime}
    </span>{event.location && ( <span className="flex items-center gap-1">{event.isOnline ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {event.location}</span> )} {event.attendees && ( <span className="flex items-center gap-1"><Users className="h-3 w-3" />
      {event.attendees}
    </span> )}
    </div>
    </div><Button size="sm" variant="ghost"><Edit2 className="h-4 w-4" />
    </Button>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Upcoming Reminders </CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-3"><div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"><div className="flex items-center gap-2 mb-1"><AlertCircle className="h-4 w-4 text-yellow-600" /><p className="font-medium text-sm">Physics Mock Test</p>
  </div><p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM - Prepare question papers</p>
  </div><div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"><div className="flex items-center gap-2 mb-1"><Calendar className="h-4 w-4 text-blue-600" /><p className="font-medium text-sm">Parent Meeting</p>
  </div><p className="text-xs text-muted-foreground">Friday at 2:00 PM - Send meeting links</p>
  </div><div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"><div className="flex items-center gap-2 mb-1"><CheckCircle className="h-4 w-4 text-green-600" /><p className="font-medium text-sm">Assignment Deadline</p>
  </div><p className="text-xs text-muted-foreground">Saturday - Chemistry Chapter 5 submissions</p>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
  </div>
  )
}

export default SchedulePage;
