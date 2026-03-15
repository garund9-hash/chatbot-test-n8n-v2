import React from 'react';
import { Send, Loader2 } from 'lucide-react';

/**
 * ChatInput
 * Presenter component: renders the message input form.
 *
 * Props:
 * - value: current input value
 * - onChange: callback when input changes
 * - onSubmit: callback when form is submitted
 * - isLoading: boolean, disables input and shows spinner when true
 */

const SEND_ICON_SIZE = 20;
const FOOTER_DISCLAIMER = 'Powered by n8n Workflow Automation';

export function ChatInput({ value, onChange, onSubmit, isLoading }) {
  const handleInputChange = (e) => onChange(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <footer className="input-area">
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Query the nexus..."
          value={value}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit" className="send-btn" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" size={SEND_ICON_SIZE} />
          ) : (
            <Send size={SEND_ICON_SIZE} />
          )}
        </button>
      </form>
      <p className="footer-disclaimer">
        {FOOTER_DISCLAIMER}
      </p>
    </footer>
  );
}
