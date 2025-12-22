import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleFavorite } from '../favorites/favoritesSlice';
import { type Product } from '../../data/products';
import { type RootState } from '../../app/store';

export const ProductCard = (product: Product) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item: Product) => item.id === product.id);

  return (
    <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '15px', position: 'relative', background: '#fff' }}>
      <button 
        onClick={() => dispatch(toggleFavorite(product))}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '22px'
        }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
      <h4 style={{ margin: '10px 0 5px' }}>{product.name}</h4>
      <p style={{ color: '#888', fontSize: '0.8rem' }}>{product.category}</p>
      <p style={{ fontWeight: 'bold', color: '#e8a0bf' }}>{product.price} ₽</p>
    </div>
  );
};