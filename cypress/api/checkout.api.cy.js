import { addProductToCart } from '../support/helpers/cartHelper';

describe('Shipping Method API', () => {

    it('should complete shipping and payment method selection', () => {
        cy.fixture('user').then((data) => {
            const validUser = {
                password: data.validUser.password,
                email: 'fran.api.test@gmail.com'
            };
            return cy.request({
                method: 'GET',
                url: '/index.php?route=account/login'
            }).then((response) => {
                expect(response.status).to.eq(200);
                const html = Cypress.$(response.body);
                const action = html.find('#form-login').attr('action');
                const loginToken = new URL(action, Cypress.config('baseUrl'))
                    .searchParams.get('login_token');
                expect(loginToken).to.be.a('string').and.not.be.empty;
                return cy.request({
                    method: 'POST',
                    url: action,
                    form: true,
                    body: {
                        email: validUser.email,
                        password: validUser.password
                    }
                });
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('redirect');
                cy.log('Respuesta LOGIN:', JSON.stringify(response.body));
                return addProductToCart(40);
            }).then((response) => {
                cy.log('Respuesta CART:', JSON.stringify(response.body));
                return cy.request({
                    method: 'POST',
                    url: '/index.php?route=checkout/shipping_address.save&language=en-gb',
                    form: true,
                    body: {
                        firstname: 'Fran',
                        lastname: 'Test',
                        company: '',
                        address_1: 'Calle de prueba 10',
                        address_2: '',
                        city: 'Cordoba',
                        postcode: '14001',
                        country_id: 222,
                        zone_id: 3513,
                        custom_field: {}
                    }
                });
            }).then((response) => {
                expect(response.status).to.eq(200);
                cy.log('Respuesta ADDRESS:', JSON.stringify(response.body));
                expect(response.body).to.have.property('address_id');
                expect(response.body).to.have.property('success');
                return cy.request({
                    method: 'GET',
                    url: '/index.php?route=checkout/shipping_method.quote&language=en-gb'
                });
            }).then((response) => {
                expect(response.status).to.eq(200);
                cy.log('Shipping methods:', JSON.stringify(response.body));
                expect(response.body).to.have.property('shipping_methods');
                return cy.request({
                    method: 'POST',
                    url: '/index.php?route=checkout/shipping_method.save&language=en-gb',
                    form: true,
                    body: {
                        shipping_method: 'flat.flat'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    cy.log('Respuesta SHIPPING SAVE:', JSON.stringify(response.body));
                    expect(response.body).to.have.property('success');
                    return cy.request({
                        method: 'GET',
                        url: 'index.php?route=checkout/payment_method.getMethods&language=en-gb'
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property('payment_methods');
                        return cy.request({
                            method: 'POST',
                            url: 'index.php?route=checkout/payment_method.save&language=en-gb',
                            form: true,
                            body: {
                                payment_method: 'cod.cod'
                            }
                        }).then((response) => {
                            expect(response.status).to.eq(200);
                            expect(response.body).to.have.property('success');
                            expect(response.body.success).to.eq('Success: You have changed payment method!');
                            return cy.request({
                                method: 'POST',
                                url: 'index.php?route=checkout/payment_method.agree&language=en-gb',
                                form: true,
                                body: {
                                    agree: 1
                                }
                            }).then((response) => {
                                expect(response.status).to.eq(200);
                                expect(response.body).to.deep.equal([]);
                            });
                        });
                    });
                });
            });
        });
    });
});
