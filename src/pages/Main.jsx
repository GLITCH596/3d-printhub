import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

function Main() {
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Интеграция jQuery по плану разработки
  useEffect(() => {
    // Находим все слайды внутри нашего рефа
    const slides = $(sliderRef.current).find('.slide');
    let currentSlide = 0;

    // Показываем первый слайд сразу
    slides.hide().eq(currentSlide).show();

    // Функция переключения слайдов с эффектами jQuery
    const nextSlide = () => {
      slides.eq(currentSlide).fadeOut(400, () => {
        currentSlide = (currentSlide + 1) % slides.length;
        slides.eq(currentSlide).fadeIn(400);
      });
    };

    // Запускаем автоматическое переключение каждые 4 секунды
    const interval = setInterval(nextSlide, 4000);

    // Стрелки переключения (ручное управление через jQuery)
    $(sliderRef.current).find('.next-btn').on('click', () => {
      clearInterval(interval);
      nextSlide();
    });

    $(sliderRef.current).find('.prev-btn').on('click', () => {
      clearInterval(interval);
      slides.eq(currentSlide).fadeOut(400, () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides.eq(currentSlide).fadeIn(400);
      });
    });

    // Обязательно очищаем обработчики и таймеры при уходе со страницы
    return () => {
      clearInterval(interval);
      if (sliderRef.current) {
        $(sliderRef.current).find('.next-btn').off('click');
        $(sliderRef.current).find('.prev-btn').off('click');
      }
    };
  }, []);

  return (
    <div className="landing-container">
      
      {/* 1. ПРОМО-БЛОК (HERO) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Управляй 3D-печатью как профессионал</h1>
          <p>Автоматизация расчетов себестоимости, умный учет остатков пластика на складе и контроль технического состояния вашего принтера в одном месте.</p>
          <button className="hero-btn" onClick={() => navigate('/calculator')}>
            Начать расчет
          </button>
        </div>
      </section>

      {/* 2. БЛОК ПРЕИМУЩЕСТВ (КАРТОЧКИ ВОЗМОЖНОСТЕЙ) */}
      <section className="features-section">
        <h2>Возможности платформы 3D-PrintHub</h2>
        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate('/calculator')}>
            <h3>Точный калькулятор</h3>
            <p>Учитывает вес детали, энергопотребление с округлением вверх, износ оборудования и амортизацию.</p>
          </div>
          <div className="feature-card" onClick={() => navigate('/storage')}>
            <h3>Виртуальный склад</h3>
            <p>Контролируйте остатки катушек по брендам, цветам и типам пластика (PLA, PETG, ABS).</p>
          </div>
          <div className="feature-card" onClick={() => navigate('/maintenance')}>
            <h3>Журнал обслуживания</h3>
            <p>Следите за моточасами принтера, износом сопла и вовремя проводите регламентное ТО.</p>
          </div>
        </div>
      </section>

      {/* 3. ИНТЕРАКТИВНАЯ СТАТИСТИКА ПЛАТФОРМЫ */}
      <section className="stats-section">
        <div className="stat-item">
          <h3>&gt; 1</h3>
          <p>Успешных расчетов</p>
        </div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>Контроля расходов</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Доступ к складу материалов</p>
        </div>
      </section>

      {/* 4. СЛАЙДЕР ОТЗЫВОВ (Управляется через jQuery) */}
      <section className="reviews-section" ref={sliderRef}>
        <h2>Что говорят мейкеры о нашем сервисе</h2>
        <div className="slider-wrapper">
          <button className="slider-nav-btn prev-btn">‹</button>
          
          <div className="slides-container">
            <div className="slide">
              <p className="review-text">«Калькулятор просто бомба! Наконец-то я начал нормально закладывать стоимость электричества и не ухожу в минус при крупных заказах.»</p>
              <h4 className="review-author">— Александр Д., владелец студии печати</h4>
            </div>
            <div className="slide">
              <p className="review-text">«Функция склада филамента спасла меня от кучи начатых и заброшенных катушек. Вижу все остатки прямо в граммах!»</p>
              <h4 className="review-author">— Иван К., 3D-моделлер</h4>
            </div>
            <div className="slide">
              <p className="review-text">«Отличный инструмент для контроля ТО принтера. Раньше забывал смазывать рельсы и моторчики, теперь есть контроль состояния 3D-принтеров.»</p>
              <h4 className="review-author">— Сергей П., мейкер</h4>
            </div>
          </div>

          <button className="slider-nav-btn next-btn">›</button>
        </div>
      </section>

      {/* 5. ПОДВАЛ (ФУТЕР) */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>© 2026 3D-PrintHub. Все права защищены. Студент: Денисов А.</p>
          <p>Версия приложения: 1.0.4 (React + jQuery Edition)</p>
        </div>
      </footer>

    </div>
  );
}

export default Main;