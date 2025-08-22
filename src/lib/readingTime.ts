/**
 * Calculate estimated reading time for content
 * @param content - The text content (HTML or plain text)
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  // Remove HTML tags and normalize whitespace
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Count words (split by spaces and filter empty strings)
  const wordCount = plainText.split(' ').filter(word => word.length > 0).length;

  // Calculate reading time (minimum 1 minute)
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTime);
}

/**
 * Get word count from content
 * @param content - The text content (HTML or plain text)
 * @returns Number of words
 */
export function getWordCount(content: string): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.split(' ').filter(word => word.length > 0).length;
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read", "1 min read")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) return '1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Calculate reading progress percentage
 * @param scrollTop - Current scroll position
 * @param scrollHeight - Total scrollable height
 * @param clientHeight - Visible height
 * @returns Progress percentage (0-100)
 */
export function calculateReadingProgress(
  scrollTop: number, 
  scrollHeight: number, 
  clientHeight: number
): number {
  const totalScrollable = scrollHeight - clientHeight;
  if (totalScrollable <= 0) return 100;
  
  const progress = (scrollTop / totalScrollable) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Estimate time to read remaining content
 * @param totalReadingTime - Total reading time in minutes
 * @param progressPercentage - Current reading progress (0-100)
 * @returns Remaining time in minutes
 */
export function getRemainingReadingTime(
  totalReadingTime: number, 
  progressPercentage: number
): number {
  const remainingPercentage = Math.max(0, 100 - progressPercentage);
  const remainingTime = Math.ceil((totalReadingTime * remainingPercentage) / 100);
  return Math.max(0, remainingTime);
}

/**
 * Generate reading time metadata for structured data
 * @param minutes - Reading time in minutes
 * @returns ISO 8601 duration string for schema.org
 */
export function getReadingTimeDuration(minutes: number): string {
  return `PT${Math.max(1, minutes)}M`;
}