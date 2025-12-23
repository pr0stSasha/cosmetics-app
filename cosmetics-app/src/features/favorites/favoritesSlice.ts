import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";

interface FavoritesState {
  items: string[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: FavoritesState = {
  items: [],
  status: 'idle',
};

export const fetchFavorites = createAsyncThunk("favorites/fetch", async (userId: string) => {
  const { data, error } = await supabase.from("favorites").select("product_id").eq("user_id", userId);
  if (error) throw error;
  return data.map((fav) => fav.product_id);
});

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async ({ userId, productId, isFavorite }: { userId: string; productId: string; isFavorite: boolean }) => {
    if (isFavorite) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("product_id", productId);
      if (error) throw error;
      return { productId, removed: true };
    } else {
      const { error } = await supabase.from("favorites").insert([{ user_id: userId, product_id: productId }]);
      if (error) throw error;
      return { productId, removed: false };
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.removed) {
          state.items = state.items.filter(id => id !== action.payload.productId);
        } else {
          state.items.push(action.payload.productId);
        }
      });
  },
});

export default favoritesSlice.reducer;