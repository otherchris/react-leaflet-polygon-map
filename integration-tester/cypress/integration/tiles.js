describe('Tiles', () => {
  it('switches from street to satellite view', () => {
    cy.visit('localhost:3000');
    cy.get('button.maps-tiles').contains('Satellite View').click();
    cy.get('button.maps-tiles').contains('Street View').click();
    cy.get('button.maps-tiles').contains('Satellite View');
  });
});
