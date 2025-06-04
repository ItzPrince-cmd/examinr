import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence as AnimatePresenceBase } from 'framer-motion';

  import {
  GraduationCap,
  ChevronRight,
  School,
  User,
  BookOpen,
  PenTool,
  BookOpen as BookOpenIcon,
  CheckCircle,
  Calendar,
  Users} from "lucide-react";
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Type fix for AnimatePresence
const AnimatePresence = AnimatePresenceBase as any;

type UserRole = 'student' | 'instructor' | null;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [educationLevel, setEducationLevel] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

    const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 })
  };

    const selectRole = async (role: UserRole) => {
    setSelectedRole(role);
    
    // Update user role in backend
    try {
      await api.put('/users/profile', { role });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
    
    setStep(2);
  };

    const handleSubjectToggle = (subject: string) => {
    setSubjects((prev) => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

    const completeOnboarding = async () => {
    // Save onboarding data
    try {
      await api.put('/users/profile', {
        onboardingComplete: true,
        educationLevel: selectedRole === 'student' ? educationLevel : undefined,
        subjects: selectedRole === 'instructor' ? subjects : undefined
      });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
    
    navigate('/dashboard');
  };

    const getStepTitle = () => {
    switch (step) {
      case 1: return "Choose Your Role";
      case 2: return selectedRole === 'student' ? "What are you preparing for?" : "What subjects do you teach?";
      case 3: return "Complete Your Profile";
      default: return "";
    }
  };

    const getProgressPercentage = () => {
    return (step / 3) * 100;
  };

    const renderStepContent = () => {
    const direction = 1;
    return (
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step} 
            custom={direction} 
            variants={slideVariants} 
            initial="enter" 
            animate="center" 
            exit="exit" 
            transition={{ 
              x: { type: "spring", stiffness: 300, damping: 30 }, 
              opacity: { duration: 0.2 } 
            }} 
            className="w-full"
          >
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  onClick={() => selectRole('student')} 
                  className={`cursor-pointer transition-all ${ 
                    selectedRole === 'student' ? 'ring-2 ring-primary' : '' 
                  }`}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <School className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">I am a Student</h3>
                    <p className="text-muted-foreground text-sm">
                      Access exam papers, practice tests, and track your progress
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground flex flex-wrap justify-center gap-2">
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        <span>Study resources</span>
                      </div>
                      <div className="flex items-center">
                        <PenTool className="h-3 w-3 mr-1" />
                        <span>Practice tests</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        <span>Progress tracking</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card 
                  onClick={() => selectRole('instructor')} 
                  className={`cursor-pointer transition-all ${ 
                    selectedRole === 'instructor' ? 'ring-2 ring-primary' : '' 
                  }`}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">I am an Instructor</h3>
                    <p className="text-muted-foreground text-sm">
                      Create exam papers, manage question banks, and analyze student performance
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground flex flex-wrap justify-center gap-2">
                      <div className="flex items-center">
                        <BookOpenIcon className="h-3 w-3 mr-1" />
                        <span>Question bank</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Exam creation</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>Student analytics</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {step === 2 && selectedRole === 'student' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      value: "jee",
                      label: "JEE Preparation",
                      description: "Prepare for Joint Entrance Examination"
                    },
                    {
                      value: "neet",
                      label: "NEET Preparation",
                      description: "Prepare for Medical Entrance Exams"
                    },
                    {
                      value: "board",
                      label: "Board Exams",
                      description: "Prepare for CBSE, ICSE, or State Boards"
                    },
                    {
                      value: "other",
                      label: "Other Exams",
                      description: "Prepare for other competitive exams"
                    }
                  ].map((option) => (
                    <Card 
                      key={option.value} 
                      onClick={() => setEducationLevel(option.value)} 
                      className={`cursor-pointer transition-all ${ 
                        educationLevel === option.value ? 'ring-2 ring-primary' : '' 
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-center mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">
                            {option.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {option.description}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && selectedRole === 'instructor' && (
              <div className="space-y-6">
                <div className="text-muted-foreground text-center mb-6">
                  Select the subjects you teach (you can select multiple)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Social Studies'].map((subject) => (
                    <div 
                      key={subject} 
                      onClick={() => handleSubjectToggle(subject)} 
                      className={`border-2 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${ 
                        subjects.includes(subject) ? 'border-primary bg-primary/5' : 'border-muted' 
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${ 
                        subjects.includes(subject) ? 'bg-primary/10' : 'bg-muted' 
                      }`}>
                        <BookOpenIcon className={`h-5 w-5 ${ 
                          subjects.includes(subject) ? 'text-primary' : 'text-muted-foreground' 
                        }`} />
                      </div>
                      <span className={subjects.includes(subject) ? 'font-medium' : ''}>
                        {subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">You're Almost Done!</h3>
                  <p className="text-muted-foreground">
                    We've set up your {selectedRole === 'student' ? 'student' : 'instructor'} account. 
                    You can now access all the {selectedRole === 'student' ? 'learning materials' : 'teaching tools'} on Examinr.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-6">
                  <h4 className="text-lg font-medium mb-4">Account Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium capitalize">
                        {selectedRole}
                      </span>
                    </div>
                    {selectedRole === 'student' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preparing for:</span>
                        <span className="font-medium">
                          {educationLevel === 'jee' ? 'JEE' : 
                           educationLevel === 'neet' ? 'NEET' : 
                           educationLevel === 'board' ? 'Board Exams' : 'Other Exams'}
                        </span>
                      </div>
                    )}
                    {selectedRole === 'instructor' && subjects.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teaching:</span>
                        <span className="font-medium">{subjects.join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{user?.name || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
      >
        <motion.div variants={item} className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mb-4">
            <GraduationCap size={36} />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {getStepTitle()}
          </h2>
          <div className="w-full mt-6 mb-2">
            <Progress value={getProgressPercentage()} />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {step} of 3
          </p>
        </motion.div>
        <motion.div variants={item} className="mt-8">
          {renderStepContent()}
        </motion.div>
        <motion.div variants={item} className="flex justify-between mt-8">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div /> // Empty div to maintain flex spacing
          )}
          {step < 3 ? (
            <Button 
              onClick={() => setStep(step + 1)} 
              disabled={
                (step === 1 && !selectedRole) || 
                (step === 2 && selectedRole === 'student' && !educationLevel) || 
                (step === 2 && selectedRole === 'instructor' && subjects.length === 0)
              } 
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={completeOnboarding} 
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
