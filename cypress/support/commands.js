import RegisterPage from "../pages/RegisterPage";
Cypress.Commands.add('registerUser', (user) => {
    cy.log(`registerUser: ${JSON.stringify(user)}`);
    RegisterPage.fillRegisterForm(user);
    RegisterPage.clickSubscribe();
    RegisterPage.clickPrivacyPolicy();
    RegisterPage.clickContinue();
});
