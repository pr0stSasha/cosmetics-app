import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { fetchProducts, removeProduct, saveProduct } from '../features/products/productsSlice';
import type { Product } from '../types';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status } = useSelector((state: RootState) => state.products);

  const [form, setForm] = useState<Partial<Product>>({ name: '', price: 0, category_type: 'care' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveProduct({ ...form, id: editingId || undefined }));
    setForm({ name: '', price: 0, category_type: 'care' });
    setEditingId(null);
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Админ-панель ✨</h1>
      
      <div style={layoutStyle}>
        {/* Блок формы */}
        <div style={formCardStyle}>
          <h2 style={formTitleStyle}>{editingId ? 'Редактировать товар' : 'Новый товар'}</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputWrapper}>
              <label style={labelStyle}>Название</label>
              <input 
                style={selectStyle}
                value={form.name || ''} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required
              />
            </div>
            <div style={inputWrapper}>
              <label style={labelStyle}>Цена</label>
              <input 
                type="number"
                style={selectStyle}
                value={form.price || 0} 
                onChange={e => setForm({...form, price: Number(e.target.value)})} 
                required
              />
            </div>
            <button type="submit" style={saveBtnStyle}>
              {status === 'loading' ? 'Сохранение...' : 'Сохранить'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setForm({ name: '', price: 0 }); }} 
                style={cancelBtnStyle}
              >
                Отмена
              </button>
            )}
          </form>
        </div>

        {/* Блок списка */}
        <div style={listSectionStyle}>
          <div style={scrollArea}>
            {status === 'loading' && products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#db7093' }}>Загрузка товаров...</div>
            ) : (
              <div style={listStyle}>
                {products.map(p => (
                  <div key={p.id} style={itemStyle}>
                    <div style={itemNameStyle}>{p.name}</div>
                    <div style={itemMetaStyle}>{p.price} ₽</div>
                    <div style={actionBtn}>
                      <button 
                        onClick={() => { setForm(p); setEditingId(p.id); }} 
                        style={smallBtnStyle}
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => dispatch(removeProduct(p.id))} 
                        style={smallBtnStyle}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- СТИЛИ ---
const containerStyle: React.CSSProperties = { padding: '40px', background: '#fffbfb', minHeight: '100vh' };
const titleStyle: React.CSSProperties = { color: '#db7093', marginBottom: '30px', fontFamily: 'serif' };
const layoutStyle: React.CSSProperties = { display: 'flex', gap: '30px', flexWrap: 'wrap' };
const formCardStyle: React.CSSProperties = { flex: 1, minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const formTitleStyle: React.CSSProperties = { fontSize: '18px', marginBottom: '15px' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const inputWrapper: React.CSSProperties = { marginBottom: '10px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', color: '#888', marginBottom: '5px' };
const selectStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #eee' };
const saveBtnStyle: React.CSSProperties = { background: '#db7093', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle: React.CSSProperties = { background: '#f0f0f0', color: '#666', border: 'none', padding: '12px', borderRadius: '10px', marginTop: '5px', cursor: 'pointer' };
const listSectionStyle: React.CSSProperties = { flex: 1.5, minWidth: '350px' };
const scrollArea: React.CSSProperties = { maxHeight: '70vh', overflowY: 'auto' };
const listStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' };
const itemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', background: '#fff', padding: '15px', borderRadius: '15px', border: '1px solid #f9f9f9' };
const itemNameStyle: React.CSSProperties = { flex: 2, fontWeight: 'bold' };
const itemMetaStyle: React.CSSProperties = { flex: 1, color: '#db7093' };
const actionBtn: React.CSSProperties = { display: 'flex', gap: '5px' };
const smallBtnStyle: React.CSSProperties = { padding: '5px 10px', cursor: 'pointer', borderRadius: '5px', border: '1px solid #eee', background: '#fff' };

export default AdminPage;