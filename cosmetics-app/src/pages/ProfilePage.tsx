import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [skinType, setSkinType] = useState('');
  const [prefType, setPrefType] = useState('any');
  const [colorType, setColorType] = useState('not_sure');
  const [budget, setBudget] = useState('medium');
  const [mainGoal, setMainGoal] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Оборачиваем загрузку в useCallback для стабильности
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('users_custom')
      .select('skin_type, preference_type, color_type, budget_segment, care_type')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Ошибка загрузки профиля:", error.message);
    } else if (data) {
      setSkinType(data.skin_type || '');
      setPrefType(data.preference_type || 'any');
      setColorType(data.color_type || 'not_sure');
      setBudget(data.budget_segment || 'medium');
      setMainGoal(data.care_type?.[0] || '');
    }
  }, [user]);

  useEffect(() => {
    const syncData = async () => {
      await fetchProfile();
    };
    syncData();
  }, [fetchProfile]);
  
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
      <div style={emptyStateContainer}>
        <h2 style={heroTitle}>Твой бьюти-паспорт 🌸</h2>
        <p style={{ color: '#888' }}>Пожалуйста, войди в аккаунт, чтобы настроить рекомендации.</p>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Бьюти-анкета ✨</h2>
          <p style={subtitleStyle}>Персонализируй maimei под себя</p>
        </div>
        
        <div style={formContent}>
          {/* 1. Тип косметики */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Какая косметика тебе интересна?</label>
            <div style={selectWrapper}>
              <select value={prefType} onChange={(e) => setPrefType(e.target.value)} style={selectStyle}>
                <option value="any">Любая ✨</option>
                <option value="care">Только уход 🧴</option>
                <option value="decor">Только декоративная 💄</option>
              </select>
            </div>
          </div>

          {/* 2. Тип кожи */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Твой тип кожи</label>
            <div style={selectWrapper}>
              <select value={skinType} onChange={(e) => setSkinType(e.target.value)} style={selectStyle}>
                <option value="">Не выбрано</option>
                <option value="dry">Сухая ❄️</option>
                <option value="oily">Жирная ☀️</option>
                <option value="combination">Комбинированная 🌿</option>
                <option value="normal">Нормальная ✨</option>
              </select>
            </div>
          </div>

          {/* 3. Цветотип */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Твой цветотип</label>
            <div style={selectWrapper}>
              <select value={colorType} onChange={(e) => setColorType(e.target.value)} style={selectStyle}>
                <option value="not_sure">Не знаю / Не важно</option>
                <option value="winter">Зима (Холодный) ❄️</option>
                <option value="spring">Весна (Теплый) 🌸</option>
                <option value="summer">Лето (Приглушенный) 🌊</option>
                <option value="autumn">Осень (Насыщенный) 🍂</option>
              </select>
            </div>
          </div>

          {/* 4. Бюджет */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Предпочтительный бюджет</label>
            <div style={selectWrapper}>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} style={selectStyle}>
                <option value="budget">Доступно / Бюджет</option>
                <option value="medium">Оптимально / Масс-маркет</option>
                <option value="luxury">Премиум / Люкс</option>
              </select>
            </div>
          </div>

          {/* 5. Цель ухода */}
          {prefType !== 'decor' && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Основная цель ухода</label>
              <div style={selectWrapper}>
                <select value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} style={selectStyle}>
                  <option value="">Выбери цель...</option>
                  <option value="anti-age">Омоложение ⏳</option>
                  <option value="acne">Чистая кожа 🧼</option>
                  <option value="moist">Глубокое увлажнение 💧</option>
                  <option value="glow">Сияние изнутри ✨</option>
                </select>
              </div>
            </div>
          )}

          <button 
            onClick={handleSave} 
            disabled={status === 'loading'}
            style={{ 
              ...buttonStyle, 
              background: status === 'success' ? '#52c41a' : (status === 'error' ? '#ff4d4f' : 'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)')
            }}
          >
            {status === 'loading' && 'Сохраняем магию...'}
            {status === 'success' && 'Сохранено! ✓'}
            {status === 'error' && 'Ошибка при сохранении'}
            {status === 'idle' && 'Обновить профиль'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Стили maimei Profile ---

const pageContainer: React.CSSProperties = { 
  padding: '60px 20px', 
  display: 'flex', 
  justifyContent: 'center',
  background: '#fffbfb',
  minHeight: '90vh'
};

const cardStyle: React.CSSProperties = { 
  background: '#fff', 
  padding: '40px', 
  borderRadius: '40px', 
  boxShadow: '0 20px 50px rgba(219, 112, 147, 0.1)', 
  width: '100%', 
  maxWidth: '480px',
  border: '1px solid #fdf2f6'
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '35px'
};

const titleStyle: React.CSSProperties = { 
  fontFamily: "'Playfair Display', serif",
  color: '#db7093', 
  fontSize: '28px',
  marginBottom: '8px' 
};

const subtitleStyle: React.CSSProperties = { 
  color: '#aaa', 
  fontSize: '14px' 
};

const formContent: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const formGroupStyle: React.CSSProperties = { 
  textAlign: 'left' 
};

const labelStyle: React.CSSProperties = { 
  fontWeight: '600', 
  display: 'block', 
  marginBottom: '10px', 
  fontSize: '13px', 
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  paddingLeft: '5px'
};

const selectWrapper: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const selectStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '15px 20px', 
  borderRadius: '20px', 
  border: '1px solid #f0f0f0', 
  outline: 'none', 
  appearance: 'none', 
  background: '#fdfdfd',
  fontSize: '15px',
  color: '#333',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
};

const buttonStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '18px', 
  border: 'none', 
  borderRadius: '20px', 
  color: 'white', 
  fontWeight: 'bold', 
  cursor: 'pointer', 
  marginTop: '15px', 
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  fontSize: '16px',
  boxShadow: '0 10px 20px rgba(255, 175, 189, 0.3)'
};

const emptyStateContainer: React.CSSProperties = { 
  padding: '100px 20px', 
  textAlign: 'center' 
};

const heroTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '32px',
  color: '#db7093',
  marginBottom: '15px'
};

export default ProfilePage;