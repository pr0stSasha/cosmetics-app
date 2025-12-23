import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, 
  addProduct, 
  deleteProduct,
  updateProduct 
} from '../features/products/productsSlice';

import type { RootState, AppDispatch } from '../app/store';
import type { Product } from '../types';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.products);

  // Список типов кожи на русском (но в базу отправляем ключи, чтобы фильтры не сломались)
  const skinTypes = [
    { id: 'dry', label: 'Сухая' },
    { id: 'oily', label: 'Жирная' },
    { id: 'combination', label: 'Комбинированная' },
    { id: 'normal', label: 'Нормальная' },
    { id: 'sensitive', label: 'Чувствительная' }
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const initialFormState: Partial<Product> = {
    name: '',
    product_url: '',
    price: 0,
    category_type: 'care',
    budget_segment: 'medium',
    skin_type: [],
    image_url: ''
  };

  const [form, setForm] = useState<Partial<Product>>(initialFormState);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSkinTypeChange = (typeId: string) => {
    const currentTypes = form.skin_type || [];
    if (currentTypes.includes(typeId)) {
      setForm({ ...form, skin_type: currentTypes.filter(t => t !== typeId) });
    } else {
      setForm({ ...form, skin_type: [...currentTypes, typeId] });
    }
  };

  const startEdit = (product: Product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setForm(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentId(null);
    setForm(initialFormState);
  };

  const handleSave = () => {
    if (form.name && form.product_url && form.image_url) {
      if (isEditing && currentId) {
        dispatch(updateProduct({ ...form, id: currentId } as Product));
        setIsEditing(false);
        setCurrentId(null);
      } else {
        dispatch(addProduct(form as Omit<Product, 'id'>));
      }
      setForm(initialFormState);
    } else {
      alert("Пожалуйста, заполните основные поля.");
    }
  };

  if (loading) return <div style={loadingStyle}>✨ Загрузка базы данных...</div>;

  return (
    <div style={adminContainer}>
      <h2 style={headerStyle}>Панель администратора 🛠️</h2>

      <div style={formCard}>
        <h3 style={{ marginTop: 0 }}>
          {isEditing ? `Редактирование: ${form.name}` : 'Добавить новый продукт'}
        </h3>
        
        <div style={gridInputs}>
          <div style={inputWrapper}>
            <label style={labelStyle}>Название</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          </div>
          <div style={inputWrapper}>
            <label style={labelStyle}>Ссылка на товар</label>
            <input value={form.product_url} onChange={e => setForm({...form, product_url: e.target.value})} style={inputStyle} />
          </div>
          <div style={inputWrapper}>
            <label style={labelStyle}>Цена (₽)</label>
            <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} style={inputStyle} />
          </div>
          <div style={inputWrapper}>
            <label style={labelStyle}>URL изображения</label>
            <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} style={inputStyle} />
          </div>
          <div style={inputWrapper}>
            <label style={labelStyle}>Категория</label>
            <select 
              value={form.category_type} 
              onChange={e => {
                const val = e.target.value as 'care' | 'makeup';
                setForm({
                  ...form, 
                  category_type: val,
                  skin_type: val === 'makeup' ? skinTypes.map(s => s.id) : []
                });
              }} 
              style={inputStyle}
            >
              <option value="care">Уход</option>
              <option value="makeup">Макияж</option>
            </select>
          </div>
          <div style={inputWrapper}>
            <label style={labelStyle}>Бюджет</label>
            <select 
              value={form.budget_segment} 
              onChange={e => setForm({...form, budget_segment: e.target.value as 'budget' | 'medium' | 'luxury'})} 
              style={inputStyle}
            >
              <option value="budget">Бюджетный</option>
              <option value="medium">Мидл-маркет</option>
              <option value="luxury">Люкс</option>
            </select>
          </div>
        </div>

        {form.category_type !== 'makeup' && (
          <div style={skinTypeSection}>
            <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Для какой кожи подходит:</label>
            <div style={checkboxGroup}>
              {skinTypes.map(type => (
                <label key={type.id} style={checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={form.skin_type?.includes(type.id)} 
                    onChange={() => handleSkinTypeChange(type.id)}
                  /> {type.label}
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button onClick={handleSave} style={isEditing ? updateBtnStyle : addBtnStyle}>
            {isEditing ? 'Сохранить изменения' : 'Добавить товар'}
          </button>
          {isEditing && (
            <button onClick={cancelEdit} style={cancelBtnStyle}>Отмена</button>
          )}
        </div>
      </div>

      <div style={tableWrapper}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderRow}>
              <th style={thStyle}>Фото</th>
              <th style={thStyle}>Название</th>
              <th style={thStyle}>Ссылка на товар</th>
              <th style={thStyle}>Цена</th>
              <th style={thStyle}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: Product) => (
              <tr key={p.id} style={trStyle}>
                <td style={tdStyle}><img src={p.image_url} alt="" style={imgThumb} /></td>
                <td style={tdStyle}><strong>{p.name}</strong></td>
                <td style={tdStyle}>{p.product_url}</td>
                <td style={tdStyle}>{p.price} ₽</td>
                <td style={tdStyle}>
                  <button onClick={() => startEdit(p)} style={editLinkStyle}>Ред.</button>
                  <button onClick={() => dispatch(deleteProduct(p.id))} style={deleteLinkStyle}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- СТИЛИ ---
const adminContainer: React.CSSProperties = { padding: '40px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial, sans-serif' };
const headerStyle: React.CSSProperties = { color: '#db7093', textAlign: 'center', marginBottom: '30px' };
const formCard: React.CSSProperties = { background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' };
const gridInputs: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' };
const inputWrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle: React.CSSProperties = { fontSize: '13px', color: '#666', fontWeight: 'bold' };
const inputStyle: React.CSSProperties = { padding: '12px', borderRadius: '10px', border: '1px solid #eee', fontSize: '14px', outline: 'none' };
const skinTypeSection: React.CSSProperties = { marginTop: '25px', borderTop: '1px solid #f5f5f5', paddingTop: '20px' };
const checkboxGroup: React.CSSProperties = { display: 'flex', gap: '20px', flexWrap: 'wrap' };
const checkboxLabel: React.CSSProperties = { fontSize: '14px', cursor: 'pointer' };
const addBtnStyle: React.CSSProperties = { flex: 2, padding: '15px', background: '#db7093', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };
const updateBtnStyle: React.CSSProperties = { flex: 2, padding: '15px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: '15px', background: '#ccc', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };
const tableWrapper: React.CSSProperties = { marginTop: '50px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', background: '#fff' };
const tableHeaderRow: React.CSSProperties = { background: '#fdf2f5' };
const thStyle: React.CSSProperties = { padding: '15px', color: '#db7093', textAlign: 'left' };
const trStyle: React.CSSProperties = { borderBottom: '1px solid #f9f9f9' };
const tdStyle: React.CSSProperties = { padding: '15px', fontSize: '14px' };
const imgThumb: React.CSSProperties = { width: '40px', height: '40px', objectFit: 'contain' };
const editLinkStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginRight: '15px', fontWeight: 'bold' };
const deleteLinkStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold' };
const loadingStyle: React.CSSProperties = { textAlign: 'center', padding: '100px', color: '#db7093', fontSize: '18px' };

export default AdminPage;