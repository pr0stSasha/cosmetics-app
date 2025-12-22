import { Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import RecommendationsPage from '../pages/RecommendationsPage';
import FavoritesPage from '../pages/FavoritesPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import LoginPage from '../pages/LoginPage'; 
import RegisterPage from '../pages/RegisterPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={<Navigate to="/recommendations" replace />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/admin" element={<AdminProductsPage />} />
      
      {/* Если кто-то перейдет по старой ссылке /catalog */}
      <Route path="/catalog" element={<Navigate to="/recommendations" replace />} />
    </Routes>
  );
};

export default AppRouter;