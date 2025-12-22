import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import FavoritesPage from '../pages/FavoritesPage';
import RecommendationsPage from '../pages/RecommendationsPage';
import AdminProductsPage from '../pages/AdminProductsPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
