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

// Импорт стилей
import s from '../features/admin/Admin.module.css';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.products);

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

  if (loading) return <div className={s.loading}>✨ Загрузка базы данных...</div>;

  return (
    <div className={s.adminContainer}>
      <h2 className={s.header}>Панель администратора 🛠️</h2>

      <div className={s.formCard}>
        <h3 style={{ marginTop: 0 }}>
          {isEditing ? `Редактирование: ${form.name}` : 'Добавить новый продукт'}
        </h3>
        
        <div className={s.gridInputs}>
          <div className={s.inputWrapper}>
            <label className={s.label}>Название</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={s.input} />
          </div>
          <div className={s.inputWrapper}>
            <label className={s.label}>Ссылка на товар</label>
            <input value={form.product_url} onChange={e => setForm({...form, product_url: e.target.value})} className={s.input} />
          </div>
          <div className={s.inputWrapper}>
            <label className={s.label}>Цена (₽)</label>
            <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} className={s.input} />
          </div>
          <div className={s.inputWrapper}>
            <label className={s.label}>URL изображения</label>
            <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className={s.input} />
          </div>
          <div className={s.inputWrapper}>
            <label className={s.label}>Категория</label>
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
              className={s.input}
            >
              <option value="care">Уход</option>
              <option value="makeup">Макияж</option>
            </select>
          </div>
          <div className={s.inputWrapper}>
            <label className={s.label}>Бюджет</label>
            <select 
              value={form.budget_segment} 
              onChange={e => setForm({...form, budget_segment: e.target.value as 'budget' | 'medium' | 'luxury'})} 
              className={s.input}
            >
              <option value="budget">Бюджетный</option>
              <option value="medium">Миддл-маркет</option>
              <option value="luxury">Люкс</option>
            </select>
          </div>
        </div>

        {form.category_type !== 'makeup' && (
          <div className={s.skinTypeSection}>
            <label style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Для какой кожи подходит:</label>
            <div className={s.checkboxGroup}>
              {skinTypes.map(type => (
                <label key={type.id} className={s.checkboxLabel}>
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

        <div className={s.buttonGroup}>
          <button onClick={handleSave} className={isEditing ? s.updateBtn : s.addBtn}>
            {isEditing ? 'Сохранить изменения' : 'Добавить товар'}
          </button>
          {isEditing && (
            <button onClick={cancelEdit} className={s.cancelBtn}>Отмена</button>
          )}
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr className={s.tr}>
              <th className={s.th}>Фото</th>
              <th className={s.th}>Название</th>
              <th className={s.th}>Ссылка</th>
              <th className={s.th}>Цена</th>
              <th className={s.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: Product) => (
              <tr key={p.id} className={s.tr}>
                <td className={s.td} data-label="Фото"><img src={p.image_url} alt="" className={s.imgThumb} /></td>
                <td className={s.td} data-label="Название"><strong>{p.name}</strong></td>
                <td className={s.td} data-label="Ссылка">{p.product_url}</td>
                <td className={s.td} data-label="Цена">{p.price} ₽</td>
                <td className={s.td} data-label="Действия">
                  <button onClick={() => startEdit(p)} className={s.editBtn}>Ред.</button>
                  <button onClick={() => dispatch(deleteProduct(p.id))} className={s.deleteBtn}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;