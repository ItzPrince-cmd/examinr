declare module 'katex' {
  interface KatexOptions {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string | [string, number]>;
    trust?: boolean | ((context: any) => boolean);
    strict?: boolean | string | Function;
    output?: 'html' | 'mathml' | 'htmlAndMathml';
    leqno?: boolean;
    fleqn?: boolean;
    minRuleThickness?: number;
    colorIsTextColor?: boolean;
    maxSize?: number;
    maxExpand?: number;
    globalGroup?: boolean;
  }

  function renderToString(expression: string, options?: KatexOptions): string;
  
  const katex: {
    renderToString: typeof renderToString;
    render: (expression: string, element: HTMLElement, options?: KatexOptions) => void;
    version: string;
  };
  
  export = katex;
}