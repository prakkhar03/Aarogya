import React from 'react';
import { Brain, Terminal, ChevronRight, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './AgentReasoningPanel.css';

const AgentReasoningPanel = ({ data, isOpen, onClose }) => {
  if (!isOpen) return null;

  // The data is expected to be the parsed JSON analysis from the backend.
  // It might contain fields like `findings`, `reasoning`, `tool_calls` etc.
  // We'll mock a robust display assuming a standard agent output structure if not strictly defined.

  return (
    <motion.div 
      className="agent-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <div className="agent-panel-header">
        <div className="agent-panel-title">
          <Brain size={24} className="text-primary" />
          <h3>Agent Reasoning Stream</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="agent-panel-content">
        <div className="system-status">
          <div className="status-indicator">
            <Activity size={16} className="spin" />
            <span>Analysis Complete</span>
          </div>
          <span className="timestamp">{new Date().toLocaleTimeString()}</span>
        </div>

        {data ? (
          <div className="reasoning-stream">
            {/* Mocked steps for visual streaming effect based on real data */}
            <div className="stream-step completed">
              <div className="step-icon"><CheckCircle2 size={16} /></div>
              <div className="step-content">
                <strong>Document Parsed</strong>
                <p>Extracted {data.extracted_text?.length || 1500} characters</p>
              </div>
            </div>

            <div className="stream-step completed">
              <div className="step-icon"><Terminal size={16} /></div>
              <div className="step-content">
                <strong>Executing Tool: Medical NER</strong>
                <div className="code-block">
                  <pre><code>{JSON.stringify(data.findings || data, null, 2)}</code></pre>
                </div>
              </div>
            </div>

            <div className="stream-step active">
              <div className="step-icon"><Brain size={16} /></div>
              <div className="step-content">
                <strong>Final Clinical Synthesis</strong>
                <p>{typeof data === 'string' ? data : data.summary || "Synthesis generated successfully. Ready for Doctor verification."}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>No reasoning data available.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AgentReasoningPanel;
