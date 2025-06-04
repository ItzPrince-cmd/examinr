import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

  import {
      Video,
      Calendar,
      Clock,
      FileText,
      Users,
      MessageSquare,
      Bell,
      BookOpen,
      Play,
      ChevronRight,
      Trophy,
      Target,
      TrendingUp,
      AlertCircle,
      CheckCircle,
      User,
      BarChart3,
      Zap,
      Download,
      ArrowUpRight,
      Timer,
      Plus,
      Search} from 'lucide-react';

  import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { Input } from '../../components/ui/input';
import { toast } from '../../components/ui/use-toast';

  import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import batchService, { Batch as BatchType } from '../../services/batchService';
import { useAuth } from '../../contexts/AuthContext';

  interface BatchDisplay {
      id: string;
      name: string;
      teacher: {
            name: string;
            avatar: string;
            subject: string
}

      subject: string;
      nextClass: {
            date: string;
            time: string;
            topic: string
}

      pendingAssignments: number;
      totalStudents: number;
      progress: number;
      announcement?: string
}

  interface Assignment {
      id: string;
      title: string;type: 'DPP' | 'Test' | 'Assignment';
      dueDate: string;
      questions: number;
      duration: number;status: 'pending' | 'completed' | 'overdue';
      score?: number;
      maxScore?: number
}

  interface ClassSession {
      id: string;
      date: string;
      time: string;
      topic: string;status: 'upcoming' | 'live' | 'completed';
      recording?: string;
      attendance?: boolean;
      notes?: string
}

  const BatchDashboard: React.FC = () => {const [selectedBatch, setSelectedBatch] = useState<string>('1'

      );const [activeTab, setActiveTab] = useState('overview'
  );
  
  // Mock data
  const batches: BatchDisplay[] = [
    {
      id: '1',
      name: 'JEE Advanced 2024 - Physics',
      teacher: {
        name: 'Dr. Amit Kumar',
        avatar: '/avatars/teacher1.jpg',
        subject: 'Physics'
      },
      subject: 'Physics',
      nextClass: {
        date: '2024-01-15',
        time: '6:00 PM',
        topic: 'Electromagnetic Induction'
      },
      pendingAssignments: 3,
      totalStudents: 45,
      progress: 65,
      announcement: 'Important: Mock test scheduled for this Sunday!'
    },
    {
      id: '2',
      name: 'JEE Main 2024 - Mathematics',
      teacher: {
        name: 'Prof. Priya Sharma',
        avatar: '/avatars/teacher2.jpg',
        subject: 'Mathematics'
      },
      subject: 'Mathematics',
      nextClass: {
        date: '2024-01-16',
        time: '7:00 PM',
        topic: 'Integral Calculus'
      },
      pendingAssignments: 2,
      totalStudents: 38,
      progress: 58
    }
  ];
    const assignments: Assignment[] = [{id: '1',title: 'DPP #23 - Electromagnetic Waves',type: 'DPP',dueDate: '2024-01-14',
      questions: 10,
      duration: 30,status: 'pending'
      }, {id: '2',title: 'Chapter Test - Magnetism',type: 'Test',dueDate: '2024-01-17',
      questions: 25,
      duration: 60,status: 'pending'
      }, {id: '3',title: 'DPP #22 - Current Electricity',type: 'DPP',dueDate: '2024-01-12',
      questions: 10,
      duration: 30,status: 'completed',
      score: 8,
      maxScore: 10
    }];
    const classSessions: ClassSession[] = [{id: '1',date: '2024-01-15',time: '6:00 PM',topic: 'Electromagnetic Induction',status: 'upcoming'
      }, {id: '2',date: '2024-01-13',time: '6:00 PM',topic: 'Magnetic Effects of Current',status: 'completed',recording: '/recordings/class1.mp4',
      attendance: true,notes: '/notes/class1.pdf'
    }];
  const currentBatch = batches.find(b => b.id === selectedBatch)!;
  const navigate = useNavigate();
    const handleJoinClass = () => {
      toast({
            title: "Joining live class...",description: "You'll be redirected to the live session.",

      });
      // Navigate to live classroom
      setTimeout(() => {
        navigate('/live-classroom');
      }, 1000);
    };

    const handleStartAssignment = (assignmentId: string) => {
      toast({title: "Starting assignment...",description: "Good luck!",

      });
      // Navigate to test interface with assignment
      setTimeout(() => {
        navigate(`/test/${assignmentId}`);
      }, 1000);
    };

    const handleAddToCalendar = () => {
      // Create calendar event
      const event = {
        title: currentBatch.nextClass.topic,
        date: currentBatch.nextClass.date,
        time: currentBatch.nextClass.time
      };
toast({ title: "Added to Calendar", description: `${event.title} on ${event.date} at ${event.time}`, }

    )
}

    const handleSetReminder = () => {
      toast({title: "Reminder Set",description: "You'll be notified 15 minutes before the class.",

      }

      )
}

    const handleWatchRecording = (recordingUrl?: string) => {
      if (recordingUrl) {
            toast({title: "Opening Recording",description: "Loading video player...",

            });
      // In a real app, this would open a video player
      window.open(recordingUrl, '_blank');
    }
  };

    const handleDownloadNotes = (notesUrl?: string) => {
      if (notesUrl) {
            toast({title: "Downloading Notes",description: "Your download will start shortly.",

            });
      // In a real app, this would download the file
      window.open(notesUrl, '_blank');
    }
  };

    const handleReviewAssignment = (assignmentId: string) => {
      navigate(`/results/${assignmentId}`

      )
}

    const handleQuickAction = (action: string) => {
      switch (action) {case 'doubt': navigate('/ask-doubt'

            );
                  break;case 'material': navigate('/study-material'

            );
                  break;case 'report': navigate('/performance'

            );
                  break;case 'members': navigate(`/batch/${selectedBatch}/members`

            );
                  break;
            default: toast({title: "Coming Soon",description: "This feature will be available soon.",

            }

            )
}
    };

    const timeUntilClass = () => {// Mock implementation - calculate time until next class return '1h 30m'
}

  return (<div className="container mx-auto p-6 space-y-6">
      {
                  /* Batch Selector */
            }<div className="flex items-center justify-between">
                  <div><h1 className="text-3xl font-bold">My Batches</h1><p className="text-muted-foreground">Manage your enrolled batches and assignments</p>
                  </div><div className="flex gap-2">{batches.map((batch) => (<Button key={batch.id} variant={selectedBatch === batch.id ? 'default' : 'outline'} onClick={() => setSelectedBatch(batch.id)} className="relative" >{batch.name} {batch.pendingAssignments > 0 && (<Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
      {batch.pendingAssignments}
    </Badge>)}
    </Button>))}
    </div>
            </div>
      {
                  /* Announcement Banner */
            } {currentBatch.announcement && (<Alert><Bell className="h-4 w-4" />
                  <AlertTitle>Announcement</AlertTitle>
                  <AlertDescription>
      {currentBatch.announcement}
    </AlertDescription>
            </Alert>)} {
                  /* Main Content */
            }<div className="grid gap-6 md:grid-cols-3">
      {
                        /* Left Column - Batch Info & Next Class */
                  }<div className="md:col-span-2 space-y-6">
      {
                              /* Batch Overview Card */
                        }
    <Card>
                              <CardHeader><div className="flex items-start justify-between"><div className="flex items-center gap-4"><Avatar className="h-12 w-12">
                                                      <AvatarImage src={currentBatch.teacher.avatar} />
                                                      <AvatarFallback>
      {currentBatch.teacher.name.charAt(0)}
    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                      <CardTitle>
      {currentBatch.name}
    </CardTitle>
                                                      <CardDescription>Taught by {currentBatch.teacher.name}
    </CardDescription>
                                                </div>
                                          </div><Badge variant="secondary">
      {currentBatch.subject}
    </Badge>
                                    </div>
                              </CardHeader>
                              <CardContent><div className="grid grid-cols-3 gap-4 mb-4"><div className="text-center"><p className="text-2xl font-bold">
      {currentBatch.totalStudents}
    </p><p className="text-sm text-muted-foreground">Students</p>
                                          </div><div className="text-center"><p className="text-2xl font-bold">
      {currentBatch.progress}%</p><p className="text-sm text-muted-foreground">Progress</p>
                                          </div><div className="text-center"><p className="text-2xl font-bold">
      {currentBatch.pendingAssignments}
    </p><p className="text-sm text-muted-foreground">Pending</p>
                                          </div>
                                    </div><Progress value={currentBatch.progress} className="h-2" />
                              </CardContent>
                        </Card>
      {
                              /* Next Class Card */
                        }<Card className="border-primary">
                              <CardHeader>
                                    <div className="flex items-center justify-between">
                                          <CardTitle className="flex items-center gap-2">
                                                <Video className="h-5 w-5" />
                                                Next Live Class
                                          </CardTitle>
                                          <Badge variant="default" className="flex items-center gap-1">
                                                <>
                                                      <Timer className="h-3 w-3" />
                                                      {timeUntilClass()}
                                                </>
                                          </Badge>
                                    </div>
                              </CardHeader>
                              <CardContent><div className="space-y-4">
                                          <div><h3 className="font-semibold text-lg">
      {currentBatch.nextClass.topic}
    </h3><p className="text-sm text-muted-foreground">
      {currentBatch.nextClass.date} at {currentBatch.nextClass.time}
    </p>
                                          </div><div className="flex gap-2"><Button className="flex-1" onClick={handleJoinClass}><Play className="mr-2 h-4 w-4" /> Join Class </Button><Button variant="outline" onClick={handleAddToCalendar}><Calendar className="mr-2 h-4 w-4" /> Add to Calendar </Button>
                                          </div>
                                    </div>
                              </CardContent>
                        </Card>
      {
                              /* Tabs for Different Sections */
                        }
    <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="classes">Classes</TabsTrigger>
                              </TabsList><TabsContent value="overview" className="space-y-4">
      {
                                          /* Recent Performance */
                                    }
    <Card>
                                          <CardHeader>
                                                <CardTitle>Recent Performance</CardTitle>
                                                <CardDescription>Your performance in last 5 assignments</CardDescription>
                                          </CardHeader>
                                          <CardContent><div className="space-y-3">{[{ name: 'DPP #22', score: 8, total: 10 }, { name: 'Mock Test #3', score: 72, total: 100 }, { name: 'DPP #21', score: 9, total: 10 }, { name: 'Chapter Test', score: 85, total: 100 }, { name: 'DPP #20', score: 7, total: 10 }].map((item, index) => (<div key={index} className="flex items-center justify-between"><span className="text-sm">
      {item.name}
    </span><div className="flex items-center gap-2"><Progress value={(item.score / item.total) * 100} className="w-24 h-2" /><span className="text-sm font-medium">
      {item.score}/{item.total}
    </span>
                                                            </div>
                                                      </div>))}
    </div>
                                          </CardContent>
                                    </Card>
      {
                                          /* Batch Leaderboard */
                                    }
    <Card>
                                          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" /> Batch Leaderboard </CardTitle>
                                                <CardDescription>Top performers this week</CardDescription>
                                          </CardHeader>
                                          <CardContent><div className="space-y-3">{[{ rank: 1, name: 'You', score: 892, change: 'up' }, {
                                                            rank: 2,name: 'Rahul Kumar',
                                                            score: 889,change: 'up'
                                                      }, {
                                                            rank: 3,name: 'Priya Singh',
                                                            score: 876,change: 'down'
                                                      }, {
                                                            rank: 4,name: 'Amit Sharma',
                                                            score: 865,change: 'same'
                                                      }, {
                                                            rank: 5,name: 'Neha Patel',
                                                            score: 854,change: 'up'}].map((student) => (<div key={student.rank} className={`flex items-center justify-between p-2 rounded-lg ${student.name === 'You' ? 'bg-primary/10' : ''}`}><div className="flex items-center gap-3"><span className="font-bold text-lg w-8">#{student.rank}
    </span><Avatar className="h-8 w-8">
                                                                        <AvatarFallback>
      {student.name.charAt(0)}
    </AvatarFallback>
                                                                  </Avatar><span className="font-medium">
      {student.name}
    </span>
                                                            </div><div className="flex items-center gap-2"><span className="font-semibold">
      {student.score}</span>{student.change === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />} {student.change === 'down' && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
    </div>
                                                      </div>))}
    </div>
                                          </CardContent>
                                    </Card>
                              </TabsContent><TabsContent value="assignments" className="space-y-4">{assignments.map((assignment) => (<Card key={assignment.id} className={assignment.status === 'overdue' ? 'border-destructive' : ''}><CardContent className="pt-6"><div className="flex items-start justify-between"><div className="space-y-2"><div className="flex items-center gap-2"><Badge variant={assignment.type === 'DPP' ? 'default' : assignment.type === 'Test' ? 'secondary' : 'outline'}>
      {assignment.type}
    </Badge><h3 className="font-semibold">
      {assignment.title}
    </h3>
                                                            </div><div className="flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><FileText className="h-3 w-3" />
      {assignment.questions} questions </span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />
      {assignment.duration} min </span><span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due: {assignment.dueDate}
    </span></div>{assignment.status === 'completed' && assignment.score && (<div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-sm"> Score: <strong>
      {assignment.score}/{assignment.maxScore}
      </strong>
                                                                  </span>
                                                            </div>)}
    </div><div>{assignment.status === 'pending' ? (<Button size="sm" onClick={() => handleStartAssignment(assignment.id)}> Start <ChevronRight className="ml-1 h-4 w-4" /></Button>) : assignment.status === 'completed' ? (<Button variant="outline" size="sm" onClick={() => handleReviewAssignment(assignment.id)} > Review </Button>) : (<Badge variant="destructive">Overdue</Badge>)}
    </div>
                                                </div>
                                          </CardContent>
                                    </Card>))}
    </TabsContent><TabsContent value="classes" className="space-y-4">
      {classSessions.map((session) => (<Card key={session.id}><CardContent className="pt-6"><div className="flex items-start justify-between"><div className="space-y-2"><div className="flex items-center gap-2">{session.status === 'live' && (<Badge variant="destructive" className="animate-pulse"><div className="h-2 w-2 bg-white rounded-full mr-1" /> LIVE </Badge>)}<h3 className="font-semibold">
      {session.topic}
    </h3>
                                                            </div><p className="text-sm text-muted-foreground">
      {session.date} at {session.time}</p>{session.status === 'completed' && session.attendance && (<div className="flex items-center gap-4 text-sm"><span className="flex items-center gap-1 text-green-600"><CheckCircle className="h-3 w-3" /> Attended </span>{session.recording && (<Button variant="link" size="sm" className="h-auto p-0" onClick={() => handleWatchRecording(session.recording)} ><Video className="h-3 w-3 mr-1" /> Watch Recording </Button>)} {session.notes && (<Button variant="link" size="sm" className="h-auto p-0" onClick={() => handleDownloadNotes(session.notes)} ><Download className="h-3 w-3 mr-1" /> Download Notes </Button>)}
    </div>)}
    </div><div>{session.status === 'upcoming' && (<Button variant="outline" size="sm" onClick={handleSetReminder} > Set Reminder </Button>)} {session.status === 'live' && (<Button size="sm" onClick={handleJoinClass}> Join Now </Button>)}
    </div>
                                                </div>
                                          </CardContent>
                                    </Card>))}
    </TabsContent>
                        </Tabs>
                  </div>
      {
                        /* Right Column - Quick Actions & Stats */
                  }<div className="space-y-6">
      {
                              /* Quick Actions */
                        }
    <Card>
                              <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                              </CardHeader><CardContent className="space-y-2"><Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('doubt')} ><MessageSquare className="mr-2 h-4 w-4" /> Ask Doubt </Button><Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('material')} ><BookOpen className="mr-2 h-4 w-4" /> Study Material </Button><Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('report')} ><BarChart3 className="mr-2 h-4 w-4" /> Performance Report </Button><Button variant="outline" className="w-full justify-start" onClick={() => handleQuickAction('members')} ><Users className="mr-2 h-4 w-4" /> Batch Members </Button>
                              </CardContent>
                        </Card>
      {
                              /* Stats */
                        }
    <Card>
                              <CardHeader>
                                    <CardTitle>Your Stats</CardTitle><CardDescription>This month's performance</CardDescription>
                              </CardHeader><CardContent className="space-y-4">
                                    <div><div className="flex items-center justify-between mb-1"><span className="text-sm">Attendance</span><span className="text-sm font-medium">92%</span>
                                          </div><Progress value={92} className="h-2" />
                                    </div>
                                    <div><div className="flex items-center justify-between mb-1"><span className="text-sm">Assignment Completion</span><span className="text-sm font-medium">88%</span>
                                          </div><Progress value={88} className="h-2" />
                                    </div>
                                    <div><div className="flex items-center justify-between mb-1"><span className="text-sm">Average Score</span><span className="text-sm font-medium">78%</span>
                                          </div><Progress value={78} className="h-2" />
                                    </div>
                                    <Separator /><div className="text-center"><p className="text-2xl font-bold">3rd</p><p className="text-sm text-muted-foreground">Batch Rank</p>
                                    </div>
                              </CardContent>
                        </Card>
      {
                              /* Upcoming Events */
                        }
    <Card>
                              <CardHeader>
                                    <CardTitle>Upcoming Events</CardTitle>
                              </CardHeader>
                              <CardContent><ScrollArea className="h-[200px]"><div className="space-y-3">
      {[{
                                                      type: 'test',title: 'Mock Test #4',date: 'Jan 20',time: '10:00 AM'
                                                }, {type: 'class',title: 'Doubt Solving Session',date: 'Jan 18',time: '7:00 PM'
                                                }, {type: 'deadline',title: 'Assignment Due',date: 'Jan 17',time: '11:59 PM'
                                                }, {type: 'event',title: 'Parent-Teacher Meet',date: 'Jan 25',time: '5:00 PM'}].map((event, index) => (<div key={index} className="flex items-start gap-3"><div className={`h-2 w-2 rounded-full mt-1.5 ${event.type === 'test' ? 'bg-red-500' : event.type === 'class' ? 'bg-blue-500' : event.type === 'deadline' ? 'bg-yellow-500' : 'bg-green-500'}`} /><div className="flex-1"><p className="text-sm font-medium">
      {event.title}
    </p><p className="text-xs text-muted-foreground">
      {event.date} • {event.time}
    </p>
                                                      </div>
                                                </div>))}
    </div>
                                    </ScrollArea>
                              </CardContent>
                        </Card>
                  </div>
            </div>
      </div>
  )
}

export default BatchDashboard;
