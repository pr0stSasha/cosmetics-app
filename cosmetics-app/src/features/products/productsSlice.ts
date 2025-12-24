import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import type { Product } from '../../types';

interface ProductState {
  items: Product[];
  recommendations: Product[];
  favorites: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  recommendations: [],
  favorites: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return rejectWithValue(error.message);
  return data as Product[];
});

export const fetchRecommendations = createAsyncThunk(
  'products/fetchRecommendations',
  async ({ skinType, budget }: { skinType: string; budget: string }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('budget_segment', budget)
      .or(`category_type.eq.makeup, skin_type.cs.{${skinType}}`);
    if (error) return rejectWithValue(error.message);
    return data as Product[];
  }
);

export const addProduct = createAsyncThunk('products/addProduct', async (newProduct: Omit<Product, 'id'>, { rejectWithValue }) => {
  const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
  if (error) return rejectWithValue(error.message);
  return data as Product;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string, { rejectWithValue }) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return rejectWithValue(error.message);
  return id;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product: Product, { rejectWithValue }) => {
  const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
  if (error) return rejectWithValue(error.message);
  return data as Product;
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
        state.loading = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;