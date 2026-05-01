import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, BrainCircuit, Share2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import AgentReasoningPanel from '../components/AgentReasoningPanel';
import AnimatedDNA from '../components/AnimatedDNA';
import { useAuth } from '../hooks/useAuth';
import './PatientDashboard.css';

const API_BASE_URL = 'http://localhost:8000/api';

const PatientDashboard = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [sharing, setSharing] = useState(false);

  React.useEffect(() => {
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reports/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/reports/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setResult(response.data);
      toast.success("Report analyzed successfully!");
      setPanelOpen(true);
      fetchHistory(); // Refresh list
    } catch (error) {
      console.error("Error uploading file", error);
      toast.error("Failed to upload report. Please check the file and try again.");
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
                  <p>{result.analysis?.summary || JSON.stringify(result.analysis)}</p>
                </div>

                <div className="result-actions">
                  <button 
                    className="btn-primary w-100" 
                    onClick={async () => {
                      setSharing(true);
                      try {
                        // Using a dummy appointment ID 1 for now
                        const res = await axios.post(`${API_BASE_URL}/share/1/`, {}, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        toast.success(`Verification sent to Doctor! (Token: ${res.data.token})`);
                      } catch (err) {
                        toast.error("Failed to send to doctor. Ensure an appointment exists.");
                      } finally {
                        setSharing(false);
                      }
                    }}
                    disabled={sharing}
                  >
                    {sharing ? "Sending..." : <><Share2 size={18}/> Send to Doctor for Verification</>}
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
      </div>

      <AgentReasoningPanel 
        isOpen={panelOpen} 
        onClose={() => setPanelOpen(false)} 
        data={result?.analysis} 
      />
    </div>
  );
};

export default PatientDashboard;
