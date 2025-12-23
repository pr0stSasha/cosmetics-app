import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../supabaseClient';
import type { RootState } from '../app/store';
import type { Product } from '../types';

// Импорт стилей
import s from '../features/favorites/FavoritesPage.module.css';

interface FavoriteResponse {
  product_id: string;
  products: Product | null;
}

const FavoritesPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('product_id, products (*)')
          .eq('user_id', user.id);

        if (!error && data) {
          const items = (data as unknown as FavoriteResponse[])
            .map((f) => f.products)
            .filter((p): p is Product => p !== null);
          setFavorites(items);
        }
      } catch (err) {
        console.error("Ошибка при загрузке избранного:", err);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [user]);

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!error) {
      setFavorites(prev => prev.filter(item => item.id !== productId));
    }
  };

  if (loading) return <div className={s.center}>💖 Загружаем любимое...</div>;

  if (favorites.length === 0) {
    return (
      <div className={s.emptyContainer}>
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>💖</div>
        <h2 className={s.title}>Тут пока пусто</h2>
        <p style={{ color: '#888' }}>Добавляй косметику из рекомендаций!</p>
        <Link to="/" className={s.linkButton}>К рекомендациям</Link>
      </div>
    );
  }

  return (
    <div className={s.pageContainer}>
      <h2 className={s.title}>Моё избранное 💖</h2>
      <div className={s.grid}>
        {favorites.map((product) => (
          <div key={product.id} className={s.card}>
            <button 
              onClick={() => removeFavorite(product.id)} 
              className={s.removeBtn}
              title="Удалить из избранного"
            >
              💔
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

export default FavoritesPage;