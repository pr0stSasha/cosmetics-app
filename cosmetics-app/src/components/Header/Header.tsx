import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

const Header: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <Link to="/" style={{ textDecoration: 'none', color: '#db7093' }}>MAIMEI ✨</Link>
      </div>
      <div style={linksStyle}>
        <Link to="/" style={linkItem}>Рекомендации</Link>
        <Link to="/favorites" style={linkItem}>Избранное</Link>
        <Link to="/profile" style={linkItem}>Профиль</Link>
        {user?.isAdmin && (
          <Link to="/admin" style={{ ...linkItem, color: '#db7093', fontWeight: 'bold' }}>Админ</Link>
        )}
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  background: '#fff',
  borderBottom: '1px solid #fdf2f6',
  position: 'sticky',
  top: 0,
  zIndex: 1000
};

const logoStyle = { fontSize: '24px', fontWeight: 'bold' };
const linksStyle = { display: 'flex', gap: '20px' };
const linkItem = { textDecoration: 'none', color: '#555', fontSize: '16px' };

export default Header;