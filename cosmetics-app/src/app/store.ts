import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import surveyReducer from '../features/survey/surveySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    survey: surveyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
