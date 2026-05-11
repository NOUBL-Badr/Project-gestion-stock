import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          Gestion Stock
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              Tableau de bord
            </NavLink>
          </li>
          <li>
            <NavLink to="/produits" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              Produits
            </NavLink>
          </li>
          <li>
            <NavLink to="/fournisseurs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              Fournisseurs
            </NavLink>
          </li>
          <li>
            <NavLink to="/mouvements" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              Mouvements
            </NavLink>
          </li>
          {user?.role === 'ADMIN' && (
            <li>
              <NavLink to="/utilisateurs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Utilisateurs
              </NavLink>
            </li>
          )}
        </ul>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="user-info">
            <span>{user?.prenom} {user?.nom} ({user?.role})</span>
            <button className="btn btn-secondary" onClick={handleLogout}>Déconnexion</button>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
