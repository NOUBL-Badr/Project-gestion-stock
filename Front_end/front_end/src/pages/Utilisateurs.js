import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EMPTY_FORM = {
  nom: '',
  prenom: '',
  username: '',
  password: '',
  role: 'EMPLOYE',
};

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setForm({
      nom: user.nom || '',
      prenom: user.prenom || '',
      username: user.username || '',
      password: '', // don't pre-fill password
      role: user.role || 'EMPLOYE',
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

    if (!form.nom.trim() || !form.prenom.trim() || !form.username.trim()) {
      setFormError("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    if (!editingId && !form.password) {
      setFormError("Le mot de passe est obligatoire pour un nouvel utilisateur.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // PUT uses UtilisateurDTO (no password)
        const payload = {
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          username: form.username.trim(),
          role: form.role,
        };
        await api.put(`/utilisateurs/${editingId}`, payload);
      } else {
        // POST uses RegisterRequest (with password)
        const payload = {
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          username: form.username.trim(),
          password: form.password,
          role: form.role,
        };
        await api.post('/utilisateurs', payload);
      }
      closeModal();
      fetchUtilisateurs();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
      console.error(err);
    } finally {
      setSubmitting(false);
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
        <button className="btn btn-primary" onClick={openCreateModal}>+ Nouvel Utilisateur</button>
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
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      color: u.actif ? 'var(--success-color)' : 'var(--danger-color)',
                      fontWeight: '500'
                    }}>
                      {u.actif ? '● Actif' : '○ Inactif'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={() => openEditModal(u)}>Modifier</button>
                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => handleDelete(u.id)}>Supprimer</button>
                  </td>
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
              <h2>{editingId ? "Modifier l'Utilisateur" : 'Nouvel Utilisateur'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="nom">Nom *</label>
                  <input type="text" id="nom" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="prenom">Prénom *</label>
                  <input type="text" id="prenom" name="prenom" className="form-control" value={form.prenom} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="username">Nom d'utilisateur *</label>
                <input type="text" id="username" name="username" className="form-control" value={form.username} onChange={handleChange} required />
              </div>

              {!editingId && (
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Mot de passe *</label>
                  <input type="password" id="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="role">Rôle *</label>
                <select id="role" name="role" className="form-control" value={form.role} onChange={handleChange}>
                  <option value="EMPLOYE">Employé</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
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

export default Utilisateurs;
