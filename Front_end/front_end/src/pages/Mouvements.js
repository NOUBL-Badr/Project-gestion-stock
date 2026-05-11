import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Mouvements = () => {
  const [mouvements, setMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMouvements();
  }, []);

  const fetchMouvements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mouvements');
      setMouvements(res.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des mouvements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <div className="flex-between mb-4">
        <h1>Mouvements de Stock</h1>
        <div>
          <button className="btn btn-success" style={{ marginRight: '0.5rem', backgroundColor: 'var(--success-color)', color: 'white' }}>+ Entrée</button>
          <button className="btn btn-danger">- Sortie</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Produit</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Utilisateur</th>
              <th>Remarque</th>
            </tr>
          </thead>
          <tbody>
            {mouvements.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Aucun mouvement trouvé.</td>
              </tr>
            ) : (
              mouvements.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{formatDate(m.dateMouvement)}</td>
                  <td style={{ fontWeight: '500' }}>{m.produit ? m.produit.nom : '-'}</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: m.typeMouvement === 'ENTREE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: m.typeMouvement === 'ENTREE' ? 'var(--success-color)' : 'var(--danger-color)'
                    }}>
                      {m.typeMouvement}
                    </span>
                  </td>
                  <td>{m.quantite}</td>
                  <td>{m.utilisateur ? `${m.utilisateur.prenom} ${m.utilisateur.nom}` : '-'}</td>
                  <td>{m.remarque || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mouvements;
