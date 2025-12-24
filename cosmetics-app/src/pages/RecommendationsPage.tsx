import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../supabaseClient';
import type { RootState } from '../app/store';
import type { Product } from '../types';
import s from '../features/products/Products.module.css';

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
          const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('budget_segment', userData.budget_segment)
            .or(`category_type.eq.makeup, skin_type.cs.{${userData.skin_type}}`);

          if (products) setRecommendations(products);

          const { data: favs } = await supabase
            .from('favorites')
            .select('product_id')
            .eq('user_id', user.id);
          
          if (favs) setFavoriteIds(favs.map(f => f.product_id));
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
    await supabase.from('favorites').insert([{ user_id: user.id, product_id: productId }]);
    setFavoriteIds(prev => [...prev, productId]);
  };

  const filteredRecommendations = recommendations.filter(
    (product) => !favoriteIds.includes(product.id)
  );

  if (loading) return <div className={s.center}>✨ Ищем новинки для тебя...</div>;

  if (filteredRecommendations.length === 0) {
    return (
      <div className={s.emptyContainer}>
        <h2 style={{ color: '#db7093' }}>Ты лайкнула всё! ✨</h2>
        <p style={{ color: '#888' }}>Все подходящие товары уже в твоём избранном.</p>
        <Link to="/favorites" className={s.linkButton}>Перейти в Избранное</Link>
      </div>
    );
  }

  return (
    <div className={s.pageContainer}>
      <h2 className={s.title}>Рекомендации ✨</h2>
      <div className={s.grid}>
        {filteredRecommendations.map((product) => (
          <div key={product.id} className={s.card}>
            <button onClick={() => toggleFavorite(product.id)} className={s.favBtn}>
              🤍
            </button>
            <div className={s.imageWrapper}>
              <img src={product.image_url} alt={product.name} className={s.image} />
            </div>
            <div className={s.info}>
              <p className={s.brandUrl}>{product.product_url}</p>
              <h3 className={s.name}>{product.name}</h3>
              <div className={s.price}>{product.price} ₽</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;