import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { logout } from './logoutHandler';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 gestione stato iniziale

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const identity = decoded.sub || decoded;
        setUser(identity);
      } catch (e) {
        logout(); // token invalido → logout
      }
    }
    setLoading(false); // 👈 sempre dopo il tentativo
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      const identity = decoded.sub || decoded;
      setUser(identity);
    } catch (e) {
      logout();
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout: handleLogout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
