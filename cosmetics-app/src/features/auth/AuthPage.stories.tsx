import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AuthPage from '../../pages/AuthPage'; 
import authReducer from './authSlice';

const store = configureStore({
  reducer: { auth: authReducer }
});

const meta: Meta<typeof AuthPage> = {
  title: 'Pages/AuthPage',
  component: AuthPage,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Story />
          </div>
        </BrowserRouter>
      </Provider>
    ),
  ],
};

export default meta;
export const Default: StoryObj<typeof AuthPage> = {};