describe('Zoom', () => {
  it('starts zoomed to shapes', () => {
    cy.visit('localhost:3000');

    cy.get('#large-poly').click();
    cy.get('img[src*="m&x=192&y=401&z=10"]');
  });
});
