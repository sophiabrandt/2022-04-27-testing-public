it('should do a multi-domain test', () => {
  cy.visit('/');
  cy.origin('www.orf.at', () => {
    cy.visit('www.orf.at');
    cy.title().should('contain', 'ORF');
  });
  cy.visit('/');
  cy.contains('a', 'Customers').click();
});
