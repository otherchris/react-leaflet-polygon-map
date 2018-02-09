describe('Zoom', () => {
  it('starts zoomed to shapes (poly)', () => {
    // polys
    cy.visit('127.0.0.1:3000');
    cy.wait(500);
    cy.get('#poly-edit').click('center');
    cy.get('img[src*="m&x=192&y=401&z=10"]');
  });

  it('starts zoomed to shapes (poly and points)', () => {
    // points
    cy.visit('127.0.0.1:3000');
    cy.get('#points').click('center');
    cy.get('img[src*="m&x=1071&y=1577&z=12"]');
  });

  it('starts zoomed to shapes (single point)', () => {
    // points
    cy.visit('127.0.0.1:3000');
    cy.get('#single-point').click('center');
    cy.get('button').contains('Zoom');
    cy.get('img[src*="m&x=61285&y=101025&z=18"]');
  });

  it('provided center overrides inital zoom', () => {
    cy.visit('127.0.0.1:3000');
    cy.wait(500);
    cy.get('#poly-with-center').click();
    cy.get('img[src*="m&x=192&y=401&z=10"]').should('have.length', 0);
    cy.get('img[src*="x=137&y=202&z=9"]').should('have.length', 1);
  });

});
