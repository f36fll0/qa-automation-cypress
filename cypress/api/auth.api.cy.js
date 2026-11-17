
describe('API - Customer Login', () => {

    it('should login with valid credentials', () => {
        cy.fixture('user').then((data) => {
            const validUser = {
                ...data.validUser,
                email: 'fran.api.test@gmail.com'
            };
            cy.request({
                method: 'GET',
                url: '/index.php?route=account/login'
            }).then((pageResponse) => {
                const $html = Cypress.$(pageResponse.body);
                const formAction = $html
                    .find('form')
                    .filter((i, form) => Cypress.$(form).find('[name="email"]').length > 0 &&
                    Cypress.$(form).find('[name="password"]').length > 0)
                    .first()
                    .attr('action');
                const loginUrl = new URL(formAction, Cypress.config('baseUrl'));
                cy.request({
                    method: 'POST',
                    url: `${loginUrl.pathname}${loginUrl.search}`,
                    form: true,
                    body: {
                        email: validUser.email,
                        password: validUser.password,
                        redirect: ''
                    }
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.headers['content-type'])
                        .to.include('application/json');
                    expect(response.body).to.have.property('redirect');
                    expect(response.body.redirect)
                        .to.include('route=account/account');
                    expect(response.body.redirect)
                        .to.include('customer_token=');
                });
            });
        });
    });

    it('should reject login with invalid password', () => {
        cy.fixture('user').then((data) => {
            const validUser = {
                ...data.validUser,
                email: 'fran.api.test.wrong@gmail.com'
            };
            cy.request({
                method: 'GET',
                url: '/index.php?route=account/login'
            }).then((pageResponse) => {
                const $html = Cypress.$(pageResponse.body);
                const formAction = $html
                    .find('form')
                    .filter((i, form) => Cypress.$(form).find('[name="email"]').length > 0 &&
                    Cypress.$(form).find('[name="password"]').length > 0)
                    .first()
                    .attr('action');
                const loginUrl = new URL(formAction, Cypress.config('baseUrl'));
                cy.request({
                    method: 'POST',
                    url: `${loginUrl.pathname}${loginUrl.search}`,
                    form: true,
                    body: {
                        email: validUser.email,
                        password: `${validUser.password}*`,
                        redirect: ''
                    }
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.headers['content-type'])
                        .to.include('application/json');
                    expect(response.body).to.have.property('error');
                    expect(response.body.error).to.have.property('warning');
                });
            });
        });
    });
    it.only('should reject login with invalid mail', () => {
        cy.fixture('user').then((data) => {
            const validUser = {
                ...data.validUser,
                email: 'fran.api.test.wrong@gmail.com'
            };
            cy.request({
                method: 'GET',
                url: '/index.php?route=account/login'
            }).then((pageResponse) => {
                const $html = Cypress.$(pageResponse.body);
                const formAction = $html
                    .find('form')
                    .filter((i, form) => Cypress.$(form).find('[name="email"]').length > 0 &&
                    Cypress.$(form).find('[name="password"]').length > 0)
                    .first()
                    .attr('action');
                const loginUrl = new URL(formAction, Cypress.config('baseUrl'));
                cy.request({
                    method: 'POST',
                    url: `${loginUrl.pathname}${loginUrl.search}`,
                    form: true,
                    body: {
                        email: `$(validUser.email)*`,
                        password: validUser.password,
                        redirect: ''
                    }
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.headers['content-type'])
                        .to.include('application/json');
                    expect(response.body).to.have.property('error');
                    expect(response.body.error).to.have.property('warning');
                });
            });
        });
    });
});
