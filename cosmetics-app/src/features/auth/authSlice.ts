import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppUser } from '../../types';

interface AuthState {
  user: AppUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  user: null,
  status: 'loading', 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AppUser | null>) => {
      state.user = action.payload;
      state.status = 'succeeded';
    },
    logout: (state) => {
      state.user = null;
      state.status = 'succeeded';
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;