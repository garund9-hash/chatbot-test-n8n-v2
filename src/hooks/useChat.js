import { useState } from 'react';
import { useSession } from './useSession.js';
import { chatApi } from '../services/chatApi.js';
import { MessageFactory } from '../lib/messageFactory.js';
import { isCommand, executeCommand } from '../lib/commandRegistry.js';

/**
 * useChat
 * Primary custom hook: composes all chat logic.
 *
 * Owns:
 * - messages[] state
 * - input state
 * - isLoading state
 * - sendMessage handler
 * - clearChat handler
 * - addSystemMessage handler (used by slash commands)
 *
 * Returns all state and handlers needed by the ChatWindow component.
 */

export function useChat() {
  const { sessionId, resetSession } = useSession();
  const [messages, setMessages] = useState([MessageFactory.welcomeMessage()]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addSystemMessage = (text) => {
    setMessages((prev) => [...prev, MessageFactory.systemMessage(text)]);
  };

  const clearChat = () => {
    setMessages([MessageFactory.welcomeMessage()]);
    resetSession();
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const trimmedInput = text.trim();

    // Check if this is a command
    if (isCommand(trimmedInput)) {
      try {
        const commandContext = {
          sessionId,
          clearChat,
          addSystemMessage,
        };
        executeCommand(trimmedInput, commandContext);
        setInput('');
        return;
      } catch (error) {
        console.error('Command execution error:', error);
        addSystemMessage(`Error: ${error.message}`);
        setInput('');
        return;
      }
    }

    // Not a command — proceed with API call
    const userMessage = MessageFactory.userMessage(text);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await chatApi.sendMessage(text, sessionId);
      setMessages((prev) => [...prev, MessageFactory.botMessage(botResponse)]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error.message || 'I\'m having trouble connecting right now. Please try again later.';
      setMessages((prev) => [
        ...prev,
        MessageFactory.errorMessage(errorMsg),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    isLoading,
    sessionId,
    setInput,
    sendMessage,
    clearChat,
    addSystemMessage,
  };
}
