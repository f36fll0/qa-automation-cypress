import RegisterPage from "../pages/RegisterPage";
Cypress.Commands.add('registerUser', (user) => {
    RegisterPage.fillRegisterForm(user);
    RegisterPage.clickSubscribe();
    RegisterPage.clickPrivacyPolicy();
    RegisterPage.clickContinue();
});
