// src/components/inputs/AutocompleteInput.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  onSelect?: (selected: string) => void;
  fetchOptions: (term: string) => Promise<string[]>; // e.g., useLocationAutocomplete().searchCities(...)
  minChars?: number; // default 1
  debounceMs?: number; // default 200
  className?: string;
  disabled?: boolean;
};

const cn = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

export default function AutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  fetchOptions,
  minChars = 1,
  debounceMs = 200,
  className,
  disabled,
}: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const debouncedValue = useMemo(() => {
    const handler = setTimeout(() => {
      if (value.length >= minChars) {
        setLoading(true);
        fetchOptions(value)
          .then((results) => {
            setOptions(results);
            setShowDropdown(results.length > 0);
            setHighlightedIndex(-1);
          })
          .catch(() => setOptions([]))
          .finally(() => setLoading(false));
      } else {
        setOptions([]);
        setShowDropdown(false);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, minChars, debounceMs, fetchOptions]);

  useEffect(() => {
    return debouncedValue;
  }, [debouncedValue]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          const selected = options[highlightedIndex];
          onChange(selected);
          onSelect?.(selected);
          setShowDropdown(false);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    onSelect?.(option);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    onChange("");
    setOptions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (options.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed pr-8"
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showDropdown && options.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {options.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={cn(
                "w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                index === highlightedIndex && "bg-gray-100"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}