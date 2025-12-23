import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './app/store';
import { fetchProfile } from './features/auth/authSlice';

// Импорт страниц
import RecommendationsPage from './pages/RecommendationsPage';
import FavoritesPage from './pages/FavoritesPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Импорт компонентов
import Header from './components/Header/Header';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Используем опциональную цепочку ?. чтобы избежать ошибки "state.auth is undefined"
  const user = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    // Если в localStorage сохранился id, обновляем данные из users_custom
    if (user?.id) {
      dispatch(fetchProfile(user.id));
    }
  }, [dispatch, user?.id]);

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
          
          {/* Защищенный роут: только для пользователей с is_admin = true */}
          <Route 
            path="/admin" 
            element={user?.isAdmin ? <AdminPage /> : <Navigate to="/" />} 
          />
          
          {/* Редирект на главную, если путь не найден */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;