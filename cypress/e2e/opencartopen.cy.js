describe('OpenCart', () => {

    it('Carga la tienda', () => {
        cy.visit('/');
        cy.contains('Your Store');
    });
});
