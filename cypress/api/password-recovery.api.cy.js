
describe('Password Recovery', () => {

    it('should send password reset email with existing email', () => {
        const recoveryData = {
            email: 'fran.api.test@gmail.com',
        };
        console.log('Recovery Data:', recoveryData);
        cy.request({
            method: 'GET',
            url: 'index.php?route=account/forgotten&language=en-gb'
        }).then((pageResponse) => {
            const jQueryDocument = Cypress.$(pageResponse.body);
            const formAction = jQueryDocument
                .find('#form-forgotten')
                .attr('action');
            console.log('Form Action:', formAction);
            expect(formAction).to.exist;
            expect(formAction).to.include('account/forgotten.confirm');
            cy.request({
                method: 'POST',
                url: 'index.php?route=account/forgotten.confirm&language=en-gb',
                form: true,
                body: recoveryData
            }).then((response) => {
                console.log('HTTP status :', response.status);
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('redirect');
                expect(response.body.redirect).to.include('route=account/login');
            });
        });
    });

    it('should send password reset email with nonexistent email', () => {
        const recoveryData = {
            email: 'fran.api.*@gmail.com',
        };
        console.log('Recovery Data:', recoveryData);
        cy.request({
            method: 'GET',
            url: 'index.php?route=account/forgotten&language=en-gb'
        }).then((pageResponse) => {
            const jQueryDocument = Cypress.$(pageResponse.body);
            const formAction = jQueryDocument
                .find('#form-forgotten')
                .attr('action');
            console.log('Form Action:', formAction);
            expect(formAction).to.exist;
            expect(formAction).to.include('account/forgotten.confirm');
            cy.request({
                method: 'POST',
                url: 'index.php?route=account/forgotten.confirm&language=en-gb',
                form: true,
                body: recoveryData
            }).then((response) => {
                console.log('HTTP status :', response.status);
                console.log('response:', response);
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.include('not found in our records');
            });
        });
    });
    it.only('should send password reset email with empty email', () => {
        const recoveryData = {
            email: '',
        };
        console.log('Recovery Data:', recoveryData);
        cy.request({
            method: 'GET',
            url: 'index.php?route=account/forgotten&language=en-gb'
        }).then((pageResponse) => {
            const jQueryDocument = Cypress.$(pageResponse.body);
            const formAction = jQueryDocument
                .find('#form-forgotten')
                .attr('action');
            console.log('Form Action:', formAction);
            expect(formAction).to.exist;
            expect(formAction).to.include('account/forgotten.confirm');
            cy.request({
                method: 'POST',
                url: 'index.php?route=account/forgotten.confirm&language=en-gb',
                form: true,
                body: recoveryData
            }).then((response) => {
                console.log('HTTP status :', response.status);
                console.log('response:', response);
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('error');
                expect(response.body.error).to.include('not found in our records');
            });
        });
    });
});
