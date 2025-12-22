import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>('products/fetchProducts', async () => {
  return [
    { id: '1', name: 'Lipstick', category: 'makeup' },
    { id: '2', name: 'Face Cream', category: 'skincare' },
  ];
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch products';
      });
  },
});

export const { addProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
