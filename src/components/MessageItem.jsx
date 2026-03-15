import React from 'react';
import { Bot, User } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer.jsx';

/**
 * MessageItem
 * Presenter component: renders a single message bubble.
 *
 * Strategy Pattern: rendering strategy varies per message type (sender + error flag).
 * - 'user' messages: plain text, right-aligned
 * - 'bot' messages: markdown rendering, left-aligned
 * - 'bot' + isError: error styling, plain text (no markdown), left-aligned
 * - 'bot' + isSystem: system styling, plain text, left-aligned
 *
 * Props:
 * - message: { id, text, sender, isError?, isSystem? }
 */

function resolveMessageType(sender, isError, isSystem) {
  if (sender === 'bot' && isError) return 'error';
  if (sender === 'bot' && isSystem) return 'system';
  return sender;
}

const renderStrategies = {
  // User message: plain text, no markdown
  user: (text) => <span>{text}</span>,

  // Bot message: markdown enabled
  bot: (text) => <MarkdownRenderer>{text}</MarkdownRenderer>,

  // Error message: plain text with error styling
  error: (text) => <span>{text}</span>,

  // System message: plain text with system styling
  system: (text) => <span>{text}</span>,
};

function MessageItemComponent({ message }) {
  const { text, sender, isError, isSystem } = message;

  const messageType = resolveMessageType(sender, isError, isSystem);
  const renderContent = renderStrategies[messageType] || renderStrategies.bot;
  const bubbleClassName = ['message-bubble', sender, isError && 'error', isSystem && 'system']
    .filter(Boolean).join(' ');
  const senderLabel = sender === 'bot' ? 'Assistant' : 'You';
  const senderIcon = sender === 'bot' ? <Bot size={14} /> : <User size={14} />;

  return (
    <div className={`message-item ${sender}`}>
      <div className="message-sender-label">
        {senderIcon}
        <span>{senderLabel}</span>
      </div>
      <div className={bubbleClassName}>
        {renderContent(text)}
      </div>
    </div>
  );
}

export const MessageItem = React.memo(MessageItemComponent);
