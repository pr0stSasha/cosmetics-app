import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
import type { Product } from '../../types'; // Убедись, что путь к папке types верный

// Тип для записи из таблицы favorites
interface FavoriteItem {
  id: string;
  user_id: string;
  product_id: string;
  products: Product; // Вложенный объект с данными товара
}

interface FavoritesState {
  items: FavoriteItem[];
  loading: boolean;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
};

// 1. Асинхронный санка для загрузки избранного (Требование ТЗ по Redux Toolkit)
export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, products(*)') // Подгружаем связанные данные о товаре
      .eq('user_id', userId);

    if (error) throw error;
    return data as FavoriteItem[];
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Редюсер для очистки при выходе, если понадобится
    clearFavorites: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;