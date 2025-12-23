import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { updateProfile } from '../features/auth/authSlice';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    skin_type: user?.skin_type || 'unknown',
    age: user?.age || 0
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      await dispatch(updateProfile({ id: user.id, ...formData }));
      alert('Данные сохранены! ✨');
    }
  };

  if (!user) return <div style={{ padding: '40px' }}>Войдите под своим ником</div>;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Привет, {user.username}! 🌸</h1>
      <div style={cardStyle}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={labelStyle}>Полное имя</label>
            <input 
              style={inputStyle}
              value={formData.full_name} 
              onChange={e => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          <div>
            <label style={labelStyle}>Возраст</label>
            <input 
              type="number"
              style={inputStyle}
              value={formData.age || ''} 
              onChange={e => setFormData({...formData, age: Number(e.target.value)})}
            />
          </div>
          <div>
            <label style={labelStyle}>Тип кожи</label>
            <select style={inputStyle} value={formData.skin_type} onChange={e => setFormData({...formData, skin_type: e.target.value})}>
              <option value="dry">Сухая</option>
              <option value="oily">Жирная</option>
              <option value="combined">Комбинированная</option>
              <option value="unknown">Не указано</option>
            </select>
          </div>
          <button type="submit" style={buttonStyle}>Сохранить</button>
        </form>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = { padding: '40px', maxWidth: '500px', margin: '0 auto' };
const titleStyle: React.CSSProperties = { color: '#db7093', textAlign: 'center', marginBottom: '20px' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: '#888', marginBottom: '5px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #eee' };
const buttonStyle: React.CSSProperties = { background: '#db7093', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };

export default ProfilePage;