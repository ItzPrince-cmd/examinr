import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';

// Type fix for AnimatePresence
const AnimatePresence = FramerAnimatePresence as any;
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../services/api';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Clock,
  TrendingUp,
  Bookmark,
  Tag,
  Book,
  Calendar,
  BarChart,
  Loader2,
  Save,
  Settings,
  Hash,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { cn } from '../../lib/utils';

interface QuestionSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onQuestionSelect?: (question: any) => void;
  userRole: 'student' | 'teacher' | 'admin';
  initialFilters?: SearchFilters;
  embedded?: boolean;
}

interface SearchFilters {
  subject?: string;
  chapter?: string;
  topic?: string;
  difficulty?: string[];
  type?: string[];
  tags?: string[];
  isPYQ?: boolean;
  pyqYear?: string;
  pyqExam?: string;
  bookReference?: string;
  dateFrom?: string;
  dateTo?: string;
  minSuccessRate?: number;
  maxSuccessRate?: number;
  sortBy?: string;
  operator?: 'AND' | 'OR';
}

interface SearchSuggestion {
  type: 'tag' | 'chapter' | 'topic';
  value: string;
}

interface SearchPreset {
  id: string;
  name: string;
  filters: SearchFilters;
  isDefault: boolean;
}

export const QuestionSearch: React.FC<QuestionSearchProps> = ({
  onSearch,
  onQuestionSelect,
  userRole,
  initialFilters = {},
  embedded = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('filters');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      fetchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm]);

  // Load initial data
  useEffect(() => {
    loadRecentSearches();
    fetchPopularSearches();
    fetchPresets();
    fetchCategoryHierarchy();
  }, []);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await api.get('/questions/search/suggestions', {
        params: { query, field: 'all' }
      });
      setSuggestions(response.data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  };

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [term, ...recent.filter((t: string) => t !== term)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated.slice(0, 5));
  };

  const fetchPopularSearches = async () => {
    try {
      const response = await api.get('/questions/search/popular', {
        params: { timeframe: '7d', limit: 8 }
      });
      setPopularSearches(response.data.searches);
    } catch (error) {
      console.error('Error fetching popular searches:', error);
    }
  };

  const fetchPresets = async () => {
    try {
      const response = await api.get('/questions/search/presets');
      setPresets(response.data.presets);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  };

  const fetchCategoryHierarchy = async () => {
    try {
      const response = await api.get('/questions/categories/hierarchy');
      setCategoryHierarchy(response.data.hierarchy);
    } catch (error) {
      console.error('Error fetching category hierarchy:', error);
    }
  };

  const handleSearch = useCallback(() => {
    if (searchTerm.trim() || Object.keys(filters).length > 0) {
      saveRecentSearch(searchTerm);
      onSearch(searchTerm, filters);
      setShowSuggestions(false);
    }
  }, [searchTerm, filters, onSearch]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'tag') {
      setFilters(prev => ({
        ...prev,
        tags: [...(prev.tags || []), suggestion.value]
      }));
    } else if (suggestion.type === 'chapter') {
      setFilters(prev => ({ ...prev, chapter: suggestion.value }));
    } else if (suggestion.type === 'topic') {
      setFilters(prev => ({ ...prev, topic: suggestion.value }));
    }
    setShowSuggestions(false);
    handleSearch();
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const savePreset = async () => {
    const name = prompt('Enter preset name:');
    if (!name) return;

    try {
      await api.post('/questions/search/presets', {
        name,
        filters,
        isDefault: false
      });
      fetchPresets();
    } catch (error) {
      console.error('Error saving preset:', error);
    }
  };

  const applyPreset = (preset: SearchPreset) => {
    setFilters(preset.filters);
    handleSearch();
  };

  const difficultyOptions = ['easy', 'medium', 'hard', 'expert'];
  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'multiple_correct', label: 'Multiple Correct' },
    { value: 'numerical', label: 'Numerical' },
    { value: 'true_false', label: 'True/False' },
    { value: 'short_answer', label: 'Short Answer' },
    { value: 'essay', label: 'Essay' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'difficulty', label: 'Difficulty (Easy to Hard)' },
    { value: '-difficulty', label: 'Difficulty (Hard to Easy)' },
    { value: 'usage', label: 'Most Used' },
    { value: 'successRate', label: 'Success Rate' }
  ];

  return (
    <div className={cn("w-full", embedded ? "max-w-2xl" : "")}>
      {/* Search Bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search questions by content, tags, or topics..."
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("gap-2", Object.keys(filters).length > 0 && "bg-primary/10")}
          >
            <Filter className="h-4 w-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
          
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        <>
          <AnimatePresence mode="wait">
            {showSuggestions && suggestions.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg"
            >
              <ScrollArea className="max-h-64">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-2"
                  >
                    {suggestion.type === 'tag' && <Tag className="h-4 w-4" />}
                    {suggestion.type === 'chapter' && <Book className="h-4 w-4" />}
                    {suggestion.type === 'topic' && <Hash className="h-4 w-4" />}
                    <span>{suggestion.value}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {suggestion.type}
                    </Badge>
                  </button>
                ))}
              </ScrollArea>
            </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.subject && (
            <Badge variant="secondary" className="gap-1">
              Subject: {filters.subject}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('subject', undefined)}
              />
            </Badge>
          )}
          {filters.difficulty?.map(d => (
            <Badge key={d} variant="secondary" className="gap-1">
              {d}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('difficulty', filters.difficulty?.filter(diff => diff !== d))}
              />
            </Badge>
          ))}
          {filters.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('tags', filters.tags?.filter(t => t !== tag))}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      <>
        <AnimatePresence mode="wait">
          {showFilters ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Advanced Filters</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={savePreset}
                      className="gap-1"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="filters">Filters</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="presets">Presets</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                  </TabsList>

                  <TabsContent value="filters" className="space-y-4 mt-4">
                    {/* Difficulty Filter */}
                    <div>
                      <Label>Difficulty</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {difficultyOptions.map(diff => (
                          <label key={diff} className="flex items-center gap-2">
                            <Checkbox
                              checked={filters.difficulty?.includes(diff) || false}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange('difficulty', [...(filters.difficulty || []), diff]);
                                } else {
                                  handleFilterChange('difficulty', filters.difficulty?.filter(d => d !== diff));
                                }
                              }}
                            />
                            <span className="text-sm capitalize">{diff}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Question Type Filter */}
                    <div>
                      <Label>Question Type</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {questionTypes.map(type => (
                          <label key={type.value} className="flex items-center gap-2">
                            <Checkbox
                              checked={filters.type?.includes(type.value) || false}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange('type', [...(filters.type || []), type.value]);
                                } else {
                                  handleFilterChange('type', filters.type?.filter(t => t !== type.value));
                                }
                              }}
                            />
                            <span className="text-sm">{type.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* PYQ Filter */}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.isPYQ || false}
                          onCheckedChange={(checked) => handleFilterChange('isPYQ', checked)}
                        />
                        <span className="text-sm">Previous Year Questions</span>
                      </label>
                      
                      {filters.isPYQ && (
                        <>
                          <Input
                            type="text"
                            placeholder="Year (e.g., 2023 or 2020-2023)"
                            value={filters.pyqYear || ''}
                            onChange={(e) => handleFilterChange('pyqYear', e.target.value)}
                            className="w-40"
                          />
                          <Input
                            type="text"
                            placeholder="Exam (e.g., JEE Main)"
                            value={filters.pyqExam || ''}
                            onChange={(e) => handleFilterChange('pyqExam', e.target.value)}
                            className="w-40"
                          />
                        </>
                      )}
                    </div>

                    {/* Success Rate Filter */}
                    <div>
                      <Label>Success Rate Range</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1">
                          <Slider
                            value={[filters.minSuccessRate || 0, filters.maxSuccessRate || 100]}
                            onValueChange={([min, max]) => {
                              handleFilterChange('minSuccessRate', min);
                              handleFilterChange('maxSuccessRate', max);
                            }}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {filters.minSuccessRate || 0}% - {filters.maxSuccessRate || 100}%
                        </span>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <Label>Sort By</Label>
                      <Select
                        value={filters.sortBy || 'relevance'}
                        onValueChange={(value) => handleFilterChange('sortBy', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filter Logic */}
                    <div>
                      <Label>Filter Logic</Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="operator"
                            value="AND"
                            checked={filters.operator !== 'OR'}
                            onChange={() => handleFilterChange('operator', 'AND')}
                          />
                          <span className="text-sm">Match all filters (AND)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="operator"
                            value="OR"
                            checked={filters.operator === 'OR'}
                            onChange={() => handleFilterChange('operator', 'OR')}
                          />
                          <span className="text-sm">Match any filter (OR)</span>
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="categories" className="mt-4">
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {categoryHierarchy.map(subject => (
                          <div key={subject.subject} className="border rounded-lg p-3">
                            <button
                              onClick={() => handleFilterChange('subject', subject.subject)}
                              className="w-full flex items-center justify-between hover:bg-accent p-2 rounded"
                            >
                              <span className="font-medium capitalize">{subject.subject}</span>
                              <Badge variant="secondary">{subject.count}</Badge>
                            </button>
                            
                            {filters.subject === subject.subject && (
                              <div className="mt-2 ml-4 space-y-1">
                                {subject.chapters.map((chapter: any) => (
                                  <div key={chapter.name}>
                                    <button
                                      onClick={() => handleFilterChange('chapter', chapter.name)}
                                      className="w-full flex items-center justify-between hover:bg-accent p-2 rounded text-sm"
                                    >
                                      <span>{chapter.name}</span>
                                      <Badge variant="outline" className="text-xs">{chapter.count}</Badge>
                                    </button>
                                    
                                    {filters.chapter === chapter.name && (
                                      <div className="ml-4 mt-1 space-y-1">
                                        {chapter.topics.map((topic: any) => (
                                          <button
                                            key={topic.name}
                                            onClick={() => handleFilterChange('topic', topic.name)}
                                            className="w-full flex items-center justify-between hover:bg-accent p-2 rounded text-xs"
                                          >
                                            <span>{topic.name}</span>
                                            <Badge variant="outline" className="text-xs">{topic.count}</Badge>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="presets" className="mt-4">
                    <div className="space-y-2">
                      {presets.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No saved presets yet. Save your current filters to create a preset.
                        </p>
                      ) : (
                        presets.map(preset => (
                          <Card
                            key={preset.id}
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => applyPreset(preset)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Bookmark className="h-4 w-4" />
                                  <span className="font-medium">{preset.name}</span>
                                  {preset.isDefault && (
                                    <Badge variant="secondary" className="text-xs">Default</Badge>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="trending" className="mt-4">
                    <div className="space-y-4">
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Recent Searches</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((term, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => {
                                  setSearchTerm(term);
                                  handleSearch();
                                }}
                              >
                                {term}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Searches */}
                      {popularSearches.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Popular This Week</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {popularSearches.map((search, index) => (
                              <Card
                                key={index}
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => {
                                  setSearchTerm(search._id);
                                  handleSearch();
                                }}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{search._id}</span>
                                    <div className="flex items-center gap-1">
                                      <Sparkles className="h-3 w-3 text-yellow-500" />
                                      <span className="text-xs text-muted-foreground">
                                        {search.count}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
          ) : null}
        </AnimatePresence>
      </>
    </div>
  );
};