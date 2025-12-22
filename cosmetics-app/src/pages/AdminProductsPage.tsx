import { productsDB, type Product } from '../data/products'; // Импортируем базу и тип

const AdminProductsPage = () => {
  // Вместо useAppSelector пока используем нашу локальную БД напрямую
  const products = productsDB; 

  return (
    <div style={{ padding: '20px' }}>
      <h1>Управление товарами (Админ)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th>Название</th>
            <th>Цена</th>
            <th>Категория</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: Product) => ( // Указываем тип Product для p
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{p.name}</td>
              <td>{p.price} ₽</td>
              <td>{p.category}</td>
              <td>
                <button style={{ color: 'red', cursor: 'pointer' }}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ marginTop: '20px', padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Добавить новый товар
      </button>
    </div>
  );
};

export default AdminProductsPage;