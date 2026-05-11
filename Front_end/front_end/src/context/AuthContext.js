import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const nom = localStorage.getItem('nom');
    const prenom = localStorage.getItem('prenom');

    if (token && username) {
      setUser({ username, role, nom, prenom });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, username: userUsername, role, nom, prenom } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', userUsername);
      localStorage.setItem('role', role);
      localStorage.setItem('nom', nom);
      localStorage.setItem('prenom', prenom);
      
      setUser({ username: userUsername, role, nom, prenom });
      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    localStorage.removeItem('prenom');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
