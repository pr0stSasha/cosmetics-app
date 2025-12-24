import productsReducer, { addProduct } from '../features/products/productsSlice';
import type { Product } from '../types/index';

type ProductState = ReturnType<typeof productsReducer>;

describe('productsSlice reducer', () => {
  const initialState: ProductState = {
    items: [],
    loading: false,
    error: null,
    recommendations: [],
    favorites: []
  };

  it('должен возвращать начальное состояние', () => {
    expect(productsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('должен добавлять новый товар в список (addProduct.fulfilled)', () => {
    const newProduct: Product = { 
      id: 'test-1', 
      name: 'Bambi Eye', 
      price: 1095, 
      category_type: 'makeup', 
      budget_segment: 'medium',
      skin_type: ['normal'],
      image_url: 'https://test.com/img.jpg',
      product_url: 'https://test.com'
    };

    const action = { type: addProduct.fulfilled.type, payload: newProduct };
    const state = productsReducer(initialState, action);
    
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Bambi Eye');
  });
});