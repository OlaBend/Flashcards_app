describe('App Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:9000');
  });

  it('should add a new card', () => {
    cy.get('.cards-list').children().its('length').then(initialLength => {
      cy.contains('Add Card').click();
      cy.get('.edit-card-input').eq(0).type('New Card Front');
      cy.get('.edit-card-input').eq(1).type('New Card Back');
      cy.contains('Save').click();
      cy.get('.cards-list').children().should('have.length', initialLength + 1);
    });
  });

  it('should delete a card', () => {
    cy.get('.cards-list').children().its('length').then(initialLength => {
      cy.get('.card').first().within(() => {
        cy.get('button').contains('Delete').click();
      });
      cy.get('.cards-list').children().should('have.length', initialLength - 1);
    });
  });

  it('should update a card', () => {
    cy.get('.card').first().within(() => {
      cy.get('button').contains('Edit').click();
      cy.get('.edit-card-input').eq(0).clear().type('Updated Card Front');
      cy.get('.edit-card-input').eq(1).clear().type('Updated Card Back');
      cy.contains('Save').click();
    });
    cy.get('.card').first().should('contain', 'Updated Card Front');
    cy.get('.card').first().should('contain', 'Updated Card Back');
  });

  it('should start the quiz', () => {
    cy.contains('Start Quiz').click();
  });
});









