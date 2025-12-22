import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  if (!user) return <p>Please login</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {user.isAdmin && <Link to="/admin/products">Go to Admin Products</Link>}
      <Link to="/favorites">Favorites</Link>
      <Link to="/recommendations">Recommendations</Link>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default ProfilePage;
