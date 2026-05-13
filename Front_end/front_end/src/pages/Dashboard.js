import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

import produitsIcon from '../icons and images/produits.png';
import supplierIcon from '../icons and images/supplier.png';
import alertStockIcon from '../icons and images/alert stock.png';
import totalPriceIcon from '../icons and images/total price.png';
import packingListIcon from '../icons and images/packing-list.png';

const REFRESH_INTERVAL = 30000; // 30 seconds

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await api.get('/stats');
      if (res.data) {
        setStats(res.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(true);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchStats(false), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (loading) return <div>Chargement des statistiques...</div>;

  return (
    <div>
      <div className="flex-between mb-4">
        <h1 style={{ marginBottom: 0 }}>Tableau de Bord</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lastUpdated && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              <span className="live-dot"></span>
              Mis à jour: {formatTime(lastUpdated)}
            </span>
          )}
          <button className="btn btn-secondary" onClick={() => fetchStats(false)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2"/>
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
            <img src={produitsIcon} alt="Produits" className="stat-icon-img" />
          </div>
          <div>
            <h3 className="stat-label">Total Produits</h3>
            <div className="stat-value">{stats?.totalProduits || 0}</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: '4px solid var(--success-color)' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <img src={supplierIcon} alt="Fournisseurs" className="stat-icon-img" />
          </div>
          <div>
            <h3 className="stat-label">Total Fournisseurs</h3>
            <div className="stat-value">{stats?.totalFournisseurs || 0}</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <img src={alertStockIcon} alt="Stock Faible" className="stat-icon-img" />
          </div>
          <div>
            <h3 className="stat-label">Stock Faible</h3>
            <div className="stat-value" style={{ color: (stats?.produitsStockFaible || 0) > 0 ? 'var(--danger-color)' : 'inherit' }}>
              {stats?.produitsStockFaible || 0}
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ borderTop: '4px solid #8b5cf6' }}>
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            <img src={totalPriceIcon} alt="Valeur Stock" className="stat-icon-img" />
          </div>
          <div>
            <h3 className="stat-label">Valeur du Stock</h3>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {stats?.valeurTotaleStock ? `${stats.valeurTotaleStock.toFixed(2)} DH` : '0.00 DH'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Alerts + Recent Movements */}
      <div className="dashboard-grid">
        {/* Stock Alerts */}
        <div className="card">
          <div className="flex-between mb-3">
            <h2 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={alertStockIcon} alt="" style={{ width: 22, height: 22 }} />
              Alertes de Stock
            </h2>
            <span className="badge badge-danger">{stats?.produitsEnAlerte?.length || 0} alerte(s)</span>
          </div>
          {(!stats?.produitsEnAlerte || stats.produitsEnAlerte.length === 0) ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p>Tous les produits sont en stock suffisant.</p>
            </div>
          ) : (
            <div className="alert-list">
              {stats.produitsEnAlerte.map((p) => (
                <div key={p.id} className="alert-item">
                  <div>
                    <div style={{ fontWeight: '600' }}>{p.nom}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      Fournisseur: {p.fournisseurNom || '-'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-danger" style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                      {p.quantite} / {p.seuilAlerte}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      quantité / seuil
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Movements */}
        <div className="card">
          <div className="flex-between mb-3">
            <h2 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={packingListIcon} alt="" style={{ width: 22, height: 22 }} />
              Mouvements Récents
            </h2>
            <span className="badge badge-info">{stats?.totalMouvements || 0} total</span>
          </div>
          {(!stats?.mouvementsRecents || stats.mouvementsRecents.length === 0) ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
              <p>Aucun mouvement enregistré.</p>
            </div>
          ) : (
            <div className="movement-list">
              {stats.mouvementsRecents.map((m) => (
                <div key={m.id} className="movement-item">
                  <div className={`movement-type ${m.typeMouvement === 'ENTREE' ? 'type-entree' : 'type-sortie'}`}>
                    {m.typeMouvement === 'ENTREE' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{m.produitNom || '-'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {formatDate(m.dateMouvement)} • {m.utilisateurNom || '-'}
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>
                    <span style={{ color: m.typeMouvement === 'ENTREE' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                      {m.typeMouvement === 'ENTREE' ? '+' : '-'}{m.quantite}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
