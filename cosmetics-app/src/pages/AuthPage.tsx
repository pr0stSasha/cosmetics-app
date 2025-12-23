import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async (type: 'login' | 'signup') => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();
    setMessage(null);

    if (cleanUser.length < 2 || cleanPass.length < 3) {
      setMessage({ text: 'Ник или пароль слишком короткие 🌸', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      if (type === 'signup') {
        const { data, error } = await supabase
          .from('users_custom')
          .insert([{ username: cleanUser, password: cleanPass }])
          .select()
          .single();

        if (error) {
          setMessage({ text: error.code === '23505' ? 'Этот ник уже занят' : 'Ошибка регистрации', type: 'error' });
        } else {
          setMessage({ text: 'Аккаунт создан! Входим...', type: 'success' });
          dispatch(setUser({ id: data.id, username: data.username, isAdmin: data.is_admin }));
          setTimeout(() => navigate('/'), 1500);
        }
      } else {
        const { data, error } = await supabase
          .from('users_custom')
          .select('*')
          .ilike('username', cleanUser)
          .eq('password', cleanPass);

        if (error || !data || data.length === 0) {
          setMessage({ text: 'Неверный ник или пароль', type: 'error' });
        } else {
          const foundUser = data[0];
          setMessage({ text: `Рады видеть, ${foundUser.username}! ✨`, type: 'success' });
          dispatch(setUser({ id: foundUser.id, username: foundUser.username, isAdmin: foundUser.is_admin }));
          setTimeout(() => navigate('/'), 1500);
        }
      }
    } catch (err) {
        console.error("Auth error details:", err); // Используем переменную, и ошибка исчезнет
        setMessage({ text: 'Проблема с подключением к базе', type: 'error' });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#db7093', marginBottom: '5px' }}>Glowly ✨</h2>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>Красота начинается с ника</p>
        
        <input 
          placeholder="Твой ник" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={inputStyle} 
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={inputStyle} 
        />

        {message && (
          <div style={{ 
            color: message.type === 'error' ? '#ff4d4f' : '#52c41a', 
            fontSize: '13px', 
            padding: '5px' 
          }}>
            {message.text}
          </div>
        )}
        
        <button 
          disabled={loading} 
          onClick={() => handleAuth('login')} 
          style={{ ...loginBtn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Секунду...' : 'Войти'}
        </button>
        
        <button 
          disabled={loading} 
          onClick={() => handleAuth('signup')} 
          style={signupBtn}
        >
          Создать новый аккаунт
        </button>
      </div>
    </div>
  );
};

// Стили оставляем те же, что тебе нравились
const containerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '40px', borderRadius: '30px', boxShadow: '0 15px 35px rgba(232,160,191,0.15)', textAlign: 'center', width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' };
const inputStyle: React.CSSProperties = { padding: '12px', borderRadius: '12px', border: '1px solid #f0f0f0', outline: 'none', background: '#fafafa' };
const loginBtn: React.CSSProperties = { padding: '12px', background: '#e8a0bf', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };
const signupBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#db7093', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', marginTop: '5px' };

export default AuthPage;