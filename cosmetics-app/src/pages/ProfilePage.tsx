import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Состояния для 5 пунктов опроса
  const [skinType, setSkinType] = useState('');
  const [prefType, setPrefType] = useState('any');
  const [colorType, setColorType] = useState('not_sure');
  const [budget, setBudget] = useState('medium');
  const [mainGoal, setMainGoal] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Загрузка данных профиля при входе на страницу
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('users_custom')
          .select('skin_type, preference_type, color_type, budget_segment, care_type')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setSkinType(data.skin_type || '');
          setPrefType(data.preference_type || 'any');
          setColorType(data.color_type || 'not_sure');
          setBudget(data.budget_segment || 'medium');
          setMainGoal(data.care_type?.[0] || '');
        }
      };
      fetchProfile();
    }
  }, [user]);

  // Сохранение анкеты
  const handleSave = async () => {
    if (!user) return;
    setStatus('loading');

    const { error } = await supabase
      .from('users_custom')
      .update({ 
        skin_type: skinType,
        preference_type: prefType,
        color_type: colorType,
        budget_segment: budget,
        care_type: [mainGoal] 
      })
      .eq('id', user.id);

    if (!error) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      console.error("Ошибка сохранения:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
        <h2>Пожалуйста, войди в аккаунт, чтобы настроить профиль 🌸</h2>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <h2 style={{ color: '#db7093', marginBottom: '10px' }}>Бьюти-анкета ✨</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>
          Настрой профиль, чтобы мы подобрали идеальный уход
        </p>
        
        {/* 1. Тип косметики */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>1. Какая косметика интересует?</label>
          <select value={prefType} onChange={(e) => setPrefType(e.target.value)} style={selectStyle}>
            <option value="any">Любая</option>
            <option value="care">Только уходовая</option>
            <option value="decor">Только декоративная</option>
          </select>
        </div>

        {/* 2. Тип кожи */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>2. Твой тип кожи:</label>
          <select value={skinType} onChange={(e) => setSkinType(e.target.value)} style={selectStyle}>
            <option value="">Не выбрано</option>
            <option value="dry">Сухая ❄️</option>
            <option value="oily">Жирная ☀️</option>
            <option value="combination">Комбинированная 🌿</option>
            <option value="normal">Нормальная ✨</option>
          </select>
        </div>

        {/* 3. Цветотип */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>3. Твой цветотип:</label>
          <select value={colorType} onChange={(e) => setColorType(e.target.value)} style={selectStyle}>
            <option value="not_sure">Не знаю / Не важно</option>
            <option value="winter">Зима (Холодный)</option>
            <option value="spring">Весна (Теплый)</option>
            <option value="summer">Лето (Приглушенный)</option>
            <option value="autumn">Осень (Насыщенный)</option>
          </select>
        </div>

        {/* 4. Бюджет */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>4. Ценовой сегмент:</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} style={selectStyle}>
            <option value="budget">Бюджетно</option>
            <option value="medium">Масс-маркет</option>
            <option value="luxury">Люкс</option>
          </select>
        </div>

        {/* 5. Цель ухода — УСЛОВНЫЙ РЕНДЕРИНГ */}
        {prefType !== 'decor' && (
          <div style={formGroupStyle}>
            <label style={labelStyle}>5. Основная цель ухода:</label>
            <select value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} style={selectStyle}>
              <option value="">Выбери цель...</option>
              <option value="anti-age">Омоложение</option>
              <option value="acne">Борьба с акне</option>
              <option value="moist">Увлажнение</option>
              <option value="glow">Сияние</option>
            </select>
          </div>
        )}

        {/* Кнопка сохранения с органичными статусами */}
        <button 
          onClick={handleSave} 
          disabled={status === 'loading'}
          style={{ 
            ...buttonStyle, 
            background: status === 'success' ? '#52c41a' : (status === 'error' ? '#ff4d4f' : '#e8a0bf')
          }}
        >
          {status === 'loading' && 'Сохраняем...'}
          {status === 'success' && 'Анкета сохранена! ✓'}
          {status === 'error' && 'Ошибка сохранения'}
          {status === 'idle' && 'Сохранить анкету'}
        </button>
      </div>
    </div>
  );
};

// Стили объекта
const pageContainer: React.CSSProperties = { padding: '40px 20px', display: 'flex', justifyContent: 'center' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px' };
const formGroupStyle: React.CSSProperties = { marginBottom: '20px', textAlign: 'left' };
const labelStyle: React.CSSProperties = { fontWeight: '600', display: 'block', marginBottom: '8px', fontSize: '14px', color: '#444' };
const selectStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #f0f0f0', outline: 'none', appearance: 'none', background: '#fafafa' };
const buttonStyle: React.CSSProperties = { width: '100%', padding: '15px', border: 'none', borderRadius: '15px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'all 0.3s ease' };

export default ProfilePage;