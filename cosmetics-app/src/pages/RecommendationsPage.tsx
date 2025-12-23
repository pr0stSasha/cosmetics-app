import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import type { Product } from '../types';

const RecommendationsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: profile } = await supabase.from('users_custom').select('*').eq('id', user.id).single();
      const { data: favData } = await supabase.from('favorites').select('product_id').eq('user_id', user.id);
      const favoriteIds = favData?.map(fav => fav.product_id) || [];

      const skinMap: Record<string, string> = { 
        "Жирная 🌼": "oily", 
        "Сухая": "dry", 
        "Комбинированная": "combination", 
        "Нормальная": "normal" 
      };
      
      const budgetMap: Record<string, string> = { 
        "Бюджетно": "budget", 
        "Масс-маркет": "medium", 
        "Люкс": "luxury" 
      };

      let query = supabase.from('products').select('*');

      if (profile) {
        const skinKey = skinMap[profile.skin_type] || profile.skin_type;
        const budgetKey = budgetMap[profile.budget_segment] || profile.budget_segment;
        const typeKey = profile.preference_type; 

        if (skinKey && skinKey !== 'all') query = query.filter('skin_type', 'cs', `{"${skinKey}"}`);
        if (budgetKey && budgetKey !== 'all' && budgetKey !== 'Любая') query = query.eq('budget_segment', budgetKey);
        if (typeKey && typeKey !== 'any' && typeKey !== 'both' && typeKey !== 'Любая') query = query.eq('category_type', typeKey);
      }

      if (favoriteIds.length > 0) query = query.not('id', 'in', `(${favoriteIds.join(',')})`);

      const { data: finalProducts, error } = await query;
      if (error) throw error;
      setProducts(finalProducts || []);
    } catch (err) {
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchRecommendations(); }, [fetchRecommendations]);

  const toggleFavorite = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase.from('favorites').insert([{ user_id: user.id, product_id: productId }]);
    if (!error) setProducts(prev => prev.filter(p => p.id !== productId));
  };

  if (loading) return <div style={centerText}>✨ Подбираем секреты красоты для тебя...</div>;

  return (
    <div style={pageContainer}>
      <div style={heroSection}>
        <h1 style={heroTitle}>Welcome to maimei</h1>
        <p style={heroSubtitle}>Персональный подбор на основе твоих предпочтений</p>
      </div>

      {products.length === 0 ? (
        <div style={centerText}>
          <p style={{ fontSize: '18px', color: '#999' }}>Ничего не нашлось. Попробуй изменить параметры!</p>
          <button onClick={() => navigate('/profile')} style={outlineBtn}>Обновить анкету</button>
        </div>
      ) : (
        <div style={gridStyle}>
          {products.map(product => (
            <div key={product.id} style={cardStyle}>
              {/* Добавили бейдж категории, который был в стилях, но не в верстке */}
              <div style={badgeStyle}>
                {product.category_type === 'care' ? 'Care' : 'Makeup'}
              </div>
              
              <img src={product.image_url} alt={product.name} style={imgStyle} />
              
              <div style={contentStyle}>
                <h4 style={productNameStyle}>{product.name}</h4>
                <p style={productPrice}>{product.price} ₽</p>
                <button onClick={() => toggleFavorite(product.id)} style={favBtn}>
                  Добавить в бокс ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Дизайн-система maimei ---

const pageContainer: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px 80px 20px',
};

const heroSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0 40px 0',
};

const heroTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '48px',
  color: '#db7093',
  marginBottom: '10px',
  fontWeight: '700',
};

const heroSubtitle: React.CSSProperties = {
  fontSize: '16px',
  color: '#888',
  maxWidth: '500px',
  margin: '0 auto',
  lineHeight: '1.6',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '40px',
  marginTop: '20px'
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '40px',
  overflow: 'hidden',
  boxShadow: '0 15px 35px rgba(219, 112, 147, 0.05)',
  border: '1px solid rgba(219, 112, 147, 0.08)',
  position: 'relative',
  transition: 'transform 0.3s ease',
};

const badgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#db7093',
  backdropFilter: 'blur(5px)',
  zIndex: 2,
};

const imgStyle: React.CSSProperties = {
  width: '100%',
  height: '320px',
  objectFit: 'cover',
  backgroundColor: '#fdf2f6'
};

const contentStyle: React.CSSProperties = {
  padding: '25px',
  textAlign: 'center'
};

const productNameStyle: React.CSSProperties = {
  fontSize: '18px',
  margin: '0 0 10px 0',
  color: '#333',
  fontWeight: '500',
  height: '44px',
  overflow: 'hidden'
};

const productPrice: React.CSSProperties = {
  color: '#db7093',
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '20px'
};

const favBtn: React.CSSProperties = {
  width: '100%',
  background: 'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)',
  color: '#fff',
  border: 'none',
  padding: '14px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: '600',
  boxShadow: '0 4px 15px rgba(255, 175, 189, 0.3)',
};

const outlineBtn: React.CSSProperties = {
  marginTop: '20px',
  background: 'none',
  border: '1px solid #db7093',
  color: '#db7093',
  padding: '12px 30px',
  borderRadius: '25px',
  cursor: 'pointer',
  fontWeight: '600'
};

const centerText: React.CSSProperties = {
  textAlign: 'center',
  padding: '100px 20px',
  color: '#888'
};

export default RecommendationsPage;