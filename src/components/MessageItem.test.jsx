import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageItem } from './MessageItem.jsx';

describe('MessageItem component', () => {
  describe('user messages', () => {
    it('renders user message with correct sender label', () => {
      const msg = {
        id: '1',
        text: 'Hello bot',
        sender: 'user',
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('You')).toBeInTheDocument();
    });

    it('renders user message text', () => {
      const msg = {
        id: '1',
        text: 'My user message',
        sender: 'user',
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('My user message')).toBeInTheDocument();
    });

    it('user message has correct CSS class', () => {
      const msg = {
        id: '1',
        text: 'hello',
        sender: 'user',
      };
      const { container } = render(<MessageItem message={msg} />);
      expect(container.querySelector('.message-item.user')).toBeInTheDocument();
    });
  });

  describe('bot messages', () => {
    it('renders bot message with correct sender label', () => {
      const msg = {
        id: '1',
        text: 'Hello human',
        sender: 'bot',
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('Assistant')).toBeInTheDocument();
    });

    it('renders bot message with MarkdownRenderer', () => {
      const msg = {
        id: '1',
        text: '**bold text**',
        sender: 'bot',
      };
      render(<MessageItem message={msg} />);
      // MarkdownRenderer will parse markdown, so bold text should be rendered
      expect(screen.getByText('bold text')).toBeInTheDocument();
    });

    it('bot message has correct base CSS class', () => {
      const msg = {
        id: '1',
        text: 'hello',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      expect(container.querySelector('.message-item.bot')).toBeInTheDocument();
      expect(container.querySelector('.message-bubble.bot')).toBeInTheDocument();
    });
  });

  describe('error messages', () => {
    it('error message has isError flag and bot sender', () => {
      const msg = {
        id: '1',
        text: 'Something went wrong',
        sender: 'bot',
        isError: true,
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('Assistant')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('error message has error CSS class', () => {
      const msg = {
        id: '1',
        text: 'Error text',
        sender: 'bot',
        isError: true,
      };
      const { container } = render(<MessageItem message={msg} />);
      const bubble = container.querySelector('.message-bubble.error');
      expect(bubble).toBeInTheDocument();
      expect(bubble).toHaveClass('bot');
    });

    it('both error and system classes present when both flags set', () => {
      const msg = {
        id: '1',
        text: 'Priority error',
        sender: 'bot',
        isError: true,
        isSystem: true,
      };
      const { container } = render(<MessageItem message={msg} />);
      const bubble = container.querySelector('.message-bubble');
      expect(bubble).toHaveClass('error');
      expect(bubble).toHaveClass('system');
    });
  });

  describe('system messages', () => {
    it('system message has isSystem flag and bot sender', () => {
      const msg = {
        id: '1',
        text: 'Session started',
        sender: 'bot',
        isSystem: true,
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('Assistant')).toBeInTheDocument();
      expect(screen.getByText('Session started')).toBeInTheDocument();
    });

    it('system message has system CSS class', () => {
      const msg = {
        id: '1',
        text: 'System info',
        sender: 'bot',
        isSystem: true,
      };
      const { container } = render(<MessageItem message={msg} />);
      const bubble = container.querySelector('.message-bubble.system');
      expect(bubble).toBeInTheDocument();
      expect(bubble).toHaveClass('bot');
    });
  });

  describe('javascript: URI blocking', () => {
    it('blocks javascript: URIs in markdown links', () => {
      const msg = {
        id: '1',
        text: '[click me](javascript:alert(1))',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe('#');
    });

    it('allows http:// URIs in markdown links', () => {
      const msg = {
        id: '1',
        text: '[visit](http://example.com)',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      const link = container.querySelector('a');
      expect(link.getAttribute('href')).toBe('http://example.com');
    });

    it('allows https:// URIs in markdown links', () => {
      const msg = {
        id: '1',
        text: '[secure](https://example.com)',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      const link = container.querySelector('a');
      expect(link.getAttribute('href')).toBe('https://example.com');
    });

    it('allows mailto: URIs in markdown links', () => {
      const msg = {
        id: '1',
        text: '[email](mailto:test@example.com)',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      const link = container.querySelector('a');
      expect(link.getAttribute('href')).toBe('mailto:test@example.com');
    });

    it('blocks data: URIs in markdown links', () => {
      const msg = {
        id: '1',
        text: '[xss](data:text/html,<script>alert(1)</script>)',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      const link = container.querySelector('a');
      expect(link.getAttribute('href')).toBe('#');
    });

    it('opens safe links in new tab', () => {
      const msg = {
        id: '1',
        text: '[link](https://example.com)',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      const link = container.querySelector('a');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    });
  });

  describe('markdown rendering', () => {
    it('renders markdown lists', () => {
      const msg = {
        id: '1',
        text: '- item 1\n- item 2',
        sender: 'bot',
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('item 1')).toBeInTheDocument();
      expect(screen.getByText('item 2')).toBeInTheDocument();
    });

    it('renders markdown code blocks', () => {
      const msg = {
        id: '1',
        text: '```\ncode here\n```',
        sender: 'bot',
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('code here')).toBeInTheDocument();
    });

    it('renders inline code', () => {
      const msg = {
        id: '1',
        text: 'This is `inline code` in text',
        sender: 'bot',
      };
      render(<MessageItem message={msg} />);
      expect(screen.getByText('inline code')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty text', () => {
      const msg = {
        id: '1',
        text: '',
        sender: 'bot',
      };
      const { container } = render(<MessageItem message={msg} />);
      expect(container.querySelector('.message-item')).toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'a'.repeat(10000);
      const msg = {
        id: '1',
        text: longText,
        sender: 'bot',
      };
      render(<MessageItem message={msg} />);
      const container = render(<MessageItem message={msg} />).container;
      expect(container.textContent).toContain('a');
    });

    it('handles special characters in text', () => {
      const msg = {
        id: '1',
        text: '<script>alert(1)</script>',
        sender: 'bot',
      };
      render(<MessageItem message={msg} />);
      // React escapes HTML by default, so script tags should be rendered as text
      expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
    });
  });
});
