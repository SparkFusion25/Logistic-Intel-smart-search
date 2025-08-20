import React from 'react';

interface HighlightProps {
  text: string | null | undefined;
  query: string;
  className?: string;
}

export function Highlight({ text, query, className = '' }: HighlightProps): React.ReactElement {
  if (!text || !query.trim()) {
    return React.createElement('span', { className }, text || '');
  }

  const searchTerms = query
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Escape regex chars

  if (searchTerms.length === 0) {
    return React.createElement('span', { className }, text);
  }

  // Create regex pattern that matches any of the search terms (case insensitive)
  const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
  
  const parts = text.split(regex);
  
  const elements = parts.map((part, index) => {
    const isMatch = searchTerms.some(term => 
      new RegExp(`^${term}$`, 'i').test(part)
    );
    
    if (isMatch) {
      return React.createElement(
        'mark',
        { 
          key: index,
          className: 'bg-yellow-200 text-yellow-900 px-0.5 rounded'
        },
        part
      );
    }
    
    return part;
  });

  return React.createElement('span', { className }, ...elements);
}

// Utility function to highlight text in a string (returns HTML string)
export function highlightText(text: string | null | undefined, query: string): string {
  if (!text || !query.trim()) {
    return text || '';
  }

  const searchTerms = query
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (searchTerms.length === 0) {
    return text;
  }

  const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
  
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-0.5 rounded">$1</mark>');
}

// Check if text contains any of the search terms
export function hasMatch(text: string | null | undefined, query: string): boolean {
  if (!text || !query.trim()) {
    return false;
  }

  const searchTerms = query
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0);

  return searchTerms.some(term => 
    text.toLowerCase().includes(term.toLowerCase())
  );
}

// Get the context around a match (useful for search snippets)
export function getMatchContext(
  text: string | null | undefined, 
  query: string, 
  contextLength = 100
): string {
  if (!text || !query.trim()) {
    return text?.slice(0, contextLength) || '';
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  
  const matchIndex = lowerText.indexOf(lowerQuery);
  
  if (matchIndex === -1) {
    return text.slice(0, contextLength);
  }

  const start = Math.max(0, matchIndex - Math.floor(contextLength / 2));
  const end = Math.min(text.length, start + contextLength);
  
  let context = text.slice(start, end);
  
  // Add ellipsis if we truncated
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  
  return context;
}
