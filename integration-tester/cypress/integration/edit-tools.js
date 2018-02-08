describe('Edit Tools', () => {
  it('shows the edit tools', () => {
    cy.visit('http://127.0.0.1:3000');

    cy.get('#edit-tools').click();

    cy.get('a.leaflet-draw-draw-polygon');
    cy.get('a.leaflet-draw-draw-rectangle');
    cy.get('a.leaflet-draw-draw-marker');

    cy.get('#default').click();

  });

  it('can draw a poly', () => {
    cy.get('#edit-tools').click();

    cy.get('.leaflet-draw-draw-polygon').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true})
      .trigger('mousemove', 375, 330)
      .click(375, 330, {bubbles: true})
      .trigger('mousemove', 300, 320)
      .click(300, 320, {bubbles: true})
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true});

    cy.get('path.leaflet-interactive').should('have.length', 1);
    cy.get('#default').click();
  });

  it('can remove a poly', () => {
    cy.get('#poly-edit').click();

    cy.get('a.leaflet-draw-edit-remove').click();

    cy.get('.leaflet-container')
      .trigger('mouseover', 'center');

    cy.get('.leaflet-tooltip').should('contain', 'CLICK TO DELETE');
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(390, 160, {bubbles: true});

    cy.get('path.leaflet-interactive').should('have.length', 0);
    cy.get('#default').click();
  });

  it('can remove a drawn poly', () => {
    cy.get('#edit-tools').click();

    cy.get('.leaflet-draw-draw-polygon').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true})
      .trigger('mousemove', 375, 330)
      .click(375, 330, {bubbles: true})
      .trigger('mousemove', 300, 320)
      .click(300, 320, {bubbles: true})
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true});

    cy.get('path.leaflet-interactive').should('have.length', 1);
    cy.get('a.leaflet-draw-edit-remove').click();
    cy.get('path.leaflet-interactive').click();
    cy.get('path.leaflet-interactive').should('have.length', 0);
    cy.get('#default').click();
  });
});
