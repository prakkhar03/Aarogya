import React, { useState } from 'react';
import { Check, X, FileText, UserCircle } from 'lucide-react';
import './DoctorPortal.css';

const DoctorPortal = () => {
  // Mock data for the dual-view interface
  const [report, setReport] = useState({
    patientName: 'John Doe',
    age: 45,
    gender: 'Male',
    reportType: 'Blood Test & Vitals',
    text: `CLINICAL NOTES:
Patient presented with mild fatigue and occasional headaches. 
Vitals: BP 120/80, HR 72, Temp 98.6F.
Cholesterol levels: 240 mg/dL (Elevated).
HDL: 35 mg/dL (Low).

AI SYNTHESIS:
The patient's lipid profile indicates hyperlipidemia. Given the symptoms of fatigue and headaches, it is recommended to monitor blood pressure regularly and consider statin therapy if lifestyle modifications are insufficient.

RECOMMENDATIONS:
1. Dietary modifications (low sodium, low saturated fat).
2. Moderate daily exercise.
3. Follow-up lipid profile in 3 months.
`
  });

  const [verificationStatus, setVerificationStatus] = useState(null); // 'approved' | 'rejected'

  const handleVerify = (status) => {
    // Here we would call the /api/doctors/verify/<token>/ endpoint
    // For demo, we just update local state
    setVerificationStatus(status);
  };

  return (
    <div className="doctor-portal">
      <div className="portal-header">
        <div className="portal-brand">
          <h2>Doctor Verification Portal</h2>
          <span className="badge">Dr. Prakash</span>
        </div>
        <div className="portal-actions">
          <button className="btn-outline" style={{ padding: '0.5rem 1rem' }}>My Profile</button>
        </div>
      </div>

      <div className="portal-workspace">
        <div className="workspace-panel document-panel">
          <div className="panel-header">
            <FileText size={20} />
            <h3>Source Document & AI Report</h3>
          </div>
          <div className="document-content">
            <div className="patient-meta">
              <UserCircle size={40} className="text-primary" />
              <div>
                <h4>{report.patientName}</h4>
                <p>{report.age} yrs • {report.gender} • {report.reportType}</p>
              </div>
            </div>
            <div className="document-text">
              <pre>{report.text}</pre>
            </div>
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

            {verificationStatus ? (
              <div className={`status-alert ${verificationStatus}`}>
                {verificationStatus === 'approved' ? (
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
                >
                  <X size={20} /> Reject Findings
                </button>
                <button 
                  className="btn-approve"
                  onClick={() => handleVerify('approved')}
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
