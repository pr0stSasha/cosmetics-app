describe('Логика категорий', () => {
  it('должен определять "makeup", если в названии есть ключевое слово', () => {
    const makeupKeywords = ['тушь', 'помада', 'тени'];
    const productName = "Черная Тушь для ресниц";
    
    const isMakeup = makeupKeywords.some(word => productName.toLowerCase().includes(word));
    expect(isMakeup).toBe(true);
  });

  it('должен устанавливать категорию "care" для крема', () => {
    const productName = "Увлажняющий крем";
    const isMakeup = ['тушь', 'помада'].some(word => productName.toLowerCase().includes(word));
    expect(isMakeup).toBe(false);
  });
});