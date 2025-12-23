import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <header style={headerStyle}>
      <Link to="/" style={logoStyle}>Glowly ✨</Link>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Главная</Link>
        {user && <Link to="/favorites" style={linkStyle}>Избранное</Link>}
        {user?.isAdmin && <Link to="/admin" style={adminLinkStyle}>Админка 👑</Link>}
        
        {user ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/profile" style={linkStyle}>👤 {user.username}</Link>
            <button onClick={() => dispatch(logout())} style={logoutBtn}>Выйти</button>
          </div>
        ) : (
          <Link to="/auth" style={linkStyle}>Войти</Link>
        )}
      </nav>
    </header>
  );
};

// Стили (коротко)
const headerStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 50px', background: '#fff', borderBottom: '1px solid #eee' };
const logoStyle = { fontSize: '24px', fontWeight: 'bold', color: '#db7093', textDecoration: 'none' };
const navStyle = { display: 'flex', gap: '20px', alignItems: 'center' };
const linkStyle = { textDecoration: 'none', color: '#666' };
const adminLinkStyle = { ...linkStyle, color: '#db7093', fontWeight: 'bold' };
const logoutBtn = { background: 'none', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' };

export default Header;