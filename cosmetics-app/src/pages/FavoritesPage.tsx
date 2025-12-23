import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';

interface Product { 
  id: string; 
  name: string; 
  price: number; 
  image_url?: string; 
}

interface FavoriteResponse { 
  product_id: string; 
  products: Product | null; 
}

const FavoritesPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('favorites')
        .select('product_id, products (*)')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Ошибка при получении избранного:", error.message);
      } else if (data) {
        const response = data as unknown as FavoriteResponse[];
        const filteredProducts = response
          .map(item => item.products)
          .filter((p): p is Product => p !== null);
        
        setProducts(filteredProducts);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error("Ошибка при удалении из избранного:", error.message);
    } else {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  if (!user) {
    return (
      <div style={emptyStateContainer}>
        <h2 style={heroTitle}>Мой бокс 💖</h2>
        <p style={{ color: '#888' }}>Пожалуйста, войдите, чтобы видеть свои сохранения.</p>
        <button onClick={() => navigate('/auth')} style={shopBtn}>Войти</button>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <header style={headerSection}>
        <h1 style={heroTitle}>Мой бокс</h1>
        <p style={heroSubtitle}>Средства, которые вдохновляют тебя каждый день</p>
      </header>

      {loading ? (
        <div style={centerText}>✨ Открываем ваш бокс...</div>
      ) : products.length > 0 ? (
        <div style={gridStyle}>
          {products.map(product => (
            <div key={product.id} style={cardStyle}>
              <div style={imageContainer}>
                <img 
                  src={product.image_url || 'https://placehold.co/400x400?text=maimei'} 
                  alt={product.name} 
                  style={imgStyle} 
                />
                <button 
                  onClick={() => removeFavorite(product.id)} 
                  style={removeIconBtn}
                  title="Удалить из бокса"
                >
                  ✕
                </button>
              </div>
              <div style={contentStyle}>
                <h4 style={productNameStyle}>{product.name}</h4>
                <p style={priceStyle}>{product.price} ₽</p>
                <button style={detailBtn} onClick={() => console.log('Подробнее о', product.name)}>
                  Подробнее
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateContainer}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>✨</div>
          <p style={{ color: '#999', fontSize: '18px' }}>В твоем боксе пока пусто...</p>
          <button 
            onClick={() => navigate('/')} 
            style={shopBtn}
          >
            Найти средства
          </button>
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
  minHeight: '80vh'
};

const headerSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '60px 0 40px 0',
};

const heroTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '42px',
  color: '#db7093',
  marginBottom: '10px',
  fontWeight: '700',
};

const heroSubtitle: React.CSSProperties = {
  fontSize: '16px',
  color: '#888',
  fontWeight: '400',
};

const gridStyle: React.CSSProperties = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
  gap: '40px' 
};

const cardStyle: React.CSSProperties = { 
  background: '#fff', 
  borderRadius: '35px', 
  overflow: 'hidden', 
  boxShadow: '0 15px 35px rgba(219, 112, 147, 0.05)',
  border: '1px solid rgba(219, 112, 147, 0.08)',
  position: 'relative',
  transition: 'transform 0.3s ease'
};

const imageContainer: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  height: '280px',
  background: '#fdf2f6'
};

const imgStyle: React.CSSProperties = { 
  width: '100%', 
  height: '100%', 
  objectFit: 'cover' 
};

const removeIconBtn: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#db7093',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  backdropFilter: 'blur(5px)',
  zIndex: 10
};

const contentStyle: React.CSSProperties = {
  padding: '20px',
  textAlign: 'center'
};

const productNameStyle: React.CSSProperties = { 
  fontSize: '17px', 
  margin: '0 0 10px 0', 
  fontWeight: '500',
  color: '#333',
  height: '42px',
  overflow: 'hidden'
};

const priceStyle: React.CSSProperties = { 
  color: '#db7093', 
  fontWeight: 'bold', 
  fontSize: '18px',
  marginBottom: '15px'
};

const detailBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '18px',
  border: '1px solid #fdf2f6',
  background: '#fff',
  color: '#db7093',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s'
};

const shopBtn: React.CSSProperties = {
  marginTop: '25px',
  padding: '12px 40px',
  background: 'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '25px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 5px 15px rgba(255, 175, 189, 0.4)'
};

const emptyStateContainer: React.CSSProperties = {
  textAlign: 'center',
  padding: '100px 20px',
  maxWidth: '1200px',
  margin: '0 auto'
};

const centerText: React.CSSProperties = { 
  textAlign: 'center', 
  padding: '100px 0', 
  color: '#db7093',
  fontSize: '18px'
};

export default FavoritesPage;