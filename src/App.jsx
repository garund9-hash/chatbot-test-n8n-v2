import React from 'react';
import { useChat } from './hooks/useChat.js';
import { ChatWindow } from './components/ChatWindow.jsx';

/**
 * App
 * Container component: owns all application state and logic.
 * Calls useChat() and passes results as props to the presenter ChatWindow.
 *
 * This component has no direct DOM rendering beyond the root container.
 * All JSX is delegated to ChatWindow and its sub-components.
 */

export function App() {
  const {
    messages,
    input,
    isLoading,
    setInput,
    sendMessage,
    clearChat,
  } = useChat();

  return (
    <ChatWindow
      messages={messages}
      input={input}
      isLoading={isLoading}
      onInputChange={setInput}
      onSendMessage={sendMessage}
      onClear={clearChat}
    />
  );
}
