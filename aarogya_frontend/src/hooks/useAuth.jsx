import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { id, username, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);  // checking stored token

  // On mount, try to hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('aarogya_token');
    if (stored) {
      setToken(stored);
      fetchMe(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async (accessToken) => {
    try {
      const res = await apiClient.get('/auth/me/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(res.data);
    } catch {
      // Token expired / invalid
      localStorage.removeItem('aarogya_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await apiClient.post('/auth/login/', { username, password });
    const { access, role } = res.data;
    localStorage.setItem('aarogya_token', access);
    setToken(access);
    setUser({ username, role });
    return role;
  };

  const register = async (username, password, role) => {
    const res = await apiClient.post('/auth/register/', { username, password, role });
    const { access, role: assignedRole } = res.data;
    localStorage.setItem('aarogya_token', access);
    setToken(access);
    setUser({ username, role: assignedRole });
    return assignedRole;
  };

  const logout = () => {
    localStorage.removeItem('aarogya_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
