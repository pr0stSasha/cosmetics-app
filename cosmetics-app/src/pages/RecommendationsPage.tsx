import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { Product } from '../types';

const RecommendationsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // 1. Получаем ID всех товаров, которые УЖЕ в избранном
        const { data: favData } = await supabase
          .from('favorites')
          .select('product_id')
          .eq('user_id', user.id);

        const favoriteIds = favData?.map(fav => fav.product_id) || [];

        // 2. Загружаем рекомендации
        let query = supabase.from('products').select('*');

        // ФИЛЬТР: Исключаем те, что в избранном
        if (favoriteIds.length > 0) {
          query = query.not('id', 'in', `(${favoriteIds.join(',')})`);
        }

        // 3. Дополнительная магия: фильтруем по анкете (если она заполнена)
        const { data: profile } = await supabase
          .from('users_custom')
          .select('skin_type, budget_segment')
          .eq('id', user.id)
          .single();

        if (profile?.skin_type) {
          // Здесь можно добавить фильтрацию по категории или описанию
          // Например: .ilike('description', `%${profile.skin_type}%`)
        }

        const { data: finalProducts } = await query;
        setProducts(finalProducts || []);
      } catch (error) {
        console.error('Ошибка рекомендаций:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  // Функция для лайка (после которой товар должен исчезнуть)
  const toggleFavorite = async (productId: string) => {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: user?.id, product_id: productId }]);

    if (!error) {
      // Мгновенно убираем товар из списка на экране
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Ищем лучшее для тебя... ✨</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#db7093', textAlign: 'center' }}>Персональные рекомендации</h2>
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>
          Ты добавила всё в избранное! Загляни туда 💖
        </p>
      ) : (
        <div style={gridStyle}>
          {products.map(product => (
            <div key={product.id} style={cardStyle}>
              <img
              src={product.image_url && product.image_url.trim() !== "" ? product.image_url : "https://placehold.co/400x400?text=Glowly+Product"} 
              alt={product.name} 
              style={imgStyle} 
              onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Photo";
              }}
              />
              <h4>{product.name}</h4>
              <p>{product.price} ₽</p>
              <button onClick={() => toggleFavorite(product.id)} style={favBtn}>
                В избранное ❤️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Стили для красоты
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' };
const cardStyle = { border: '1px solid #f0f0f0', borderRadius: '20px', padding: '15px', textAlign: 'center' as const };
const imgStyle = { width: '100%', borderRadius: '15px', marginBottom: '10px' };
const favBtn = { background: '#fce4ec', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', color: '#db7093' };

export default RecommendationsPage;