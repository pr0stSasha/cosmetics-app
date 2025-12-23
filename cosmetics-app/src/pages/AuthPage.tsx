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
        console.error("Auth error details:", err);
        setMessage({ text: 'Проблема с подключением', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoWrapper}>
          <h2 style={logoStyle}>maimei</h2>
          <div style={logoDot} />
        </div>
        
        <p style={subtitleStyle}>Твой путь к идеальной коже начинается здесь</p>
        
        <div style={inputGroup}>
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
        </div>

        {message && (
          <div style={{ 
            color: message.type === 'error' ? '#ff7875' : '#95de64', 
            fontSize: '13px', 
            margin: '10px 0',
            fontWeight: '500'
          }}>
            {message.text}
          </div>
        )}
        
        <button 
          disabled={loading} 
          onClick={() => handleAuth('login')} 
          style={{ ...loginBtn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Секунду...' : 'Войти в аккаунт'}
        </button>
        
        <div style={dividerContainer}>
          <div style={dividerLine} />
          <span style={dividerText}>или</span>
          <div style={dividerLine} />
        </div>

        <button 
          disabled={loading} 
          onClick={() => handleAuth('signup')} 
          style={signupBtn}
        >
          Создать новый профиль
        </button>
      </div>
    </div>
  );
};

// --- Стили maimei ---

const containerStyle: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '85vh',
  background: 'transparent'
};

const cardStyle: React.CSSProperties = { 
  background: 'rgba(255, 255, 255, 0.9)', 
  padding: '50px 40px', 
  borderRadius: '45px', 
  boxShadow: '0 25px 50px rgba(219, 112, 147, 0.1)', 
  textAlign: 'center', 
  width: '360px', 
  display: 'flex', 
  flexDirection: 'column',
  border: '1px solid rgba(219, 112, 147, 0.05)',
  backdropFilter: 'blur(10px)'
};

const logoWrapper: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  margin: '0 auto 10px auto'
};

const logoStyle: React.CSSProperties = { 
  fontFamily: "'Playfair Display', serif",
  fontSize: '36px',
  color: '#db7093', 
  margin: 0,
  fontWeight: '700'
};

const logoDot: React.CSSProperties = {
  width: '6px',
  height: '6px',
  background: '#d4af37', // Золотистая точка
  borderRadius: '50%',
  position: 'absolute',
  right: '-8px',
  bottom: '12px'
};

const subtitleStyle: React.CSSProperties = { 
  fontSize: '14px', 
  color: '#999', 
  marginBottom: '30px',
  fontWeight: '400',
  lineHeight: '1.4'
};

const inputGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px'
};

const inputStyle: React.CSSProperties = { 
  padding: '15px 20px', 
  borderRadius: '20px', 
  border: '1px solid #fdf2f6', 
  outline: 'none', 
  background: '#fdf2f6',
  fontSize: '14px',
  color: '#4a4a4a',
  transition: 'all 0.3s ease'
};

const loginBtn: React.CSSProperties = { 
  padding: '16px', 
  background: 'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '22px', 
  cursor: 'pointer', 
  fontWeight: '700',
  fontSize: '15px',
  boxShadow: '0 8px 20px rgba(255, 175, 189, 0.3)',
  marginTop: '10px'
};

const dividerContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '25px 0',
  gap: '15px'
};

const dividerLine: React.CSSProperties = {
  flex: 1,
  height: '1px',
  background: '#f0f0f0'
};

const dividerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#ccc',
  textTransform: 'uppercase'
};

const signupBtn: React.CSSProperties = { 
  background: 'none', 
  border: '1px solid #db7093', 
  color: '#db7093', 
  padding: '12px',
  borderRadius: '20px',
  cursor: 'pointer', 
  fontSize: '13px', 
  fontWeight: '600',
  transition: 'all 0.3s ease'
};

export default AuthPage;