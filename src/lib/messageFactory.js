import { v4 as uuidv4 } from 'uuid';

const WELCOME_MESSAGE_TEXT = 'Hello! I am your AI assistant. How can I help you today?';

/**
 * MessageFactory
 * Centralized factory for creating message objects.
 * Eliminates fragile ID generation (Date.now() collisions, hardcoded '1').
 * Each message gets a guaranteed unique UUID.
 *
 * Template Method pattern: fixed shape with variable parts.
 */

export const MessageFactory = {
  userMessage(text) {
    return {
      id: uuidv4(),
      text,
      sender: 'user',
    };
  },

  botMessage(text) {
    return {
      id: uuidv4(),
      text,
      sender: 'bot',
    };
  },

  errorMessage(text) {
    return {
      id: uuidv4(),
      text,
      sender: 'bot',
      isError: true,
    };
  },

  systemMessage(text) {
    return {
      id: uuidv4(),
      text,
      sender: 'bot',
      isSystem: true,
    };
  },

  welcomeMessage() {
    return {
      id: uuidv4(),
      text: WELCOME_MESSAGE_TEXT,
      sender: 'bot',
    };
  },
};
