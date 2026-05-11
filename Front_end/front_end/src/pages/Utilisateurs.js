import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/utilisateurs');
      setUtilisateurs(res.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs. Vous n'avez peut-être pas les droits nécessaires.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/utilisateurs/${id}`);
        fetchUtilisateurs();
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
        <h1>Utilisateurs</h1>
        <button className="btn btn-primary">Nouvel Utilisateur</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Nom d'utilisateur</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              utilisateurs.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ fontWeight: '500' }}>{u.nom}</td>
                  <td>{u.prenom}</td>
                  <td>{u.username}</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: u.role === 'ADMIN' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: u.role === 'ADMIN' ? 'var(--primary-color)' : 'var(--text-light)'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      color: u.actif ? 'var(--success-color)' : 'var(--danger-color)',
                      fontWeight: '500'
                    }}>
                      {u.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>Modifier</button>
                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDelete(u.id)}>Supprimer</button>
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

export default Utilisateurs;
