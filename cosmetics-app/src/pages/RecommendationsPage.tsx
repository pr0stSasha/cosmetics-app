import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../supabaseClient';
import type { RootState } from '../app/store';
import type { Product } from '../types';

const RecommendationsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: userData } = await supabase
          .from('users_custom')
          .select('skin_type, budget_segment')
          .eq('id', user.id)
          .single();

        if (userData) {
          // Загружаем товары
          const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('budget_segment', userData.budget_segment)
            .or(`category_type.eq.makeup, skin_type.cs.{${userData.skin_type}}`);

          if (products) setRecommendations(products);

          // Загружаем ID избранного
          const { data: favs } = await supabase
            .from('favorites')
            .select('product_id')
            .eq('user_id', user.id);
          
          if (favs) {
            setFavoriteIds(favs.map(f => f.product_id));
          }
        }
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    if (!user) return;
    
    // Добавляем в базу
    await supabase.from('favorites').insert([{ user_id: user.id, product_id: productId }]);
    
    // Обновляем локальный стейт ID, чтобы товар исчез из списка (фильтрация ниже)
    setFavoriteIds(prev => [...prev, productId]);
  };

  // ФИЛЬТРАЦИЯ: Показываем только те товары, которые НЕ в избранном
  const filteredRecommendations = recommendations.filter(
    (product) => !favoriteIds.includes(product.id)
  );

  if (loading) return <div style={centerStyle}>✨ Ищем новинки для тебя...</div>;

  if (filteredRecommendations.length === 0) {
    return (
      <div style={emptyContainerStyle}>
        <h2 style={{ color: '#db7093' }}>Ты лайкнула всё! ✨</h2>
        <p style={{ color: '#888' }}>Все подходящие товары уже в твоём избранном.</p>
        <Link to="/favorites" style={linkButtonStyle}>Перейти в Избранное</Link>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <h2 style={{ color: '#db7093', marginBottom: '30px' }}>Рекомендации ✨</h2>
      <div style={gridStyle}>
        {filteredRecommendations.map((product) => (
          <div key={product.id} style={cardStyle}>
            <button onClick={() => toggleFavorite(product.id)} style={favBtnStyle}>
              🤍
            </button>
            <div style={imageWrapper}>
              <img src={product.image_url} alt={product.name} style={imageStyle} />
            </div>
            <div style={infoStyle}>
              <p style={brandStyle}>{product.brand}</p>
              <h3 style={nameStyle}>{product.name}</h3>
              <div style={priceTag}>{product.price} ₽</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Стили (сокращенно)
const favBtnStyle: React.CSSProperties = { position: 'absolute', top: '15px', right: '15px', background: '#fff', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10 };
const pageContainer: React.CSSProperties = { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' };
const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 15px rgba(0,0,0,0.05)', position: 'relative' };
const imageWrapper: React.CSSProperties = { width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' };
const imageStyle: React.CSSProperties = { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' };
const infoStyle: React.CSSProperties = { padding: '15px' };
const brandStyle = { color: '#db7093', fontSize: '11px', fontWeight: 'bold' };
const nameStyle = { fontSize: '15px', margin: '5px 0' };
const priceTag = { fontSize: '16px', fontWeight: 'bold' };
const centerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' };
const emptyContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' };
const linkButtonStyle: React.CSSProperties = { padding: '10px 20px', background: '#db7093', color: '#fff', textDecoration: 'none', borderRadius: '20px', marginTop: '15px' };

export default RecommendationsPage;