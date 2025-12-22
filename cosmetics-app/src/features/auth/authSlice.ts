import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  'auth/loginUser',
  async ({ email }, { rejectWithValue }) => {
    try {
      return { id: '1', name: 'Alex', email, isAdmin: false };
    } catch {
      return rejectWithValue('Login failed');
    }
  }
);

export const registerUser = createAsyncThunk<User, { name: string; email: string; password: string }, { rejectValue: string }>(
  'auth/registerUser',
  async ({ name, email }, { rejectWithValue }) => {
    try {
      return { id: '2', name, email, isAdmin: false };
    } catch {
      return rejectWithValue('Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
