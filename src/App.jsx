import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Calculator from './pages/Calculator';
import Storage from './pages/Storage';

// Временные заглушки для страниц, которые мы сейчас будем наполнять по плану
import Main from './pages/Main';
import Maintenance from './pages/Maintenance';
import Database from './pages/Database';

function App() {
  return (
    <Router basename="/3d-printhub">
      <Header />
      <div className="storage-container">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/database" element={<Database />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;