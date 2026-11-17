export const addProductToCart = (productId, quantity = 1) => {
    return cy.request({
        method: 'POST',
        url: '/index.php?route=checkout/cart.add&language=en-gb',
        form: true,
        body: {
            product_id: productId,
            quantity: quantity
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success');
        expect(response.body.success).to.include('Success: You have added');
        return response;
    });
};
