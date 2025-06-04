import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { toast } from '../components/ui/use-toast';

import {
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Users,
  BookOpen,
  Target,
  Sparkles,
  School,
  Briefcase,
  Award,
  Brain,
  Calendar,
  Clock,
  ChevronRight} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import api from '../services/api';

// Password strength calculator
const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-red-500' };
  if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-yellow-500' };
  return { score: 100, label: 'Strong', color: 'bg-green-500' };
}

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

interface OnboardingData {
  // Step 1
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  // Step 2
  role: 'student' | 'teacher' | null;
  // Step 3 - Student
  educationLevel?: string;
  subjects?: string[];
  examGoals?: string[];
  // Step 3 - Teacher
  teachingExperience?: string;
  teachingSubjects?: string[];
  institution?: string;
  // Step 4
  studySchedule?: string;
  learningStyle?: string;
  notifications?: boolean;
  // Step 5
  tourCompleted?: boolean;
}

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: null,
    subjects: [],
    examGoals: [],
    teachingSubjects: [],
    notifications: true,
    tourCompleted: false
  });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [emailValid, setEmailValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  // Update password strength when password changes
  useEffect(() => {
    if (data.password) {
      setPasswordStrength(calculatePasswordStrength(data.password));
    }
  }, [data.password]);
  // Check if passwords match
  useEffect(() => {
    if (data.confirmPassword) {
      setPasswordsMatch(data.password === data.confirmPassword);
    }
  }, [data.password, data.confirmPassword]);
  // Validate email
  useEffect(() => {
    if (data.email) {
      setEmailValid(validateEmail(data.email));
    }
  }, [data.email]);
  const handleNext = async() => {
    try {
      if (currentStep === 1) {
        // Validate step 1
        if (!data.email || !data.password || !data.confirmPassword || !data.firstName || !data.lastName) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields",
            variant: "destructive"
          });
          return;
        }
        if (!emailValid) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address",
            variant: "destructive"
          });
          return;
        }
        if (!passwordsMatch) {
          toast({
            title: "Passwords Don't Match",
            description: "Please make sure your passwords match",
            variant: "destructive"
          });
          return;
        }
        if (passwordStrength.score < 66) {
          toast({
            title: "Weak Password",
            description: "Please choose a stronger password",
            variant: "destructive"
          });
          return;
        }
      }
      if (currentStep === 2 && !data.role) {
        toast({
          title: "Select Your Role",
          description: "Please choose whether you're a student or teacher",
          variant: "destructive"
  });
  return
} if (currentStep < 5) {
  setCurrentStep(currentStep + 1

  )
} else { // Complete registration await handleRegistration()
} } catch (error) {console.error('Navigation error:', error

  );
  toast({title: "Error",description: "Something went wrong. Please try again.",variant: "destructive"
  }

  )
} };

const handleBack = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1

    )
}
};

const handleRegistration = async() => {
  setIsLoading(true);
  try {
    console.log('Starting registration with data:', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    });
    
    // Register the user
    const response = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'student'
    });
    
    console.log('Registration response:', response.data);
    if (response.data.success || response.data.user) {
      // Store user and token
      const userData = response.data.user || response.data.data?.user;
      const token = response.data.token || response.data.data?.token;
      
      if (userData && token) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Call login from auth context to update state
        await login(data.email, data.password);
      }
      
      toast({
        title: "Welcome to Examinr!",
        description: "Your account has been created successfully",
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    
    const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
    toast({
      title: "Registration Failed",
      description: errorMessage,
      variant: "destructive"
    });
    
    // If user already exists, offer to go to login
    if (errorMessage.toLowerCase().includes('already exists')) {
      setTimeout(() => {
        if (window.confirm('User already exists. Would you like to login instead?')) {
          navigate('/login');
        }
      }, 1000);
    }
  } finally {
    setIsLoading(false);
  }
};

const renderStep = () => {
  switch (currentStep) {
    case 1: return <Step1 data={data} setData={setData} showPassword={showPassword} setShowPassword={setShowPassword} passwordStrength={passwordStrength} emailValid={emailValid} passwordsMatch={passwordsMatch} />;
    case 2: return <Step2 data={data} setData={setData} />;
    case 3: return data.role === 'student' ? <Step3Student data={data} setData={setData} /> : <Step3Teacher data={data} setData={setData} />;
    case 4: return <Step4 data={data} setData={setData} />;
    case 5: return <Step5 data={data} />;
    default: return null;
}
};

return (<div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4"><div className="max-w-2xl w-full">
      {
        /* Progress bar */
      }<div className="mb-8"><div className="flex justify-between items-center mb-2"><h1 className="text-2xl font-bold">Create Your Account</h1><span className="text-sm text-muted-foreground">Step {currentStep} of 5</span>
        </div><Progress value={(currentStep / 5) * 100} className="h-2" />
      </div>
      {
        /* Form content */} {React.createElement(AnimatePresence as any, { mode: "wait" }, <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} >
        {renderStep()}
      </motion.div>)} {
        /* Navigation buttons */
      }<div className="flex justify-between mt-6"><Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2" ><ArrowLeft className="w-4 h-4" /> Back </Button><Button onClick={handleNext} disabled={isLoading} className="flex items-center gap-2" >{currentStep === 5 ? 'Get Started' : 'Next'}<ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
)
}

// Step 1: Basic Registration
const Step1: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  passwordStrength: {
    score: number;
    label: string;
    color: string;
  };
  emailValid: boolean;
  passwordsMatch: boolean;
}> = ({
  data,
  setData,
  showPassword,
  setShowPassword,
  passwordStrength,
  emailValid,
  passwordsMatch
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Examinr!</CardTitle><CardDescription>Let's start with your basic information</CardDescription>
      </CardHeader>
      <CardContent><form className="space-y-4" onSubmit={(e) => e.preventDefault()}><div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" placeholder="John" value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value }
              )
              } />
            </div>
            <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" placeholder="Doe" value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value }
              )
              } />
            </div>
          </div>
          <div><Label htmlFor="email">Email</Label><div className="relative"><Input id="email" type="email" placeholder="john.doe@example.com" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value }
              )
              } className={data.email && !emailValid ? 'border-red-500' : ''} />{data.email && (<div className="absolute right-2 top-1/2 -translate-y-1/2">{emailValid ? (<Check className="w-4 h-4 text-green-500" />) : (<X className="w-4 h-4 text-red-500" />)}
              </div>)}
            </div>{data.email && !emailValid && (<p className="text-sm text-red-500 mt-1">Please enter a valid email address</p>)}
          </div>
          <div><Label htmlFor="password">Password</Label><div className="relative"><Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value }
              )} autoComplete="new-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" >{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>{data.password && (<div className="mt-2 space-y-1"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Password strength:</span><Badge variant={passwordStrength.score === 100 ? 'default' : 'secondary'}>
                  {passwordStrength.label}
                </Badge>
              </div><div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${passwordStrength.score}%` }} />
              </div>
            </div>)}
          </div>
          <div><Label htmlFor="confirmPassword">Confirm Password</Label><div className="relative"><Input id="confirmPassword" type="password" placeholder="Confirm your password" value={data.confirmPassword} onChange={(e) => setData({ ...data, confirmPassword: e.target.value })} className={data.confirmPassword && !passwordsMatch ? 'border-red-500' : ''} autoComplete="new-password" />{data.confirmPassword && (<div className="absolute right-2 top-1/2 -translate-y-1/2">{passwordsMatch ? (<Check className="w-4 h-4 text-green-500" />) : (<X className="w-4 h-4 text-red-500" />)}
              </div>)}</div>{data.confirmPassword && !passwordsMatch && (<p className="text-sm text-red-500 mt-1">Passwords don't match</p>)}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Step 2: Role Selection
const Step2: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => {
  return (<div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Role</CardTitle>
          <CardDescription>Select how you'll be using Examinr</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Card 
                className={`cursor-pointer transition-all ${data.role === 'student' ? 'ring-2 ring-primary bg-primary/5' : ''}`} 
                onClick={() => setData({ ...data, role: 'student' })}
              >
                <CardContent className="p-6 text-center">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">I'm a Student</h3>
                  <p className="text-sm text-muted-foreground">
                    Prepare for exams, track progress, and achieve your academic goals
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Card 
                className={`cursor-pointer transition-all ${data.role === 'teacher' ? 'ring-2 ring-primary bg-primary/5' : ''}`} 
                onClick={() => setData({ ...data, role: 'teacher' })}
              >
                <CardContent className="p-6 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-secondary" />
                  <h3 className="text-lg font-semibold mb-2">I'm a Teacher</h3>
                  <p className="text-sm text-muted-foreground">
                    Create exams, manage students, and track their performance
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Step 3 for Students
const Step3Student: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => {
  const educationLevels = ['High School', 'Undergraduate', 'Graduate', 'Professional'];const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'History', 'Geography', 'Economics', 'Business'];const examTypes = ['SAT', 'GRE', 'GMAT', 'MCAT', 'LSAT', 'AP Exams', 'Final Exams', 'Entrance Exams'];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalize Your Experience</CardTitle>
        <CardDescription>Tell us about your educational journey</CardDescription>
      </CardHeader><CardContent className="space-y-6">
        <div>
          <Label>Education Level</Label><div className="grid grid-cols-2 gap-2 mt-2">{educationLevels.map((level) => (<Button key={level} variant={data.educationLevel === level ? 'default' : 'outline'} size="sm" onClick={() => setData({ ...data, educationLevel: level }
            )} className="justify-start" ><School className="w-4 h-4 mr-2" />
              {level}
            </Button>))}
          </div>
        </div>
        <div><Label>Subjects You're Studying</Label><p className="text-sm text-muted-foreground mb-2">Select all that apply</p><div className="grid grid-cols-2 gap-2">{subjects.map((subject) => (<Button key={subject} variant={data.subjects?.includes(subject) ? 'default' : 'outline'} size="sm" onClick={() => {
    const newSubjects = data.subjects?.includes(subject) ? data.subjects.filter(s => s !== subject) : [...(data.subjects || []), subject];
            setData({...data, subjects: newSubjects }

            )}} className="justify-start" ><BookOpen className="w-4 h-4 mr-2" />
            {subject}
          </Button> ))}
        </div>
      </div>
      <div>
        <Label>Exam Goals</Label><p className="text-sm text-muted-foreground mb-2">What are you preparing for?</p><div className="grid grid-cols-2 gap-2">{examTypes.map((exam) => (<Button key={exam} variant={data.examGoals?.includes(exam) ? 'default' : 'outline'} size="sm" onClick={() => {
    const newGoals = data.examGoals?.includes(exam) ? data.examGoals.filter(g => g !== exam) : [...(data.examGoals || []), exam];
          setData({...data, examGoals: newGoals }

          )}} className="justify-start" ><Target className="w-4 h-4 mr-2" />
          {exam}
        </Button> ))}
      </div>
    </div>
</CardContent >
</Card >
  )
}

// Step 3 for Teachers
const Step3Teacher: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => {
  const experienceLevels = ['0-2 years', '3-5 years', '5-10 years', '10+ years'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Literature', 'History', 'Geography', 'Economics', 'Business'];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Teaching Profile</CardTitle>
        <CardDescription>Help us understand your teaching background</CardDescription>
      </CardHeader><CardContent className="space-y-6">
        <div><Label htmlFor="institution">Institution</Label><Input id="institution" placeholder="Enter your school or institution name" value={data.institution || ''} onChange={(e) => setData({ ...data, institution: e.target.value }
          )} className="mt-2" />
        </div>
        <div>
          <Label>Teaching Experience</Label><div className="grid grid-cols-2 gap-2 mt-2">{experienceLevels.map((level) => (<Button key={level} variant={data.teachingExperience === level ? 'default' : 'outline'} size="sm" onClick={() => setData({ ...data, teachingExperience: level }
            )} className="justify-start" ><Briefcase className="w-4 h-4 mr-2" />
              {level}
            </Button>))}
          </div>
        </div>
        <div>
          <Label>Subjects You Teach</Label><p className="text-sm text-muted-foreground mb-2">Select all that apply</p><div className="grid grid-cols-2 gap-2">{subjects.map((subject) => (<Button key={subject} variant={data.teachingSubjects?.includes(subject) ? 'default' : 'outline'} size="sm" onClick={() => {
    const newSubjects = data.teachingSubjects?.includes(subject) ? data.teachingSubjects.filter(s => s !== subject) : [...(data.teachingSubjects || []), subject];
            setData({...data, teachingSubjects: newSubjects }

            )}} className="justify-start" ><BookOpen className="w-4 h-4 mr-2" />
            {subject}
          </Button> ))}
        </div>
      </div>
    </CardContent>
</Card >
  )
}

// Step 4: Preferences
const Step4: React.FC<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}> = ({ data, setData }) => {
  const schedules = ['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-12AM)', 'Flexible'];
  const learningStyles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Your Preferences</CardTitle>
        <CardDescription>Customize your learning experience</CardDescription>
      </CardHeader><CardContent className="space-y-6">{data.role === 'student' && (<>
          <div>
            <Label>Preferred Study Schedule</Label><div className="grid grid-cols-2 gap-2 mt-2">{schedules.map((schedule) => (<Button key={schedule} variant={data.studySchedule === schedule ? 'default' : 'outline'} size="sm" onClick={() => setData({ ...data, studySchedule: schedule }
              )} className="justify-start" ><Clock className="w-4 h-4 mr-2" />
                {schedule}
              </Button>))}
            </div>
          </div>
          <div>
            <Label>Learning Style</Label><div className="grid grid-cols-2 gap-2 mt-2">{learningStyles.map((style) => (<Button key={style} variant={data.learningStyle === style ? 'default' : 'outline'} size="sm" onClick={() => setData({ ...data, learningStyle: style }
              )} className="justify-start" ><Brain className="w-4 h-4 mr-2" />
                {style}
              </Button>))}
            </div>
          </div>
        </>)}
        <div>
          <Label>Notifications</Label><Card className="mt-2"><CardContent className="p-4"><div className="flex items-center justify-between">
                <div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground"> Receive updates about your {data.role === 'student' ? 'progress and upcoming exams' : 'students and exam results'}
                  </p></div><Button variant={data.notifications ? 'default' : 'outline'} size="sm" onClick={() => setData({ ...data, notifications: !data.notifications }
                )
                } >{data.notifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

// Step 5: Welcome
const Step5: React.FC<{
  data: OnboardingData;
}> = ({ data }) => {
  const features = data.role === 'student' ? [{
    icon: BookOpen,title: 'Practice Tests',description: 'Access thousands of practice questions'
  }, {
    icon: Target,title: 'Progress Tracking',description: 'Monitor your improvement over time'
  }, {
    icon: Award,title: 'Achievements',description: 'Earn badges as you reach milestones'
  }, {
    icon: Calendar,title: 'Study Schedule',description: 'Stay organized with personalized plans'
  }] : [{
    icon: Users,title: 'Student Management',description: 'Track and manage your students'
  }, {
    icon: BookOpen,title: 'Exam Creation',description: 'Build custom exams easily'
  }, {
    icon: Target,title: 'Analytics',description: 'Detailed insights on student performance'
  }, {
    icon: Award,title: 'Grading Tools',description: 'Efficient grading and feedback system'
  }];
  return (
    <Card><CardHeader className="text-center"><div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"><Sparkles className="w-8 h-8 text-primary" />
        </div><CardTitle className="text-2xl">Welcome to Examinr, {data.firstName}!</CardTitle><CardDescription> Your account is all set up. Here's what you can do: </CardDescription>
      </CardHeader><CardContent className="space-y-4">
        {features.map((feature, index) => (<motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} >
          <Card><CardContent className="p-4 flex items-start gap-4"><div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0"><feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div><h4 className="font-medium">
                  {feature.title}
                </h4><p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div><ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            </CardContent>
          </Card>
        </motion.div>))}
      </CardContent>
    </Card>
  )
}

export default OnboardingFlow;
