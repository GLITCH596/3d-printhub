import React, { useState } from 'react';
import FilamentCard from '../components/FilamentCard'; // Обрати внимание на "../"

function Storage() {
  // Весь остальной код склада, который мы писали ранее...
  const [filaments, setFilaments] = useState([
    { id: 1, brand: 'BestFilament', type: 'PLA', color: 'Черный', weight: 1000 }
  ]);
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('PLA');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');

  const handleAddFilament = (e) => {
    e.preventDefault();
    if (!brand.trim() || !color.trim() || !weight) {
      alert('Пожалуйста, заполните все поля формы!');
      return;
    }
    const newFilament = { id: Date.now(), brand, type, color, weight: Number(weight) };
    setFilaments([...filaments, newFilament]);
    setBrand(''); setColor(''); setWeight('');
  };

  return (
    <div>
      <p>Менеджер виртуального склада расходных материалов [cite: 29]</p>
      <form className="filament-form" onSubmit={handleAddFilament}>
        <div className="form-group">
          <label>Производитель / Бренд</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Тип пластика</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="PLA">PLA</option>
            <option value="PETG">PETG</option>
            <option value="ABS">ABS</option>
          </select>
        </div>
        <div className="form-group">
          <label>Цвет пластика</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Вес остатка (грамм)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <button type="submit" className="submit-btn">Добавить на склад</button>
      </form>
      <div className="filament-grid">
        {filaments.map(f => (
          <FilamentCard key={f.id} {...f} onDelete={(id) => setFilaments(filaments.filter(item => item.id !== id))} />
        ))}
      </div>
    </div>
  );
}

export default Storage;