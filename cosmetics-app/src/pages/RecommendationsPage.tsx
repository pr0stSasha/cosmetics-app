import { useAppSelector } from '../app/hooks';
import { ProductCard } from '../features/products/ProductCard';
import { productsDB, type Product } from '../data/products';
import { type RootState } from '../app/store';

const RecommendationsPage = () => {
  const { skinType, colorType } = useAppSelector((state: RootState) => state.survey);

  const recommended = productsDB.filter(product => {
    const matchesSkin = product.suitableFor.includes(skinType) || 
                        product.suitableFor.includes("Все") || 
                        skinType === "Все";
    const matchesColor = !product.colorType || 
                         product.colorType === colorType || 
                         colorType === "Все";
    return matchesSkin && matchesColor;
  });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Рекомендации для вас</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
        {recommended.map((item: Product) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationsPage;