import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Activity, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import './AuthPage.css';

const AuthPage = () => {
  const [mode, setMode] = useState('login');            // login | signup
  const [role, setRole] = useState('patient');           // patient | doctor
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, register } = useAuth();

  // refs for GSAP
  const leftRef  = useRef(null);
  const formRef  = useRef(null);
  const particleRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(leftRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo(formRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 });

    // Floating particles
    const particles = particleRef.current?.querySelectorAll('.particle');
    particles?.forEach((p, i) => {
      gsap.to(p, {
        y: `random(-80, 80)`,
        x: `random(-60, 60)`,
        duration: `random(4, 7)`,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.4,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let assignedRole;
      if (mode === 'login') {
        assignedRole = await login(username, password);
      } else {
        assignedRole = await register(username, password, role);
      }
      // Role-based redirect
      navigate(assignedRole === 'doctor' ? '/doctor' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ---- LEFT 40% ---- */}
      <div className="auth-left" ref={leftRef}>
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Activity size={28} color="#fff" /></div>
            <span>Aarogya</span>
          </div>
          <h1>Your Autonomous<br /><span>Health Advocate</span></h1>
          <p>
            Converting medical reports into doctor-grade insights
            through agentic AI — in seconds, not hours.
          </p>
        </div>

        {/* Floating particles */}
        <div className="particles" ref={particleRef}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${6 + Math.random() * 12}px`,
                height: `${6 + Math.random() * 12}px`,
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                opacity: 0.15 + Math.random() * 0.35,
              }}
            />
          ))}
        </div>
      </div>

      {/* ---- RIGHT 60% ---- */}
      <div className="auth-right">
        <div className="auth-form-wrapper" ref={formRef}>
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtext">
            {mode === 'login'
              ? 'Sign in to access your dashboard'
              : 'Join Aarogya AI as a patient or clinician'}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Role selector (signup only) */}
            {mode === 'signup' && (
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${role === 'patient' ? 'active' : ''}`}
                  onClick={() => setRole('patient')}
                >
                  🩺 Patient
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'doctor' ? 'active' : ''}`}
                  onClick={() => setRole('doctor')}
                >
                  👨‍⚕️ Doctor
                </button>
              </div>
            )}

            <div className="glass-input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div className="glass-input-group">
              <label>Password</label>
              <div className="pw-wrapper">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? (
                <><Loader2 size={20} className="spin" /> Processing...</>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Social divider */}
          <div className="auth-divider"><span>or continue with</span></div>
          <div className="social-btns">
            <button className="social-btn" type="button">
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.016 24.016 0 000 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Google
            </button>
            <button className="social-btn" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 013.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 11.01-4.13 2.07 2.07 0 01-.01 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.23 0H1.77A1.75 1.75 0 000 1.73v20.54A1.75 1.75 0 001.77 24h20.45A1.76 1.76 0 0024 22.27V1.73A1.76 1.76 0 0022.23 0z"/></svg>
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
