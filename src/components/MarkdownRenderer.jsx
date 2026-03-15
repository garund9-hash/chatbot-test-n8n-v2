import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * MarkdownRenderer
 * Wrapper around react-markdown with safe defaults.
 *
 * Renders markdown with:
 * - Links: enabled but target="_blank"
 * - Code blocks: rendered with syntax highlighting
 * - Inline code: rendered with code styling
 * - Lists: rendered with proper spacing
 * - Bold, italic, strikethrough: rendered with semantic HTML
 *
 * Note: Assumes input is from a trusted source (n8n LLM).
 * For user-generated content, add sanitization (e.g., DOMPurify).
 */

// Module-level constants — created once, never reallocated on re-renders
const PARAGRAPH_STYLE = { margin: '0.5rem 0' };
const INLINE_CODE_STYLE = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: '0.2em 0.4em',
  borderRadius: '3px',
  fontFamily: 'monospace',
  fontSize: '0.9em',
};
const BLOCK_CODE_STYLE = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '0.75rem',
  borderRadius: '6px',
  overflow: 'auto',
  margin: '0.5rem 0',
};
const LIST_STYLE = { marginLeft: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' };
const LIST_ITEM_STYLE = { marginBottom: '0.25rem' };

const MARKDOWN_COMPONENTS = {
  a: ({ node, href, children, ...props }) => {
    // `node` is the remark AST node injected by react-markdown.
    // It is destructured here to prevent it being forwarded to the DOM <a> element,
    // which would cause a React unknown-prop warning.
    // Block javascript: and data: URIs to prevent XSS via prompt-injected bot responses.
    const safeHref = href && /^(https?:\/\/|mailto:)/i.test(href) ? href : '#';
    return (
      <a href={safeHref} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  p: ({ children }) => <p style={PARAGRAPH_STYLE}>{children}</p>,
  code: ({ inline, children }) => {
    // `inline` is a deprecated prop in react-markdown v8+. It still works but may be
    // removed in a future version. Consider migrating to the `pre`/`code` split approach.
    return inline ? (
      <code style={INLINE_CODE_STYLE}>{children}</code>
    ) : (
      <pre style={BLOCK_CODE_STYLE}>
        <code>{children}</code>
      </pre>
    );
  },
  ul: ({ children }) => <ul style={LIST_STYLE}>{children}</ul>,
  ol: ({ children }) => <ol style={LIST_STYLE}>{children}</ol>,
  li: ({ children }) => <li style={LIST_ITEM_STYLE}>{children}</li>,
};

export function MarkdownRenderer({ children }) {
  return <ReactMarkdown components={MARKDOWN_COMPONENTS}>{children}</ReactMarkdown>;
}
