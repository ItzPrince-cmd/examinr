import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

  import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Target,
  Check,
  AlertCircle,
  Plus,
  X} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';
import { toast } from '../../components/ui/use-toast';
import { Separator } from '../../components/ui/separator';

// Types 
interface BatchFormData { 
  // Basic Info 
  name: string;
  description: string;
  level: string;
  subjects: string[];
  // Schedule 
  startDate: string;
  endDate: string;
  classDays: string[];
  classTime: string;
  duration: number;
  // Settings 
  maxStudents: number;
  enrollmentType: 'open' | 'invite-only';
  feeAmount?: number;
  // Curriculum 
  totalTests: number;
  testFrequency: 'weekly' | 'biweekly' | 'monthly';
  includesDPP: boolean;dppFrequency?: 'daily' | 'alternate' | 'weekly'
}

  const BatchCreation: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1
  );
  const totalSteps = 4;
    const [formData, setFormData] = useState<BatchFormData>({name: '',description: '',level: '',
    subjects: [],startDate: '',endDate: '',
    classDays: [],classTime: '',
    duration: 90,
    maxStudents: 40,enrollmentType: 'open',
    feeAmount: undefined,
    totalTests: 20,testFrequency: 'weekly',
    includesDPP: true,dppFrequency: 'daily'
    });
  const [errors, setErrors] = useState<Partial<Record<keyof BatchFormData, string>>>({});
    const steps = [ {
    number: 1,title: 'Basic Information',
    icon: BookOpen
      }, {
    number: 2,title: 'Schedule & Timing',
    icon: Calendar
      }, {
    number: 3,title: 'Settings & Enrollment',
    icon: Users
      }, {
    number: 4,title: 'Curriculum & Tests',
    icon: Target
    } ];const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'];const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof BatchFormData, string>> = {};
switch (step) { case 1: if (!formData.name) newErrors.name = 'Batch name is required';if (!formData.level) newErrors.level = 'Please select a level';if (formData.subjects.length === 0) newErrors.subjects = 'Select at least one subject';
      break;case 2: if (!formData.startDate) newErrors.startDate = 'Start date is required';if (!formData.endDate) newErrors.endDate = 'End date is required';if (formData.classDays.length === 0) newErrors.classDays = 'Select at least one class day';if (!formData.classTime) newErrors.classTime = 'Class time is required';
      break;case 3: if (formData.maxStudents < 1) newErrors.maxStudents = 'Must have at least 1 student';
      break;case 4: if (formData.totalTests < 1) newErrors.totalTests = 'Must have at least 1 test';
      break
} setErrors(newErrors

    );
    return Object.keys(newErrors).length === 0
}

    const handleNext = () => {
        if (validateStep(currentStep)) { if (currentStep < totalSteps) { setCurrentStep(currentStep + 1

        )
} else { handleSubmit()
} } };

    const handlePrevious = () => {
      if (currentStep > 1) { setCurrentStep(currentStep - 1

      )
} };

  const handleSubmit = async () => {
    try { 
      // Here you would make an API call to create the batch 
      toast({ 
        title: "Batch created successfully", 
        description: `${formData.name} has been created and is ready for enrollment.` 
      });
      navigate('/teacher/batches');
    } catch (error) { 
      toast({
        title: "Failed to create batch",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject) ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject]
    }));
  }

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      classDays: prev.classDays.includes(day) ? prev.classDays.filter(d => d !== day) : [...prev.classDays, day]
    }));
  }

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-4xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4" ><Button variant="ghost" size="icon" onClick={() => navigate('/teacher/batches')} ><ArrowLeft className="h-4 w-4" />
  </Button>
  <div><h1 className="text-3xl font-bold">Create New Batch</h1><p className="text-muted-foreground mt-1"> Set up a new batch for your students </p>
  </div>
  </motion.div>
      {
    /* Progress Steps */
    }<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex justify-between items-center" >{steps.map((step, index) => ( <div key={step.number} className="flex items-center flex-1"><div className="flex flex-col items-center"><div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${ currentStep > step.number ? 'bg-primary text-primary-foreground' : currentStep === step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground' }`} >{currentStep > step.number ? ( <Check className="h-5 w-5" /> ) : ( <step.icon className="h-5 w-5" /> )}
    </div><span className="text-sm mt-2 text-center hidden sm:block">
      {step.title}
    </span>
    </div>{index < steps.length - 1 && ( <div className="flex-1 mx-4"><div className={`h-1 rounded transition-colors ${ currentStep > step.number ? 'bg-primary' : 'bg-muted' }`} />
    </div> )}
    </div> ))}
    </motion.div>
      {
    /* Form Content */
    }
    <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} >
  <Card>
  <CardHeader>
  <CardTitle>
      {steps[currentStep - 1].title}
    </CardTitle>
  <CardDescription>{currentStep === 1 && 'Enter basic details about your batch'} {currentStep === 2 && 'Set up the class schedule and timing'} {currentStep === 3 && 'Configure enrollment and batch settings'} {currentStep === 4 && 'Define curriculum and assessment structure'}
    </CardDescription>
  </CardHeader><CardContent className="space-y-6">
      {
    /* Step 1: Basic Information */
      } {currentStep === 1 && ( <><div className="space-y-2"><Label htmlFor="name">Batch Name *</Label><Input id="name" placeholder="e.g., JEE Advanced 2024 Batch A" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value }
      )
      } />{errors.name && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.name}
    </p> )}
    </div><div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" placeholder="Brief description of the batch..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value }
      )
      } rows={3} />
    </div><div className="space-y-2">
    <Label>Course Level *</Label>
      <RadioGroup value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value }
      )
      } ><div className="grid grid-cols-2 gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="JEE Main" id="jee-main" /><Label htmlFor="jee-main" className="cursor-pointer">JEE Main</Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="JEE Advanced" id="jee-advanced" /><Label htmlFor="jee-advanced" className="cursor-pointer">JEE Advanced</Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="NEET" id="neet" /><Label htmlFor="neet" className="cursor-pointer">NEET</Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="Foundation" id="foundation" /><Label htmlFor="foundation" className="cursor-pointer">Foundation</Label>
    </div>
    </div>
    </RadioGroup>{errors.level && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.level}
    </p> )}
    </div><div className="space-y-2">
    <Label>Subjects *</Label><div className="flex flex-wrap gap-2">{subjects.map((subject) => ( <Badge key={subject} variant={formData.subjects.includes(subject) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleSubject(subject)} >{formData.subjects.includes(subject) && ( <Check className="h-3 w-3 mr-1" /> )} {subject}
    </Badge> ))}
    </div>{errors.subjects && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.subjects}
    </p> )}
    </div>
    </> )} {
    /* Step 2: Schedule & Timing */
      } {currentStep === 2 && ( <><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="startDate">Start Date *</Label><Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value }
      )
      } />{errors.startDate && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.startDate}
    </p> )}
    </div><div className="space-y-2"><Label htmlFor="endDate">End Date *</Label><Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value }
      )
      } />{errors.endDate && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.endDate}
    </p> )}
    </div>
    </div><div className="space-y-2">
    <Label>Class Days *</Label><div className="flex flex-wrap gap-2">{weekDays.map((day) => ( <Badge key={day} variant={formData.classDays.includes(day) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleDay(day)} >{formData.classDays.includes(day) && ( <Check className="h-3 w-3 mr-1" /> )} {day.slice(0, 3)}
    </Badge> ))}
    </div>{errors.classDays && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.classDays}
    </p> )}
    </div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="classTime">Class Time *</Label><Input id="classTime" type="time" value={formData.classTime} onChange={(e) => setFormData({ ...formData, classTime: e.target.value }
      )
      } />{errors.classTime && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.classTime}
    </p> )}
    </div><div className="space-y-2"><Label htmlFor="duration">Duration (minutes)</Label><Input id="duration" type="number" value={formData.duration} onChange={(e) => setFormData({
        ...formData,
        duration: parseInt(e.target.value) || 0
        }
      )} min="30" max="180" />
    </div>
    </div>
    </> )} {
    /* Step 3: Settings & Enrollment */
      } {currentStep === 3 && ( <><div className="space-y-2"><Label htmlFor="maxStudents">Maximum Students *</Label><Input id="maxStudents" type="number" value={formData.maxStudents} onChange={(e) => setFormData({
        ...formData,
        maxStudents: parseInt(e.target.value) || 0
        }
      )} min="1" max="100" />{errors.maxStudents && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.maxStudents}
    </p> )}
    </div><div className="space-y-2">
    <Label>Enrollment Type</Label><RadioGroup value={formData.enrollmentType} onValueChange={(value: 'open' | 'invite-only') => setFormData({ ...formData, enrollmentType: value }
      )
      } ><div className="space-y-2"><div className="flex items-center space-x-2"><RadioGroupItem value="open" id="open" /><Label htmlFor="open" className="cursor-pointer"> Open Enrollment - Students can join directly </Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="invite-only" id="invite-only" /><Label htmlFor="invite-only" className="cursor-pointer"> Invite Only - Students need invitation to join </Label>
    </div>
    </div>
    </RadioGroup>
    </div><div className="space-y-2"><Label htmlFor="feeAmount">Batch Fee (Optional)</Label><Input id="feeAmount" type="number" placeholder="Enter amount in ₹" value={formData.feeAmount || ''} onChange={(e) => setFormData({
        ...formData,
        feeAmount: e.target.value ? parseInt(e.target.value) : undefined
        }
      )} min="0" /><p className="text-sm text-muted-foreground"> Leave empty if this is a free batch </p>
    </div>
    </> )} {
    /* Step 4: Curriculum & Tests */
      } {currentStep === 4 && ( <><div className="space-y-2"><Label htmlFor="totalTests">Total Number of Tests *</Label><Input id="totalTests" type="number" value={formData.totalTests} onChange={(e) => setFormData({
        ...formData,
        totalTests: parseInt(e.target.value) || 0
        }
      )} min="1" max="100" />{errors.totalTests && ( <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />
      {errors.totalTests}
    </p> )}
    </div><div className="space-y-2">
    <Label>Test Frequency</Label><Select value={formData.testFrequency} onValueChange={(value: 'weekly' | 'biweekly' | 'monthly') => setFormData({ ...formData, testFrequency: value }
      )
      } >
    <SelectTrigger>
    <SelectValue />
    </SelectTrigger>
    <SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem>
    </SelectContent>
    </Select>
    </div><div className="space-y-2"><div className="flex items-center space-x-2"><Checkbox id="includesDPP" checked={formData.includesDPP} onCheckedChange={(checked) => setFormData({ ...formData, includesDPP: checked as boolean }
      )
      } /><Label htmlFor="includesDPP" className="cursor-pointer"> Include Daily Practice Problems (DPP) </Label>
    </div>
    </div>{formData.includesDPP && ( <div className="space-y-2 pl-6">
      <Label>DPP Frequency</Label><Select value={formData.dppFrequency} onValueChange={(value: 'daily' | 'alternate' | 'weekly') => setFormData({ ...formData, dppFrequency: value }
        )
        } >
      <SelectTrigger>
      <SelectValue />
      </SelectTrigger>
      <SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="alternate">Alternate Days</SelectItem><SelectItem value="weekly">Weekly</SelectItem>
      </SelectContent>
      </Select>
    </div> )}
    <Separator />
      {
      /* Summary */
      }<div className="bg-muted p-4 rounded-lg space-y-2"><h4 className="font-medium">Batch Summary</h4><div className="text-sm space-y-1">
    <p>
    <strong>Name:</strong>
      {formData.name}
    </p>
    <p>
    <strong>Level:</strong>
      {formData.level}
    </p>
    <p>
    <strong>Subjects:</strong>{formData.subjects.join(', ')}
    </p>
    <p>
    <strong>Schedule:</strong>{formData.classDays.join(', ')} at {formData.classTime}
    </p>
    <p>
    <strong>Duration:</strong>
      {formData.startDate} to {formData.endDate}
    </p>
    <p>
    <strong>Max Students:</strong>
      {formData.maxStudents}
    </p>
      {formData.feeAmount && <p>
      <strong>Fee:</strong> ₹{formData.feeAmount}
    </p>}
    </div>
    </div>
  </> )}
    </CardContent>
  </Card>
  </motion.div>
      {
    /* Navigation Buttons */
    }<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between" ><Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} ><ArrowLeft className="mr-2 h-4 w-4" /> Previous </Button><Button onClick={handleNext} className={currentStep === totalSteps ? 'bg-gradient-to-r from-primary to-secondary' : ''} >{currentStep === totalSteps ? 'Create Batch' : 'Next'} {currentStep < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  </motion.div>
  </div>
  </div>
  )
}

export default BatchCreation;
