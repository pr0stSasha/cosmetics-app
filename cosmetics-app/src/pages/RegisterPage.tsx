import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerUser } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return <Navigate to="/profile" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{loading ? 'Loading...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default RegisterPage;
