describe('wallet-react-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should suggest scanning a QR code', () => {
    cy.contains('body', /QR code/i);
  });
});
