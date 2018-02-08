describe('Polygons', () => {
  it('displays polygons', () => {
    cy.visit('localhost:3000');

    cy.get('#large-poly').click();

    cy.get('body').find('path.leaflet-interactive').should('have.length', 1)
    cy.get('#default').click();
  });

  it('shows a tool tip with area', () => {
    cy.get('#large-poly').click();
    cy.get('button.zoom-button').click();

    cy.get('path.leaflet-interactive').trigger('mouseover');
    cy.get('.leaflet-tooltip').should('contain', '340.1921 sq miles')
    cy.get('#default').click();
  });

  it('edits polygons', () => {
    cy.get('#poly-edit').click();
    cy.get('button.zoom-button').click();

    // Open poly for editing
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(390, 160, {bubbles: true});
    cy.get('.leaflet-container').find('div.leaflet-marker-draggable').should('have.length', 8);
    cy.get('body').should('contain', 'Click the polygon again to finish editing');

    // Draggable points


    // Close poly for editing
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(390, 160, {bubbles: true});
    cy.get('.leaflet-container').find('div.leaflet-marker-draggable').should('have.length', 0);
    cy.get('#default').click();
  });

  it('remove polys button', () => {
    cy.get('#polys-and-points').click();
    cy.get('button.btn-danger').contains('Remove all shapes').click();
    cy.get('body').find('path.leaflet-interactive').should('have.length', 0)
    cy.get('body').find('').should('have.length', 0)

  });
});
