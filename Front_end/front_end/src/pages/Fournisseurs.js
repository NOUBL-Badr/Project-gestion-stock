import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EMPTY_FORM = {
  nom: '',
  email: '',
  telephone: '',
  adresse: '',
};

const Fournisseurs = () => {
  const { user } = useContext(AuthContext);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (fournisseur) => {
    setEditingId(fournisseur.id);
    setForm({
      nom: fournisseur.nom || '',
      email: fournisseur.email || '',
      telephone: fournisseur.telephone || '',
      adresse: fournisseur.adresse || '',
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
        email: form.email.trim(),
        telephone: form.telephone.trim(),
        adresse: form.adresse.trim(),
      };

      if (editingId) {
        await api.put(`/fournisseurs/${editingId}`, payload);
      } else {
        await api.post('/fournisseurs', payload);
      }
      closeModal();
      fetchFournisseurs();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
      console.error(err);
    } finally {
      setSubmitting(false);
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
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={openCreateModal}>+ Nouveau Fournisseur</button>
        )}
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
              <th>Produits</th>
              {user?.role === 'ADMIN' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {fournisseurs.length === 0 ? (
              <tr>
                <td colSpan={user?.role === 'ADMIN' ? "7" : "6"} style={{ textAlign: 'center', padding: '2rem' }}>Aucun fournisseur trouvé.</td>
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
                    <span className="badge badge-info">{f.nombreProduits || 0}</span>
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={() => openEditModal(f)}>Modifier</button>
                      <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDelete(f.id)}>Supprimer</button>
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
              <h2>{editingId ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="nom">Nom *</label>
                <input type="text" id="nom" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input type="email" id="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="telephone">Téléphone</label>
                  <input type="text" id="telephone" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="adresse">Adresse</label>
                  <input type="text" id="adresse" name="adresse" className="form-control" value={form.adresse} onChange={handleChange} />
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

export default Fournisseurs;
