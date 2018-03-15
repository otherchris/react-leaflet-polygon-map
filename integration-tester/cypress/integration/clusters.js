describe('Clusters', () => {

  it(`Given a large set of points,
  And clustering prop is false,
  When the map is displayed,
  Then points are not collected into clusters`, () => {
    cy.visit('localhost:3000');
    cy.get('#many-points-no-cluster').click();
    cy.get('div.marker-cluster').should('have.length', 0);
  });

  it(`Given a large set of points,
  And clustering prop is true,
  When the map is zoomed out,
  Then points are collected into clusters`, () => {
    cy.get('#many-points').click();
    cy.get('div.marker-cluster').its('length').should('be.greaterThan', 2)
  });
});
