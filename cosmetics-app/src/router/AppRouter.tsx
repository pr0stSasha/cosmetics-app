import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RecommendationsPage from '../pages/RecommendationsPage';
import FavoritesPage from '../pages/FavoritesPage';
import AuthPage from '../pages/AuthPage';
import ProfilePage from '../pages/ProfilePage'; 

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RecommendationsPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRouter;