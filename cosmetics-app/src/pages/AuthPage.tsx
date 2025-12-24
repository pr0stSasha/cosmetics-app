import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { setUser } from '../features/auth/authSlice';
import type { AppUser } from '../types/index';
import s from '../features/auth/Auth.module.css';

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        const { data, error: regErr } = await supabase
          .from('users_custom')
          .insert([{ 
            username: username.trim(), 
            password: password, 
            is_admin: username.toLowerCase() === 'admin',
            skin_type: 'unknown'
          }])
          .select()
          .single();

        if (regErr) {
          if (regErr.code === '23505') throw new Error('Этот никнейм уже занят 🎀');
          throw new Error('Не удалось создать аккаунт');
        }

        if (data) {
          const newUser: AppUser = { 
            ...data, 
            isAdmin: Boolean(data.is_admin) 
          };
          dispatch(setUser(newUser));
          navigate('/profile');
        }
      } else {
        const { data, error: logErr } = await supabase
          .from('users_custom')
          .select('*')
          .eq('username', username.trim())
          .eq('password', password)
          .maybeSingle();

        if (logErr) throw new Error('Ошибка связи с сервером');

        if (!data) {
          setError('Неверный никнейм или пароль ❌');
          return;
        }

        const userToStore: AppUser = { 
          ...data, 
          isAdmin: data.is_admin === true || String(data.is_admin) === 'true' 
        };
        
        dispatch(setUser(userToStore));
        navigate('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка');
      }
    }
  };

  return (
    <div className={s.container}>
      <div className={s.card}>
        <h2 className={s.title}>{isRegister ? 'Регистрация 🎀' : 'Вход ✨'}</h2>
        
        {error && <div className={s.errorBox}>{error}</div>}
        
        <form onSubmit={handleAuth} className={s.form}>
          <div className={s.inputGroup}>
            <label className={s.label}>Ваш ник</label>
            <input 
              className={s.input}
              placeholder="sasha_beauty" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
            />
          </div>

          <div className={s.inputGroup}>
            <label className={s.label}>Пароль</label>
            <input 
              type="password"
              className={s.input}
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className={s.btn}>
            {isRegister ? 'Создать аккаунт' : 'Войти'}
          </button>
        </form>

        <p onClick={() => { setIsRegister(!isRegister); setError(''); }} className={s.toggle}>
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Впервые тут? Создать профиль'}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;