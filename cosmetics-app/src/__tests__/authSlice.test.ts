import authReducer, { setUser, logout } from '../features/auth/authSlice';
import type { AppUser } from '../types/index';

type AuthState = ReturnType<typeof authReducer>;

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    status: 'idle' 
  };

  it('должен сохранять данные пользователя при setUser', () => {
    const mockUser: AppUser = {
      id: 'user-123',
      username: 'testuser',
      isAdmin: false
    };

    const state = authReducer(initialState, setUser(mockUser));

    expect(state.user?.username).toBe('testuser');
    expect(state.user?.id).toBe('user-123');
  });

  it('должен очищать данные при logout', () => {
    const loggedInState: AuthState = {
      user: { id: '1', username: 'admin', isAdmin: true },
      status: 'succeeded'
    };

    const state = authReducer(loggedInState, logout());

    expect(state.user).toBeNull();
  });
});