describe('onShapeChange', () => {
  it('reports the current state on load', () => {
    cy.visit('127.0.0.1:3000');
    cy.get('div.lms').should('contain', '38.257222');
  });
  it('reports the current state adding a poly by edit', () => {
    cy.visit('127.0.0.1:3000');
    cy.get('div.lms').should('contain', '"features": []');

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
  });
  it('reports the current state adding a point by edit', () => {
  });
  it('reports the current state adding a rectangle by edit', () => {
  });
  it('reports the current state adding a poly by props', () => {
  });
  it('reports the current state adding a point by props', () => {
  });
  it('reports the current state adding a rectangle by props', () => {
  });
  it('reports the current state removing a poly', () => {
  });
  it('reports the current state removing a point', () => {
  });
  it('reports the current state removing a rectangle', () => {
  });
  it('reports the current state removing all shapes', () => {
  });
});
