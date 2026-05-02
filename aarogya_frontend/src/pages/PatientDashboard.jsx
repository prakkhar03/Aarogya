import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, BrainCircuit, Share2, Clock, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import AgentReasoningPanel from '../components/AgentReasoningPanel';
import AnimatedDNA from '../components/AnimatedDNA';
import { useAuth } from '../hooks/useAuth';
import { apiClient, getApiErrorMessage } from '../lib/apiClient';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [sharing, setSharing] = useState(null);

  const [emailPrompt, setEmailPrompt] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  React.useEffect(() => {
    if (token) {
      fetchHistory();
      fetchAppointments();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/reports/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await apiClient.get('/bookings/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadReport = () => {
    if (!result || !result.analysis) return;
    
    let analysisObj = result.analysis;
    if (typeof analysisObj === 'string') {
      try { analysisObj = JSON.parse(analysisObj); } catch(e) {}
    }

    const triage = analysisObj?.triage || analysisObj?.analysis || {};
    
    const content = `AAROGYA AI CLINICAL REPORT\nReport ID: #${result.report_id || 'N/A'}\nDate: ${new Date().toLocaleDateString()}\n\nSUMMARY\n--------------------------------------------------\n${triage.summary || analysisObj?.summary || "No summary available."}\n\nASSESSMENT\n--------------------------------------------------\nSeverity Level: ${triage.severity || "Unknown"}\nRecommended Specialist: ${triage.doctor_type || "General Physician"}\n\nThis report was generated autonomously by Aarogya AI.\nPlease consult a certified medical professional for official diagnosis.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aarogya_Report_${result.report_id || 'Latest'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post('/reports/upload/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(response.data);
      toast.success("Report analyzed successfully!");
      setPanelOpen(true);
      fetchHistory(); // Refresh list
    } catch (error) {
      console.error("Error uploading file", error);
      toast.error(getApiErrorMessage(error) || "Failed to upload report. Please check the file and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <div className="dashboard-header">
          <h2>Patient Dashboard</h2>
          <p>Upload your medical reports for instant AI analysis.</p>
        </div>

        <div className="dashboard-grid">
          <div className="upload-section glass-card">
            <h3>Upload New Report</h3>
            
            <div className="upload-zone">
              <input 
                type="file" 
                id="file-upload" 
                className="file-input" 
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="file-upload" className="upload-label">
                <UploadCloud size={48} className="text-primary mb-3" />
                <span className="upload-text">
                  {file ? file.name : "Drag and drop or click to browse"}
                </span>
                <span className="upload-hint">Supports PDF, PNG, JPG</span>
              </label>
            </div>

            <button 
              className="btn-primary w-100 mt-4" 
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? "Analyzing Document..." : "Analyze with AI"}
            </button>
          </div>

          <div className="results-section glass-card">
            <div className="results-header">
              <h3>Analysis Results</h3>
              {result && (
                <button 
                  className="btn-outline view-reasoning-btn"
                  onClick={() => setPanelOpen(true)}
                >
                  <BrainCircuit size={18} />
                  View Agent Reasoning
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading-state" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ transform: 'scale(0.5)', width: '100%', height: '200px', position: 'relative' }}>
                  <AnimatedDNA />
                </div>
                <p style={{ marginTop: '-40px', zIndex: 10 }}>AI is processing your document...</p>
              </div>
            ) : result ? (
              <div className="result-content">
                <div className="result-status">
                  <CheckCircle size={24} color="#10b981" />
                  <span>Report #{result.report_id} Analyzed Successfully</span>
                </div>
                
                <div className="result-summary">
                  <h4>Clinical Summary</h4>
                  <div className="structured-analysis">
                    {(() => {
                      let analysisObj = result.analysis;
                      if (typeof analysisObj === 'string') {
                        try { analysisObj = JSON.parse(analysisObj); } catch(e) { }
                      }
                      
                      const triage = analysisObj?.triage || analysisObj?.analysis || analysisObj;
                      
                      return (
                        <>
                          <div className="analysis-summary-text">
                            <strong>Summary:</strong> {triage?.summary || "Analysis successfully generated. No detailed summary available."}
                          </div>

                          {triage?.condition && triage.condition !== "Unknown" && (
                            <div className="analysis-condition">
                              <strong>Possible Condition:</strong> {triage.condition}
                            </div>
                          )}

                          {triage?.precautions && triage.precautions.length > 0 && (
                            <div className="analysis-list">
                              <strong>Precautions:</strong>
                              <ul>
                                {triage.precautions.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                          )}

                          {triage?.key_advice && triage.key_advice.length > 0 && (
                            <div className="analysis-list">
                              <strong>Key Advice:</strong>
                              <ul>
                                {triage.key_advice.map((a, i) => <li key={i}>{a}</li>)}
                              </ul>
                            </div>
                          )}

                          {triage?.recommendations && triage.recommendations.length > 0 && (
                            <div className="analysis-list">
                              <strong>Recommendations:</strong>
                              <ul>
                                {triage.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                              </ul>
                            </div>
                          )}
                          
                          {(triage?.severity || triage?.doctor_type) && (
                            <div className="analysis-badges">
                              {triage.severity && (
                                <div className={`analysis-badge severity-${triage.severity.toLowerCase()}`}>
                                  <span className="badge-label">Severity</span>
                                  <span className="badge-value">{triage.severity}</span>
                                </div>
                              )}
                              {triage.doctor_type && (
                                <div className="analysis-badge doctor-type">
                                  <span className="badge-label">Recommended Specialist</span>
                                  <span className="badge-value">{triage.doctor_type}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Suggested Doctors Section */}
                {(() => {
                  let analysisObj = result.analysis;
                  if (typeof analysisObj === 'string') {
                    try { analysisObj = JSON.parse(analysisObj); } catch(e) { }
                  }
                  
                  const doctors = analysisObj?.doctors || [];
                  
                  if (doctors.length > 0) {
                    return (
                      <div className="suggested-doctors">
                        <h4>Suggested Specialists for Verification</h4>
                        <div className="doctors-list">
                          {doctors.map(doc => (
                            <div key={doc.id} className="doctor-card glass-card">
                              <div>
                                <h5>{doc.name}</h5>
                                <p>{doc.specialization}</p>
                              </div>
                              <button 
                                className="btn-primary"
                                disabled={sharing === doc.id}
                                onClick={async () => {
                                  setSharing(doc.id);
                                  try {
                                    // 1. Create Appointment (PreBook)
                                    const prebookRes = await apiClient.post('/bookings/prebook/', {
                                      doctor_id: doc.id,
                                      report_id: result.report_id
                                    }, { headers: { Authorization: `Bearer ${token}` } });
                                    
                                    const appointmentId = prebookRes.data.appointment_id;

                                    // 2. Share with Doctor (Verification)
                                    await apiClient.post(`/share/${appointmentId}/`, {}, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    
                                    toast.success(`Appointment requested with Dr. ${doc.name}!`);
                                    fetchAppointments();
                                  } catch (err) {
                                    if (err.response?.status === 400 && err.response.data?.error === "Please add email before booking") {
                                      setEmailPrompt({ doctor_id: doc.id, report_id: result.report_id, doctor_name: doc.name });
                                    } else {
                                      toast.error(err.response?.data?.error || "Failed to book appointment.");
                                    }
                                  } finally {
                                    setSharing(null);
                                  }
                                }}
                              >
                                {sharing === doc.id ? "Booking..." : "Book Appointment"}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="result-actions" style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn-outline w-100" 
                    onClick={handleDownloadReport}
                  >
                    <Download size={18}/> Download Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={48} color="#cbd5e1" />
                <p>No results yet. Upload a report to see the analysis here.</p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="history-section mt-5">
            <h3>Recent Reports</h3>
            <div className="history-grid mt-3">
              {history.map(item => (
                <div key={item.id} className="history-card glass-card">
                  <div className="history-card-header">
                    <Clock size={20} color="var(--primary)" />
                    <span>Report #{item.id}</span>
                  </div>
                  <p className="history-date">{new Date(item.created_at).toLocaleDateString()}</p>
                  <button 
                    className="btn-outline w-100 mt-3"
                    onClick={() => {
                      setResult({ report_id: item.id, analysis: item.analysis });
                      setPanelOpen(true);
                    }}
                  >
                    View Analysis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Section */}
        {appointments.length > 0 && (
          <div className="history-section mt-5" style={{ paddingBottom: '3rem' }}>
            <h3>My Appointments</h3>
            <div className="history-grid mt-3">
              {appointments.map(appt => (
                <div key={appt.id} className="history-card glass-card">
                  <div className="history-card-header">
                    <Clock size={20} color="var(--primary)" />
                    <span>Appt #{appt.id}</span>
                  </div>
                  <h4 style={{ margin: '0.5rem 0 0.25rem' }}>Dr. {appt.doctor_name}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>{appt.doctor_specialization}</p>
                  
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    backgroundColor: appt.status === 'confirmed' ? '#dcfce7' : appt.status === 'rejected' || appt.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                    color: appt.status === 'confirmed' ? '#166534' : appt.status === 'rejected' || appt.status === 'cancelled' ? '#991b1b' : '#854d0e',
                    textTransform: 'capitalize'
                  }}>
                    {appt.status}
                  </div>
                  <p className="history-date mt-3">Requested: {new Date(appt.created_at).toLocaleDateString()}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>For Report #{appt.report_id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {panelOpen && (
        <AgentReasoningPanel 
          traces={result.reasoning_traces} 
          onClose={() => setPanelOpen(false)} 
        />
      )}

      {emailPrompt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ width: '400px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Email Required</h3>
            <p style={{marginBottom: '1.5rem', color: 'var(--text-light)', lineHeight: '1.5'}}>
              Please provide your email address to receive status updates for your appointment with <strong>Dr. {emailPrompt.doctor_name}</strong>.
            </p>
            <input 
              type="email" 
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="your.email@example.com"
              className="w-100 mb-3"
              style={{ 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(255,255,255,0.2)', 
                background: 'rgba(255,255,255,0.05)', 
                color: '#fff',
                marginBottom: '1.5rem'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn-outline" 
                onClick={() => setEmailPrompt(null)}
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                disabled={emailLoading}
                onClick={async () => {
                  if (!emailInput) return toast.error("Please enter an email");
                  setEmailLoading(true);
                  try {
                    // Save email
                    await axios.post(`${API_BASE_URL}/auth/update-email/`, { email: emailInput }, { headers: { Authorization: `Bearer ${token}` } });
                    
                    // Retry booking
                    const prebookRes = await axios.post(`${API_BASE_URL}/bookings/prebook/`, {
                      doctor_id: emailPrompt.doctor_id,
                      report_id: emailPrompt.report_id
                    }, { headers: { Authorization: `Bearer ${token}` } });
                    
                    const appointmentId = prebookRes.data.appointment_id;
                    await axios.post(`${API_BASE_URL}/share/${appointmentId}/`, {}, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    toast.success(`Appointment requested with Dr. ${emailPrompt.doctor_name}!`);
                    setEmailPrompt(null);
                    fetchAppointments();
                  } catch (err) {
                    toast.error(err.response?.data?.error || "Failed to update email or book appointment.");
                  } finally {
                    setEmailLoading(false);
                  }
                }}
                style={{ padding: '0.5rem 1.5rem' }}
              >
                {emailLoading ? "Saving..." : "Save & Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
