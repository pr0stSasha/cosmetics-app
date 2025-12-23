import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';
import type { AppUser } from '../../types/index';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as AppUser | null;
  const dispatch = useDispatch();

  return (
    <header style={headerStyle}>
      <Link to="/" style={logoStyle}>MAIMEI 🌸</Link>
      
      <nav style={navStyle}>
        {/* Общие ссылки для всех */}
        <Link to="/" style={linkStyle}>Рекомендации</Link>
        <Link to="/favorites" style={linkStyle}>Избранное</Link>

        {user ? (
          <>
            {/* Ссылка только для админа */}
            {user.isAdmin && (
              <Link to="/admin" style={{ ...linkStyle, color: '#db7093', fontWeight: 'bold' }}>
                Админ
              </Link>
            )}
            <Link to="/profile" style={linkStyle}>
              Профиль ({user.username})
            </Link>
            <button onClick={() => dispatch(logout())} style={logoutStyle}>
              Выход
            </button>
          </>
        ) : (
          <Link to="/auth" style={linkStyle}>Войти</Link>
        )}
      </nav>
    </header>
  );
};

// Стили для опрятного вида
const headerStyle: React.CSSProperties = { 
  padding: '15px 40px', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  backgroundColor: '#fff', 
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
};

const logoStyle: React.CSSProperties = { 
  fontSize: '22px', 
  fontWeight: 'bold', 
  color: '#db7093', 
  textDecoration: 'none' 
};

const navStyle: React.CSSProperties = { 
  display: 'flex', 
  gap: '25px', 
  alignItems: 'center' 
};

const linkStyle: React.CSSProperties = { 
  textDecoration: 'none', 
  color: '#555', 
  fontSize: '15px',
  fontWeight: 500 
};

const logoutStyle: React.CSSProperties = { 
  background: 'none', 
  border: '1px solid #db7093', 
  color: '#db7093', 
  padding: '5px 12px', 
  borderRadius: '8px', 
  cursor: 'pointer',
  fontSize: '14px'
};

export default Header;