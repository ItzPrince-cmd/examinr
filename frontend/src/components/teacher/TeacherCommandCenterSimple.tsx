import React, { useState } from 'react';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Activity,
  AlertCircle,
  CheckCircle,
  Star,
  Zap,
  Target,
  Brain,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  performance: 'excellent' | 'good' | 'average' | 'struggling';
  lastActive: Date;
  activityLevel: number;
  recentScore?: number;
}

interface ClassEcosystem {
  id: string;
  name: string;
  subject: string;
  grade: string;
  students: Student[];
  nextClass: Date;
  averagePerformance: number;
  activeNow: number;
  recentActivity: {
    type: 'test' | 'assignment' | 'discussion';
    title: string;
    time: Date;
  }[];
}

interface TeacherCommandCenterProps {
  classes: ClassEcosystem[];
  onClassSelect: (classId: string) => void;
  onStudentSelect: (studentId: string, classId: string) => void;
}

const TeacherCommandCenter: React.FC<TeacherCommandCenterProps> = ({
  classes,
  onClassSelect,
  onStudentSelect,
}) => {
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const getPerformanceColor = (performance: string) => {
    const colors = {
      excellent: 'from-green-500 to-emerald-500',
      good: 'from-blue-500 to-indigo-500',
      average: 'from-yellow-500 to-orange-500',
      struggling: 'from-red-500 to-pink-500',
    };

    return colors[performance as keyof typeof colors] || colors.average;
  };

  const getPerformanceIcon = (performance: string) => {
    const icons = {
      excellent: Award,
      good: Star,
      average: Target,
      struggling: AlertCircle,
    };

    return icons[performance as keyof typeof icons] || Target;
  };

  const ClassCard = ({ classData }: { classData: ClassEcosystem }) => {
    return (
      <Card className="overflow-hidden cursor-pointer" onClick={() => onClassSelect(classData.id)}>
        <CardHeader className="relative pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{classData.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {classData.subject} • {classData.grade}
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {classData.activeNow}/{classData.students.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Performance Overview */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Class Average</span>
              <span className="font-semibold">{classData.averagePerformance}%</span>
            </div>
            <Progress value={classData.averagePerformance} className="h-2" />
          </div>
          {/* Student Performance Distribution */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {['excellent', 'good', 'average', 'struggling'].map((level) => {
              const count = classData.students.filter((s) => s.performance === level).length;

              const Icon = getPerformanceIcon(level);
              return (
                <div key={level} className="space-y-1">
                  <div
                    className={cn(
                      'p-2 rounded-lg bg-gradient-to-br',
                      getPerformanceColor(level),
                      'bg-opacity-10'
                    )}
                  >
                    <Icon className="h-4 w-4 mx-auto text-foreground" />
                  </div>
                  <p className="text-xs font-medium">{count}</p>
                </div>
              );
            })}
          </div>
          {/* Recent Activity */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Activity</h4>
            {classData.recentActivity.slice(0, 2).map((activity, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
                <span>{activity.title}</span>
              </div>
            ))}
          </div>
          {/* Next Class Time */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {' '}
              Next class:{' '}
              {new Date(classData.nextClass).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StudentRow = ({ student, classId }: { student: Student; classId: string }) => {
    const Icon = getPerformanceIcon(student.performance);
    return (
      <div
        className="flex items-center gap-4 p-3 rounded-lg border cursor-pointer"
        onClick={() => onStudentSelect(student.id, classId)}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={student.avatar} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{student.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className={cn('text-xs', getPerformanceColor(student.performance))}
            >
              {student.performance}
            </Badge>
            {student.recentScore && (
              <span className="text-xs text-muted-foreground"> Score: {student.recentScore}% </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span className="text-xs">{Math.round(student.activityLevel * 100)}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Class Command Center</h2>
          <p className="text-muted-foreground">Monitor and manage your classes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('grid')}
            className={cn(
              'px-3 py-1 rounded-md text-sm',
              selectedView === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            {' '}
            Grid View{' '}
          </button>
          <button
            onClick={() => setSelectedView('list')}
            className={cn(
              'px-3 py-1 rounded-md text-sm',
              selectedView === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            {' '}
            List View{' '}
          </button>
        </div>
      </div>
      {/* Classes Grid/List */}{' '}
      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map((classData) => (
            <Card key={classData.id}>
              <CardHeader>
                <CardTitle>{classData.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {classData.subject} • {classData.grade}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classData.students.map((student) => (
                    <StudentRow key={student.id} student={student} classId={classData.id} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCommandCenter;
