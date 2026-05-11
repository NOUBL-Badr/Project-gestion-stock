import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/produits');
      setProduits(res.data || []);
    } catch (err) {
      setError("Erreur lors du chargement des produits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await api.delete(`/produits/${id}`);
        fetchProduits();
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
        <h1>Produits</h1>
        <button className="btn btn-primary">Nouveau Produit</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Seuil Alerte</th>
              <th>Fournisseur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Aucun produit trouvé.</td>
              </tr>
            ) : (
              produits.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td style={{ fontWeight: '500' }}>{p.nom}</td>
                  <td>{p.prix} €</td>
                  <td>
                    <span style={{ 
                      color: p.quantite <= p.seuilAlerte ? 'var(--danger-color)' : 'inherit',
                      fontWeight: p.quantite <= p.seuilAlerte ? '700' : 'normal'
                    }}>
                      {p.quantite}
                    </span>
                  </td>
                  <td>{p.seuilAlerte}</td>
                  <td>{p.fournisseur ? p.fournisseur.nom : '-'}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>Modifier</button>
                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDelete(p.id)}>Supprimer</button>
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

export default Produits;
