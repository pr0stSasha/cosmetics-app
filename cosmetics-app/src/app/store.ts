import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import surveyReducer from '../features/survey/surveySlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import productsReducer from '../features/products/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    survey: surveyReducer,
    favorites: favoritesReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;