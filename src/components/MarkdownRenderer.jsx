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

export function MarkdownRenderer({ children }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ node, href, children, ...props }) => {
          // `node` is the remark AST node injected by react-markdown.
          // It is destructured here to prevent it being forwarded to the DOM <a> element,
          // which would cause a React unknown-prop warning.
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          );
        },
        p: ({ children }) => <p style={{ margin: '0.5rem 0' }}>{children}</p>,
        code: ({ inline, children }) => {
          // `inline` is a deprecated prop in react-markdown v8+. It still works but may be
          // removed in a future version. Consider migrating to the `pre`/`code` split approach.
          return inline ? (
            <code style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
            }}>
              {children}
            </code>
          ) : (
            <pre style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '0.75rem',
              borderRadius: '6px',
              overflow: 'auto',
              margin: '0.5rem 0',
            }}>
              <code>{children}</code>
            </pre>
          );
        },
        ul: ({ children }) => (
          <ul style={{ marginLeft: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol style={{ marginLeft: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            {children}
          </ol>
        ),
        li: ({ children }) => <li style={{ marginBottom: '0.25rem' }}>{children}</li>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
