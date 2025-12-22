import { useAppSelector } from '../app/hooks';
import { ProductCard } from '../features/products/ProductCard';
import { Link } from 'react-router-dom';
import { type Product } from '../data/products';
import { type RootState } from '../app/store';

const FavoritesPage = () => {
  const favorites = useAppSelector((state: RootState) => state.favorites.items);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Ваша косметичка</h1>

      {favorites.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {favorites.map((item: Product) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Вы еще ничего не добавили</p>
          <Link to="/recommendations" style={{ color: '#e8a0bf', fontWeight: 'bold' }}>
            Найти что-нибудь интересное
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;