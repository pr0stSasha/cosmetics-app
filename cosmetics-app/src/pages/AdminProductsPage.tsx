import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProducts, removeProduct } from '../features/products/productsSlice';

const AdminProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <h2>Admin Products</h2>
      {loading && <p>Loading...</p>}
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            {p.name} <button onClick={() => dispatch(removeProduct(p.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductsPage;
