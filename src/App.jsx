import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

function App() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am your AI assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate or retrieve sessionId
    let storedId = localStorage.getItem('chat_session_id');
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('chat_session_id', storedId);
    }
    setSessionId(storedId);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearChat = () => {
    const defaultMsg = { id: '1', text: 'Hello! I am your AI assistant. How can I help you today?', sender: 'bot' };
    setMessages([defaultMsg]);
    // Optionally reset sessionId to start a truly fresh session
    const newId = uuidv4();
    localStorage.setItem('chat_session_id', newId);
    setSessionId(newId);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Handle slash commands
    if (input.trim().toLowerCase() === '/clear') {
      clearChat();
      setInput('');
      return;
    }

    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      
      // Handle the response from n8n (assuming it returns an object with a 'output' or 'message' field)
      // If n8n returns an array or different structure, this might need adjustment
      const botResponse = typeof data === 'string' ? data : (data.output || data.message || JSON.stringify(data));

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: botResponse, 
        sender: 'bot' 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", 
        sender: 'bot',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-window">
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={24} color="white" />
            </div>
            <h1>Nexus AI</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              Online
            </div>
            <button 
              onClick={clearChat}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              title="Clear Conversation"
              className="hover-bg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        <main className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-item ${msg.sender}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.sender === 'bot' ? <Bot size={14} className="text-secondary" /> : <User size={14} className="text-secondary" />}
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {msg.sender === 'bot' ? 'Assistant' : 'You'}
                </span>
              </div>
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-item bot">
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                <Bot size={14} className="text-secondary" />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Assistant
                </span>
              </div>
              <div className="message-bubble bot" style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
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

        <footer className="input-area">
          <form className="input-container" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Query the nexus..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '1rem', opacity: 0.6 }}>
            Powered by n8n Workflow Automation
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
