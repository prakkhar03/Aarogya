import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Triage', path: '/triage' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Activity size={24} color="#fff" />
          </div>
          <span>Aarogya</span>
        </Link>

        <nav className="navbar-links desktop-only">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={location.pathname === link.path ? 'active' : ''}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions desktop-only">
          {user ? (
            <>
              {user.role === 'doctor' && (
                <Link to="/doctor" className="btn-outline" style={{ padding: '0.5rem 1rem', marginRight: '0.75rem' }}>
                  Doctor Portal
                </Link>
              )}
              <div className="nav-user">
                <span className="nav-username">{user.username}</span>
                <span className="nav-role-badge">{user.role}</span>
              </div>
              <button className="nav-logout" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/doctor" className="btn-outline" style={{ padding: '0.5rem 1rem', marginRight: '0.75rem' }}>
                Doctor Portal
              </Link>
              <Link to="/auth" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                Login
              </Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          <div className="mobile-menu-actions">
            {user ? (
              <button className="btn-outline" style={{ width: '100%' }} onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                Logout ({user.username})
              </button>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
