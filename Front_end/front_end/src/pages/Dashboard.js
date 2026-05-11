import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProduits: 0,
    totalFournisseurs: 0,
    mouvementsAujourdhui: 0,
    valeurStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats/summary');
      if (res.data) setStats(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement des statistiques...</div>;

  return (
    <div>
      <h1 className="mb-4">Tableau de Bord</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Produits</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>{stats.totalProduits || 0}</div>
        </div>
        
        <div className="card" style={{ borderTop: '4px solid var(--success-color)' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Fournisseurs</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>{stats.totalFournisseurs || 0}</div>
        </div>
        
        <div className="card" style={{ borderTop: '4px solid var(--danger-color)' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Mouvements (Auj.)</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>{stats.mouvementsAujourdhui || 0}</div>
        </div>
        
        <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Valeur du Stock</h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>
            {stats.valeurStock ? `${stats.valeurStock.toFixed(2)} €` : '0.00 €'}
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="mb-3">Aperçu rapide</h2>
        <p>Bienvenue dans votre système de gestion de stock. Utilisez le menu latéral pour naviguer entre les différentes sections de l'application.</p>
      </div>
    </div>
  );
};

export default Dashboard;
