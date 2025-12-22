import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    return <Navigate to="/profile" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{loading ? 'Loading...' : 'Login'}</button>
      </form>
    </div>
  );
};

export default LoginPage;
