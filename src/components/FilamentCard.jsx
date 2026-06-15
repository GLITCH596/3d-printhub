import React from 'react';

function FilamentCard({ id, brand, type, color, weight, onDelete }) {
  return (
    <div className="filament-card">
      <h3>{brand}</h3>
      <p><b>Тип:</b> {type}</p>
      <p><b>Цвет:</b> {color}</p>
      <p><b>Остаток:</b> {weight} г</p>
      {/* При клике вызываем функцию удаления и передаем ей ID этой катушки */}
      <button className="delete-btn" onClick={() => onDelete(id)}>
        Удалить катушку
      </button>
    </div>
  );
}

export default FilamentCard;