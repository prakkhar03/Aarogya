import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import './AdminPanel.css';

const AdminPanel = () => {
  const [prompts, setPrompts] = useState(`system:
  persona: "You are an expert AI clinical assistant named Aarogya."
  tone: "Professional, empathetic, and highly precise."
  constraints:
    - "Never provide definitive diagnoses."
    - "Always recommend consulting a human doctor for serious conditions."
    
triage_agent:
  goal: "Assess patient symptoms and suggest preliminary severity."
  
orchestrator_agent:
  goal: "Analyze medical reports and extract key clinical findings."`);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from local storage if exists
    const stored = localStorage.getItem('aarogya_prompts');
    if (stored) {
      setPrompts(stored);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('aarogya_prompts', prompts);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <div className="container admin-container">
          <div className="admin-header">
            <h2><Settings size={32} /> Admin Configuration</h2>
            <p>Modify system prompts and agent behaviors. (Frontend-only demo)</p>
          </div>

          <div className="config-panel glass-card">
            <div className="panel-top">
              <h3>System Prompts (YAML format)</h3>
              <button 
                className="btn-primary" 
                onClick={handleSave}
                style={{ padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem' }}
              >
                <Save size={18} />
                {saved ? "Saved!" : "Save Configuration"}
              </button>
            </div>

            <div className="editor-container">
              <div className="editor-sidebar">
                <div className="sidebar-item active">system_prompts.yaml</div>
                <div className="sidebar-item">agent_tools.yaml</div>
                <div className="sidebar-item">routing_rules.yaml</div>
              </div>
              <div className="editor-main">
                <textarea 
                  className="yaml-editor"
                  value={prompts}
                  onChange={(e) => setPrompts(e.target.value)}
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="warning-banner">
              <AlertCircle size={20} color="#f59e0b" />
              <span>Warning: Changes here immediately affect the behavior of the AI agents across the platform. Use extreme caution.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
