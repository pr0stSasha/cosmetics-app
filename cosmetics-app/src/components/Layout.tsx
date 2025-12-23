import React from 'react';
import Header from './Header/Header'; // Проверь правильность пути к Хедеру
import s from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={s.layout}>
      <Header />
      <main className={s.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;