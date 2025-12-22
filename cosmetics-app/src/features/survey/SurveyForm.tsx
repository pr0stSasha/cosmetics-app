import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPreference } from './surveySlice';

export const SurveyForm = () => {
  const dispatch = useAppDispatch();
  const { skinType, colorType } = useAppSelector((state) => state.survey);

  const options = {
    skinType: ['Жирная', 'Сухая', 'Комбинированная', 'Все'],
    colorType: ['Зима', 'Весна', 'Лето', 'Осень']
  };

  const handleSelect = (field: 'skinType' | 'colorType', value: string) => {
    dispatch(setPreference({ field, value }));
  };

  return (
    <div>
      <h3>Настройка рекомендаций</h3>
      <div style={{ marginBottom: '20px' }}>
        <p>Ваш тип кожи: <strong>{skinType}</strong></p>
        {options.skinType.map(type => (
          <button key={type} onClick={() => handleSelect('skinType', type)}>
            {type}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <p>Ваш цветотип: <strong>{colorType}</strong></p>
        {options.colorType.map(type => (
          <button key={type} onClick={() => handleSelect('colorType', type)}>
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};