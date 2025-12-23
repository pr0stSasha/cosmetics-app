import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

// 1. Импортируем стили из твоего модуля
import s from './Header.module.css'; 

const Header: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    // 2. Используем классы из файла стилей
    <nav className={s.header}>
      <div className={s.logo}>
        <Link to="/">MAIMEI ✨</Link>
      </div>
      
      <div className={s.nav}>
        <Link to="/">Рекомендации</Link>
        <Link to="/favorites">Избранное</Link>
        <Link to="/profile">Профиль</Link>
        
        {user?.isAdmin && (
          <Link to="/admin" className={s.adminLink}>Админ</Link>
        )}
      </div>
    </nav>
  );
};

export default Header;