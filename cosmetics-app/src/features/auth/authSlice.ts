import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';
// Добавили "type" перед AppUser
import type { AppUser } from '../../types/index'; 

interface AuthState {
  user: AppUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const savedUser = localStorage.getItem('app_user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  status: 'idle',
};

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (userId: string) => {
  const { data, error } = await supabase.from('users_custom').select('*').eq('id', userId).single();
  if (error || !data) throw new Error('User not found');
  
  const transformed: AppUser = { 
    ...data, 
    isAdmin: String(data.is_admin) === 'true' 
  };
  localStorage.setItem('app_user', JSON.stringify(transformed));
  return transformed;
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profile: Partial<AppUser> & { id: string }) => {
  const { data } = await supabase.from('users_custom').update(profile).eq('id', profile.id).select().single();
  const transformed: AppUser = { 
    ...data, 
    isAdmin: String(data.is_admin) === 'true' 
  };
  localStorage.setItem('app_user', JSON.stringify(transformed));
  return transformed;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser | null>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('app_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('app_user');
      }
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('app_user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<AppUser>) => {
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<AppUser>) => {
        state.user = action.payload;
      });
  },
});
export const { setUser, logout } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;