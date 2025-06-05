import React, { useMemo, useCallback, useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

const katex = require('katex');

interface LaTeXRendererProps {
  content: string;
  inline?: boolean;
  className?: string;
  fallbackBehavior?: 'error' | 'raw' | 'skip';
  macros?: Record<string, string>;
  onRenderComplete?: (success: boolean) => void;
}

// Custom macros for common mathematical and scientific notation
const defaultMacros = {
  "\\RR": "\\mathbb{R}",
  "\\NN": "\\mathbb{N}",
  "\\ZZ": "\\mathbb{Z}",
  "\\QQ": "\\mathbb{Q}",
  "\\CC": "\\mathbb{C}",
  "\\ce": "\\mathrm{#1}", // Basic chemistry support
  "\\vv": "\\vec{#1}",
  "\\dd": "\\mathrm{d}",
  "\\pd": "\\partial",
  "\\grad": "\\nabla",
  "\\div": "\\nabla \\cdot",
  "\\curl": "\\nabla \\times",
};

interface ParsedSegment {
  type: 'text' | 'latex-inline' | 'latex-display';
  content: string;
  raw: string;
}

const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({
  content,
  inline = false,
  className = '',
  fallbackBehavior = 'error',
  macros = {},
  onRenderComplete
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Parse content to extract LaTeX expressions
  const parseContent = useCallback((text: string): ParsedSegment[] => {
    if (!text) return [];
    
    const segments: ParsedSegment[] = [];
    let lastIndex = 0;
    
    // Regex patterns for different LaTeX delimiters
    const patterns = [
      { regex: /\$\$([\s\S]*?)\$\$/g, type: 'latex-display' as const },
      { regex: /\\\[([\s\S]*?)\\\]/g, type: 'latex-display' as const },
      { regex: /\$([^$]+)\$/g, type: 'latex-inline' as const },
      { regex: /\\\((.+?)\\\)/g, type: 'latex-inline' as const },
    ];
    
    // Collect all matches
    const allMatches: Array<{
      index: number;
      length: number;
      content: string;
      type: 'latex-inline' | 'latex-display';
      raw: string;
    }> = [];
    
    patterns.forEach(({ regex, type }) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          content: match[1],
          type,
          raw: match[0]
        });
      }
    });
    
    // Sort matches by index
    allMatches.sort((a, b) => a.index - b.index);
    
    // Build segments
    allMatches.forEach(match => {
      // Add text before this match
      if (match.index > lastIndex) {
        const textContent = text.substring(lastIndex, match.index);
        if (textContent) {
          segments.push({
            type: 'text',
            content: textContent,
            raw: textContent
          });
        }
      }
      
      // Add the LaTeX segment
      segments.push({
        type: match.type,
        content: match.content,
        raw: match.raw
      });
      
      lastIndex = match.index + match.length;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        segments.push({
          type: 'text',
          content: remainingText,
          raw: remainingText
        });
      }
    }
    
    return segments;
  }, []);

  // Render a single LaTeX expression
  const renderLatex = useCallback((
    expression: string,
    displayMode: boolean
  ): { html: string; error?: string } => {
    try {
      const html = katex.renderToString(expression, {
        displayMode,
        throwOnError: false,
        errorColor: '#cc0000',
        macros: { ...defaultMacros, ...macros },
        trust: false,
        strict: false
      });
      return { html };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      switch (fallbackBehavior) {
        case 'skip':
          return { html: '', error: errorMessage };
        case 'raw':
          return { 
            html: `<span class="latex-raw">${displayMode ? '$$' : '$'}${expression}${displayMode ? '$$' : '$'}</span>`,
            error: errorMessage 
          };
        case 'error':
        default:
          return { 
            html: `<span class="katex-error" style="color: #cc0000;" title="${errorMessage}">LaTeX Error: ${errorMessage}</span>`,
            error: errorMessage 
          };
      }
    }
  }, [macros, fallbackBehavior]);

  // Memoize the rendered content
  const renderedContent = useMemo(() => {
    if (!isLoaded) return null;

    // If inline mode is forced, render the entire content as LaTeX
    if (inline) {
      const { html, error } = renderLatex(content, false);
      if (onRenderComplete) {
        onRenderComplete(!error);
      }
      return (
        <span 
          className={cn('latex-inline', className)}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    // Parse and render mixed content
    const segments = parseContent(content);
    let hasError = false;

    const renderedSegments = segments.map((segment, index) => {
      if (segment.type === 'text') {
        // Split text by newlines to handle paragraphs
        const lines = segment.content.split('\n');
        return lines.map((line, lineIndex) => (
          <React.Fragment key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 && <br />}
          </React.Fragment>
        ));
      } else {
        const displayMode = segment.type === 'latex-display';
        const { html, error } = renderLatex(segment.content, displayMode);
        if (error) hasError = true;

        return (
          <span
            key={index}
            className={cn(
              displayMode ? 'latex-display block my-4' : 'latex-inline',
              'latex-rendered'
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
    });

    if (onRenderComplete) {
      onRenderComplete(!hasError);
    }

    return renderedSegments;
  }, [content, inline, className, isLoaded, parseContent, renderLatex, onRenderComplete]);

  // Show loading state
  if (!isLoaded) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className={cn('latex-renderer', className)}>
      {renderedContent}
    </div>
  );
};

// Memoized version for performance
export const MemoizedLaTeXRenderer = React.memo(LaTeXRenderer);

// Hook for rendering LaTeX in strings
export const useRenderLatex = (
  content: string,
  options?: {
    inline?: boolean;
    macros?: Record<string, string>;
  }
) => {
  const [rendered, setRendered] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const html = katex.renderToString(content, {
        displayMode: !options?.inline,
        throwOnError: false,
        macros: { ...defaultMacros, ...options?.macros },
      });
      setRendered(html);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setRendered(content);
    }
  }, [content, options?.inline, options?.macros]);

  return { rendered, error };
};

// Utility function to check if content contains LaTeX
export const containsLatex = (content: string): boolean => {
  const patterns = [
    /\$\$[\s\S]*?\$\$/,
    /\\\[[\s\S]*?\\\]/,
    /\$[^$]+\$/,
    /\\\(.+?\\\)/,
  ];
  
  return patterns.some(pattern => pattern.test(content));
};

// Utility function to extract LaTeX expressions
export const extractLatexExpressions = (content: string): Array<{
  expression: string;
  type: 'inline' | 'display';
  startIndex: number;
  endIndex: number;
}> => {
  const expressions: Array<{
    expression: string;
    type: 'inline' | 'display';
    startIndex: number;
    endIndex: number;
  }> = [];

  const patterns = [
    { regex: /\$\$([\s\S]*?)\$\$/g, type: 'display' as const },
    { regex: /\\\[([\s\S]*?)\\\]/g, type: 'display' as const },
    { regex: /\$([^$]+)\$/g, type: 'inline' as const },
    { regex: /\\\((.+?)\\\)/g, type: 'inline' as const },
  ];

  patterns.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      expressions.push({
        expression: match[1],
        type,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  });

  // Sort by position
  expressions.sort((a, b) => a.startIndex - b.startIndex);

  return expressions;
};

export default LaTeXRenderer;