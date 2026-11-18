import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import AddressBookEntriesPage from "../../pages/AddressBookEntriesPage";
import AddAddressBookPage from "../../pages/AddAddressBookPage";
import AccountPage from "../../pages/AccountPage";
import ProductCategoryPage from "../../pages/ProductCategoryPage";
import ProductPage from "../../pages/ProductPage";
import MyWishListPage from "../../pages/MyWishListPage";
import ShoppingCartPage from "../../pages/ShoppingCartPage";
import CheckoutPage from "../../pages/CheckoutPage";
import SuccesCheckoutPage from "../../pages/SuccesCheckoutPage";
import OrderHistoryPage from "../../pages/OrderHistoryPage";
import OrderInfoPage from "../../pages/OrderInfoPage";
import HeaderPage from "../../pages/HeaderPage";

describe('Check de order history page', () => {
    const addressBook = {
        firstname: 'Fran',
        lastname: 'Lopez',
        company: 'LopezSA',
        address: 'Libertad 32',
        address2: 'Odisea S/N',
        city: 'Cordoba',
        postcode: '000001',
        country: 'Spain',
        region: 'Córdoba'
    };
    let product;
    let user;

    before(() => {
        user = {
            firstname: addressBook.firstname,
            lastname: addressBook.lastname,
            email: `fran${Date.now()}@gmail.com`,
            password: 'Pas123'
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
        AddAddressBookPage.fieldAddressBookForm(addressBook);
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
        ProductCategoryPage.visit();
        cy.url({ timeout: 10000 }).should('include', 'route=product/category');
        ProductCategoryPage.clickCameras();
        ProductCategoryPage.clickWhiListCamera();
        cy.get('.alert')
            .should('be.visible')
            .invoke('text')
            .then(text => {
            cy.log(text);
        });
        MyWishListPage.clickWhislistLabel();
        cy.url().should('include', 'route=account/wishlist');
        cy.get('body').invoke('text').then(text => {
            cy.log(text);
        });
        MyWishListPage.addToCartButton(1, 0);
        cy.url().should('include', 'route=product/product');
        ProductPage.checkProduct().then((text) => { product = text; });
        ProductPage.selectModel('Blue');
        ProductPage.selectQuantity(1);
        ProductPage.addToCart();
        cy.get('.alert').should('be.visible');
        HeaderPage.goToShoppingCart();
        cy.url().should('include', 'route=checkout/cart');
        ShoppingCartPage.product('Canon EOS 5D');
        ShoppingCartPage.checkoutButton();
        cy.url().should('include', 'route=checkout/checkout');
        CheckoutPage.chooseAddress();
        cy.contains('#alert .alert-success', 'Success: You have changed shipping address!').should('be.visible');
        cy.get('#alert .alert-success', { timeout: 10000 }).should('not.exist');
        CheckoutPage.shippingChoose().then((shippingSaved) => {
            if (shippingSaved) {
                CheckoutPage.payMethodChoose();
                cy.contains('.alert', 'Success: You have changed payment method!', { timeout: 15000 }).should('be.visible');
                cy.contains('.alert', 'Success: You have changed payment method!', { timeout: 10000 }).should('not.exist').then(() => {
                    CheckoutPage.confirmOrderButton(true);
                });
                cy.url({ timeout: 15000 }).should('include', 'route=checkout/success');
            }
            else {
                cy.log('Checkout detenido: no se ha guardado el envío.');
            }
        });
        SuccesCheckoutPage.checktittle();
        SuccesCheckoutPage.continueButton();
        cy.url({ timeout: 10000 }).should('include', 'route=common/home');
    });

    beforeEach(() => {
        cy.session([user.email, user.password], () => {
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
        });
        cy.visit('http://localhost/index.php?route=common/home&language=en-gb');
    });

    it('check  the order history page', () => {
        HeaderPage.clickMyAccount();
        AccountPage.clickOrderHistory();
        cy.url().should('include', 'route=account/order');
        OrderHistoryPage.verifyPage();
        OrderHistoryPage.verifyOrdersExist();
        OrderHistoryPage.clickContinue();
        cy.url().should('include', 'route=account/account');
    });

    it('check the order history details ', () => {
        HeaderPage.clickMyAccount();
        AccountPage.clickOrderHistory();
        cy.url().should('include', 'route=account/order');
        OrderHistoryPage.verifyPage();
        OrderHistoryPage.verifyOrdersExist();
        OrderHistoryPage.getOrderId().then((orderId) => {
            cy.log(orderId);
            OrderHistoryPage.viewOrder(orderId);
            cy.url().should('include', 'route=account/order.info');
            OrderInfoPage.checkOrderId().then((orderIdDetail) => {
                expect(orderIdDetail).to.equal(orderId);
            });
            OrderInfoPage.checkAddress(addressBook.firstname, addressBook.address, addressBook.city, addressBook.postcode);
            OrderInfoPage.checkProduct(product);
        });
    });
});
