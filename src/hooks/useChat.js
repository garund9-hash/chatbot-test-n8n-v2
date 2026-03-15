import { useState } from 'react';
import { useSession } from './useSession.js';
import { chatApi } from '../services/chatApi.js';
import { MessageFactory } from '../lib/messageFactory.js';
import { isCommand, executeCommand } from '../lib/commandRegistry.js';

const FALLBACK_ERROR_MESSAGE = "I'm having trouble connecting right now. Please try again later.";

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

  const handleCommand = (trimmedInput) => {
    try {
      const commandContext = {
        sessionId,
        clearChat,
        addSystemMessage,
      };
      executeCommand(trimmedInput, commandContext);
      setInput('');
    } catch (error) {
      console.error('Command execution error:', error);
      addSystemMessage(`Error: ${error.message}`);
      setInput('');
    }
  };

  const handleApiMessage = async (trimmedInput) => {
    const userMessage = MessageFactory.userMessage(trimmedInput);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botText = await chatApi.sendMessage(trimmedInput, sessionId);
      setMessages((prev) => [...prev, MessageFactory.botMessage(botText)]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error.message || FALLBACK_ERROR_MESSAGE;
      setMessages((prev) => [
        ...prev,
        MessageFactory.errorMessage(errorMsg),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const trimmedInput = text.trim();

    if (isCommand(trimmedInput)) {
      handleCommand(trimmedInput);
    } else {
      await handleApiMessage(trimmedInput);
    }
  };

  return {
    messages,
    input,
    isLoading,
    setInput,
    sendMessage,
    clearChat,
    addSystemMessage,
  };
}
