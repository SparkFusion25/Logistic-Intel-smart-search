import React from 'react';

export default function Highlight({text, query}: {text: string; query: string}) {
  if (!query) return <>{text}</>;
  
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return <>{text}</>;
  
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-yellow-200 px-1 rounded">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
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
