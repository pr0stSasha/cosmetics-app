import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from './supabaseClient';
import { setUser } from './features/auth/authSlice'; 
import type { RootState, AppDispatch } from './app/store';
import Navbar from './components/Header/Header'; 
import AuthPage from './pages/AuthPage';
import RecommendationsPage from './pages/RecommendationsPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        dispatch(setUser({
          id: session.user.id,
          username: session.user.user_metadata?.username || 'Beauty',
          isAdmin: session.user.user_metadata?.isAdmin || false,
        }));
      } else {
        dispatch(setUser(null));
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser({
          id: session.user.id,
          username: session.user.user_metadata?.username || 'Beauty',
          isAdmin: session.user.user_metadata?.isAdmin || false,
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fffaff' }}>
        <h2 style={{ color: '#db7093', fontFamily: 'sans-serif' }}>✨ Загрузка MAIMEI...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fffaff' }}>
      {user && <Navbar />}
      <Routes>
        {!user ? (
          <>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<RecommendationsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={user.isAdmin ? <AdminPage /> : <Navigate to="/" />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;