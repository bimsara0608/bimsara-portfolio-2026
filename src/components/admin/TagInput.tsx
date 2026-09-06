'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function TagInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter...',
  suggestions = [
    'SolidWorks',
    'Blender',
    '3D Printing',
    'FDM',
    'Resin',
    'Arduino',
    'CAD',
    'CFD',
    'FEA',
    'Fusion 360',
    'Python',
    'C++',
  ],
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-[48px] w-full bg-background border border-border px-3 py-2 flex flex-wrap gap-2 items-center focus-within:border-foreground transition-colors rounded-lg">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-foreground text-background text-sm font-medium px-3 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent focus:outline-none font-medium text-sm"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-card border border-border shadow-lg z-10 max-h-48 overflow-y-auto rounded-b-lg mt-1">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-2">
        Press{' '}
        <kbd className="bg-muted px-1 rounded border border-border text-foreground">Enter</kbd> or{' '}
        <kbd className="bg-muted px-1 rounded border border-border text-foreground">,</kbd> to add a
        tag
      </p>
    </div>
  );
}
