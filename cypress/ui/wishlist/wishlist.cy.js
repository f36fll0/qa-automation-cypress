import AccountPage from "../../pages/AccountPage";
import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import MyWishListPage from "../../pages/MyWishListPage";
import ProductCategoryPage from "../../pages/ProductCategoryPage";
import HeaderPage from "../../pages/HeaderPage";

describe('Check the wishlist ', () => {
    let user;
    let validUser;

    beforeEach(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
            user = {
                ...validUser,
                email: `fran${Date.now()}@gmail.com`,
            };

            RegisterPage.visit();
            cy.registerUser(user);
            AccountPage.clickLogout({ timeout: 10000 });
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
            ProductCategoryPage.visit();
            cy.url().should('include', 'route=product/category');
            ProductCategoryPage.clickTablets();
            ProductCategoryPage.clickWhiListTable();
            ProductCategoryPage.clickCameras();
            ProductCategoryPage.clickWhiListCamera();
            HeaderPage.clickMyAccount();
            AccountPage.clickWishList();
            cy.url().should('include', 'route=account/wishlist');
        });

    });

    it('Check that the products are added to the whilist page', () => {
        MyWishListPage.checkProduct1().should('be.visible');
        MyWishListPage.checkProduct2().should('be.visible');
    });

    it('Check that the products info are correctly displayed', () => {
        const product1Details = MyWishListPage.product1Details();
        const product2Details = MyWishListPage.product2Details();
        MyWishListPage.checkProduct1()
            .should('be.visible')
            .and('contain.text', product1Details.name)
            .and('contain.text', product1Details.model)
            .and('contain.text', product1Details.quantity)
            .and('contain.text', product1Details.price);
        MyWishListPage.checkProduct2()
            .should('be.visible')
            .and('contain.text', product2Details.name)
            .and('contain.text', product2Details.model)
            .and('contain.text', product2Details.price);
    });

    it('remove products from the whilist', () => {
        MyWishListPage.checkProduct1().should('be.visible');
        MyWishListPage.checkProduct2().should('be.visible');
        MyWishListPage.remove(1, 0);
        cy.get('.alert').should('contain', 'Success: You have removed an item from your wishlist');
        MyWishListPage.remove(0, 1);
        cy.get('.alert').should('contain', 'Success: You have removed an item from your wishlist');
    });

    it('add products to the cart', () => {
        MyWishListPage.checkProduct1().should('be.visible');
        MyWishListPage.checkProduct2().should('be.visible');
        MyWishListPage.addToCartButton(1, 0);
        cy.url().should('include', 'route=product/product');
        MyWishListPage.clickWhislistLabel();
        MyWishListPage.addToCartButton(0, 1);
        cy.get('.alert')
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                cy.log(text);
                expect(text.trim()).to.eq('Success: You have added Samsung Galaxy Tab 10.1 to your shopping cart!');
            });
    });

    it('click continue from the whilistpage', () => {
        MyWishListPage.checkProduct1().should('be.visible');
        MyWishListPage.checkProduct2().should('be.visible');
        MyWishListPage.continueButton();
        cy.url({ timeout: 10000 }).should('include', 'route=account/account');
    });
});
