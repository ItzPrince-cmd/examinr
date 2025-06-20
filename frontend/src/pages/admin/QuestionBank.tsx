import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AnimatePresenceWrapper } from '../../components/teacher/AnimatePresenceWrapper';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../../components/ui/use-toast';
import { io, Socket } from 'socket.io-client';
import api from '../../services/api';

import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Brain,
  Sparkles,
  GitBranch,
  Search,
  Filter,
  Save,
  Bookmark,
  Copy,
  Trash2,
  Edit3,
  Eye,
  FolderTree,
  Package,
  Zap,
  BarChart3,
  Hash,
  FileText,
  Code,
  Image as ImageIcon,
  Video,
  ChevronRight,
  X,
  Plus,
  Loader2,
  TrendingUp,
  Clock,
  Users,
  Target,
  Award,
  BookOpen,
  Layers,
  ArrowUpDown,
  Check,
  XCircle,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { ScrollArea } from '../../components/ui/scroll-area';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Slider } from '../../components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../lib/utils';

interface Question {
  id: string; type: 'mcq' | 'short' | 'long' | 'numerical' | 'code' | 'image' | 'video';
  title: string;
  content: string;
  subject: string;
  topic: string;
  subtopic?: string; difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  timeEstimate: number;
  tags: string[];
  options?: {
    id: string;
    text: string;
    isCorrect?: boolean
  }[];
  answer?: string;
  explanation?: string;
  hints?: string[];
  qualityScore: number;
  usageCount: number;
  successRate: number;
  lastModified: Date;
  createdBy: string;
  version: number; status: 'draft' | 'published' | 'archived'
}

interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'validating' | 'success' | 'error' | 'completed' | 'failed';
  progress: number;
  questions: Question[];
  errors: {
    row: number;
    message: string;
  }[];
  successCount?: number;
  errorCount?: number;
  duplicateCount?: number;
  totalRows?: number;
}

interface TopicNode {
  id: string;
  name: string;
  children: TopicNode[];
  questionCount: number;
  level: number
}

// 3D Tree Visualization Component
const TreeNode: React.FC<{
  node: TopicNode;
  depth: number;
}> = ({ node, depth }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ delay: depth * 0.1 }} 
      className="relative"
    >
      <motion.div 
        drag 
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
        onDragStart={() => setIsDragging(true)} 
        onDragEnd={() => setIsDragging(false)} 
        whileDrag={{ scale: 1.05, zIndex: 50 }} 
        className={cn(
          "flex items-center gap-2 p-3 rounded-lg cursor-pointer",
          "bg-card border transition-all",
          isDragging && "shadow-xl border-primary",
          depth === 0 && "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
        )}
        style={{ marginLeft: `${depth * 24}px` }} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {node.children.length > 0 && (
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        )}
        <FolderTree className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {node.name}
        </span>
        <Badge variant="secondary" className="ml-auto">
          {node.questionCount}
        </Badge>
        {/* Connection lines */}
        {depth > 0 && (
          <svg className="absolute -left-6 top-0 h-full w-6" style={{ marginLeft: `${depth * 24}px` }}>
            <path
              d={`M 12 0 L 12 ${node.children.length > 0 ? '50%' : '100%'} L 24 50%`}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-border"
            />
          </svg>
        )}
      </motion.div>
      <AnimatePresenceWrapper>
        {isExpanded && node.children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresenceWrapper>
    </motion.div>
  );
};

// Question Quality Meter
const QualityMeter = ({ score }: { score: number }) => {
  const getColor = () => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
        <motion.circle 
          cx="50" 
          cy="50" 
          r="40" 
          stroke="url(#qualityGradient)" 
          strokeWidth="8" 
          fill="none" 
          strokeLinecap="round" 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: score / 100 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          style={{ strokeDasharray: `${2 * Math.PI * 40}`, strokeDashoffset: 0 }} 
        />
        <defs>
          <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={cn("text-green-500", getColor())} />
            <stop offset="100%" className={cn("text-emerald-500", getColor())} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Brain className="h-6 w-6 text-muted-foreground mb-1" />
        <span className="text-2xl font-bold">
          {score}
        </span>
        <span className="text-xs text-muted-foreground">Quality</span>
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ 
  question,
  selectedQuestions,
  setSelectedQuestions,
  bulkEditMode,
  showDuplicates
}: { 
  question: Question;
  selectedQuestions: Set<string>;
  setSelectedQuestions: React.Dispatch<React.SetStateAction<Set<string>>>;
  bulkEditMode: boolean;
  showDuplicates: boolean;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isSelected = selectedQuestions.has(question.id);
  
  const getTypeIcon = () => {
    switch (question.type) {
      case 'mcq': return Hash;
      case 'short': return FileText;
      case 'long': return FileText;
      case 'numerical': return BarChart3;
      case 'code': return Code;
      case 'image': return ImageIcon;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const TypeIcon = getTypeIcon();
  
  return (
    <motion.div 
      layout 
      className={cn("relative h-full", bulkEditMode && "cursor-pointer")}
      onClick={() => {
        if (bulkEditMode) {
          setSelectedQuestions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(question.id)) {
              newSet.delete(question.id);
            } else {
              newSet.add(question.id);
            }
            return newSet;
          });
        }
      }}
    >
      <Card className={cn("h-full transition-all", isSelected && "ring-2 ring-primary", showDuplicates && "opacity-50")}>
        {bulkEditMode && (
          <div className="absolute -top-2 -right-2 z-10">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                isSelected ? "bg-primary text-white" : "bg-muted"
              )}
            >
              {isSelected && <Check className="h-4 w-4" />}
            </motion.div>
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-lg",
                question.difficulty === 'easy' && "bg-green-500/10",
                question.difficulty === 'medium' && "bg-yellow-500/10",
                question.difficulty === 'hard' && "bg-red-500/10",
                question.difficulty === 'expert' && "bg-purple-500/10"
              )}>
                <TypeIcon className="h-4 w-4" />
              </div>
              <div>
                <Badge variant="outline" className="text-xs">
                  {question.subject} • {question.topic}
                </Badge>
              </div>
            </div>
            <Badge 
              variant={question.status === 'published' ? 'default' : question.status === 'draft' ? 'secondary' : 'outline'} 
              className="text-xs"
            >
              {question.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div 
            className="cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
          >
            <motion.div 
              animate={{ rotateY: isFlipped ? 180 : 0 }} 
              transition={{ duration: 0.6 }} 
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front side */}
              <div className={cn("min-h-[120px]", isFlipped && "invisible")}>
                <p className="font-medium line-clamp-3">
                  {question.title}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {question.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {question.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{question.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              {/* Back side */}
              {isFlipped && (
                <div className="absolute inset-0 p-4" style={{ transform: 'rotateY(180deg)' }}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Usage</span>
                      <span>{question.usageCount} times</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span>{question.successRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Points</span>
                      <span>{question.points}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span>{question.timeEstimate} min</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Quality</div>
              <div className="flex items-center justify-center mt-1">
                <Progress value={question.qualityScore} className="w-12 h-2" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">v{question.version}</div>
              <Clock className="h-3 w-3 mx-auto mt-1 text-muted-foreground" />
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Difficulty</div>
              <div className="flex items-center justify-center mt-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1 h-3 mx-0.5 rounded-full",
                      i < (question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : question.difficulty === 'hard' ? 3 : 4) ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="flex items-center gap-1 pt-2">
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2 text-red-500">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const QuestionBank: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: 'all',
    topic: 'all',
    difficulty: 'all',
    type: 'all',
    status: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('grid');
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Clear any stuck uploads on component mount
  useEffect(() => {
    setUploadedFiles([]);
  }, []);

  // Fetch real questions from database
  useEffect(() => {
    fetchQuestions();
  }, [filters]); // Refetch when filters change

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/questions/search', {
        params: {
          page: 1,
          limit: 100,
          ...filters
        }
      });
      
      console.log('API Response:', response.data); // Debug log
      
      if (response.data.data && response.data.data.length > 0) {
        const formattedQuestions = response.data.data.map((q: any) => ({
          id: q._id,
          type: q.type || 'mcq',
          title: q.title || q.text.substring(0, 50) + '...',
          content: q.text,
          subject: q.subject,
          topic: q.topic,
          subtopic: q.subtopic || '',
          difficulty: q.difficulty,
          points: q.points,
          timeEstimate: 5,
          tags: q.tags || [],
          options: q.options || [],
          explanation: q.solution?.detailed?.text || '',
          hints: [],
          qualityScore: q.qualityScore || 0,
          usageCount: q.statistics?.timesUsed || 0,
          successRate: q.analytics?.successRate || 0,
          createdAt: q.createdAt,
          lastUsed: q.updatedAt,
          status: q.status || 'draft'
        }));
        setQuestions(formattedQuestions);
        
        // Show info about imported questions
        const draftCount = formattedQuestions.filter((q: any) => q.status === 'draft').length;
        if (draftCount > 0) {
          toast({
            title: 'Info',
            description: `Found ${draftCount} draft questions. Draft questions are only visible to admin users.`,
            variant: 'default'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch questions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock question data (removing this)
  /*const mockQuestions: Question[] = [
    {
      id: '1',
      type: 'mcq',
      title: 'What is the speed of light in vacuum?',
      content: 'The speed of light in vacuum is a fundamental physical constant.',
      subject: 'Physics',
      topic: 'Optics',
      subtopic: 'Wave Properties',
      difficulty: 'easy',
      points: 5,
      timeEstimate: 2,
      tags: ['light', 'speed', 'fundamental', 'constants'],
      options: [
        { id: 'a', text: '3 × 10^8 m/s', isCorrect: true },
        { id: 'b', text: '3 × 10^6 m/s', isCorrect: false },
        { id: 'c', text: '3 × 10^10 m/s', isCorrect: false },
        { id: 'd', text: '3 × 10^7 m/s', isCorrect: false }
      ],
      explanation: 'The speed of light in vacuum is exactly 299,792,458 m/s, approximately 3 × 10^8 m/s.',
      hints: ['Think about the order of magnitude', 'It\'s one of the fastest things in the universe'],
      qualityScore: 92,
      usageCount: 1234,
      successRate: 78,
      lastModified: new Date(),
      createdBy: 'Dr. Smith',
      version: 3,
      status: 'published'
    }
  ]);*/
  
  // Mock topic hierarchy
  const [topicHierarchy] = useState([
    {
      id: '1',
      name: 'Physics',
      level: 0,
      questionCount: 450,
      children: [
        {
          id: '1-1',
          name: 'Mechanics',
          level: 1,
          questionCount: 150,
          children: [
            {
              id: '1-1-1',
              name: 'Kinematics',
              level: 2,
              questionCount: 50,
              children: []
            },
            {
              id: '1-1-2',
              name: 'Dynamics',
              level: 2,
              questionCount: 60,
              children: []
            },
            {
              id: '1-1-3',
              name: 'Energy',
              level: 2,
              questionCount: 40,
              children: []
            }
          ]
        },
        {
          id: '1-2',
          name: 'Optics',
          level: 1,
          questionCount: 100,
          children: [
            {
              id: '1-2-1',
              name: 'Ray Optics',
              level: 2,
              questionCount: 50,
              children: []
            },
            {
              id: '1-2-2',
              name: 'Wave Optics',
              level: 2,
              questionCount: 50,
              children: []
            }
          ]
        }
      ]
    }
  ]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    // Temporarily disabled - socket.io not configured on backend
    return;
    
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });
    
    // Authenticate socket with user ID
    const userId = localStorage.getItem('userId');
    if (userId) {
      newSocket.emit('authenticate', userId);
    }
    
    // Listen for import progress updates
    newSocket.on('import:progress', (data) => {
      setUploadedFiles(prev => prev.map(file => 
        file.id === data.jobId
          ? {
              ...file,
              progress: data.progress,
              status: data.status,
              totalRows: data.totalRows
            }
          : file
      ));
    });
    
    // Listen for import completion
    newSocket.on('import:completed', (data) => {
      setUploadedFiles(prev => prev.map(file => 
        file.id === data.jobId
          ? {
              ...file,
              status: data.status,
              successCount: data.results.success,
              errorCount: data.results.errors,
              duplicateCount: data.results.duplicates
            }
          : file
      ));
      
      toast({
        title: 'Import Completed',
        description: `Successfully imported ${data.results.success} questions`,
        variant: 'default'
      });
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [toast]);

  // Drag and drop configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      // First validate the file
      setIsValidating(true);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Validate file
        const validationResponse = await api.post('/import/validate', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (validationResponse.data.validation.isValid) {
          // Get preview
          const previewResponse = await api.post('/import/preview', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          setImportPreview({
            file,
            preview: previewResponse.data.preview,
            totalRows: previewResponse.data.totalRows,
            validRows: previewResponse.data.validRows
          });
          
          // Automatically start import if no errors
          if (!previewResponse.data.hasErrors) {
            await processImport(file);
          }
        } else {
          toast({
            title: 'Validation Failed',
            description: `File has ${validationResponse.data.validation.errors.length} errors`,
            variant: 'destructive'
          });
        }
      } catch (error: any) {
        toast({
          title: 'Upload Failed',
          description: error.response?.data?.message || 'Failed to upload file',
          variant: 'destructive'
        });
      } finally {
        setIsValidating(false);
      }
    }
  }, [toast]);
  
  // Process import
  const processImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('duplicateAction', 'skip');
    formData.append('autoPublish', 'true'); // Changed to publish questions immediately
    
    try {
      const response = await api.post('/import/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const newFile: UploadFile = {
        id: response.data.jobId,
        name: file.name,
        size: file.size,
        status: 'completed',
        progress: 100,
        questions: [],
        errors: [],
        successCount: response.data.results.successfulImports,
        errorCount: response.data.results.errors,
        duplicateCount: response.data.results.duplicates,
        totalRows: response.data.results.totalProcessed
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      setImportPreview(null);
      
      // Check if there were errors
      if (response.data.results.errors > 0) {
        // Get job details to see errors
        try {
          const jobDetails = await api.get(`/import/status/${response.data.jobId}`);
          console.log('Import errors:', jobDetails.data.job.errors);
          
          toast({
            title: 'Import Completed with Errors',
            description: `${response.data.results.successfulImports} imported, ${response.data.results.errors} errors, ${response.data.results.duplicates} duplicates. Check console for error details.`,
            variant: 'destructive'
          });
        } catch (e) {
          toast({
            title: 'Import Completed',
            description: `${response.data.results.successfulImports} imported, ${response.data.results.errors} errors, ${response.data.results.duplicates} duplicates.`,
            variant: response.data.results.errors > 0 ? 'destructive' : 'default'
          });
        }
      } else {
        toast({
          title: 'Import Successful',
          description: `Imported ${response.data.results.successfulImports} questions successfully. ${response.data.results.duplicates} duplicates skipped.`
        });
      }
      
      // Refresh questions list after a short delay
      setTimeout(() => {
        fetchQuestions();
      }, 1000);
      
      // Clear upload status after 5 seconds
      setTimeout(() => {
        setUploadedFiles(prev => prev.filter(f => f.id !== response.data.jobId));
      }, 5000);
    } catch (error: any) {
      toast({
        title: 'Import Failed',
        description: error.response?.data?.message || 'Failed to process import',
        variant: 'destructive'
      });
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, 
    accept: {
      'application/vnd.ms-excel': ['.xls'], 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 
      'text/csv': ['.csv']
    }
  });

  // Download template
  const downloadTemplate = async (type: 'csv' | 'excel' | 'guide') => {
    try {
      const response = await api.get(`/import/template/${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `question_import_template.${type === 'excel' ? 'xlsx' : type === 'guide' ? 'md' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Template Downloaded',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} template downloaded successfully`
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download template',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-bold">Question Bank Mastery</h2><p className="text-muted-foreground"> Manage and organize your entire question repository </p>
    </div><div className="flex items-center gap-3"><Button variant={bulkEditMode ? "default" : "outline"} onClick={() => setBulkEditMode(!bulkEditMode)} ><Package className="h-4 w-4 mr-2" /> Bulk Edit {selectedQuestions.size > 0 && `(${selectedQuestions.size})`}
    </Button>
      <Button onClick={() => setShowQuestionDialog(true)}><Plus className="h-4 w-4 mr-2" /> Create Question </Button>
    </div>
  </div>
  {
    /* Upload Interface */
  }
  <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" /> Bulk Upload Center </CardTitle>
    </CardHeader>
    <CardContent><div {...getRootProps()} className={cn("relative border-2 border-dashed rounded-lg p-8", "transition-all cursor-pointer", isDragActive ? "border-primary bg-primary/5" : "border-muted")
    } >
      <input {...getInputProps()} /><div className="flex flex-col items-center justify-center text-center">
        <motion.div animate={{
          scale: isDragActive ? 1.1 : 1,
          rotate: isDragActive ? 180 : 0
        }} transition={{ duration: 0.3 }} ><FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
        </motion.div><p className="text-lg font-medium mb-2">{isDragActive ? 'Drop your files here' : 'Drag & drop Excel or CSV files'}
        </p>
        <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary">Excel</Badge>
          <Badge variant="secondary">CSV</Badge>
          <Badge variant="secondary">Max 50MB</Badge>
        </div>
        
        {/* Template Download Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              downloadTemplate('csv');
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV Template
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              downloadTemplate('excel');
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Excel Template
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              downloadTemplate('guide');
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Import Guide
          </Button>
        </div>
      </div>
      {
        /* Processing Factory Animation */
      }
      <AnimatePresenceWrapper>{uploadedFiles.length > 0 && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg p-6" ><div className="space-y-4">{uploadedFiles.map(file => (<motion.div key={file.id} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative" ><Card className="p-4"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
        <div><p className="font-medium">
          {file.name}
        </p><p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(2)} KB </p>
        </div>
      </div>
      <Badge 
        variant={
          file.status === 'completed' ? 'default' : 
          file.status === 'failed' ? 'destructive' : 
          'secondary'
        }
      >
        {file.status}
      </Badge>
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {file.status === 'processing' && 'Processing file...'}
          {file.status === 'validating' && 'Validating questions...'}
          {file.status === 'completed' && (
            <span>
              {file.successCount || 0} imported, 
              {file.errorCount || 0} errors, 
              {file.duplicateCount || 0} duplicates
            </span>
          )}
          {file.status === 'failed' && 'Import failed'}
      </span>
        <span>
          {file.progress}%</span>
      </div><Progress value={file.progress} className="h-2" />
        </div>
        {/* Success Animation */}
        {file.status === 'completed' && file.successCount && file.successCount > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-4"
          >
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Successfully imported!</span>
        </div>
          {
            /* Questions flying to shelves animation */
          }<div className="relative h-20 mt-2 overflow-hidden">{Array.from({ length: 5 }).map((_, i) => (<motion.div key={i} className="absolute w-8 h-8 bg-primary/20 rounded" initial={{ left: '10%', top: '50%' }} animate={{ left: '90%', top: `${20 + i * 15}%`, rotate: 360 }} transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }} />))}
          </div>
        </motion.div>)}
      </Card>
      </motion.div>))}
      </div>
      </motion.div>)}
      </AnimatePresenceWrapper>
    </div>
    </CardContent>
  </Card>
  {
    /* Advanced Search & Filters */
  }
  <Card><CardContent className="p-4"><div className="flex flex-col lg:flex-row gap-4">
    {
      /* Search Bar */
    }<div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search questions by title, content, or tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
    </div>
    {
      /* Filter Pills */
    }<div className="flex items-center gap-2">
      <Select value={filters.subject} onValueChange={(v) => setFilters({ ...filters, subject: v }
      )
      }><SelectTrigger className="w-32"><SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="physics">Physics</SelectItem><SelectItem value="chemistry">Chemistry</SelectItem><SelectItem value="biology">Biology</SelectItem><SelectItem value="mathematics">Mathematics</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.difficulty} onValueChange={(v) => setFilters({ ...filters, difficulty: v }
      )
      }><SelectTrigger className="w-32"><SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent><SelectItem value="all">All Levels</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem><SelectItem value="expert">Expert</SelectItem>
        </SelectContent>
      </Select><Button variant="outline" size="icon"><Filter className="h-4 w-4" />
      </Button><Button variant="outline" size="icon"><Bookmark className="h-4 w-4" />
      </Button>
    </div>
    {
      /* View Mode Toggle */
    }<div className="flex items-center gap-1 p-1 bg-muted rounded-lg"><Button size="sm" variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')} className="h-8 px-3" > Grid </Button><Button size="sm" variant={viewMode === 'list' ? 'default' : 'ghost'} onClick={() => setViewMode('list')} className="h-8 px-3" > List </Button><Button size="sm" variant={viewMode === 'tree' ? 'default' : 'ghost'} onClick={() => setViewMode('tree')} className="h-8 px-3" > Tree </Button>
    </div>
  </div>
    {
      /* Active Filters */
    }<AnimatePresenceWrapper>{(searchQuery || Object.values(filters).some(f => f !== 'all')) && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 flex items-center gap-2" ><span className="text-sm text-muted-foreground">Active filters:</span>{searchQuery && (<Badge variant="secondary" className="gap-1"> Search: {searchQuery}<X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} /></Badge>)} {Object.entries(filters).map(([key, value]) => value !== 'all' && (<Badge key={key} variant="secondary" className="gap-1">{key}: {value}<X className="h-3 w-3 cursor-pointer" onClick={() => setFilters({ ...filters, [key]: 'all' }
    )
    } />
    </Badge>))}<Button variant="ghost" size="sm" onClick={() => {
      setSearchQuery(''

      );
      setFilters({
        subject: 'all', topic: 'all', difficulty: 'all', type: 'all', status: 'all'
      }

      )
    }} > Clear all </Button>
    </motion.div>)}
    </AnimatePresenceWrapper>
  </CardContent>
  </Card>
  {
    /* Main Content Area */
  }<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    {
      /* Left Sidebar - Quality Control & Insights */
    }<div className="space-y-6">
      {
        /* Quality Score Overview */
      }
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> Quality Control </CardTitle>
        </CardHeader><CardContent className="space-y-4"><div className="flex justify-center">
          <QualityMeter score={85} />
        </div><div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Duplicate Detection</span><Badge variant="secondary">12 found</Badge>
        </div><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Needs Review</span><Badge variant="secondary">34 questions</Badge>
            </div><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Low Success Rate</span><Badge variant="secondary">8 questions</Badge>
            </div>
          </div><Button className="w-full" size="sm"><Sparkles className="h-4 w-4 mr-2" /> Run AI Analysis </Button>
        </CardContent>
      </Card>
      {
        /* Quick Stats */
      }
      <Card>
        <CardHeader><CardTitle className="text-base">Bank Statistics</CardTitle>
        </CardHeader><CardContent className="space-y-3"><div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Questions</span><span className="font-bold">2,456</span>
        </div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Published</span><span className="font-bold">2,123</span>
          </div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Draft</span><span className="font-bold">287</span>
          </div><div className="flex justify-between text-sm"><span className="text-muted-foreground">Archived</span><span className="font-bold">46</span>
          </div>
        </div><div className="pt-3 border-t"><div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Usage Trend</span><TrendingUp className="h-4 w-4 text-green-500" />
        </div><Progress value={73} className="h-2" /><p className="text-xs text-muted-foreground mt-1"> 23% increase this month </p>
          </div>
        </CardContent>
      </Card>
    </div>
    {
      /* Main Content - Questions Display */
    }<div className="lg:col-span-3">{viewMode === 'tree' ? (<Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" /> Topic Hierarchy </CardTitle>
      </CardHeader>
      <CardContent><ScrollArea className="h-[600px]"><div className="space-y-2">
        {topicHierarchy.map(node => (<TreeNode key={node.id} node={node} depth={0} />))}
      </div>
      </ScrollArea></CardContent></Card>) : loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No questions found. Try importing some questions or adjusting your filters.</p>
        </div>
      ) : (<div className={cn(viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4")}>
        {questions.map(question => (
          <QuestionCard 
            key={question.id} 
            question={question}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            bulkEditMode={bulkEditMode}
            showDuplicates={showDuplicates}
          />
        ))}
      </div>)}
    </div>
  </div>
  {
    /* Bulk Actions Bar */
  }
  <AnimatePresenceWrapper>{bulkEditMode && selectedQuestions.size > 0 && (<motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" ><Card className="p-4 shadow-xl"><div className="flex items-center gap-4"><span className="text-sm font-medium">
    {selectedQuestions.size} questions selected </span><div className="flex items-center gap-2"><Button size="sm" variant="outline"><Edit3 className="h-4 w-4 mr-2" /> Edit </Button><Button size="sm" variant="outline"><Copy className="h-4 w-4 mr-2" /> Duplicate </Button><Button size="sm" variant="outline"><FolderTree className="h-4 w-4 mr-2" /> Move </Button><Button size="sm" variant="outline"><ArrowUpDown className="h-4 w-4 mr-2" /> Change Status </Button><Button size="sm" variant="outline" className="text-red-500"><Trash2 className="h-4 w-4 mr-2" /> Delete </Button>
    </div><Button size="sm" variant="ghost" onClick={() => {
      setSelectedQuestions(new Set());
      setBulkEditMode(false);
    }} > Cancel </Button>
  </div>
  </Card>
  </motion.div>)}
  </AnimatePresenceWrapper>
    
    {/* Question Creation Dialog */}
    <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Question Text</Label>
            <Textarea placeholder="Enter your question here..." className="min-h-[100px]" />
          </div>
          <div>
            <Label>Question Type</Label>
            <Select defaultValue="mcq">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subject</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Question Created",
                description: "Your question has been added to the question bank."
              });
              setShowQuestionDialog(false);
            }}>
              Create Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default QuestionBank;
