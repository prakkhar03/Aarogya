import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Check, X, FileText, UserCircle, List } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './DoctorPortal.css';

const API_BASE_URL = 'http://localhost:8000/api';

const DoctorPortal = () => {
  const { token, logout, user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupForm, setSetupForm] = useState({ name: '', specialization: '' });
  const [setupLoading, setSetupLoading] = useState(false);

  const [pendingList, setPendingList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  React.useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/doctors/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      fetchPendingVerifications();
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNeedsSetup(true);
        setSetupForm({ name: `Dr. ${user?.username || ''}`, specialization: 'General Physician' });
      }
      setFetching(false);
    }
  };

  const handleSetupProfile = async (e) => {
    e.preventDefault();
    setSetupLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/doctors/create-profile/`, setupForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile created successfully!");
      setNeedsSetup(false);
      checkProfile();
    } catch (err) {
      toast.error("Failed to setup profile.");
    } finally {
      setSetupLoading(false);
    }
  };

  const fetchPendingVerifications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pending/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingList(res.data);
      if (res.data.length > 0) {
        setSelectedItem(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch pending verifications", err);
    } finally {
      setFetching(false);
    }
  };

  const handleVerify = async (action) => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      // Hit the actual backend endpoint, though token is mock so it will likely 404
      await axios.post(`${API_BASE_URL}/verify/${selectedItem.token}/`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Report ${action} successfully!`);
      setVerificationStatus(prev => ({ ...prev, [selectedItem.token]: action }));
    } catch (err) {
      console.warn("Verification failed", err);
      toast.error(`Verification failed`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="doctor-portal" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  if (needsSetup) {
    return (
      <div className="doctor-portal setup-portal">
        <div className="setup-card glass-card">
          <div className="setup-header">
            <UserCircle size={48} color="var(--primary)" />
            <h2>Doctor Profile Setup</h2>
            <p>Please complete your profile to start receiving verifications.</p>
          </div>
          <form onSubmit={handleSetupProfile}>
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={setupForm.name} 
                onChange={e => setSetupForm({...setupForm, name: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Specialization</label>
              <input 
                type="text" 
                value={setupForm.specialization} 
                onChange={e => setSetupForm({...setupForm, specialization: e.target.value})} 
                required 
              />
            </div>
            <button type="submit" className="btn-primary w-100 mt-4" disabled={setupLoading}>
              {setupLoading ? "Saving..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-portal">
      <div className="portal-header">
        <div className="portal-brand">
          <h2>Doctor Verification Portal</h2>
          <span className="badge">{profile?.name || 'Doctor'} | {profile?.specialization}</span>
        </div>
        <div className="portal-actions">
          <button className="btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="portal-workspace">
        <div className="workspace-panel list-panel">
          <div className="panel-header">
            <List size={20} />
            <h3>Pending Verifications</h3>
          </div>
          <div className="pending-list">
            {pendingList.map(item => (
              <div 
                key={item.token} 
                className={`pending-item ${selectedItem?.token === item.token ? 'active' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="pending-item-header">
                  <h4>{item.patient_name}</h4>
                  {verificationStatus[item.token] && (
                    <span className={`status-badge ${verificationStatus[item.token]}`}>
                      {verificationStatus[item.token]}
                    </span>
                  )}
                </div>
                <p>Report #{item.report_id} - {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="workspace-panel document-panel">
          <div className="panel-header">
            <FileText size={20} />
            <h3>Source Document & AI Report</h3>
          </div>
          <div className="document-content">
            {selectedItem ? (
              <>
                <div className="patient-meta">
                  <UserCircle size={40} className="text-primary" />
                  <div>
                    <h4>{selectedItem.patient_name}</h4>
                    <p>Report #{selectedItem.report_id} • {new Date(selectedItem.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="document-text" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem', background: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                  <h5>Extracted Source Text</h5>
                  {selectedItem.report_text}
                </div>
                
                <div className="ai-synthesis" style={{ padding: '1rem', border: '1px solid var(--primary)', borderRadius: '8px', background: 'white' }}>
                  <h5 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>AI Synthesis</h5>
                  {(() => {
                    let analysis = selectedItem.report_analysis;
                    if (typeof analysis === 'string') {
                      try { analysis = JSON.parse(analysis); } catch(e) {}
                    }
                    const triage = analysis?.triage || analysis?.analysis || analysis || {};
                    return (
                      <>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Summary:</strong> {triage.summary || "No summary"}</p>
                        {triage.condition && <p style={{ marginBottom: '0.5rem' }}><strong>Condition:</strong> {triage.condition}</p>}
                        {triage.severity && <p style={{ marginBottom: '0.5rem' }}><strong>Severity:</strong> {triage.severity}</p>}
                        {triage.precautions?.length > 0 && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Precautions:</strong>
                            <ul style={{ paddingLeft: '1.5rem' }}>{triage.precautions.map((p,i) => <li key={i}>{p}</li>)}</ul>
                          </div>
                        )}
                        {triage.recommendations?.length > 0 && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong>Recommendations:</strong>
                            <ul style={{ paddingLeft: '1.5rem' }}>{triage.recommendations.map((r,i) => <li key={i}>{r}</li>)}</ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div className="empty-selection">Select a report to verify</div>
            )}
          </div>
        </div>

        <div className="workspace-panel action-panel">
          <div className="panel-header">
            <h3>Clinical Verification</h3>
          </div>
          <div className="action-content">
            <p className="instruction-text">
              Please review the AI synthesis and recommendations. 
              Confirm if the findings align with your clinical judgment.
            </p>
            
            <div className="annotation-box">
              <label>Doctor's Notes (Optional)</label>
              <textarea placeholder="Add any specific instructions or corrections to the AI report..."></textarea>
            </div>

            {selectedItem && verificationStatus[selectedItem.token] ? (
              <div className={`status-alert ${verificationStatus[selectedItem.token]}`}>
                {verificationStatus[selectedItem.token] === 'approved' ? (
                  <><Check size={20} /> Report Approved & Sent to Patient</>
                ) : (
                  <><X size={20} /> Report Rejected. AI flagged for retraining.</>
                )}
              </div>
            ) : (
              <div className="decision-buttons">
                <button 
                  className="btn-reject"
                  onClick={() => handleVerify('rejected')}
                  disabled={!selectedItem || loading}
                >
                  <X size={20} /> Reject Findings
                </button>
                <button 
                  className="btn-approve"
                  onClick={() => handleVerify('approved')}
                  disabled={!selectedItem || loading}
                >
                  <Check size={20} /> Approve Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;
