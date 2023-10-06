describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });
});

it('Then: I should set the reading list state back to the previous state',()=>{
  cy.get('[data-testing="want_to_read_btn"]').click();

  cy.wait(4000);

  cy.contains('Undo').click();

  cy.get('[data-testing="reading-item"]').should('have.length',0);
})
