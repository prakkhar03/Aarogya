import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Globe, ExternalLink, Link2, ArrowUpRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Brand column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon"><Activity size={20} color="#fff" /></div>
            <span>Aarogya</span>
          </div>
          <p>
            An AI-powered clinical platform that transforms medical reports
            into verified, doctor-grade insights.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Github"><Globe size={18} /></a>
            <a href="#" aria-label="Twitter"><ExternalLink size={18} /></a>
            <a href="#" aria-label="LinkedIn"><Link2 size={18} /></a>
          </div>
        </div>

        {/* Nav columns */}
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/triage">Symptom Triage</Link></li>
            <li><Link to="/dashboard">Report Analysis</Link></li>
            <li><Link to="/doctor">Doctor Portal</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/">About</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><Link to="/">Documentation</Link></li>
            <li><Link to="/">Contact Us</Link></li>
            <li><Link to="/">FAQ</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aarogya AI. All rights reserved.</p>
        <div className="powered-badge">
          <span>Powered by Agentic AI</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
