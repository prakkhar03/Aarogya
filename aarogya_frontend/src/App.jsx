import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SymptomTriage from './pages/SymptomTriage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorPortal from './pages/DoctorPortal';
import './App.css';

const HIDE_NAVBAR = ['/auth', '/doctor'];

const AppContent = () => {
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();

  const handleLoaderDone = useCallback(() => {
    setShowLoader(false);
  }, []);

  const hideNavbar = HIDE_NAVBAR.includes(location.pathname);

  return (
    <>
      {showLoader && <Loader onComplete={handleLoaderDone} />}

      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Patient-only routes */}
        <Route path="/triage" element={
          <ProtectedRoute requiredRole="patient">
            <SymptomTriage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />

        {/* Doctor-only route */}
        <Route path="/doctor" element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorPortal />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
