describe('Points', () => {
  it('displays points', () => {
    cy.visit('localhost:3000');

    cy.get('#points').click();

    cy.get('body').find('circle').should('have.length', 2);
  });

  it('provides tools', () => {
    cy.get('#edit-tools').click();

    cy.get('a.leaflet-draw-draw-marker').click();

    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true});
    cy.get('div.map-circle-approx');
  });
});
