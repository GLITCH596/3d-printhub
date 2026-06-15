import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

function Database() {
  const searchRef = useRef(null);

  useEffect(() => {
    // 1. Реализация аккордеона на jQuery (разворачивание ответов)
    $('.faq-question').on('click', function() {
      const answer = $(this).next('.faq-answer');
      const arrow = $(this).find('.arrow-icon');
      
      // Закрываем другие открытые статьи в этой же категории для аккуратности
      $(this).closest('.category-block').find('.faq-answer').not(answer).slideUp(200);
      $(this).closest('.category-block').find('.arrow-icon').not(arrow).css('transform', 'rotate(0deg)');

      // Переключаем текущую статью
      answer.slideToggle(200);
      
      // Поворачиваем стрелочку
      if (arrow.css('transform') === 'none' || arrow.css('transform') === 'matrix(1, 0, 0, 1, 0, 0)') {
        arrow.css('transform', 'rotate(180deg)');
      } else {
        arrow.css('transform', 'rotate(0deg)');
      }
    });

    // 2. Живой поиск по статьям на jQuery (ИСПРАВЛЕННЫЙ ВАРИАНТ)
    $(searchRef.current).on('keyup', function() {
      const value = $(this).val().toLowerCase().trim();
      
      // Если поле поиска пустое — мгновенно показываем ВСЁ обратно
      if (value === '') {
        $('.faq-item').show();
        $('.category-block').show();
        return; // Выходим, чтобы не запускать фильтрацию ниже
      }

      // Если в поле что-то введено — фильтруем статьи
      $('.faq-item').each(function() {
        const text = $(this).text().toLowerCase();
        if (text.indexOf(value) > -1) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });

      // Скрываем или показываем блоки категорий в зависимости от наличия видимых статей
      $('.category-block').each(function() {
        const hasVisibleItems = $(this).find('.faq-item:visible').length > 0;
        if (hasVisibleItems) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });

    // Очистка обработчиков событий jQuery при размонтировании компонента
    return () => {
      $('.faq-question').off('click');
      if (searchRef.current) {
        $(searchRef.current).off('keyup');
      }
    };
  }, []);

  return (
    <div className="database-page">
      <h2 className="page-main-title">База знаний и решение проблем</h2>

      {/* Поле поиска */}
      <div className="search-wrapper">
        <input 
          type="text" 
          ref={searchRef}
          className="kb-search-input" 
          placeholder="Введите ключевое слово для поиска (например: адгезия, сопло, PLA)..." 
        />
      </div>

      <div className="kb-container">
        
        {/* Категория 1: Дефекты печати */}
        <div className="category-block">
          <img src=''/>
          <h3 className="category-title">Проблемы и дефекты печати</h3>
          
          <div className="faq-item">
            <div className="faq-question">
              <span>Деталь отклеивается от стола (Плохая адгезия)</span>
              <span className="arrow-icon">▼</span>
            </div>
            <div className="faq-answer">
              <p><strong>Симптомы:</strong> Модель смещается во время печати, углы загибаются вверх (элеронный эффект).</p>
              <p><strong>Решение:</strong></p>
              <ul>
                <li>Тщательно обезжирьте стол изопропиловым спиртом.</li>
                <li>Проверьте калибровку зазора Z-офсет (первый слой должен быть слегка расплющенным, а не круглым колбаском).</li>
                <li>Используйте адгезивы: специальный клей-спрей, 3D-клей или обычный клей-карандаш (каляка-маляка).</li>
                <li>В слайсере включите тип прилипания к столу: <strong>Brim (Кайма)</strong> или <strong>Raft (Подложка)</strong>.</li>
              </ul>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>Пластик не идет из сопла (Пробка / Засор)</span>
              <span className="arrow-icon">▼</span>
            </div>
            <div className="faq-answer">
              <p><strong>Симптомы:</strong> Экструдер щелкает, шестерня грызет пруток, сопло ходит по воздуху, но ничего не печатает.</p>
              <p><strong>Решение:</strong></p>
              <ul>
                <li>Сделайте <strong>Cold Pull (холодную протяжку)</strong>: нагрейте сопло до 210°C, вставьте кусок нейлона или PLA, остудите до 90°C и резко выдерните пластик вместе с грязью обратно.</li>
                <li>Прочистите сопло специальной тонкой иглой (обычно идет в комплекте с принтером) на горячую.</li>
                <li>Если засор постоянный — проверьте термобарьер и работу вентилятора хотэнда. Скорее всего пластик размягчается слишком рано.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Категория 2: Настройки слайсера */}
        <div className="category-block">
          <h3 className="category-title">Тюнинг слайсера (Cura / PrusaSlicer / OrcaSlicer)</h3>
          
          <div className="faq-item">
            <div className="faq-question">
              <span>Как избавиться от прыщей и швов на модели?</span>
              <span className="arrow-icon">▼</span>
            </div>
            <div className="faq-answer">
              <p><strong>Причина:</strong> Прыщи появляются в момент, когда принтер заканчивает печатать один периметр и переходит на следующий (точка смены слоя — Z-Seam).</p>
              <p><strong>Решение:</strong></p>
              <ul>
                <li>В слайсере в настройках шва выберите <strong>Aligned (Выровненный)</strong> или <strong>Back (Сзади)</strong>, чтобы спрятать шов на одном из углов детали.</li>
                <li>Включите функцию <strong>Coasting</strong> (выключение экструзии за доли миллиметра до конца линии, чтобы допечатать остаточным давлением).</li>
                <li>Настройте параметры ретракта (отката пластика).</li>
              </ul>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span className='faq-title'>Паутина на модели(Стрингинг)</span>
              <span className="arrow-icon">▼</span>
            </div>
            <div className="faq-answer">
              <p><strong>Причина:</strong> Пластик вытекает из сопла во время холостых перемещений экструдера.</p>
              <p><strong>Решение:</strong></p>
              <ul>
                <li>Увеличьте длину ретракта (для Direct-экструдеров: 0.5–1.5 мм, для Bowden: 4–6 мм).</li>
                <li>Снизьте температуру печати на 5–10 градусов (слишком жидкий пластик сильнее течет).</li>
                <li>Просушите филамент! Влажный пластик закипает внутри сопла и выдавливает сам себя наружу, образуя нити.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Database;