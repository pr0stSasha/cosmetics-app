import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import type { Product } from '../types';

const skinOptions = [
  { id: 'dry', label: 'Сухая' },
  { id: 'oily', label: 'Жирная' },
  { id: 'combination', label: 'Комбинированная' },
  { id: 'normal', label: 'Нормальная' },
];

const AdminPage: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [catType, setCatType] = useState('care');
  const [segment, setSegment] = useState('medium');
  const [selectedSkins, setSelectedSkins] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  // Используем useCallback, чтобы избежать лишних рендеров и ошибок ESLint
  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Ошибка при получении товаров:", error.message);
    } else if (data) {
      setProducts(data as Product[]);
    }
  }, []);

  useEffect(() => {
  const loadData = async () => {
    await fetchProducts();
  };
  loadData();
}, [fetchProducts]);

  const handleSkinChange = (skinId: string) => {
    setSelectedSkins(prev => 
      prev.includes(skinId) ? prev.filter(s => s !== skinId) : [...prev, skinId]
    );
  };

  const isAllSelected = selectedSkins.length === skinOptions.length;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedSkins([]);
    else setSelectedSkins(skinOptions.map(s => s.id));
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setImgUrl(product.image_url);
    setCatType(product.category_type || 'care');
    setSegment(product.budget_segment || 'medium');
    setSelectedSkins(product.skin_type || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setName(''); setPrice(''); setImgUrl(''); 
    setSelectedSkins([]); setStatus('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Сохранение...');

    const productData = {
      name,
      price: Number(price),
      image_url: imgUrl,
      skin_type: catType === 'decor' ? skinOptions.map(s => s.id) : selectedSkins,
      budget_segment: segment,
      category_type: catType
    };

    let error;
    if (editingId) {
      const { error: updateError } = await supabase.from('products').update(productData).eq('id', editingId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('products').insert([productData]);
      error = insertError;
    }

    if (error) {
      setStatus('Ошибка: ' + error.message);
    } else {
      setStatus(editingId ? 'Успешно обновлено ✨' : 'Товар добавлен ✨');
      setTimeout(() => setStatus(''), 3000);
      resetForm();
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Удалить этот товар из базы?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
    else console.error("Ошибка удаления:", error.message);
  };

  return (
    <div style={containerStyle}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={titleStyle}>Панель управления</h1>
        <p style={{ color: '#888' }}>Добавление и редактирование ассортимента maimei</p>
      </header>

      <div style={layoutStyle}>
        <section style={formCardStyle}>
          <h2 style={formTitleStyle}>
            {editingId ? 'Редактировать товар' : 'Добавить продукт'}
          </h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputWrapper}>
              <label style={labelStyle}>Название средства</label>
              <input value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Название" />
            </div>

            <div style={rowStyle}>
              <div style={inputWrapper}>
                <label style={labelStyle}>Цена (₽)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required style={inputStyle} />
              </div>
              <div style={inputWrapper}>
                <label style={labelStyle}>Тип</label>
                <select value={catType} onChange={e => setCatType(e.target.value)} style={selectStyle}>
                  <option value="care">Уход</option>
                  <option value="decor">Декор</option>
                </select>
              </div>
            </div>

            <div style={inputWrapper}>
              <label style={labelStyle}>URL изображения</label>
              <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} required style={inputStyle} />
            </div>

            <div style={inputWrapper}>
              <label style={labelStyle}>Ценовой сегмент</label>
              <select value={segment} onChange={e => setSegment(e.target.value)} style={selectStyle}>
                <option value="budget">Бюджет</option>
                <option value="medium">Масс-маркет</option>
                <option value="luxury">Люкс</option>
              </select>
            </div>

            {catType === 'care' && (
              <div style={skinBoxStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Типы кожи</span>
                  <button type="button" onClick={toggleSelectAll} style={smallBtnStyle}>
                    {isAllSelected ? 'Сбросить' : 'Выбрать все'}
                  </button>
                </div>
                <div style={skinGrid}>
                  {skinOptions.map(skin => (
                    <label key={skin.id} style={checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={selectedSkins.includes(skin.id)} 
                        onChange={() => handleSkinChange(skin.id)}
                        style={{ accentColor: '#db7093' }}
                      /> 
                      {skin.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" style={saveBtnStyle}>
                {editingId ? 'Обновить данные' : 'Создать карточку'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={cancelBtnStyle}>Отмена</button>
              )}
            </div>
          </form>
          {status && <div style={statusBanner}>{status}</div>}
        </section>

        <section style={listSectionStyle}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>В каталоге: {products.length}</h3>
          <div style={scrollArea}>
            {products.map(p => (
              <div key={p.id} style={itemStyle}>
                <img src={p.image_url} alt="" style={thumbStyle} />
                <div style={{ flex: 1 }}>
                  <div style={itemNameStyle}>{p.name}</div>
                  <div style={itemMetaStyle}>{p.price} ₽ • {p.category_type === 'care' ? 'Уход' : 'Декор'}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => startEdit(p)} style={actionBtn}>✏️</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ ...actionBtn, color: '#ff4d4f' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Дизайн-система maimei Admin ---

const containerStyle: React.CSSProperties = { 
  maxWidth: '1100px', 
  margin: '0 auto', 
  padding: '40px 20px' 
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '32px',
  color: '#db7093',
  marginBottom: '5px'
};

const layoutStyle: React.CSSProperties = { 
  display: 'grid', 
  gridTemplateColumns: '1.2fr 1fr', 
  gap: '40px',
  alignItems: 'start'
};

const formCardStyle: React.CSSProperties = { 
  background: '#fff', 
  padding: '35px', 
  borderRadius: '35px', 
  boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
  border: '1px solid #fdf2f6'
};

const formTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  marginBottom: '25px',
  color: '#333',
  fontWeight: '600'
};

const formStyle: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '18px' 
};

const inputWrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#999',
  marginLeft: '5px'
};

const inputStyle: React.CSSProperties = { 
  padding: '14px 18px', 
  borderRadius: '16px', 
  border: '1px solid #eee', 
  background: '#fafafa',
  outline: 'none',
  fontSize: '14px'
};

const selectStyle: React.CSSProperties = { 
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer'
};

const rowStyle: React.CSSProperties = { 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '15px' 
};

const skinBoxStyle: React.CSSProperties = { 
  background: '#fff9fb', 
  padding: '20px', 
  borderRadius: '20px',
  border: '1px dashed #ffafbd'
};

const skinGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px'
};

const checkboxLabel: React.CSSProperties = {
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer'
};

const saveBtnStyle: React.CSSProperties = { 
  flex: 2, 
  padding: '15px', 
  background: 'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '18px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  boxShadow: '0 10px 20px rgba(255, 175, 189, 0.2)'
};

const cancelBtnStyle: React.CSSProperties = { 
  flex: 1, 
  background: '#f5f5f5', 
  color: '#666', 
  border: 'none', 
  borderRadius: '18px', 
  cursor: 'pointer',
  fontWeight: '600'
};

const listSectionStyle: React.CSSProperties = {
  maxHeight: '800px',
  display: 'flex',
  flexDirection: 'column'
};

const scrollArea: React.CSSProperties = {
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingRight: '10px'
};

const itemStyle: React.CSSProperties = { 
  display: 'flex', 
  alignItems: 'center', 
  gap: '15px', 
  padding: '15px', 
  background: '#fff', 
  borderRadius: '22px', 
  border: '1px solid #f0f0f0',
  transition: 'all 0.2s ease'
};

const itemNameStyle: React.CSSProperties = { fontWeight: '600', fontSize: '15px', color: '#333' };
const itemMetaStyle: React.CSSProperties = { fontSize: '12px', color: '#aaa', marginTop: '3px' };

const thumbStyle: React.CSSProperties = { 
  width: '50px', 
  height: '50px', 
  borderRadius: '12px', 
  objectFit: 'cover',
  background: '#fdf2f6'
};

const actionBtn: React.CSSProperties = { 
  background: '#fdf2f6', 
  border: 'none', 
  width: '35px', 
  height: '35px', 
  borderRadius: '10px', 
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const smallBtnStyle: React.CSSProperties = { 
  background: 'none', 
  border: '1px solid #db7093', 
  color: '#db7093', 
  borderRadius: '10px', 
  fontSize: '11px', 
  cursor: 'pointer', 
  padding: '4px 12px',
  fontWeight: '600'
};

const statusBanner: React.CSSProperties = {
  marginTop: '15px',
  padding: '10px',
  borderRadius: '12px',
  background: '#f6ffed',
  border: '1px solid #b7eb8f',
  color: '#52c41a',
  textAlign: 'center',
  fontSize: '13px'
};

export default AdminPage;