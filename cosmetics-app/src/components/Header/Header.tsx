import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

export const Header = () => {
  const dispatch = useAppDispatch();
  const favoritesCount = useAppSelector((state) => state.favorites.items.length);

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 500,
    fontSize: '14px'
  };

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      background: '#fff', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
    }}>
      <div className="logo" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        CosmeticsApp
      </div>

      <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/recommendations" style={navLinkStyle}>
          Рекомендации
        </Link>
        
        {/* Добавленный раздел Избранное */}
        <Link to="/favorites" style={{ ...navLinkStyle, position: 'relative' }}>
          Избранное
          {favoritesCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-15px',
              background: '#e8a0bf',
              color: '#fff',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '10px'
            }}>
              {favoritesCount}
            </span>
          )}
        </Link>

        <Link to="/profile" style={navLinkStyle}>
          Профиль
        </Link>

        <button 
          onClick={() => dispatch(logout())}
          style={{
            padding: '8px 16px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          Выйти
        </button>
      </nav>
    </header>
  );
};