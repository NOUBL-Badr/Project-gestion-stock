import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Fournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fournisseurs');
      setFournisseurs(res.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des fournisseurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      try {
        await api.delete(`/fournisseurs/${id}`);
        fetchFournisseurs();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <div className="flex-between mb-4">
        <h1>Fournisseurs</h1>
        <button className="btn btn-primary">Nouveau Fournisseur</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Aucun fournisseur trouvé.</td>
              </tr>
            ) : (
              fournisseurs.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td style={{ fontWeight: '500' }}>{f.nom}</td>
                  <td>{f.email || '-'}</td>
                  <td>{f.telephone || '-'}</td>
                  <td>{f.adresse || '-'}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>Modifier</button>
                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDelete(f.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fournisseurs;
