import React from 'react';
import { MessageItem } from './MessageItem.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { useScrollToBottom } from '../hooks/useScrollToBottom.js';

/**
 * MessageList
 * Presenter component: renders the scrollable message list with typing indicator.
 *
 * Props:
 * - messages: array of message objects
 * - isLoading: boolean, shows typing indicator when true
 */

export function MessageList({ messages, isLoading }) {
  const messagesEndRef = useScrollToBottom([messages, isLoading]);

  return (
    <main className="message-list">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </main>
  );
}
