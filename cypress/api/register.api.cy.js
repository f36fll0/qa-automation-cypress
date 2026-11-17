
describe('register', () => {

    it('register', () => {
        cy.fixture('user').then((data) => {
            const validUser = {
                ...data.validUser,
                email: `fran.api.register.${Date.now()}@gmail.com`
            };
            const registerData = {
                firstname: validUser.firstname,
                lastname: validUser.lastname,
                email: validUser.email,
                password: validUser.password,
                agree: 1
            };
            console.log('Register Data:', registerData);
            cy.request({
                method: 'GET',
                url: '/index.php?route=account/register'
            }).then((pageResponse) => {
                console.log(pageResponse.body);
                const jQueryDocument = Cypress.$(pageResponse.body);
                const formAction = jQueryDocument
                    .find('#form-register')
                    .attr('action');
                console.log('Form Action:', formAction);
                const registerUrl = new URL(formAction);
                const registerToken = registerUrl.searchParams.get('register_token');
                expect(registerToken).to.exist;
                console.log('Register Token:', registerToken);
                cy.request({
                    method: 'POST',
                    url: formAction,
                    form: true,
                    body: registerData,
                    log: true
                }).then((response) => {
                    console.log('Register Response:', response.body);
                    console.log('HTTP status:', response.status);
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('redirect');
                    expect(response.body.redirect).to.include('route=account/success');
                    expect(response.body.redirect).to.include('customer_token=');
                    expect(response.body).not.to.have.property('error');
                });
            });
        });
    });

    it('register with email duplicated', () => {
        cy.fixture('user').then((data) => {
            let validUser = {
                ...data.validUser,
                email: `fran.api.register.${Date.now()}@gmail.com`
            };
            let registerData = {
                firstname: validUser.firstname,
                lastname: validUser.lastname,
                email: validUser.email,
                password: validUser.password,
                agree: 1
            };
            let jQueryDocument;
            let formAction;
            let registerUrl;
            let registerToken;
            cy.request({
                method: 'GET',
                url: '/index.php?route=account/register'
            }).then((pageResponse) => {
                jQueryDocument = Cypress.$(pageResponse.body);
                formAction = jQueryDocument
                    .find('#form-register')
                    .attr('action');
                expect(formAction).to.exist;
                registerUrl = new URL(formAction);
                registerToken = registerUrl.searchParams.get('register_token');
                expect(registerToken).to.exist;
                cy.request({
                    method: 'POST',
                    url: formAction,
                    form: true,
                    body: registerData
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('redirect');
                    expect(response.body.redirect).to.include('route=account/success');
                    expect(response.body.redirect).to.include('customer_token=');
                    expect(response.body).not.to.have.property('error');
                });
            });
            cy.request('/index.php?route=account/logout');
            cy.request({
                method: 'GET',
                url: '/index.php?route=account/register'
            }).then((pageResponse) => {
                jQueryDocument = Cypress.$(pageResponse.body);
                formAction = jQueryDocument
                    .find('#form-register')
                    .attr('action');
                expect(formAction).to.exist;
                registerUrl = new URL(formAction);
                registerToken = registerUrl.searchParams.get('register_token');
                expect(registerToken).to.exist;
                cy.request({
                    method: 'POST',
                    url: formAction,
                    form: true,
                    body: registerData
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('error');
                    expect(response.body.error.warning).to.include('already registered');
                });
            });
        });
    });
    it('register with invalid email', () => {
        cy.fixture('user').then((data) => {
            const validUser = {
                ...data.validUser,
                email: `fran.api.register.${Date.now()}com`
            };
            const registerData = {
                firstname: validUser.firstname,
                lastname: validUser.lastname,
                email: validUser.email,
                password: validUser.password,
                agree: 1
            };
            console.log('Register Data:', registerData);
            cy.request({
                method: 'GET',
                url: '/index.php?route=account/register'
            }).then((pageResponse) => {
                console.log(pageResponse.body);
                const jQueryDocument = Cypress.$(pageResponse.body);
                const formAction = jQueryDocument
                    .find('#form-register')
                    .attr('action');
                console.log('Form Action:', formAction);
                const registerUrl = new URL(formAction);
                const registerToken = registerUrl.searchParams.get('register_token');
                expect(registerToken).to.exist;
                console.log('Register Token:', registerToken);
                cy.request({
                    method: 'POST',
                    url: formAction,
                    form: true,
                    body: registerData,
                    log: true
                }).then((response) => {
                    console.log('Register Response:', response.body);
                    console.log('HTTP status:', response.status);
                    expect(response.status).to.equal(200);
                    expect(response.body).to.have.property('error');
                    expect(response.body.error).to.have.property('email');
                });
            });
        });
    });
});
