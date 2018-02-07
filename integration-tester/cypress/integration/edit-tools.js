describe('Edit Tools', () => {
  it('shows the edit tools', () => {
    cy.visit('http://127.0.0.1:3000');

    cy.get('#edit-tools').click();

    cy.get('a.leaflet-draw-draw-polygon');
    cy.get('a.leaflet-draw-draw-rectangle');
    cy.get('a.leaflet-draw-draw-marker');

    cy.get('#default').click();

  })
});
