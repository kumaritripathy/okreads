describe('When: Use the search feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to search books by title', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('form').submit();

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
  });

  it('Then: I should see search results as I am typing', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('form').onSearchBookChange();

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);

    cy.get('div').should('have.text', 'JavaScript');

    cy.get('div').should('have.text', 'Eric T Morrison');

    cy.get('div').should('have.text', 'O Reilly');

    cy.get('div').should('have.text', '5/10/2015');

    cy.get('div').should('have.text', 'JavaScript for web developers');

    cy.get('img')
      .eq(0)
      .invoke('attr', 'src')
      .then((src) => {
        cy.request(src).then((resp) => {
          cy.wrap(resp.status).should('eq', 200);
        });
      });
  });
});
