import React, { useState, useEffect } from 'react';

function Maintenance() {
  // Список принтеров из localStorage
  const [printers, setPrinters] = useState(() => {
    const saved = localStorage.getItem('3d_printers_list');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Creality Ender-3 V3 SE',
        totalHours: 124.5,
        nozzleHours: 85,
        beltHours: 140,
        lubricationHours: 12
      }
    ];
  });

  // Состояние для сворачивания карточек принтеров (по ID)
  const [collapsedPrinters, setCollapsedPrinters] = useState({});

  // Локальное состояние для инпутов симуляции (ключ — id принтера)
  const [simHours, setSimHours] = useState({});

  // Регламенты ТО на основе официальных мануалов Creality / Prusa
  const LIMITS = {
    nozzle: 250,       // Замена латунного сопла
    belt: 200,         // Проверка/натяжение ремней
    lubrication: 50    // Очистка и смазка валов
  };

  // Синхронизация с localStorage
  useEffect(() => {
    localStorage.setItem('3d_printers_list', JSON.stringify(printers));
  }, [printers]);

  // Расчет оставшегося ресурса
  const getPercentage = (current, max) => {
    const remaining = max - current;
    return remaining <= 0 ? 0 : Math.round((remaining / max) * 100);
  };

  const getProgressColor = (percent) => {
    if (percent > 50) return '#4A777A';
    if (percent > 20) return '#e6a23c';
    return '#f56c6c';
  };

  // Переключатель сворачивания/разворачивания карточки
  const toggleCollapse = (id) => {
    setCollapsedPrinters(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Добавление нового принтера
  const handleAddPrinter = () => {
    const newPrinter = {
      id: Date.now(),
      name: `Принтер ${printers.length + 1}`,
      totalHours: 0,
      nozzleHours: 0,
      beltHours: 0,
      lubricationHours: 0
    };
    setPrinters([...printers, newPrinter]);
  };

  // Удаление принтера
  const handleDeletePrinter = (id, name, e) => {
    e.stopPropagation(); // Чтобы не срабатывало сворачивание при клике на удаление
    if (window.confirm(`Вы действительно хотите удалить ${name} из системы мониторинга?`)) {
      setPrinters(printers.filter(p => p.id !== id));
    }
  };

  // Универсальное обновление полей
  const updatePrinterField = (id, field, value) => {
    setPrinters(printers.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // Полный сброс моточасов устройства
  const handleResetTotalHours = (id) => {
    if (window.confirm('Вы действительно заменили принтер? Это сбросит общую наработку устройства и всех его узлов до 0!')) {
      setPrinters(printers.map(p => p.id === id ? {
        ...p,
        totalHours: 0,
        nozzleHours: 0,
        beltHours: 0,
        lubricationHours: 0
      } : p));
    }
  };

  // Сброс наработки отдельного узла после ТО
  const handleResetComponent = (printerId, field) => {
    if (window.confirm('Сбросить таймер наработки этого узла после обслуживания?')) {
      updatePrinterField(printerId, field, 0);
    }
  };

  // Симуляция работы
  const handleSimHoursChange = (id, value) => {
    setSimHours({ ...simHours, [id]: value });
  };

  const handleAddSimHours = (e, printerId) => {
    e.preventDefault();
    const hours = parseFloat(simHours[printerId]);
    if (isNaN(hours) || hours <= 0) {
      alert('Введите корректное число часов печати!');
      return;
    }

    setPrinters(printers.map(p => p.id === printerId ? {
      ...p,
      totalHours: Number((p.totalHours + hours).toFixed(1)),
      nozzleHours: Number((p.nozzleHours + hours).toFixed(1)),
      beltHours: Number((p.beltHours + hours).toFixed(1)),
      lubricationHours: Number((p.lubricationHours + hours).toFixed(1))
    } : p));

    setSimHours({ ...simHours, [printerId]: '' });
  };

  return (
    <div className="maintenance-page">
      <h2 className="page-main-title">🔧 Мониторинг технического состояния оборудования</h2>

      {printers.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: '40px' }}>
          Список оборудования пуст. Добавьте устройство с помощью кнопки в правом нижнем углу.
        </p>
      ) : (
        <div className="printers-list-container">
          {printers.map((printer) => {
            const isCollapsed = collapsedPrinters[printer.id];
            const nozzlePct = getPercentage(printer.nozzleHours, LIMITS.nozzle);
            const beltPct = getPercentage(printer.beltHours, LIMITS.belt);
            const lubPct = getPercentage(printer.lubricationHours, LIMITS.lubrication);

            return (
              <div key={printer.id} className="printer-card-block">
                
                {/* Хедер карточки: Стрелка + Инпут названия + Кнопка удаления */}
                <div className="printer-card-header" onClick={() => toggleCollapse(printer.id)}>
                  <div className="header-left-side">
                    <span className={`collapse-arrow ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                    <input
                      type="text"
                      className="editable-printer-title"
                      value={printer.name}
                      onClick={(e) => e.stopPropagation()} // Защита от сворачивания при редактировании имени
                      onChange={(e) => updatePrinterField(printer.id, 'name', e.target.value)}
                      title="Нажмите, чтобы переименовать принтер"
                    />
                  </div>
                  <button 
                    className="delete-printer-link"
                    onClick={(e) => handleDeletePrinter(printer.id, printer.name, e)}
                  >
                    ❌ Снять с учёта
                  </button>
                </div>

                {/* Выдвижная контентная часть карточки принтера */}
                <div className={`printer-card-content ${isCollapsed ? 'hidden' : ''}`}>
                  
                  {/* Техническая доска состояния */}
                  <div className="status-board">
                    
                    {/* Карточка общей наработки */}
                    <div className="status-card">
                      <h3>Общая наработка устройства</h3>
                      <div className="total-hours-edit-wrapper">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          className="editable-total-hours-input"
                          value={printer.totalHours}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                            updatePrinterField(printer.id, 'totalHours', val);
                          }}
                        />
                        <span className="hours-label">моточасов</span>
                      </div>
                      <button 
                        className="reset-hardware-btn"
                        onClick={() => handleResetTotalHours(printer.id)}
                      >
                        ♻️ Заменил принтер (Сброс в 0)
                      </button>
                    </div>

                    {/* Карточка симуляции наката часов */}
                    <div className="simulation-card">
                      <h3>Симуляция работы</h3>
                      <p className="hint">Добавить отпечатанные часы в логи узлов:</p>
                      <form onSubmit={(e) => handleAddSimHours(e, printer.id)} className="sim-form">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Напр: 12.5"
                          value={simHours[printer.id] || ''}
                          onChange={(e) => handleSimHoursChange(printer.id, e.target.value)}
                        />
                        <button type="submit">Накатать часы</button>
                      </form>
                    </div>
                  </div>

                  {/* Стилизованные бары износа деталей */}
                  <div className="maintenance-list">
                    <h3>Состояние узлов и регламент ТО</h3>
                    
                    {/* 1. СОПЛО */}
                    <div className="maintenance-item">
                      <div className="item-info">
                        <span className="item-name">Латунное сопло (Регламент замены: {LIMITS.nozzle}ч)</span>
                        <span className="item-hours">Износ: {printer.nozzleHours} / {LIMITS.nozzle} ч.</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${nozzlePct}%`, backgroundColor: getProgressColor(nozzlePct) }}
                        ></div>
                      </div>
                      <div className="item-actions">
                        <span className="remaining-text">Остаток ресурса: {nozzlePct}%</span>
                        <button className="reset-btn" onClick={() => handleResetComponent(printer.id, 'nozzleHours')}>🔄 Заменил сопло</button>
                      </div>
                    </div>

                    {/* 2. РЕМНИ */}
                    <div className="maintenance-item">
                      <div className="item-info">
                        <span className="item-name">Натяжение и чистка ремней X/Y (Инспекция: {LIMITS.belt}ч)</span>
                        <span className="item-hours">Износ: {printer.beltHours} / {LIMITS.belt} ч.</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${beltPct}%`, backgroundColor: getProgressColor(beltPct) }}
                        ></div>
                      </div>
                      <div className="item-actions">
                        <span className="remaining-text">Остаток ресурса: {beltPct}%</span>
                        <button className="reset-btn" onClick={() => handleResetComponent(printer.id, 'beltHours')}>🔄 Обслужил ремни</button>
                      </div>
                    </div>

                    {/* 3. СМАЗКА */}
                    <div className="maintenance-item">
                      <div className="item-info">
                        <span className="item-name">Чистка и смазка направляющих валов/винтов (Каждые {LIMITS.lubrication}ч)</span>
                        <span className="item-hours">Износ: {printer.lubricationHours} / {LIMITS.lubrication} ч.</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${lubPct}%`, backgroundColor: getProgressColor(lubPct) }}
                        ></div>
                      </div>
                      <div className="item-actions">
                        <span className="remaining-text">Остаток ресурса: {lubPct}%</span>
                        <button className="reset-btn" onClick={() => handleResetComponent(printer.id, 'lubricationHours')}>🔄 Смазал оси</button>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Фиксированная плавающая кнопка добавления принтера */}
      <button className="fixed-add-printer-btn" onClick={handleAddPrinter}>
        ➕ Добавить принтер
      </button>
    </div>
  );
}

export default Maintenance;