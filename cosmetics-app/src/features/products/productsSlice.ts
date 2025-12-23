import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";
import type { Product } from "../../types";
import { toggleFavorite } from "../favorites/favoritesSlice";

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

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Product[];
});

export const fetchRecommendations = createAsyncThunk(
  "products/fetchRecommendations",
  async (userId: string) => {
    const { data: profile } = await supabase.from("users_custom").select("*").eq("id", userId).single();
    const { data: favorites } = await supabase.from("favorites").select("product_id").eq("user_id", userId);
    const favoriteIds = favorites?.map(f => f.product_id) || [];

    let query = supabase.from("products").select("*");

    if (profile) {
      if (profile.budget_segment) {
        query = query.eq('budget_segment', profile.budget_segment);
      }
      const skinMap: Record<string, string> = { 
        "Жирная": "oily", "Сухая": "dry", "Комбинированная": "combination", "Нормальная": "normal" 
      };
      const skinKey = skinMap[profile.skin_type] || profile.skin_type;
      if (skinKey && skinKey !== 'all') {
        query = query.filter('skin_type', 'cs', `{"${skinKey}"}`);
      }
    }

    if (favoriteIds.length > 0) {
      query = query.not('id', 'in', `(${favoriteIds.join(',')})`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  }
);

// ЭТИ ЭКСПОРТЫ ИСПРАВЛЯЮТ ОШИБКУ В ADMINPAGE
export const addProduct = createAsyncThunk('products/addProduct', async (newProduct: Partial<Product>) => {
  const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
  if (error) throw error;
  return data as Product;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product: Product) => {
  const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
  if (error) throw error;
  return data as Product;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      // МОМЕНТАЛЬНОЕ ИСЧЕЗНОВЕНИЕ ПРИ ЛАЙКЕ
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { productId, removed } = action.payload;
        if (!removed) {
          state.items = state.items.filter(item => item.id !== productId);
        }
      });
  },
});

export default productsSlice.reducer;