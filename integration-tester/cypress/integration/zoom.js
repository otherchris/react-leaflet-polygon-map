describe('Zoom', () => {
  it('starts zoomed to shapes', () => {
    cy.visit('localhost:3000');
    cy.wait(500)
    cy.get('#large-poly').click('center');
    cy.get('img[src*="m&x=192&y=401&z=10"]');
  });

  it('provided center overrides inital zoom', () => {
    cy.get('#default').click('center');
    cy.get('#poly-with-center').click();
    cy.get('img[src*="m&x=192&y=401&z=10"]').should('have.length', 0);
    cy.get('img[src*="x=137&y=202&z=9"]').should('have.length', 1);
  });
});
