import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

// Создаем тип для ответа из базы, чтобы убрать any
interface FavoriteResponse {
  product_id: string;
  products: Product | null;
}

const FavoritesPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Объявляем функцию внутри useEffect, это решает проблему "cascading renders"
    const fetchFavorites = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error(error);
      } else if (data) {
        // Безопасно приводим тип
        const response = data as unknown as FavoriteResponse[];
        const favProducts = response
          .map(item => item.products)
          .filter((p): p is Product => p !== null);
        
        setProducts(favProducts);
      }
    };

    fetchFavorites();
  }, [user]); // Теперь только одна зависимость

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  if (!user) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Войди, чтобы видеть избранное 💖</h2>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#e8a0bf', textAlign: 'center' }}>Мои любимые средства</h2>
      <div style={gridStyle}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={cardStyle}>
              <img 
                src={product.image_url || 'https://placehold.co/150x150?text=Beauty'} 
                alt={product.name} 
                style={imgStyle} 
              />
              <h4>{product.name}</h4>
              <p style={{ color: '#e8a0bf' }}>{product.price} ₽</p>
              <button onClick={() => removeFavorite(product.id)} style={removeButtonStyle}>
                Удалить ❤️
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Тут пока пусто...</p>
        )}
      </div>
    </div>
  );
};

const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '15px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const imgStyle: React.CSSProperties = { width: '100%', borderRadius: '15px' };
const removeButtonStyle: React.CSSProperties = { background: '#fff0f5', border: '1px solid #e8a0bf', color: '#e8a0bf', borderRadius: '15px', padding: '5px 10px', cursor: 'pointer' };

export default FavoritesPage;