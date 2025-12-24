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
import s from '../features/admin/Admin.module.css';

import OpenAI from 'openai';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.products);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const skinTypes = [
    { id: 'dry', label: 'Сухая' },
    { id: 'oily', label: 'Жирная' },
    { id: 'combination', label: 'Комбинированная' },
    { id: 'normal', label: 'Нормальная' },
    { id: 'sensitive', label: 'Чувствительная' }
  ];

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

  const handleAiFill = async () => {
  const query = form.name || form.product_url;
  if (!query) return alert("Введите название товара! ✨");
  
  setIsAiLoading(true);
  try {
    const openai = new OpenAI({
      apiKey: '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'.trim(), 
      dangerouslyAllowBrowser: true,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
        role: "system", 
          content: `Ты эксперт косметики. Твоя задача — вернуть JSON.
          ПРАВИЛА:
          1. price: СТРОГО В РУБЛЯХ. Если видишь цену  не в них, переведи в рубли.
          2. category_type: Если в запросе есть слова (тушь, помада, блеск, тени, пудра, румяна, тональный, mascara, lipstick, eyeshadow) — СТРОГО "makeup". Иначе "care"
          4. budget_segment: "budget", "medium" или "luxury". Определяй их исходя из цены и бренда.
          5. skin_type: массив из типов кожи: "dry", "oily", "combination", "normal", "sensitive". В случае типа "makeup" — возвращай все типы кожи.` 
        },
        { role: "user", content: `Товар: ${query}` }
      ],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    const res = JSON.parse(completion.choices[0].message.content || "{}");
    
    setForm(prev => ({
      ...prev,
      name: res.name || query,
      price: Number(res.price) || 1500,
      product_url: `https://www.google.com/search?q=${encodeURIComponent(res.name || query)}`,
      category_type: (res.category_type as 'care' | 'makeup') || "care",
      budget_segment: (res.budget_segment as 'budget' | 'medium' | 'luxury') || "medium",
      skin_type: res.skin_type || ['normal'],
      image_url: prev.image_url || `https://loremflickr.com/640/480/cosmetics,${encodeURIComponent(res.name || 'beauty')}`
    }));

  } catch (error) {
    console.error("AI Error:", error);
  } finally {
    setIsAiLoading(false);
  }
};

  const handleSkinTypeChange = (typeId: string) => {
    const currentTypes = form.skin_type || [];
    setForm({
      ...form,
      skin_type: currentTypes.includes(typeId) 
        ? currentTypes.filter(t => t !== typeId) 
        : [...currentTypes, typeId]
    });
  };

  const handleSave = () => {
    if (form.name && form.image_url) {
      if (isEditing && currentId) {
        dispatch(updateProduct({ ...form, id: currentId } as Product));
        setIsEditing(false);
        setCurrentId(null);
      } else {
        dispatch(addProduct(form as Omit<Product, 'id'>));
      }
      setForm(initialFormState);
    } else {
      alert("Минимум нужно название и фото!");
    }
  };

  const startEdit = (product: Product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setForm(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className={s.loading}>✨ Загрузка базы данных...</div>;

  return (
    <div className={s.adminContainer}>
      <h2 className={s.header}>Управление товарами 🛠️</h2>

      <div className={s.formCard}>
        <h3>{isEditing ? `Редактировать: ${form.name}` : 'Добавить новинку'}</h3>
        
        <div className={s.gridInputs}>
          <div className={s.inputWrapper} style={{ gridColumn: '1 / -1' }}>
            <label className={s.label}>Название (для ИИ)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                value={form.name || form.product_url} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className={s.input} 
                placeholder="Напр: Сыворотка The Ordinary"
              />
              <button onClick={handleAiFill} disabled={isAiLoading} className={s.aiBtn}>
                {isAiLoading ? '⌛ Поиск...' : 'Найти и заполнить ✨'}
              </button>
            </div>
          </div>

          <div className={s.inputWrapper}>
            <label className={s.label}>Цена (₽)</label>
            <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} className={s.input} />
          </div>

          <div className={s.inputWrapper}>
            <label className={s.label}>Категория</label>
            <select value={form.category_type} onChange={e => setForm({...form, category_type: e.target.value as 'care' | 'makeup'})} className={s.input}>
              <option value="care">Уход</option>
              <option value="makeup">Макияж</option>
            </select>
          </div>

          <div className={s.inputWrapper}>
            <label className={s.label}>Сегмент бюджета</label>
            <select value={form.budget_segment} onChange={e => setForm({...form, budget_segment: e.target.value as 'budget' | 'medium' | 'luxury'})} className={s.input}>
              <option value="budget">Бюджетный</option>
              <option value="medium">Миддл-маркет</option>
              <option value="luxury">Люкс</option>
            </select>
          </div>

          <div className={s.inputWrapper} style={{ gridColumn: '1 / -1' }}>
            <label className={s.label}>URL фото</label>
            <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className={s.input} />
          </div>
        </div>

        <div className={s.skinTypeSection} style={{ marginTop: '20px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Подходит для типов кожи:</label>
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

        <div className={s.buttonGroup} style={{ marginTop: '20px' }}>
          <button onClick={handleSave} className={isEditing ? s.updateBtn : s.addBtn}>
            {isEditing ? 'Обновить данные' : 'Добавить в каталог'}
          </button>
          {isEditing && <button onClick={() => { setIsEditing(false); setForm(initialFormState); }} className={s.cancelBtn}>Отмена</button>}
        </div>
      </div>

      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.th}>Фото</th>
              <th className={s.th}>Название</th>
              <th className={s.th}>Цена</th>
              <th className={s.th}>Категория</th>
              <th className={s.th}>Бюджет</th>
              <th className={s.th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p: Product) => (
              <tr key={p.id} className={s.tr}>
                <td className={s.td}><img src={p.image_url} alt="" className={s.imgThumb} style={{ width: '40px', borderRadius: '4px' }} /></td>
                <td className={s.td}><strong>{p.name}</strong></td>
                <td className={s.td}>{p.price} ₽</td>
                <td className={s.td}>{p.category_type === 'care' ? '🌿' : '💄'}</td>
                <td className={s.td}>{p.budget_segment}</td>
                <td className={s.td}>
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