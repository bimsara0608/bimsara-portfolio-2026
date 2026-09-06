"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  suggestions = ["SolidWorks", "Blender", "3D Printing", "FDM", "Resin", "Arduino", "CAD", "CFD", "FEA", "Fusion 360", "Python", "C++"],
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  );

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-[48px] w-full bg-gray-50 border border-gray-200 px-3 py-2 flex flex-wrap gap-2 items-center focus-within:border-accent transition-colors">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-accent text-white text-sm font-medium px-3 py-1 rounded-full"
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
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent focus:outline-none font-medium text-sm"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-10 max-h-48 overflow-y-auto rounded-b-lg">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-muted mt-1">
        Press <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> or{" "}
        <kbd className="bg-gray-100 px-1 rounded">,</kbd> to add a tag
      </p>
    </div>
  );
}
