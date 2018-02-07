describe('Points', () => {
  it('displays points', () => {
    cy.visit('localhost:3000');

    cy.get('#points').click();

    cy.get('body').find('circle').should('have.length', 2);
    cy.get('button.zoom-button');
  });

  it('provides tools', () => {
    cy.get('#edit-tools').click();

    cy.get('a.leaflet-draw-draw-marker').click();

    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true});
    cy.get('div.map-circle-approx');
  });

  it('creates a circle centered at a provided point', () => {
    cy.get('input.rw-widget-input.rw-input').clear().type('0.2');
    cy.get('button.btn-primary.save.btn').contains('Create Circle').click();
    cy.get('path.leaflet-interactive').should('have.length', 1);
    cy.get('div').filter('.map-circle-approx').should('have.length', 0);

    // Close dialog without making circle
    cy.get('a.leaflet-draw-draw-marker').click();

    cy.get('.leaflet-container')
      .trigger('mousemove', 95, 160)
      .click(95, 160, {bubbles: true});
    cy.get('div.map-circle-approx');
    cy.get('button.btn-primary.save.btn').contains('x').click();
    cy.get('div').filter('.map-circle-approx').should('have.length', 0);
  });
});
