import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import './SymptomTriage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const SymptomTriage = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your AI Symptom Triage agent. Please describe what you're experiencing today.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const payload = { message: userMessage.text };
      if (sessionId) {
        payload.session_id = sessionId;
      }

      const response = await axios.post(`${API_BASE_URL}/symptoms/chat/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const replyText = response.data.reply;
      const newSessionId = response.data.session_id;

      setSessionId(newSessionId);
      setMessages(prev => [...prev, { id: Date.now(), text: replyText, sender: 'bot' }]);

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to connect to triage agent. Please try again.");
      setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, I encountered an error connecting to the agent.", sender: 'bot', isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="triage-page">
      <div className="container triage-container">
        <div className="triage-header">
          <h2>Symptom Triage Hub</h2>
          <p>Get instant preliminary assessments based on your symptoms.</p>
        </div>

        <div className="chat-interface glass-card">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`message-content ${msg.isError ? 'error' : ''}`}>
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content typing-indicator">
                  <Loader2 size={20} className="spin" />
                  <span>Agent is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms (e.g., I have a headache and fever)..."
              disabled={loading}
            />
            <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SymptomTriage;
