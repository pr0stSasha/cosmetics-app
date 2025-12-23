import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [skinType, setSkinType] = useState('normal');
  const [budget, setBudget] = useState('medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users_custom')
        .select('skin_type, budget_segment')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setSkinType(data.skin_type || 'normal');
        setBudget(data.budget_segment || 'medium');
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('users_custom')
      .update({ skin_type: skinType, budget_segment: budget })
      .eq('id', user.id);

    setLoading(false);
    if (!error) alert('Профиль обновлен! ✨');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: '#db7093' }}>Мои Настройки</h2>
      
      <div style={{ textAlign: 'left', marginTop: '30px' }}>
        <label style={labelStyle}>Тип кожи:</label>
        <select value={skinType} onChange={(e) => setSkinType(e.target.value)} style={inputStyle}>
          <option value="normal">Нормальная</option>
          <option value="dry">Сухая</option>
          <option value="oily">Жирная</option>
          <option value="combination">Комбинированная</option>
        </select>

        <label style={labelStyle}>Бюджет:</label>
        <select value={budget} onChange={(e) => setBudget(e.target.value)} style={inputStyle}>
          <option value="budget">Эконом (до 1000₽)</option>
          <option value="medium">Миддл (1000₽ - 5000₽)</option>
          <option value="luxury">Люкс (от 5000₽)</option>
        </select>

        <button onClick={handleSave} disabled={loading} style={saveBtn}>
          {loading ? 'Сохраняем...' : 'Сохранить изменения'}
        </button>

        <hr style={{ margin: '40px 0', border: '0.5px solid #fdf2f6' }} />

        <button onClick={handleLogout} style={logoutBtn}>Выйти из аккаунта</button>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', marginBottom: '8px', color: '#777', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #eee' };
const saveBtn = { width: '100%', padding: '12px', background: '#db7093', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' };
const logoutBtn = { width: '100%', padding: '12px', background: 'none', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '10px', cursor: 'pointer' };

export default ProfilePage;