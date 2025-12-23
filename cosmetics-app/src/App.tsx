import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';
import Header from './components/Header/Header';
import RecommendationsPage from './pages/RecommendationsPage';
import FavoritesPage from './pages/FavoritesPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  // Мы берем юзера из стора внутри компонента, а не передаем его снаружи
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <Header />
      <main style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<RecommendationsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Защита админки */}
          <Route 
            path="/admin" 
            element={user?.isAdmin ? <AdminPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;