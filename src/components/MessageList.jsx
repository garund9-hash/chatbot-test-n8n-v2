import React from 'react';
import { Loader2 } from 'lucide-react';
import { MessageItem } from './MessageItem.jsx';
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
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="message-item bot">
          <div className="message-sender-label">
            <span>Assistant</span>
          </div>
          <div className="message-bubble bot">
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </main>
  );
}
