/**
 * AddContentMenu - Contextual menu for adding content to modules
 * Options: Text/Notes, Divider
 */

import React from 'react';
import { FileText, Minus, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { ContentBlock } from './ModuleContentBlock';

interface AddContentMenuProps {
  onAddContent: (type: 'text' | 'divider') => void;
}

export function AddContentMenu({ onAddContent }: AddContentMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          title="Add content"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="w-48"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <DropdownMenuLabel
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          Add Content
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onAddContent('text')}
          className="cursor-pointer"
          style={{
            fontSize: 'var(--text-sm)',
          }}
        >
          <FileText className="h-4 w-4 mr-2" />
          Text / Notes
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAddContent('divider')}
          className="cursor-pointer"
          style={{
            fontSize: 'var(--text-sm)',
          }}
        >
          <Minus className="h-4 w-4 mr-2" />
          Divider
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
