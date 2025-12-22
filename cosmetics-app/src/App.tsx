import AppRouter from "./router/AppRouter"; 
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRouter />
      </Layout>
    </BrowserRouter>
  );
}

export default App;