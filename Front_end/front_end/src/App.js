import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import Fournisseurs from './pages/Fournisseurs';
import Mouvements from './pages/Mouvements';
import Utilisateurs from './pages/Utilisateurs';

// Simple ProtectedRoute wrapper (can be enhanced to check token in context)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="produits" element={<Produits />} />
            <Route path="fournisseurs" element={<Fournisseurs />} />
            <Route path="mouvements" element={<Mouvements />} />
            <Route path="utilisateurs" element={<Utilisateurs />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
