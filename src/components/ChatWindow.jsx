import React from 'react';
import { ChatHeader } from './ChatHeader.jsx';
import { MessageList } from './MessageList.jsx';
import { ChatInput } from './ChatInput.jsx';

/**
 * ChatWindow
 * Compound component: assembles all chat sub-components into the main chat UI.
 *
 * This is a "presenter" component that receives all state and handlers as props
 * and simply arranges the child components. It has no logic of its own.
 *
 * Props:
 * - messages: array of message objects
 * - input: current input value
 * - isLoading: boolean
 * - onInputChange: callback when input changes
 * - onSendMessage: callback when message is sent
 * - onClearChat: callback when clear button is clicked
 */

export function ChatWindow({
  messages,
  input,
  isLoading,
  onInputChange,
  onSendMessage,
  onClearChat,
}) {
  return (
    <div className="app-container">
      <div className="chat-window">
        <ChatHeader onClear={onClearChat} />
        <MessageList messages={messages} isLoading={isLoading} />
        <ChatInput
          value={input}
          onChange={onInputChange}
          onSubmit={onSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
