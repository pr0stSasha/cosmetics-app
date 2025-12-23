import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../supabaseClient';
import type { RootState } from '../app/store';
import type { Product } from '../types';

// Описываем структуру ответа от Supabase, чтобы не использовать any
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
        // Запрашиваем данные из таблицы favorites и присоединенные данные из products
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            product_id,
            products (*)
          `)
          .eq('user_id', user.id);

        if (!error && data) {
          // Безопасно преобразуем данные в массив товаров
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

  // Функция удаления из избранного
  const removeFavorite = async (productId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!error) {
      // Удаляем товар из списка на экране без перезагрузки страницы
      setFavorites(prev => prev.filter(item => item.id !== productId));
    }
  };

  if (loading) return <div style={centerStyle}>💖 Загружаем любимое...</div>;

  if (favorites.length === 0) {
    return (
      <div style={emptyContainerStyle}>
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>💖</div>
        <h2 style={{ color: '#db7093', marginBottom: '10px' }}>Тут пока пусто</h2>
        <p style={{ color: '#888', marginBottom: '25px' }}>Добавляй косметику из рекомендаций!</p>
        <Link to="/" style={linkButtonStyle}>К рекомендациям</Link>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <h2 style={{ color: '#db7093', textAlign: 'center', marginBottom: '40px' }}>Моё избранное 💖</h2>
      <div style={gridStyle}>
        {favorites.map((product) => (
          <div key={product.id} style={cardStyle}>
            {/* Кнопка "разлайкать" */}
            <button 
              onClick={() => removeFavorite(product.id)} 
              style={removeBtnStyle}
              title="Удалить из избранного"
            >
              💔
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

// --- СТИЛИ ---
const pageContainer: React.CSSProperties = {
  padding: '40px 20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '25px',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
};

const removeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '35px',
  height: '35px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: 10,
  fontSize: '18px',
};

const imageWrapper: React.CSSProperties = {
  width: '100%',
  height: '180px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
};

const imageStyle: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
};

const infoStyle: React.CSSProperties = {
  padding: '20px',
  textAlign: 'left',
};

const brandStyle = { color: '#db7093', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' as const };
const nameStyle = { fontSize: '15px', margin: '5px 0', color: '#333', height: '40px', overflow: 'hidden' };
const priceTag = { fontSize: '18px', fontWeight: 'bold', color: '#333' };

const centerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', color: '#db7093', fontSize: '20px' };
const emptyContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', textAlign: 'center' };
const linkButtonStyle: React.CSSProperties = {
  padding: '12px 30px', background: '#db7093', color: '#fff',
  textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(219, 112, 147, 0.4)'
};

export default FavoritesPage;