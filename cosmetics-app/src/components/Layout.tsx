import React from 'react';
import { Header } from './Header/Header';
import styles from './Layout.module.css';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.container}>
        {children}
      </main>
    </div>
  );
};