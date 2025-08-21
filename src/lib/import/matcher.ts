import type { ColumnInfo } from './schema';
import type { AliasMap } from './aliases';

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[_\-\s]+/g, ' ');
}

// Lightweight Levenshtein distance for fuzzy matching
function lev(a: string, b: string) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export type MappingResult = {
  mapping: Record<string, string | null>; // header -> column or null
  confidences: Record<string, number>;    // 0..1 confidence per header
  unknown: string[];                      // headers we couldn't confidently map
};

export function buildMapping(headers: string[], columns: ColumnInfo[], aliases: AliasMap = {}): MappingResult {
  const cols = columns.map(c => c.column_name.toLowerCase());
  const aliasIndex = new Map<string, string>();
  Object.entries(aliases).forEach(([col, list]) => {
    list.forEach(a => aliasIndex.set(normalize(a), col));
  });

  const mapping: Record<string, string | null> = {};
  const confidences: Record<string, number> = {};
  const unknown: string[] = [];

  for (const hRaw of headers) {
    const h = normalize(hRaw);

    // 1) Exact column match
    if (cols.includes(h)) {
      mapping[hRaw] = h;
      confidences[hRaw] = 1.0;
      continue;
    }

    // 2) Alias match
    if (aliasIndex.has(h)) {
      const col = aliasIndex.get(h)!;
      mapping[hRaw] = col;
      confidences[hRaw] = 0.95;
      continue;
    }

    // 3) Fuzzy match (closest column)
    let bestCol = '';
    let bestScore = Infinity;
    for (const c of cols) {
      const d = lev(h, c);
      if (d < bestScore) { bestScore = d; bestCol = c; }
    }
    // Heuristic: accept if edit distance small relative to header length
    const threshold = Math.max(1, Math.floor(h.length * 0.25));
    if (bestScore <= threshold) {
      mapping[hRaw] = bestCol;
      confidences[hRaw] = Math.max(0.6, 1 - bestScore / Math.max(h.length, bestCol.length));
    } else {
      mapping[hRaw] = null;
      confidences[hRaw] = 0;
      unknown.push(hRaw);
    }
  }

  return { mapping, confidences, unknown };
}

export function applyMappingToRow(row: Record<string, any>, mapping: Record<string, string | null>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [header, value] of Object.entries(row)) {
    const targetColumn = mapping[header];
    if (targetColumn) {
      result[targetColumn] = value;
    }
  }
  
  return result;
}