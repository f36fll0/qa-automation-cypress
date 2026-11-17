import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ShoppingCartPage from "../../pages/ShoppingCartPage";
import CatalogPage from "../../pages/CatalogPage";
import HeaderPage from "../../pages/HeaderPage";
import AccountPage from "../../pages/AccountPage";
import AddAddressBookPage from "../../pages/AddAddressBookPage";
import AddressBookEntriesPage from "../../pages/AddressBookEntriesPage";

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

    it('should display product in shopping cart', () => {
        const productName = 'MacBook';
        HeaderPage.openCartLogo();
        cy.url().should('include', 'route=common/home');
        CatalogPage.addToCartButton(productName);
        cy.get('#cart').should('contain.text', '1 item(s)');
        CatalogPage.cartSummaryButton();
        CatalogPage.viewQuantity(productName).invoke('text').then((data) => {
            const quantity = data.match(/\d+/)[0];
            console.log('the quantity is:', quantity);
            CatalogPage.viewPrice(productName).invoke('text').then((data) => {
                const price = data.trim();
                console.log('the price is:', price);
                CatalogPage.viewCart();
                cy.url().should('include', 'route=checkout/cart');
                ShoppingCartPage.product(productName);
                ShoppingCartPage.quantity(productName, quantity);
                ShoppingCartPage.totalPrice(productName, price);
            });
        });
    });

    it('should update product quantity in shopping cart', () => {
        const productName = 'MacBook';
        const updateQuantity = 2;
        HeaderPage.openCartLogo();
        cy.url().should('include', 'route=common/home');
        CatalogPage.addToCartButton(productName);
        cy.get('#cart').should('contain.text', '1 item(s)');
        CatalogPage.cartSummaryButton();
        CatalogPage.viewQuantity(productName).invoke('text').then((data) => {
            const quantity = data.match(/\d+/)[0];
            console.log('the quantity is:', quantity);
            CatalogPage.viewPrice(productName).invoke('text').then((data) => {
                const price = data.trim();
                console.log('the price is:', price);
                CatalogPage.viewCart();
                cy.url().should('include', 'route=checkout/cart');
                ShoppingCartPage.product(productName);
                ShoppingCartPage.quantity(productName, quantity);
                console.log('the quantity is:', quantity);
                ShoppingCartPage.totalPrice(productName, price);
                console.log('the price is:', price);
                ShoppingCartPage.updateQuantity(productName, updateQuantity);
                ShoppingCartPage.quantity(productName, updateQuantity);
                ShoppingCartPage.updatePrice(productName).should('not.contain.text', price).invoke('text').then((data) => {
                    const totalPrice = parseFloat(data.replace('$', '').replace(',', '').trim());
                    const unitPrice = parseFloat(price.replace('$', '').trim());
                    const expectedTotal = unitPrice * updateQuantity;
                    expect(totalPrice).to.equal(expectedTotal);
                });
            });
        });
    });

    it('should remove product from shopping cart', () => {
        const productName = 'MacBook';
        HeaderPage.openCartLogo();
        cy.url().should('include', 'route=common/home');
        CatalogPage.addToCartButton(productName);
        cy.get('#cart').should('contain.text', '1 item(s)');
        cy.get('#cart').invoke('text').then((text) => {
            cy.log(`Contenido del carrito: ${text}`);
        });
        cy.contains('a[href*="route=product/product"]', 'MacBook')
            .then(($link) => {
            cy.log('Enlace encontrado: ' + $link[0].outerHTML);
            cy.log('Contenedor padre: ' + $link.parent()[0].outerHTML);
        });
        CatalogPage.addToCartButton(productName);
        cy.get('.alert-success').should('be.visible');
        cy.get('.btn-close').click();
        cy.get('#cart').should('contain.text', '2 item(s)');
        CatalogPage.cartSummaryButton();
        CatalogPage.viewQuantity(productName).invoke('text').then((data) => {
            const quantity = data.match(/\d+/)[0];
            cy.log('the quantity is:', quantity);
            CatalogPage.viewPrice(productName).invoke('text').then((data) => {
                const price = data.trim();
                cy.log('the price is:', price);
                CatalogPage.viewCart();
                cy.url().should('include', 'route=checkout/cart');
                ShoppingCartPage.product(productName);
                ShoppingCartPage.quantity(productName, quantity);
                ShoppingCartPage.elements.totalPrice().should('be.visible').invoke('text').then((totalPrice) => {
                    const total = totalPrice.trim();
                    cy.log('Total del carrito: ' + total);
                    ShoppingCartPage.totalPrice(productName, total);
                });
                ShoppingCartPage.removeQuantity(productName);
                ShoppingCartPage.product(productName).should('not.exist');
            });
        });
    });
});
