/**
 * TypingIndicator
 * Presenter component: renders an animated typing indicator.
 *
 * Extracted from MessageList to avoid duplication and improve component clarity.
 * Shows three animated dots while bot is composing a response.
 */

export function TypingIndicator() {
  return (
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
  );
}
