import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

  import {
  Upload,
  FileText,
  Video,
  Image,
  FileArchive,
  Link2,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Share2,
  MoreVertical,
  FolderOpen,
  Calendar,
  Users,
  Lock,
  Globe,
  BookOpen,
  ChevronRight,
  Grid,
  List} from 'lucide-react';

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
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';

  import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '../../components/ui/dropdown-menu';

  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from '../../components/ui/dialog';

  import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { toast } from '../../components/ui/use-toast';

// Types 
interface Resource { 
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'video' | 'image' | 'archive' | 'link';
  subject: string;
  topic: string;
  fileSize?: string;
  duration?: string;
  uploadDate: string;
  lastModified: string;
  downloads: number;
  views: number;
  sharedWith: string[];
  accessLevel: 'public' | 'batch' | 'private';
  tags: string[];
  url?: string
}

  interface Folder { id: string;
  name: string;
  parentId?: string;
  resourceCount: number;
  createdDate: string
}

  const ContentManagement: React.FC = () => {
  const navigate = useNavigate();const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'

  );const [searchQuery, setSearchQuery] = useState(''
  );const [selectedType, setSelectedType] = useState('all'
  );const [selectedSubject, setSelectedSubject] = useState('all'
  );
  const [showUploadDialog, setShowUploadDialog] = useState(false
  );
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  // Mock data 
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Physics Chapter 5 - Mechanics Notes',
      description: 'Comprehensive notes covering Newton\'s laws and applications',
      type: 'document',
      subject: 'Physics',
      topic: 'Mechanics',
      fileSize: '2.5 MB',
      uploadDate: '2024-01-10',
      lastModified: '2024-01-12',
      downloads: 145,
      views: 320,
      sharedWith: ['JEE Advanced Batch A','JEE Main Batch B'],
      accessLevel: 'batch',
      tags: ['notes','mechanics','newton laws']
    }, 
    {
      id: '2',
      title: 'Organic Chemistry Video Lecture',
      description: 'Complete video lecture on reaction mechanisms',
      type: 'video',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      duration: '45 min',
      fileSize: '350 MB',
      uploadDate: '2024-01-08',
      lastModified: '2024-01-08',
      downloads: 89,
      views: 256,
      sharedWith: ['NEET Morning Batch'],
      accessLevel: 'batch',
      tags: ['video','organic chemistry','reactions']
      }, {id: '3',title: 'Mathematics Problem Set - Calculus',description: 'Practice problems with detailed solutions',type: 'document',subject: 'Mathematics',topic: 'Calculus',fileSize: '1.8 MB',uploadDate: '2024-01-06',lastModified: '2024-01-06',
    downloads: 234,
    views: 412,sharedWith: ['All Batches'],accessLevel: 'public',tags: ['practice','calculus','problems']
      }, {id: '4',title: 'Biology Diagrams Collection',description: 'High-quality diagrams for cell biology',type: 'image',subject: 'Biology',topic: 'Cell Biology',fileSize: '15 MB',uploadDate: '2024-01-05',lastModified: '2024-01-05',
    downloads: 67,
    views: 189,sharedWith: ['NEET Morning Batch','NEET Evening Batch'],accessLevel: 'batch',tags: ['diagrams','cell biology','illustrations']
    } ]

  );
    const [folders] = useState<Folder[]>([ {id: '1',name: 'Physics Resources',
    resourceCount: 24,createdDate: '2024-01-01'
      }, {id: '2',name: 'Chemistry Resources',
    resourceCount: 18,createdDate: '2024-01-01'
      }, {id: '3',name: 'Mathematics Resources',
    resourceCount: 32,createdDate: '2024-01-01'
    } ]

  );const [batches] = useState([ { id: '1', name: 'JEE Advanced Batch A' }, { id: '2', name: 'JEE Main Batch B' }, { id: '3', name: 'NEET Morning Batch' }, { id: '4', name: 'NEET Evening Batch' } ]
  );
  // Filter resources 
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });
    const getFileIcon = (type: string) => {switch (type) { case 'document': return <FileText className="h-8 w-8" />;case 'video': return <Video className="h-8 w-8" />;case 'image': return <Image className="h-8 w-8" />;case 'archive': return <FileArchive className="h-8 w-8" />;case 'link': return <Link2 className="h-8 w-8" />;default: return <FileText className="h-8 w-8" />
} };
const getAccessBadge = (level: string) => {switch (level) { case 'public': return <Badge variant="default">Public</Badge>;case 'batch': return <Badge variant="secondary">Batch Only</Badge>;case 'private': return <Badge variant="outline">Private</Badge>;
      default: return null
} };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress 
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) { 
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadDialog(false);
            toast({title:"Upload complete",description:"Your resource has been uploaded successfully",

            });
          return 100
} return prev + 10
}

      )
}, 300

    )
}

    const handleResourceAction = (resourceId: string, action: string) => {
    toast({ title: `${action} action`, description: `Resource ${action} initiated`, }

    )
}

    const toggleResourceSelection = (resourceId: string) => {
    setSelectedResources(prev => prev.includes(resourceId) ? prev.filter(id => id !== resourceId) : [...prev,
    resourceId]

    )
}

    const handleBulkAction = (action: string) => {
    toast({ title: `Bulk ${action}`, description: `${selectedResources.length} resources ${action}`, });
    setSelectedResources([]

    )
}

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" >
  <div><h1 className="text-3xl font-bold">Content Management</h1><p className="text-muted-foreground mt-1"> Upload and manage study materials for your students </p>
  </div><Button className="bg-gradient-to-r from-primary to-secondary" onClick={() => setShowUploadDialog(true)} ><Upload className="mr-2 h-4 w-4" /> Upload Resource </Button>
  </motion.div>
      {
    /* Stats */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4" >
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Total Resources</p><p className="text-2xl font-bold">156</p>
  </div><FileText className="h-8 w-8 text-primary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Total Downloads</p><p className="text-2xl font-bold">3.2K</p>
  </div><Download className="h-8 w-8 text-secondary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Total Views</p><p className="text-2xl font-bold">8.5K</p>
  </div><Eye className="h-8 w-8 text-accent opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Storage Used</p><p className="text-2xl font-bold">2.4 GB</p>
  </div><FileArchive className="h-8 w-8 text-orange-500 opacity-20" />
  </div>
  </CardContent>
  </Card>
  </motion.div>
      {
    /* Filters and Search */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row gap-4" ><div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
  </div>
  <Select value={selectedType} onValueChange={setSelectedType}><SelectTrigger className="w-full md:w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Resource type" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="document">Documents</SelectItem><SelectItem value="video">Videos</SelectItem><SelectItem value="image">Images</SelectItem><SelectItem value="archive">Archives</SelectItem><SelectItem value="link">Links</SelectItem>
  </SelectContent>
  </Select>
  <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Subject" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="Physics">Physics</SelectItem><SelectItem value="Chemistry">Chemistry</SelectItem><SelectItem value="Mathematics">Mathematics</SelectItem><SelectItem value="Biology">Biology</SelectItem>
  </SelectContent>
  </Select><div className="flex gap-2"><Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} ><Grid className="h-4 w-4" /></Button><Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} ><List className="h-4 w-4" />
  </Button>
  </div>
  </motion.div>
      {
    /* Bulk Actions */} {selectedResources.length > 0 && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-4 bg-muted rounded-lg" ><span className="text-sm font-medium">{selectedResources.length} selected </span><Button variant="outline" size="sm" onClick={() => handleBulkAction('share')} ><Share2 className="mr-2 h-4 w-4" /> Share </Button><Button variant="outline" size="sm" onClick={() => handleBulkAction('download')} ><Download className="mr-2 h-4 w-4" /> Download </Button><Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')} ><Trash2 className="mr-2 h-4 w-4" /> Delete </Button><Button variant="ghost" size="sm" onClick={() => setSelectedResources([])} > Clear </Button>
    </motion.div> )} {
    /* Content Tabs */
    }
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} ><Tabs defaultValue="resources">
  <TabsList><TabsTrigger value="resources">Resources</TabsTrigger><TabsTrigger value="folders">Folders</TabsTrigger><TabsTrigger value="shared">Shared with Me</TabsTrigger>
  </TabsList>
      {
    /* Resources Tab */
    }<TabsContent value="resources" className="space-y-4">{viewMode === 'grid' ? ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResources.map((resource) => ( 
        <motion.div key={resource.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="relative overflow-hidden">
            <div className="absolute top-2 left-2">
    <Checkbox checked={selectedResources.includes(resource.id)} onCheckedChange={() => toggleResourceSelection(resource.id)} />
    </div><CardHeader className="pb-4"><div className="flex justify-between items-start"><div className={`p-3 rounded-lg bg-muted ${ resource.type === 'document' ? 'text-blue-500' : resource.type === 'video' ? 'text-purple-500' : resource.type === 'image' ? 'text-green-500' : resource.type === 'archive' ? 'text-orange-500' : 'text-gray-500' }`}>
      {getFileIcon(resource.type)}
    </div>
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger><DropdownMenuContent align="end">
    <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Preview </DropdownMenuItem>
    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit </DropdownMenuItem>
    <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /> Share </DropdownMenuItem>
    <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download </DropdownMenuItem>
    <DropdownMenuSeparator /><DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    </div><div className="space-y-1 mt-3"><CardTitle className="text-base line-clamp-2">
      {resource.title}
    </CardTitle>{resource.description && ( <CardDescription className="line-clamp-2">
      {resource.description}
    </CardDescription> )}
    </div>
    </CardHeader><CardContent className="space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">
      {resource.fileSize || resource.duration}
    </span>
      {getAccessBadge(resource.accessLevel)}
    </div><div className="flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Eye className="h-3 w-3" />
      {resource.views}
    </span><span className="flex items-center gap-1"><Download className="h-3 w-3" />
      {resource.downloads}
    </span><span className="flex items-center gap-1"><Calendar className="h-3 w-3" />
      {resource.uploadDate}
    </span>
    </div><div className="flex flex-wrap gap-1">{resource.tags.slice(0, 3).map((tag, idx) => ( <Badge key={idx} variant="outline" className="text-xs">
      {tag}
    </Badge> ))}
    </div>
    </CardContent>
    </Card>
  </motion.div> ))}
    </div> ) : ( <Card><CardContent className="p-0">
  <Table>
  <TableHeader>
  <TableRow><TableHead className="w-12">
      <Checkbox 
        checked={selectedResources.length === filteredResources.length} 
        onCheckedChange={(checked) => {
          if (checked) { 
            setSelectedResources(filteredResources.map(r => r.id));
          } else { 
            setSelectedResources([]);
          }
        }} 
      />
  </TableHead>
  <TableHead>Resource</TableHead>
  <TableHead>Subject</TableHead>
  <TableHead>Type</TableHead>
  <TableHead>Size/Duration</TableHead>
  <TableHead>Access</TableHead>
  <TableHead>Stats</TableHead>
  <TableHead>Uploaded</TableHead>
  <TableHead>
  </TableHead>
  </TableRow>
  </TableHeader>
  <TableBody>
      {filteredResources.map((resource) => ( <TableRow key={resource.id}>
    <TableCell>
    <Checkbox checked={selectedResources.includes(resource.id)} onCheckedChange={() => toggleResourceSelection(resource.id)} />
    </TableCell>
    <TableCell><div className="flex items-center gap-3"><div className={`p-2 rounded bg-muted ${ resource.type === 'document' ? 'text-blue-500' : resource.type === 'video' ? 'text-purple-500' : resource.type === 'image' ? 'text-green-500' : resource.type === 'archive' ? 'text-orange-500' : 'text-gray-500' }`}>
      {getFileIcon(resource.type)}
    </div>
    <div><p className="font-medium">
      {resource.title}
    </p>{resource.description && ( <p className="text-sm text-muted-foreground line-clamp-1">
      {resource.description}
    </p> )}
    </div>
    </div>
    </TableCell>
    <TableCell>
      {resource.subject}
    </TableCell>
    <TableCell><Badge variant="outline">
      {resource.type}
    </Badge>
    </TableCell>
    <TableCell>
      {resource.fileSize || resource.duration}
    </TableCell>
    <TableCell>
      {getAccessBadge(resource.accessLevel)}
    </TableCell>
    <TableCell><div className="text-sm">
    <p>
      {resource.views} views</p><p className="text-muted-foreground">
      {resource.downloads} downloads </p>
    </div>
    </TableCell><TableCell className="text-sm text-muted-foreground">
      {resource.uploadDate}
    </TableCell>
    <TableCell>
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger><DropdownMenuContent align="end">
    <DropdownMenuItem>Preview</DropdownMenuItem>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Share</DropdownMenuItem>
    <DropdownMenuItem>Download</DropdownMenuItem>
    <DropdownMenuSeparator /><DropdownMenuItem className="text-red-600"> Delete </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    </TableCell>
  </TableRow> ))}
    </TableBody>
  </Table>
  </CardContent>
</Card> )}
    </TabsContent>
      {
  /* Folders Tab */
}<TabsContent value="folders" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">{folders.map((folder) => ( <Card key={folder.id} className="transition-shadow cursor-pointer" ><CardContent className="p-6"><div className="flex flex-col items-center text-center space-y-3"><FolderOpen className="h-12 w-12 text-primary" />
  <div><h4 className="font-medium">
      {folder.name}
    </h4><p className="text-sm text-muted-foreground">
      {folder.resourceCount} resources </p>
  </div>
  </div>
  </CardContent>
</Card> ))}<Card className="border-dashed transition-shadow cursor-pointer"><CardContent className="p-6"><div className="flex flex-col items-center text-center space-y-3"><Plus className="h-12 w-12 text-muted-foreground" />
<div><h4 className="font-medium">Create Folder</h4><p className="text-sm text-muted-foreground"> Organize resources </p>
</div>
</div>
</CardContent>
</Card>
</div>
</TabsContent>
      {
  /* Shared Tab */
}<TabsContent value="shared" className="space-y-4"><div className="text-center py-12"><Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-medium mb-2">No shared resources</h3><p className="text-muted-foreground"> Resources shared with you by other teachers will appear here </p>
</div>
</TabsContent>
</Tabs>
</motion.div>
</div>
      {
  /* Upload Dialog */
}
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}><DialogContent className="max-w-2xl">
<DialogHeader>
<DialogTitle>Upload Resource</DialogTitle>
<DialogDescription> Add study materials for your students </DialogDescription>
</DialogHeader><div className="space-y-4 py-4">
      {!isUploading ? ( <><div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" placeholder="Enter resource title" />
  </div><div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" placeholder="Brief description of the resource" rows={3} />
  </div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="subject">Subject *</Label>
  <Select>
  <SelectTrigger><SelectValue placeholder="Select subject" />
  </SelectTrigger>
  <SelectContent><SelectItem value="physics">Physics</SelectItem><SelectItem value="chemistry">Chemistry</SelectItem><SelectItem value="mathematics">Mathematics</SelectItem><SelectItem value="biology">Biology</SelectItem>
  </SelectContent>
  </Select>
  </div><div className="space-y-2"><Label htmlFor="topic">Topic *</Label><Input id="topic" placeholder="Enter topic" />
  </div>
  </div><div className="space-y-2">
  <Label>Access Level</Label><RadioGroup defaultValue="batch"><div className="flex items-center space-x-2"><RadioGroupItem value="public" id="public" /><Label htmlFor="public" className="cursor-pointer"><div className="flex items-center gap-2"><Globe className="h-4 w-4" /> Public - All students can access </div>
  </Label>
  </div><div className="flex items-center space-x-2"><RadioGroupItem value="batch" id="batch" /><Label htmlFor="batch" className="cursor-pointer"><div className="flex items-center gap-2"><Users className="h-4 w-4" /> Batch Only - Select specific batches </div>
  </Label>
  </div><div className="flex items-center space-x-2"><RadioGroupItem value="private" id="private" /><Label htmlFor="private" className="cursor-pointer"><div className="flex items-center gap-2"><Lock className="h-4 w-4" /> Private - Only you can access </div>
  </Label>
  </div>
  </RadioGroup>
  </div><div className="space-y-2">
  <Label>Select Batches</Label><div className="space-y-2">{batches.map((batch) => ( <div key={batch.id} className="flex items-center space-x-2">
    <Checkbox id={batch.id} /><Label htmlFor={batch.id} className="cursor-pointer">
      {batch.name}
    </Label>
  </div> ))}
    </div>
  </div><div className="space-y-2">
  <Label>Upload File</Label><div className="border-2 border-dashed rounded-lg p-6 text-center"><Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-sm text-muted-foreground mb-2"> Drag and drop your file here, or click to browse </p><Button variant="outline">Choose File</Button>
  </div>
  </div></> ) : ( <div className="space-y-4 py-8"><div className="text-center"><Upload className="h-12 w-12 mx-auto text-primary mb-4 animate-pulse" /><p className="font-medium mb-2">Uploading resource...</p><p className="text-sm text-muted-foreground mb-4"> Please wait while we upload your file </p>
  </div><Progress value={uploadProgress} className="w-full" /><p className="text-center text-sm text-muted-foreground">
      {uploadProgress}% complete </p>
</div> )}
    </div>
      {!isUploading && ( <DialogFooter><Button variant="outline" onClick={() => setShowUploadDialog(false)}> Cancel </Button>
  <Button onClick={handleUpload}>Upload Resource</Button>
</DialogFooter> )}
    </DialogContent>
</Dialog>
</div>
  )
}

export default ContentManagement;
