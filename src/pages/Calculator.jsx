import React, { useState } from 'react';

function Calculator() {
  const [weight, setWeight] = useState(50);
  const [totalMinutes, setTotalMinutes] = useState(240);
  const [plasticPrice, setPlasticPrice] = useState(2000);
  const [power, setPower] = useState(350);
  const [electricityTariff, setElectricityTariff] = useState(6.00);

  const handleNumberInput = (value, setDecimal = false) => {
    if (value === '') return '';
    return setDecimal ? parseFloat(value) : parseInt(value, 10);
  };

  const currentTotalMins = totalMinutes || 0;
  const displayTotalHours = Math.floor(currentTotalMins / 60);
  const displayMins = currentTotalMins % 60;
  const days = Math.floor(currentTotalMins / 1440);
  const remainingHours = Math.floor((currentTotalMins % 1440) / 60);

  const formatMins = displayMins < 10 ? `0${displayMins}` : displayMins;

  let timeString = `${displayTotalHours}ч ${formatMins}мин`;
  if (currentTotalMins >= 1440) {
    timeString = `${displayTotalHours}ч ${formatMins}мин (${days}дн ${remainingHours}ч ${formatMins}мин)`;
  }

  const handleHoursChange = (e) => {
    const val = handleNumberInput(e.target.value);
    const hrs = val === '' ? 0 : val;
    setTotalMinutes(hrs * 60 + displayMins);
  };

  const handleMinsChange = (e) => {
    const val = handleNumberInput(e.target.value);
    const m = val === '' ? 0 : val;
    const safeMins = m > 59 ? 59 : m;
    setTotalMinutes(displayTotalHours * 60 + safeMins);
  };

  const costPlastic = Math.round((plasticPrice || 0) / 1000 * (weight || 0));
  const energyConsumed = ((power || 0) / 1000) * (currentTotalMins / 60);
  const costElectricity = Math.ceil(energyConsumed * (electricityTariff || 0)); // Предпринимательское округление вверх
  const costAmortization = Math.round((currentTotalMins / 60) * 10);
  const totalCost = costPlastic + costElectricity + costAmortization;

  const handleCopyReport = () => {
    const reportText = `--- Отчет о расчете 3D-печати ---\nВес детали: ${weight || 0} г.\nВремя печати: ${timeString}\nСебестоимость пластика: ${costPlastic} руб.\nСтоимость электроэнергии (округлено): ${costElectricity} руб.\nАмортизация оборудования: ${costAmortization} руб.\n=================================\nИТОГОВАЯ СЕБЕСТОИМОСТЬ: ${totalCost} руб.`;
    navigator.clipboard.writeText(reportText)
      .then(() => alert('Отчет успешно скопирован!'))
      .catch(err => alert('Ошибка копирования: ' + err));
  };

  return (
    <div className="calculator-container">
      <div className="calc-panel">
        <h2>Параметры печати</h2>
        
        <div className="form-group" style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ margin: 0 }}>Вес детали (грамм):</label>
            <input 
              type="number" 
              min="0"
              style={{ width: '80px', padding: '5px', textAlign: 'center', fontWeight: 'bold' }}
              value={weight} 
              onChange={(e) => setWeight(handleNumberInput(e.target.value))} 
            />
          </div>
          <input 
            type="range" min="1" max="1000" step="1"
            value={weight || 1} 
            onChange={(e) => setWeight(Number(e.target.value))} 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '25px' }}>
          <label style={{ marginBottom: '8px' }}>
            Время печати: <span style={{ color: '#b790eb', fontWeight: 'bold' }}>{timeString}</span>
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input 
                type="number" min="0"
                style={{ width: '60px', padding: '5px', textAlign: 'center', fontWeight: 'bold'}}
                value={displayTotalHours === 0 && totalMinutes === '' ? '' : displayTotalHours}
                onChange={handleHoursChange}
              />
              <span style={{ fontSize: '13px' }}>ч.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px'}}>
              <input 
                type="number" min="0" max="59"
                style={{ width: '50px', padding: '5px', textAlign: 'center', fontWeight: 'bold'}}
                value={displayMins === 0 && totalMinutes === '' ? '' : displayMins}
                onChange={handleMinsChange}
              />
              <span style={{ fontSize: '13px' }}>мин.</span>
            </div>
          </div>
          <input 
            type="range" min="0" max="6000" step="1"
            value={currentTotalMins} 
            onChange={(e) => setTotalMinutes(Number(e.target.value))} 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Цена plastic за 1 кг (руб)</label>
          <input type="number" value={plasticPrice} onChange={(e) => setPlasticPrice(handleNumberInput(e.target.value))} />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Мощность принтера (Ватт)</label>
          <input type="number" value={power} onChange={(e) => setPower(handleNumberInput(e.target.value))} />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Тариф за электроэнергию (руб / кВт·ч)</label>
          <input 
            type="number" 
            step="0.01" 
            value={electricityTariff} 
            onChange={(e) => setElectricityTariff(handleNumberInput(e.target.value, true))} 
          />
        </div>
      </div>

      <div className="results-panel">
        <div>
          <h2>Результаты расчета</h2>
          <div className="result-item">
            <span>Расход пластика:</span>
            <span>{costPlastic} руб.</span>
          </div>
          <div className="result-item">
            <span>Энергопотребление:</span>
            <span>{costElectricity} руб. <small style={{ opacity: 0.7 }}>({energyConsumed.toFixed(2)} кВт·ч)</small></span>
          </div>
          <div className="result-item">
            <span>Амортизация принтера:</span>
            <span>{costAmortization} руб.</span>
          </div>
        </div>
        <div>
          <div className="result-total">
            <span>Себестоимость:</span>
            <span>{totalCost} руб.</span>
          </div>
          <button className="copy-btn" onClick={handleCopyReport}>
            Скопировать текстовый отчет
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;