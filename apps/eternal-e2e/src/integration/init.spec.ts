describe('Some Tests', () => {
  it.skip('should rename Latitia to Laetitia', () => {
    cy.visit('');
    cy.get('[data-testid="btn-customers"]').click();
    cy.get('[data-testid=row-customer]').contains('Latitia Bellitissa').siblings('.edit').click();
    cy.get('[data-testid="inp-firstname"]').clear().type('Laetitia');
    cy.get('[data-testid="btn-submit"]').click();
    cy.get('[data-testid=row-customer]').should('contain.text', 'Laetitia Bellitissa');
  });

  it('should go to holidays', () => {
    cy.intercept('GET', '/holiday').as('holidayRequest');
    cy.visit('');
    cy.get('[data-testid="btn-holidays"]').click();
    cy.wait('@holidayRequest');
  });
});
