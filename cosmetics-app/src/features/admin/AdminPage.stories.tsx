import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AdminPage from '../../pages/AdminPage';
import productsReducer from '../products/productsSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  preloadedState: {
    products: {
      items: [
        { 
          id: '1', 
          name: 'Сыворотка с витамином C', 
          product_url: 'https://example.com',
          price: 1200, 
          category_type: 'care' as 'care' | 'makeup', 
          budget_segment: 'medium' as 'budget' | 'medium' | 'luxury', 
          image_url: 'https://loremflickr.com/100/100/cosmetics',
          skin_type: ['normal', 'oily'] 
        },
      ],
      loading: false,
      error: null,
      recommendations: [], 
      favorites: []
    }
  }
});

const meta: Meta<typeof AdminPage> = {
  title: 'Pages/AdminPage',
  component: AdminPage,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div style={{ padding: '20px' }}><Story /></div>
      </Provider>
    ),
  ],
};

export default meta;
export const Default: StoryObj<typeof AdminPage> = {};