import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import type { Product } from '../../types';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

// GET: Получение товаров
export const fetchProducts = createAsyncThunk('products/fetch', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return rejectWithValue(error.message);
  return data as Product[];
});

// DELETE: Удаление товара
export const removeProduct = createAsyncThunk('products/remove', async (id: string, { rejectWithValue }) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return rejectWithValue(error.message);
  return id;
});

// POST/PUT: Сохранение или обновление
export const saveProduct = createAsyncThunk('products/save', async (product: Partial<Product>, { rejectWithValue }) => {
  const isEdit = !!product.id;
  const { data, error } = isEdit 
    ? await supabase.from('products').update(product).eq('id', product.id).select()
    : await supabase.from('products').insert([product]).select();
  
  if (error) return rejectWithValue(error.message);
  return data[0] as Product;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((p: Product) => p.id !== action.payload);
      })
      .addCase(saveProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((p: Product) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        else state.items.unshift(action.payload);
      });
  },
});

export default productsSlice.reducer;