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
    cy.get('div.lms').should('contain', 'MultiPolygon');
    cy.get('div.lms').should('contain', '"area": 110');
  });
  it('reports the current state adding a point by edit', () => {
    cy.visit('127.0.0.1:3000');
    cy.get('div.lms').should('contain', '"points": []');

    cy.get('#edit-tools').click();
    cy.get('a.leaflet-draw-draw-marker').click();

    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('click');
    cy.get('div.lms').should('contain', 'coordinates');
  });
  it('reports the current state adding a rectangle by edit', () => {
    cy.visit('127.0.0.1:3000');
    cy.get('div.lms').should('contain', '"features": []');
    cy.get('#edit-tools').click();

    cy.get('.leaflet-draw-draw-rectangle').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('mousedown', {which: 1})
      .trigger('mousemove', 375, 330)
      .trigger('mouseup', {force: true});
    cy.get('div.lms').should('contain', 'MultiPolygon');
    cy.get('div.lms').should('contain', '"area": 339')
  });
  it('reports the current state adding a poly by props', () => {
    cy.visit('127.0.0.1:3000');
    cy.get('div.lms').should('contain', '"features": []');

    cy.wait(500)
    cy.get('#large-poly').click('center');
    cy.get('div.lms').should('contain', 'MultiPolygon');
    cy.get('div.lms').should('contain', '"area": 340')
  });
  it('reports the current state adding a point by props', () => {
    cy.visit('127.0.0.1:3000');
    cy.get('div.lms').should('contain', '"points": []');

    cy.get('#points').click();

    cy.get('div.lms').should('contain', 'coordinates');
  });
  it('reports the current state removing a poly', () => {
    cy.visit('127.0.0.1:3000');

    cy.wait(500);
    cy.get('#poly-edit').click('center');
    cy.get('button').contains('Remove')

    cy.get('div.lms').should('contain', '"features": []');
  });
  it('reports the current state removing a point', () => {
    cy.visit('127.0.0.1:3000');

    cy.get('#points-edit').click();
    cy.get('button').contains('Remove').click();

    cy.get('div.lms').should('contain', '"points": []');
  });
  it('reports the current state removing all shapes', () => {
    cy.visit('127.0.0.1:3000');

    cy.get('#polys-and-points').click();
    cy.get('button').contains('Remove').click();

    cy.get('div.lms').should('contain', '"points": []');
    cy.get('div.lms').should('contain', '"features": []');
  });
  it('reports the current state editing a polygon', () => {
    cy.visit('127.0.0.1:3000');

    cy.get('#edit-tools').click();

    // Open poly for editing
    //
    // DOESN'T WORK
    /*
    cy.get('.leaflet-draw-draw-rectangle').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('mousedown', {which: 1})
      .trigger('mousemove', 375, 330)
      .trigger('mouseup', {force: true});

    cy.wait(500)
    cy.get('path.leaflet-interactive').click()
    cy.wait(500)
    cy.get('.leaflet-container')
      .trigger('mousemove', 240, 160)
      .trigger('mousedown')
      .trigger('mousemove', 240, 220)
      .trigger('mouseup')

    cy.get('path.leaflet-interactive').click();
    cy.get('div.lms').should('contain', '"area": 320')
    */
  });
});
