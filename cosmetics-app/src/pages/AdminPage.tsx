import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, deleteProduct, updateProduct } from '../features/products/productsSlice';
import type { RootState, AppDispatch } from '../app/store';
import type { Product } from '../types';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);

  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', brand: '', price: 0, category_type: 'care', 
    skin_type: [], budget_segment: 'medium', image_url: ''
  });

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const allSkins = ['normal', 'dry', 'oily', 'combination'];
  const isAllSelected = formData.skin_type?.length === allSkins.length;

  const handleSkinTypeToggle = (type: string) => {
    const current = formData.skin_type || [];
    const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    setFormData({ ...formData, skin_type: next });
  };

  const toggleAllSkins = () => {
    setFormData({ ...formData, skin_type: isAllSelected ? [] : allSkins });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Макияж всегда подходит всем типам кожи
    const finalData = formData.category_type === 'makeup' 
      ? { ...formData, skin_type: allSkins } 
      : formData;

    if (editId) {
      await dispatch(updateProduct({ ...finalData, id: editId } as Product));
    } else {
      await dispatch(addProduct(finalData));
    }
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: '', brand: '', price: 0, category_type: 'care', skin_type: [], budget_segment: 'medium', image_url: '' });
  };

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setFormData(p);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#db7093' }}>{editId ? '📝 Редактирование' : '➕ Добавить продукт'}</h2>
      
      <form onSubmit={handleSubmit} style={formGrid}>
        <input placeholder="Название" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
        <input placeholder="Бренд" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={inputStyle} required />
        <input placeholder="Цена" type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={inputStyle} required />
        <input placeholder="URL картинки" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={inputStyle} />
        
        <select 
          value={formData.category_type} 
          onChange={e => setFormData({...formData, category_type: e.target.value as 'care' | 'makeup'})} 
          style={inputStyle}
        >
          <option value="care">Уход (Care)</option>
          <option value="makeup">Макияж (Makeup)</option>
        </select>

        <select 
          value={formData.budget_segment} 
          onChange={e => setFormData({...formData, budget_segment: e.target.value as 'budget' | 'medium' | 'luxury'})} 
          style={inputStyle}
        >
          <option value="budget">Эконом</option>
          <option value="medium">Мидл</option>
          <option value="luxury">Люкс</option>
        </select>

        {formData.category_type === 'care' && (
          <div style={{ gridColumn: '1 / -1', padding: '15px', background: '#fdf2f6', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Типы кожи:</span>
              <button 
                type="button" 
                onClick={toggleAllSkins} 
                style={{
                  ...smallBtn, 
                  background: isAllSelected ? '#db7093' : '#fff',
                  color: isAllSelected ? '#fff' : '#db7093',
                  border: '1px solid #db7093'
                }}
              >
                {isAllSelected ? 'Снять всё' : 'Выделить все'}
              </button>
            </div>
            {allSkins.map(t => (
              <label key={t} style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.skin_type?.includes(t)} onChange={() => handleSkinTypeToggle(t)} /> {t}
              </label>
            ))}
          </div>
        )}

        <button type="submit" style={saveBtn}>{editId ? 'Обновить' : 'Создать'}</button>
        {editId && <button type="button" onClick={resetForm} style={cancelBtn}>Отмена</button>}
      </form>

      <div style={{ marginTop: '40px' }}>
        {products.map(p => (
          <div key={p.id} style={productRow}>
            <span><b>[{p.brand}]</b> {p.name} — {p.price}₽ <i>({p.category_type})</i></span>
            <div>
              <button onClick={() => startEdit(p)} style={editBtn}>✎</button>
              <button onClick={() => dispatch(deleteProduct(p.id))} style={delBtn}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '20px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #eee' };
const saveBtn = { background: '#db7093', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtn = { background: '#eee', color: '#666', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', marginLeft: '10px' };
const smallBtn = { borderRadius: '5px', padding: '2px 10px', fontSize: '12px', cursor: 'pointer', transition: '0.3s' };
const productRow = { display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', borderRadius: '12px', border: '1px solid #fdf2f6', marginBottom: '8px' };
const editBtn = { background: '#ffc3a0', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '5px' };
const delBtn = { background: '#ffafbd', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' };

export default AdminPage;