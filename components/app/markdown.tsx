import * as React from "react";

/**
 * Minimal, dependency-free, XSS-safe markdown renderer for assistant replies.
 * Builds React nodes from parsed tokens (never raw HTML), and handles only
 * what the assistant actually emits: paragraphs, bullet lists, **bold**,
 * *italic*, and `code`.
 */

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      nodes.push(<strong key={`${keyBase}${i}`}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      nodes.push(<em key={`${keyBase}${i}`}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      nodes.push(
        <code key={`${keyBase}${i}`} className="rounded bg-cream-200 px-1 py-0.5 text-[0.85em]">
          {m[4]}
        </code>
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-2 text-sm leading-relaxed text-evergreen-900">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        const isList =
          lines.length > 0 && lines.every((l) => /^\s*[-*]\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi} className="list-disc space-y-1 pl-5">
              {lines.map((l, li) => (
                <li key={li}>
                  {renderInline(l.replace(/^\s*[-*]\s+/, ""), `${bi}-${li}-`)}
                </li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{renderInline(block.replace(/\n/g, " "), `${bi}-`)}</p>;
      })}
    </div>
  );
}
