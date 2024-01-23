describe('wallet-react-e2e', () => {
  beforeEach(() => cy.visit('/', { timeout: 120e3 }));

  it('should suggest scanning a QR code', () => {
    cy.contains('body', /QR code/i);
  });
});
