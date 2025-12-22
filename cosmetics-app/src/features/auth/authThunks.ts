// src/features/auth/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

interface LoginPayload {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);
    return data.user;
  }
);
