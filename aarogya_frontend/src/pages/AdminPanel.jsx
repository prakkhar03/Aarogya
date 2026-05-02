import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Save, RefreshCw, AlertCircle, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import './AdminPanel.css';

const DEFAULT_CONFIGS = {
  system_prompt: [
    'system:',
    '  persona: "You are an expert AI clinical assistant named Aarogya."',
    '  tone: "Professional, empathetic, and highly precise."',
    '  constraints:',
    '    - "Never provide definitive diagnoses."',
    '    - "Always recommend consulting a human doctor for serious conditions."',
    '    - "Avoid speculating about conditions without sufficient information."',
  ].join('\n'),

  triage_agent: [
    'triage_agent:',
    '  goal: "Assess patient symptoms and suggest preliminary severity."',
    '  instructions:',
    '    - "Always ask clarifying questions if the symptom description is vague."',
    '    - "Classify severity as: mild, moderate, severe, or critical."',
    '    - "Suggest the most relevant medical specialty based on symptoms."',
  ].join('\n'),

  report_agent: [
    'report_agent:',
    '  goal: "Analyze medical reports and extract key clinical findings."',
    '  instructions:',
    '    - "Parse all biomarkers and flag those outside the reference range."',
    '    - "Produce a structured JSON with: summary, severity, doctor_type, findings."',
    '    - "Be precise and clinical. Do not use laymens terms in the output JSON."',
  ].join('\n'),
};

const AdminPanel = () => {
  const [configs, setConfigs] = useState([]);
  const [activeConfig, setActiveConfig] = useState('');
  const [content, setContent] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [newName, setNewName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);

  const seedDefaults = async () => {
    await Promise.all(
      Object.entries(DEFAULT_CONFIGS).map(([name, text]) =>
        apiClient.put('/prompts/' + name + '/', { content: text }).catch(() => {})
      )
    );
  };

  const fetchList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await apiClient.get('/prompts/');
      const list = res.data;
      if (list.length === 0) {
        await seedDefaults();
        const res2 = await apiClient.get('/prompts/');
        setConfigs(res2.data);
        if (res2.data.length > 0) setActiveConfig(res2.data[0].name);
      } else {
        setConfigs(list);
        setActiveConfig(prev => prev || list[0].name);
      }
    } catch {
      const keys = Object.keys(DEFAULT_CONFIGS);
      setConfigs(keys.map(k => ({ name: k, updated_at: null })));
      setActiveConfig(prev => prev || keys[0]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchContent = useCallback(async (name) => {
    if (!name) return;
    setLoadingContent(true);
    try {
      const res = await apiClient.get('/prompts/' + name + '/');
      setContent(res.data.content);
    } catch {
      setContent(DEFAULT_CONFIGS[name] || '');
    } finally {
      setLoadingContent(false);
    }
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);
  useEffect(() => { if (activeConfig) fetchContent(activeConfig); }, [activeConfig, fetchContent]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await apiClient.put('/prompts/' + activeConfig + '/', { content });
      setSaveStatus('ok');
      fetchList();
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleCreate = async () => {
    const name = newName.trim().replace(/\s+/g, '_').toLowerCase();
    if (!name) return;
    await apiClient.put('/prompts/' + name + '/', { content: '# ' + name + '\n' }).catch(() => {});
    setNewName('');
    setShowNewInput(false);
    await fetchList();
    setActiveConfig(name);
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="admin-page">
      <div className="container admin-container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h2><Settings size={30} /> Prompt Configuration</h2>
            <p className="admin-subtitle">
              Edit and save AI agent prompts live. Changes apply immediately to the platform.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
              onClick={fetchList}
              title="Refresh list"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.5rem' }}
              onClick={handleSave}
              disabled={saving || loadingContent}
            >
              {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </div>

        {/* Status banners */}
        {saveStatus === 'ok' && (
          <div className="status-banner status-ok">
            <CheckCircle2 size={18} /> Changes saved to database successfully.
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="status-banner status-err">
            <AlertCircle size={18} /> Failed to save -- check backend connectivity.
          </div>
        )}

        {/* Main panel */}
        <div className="config-panel glass-card">
          <div className="editor-container">

            {/* Sidebar */}
            <div className="editor-sidebar">
              <div className="sidebar-label">AGENT CONFIGS</div>
              {loadingList ? (
                <div style={{ padding: '1rem', color: '#888', fontSize: '0.85rem' }}>Loading...</div>
              ) : (
                configs.map(cfg => (
                  <div
                    key={cfg.name}
                    className={'sidebar-item' + (activeConfig === cfg.name ? ' active' : '')}
                    onClick={() => setActiveConfig(cfg.name)}
                  >
                    <span className="sidebar-file-icon">&#128196;</span>
                    <div>
                      <div>{cfg.name}</div>
                      {cfg.updated_at && (
                        <div className="sidebar-date">{formatDate(cfg.updated_at)}</div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {showNewInput ? (
                <div style={{ padding: '0.75rem', borderTop: '1px solid #3c3c3c' }}>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="config_name"
                    autoFocus
                    style={{
                      width: '100%', background: '#1e1e1e', border: '1px solid #555',
                      borderRadius: '4px', color: '#fff', padding: '0.4rem 0.5rem',
                      fontSize: '0.82rem', marginBottom: '0.4rem',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={handleCreate} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>Create</button>
                    <button onClick={() => { setShowNewInput(false); setNewName(''); }} className="btn-outline" style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="sidebar-add-btn" onClick={() => setShowNewInput(true)}>
                  <Plus size={14} /> New Config
                </button>
              )}
            </div>

            {/* Editor */}
            <div className="editor-main">
              {loadingContent ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
                  <Loader2 size={24} className="spin" />
                  <span style={{ marginLeft: '0.5rem' }}>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="editor-topbar">
                    <span className="editor-filename">{activeConfig}</span>
                    <span className="editor-lang-badge">YAML / Text</span>
                  </div>
                  <textarea
                    className="yaml-editor"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    spellCheck="false"
                    style={{ top: '36px', height: 'calc(100% - 36px)' }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="warning-banner">
            <AlertCircle size={20} color="#f59e0b" />
            <span>
              <strong>Warning:</strong> Changes here immediately affect live AI agent behaviour.
              This panel is publicly accessible -- share the link with trusted reviewers only.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
