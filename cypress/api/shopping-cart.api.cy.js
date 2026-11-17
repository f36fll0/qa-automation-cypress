
describe('Shopping Cart API', () => {

    it('should add a product to the shopping cart', () => {
        cy.request({
            method: 'GET',
            url: '/index.php?route=product/product&language=en-gb&product_id=40'
        }).then((response) => {
            cy.log('HTTP status', response.status);
            expect(response.status).to.eq(200);
            expect(response.body).to.include('form-product');
            const html = Cypress.$(response.body);
            const formProduct = html.find('#form-product');
            expect(formProduct.length).to.eq(1);
            const productInput = html.find('#input-product-id');
            expect(productInput.length).to.eq(1);
            expect(productInput.attr('name')).to.eq('product_id');
            const productId = productInput.val();
            cy.log('Product ID: ' + productId);
            const cartData = {
                product_id: productId,
                quantity: 1
            };
            console.log('Cart Data:', cartData);
            cy.request({
                method: 'POST',
                url: '/index.php?route=checkout/cart.add&language=en-gb',
                form: true,
                body: cartData
            }).then((response) => {
                console.log('HTTP status:', response.status);
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('success');
                expect(response.body.success).to.include('Success: You have added');
            });
        });
    });

    it('should edit a product to the shopping cart', () => {
        cy.request({
            method: 'GET',
            url: '/index.php?route=product/product&language=en-gb&product_id=40'
        }).then((response) => {
            cy.log('HTTP status', response.status);
            expect(response.status).to.eq(200);
            expect(response.body).to.include('form-product');
            const html = Cypress.$(response.body);
            const formProduct = html.find('#form-product');
            expect(formProduct.length).to.eq(1);
            const productInput = html.find('#input-product-id');
            expect(productInput.length).to.eq(1);
            expect(productInput.attr('name')).to.eq('product_id');
            const productId = productInput.val();
            cy.log('Product ID: ' + productId);
            const cartData = {
                product_id: productId,
                quantity: 1
            };
            console.log('Cart Data:', cartData);
            cy.request({
                method: 'POST',
                url: '/index.php?route=checkout/cart.add&language=en-gb',
                form: true,
                body: cartData
            }).then((response) => {
                console.log('HTTP status:', response.status);
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('success');
                expect(response.body.success).to.include('Success: You have added');
                cy.request({
                    method: 'GET',
                    url: '/index.php?route=checkout/cart&language=en-gb'
                }).then((response) => {
                    cy.log('HTTP status', response.status);
                    expect(response.status).to.eq(200);
                    const html = Cypress.$(response.body);
                    const keyInput = html.find('#output-cart input[name="key"]');
                    expect(keyInput.length).to.eq(1);
                    const key = keyInput.val();
                    const editData = {
                        key: key,
                        quantity: 2
                    };
                    cy.request({
                        method: 'POST',
                        url: '/index.php?route=checkout/cart.edit&language=en-gb',
                        form: true,
                        body: editData
                    }).then((response) => {
                        cy.log('HTTP status:', response.status);
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property('success');
                        expect(response.body.success).to.include('You have modified your shopping cart!');
                    }).then(() => {
                        cy.request({
                            method: 'GET',
                            url: '/index.php?route=checkout/cart&language=en-gb'
                        }).then((response) => {
                            cy.log('HTTP status', response.status);
                            expect(response.status).to.eq(200);
                            const html = Cypress.$(response.body);
                            const keyInput = html.find('#output-cart input[name="key"]');
                            expect(keyInput.length).to.eq(1);
                            const quantityInput = html.find('#output-cart input[name="quantity"]');
                            expect(quantityInput.val()).to.eq('2');
                        });
                    });
                });
            });
        });
    });
    it('remove a product to the shopping cart', () => {
        cy.request({
            method: 'GET',
            url: '/index.php?route=product/product&language=en-gb&product_id=40'
        }).then((response) => {
            cy.log('HTTP status', response.status);
            expect(response.status).to.eq(200);
            expect(response.body).to.include('form-product');
            const html = Cypress.$(response.body);
            const formProduct = html.find('#form-product');
            expect(formProduct.length).to.eq(1);
            const productInput = html.find('#input-product-id');
            expect(productInput.length).to.eq(1);
            expect(productInput.attr('name')).to.eq('product_id');
            const productId = productInput.val();
            cy.log('Product ID: ' + productId);
            const cartData = {
                product_id: productId,
                quantity: 1
            };
            console.log('Cart Data:', cartData);
            cy.request({
                method: 'POST',
                url: '/index.php?route=checkout/cart.add&language=en-gb',
                form: true,
                body: cartData
            }).then((response) => {
                console.log('HTTP status:', response.status);
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('success');
                expect(response.body.success).to.include('Success: You have added');
                cy.request({
                    method: 'GET',
                    url: '/index.php?route=checkout/cart&language=en-gb'
                }).then((response) => {
                    cy.log('HTTP status', response.status);
                    expect(response.status).to.eq(200);
                    const html = Cypress.$(response.body);
                    const keyInput = html.find('#output-cart input[name="key"]');
                    expect(keyInput.length).to.eq(1);
                    const key = keyInput.val();
                    cy.request({
                        method: 'GET',
                        url: 'index.php?route=checkout/cart.remove',
                        qs: {
                            language: 'en-gb',
                            key: key
                        }
                    });
                }).then((response) => {
                    cy.log('HTTP status:', response.status);
                    expect(response.status).to.eq(200);
                    cy.log('Respuesta REMOVE:', JSON.stringify(response.body));
                    console.log('Redirect:', response.body.redirect);
                }).then(() => {
                    cy.request({
                        method: 'GET',
                        url: '/index.php?route=checkout/cart&language=en-gb'
                    }).then((response) => {
                        cy.log('HTTP status', response.status);
                        expect(response.status).to.eq(200);
                        const html = Cypress.$(response.body);
                        const keyInput = html.find('#output-cart input[name="key"]');
                        expect(keyInput.length).to.eq(0);
                    });
                });
            });
        });
    });
});
