import React from 'react';
import { Bot, Trash2 } from 'lucide-react';

/**
 * ChatHeader
 * Presenter component: renders the chat window header.
 *
 * Props:
 * - onClear: callback when clear button is clicked
 */

export function ChatHeader({ onClear }) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <div className="bot-avatar">
          <Bot size={24} color="white" />
        </div>
        <h1>Nexus AI</h1>
      </div>
      <div className="header-right">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Online</span>
        </div>
        <button
          onClick={onClear}
          className="clear-btn"
          title="Clear Conversation"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </header>
  );
}
