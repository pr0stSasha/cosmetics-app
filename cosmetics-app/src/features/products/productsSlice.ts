import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import type { Product } from '../../types'; // Исправлен импорт (type-only)

interface ProductState {
  items: Product[]; // Добавили items для AdminPage
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

// --- АСИНХРОННЫЕ ЭКШЕНЫ (Requirement 2.1 & 2.2) ---

// GET: Все товары для админки
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return rejectWithValue(error.message);
  return data as Product[];
});

// GET: Рекомендации
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

// POST: Добавить товар (Admin)
export const addProduct = createAsyncThunk('products/addProduct', async (newProduct: Omit<Product, 'id'>, { rejectWithValue }) => {
  const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
  if (error) return rejectWithValue(error.message);
  return data as Product;
});

// DELETE: Удалить товар (Admin)
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string, { rejectWithValue }) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return rejectWithValue(error.message);
  return id;
});

// PUT: Обновить товар (Admin)
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
      // Fetch all
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      // Recommendations
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
        state.loading = false;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // Loading states
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
        state.loading = true;
      })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;