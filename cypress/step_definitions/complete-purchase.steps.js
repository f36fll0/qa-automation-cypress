import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import CatalogPage from "../pages/CatalogPage";
import ShoppingCartPage from "../pages/ShoppingCartPage";
import CheckoutPage from "../pages/CheckoutPage";
import SuccesCheckoutPage from "../pages/SuccesCheckoutPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import AccountPage from "../pages/AccountPage";
import AddressBookEntriesPage from "../pages/AddressBookEntriesPage";
import AddAddressBookPage from "../pages/AddAddressBookPage";
import HeaderPage from "../pages/HeaderPage";
let user;
Given("the customer is logged in to OpenCart", () => {
    cy.fixture('user').then((userData) => {
        user = {
            ...userData.validUser,
            email: `fran${Date.now()}@gmail.com`
        };
        cy.fixture('addresses').then((addressData) => {
            const validAddress = addressData.addressBook;
            RegisterPage.visit();
            cy.registerUser(user);
            cy.url({ timeout: 10000 }).should("include", "/success");
            AccountPage.clickLogout();
            cy.url().should("include", "route=account/logout");
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should("include", "route=account/account");
            AccountPage.clickAddressBook();
            cy.url().should("include", "route=account/address");
            AddressBookEntriesPage.clickNewAddress();
            cy.url().should("include", "route=account/address.form");
            AddAddressBookPage.fieldAddressBookForm(validAddress);
            AccountPage.clickContinue();
            cy.url().should("include", "route=account/address");
            cy.contains("h1", "Address Book Entries")
                .should("be.visible");
        });
    });
});
When("the customer adds a product to the shopping cart", () => {
    const productName = "MacBook";
    cy.visit("/index.php?route=product/category&language=en-gb&path=20");
    CatalogPage.addToCartButton(productName);
});
When("verifies the product, quantity, and price", () => {
    const productName = "MacBook";
    cy.get("#cart", { timeout: 10000 })
        .should("contain.text", "1 item(s)");
    CatalogPage.cartSummaryButton();
    CatalogPage.viewQuantity(productName)
        .invoke("text")
        .then((data) => {
            const quantity = data.match(/\d+/)[0];
            CatalogPage.viewPrice(productName)
                .invoke("text")
                .then((data) => {
                    const price = data.trim();
                    CatalogPage.viewCart();
                    cy.url().should("include", "route=checkout/cart");
                    ShoppingCartPage.product(productName);
                    ShoppingCartPage.quantity(productName, quantity);
                    ShoppingCartPage.totalPrice(productName, price);
                });
        });
});
When("completes the shipping and payment details", () => {
    ShoppingCartPage.checkoutButton();
    cy.url().should("include", "route=checkout/checkout");
    CheckoutPage.chooseAddress();
    cy.contains('#alert .alert-success', 'Success: You have changed shipping address!').should('be.visible');
    cy.get('#alert .alert-success', { timeout: 10000 })
        .should('not.exist');
    CheckoutPage.shippingChoose().then((shippingSaved) => {
        if (shippingSaved) {
            CheckoutPage.payMethodChoose();
            cy.contains('.alert', 'Success: You have changed payment method!', { timeout: 15000 }).should('be.visible');
            cy.contains('.alert', 'Success: You have changed payment method!', { timeout: 10000 }).should('not.exist');
            CheckoutPage.confirmOrderButton()
                .should('be.enabled');
        }
        else {
            throw new Error('Checkout detenido: no se ha guardado el envío.');
        }
    });
});

When("confirms the order", () => {
    CheckoutPage.confirmOrderButton(true);
});

Then("the order confirmation should be displayed", () => {
    cy.url({ timeout: 10000 })
        .should("include", "route=checkout/success");

    SuccesCheckoutPage.checktittle();
});

Then("the order should appear in the order history", () => {
    SuccesCheckoutPage.continueButton();
    LoginPage.visit();
    LoginPage.login(user.email, user.password);
    cy.url().should("include", "route=account/account");
    HeaderPage.clickMyAccount();
    AccountPage.clickOrderHistory();
    cy.url().should('include', 'route=account/order');
    OrderHistoryPage.verifyPage();
    OrderHistoryPage.verifyOrdersExist();
    OrderHistoryPage.clickContinue();
    cy.url().should('include', 'route=account/account');
});
