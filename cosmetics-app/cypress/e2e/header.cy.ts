describe('Тестирование регистрации и навигации', () => {
  const uniqueUser = `user_${Date.now()}`;

  beforeEach(() => {
    cy.visit('/auth');
    cy.contains('Создать профиль').click();

    cy.get('input').eq(0).type(uniqueUser);
    cy.get('input').eq(1).type('TestPass123!');

    cy.get('button').contains('Создать').click();

    cy.url().should('not.include', '/auth');
  });

  it('После регистрации Header должен быть доступен и работать', () => {
    cy.get('nav').should('be.visible');
    cy.contains('Избранное').click();
    cy.url().should('include', '/favorites');

    cy.contains('Профиль').click();
    cy.url().should('include', '/profile');
  });
});