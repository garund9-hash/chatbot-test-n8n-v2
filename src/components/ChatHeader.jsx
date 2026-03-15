import React from 'react';
import { Bot, Trash2 } from 'lucide-react';

/**
 * ChatHeader
 * Presenter component: renders the chat window header.
 *
 * Props:
 * - onClear: callback when clear button is clicked
 */

const BOT_ICON_SIZE = 24;
const TRASH_ICON_SIZE = 18;
const APP_NAME = 'Nexus AI';
const STATUS_LABEL = 'Online';

function ChatHeaderComponent({ onClear }) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <div className="bot-avatar">
          <Bot size={BOT_ICON_SIZE} color="white" />
        </div>
        <h1>{APP_NAME}</h1>
      </div>
      <div className="header-right">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>{STATUS_LABEL}</span>
        </div>
        <button
          onClick={onClear}
          className="clear-btn"
          title="Clear Conversation"
        >
          <Trash2 size={TRASH_ICON_SIZE} />
        </button>
      </div>
    </header>
  );
}

export const ChatHeader = React.memo(ChatHeaderComponent);
