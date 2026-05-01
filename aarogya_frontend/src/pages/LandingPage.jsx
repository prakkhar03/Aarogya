import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, FileText, MessageSquare, ShieldCheck,
  Brain, Stethoscope, UserCheck, Activity,
} from 'lucide-react';
import AnimatedDNA from '../components/AnimatedDNA';
import Footer from '../components/Footer';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const heroRef     = useRef(null);
  const aboutRef    = useRef(null);
  const featuresRef = useRef(null);
  const spotRef     = useRef(null);
  const testRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---- HERO stagger ---- */
      gsap.from('.hero-anim', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      });

      /* ---- ABOUT section ---- */
      gsap.from('.about-anim', {
        scrollTrigger: { trigger: aboutRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      });

      /* ---- FEATURES stagger ---- */
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
        y: 60,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      });

      /* ---- DOCTOR SPOTLIGHT ---- */
      gsap.from('.spot-anim', {
        scrollTrigger: { trigger: spotRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      });

      /* ---- TESTIMONIALS ---- */
      gsap.from('.test-anim', {
        scrollTrigger: { trigger: testRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page">
      {/* ═══════ HERO ═══════ */}
      <section className="hero-section" ref={heroRef}>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-anim">
              Your Partner in Health, <span className="text-primary">Every Step</span> of the Way
            </h1>
            <p className="hero-anim">
              An autonomous health advocate that converts medical reports into
              doctor-grade insights — powered by multi-agent AI.
            </p>
            <div className="hero-actions hero-anim">
              <Link to="/auth" className="btn-primary cta-lg">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/triage" className="btn-outline cta-lg">
                Try Symptom Triage
              </Link>
            </div>
          </div>

          <div className="hero-visual hero-anim">
            <div className="stats-badge top-left glass-card">
              <span className="stats-number">95%</span>
              <span className="stats-text">Diseases<br/>Treated</span>
            </div>
            <AnimatedDNA />
            <div className="stats-badge bottom-left glass-card">
              <span className="stats-number">100%</span>
              <span className="stats-text">Commitment To<br/>Your Well-Being</span>
            </div>
            <div className="stats-badge bottom-right glass-card">
              <span className="stats-number">99%</span>
              <span className="stats-text">Patient<br/>Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MARQUEE BANNER ═══════ */}
      <div className="marquee-banner">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="marquee-item">
              THE SCIENCE OF HEALING, THE ART OF CARE &nbsp;🏥&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ ABOUT ═══════ */}
      <section className="about-section" ref={aboutRef}>
        <div className="container about-container">
          <div className="about-content">
            <h4 className="section-subtitle about-anim">About Us</h4>
            <h2 className="about-anim">
              An Autonomous Health Advocate That Converts Medical Reports Into Doctor-Grade Insights
            </h2>
            <p className="about-anim">
              Aarogya AI combines multi-agent orchestration with clinical NLP
              to parse lab results, identify critical findings, and generate
              actionable pre-consultation summaries — all verified through a
              human-in-the-loop feedback gate before reaching the patient.
            </p>
            <Link to="/auth" className="btn-primary about-anim" style={{ marginTop: '1.5rem' }}>
              Read More
            </Link>

            <div className="stats-row about-anim">
              <div className="stat-item">
                <h3 className="stats-heading">15+</h3>
                <p className="stats-sub">Years Of Experience</p>
              </div>
              <div className="stat-item">
                <h3 className="stats-heading">50+</h3>
                <p className="stats-sub">Certified Specialists</p>
              </div>
              <div className="stat-item">
                <h3 className="stats-heading">15k+</h3>
                <p className="stats-sub">Reports Analyzed</p>
              </div>
            </div>
          </div>

          <div className="about-visual about-anim">
            <div className="orbit-container">
              <div className="orbit-circle outer"></div>
              <div className="orbit-circle inner"></div>
              <div className="orbit-item oi-1"><div className="orbit-dot"></div><span>24/7 Support</span></div>
              <div className="orbit-item oi-2"><div className="orbit-dot"></div><span>Affordable Healthcare</span></div>
              <div className="orbit-item oi-3"><div className="orbit-dot"></div><span>Patient Safety</span></div>
              <div className="orbit-item oi-4"><div className="orbit-dot"></div><span>Comprehensive Well-Being</span></div>
              <div className="orbit-center"><div className="orbit-dot"></div><span>Personalized<br/>Care</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES GRID ═══════ */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <h4 className="section-subtitle text-center">Platform Capabilities</h4>
          <h2 className="text-center features-title">
            Three Agents. One Seamless Pipeline.
          </h2>

          <div className="features-grid">
            <div className="feature-card hover-card">
              <div className="feature-icon"><FileText size={28} /></div>
              <div className="feature-body">
                <h3>Medical Report Analysis Agent</h3>
                <p>Upload any lab report PDF. Our NER-powered agent extracts biomarkers, flags critical ranges, and generates a structured clinical summary within seconds.</p>
              </div>
              <div className="feature-reveal">
                <Link to="/dashboard" className="btn-outline" style={{ fontSize: '0.875rem' }}>
                  Try It Now <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="feature-card hover-card">
              <div className="feature-icon"><MessageSquare size={28} /></div>
              <div className="feature-body">
                <h3>Symptom Interpretation Agent</h3>
                <p>Patients describe symptoms in natural language. The triage agent assesses severity, maps to potential conditions, and escalates urgent cases automatically.</p>
              </div>
              <div className="feature-reveal">
                <Link to="/triage" className="btn-outline" style={{ fontSize: '0.875rem' }}>
                  Start Chat <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="feature-card hover-card">
              <div className="feature-icon"><ShieldCheck size={28} /></div>
              <div className="feature-body">
                <h3>Closed AI-to-Doctor Feedback Loop</h3>
                <p>Every AI insight is routed through the Doctor Verification Portal. Clinicians approve, annotate, or reject findings — ensuring clinical safety at every step.</p>
              </div>
              <div className="feature-reveal">
                <Link to="/doctor" className="btn-outline" style={{ fontSize: '0.875rem' }}>
                  Doctor Portal <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ DOCTOR SPOTLIGHT ═══════ */}
      <section className="spotlight-section" ref={spotRef}>
        <div className="container spotlight-container">
          <div className="spotlight-visual spot-anim">
            <div className="spotlight-card glass-card">
              <div className="spot-avatar">
                <Stethoscope size={48} />
              </div>
              <h3>Dr. Prakash</h3>
              <p className="spot-role">Senior Consultant — Internal Medicine</p>
              <div className="spot-stats">
                <div><strong>240+</strong><span>Consultations / mo</span></div>
                <div><strong>98%</strong><span>Approval Rate</span></div>
              </div>
            </div>
          </div>

          <div className="spotlight-content">
            <h4 className="section-subtitle spot-anim">Built for Clinicians</h4>
            <h2 className="spot-anim">Pre-Consultation Summaries That Save Hours</h2>
            <p className="spot-anim">
              Before Dr. Prakash opens a patient file, Aarogya has already parsed
              the latest labs, flagged abnormalities, and drafted a structured
              summary — complete with agent reasoning traces for full transparency.
            </p>
            <ul className="spot-checklist spot-anim">
              <li><UserCheck size={18} /> Human-in-the-Loop Verification</li>
              <li><Brain size={18} /> Transparent Agent Reasoning</li>
              <li><ShieldCheck size={18} /> Clinical Safety Guardrails</li>
            </ul>
            <Link to="/auth" className="btn-primary spot-anim" style={{ marginTop: '1.5rem' }}>
              Join as Doctor <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="testimonials-section" ref={testRef}>
        <div className="container testimonials-container">
          <div className="testimonials-header">
            <h4 className="section-subtitle test-anim">Testimonials</h4>
            <h2 className="test-anim">Patient Feedback from Those Who Trust Us</h2>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card glass-card hover-card test-anim">
              <div className="tc-stars">★★★★★</div>
              <p>"The AI analysis flagged a critical thyroid imbalance my local lab missed. The doctor review loop gave me total confidence."</p>
              <div className="tc-author">
                <div className="tc-avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>R</div>
                <div><strong>Riya Sharma</strong><span>Patient</span></div>
              </div>
            </div>

            <div className="testimonial-card glass-card hover-card test-anim">
              <div className="tc-stars">★★★★★</div>
              <p>"Pre-consultation summaries save me 20 minutes per patient. The reasoning traces let me trust the AI's conclusions."</p>
              <div className="tc-author">
                <div className="tc-avatar" style={{ background: 'linear-gradient(135deg, #0d6efd, #6366f1)' }}>P</div>
                <div><strong>Dr. Prakash</strong><span>Cardiologist</span></div>
              </div>
            </div>

            <div className="testimonial-card glass-card hover-card test-anim">
              <div className="tc-stars">★★★★★</div>
              <p>"Uploading my report took 10 seconds. The structured summary was more detailed than anything I'd received before."</p>
              <div className="tc-author">
                <div className="tc-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>S</div>
                <div><strong>Sarah Rosen</strong><span>Patient — Cardiology</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
