import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header'; 
import authReducer from '../../features/auth/authSlice';

const createMockStore = (isAdmin: boolean) => configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: { 
        id: '1', 
        username: 'Alya', 
        isAdmin: isAdmin 
      },
      loading: false,
      error: null,
      status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed'
    }
  }
});

type StoryArgs = { isAdmin: boolean };

const meta: Meta<StoryArgs> = {
  title: 'Components/Header',
  component: Header as any,
  decorators: [
    (Story, context) => {
      const store = createMockStore(context.args.isAdmin);
      return (
        <Provider store={store}>
          <BrowserRouter>
            <div style={{ padding: '10px', background: '#fff' }}><Story /></div>
          </BrowserRouter>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const UserView: Story = {
  args: { isAdmin: false },
};

export const AdminView: Story = {
  args: { isAdmin: true },
};