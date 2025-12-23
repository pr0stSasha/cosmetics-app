import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../supabaseClient';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

// Импорт стилей
import s from '../features/profile/Profile.module.css';

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
    <div className={s.profilePage}>
      <h2 className={s.title}>Мои Настройки</h2>
      
      <div className={s.card}>
        <label className={s.label}>Тип кожи:</label>
        <select 
          value={skinType} 
          onChange={(e) => setSkinType(e.target.value)} 
          className={s.select}
        >
          <option value="normal">Нормальная</option>
          <option value="dry">Сухая</option>
          <option value="oily">Жирная</option>
          <option value="combination">Комбинированная</option>
        </select>

        <label className={s.label}>Бюджет:</label>
        <select 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)} 
          className={s.select}
        >
          <option value="budget">Эконом (до 1000₽)</option>
          <option value="medium">Миддл (1000₽ - 5000₽)</option>
          <option value="luxury">Люкс (от 5000₽)</option>
        </select>

        <button onClick={handleSave} disabled={loading} className={s.saveBtn}>
          {loading ? 'Сохраняем...' : 'Сохранить изменения'}
        </button>

        <hr className={s.divider} />

        <button onClick={handleLogout} className={s.logoutBtn}>
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;