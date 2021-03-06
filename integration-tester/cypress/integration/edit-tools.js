describe('Edit Tools', () => {
  it('shows the edit tools', () => {
    cy.visit('http://127.0.0.1:3000');

    cy.get('#edit-tools').click();

    cy.get('a.leaflet-draw-draw-polygon');
    cy.get('a.leaflet-draw-draw-rectangle');
    cy.get('a.leaflet-draw-draw-marker');

    cy.get('#default').click();

  });

  it('can draw a free poly', () => {
    cy.visit('http://127.0.0.1:3000');
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
    cy.get('path.leaflet-interactive[fill=green]').should('have.length', 1);
    cy.get('#default').click();

  });

  it('can draw a rectangle', () => {
    cy.visit('http://127.0.0.1:3000');
    cy.get('#edit-tools').click();

    cy.get('.leaflet-draw-draw-rectangle').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('mousedown', {which: 1})
      .trigger('mousemove', 375, 330)
      .trigger('mouseup', {force: true});

    cy.get('path.leaflet-interactive').should('have.length', 1);
    cy.get('path.leaflet-interactive[fill=green]').should('have.length', 1);
    cy.get('#default').click();
  });

  it('can remove a poly', () => {
    cy.visit('http://127.0.0.1:3000');
    cy.wait(500)
    cy.get('#edit-tools').click('center');

    cy.get('.leaflet-draw-draw-rectangle').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('mousedown', {which: 1})
      .trigger('mousemove', 375, 330)
      .trigger('mouseup', {force: true});

    cy.get('a.leaflet-draw-edit-remove').click();
    cy.wait(500)

    cy.get('.leaflet-container')
      .trigger('click')

    cy.get('path.leaflet-interactive').should('have.length', 0);
    cy.get('#default').click();
  });

  it('can remove a drawn free poly', () => {
    cy.visit('http://127.0.0.1:3000');
    cy.get('#edit-tools').click();

    cy.get('.leaflet-draw-draw-polygon').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true})
      .trigger('mousemove', 375, 160)
      .click(375, 160, {bubbles: true})
      .trigger('mousemove', 375, 360)
      .click(375, 360, {bubbles: true})
      .trigger('mousemove', 90, 360)
      .click(90, 360, {bubbles: true})
      .trigger('mousemove', 90, 160)
      .click(90, 160, {bubbles: true});

    cy.get('path.leaflet-interactive').should('have.length', 1);
    cy.get('a.leaflet-draw-edit-remove').click();
    cy.wait(500);
    cy.get('path.leaflet-interactive').click('center');
    cy.get('path.leaflet-interactive').should('have.length', 0);
    cy.get('#default').click();
  });

  it('can remove a drawn rectangle', () => {
    cy.visit('http://127.0.0.1:3000');
    cy.get('#edit-tools').click();

    cy.get('.leaflet-draw-draw-rectangle').click();
    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('mousedown', {which: 1})
      .trigger('mousemove', 375, 330)
      .trigger('mouseup', {force: true});

    cy.get('path.leaflet-interactive').should('have.length', 1);
    cy.get('path.leaflet-interactive[fill=green]').should('have.length', 1);

    cy.get('a.leaflet-draw-edit-remove').click();
    cy.wait(500);
    cy.get('path.leaflet-interactive').click();
    cy.get('path.leaflet-interactive').should('have.length', 0);
    cy.get('#default').click();
  });

  it('can draw a point', () => {
    cy.visit('http://127.0.0.1:3000');

    cy.get('#edit-tools').click();
    cy.get('a.leaflet-draw-draw-marker').click();

    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('click');

    cy.get('circle').should('have.length', 1);
  });

  it('can remove a drawn point', () => {
    cy.visit('http://127.0.0.1:3000');

    cy.get('#edit-tools').click();
    cy.get('a.leaflet-draw-draw-marker').click();

    cy.get('.leaflet-container')
      .trigger('mousemove', 90, 160)
      .trigger('click');

    cy.get('circle').should('have.length', 1);

    cy.get('a.leaflet-draw-edit-remove').click();-
    cy.wait(500);
    cy.get('circle')
      .trigger('click');

    cy.get('circle').should('have.length', 0);
  });
});
