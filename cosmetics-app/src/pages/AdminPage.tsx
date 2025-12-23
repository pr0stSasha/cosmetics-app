import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminPage: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Загрузка...');

    const { error } = await supabase
      .from('products')
      .insert([{ 
        name: name, 
        price: parseFloat(price), 
        image_url: imageUrl 
      }]);

    if (error) {
      setStatus('❌ Ошибка: ' + error.message);
    } else {
      setStatus('✅ Товар успешно добавлен!');
      setName('');
      setPrice('');
      setImageUrl('');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#db7093', textAlign: 'center' }}>Панель управления 👑</h2>
        <form onSubmit={handleAddProduct} style={formStyle}>
          <input 
            placeholder="Название товара" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={inputStyle}
          />
          <input 
            type="number" 
            placeholder="Цена (руб)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
            style={inputStyle}
          />
          <input 
            placeholder="Ссылка на фото" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            style={inputStyle}
          />
          <button type="submit" style={btnStyle}>Добавить товар</button>
        </form>
        {status && <p style={{ textAlign: 'center', marginTop: '10px', color: '#db7093' }}>{status}</p>}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', padding: '50px' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '400px' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' };
const inputStyle: React.CSSProperties = { padding: '12px', borderRadius: '12px', border: '1px solid #eee' };
const btnStyle: React.CSSProperties = { padding: '12px', background: '#e8a0bf', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminPage;