import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">📦 3D-PrintHub</h1>
      <div className="navbar-menu">
        <Link to="/" className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}>🏠 Главная</Link>
        <Link to="/calculator" className={`nav-btn ${location.pathname === '/calculator' ? 'active' : ''}`}>🧮 Калькулятор</Link>
        <Link to="/storage" className={`nav-btn ${location.pathname === '/storage' ? 'active' : ''}`}>🏭 Склад</Link>
        <Link to="/maintenance" className={`nav-btn ${location.pathname === '/maintenance' ? 'active' : ''}`}>🔧 Лог ТО</Link>
        <Link to="/database" className={`nav-btn ${location.pathname === '/database' ? 'active' : ''}`}>📚 База знаний</Link>
      </div>
    </nav>
  );
}

export default Header;