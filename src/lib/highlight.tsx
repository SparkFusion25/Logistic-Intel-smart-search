// src/lib/highlight.tsx
// Safe, case-insensitive <mark>-style highlighting for snippets/titles.
// - Escapes HTML by default.
// - Supports multiple terms (["samsung","tv"]).
// - Skips empty/short terms. Limits total highlights to avoid heavy DOM.

import React from "react";

type Props = {
  text: string | null | undefined;
  terms: string | string[] | null | undefined;
  className?: string;       // extra classes for <mark>
  maxMarks?: number;        // default 50
  markTag?: keyof JSX.IntrinsicElements; // default "mark"
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const normalize = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

const uniq = (xs: string[]) => Array.from(new Set(xs));

const MIN_TERM_LEN = 2;

export const Highlight: React.FC<Props> = ({
  text,
  terms,
  className,
  maxMarks = 50,
  markTag = "mark",
}) => {
  const raw = normalize(text);
  if (!raw) return <>{""}</>;

  // Prepare search terms
  const list = Array.isArray(terms)
    ? terms
    : terms
    ? [terms]
    : [];
  const needles = uniq(
    list
      .map(normalize)
      .map((t) => t.trim())
      .filter((t) => t.length >= MIN_TERM_LEN)
  );

  if (needles.length === 0) return <>{escapeHtml(raw)}</>;

  // Build one big regex like /(foo|bar|baz)/gi with escaping
  const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp("(" + needles.map(esc).join("|") + ")", "gi");

  const parts: Array<string | { mark: string }> = [];
  let lastIndex = 0;
  let count = 0;

  raw.replace(regex, (match, _g1, idx) => {
    if (idx > lastIndex) {
      parts.push(raw.slice(lastIndex, idx));
    }
    if (count < maxMarks) {
      parts.push({ mark: match });
      count++;
    } else {
      // stop highlighting beyond the cap, push plain text instead
      parts.push(match);
    }
    lastIndex = idx + match.length;
    return match;
  });

  if (lastIndex < raw.length) {
    parts.push(raw.slice(lastIndex));
  }

  const MarkTag: any = markTag;

  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: escapeHtml(p) }} />
        ) : (
          <MarkTag
            key={i}
            className={["bg-brand-500/20 text-white rounded-[4px] px-0.5", className || ""].join(" ")}
            dangerouslySetInnerHTML={{ __html: escapeHtml(p.mark) }}
          />
        )
      )}
    </>
  );
};

export default Highlight;
