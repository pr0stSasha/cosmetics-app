import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <header style={headerContainerStyle}>
      <Link to="/" style={logoStyle}>maimei</Link>
      
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Рекомендации</Link>
        {user && <Link to="/favorites" style={linkStyle}>Мой бокс</Link>}
        {user?.isAdmin && <Link to="/admin" style={adminLinkStyle}>Панель управления</Link>}
        
        <div style={dividerStyle} />

        {user ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/profile" style={profileLinkStyle}>
              <span style={avatarCircleStyle}>{user.username[0]}</span>
              {user.username}
            </Link>
            <button onClick={() => dispatch(logout())} style={logoutBtnStyle}>Выйти</button>
          </div>
        ) : (
          <Link to="/auth" style={authLinkStyle}>Войти</Link>
        )}
      </nav>
    </header>
  );
};

// --- Стили maimei ---

const headerContainerStyle: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: '15px 60px', 
  background: 'rgba(255, 255, 255, 0.8)', 
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(219, 112, 147, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000
};

const logoStyle: React.CSSProperties = { 
  fontSize: '28px', 
  fontWeight: '700', 
  color: '#db7093', 
  textDecoration: 'none',
  fontFamily: "'Playfair Display', serif",
  letterSpacing: '-0.5px'
};

const navStyle: React.CSSProperties = { 
  display: 'flex', 
  gap: '25px', 
  alignItems: 'center' 
};

const linkStyle: React.CSSProperties = { 
  textDecoration: 'none', 
  color: '#555',
  fontSize: '14px',
  fontWeight: '500',
  letterSpacing: '0.5px'
};

const adminLinkStyle: React.CSSProperties = { 
  ...linkStyle, 
  color: '#d4af37', // Золотистый акцент для админа
  fontWeight: '600' 
};

const profileLinkStyle: React.CSSProperties = {
  ...linkStyle,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#333'
};

const avatarCircleStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  background: '#fdf2f6',
  color: '#db7093',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase'
};

const logoutBtnStyle: React.CSSProperties = { 
  background: 'none', 
  border: '1px solid #eee', 
  padding: '8px 16px', 
  borderRadius: '20px', 
  cursor: 'pointer',
  fontSize: '13px',
  color: '#888',
  transition: 'all 0.3s'
};

const authLinkStyle: React.CSSProperties = {
  ...linkStyle,
  background: '#db7093',
  color: '#fff',
  padding: '10px 25px',
  borderRadius: '25px',
  boxShadow: '0 4px 15px rgba(219, 112, 147, 0.2)'
};

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '20px',
  background: '#eee',
  margin: '0 10px'
};

export default Header;