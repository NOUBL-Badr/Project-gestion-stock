import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Mouvements = () => {
  const [mouvements, setMouvements] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('ENTREE'); // 'ENTREE' or 'SORTIE'
  const [form, setForm] = useState({ produitId: '', quantite: '', remarque: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMouvements();
    fetchProduits();
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

  const fetchProduits = async () => {
    try {
      const res = await api.get('/produits');
      setProduits(res.data || []);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setForm({ produitId: '', quantite: '', remarque: '' });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ produitId: '', quantite: '', remarque: '' });
    setFormError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.produitId) {
      setFormError("Veuillez sélectionner un produit.");
      return;
    }
    if (!form.quantite || parseInt(form.quantite) < 1) {
      setFormError("La quantité doit être au moins 1.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        typeMouvement: modalType,
        produitId: parseInt(form.produitId),
        quantite: parseInt(form.quantite),
        remarque: form.remarque.trim(),
      };

      await api.post('/mouvements', payload);
      closeModal();
      fetchMouvements();
      fetchProduits(); // refresh quantities
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'enregistrement du mouvement.");
      console.error(err);
    } finally {
      setSubmitting(false);
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
          <button className="btn btn-success" style={{ marginRight: '0.5rem' }} onClick={() => openModal('ENTREE')}>+ Entrée</button>
          <button className="btn btn-danger" onClick={() => openModal('SORTIE')}>- Sortie</button>
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
                  <td style={{ fontWeight: '500' }}>{m.produitNom || '-'}</td>
                  <td>
                    <span className={`badge ${m.typeMouvement === 'ENTREE' ? 'badge-success' : 'badge-danger'}`}>
                      {m.typeMouvement === 'ENTREE' ? '↑ Entrée' : '↓ Sortie'}
                    </span>
                  </td>
                  <td>{m.quantite}</td>
                  <td>{m.utilisateurNom || '-'}</td>
                  <td style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{m.remarque || '-'}</td>
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
              <h2>
                {modalType === 'ENTREE' ? (
                  <span style={{ color: 'var(--success-color)' }}>↑ Nouvelle Entrée</span>
                ) : (
                  <span style={{ color: 'var(--danger-color)' }}>↓ Nouvelle Sortie</span>
                )}
              </h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}

              <div className="form-group">
                <label className="form-label" htmlFor="produitId">Produit *</label>
                <select id="produitId" name="produitId" className="form-control" value={form.produitId} onChange={handleChange} required>
                  <option value="">-- Sélectionner un produit --</option>
                  {produits.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nom} (Stock: {p.quantite})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quantite">Quantité *</label>
                <input type="number" id="quantite" name="quantite" className="form-control" min="1" value={form.quantite} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="remarque">Remarque</label>
                <textarea id="remarque" name="remarque" className="form-control" rows="3" value={form.remarque} onChange={handleChange} placeholder="Motif du mouvement..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Annuler</button>
                <button
                  type="submit"
                  className={`btn ${modalType === 'ENTREE' ? 'btn-success' : 'btn-danger'}`}
                  disabled={submitting}
                >
                  {submitting ? 'Enregistrement...' : (modalType === 'ENTREE' ? 'Enregistrer l\'entrée' : 'Enregistrer la sortie')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mouvements;
