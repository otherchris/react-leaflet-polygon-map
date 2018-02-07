describe('Polygons', () => {
  it('displays polygons', () => {
    cy.visit('localhost:3000');

    cy.get('#large-poly').click();

    cy.get('body').find('path.leaflet-interactive').should('have.length', 1)

    // Edit mode
    cy.get('#poly-edit').click();
    cy.get('button.zoom-button').click();

    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(390, 160, {bubbles: true});
    cy.wait(2000);
  });
});
