import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EMPTY_FORM = {
  nom: '',
  description: '',
  prix: '',
  quantite: '',
  seuilAlerte: '',
  fournisseurId: '',
};

const Produits = () => {
  const { user } = useContext(AuthContext);
  const [produits, setProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduits();
    fetchFournisseurs();
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

  const fetchFournisseurs = async () => {
    try {
      const res = await api.get('/fournisseurs');
      setFournisseurs(res.data || []);
    } catch (err) {
      console.error("Erreur chargement fournisseurs:", err);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (produit) => {
    setEditingId(produit.id);
    setForm({
      nom: produit.nom || '',
      description: produit.description || '',
      prix: produit.prix || '',
      quantite: produit.quantite || '',
      seuilAlerte: produit.seuilAlerte || '',
      fournisseurId: produit.fournisseurId || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.nom.trim()) {
      setFormError("Le nom est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        nom: form.nom.trim(),
        description: form.description.trim(),
        prix: parseFloat(form.prix) || 0,
        quantite: parseInt(form.quantite) || 0,
        seuilAlerte: parseInt(form.seuilAlerte) || 0,
        fournisseurId: form.fournisseurId ? parseInt(form.fournisseurId) : null,
      };

      if (editingId) {
        await api.put(`/produits/${editingId}`, payload);
      } else {
        await api.post('/produits', payload);
      }
      closeModal();
      fetchProduits();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
      console.error(err);
    } finally {
      setSubmitting(false);
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
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={openCreateModal}>+ Nouveau Produit</button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Seuil Alerte</th>
              <th>Fournisseur</th>
              {user?.role === 'ADMIN' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {produits.length === 0 ? (
              <tr>
                <td colSpan={user?.role === 'ADMIN' ? "8" : "7"} style={{ textAlign: 'center', padding: '2rem' }}>Aucun produit trouvé.</td>
              </tr>
            ) : (
              produits.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td style={{ fontWeight: '500' }}>{p.nom}</td>
                  <td style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{p.description || '-'}</td>
                  <td>{p.prix} DH</td>
                  <td>
                    <span style={{
                      color: p.stockFaible ? 'var(--danger-color)' : 'inherit',
                      fontWeight: p.stockFaible ? '700' : 'normal'
                    }}>
                      {p.quantite}
                    </span>
                  </td>
                  <td>{p.seuilAlerte}</td>
                  <td>{p.fournisseurNom || '-'}</td>
                  {user?.role === 'ADMIN' && (
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={() => openEditModal(p)}>Modifier</button>
                      <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDelete(p.id)}>Supprimer</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="nom">Nom *</label>
                <input type="text" id="nom" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea id="description" name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="prix">Prix (DH) *</label>
                  <input type="number" id="prix" name="prix" className="form-control" step="0.01" min="0" value={form.prix} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quantite">Quantité *</label>
                  <input type="number" id="quantite" name="quantite" className="form-control" min="0" value={form.quantite} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="seuilAlerte">Seuil d'Alerte</label>
                  <input type="number" id="seuilAlerte" name="seuilAlerte" className="form-control" min="0" value={form.seuilAlerte} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fournisseurId">Fournisseur</label>
                  <select id="fournisseurId" name="fournisseurId" className="form-control" value={form.fournisseurId} onChange={handleChange}>
                    <option value="">-- Aucun --</option>
                    {fournisseurs.map(f => (
                      <option key={f.id} value={f.id}>{f.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : (editingId ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produits;
