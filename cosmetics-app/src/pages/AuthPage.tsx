import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { setUser } from '../features/auth/authSlice';
import type { AppUser } from '../types/index'; // Добавили импорт типа

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
          // Заменяем any на AppUser
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

        // Заменяем any на AppUser
        const userToStore: AppUser = { 
          ...data, 
          isAdmin: data.is_admin === true || String(data.is_admin) === 'true' 
        };
        
        dispatch(setUser(userToStore));
        navigate('/');
      }
    } catch (err: unknown) {
      // Вместо any используем unknown и проверку на тип Error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>{isRegister ? 'Регистрация 🎀' : 'Вход ✨'}</h2>
        
        {error && <div style={errorBoxStyle}>{error}</div>}
        
        <form onSubmit={handleAuth} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Ваш ник</label>
            <input 
              style={inputStyle}
              placeholder="sasha_beauty" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Пароль</label>
            <input 
              type="password"
              style={inputStyle}
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          <button type="submit" style={btnStyle}>
            {isRegister ? 'Создать аккаунт' : 'Войти'}
          </button>
        </form>

        <p onClick={() => { setIsRegister(!isRegister); setError(''); }} style={toggleStyle}>
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Впервые тут? Создать профиль'}
        </p>
      </div>
    </div>
  );
};

// Стили
const containerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '40px', borderRadius: '30px', boxShadow: '0 15px 35px rgba(219, 112, 147, 0.1)', width: '100%', maxWidth: '400px' };
const titleStyle: React.CSSProperties = { textAlign: 'center', color: '#db7093', marginBottom: '30px' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle: React.CSSProperties = { fontSize: '14px', color: '#888' };
const inputStyle: React.CSSProperties = { padding: '14px', borderRadius: '15px', border: '1px solid #f0f0f0', outline: 'none', backgroundColor: '#fafafa' };
const btnStyle: React.CSSProperties = { background: 'linear-gradient(135deg, #db7093 0%, #ffb6c1 100%)', color: '#fff', border: 'none', padding: '16px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' };
const toggleStyle: React.CSSProperties = { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#db7093', cursor: 'pointer', textDecoration: 'underline' };
const errorBoxStyle: React.CSSProperties = { color: '#ff4d4f', fontSize: '14px', textAlign: 'center', marginBottom: '20px', background: '#fff1f0', padding: '12px', borderRadius: '12px', border: '1px solid #ffa39e' };

export default AuthPage;