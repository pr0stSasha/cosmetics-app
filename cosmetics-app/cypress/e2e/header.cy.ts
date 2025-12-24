describe('Главный сценарий: Вход и работа с контентом', () => {
  const login = 'саша';
  const pass = 'нуриирун';

  it('Должен войти, настроить фильтры и проверить избранное', () => {
    cy.visit('/auth');
    cy.get('input[placeholder="sasha_beauty"]').type(login);
    cy.get('input[placeholder="••••••••"]').type(pass);
    cy.get('button').contains('Войти').click();

    cy.contains('Профиль').click();
    cy.url().should('include', '/profile');
    
    cy.get('select').first().select('normal');
    cy.get('select').last().select('medium');
    cy.contains('Сохранить изменения').click();
    cy.wait(1000);

    cy.contains('Рекомендации').click();
    
    cy.get('button').contains('🤍').first().click({ force: true });

    cy.contains('Избранное').click();
    cy.url().should('include', '/favorites');
    
    cy.get('button').contains('💔').should('be.visible');

    cy.get('button').contains('💔').first().click();
    cy.contains('Тут пока пусто').should('be.visible');
  });
});