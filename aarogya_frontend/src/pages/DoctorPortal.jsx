import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Check, X, FileText, UserCircle, List } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './DoctorPortal.css';

const API_BASE_URL = 'http://localhost:8000/api';

const MOCK_PENDING = [
  {
    id: 1,
    token: 'dummy-token-123',
    patientName: 'John Doe',
    age: 45,
    gender: 'Male',
    reportType: 'Blood Test & Vitals',
    text: `CLINICAL NOTES:\nPatient presented with mild fatigue and occasional headaches.\nVitals: BP 120/80, HR 72, Temp 98.6F.\nCholesterol levels: 240 mg/dL (Elevated).\nHDL: 35 mg/dL (Low).\n\nAI SYNTHESIS:\nThe patient's lipid profile indicates hyperlipidemia. Recommended to monitor blood pressure regularly and consider statin therapy.`
  },
  {
    id: 2,
    token: 'dummy-token-456',
    patientName: 'Sarah Smith',
    age: 32,
    gender: 'Female',
    reportType: 'Thyroid Panel',
    text: `CLINICAL NOTES:\nPatient complaining of weight gain and lethargy.\nTSH: 5.2 mIU/L (High)\nFree T4: 0.8 ng/dL (Low normal)\n\nAI SYNTHESIS:\nFindings suggest subclinical or mild hypothyroidism. Recommend repeating TSH in 3 months or initiating low-dose levothyroxine.`
  }
];

const DoctorPortal = () => {
  const { token, logout } = useAuth();
  const [pendingList, setPendingList] = useState(MOCK_PENDING);
  const [selectedItem, setSelectedItem] = useState(MOCK_PENDING[0]);
  const [verificationStatus, setVerificationStatus] = useState({}); // map of id -> status
  const [loading, setLoading] = useState(false);

  const handleVerify = async (action) => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      // Hit the actual backend endpoint, though token is mock so it will likely 404
      await axios.post(`${API_BASE_URL}/verify/${selectedItem.token}/`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Report ${action} successfully!`);
      setVerificationStatus(prev => ({ ...prev, [selectedItem.id]: action }));
    } catch (err) {
      console.warn("Verification failed (expected with mock token)", err);
      // Fallback for demo purposes since we don't have real tokens yet
      toast.success(`[Demo] Report ${action}!`);
      setVerificationStatus(prev => ({ ...prev, [selectedItem.id]: action }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-portal">
      <div className="portal-header">
        <div className="portal-brand">
          <h2>Doctor Verification Portal</h2>
          <span className="badge">Dr. Prakash</span>
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
                key={item.id} 
                className={`pending-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="pending-item-header">
                  <h4>{item.patientName}</h4>
                  {verificationStatus[item.id] && (
                    <span className={`status-badge ${verificationStatus[item.id]}`}>
                      {verificationStatus[item.id]}
                    </span>
                  )}
                </div>
                <p>{item.reportType}</p>
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
                    <h4>{selectedItem.patientName}</h4>
                    <p>{selectedItem.age} yrs • {selectedItem.gender} • {selectedItem.reportType}</p>
                  </div>
                </div>
                <div className="document-text">
                  <pre>{selectedItem.text}</pre>
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

            {selectedItem && verificationStatus[selectedItem.id] ? (
              <div className={`status-alert ${verificationStatus[selectedItem.id]}`}>
                {verificationStatus[selectedItem.id] === 'approved' ? (
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
