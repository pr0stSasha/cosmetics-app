import { SurveyForm } from "../features/survey/SurveyForm";
import { useAppSelector } from "../app/hooks";

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Временные стили прямо здесь, чтобы 100% заработало
  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    fontFamily: 'sans-serif',
    backgroundColor: '#fffafb',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  };

  return (
    <div style={containerStyle}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', fontSize: '2rem' }}>Личный кабинет</h1>
        <p style={{ color: '#e8a0bf' }}>Аккаунт: {user?.email || 'Гость'}</p>
      </header>

      <section>
        {/* Здесь наш новый опрос */}
        <SurveyForm />
      </section>
    </div>
  );
};

export default ProfilePage;