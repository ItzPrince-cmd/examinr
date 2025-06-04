import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

  import {
  Plus,
  Brain,
  Sparkles,
  Clock,
  BarChart,
  Smartphone,
  Tablet,
  Monitor,
  Printer,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Shuffle,
  Target,
  Zap,
  BookOpen,
  HelpCircle,
  DollarSign,
  Hash,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Code,
  X,
  ChevronLeft,
  ChevronRight} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

  interface Question { id: string;type: 'mcq' | 'short' | 'long' | 'numerical' | 'code' | 'audio' | 'video';
  title: string;
  subject: string;
  topic: string;difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeEstimate: number;
  tags: string[];
  usageCount: number;
  successRate: number
}

  interface TestSettings { duration: number;
  totalPoints: number;
  passingPercentage: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showTimer: boolean;
  allowNavigation: boolean;
  autoSubmit: boolean;
  instantFeedback: boolean
}

  interface AIAssistantState { isThinking: boolean;
  suggestions: Question[];
    balanceScore: { difficulty: number;
    topicCoverage: number;
    timeEstimate: number;
    overall: number
}
}

  interface TestCreationWizardProps { questionBank: Question[];
  onCreateTest: (test: any) => void;
  onCancel: () => void
}

  const TestCreationWizard: React.FC<TestCreationWizardProps> = ({ questionBank, onCreateTest, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0
  );
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]

  );
    const [testSettings, setTestSettings] = useState<TestSettings>({
    duration: 60,
    totalPoints: 100,
    passingPercentage: 60,
    shuffleQuestions: false,
    shuffleOptions: true,
    showTimer: true,
    allowNavigation: true,
    autoSubmit: true,
    instantFeedback: false
    });const [previewDevice, setPreviewDevice] = useState<'phone' | 'tablet' | 'laptop'>('laptop'

  );
      const [aiAssistant, setAiAssistant] = useState<AIAssistantState>({ isThinking: false, suggestions: [], balanceScore: {
      difficulty: 70,
      topicCoverage: 60,
      timeEstimate: 80,
      overall: 70
    } });
  const [draggedQuestion, setDraggedQuestion] = useState<Question | null>(null

  );const steps = ['Select Questions', 'Configure Test', 'Preview & Publish'];
    const getQuestionIcon = (type: string) => {
      const icons = {
      mcq: <Hash className="h-4 w-4" />,short: <FileText className="h-4 w-4" />,long: <FileText className="h-4 w-4" />,numerical: <DollarSign className="h-4 w-4" />,code: <Code className="h-4 w-4" />,audio: <Mic className="h-4 w-4" />,video: <Video className="h-4 w-4" />
      }
return icons[type as keyof typeof icons] || <HelpCircle className="h-4 w-4" />
}

    const getDifficultyColor = (difficulty: string) => {
      const colors = {easy: 'text-green-500 bg-green-500/10',medium: 'text-yellow-500 bg-yellow-500/10',hard: 'text-red-500 bg-red-500/10'
      }

    return colors[difficulty as keyof typeof colors] || colors.medium
}

    // AI Assistant Bot 
    const AIAssistantBot = () => {
      const requestSuggestions = () => {
        setAiAssistant(prev => ({ ...prev, isThinking: true }));
        
        // Simulate AI thinking 
        setTimeout(() => {
          const suggestions = questionBank
            .filter(q => !selectedQuestions.find(sq => sq.id === q.id))
            .slice(0, 5);
          setAiAssistant(prev => ({ 
            ...prev, 
            isThinking: false, 
            suggestions, 
            balanceScore: {
              difficulty: Math.floor(Math.random() * 30) + 70,
              topicCoverage: Math.floor(Math.random() * 30) + 70,
              timeEstimate: Math.floor(Math.random() * 30) + 70,
              overall: Math.floor(Math.random() * 30) + 70
            } 
          }));
        }, 1500);
      };

    return (<Card className="w-80 shadow-xl"><CardHeader className="pb-3"><div className="flex items-center gap-2">
        <motion.div animate={{ rotate: aiAssistant.isThinking ? 360 : 0 }} transition={{
        duration: 2,
        repeat: aiAssistant.isThinking ? Infinity : 0
      }} ><Brain className="h-5 w-5 text-purple-500" />
    </motion.div><CardTitle className="text-base">AI Test Assistant</CardTitle>
    </div>
    </CardHeader><CardContent className="space-y-4">
      {
      /* Balance Score */
      }<div className="space-y-2"><p className="text-sm font-medium">Test Balance</p>{Object.entries(aiAssistant.balanceScore).map(([key, value]) => ( <div key={key} className="space-y-1"><div className="flex justify-between text-xs"><span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}
      </span>
      <span>
      {value}%</span>
      </div><Progress value={value} className="h-2" />
    </div> ))}
    </div>
      {
      /* AI Actions */
      }<div className="space-y-2"><Button size="sm" className="w-full gap-2" onClick={requestSuggestions} disabled={aiAssistant.isThinking} >
      {aiAssistant.isThinking ? ( <>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} ><Sparkles className="h-4 w-4" />
      </motion.div> Thinking... </> ) : ( <><Sparkles className="h-4 w-4" /> Suggest Questions </> )}
    </Button>
    <Button 
      size="sm" 
      variant="outline" 
      className="w-full gap-2" 
      onClick={() => {
        // Balance difficulty 
        const balanced = [...selectedQuestions].sort(() => Math.random() - 0.5);
        setSelectedQuestions(balanced);
      }} 
    >
      <Target className="h-4 w-4" /> Balance Difficulty 
    </Button>
    </div>
      {
      /* Suggestions */} {aiAssistant.suggestions.length > 0 && ( <div className="space-y-2"><p className="text-sm font-medium">Suggested Questions</p><ScrollArea className="h-48">{aiAssistant.suggestions.map((question, index) => ( <motion.div key={question.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-2 rounded-lg border cursor-pointer mb-2" onClick={
          () => setSelectedQuestions([...selectedQuestions,
          question])
          } ><p className="text-sm font-medium truncate">
        {question.title}
        </p><div className="flex items-center gap-2 mt-1"><Badge variant="secondary" className="text-xs">
        {question.difficulty}
        </Badge><span className="text-xs text-muted-foreground">
        {question.points} pts </span>
        </div>
      </motion.div> ))}
      </ScrollArea>
    </div> )}
    </CardContent>
    </Card>
    )
}

    // Question Selection Step 
    const QuestionSelectionStep = () => {
      const [searchQuery, setSearchQuery] = useState('');
      const [filterSubject, setFilterSubject] = useState('all');
      
      const filteredQuestions = questionBank.filter((q) => {
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
        return matchesSearch && matchesSubject;
      });
    return (<div className="grid grid-cols-12 gap-6">
      {
      /* Question Bank */
      }<div className="col-span-7">
    <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Question Bank </CardTitle>
    </CardHeader>
    <CardContent><ScrollArea className="h-[500px] pr-4"><div className="space-y-2">{filteredQuestions.map((question) => ( <motion.div key={question.id} layoutId={`question-${question.id}`} drag dragSnapToOrigin onDragStart={() => setDraggedQuestion(question)} onDragEnd={() => setDraggedQuestion(null)} whileDrag={{ scale: 1.05, zIndex: 50 }} className={cn("p-4 rounded-lg border cursor-grab active:cursor-grabbing"," transition-all",selectedQuestions.find(q => q.id === question.id) &&"opacity-50" )
        } ><div className="flex items-start gap-3"><div className={cn("p-2 rounded-lg",
        getDifficultyColor(question.difficulty))
        }>
      {getQuestionIcon(question.type)}
      </div><div className="flex-1"><p className="font-medium">
      {question.title}
      </p><div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
      <span>
      {question.subject} • {question.topic}
      </span>
      <span>
      {question.points} points</span>
      <span>
      {question.timeEstimate} min</span>
      </div><div className="flex items-center gap-2 mt-2"><Badge variant="outline" className="text-xs"> Used {question.usageCount} times </Badge><Badge variant="outline" className="text-xs">
      {question.successRate}% success </Badge>
      </div>
      </div><Button size="sm" variant="ghost" onClick={() => {
            if (!selectedQuestions.find(q => q.id === question.id)) {
            setSelectedQuestions([...selectedQuestions,
            question]

            )
} }} disabled={selectedQuestions.find(q => q.id === question.id) !== undefined} ><Plus className="h-4 w-4" />
      </Button>
      </div>
    </motion.div> ))}
    </div>
    </ScrollArea>
    </CardContent>
    </Card>
    </div>
      {
      /* Selected Questions & Drop Zone */
      }<div className="col-span-5 space-y-4">
    <Card>
    <CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Selected Questions </CardTitle><Badge variant="secondary">
      {selectedQuestions.length} questions </Badge>
    </div>
    </CardHeader>
    <CardContent><motion.div className={cn("min-h-[400px] rounded-lg border-2 border-dashed p-4",draggedQuestion ?"border-primary bg-primary/5" :"border-muted" )
          } animate={{
        scale: draggedQuestion ? 1.02 : 1,borderColor: draggedQuestion ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
      }} >{selectedQuestions.length === 0 ? ( <div className="h-full flex items-center justify-center text-center">
      <div><Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground"> Drag questions here or click + to add </p>
      </div></div> ) : ( <Reorder.Group axis="y" values={selectedQuestions} onReorder={setSelectedQuestions} className="space-y-2" >{selectedQuestions.map((question, index) => ( <Reorder.Item key={question.id} value={question} className="relative" ><motion.div layoutId={`selected-${question.id}`} className="p-3 rounded-lg border bg-background" ><div className="flex items-center gap-3"><span className="font-bold text-muted-foreground">
        {index + 1}
        </span><div className="flex-1"><p className="text-sm font-medium">
        {question.title}
        </p><div className="flex items-center gap-2 mt-1"><Badge variant="secondary" className="text-xs">
        {question.difficulty}
        </Badge><span className="text-xs text-muted-foreground">
        {question.points} pts • {question.timeEstimate} min </span>
        </div>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6" 
          onClick={() => {
            setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
          }} 
        >
          <X className="h-3 w-3" />
        </Button>
        </div>
        </motion.div>
      </Reorder.Item> ))}
    </Reorder.Group> )}
    </motion.div>
      {
      /* Quick Stats */} {selectedQuestions.length > 0 && ( <div className="grid grid-cols-3 gap-3 mt-4"><div className="text-center p-3 bg-muted rounded-lg"><p className="text-2xl font-bold">
        {
        selectedQuestions.reduce((acc,
        q) => acc + q.points,
        0)
        }
      </p><p className="text-xs text-muted-foreground">Total Points</p>
      </div><div className="text-center p-3 bg-muted rounded-lg"><p className="text-2xl font-bold">
        {
        selectedQuestions.reduce((acc,
        q) => acc + q.timeEstimate,
        0)
        }
      </p><p className="text-xs text-muted-foreground">Minutes</p>
      </div><div className="text-center p-3 bg-muted rounded-lg"><p className="text-2xl font-bold">
      {new Set(selectedQuestions.map(q => q.topic)).size}
      </p><p className="text-xs text-muted-foreground">Topics</p>
      </div>
    </div> )}
    </CardContent>
    </Card>
      {
      /* AI Assistant */
      }
    <AIAssistantBot />
    </div>
    </div>
    );
    };

    // Test Configuration Step 
    const TestConfigurationStep = () => {
      return (
        <div className="grid grid-cols-2 gap-6">
      {
      /* Basic Settings */
      }
    <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Test Settings </CardTitle>
    </CardHeader><CardContent className="space-y-6">
      {
      /* Duration */
      }<div className="space-y-2">
    <Label>Test Duration</Label><div className="flex items-center gap-4">
      <Slider value={[testSettings.duration]} onValueChange={([value]) => setTestSettings({ ...testSettings, duration: value }
      )} max={180} min={15} step={15} className="flex-1" /><div className="w-20 text-right"><span className="font-medium">
      {testSettings.duration}
    </span> min </div>
    </div>
    </div>
      {
      /* Passing Percentage */
      }<div className="space-y-2">
    <Label>Passing Percentage</Label><div className="flex items-center gap-4">
      <Slider value={[testSettings.passingPercentage]} onValueChange={([value]) => setTestSettings({ ...testSettings, passingPercentage: value }
      )} max={100} min={0} step={5} className="flex-1" /><div className="w-20 text-right"><span className="font-medium">
      {testSettings.passingPercentage}
    </span>% </div>
    </div>
    </div>
      {
      /* Toggle Settings */
      }<div className="space-y-3">
        {[ {key: 'shuffleQuestions',label: 'Shuffle Questions',
        icon: Shuffle
          }, {key: 'shuffleOptions',label: 'Shuffle Options',
        icon: Shuffle
          }, {key: 'showTimer',label: 'Show Timer',
        icon: Clock
          }, {key: 'allowNavigation',label: 'Allow Navigation',
        icon: ChevronRight
          }, {key: 'autoSubmit',label: 'Auto Submit',
        icon: CheckCircle
          }, {key: 'instantFeedback',label: 'Instant Feedback',
        icon: Zap} ].map(({ key, label, icon: Icon }) => ( <div key={key} className="flex items-center justify-between"><Label htmlFor={key} className="flex items-center gap-2 cursor-pointer"><Icon className="h-4 w-4 text-muted-foreground" />
      {label}
      </Label>
        <Switch id={key} checked={testSettings[key as keyof TestSettings] as boolean} onCheckedChange={(checked) => setTestSettings({ ...testSettings, [key]: checked }
        )
        } />
    </div> ))}
    </div>
    </CardContent>
    </Card>
      {
      /* Preview Visualization */
      }
    <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" /> Settings Preview </CardTitle>
    </CardHeader>
    <CardContent><div className="space-y-4">
      {
      /* Timer Preview */} {testSettings.showTimer && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-muted rounded-lg" ><div className="flex items-center justify-between"><span className="text-sm font-medium">Time Remaining</span><div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span className="font-mono">
      {testSettings.duration}:00</span>
      </div>
      </div><Progress value={75} className="mt-2" />
      </motion.div> )} {
      /* Navigation Preview */} {testSettings.allowNavigation && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-muted rounded-lg" ><p className="text-sm font-medium mb-2">Question Navigation</p><div className="flex gap-2 flex-wrap">{[1, 2, 3, 4, 5].map(num => ( <div key={num} className={cn("w-10 h-10 rounded-lg flex items-center justify-center","text-sm font-medium cursor-pointer",num === 1 ?"bg-primary text-white" :"bg-background border" )
          } >
        {num}
      </div> ))}
      </div>
      </motion.div> )} {
      /* Feedback Preview */} {testSettings.instantFeedback && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg" ><div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" />
      <div><p className="font-medium text-green-700">Correct!</p><p className="text-sm text-green-600"> Great job! The answer is correct. </p>
      </div>
      </div>
    </motion.div> )}
    </div>
    </CardContent>
    </Card>
    </div>
    );
    };

    // Preview Step 
    const PreviewStep = () => {
      const deviceFrames = { 
        phone: { width: 375, height: 667, scale: 0.5 }, 
        tablet: { width: 768, height: 1024, scale: 0.4 }, 
        laptop: { width: 1366, height: 768, scale: 0.3 } 
      };

      const currentFrame = deviceFrames[previewDevice];
      return (
        <div className="space-y-6">
      {
      /* Device Selector */
      }<div className="flex items-center justify-center gap-4">{Object.entries(deviceFrames).map(([device, _]) => ( <Button key={device} variant={previewDevice === device ? 'default' : 'outline'} size="sm" onClick={() => setPreviewDevice(device as any)} className="gap-2" >{device === 'phone' && <Smartphone className="h-4 w-4" />} {device === 'tablet' && <Tablet className="h-4 w-4" />} {device === 'laptop' && <Monitor className="h-4 w-4" />} {device}
    </Button> ))}<Button variant="outline" size="sm" className="gap-2"><Printer className="h-4 w-4" /> Print Preview </Button>
    </div>
      {
      /* Device Preview */
      }<div className="flex justify-center"><motion.div className="relative" animate={{
        width: currentFrame.width * currentFrame.scale,
        height: currentFrame.height * currentFrame.scale}} transition={{ type:"spring", damping: 20 }} >
      {
      /* Device Frame */
      }<div className={cn("absolute inset-0 rounded-2xl border-8",previewDevice === 'phone' &&"border-gray-800",previewDevice === 'tablet' &&"border-gray-700",previewDevice === 'laptop' &&"border-gray-600" )
      }>
      {
      /* Screen */
      }<div className="w-full h-full bg-background rounded-lg overflow-hidden"><div className="p-4 space-y-4" style={{ transform: `scale(${currentFrame.scale})`, transformOrigin: 'top left' }}>
      {
      /* Test Header */
      }<div className="border-b pb-4"><h3 className="text-xl font-bold">Sample Test</h3><div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
    <span>
      {selectedQuestions.length} Questions</span>
    <span>
      {testSettings.duration} Minutes</span>
    <span>
      {testSettings.totalPoints} Points</span>
    </div>
    </div>
      {
      /* Sample Question */
        } {selectedQuestions[0] && ( <Card><CardContent className="p-4"><div className="flex items-start gap-3"><Badge className="mt-1">Q1</Badge><div className="flex-1"><p className="font-medium mb-3">
      {selectedQuestions[0].title}</p>{selectedQuestions[0].type === 'mcq' && ( <div className="space-y-2">{['Option A', 'Option B', 'Option C', 'Option D'].map((option) => ( <label key={option} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer" ><input type="radio" name="answer" />
          <span>
          {option}
          </span>
        </label> ))}
      </div> )}
      </div>
      </div>
      </CardContent>
    </Card> )}
    </div>
    </div>
    </div>
      {/* Device Details */} {previewDevice === 'phone' && ( <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-800 rounded-full" /> )}
    </motion.div>
    </div>
      {
      /* Accessibility Check */
      }
    <Card>
    <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Accessibility Check </CardTitle>
    </CardHeader>
    <CardContent><div className="grid grid-cols-2 gap-4">{[ { label: 'Color Contrast', status: 'pass' }, { label: 'Screen Reader Compatible', status: 'pass' }, { label: 'Keyboard Navigation', status: 'pass' }, { label: 'Font Size Adjustable', status: 'warning' } ].map((check) => ( <div key={check.label} className="flex items-center gap-2">{check.status === 'pass' ? ( <CheckCircle className="h-4 w-4 text-green-500" /> ) : ( <AlertCircle className="h-4 w-4 text-yellow-500" /> )}<span className="text-sm">
      {check.label}
      </span>
    </div> ))}
    </div>
    </CardContent>
    </Card>
    </div>
    );
    };

    const renderStep = () => {
      switch (currentStep) { 
        case 0: return <QuestionSelectionStep />;
        case 1: return <TestConfigurationStep />;
        case 2: return <PreviewStep />;
        default: return null;
      }
    };

    return (
      <div className="space-y-6">
      {
    /* Header */
    }<div className="flex items-center justify-between">
  <div><h2 className="text-2xl font-bold">Create New Test</h2><p className="text-muted-foreground"> Build engaging assessments with our intuitive wizard </p>
  </div><Button variant="ghost" onClick={onCancel}><X className="h-4 w-4 mr-2" /> Cancel </Button>
  </div>
      {
    /* Progress Steps */
    }<div className="flex items-center justify-center gap-8">{steps.map((step, index) => ( <div key={step} className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentStep(index)} ><motion.div className={cn("w-10 h-10 rounded-full flex items-center justify-center",index <= currentStep ?"bg-primary text-white" :"bg-muted" )
      } animate={{ scale: index === currentStep ? 1.1 : 1 }} >{index < currentStep ? ( <CheckCircle className="h-5 w-5" /> ) : ( <span>
      {index + 1}
    </span> )}
    </motion.div><span className={cn("font-medium",index <= currentStep ?"text-foreground" :"text-muted-foreground" )
      }>
      {step}
    </span>{index < steps.length - 1 && ( <div className={cn("w-20 h-0.5",index < currentStep ?"bg-primary" :"bg-muted" )
      } /> )}
    </div> ))}
    </div>
      {
    /* Step Content */
    }<AnimatePresenceWrapper mode="wait">
  <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} >
      {renderStep()}
    </motion.div>
  </AnimatePresenceWrapper>
      {
    /* Navigation */
    }<div className="flex items-center justify-between pt-6 border-t"><Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} ><ChevronLeft className="h-4 w-4 mr-2" /> Previous </Button>
        {currentStep === steps.length - 1 ? ( <Button onClick={() => onCreateTest({
        questions: selectedQuestions,
        settings: testSettings
        }
      )} className="gap-2" ><CheckCircle className="h-4 w-4" /> Create Test </Button> ) : ( <Button onClick={
      () => setCurrentStep(Math.min(steps.length - 1,
      currentStep + 1))} disabled={currentStep === 0 && selectedQuestions.length === 0} > Next <ChevronRight className="h-4 w-4 ml-2" />
  </Button> )}
    </div>
  </div>
  )
}

export default TestCreationWizard;
