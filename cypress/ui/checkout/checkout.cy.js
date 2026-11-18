import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import AddAddressBookPage from "../../pages/AddAddressBookPage";
import AddressBookEntriesPage from "../../pages/AddressBookEntriesPage";
import CheckoutPage from "../../pages/CheckoutPage";
import CatalogPage from "../../pages/CatalogPage";
import AccountPage from "../../pages/AccountPage";
import HeaderPage from "../../pages/HeaderPage";
import ShoppingCartPage from "../../pages/ShoppingCartPage";

describe('shopping Cart', () => {
    let validUser;
    let validAddress;

    before(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
        });
        cy.fixture('addresses').then((data) => {
            validAddress = data.addressBook;
        });
    });

    beforeEach(() => {
        const user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        RegisterPage.visit();
        cy.registerUser(user);
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url().should('include', 'route=account/account');
        AccountPage.clickAddressBook();
        cy.url().should('include', 'route=account/address');
        AddressBookEntriesPage.clickNewAddress();
        cy.url().should('include', 'route=account/address.form');
        AddAddressBookPage.fieldAddressBookForm(validAddress);
        AccountPage.clickContinue();
        cy.url().should('include', 'route=account/address');
        cy.contains('h1', 'Address Book Entries').should('be.visible');
        cy.contains('td', 'Fran Lopez')
            .should('contain.text', 'LopezSA')
            .and('contain.text', 'Libertad 32')
            .and('contain.text', 'Cordoba, Córdoba 000001')
            .and('contain.text', 'Spain');
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url({ timeout: 10000 }).should('include', 'route=account/account');
    });

    it('check that the confirm button is unavailable until all the fields are selected ', () => {
        const productName = 'MacBook';
        HeaderPage.openCartLogo();
        cy.url().should('include', 'route=common/home');
        CatalogPage.addToCartButton(productName);
        cy.get('#cart', { timeout: 10000 }).should('contain.text', '1 item(s)');
        CatalogPage.cartSummaryButton();
        CatalogPage.checkout();
        cy.url().should('include', 'route=checkout/checkout');
        CheckoutPage.chooseAddress();
        CheckoutPage.confirmOrderButton().should('be.disabled');
        cy.contains('#alert .alert-success', 'Success: You have changed shipping address!').should('be.visible');
        cy.get('#alert .alert-success', { timeout:10000 })
            .should('not.exist');
        CheckoutPage.shippingChoose().then((shippingSaved) => {
            if (shippingSaved) {
                CheckoutPage.payMethodChoose();
                cy.contains('.alert', 'Success: You have changed payment method!', { timeout: 15000 }).should('be.visible');
                cy.contains('.alert', 'Success: You have changed payment method!', { timeout: 15000 }).should('not.exist').then(() => {
                    CheckoutPage.confirmOrderButton().should('be.enabled');
                    CheckoutPage.confirmOrderButton(true);
                });
                cy.url({ timeout: 15000 })
                    .should('include', 'route=checkout/success');
            }
            else {
                cy.log('Checkout detenido: no se ha guardado el envío.');
            }
        });
    });

    it('check validation errors when shipping address fields are empty', () => {
        const productName = 'MacBook';
        const address = {
            'firstName': '',
            'lastName': '',
            'address1': '',
            'city': '',
            'region': ' --- Please Select --- '
        };
        HeaderPage.openCartLogo();
        cy.url().should('include', 'route=common/home');
        CatalogPage.addToCartButton(productName);
        cy.get('#cart', { timeout: 10000 }).should('contain.text', '1 item(s)');
        CatalogPage.cartSummaryButton();
        CatalogPage.checkout();
        cy.url().should('include', 'route=checkout/checkout');
        CheckoutPage.addressNewRadio();
        CheckoutPage.addressFields().then(() => {
            CheckoutPage.buttonShippingAddress();
            CheckoutPage.emptyShippingAddressFields(address);
        });
    });
    it('should update checkout order details when modified from the product page', () => {
        const productName = 'MacBook';
        const updateQuantity = 2;
        let cartTotal;
        HeaderPage.openCartLogo();
        cy.url().should('include', 'route=common/home');
        CatalogPage.addToCartButton(productName);
        cy.get('#cart', { timeout: 10000 }).should('contain.text', '1 item(s)');
        CatalogPage.cartSummaryButton();
        CatalogPage.checkout();
        cy.url().should('include', 'route=checkout/checkout');
        CheckoutPage.viewTotalPrice().invoke('text').then((text) => {
            const price = text.trim().replace('$', '');
            cy.log('el precio es :', price);
        });
        HeaderPage.goToShoppingCart();
        cy.url().should('include', 'route=checkout/cart');
        ShoppingCartPage.updateQuantity(productName, updateQuantity);
        ShoppingCartPage.getTotalPrice().then((price) => {
            cartTotal = price.replace('$', '');
        });
        ShoppingCartPage.checkoutButton();
        cy.url().should('include', 'route=checkout/checkout');
        CheckoutPage.viewQuantity(productName, updateQuantity).invoke('text').then((text) => {
            const quantity = text.trim().replace('x', '');
            cy.log('la cantidad es :', quantity);
        });
        CheckoutPage.viewTotalPrice().invoke('text').then((text) => {
            const cart = text.trim().replace('$', '');
            expect(cart).have.to.equal(cartTotal);
            cy.log('el precio es :', cartTotal);
        });
    });
});
