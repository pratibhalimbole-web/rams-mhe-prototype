/**
 * TextBlockEditor - Rich text editor for static text blocks
 * Supports: Bold, Bullet List, Numbered List, Highlight
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bold, List, ListOrdered, Highlighter } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

interface TextBlockEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextBlockEditor({ value, onChange, placeholder = "Type your text here..." }: TextBlockEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Execute formatting commands
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const toggleBold = () => execCommand('bold');
  const toggleBulletList = () => execCommand('insertUnorderedList');
  const toggleNumberedList = () => execCommand('insertOrderedList');
  const toggleHighlight = () => execCommand('backColor', '#fef08a');

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden transition-all",
        isFocused ? "border-primary ring-1 ring-primary/20" : "border-border"
      )}
      style={{
        borderRadius: 'var(--radius)',
      }}
    >
      {/* Toolbar */}
      <div 
        className="flex items-center gap-1 px-2 py-2 bg-muted/30 border-b"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={toggleBold}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={toggleBulletList}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={toggleNumberedList}
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={toggleHighlight}
          title="Highlight"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[120px] p-3 bg-card focus:outline-none"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'var(--text-sm)',
          color: 'var(--foreground)',
          lineHeight: '1.6',
        }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contentEditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: var(--muted-foreground);
          opacity: 0.6;
        }
        
        [contentEditable] ul,
        [contentEditable] ol {
          padding-left: var(--spacing-6);
          margin: var(--spacing-2) 0;
        }
        
        [contentEditable] li {
          margin: var(--spacing-1) 0;
        }
        
        [contentEditable] strong {
          font-weight: var(--font-weight-bold);
        }
      `}</style>
    </div>
  );
}
